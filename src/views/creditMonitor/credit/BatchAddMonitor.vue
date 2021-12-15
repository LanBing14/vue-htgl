<template>
  <Dialog
    ref="drawer"
    title="批量添加监测"
    width="1000px"
    :visible.sync="visible"
    :onOk="confirmDialog"
    @close="cancelDialog"
    class="size-btn-change"
  >
    <div v-loading="loading">
      <el-form ref="form" :model="form" label-width="75px" label-position="left">
        <el-form-item label="企业分组">
          <el-select
            v-model="form.groupIds"
            multiple
            placeholder="请选择客户分组"
            style="width: 250px"
            @change="setAllIds"
          >
            <el-option
              v-for="item in groupIdsOptions"
              :key="item.id"
              :label="item.group_name"
              :value="item.id"
            ></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <el-row>
        <el-col :span="14">
          <div>
            <el-radio-group v-model="filterStatus" size="small" class="button-group" @change="changeFilter">
              <el-radio-button label="1">全部 ({{tableData.length}})</el-radio-button>
              <el-radio-button label="2">校验成功 ({{tableData.filter((item) => item.isFxb).length}})</el-radio-button>
              <el-radio-button label="3">校验失败 ({{tableData.filter((item) => !item.isFxb).length}})</el-radio-button>
              <el-radio-button label="4">企业重复 ({{tableData.filter((item) => item.isExist).length}})</el-radio-button>
            </el-radio-group>
          </div>
        </el-col>
        <el-col :span="10">
          <div style="text-align: right">
            <a
              class="canClick"
              style="line-height: 32px; margin-right: 12px"
              :href="baseUrl+fxb+'/ecm/company-monitor/download'"
            >模版下载</a>
            <el-upload
              v-show="false"
              :headers="uploadHeaders"
              :action="baseUrl+fxb+'/ecm/company-monitor/excel-batchMonitor'"
              name="excelFile"
              :on-preview="handlePreview"
              :on-remove="handleRemove"
              :before-remove="beforeRemove"
              :on-success="handleUploadSuccess"
              multiple
              :limit="1"
              :on-exceed="handleExceed"
              :file-list="uploadList"
            >
              <el-button size="small" type="success" ref="ref_upload">批量导入</el-button>
            </el-upload>
            <div  style="display:inline-block" id="upload-btn-size">
                <el-button type="primary" @click="batchImport">批量导入</el-button>
            </div>
           
          </div>
        </el-col>
      </el-row>
      <el-table :data="tableDataFiltered" style="width: 100%; margin-top: 8px">
        <el-table-column label="序号" type="index" width="50" align="center"></el-table-column>
        <el-table-column label="企业名称">
          <template slot-scope="scope" :prop="'tableDataFiltered.'+scope.$index+'.name'">
            <div style="display: flex">
              <div style="flex: 1">
                <el-input v-model="scope.row.name" @change="checkIsFxb(scope.row)"></el-input>
              </div>
              <div style="flex: 0 20px; line-height: 30px; text-align: right">
                <i
                  v-if="scope.row.isFxb===true&&scope.row.isExist===false"
                  class="el-icon-check"
                  style="color: #67C23A"
                ></i>
                <i
                  v-if="scope.row.isFxb===false||scope.row.isExist===true"
                  class="el-icon-close"
                  style="color: #F56C6C"
                ></i>
                <i v-if="scope.row.isFxb===null" class="el-icon-loading"></i>
              </div>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="统一社会信用代码" width="170">
          <template slot-scope="scope">
            <span>{{scope.row.creditCode||'-'}}</span>
          </template>
        </el-table-column>
        <el-table-column label="法定代表人" width="100">
          <template slot-scope="scope">
            <span>{{scope.row.operName||'-'}}</span>
          </template>
        </el-table-column>
        <el-table-column label="企业状态" width="80">
          <template slot-scope="scope">
            <span>{{scope.row.status||'-'}}</span>
          </template>
        </el-table-column>
        <el-table-column label="企业分组">
          <template slot-scope="scope" :prop="'tableDataFiltered.'+scope.$index+'.groupIds'">
            <el-select
              v-model="scope.row.groupIds"
              multiple
              placeholder="请选择客户分组"
              style="width: 100%"
              size="small"
            >
              <el-option
                v-for="item in groupIdsOptions"
                :key="item.id"
                :label="item.group_name"
                :value="item.id"
              ></el-option>
            </el-select>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="70" align="center">
          <template slot-scope="scope">
            <el-button
              circle
              icon="el-icon-minus"
              @click="deleteBussiness(scope.row, scope.$index)"
              style="padding: 4px"
              type="danger"
            ></el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
  </Dialog>
