<template>
<div>
    <div class="row mt-4">
        <div class="col-md-4 mb-4" v-for="item in getProducts" :key="item.id">
            <div class="card border-0 shadow-sm">
                <div style="height: 150px; background-size: cover; background-position: center"
                    :style="{backgroundImage:`url(${item.imageUrl})`}">
                </div>
                <div class="card-body">
                    <span class="badge badge-secondary float-right ml-2">{{ item.category }}</span>
                    <h5 class="card-title">
                        <a href="#" class="text-dark font-weight-bolder">{{ item.title }}</a>
                    </h5>
                    <p class="card-text">{{ item.content }}</p>
                    <div class="d-flex justify-content-between align-items-baseline">
                        <div class="h5 font-weight-bolder" v-if="!item.price">
                            <span v-if="item.origin_price">原價</span> {{ item.origin_price }} <span v-if="item.origin_price">元</span>
                        </div>
                        <del class="h6 font-weight-bolder" v-if="item.price">
                            原價 {{ item.origin_price }} 元
                        </del>
                        <div class="h5 font-weight-bolder" v-if="item.price">現在只要 {{item.price}} 元</div>
                    </div>
                </div>
                <div class="card-footer d-flex">
                    <button type="button" class="btn btn-outline-secondary btn-sm" @click="getDetail(item.id)">
                        <i class="fas fa-spinner fa-spin" v-if="isLoading === item.id"></i>
                        查看更多
                    </button>
                    <button type="button" class="btn btn-outline-danger btn-sm ml-auto" @click="addCart(item.id)">
                        <i class="fas fa-spinner fa-spin" v-if="isLoading === item.id"></i>
                        加到購物車
                    </button>
                </div>
            </div>
        </div>
    </div>
    
    <!-- 查看更多的 model -->
    <div class="modal fade" id="productModal" tabindex="-1" role="dialog"
      aria-labelledby="exampleModalLabel" aria-hidden="true">
      <div class="modal-dialog" role="document">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" id="exampleModalLabel">{{ detail.title }}</h5>
            <button type="button" class="close" data-dismiss="modal" aria-label="Close">
              <span aria-hidden="true">&times;</span>
            </button>
          </div>
          <div class="modal-body">
            <img :src="`${ detail.imageUrl }`" class="img-fluid" alt="">
            <blockquote class="blockquote mt-3">
              <p class="mb-0">{{ detail.content }}</p>
              <footer class="blockquote-footer text-right"></footer>
            </blockquote>
            <div class="d-flex justify-content-between align-items-baseline">
              <div class="h4" v-if="!detail.price">
                   <span v-if="detail.origin_price">原價</span> {{ detail.origin_price }} <span v-if="detail.origin_price">元</span>
                  </div>
              <del class="h6" v-if="detail.price">原價 {{ detail.origin_price }} 元</del>
              <div class="h4" v-if="detail.price">現在只要 {{ detail.price }} 元</div>
            </div>
            <select name="" class="form-control mt-3" v-model="detail.item">
              <option :value="item" v-for="item in 10" :key="item">
                選購 {{ item }} {{detail.unit}}
              </option>
            </select>
          </div>
          <div class="modal-footer">
            <div class="text-muted text-nowrap mr-3">
              小計 <strong v-if="detail.price">{{ detail.price }}</strong>
              <strong v-else>{{ detail.origin_price }}</strong> 元
            </div>
            <button type="button" class="btn btn-primary" @click="addCart(detail.id, detail.item)">
              <i class="fas fa-spinner fa-spin" v-if="isLoading === detail.id"></i>
              加到購物車
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- 購物車 model -->
    <div class="my-5 row justify-content-center">
      <div class="col-md-6">
          <table class="table">
            <thead>
                <th></th>
                <th>品名</th>
                <th>數量</th>
                <th>單價</th>
            </thead>
            <tbody>
            <tr v-for="item in cart.carts" :key="item.id">
                <td class="align-middle">
                    <button type="button" class="btn btn-outline-danger btn-sm" @click="delCart(item.id)">
                    <i class="far fa-trash-alt"></i>
                    </button>
                </td>
                <td class="align-middle">
                    {{ item.product.title }}
                    <!-- <div class="text-success" v-if="item.coupon">
                    已套用優惠券
                    </div> -->
                </td>
                <td class="align-middle">{{ item.qty }}/{{ item.product.unit }}</td>
                <td class="align-middle text-right">
                    <span v-if="!item.product.price">{{ item.product.origin_price }}</span>
                    <span v-else>{{ item.product.price }}</span>
                </td>
            </tr>
            </tbody>
            <tfoot>
            <tr>
                <td colspan="3" class="text-right">總計</td>
                <td class="text-right">{{ cart.total }}</td>
            </tr>
            <tr>
                <td colspan="3" class="text-right text-success">折扣價</td>
                <td class="text-right text-success">{{ cart.final_total }}</td>
            </tr>
            </tfoot>
        </table>

        <div class="input-group mb-3 input-group-sm">
            <input type="text" class="form-control" placeholder="請輸入優惠碼" v-model="discount">
            <div class="input-group-append">
                <button class="btn btn-outline-secondary" type="button" @click="getCoupon">
                套用優惠碼
                </button>
            </div>
        </div>
      </div>
    </div>
