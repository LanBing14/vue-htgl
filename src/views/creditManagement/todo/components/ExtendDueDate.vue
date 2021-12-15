<template>
  <div>
    <div class="page-header">
      <h1 class="page-name">
        <span>延长到期日{{ modelStatus ? '':'——查看' }}</span>
      </h1>
      <div>
        <el-button @click="back">返回</el-button>
      </div>
    </div>
    <div class="page-content">
      <!-- ?? -->
      <el-form ref="form" :model="form" label-width="120px">
        <el-row>
          <el-col :span="8">
            <el-form-item label="应收编码">{{ detailData.planInfo.payPlanCode }}</el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="客户名称">
              <span
                class="canClick"
                @click="$gotoCustomerDetail(detailData.planInfo.customerId)"
              >{{ detailData.planInfo.companyName }}</span>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="订单编码/名称">
              <span
                class="canClick"
                @click="$gotoOrderDetail(detailData.planInfo.contractId)"
              >{{ detailData.planInfo.contractNo+'/'+detailData.planInfo.contractName }}</span>
            </el-form-item>
          </el-col>
        </el-row>
        <el-divider class="detail-divider"></el-divider>
        <el-row>
          <el-col :span="8">
            <el-form-item label="应收金额">{{ detailData.planInfo.payAmount }} 元</el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="确认日期">{{ $dateFormat(detailData.planInfo.payDate) }}</el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="到期日">{{ $dateFormat(detailData.planInfo.endDate) }}</el-form-item>
          </el-col>
        </el-row>
        <el-divider class="detail-divider"></el-divider>
        <el-row>
          <el-col :span="8">
            <el-form-item label="应收未收金额">
              <template
                v-if="detailData.planInfo.payAmount || detailData.planInfo.receivable"
              >{{ detailData.planInfo.payAmount - detailData.planInfo.receivable }} 元</template>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="已收金额">{{ detailData.planInfo.receivable }} 元</el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="逾期金额">{{ detailData.planInfo.overDueMoney }} 元</el-form-item>
          </el-col>
        </el-row>
        <el-divider class="detail-divider"></el-divider>
        <el-row>
          <el-col :span="8">
            <el-form-item label="延长后到期日">{{ $dateFormat(detailData.delayDay) }}</el-form-item>
          </el-col>
        </el-row>
        <el-divider class="detail-divider"></el-divider>
        <el-row>
          <el-col :span="8">
            <el-form-item label="账款状态">
              {{
              detailData.planInfo.viewState === "1"
              ? "未完成"
              : detailData.planInfo.viewState === "2"
              ? "逾期未完成"
              : detailData.planInfo.viewState === "3"
              ? "正常完成"
              : detailData.planInfo.viewState === "4"
              ? "逾期完成"
              : ""
              }}
            </el-form-item>
          </el-col>
        </el-row>
        <el-divider class="detail-divider"></el-divider>
        <el-row>
          <el-col>
            <el-form-item label="延长说明">{{detailData.remarks}}</el-form-item>
          </el-col>
        </el-row>
        <el-divider class="detail-divider"></el-divider>
        <el-row>
          <el-col :span="8">
            <el-form-item label="延长附件">
              <span
                v-if="detailData.files&&detailData.files.length"
                class="canClick"
                @click="checkPics(detailData.files)"
              >点击查看附件</span>
              <span v-else>-</span>
            </el-form-item>
          </el-col>
        </el-row>
        <el-divider class="detail-divider"></el-divider>
      </el-form>
      <slot></slot>
    </div>
    <div class="demo-image__preview" style="position: fixed; top: -200px; left: -200px; z-index: 2000">
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
import { Api_AgencyMattersDeal, Api_AgencyMattersReject } from "@/api/creditManagement/todo/index";
// ??
import { Api_PlanDelayDetailTodo } from "@/api/creditManagement/accountsReceivable/overdueManagement.js";

