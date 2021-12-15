<template>
  <div>
    <div class="page-header">
      <h1 class="page-name">
        <span>{{ modelStatus==='add'?'新增合同':modelStatus==='update'?'编辑合同':modelStatus==='change'?'变更合同':'-' }}</span>
      </h1>
      <div>
        <el-button
          v-if="row && (row.editable && row.state === '0')"
          type="danger"
          @click="contractDelete"
        >作废</el-button>

        <el-button @click="closeDialog">返回</el-button>
      </div>
    </div>
    <div class="page-content">
      <ChangeApplication
        v-if="modelStatus==='change'"
        ref="refChangeApplication"
        @trueContractChange="trueContractChange"
        @falseContractChange="falseContractChange"
        :appType="appType"
      ></ChangeApplication>
      <div v-if="!isContractChange">
        <el-form ref="form" :model="form" label-width="120px">
          <el-row>
            <el-col :span="8">
              <el-form-item
                label="合同名称"
                prop="contractName"
                :rules="$createRules({msg:'合同名称',required:true,max:100})"
              >
                <el-input v-model="form.contractName" placeholder="请输入合同名称"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="合同编号" prop="contractCode">
                <el-input v-model="form.contractCode" placeholder="系统生成合同编号，不允许重复" disabled></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="8">
              <el-form-item
                label="客户名称"
                prop="customerId"
                :rules="$createRules({msg:'客户名称',required:true})"
              >
                <el-select
                  v-model="form.customerId"
                  filterable
                  remote
                  reserve-keyword
                  placeholder="请输入关键字查询"
                  :remote-method="remoteMethod"
                  :loading="loading"
                  style="width: 100%"
                  :disabled="modelStatus==='change'"
                  @change="customerNameChange"
                >
                  <el-option
                    v-for="item in clientOptions"
                    :key="item.company_id"
                    :label="item.company_name"
                    :value="item.company_id"
                  ></el-option>
                  <!-- quick Add Customer -->
                  <template slot="empty">
                    <div v-if="loading" style="text-align: center;padding: 28px 10px">加载中</div>
                    <div v-else style="text-align: center; padding: 20px 10px">
                      <span>查询不到相关客户，请</span>
                      <span class="canClick" @click="quickAddCustomer">添加客户</span>
                    </div>
                  </template>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="2" style="line-height: 35px">
              <div style="padding: 0 0 0 8px">
                <span class="canClick" @click="clientProfileDetail">客户档案</span>
              </div>
            </el-col>
          </el-row>
          <EnterpriseFile :enterpriseID="form.customerId" @getPeriod="getPeriod"></EnterpriseFile>
          <el-row>
            <el-col :span="8">
              <el-form-item
                label="合同金额"
                prop="contractAvailable"
                :rules="$createRules({msg:'合同金额',required:true,numberFloatUp:true})"
              >
                <el-input v-model="form.contractAvailable" placeholder="请输入合同总金额">
                  <template slot="append">元</template>
                </el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="8">
              <el-form-item
                label="签约日期"
                prop="signDate"
                :rules="$createRules({msg:'签约日期',required:true})"
              >
                <el-date-picker
                  v-model="form.signDate"
                  type="date"
                  value-format="yyyy-MM-dd"
                  placeholder="请选择合同签约日期"
                  style="width: 100%"
                ></el-date-picker>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item
                label="有效期始"
                prop="effectiveDateStart"
                :rules="$createRules({msg:'有效期始',required:true})"
              >
                <el-date-picker
                  v-model="form.effectiveDateStart"
                  type="date"
                  value-format="yyyy-MM-dd"
                  placeholder="请输入有效日期始"
                  style="width: 100%"
                ></el-date-picker>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item
                label="有效期止"
                prop="effectiveDateEnd"
                :rules="$createRules({msg:'有效期止',required:true})"
              >
                <el-date-picker
                  v-model="form.effectiveDateEnd"
                  type="date"
                  value-format="yyyy-MM-dd"
                  placeholder="请选择有效日期止"
                  style="width: 100%"
                ></el-date-picker>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="合同概述" prop="remark" :rules="$createRules({msg:'合同概述',max:1000})">
                <el-input type="textarea" :rows="4" placeholder="请输入合同概述" v-model="form.remark"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="24">
              <el-form-item label="负责人员">{{deptName}}/{{userName}}</el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="8">
              <el-form-item
                :label="(form.state==0||form.state==1||form.state==2)?'附件(未签章)':'附件(已签章)'"
              >
                <Upload v-model="uploadFileUrls" fileType="pdf" :limit="5" :fileSize="20"></Upload>
              </el-form-item>
            </el-col>
          </el-row>
          <el-form-item label="订单发货控制" prop="controller">
            <el-switch v-model="form.controller"></el-switch>
            <span style="margin-left: 20px; color: #999">
              {{ form.controller
              ?'* 订单发货控制开启，生成订单时严格按照合同清单发货。'
              :'* 订单发货控制关闭，以下发货清单仅作为生成订单时参考。' }}
            </span>
          </el-form-item>
          <div class="sub-title">
            合同发货清单
            <div>
              <el-button @click="delAllList" size="small" type="danger">一键清空</el-button>
              <a :href="baseUrl+fxb+'/ecm/contract-order-manage/download?order=false'">
                <el-button size="small" type="primary">下载模版</el-button>
              </a>
              <!-- 文件导入 -->
              <el-button @click="handleUploadBefore" type="success" size="mini">文件导入</el-button>
              <el-upload
                class="upload-demo2"
                :headers="uploadHeaders"
                :action="baseUrl+fxb+'/ecm/contract-order-manage/excel-goods'"
                :data="uploadData"
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
                <el-button size="small" type="success" ref="ref_upload">文件导入</el-button>
              </el-upload>
            </div>
          </div>
          <el-table :data="form.goods" style="width: 100%" class="table-no-hidden">
            <el-table-column align="center" type="index" width="50" label="序号"></el-table-column>
            <el-table-column align="center" label="产品/服务名称" min-width="165">
              <template slot-scope="scope">
                <el-form-item
                  label-width="0"
                  class="table-form-item"
                  :prop="'goods.'+scope.$index+'.name'"
                  :rules="$createRules({msg:'产品/服务名称',required:true,max:30})"
                >
                  <el-input v-model="scope.row.name" placeholder="产品/服务名称"></el-input>
                </el-form-item>
              </template>
            </el-table-column>
            <el-table-column align="center" label="销售单位">
              <template slot-scope="scope">
                <el-form-item
                  label-width="0"
                  class="table-form-item"
                  :prop="'goods.'+scope.$index+'.company'"
                  :rules="$createRules({msg:'销售单位',required:true,max:10})"
                >
                  <el-input v-model="scope.row.company" placeholder="销售单位"></el-input>
                </el-form-item>
              </template>
            </el-table-column>
            <el-table-column align="center" label="销售数量">
              <template slot-scope="scope">
                <el-form-item
                  label-width="0"
                  class="table-form-item"
                  :prop="'goods.'+scope.$index+'.num'"
                  :rules="[{required:true,message:'销售数量必填'},{type:'integer',message:'请输入正整数'}]"
                >
                  <el-input v-model.number="scope.row.num" :maxlength="10" placeholder="销售数量"></el-input>
                </el-form-item>
              </template>
            </el-table-column>
            <el-table-column align="center" label="备注" min-width="100">
              <template slot-scope="scope">
                <el-form-item
                  label-width="0"
                  class="table-form-item"
                  :prop="'goods.'+scope.$index+'.remark'"
                  :rules="$createRules({msg:'备注',max:200})"
                >
                  <el-input v-model="scope.row.remark" placeholder="备注"></el-input>
                </el-form-item>
              </template>
            </el-table-column>
            <el-table-column align="center" label="操作" width="120">
              <template slot-scope="scope">
                <el-button
                  icon="el-icon-plus"
                  size="mini"
                  type="primary"
                  circle
                  style="padding: 8px 6px 6px"
                  @click="addList(scope.$index)"
                ></el-button>
                <el-button
                  icon="el-icon-minus"
                  size="small"
                  circle
                  style="padding: 8px 6px 6px"
                  @click="delList(scope.$index)"
                ></el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-form>
      </div>
      <div style="text-align: center; margin-top: 30px" class="size-btn-change">
        <el-button type="success" @click="saveForm">保存</el-button>
        <el-button type="primary" @click="submitForm">提交</el-button>
      </div>
    </div>
    <AddBusiness ref="ref_addBusiness" @getList="getCompanyData"></AddBusiness>
  </div>
