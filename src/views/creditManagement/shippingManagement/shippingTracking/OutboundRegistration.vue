<template>
  <div>
    <div class="page-header">
      <h1 class="page-name">
        <span>{{ pageStatus === 'out' ? '出库登记' : '到货登记' }}</span>
      </h1>
      <div>
        <el-button @click="back">返回</el-button>
      </div>
    </div>
    <div class="page-content">
      <el-form ref="form" :model="displayInfo" label-width="120px">
        <el-row>
          <el-col :span="24">
            <el-form-item label="客户名称">
              <span
                class="canClick"
                @click="goCustomerDetail(displayInfo.customerId)"
              >{{ displayInfo.customerName }}</span>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-form-item label="订单名称">
              <span
                class="canClick"
                @click="gotoOrderDetail(displayInfo.contractId)"
              >{{ displayInfo.contractNo }}/{{ displayInfo.contractName }}</span>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="8">
            <el-form-item label="发货编码">{{ displayInfo.code }}</el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <el-form ref="form" :model="form" label-width="120px">
        <div class="sub-title">发货申请及出库情况</div>
        <div class="payment-plan">
          <div
            style="display: flex; height: 48px; align-items: center; background-color: #eaedf4; border-bottom: 1px solid #dee2e6;"
          >
            <div style="flex: 0 50px" class="payment-plan-th payment-plan-th-color">序号</div>
            <div style="flex: 1.6" class="payment-plan-th payment-plan-th-color">产品/服务名称</div>
            <!--<div style="flex: 1" class="payment-plan-th payment-plan-th-color">规格型号</div>-->
            <div style="flex: 1" class="payment-plan-th payment-plan-th-color">销售单位</div>
            <div style="flex: 1" class="payment-plan-th payment-plan-th-color">发货数量</div>
            <!--<div style="flex: 1" class="payment-plan-th payment-plan-th-color">单价(元)</div>
                        <div style="flex: 1" class="payment-plan-th payment-plan-th-color">应发数量</div>
                        &lt;!&ndash; ?? &ndash;&gt;
                        <div v-if="pageStatus==='out'"
                            style="flex: 1"
                            class="payment-plan-th payment-plan-th-color"
                        >应发金额</div>
                        <div style="flex: 1" class="payment-plan-th payment-plan-th-color">实发数量</div>
                        <div v-if="pageStatus==='out'"
                            style="flex: 1"
                            class="payment-plan-th payment-plan-th-color"
            >实发金额</div>-->
            <!-- ?? -->
            <div v-if="pageStatus==='in'" style="flex: 1" class="payment-plan-th payment-plan-th-color">到货数量</div>
            <!--<div
                            v-if="pageStatus==='in'"
                            style="flex: 1"
                            class="payment-plan-th payment-plan-th-color"
            >实到金额(元)</div>-->
          </div>
          <div
            v-for="(item, index) in form.cargoData"
            :key="index"
            style="display: flex; height: 48px; align-items: center; border-bottom: 1px solid #dee2e6;"
          >
            <div style="flex: 0 50px" class="payment-plan-th">{{ index + 1 }}</div>
            <div style="flex: 1.6" class="payment-plan-th">{{ item.name }}</div>
            <!--<div style="flex: 1" class="payment-plan-th">{{ item.type }}</div>-->
            <div style="flex: 1" class="payment-plan-th">{{ item.company }}</div>
            <div style="flex: 1.6" class="payment-plan-th">{{ item.sendNum }}</div>
            <!--<div style="flex: 1" class="payment-plan-th">{{ $toMoney(item.unitPrice,2) }}</div>
                        <div style="flex: 1" class="payment-plan-th">{{ item.thisSendNum }}</div>
                        &lt;!&ndash; ?? &ndash;&gt;
                        <div v-if="pageStatus==='out'"
                            style="flex: 1"
                            class="payment-plan-th"
                        >{{ item.thisMoneyOfSend }}</div>
                        <div style="flex: 1" class="payment-plan-th">
                            <el-form-item
                                label-width="0"
                                :prop="'cargoData.'+index+'.thisSendNumAct'"
                                :rules="pageStatus==='out'?[{required:true,message:'请输入实发数量'},{type:'integer',min:1,message:'请输入正整数'}]:[]"
                            >
                                <el-input
                                    v-if="pageStatus==='out'"
                                    v-model.number="item.thisSendNumAct"
                                    class="plan-input"
                                    @change="caculateTotal"
                                    placeholder="实发数量"
                                ></el-input>
                            </el-form-item>
                            <span v-if="pageStatus==='in'">{{ item.thisSendNumAct }}</span>
                        </div>
                        <div v-if="pageStatus==='out'" style="flex: 1" class="payment-plan-th">
                            <el-input
                                :value="item.thisMoneyOfSendAct | computeThisMoneyOfSendAct(item, $toMoney)"
                                class="plan-input"
                                disabled
                                placeholder="实发金额"
                            ></el-input>
            </div>-->
            <!-- ?? -->
            <div v-if="pageStatus==='in'" style="flex: 1" class="payment-plan-th">
              <el-form-item
                label-width="0"
                :prop="'cargoData.'+index+'.arrivalNum'"
                :rules="pageStatus==='in'?[{required:true,message:'请输入实到数量'},{type:'integer',max: item.sendNum,min:0,message:'请输入正整数，不得超过发货数量'}]:[]"
              >
                <el-input
                  :disabled="isAbnormal"
                  v-model.number="item.arrivalNum"
                  class="plan-input"
                  :class="{'text-danger':item.isRed}"
                  placeholder="实到数量"
                ></el-input>
              </el-form-item>
            </div>
            <!--<div v-if="pageStatus==='in'" style="flex: 1" class="payment-plan-th">
                            <el-input
                                :value="item.actAmount | computeMoneyOfArrival(item, $toMoney)"
                                class="plan-input"
                                disabled
                                placeholder="实到金额"
                            ></el-input>
            </div>-->
          </div>
        </div>
        <el-row>
          <el-col :span="8">
            <el-form-item
              :label="pageStatus==='out'?'出库备注':'到货备注'"
              prop="remark"
              :rules="$createRules({msg:pageStatus==='out'?'出库备注':'到货备注',required:true,max:200})"
            >
              <el-input
                v-model="form.remark"
                type="textarea"
                :rows="4"
                :placeholder="pageStatus==='out'?'出库备注':'到货备注'"
              ></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="8">
            <el-form-item
              :label="pageStatus==='out'?'出库日期':'签收日期'"
              prop="time"
              :rules="$createRules({msg:pageStatus==='out'?'出库日期':'签收日期',required:true,validator:shouldPayAmount(pageStatus)})"
            >
              <el-date-picker
                v-model="form.time"
                type="date"
                :placeholder="pageStatus==='out'?'出库日期':'签收日期'"
                value-format="yyyy-MM-dd"
                style="width: 100%"
              ></el-date-picker>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="8">
            <el-form-item label="附件上传" prop="urls1">
              <Upload v-model="form.urls1" fileType="jpg,png" :limit="5" :fileSize="10"></Upload>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div style="text-align: center">
        <el-button type="success" @click="outSave">保存</el-button>
        <el-button type="primary" @click="outSubmit">提交</el-button>
      </div>
    </div>
  </div>
