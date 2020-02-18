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
        <SimpleBanner tw="最新消息" en="消息列表"/>
        <div class="content-body">
          <el-table :data="news" border style="width:100%">
            <el-table-column prop="date" label="修改日期" width="100"></el-table-column>
            <el-table-column prop="date_start" label="開始日期" width="100"></el-table-column>
            <el-table-column prop="date_end" label="結束日期" width="100"></el-table-column>
            <el-table-column prop="category" label="分類"></el-table-column>
            <el-table-column prop="title" label="標題"></el-table-column>
            <el-table-column prop="intro" label="補充說明" min-width="300"></el-table-column>
            <el-table-column label="圖片" width="80">
              <template slot-scope="scope">
                <a :href="scope.row.img_url" target="_blank">查看</a>
              </template>
            </el-table-column>
            <el-table-column label="操作" fixed="right" width="80">
              <template slot-scope="scope">
                <span>
                  <el-button
                    type="success"
                    plain
                    size="mini"
                    @click="$router.push({path:'/news/update',query:{id:scope.row['.key']}})"
                  >編輯</el-button>
                </span>
                <span>
                  <el-button type="danger" plain size="mini" @click="remove(scope.row)">刪除</el-button>
                </span>
              </template>
            </el-table-column>
          </el-table>
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
      news: firestore.collection("news")
    };
  },
  methods: {
    async remove(news) {
      this.fullscreenLoading = Loading.service({ fullscreen: true });
      const vm = this;
      if (news.refPath) {
        try {
          const refPath = news.refPath;
          const ref = storage.ref(refPath);
          await ref.delete();
        } catch (error) {
          console.error("刪除既有圖片時發生錯誤");
        }
      }
      await this.$firestore.news.doc(news[".key"]).delete();
      this.fullscreenLoading.close();
    }
  }
};
</script>
