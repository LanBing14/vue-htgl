<template>
  <div id="FinancingNeedsBox">
    <el-row>
      <el-col :span="2" style="line-height: 30px;">办理进度：</el-col>
      <el-col :span="10">
        <div id="progressStateBox">
          <el-radio-group v-model="progressState" size="small">
            <el-radio-button label="全部"></el-radio-button>
            <el-radio-button label="未发布"></el-radio-button>
            <el-radio-button label="待处理"></el-radio-button>
            <el-radio-button label="已撤销"></el-radio-button>
            <el-radio-button label="已签约"></el-radio-button>
            <el-radio-button label="已下线"></el-radio-button>
          </el-radio-group>
        </div>
      </el-col>
      <el-col :span="12" style="text-align: right;">
        <el-button icon="el-icon-document" size="small">发布融资需求</el-button>
      </el-col>
    </el-row>
    <br />
    <el-table :data="tableData" stripe style="width: 100%">
      <el-table-column prop="date" label="发布日期"></el-table-column>
      <el-table-column prop="size" label="需求规模（万元）"></el-table-column>
      <el-table-column prop="month" label="用款期限（月）"></el-table-column>
      <el-table-column prop="useType" label="资金用途"></el-table-column>
      <el-table-column prop="progress" label="办理进度"></el-table-column>
      <el-table-column prop="operation" label="操作">
        <template slot-scope="scope">
          <el-button size="mini" type="text" @click="showDetail(scope.row.ID)">查看</el-button>
          <el-button size="mini" type="text" @click="showDetail(scope.row.ID)">编辑</el-button>
          <el-button size="mini" type="text" @click="showDetail(scope.row.ID)">撤销</el-button>
        </template>
      </el-table-column>
    </el-table>
    <br />
    <el-pagination
      class="fxb-page"
      v-show="totalRecords>0"
      :total="totalRecords"
      :page-size="pageSize"
      :current-page.sync="pageNo"
      @current-change="changeCurrentPage"
    />

    <el-dialog
      title="融资需求查看"
      :visible.sync="dialogVisible"
      :close-on-click-modal="false"
      width="470px"
      :before-close="beforeBatchSetClose"
    >
      <el-row>
        <el-col :span="4" style="line-height: 30px;">发布时间：</el-col>
        <el-col :span="20" style="line-height: 30px;">2019-4-9 14:21:36</el-col>
      </el-row>
      <el-row>
        <el-col :span="4" style="line-height: 30px;">办理进度：</el-col>
        <el-col :span="20" style="line-height: 30px;">待处理</el-col>
      </el-row>

      <br />
      <el-tabs
        type="card"
        id="dialogTabs"
        v-model="dialogActiveName"
        @tab-click="dialogHandleClick"
      >
        <el-tab-pane label="融资需求" name="first">
          <el-row>
            <el-col :span="5" style="line-height: 30px;">需求规模：</el-col>
            <el-col :span="19" style="line-height: 30px;">500.00万元</el-col>
          </el-row>
          <el-row>
            <el-col :span="5" style="line-height: 30px;">用款期限：</el-col>
            <el-col :span="19" style="line-height: 30px;">12个月</el-col>
          </el-row>
          <el-row>
            <el-col :span="5" style="line-height: 30px;">资金用途：</el-col>
            <el-col :span="19" style="line-height: 30px;">研发投入</el-col>
          </el-row>
          <el-row>
            <el-col :span="5" style="line-height: 30px;">担保方式：</el-col>
            <el-col :span="19" style="line-height: 30px;">抵押</el-col>
          </el-row>
        </el-tab-pane>
        <el-tab-pane label="报送信息" name="second">
          <el-row>
            <el-col :span="5" style="line-height: 30px;">征信报告：</el-col>
            <el-col :span="19" style="line-height: 30px;">
              <a href="javascript:void(0);">2018年财务报表.xlsx</a>
              <a href="javascript:void(0);">2018年财务报表.xlsx</a>
              <a href="javascript:void(0);">2018年财务报表.xlsx</a>
              <a href="javascript:void(0);">2018年财务报表.xlsx</a>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="5" style="line-height: 30px;">财务报告：</el-col>
            <el-col :span="19" style="line-height: 30px;">
              <a href="javascript:void(0);">2018年财务报表.xlsx</a>
            </el-col>
          </el-row>
        </el-tab-pane>
        <el-tab-pane label="签约情况" name="third">
          <div class="signBox">
            <span>签约机构</span>
            <span>1</span>
            <span>签约产品</span>
            <span>1</span>
            <span>放贷金额</span>
            <span>
              1
              <i class="unit" style="color: #409efe;">万元</i>
            </span>
            <span>年化利率</span>
            <span>
              1
              <i class="unit">(%)</i>
            </span>
            <span>担保方式</span>
            <span>1</span>
            <span>用款期限</span>
            <span>
              1
              <i class="unit">个月</i>
            </span>
            <span>签约时间</span>
            <span>1</span>
            <span>放款时间</span>
            <span>1</span>
          </div>
        </el-tab-pane>
      </el-tabs>

      <div slot="footer" class="dialog-footer" style="text-align: center;">
        <el-button type="primary" :loading="batchSetLoading" size="small">确定</el-button>
        <el-button @click="beforeBatchSetClose" size="small">取消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: "FinancingNeeds",
  components: {},
  data() {
    return {
      progressState: "全部",
      tableData: [
        {
          date: "2016-05-02",
          size: "10.00万元",
          month: "12",
          useType: "扩大生产",
          progress: "待处理"
        },
        {
          date: "2016-05-04",
          size: "102.00万元",
          month: "12",
          useType: "扩大生产",
          progress: "待处理"
        },
        {
          date: "2016-05-01",
          size: "100.00万元",
          month: "12",
          useType: "扩大生产",
          progress: "待处理"
        },
        {
          date: "2016-05-03",
          size: "1000.00万元",
          month: "12",
          useType: "扩大生产",
          progress: "待处理"
        }
      ],
      pageNo: 1,
      pageSize: 10,
      totalRecords: 1,
      dialogVisible: false,
      dialogActiveName: "first",
      batchSetLoading: false
    };
  },
  methods: {
    showDetail() {
      this.dialogVisible = true;
    },
    dialogHandleClick() {},
    beforeBatchSetClose() {
      this.dialogVisible = false;
    },
    changeCurrentPage() {}
  }
};
</script>

