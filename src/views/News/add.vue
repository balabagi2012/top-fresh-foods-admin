<template>
  <el-container style="height:100%" >
    <el-aside>
      <SideBar/>
    </el-aside>
    <el-container>
      <el-header style="padding:0" height="66px">
        <NavBar/>
      </el-header>
      <el-main style="padding:0">
        <SimpleBanner tw="最新消息" en="新增消息"/>
        <div class="content-body" >
          <el-form ref="form" :model="form" label-width="80px">
            <el-form-item label="標題">
              <el-input v-model="form.title"></el-input>
            </el-form-item>
            <el-form-item label="補充說明">
              <el-input v-model="form.intro"></el-input>
            </el-form-item>
            <el-form-item label="圖片">
              <img
                :src="form.img_url"
                alt
                style="width:auto;max-height:300px;display:block"
                v-if="form.img_url"
              >
              <input type="file" @change="uploadImg">
            </el-form-item>
            <el-form-item label="分類">
              <el-select v-model="form.category" placeholder="請選擇消息之分類">
                <el-option
                  :label="categoryInfo.name"
                  :value="categoryInfo.name"
                  v-for="categoryInfo in category"
                  :key="categoryInfo.name"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="活動時間">
              <el-date-picker v-model="form.date_start" type="date" placeholder="開始日期"></el-date-picker>至
              <el-date-picker v-model="form.date_end" type="date" placeholder="結束日期"></el-date-picker>
            </el-form-item>
            <el-form-item label="內文">
              <Editor ref="editor" v-model="form.html"/>
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
import { Loading } from 'element-ui';
import { firestore, storage } from "@/firebase";
import SideBar from "@/components/SideBar.vue";
import NavBar from "@/components/NavBar.vue";
import SimpleBanner from "@/components/SimpleBanner.vue";
import Editor from "@/components/Editor.vue";
export default {
  name: "Brand",
  components: {
    SideBar,
    NavBar,
    SimpleBanner,
    Editor
  },
  firestore() {
    return {
      news: firestore.collection("news"),
      category: firestore.collection("news_category")
    };
  },
  data() {
    return {
      fullscreenLoading: false,
      imgData: null,
      form: {
        title: "",
        intro: "",
        date_start: `${new Date().getFullYear()}-${new Date().getMonth() +
          1}-${new Date()
          .getDate()
          .toString()
          .padStart(2, "0")}`,
        date_end: `${new Date().getFullYear()}-${new Date().getMonth() +
          1}-${new Date()
          .getDate()
          .toString()
          .padStart(2, "0")}`,
        html: ""
      }
    };
  },
  methods: {
    uploadImg(e) {
      this.imgData = e.target.files[0];
      const reader = new FileReader();
      reader.onload = e => {
        this.form.img_url = e.target.result;
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
      if (this.imgData) {
        const refPath = `news/${new Date()}`;
        const ref = storage.ref(refPath);
        this.form.refPath = refPath;
        const snapshot = await ref.put(this.imgData);
        this.form.img_url = await snapshot.ref.getDownloadURL();
      }
      await this.$firestore.news.add(this.form);
      this.fullscreenLoading.close();
      this.$router.push("/news/list");
    }
  }
};
</script>