</template>

<script>
import { Api_upload, Api_DownloadFileByPath } from "@/api/baseApi";
import Upload from "@/components/Upload/index.vue";
import {
  Api_GoodsInfo,
  Api_NewGoodsInfo,
  Api_NewGoosIn,
  Api_GoosOut,
  Api_GoosIn
} from "@/api/creditManagement/shippingManagement/shippingTracking.js";
import { merge } from "lodash";

export default {
  name: "OutboundRegistration",
  components: { Upload },
  filters: {
    computeThisMoneyOfSendAct(h, row, _tm) {
      row.thisMoneyOfSendAct = Number(row.thisSendNumAct) * Number(row.unitPrice);
      return _tm(Number(row.thisSendNumAct) * Number(row.unitPrice));
    },
    computeMoneyOfArrival(h, row, _tm) {
      row.moneyOfArrival = Number(row.numOfArrival) * Number(row.unitPrice);
      return _tm(Number(row.numOfArrival) * Number(row.unitPrice));
    }
  },
  data() {
    return {
      pageStatus: "",
      rowData: "",
      displayInfo: {
        code: "",
        customerId: "",
        customerName: "",
        contractId: "",
        contractNo: "",
        contractName: "",
        moneyOfSend: "",
        sendTotal: "",
        grtehrtht: "",
        state: "",
        time: "",
        remark: "",
        money: 0
      },
      form: {
        id: "",
        shipId: "",
        remark: "",
        time: this.$dateFormat(new Date(), "yyyy-MM-dd"),
        urls1: [],
        cargoData: []
      }
    };
  },
  methods: {
    initPage(_pageStatus, _rowData) {
      this.pageStatus = _pageStatus;
      this.rowData = _rowData;
      this.form.id = _rowData.arrival_id;
      /**
       * @清空
       */
      this.displayInfo = {
        code: "",
        customerId: "",
        customerName: "",
        contractId: "",
        contractNo: "",
        contractName: "",
        moneyOfSend: "",
        sendTotal: 0,
        grtehrtht: "",
        state: "",
        time: "",
        remark: "",
        money: 0
      };
      /**
       * @展示
       */
      const loading = this.$openLoading();
      Api_NewGoodsInfo(_rowData.id, { id: _rowData.arrival_id })
        .then(res => {
          loading.close();
          this.isAbnormal = res.isAbnormal;
          this.form.shipId = _rowData.id;
          this.displayInfo.customerId = _rowData.company_id;
          this.displayInfo.customerName = _rowData.company_name;
          this.displayInfo.contractId = _rowData.contract_id;
          this.displayInfo.contractNo = _rowData.contract_no;
          this.displayInfo.contractName = _rowData.contract_name;
          this.displayInfo.code = _rowData.ship_code;
          this.form.cargoData = res.goods.map(i => ({ ...i, isRed: false }));
          for (let i = 0; i < this.form.cargoData.length; i++) {
            this.form.cargoData[i].arrivalNum = this.form.cargoData[i].sendNum;
          }
          if (res.attachmentVos) {
            this.form.urls1 = res.attachmentVos.map(item => {
              return {
                url: item.url,
                name: item.originalName
              };
            });
          }
          if (res.arrivalRemark) {
            this.form.time = res.signDate;
            this.form.remark = res.arrivalRemark;
          }
        })
        .catch(res => {
          loading.close();
          this.$message.error(res);
        });
      // Api_GoodsInfo(_rowData.id).then(res => {
      //     loading.close();
      //     this.displayInfo.code = res.code;
      //     this.displayInfo.customerName = res.contractInfo.customerName;
      //     this.displayInfo.contractName = res.contractInfo.contractCode + "/" + res.contractInfo.contractName;
      //     this.displayInfo.moneyOfSend = res.deliverGoodsInfo.money;
      //     this.displayInfo.state = res.state;
      //     this.displayInfo.time = this.pageStatus === "out" ? res.deliverGoodsInfo.time : res.outGoodsInfo.time;
      //     this.displayInfo.remark =
      //         this.pageStatus === "out" ? res.deliverGoodsInfo.remark : res.outGoodsInfo.remark;
      //     if (this.pageStatus === "out") {
      //         for (let i = 0; i < res.deliverGoodsInfo.goods.length; i++) {
      //             this.form.cargoData.push({
      //                 ...res.deliverGoodsInfo.goods[i],
      //                 thisSendNumAct: 0,
      //                 thisMoneyOfSendAct: 0
      //             });
      //         }
      //     } else {
      //         for (let i = 0; i < res.outGoodsInfo.goods.length; i++) {
      //             this.form.cargoData.push({ ...res.outGoodsInfo.goods[i], numOfArrival: 0, moneyOfArrival: 0 });
      //         }
      //     }
      //     this.caculateTotal();
      // });
    },
    back() {
      this.$emit("hideOutboundRegistration");
    },
    /**
     * method@提交
     */
    outSubmit() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          // 判断 到货数量 与 发货数量 是否对等
          let nn = 0;
          console.log(this.form.cargoData);
          for (let i = 0; i < this.form.cargoData.length; i++) {
            if (this.form.cargoData[i].sendNum !== this.form.cargoData[i].arrivalNum) {
              this.form.cargoData[i].isRed = true;
              nn++;
            } else {
              this.form.cargoData[i].isRed = false;
            }
          }
          if (nn !== 0) {
            this.$confirm(
              "当前到货数量与发货数量不等，确定要提交吗？提交后将进入异常发货处理流程，请及时核查情况并进行处理。",
              "异常发货提示",
              {
                confirmButtonText: "确定",
                cancelButtonText: "取消",
                type: "warning"
              }
            ).then(() => {
              this.submitHandle();
            });
          } else {
            this.submitHandle();
          }
          // let _money = 0
          // if (this.pageStatus === "out") {
          //     for (let i = 0; i < this.form.cargoData.length; i++) {
          //         _money += this.form.cargoData[i].thisMoneyOfSendAct;
          //     }
          //     for (let i = 0; i < _cargoData.length; i++) {
          //         delete _cargoData[i].num;
          //         delete _cargoData[i].amount;
          //         delete _cargoData[i].unSendNum;
          //     }
          //     const loading = this.$openLoading();
          //     Api_GoosOut(this.rowData.id, {
          //         remark: this.form.remark,
          //         money: _money,
          //         time: this.form.time,
          //         urls: this.form.urls.map(item => item.url),
          //         goods: _cargoData
          //     }).then(() => {
          //         loading.close();
          //         this.$message.success("出库成功！");
          //         this.$emit("hideOutboundRegistration");
          //         this.$emit("getList");
          //     }).catch(res => {
          //         loading.close();
          //         this.$message.error(res);
          //     });
          // } else {
          //     for (let i = 0; i < this.form.cargoData.length; i++) {
          //         _money += this.form.cargoData[i].moneyOfArrival;
          //     }
          //     for (let i = 0; i < _cargoData.length; i++) {
          //         delete _cargoData[i].thisMoneyOfSend;
          //         delete _cargoData[i].thisMoneyOfSendAct;
          //     }
          //     const loading = this.$openLoading();
          //     Api_GoosIn(this.rowData.id, {
          //         remark: this.form.remark,
          //         money: _money,
          //         time: this.form.time,
          //         urls: this.form.urls.map(item => item.url),
          //         goods: _cargoData
          //     }).then(() => {
          //         loading.close();
          //         this.$message.success("签收成功！");
          //         this.$emit("hideOutboundRegistration");
          //         this.$emit("getList");
          //     }).catch(res => {
          //         loading.close();
          //         this.$message.error(res);
          //     });
          // }
        }
      });
    },
    submitHandle() {
      const loading = this.$openLoading();
      const postData = merge({}, this.form);
      const _info = {};
      for (let i = 0; i < this.form.cargoData.length; i++) {
        _info[this.form.cargoData[i].id] = this.form.cargoData[i].arrivalNum;
      }
      postData.urls = this.form.urls1.map(item => item.url);
      postData.state = 1;
      postData.arrivalRemark = this.form.remark;
      postData.signDate = this.form.time;
      postData.info = _info;
      delete postData.cargoData;
      delete postData.urls1;
      delete postData.remark;
      delete postData.time;
      Api_NewGoosIn(postData)
        .then(res => {
          loading.close();
          this.$message.success(res);
          this.back();
        })
        .catch(res => {
          loading.close();
          this.$message.error(res);
        });
    },
    // 保存
    outSave() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          const loading = this.$openLoading();
          const postData = merge({}, this.form);
          const _info = {};
          for (let i = 0; i < this.form.cargoData.length; i++) {
            _info[this.form.cargoData[i].id] = this.form.cargoData[i].arrivalNum;
          }
          postData.urls = this.form.urls1.map(item => item.url);
          postData.state = 0;
          postData.arrivalRemark = this.form.remark;
          postData.signDate = this.form.time;
          postData.info = _info;
          delete postData.cargoData;
          delete postData.urls1;
          delete postData.remark;
          delete postData.time;
          Api_NewGoosIn(postData)
            .then(res => {
              loading.close();
              this.$message.success(res);
              this.back();
            })
            .catch(res => {
              loading.close();
              this.$message.error(res);
            });
        }
      });
    },
    shouldPayAmount(state) {
        let message = '签收';
        if(state ==='out'){
            message = '出库'
        }
            return (rule, value, callback) => {
            console.log(this.form.time)
                if (this.$dateFormat(this.rowData.delivery_time) > this.form.time) {
                    callback(
                        new Error("客户当前"+message+"时间小于发货时间,不允许登记。")
                    );
                }
                callback();
            };
      },
    // caculateMoneyOfArrival() {
    //     let _money = 0;
    //     for (let i = 0; i < this.form.cargoData.length; i++) {
    //         _money += this.form.cargoData[i].moneyOfArrival;
    //     }
    //     this.displayInfo.money = _money;
    // },
    // caculateTotal() {
    //     this.displayInfo.sendTotal = 0;
    //     for (let i = 0; i < this.form.cargoData.length; i++) {
    //         this.displayInfo.sendTotal += this.form.cargoData[i].thisMoneyOfSendAct;
    //     }
    // },
    goCustomerDetail(_id) {
      this.$gotoCustomerDetail(_id);
    },
    gotoOrderDetail(_id) {
      this.$gotoOrderDetail(_id);
    }
  }
};
</script>

<style lang="scss" scoped>
.payment-plan {
  margin-bottom: 20px;
  border-top: 1px solid #dee2e6;
  border-left: 1px solid #dee2e6;
  border-right: 1px solid #dee2e6;

  .payment-plan-th-color {
    color: #7088a4;
    font-weight: bold;
  }

  .payment-plan-th {
    text-align: center;
    // height: 48px;
    // line-height: 48px;
    // border-right: 1px solid #dee2e6;

    .plan-input {
      margin: 0 4px;
      width: calc(100% - 8px);
    }
  }
}

/deep/ .no-label {
  .el-form-item__content {
    margin-left: 0 !important;
  }
}

/deep/ .payment-plan .el-input__icon {
  line-height: 30px !important;
}

/deep/ .el-textarea {
  top: 0;
}

.text-danger {
  /deep/ .el-input__inner {
    color: #f56c6c;
  }
}
</style>
