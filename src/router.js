import Vue from 'vue'
import Router from 'vue-router'
import Advertisement from './views/Advertisement.vue'
import Identity from './views/Identity.vue'
import About from './views/About.vue'
import Brand from './views/Brand.vue'
import Quality from './views/Quality.vue'
import News_list from './views/News/list.vue'
import News_add from './views/News/add.vue'
import News_update from './views/News/update.vue'
import News_category from './views/News/category.vue'
import Product_list from './views/Product/list.vue'
import Product_add from './views/Product/add.vue'
import Product_update from './views/Product/update.vue'
import Product_category from './views/Product/category.vue'
import Recipes_list from './views/Recipes/list.vue'
import Recipes_add from './views/Recipes/add.vue'
import Recipes_update from './views/Recipes/update.vue'
import Recipes_category from './views/Recipes/category.vue'
import Setting from './views/Setting.vue'
import Members from './views/Members.vue'

Vue.use(Router)
export const constantRouterMap = [
  {
    path: '*',
    redirect: '/login',
    hidden: true
  },
  {
    path: '/login',
    name: '登入頁面',
    hidden: true,
    component: resolve => require(['./views/Login.vue'], resolve)
  }
]
export const asyncRouterMap =[
  {
    path: '/advertisement',
    name: 'Advertisement',
    component: Advertisement
  },
  {
    path: '/identity',
    name: 'Identity',
    component: Identity
  },
  {
    path: '/about',
    name: 'About',
    component: About
  },
  {
    path: '/brand',
    name: 'Brand',
    component: Brand
  },
  {
    path: '/quality',
    name: 'Quality',
    component: Quality
  },
  {
    path: '/members',
    name: 'Members',
    component: Members
  },
  {
    path: '/news/add',
    name: 'News_add',
    component: News_add
  },
  {
    path: '/news/list',
    name: 'News_list',
    component: News_list
  },
  {
    path: '/news/category',
    name: 'News_category',
    component: News_category
  },
  {
    path: '/news/update',
    name: 'News_update',
    component: News_update
  },
  {
    path: '/recipes/add',
    name: 'Recipes_add',
    component: Recipes_add
  },
  {
    path: '/recipes/list',
    name: 'Recipes_list',
    component: Recipes_list
  },
  {
    path: '/recipes/update',
    name: 'Recipes_update',
    component: Recipes_update
  },
  {
    path: '/recipes/category',
    name: 'Recipes_category',
    component: Recipes_category
  },
      {
    path: '/product/add',
    name: 'Product_add',
    component: Product_add
  },
  {
    path: '/product/list',
    name: 'Product_list',
    component: Product_list
  },
  {
    path: '/product/update',
    name: 'Product_update',
    component: Product_update
  },
  {
    path: '/product/category',
    name: 'Product_category',
    component: Product_category
  },    
  {
    path: '/setting',
    name: 'Setting',
    component: Setting
  },    
]
export default new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: constantRouterMap})
