<template>
  <div>
    <div class="page-header">
      <h1 class="page-name">
        <span>合同详情</span>
      </h1>

      <div>
        <el-button type="primary" size="mini" @click="changeRecords">变更记录</el-button>
        <el-button @click="closeDialog">返回</el-button>
      </div>
    </div>
    <div class="page-content">
      <el-form ref="form" :model="form" label-width="110px">
        <el-row>
          <el-col :span="8">
            <el-form-item label="合同名称">{{ form.contractName }}</el-form-item>
          </el-col>
        </el-row>
        <el-divider class="detail-divider"></el-divider>
        <el-row>
          <el-col :span="8">
            <el-form-item label="客户名称">
              <span
                class="canClick"
                @click="$gotoCustomerDetail(form.customerId)"
              >{{ form.customerName }}</span>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <EnterpriseFile :enterpriseID="form.customerId" :stateID="cID"></EnterpriseFile>
          </el-col>
          <el-col :span="24">
            <el-divider class="detail-divider"></el-divider>
          </el-col>
          <el-col :span="8">
            <el-form-item label="负责人员">{{ form.headDeptName }} / {{ form.headName }}</el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="合同状态">
              {{
              form.state==="0"?"合同拟定":form.state==="1"?"合同审核":form.state==="2"?"合同签约":form.state==="3"?"合同执行":form.state==="4"?"履约完成":form.state==="5"?"合同取消":"合同作废"
              }}
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-divider class="detail-divider"></el-divider>
          </el-col>
          <el-col :span="8">
            <el-form-item label="签订日期">{{ $dateFormat(form.signDate) }}</el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="有效期始">{{ $dateFormat(form.effectiveDateStart) }}</el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="有效期止">{{ $dateFormat(form.effectiveDateEnd) }}</el-form-item>
          </el-col>
          <el-col :span="24">
            <el-divider class="detail-divider"></el-divider>
          </el-col>
          <el-col :span="8">
            <el-form-item label="订单发货控制状态" label-width="130px">
              <el-switch
                v-model="form.controller"
                active-color="#409eff"
                inactive-color="#dcdfe6"
                disabled
              ></el-switch>
            </el-form-item>
          </el-col>
        </el-row>
        <el-tabs type="border-card" style="margin-top: 15px">
          <el-tab-pane label="合同申请信息">
            <el-row>
              <el-col :span="8">
                <el-form-item label="合同金额">{{ $toMoney(form.contractAvailable,2) }} 元</el-form-item>
              </el-col>
            </el-row>
            <el-divider class="detail-divider"></el-divider>
            <el-row>
              <el-col :span="24">
                <el-form-item label="合同概述" prop="remark">{{ form.remark }}</el-form-item>
              </el-col>
            </el-row>
            <el-divider class="detail-divider"></el-divider>
            <el-row>
              <el-col :span="8">
                <el-form-item
                  :label="(form.state=='0'||form.state=='1'||form.state=='2')?'附件(未签章)':'附件(已签章)'"
                >
                  <!-- <span v-if="fileList&&fileList.length" class="canClick" @click="viewPdfs">点击查看</span>
                  <span v-else>-</span> -->
                  <!-- <Upload v-model="fileList" fileType="pdf" :limit="5" :fileSize="10" disabled></Upload> -->


                <div>
                  <yuViewPdf :urls="fileList" v-if="fileList&&fileList.length"></yuViewPdf>
                  <span v-else>
                    -
                  </span>
                </div>



                </el-form-item>
                <!-- <ViewPDFs ref="ref_ViewPDFs"></ViewPDFs> -->
              </el-col>
            </el-row>
            <el-divider class="detail-divider"></el-divider>
            <div class="sub-title">合同发货清单</div>
            <TableWrapper
              ref="ref_contractShippingList"
              :data="form.transientGoodsInfo"
              :query="{}"
              :columns="contractShippingListCol"
            />
          </el-tab-pane>
          <el-tab-pane label="合同发货记录">
            <ShippingInfos ref="ref_shippingInfos" :id="cID"></ShippingInfos>
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
    <CreateUpdate
      v-if="isShowCreateUpdate"
      ref="refCreateUpdateModel"
      :model-status="modelStatus"
      @getList="getList"
      :contract-id="contractId"
      @hideCreateUpdate="hideCreateUpdate"
    />
    <ChangeRecords
      ref="ref_ChangeRecords"
      @contractChangeChange="contractChange_change"
      @contractChangePromise="contractChange_promise"
      @contractChangeCancel="contractChange_cancel"
    ></ChangeRecords>
  </div>
</template>

