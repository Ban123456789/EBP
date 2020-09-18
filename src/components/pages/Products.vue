<template>
    <div>
        <!-- loading 動圖 -->
        <loading :active.sync="isLoading">
        </loading>
        <!-- 內容開始 -->
        <div class="text-right mt-4">
                                            <!-- 這樣子的打法是直接將 model 直接打開，並不需要特定的條件 -->
            <!-- <button class="btn btn-primary" data-toggle="modal" data-target="#productModal">建立新產品</button> -->
                                            <!-- 這樣子打可以確定資料已經傳進來了，才開啟 model -->
            <button class="btn btn-primary" @click="openModel(true)">建立新產品</button>
        </div>
        <table class="table mt-4">
            <thead>
                <tr>
                    <th width="120">分類</th>
                    <th>產品名稱</th>
                    <th width="120">原價</th>
                    <th width="120">售價</th>
                    <th width="100">是否啟用</th>
                    <th width="75">編輯</th>
                    <th width="75">刪除</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="item in products" :key='item.id'>
                    <td>
                        {{item.category}}
                    </td>
                    <td>
                        {{item.title}}
                    </td>
                    <td class="text-right">
                        {{item.origin_price | currency}}
                    </td>
                    <td class="text-right">
                        {{item.price | currency}}
                    </td>
                    <td>
                        <span v-if="item.is_enabled === 1" class="text-success">啟用</span>
                        <span v-else>未啟用</span>
                    </td>
                    <td>
                        <button class="btn btn-outline-primary btn-sm" @click="openModel(false,item)">編輯</button>
                    </td>
                    <td>
                        <button class="btn btn-outline-danger btn-sm" @click="cancelModel(item.id)">刪除</button>
                    </td>
                </tr>
            </tbody>
        </table>
        <!-- 分頁導覽 -->
        <pagination :innerpage="pagination" @childChange="getData"></pagination>
        <!-- Modal (新增與編輯)-->
        <div class="modal fade" id="productModal" tabindex="-1" role="dialog"
                aria-labelledby="exampleModalLabel" aria-hidden="true">
        <div class="modal-dialog modal-lg" role="document">
            <div class="modal-content border-0">
            <div class="modal-header bg-dark text-white">
                <h5 class="modal-title" id="exampleModalLabel">
                <span>新增產品</span>
                </h5>
                <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                <span aria-hidden="true">&times;</span>
                </button>
            </div>
            <div class="modal-body">
                <div class="row">
                <div class="col-sm-4">
                    <div class="form-group">
                    <label for="image">輸入圖片網址</label>
                    <input type="text" class="form-control" id="image"
                        placeholder="請輸入圖片連結"
                        v-model="tempProduct.imageUrl">
                    </div>
                    <div class="form-group">
                    <label for="customFile">或 上傳圖片
                        <i class="fas fa-spinner fa-spin" v-if="loadingImg"></i>
                    </label>
                    <input type="file" id="customFile" class="form-control"
                        ref="files" @change="uploadFile">
                    </div>
                    <img :src="tempProduct.imageUrl"
                    class="img-fluid" alt="">
                </div>
                <div class="col-sm-8">
                    <div class="form-group">
                    <label for="title">標題</label>
                    <input type="text" class="form-control" id="title"
                        placeholder="請輸入標題" v-model="tempProduct.title">
                    </div>

                    <div class="form-row">
                    <div class="form-group col-md-6">
                        <label for="category">分類</label>
                        <input type="text" class="form-control" id="category"
                        placeholder="請輸入分類" v-model="tempProduct.category">
                    </div>
                    <div class="form-group col-md-6">
                        <label for="price">單位</label>
                        <input type="unit" class="form-control" id="unit"
                        placeholder="請輸入單位" v-model="tempProduct.unit">
                    </div>
                    </div>

                    <div class="form-row">
                    <div class="form-group col-md-6">
                    <label for="origin_price">原價</label>
                        <input type="number" class="form-control" id="origin_price"
                        placeholder="請輸入原價" v-model="tempProduct.origin_price">
                    </div>
                    <div class="form-group col-md-6">
                        <label for="price">售價</label>
                        <input type="number" class="form-control" id="price"
                        placeholder="請輸入售價" v-model="tempProduct.price">
                    </div>
                    </div>
                    <hr>

                    <div class="form-group">
                    <label for="description">產品描述</label>
                    <textarea type="text" class="form-control" id="description"
                        placeholder="請輸入產品描述" v-model="tempProduct.description"></textarea>
                    </div>
                    <div class="form-group">
                    <label for="content">說明內容</label>
                    <textarea type="text" class="form-control" id="content"
                        placeholder="請輸入產品說明內容" v-model="tempProduct.content"></textarea>
                    </div>
                    <div class="form-group">
                    <div class="form-check">
                        <input class="form-check-input" type="checkbox"
                        id="is_enabled"
                        v-model="tempProduct.is_enabled"
                        :true-value='1'
                        :false-value='0'>
                        <label class="form-check-label" for="is_enabled">
                        是否啟用
                        </label>
                    </div>
                    </div>
                </div>
                </div>
            </div>
            <div class="modal-footer">
                <button type="button" class="btn btn-outline-secondary" data-dismiss="modal">取消</button>
                <button type="button" class="btn btn-primary" @click="updateProduct">確認</button>
            </div>
            </div>
        </div>
        </div>
        <!-- Model 刪除 -->
        <div class="modal fade" id="delProductModal" tabindex="-1" role="dialog"
        aria-labelledby="exampleModalLabel" aria-hidden="true">
        <div class="modal-dialog" role="document">
            <div class="modal-content border-0">
            <div class="modal-header bg-danger text-white">
                <h5 class="modal-title" id="exampleModalLabel">
                <span>刪除產品</span>
                </h5>
                <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                <span aria-hidden="true">&times;</span>
                </button>
            </div>
            <div class="modal-body">
                是否刪除 <strong class="text-danger">{{ tempProduct.title }}</strong> 商品(刪除後將無法恢復)。
            </div>
            <div class="modal-footer">
                <button type="button" class="btn btn-outline-secondary" data-dismiss="modal">取消</button>
                <button type="button" class="btn btn-danger" @click="cancel">確認刪除</button>
            </div>
            </div>
        </div>
        </div>
    </div>
