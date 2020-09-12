<template>
  <div id="app">
    <img src="./assets/logo.png">
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
      console.log(response.data)
    }).catch(response => {
      console.log('fail');
    })
  },
}
</script>

<style lang="scss">
@import "~boostrap/scss/boostrap";
</style>