</div>
</template>

<script>
import $ from 'jquery'

export default {
    data() {
        return{
            getProducts: [],
            isLoading:'',
            detail: {},
            cart: {},
            discount: '',
        }
    },

    methods: {
        getData( page = 1) {
            const api = `${process.env.APIPATH}/api/${process.env.CUSTOMPATH}/products?page=${page}`;
            const vm = this;
                vm.$http.get(api).then( response => {
                    // console.log(response.data);
                    if(response.data.success){
                        vm.getProducts = response.data.products;
                        // console.log(vm.getProducts);
                    }
                });
        },
        getDetail(id) {
            const api = `${process.env.APIPATH}/api/${process.env.CUSTOMPATH}/product/${id}`;
            const vm = this;
                this.isLoading = id;
                vm.$http.get(api).then( response => {
                    // console.log(response.data);
                    if(response.data.success){
                        vm.detail = response.data.product;
                        console.log(vm.detail);
                        $('#productModal').modal('show');
                        this.isLoading = '';
                    }
                });
        },
        addCart(id, qty = 1) {
            const api = `${process.env.APIPATH}/api/${process.env.CUSTOMPATH}/cart`;
            const vm = this;
                this.isLoading = id;
                vm.$http.post(api, {data:{product_id:id, qty:qty}} ).then( response => {
                    console.log(response.data);
                    if(response.data.success){
                        vm.getCart();
                        this.isLoading = '';
                        $('#productModal').modal('hide');
                    }
                });
        },
        getCart() {
            const api = `${process.env.APIPATH}/api/${process.env.CUSTOMPATH}/cart`;
            const vm = this;
                vm.$http.get(api).then( response => {
                    vm.cart = response.data.data;
                    console.log(vm.cart);
                });
        },
        delCart(id) {
            const api = `${process.env.APIPATH}/api/${process.env.CUSTOMPATH}/cart/${id}`;
            const vm = this;
                vm.$http.delete(api).then( response => {
                    console.log(response.data);
                    if(response.data.success){
                        this.getCart();
                    }
                });
        },
        getCoupon() {
            const api = `${process.env.APIPATH}/api/${process.env.CUSTOMPATH}/coupon`;
            const vm = this;
            let parameter = {
                data: {
                    code: vm.discount
                }
            }
                vm.$http.post(api, parameter).then( response => {
                    console.log(response.data);
                });
        },
    },

    created() {
        this.getData();
        this.getCart();
    },
}
</script>

// todo 現在做到 抓到優惠券API 但還沒新增優惠券 所以不能用