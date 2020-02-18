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
        <SimpleBanner tw="最新消息" en="更新消息"/>
        <div class="content-body">
          <el-form ref="form" label-width="80px">
            <el-form-item label="標題">
              <el-input v-model="news.title"></el-input>
            </el-form-item>
            <el-form-item label="補充說明">
              <el-input v-model="news.intro"></el-input>
            </el-form-item>
            <el-form-item label="圖片">
              <img
                :src="news.img_url"
                alt
                style="width:auto;max-height:300px;display:block"
                v-if="news.img_url"
              >
              <input @change="uploadImg" type="file">
            </el-form-item>
            <el-form-item label="分類">
              <el-select v-model="news.category" placeholder="請選擇消息之分類">
                <el-option
                  :label="categoryInfo.name"
                  :value="categoryInfo.name"
                  v-for="categoryInfo in category"
                  :key="categoryInfo.name"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="活動時間">
              <el-date-picker v-model="news.date_start" type="date" placeholder="開始日期"></el-date-picker>至
              <el-date-picker v-model="news.date_end" type="date" placeholder="結束日期"></el-date-picker>
            </el-form-item>
            <el-form-item label="內文">
              <Editor ref="editor" v-model="news.html"/>
            </el-form-item>

            <el-form-item>
              <el-button type="primary" @click="update">更新</el-button>
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
      news: firestore.collection("news").doc(this.$route.query.id),
      category: firestore.collection("news_category")
    };
  },
  data() {
    return {
      imgData: null,
      fullscreenLoading: false
    };
  },
  methods: {
    uploadImg(e) {
      this.imgData = e.target.files[0];
      const reader = new FileReader();
      this.fullscreenLoading = Loading.service({ fullscreen: true });
      reader.onload = e => {
        this.news.img_url = e.target.result;
        this.$forceUpdate();
        this.fullscreenLoading.close();
      };
      reader.readAsDataURL(e.target.files[0]);
    },
    async update() {
      this.fullscreenLoading = Loading.service({ fullscreen: true });
      const now = new Date();
      this.news.date = `${now.getFullYear()}-${now.getMonth() + 1}-${now
        .getDate()
        .toString()
        .padStart(2, "0")}`;
      if (this.imgData) {
        const refPath = `news/${now}`;
        const ref = storage.ref(refPath);
        const snapshot = await ref.put(this.imgData);
        this.news.img_url = await snapshot.ref.getDownloadURL();
        this.imgData = null;
        if (this.news.refPath) {
          try {
            await storage.ref(this.news.refPath).delete();
          } catch (error) {
            console.error("刪除既有圖片時發生錯誤");
          }
        }
        this.news.refPath = refPath;
      }
      await this.$firestore.news.set(this.news);
      this.fullscreenLoading.close();
      this.$router.push("/news/list");
    }
  }
};
</script>
