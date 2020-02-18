<template>
  <el-container style="height:100%" >
    <el-aside>
      <SideBar/>
    </el-aside>
    <el-container>
      <el-header style="padding:0" height="66px">
        <NavBar/>
      </el-header>
      <el-main style="padding:0;overflow-x:hidden">
        <SimpleBanner tw="安心食材" en="Quality"/>
        <div class="content-body" >
          <el-card class="box-card">
            <div slot="header" class="clearfix">
              <span>影片區域</span>
              <el-button style="float: right; padding: 3px 0" type="text" @click="update">修改</el-button>
            </div>
            <el-form ref="form" label-width="80px">
              <el-form-item label="標題">
                <el-input type="textarea" v-model="quality.title"></el-input>
              </el-form-item>
              <el-form-item label="補充說明">
                <el-input type="textarea" v-model="quality.intro"></el-input>
              </el-form-item>
              <el-form-item label="影片連結" v-for="(video,index) in quality.videos" :key="index">
                <div>
                  <el-input v-model="video.url">
                    <el-button slot="append" type="danger" @click="removeVideo(index)">刪除</el-button>
                  </el-input>
                </div>
              </el-form-item>
              <el-form-item label="新增影片">
                <div>
                  <el-input v-model="videoUrl">
                    <el-button slot="append" @click="addVideo()">新增</el-button>
                  </el-input>
                </div>
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
import { Loading } from 'element-ui';
import { firestore } from "@/firebase";
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
      quality: firestore.collection("quality").doc("quality")
    };
  },
  data() {
    return {
      videoUrl:"",
      fullscreenLoading: false,
      quality: {
        title: "味蕾的滿足\n永遠是通往幸福的捷徑",
        intro:
          "使用者用的安心、食用者吃的健康，一直是小磨坊的品牌責任與自我要求，\n透過餐桌上的美食料理，拉近家人間的情感，這是小磨坊希望與您共同追求的幸福人生。",
        video_url: "adsad"
      }
    };
  },
  methods: {
    removeVideo(index){
      this.quality.videos.splice(index,1)
      this.$forceUpdate()
    },
    addVideo(){
      this.quality.videos=this.quality.videos?this.quality.videos:[]
      this.quality.videos.push({url:this.videoUrl})
      this.videoUrl=""
    },
    async update() {
      this.fullscreenLoading = Loading.service({ fullscreen: true });
      await this.$firestore.quality.set(this.quality);
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
}
</style>