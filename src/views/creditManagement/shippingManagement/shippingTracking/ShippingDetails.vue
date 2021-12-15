<template>
  <div>
    <div class="page-header">
      <h1 class="page-name">
        <span>发货跟踪详情</span>
      </h1>
      <div>
        <el-button @click="back">返回</el-button>
      </div>
    </div>
    <div class="page-content">
      <el-form ref="form" :model="form" label-width="120px">
        <el-row>
          <el-col :span="8">
            <el-form-item label="客户名称">
              <span class="canClick" @click="goCustomerDetail(form.customerId)">{{ form.customerName }}</span>
            </el-form-item>
          </el-col>
        </el-row>
        <EnterpriseFile :enterpriseID="form.customerId"></EnterpriseFile>
        <el-divider class="detail-divider"></el-divider>
        <el-row>
          <el-col :span="8">
            <el-form-item label="订单名称">
              <span
                class="canClick"
                @click="goContractDetail(form.contractId)"
              >{{ form.contractCode }}/{{ form.contractName }}</span>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="发货编码">{{ form.shipCode }}</el-form-item>
          </el-col>
        </el-row>
        <el-divider class="detail-divider"></el-divider>
        <el-tabs value="1" type="border-card" style="margin-top: 20px">
          <el-tab-pane label="发货登记信息" name="1">
            <TableWrapper ref="child1" :data="infoList1" :columns="colList1" />
            <div>
              <el-row style="margin-top: 10px">
                <el-col :span="24">
                  <el-form-item label="发货备注">{{ form.shipRemake }}</el-form-item>
                </el-col>
              </el-row>
              <el-divider class="detail-divider"></el-divider>
              <el-row>
                <el-col :span="8">
                  <el-form-item label="发货日期">{{ $dateFormat(form.deliveryTime, 'yyyy-MM-dd') }}</el-form-item>
                </el-col>
              </el-row>
              <el-divider class="detail-divider"></el-divider>
              <el-row>
                <el-col :span="8">
                  <el-form-item label="出库人">{{ form.newName }}</el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item
                    label="出库状态"
                  >{{ form.newState === '0' ? '待出库' : form.newState === '1' ? '待签收' : form.newState === '2' ? '已签收' : '签收异常' }}</el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item label="出库附件">
           
                      <span class="canClick" @click="checkFiles(form.attachmentVos)">查看附件</span>

                      <!-- <ImgView :urls="form.attachmentVos"></ImgView> -->

                  </el-form-item>
                </el-col>
              </el-row>
              <el-divider class="detail-divider"></el-divider>
            </div>
          </el-tab-pane>
          <el-tab-pane
            label="到货登记信息"
            v-if="form.state === '1' || form.state === '2' || form.state === '3'"
            name="2"
          >
            <TableWrapper ref="child2" :data="infoList2" :columns="colList2" />
            <div>
              <el-row style="margin-top: 10px">
                <el-col :span="24">
                  <el-form-item label="到货备注">{{ form.arrivalRemark||'-' }}</el-form-item>
                </el-col>
              </el-row>
              <el-divider class="detail-divider"></el-divider>
              <el-row>
                <el-col :span="8">
                  <el-form-item label="签收日期">{{ form.signDate?$dateFormat(form.signDate):'-' }}</el-form-item>
                </el-col>
              </el-row>
              <el-divider class="detail-divider"></el-divider>
              <el-row>
                <el-col :span="8">
                  <el-form-item label="签收人">{{ form.name || '-' }}</el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item
                    label="签收状态"
                  >{{ form.a_state === '0' ? '待签收' : form.a_state === '1' ? '已签收': '-' }}</el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item label="签收附件">
                    <span class="canClick" @click="checkFiles(form.attachmentVo)">查看附件</span>
                     <!-- <ImgView :urls="form.attachmentVo"></ImgView> -->
                  </el-form-item>
                </el-col>
              </el-row>
              <el-divider class="detail-divider"></el-divider>
            </div>
          </el-tab-pane>
        </el-tabs>
      </el-form>
    </div>
    <div class="demo-image__preview" style="position: fixed; top: -200px; left: -200px; z-index: 10000">
      <el-image
        ref="ref_Img"
        style="width: 100px; height: 100px"
        :src="srcList[0]"
        :preview-src-list="srcList"
      ></el-image>
    </div>
  </div>
