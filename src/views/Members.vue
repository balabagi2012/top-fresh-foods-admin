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
        <SimpleBanner tw="會員管理" en="帳號列表"/>
        <div class="content-body" >
          <el-table :data="members" border style="width: 100%">
            <el-table-column prop="date" label="修改日期" width="100"></el-table-column>
            <el-table-column label="身分" width="100">
              <template slot-scope="scope">
                {{scope.row.isAdmin?'管理員':'一般用戶'}}
              </template>
            </el-table-column>
            <el-table-column prop="account" label="帳號"></el-table-column>
            <el-table-column prop="password" label="密碼"></el-table-column>
            <el-table-column label="操作" fixed="right" width="80">
              <template slot-scope="scope">
                <el-button type="danger" plain size="mini" @click="remove(scope.row)">刪除</el-button>
              </template>
            </el-table-column>
          </el-table>
          <el-form ref="form" :model="form" label-width="100px">
            <el-form-item label="帳號">
              <el-input v-model.trim="form.account"></el-input>
            </el-form-item>
            <el-form-item label="密碼">
              <el-input v-model.trim="form.password"></el-input>
            </el-form-item>
            <el-form-item label="是否為管理員">
              <el-switch v-model="form.isAdmin" active-color="#13ce66" inactive-color="#ff4949"></el-switch>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="add">新增</el-button>
            </el-form-item>
          </el-form>
        </div>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
import { firestore, storage } from "@/firebase";
// @ is an alias to /src
import { Loading } from 'element-ui';
import SideBar from "@/components/SideBar.vue";
import NavBar from "@/components/NavBar.vue";
import SimpleBanner from "@/components/SimpleBanner.vue";
export default {
  name: "Advertisement",
  components: {
    SideBar,
    NavBar,
    SimpleBanner
  },
  firestore() {
    return {
      members: firestore.collection("members")
    };
  },
  data() {
    return {
    fullscreenLoading: false,
      form: {
        isAdmin: false,
        account: null,
        password: null
      }
    };
  },
  methods: {
    add() {
      const now = new Date();
      this.form.date = `${now.getFullYear()}-${now.getMonth() + 1}-${now
        .getDate()
        .toString()
        .padStart(2, "0")}`;
      this.$firestore.members.add(this.form);
    },
    remove(member) {
      this.$firestore.members.doc(member[".key"]).delete();
    }
  }
};
</script>
