<template>
  <div>
    <div class="page-header">
      <h1 class="page-name">
        <span>信用评估记录</span>
      </h1>
      <div>
        <el-button @click="handleAdd"  class="btn-color-blue" icon="el-icon-plus">创建评估记录</el-button>
      </div>
    </div>
    <div class="page-content">
      <el-form ref="searchForm" :model="listQuery" :inline="true">
        <el-form-item prop="companyName">
          <el-input v-model="listQuery.companyName" placeholder="企业名称" class="filter-item" />
        </el-form-item>
        <!--                <el-form-item prop="groupId">-->
        <!--                    <el-select v-model="listQuery.groupId" placeholder="企业分组">-->
        <!--                        <el-option v-for="(el,index) in companyGroup" :key="index" :value="el.id"-->
        <!--                                   :label="el.group_name"></el-option>-->
        <!--                    </el-select>-->
        <!--                </el-form-item>-->
        <el-form-item prop="status">
          <el-select v-model="listQuery.status" placeholder="评估状态">
            <el-option value="0" label="待评估"></el-option>
            <el-option value="1" label="已完成"></el-option>
             <el-option value="-1" label="无效"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-date-picker
            v-model="dateArr"
            type="daterange"
            value-format="yyyy-MM-dd"
            range-separator="-"
            start-placeholder="评估日期起"
            end-placeholder="评估日期止"
          ></el-date-picker>
          <!--                    <el-date-picker-->
          <!--                        v-model="listQuery.startDate"-->
          <!--                        :picker-options="pickerOptionsStart"-->
          <!--                        value-format="yyyy-MM-dd"-->
          <!--                        type="date"-->
          <!--                        placeholder="请选择评估日期起">-->
          <!--                    </el-date-picker>-->
        </el-form-item>
        <!--                <el-form-item prop="endDate">-->
        <!--                    <el-date-picker-->
        <!--                        v-model="listQuery.endDate"-->
        <!--                        :picker-options="pickerOptionsEnd"-->
        <!--                        value-format="yyyy-MM-dd"-->
        <!--                        type="date"-->
        <!--                        placeholder="请选择评估日期止">-->
        <!--                    </el-date-picker>-->
        <!--                </el-form-item>-->
        <el-form-item class="btns">
          <el-button class="filter-item" type="primary" @click="handleFilter">查询</el-button>
          <el-button class="filter-item" @click="handleReset">重置</el-button>
        </el-form-item>
      </el-form>
      <div class="page-content-body">
        <TableWrapper
          ref="table"
          :fetchDataFn="Api_EvaluateRecordPage"
          :query="listQuery"
          :columns="tableCol"
        />
      </div>
    </div>
    <CreateUpdate ref="createUpdate" :companyGroup="companyGroup" @getList="getList"></CreateUpdate>
    <History ref="history"></History>
  </div>
</template>

<script type="text/jsx">
import Button from "@/components/Button";
import CreateUpdate from "./CreateUpdate";
import History from "./History";
import { Api_GetCustomerGroup } from "@/api/creditManagement/customerProfile/customerManagement";
import {
  Api_EvaluateRecordPage,
  Api_EvaluateRecordModel,
  Api_setVoid,
} from "@/api/creditManagement/creditEstimate/record";

