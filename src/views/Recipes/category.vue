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
        <SimpleBanner tw="精選食譜" en="分類管理"/>
        <div class="content-body" >
          <el-card class="box-card">
            <div slot="header" class="clearfix">
              <span>分類列表</span>
            </div>
            <el-form label-width="80px">
              <el-form-item label="名稱" v-for="categoryInfo in category" :key="categoryInfo.name">
                <div>
                  <el-input v-model="categoryInfo.name">
                    <el-button slot="append" type="danger" @click="remove(categoryInfo['.key'])">刪除</el-button>
                  </el-input>
                </div>
              </el-form-item>
              <el-form-item label="名稱">
                <div>
                  <el-input v-model="form">
                    <el-button slot="append" @click="add()">新增</el-button>
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
import { firestore, storage } from "@/firebase";
import SideBar from "@/components/SideBar.vue";
import NavBar from "@/components/NavBar.vue";
import SimpleBanner from "@/components/SimpleBanner.vue";
export default {
  name: "Recipes_category",
  components: {
    SideBar,
    NavBar,
    SimpleBanner
  },
  firestore() {
    return {
      category: firestore.collection("recipes_category")
    };
  },
  data() {
    return {
      fullscreenLoading: false,
      form: ""
    };
  },
  methods: {
    async remove(key) {
      await this.$firestore.category.doc(key).delete();
    },
    async add() {
      await this.$firestore.category.add({ name: this.form });
      this.form = "";
    }
  }
};
</script>
