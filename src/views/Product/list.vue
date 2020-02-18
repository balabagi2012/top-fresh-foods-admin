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
        <SimpleBanner tw="產品介紹" en="產品列表"/>
        <div class="content-body">
          <el-table :data="product" border style="width:100%">
            <el-table-column prop="date" label="修改日期" width="100"></el-table-column>
            <el-table-column prop="name" label="名稱"></el-table-column>
            <el-table-column prop="brand" label="品牌"></el-table-column>
            <el-table-column prop="category" label="分類"></el-table-column>
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
                    @click="$router.push({path:'/product/update',query:{id:scope.row['.key']}})"
                  >編輯</el-button>
                </span>
                <el-button type="danger" plain size="mini" @click="remove(scope.row)">刪除</el-button>
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
  name: "ProductList",
  components: {
    SideBar,
    NavBar,
    SimpleBanner
  },
  firestore() {
    return {
      product: firestore.collection("product")
    };
  },
  data() {
    return {
      fullscreenLoading: false
    };
  },
  methods: {
    async remove(product) {
      this.fullscreenLoading = Loading.service({ fullscreen: true });
      const vm = this;
      if (product.refPath) {
        try {
          const product = product.refPath;
          const ref = storage.ref(refPath);
          await ref.delete();
        } catch (error) {
          console.error("刪除舊有圖片時發生錯誤");
        }
      }
      await this.$firestore.product.doc(product[".key"]).delete();
      this.fullscreenLoading.close();
    }
  }
};
</script>
