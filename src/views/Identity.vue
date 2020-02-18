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
        <SimpleBanner tw="首頁" en="身分管理"/>
        <div class="content-body">
          <el-table :data="identity" border style="width:100%">
            <el-table-column prop="date" label="修改日期" width="100"></el-table-column>
            <el-table-column prop="name" label="名稱"></el-table-column>
            <el-table-column prop="intro" label="補充說明"></el-table-column>
            <el-table-column label="圖片" width="80">
              <template slot-scope="scope">
                <a :href="scope.row.img_url" target="_blank">查看</a>
              </template>
            </el-table-column>
            <el-table-column label="連結" width="80">
              <template slot-scope="scope">
                <a :href="scope.row.link">查看</a>
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
            <el-form-item label="補充說明">
              <el-input v-model="form.intro"></el-input>
            </el-form-item>
            <el-form-item label="連結">
              <el-input v-model="form.link"></el-input>
            </el-form-item>
            <el-form-item label="圖片">
              <input @change="uploadImg" type="file">
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
  name: "Identity",
  components: {
    SideBar,
    NavBar,
    SimpleBanner
  },
  firestore() {
    return {
      identity: firestore.collection("identity")
    };
  },
  data() {
    return {
      fullscreenLoading: false,
      form: {},
      imgData: null
    };
  },
  methods: {
    async add() {
      this.fullscreenLoading = Loading.service({ fullscreen: true });
      const now = new Date();
      this.form.date = `${now.getFullYear()}-${now.getMonth() + 1}-${now
        .getDate()
        .toString()
        .padStart(2, "0")}`;
      const vm = this;
      if (this.imgData) {
        const refPath = `identity/${now}`;
        const ref = storage.ref(refPath);
        this.form.refPath = refPath;
        const snapshot = await ref.put(this.imgData);
        this.form.img_url = await snapshot.ref.getDownloadURL();
      }
      this.$firestore.identity.add(vm.form);
      this.form = {};
      this.fullscreenLoading.close();
    },
    uploadImg(e) {
      this.imgData = e.target.files[0];
    },
    async remove(identity) {
      const vm = this;
      if (identity.refPath) {
        try {
          const refPath = identity.refPath;
          const ref = storage.ref(refPath);
          await ref.delete();
        } catch (error) {
          console.error("刪除既有圖片時發生錯誤");
        }
      }
      this.$firestore.identity.doc(identity[".key"]).delete();
    }
  }
};
</script>
