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
        <SimpleBanner tw="精選食譜" en="新增食譜"/>
        <div class="content-body" >
          <el-form ref="form" :model="form" label-width="100px">
            <el-form-item label="名稱">
              <el-input v-model="form.name"></el-input>
            </el-form-item>
            <el-form-item label="分類">
              <el-select v-model="form.category" placeholder="請選擇產品之分類">
                <el-option
                  :label="categoryInfo.name"
                  :value="categoryInfo.name"
                  v-for="categoryInfo in category"
                  :key="categoryInfo.name"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="熱門食譜">
              <el-switch v-model="form.isHot" active-color="#13ce66"></el-switch>
            </el-form-item>
            <el-form-item label="補充說明">
              <el-input v-model="form.intro"></el-input>
            </el-form-item>
            <el-form-item label="圖片">
              <img
                :src="form.img_url"
                alt
                style="width:auto;max-height:300px;display:block"
                v-if="form.img_url"
              >
              <input @change="uploadImg" type="file">
            </el-form-item>
            <el-form-item label="份數(人)">
              <el-input v-model="form.count"></el-input>
            </el-form-item>
            <el-form-item label="時間(分)">
              <el-input v-model="form.time"></el-input>
            </el-form-item>
            <el-form-item label="食材配料">
              <el-table :data="form.preparations" border style="width:100%;">
                <el-table-column prop="type" label="種類"></el-table-column>
                <el-table-column prop="name" label="名稱"></el-table-column>
                <el-table-column prop="count" label="份數"></el-table-column>
                <el-table-column label="操作" fixed="right" width="80">
                  <template slot-scope="scope">
                    <el-button
                      type="danger"
                      plain
                      size="mini"
                      @click="removePreparation(scope.index)"
                    >刪除</el-button>
                  </template>
                </el-table-column>
              </el-table>
              <el-col :span="7">
                <el-input v-model="preparation.type" placeholder="食材種類"></el-input>
              </el-col>
              <el-col :span="7">
                <el-input v-model="preparation.name" placeholder="名稱"></el-input>
              </el-col>
              <el-col :span="10">
                <el-input v-model="preparation.count" placeholder="份數">
                  <el-button type="success" @click="addPreparation" slot="append">新增</el-button>
                </el-input>
              </el-col>
            </el-form-item>
            <el-form-item label="步驟">
              <el-collapse>
                <el-collapse-item
                  :title="String(index+1)"
                  :name="index+1"
                  v-for="(step,index) in form.steps"
                  :key="step.intro"
                >
                  <el-col :span="20">
                    <el-input v-model="step.intro" type="textarea"></el-input>
                  </el-col>
                  <el-col :span="4">
                    <el-button type="danger" @click="removeStep(index)">刪除</el-button>
                  </el-col>
                </el-collapse-item>
              </el-collapse>
              <el-input v-model="step.intro" placeholder="敘述">
                <el-button type="success" @click="addStep" slot="append">新增</el-button>
              </el-input>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="addRecipe">儲存</el-button>
            </el-form-item>
          </el-form>
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
import Editor from "@/components/Editor.vue";
export default {
  name: "RecipesAdd",
  components: {
    SideBar,
    NavBar,
    SimpleBanner,
    Editor
  },
  firestore() {
    return {
      category: firestore.collection("recipes_category"),
      recipes: firestore.collection("recipes")
    };
  },
  data() {
    return {
      fullscreenLoading: false,
      preparation: {
        type: "",
        name: "",
        count: null
      },
      imgData: null,
      form: {
        steps: [],
        recommendRecipes: [],
        preparations: []
      },
      step: {
        intro: ""
      }
    };
  },
  methods: {
    removeStep(index) {
      this.form.steps.splice(index, 1);
    },
    async addRecipe() {
      this.fullscreenLoading = Loading.service({ fullscreen: true });
      const now = new Date();
      this.form.date = `${now.getFullYear()}-${now.getMonth() + 1}-${now
        .getDate()
        .toString()
        .padStart(2, "0")}`;
      if (this.imgData) {
        const refPath = `recipes/${new Date()}`;
        const ref = storage.ref(refPath);
        this.form.refPath = refPath;
        const snapshot = await ref.put(this.imgData);
        this.form.img_url = await snapshot.ref.getDownloadURL();
      }
      await this.$firestore.recipes.add(this.form);
      this.fullscreenLoading.close();
      this.$router.push("/recipes/list");
    },
    addStep() {
      const step = { ...this.step };
      this.form.steps.push(step);
      this.step.intro = "";
    },
    addPreparation() {
      const preparation = { ...this.preparation };
      this.form.preparations.push(preparation);
      this.preparation = {
        type: "",
        name: "",
        count: null
      };
    },
    removePreparation(index) {
      this.form.preparations.splice(index, 1);
    },
    handleChange(v) {
      this.form.recommendRecipes.push(this.recipesSelect[1]);
      this.recipesSelect = [];
      this.inputVisible = false;
    },
    uploadImg(e) {
      this.imgData = e.target.files[0];
      const reader = new FileReader();
      reader.onload = e => {
        this.form.img_url = e.target.result;
        this.$forceUpdate();
      };
      reader.readAsDataURL(e.target.files[0]);
    }
  }
};
</script>