<style rel="stylesheet/scss" lang="scss">
#progressStateBox {
  .el-radio-button .el-radio-button__inner {
    border: none;
  }
  .el-radio-button__orig-radio:checked + .el-radio-button__inner {
    background: none;
    color: #4b9df3;
    box-shadow: none;
  }
}
.usercenter-container #dialogTabs {
  .el-tabs__nav-wrap {
    border-radius: 5px;
  }
  .el-tabs__item {
    padding: 0 43px;
    font-size: 14px;
    line-height: 40px;
    color: #333333;
    &.is-active {
      background-color: #409efe;
      color: #ffffff;
    }
  }
  .el-tabs__header {
    margin-bottom: 0;
  }
  .el-tabs__content {
    padding: 20px 0;
  }
}
</style>

<style rel="stylesheet/scss" lang="scss" scoped>
.usercenter-container #dialogTabs {
  a {
    color: #409efe;
  }
}
.signBox {
  display: flex;
  flex-wrap: wrap;
  border: 1px solid #e0e3ec;
  border-bottom: none;
  span {
    flex: 0 0 25%;
    line-height: 40px;
    border-bottom: 1px solid #e0e3ec;
    position: relative;
    &:nth-child(odd) {
      background-color: #f7f8fc;
      text-align: center;
    }
    &:nth-child(even) {
      padding: 0 10px;
    }
    .unit {
      position: absolute;
      right: 10px;
      top: 0;
      bottom: 0;
      font-style: normal;
      font-size: 12px;
    }
  }
}
</style>
