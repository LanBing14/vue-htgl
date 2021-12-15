<template>
  <div>
    <div class="page-header">
      <h1 class="page-name">
        <span>{{ pageState==='add'?'发货登记':pageState==='edit'?'编辑发货登记':'-' }}</span>
      </h1>
      <div>
        <el-button @click="closeDialog">返回</el-button>
      </div>
    </div>
    <div class="page-content">
      <el-form ref="form" :model="form" label-width="120px">
        <el-row>
          <el-col :span="24">
            <el-form-item label="客户名称">
              <span class="canClick" @click="goCustomerDetail(rowData.customerId)">{{ rowData.customerName }}</span>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-form-item label="订单编码/名称">
              <span
                class="canClick"
                @click="goContractDetail(rowData.contractId)"
              >{{rowData.contractNo}}/{{ rowData.contractName }}</span>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="8">
            <el-form-item label="发货日期">{{ $dateFormat(rowData.outGoodsDate) }}</el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="收货地址">
              <span class="canClick" @click="viewAddress(rowData)">{{ rowData.address }}</span>
            </el-form-item>
          </el-col>
        </el-row>
        <div class="sub-title">
          发货清单
          <div v-if="!rowData.isAbnormal">
            <el-button @click="chooseGoods" size="small" type="primary">选择产品</el-button>
            <el-button @click="emptyGoods" size="small" type="primary">清空全部</el-button>
          </div>
        </div>
        <el-table :data="form.goods" style="width: 100%" class="table-no-hidden">
          <el-table-column align="center" type="index" width="50" label="序号"></el-table-column>
          <el-table-column align="center" label="产品/服务名称">
            <template slot-scope="scope">
              <el-form-item label-width="0" class="table-form-item">
                <span>{{ scope.row.name }}</span>
              </el-form-item>
            </template>
          </el-table-column>
          <el-table-column align="center" label="销售单位">
            <template slot-scope="scope">
              <el-form-item label-width="0" class="table-form-item">
                <span>{{ scope.row.company }}</span>
              </el-form-item>
            </template>
          </el-table-column>
          <el-table-column align="center" label="待发数量">
            <template slot-scope="scope">
              <el-form-item label-width="0" class="table-form-item">
                <span>{{ scope.row.unSendNum }}</span>
              </el-form-item>
            </template>
          </el-table-column>
          <el-table-column align="center" label="发货数量">
            <template slot-scope="scope">
              <el-form-item
                label-width="0"
                class="table-form-item"
                :prop="'goods.'+scope.$index+'.sendNum'"
                :rules="$createRules({msg:'发货数量',required:true,cipint0:true}).concat(rowData.isAbnormal?[]:[{validator:lessThanUnSendNum(scope.row)}])"
              >
                <el-input :disabled="rowData.isAbnormal" v-model="scope.row.sendNum"></el-input>
              </el-form-item>
            </template>
          </el-table-column>
          <el-table-column align="center" label="操作">
            <template slot-scope="scope">
              <el-button
                size="mini"
                icon="el-icon-minus"
                @click="delList(scope.$index)"
                circle
                style="padding: 8px 6px 6px"
              ></el-button>
            </template>
          </el-table-column>
        </el-table>
        <el-row style="margin-top: 20px">
          <el-col :span="8">
            <el-form-item
              label="发货备注"
              prop="shipRemake"
              :rules="$createRules({msg:'发货备注',required:true,max:1000})"
            >
              <el-input type="textarea" :rows="4" placeholder="请输入发货备注信息" v-model="form.shipRemake"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="8">
            <el-form-item label="出库日期" prop="deliveryTime" :rules="$createRules({msg:'出库日期',required:true,validator:shouldPayAmount()})">
              <el-date-picker
                v-model="form.deliveryTime"
                type="date"
                placeholder="请选择出库日期"
                value-format="yyyy-MM-dd"
                style="width: 100%"
              ></el-date-picker>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="8">
            <el-form-item label="附件" prop="urls">
              <Upload v-model="urls" fileType="jpg,png" :limit="5" :fileSize="10"></Upload>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </div>
    <div style="text-align: center" class="size-btn-change">
      <el-button type="success" @click="saveForm">保存</el-button>
      <el-button type="primary" @click="submitForm">提交</el-button>
    </div>
    <ChooseGoods ref="ref_ChooseGoods" @setList="setList"></ChooseGoods>
    <ViewAddress ref="ref_ViewAddress"></ViewAddress>
  </div>
</template>

<script>
import Upload from "@/components/Upload/index.vue";
import ChooseGoods from "./ChooseGoods";
import ViewAddress from "./ViewAddress";
import {
  Api_orderNoShipDetail,
  Api_shipmentRegistration,
} from "@/api/creditManagement/shippingManagement/pendingOrders.js";

