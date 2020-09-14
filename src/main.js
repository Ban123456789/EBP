// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
// todo 每次下載完第三方套件時，都要 npm run dev 一次!!!
import Vue from 'vue'
import axios from 'axios'
import VueAxios from 'vue-axios'
// * 這裡因為不需要用到名字，所以直接用單引號來顯示來源即可(因為bootstrap有為webpack做優化，所以可以把來源直接輸入bootstrap就好 https://getbootstrap.com/docs/4.0/getting-started/webpack/)
// * 因為 bootstrap 很仰賴 jquery 的，所以要連同 jquery 一起載入
import 'bootstrap'

// * 通常上方都引入第三方套件，下方都引入自訂義的
import App from './App'
import router from './router'

Vue.config.productionTip = false;
Vue.use(VueAxios, axios);

axios.defaults.withCredentials = true;

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>'
});

// todo 導航守衛:若你直接更改網址路徑，而非登入換頁的話，他會幫你擋下來!
// * to:換頁得路徑，from:目前頁面，next:是一個方法，決定要不要換頁
router.beforeEach(function (to, from, next) {
  if (to.meta.requiresAuth) {
    console.log('這裡需要驗證');
      const api = `${process.env.APIPATH}/api/user/check`;
        // todo 這裡不能用 this.$router 因為我們執行的環境是在 router 下，而不是在 vue 的元件內，因此改用 axios
        axios.post(api).then( response => {
          console.log(response.data);
          if(response.data.success){
            next();
          }else{
            next({
              path:'/login'
            });
          };
        }).catch( response => {
          console.log('fail');
        });
  } else {
    next()
  }
})
