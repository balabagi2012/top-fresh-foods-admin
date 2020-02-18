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
        <SimpleBanner tw="精選食譜" en="食譜列表"/>
        <div class="content-body">
          <el-table :data="recipes" border style="width:100%">
            <el-table-column prop="date" label="修改日期" width="100"></el-table-column>
            <el-table-column prop="name" label="名稱"></el-table-column>
            <el-table-column prop="category" label="分類"></el-table-column>
            <el-table-column prop="count" label="份數"></el-table-column>
            <el-table-column prop="time" label="時間"></el-table-column>
            <el-table-column prop="intro" label="補充說明" min-width="300"></el-table-column>
            <el-table-column label="熱門食譜" width="80">
              <template slot-scope="scope">{{scope.row.isHot?'是':'否'}}</template>
            </el-table-column>
            <el-table-column label="操作" fixed="right" width="80">
              <template slot-scope="scope">
                <span>
                  <el-button
                    type="success"
                    plain
                    size="mini"
                    @click="$router.push({path:'/recipes/update',query:{id:scope.row['.key']}})"
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
      recipes: firestore.collection("recipes")
    };
  },
  methods: {
    async remove(recipe) {
      this.fullscreenLoading = Loading.service({ fullscreen: true });
      const vm = this;
      if (recipe.refPath) {
        try {
          const refPath = recipe.refPath;
          const ref = storage.ref(refPath);
          await ref.delete();
        } catch (error) {
          console.error("刪除既有圖片時發生錯誤");
        }
      }
      await this.$firestore.recipes.doc(recipe[".key"]).delete();
      this.fullscreenLoading.close();
    }
  }
};
</script>
