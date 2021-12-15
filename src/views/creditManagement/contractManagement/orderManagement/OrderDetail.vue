<template>
  <div>
    <div class="page-header">
      <h1 class="page-name">
        <span>订单详情</span>
      </h1>
      <div>
        <el-button type="primary" size="mini" @click="changeRecords">变更记录</el-button>
        <el-button @click="closeDialog">返回</el-button>
      </div>
    </div>
    <div class="page-content">
      <el-form ref="form" :model="form" label-width="120px">
        <el-row>
          <el-col :span="24">
            <el-form-item label="订单名称">{{ form.contractCode }} / {{ form.contractName }}</el-form-item>
          </el-col>
        </el-row>
        <el-divider class="detail-divider"></el-divider>
        <el-row>
          <el-col :span="8">
            <el-form-item label="客户名称">
              <span class="canClick" @click="gotoCustomerDetail(form.customerId)">{{ form.customerName }}</span>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <EnterpriseFile :enterpriseID="form.customerId"></EnterpriseFile>
          </el-col>
        </el-row>
        <el-divider class="detail-divider"></el-divider>
        <el-row>
          <el-col :span="8">
            <el-form-item label="合同名称">
              <span
                v-if="form.transientRefContract"
                class="canClick"
                @click="gotoContractDetail(form.transientRefContract.id)"
              >{{ form.transientRefContract.contractCode }} / {{ form.transientRefContract.contractName }}</span>
              <span v-else>-</span>
            </el-form-item>
          </el-col>
        </el-row>
        <el-divider class="detail-divider"></el-divider>
        <el-row>
          <el-col :span="8">
            <el-form-item label="负责人员">
              <el-tooltip
                class="item"
                effect="dark"
                :content="(form.headDeptName||'-')+'/'+(form.headName||'-')"
                placement="top"
              >
                <div class="ellipsis">
                  <span>{{ (form.headDeptName||'-')+'/'+(form.headName||'-') }}</span>
                </div>
              </el-tooltip>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="订单状态">
              {{ form.state === "0"
              ? "待提交"
              : form.state === "1"
              ? "待审核"
              : form.state === "2"
              ? "待签约"
              : form.state === "3"
              ? "订单执行"
              : form.state === "4"
              ? "订单完成"
              : form.state === "5"
              ? "订单取消"
              : "订单作废" }}
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="申请日期">{{ form.createDate&&form.createDate.substr(0,10) }}</el-form-item>
          </el-col>
          <el-col :span="24">
            <el-divider class="detail-divider"></el-divider>
          </el-col>
          <el-col :span="8">
            <el-form-item label="签约日期">{{ $dateFormat(form.signDate) }}</el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="有效期始">{{ $dateFormat(form.effectiveDateStart) }}</el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="有效期止">{{ $dateFormat(form.effectiveDateEnd) }}</el-form-item>
          </el-col>
        </el-row>
        <el-tabs type="border-card" style="margin-top: 15px">
          <el-tab-pane label="订单申请信息">
            <div class="sub-title" style="margin-top: 0">发货清单</div>
            <TableWrapper
              ref="ref_shippingList"
              :data="form.transientGoodsInfo"
              :query="{}"
              :columns="shippingListCol"
              style="margin-bottom: 20px"
            />
            <el-row>
              <el-col :span="8">
                <el-form-item label="订单金额">{{ $toMoney(form.contractAvailable) }} 元</el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="折扣">{{ form.discount }} %</el-form-item>
              </el-col>
            </el-row>
            <el-divider class="detail-divider"></el-divider>
            <el-row>
              <el-col :span="8">
                <el-form-item label="应收确定日期">{{ form.confirmType==='1'?'按订单签约日期':'按发票登记日期' }}</el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="是否预付">
                  <el-switch :value="form.prepaid" disabled></el-switch>
                </el-form-item>
              </el-col>
            </el-row>
            <el-divider class="detail-divider"></el-divider>
            <el-row v-if="form.prepaid">
              <el-col :span="8">
                <el-form-item label="预付金额">{{ $toMoney(form.payAmount) }} 元</el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="预付日期">{{ $dateFormat(form.payAmountDate) }}</el-form-item>
              </el-col>
              <el-col :span="24">
                <el-divider class="detail-divider"></el-divider>
              </el-col>
            </el-row>
            <el-form-item label="发货日期">{{ $dateFormat(form.outGoodsDate) }}</el-form-item>
            <el-divider class="detail-divider"></el-divider>
            <el-form-item label="收货地址">{{ form.address?form.address.split(',')[1]:'-' }}</el-form-item>
            <el-divider class="detail-divider"></el-divider>
            <el-row>
              <el-col :span="8">
                <el-form-item label="拖欠罚金">
                  {{form.defaultMoney==='1'?'不使用罚金':
                  form.defaultMoney==='2'?'一次性收取':
                  form.defaultMoney==='3'?'按天收取':'-'}}
                </el-form-item>
              </el-col>
              <el-col :span="8" v-if="form.defaultMoney==='2'||form.defaultMoney==='3'">
                <el-form-item label="计算依据">
                  {{form.defaultBasis==='1'?'订单金额':
                  form.defaultBasis==='2'?'应收账款余额':'-'}}
                </el-form-item>
              </el-col>
              <el-col :span="8" v-if="form.defaultMoney==='2'||form.defaultMoney==='3'">
                <el-form-item label="计算比率">{{form.defaultPercent}} %</el-form-item>
              </el-col>
            </el-row>
            <el-divider class="detail-divider"></el-divider>
            <el-form-item label="订单备注">{{ form.remark||'-' }}</el-form-item>
            <el-divider class="detail-divider"></el-divider>
            <el-form-item label="附件">
              <!-- <span
                v-if="uploadFiles&&uploadFiles.length"
                class="canClick"
                @click="uploadFiles(uploadFiles)"
              >点击查看</span> -->
              <!-- <span v-else>-</span> -->
              <div>
                <yuViewPdf :urls="uploadFiles" v-if="uploadFiles&&uploadFiles.length"></yuViewPdf>
                <span v-else>
                  -
                </span>
              </div>
              
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="订单发货信息">
            <shippingInfos ref="ref_shippingInfos" :id="cID"></shippingInfos>
          </el-tab-pane>
          <el-tab-pane label="应收账款记录">
            <ReceivablesInfo ref="ref_ReceivablesInfo" :id="cID"></ReceivablesInfo>
          </el-tab-pane>
          <el-tab-pane label="收款核销记录">
            <ReceiptWriteOffs ref="ref_ReceiptWriteOffs" :id="cID"></ReceiptWriteOffs>
          </el-tab-pane>
          <el-tab-pane label="发票跟踪记录">
            <InvoiceTracking ref="ref_InvoiceTracking" :id="cID"></InvoiceTracking>
          </el-tab-pane>
          <el-tab-pane label="账款催收记录">
            <DebtCollection ref="ref_DebtCollection" :id="cID"></DebtCollection>
          </el-tab-pane>
        </el-tabs>
      </el-form>
    </div>
    <!-- <ViewPDFs ref="ref_ViewPDFs"></ViewPDFs> -->
    <ChangeRecords
      ref="ref_ChangeRecords"
      @contractChangeChange="orderChange_change"
      @contractChangePromise="orderChange_promise"
      @contractChangeCancel="orderChange_cancel"
    ></ChangeRecords>
     <NewOrder
      v-if="showNewOrder"
      ref="ref_NewOrder"
      :contractId="contractId"
      @hideNewOrder="hideNewOrder"
      @getList="getList"
    ></NewOrder>
  </div>
