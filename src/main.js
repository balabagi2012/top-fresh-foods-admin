import Vue from 'vue'
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import App from './App.vue';
import router from './router'
import store from './store'
import './registerServiceWorker'
import '@/assets/css/app.scss'
import VueFirestore from 'vue-firestore'
import {auth} from './firebase'
auth.signInWithEmailAndPassword("services@topfreshfoods.com","srf16974788")
Vue.use(ElementUI);
Vue.config.productionTip = true
Vue.use(VueFirestore)
new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
