<template>
  <div>
    <div class="btns tr"><el-button type="primary" style="margin-top:16px"  icon="el-icon-bottom" @click="download">下载催款通知单</el-button></div>
    <h2 class="title">催款通知单</h2>
    <div>{{ dunningDeatail.dunningNotice && dunningDeatail.dunningNotice.enterpriseName || '--'}}</div>
    <p class="des">
      以下是贵公司所欠我单位各项费用，请核查。若接到通知后5个工作日还未缴纳所有费用，根据租赁协议规定，将影响贵公司在园内所享受的相关物业服务，谢谢配合！
    </p>
    <h2>欠费明细</h2>
    <template v-for="(item,index) in dunningDeatail.bills">
      <p :key="index">物业位置：{{ item.propertyLocation || '--'}}</p>
       <el-table :summary-method="getSummaries" show-summary :data="dunningDeatail.details[index]" :key="index+'el-table'">
       <el-table-column
        v-for="column in tableCol1"
        :key="column.key"
        :label="column.label"
        :prop="column.key"
         >
     </el-table-column>
     </el-table>
  </template>
    <p>电费信息</p>
      <el-table :data="table" :summary-method="getSummaries"  show-summary>
      <el-table-column
        v-for="column in tableCol2"
        :key="column.key"
        :label="column.label"
        :prop="column.key"
        width="180">
     </el-table-column>
      </el-table>
    <h2>挂账： {{dunningDeatail.gz || '--'}}</h2>
    <el-descriptions :title="`欠费总计（元）：${dunningDeatail.dunningNotice && dunningDeatail.dunningNotice.amountReceivable}`" :column="1">
        <el-descriptions-item label="房租/押金/物业费/电费交费账户">{{dunningDeatail.companyName || '--'}}</el-descriptions-item>
        <!-- <el-descriptions-item label="银行账号">1102021109000142819</el-descriptions-item>
        <el-descriptions-item label="开户行">工行苏州市新区支行</el-descriptions-item> -->
   </el-descriptions>
   <div class="zdlw tr">
        <p>{{dunningDeatail.companyName || '--'}}</p>
        <p>{{curDate}}</p>
   </div>

  </div>
</template>
<script>
import { api_getDunningNoticeDetail, api_downloadgetPreviewPdf } from "@/api/creditManagement/companyAccount/companyAccount";
export default {
  data() {
    return {
      dunningDeatail: {},
      tableCol1: [
        { key: "accountPeriod", label: "时间", align: "left",width:"300px" },
        { key: "rent", label: "房租（元）", align: "left",width:"300px" },
        { key: "propertyCosts", label: "物业管理费（元）", align: "left" ,width:"300px"}
      ],
      tableCol2: [
        { key: "electricityBillDate", label: "时间", align: "left",width:"300px" },
        { key: "electricityBill", label: "电费（元）", align: "left",width:"300px" },
      ],
      table: [],
      curDate: ""
    };
  },
  computed:{
     userInfo () {
        return this.$store.getters.userInfo;
     },
  },
  methods:{
    get0(val){
      if(val<0){
        return `0${val}`
      }
      return val
    },
    getCurrentDate(){
       let date = new Date();
       let curYear = date.getFullYear();
       let curMonth = date.getMonth()+1;
       let curDate = date.getDate();
       return  this.curDate = `${curYear}-${this.get0(curMonth)}-${this.get0(curDate)}`;
    },
    download(){
        api_downloadgetPreviewPdf({id:this.$route.params.id}).then(res => {
            var path = process.env.VUE_APP_FILE_IMG_API+res
            window.location= path
        })
      //window.location = `${process.env.VUE_APP_BASE_API}/park/dunningNotice/getPreviewPdf?id=${this.$route.params.id}&saasCode=${this.userInfo.parkCode}&enterpriseId=${this.userInfo.saasCode}`
        //  window.open(`${process.env.VUE_APP_BASE_API}/park/dunningNotice/getPreviewPdf?id=${this.$route.params.id}&saasCode=${this.userInfo.parkCode}&enterpriseId=${this.userInfo.saasCode}`);
    },
    async getDunningNoticeDetail(){
        this.dunningDeatail  = await api_getDunningNoticeDetail(this.$route.params.id);
        this.table.push({
              electricityBillDate:this.dunningDeatail.dunningNotice.electricityBillDate,
              electricityBill:this.dunningDeatail.dunningNotice.electricityBill
        })
    },
    getSummaries(param){
  const { columns, data } = param;
  console.log(columns)
  console.log(data)
        const sums = [];

        columns.forEach((column, index) => {
          if (index === 0) {
            sums[index] = '合计';
            return;
          }
          const values = data.map(item => Number(item[column.property]));
          if (!values.every(value => isNaN(value))) {
            sums[index] = values.reduce((prev, curr) => {
              const value = Number(curr);
              if (!isNaN(value)) {
                return prev + curr;
              } else {
                return prev;
              }
            }, 0);
            sums[index] += ' 元';
          } else {
            sums[index] = 'N/A';
          }
        });

        return sums;

  },
  },
   mounted(){
    this.getCurrentDate();
    this.getDunningNoticeDetail()
  }
};
</script>
<style scoped lang="scss">
.title {
  text-align: center;
}
h2{
    font-size: 16px;
    font-weight: 700;
    margin: 20px 0;
}
.des{
    text-indent: 2em;
}
p{

     line-height: 32px;
}
.tr{

    text-align: right;
}
</style>
