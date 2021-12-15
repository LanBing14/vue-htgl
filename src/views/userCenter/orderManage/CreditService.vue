<template>
  <div class="creditService">
    <el-row class="fxb-table-tool">
      <el-form>
        <el-form-item>
          <el-row :gutter="10" type="flex" align="middle">
            <el-col :span="5">
              <el-select v-model="orderState" placeholder="订单状态" size="small">
                <el-option
                  v-for="item in orderStates"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                ></el-option>
              </el-select>
            </el-col>
            <el-col :span="5">
              <el-input v-model="companyName" placeholder="订单名称" size="small"></el-input>
            </el-col>
            <el-col :span="10">
              <el-date-picker
                v-model="orderDateTime"
                type="daterange"
                size="small"
                style="width: 100%;"
                range-separator="-"
                start-placeholder="订单开始时间"
                end-placeholder="订单结束时间"
                value-format="yyyy-MM-dd"
                format="yyyy-MM-dd"
              ></el-date-picker>
            </el-col>
            <el-col :span="6">
              <el-button type="primary" icon="el-icon-search" @click="searchQuery()" size="small">查询</el-button>
              <el-button icon="el-icon-refresh" size="small" @click="resetSearch()">重置</el-button>
            </el-col>
          </el-row>
        </el-form-item>
      </el-form>
    </el-row>
    <el-row>
      <!-- 表格内容展示开始 -->
      <TableWrapper
        ref="ref_table"
        :fetchDataFn="Api_FindOrderListByPage"
        :tableProps="{class: 'fxb-table'}"
        :query="{
          currentPage: pageNo,
          pageSize: pageSize,
          orderType: '1',
          reportType: reportType,
          orderStatus: orderState,
          orderName: companyName,
          startDate: orderDateTime ? orderDateTime[0] : null,
          endDate: orderDateTime ? orderDateTime[1] : null,
          Classify: 'service'
        }"
        :columns="tableCol"
      />
      <!-- <el-table
        stripe
        class="fxb-table"
        v-loading="listLoading"
        :data="list"
        :expand-row-keys="expands"
        @cell-mouse-enter="handelEnter"
        row-key="id"
      >
        <el-table-column label="订单编号" prop="orderNo" width="150px"></el-table-column>
        <el-table-column label="订单名称" prop="orderName"></el-table-column>
        <el-table-column label="订单状态" prop="orderStatusDesc" width="100px"></el-table-column>
        <el-table-column label="订单金额(元)" prop="orderPrice" align="right" width="150px"></el-table-column>
        <el-table-column label="实付金额(元)" prop="actualAmount" align="right" width="150px"></el-table-column>
        <el-table-column label="订单时间" prop="createDate" width="150px"></el-table-column>
        <el-table-column type="expand" width="1">
          <template slot-scope="props">
            <div class="row-tool-panel">
              <span
                v-if="props.row.orderStatus === '0'"
                @click="openOrderPayDialog(props.row.orderNo, props.row.orderName, props.row.orderPrice, props.row.actualAmount, props.row.createDate, props.row.payType)"
              >
                <svg-icon icon-class="edit" />去付款
              </span>
              <span v-if="props.row.orderStatus === '1' && !props.row.filePath">
                <svg-icon icon-class="edit" />报告生成中
              </span>
              <span
                v-if="props.row.orderStatus === '1' && props.row.filePath"
                @click="handleDownload(props.row.filePath)"
              >
                <svg-icon icon-class="download" />报告下载
              </span>
              <span v-if="props.row.orderStatus === '-1'" @click="deleteOrder(props.row.id)">
                <svg-icon icon-class="delete" />删除
              </span>
            </div>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        class="fxb-page"
        v-show="totalRecords>0"
        :total="totalRecords"
        :page-size="pageSize"
        :current-page.sync="pageNo"
        @current-change="changeCurrentPage"
      />-->
    </el-row>
    <OrderPay ref="orderPayDialog" />
  </div>
</template>

<script>
import {
  Api_DeleteOrder,
  difference,
  Api_DownloadFile,
  Api_FindOrderListByPage,
  Api_GetReportTypeList
} from "@/api/userCenter/orderManage";
import { getUserInfo } from "@/utils/auth";
import { dateFormat } from "@/utils/index";
import OrderPay from "./OrderPay";

