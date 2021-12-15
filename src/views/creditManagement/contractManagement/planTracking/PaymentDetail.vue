<template>
  <div>
    <div class="page-header">
      <h1 class="page-name">
        <span>应收账款详情</span>
      </h1>
      <div>
        <el-button @click="backClick">返回</el-button>
      </div>
    </div>
    <div class="page-content">
      <el-form label-width="120px">
        <el-row>
          <el-col :span="8">
            <el-form-item label="客户名称">
              <span
                class="canClick"
                @click="$gotoCustomerDetail(details.transientContract.customerId)"
              >{{ details.vo.companyName }}</span>
            </el-form-item>
          </el-col>
        </el-row>
        <el-divider class="detail-divider"></el-divider>
        <el-row>
          <el-col :span="8">
            <el-form-item label="订单编码/名称">
              <span
                class="canClick"
                @click="$gotoOrderDetail(details.transientContract.id)"
              >{{details.vo.contractNo}}/{{ details.vo.contractName }}</span>
            </el-form-item>
          </el-col>
        </el-row>
        <el-divider class="detail-divider"></el-divider>
        <el-row>
          <el-col :span="8">
            <el-form-item label="应收编码">{{ details.vo.payPlanCode }}</el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item
              label="账款类型"
            >{{details.planType==='0'?'预付款':details.planType==='1'?'应收款':details.planType==='2'?'罚金':'-'}}</el-form-item>
          </el-col>
        </el-row>
        <el-divider class="detail-divider"></el-divider>
        <el-row>
          <el-col :span="8">
            <el-form-item label="应收金额">{{ $toMoney(details.planAmount) }}元</el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="确认日期">{{ $dateFormat(details.payDate, 'yyyy-MM-dd') }}</el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="到期日">{{ $dateFormat(details.endDate, 'yyyy-MM-dd') }}</el-form-item>
          </el-col>
          <el-col :span="24">
            <el-divider class="detail-divider"></el-divider>
          </el-col>
          <el-col :span="8">
            <el-form-item label="应收未收金额">{{ $toMoney(details.planAmount - details.receivable) }} 元</el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="已收金额">{{ $toMoney(details.receivable) }} 元</el-form-item>
          </el-col>
        </el-row>
        <el-divider class="detail-divider"></el-divider>
        <el-row>
          <el-col :span="8">
            <el-form-item label="待核销金额">{{ $toMoney(details.waitCancellation) }} 元</el-form-item>
          </el-col>
        </el-row>
        <el-divider class="detail-divider"></el-divider>
        <el-row>
          <el-col :span="8">
            <el-form-item label="账款状态">
              {{
              details.vo.viewState === "1"
              ? "未完成"
              : details.vo.viewState === "2"
              ? "逾期未完成"
              : details.vo.viewState === "3"
              ? "正常完成"
              : details.vo.viewState === "4"
              ? "逾期完成"
              : ""
              }}
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="最近收款日期">{{ details.lastPayTime?$dateFormat(details.lastPayTime):'-' }}</el-form-item>
          </el-col>
        </el-row>
        <el-divider class="detail-divider"></el-divider>
        <el-tabs type="border-card" ref="tabs" style="margin-top: 20px">
          <el-tab-pane label="收款记录明细">
            <TableWrapper
              ref="ref_detail"
              :data="details.transientPayRegisters"
              :query="{}"
              :columns="tableCol"
            />
          </el-tab-pane>
          <el-tab-pane label="到期日延长情况">
            <TableWrapper ref="ref_extend" :data="details.payDelaysVo" :query="{}" :columns="tableExtendCol" />
          </el-tab-pane>
          <el-tab-pane label="罚金明细">
            <el-row>
              <el-col :span="8">
                <el-form-item
                  label-width="100px"
                  label="计算方式"
                >{{ details.fines&&details.fines.length?(details.fines[0].defaultMoney==='1'?'不使用罚金':details.fines[0].defaultMoney==='2'?'一次性收取':details.fines[0].defaultMoney==='3'?'按天收取':'-'):'-' }}</el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item
                  label-width="100px"
                  label="计算依据"
                >{{ details.fines&&details.fines.length?(details.fines[0].defaultBasis==='1'?'订单':details.fines[0].defaultBasis==='2'?'应收账款余额':'-'):'-' }}</el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item
                  label-width="100px"
                  label="罚金比率"
                >{{ details.fines&&details.fines.length?details.fines[0].defaultPercent:'-' }}</el-form-item>
              </el-col>
            </el-row>
            <TableWrapper ref="ref_forfeit" :data="details.fines" :query="{}" :columns="tableForfeitCol" />
          </el-tab-pane>
        </el-tabs>
      </el-form>
    </div>
    <FinancialWriteOff ref="ref_FinancialWriteOff"></FinancialWriteOff>
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

<script type="text/jsx">
import { Api_PaymentDetails, Api_GetPictrues } from "@/api/creditManagement/contractManagement/contract.js";
import FinancialWriteOff from "./FinancialWriteOff";