export default {
  name: "Main",
  components: { CreateUpdate, History },
  data() {
    const userID = this.$store.state.user.userInfo.id;
    return {
      dateArr: [],
      companyGroup: [], // 企业分组下拉框数据
      listQuery: {
        companyName: "", // 企业(客户)名称
        // groupId: "", // 企业(客户)id
        status: "", // 评估状态 (0未完成 1已完成 ''全部)
        startDate: "", // 开始时间
        endDate: "", // 结束时间
      },
      tableCol: [
        {
          key: "companyName",
          label: "企业名称",
          align: "left",
          props: { "show-overflow-tooltip": true, "min-width": 150 },
          render: (h, data, row) => {
            return (
              <div class="canClick ellipsis" onClick={this.$gotoCustomerDetail.bind(this, row.companyId)}>
                {data}
              </div>
            );
          },
        },{
              key: "evalCode",
              label: "评估编号",
              align: "left",
              props: { "show-overflow-tooltip": true, "min-width": 150 },
              render: (h, data, row) => {

                if(data){
                  return (
                      <div class="canClick ellipsis" onClick={this.handleDetail.bind(this, row)}>
                          {data}
                      </div>)
                }else{
                  return (<div>-</div>)
                }
               
              },
          },
        {
          key: "modelName",
          label: "模型名称",
          render: (h, data) => {
            return data !== null ? data : "-";
          },
        },
        {
          key: "score",
          label: "信用评分",
          render: (h, data) => {
            return data !== null ? data : "-";
          },
        },
        {
          key: "grade",
          label: "信用等级",
          render: (h, data) => {
            return data || "-";
          },
        },
        {
          key: "username",
          label: "评估人员",
          align: "left",
          render: (h, data, row) => {
            return (
              <el-tooltip effect="dark" content={data + "/" + row.deptName} placement="top">
                <span>{data}</span>
              </el-tooltip>
            );
          },
        },
        {
          key: "status",
          label: "评估状态",
          align: "center",
          render: (h, data, row) => {
            if (row.valid === '0'){
                return "无效";
             } else if(data === "0") {
              return "待评估";
            } else if (data === "1") {
              return "已完成";
            }
          },
        },
        {
          key: "evaluationDate",
          label: "评估时间",
          align: "center",
          render: (h, data, row) => {
            return data ? this.$dateFormat(data, "yyyy-MM-dd") : "-";
          },
        },
        {
          key: null,
          label: "操作",
          width: 150,
          render: (h, data, row) => {
            const { status } = row;
              return [
                  row.valid !== '0' && status !== "1"  && (userID === row.evaluationId|| userID === row.creatorId) ? <el-link type="primary" onClick={this.handleDo.bind(this, row)}> 执行 </el-link>
                      : <el-link type="info" disabled>  执行 </el-link>
                 // ,
                //  status === "0"? <el-link type="primary" onClick={this.setVoid.bind(this, row)}> 置为无效 </el-link>
                      //: <el-link type="info" disabled> 置为无效 </el-link>,
                  //<el-link type="primary" onClick={this.handleHistory.bind(this, row)}> 历史 </el-link>
              ]
          },
        },
      ],
      pickerOptionsStart: {
        disabledDate: (time) => {
          const { endDate } = this.listQuery;
          if (endDate) {
            return time.getTime() > new Date(endDate).getTime();
          } else {
            return false;
          }
        },
      },
      pickerOptionsEnd: {
        disabledDate: (time) => {
          const { startDate } = this.listQuery;
          if (startDate) {
            return time.getTime() < new Date(startDate).getTime();
          } else {
            return false;
          }
        },
      },
    };
  },
  mounted() {
    Api_GetCustomerGroup().then((res) => {
      this.companyGroup = res;
    });
    this.getList();
  },
  methods: {
    Api_EvaluateRecordPage,
    getList(flag) {
      if (this.dateArr) {
        this.listQuery.startDate = this.dateArr[0];
        this.listQuery.endDate = this.dateArr[1];
      } else {
        this.listQuery.startDate = "";
        this.listQuery.endDate = "";
      }
      this.$refs.table.fetchData(flag);
    },
    handleFilter() {
      this.getList(true);
    },
    handleReset() {
      this.dateArr = null;
      this.$refs.searchForm.resetFields();
    },
    // 新增
    handleAdd() {
      if (this.$isVip()) {
        const flag = 3;
        Api_EvaluateRecordModel().then((res) => {
          // false没有，否则就是模型名称
          if (res) {
            this.$refs.createUpdate.open(res);
          } else {
            this.$alert(
              '当前查找不到启用状态的评估模型，请先前往"信用评估"-"评估模型"页面选择评估模型。',
              "提示"
            );
          }
        });
        // if (flag === 1) {
        //     this.$message.warning('当前查找不到启用状态的评估模型，请先前往"信用评估"-"评估模型"页面选择评估模型。');
        //     return;
        // } else if (flag === 2) {
        //     this.$confirm('当前模型选取的部分指标已被编辑,是否同步指标到新模型?', '提示', {
        //         type: 'warning'
        //     }).then(() => {
        //
        //     }).catch(() => {
        //
        //     });
        //     return;
        // }
      } else {
        this.$message.error("当前企业会员已到期，请联系管理员进行续费。");
      }
    },
    setVoid(row) {
      const loading = this.$openLoading();
      Api_setVoid(row.id)
        .then((msg) => {
          this.$message.success(msg);
          loading.close();
          this.getList();
        })
        .catch((e) => {
          this.$message.error(e);
          loading.close();
        });
    },
    // 评估执行
    handleDo(row) {
      this.$emit("edit", true, 1, row);
    },
    // 评估详情
    handleDetail(row) {
      this.$emit("edit", true, 2, row);
    },
    // 评估历史
    handleHistory(row) {
      this.$refs.history.open(row);
    },
  },
};
</script>

<style scoped>
</style>
