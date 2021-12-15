<script src="../../../../../../新建日记本文档.js"></script>
<template>
  <Dialog ref="viewWin" title="动态详情" append-to-body :visible.sync="visibleView" onlyClose width="500px">
    <el-form
      v-show="isShow === '1'"
      v-loading="win_loading"
      ref="viewForm"
      :model="viewForm"
      label-width="100px"
    >
      <el-form-item label="商标名称">{{ viewForm.name }}</el-form-item>
      <el-form-item label="商标图案">{{ viewForm.imageurl }}</el-form-item>
      <el-form-item label="申请/注册号">{{ viewForm.regno }}</el-form-item>
      <el-form-item label="申请日期">{{ viewForm.appdate | formatDate('yyyy-MM-dd') }}</el-form-item>
      <el-form-item label="申请人名称">{{ viewForm.applicantcn }}</el-form-item>
      <el-form-item label="商标类型">{{ viewForm.intcls }}</el-form-item>
      <el-form-item label="商标状态">{{ viewForm.status }}</el-form-item>
    </el-form>
    <el-form
      v-show="isShow === '2'"
      v-loading="win_loading"
      ref="viewForm"
      :model="viewForm"
      label-width="100px"
    >
      <el-form-item label="专利名称">{{ viewForm.title }}</el-form-item>
      <el-form-item label="公示号">{{ viewForm.publicationnumber }}</el-form-item>
      <el-form-item label="专利类型">{{ viewForm.ipclist }}</el-form-item>
      <el-form-item label="申请（专利权）人">{{ viewForm.assigneestringlist }}</el-form-item>
      <el-form-item label="公开日期">{{ viewForm.publicationdate | formatDate('yyyy-MM-dd')}}</el-form-item>
    </el-form>
    <el-form
      v-show="isShow === '3'"
      v-loading="win_loading"
      ref="viewForm"
      :model="viewForm"
      label-width="100px"
    >
      <el-form-item label="案件编号">{{ viewForm.anno }}</el-form-item>
      <el-form-item label="被执行人">{{ viewForm.name }}</el-form-item>
      <el-form-item label="被执行人履行情况">{{ viewForm.executestatus }}</el-form-item>
      <el-form-item label="法律文书确定的义务">{{ viewForm.yiwu }}</el-form-item>
      <el-form-item label="执行法院">{{ viewForm.executegov }}</el-form-item>
      <el-form-item label="发布时间">{{ viewForm.publicdate | formatDate('yyyy-MM-dd')}}</el-form-item>
    </el-form>
    <el-form
      v-show="isShow === '4'"
      v-loading="win_loading"
      ref="viewForm"
      :model="viewForm"
      label-width="100px"
    >
      <el-form-item label="案号">{{ viewForm.anno }}</el-form-item>
      <el-form-item label="被执行人">{{ viewForm.name }}</el-form-item>
      <el-form-item label="执行法院">{{ viewForm.executegov }}</el-form-item>
      <el-form-item label="执行标的">{{ viewForm.biaodi }}</el-form-item>
      <el-form-item label="立案时间">{{ viewForm.liandate | formatDate('yyyy-MM-dd')}}</el-form-item>
    </el-form>
    <el-form
      v-show="isShow === '5'"
      v-loading="win_loading"
      ref="viewForm"
      :model="viewForm"
      label-width="100px"
    >
      <el-form-item label="当事人">{{ viewForm.party }}</el-form-item>
      <el-form-item label="分类">{{ viewForm.category }}</el-form-item>
      <el-form-item label="公告法院">{{ viewForm.court }}</el-form-item>
      <el-form-item label="公示时间">{{ viewForm.publishdate | formatDate('yyyy-MM-dd') }}</el-form-item>
      <el-form-item label="公告内容">{{ viewForm.content }}</el-form-item>
    </el-form>
    <el-form
      v-show="isShow === '6'"
      v-loading="win_loading"
      ref="viewForm"
      :model="viewForm"
      label-width="100px"
    >
      <el-form-item label="文书编号">{{ viewForm.caseno }}</el-form-item>
      <el-form-item label="标题">{{ viewForm.casename }}</el-form-item>
      <el-form-item label="类型">{{ viewForm.casetype }}</el-form-item>
      <el-form-item label="执行法院">{{ viewForm.court }}</el-form-item>
    </el-form>
    <el-form
      v-show="isShow === '7'"
      v-loading="win_loading"
      ref="viewForm"
      :model="viewForm"
      label-width="100px"
    >
      <el-form-item label="名称">{{ viewForm.name }}</el-form-item>
      <el-form-item label="登记号">{{ viewForm.registerno }}</el-form-item>
      <el-form-item label="著作权人">{{ viewForm.owner }}</el-form-item>
      <el-form-item label="登记日期">{{ viewForm.registeraperdate | formatDate('yyyy-MM-dd')}}</el-form-item>
      <el-form-item label="作品类型">{{ viewForm.category }}</el-form-item>
      <el-form-item label="发布日期">{{ viewForm.publishdate | formatDate('yyyy-MM-dd')}}</el-form-item>
    </el-form>
    <el-form
      v-show="isShow === '8'"
      v-loading="win_loading"
      ref="viewForm"
      :model="viewForm"
      label-width="100px"
    >
      <el-form-item label="决定文书号">{{ viewForm.docno }}</el-form-item>
      <el-form-item label="行政相对人">{{ viewForm.docno }}</el-form-item>
      <el-form-item label="违法行为类型">{{ viewForm.penaltytype }}</el-form-item>
      <el-form-item label="行政处罚内容">{{ viewForm.content }}</el-form-item>
      <el-form-item label="决定单位">{{ viewForm.officename }}</el-form-item>
      <el-form-item label="决定日期">{{ viewForm.penaltydate | formatDate('yyyy-MM-dd')}}</el-form-item>
    </el-form>
    <el-form
      v-show="isShow === '9'"
      v-loading="win_loading"
      ref="viewForm"
      :model="viewForm"
      label-width="100px"
    >
      <el-form-item label="企业名称">{{ viewForm.name }}</el-form-item>
      <el-form-item label="列入异常名录原因">{{ viewForm.addreason }}</el-form-item>
      <el-form-item label="列入日期">{{ viewForm.adddate }}</el-form-item>
      <el-form-item label="做出决定单位">{{ viewForm.decisionoffice }}</el-form-item>
    </el-form>
    <el-form
      v-show="isShow === '10'"
      v-loading="win_loading"
      ref="viewForm"
      :model="viewForm"
      label-width="100px"
    >
      <el-form-item label="登记编号">{{ viewForm.registerno }}</el-form-item>
      <el-form-item label="出质人">{{ viewForm.pledgor }}</el-form-item>
      <el-form-item label="出质股权数额">{{ viewForm.pledgedamount }}</el-form-item>
      <el-form-item label="质权人">{{ viewForm.pledgee }}</el-form-item>
      <el-form-item label="证照/证件号码">{{ viewForm.pledgeeno }}</el-form-item>
      <el-form-item label="登记日期">{{ viewForm.regDate | formatDate('yyyy-MM-dd')}}</el-form-item>
      <el-form-item label="状态">{{ viewForm.statua }}</el-form-item>
    </el-form>
    <el-form
      v-show="isShow === '11'"
      v-loading="win_loading"
      ref="viewForm"
      :model="viewForm"
      label-width="100px"
    >
      <el-form-item label="登记编号">{{ viewForm.registerno }}</el-form-item>
      <el-form-item label="企业名称">{{ viewForm.company_name }}</el-form-item>
      <el-form-item label="登记日期">{{ viewForm.registerdate | formatDate('yyyy-MM-dd')}}</el-form-item>
      <el-form-item label="登记机关">{{ viewForm.registeroffice }}</el-form-item>
      <el-form-item label="被担保债权数额">{{ viewForm.debt_securedamount }}</el-form-item>
      <el-form-item label="状态">{{ viewForm.status }}</el-form-item>
      <el-form-item label="公示日期">{{ viewForm.registerDate | formatDate('yyyy-MM-dd')}}</el-form-item>
    </el-form>
  </Dialog>
