<template>
  <Dialog ref="drawer" title="添加企业" class="size-btn-change" :visible.sync="visible" :btns="drawerBtns" width="500px" @close="onClose">
    <el-form ref="form" :model="form" :rules="rules" label-width="90px" v-loading="loading">
      <el-form-item label="企业名称" prop="companyName">
        <el-autocomplete
          v-model="form.companyName"
          :fetch-suggestions="querySearchAsync"
          placeholder="请输入企业全称"
          style="width: 100%"
          :disabled="isAddMsg">
          <!--@blur="checkName"-->
        </el-autocomplete>
        <!--<el-popover-->
          <!--placement="top-start"-->
          <!--width="200"-->
          <!--trigger="hover"-->
          <!--content="企业名称核验成功"-->
          <!--v-if="isCheckNameSuccess&&checkOnce"-->
        <!--&gt;-->
          <!--<i-->
            <!--class="el-alert__icon el-icon-success"-->
            <!--slot="reference"-->
            <!--style="position: absolute; right: 6px; top: 10px; color: #67C23A"-->
          <!--&gt;</i>-->
        <!--</el-popover>-->
        <!--<el-popover-->
          <!--placement="top"-->
          <!--width="200"-->
          <!--trigger="hover"-->
          <!--content="该名称在风信标企业库查询不到"-->
          <!--v-if="!isCheckNameSuccess&&checkOnce"-->
        <!--&gt;-->
          <!--<i-->
            <!--class="el-alert__icon el-icon-info"-->
            <!--slot="reference"-->
            <!--style="position: absolute; right: 6px; top: 10px; color: #909399"-->
          <!--&gt;</i>-->
        <!--</el-popover>-->
      </el-form-item>
      <el-form-item label="企业分组" prop="groupIds">
        <el-select
          v-model="form.groupIds"
          multiple
          placeholder="未分组"
          style="width: 100%"
          @change="checkIsBloc"
        >
          <el-option v-for="item in groupIdsOptions" :key="item.id" :label="item.group_name" :value="item.id"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="关联集团" prop="pid">
        <el-select
          v-model="form.pid"
          clearable
          placeholder="请选择"
          style="width: 100%"
          :disabled="form.groupIds.indexOf('c4608ef8-8007-43f5-9a2d-90daa57f1e50')!==-1"
        >
          <el-option v-for="item in groupsOptions" :key="item.id" :label="item.companyName" :value="item.id"></el-option>
        </el-select>
      </el-form-item>
    </el-form>
    <!--<div style="text-align: center">
            <el-checkbox v-model="isApplication">添加客户时同步申请风信标企业信用报告</el-checkbox>
    </div>-->
  </Dialog>
</template>