<script>
import EnterpriseFile from "@/components/EnterpriseFile/index.vue";
import Upload from "@/components/Upload/index.vue";
import ViewPDFs from "@/components/ViewPDFs/index.vue";
import ShippingInfos from "./detailsComponents/ShippingInfos.vue";
import ReceivablesInfo from "./detailsComponents/ReceivablesInfo.vue";
import ReceiptWriteOffs from "./detailsComponents/ReceiptWriteOffs.vue";
import InvoiceTracking from "./detailsComponents/InvoiceTracking.vue";
import DebtCollection from "./detailsComponents/DebtCollection.vue";
import { Api_ContractDetail,Api_ChangeContractJudge } from "@/api/creditManagement/contractManagement/contract.js";
import ChangeRecords from "./ChangeRecords";
import CreateUpdate from "./CreateUpdate";
import yuViewPdf from "@/components/yuViewPdf/yuViewPdf.vue";
export default {
  name: "ContractDetail",
  components: {
    EnterpriseFile,
    Upload,
    // ViewPDFs,
    yuViewPdf,
    ReceivablesInfo,
    ReceiptWriteOffs,
    InvoiceTracking,
    DebtCollection,
    ShippingInfos,
    ChangeRecords,
    CreateUpdate
  },
  data() {
    return {
      cID: null,
      row:'',// 整条数据
      isShowCreateUpdate: false,
      form: {},
      fileList: [],
      fileList2: [],
      contractShippingListCol: [
        { label: "产品/服务名称", key: "name" },
        { label: "销售单位", key: "company" },
        { label: "销售数量", key: "num" },
        {
          label: "备注",
          key: "remark",
          render: (h, data, row) => {
            return data || "-";
          }
        }
      ],
      paymentPlanCol: [
        {
          label: "是否预付",
          key: "prepaid",
          render: (h, data, row) => {
            return data ? "是" : "否";
          }
        },
        {
          label: "付款描述",
          key: "paymentDescribe",
          render: (h, data, row) => {
            return data || "-";
          }
        },
        {
          label: "计划付款金额(元)",
          key: "planAmount",
          render: (h, data, row) => {
            return this.$toMoney(data);
          }
        },
        {
          label: "计划付款比例(%)",
          key: "planAmount",
          render: (h, data, row) => {
            return (
              (
                (Number(data) * 100) /
                Number(this.form.contractAvailable)
              ).toFixed(2) + "%"
            );
          }
        },
        {
          label: "计划付款日期",
          key: "payDate",
          render: (h, data, row) => {
            return this.$dateFormat(data);
          }
        },
        {
          label: "到期日",
          key: "endDate",
          render: (h, data, row) => {
            return this.$dateFormat(data);
          }
        },
        {
          label: "收款金额(元)",
          key: "receivable",
          render: (h, data, row) => {
            return this.$toMoney(data);
          }
        },
        {
          label: "最近收款时间",
          key: "lastPayTime",
          render: (h, data, row) => {
            return this.$dateFormat(data);
          }
        },
        {
          label: "状态",
          key: "payPlanState",
          render: (h, data, row) => {
            return data === "9"
              ? "未开始"
              : data === "1"
              ? "未完成"
              : data === "2"
              ? "逾期未完成"
              : data === "3"
              ? "正常完成"
              : data === "4"
              ? "逾期完成"
              : "";
          }
        }
      ]
    };
  },
  methods: {
    open(id,row) {
      this.cID = id;
      this.row=row;
      this.getDetail(id);
    },
    getDetail(id) {
      const loading = this.$openLoading();
      Api_ContractDetail(id)
        .then(res => {
          loading.close();
          this.form = res;
          if (res.additionalUploadFiles && res.additionalUploadFiles.length) {
            this.fileList = res.additionalUploadFiles.length
              ? res.additionalUploadFiles.map(item => {
                  return {
                    url: item.url,
                    name: item.originalName,
                    domain: item.domain
                  };
                })
              : [];
          } else {
            this.fileList = res.uploadFiles.length
              ? res.uploadFiles.map(item => {
                  return {
                    url: item.url,
                    name: item.originalName,
                    domain: item.domain
                  };
                })
              : [];
          }

          this.fileList2 = res.additionalUploadFiles.length
            ? res.additionalUploadFiles.map(item => {
                return {
                  url: item.url,
                  name: item.originalName,
                  domain: item.domain
                };
              })
            : [];
        })
        .catch(res => {
          loading.close();
        });
    },
    viewPdfs() {
      this.$refs.ref_ViewPDFs.open(this.fileList);
    },
    closeDialog() {
      this.$emit("hideDetail");
    },
    //  变更记录
    /**
     * @变更记录
     */
    changeRecords() {
      console.log(this.row);
      this.$nextTick(()=>{
        this.$refs.ref_ChangeRecords.open(this.row);
      })
     
    },

    contractChange_change() {
      const loading = this.$openLoading();
      Api_ChangeContractJudge(this.row.id, { applyType: 2,tabType:1})
        .then((res) => {
          loading.close();
          this.isShowCreateUpdate = true;
          this.$nextTick(() => {
            this.$refs.refCreateUpdateModel.open("change", this.row.id, res, "2",this.row);
          });
        })
        .catch((res) => {
          loading.close();
          this.$message.error(res);
        });
    },
    contractChange_promise() {
      const loading = this.$openLoading();
      Api_ChangeContractJudge(this.row.id, { applyType: 3 })
        .then(res => {
          loading.close();
          this.isShowCreateUpdate = true;
          this.$nextTick(() => {
            this.$refs.refCreateUpdateModel.open("change", this.row.id, res, "3");
          });
        })
        .catch(res => {
          loading.close();
          this.$message.error(res);
        });
    },
    contractChange_cancel() {
      const loading = this.$openLoading();
      Api_ChangeContractJudge(this.row.id, { applyType: 4 })
        .then(res => {
          loading.close();
          this.modelStatus = "change";
          this.contractId = this.row.id;
          this.isShowCreateUpdate = true;
          this.$nextTick(() => {
            this.$refs.refCreateUpdateModel.open("change", this.row.id, res, "4");
          });
        })
        .catch(res => {
          loading.close();
          this.$message.error(res);
        });
    }
  }
};
</script>

<style lang="scss" scoped>
</style>
