'use strict'
const merge = require('webpack-merge')
const prodEnv = require('./prod.env')

// todo 開發中的環境變數 (記得裡面都要雙引號在刮一次)(記得取完變數要在 npm run dev 一次)
module.exports = merge(prodEnv, {
  NODE_ENV: '"development"',
  APIPATH: '"https://vue-course-api.hexschool.io"',
  CUSTOMPATH: '"corgi"',
})
