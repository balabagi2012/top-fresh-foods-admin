<template>
  <el-menu
    :default-active="$route.path"
    :unique-opened="true"
    :router="true"
    background-color="#545c64"
    text-color="#fff"
    style="height:100vh;position:fixed;top:0;left:0;width:300px"
    active-text-color="#3498db"
  >
    <el-submenu index="0">
      <template slot="title">
        <i class="el-icon-location"></i>
        <span>首頁管理</span>
      </template>
      <el-menu-item-group>
        <el-menu-item index="/advertisement">廣告管理</el-menu-item>
        <el-menu-item index="/identity">身分管理</el-menu-item>
      </el-menu-item-group>
    </el-submenu>
    <el-menu-item index="/about">
      <i class="el-icon-phone"></i>
      <span slot="title">關於我們</span>
    </el-menu-item>
    <el-submenu index="2">
      <template slot="title">
        <i class="el-icon-bell"></i>
        <span>最新消息</span>
      </template>
      <el-menu-item-group>
        <el-menu-item index="/news/list">消息列表</el-menu-item>
        <el-menu-item index="/news/add">新增消息</el-menu-item>
        <el-menu-item index="/news/category">分類管理</el-menu-item>
      </el-menu-item-group>
    </el-submenu>
    <el-submenu index="3">
      <template slot="title">
        <i class="el-icon-goods"></i>
        <span>產品介紹</span>
      </template>
      <el-menu-item-group>
        <el-menu-item index="/product/list">產品列表</el-menu-item>
        <el-menu-item index="/product/add">新增產品</el-menu-item>
        <el-menu-item index="/product/category">分類管理</el-menu-item>
      </el-menu-item-group>
    </el-submenu>
    <el-submenu index="4">
      <template slot="title">
        <i class="el-icon-document"></i>
        <span>精選食譜</span>
      </template>
      <el-menu-item-group>
        <el-menu-item index="/recipes/list">食譜列表</el-menu-item>
        <el-menu-item index="/recipes/add">新增食譜</el-menu-item>
        <el-menu-item index="/recipes/category">分類管理</el-menu-item>
      </el-menu-item-group>
    </el-submenu>
    <el-menu-item index="/quality">
      <i class="el-icon-check"></i>
      <span slot="title">安心食材</span>
    </el-menu-item>
    <el-menu-item index="/brand">
      <i class="el-icon-mobile-phone"></i>
      <span slot="title">品牌管理</span>
    </el-menu-item>
    <el-menu-item index="/setting">
      <i class="el-icon-setting"></i>
      <span slot="title">系統設定</span>
    </el-menu-item>
    <el-menu-item index="/members">
      <i class="el-icon-service"></i>
      <span slot="title">會員專區</span>
    </el-menu-item>
    <el-menu-item @click="logout">
      <span slot="title">登出</span>
    </el-menu-item>
  </el-menu>
</template>
<script>
export default {
  methods: {
    logout() {
      localStorage.removeItem("isAdmin");
      this.$router.push("/");
    }
  }
};
</script>

