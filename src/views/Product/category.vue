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
        <SimpleBanner tw="產品介紹" en="分類管理"/>
        <div class="content-body" >
          <el-card class="box-card" v-for="(brandInfo,index) in brand" :key="index">
            <div slot="header" class="clearfix">
              <span>{{brandInfo.name}}</span>
              <el-button
                style="float: right; padding: 3px 0"
                type="text"
                @click="update(brandInfo)"
              >修改</el-button>
            </div>
            <el-form label-width="80px">
              <el-form-item label="名稱" v-for="category in brandInfo.category" :key="category.name">
                <div>
                  <el-input v-model="category.name">
                    <el-button slot="append" type="text" @click="remove(index,category.name)">刪除</el-button>
                  </el-input>
                </div>
              </el-form-item>
              <el-form-item label="名稱">
                <div>
                  <el-input v-model="form[brandInfo['.key']]">
                    <el-button slot="append" type="text" @click="add(index,brandInfo['.key'])">新增</el-button>
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
  name: "Product_category",
  components: {
    SideBar,
    NavBar,
    SimpleBanner
  },
  firestore() {
    return {
      brand: firestore.collection("brand")
    };
  },
  data() {
    return {
    fullscreenLoading: false,
      form: {}
    };
  },
  methods: {
    update(brandInfo) {
      this.$firestore.brand.doc(brandInfo['.key']).set(brandInfo);
    },
    remove(index, name) {
      const target = this.brand[index].category.findIndex((category) => category.name == name);
      this.brand[index].category.splice(target, 1);
      this.$forceUpdate()
    },
    add(index, key) {
      this.brand[index].category = this.brand[index].category
        ? this.brand[index].category
        : [];
      this.brand[index].category.push({ name: this.form[key] });
      this.form[key] = "";
    }
  }
};
</script>
