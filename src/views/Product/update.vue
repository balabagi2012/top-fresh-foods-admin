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
        <SimpleBanner tw="產品介紹" en="新增產品"/>
        <div class="content-body">
          <el-form ref="form" label-width="100px">
            <el-form-item label="名稱">
              <el-input v-model="product.name"></el-input>
            </el-form-item>
            <el-form-item label="品牌">
              <el-select v-model="product.brand" placeholder="請選擇產品之品牌" @click="selectBrand">
                <el-option
                  :label="brandInfo.name"
                  :value="brandInfo.name"
                  v-for="brandInfo in brand"
                  :key="brandInfo.name"
                  @click.native="changeBrand(brandInfo)"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="分類">
              <el-select v-model="product.category" placeholder="請選擇產品之分類">
                <el-option
                  :label="category.name"
                  :value="category.name"
                  v-for="category in selectBrand.category"
                  :key="category.name"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="推薦食譜">
              <el-tag
                :key="tag['.key']"
                v-for="(tag,index) in product.recommendRecipes"
                closable
                :disable-transitions="false"
                @close="removeRecommendRecipes(index)"
              >{{tag.name}}</el-tag>
              <el-select v-model="selectRecipesCategory" v-if="inputVisible" placeholder="請選擇食譜分類">
                <el-option
                  v-for="item in recipes_category"
                  :key="item['.key']"
                  :label="item.name"
                  :value="item.name"
                  @click.native="searchRecipes(item.name)"
                ></el-option>
              </el-select>
              <el-select
                v-model="selectRecipes"
                v-if="selectRecipesCategory"
                :loading="loading"
                placeholder="請選擇食譜"
              >
                <el-option
                  v-for="item in recipesOptions"
                  :key="item.name"
                  :label="item.name"
                  :value="item.name"
                  @click.native="addToRecommendRecipes(item)"
                ></el-option>
              </el-select>
              <el-button
                v-else
                class="button-new-tag"
                size="small"
                @click="inputVisible=true"
              >+ New Tag</el-button>
            </el-form-item>
            <el-form-item label="補充說明">
              <el-input v-model="product.intro"></el-input>
            </el-form-item>
            <el-form-item label="圖片">
              <img
                :src="product.img_url"
                alt
                style="width:auto;max-height:300px;display:block"
                v-if="product.img_url"
              >
              <input @change="uploadImg" type="file">
            </el-form-item>
            <el-form-item label="產品規格">
              <Editor ref="editor" v-model="product.spec"/>
            </el-form-item>
            <el-form-item label="內容物成分">
              <Editor ref="editor" v-model="product.content"/>
            </el-form-item>
            <el-form-item label="使用與保存">
              <Editor ref="editor" v-model="product.save"/>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="updateProduct">更新</el-button>
            </el-form-item>
          </el-form>
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
import Editor from "@/components/Editor.vue";
export default {
  name: "ProductAdd",
  components: {
    SideBar,
    NavBar,
    SimpleBanner,
    Editor
  },
  firestore() {
    return {
      brand: firestore.collection("brand"),
      product: firestore.collection("product").doc(this.$route.query.id),
      recipes_category: firestore.collection("recipes_category")
    };
  },
  data() {
    return {
      fullscreenLoading: false,
      loading: false,
      selectBrand: {
        category: []
      },
      selectRecipesCategory: "",
      selectRecipes: "",
      inputVisible: false,
      recipesOptions: []
    };
  },
  methods: {
    changeBrand(brand) {
      this.selectBrand = brand;
      this.$forceUpdate();
    },
    async searchRecipes(keyword) {
      this.loading = true;
      const querySnapshot = await firestore
        .collection("recipes")
        .where("category", "==", keyword)
        .get();
      querySnapshot.forEach(item => {
        if (
          this.product.recommendRecipes.findIndex(
            recipe => recipe.name == item.data().name
          ) < 0
        ) {
          this.recipesOptions.push(item.data());
        } else {
        }
      });
      this.loading = false;
    },
    removeRecommendRecipes(index) {
      this.product.recommendRecipes.splice(index, 1);
    },
    addToRecommendRecipes(item) {
      const recipe = { ...item };
      this.product.recommendRecipes.push(recipe);
      this.inputVisible = false;
      this.selectRecipes = "";
      this.selectRecipesCategory = "";
      this.recipesOptions = [];
    },
    async updateProduct() {
      this.fullscreenLoading = Loading.service({ fullscreen: true });
      const now = new Date();
      this.product.date = `${now.getFullYear()}-${now.getMonth() + 1}-${now
        .getDate()
        .toString()
        .padStart(2, "0")}`;
      if (this.imgData) {
        const refPath = `product/${new Date()}`;
        const ref = storage.ref(refPath);
        if (this.product.refPath) {
          try {
            await storage.ref(this.product.refPath).delete();
          } catch (error) {
            console.error("刪除舊有圖片時發生錯誤");
          }
        }
        this.product.refPath = refPath;
        const snapshot = await ref.put(this.imgData);
        this.product.img_url = await snapshot.ref.getDownloadURL();
      }
      await this.$firestore.product.set(this.product);
      this.fullscreenLoading.close();
      this.$router.push("/product/list");
    },
    uploadImg(e) {
      this.imgData = e.target.files[0];
      const reader = new FileReader();
      reader.onload = e => {
        this.product.img_url = e.target.result;
        this.$forceUpdate();
      };
      reader.readAsDataURL(e.target.files[0]);
    }
  }
};
</script>