</template>

<script>
import EnterpriseFile from "@/components/EnterpriseFile/index.vue";
import Upload from "@/components/Upload/index.vue";
import shippingInfos from "@/views/creditManagement/contractManagement/contractLedger/detailsComponents/ShippingInfos.vue";
import ReceivablesInfo from "@/views/creditManagement/contractManagement/contractLedger/detailsComponents/ReceivablesInfo.vue";
import ReceiptWriteOffs from "@/views/creditManagement/contractManagement/contractLedger/detailsComponents/ReceiptWriteOffs.vue";
import InvoiceTracking from "@/views/creditManagement/contractManagement/contractLedger/detailsComponents/InvoiceTracking.vue";
import DebtCollection from "@/views/creditManagement/contractManagement/contractLedger/detailsComponents/DebtCollection.vue";
import { Api_orderDetail } from "@/api/creditManagement/contractManagement/orders.js";
import ViewPDFs from "@/components/ViewPDFs/index.vue";
import yuViewPdf from "@/components/yuViewPdf/yuViewPdf.vue";
import ChangeRecords from "./ChangeRecords";
export default {
  name: "OrderDetail",
  components: {
    EnterpriseFile,
    Upload,
    ReceivablesInfo,
    ReceiptWriteOffs,
    InvoiceTracking,
    DebtCollection,
    shippingInfos,
    ViewPDFs,
    yuViewPdf,
    ChangeRecords
  },
  data() {
    return {
      cID: null,
      showNewOrder:false,
      row:'',// 一整条数据
      form: { transientRefContract: {} },
      uploadFiles: [],
      shippingListCol: [
        { label: "产品/服务名称", key: "name" },
        { label: "销售单位", key: "company" },
        {
          label: "单价(元)",
          key: "unitPrice",
          align: "right",
          render: (h, data, row) => {
            return data ? this.$toMoney(data) : "-";
          }
        },
        { label: "销售数量", key: "num", align: "right" },
        {
          label: "总价(元)",
          key: null,
          align: "right",
          render: (h, data, row) => {
            return this.$toMoney(row.num * row.unitPrice);
          }
        },
        { label: "折扣(%)", key: "discount" },
        {
          label: "实际成交价(元)",
          key: null,
          align: "right",
          render: (h, data, row) => {
            return this.$toMoney(((row.num * row.unitPrice * row.discount) / 100).toFixed(2));
          }
        },
        { label: "已发货数量", key: "send", align: "right" }
      ]
    };
  },
  created() {
    if (this.$route.query.id) {
      this.open(this.$route.query.id);
    }
  },
  methods: {
    open(_id,row) {
      this.cID = _id;
      this.row=row;
      const loading = this.$openLoading();
      Api_orderDetail(_id).then(res => {
        loading.close();
        this.form = res;
        this.uploadFiles = res.uploadFiles.map(item => ({ name: item.originalName, url: item.url }));
      }).catch(err=>{
        loading.close();
        this.$message.error(err)
      });
    },
    gotoCustomerDetail(_d) {
      this.$gotoCustomerDetail(_d);
    },
    gotoContractDetail(_d) {
      this.$gotoContractDetail(_d);
    },
    /**
     * @返回
     */
    closeDialog() {
      this.$emit("hideOrderDetail");
    },
    checkPdfs(urls) {
      this.$refs.ref_ViewPDFs.open(urls);
    },
    changeRecords(row) {
      this.$nextTick(()=>{
        this.$refs.ref_ChangeRecords.open(this.row);
      })
    },
    /**
     * @订单变更
     */
    orderChange_change() {
      Api_orderChangeJudge(this.row.id, { applyType: "2",tabType:1})
        .then((res) => {
          this.modelStatus = "change";
          this.contractId =this.row.id;
          this.showNewOrder = true;
          this.$nextTick(() => {
            this.$refs.ref_NewOrder.open("change",this.row.id, res, "2",_r);
          });
        })
        .catch((res) => {
          this.$message.error(res);
        });
    },
    orderChange_promise() {
      Api_orderChangeJudge(this.row.id, { applyType: "3" })
        .then((res) => {
          this.modelStatus = "change";
          this.contractId = this.row.id;
          this.showNewOrder = true;
          this.$nextTick(() => {
            this.$refs.ref_NewOrder.open("change",this.row.id, res, "3");
          });
        })
        .catch((res) => {
          this.$message.error(res);
        });
    },

    orderChange_cancel() {
      Api_orderChangeJudge(this.row.id, { applyType: "4" })
        .then((res) => {
          this.modelStatus = "change";
          this.contractId = this.row.id;
          this.showNewOrder = true;
          this.$nextTick(() => {
            this.$refs.ref_NewOrder.open("change", this.row.id, res, "4");
          });
        })
        .catch((res) => {
          this.$message.error(res);
        });
    },

  }
};
</script>

<style>
</style>