<script>
    import {
        Api_CheckCompany,
        Api_GetCustomerGroup,
        Api_GetGroups,
        Api_SaveCustomer,
        Api_SaveCustomerId,
        Api_SearchCompany,
    } from "@/api/creditManagement/customerProfile/customerManagement.js";
    import {Api_CustomerArchivesUpDate} from "@/api/creditManagement/customerProfile/customerManagemCustomer/baseInfo.js";

    export default {
  name: "AddBusiness",

  props:['formData'],
  data() {
    return {
      visible: false,
      form: {
        companyId: "",
        companyName: "",
        groupIds: [],
        isFxb: 0,
        isTb: 0,
        pid: "",
        creditCode: null,
      },
      rules: {
        companyName: [{ required: true, message: "请输入企业全称" }],
      },
      groupsOptions: [],
      groupIds: [],
      isCheckNameSuccess: false,
      checkOnce: false,
      companyNameOptions: [],
      timeout: null,
      state: "",
      groupIdsOptions: [],
      isApplication: true,
      loading: false,
      drawerBtns: [
        {
          text: "确定",
          type: "primary",
          click: () => {
            this.$refs["form"].validate((valid) => {
                if (valid) {
                if (!this.form.companyName) {
                    return false;
                }
                const loading = this.$openLoading();
                Api_CheckCompany({companyName: this.form.companyName}).then((res) => {
                    this.checkOnce = true;
                    if (res.isFxb) {
                        this.form.isFxb = res.isFxb;
                        this.isCheckNameSuccess = true;
                    } else {
                        this.isCheckNameSuccess = false;
                    }
                    this.form.companyId = res.companyId;
                    this.form.companyName = res.companyName;
                    this.form.operName = res.operName;
                    this.form.status = res.status;
                    this.form.creditCode = res.creditCode;
                    if (!res.isFxb) {
                        this.$confirm("该名称在风信标企业库查询不到，确定提交？", "提示", {
                            confirmButtonText: "确定",
                            cancelButtonText: "取消",
                            type: "warning",
                        }).then(() => {
                            this.addCustomer();
                           
                        }).catch(() => {
                            loading.close();
                        });
                    } else {
                        this.addCustomer();
                        
                    }
                });
            }
            else {
                    return false;
                }
            });
          },
        },
        {
          text: "取消",
          click: () => {
            this.visible = false;
          },
        },
      ],
      addMsg: {},
      isAddMsg: false,
    };
  },
  watch:{
    formData:{
      handler(value){
        if(value){
          this.form.companyName=value.companyName
        }
      },
      deep:true,
      immediate:true
    }
  },
  methods: {
    open(_a, _s) {
      if(this.formData){
         this.form.companyName=this.formData.companyName
      }

      this.visible = true;
      this.addMsg = _a;
      this.isAddMsg = _s;
      this.loading = true;
      Api_GetGroups()
        .then((res) => {
          this.loading = false;
          this.groupsOptions = res;
        })
        .catch((res) => {
          this.loading = false;
        });
      Api_GetCustomerGroup().then((res2) => {
        this.groupIdsOptions = res2.filter((i) => i.group_name !== "未分组");
        if (_s) {
          this.$nextTick(() => {
            this.form.groupIds = _a.options.map((item) => item.id);
            Api_CheckCompany({ companyName: _a.name }).then((res) => {
              this.checkOnce = true;
              if (res.isFxb) {
                this.form.isFxb = res.isFxb;
              }
              if (!res.isFxb) {
                this.isCheckNameSuccess = false;
              } else if (res.isFxb) {
                this.isCheckNameSuccess = true;
              }
              this.form.companyId = res.companyId;
              this.form.companyName = res.companyName;
              this.form.operName = res.operName;
              this.form.status = res.status;
              this.form.creditCode = res.creditCode;
            });
          });
        }
      });
    },
    checkName() {
      setTimeout(() => {
        this.$nextTick(() => {
          if (!this.form.companyName) {
            return false;
          }
          Api_CheckCompany({ companyName: this.form.companyName }).then((res) => {
            this.checkOnce = true;
            if (res.isFxb) {
              this.form.isFxb = res.isFxb;
            }
            if (!res.isFxb) {
              this.isCheckNameSuccess = false;
            } else if (res.isFxb) {
              this.isCheckNameSuccess = true;
            }
            this.form.companyId = res.companyId;
            this.form.companyName = res.companyName;
            this.form.operName = res.operName;
            this.form.status = res.status;
            this.form.creditCode = res.creditCode;
          });
        });
      }, 300);
    },
    querySearchAsync(queryString, cb) {
      this.checkOnce = false;
      this.isCheckNameSuccess = false;
      this.form.isFxb = 0;
      this.form.companyId = "";
      if (queryString !== "") {
        setTimeout(() => {
          Api_SearchCompany({ companyName: queryString }).then((res) => {
            this.companyNameOptions = res.returnData;
            for (let i = 0; i < this.companyNameOptions.length; i++) {
              this.companyNameOptions[i].value = this.companyNameOptions[i].name;
            }
            var results = this.companyNameOptions;
            cb(results);
          });
        }, 200);
      } else {
        cb([]);
      }
    },
    checkIsBloc() {
      if (this.form.groupIds.indexOf("c4608ef8-8007-43f5-9a2d-90daa57f1e50") !== -1) {
        this.form.pid = "";
      }
    },
      addCustomer(){
          const loading = this.$openLoading();
          if (this.isApplication) {
              this.form.isTb = 1;
              // if (!this.isCheckNameSuccess) {
              //   this.$message.error("该名称在风信标企业库查询不到，无法同步企业信息报告。");
              //   return false;
              // }
          } else {
              this.form.isTb = 0;
          }
          Api_SaveCustomerId({
              companyId: this.form.companyId,
              companyName: this.form.companyName,
              groupIds: this.form.groupIds.join(","),
              isFxb: this.form.isFxb,
              isTb: this.form.isTb,
              pid: this.form.pid,
              isBloc: this.form.groupIds.indexOf("c4608ef8-8007-43f5-9a2d-90daa57f1e50") !== -1,
              operName: this.form.operName,
              status: this.form.status,
              creditCode: this.form.creditCode,
          })
              .then((res) => {
                  this.onClose();
                  this.$message.success("添加成功！");
                  this.visible = false;
                  this.$emit("getList", res);
                  loading.close();
                  this.$emit('reload')
                  Api_CustomerArchivesUpDate(this.form.companyId).then((res) => {});
              })
              .catch((res) => {
                  loading.close();
                  this.$message.error(res);
              });
      },
    onClose() {
      // 置空 BEGIN
      this.form = {
        companyId: "",
        companyName: "",
        operName: "",
        status: "",
        groupIds: [],
        isFxb: 0,
        isTb: 0,
        pid: "",
      };
      this.checkOnce = false;
      // 置空 END
      if(this.$refs.form){
        this.$refs.form.resetFields();
      }
      
    },
    // handleSelect() {
    //   this.checkOnce = true;
    //   this.isCheckNameSuccess = true;
    //   this.form.isFxb = "1";
    //   for (let i = 0; i < this.companyNameOptions.length; i++) {
    //     if (this.companyNameOptions[i].company_name === this.form.companyName) {
    //       this.form.companyId = this.companyNameOptions[i].company_id;
    //       break;
    //     }
    //   }
    // }
  },
};
</script>

<style lang="scss" scoped>
.name-check {
  color: #4a9df2;
  cursor: pointer;
  line-height: 40px;
  text-align: center;
}

/deep/ .el-tag.el-tag--info .el-tag__close {
  color: #fff;
}
</style>