export default {
  name: "ExtendDueDate",
  filters: {
    filterViewState(val) {
      if (val === "1") {
        return "未完成";
      } else if (val === "2") {
        return "逾期未完成";
      } else if (val === "3") {
        return "已完成";
      } else if (val === "4") {
        return "逾期完成";
      } else {
        return "";
      }
    },
  },
  props: {
    modelStatus: Boolean,
    row: Object,
  },
  data() {
    const createRules = this.$createRules;
    return {
      isSign: true,
      visibleSign: false,
      signFormData: {
        auditOpinion: "",
      },
      signFormRules: {
        auditOpinion: createRules({
          msg: "审核意见",
          required: true,
          max: 200,
        }),
      },
      // ??
      form: {
        swhijreigo: "",
        gerpjgjroe: "",
        egmprogkproe: "",
        nbspreoha: "",
        nprigerig: "",
        smpietfsae: "",
        meproyji: "",
        pehnpiehj: "",
        vnesipoht: "",
        bnesoitj: "",
        mvaerihe: "",
        vernoihear: "",
        vmzroeuh: "",
      },
      rowData: {},
      detailData: {
        planInfo: {
          data: [{}],
        },
      },
      tableColCollectionDetails: [
        {
          label: "收款日期",
          key: "payDate",
          render: (h, data, row) => {
            return this.$dateFormat(data, "yyyy-MM-dd");
          },
        },
        { label: "收款金额", key: "payAmount" },
        { label: "实收金额", key: "payAmount" },
        { label: "折扣金额", key: "discountAmount" },
        {
          label: "收款附件",
          key: null,
          render: (h, data, row) => {
            return (
              <span style="color: #4a9df2; cursor: pointer" onClick={this.checkFiles.bind(this, row)}>
                点击查看附件
              </span>
            );
          },
        },
        { label: "备注", key: "remarks" },
        { label: "收款登记人", key: "userName" },
        { label: "收款登记日期", key: "modifyDate" },
        {
          label: "核销状态",
          key: "state",
          render: (h, data, row) => {
            return data === "0" ? "驳回" : data === "1" ? "待核销" : data === "2" ? "已核销" : "";
          },
        },
      ],
      tableColDueDate: [
        {
          label: "申请日期",
          key: "createDate",
          render: (h, data, row) => {
            return data.substr(0, 10);
          },
        },
        { label: "延长后到期日", key: "endDate" },
        // { label: "申请时逾期金额", key: "overDueMoney" },
        { label: "延长说明", key: "remarks" },
        {
          label: "延长附件",
          key: null,
          render: (h, data, row) => {
            return (
              <span style="color: #4a9df2; cursor: pointer" onClick={this.checkFiles.bind(this, row)}>
                点击查看附件
              </span>
            );
          },
        },
        {
          label: "申请状态",
          key: "state",
          render: (h, data, row) => {
            return data === "0" ? "驳回" : data === "1" ? "待审核" : data === "2" ? "已签批" : "";
          },
        },
      ],
      listQuery: {},
      srcList: [],
      // !!
    };
  },
  mounted() {
    const loading = this.$openLoading();
    Api_PlanDelayDetailTodo(this.row.business_key)
      .then((res) => {
        loading.close();
        this.detailData = res;
      })
      .catch(() => {
        loading.close();
      });
  },
  methods: {
    back() {
      this.$emit("edit", false);
    },
    handleSign(flag) {
      this.isSign = flag;
      this.visibleSign = true;
    },
    // 签批或打回
    signSure() {
      this.$refs.signForm.validate((valid) => {
        if (valid) {
          if (this.isSign) {
            this.$confirm("确定通过审核吗？", "提示", {
              type: "warning",
            }).then(() => {
              const { id, business_id: businessId } = this.row;
              const loading = this.$openLoading();
              Api_AgencyMattersDeal(id, {
                businessId,
                processOperate: 2,
                processRemark: this.signFormData.auditOpinion,
              })
                .then((msg) => {
                  this.$message.success(msg);
                  loading.close();
                  this.visibleSign = false;
                  this.back();
                })
                .catch((e) => {
                  this.$message.error(e);
                  loading.close();
                });
            });
          } else {
            this.$confirm("确定打回申请吗？", "提示", {
              type: "warning",
            }).then(() => {
              const { id, business_id: businessId } = this.row;
              const loading = this.$openLoading();
              Api_AgencyMattersReject(id, {
                businessId,
                processOperate: 4,
                processRemark: this.signFormData.auditOpinion,
              })
                .then((msg) => {
                  this.$message.success(msg);
                  loading.close();
                  this.visibleSign = false;
                  this.back();
                })
                .catch((e) => {
                  this.$message.error(e);
                  loading.close();
                });
            });
          }
        }
      });
    },
    signClose() {
      this.$refs.signForm.resetFields();
      this.visibleSign = false;
    },
    checkFiles() {},
    /**
     * @查看图片
     */
    checkPics(urls) {
      this.srcList = urls.map((item) => process.env.VUE_APP_FILE_API + item.url);
      this.$nextTick(() => {
        this.$refs.ref_Img.clickHandler();
      });
    },
  },
};
</script>

<style>
</style>
