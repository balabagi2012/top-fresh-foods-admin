<template>
  <el-container style="height:100%">
    <el-aside>
      <SideBar/>
    </el-aside>
    <el-container>
      <el-header style="padding:0" height="66px">
        <NavBar/>
      </el-header>
      <el-main style="padding:0">
        <SimpleBanner tw="品牌管理" en="Brand Management"/>
        <div class="content-body">
          <el-table :data="brand" border style="width:100%">
            <el-table-column prop="date" label="修改日期" width="100"></el-table-column>
            <el-table-column prop="name" label="名稱"></el-table-column>
            <el-table-column prop="title" label="標題"></el-table-column>
            <el-table-column prop="intro" label="補充說明"></el-table-column>
            <el-table-column label="圖片" width="80">
              <template slot-scope="scope">
                <a :href="scope.row.img_url" target="_blank">查看</a>
              </template>
            </el-table-column>
            <el-table-column label="Logo" width="80">
              <template slot-scope="scope">
                <a :href="scope.row.logo">查看</a>
              </template>
            </el-table-column>
            <el-table-column label="操作" fixed="right" width="80">
              <template slot-scope="scope">
                <el-button type="danger" plain size="mini" @click="remove(scope.row)">刪除</el-button>
              </template>
            </el-table-column>
          </el-table>
          <el-form ref="form" :model="form" label-width="80px">
            <el-form-item label="名稱">
              <el-input v-model="form.name"></el-input>
            </el-form-item>
            <el-form-item label="標題">
              <el-input v-model="form.title"></el-input>
            </el-form-item>
            <el-form-item label="補充說明">
              <el-input v-model="form.intro"></el-input>
            </el-form-item>
            <el-form-item label="Logo">
              <img
                :src="form.logo"
                alt
                style="width:auto;max-height:300px;display:block"
                v-show="form.logo"
              >
              <input @change="uploadImg($event,'logo')" type="file">
            </el-form-item>
            <el-form-item label="圖片">
              <img
                :src="form.img_url"
                alt
                style="width:auto;max-height:300px;display:block"
                v-show="form.img_url"
              >
              <input @change="uploadImg($event,'img_url')" type="file">
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="add">新增</el-button>
            </el-form-item>
          </el-form>
        </div>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
// @ is an alias to /src
import { Loading } from "element-ui";
import { firestore, storage } from "@/firebase";
import SideBar from "@/components/SideBar.vue";
import NavBar from "@/components/NavBar.vue";
import SimpleBanner from "@/components/SimpleBanner.vue";
export default {
  name: "Brand",
  components: {
    SideBar,
    NavBar,
    SimpleBanner
  },
  firestore() {
    return {
      brand: firestore.collection("brand")
    };
  },
  data() {
    return {
      fullscreenLoading: false,
      form: {
        date: "2016-05-02",
        name: "廟口小吃",
        title: "充滿創意的口味，輕鬆滿足饕客的味蕾",
        intro: `獨家製程工法、嚴謹品質把關， 
讓廟口小吃與您一同創造餐飲商家新風味。`,
        logo: "",
        img_url: ""
      }
    };
  },
  methods: {
    async remove(brand) {
      if (brand.refPath) {
        try {
          const refPath = brand.refPath;
          const ref = storage.ref(refPath);
          await ref.delete();
        } catch (error) {
          console.error("刪除既有圖片時發生錯誤");
        }
      }
      await this.$firestore.brand.doc(brand[".key"]).delete();
    },
    uploadImg(e, name) {
      const reader = new FileReader();
      this.form[name + "_data"] = e.target.files[0];
      reader.onload = e => {
        this.form[name] = e.target.result;
        this.$forceUpdate();
      };
      reader.readAsDataURL(e.target.files[0]);
    },
    async add() {
      this.fullscreenLoading = Loading.service({ fullscreen: true });
      const now = new Date();
      this.form.date = `${now.getFullYear()}-${now.getMonth() + 1}-${now
        .getDate()
        .toString()
        .padStart(2, "0")}`;
      if (this.form.logo_data) {
        if (this.form.logo_refPath) {
          const ref = storage.ref(this.form.logo_refPath);
          await ref.delete();
        }
        const now = new Date();
        const refPath = `brand/${now}`;
        const ref = storage.ref(refPath);
        this.form.logo_refPath = refPath;
        const snapshot = await ref.put(this.form.logo_data);
        this.form.logo = await snapshot.ref.getDownloadURL();
        delete this.form.logo_data;
      }
      if (this.form.img_url_data) {
        if (this.form.img_refPath) {
          const ref = storage.ref(this.form.img_refPath);
          await ref.delete();
        }
        const now = new Date();
        const refPath = `brand/${now}`;
        const ref = storage.ref(refPath);
        this.form.img_refPath = refPath;
        const snapshot = await ref.put(this.form.img_url_data);
        this.form.img_url = await snapshot.ref.getDownloadURL();
        delete this.form.img_url_data;
      }
      await this.$firestore.brand.add(this.form);
      this.form = {};
      this.fullscreenLoading.close();
    }
  }
};
</script>
