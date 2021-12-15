<template>
  <div class="accountNoteDetails">
    <div class="location">物业位置: {{tableData.length && tableData[0].WYWZ || '--'}}</div>
    <div class="accountDetails">
      <div class="item">
        <i class="iconfontCXCY icon-jine2 color5e9dec"></i
        >&nbsp;&nbsp;应付金额<br />
        <b class="color5e9dec">{{jsStatistics.YSJE}}</b>&nbsp;&nbsp;元
      </div>
      <div class="item">
        <i class="iconfontCXCY icon-jine2 color8fc585"></i
        >&nbsp;&nbsp;已付金额<br />
        <b class="color8fc585">{{jsStatistics.LJJY}}</b>&nbsp;&nbsp;元
      </div>
      <div class="item">
        <i class="iconfontCXCY icon-jine2 colord9544e"></i
        >&nbsp;&nbsp;欠费金额<br />
        <b class="colord9544e">{{jsStatistics.QKJE}}</b>&nbsp;&nbsp;元
      </div>
    </div>
    <div class="mt20 tab-wrap">
      <h3>应收账单</h3>
      <el-table :border="true" class="mt20" :data="tableData" style="width: 100%">
        <el-table-column prop="CONTRACT_NO" label="合同编号" width="180">
        </el-table-column>
        <el-table-column prop="ACCOUNT_TYPE" label="费用类型" width="180">
            <template slot-scope="scope">
               {{scope.row.ACCOUNT_TYPE ==='0' ? '租金' : scope.row.ACCOUNT_TYPE === '1'?'物业费': scope.row.ACCOUNT_TYPE === '2'? '保证金':'其他出账'}}
            </template>
        </el-table-column>
        <el-table-column prop="CHARGING_START_TIME" label="计费开始日期"> </el-table-column>
        <el-table-column prop="CHARGING_END_TIME" label="计费截止日期"> </el-table-column>
        <el-table-column prop="RECEIVABLE_FEE" label="应付金额"> </el-table-column>
      </el-table>
    </div>
  </div>
</template>
<script>
export default {
  props: {
    tableData: {
      type: Array
    },
    jsStatistics: {
      type:Object
    }
  },
};
</script>
<style scoped lang="scss">
.location {
  font-size: 16px;
}
.accountNoteDetails {
  margin-top: 20px;
}
.accountDetails {
  height: 80px;
  margin-top: 10px;
  line-height: 32px;
  display: flex;
  align-items: center;
}
.accountDetails .item {
  margin-right: 80px;
}
</style>