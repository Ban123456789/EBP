<template>
  <div>
    <!-- loading 動圖 -->
        <loading :active.sync="isLoading">
        </loading>
    <!-- 正式內容 -->
    <div class="text-right mt-4">
      <button class="btn btn-primary" @click="openAddCoupon(true)">新增優惠券</button>
    </div>
    <table class="table table-striped mt-4">
      <thead>
        <tr>
          <th scope="col" width="20">#</th>
          <th scope="col" width="120">優惠券</th>
          <th scope="col" width="120">有效日期</th>
          <th scope="col" width="100">啟用</th>
          <th scope="col" width="40">修改</th>
          <th scope="col" width="40">刪除</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for=" (item,index) in couponData" :key="item.id">
          <th scope="row">{{ index+1 }}</th>
          <td>{{ item.title }}</td>
          <td>{{ item.due_date }}</td>
          <td>
            <span v-if="item.is_enabled === 1" class="text-success">啟用</span>
            <span v-else>未啟用</span>
          </td>
          <td>
            <button class="btn btn-outline-primary btn-sm" @click="openAddCoupon(false, item)">編輯</button>
          </td>
          <td>
            <button class="btn btn-outline-danger btn-sm" @click="del(item.id)">刪除</button>
          </td>
        </tr>
      </tbody>
    </table>

    <!-- 新增與編輯的 model -->
    <div class="modal fade" id="couponModal" tabindex="-1" role="dialog"
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
                  <div class="col-sm-8">
                      <div class="form-group">
                        <label for="title">優惠券名稱</label>
                        <input type="text" class="form-control" id="title"
                            placeholder="請輸入優惠券名稱" v-model="data.title">
                      </div>

                      <div class="form-row">
                        <div class="form-group col-md-6">
                            <label for="percent">折價趴數</label>
                            <input type="text" class="form-control" id="percent"
                            placeholder="請輸入趴數" v-model="data.percent">
                        </div>
                      <div class="form-group col-md-6">
                        <label for="date">到期日</label>
                        <input type="unit" class="form-control" id="date"
                        placeholder="請輸入日期" v-model="data.due_date">
                      </div>
                      </div>

                      <div class="form-group">
                        <label for="serialNumber">優惠券序號</label>
                        <input type="text" class="form-control" id="serialNumber"
                            placeholder="請輸入優惠券序號" v-model="data.code">
                      </div>

                      <hr>

                      <div class="form-group">
                        <div class="form-check">
                            <input class="form-check-input" type="checkbox"
                            id="is_enabled" v-model="data.is_enabled"
                            :true-value="1"
                            :false-value="0">
                            <label class="form-check-label" for="is_enabled">
                            是否啟用優惠券
                            </label>
                        </div>
                      </div>
                  </div>
                </div>
            </div>
            <div class="modal-footer">
                <button type="button" class="btn btn-outline-secondary" data-dismiss="modal">取消</button>
                <button type="button" class="btn btn-primary" v-if="isNew" @click="addCoupon">確認</button>
                <button type="button" class="btn btn-primary" v-else @click="editCoupon(data.id)">123</button>
            </div>
            </div>
        </div>
    </div>

    <!-- Model 刪除 -->
        <div class="modal fade" id="delCouponModal" tabindex="-1" role="dialog"
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
                  是否刪除 <strong class="text-danger">{{ data.title }}</strong> 優惠券(刪除後將無法恢復)。
              </div>
              <div class="modal-footer">
                  <button type="button" class="btn btn-outline-secondary" data-dismiss="modal">取消</button>
                  <button type="button" class="btn btn-danger" @click="delCoupon">確認刪除</button>
              </div>
              </div>
          </div>
        </div>
  </div>
</template>

<script>
import $ from 'jquery'

export default {
  name: 'Coupon',
  data () {
    return {
      couponData: [],
      data: {
          title: '',
          is_enabled: '',
          percent: '',
          due_date: '',
          code: ''
      },
      isNew: true,
      isLoading: false,
      delId: '',
    }
  },

  methods: {
    openAddCoupon(isNew, item) {
      if(isNew){
        this.data = {};
        this.isNew = true;
        $('#couponModal').modal('show');
      }else{
        this.data = Object.assign({},item);
        this.isNew = false;
        $('#couponModal').modal('show');
      }
    },
    getCoupon(page = 1) {
      const api = `${process.env.APIPATH}/api/${process.env.CUSTOMPATH}/admin/coupons?page=${page}`;
      const vm = this;

        vm.isLoading = true;
        vm.$http.get(api).then( response => {
          console.log(response.data);
          if(response.data.success){
            vm.couponData = response.data.coupons;
            console.log(vm.couponData);
            vm.isLoading = false;
          }
        });
    },
    addCoupon() {
      const api = `${process.env.APIPATH}/api/${process.env.CUSTOMPATH}/admin/coupon`;
      const vm = this;

        vm.couponData = [];
        vm.isLoading = true;
        vm.$http.post(api, {data:vm.data}).then( response => {
          console.log(response.data);
          if(response.data.success){
            vm.getCoupon();
            $('#couponModal').modal('hide');
            vm.isLoading = false;
          }
        });
    },
    editCoupon(id) {
      const api = `${process.env.APIPATH}/api/${process.env.CUSTOMPATH}/admin/coupon/coupon_${id}`;
      const vm = this;

        vm.couponData = [];
        vm.isLoading = true;
        vm.$http.put(api, {data:vm.data}).then( response => {
          console.log(response.data);
          if(response.data.success){
            vm.getCoupon();
            $('#couponModal').modal('hide');
            vm.isLoading = false;
          }
        });
    },
    del(id) {
      this.delId = id;
      $('#delCouponModal').modal('show');
    },
    delCoupon() {
      const api = `${process.env.APIPATH}/api/${process.env.CUSTOMPATH}/admin/coupon/${this.delId}`;
      const vm = this;

        this.isLoading = true;
        vm.couponData = [];
        vm.$http.delete(api).then( response => {
          console.log(response.data);
          if(response.data.success){
            vm.getCoupon();
            this.isLoading = false;
            $('#delCouponModal').modal('hide');
          }
        });
    },
  },

  created() {
    this.getCoupon();
  },
}
</script>

// todo 剩下優惠券到期日/編輯時有時可以有時不行

