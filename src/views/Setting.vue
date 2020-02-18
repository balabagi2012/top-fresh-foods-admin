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
        <SimpleBanner tw="系統設定" en="System Setting"/>
        <div class="content-body">
          <el-card class="box-card">
            <div slot="header" class="clearfix">
              <span>社交媒體</span>
              <el-button style="float: right; padding: 3px 0" type="text" @click="updateSocial">修改</el-button>
            </div>
            <el-form ref="form" label-width="80px">
              <el-form-item label="Facebook">
                <el-input v-model="social.facebook"></el-input>
              </el-form-item>
              <el-form-item label="Instagram">
                <el-input v-model="social.instagram"></el-input>
              </el-form-item>
              <el-form-item label="Yam">
                <el-input v-model="social.yam"></el-input>
              </el-form-item>
              <el-form-item label="Youtube">
                <el-input v-model="social.youtube"></el-input>
              </el-form-item>
              <el-form-item label="痞客邦">
                <el-input v-model="social.pixnet"></el-input>
              </el-form-item>
            </el-form>
          </el-card>
          <el-card class="box-card">
            <div slot="header" class="clearfix">
              <span>Copyright</span>
              <el-button
                style="float: right; padding: 3px 0"
                type="text"
                @click="updateCopyright"
              >修改</el-button>
            </div>
            <el-form ref="form" label-width="80px">
              <el-form-item label="公司名稱">
                <el-input v-model="copyright.company"></el-input>
              </el-form-item>
            </el-form>
          </el-card>
          <el-card class="box-card">
            <div slot="header" class="clearfix">
              <span>Logo設定</span>
              <el-button style="float: right; padding: 3px 0" type="text" @click="updateLogo">修改</el-button>
            </div>
            <el-form ref="form" label-width="80px">
              <el-form-item label="Navbar">
                <img
                  :src="logo.navbar"
                  alt
                  style="width:auto;max-height:300px;display:block"
                  v-if="logo.navbar"
                >
                <input @change="uploadImg($event,0)" type="file">
              </el-form-item>
              <el-form-item label="Footer1">
                <img
                  :src="logo.footer1"
                  alt
                  style="width:auto;max-height:300px;display:block"
                  v-show="logo.footer1"
                >
                <input @change="uploadImg($event,1)" type="file">
              </el-form-item>
              <el-form-item label="Footer2">
                <img
                  :src="logo.footer2"
                  alt
                  style="width:auto;max-height:300px;display:block"
                  v-show="logo.footer2"
                >
                <input @change="uploadImg($event,2)" type="file">
              </el-form-item>
              <el-form-item label="Footer 3">
                <img
                  :src="logo.footer3"
                  alt
                  style="width:auto;max-height:300px;display:block"
                  v-show="logo.footer3"
                >
                <input @change="uploadImg($event,3)" type="file">
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
  name: "Setting",
  components: {
    SideBar,
    NavBar,
    SimpleBanner
  },
  firestore() {
    return {
      social: firestore.collection("setting").doc("social"),
      copyright: firestore.collection("setting").doc("copyright"),
      logo: firestore.collection("setting").doc("logo")
    };
  },
  methods: {
    uploadImg(e, index) {
      const reader = new FileReader();
      switch (index) {
        case 0:
          this.logo.navbar_img_data = e.target.files[0];
          reader.onload = e => {
            this.logo.navbar = e.target.result;
            this.$forceUpdate();
          };
          break;
        case 1:
          this.logo.footer1_img_data = e.target.files[0];
          reader.onload = e => {
            this.logo.footer1 = e.target.result;
            this.$forceUpdate();
          };
          break;
        case 2:
          this.logo.footer2_img_data = e.target.files[0];
          reader.onload = e => {
            this.logo.footer2 = e.target.result;
            this.$forceUpdate();
          };
          break;
        case 3:
          this.logo.footer3_img_data = e.target.files[0];
          reader.onload = e => {
            this.logo.footer3 = e.target.result;
            this.$forceUpdate();
          };
          break;
      }
      reader.readAsDataURL(e.target.files[0]);
    },
    updateSocial() {
      this.$firestore.social.set(this.social);
    },
    async updateLogo() {
      this.fullscreenLoading = Loading.service({ fullscreen: true });
      const vm = this;
      for (let i = 0; i < 4; i++) {
        if (this.logo[`${i == 0 ? "navbar" : "footer" + i}_img_data`]) {
          if (this.logo[`${i == 0 ? "navbar" : "footer" + i}_imgRefPath`]) {
            try {
              const refPath = this.logo[
                `${i == 0 ? "navbar" : "footer" + i}_imgRefPath`
              ];
              const ref = storage.ref(refPath);
              await ref.delete();
            } catch (error) {
              console.error("刪除既有logo時發生錯誤");
            }
          }
          const now = new Date();
          const refPath = `setting/logo/${i}/${now}`;
          const ref = storage.ref(refPath);
          this.logo[`${i == 0 ? "navbar" : "footer" + i}_imgRefPath`] = refPath;
          const snapshot = await ref.put(
            this.logo[`${i == 0 ? "navbar" : "footer" + i}_img_data`]
          );
          this.logo[
            `${i == 0 ? "navbar" : "footer" + i}`
          ] = await snapshot.ref.getDownloadURL();
          delete this.logo[`${i == 0 ? "navbar" : "footer" + i}_img_data`];
        }
      }
      await this.$firestore.logo.set(this.logo);
      this.fullscreenLoading.close();
    },
    updateCopyright() {
      this.$firestore.copyright.set(this.copyright);
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
}
</style>