export default {
  name: "ShippingRegister",
  components: { ChooseGoods, Upload, ViewAddress },
  data() {
    return {
      pageState: null,
      form: {
        id: null,
        contractId: null,
        goods: [],
        shipRemake: null,
        deliveryTime: this.$dateFormat(new Date().getTime()),
        urls: [],
        state: null,
      },
      urls: [],
      rowData: {
        contractNo: null,
        customerId: null,
        customerName: null,
        contractId: null,
        contractCode: null,
        contractName: null,
        outGoodsDate: null,
        address: null,
        receiverName: null,
        receiverPhone: null,
        isAbnormal: false,
      },
    };
  },
  methods: {
    open(_s, _r, res) {
      this.pageState = _s;
      // this.rowData = _r;
      // const loading = this.$openLoading();
      // Api_orderNoShipDetail(_r)
      //   .then(res => {
      //     loading.close();
      //     if (typeof res === "string") {
      //       this.$alert(res, "提示", {
      //         confirmButtonText: "确定",
      //         type: "warning",
      //         callback: () => {
      //           this.$emit("hideShippingRegister");
      //         }
      //       });
      //       return false;
      //     }
      this.rowData = {
        contractNo: res.contractCode,
        customerId: res.customerId,
        customerName: res.customerName,
        contractId: _r,
        contractCode: res.contractCode,
        contractName: res.contractName,
        outGoodsDate: res.outGoodsDate,
        address: res.address,
        receiverName: res.receiverName,
        receiverPhone: res.receiverPhone,
        isAbnormal: res.isAbnormal,
      };
      this.urls = res.attachmentVos
        ? res.attachmentVos.map((item) => ({ url: item.url, name: item.originalName }))
        : [];
      this.form.contractId = _r;
      this.setList(res.goodsInfos);
      this.$refs.ref_ChooseGoods.setGoods(res.goodsInfos);
      this.$nextTick(() => {
        if (_s === "edit") {
          this.form.id = res.registration.id;
          this.form.shipRemake = res.registration.shipRemake;
          this.form.goods = res.saveGoodsInfo;
          res.registration.deliveryTime &&
            (this.form.deliveryTime = this.$dateFormat(res.registration.deliveryTime));
        }
      });
      // })
      // .catch(res => {
      //   loading.close();
      //   this.$alert(res, "提示", {
      //     confirmButtonText: "确定",
      //     type: "warning",
      //     callback: () => {
      //       this.$emit("hideShippingRegister");
      //     }
      //   });
      //   return false;
      // });
    },
    /**
     * @choose
     * @goods
     */
    chooseGoods() {
      this.$refs.ref_ChooseGoods.open(this.form.goods);
    },
    /**
     * @清空全部
     */
    emptyGoods() {
      this.form.goods = [];
    },
    shouldPayAmount() {
          return (rule, value, callback) => {
              if (this.form.deliveryTime < this.$dateFormat(this.rowData.outGoodsDate)) {
                  callback(
                      new Error("客户当前出库时间小于发货时间,不允许登记。")
                  );
              }
              callback();
          };
      },
    /**
     * @导入清单
     */
    setList(_data) {
      this.form.goods = [];
      for (let i = 0; i < _data.length; i++) {
        this.form.goods.push({
          goodsId: _data[i].id,
          sendNum: _data[i].unSendNum,
          unSendNum: _data[i].unSendNum,
          name: _data[i].name,
          company: _data[i].company,
          unitPrice: _data[i].unitPrice,
          num: _data[i].num,
          amount: _data[i].amount,
          discount: _data[i].discount,
          actAmount: _data[i].actAmount,
          order: _data[i].order,
        });
      }
    },
    /**
     * @删除一项清单
     */
    delList(_i) {
      this.form.goods.splice(_i, 1);
    },
    /**
     * @保存
     */
    saveForm() {
      this.form.state = 0;
      this.form.urls = this.urls.map((item) => item.url);

      const _info = {};
      for (let i = 0; i < this.form.goods.length; i++) {
        _info[this.form.goods[i].goodsId] = this.form.goods[i].sendNum;
      }

      this.$refs["form"].validate((valid) => {
        if (valid) {
          const loading = this.$openLoading();
          Api_shipmentRegistration({ ...this.form, info: _info })
            .then((res) => {
              loading.close();
              this.$message.success(res);
              this.$emit("hideShippingRegister");
              this.$emit("getList");
            })
            .catch((res) => {
              loading.close();
              this.$message.error(res);
            });
        }
      });
    },
    /**
     * @提交
     */
    submitForm() {
      this.form.state = 1;
      this.$refs["form"].validate((valid) => {
        if (valid) {
          this.form.urls = this.urls.map((item) => item.url);

          const _info = {};
          for (let i = 0; i < this.form.goods.length; i++) {
            _info[this.form.goods[i].goodsId] = this.form.goods[i].sendNum;
          }

          const loading = this.$openLoading();
          Api_shipmentRegistration({ ...this.form, info: _info })
            .then((res) => {
              loading.close();
              this.$message.success(res);
              this.$emit("hideShippingRegister");
              this.$emit("getList");
            })
            .catch((res) => {
              loading.close();
              this.$message.error(res);
            });
        }
      });
    },
    viewAddress(_row) {
      this.$refs.ref_ViewAddress.open({
        name: _row.receiverName,
        phone: _row.receiverPhone,
        address: _row.address,
      });
    },
    goCustomerDetail(_id) {
      this.$gotoCustomerDetail(_id);
    },
    goContractDetail(_id) {
      this.$gotoOrderDetail(_id);
    },
    closeDialog() {
      this.$emit("hideShippingRegister");
    },
    /**
     * @验证-发货数量小于待发数量
     */
    lessThanUnSendNum(row) {
      return (rule, value, callback) => {
        if (row.sendNum > row.unSendNum) {
          callback(new Error("发货数量不能大于待发数量"));
          return;
        }
        callback();
      };
    },
  },
};
</script>

<style>
</style>
