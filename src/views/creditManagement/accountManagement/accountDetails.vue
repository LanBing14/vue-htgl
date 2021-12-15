<template>
  <div class="accountDetails">
    <div class="title" style="text-align:right;margin-top:16px">
      <el-button type="primary" icon="el-icon-bottom" @click="download()"
          >下载收款通知单</el-button>
    </div>
    <el-tabs v-model="activeName">
        <el-tab-pane label="收款通知单" name="0">
          <accountNoteDetails :jsStatistics="jsStatistics" :tableData="billList"/>
        </el-tab-pane>
        <!-- <el-tab-pane label="收款通知单" name="1">配置管理</el-tab-pane> -->
  </el-tabs>
  </div>
</template>
<script>
import {api_getjsStatistics,api_getysBillList,api_downloadCreateSktzs} from "@/api/creditManagement/companyAccount/companyAccount"
import accountNoteDetails from "./components/accountNoteDetails"
export default {
  components: {
    accountNoteDetails
  },
  data() {
    return {
        activeName: "0",
        jsStatistics: {},
        billList: []
    };
  },
  created(){
      this.getjsStatistics();
      this.getysBillList();
  },
  methods: {
    async getjsStatistics(){
      this.jsStatistics = await api_getjsStatistics(this.$route.params.id);
    },
    async getysBillList(){
      this.billList = await api_getysBillList(this.$route.params.id);
    },
    download(){

      // window.location
      api_downloadCreateSktzs({id:this.$route.params.id}).then(res => {
            var path = process.env.VUE_APP_FILE_IMG_API+res
            window.location= path
      })
      //window.open(`${process.env.VUE_APP_BASE_API}/park/payment/createSktzs?id=${this.$route.params.id}`);
    }
  }
};
</script>
<style scoped lang="scss">
    .accountDetails{

    }
</style>
