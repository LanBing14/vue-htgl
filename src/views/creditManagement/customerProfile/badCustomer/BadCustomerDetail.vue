<template>
  <div>
    <div class="page-header">
      <h1 class="page-name">
        <span>不良客户详情</span>
      </h1>
      <div>
        <el-button @click="back">返回</el-button>
      </div>
    </div>
    <div class="page-content">
      <el-form ref="ref_form" :model="form" label-width="90px">
        <el-form-item label="客户名称">
          <span class="canClick" @click="$gotoCustomerDetail(detail.companyId)">{{form.companyName}}</span>
        </el-form-item>
        <el-form-item label="列入原因">{{form.badType}}</el-form-item>
        <el-form-item label="处理办法">
          {{(form.isCredit ? ["停止赊销"] : [])
          .concat(form.isSend ? ["停止发货"] : [])
          .concat(form.isWork ? ["停止签约"] : [])
          .join(",")}}
        </el-form-item>
        <el-row>
          <el-col :span="8">
            <el-form-item label="列入时间">{{detail.createDate?detail.createDate.substr(0,10):'-'}}</el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="当前状态">
              {{detail.status === "0"
              ? "待审批"
              : detail.status === "1"
              ? "限制中"
              : detail.status === "2"
              ? "移出待审批"
              : detail.status === "3"
              ? "已移出"
              : detail.status === "4"
              ? "列入退回"
              : "-"}}
            </el-form-item>
          </el-col>
          <el-col :span="8" v-if="detail.status==='3'">
            <el-form-item label="移出时间">{{detail.modifyDate?detail.modifyDate.substr(0,10):'-'}}</el-form-item>
          </el-col>
        </el-row>
        <el-form-item label="负责人">{{form.username}}</el-form-item>
        <el-tabs type="border-card" style="margin-top: 15px">
          <el-tab-pane label="业务申请记录">
            <TableWrapper
              ref="ref_BusinessApplication"
              :fetchDataFn="Api_customerRecord"
              :query="{id:form.id}"
              :columns="colBusinessApplication"
            />
          </el-tab-pane>
          <el-tab-pane label="风险提示记录">
            <!-- <div class="menu-selected-sub">
              <el-button :class="{selected: 0 === subSelectIndex}" @click="renderComp(0)">失信被执行人</el-button>
              <el-button :class="{selected: 1 === subSelectIndex}" @click="renderComp(1)">经营异常名录</el-button>
              <el-button :class="{selected: 2 === subSelectIndex}" @click="renderComp(2)">逾期天数超标</el-button>
              <el-button :class="{selected: 3 === subSelectIndex}" @click="renderComp(3)">逾期金额超标</el-button>
            </div>-->
            <el-radio-group v-model="tabSelected">
              <el-radio-button :label="1">失信被执行人</el-radio-button>
              <el-radio-button :label="2">经营异常名录</el-radio-button>
              <el-radio-button :label="3">逾期天数超标</el-radio-button>
              <el-radio-button :label="4">逾期金额超标</el-radio-button>
            </el-radio-group>
            <div v-show="tabSelected===1">
              <TableWrapper
                ref="ref_customerBroken"
                :fetchDataFn="Api_customerBroken"
                :query="{id:form.id}"
                :columns="colExecutor"
                class="tab-tab"
                style="margin-top: 20px"
              />
            </div>
            <div v-show="tabSelected===2">
              <TableWrapper
                ref="ref_customerOperation"
                :fetchDataFn="Api_customerOperation"
                :query="{id:form.id}"
                :columns="colExceptions"
                class="tab-tab"
                style="margin-top: 20px"
              />
            </div>
            <div v-show="tabSelected===3">
              <TableWrapper
                ref="ref_customerOverdueDay"
                :fetchDataFn="Api_customerOverdueDay"
                :query="{id:form.id}"
                :columns="colDays"
                class="tab-tab"
                style="margin-top: 20px"
              />
            </div>
            <div v-show="tabSelected===4">
              <TableWrapper
                ref="ref_customerOverdueMoney"
                :fetchDataFn="Api_customerOverdueMoney"
                :query="{id:form.id}"
                :columns="colAmount"
                class="tab-tab"
                style="margin-top: 20px"
              />
            </div>
          </el-tab-pane>
        </el-tabs>
      </el-form>
    </div>
  </div>
