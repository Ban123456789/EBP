<template>
  <div id="app">
    <router-view/>
  </div>
</template>

<script>
export default {
  name: 'App',
  created(){
    // const api = 'https://vue-course-api.hexschool.io/api/corgi/products' //一般的寫法
    const api = `${process.env.APIPATH}/api/${process.env.CUSTOMPATH}/products`; //運用環境變數的寫法
    // todo 上方的 proces.env 在 webpack.dev.conf.js 內部的 plug 有預設好路徑

    this.$http.get(api).then((response) => {
      console.log(response.data.products)
    }).catch(response => {
      console.log('fail');
    })
  },
}
</script>

<style lang="scss">
// 這是第一種直接 import 進來
// @import "~bootstrap/scss/bootstrap";
// 這是第二種(將這串引入 assets/all.scss 再將這筆檔案引入)
@import "./assets/all"; // 引入有關 css 的檔案都是需要在 import 前面加上 @
</style>