export default {
  name: "MyOrder",
  components: {
    OrderPay
  },
  filters: {
    dateFormat
  },
  data() {
    return {
      listLoading: false,
      // 订单开始时间/结束时间
      orderDateTime: [],
      // 报告类型
      reportTypeList: [],
      expands: [],
      // 报告类型值
      reportType: "",
      // 订单状态 0:待付款 1:已付款 -1:已关闭 2:已完成
      orderStates: [
        { value: "0", label: "待付款" },
        { value: "1", label: "已付款" },
        { value: "-1", label: "已关闭" }
      ],
      // 订单状态
      orderState: "",
      // 公司名称
      companyName: "",
      // 列表数据
      list: [],
      pageNo: 1,
      pageSize: 10,
      totalRecords: 10,
      tableCol: [
        { key: "orderNo", label: "订单编号", width: 180 },
        { key: "orderName", label: "订单名称", width: 300, props: { "show-overflow-tooltip": true } },
        { key: "orderStatusDesc", label: "订单状态" },
        {
          key: "orderPrice",
          label: "订单金额(元)",
          align: "right",
          render: (h, data, row) => (data ? this.$toMoney(data) : "0.00")
        },
        {
          key: "actualAmount",
          label: "实付金额(元)",
          align: "right",
          render: (h, data, row) => (data ? this.$toMoney(data) : "0.00")
        },
        { key: "createDate", label: "订单时间", render: (h, data) => (data ? data.substr(0, 10) : "-") },
        {
          key: "",
          label: "操作",
          width: 80,
          render: (h, data, row) => {
            if (row.orderStatus === "0") {
                return(
                 <span  class="btnClass" onClick={this.openOrderPayDialog.bind(
                      this,
                      row.orderNo,
                      row.orderName,
                      row.orderPrice,
                      row.actualAmount,
                      row.createDate,
                      row.payType
                    )}>去付款</span>)
              }else if ( row.orderStatus === "1" && !row.filePath){
                return(<span style="color: #C0C4CC;">已付款</span>)
              }else if ( row.orderStatus === "1" && row.filePath){
                return(<span  class="btnClass" onClick={this.handleDownload.bind(this, row.filePath)} >已付款</span>)
              }else if (row.orderStatus === "-1"){
                return(<span  class="btnClass" onClick={ this.deleteOrder.bind(this, row.id)}>删除</span>)
              }else {
                return ''
              }

            // return (
            //   <button-dropdown
            //     data={[
            //       row.orderStatus === "0" && {
            //         text: "去付款",
            //         click: this.openOrderPayDialog.bind(
            //           this,
            //           row.orderNo,
            //           row.orderName,
            //           row.orderPrice,
            //           row.actualAmount,
            //           row.createDate,
            //           row.payType
            //         )
            //       },
            //       row.orderStatus === "1" &&
            //         !row.filePath && {
            //           text: "已付款",
            //           click: () => {}
            //         },
            //       row.orderStatus === "1" &&
            //         row.filePath && {
            //           text: "已付款",
            //           click: this.handleDownload.bind(this, row.filePath)
            //         },
            //       row.orderStatus === "-1" && {
            //         text: "删除",
            //         click: this.deleteOrder.bind(this, row.id)
            //       }
            //     ]}
            //   />
            // );
          }
        }
      ]
    };
  },
  // 初始化数据
  mounted: function() {
    // 获取分页列表
    this.getPageList();
    // 获取报告类型
    this.getReportTypeList();
  },
  methods: {
    Api_FindOrderListByPage,
    /**
     * 重置搜索条件
     */
    resetSearch() {
      this.orderDateTime = [];
      this.reportType = "";
      this.orderState = "";
      this.companyName = "";
    },
    /**
     * 条件搜索
     */
    searchQuery() {
      this.getPageList();
    },
    /**
     * 报告下载方法
     */
    handleDownload(filePath) {
      Api_DownloadFile(filePath);
    },
    /**
     * 发送邮件
     */
    handleSendEmail() {
      // TODO 发送邮件
    },
    handelEnter(row, column, cell, event) {
      const cindex = this.expands.indexOf(row.id);
      if (!this.tableLock) {
        if (cindex < 0) {
          this.expands.shift();
          this.expands.push(row.id);
        }
      }
    },
    changeCurrentPage() {
      this.getPageList();
    },
    // 获取报告类型
    getReportTypeList() {
      Api_GetReportTypeList().then(data => {
        // 获取数据成功
        for (let i = 0; i < data.length; i++) {
          this.reportTypeList.push({
            value: data[i].typeCode,
            label: data[i].typeName
          });
        }
      });
    },
    // 获取列表数据
    getPageList() {
      // this.listLoading = true;
      // Api_FindOrderListByPage({
      //   currentPage: this.pageNo,
      //   pageSize: this.pageSize,
      //   orderType: "1", // 默认1：自动报告订单类型
      //   reportType: this.reportType,
      //   orderStatus: this.orderState,
      //   orderName: this.companyName,
      //   startDate: this.orderDateTime ? this.orderDateTime[0] : null,
      //   endDate: this.orderDateTime ? this.orderDateTime[1] : null,
      //   Classify: "report"
      // })
      //   .then(data => {
      //     this.listLoading = false;
      //     this.list = data.data;
      //     this.totalRecords = data.totalRecordNumber;
      //   })
      //   .catch(e => {
      //     this.listLoading = false;
      //   });
      this.$refs.ref_table.fetchData();
    },
    // 撤销订单
    deleteOrder(orderId) {
      this.$confirm("确认删除？", "提示", {
        type: "warning"
      }).then(() => {
        Api_DeleteOrder(orderId)
          .then(res => {
            this.getPageList();
            this.$message.success("订单已删除");
          })
          .catch(e => {
            this.$message.error(e);
          });
      });
    },
    // 打开支付弹窗
    openOrderPayDialog(orderNo, companyName, orderPrice, actualAmount, createDate, payType) {
      // 先判断当前时间差是否超过60分钟，如果是，则不能支付
      const diff = difference(createDate);
      if (diff >= 60) {
        this.$message.error("该订单超时未支付，订单已关闭，请重新提交申请");
        return;
      }
      this.$refs.orderPayDialog.openDialog(orderNo, companyName, orderPrice, actualAmount, payType);
    }
  }
};
</script>
<style lang="scss">
.creditService{
  .el-table--fit{
        border-bottom: 1px solid #ebeef5; 
  }
  span.btnClass {
    color:#4b9df3;
    cursor:pointer;
  }
}

</style>