</template>

<script>
// todo 局部註冊
import $ from 'jquery';
// todo 全域註冊(在 main.js 註冊)，就可以所有 .vue 檔使用
// import jquery from 'jquery';
// 將 jQuey 以 $ 字號方式，掛載到 window 下
// window.$ = jquery;
import pagination from '../Pagination'

export default {
    data() {
        return{
            products: [],
            tempProduct: {},
            isNew: false,
            cancelId: '',
            isLoading: false,
            loadingImg: false,
            pagination: {},
        }
    },
    components:{
        pagination
    },
    methods: {
    // todo 抓取後端資料
        // * 這裡可以用 ES6 預設值的方式，讓他在沒有帶入參數時，預設帶1
        getData(page = 1) {
            // const api = 'https://vue-course-api.hexschool.io/api/corgi/products' //一般的寫法
            const api = `${process.env.APIPATH}/api/${process.env.CUSTOMPATH}/products?page=${page}`; //運用環境變數的寫法
            // todo 上方的 proces.env 在 webpack.dev.conf.js 內部的 plug 有預設好路徑
            const vm = this;

            this.isLoading = true;
            this.$http.get(api).then((response) => {
                vm.products = [];
                // console.log(response.data);
                // * 這裡如果直接用 vm.products.push(response.data.products) 的話，products 陣列內會再包一個陣列
                // * 所以有兩種方法
                // vm.products = response.data.products; //* 法一
                response.data.products.forEach( item => {//* 法二 
                    if(!item.origin_price){
                        item.origin_price = '0';  
                    }
                    if(!item.price){
                        item.price = '0';
                    }
                    vm.products.push(item); 
                });
                this.isLoading = false;
                console.log(response.data);
            // todo 將分頁導覽的資料存進去
                vm.pagination = response.data.pagination;
            }).catch(response => {
              console.log('fail');
            })
        },
    // todo 新增修改商品
        openModel(isNew, item) {
            if(isNew){
                this.tempProduct = {};
                this.isNew = true;
            }else{
                // *因為物件有傳參考特性，所以利用 Object.assin 來將要存入的物件先存在新的空物件上，再存入想存的位置
                this.tempProduct = Object.assign({},item);
                this.isNew = false;
            };
            $('#productModal').modal('show');
        },
        updateProduct() {
            let api = `${process.env.APIPATH}/api/${process.env.CUSTOMPATH}/admin/product`; //運用環境變數的寫法
            const vm = this;
            let httpMethod = 'post';

                if(vm.isNew === false){
                    api = `${process.env.APIPATH}/api/${process.env.CUSTOMPATH}/admin/product/${vm.tempProduct.id}`
                    httpMethod = 'put'; 
                }

            // todo 這邊要記得將 products 陣列清空，因為等等會在 getData 一次
                vm.products = [];
                this.$http[httpMethod](api, {data:vm.tempProduct}).then((response) => {
                    console.log(response.data);
                    if(response.data.success){
                        $('#productModal').modal('hide');
                        vm.getData();
                    }else{
                        alert("新增失敗!");
                        $('#productModal').modal('hide');
                    }
                }).catch(response => {
                console.log('fail');
                })
        },
    // todo 刪除商品
        cancelModel(item) {
            this.cancelId = item;
            $('#delProductModal').modal('show');
        },
        cancel() {
            const vm = this;
            let api = `${process.env.APIPATH}/api/${process.env.CUSTOMPATH}/admin/product/${this.cancelId}`;

            // todo 這邊要記得將 products 陣列清空，因為等等會在 getData 一次
                vm.products = [];
                vm.$http.delete(api).then( response => {
                    if(response.data.success === true){
                        vm.getData();
                        $('#delProductModal').modal('hide');
                    }
                });
        },
    // todo 上傳照片
        uploadFile() {
            // console.log(this.$refs.files.files);
            let uploadedFile = this.$refs.files.files[0];
            const vm = this;
            this.loadingImg = true;
            let formData = new FormData();
                formData.append('file-to-upload', uploadedFile);
            let url = `${process.env.APIPATH}/api/${process.env.CUSTOMPATH}/admin/upload`;
                vm.$http.post(url, formData, {
                    headers:{
                         'Content-Type':"multipart/form-data"
                    }
                }).then( response => {
                    console.log(response.data);
                    if(response.data.success){

                        // todo 下面兩行 vm.tempProduct.imageUrl(直接在 tempProduct 新增一個 imageUrl 屬性，然後將 response.data.imageUrl 存進去)
                        // * 但是用 console 去看會發現少了 (get imageUrl 和 set imgUrl) 這兩行，於是你在元件寫好雙向綁定也沒用
                        // vm.tempProduct.imageUrl = response.data.imageUrl;
                        // console.log(vm.tempProduct);

                        // todo 所以才將 get 和 set 強制寫入 [vm.$set(array, index, value)] 參考文件:https://ithelp.ithome.com.tw/articles/10206422
                        vm.$set(vm.tempProduct, 'imageUrl', response.data.imageUrl);
                        console.log(vm.tempProduct);

                        this.loadingImg = false;
                    }else{
                        vm.$bus.$emit('message:push', response.data.message, 'danger');
                    }
                });
        },
    },
    created() {
        this.getData();
    },
}
</script>

// todo 接下來開始做"編輯"