</template>

<script>
import {
  Api_GetCustomerDetail,
  Api_customerRecord,
  Api_customerBroken,
  Api_customerOperation,
  Api_customerOverdueDay,
  Api_customerOverdueMoney
} from "@/api/creditManagement/customerProfile/customerBad.js";
import { getOffset } from "@/utils/index";

export default {
  name: "BadCustomerDetail",
  data() {
    return {
      form: {},
      detail: {},
      tabSelected: 1,
      colBusinessApplication: [
        { label: "申请编码", key: "applyCode" },
        {
          label: "申请类型",
          key: "applyType",
          render: (h, data, row) => {
            return data === "0" ? "列入申请" : data === "1" ? "变更申请" : data === "2" ? "移出申请" : "-";
          }
        },
        {
          label: "申请理由",
          key: "applyReason",
          props: { "show-overflow-tooltip": true },
          align: "left"
        },
        {
          label: "列入原因",
          key: "reasonName",
          props: { "show-overflow-tooltip": true },
          align: "left"
        },
        {
          label: "限制措施",
          key: null,
          render: (h, data, row) => {
            return (row.isCredit ? ["停止赊销"] : [])
              .concat(row.isSend ? ["停止发货"] : [])
              .concat(row.isWork ? ["停止签约"] : [])
              .join(",");
          }
        },
        { label: "申请人", key: "createName" },
        {
          label: "申请时间",
          key: "createDate",
          render: (h, data, row) => {
            return data ? data.substr(0, 10) : "-";
          }
        },
        {
          label: "申请状态",
          key: "state",
          render: (h, data, row) => {
            return data === "0"
              ? "待审批"
              : data === "1"
              ? "审批生效"
              : data === "2"
              ? "自动生效"
              : data === "3"
              ? "驳回"
              : "-";
          }
        }
      ],
      subSelectIndex: 0,
      // datas
      dataExecutor: [],
      dataExceptions: [],
      dataDays: [],
      dataAmount: [],
      // cols
      colExecutor: [
        { label: "申请编码", key: "applyCode" },
        { label: "案件编号", key: "caseCode" },
        { label: "被执行人履行情况", key: "executeStatus" },
        { label: "法律文书确定的义务", key: "obligation" },
        { label: "执行法院", key: "court" },
        {
          label: "发布时间",
          key: "publicationDate",
          render: (h, data, row) => {
            return this.$dateFormat(data);
          }
        },
        {
          label: "风险提示时间",
          key: "createDate",
          render: (h, data, row) => {
            return data ? data.substr(0, 10) : "-";
          }
        },
        {
          label: "提示状态",
          key: "state",
          render: (h, data, row) => {
            return data === "0" ? "待确认" : data === "1" ? "已采纳" : data === "2" ? "已忽略" : "-";
          }
        }
      ],
      colExceptions: [
        { label: "申请编码", key: "applyCode" },
        { label: "列入原因", key: "addReason" },
        {
          label: "列入日期",
          key: "addDate",
          render: (h, data, row) => {
            return this.$dateFormat(data);
          }
        },
        { label: "做出决定单位", key: "decisionOffice" },
        {
          label: "移出日期",
          key: "removeDate",
          render: (h, data, row) => {
            return this.$dateFormat(data);
          }
        },
        {
          label: "风险提示时间",
          key: "createDate",
          render: (h, data, row) => {
            return data ? data.substr(0, 10) : "-";
          }
        },
        {
          label: "提示状态",
          key: "state",
          render: (h, data, row) => {
            return data === "0" ? "待确认" : data === "1" ? "已采纳" : data === "2" ? "已忽略" : "-";
          }
        }
      ],
      colDays: [
        { label: "申请编码", key: "applyCode" },
        { label: "应收编码", key: "receivableCode" },
        {
          label: "应收未收金额",
          key: "overdueMoney",
          render: (h, data, row) => {
            return this.$toMoney(data);
          }
        },
        {
          label: "确认日期",
          key: "startDate",
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
        { label: "逾期天数", key: "overdueDay" },
        {
          label: "当前状态",
          key: "status",
          render: (h, data, row) => {
            return data ? "未逾期" : "逾期";
          }
        },
        {
          label: "风险提示时间",
          key: "createDate",
          render: (h, data, row) => {
            return data ? data.substr(0, 10) : "-";
          }
        },
        {
          label: "提示状态",
          key: "state",
          render: (h, data, row) => {
            return data === "0" ? "待确认" : data === "1" ? "已采纳" : data === "2" ? "已忽略" : "-";
          }
        }
      ],
      colAmount: [
        { label: "申请编码", key: "applyCode" },
        { label: "应收编码", key: "receivableCode" },
        { label: "应收未收金额", key: "overdueMoney" },
        {
          label: "确认日期",
          key: "startDate",
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
          label: "累计逾期金额",
          key: "allOverdueMoney",
          render: (h, data, row) => {
            return this.$toMoney(data);
          }
        },
        {
          label: "当前状态",
          key: "status",
          render: (h, data, row) => {
            return data ? "未逾期" : "逾期";
          }
        },
        {
          label: "风险提示时间",
          key: "createDate",
          render: (h, data, row) => {
            return data ? data.substr(0, 10) : "-";
          }
        },
        {
          label: "提示状态",
          key: "state",
          render: (h, data, row) => {
            return data === "0" ? "待确认" : data === "1" ? "已采纳" : data === "2" ? "已忽略" : "-";
          }
        }
      ]
    };
  },
  methods: {
    Api_customerRecord,
    Api_customerBroken,
    Api_customerOperation,
    Api_customerOverdueDay,
    Api_customerOverdueMoney,
    /**
     * @rr row data
     */
    open(rr) {
      this.form = rr;
      const laoding = this.$openLoading();
      Api_GetCustomerDetail(rr.id)
        .then(res => {
          laoding.close();
          this.detail = res;
          this.$refs.ref_BusinessApplication.fetchData();
          this.$refs.ref_customerBroken.fetchData();
          this.$refs.ref_customerOperation.fetchData();
          this.$refs.ref_customerOverdueDay.fetchData();
          this.$refs.ref_customerOverdueMoney.fetchData();
        })
        .catch(res => {
          laoding.close();
        });
    },
    back() {
      this.$emit("hideBadCustomerDetail");
    },
    /**
     * @itemIndex
     */
    renderComp(itemIndex) {
      this.subSelectIndex = itemIndex;
      const routerViewContainer = document.getElementById("router-view").parentNode.parentNode;
      const h4Titles = this.$el.querySelectorAll(".tab-tab");
      const { top: titleTop } = getOffset(h4Titles[itemIndex]);
      routerViewContainer.scrollTop = titleTop - 80;
    }
  }
};
</script>

<style lang="scss" scoped>
$color-primary: #4b9df3;

.menu-selected-sub {
  // padding: 14px 21px;
  // border: 1px solid #eaedf4;
  border-top: none;
  display: flex;

  .el-button {
    border-radius: 0;
    background-color: #f7f8fb;
    color: #606266;
    padding: 9px 11px;
    font-size: 13px;
    margin-right: 10px;

    &:last-child {
      margin-right: 0;
    }

    &.selected {
      background-color: $color-primary;
      color: #fff;
      border-color: $color-primary;
    }
  }
}
</style>