</template>

<script>
import { fxb } from "@/utils/variables";
import { getToken } from "@/utils/auth";
import { Api_GetCustomerGroup } from "@/api/creditManagement/customerProfile/customerManagement.js";
import { Api_batchAddMonitor } from "@/api/creditManagement/customerProfile/customerManagement.js";
import { Api_CheckCompany } from "@/api/creditManagement/customerProfile/customerManagement.js";
export default {
  name: "BatchAddMonitor",
  data() {
    return {
      fxb,
      baseUrl: process.env.VUE_APP_BASE_API,
      visible: false,
      groupIdsOptions: [],
      form: { groupIds: [] },
      filterStatus: "1",
      filterData: { all: 0, success: 0, fail: 0, repeat: 0 },
      tableData: [],
      tableDataFiltered: [],
      // 文件导入
      uploadHeaders: { Authorization: "Bearer " + getToken() },
      uploadList: [],
      loading: false,
    };
  },
  mounted() {
    Api_GetCustomerGroup().then((res2) => {
      this.groupIdsOptions = res2.filter((i) => i.group_name !== "未分组");
    });
  },
  methods: {
    /**
     * @打开时
     */
    open() {
      this.visible = true;
      this.$nextTick(() => {
        this.tableData = [];
        this.tableDataFiltered = [];
        this.filterStatus = "1";
        this.form.groupIds = [];
      });
    },
    /**
     * @设置所有的企业分组
     */
    setAllIds(val) {
      for (let i = 0; i < this.tableData.length; i++) {
        this.tableData[i].groupIds = val;
      }
      // this.filterStatus = "1";
    },
    /**
     * @查询是否风信标企业
     */
    checkIsFxb(row) {
      if (row.name) {
        row.isFxb = null;
        Api_CheckCompany({ companyName: row.name })
          .then((res) => {
            row.isFxb = res.isFxb;
          })
          .catch((res) => {
            row.isFxb = false;
          });
      } else {
        row.isFxb = false;
      }
    },
    /**
     * @删除其中一项企业
     */
    deleteBussiness(row, index) {
      this.tableData = this.tableData.filter((item) => item.index !== row.index);
      this.changeFilter(this.filterStatus);
    },
    /**
     * @切换筛选条件
     */
    changeFilter(status) {
      if (status === "2") {
        this.tableDataFiltered = this.tableData.filter((item) => item.isFxb);
      } else if (status === "3") {
        this.tableDataFiltered = this.tableData.filter((item) => !item.isFxb);
      } else if (status === "4") {
        this.tableDataFiltered = this.tableData.filter((item) => item.isExist);
      } else {
        this.tableDataFiltered = this.tableData;
      }
    },
    /**
     * @批量导入
     */
    batchImport() {
      this.uploadList = [];
      this.$refs.ref_upload.$el.click();
    },
    /**
     * @提交
     */
    confirmDialog() {
      this.loading = true;
      Api_batchAddMonitor(
        this.tableData
          .filter((item) => item.isFxb && !item.isExist)
          .map((item) => ({
            companyId: item.companyId,
            companyName: item.name,
            creditCode: item.creditCode,
            operName: item.operName,
            isFxb: item.isFxb,
            groupIds: item.groupIds.join(","),
          }))
      )
        .then((res) => {
          this.loading = false;
          this.$message.success(res);
          this.$emit("getList");
          this.visible = false;
        })
        .catch((res) => {
          this.loading = false;
          this.$message.error(res);
        });
    },
    /**
     * @取消
     */
    cancelDialog() {
      this.visible = false;
    },
    /**
     * @文件导入
     */
    handleRemove(file, fileList) {
      console.log(file, fileList);
    },
    handlePreview(file) {
      console.log(file);
    },
    handleExceed(files, fileList) {
      this.$message.warning(`只能上传1个文件！`);
    },
    beforeRemove(file, fileList) {
      return this.$confirm(`确定移除 ${file.name}？`);
    },
    handleUploadSuccess(res) {
      if (res && res.data && res.data.length) {
        this.tableData = res.data.map((item, index) => ({ ...item, index: index + 1 }));
        this.tableDataFiltered = this.tableData;
      } else {
        this.$message.error("解析文件失败，请检查文件是否按照要求填写！");
      }
    },
  },
};
</script>

<style lang="scss" scoped>
/deep/ .button-group {
  .el-radio-button__inner {
    font-size: 14px;
  }
}
</style>