</template>

<script>
import ImgView from "@/components/ImgView/index.vue";
import EnterpriseFile from "@/components/EnterpriseFile/index.vue";
import {
  Api_GoodsInfo,
  Api_ContractInfo,
  Api_ArrivalDetail,
  Api_ShipDetail,
} from "@/api/creditManagement/shippingManagement/shippingTracking.js";
import { Api_orderNoShipDetail } from "@/api/creditManagement/shippingManagement/pendingOrders.js";

export default {
  name: "ShippingDetails",
  components: { EnterpriseFile, ImgView },
  data() {
    return {
      form: {},
      srcList: [],
      infoList1: [],
      infoList2: [],
      colList1: [
        { label: "产品/服务名称", key: "name" },
        { label: "销售单位", key: "company" },
        { label: "发货数量", key: "send" },
      ],
      colList2: [
        { label: "产品/服务名称", key: "name" },
        { label: "销售单位", key: "company" },
        { label: "发货数量", key: "sendNum" },
        { label: "到货数量", key: "arrivalNum" },
      ],
    };
  },
  methods: {
    // getList1() {
    //   this.$refs.child1.fetchData();
    // },
    // getList2() {
    //   this.$refs.child2.fetchData();
    // },
    open(_row) {
      this.form = _row;
      const loading = this.$openLoading();
      Api_ShipDetail(_row.id, _row.contract_id)
        .then((res) => {
          loading.close();
          this.form.newName = res.name;
          this.form.newState = res.registration.state;
          this.form.deliveryTime = res.registration.deliveryTime;
          this.form.shipRemake = res.registration.shipRemake;
          this.infoList1 = res.goodsInfos;
          this.form.attachmentVos = res.attachmentVos;
          this.form.customerId = res.customerId;
          this.form.customerName = res.customerName;
          this.form.contractId = res.contractId;
          this.form.contractCode = res.contractCode;
          this.form.contractName = res.contractName;
          this.form.shipCode = res.shipCode;
          if (res.state){
            this.form.state = res.state
          }
          if (this.form.state === "1" || this.form.state === "2" || this.form.state === "3") {
            Api_ArrivalDetail(_row.id)
              .then((_res) => {
                if (_res && _res.length) {
                  const res = _res[0];
                  this.form.name = res.name;
                  this.form.a_state = res.state;
                  this.form.arrivalRemark = res.arrivalRemark;
                  this.form.signDate = res.signDate;
                  this.form.attachmentVo = res.attachmentVo;
                  this.infoList2 = res.goods;
                }
              })
              .catch((res) => {
                this.$message.error(res);
              });
          }
          // this.$nextTick(() => {
          //   this.getList2();
          // });
        })
        .catch((res) => {
          loading.close();
          this.$message.error(res);
        });
      // if (this.form.state === "1" || this.form.state === "2" || this.form.state === "3") {
      //   Api_ArrivalDetail(_row.id)
      //     .then((_res) => {
      //       console.log(_res,999)
      //       if (_res && _res.length) {
      //         const res = _res[0];
      //         this.form.name = res.name;
      //         this.form.a_state = res.state;
      //         this.form.arrivalRemark = res.arrivalRemark;
      //         this.form.signDate = res.signDate;
      //         this.form.attachmentVo = res.attachmentVo;
      //         this.infoList2 = res.goods;
      //         // this.$nextTick(() => {
      //         //   this.getList1();
      //         // });
      //       }
      //     })
      //     .catch((res) => {
      //       this.$message.error(res);
      //     });
      // }
    },
    back() {
      this.$emit("hideShippingDetails");
    },
    goCustomerDetail(_id) {
      this.$gotoCustomerDetail(_id);
    },
    goContractDetail(_id) {
      this.$gotoOrderDetail(_id);
    },
    // 查看图片
    checkFiles(row) {
      if (!row || !row.length) {
        this.$message.error("没有上传图片！");
        return false;
      }
      this.srcList = row.map((item) => process.env.VUE_APP_FILE_API + item.url);
      this.$nextTick(() => {
        this.$refs.ref_Img.clickHandler();
      });
    },
  },
};
</script>

<style>
</style>