</template>

<script>
import { Api_GetDocumentInfo } from "@/api/creditManagement/monitoring/monitoring";
import { parseTime } from '@/utils'
export default {
  name: "ContentDetail",
  filters: {
    formatDate:function (value, fmt) {
      let getDate = new Date(value);
      let o = {
          'M+': getDate.getMonth() + 1,
          'd+': getDate.getDate(),
          'h+': getDate.getHours(),
          'm+': getDate.getMinutes(),
          's+': getDate.getSeconds(),
          'q+': Math.floor((getDate.getMonth() + 3) / 3),
          'S': getDate.getMilliseconds()
      };
      if (/(y+)/.test(fmt)) {
          fmt = fmt.replace(RegExp.$1, (getDate.getFullYear() + '').substr(4 - RegExp.$1.length))
      }
      for (let k in o) {
          if (new RegExp('(' + k + ')').test(fmt)) {
              fmt = fmt.replace(RegExp.$1, (RegExp.$1.length === 1) ? (o[k]) : (('00' + o[k]).substr(('' + o[k]).length)))
          }
      }
      return fmt;
    }
  },
  data() {
    return {
      visibleView: false,
      isShow: null,
      win_loading: false,
      viewForm: {},
    };
  },
  methods: {
    open(row, _isShow) {
      this.isShow = _isShow;
      this.visibleView = true;
      this.$nextTick(() => {
        this.win_loading = true;
        console.log(row)
        Api_GetDocumentInfo(row.monitorContentId, { type: row.typeCode , sercondId: row.sercondId })
          .then((res) => {
            this.win_loading = false;
            this.viewForm = res.result;
          })
          .catch((res) => {
            this.win_loading = false;
            this.$message.error(res);
          });
      });
    },
  },
};
</script>

<style>
</style>