</template>

<script>
import EnterpriseFile from "@/components/EnterpriseFile/index.vue";
import Upload from "@/components/Upload/index.vue";
import ChangeApplication from "./ChangeApplication";
import AddBusiness from "@/views/creditManagement/customerProfile/customerManagement/AddBusiness.vue";
import {
  Api_ClientGetList,
  Api_NewContractSave,
  Api_NewContractSubmit,
  Api_ChangeContractSave,
  Api_ContractDetail,
  Api_ChangeContractSubmit,
  Api_OtherContractSave,
  Api_OtherContractSubmit,
  Api_getNewContractCode,
  Api_judgeTodoContractOrder,
  Api_CancelContract,
  Api_contractOrderModelDownload
} from "@/api/creditManagement/contractManagement/contract.js";

import { Api_ChangeContractJudge } from "@/api/creditManagement/contractManagement/contract.js";

import { fxb } from "@/utils/variables";
// 文件导入
import { getToken } from "@/utils/auth";

export default {
  name: "CreateUpdate",
  components: { EnterpriseFile, Upload, ChangeApplication, AddBusiness },
  data() {
    return {
      row: "", // 整条表格数据
      fxb,
      // 文件导入
      baseUrl: process.env.VUE_APP_BASE_API,
      modelStatus: null,
      contractId: null,
      isContractChange: false,
      form: {
        order: 0,
        contractName: null,
        contractCode: null,
        customerId: null,
        customerName: null,
        contractAvailable: null,
        signDate: this.$dateFormat(new Date().getTime()),
        effectiveDateStart: this.$dateFormat(new Date().getTime()),
        effectiveDateEnd: null,
        remark: null,
        headDept: null,
        headId: null,
        state: 0,
        uploadFileUrls: [],
        controller: true,
        creditPeriod: 0,
        goods: [{ name: null, company: null, num: null, remark: null, send: 0 }]
      },
      uploadFileUrls: [],
      deptName: null,
      userName: null,
      loading: false,
      clientOptions: [],
      hisID: null,
      appID: null,
      appType: null,
      // 文件导入
      uploadHeaders: {
        Authorization: "Bearer " + getToken()
      },
      uploadData: { order: false },
      uploadList: []
    };
  },
  methods: {
    //   合同作废
    contractDelete(row) {
      this.$confirm("确定合同作废吗?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          const loading = this.$openLoading();

          Api_CancelContract(this.row.id)
            .then(res => {
              loading.close();
              this.$message({
                message: "作废成功！",
                type: "success"
              });
              this.$emit("hideCreateUpdate");
              this.$emit("getList");
            })
            .catch(res => {
              loading.close();
              this.$message.error(res);
            });
        })
        .catch(() => {});
    },

    /**
     * @open
     */
    open(_status, _cID, _res, _appType, row) {
      this.modelStatus = _status;
      this.contractId = _cID; //合同id
      this.appType = _appType;
      this.row = row; // 传过来的整条数据
      // 用户信息
      this.deptName = this.$store.state.user.userInfo.deptName;
      this.userName = this.$store.state.user.userInfo.username;
      this.form.headDept = this.$store.state.user.userInfo.deptId;
      this.form.headId = this.$store.state.user.userInfo.id;
      // 获取合同编码
      if (this.modelStatus === "add") {
        const loading = this.$openLoading();
        Api_getNewContractCode({ order: 0 })
          .then(res => {
            loading.close();
            this.form.contractCode = res;
          })
          .catch(e => {
            loading.close();
          });
      }
      // 变更时，获取详情
      if (this.modelStatus === "change" || this.modelStatus === "update") {
        if (_res) {
          this.hisID = _res.contractHis.id;
          this.appID = _res.id;
          this.setDetail(_res.contractHis);

          this.$nextTick(() => {
            this.$refs.refChangeApplication.setForm({
              applyType: _res.applyType,
              applyCode: _res.applyCode,
              applyDesc: _res.applyDesc,
              applyUploadFiles: _res.applyUploadFiles
            });
          });
        } else {
          const loading = this.$openLoading();
          Api_ContractDetail(this.contractId)
            .then(res => {
              loading.close();
              this.setDetail(res);
            })
            .catch(e => {
              loading.close();
            });
        }
      }
    },
    /**
     * @judge
     * @isChange
     */
    trueContractChange() {
      this.isContractChange = true;
    },
    falseContractChange() {
      this.isContractChange = false;
    },
    /**
     * @添加一项清单
     */
    addList(index) {
      this.form.goods.push({
        name: null,
        company: null,
        num: null,
        remark: null,
        send: 0
      });
    },
    /**
     * @一键清空清单
     */
    delAllList() {
      this.form.goods = [
        { name: null, company: null, num: null, remark: null, send: 0 }
      ];
    },
    /**
     * @删除一项清单
     */
    delList(_i) {
      if (this.form.goods.length > 1) {
        this.form.goods.splice(_i, 1);
      } else {
        this.form.goods = [
          { name: null, company: null, num: null, remark: null, send: 0 }
        ];
        // this.$message.warning("至少保留一条记录！");
      }
    },
    /**
     * @save
     */
    saveForm() {
      if (this.modelStatus === "add" || this.modelStatus === "update") {
        this.form.state = 0;
        this.form.uploadFileUrls = this.uploadFileUrls.map(item => item.url);
        const submitForm =this.modelStatus === "add"? this.form: { ...this.form, id: this.contractId };
        const loading = this.$openLoading();
        Api_NewContractSave(submitForm)
          .then(res => {
            loading.close();
            this.$message.success({
              dangerouslyUseHTMLString: true,
              message: res
            });
            this.$emit("hideCreateUpdate");
            this.$emit("getList");
          })
          .catch(res => {
            loading.close();
            this.$message.error(res);
          });
      } else if (this.modelStatus === "change") {
        const changeForm = this.$refs.refChangeApplication.getForms();
        this.form.uploadFileUrls = this.uploadFileUrls.map(item => item.url);
        const loading = this.$openLoading();

        if (changeForm.applyType === "2") {
          Api_ChangeContractSave(this.contractId, {
            applyVo: { delHisId: this.hisID, id: this.appID, ...changeForm },
            vo: this.form
          })
            .then(res => {
              loading.close();
              this.$message.success({
                dangerouslyUseHTMLString: true,
                message: res
              });
              this.$emit("hideCreateUpdate");
              this.$emit("getList");
            })
            .catch(res => {
              loading.close();
              this.$message.error(res);
            });
        } else {
          Api_OtherContractSave(this.contractId, {
            delHisId: this.hisID,
            id: this.appID,
            ...changeForm
          })
            .then(res => {
              loading.close();
              this.$message.success({
                dangerouslyUseHTMLString: true,
                message: res
              });
              this.$emit("hideCreateUpdate");
              this.$emit("getList");
            })
            .catch(res => {
              loading.close();
              this.$message.error(res);
            });
        }
      }
    },
    /**
     * @submit
     */
    submitForm() {
      if (this.modelStatus === "add" || this.modelStatus === "update") {
        this.$refs["form"].validate(valid => {
          if (valid) {
            this.form.state = 1;
            this.form.uploadFileUrls = this.uploadFileUrls.map(
              item => item.url
            );
            const submitForm =
              this.modelStatus === "add"
                ? this.form
                : { ...this.form, id: this.contractId };
            const loading = this.$openLoading();
            Api_NewContractSubmit(submitForm)
              .then(res => {
                loading.close();
                this.$message.success({
                  dangerouslyUseHTMLString: true,
                  message: res
                });
                this.$emit("hideCreateUpdate");
                this.$emit("getList");
              })
              .catch(res => {
                loading.close();
                this.$message.error(res);
              });
          }
        });
      } else if (this.modelStatus === "change") {
        const changeForm = this.$refs.refChangeApplication.getForms();
        //  在提交之前做判断  是不是能提交
        Api_ChangeContractJudge(this.row.id, {
          applyType: changeForm.applyType
        })
          .then(res => {
            //  若是没有捕获到错误 可以提交的话
            if (changeForm.applyType === "2") {
              this.$refs["form"].validate(valid => {
                if (valid) {
                  this.form.uploadFileUrls = this.uploadFileUrls.map(
                    item => item.url
                  );
                  const loading = this.$openLoading();
                  Api_ChangeContractSubmit(this.contractId, {
                    applyVo: {
                      delHisId: this.hisID,
                      id: this.appID,
                      ...changeForm
                    },
                    vo: this.form
                  })
                    .then(res => {
                      loading.close();
                      this.$message.success({
                        dangerouslyUseHTMLString: true,
                        message: res
                      });
                      this.$emit("hideCreateUpdate");
                      this.$emit("getList");
                    })
                    .catch(res => {
                      loading.close();
                      this.$message.error(res);
                    });
                }
              });
            } else {
              const loading = this.$openLoading();
              Api_OtherContractSubmit(this.contractId, {
                delHisId: this.hisID,
                id: this.appID,
                ...changeForm
              })
                .then(res => {
                  loading.close();
                  this.$message.success({
                    dangerouslyUseHTMLString: true,
                    message: res
                  });
                  this.$emit("hideCreateUpdate");
                  this.$emit("getList");
                })
                .catch(res => {
                  loading.close();
                  this.$message.error(res);
                });
            }
          })
          .catch(res => {
            this.$message.error(res);
          });
      }
    },
    // 获取信用帐期
    getPeriod(_v) {
      // if (!_v) {
      //     this.$alert("该企业未进行授信，请先授信！", "提示", {
      //         confirmButtonText: "确定",
      //         type: "warning",
      //         callback: () => {
      //             this.$emit("hideCreateUpdate");
      //             return false;
      //         }
      //     });
      // }
      this.form.creditPeriod = _v;
      if (this.modelStatus === "add") {
        Api_judgeTodoContractOrder(
          this.form.customerId,
          this.$store.state.user.userInfo.id,
          {
            order: false
          }
        ).then(res => {
          if (res && res.length > 0) {
            this.$confirm("当前客户存在合同拟定记录，是否需要载入？", "提示", {
              confirmButtonText: "载入",
              cancelButtonText: "放弃",
              type: "warning"
            })
              .then(() => {
                const loading = this.$openLoading();
                this.contractId = res[0];
                this.modelStatus = "update";
                Api_ContractDetail(res[0])
                  .then(res2 => {
                    loading.close();
                    this.setDetail(res2);
                  })
                  .catch(res => {
                    loading.close();
                  });
              })
              .catch(() => {
                const loading = this.$openLoading();
                Api_CancelContract(res[0])
                  .then(() => {
                    loading.close();
                    this.$message.success("原拟定记录已删除！");
                    this.$emit("getList");
                  })
                  .catch(res => {
                    loading.close();
                    this.$emit("hideCreateUpdate");
                    this.$message.error(res);
                  });
              });
          }
        });
      }
    },
    setDetail(res) {
      this.remoteMethod(res.customerName, () => {
        this.customerNameChange();
      });
      this.form = {
        order: res.order ? 1 : 0,
        contractName: res.contractName,
        contractCode: res.contractCode,
        customerId: res.customerId,
        customerName: res.customerName,
        contractAvailable: res.contractAvailable,
        signDate: this.$dateFormat(res.signDate),
        effectiveDateStart: this.$dateFormat(res.effectiveDateStart),
        effectiveDateEnd: this.$dateFormat(res.effectiveDateEnd),
        remark: res.remark,
        headDept: res.headDept,
        headId: res.headId,
        state: res.state,
        uploadFileUrls: [],
        controller: res.controller,
        creditPeriod: res.creditPeriod,
        goods: res.transientGoodsInfo
      };
      this.uploadFileUrls =
        res.additionalUploadFiles && res.additionalUploadFiles.length
          ? res.additionalUploadFiles.map(item => ({
              url: item.url,
              name: item.originalName
            }))
          : res.uploadFiles.map(item => ({
              url: item.url,
              name: item.originalName
            }));
      this.deptName = res.headDeptName;
      this.userName = res.headName;
    },
    /**
     * @close
     */
    closeDialog() {
      this.$emit("hideCreateUpdate");
    },
    /**
     * @others
     */
    remoteMethod(query, cb) {
      if (query !== "") {
        this.loading = true;
        setTimeout(() => {
          Api_ClientGetList({ companyName: query })
            .then(result => {
              this.clientOptions = result;
              this.loading = false;
              this.$nextTick(() => {
                cb && cb();
              });
            })
            .catch(() => {
              this.loading = false;
            });
        }, 200);
      } else {
        this.clientOptions = [];
      }
    },
    customerNameChange() {
      for (let i = 0; i < this.clientOptions.length; i++) {
        if (this.clientOptions[i].company_id === this.form.customerId) {
          this.form.customerName = this.clientOptions[i].company_name;
          break;
        }
      }
    },
    clientProfileDetail() {
      if (this.form.customerId) {
        this.$gotoCustomerDetail(this.form.customerId);
      } else {
        this.$alert("请先填写客户！", "提示", {
          confirmButtonText: "确定",
          type: "warning"
        });
      }
    },
    quickAddCustomer() {
      this.$nextTick(() => {
        this.$refs.ref_addBusiness.open();
      });
    },
    /**
     * @文件导入
     */
    handleUploadBefore(file) {
      this.uploadList = [];
      this.$refs.ref_upload.$el.click();
    },
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
        if (
          this.form.goods ===
          [{ name: null, company: null, num: null, remark: null, send: 0 }]
        ) {
          this.uploadList = [];
          this.$refs.ref_upload.$el.click();
        } else {
          if (
            this.form.goods.length === 1 &&
            !this.form.goods[0].name &&
            !this.form.goods[0].company &&
            !this.form.goods[0].num &&
            !this.form.goods[0].remark
          ) {
            this.form.goods = res.data;
          } else {
            this.$confirm(
              "EXCEL文件导入产品/服务清单会将原有记录覆盖，确定要导入吗？",
              "提示",
              {
                confirmButtonText: "确定",
                cancelButtonText: "取消",
                type: "warning"
              }
            )
              .then(() => {
                this.form.goods = res.data;
              })
              .catch(() => {
                return false;
              });
          }
        }
      } else {
        this.$message.error("解析文件失败，请检查文件是否按照要求填写！");
      }
    },
    getCompanyData(companyData) {
      this.remoteMethod(companyData.companyName, () => {
        this.form.customerId = companyData.companyId;
      });
    }
  }
};
</script>

<style lang="scss" scoped>
/deep/ .table-form-item {
  margin: 0 !important;
}

// 文件导入
.upload-demo2 {
  display: none;
}


</style>
<style lang="scss">
.sub-title{
  .el-button{
    height:30px;
  }
}
</style>