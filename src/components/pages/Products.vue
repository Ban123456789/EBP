<template>
    <div>
        <div class="text-right mt-4">
                                            <!-- 這樣子的打法是直接將 model 直接打開，並不需要特定的條件 -->
            <!-- <button class="btn btn-primary" data-toggle="modal" data-target="#productModal">建立新產品</button> -->
                                            <!-- 這樣子打可以確定資料已經傳進來了，才開啟 model -->
            <button class="btn btn-primary" @click="openModel">建立新產品</button>
        </div>
        <table class="table mt-4">
            <thead>
                <tr>
                    <th width="120">分類</th>
                    <th>產品名稱</th>
                    <th width="120">原價</th>
                    <th width="120">售價</th>
                    <th width="100">是否啟用</th>
                    <th width="80">編輯</th>
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
                        {{item.origin_price}}
                    </td>
                    <td class="text-right">
                        {{item.price}}
                    </td>
                    <td>
                        <span v-if="item.is_inable" class="text-success">啟用</span>
                        <span v-else>未啟用</span>
                    </td>
                    <td>
                        <button class="btn btn-outline-primary btn-sm">編輯</button>
                    </td>
                </tr>
            </tbody>
        </table>
        <!-- Modal -->
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
                        placeholder="請輸入圖片連結">
                    </div>
                    <div class="form-group">
                    <label for="customFile">或 上傳圖片
                        <i class="fas fa-spinner fa-spin"></i>
                    </label>
                    <input type="file" id="customFile" class="form-control"
                        ref="files">
                    </div>
                    <img img="https://images.unsplash.com/photo-1483985988355-763728e1935b?ixlib=rb-0.3.5&ixid=eyJhcHBfaWQiOjEyMDd9&s=828346ed697837ce808cae68d3ddc3cf&auto=format&fit=crop&w=1350&q=80"
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
                        placeholder="請輸入單位">
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
                        placeholder="請輸入產品描述"></textarea>
                    </div>
                    <div class="form-group">
                    <label for="content">說明內容</label>
                    <textarea type="text" class="form-control" id="content"
                        placeholder="請輸入產品說明內容"></textarea>
                    </div>
                    <div class="form-group">
                    <div class="form-check">
                        <input class="form-check-input" type="checkbox"
                        id="is_enabled"
                        v-model="tempProduct.is_enabled"
                        :true-value="1"
                        :false-value="0">
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
                <button type="button" class="btn btn-danger"
                >確認刪除</button>
            </div>
            </div>
        </div>
        </div>
    </div>
</template>

<script>
import $ from 'jquery';

export default {
    data() {
        return{
            products: [],
            tempProduct: {},
        }
    },
    methods: {
        getData() {
            // const api = 'https://vue-course-api.hexschool.io/api/corgi/products' //一般的寫法
            const api = `${process.env.APIPATH}/api/${process.env.CUSTOMPATH}/products`; //運用環境變數的寫法
            // todo 上方的 proces.env 在 webpack.dev.conf.js 內部的 plug 有預設好路徑
            const vm = this;

            this.$http.get(api).then((response) => {
                // console.log(response.data);
                // * 這裡如果用 push 的話，products 陣列內會再包一個陣列
                vm.products = response.data.products;
                console.log(vm.products);
            }).catch(response => {
              console.log('fail');
            })
        },
        openModel() {
            $('#productModal').modal('show')
        },
        updateProduct() {
            const api = `${process.env.APIPATH}/api/${process.env.CUSTOMPATH}/admin/product`; //運用環境變數的寫法
            const vm = this;

            this.$http.post(api,{data:vm.tempProduct}).then((response) => {
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
    },
    created() {
        this.getData();
    },
}
</script>

// todo 接下來開始做"編輯"