export default {
  name: "PaymentDetail",
  components: { FinancialWriteOff },
  data() {
    return {
      visible: false,
      details: { transientContract: {}, vo: {} },
      srcList: [],
      tableCol: [
        {
          key: "registerCode",
          label: "收款编码",
          width: "140px",
          render: (h, data, row) => {
            return (
              <span onClick={this.$gotoRecordsDetail.bind(this, row.id)} class="canClick">
                {data}
              </span>
            );
          },
        },
        {
          label: "收款日期",
          key: "payDate",
          render: (h, data, row) => {
            return this.$dateFormat(data, "yyyy-MM-dd");
          },
        },
        {
          label: "收款金额(元)",
          key: "payAmount",
          align: "right",
          render: (h, data, row) => {
            return this.$toMoney(data + row.discountAmount);
          },
        },
        {
          label: "实收金额(元)",
          key: "payAmount",
          align: "right",
          render: (h, data, row) => {
            return this.$toMoney(data);
          },
        },
        {
          label: "折扣金额(元)",
          key: "discountAmount",
          align: "right",
          render: (h, data, row) => {
            return this.$toMoney(data);
          },
        },
        {
          key: null,
          label: "收款附件",
          render: (h, data, row) => {
            return (
              <span class="canClick" onClick={this.checkFiles.bind(this, row)}>
                点击查看附件
              </span>
            );
          },
        },
        { label: "收款登记人", key: "creator" },
        {
          label: "收款登记日期",
          key: "createDate",
          render: (h, data, row) => {
            return data ? data.substr(0, 10) : "-";
          },
        },
        {
          label: "收款状态",
          key: "state",
          render: (h, data, row) => {
            return data === "0"
              ? "驳回"
              : data === "1"
              ? "待核销"
              : data === "2"
              ? "已核销"
              : data === "3"
              ? "待审核"
              : "";
          },
        },
      ],
      tableExtendCol: [
        { label: "申请编号", key: "collectionCode" },
        {
          label: "延长前到期日",
          key: "timeOld",
          render: (h, data, row) => {
            return this.$dateFormat(data);
          },
        },
        {
          label: "延长后到期日",
          key: "delayDay",
          render: (h, data, row) => {
            return this.$dateFormat(data);
          },
        },
        { label: "延长说明", key: "remarks" },
        {
          label: "延长附件",
          key: null,
          render: (h, data, row) => {
            return (
              <span class="canClick" onClick={this.checkPics.bind(this, row)}>
                点击查看附件
              </span>
            );
          },
        },
        { label: "申请人", key: "creator" },
        {
          label: "申请日期",
          key: "createDate",
          render: (h, data, row) => {
            return data ? data.substr(0, 10) : "-";
          },
        },
        {
          label: "申请状态",
          key: "state",
          render: (h, data, row) => {
            return data === "-1"
              ? "待提交"
              : data === "0"
              ? "驳回"
              : data === "1"
              ? "待审核"
              : data === "2"
              ? "已签批"
              : data === "3"
              ? "保存"
              : "-";
          },
        },
      ],
      tableForfeitCol: [
        {
          label: "计算日期",
          key: "createDate",
          render: (h, data, row) => (data ? data.substr(0, 10) : "-"),
        },
        {
          label: "计算依据金额（元）",
          key: "basisMoney",
          render: (h, data, row) => this.$toMoney(data),
        },
        { label: "罚金比率", key: "defaultPercent" },
        {
          label: "罚金记账金额（元）",
          key: "fineMoney",
          render: (h, data, row) => this.$toMoney(data),
        },
      ],
    };
  },
  methods: {
    open(_row) {
      const loading = this.$openLoading();
      Api_PaymentDetails(_row.payPlanId).then((res) => {
        loading.close();
        this.details = res;
        if (res.planType === "2") {
          this.$refs.tabs.$children[0].$refs.tabs[1].style.display = "none";
        } else {
          this.$refs.tabs.$children[0].$refs.tabs[2].style.display = "none";
        }
      });
    },
    backClick() {
      this.$emit("hidePaymentDetail");
    },
    checkFiles(_row) {
      const loading = this.$openLoading();
      Api_GetPictrues("005006", _row.id)
        .then((res) => {
          loading.close();
          if (!res || !res.length) {
            this.$message.error("没有上传图片！");
            return false;
          }
          this.srcList = res.map((item) => process.env.VUE_APP_FILE_API + item.url);
          this.$nextTick(() => {
            this.$refs.ref_Img.clickHandler();
          });
        })
        .catch((res) => {
          loading.close();


        });
    },
    writeOffDetail(_row) {
      this.$refs.ref_FinancialWriteOff.open("info", this.details.vo, _row);
    },
    writeOffEdit() {},
    /**
     * @查看图片
     */
    checkPics(_row) {
      const loading = this.$openLoading();
      Api_GetPictrues("005008", _row.id)
        .then((res) => {
          loading.close();
          if (!res || !res.length) {
            this.$message.error("没有上传图片！");
            return false;
          }
          this.srcList = res.map((item) => process.env.VUE_APP_FILE_API+item.url);
          this.$nextTick(() => {
            this.$refs.ref_Img.clickHandler();
          });
        })
        .catch((res) => {
          loading.close();
        });
    },
  },
};
</script>

<style>
</style>
