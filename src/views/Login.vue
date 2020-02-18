<template>
  <el-card class="box-card">
    <div slot="header" class="clearfix">
      <span>TopFreshFoods 管理後台</span>
      <el-button style="float: right; padding: 3px 0" type="text" @click="login">登入</el-button>
    </div>
    <el-input placeholder="請輸入帳號" v-model="account" clearable></el-input>
    <el-input placeholder="請輸入密碼" v-model="password"></el-input>
  </el-card>
</template>
<script>
import { asyncRouterMap } from "@/router.js";
import { firestore } from "@/firebase";
export default {
  data() {
    return {
      fullscreenLoading: false,
      account: "",
      password: ""
    };
  },
  mounted() {
    const isAdmin = localStorage.getItem("isAdmin");
    if (isAdmin == "true") {
      const routes = this.$route.matched;
      if (routes.findIndex(route => route.path === "/advertisement") < 0) {
        this.$router.addRoutes(asyncRouterMap);
      }
      this.$router.push("/advertisement");
    }
  },
  methods: {
    async login() {
      const query = firestore
        .collection("members")
        .where("account", "==", this.account)
        .where("password", "==", this.password)
        .where("isAdmin", "==", true);
      const result = (await query.get()).size;
      if (result > 0) {
        this.$notify({
          title: "登入成功",
          message: "即將跳轉頁面",
          type: "success"
        });
        localStorage.setItem("isAdmin", true);
        this.$router.addRoutes(asyncRouterMap);
        this.$router.push("/advertisement");
      } else {
        this.$notify.error({
          title: "登入失敗",
          message: "帳號密碼錯誤"
        });
      }
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
  width: 480px;
  margin: 0 auto;
}
</style>