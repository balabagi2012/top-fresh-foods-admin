<template>
  <el-container style="height:100%">
    <el-aside>
      <SideBar/>
    </el-aside>
    <el-container>
      <el-header style="padding:0" height="66px">
        <NavBar/>
      </el-header>
      <el-main style="padding:0;overflow-x:hidden">
        <SimpleBanner tw="關於我們" en="About us"/>
        <div class="content-body">
          <el-card class="box-card">
            <div slot="header" class="clearfix">
              <span>第一段</span>
              <el-button
                style="float: right; padding: 3px 0"
                type="text"
                @click="update(firstPart,'firstPart')"
              >修改</el-button>
            </div>
            <el-form ref="form" label-width="100px">
              <el-form-item label="標題">
                <el-input type="textarea" v-model="firstPart.title"></el-input>
              </el-form-item>
              <el-form-item label="補充說明">
                <el-input type="textarea" v-model="firstPart.intro"></el-input>
              </el-form-item>
            </el-form>
          </el-card>
          <el-card class="box-card">
            <div slot="header" class="clearfix">
              <span>第二段</span>
              <el-button
                style="float: right; padding: 3px 0"
                type="text"
                @click="update(secondPart,'secondPart')"
              >修改</el-button>
            </div>
            <el-form ref="form" label-width="100px">
              <el-form-item label="標題">
                <el-input type="textarea" v-model="secondPart.title"></el-input>
              </el-form-item>
              <el-form-item label="補充說明">
                <el-input type="textarea" v-model="secondPart.intro"></el-input>
              </el-form-item>
              <el-form-item label="圖片">
                <img
                  :src="secondPart.img_url"
                  alt
                  style="width:auto;height:300px"
                  v-if="secondPart.img_url"
                >
                <input @change="uploadImg($event,secondPart)" type="file">
              </el-form-item>
            </el-form>
          </el-card>
          <el-card class="box-card">
            <div slot="header" class="clearfix">
              <span>第三段</span>
              <el-button
                style="float: right; padding: 3px 0"
                type="text"
                @click="updateHope(thirdPart,'thirdPart')"
              >修改</el-button>
            </div>
            <el-form ref="form" label-width="100px">
              <div v-for="(hope,index) in thirdPart.hopes" :key="index">
                <el-form-item label="標題">
                  <el-input type="textarea" v-model="hope.title"></el-input>
                </el-form-item>
                <el-form-item label="補充說明">
                  <el-input type="textarea" v-model="hope.intro"></el-input>
                </el-form-item>
                <el-form-item label="圖片">
                  <img :src="hope.img_url" alt style="width:auto;height:300px" v-if="hope.img_url">
                  <input @change="uploadHopeImg($event,index)" type="file">
                </el-form-item>
              </div>
            </el-form>
          </el-card>
          <el-card class="box-card">
            <div slot="header" class="clearfix">
              <span>第四段</span>
              <el-button
                style="float: right; padding: 3px 0"
                type="text"
                @click="update(fourthPart,'fourthPart')"
              >修改</el-button>
            </div>
            <el-form ref="form" label-width="100px">
              <el-form-item label="標題">
                <el-input type="textarea" v-model="fourthPart.title"></el-input>
              </el-form-item>
              <el-form-item label="補充說明">
                <el-input type="textarea" v-model="fourthPart.intro"></el-input>
              </el-form-item>
              <el-form-item label="背景圖片">
                <img
                  :src="fourthPart.background_img_url"
                  alt
                  style="width:auto;height:300px"
                  v-if="fourthPart.background_img_url"
                >
                <input @change="uploadImg($event,fourthPart,'background_img_url')" type="file">
              </el-form-item>
              <el-form-item label="內文圖片">
                <img
                  :src="fourthPart.img_url"
                  alt
                  style="width:auto;height:300px"
                  v-if="fourthPart.img_url"
                >
                <input @change="uploadImg($event,fourthPart,'img_url')" type="file">
              </el-form-item>
            </el-form>
          </el-card>
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
  name: "About",
  components: {
    SideBar,
    NavBar,
    SimpleBanner
  },
  firestore() {
    return {
      about: firestore.collection("about"),
      firstPart: firestore.collection("about").doc("firstPart"),
      secondPart: firestore.collection("about").doc("secondPart"),
      thirdPart: firestore.collection("about").doc("thirdPart"),
      fourthPart: firestore.collection("about").doc("fourthPart")
    };
  },
  data() {
    return {
      fullscreenLoading: false
    };
  },
  methods: {
    uploadHopeImg(e, index, type = "img_url") {
      this.thirdPart.hopes[index][type + "_data"] = e.target.files[0];
      const reader = new FileReader();
      reader.onload = (e)=> {
        this.thirdPart.hopes[index][type] = e.target.result;
      };
      reader.readAsDataURL(e.target.files[0]);
    },
    uploadImg(e, source, type = "img_url") {
      source[type + "_data"] = e.target.files[0];
      const reader = new FileReader();
      reader.onload = function(e) {
        source[type] = e.target.result;
      };
      reader.readAsDataURL(e.target.files[0]);
    },
    async update(source, name) {
      this.fullscreenLoading = Loading.service({ fullscreen: true });
      const now = new Date();
      const vm = this;
      if (source.img_url_data) {
        if (source.imgRefPath) {
          try {
            const ref = storage.ref(source.imgRefPath);
            await ref.delete();
          } catch (error) {
            console.error("刪除既有圖片時發生錯誤");
          }
        }
        const refPath = `about/${name}/img_${now}`;
        const ref = storage.ref(refPath);
        source.imgRefPath = refPath;
        const snapshot = await ref.put(source.img_url_data);
        source.img_url = await snapshot.ref.getDownloadURL();
        delete source.img_url_data;
      }
      if (source.background_img_url_data) {
        if (source.backgroundImgRefPath) {
          try {
            const ref = storage.ref(source.backgroundImgRefPath);
            await ref.delete();
          } catch (error) {
            console.error("刪除既有圖片時發生錯誤");
          }
        }
        const refPath = `about/${name}/backgroundImg_${now}`;
        const ref = storage.ref(refPath);
        source.backgroundImgRefPath = refPath;
        const snapshot = await ref.put(source.background_img_url_data);
        source.background_img_url = await snapshot.ref.getDownloadURL();
        delete source.background_img_url_data;
      }
      await this.$firestore.about.doc(name).set(source);
      this.fullscreenLoading.close();
    },
    async updateHope(source) {
      this.fullscreenLoading = Loading.service({ fullscreen: true });
      const vm = this;
      for (let i = 0; i < 4; i++) {
        if (this.thirdPart.hopes[i].img_url_data) {
          const now = new Date();
          if (this.thirdPart.hopes[i].imgRefPath) {
            try {
              const ref = storage.ref(this.thirdPart.hopes[i].imgRefPath);
              await ref.delete();
            } catch (error) {
              console.error("刪除既有圖片時發生錯誤");
            }
          }
          const refPath = `about/thirdPart/hopes/${i}/img_${now}`;
          const ref = storage.ref(refPath);
          this.thirdPart.hopes[i].imgRefPath = refPath;
          const snapshot = await ref.put(this.thirdPart.hopes[i].img_url_data);
          this.thirdPart.hopes[i].img_url = await snapshot.ref.getDownloadURL();
          delete this.thirdPart.hopes[i].img_url_data;
        }
      }
      await this.$firestore.thirdPart.set(this.thirdPart);
      this.fullscreenLoading.close();
    }
  }
};
</script>
<style>
.text {
  font-size: 14px;
}
.item {
  margin-bottom: 18px;
}
.clearfix:before,
.clearfix:after {
  display: table;
  content: "";
}
.clearfix:after {
  clear: both;
}

.box-card {
  width: 100%;
  min-width: 800px;
  padding: 0 20px;
}
</style>