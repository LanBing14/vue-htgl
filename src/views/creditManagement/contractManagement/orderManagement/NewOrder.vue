<template>
  <div>
    <div class="page-header">
      <h1 class="page-name">
        <span>{{ dataStatus==='add'?'新增订单':dataStatus==='edit'?'编辑订单':dataStatus==='change'?'变更订单':'-' }}</span>
      </h1>
      <div>
        <el-button
            v-if="row && (row.editable && row.state === '0')"
            type="danger"
            @click="orderDelete"
          >作废</el-button>
        <el-button @click="closeDialog">返回</el-button>
      </div>
    </div>
    <div class="page-content">
      <ChangeApplication
        ref="ref_ChangeApplication"
        :appType="appType"
        v-show="dataStatus==='change'"
        @trueContractChange="trueContractChange"
        @falseContractChange="falseContractChange"
      ></ChangeApplication>
      <div v-show="!isContractChange">
        <el-form ref="form" :model="form" label-width="120px">
          <el-row>
            <el-col :span="8">
              <el-form-item
                label="订单名称"
                prop="contractName"
                :rules="$createRules({msg:'订单名称',required:true,max:100})"
              >
                <el-input v-model="form.contractName" placeholder="请输入订单名称"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="订单编号" prop="contractCode">
                <el-input v-model="form.contractCode" placeholder="请输入订单名称" disabled></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="8">
              <el-form-item label="客户名称" prop="customerId" :rules="$createRules({msg:'客户名称',required:true})">
                <el-select
                  v-model="form.customerId"
                  filterable
                  remote
                  reserve-keyword
                  placeholder="请输入关键字查询"
                  :remote-method="remoteMethod"
                  :loading="loading"
                  @change="customerNameChange"
                  style="width: 100%"
                  :disabled="dataStatus==='change'"
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
              <span class="canClick" @click="clientProfileDetail">客户档案</span>
            </el-col>
          </el-row>
          <EnterpriseFile
            :enterpriseID="form.customerId"
            @getPeriod="getPeriod"
            @getAvailableCredit="getAvailableCredit"
          ></EnterpriseFile>
          <el-row>
            <el-col :span="8">
              <el-form-item label="合同名称" prop="refContractId">
                <el-input v-model="form.refContractName" disabled></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="2" style="line-height: 35px" v-if="dataStatus!=='change'">
              <span class="canClick" @click="chooseContract">选择合同</span>
            </el-col>
          </el-row>
          <div class="sub-title">
            发货清单
            <div>
              <el-button v-if="form.refContractId" @click="chooseGoods" size="small" type="primary">选择产品</el-button>
              <el-button @click="delAllList" size="small" type="danger">一键清空</el-button>
              <a v-if="!controller" :href="baseUrl+fxb+'/ecm/contract-order-manage/download?order=true'">
                <el-button size="small" type="primary">下载模版</el-button>
              </a>
              <!-- 文件导入 -->
              <el-button v-if="!controller" @click="handleUploadBefore" type="success" size="mini">文件导入</el-button>
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
            <el-table-column align="center" label="产品/服务名称">
              <template slot-scope="scope">
                <el-form-item
                  label-width="0"
                  class="table-form-item"
                  :prop="'goods.'+scope.$index+'.name'"
                  :rules="$createRules({msg:'产品/服务名称',required:true,max:30})"
                >
                  <el-input v-model="scope.row.name" v-if="!controller"></el-input>
                  <span v-else>{{ scope.row.name }}</span>
                </el-form-item>
              </template>
            </el-table-column>
            <el-table-column align="center" label="销售单位" width="120">
              <template slot-scope="scope">
                <el-form-item
                  label-width="0"
                  class="table-form-item"
                  :prop="'goods.'+scope.$index+'.company'"
                  :rules="$createRules({msg:'销售单位',required:true,max:10})"
                >
                  <el-input v-model="scope.row.company" v-if="!controller"></el-input>
                  <span v-else>{{ scope.row.company }}</span>
                </el-form-item>
              </template>
            </el-table-column>
            <el-table-column align="center" label="销售单价(元)">
              <template slot-scope="scope">
                <el-form-item
                  label-width="0"
                  class="table-form-item"
                  :prop="'goods.'+scope.$index+'.unitPrice'"
                  :rules="$createRules({msg:'销售单价',required:true,numberFloatUp:true})"
                >
                  <el-input v-model="scope.row.unitPrice" @change="setAmount(scope.row)"></el-input>
                </el-form-item>
              </template>
            </el-table-column>
            <el-table-column align="center" label="销售数量" width="120">
              <template slot-scope="scope">
                <el-form-item
                  label-width="0"
                  class="table-form-item"
                  :prop="'goods.'+scope.$index+'.num'"
                  :rules="[{required:true,message:'销售数量必填'},{type:'integer',message:'请输入正整数'}]"
                >
                  <el-input v-model.number="scope.row.num" @change="setAmount(scope.row)"></el-input>
                </el-form-item>
              </template>
            </el-table-column>
            <el-table-column align="right" label="总价(元)">
              <template slot-scope="scope">
                <el-form-item
                  label-width="0"
                  class="table-form-item"
                  :prop="'goods.'+scope.$index+'.amount'"
                  :rules="$createRules({msg:'总价',required:true,numberFloatUp:true})"
                >
                  <el-input
                    v-model="scope.row.amount"
                    :class="{wrong: scope.row.wrong}"
                    @change="setActAmount(scope.row)"
                  ></el-input>
                </el-form-item>
              </template>
            </el-table-column>
            <el-table-column align="center" label="折扣" width="120">
              <template slot-scope="scope">
                <el-form-item
                  label-width="0"
                  class="table-form-item"
                  :prop="'goods.'+scope.$index+'.discount'"
                  :rules="[{required:true,message:'折扣必填'},{pattern: numberFloat2,message:'请输入100以内且最多有两小数的数字'}]"
                >
                  <el-input v-model="scope.row.discount" @change="setActAmount(scope.row)"></el-input>
                  <!-- <span v-else>{{ scope.row.discount }}</span> -->
                </el-form-item>
              </template>
            </el-table-column>
            <el-table-column align="right" label="实际成交价(元)">
              <template slot-scope="scope">
                <el-form-item
                  label-width="0"
                  class="table-form-item"
                  :prop="'goods.'+scope.$index+'.actAmount'"
                  :rules="$createRules({msg:'实际成交价',required:true,numberFloatUp:true})"
                >
                  <el-input
                    v-model="scope.row.actAmount"
                    :class="{wrong: scope.row.wrong2}"
                    @change="setTotalAmount"
                  ></el-input>
                </el-form-item>
              </template>
            </el-table-column>
            <el-table-column align="center" label="操作" width="120">
              <template slot-scope="scope">
                <el-button
                  v-if="!controller"
                  type="primary"
                  size="mini"
                  icon="el-icon-plus"
                  @click="addList(scope.$index)"
                  circle
                  style="padding: 8px 6px 6px"
                ></el-button>
                <el-button
                  size="mini"
                  icon="el-icon-minus"
                  @click="delList(scope.$index, scope.row)"
                  circle
                  style="padding: 8px 6px 6px"
                ></el-button>
              </template>
            </el-table-column>
          </el-table>
          <el-row style="margin-top: 15px">
            <el-col :span="8">
              <el-form-item
                label="订单金额"
                prop="contractAvailable"
                :rules="$createRules({msg:'订单金额',required:true,numberFloatUp:true})"
              >
                <el-input
                  v-model="form.contractAvailable"
                  :class="{wrong:contractAvailableWrong}"
                  placeholder="请输入订单总金额"
                >
                  <template slot="append">元</template>
                </el-input>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item
                label="折扣"
                prop="discount"
                :rules="[{required:true,message:'折扣必填'},{pattern: numberFloat2,message:'请输入100以内且最多有两小数的数字'}]"
              >
                <el-input v-model="form.discount" placeholder="请输入折扣" @change="setTotalAmount">
                  <template slot="append">%</template>
                </el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="8">
              <el-form-item label="应收确认日期" prop="confirmType">
                <el-select
                  v-model="form.confirmType"
                  :disabled="dataStatus==='change'"
                  placeholder="请选择应收确认日期"
                  style="width: 100%"
                >
                  <el-option label="按订单签约日期" value="1"></el-option>
                  <el-option label="按发票登记日期" value="2"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="是否预付" prop="prepaid">
                <el-switch v-model="form.prepaid" :disabled="dataStatus==='change'"></el-switch>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row v-if="form.prepaid">
            <el-col :span="8">
              <el-form-item
                label="预付金额"
                prop="payAmount"
                :rules="form.prepaid?$createRules({msg:'预付金额',required:true,numberFloatUp:true}):[]"
              >
                <el-input v-model="form.payAmount" :disabled="dataStatus==='change'" placeholder="请输入订单预付金额">
                  <template slot="append">元</template>
                </el-input>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item
                label="预付日期"
                prop="payAmountDate"
                :rules="form.prepaid?$createRules({msg:'预付日期',required:true}):[]"
              >
                <el-date-picker
                  v-model="form.payAmountDate"
                  type="date"
                  placeholder="请选择预付日期"
                  value-format="yyyy-MM-dd"
                  style="width: 100%"
                  :disabled="dataStatus==='change'"
                ></el-date-picker>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="8">
              <el-form-item label="签约日期" prop="signDate" :rules="$createRules({msg:'签约日期',required:true})">
                <el-date-picker
                  v-model="form.signDate"
                  type="date"
                  placeholder="请选择签约日期"
                  value-format="yyyy-MM-dd"
                  style="width: 100%"
                  :disabled="dataStatus==='change'"
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
                  placeholder="请选择有效日期始"
                  value-format="yyyy-MM-dd"
                  style="width: 100%"
                  :disabled="dataStatus==='change'"
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
                  placeholder="请选择有效日期止"
                  value-format="yyyy-MM-dd"
                  style="width: 100%"
                  :picker-options="pickerOptionsEnd"
                ></el-date-picker>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item
                label="发货日期"
                prop="outGoodsDate"
                :rules="$createRules({msg:'发货日期',required:true})"
              >
                <el-date-picker
                  v-model="form.outGoodsDate"
                  type="date"
                  placeholder="请选择预定发货日期"
                  value-format="yyyy-MM-dd"
                  style="width: 100%"
                ></el-date-picker>
              </el-form-item>
            </el-col>
          </el-row>
          <el-form-item label="收货地址" prop="address" :rules="$createRules({msg:'收货地址',required:true})">
            {{ form.address?form.address.split(',')[1]:'-' }}
            <span class="canClick" @click="openAdress">选择收货地址</span>
          </el-form-item>
          <!-- 1.9N S -->
          <el-row>
            <el-col :span="8">
              <el-form-item
                label="拖欠罚金"
                prop="defaultMoney"
                :rules="$createRules({msg:'拖欠罚金',required:true})"
              >
                <el-select v-model="form.defaultMoney" placeholder="请选择拖欠罚金" style="width: 100%">
                  <el-option label="不使用罚金" value="1"></el-option>
                  <el-option label="一次性收取" value="2"></el-option>
                  <el-option label="按天收取" value="3"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="8" v-if="form.defaultMoney!=='1'">
              <el-form-item
                label="计算依据"
                prop="defaultBasis"
                :rules="$createRules({msg:'计算依据',required:true})"
              >
                <el-select v-model="form.defaultBasis" placeholder="请选择计算依据" style="width: 100%">
                  <el-option label="订单金额" value="1"></el-option>
                  <el-option label="应收账款余额" value="2"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="8" v-if="form.defaultMoney!=='1'">
              <el-form-item
                label="计算比率"
                prop="defaultPercent"
                :rules="$createRules({msg:'计算比率',required:true,numberTwo:true})"
              >
                <el-input v-model="form.defaultPercent" placeholder="请输入计算比率">
                  <template slot="append">%</template>
                </el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <!-- 1.9N E -->
          <el-row>
            <el-col :span="8">
              <el-form-item label="订单备注" prop="remark" :rules="$createRules({msg:'订单备注',max:1000})">
                <el-input type="textarea" :rows="4" placeholder="请输入订单备注信息" v-model="form.remark"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="24">
              <el-form-item label="负责人员" prop="deptName">{{deptName}}/{{userName}}</el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="8">
              <el-form-item label="附件" prop="uploadFileUrls">
                <Upload v-model="uploadFileUrls" fileType="pdf" :limit="5" :fileSize="10"></Upload>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
      </div>
      <div style="text-align: center" class="size-btn-change">
        <el-button type="success" @click="saveForm">保存</el-button>
        <el-button type="primary" @click="submitForm">提交</el-button>
      </div>
    </div>
    <ChooseGoods
      ref="ref_ChooseGoods"
      @setList="setList"
      :checked-ids="checkedIds"
      :cID="form.refContractId"
      @getController="getController"
    ></ChooseGoods>
    <Adress ref="ref_Adress" @getInfo="onAdressOk"></Adress>
    <AddBusiness ref="ref_addBusiness" @getList="getCompanyData"></AddBusiness>
    <ChooseContract
      ref="ref_ChooseContract"
      :cID="form.customerId"
      @handleContractSelected="handleContractSelected"
    ></ChooseContract>
  </div>
</template>

<script>
import { merge } from "lodash";
import EnterpriseFile from "@/components/EnterpriseFile/index.vue";
import Upload from "@/components/Upload/index.vue";
import ChooseGoods from "./ChooseGoods";
import ChangeApplication from "./ChangeApplication";
import Adress from "./Adress";
import AddBusiness from "@/views/creditManagement/customerProfile/customerManagement/AddBusiness.vue";
import ChooseContract from "./ChooseContract";
import { Api_ClientGetList } from "@/api/creditManagement/contractManagement/contract.js";
import { patterns } from "@/utils/variables";
import {
  Api_getNewContractCode,
  Api_judgeTodoContractOrder,
  Api_CancelContract,
  Api_getContractGoods,
} from "@/api/creditManagement/contractManagement/contract.js";
import {
  Api_NewOrderSave,
  Api_NewOrderSubmit,
  Api_orderDetail,
  Api_orderChangeSave,
  Api_orderChangeSubmit,
  Api_orderOtherSave,
  Api_orderOtherSubmit,
  Api_orderChangeJudge
} from "@/api/creditManagement/contractManagement/orders.js";
import { fxb } from "@/utils/variables";
// 文件导入
import { getToken } from "@/utils/auth";

export default {
  name: "NewOrder",
  components: {
    EnterpriseFile,
    Upload,
    ChooseGoods,
    ChangeApplication,
    Adress,
    AddBusiness,
    ChooseContract,
  },
  data() {
    const _that = this;
    return {
      row:'',// 一条的数据
      numberFloat2: patterns.numberFloat2,
      fxb,
      // 文件导入
      baseUrl: process.env.VUE_APP_BASE_API,
      dataStatus: "",
      contractId: null,
      appType: null,
      controller: false,
      form: {
        state: null,
        order: true,
        contractName: null,
        contractCode: null,
        customerId: "",
        customerName: null,
        refContractId: null,
        refContractName: null,
        goods: [
          {
            order: true,
            name: null,
            company: null,
            unitPrice: null,
            send: 0,
            num: null,
            amount: null,
            discount: 100,
            actAmount: null,
            wrong: false,
            wrong2: false,
          },
        ],
        contractAvailable: null,
        discount: 100,
        confirmType: "1",
        prepaid: false,
        payAmount: null,
        payAmountDate: null,
        signDate: null,
        effectiveDateStart: null,
        effectiveDateEnd: null,
        outGoodsDate: null,
        address: null,
        remark: null,
        headDept: null,
        headId: null,
        creditPeriod: 0,
        uploadFileUrls: [],
        defaultMoney: "1",
        defaultBasis: null,
        defaultPercent: null,
      },
      uploadFileUrls: [],
      deptName: null,
      userName: null,
      clientOptions: [],
      loading: false,
      isContractChange: false,
      hisID: null,
      appID: null,
      // 文件导入
      uploadHeaders: {
        Authorization: "Bearer " + getToken(),
      },
      uploadData: { order: true },
      uploadList: [],
      availableCredit: null,
      contractAvailableWrong: false,
      pickerOptionsEnd: {
        disabledDate(time) {
          let _effectiveDateStart = _that.form.effectiveDateStart;
          if (_effectiveDateStart) {
            return time.getTime() < new Date(_effectiveDateStart).getTime();
          }
        },
      },
    };
  },
  computed: {
    checkedIds() {
      if ( this.form.goods.length > 0){
        return this.form.goods.map((i) => i.id);
      }
    },
  },
  watch: {
    "form.refContractId"(_v) {
      if (!_v) {
        this.controller = false;
      }
    },
  },
  methods: {
    /**
     * @init
     */
    open(_status, _cID, _res, _appType,row) {
      this.contractId = _cID;
      this.row=row;  // 一条的数据
      // 用户信息
      this.deptName = this.$store.state.user.userInfo.departmentName || this.$store.state.user.userInfo.deptName ;
      this.userName = this.$store.state.user.userInfo.name || this.$store.state.user.userInfo.username;
      this.form.headDept = this.$store.state.user.userInfo.deptId;
      this.form.headId = this.$store.state.user.userInfo.id;
      // 列信息
      this.dataStatus = _status;
      _appType && (this.appType = _appType);
      // 订单编号
      if (_status === "add") {
        const loading = this.$openLoading();
        Api_getNewContractCode({ order: 1 }).then((res) => {
          loading.close();
          this.form.contractCode = res;
        });
      } else if (_status === "edit" || _status === "change") {
        if (_res) {
          this.hisID = _res.contractHis.id;
          this.appID = _res.id;
          this.setDetail(_res.contractHis);
          this.$refs.ref_ChangeApplication.setForm({
            applyType: _res.applyType,
            applyCode: _res.applyCode,
            applyDesc: _res.applyDesc,
            applyUploadFiles: _res.applyUploadFiles,
          });
        } else {
          const loading = this.$openLoading();
          Api_orderDetail(_cID).then((res) => {
            loading.close();
            this.setDetail(res);
          });
        }
      }
    },
    /**
     * @close
     */
    closeDialog() {
      this.$emit("hideNewOrder");
    },
    /**
     * @gotoCustomerDetail
     */
    clientProfileDetail() {
      if (this.form.customerId) {
        this.$gotoCustomerDetail(this.form.customerId);
      } else {
        this.$alert("请先填写客户！", "提示", {
          confirmButtonText: "确定",
          type: "warning",
        });
      }
    },
    /**
     * @add
     * @goodslist
     */
    addList(index) {
      this.form.goods.push({
        order: true,
        name: null,
        company: null,
        unitPrice: null,
        send: 0,
        num: null,
        amount: null,
        discount: 100,
        actAmount: null,
        wrong: false,
        wrong2: false,
      });
      // this.$refs["form"].resetFields();
    },
    delAllList() {
      this.form.goods = [
        {
          order: true,
          name: null,
          company: null,
          unitPrice: null,
          send: 0,
          num: null,
          amount: null,
          discount: 100,
          actAmount: null,
          wrong: false,
          wrong2: false,
        },
      ];
    },
    delList(_i, row) {
      if (row.send && row.send > 0) {
        this.$message.error("此发货记录已进行发货操作，不能删除！");
        return false;
      }
      if (this.form.goods.length === 1) {
        this.form.goods = [
          {
            order: true,
            name: null,
            company: null,
            unitPrice: null,
            send: 0,
            num: null,
            amount: null,
            discount: 100,
            actAmount: null,
            wrong: false,
            wrong2: false,
          },
        ];
        return false;
      }
      this.form.goods.splice(_i, 1);
    },
    /**
     * @choose
     * @goods
     */
    chooseGoods() {
      this.$refs.ref_ChooseGoods.open();
    },
    /**
     * @set
     * @list
     */
    setList(_data) {
      this.form.goods = [];
      for (let i = 0; i < _data.length; i++) {
        this.form.goods.push({
          id: _data[i].id,
          order: false,
          name: _data[i].name,
          company: _data[i].company,
          unitPrice: null,
          send: 0,
          num: _data[i].num - _data[i].send,
          amount: null,
          discount: 100,
          actAmount: null,
          wrong: false,
          wrong2: false,
        });
      }
    },
    /**
     * @获取是否订单控制
     */
    getController(_v) {
      this.controller = _v;
    },
    /**
     * @save
     */
    saveForm() {
      const form = merge({}, this.form);
      form.goods.forEach((item) => {
        delete item.wrong;
        delete item.wrong2;
      });
      if (this.dataStatus === "add" || this.dataStatus === "edit") {
        form.state = 0;
        form.uploadFileUrls = this.uploadFileUrls.map((item) => item.url);
        const submitForm = this.dataStatus === "add" ? form : { ...form, id: this.contractId };
        const loading = this.$openLoading();
        Api_NewOrderSave(submitForm)
          .then((res) => {
            loading.close();
            this.$message.success({
              dangerouslyUseHTMLString: true,
              message: res,
            });
            this.$emit("hideNewOrder");
            this.$emit("getList");
          })
          .catch((res) => {
            loading.close();
            this.$message.error(res);
          });
      } else if (this.dataStatus === "change") {


       this.$refs.ref_ChangeApplication.getForms("save").then((res) => {
          form.uploadFileUrls = this.uploadFileUrls.map((item) => item.url);
          const loading = this.$openLoading();
          if (res.applyType === "2") {
            Api_orderChangeSave(this.contractId, {
              applyVo: {
                delHisId: this.hisID,
                id: this.appID,
                ...res,
              },
              vo: form,
            })
              .then((res) => {
                loading.close();
                this.$message.success({
                  dangerouslyUseHTMLString: true,
                  message: res,
                });
                this.$emit("hideNewOrder");
                this.$emit("getList");
              })
              .catch((res) => {
                loading.close();
                this.$message.error(res);
              });
          } else {
            Api_orderOtherSave(this.contractId, {
              delHisId: this.hisID,
              id: this.appID,
              ...res,
            })
              .then((res) => {
                loading.close();
                this.$message.success({
                  dangerouslyUseHTMLString: true,
                  message: res,
                });
                this.$emit("hideNewOrder");
                this.$emit("getList");
              })
              .catch((res) => {
                loading.close();
                this.$message.error(res);
              });
          }
        });


      }
    },
    /**
     * @submit
     */
    submitForm() {
      // if (this.form.customerId && !this.form.creditPeriod) {
      //     this.$alert("该企业未进行授信，请先授信！", "提示", {
      //         confirmButtonText: "确定",
      //         type: "warning"
      //     });
      //     return false;
      // }
      if (this.dataStatus === "add" || this.dataStatus === "edit") {
        this.$refs["form"].validate((valid) => {
          if (valid) {
            // 验证发货清单的计算问题
            let isConfirm = null;
            let _totalAmount = 0;
            const _fgoods = this.form.goods;
            for (let i = 0; i < _fgoods.length; i++) {
              if (Number(_fgoods[i].amount) !== this.$multiply(_fgoods[i].unitPrice, _fgoods[i].num)) {
                this.form.goods[i].wrong = true;
                isConfirm = "发货清单中存在总价/实际成交价与计算不符的产品/服务记录，确定要继续提交吗？";
              }
              if (
                Number(_fgoods[i].actAmount) !==
                this.$divide(Math.round(this.$multiply(_fgoods[i].amount, _fgoods[i].discount)), 100)
              ) {
                this.form.goods[i].wrong2 = true;
                isConfirm = "发货清单中存在总价/实际成交价与计算不符的产品/服务记录，确定要继续提交吗？";
              }
              _totalAmount += Number(_fgoods[i].actAmount);
            }
            if (
              !isConfirm &&
              Math.round(this.$multiply(_totalAmount, this.form.discount)) / 100 !==
                Number(this.form.contractAvailable)
            ) {
              this.contractAvailableWrong = true;
              isConfirm = "当前订单金额与实际成交总金额不符，确定要继续提交吗？";
            }
            // 提交
            if (isConfirm) {
              this.$confirm(isConfirm, "提示", {
                confirmButtonText: "确定",
                cancelButtonText: "取消",
                type: "warning",
              })
                .then(() => {
                  this.form.state = 1;
                  const form = merge({}, this.form);
                  form.uploadFileUrls = this.uploadFileUrls.map((item) => item.url);
                  form.goods.forEach((item) => {
                    delete item.wrong;
                    delete item.wrong2;
                  });
                  const submitForm = this.dataStatus === "add" ? form : { ...form, id: this.contractId };
                  const loading = this.$openLoading();
                  Api_NewOrderSubmit(submitForm)
                    .then((res) => {
                      loading.close();
                      this.$message.success({
                        dangerouslyUseHTMLString: true,
                        message: res,
                      });
                      this.$emit("hideNewOrder");
                      this.$emit("getList");
                    })
                    .catch((res) => {
                      loading.close();
                      this.$message.error(res);
                    });
                })
                .catch(() => {});
            } else {
              const form = merge({}, this.form);
              form.goods.forEach((item) => {
                delete item.wrong;
                delete item.wrong2;
              });
              form.state = 1;
              const submitForm = this.dataStatus === "add" ? form : { ...form, id: this.contractId };
              submitForm.uploadFileUrls = this.uploadFileUrls.map((item) => item.url);
              const loading = this.$openLoading();
              Api_NewOrderSubmit(submitForm)
                .then((res) => {
                  loading.close();
                  this.$message.success({
                    dangerouslyUseHTMLString: true,
                    message: res,
                  });
                  this.$emit("hideNewOrder");
                  this.$emit("getList");
                })
                .catch((res) => {
                  loading.close();
                  this.$message.error(res);
                });
            }
          } else {
            this.$message.error("校验未通过，请检查输入项！");
          }
        });
      } else if (this.dataStatus === "change") {
        this.$refs.ref_ChangeApplication.getForms("submit").then((res) => {
            this.form.uploadFileUrls = this.uploadFileUrls.map((item) => item.url);



             Api_orderChangeJudge(this.row.id, { applyType: res.applyType })
            .then((success) => {
                if (res.applyType === "2") {
                  this.$refs["form"].validate((valid) => {
                    if (valid) {
                      // 验证发货清单的计算问题
                      let isConfirm = null;
                      let _totalAmount = 0;
                      for (let i = 0; i < this.form.goods.length; i++) {
                        if (
                          Number(this.form.goods[i].amount) !==
                          this.$multiply(this.form.goods[i].unitPrice, this.form.goods[i].num)
                        ) {
                          this.form.goods[i].wrong = true;
                          isConfirm =
                            "发货清单中存在总价/实际成交价与计算不符的产品/服务记录，确定要继续提交吗？";
                        }
                        if (
                          Number(this.form.goods[i].actAmount) !==
                          this.$divide(
                            Math.round(this.$multiply(this.form.goods[i].amount, this.form.goods[i].discount)),
                            100
                          )
                        ) {
                          this.form.goods[i].wrong2 = true;
                          isConfirm =
                            "发货清单中存在总价/实际成交价与计算不符的产品/服务记录，确定要继续提交吗？";
                        }
                        _totalAmount += Number(this.form.goods[i].actAmount);
                      }
                      if (
                        !isConfirm &&
                        Math.round(_totalAmount * this.form.discount) / 100 !==
                          Number(this.form.contractAvailable)
                      ) {
                        this.contractAvailableWrong = true;
                        isConfirm = "当前订单金额与实际成交总金额不符，确定要继续提交吗？";
                      }
                      // 提交
                      if (isConfirm) {
                        this.$confirm(isConfirm, "提示", {
                          confirmButtonText: "确定",
                          cancelButtonText: "取消",
                          type: "warning",
                        })
                          .then(() => {
                            const form = merge({}, this.form);
                            form.goods.forEach((item) => {
                              delete item.wrong;
                              delete item.wrong2;
                            });
                            const loading = this.$openLoading();
                            Api_orderChangeSubmit(this.contractId, {
                              applyVo: {
                                delHisId: this.hisID,
                                id: this.appID,
                                ...res,
                              },
                              vo: form,
                            })
                              .then((res) => {
                                loading.close();
                                this.$message.success({
                                  dangerouslyUseHTMLString: true,
                                  message: res,
                                });
                                this.$emit("hideNewOrder");
                                this.$emit("getList");
                              })
                              .catch((res) => {
                                loading.close();
                                this.$message.error(res);
                              });
                          })
                          .catch(() => {});
                      } else {
                        const form = merge({}, this.form);
                        form.goods.forEach((item) => {
                          delete item.wrong;
                          delete item.wrong2;
                        });
                        const loading = this.$openLoading();
                        Api_orderChangeSubmit(this.contractId, {
                          applyVo: {
                            delHisId: this.hisID,
                            id: this.appID,
                            ...res,
                          },
                          vo: form,
                        })
                          .then((res) => {
                            loading.close();
                            this.$message.success({
                              dangerouslyUseHTMLString: true,
                              message: res,
                            });
                            this.$emit("hideNewOrder");
                            this.$emit("getList");
                          })
                          .catch((res) => {
                            loading.close();
                            this.$message.error(res);
                          });
                      }
                    } else {
                      this.$message.error("校验未通过，请检查输入项！");
                    }
                  });
                } else {
                  const loading = this.$openLoading();
                  Api_orderOtherSubmit(this.contractId, {
                    delHisId: this.hisID,
                    id: this.appID,
                    ...res,
                  })
                    .then((res) => {
                      loading.close();
                      this.$message.success({
                        dangerouslyUseHTMLString: true,
                        message: res,
                      });
                      this.$emit("hideNewOrder");
                      this.$emit("getList");
                    })
                    .catch((res) => {
                      loading.close();
                      this.$message.error(res);
                    });
                }
            }).catch(err=>{
                this.$message.error(err);
            })
          })
          .catch((error) => {
            this.$message.error("校验未通过，请检查输入项！");
          });
      }
    },
    // 点击“提交”时，判断如下条件
    judgeSubmit() {
      // 赊销金额
      const creditAmount = Number(this.form.contractAvailable) - Number(this.form.payAmount);
      if (creditAmount > 0 && !this.form.creditPeriod) {
        this.$alert("当前该客户查询不到有效的授信记录，请先获取客户授信之后再来提交订单。", "提示", {
          confirmButtonText: "确定",
          type: "warning",
        });
        return false;
      }
      if (creditAmount > Number(this.availableCredit)) {
        this.$alert("当前客户剩余可用信用额度不足，请为该客户申请临时额度以方便通过审批。", "提示", {
          confirmButtonText: "确定",
          type: "warning",
        });
        return false;
      }
      return true;
    },
    // 获取信用帐期
    getPeriod(_v) {
      this.form.creditPeriod = _v;
      if (this.dataStatus === "add") {
        Api_judgeTodoContractOrder(this.form.customerId, this.$store.state.user.userInfo.id, {
          order: true,
        }).then((res) => {
          if (res && res.length > 0) {
            this.$confirm("当前客户存在订单拟定记录，是否需要载入？", "提示", {
              confirmButtonText: "载入",
              cancelButtonText: "放弃",
              type: "warning",
            })
              .then(() => {
                const loading = this.$openLoading();
                this.contractId = res[0];
                this.dataStatus = "edit";
                Api_orderDetail(res[0]).then((res2) => {
                  loading.close();
                  this.setDetail(res2);
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
                  .catch((res) => {
                    loading.close();
                    this.$emit("hideNewOrder");
                    this.$message.error(res);
                  });
              });
          }
        });
      }
    },
    // 获取可用额度
    getAvailableCredit(vv) {
      this.availableCredit = vv;
    },
    /**
     * @caculate
     */
    setAmount(rr) {
      rr.wrong = false;
      rr.wrong2 = false;
      this.contractAvailableWrong = false;
      !isNaN(rr.unitPrice) && !isNaN(rr.num) && (rr.amount = this.$multiply(rr.unitPrice, rr.num));
      this.setActAmount(rr);
      this.setTotalAmount();
    },
    setActAmount(rr) {
      rr.wrong2 = false;
      this.contractAvailableWrong = false;
      !isNaN(rr.discount) &&
        !isNaN(rr.amount) &&
        (rr.actAmount = Math.round(this.$multiply(rr.discount, rr.amount)) / 100);
      this.setTotalAmount();
    },
    setTotalAmount() {
      if (!isNaN(this.form.discount)) {
        this.contractAvailableWrong = false;
        let totalAmount = 0;
        for (let i = 0; i < this.form.goods.length; i++) {
          !isNaN(this.form.goods[i].actAmount) && (totalAmount += Number(this.form.goods[i].actAmount));
        }
        this.form.contractAvailable = Math.round(this.$multiply(totalAmount, this.form.discount)) / 100;
      }
    },
    /**
     * @回显
     */
    setDetail(res) {
      this.remoteMethod(res.customerName, () => {
        this.customerNameChange(() => {

          this.form = {
            state: res.state,
            order: res.order ? 1 : 0,
            contractName: res.contractName,
            contractCode: res.contractCode,
            customerId: res.customerId,
            customerName: res.customerName,
            refContractId: res.transientRefContract ? res.transientRefContract.id : null,
            refContractName: res.transientRefContract ? res.transientRefContract.contractName : null,
            goods: res.transientGoodsInfo? res.transientGoodsInfo.map((item) => ({
              ...item,
              wrong: false,
              wrong2: false,
            })) :  [{
              order: true,
              name: null,
              company: null,
              unitPrice: null,
              send: 0,
              num: null,
              amount: null,
              discount: 100,
              actAmount: null,
              wrong: false,
              wrong2: false,
            }],
            contractAvailable: res.contractAvailable,
            discount: res.discount,
            confirmType: res.confirmType,
            prepaid: res.prepaid,
            payAmount: res.payAmount,
            payAmountDate: this.$dateFormat(res.payAmountDate),
            signDate: this.$dateFormat(res.signDate),
            effectiveDateStart: this.$dateFormat(res.effectiveDateStart),
            effectiveDateEnd: this.$dateFormat(res.effectiveDateEnd),
            outGoodsDate: this.$dateFormat(res.outGoodsDate),
            address: res.address,
            remark: res.remark,
            headDept: res.headDept,
            headId: res.headId,
            creditPeriod: res.creditPeriod,
            uploadFileUrls: [],
            defaultMoney: res.defaultMoney,
            defaultBasis: res.defaultBasis,
            defaultPercent: res.defaultPercent,
          };
        });
      });
      this.uploadFileUrls =
        res.additionalUploadFiles && res.additionalUploadFiles.length
          ? res.additionalUploadFiles.map((item) => ({
              url: item.url,
              name: item.originalName,
            }))
          : res.uploadFiles.map((item) => ({
              url: item.url,
              name: item.originalName,
            }));
      this.deptName = res.headDeptName;
      this.userName = res.headName;
    },
    /**
     * @others
     */
    trueContractChange() {
      this.isContractChange = true;
    },
    falseContractChange() {
      this.isContractChange = false;
    },
    remoteMethod(query, cb) {
      if (query !== "") {
        this.loading = true;
        setTimeout(() => {
          Api_ClientGetList({ companyName: query }).then((result) => {
            this.clientOptions = result;
            this.loading = false;
            this.$nextTick(() => {
              cb && cb();
            });
          });
        }, 200);
      } else {
        this.clientOptions = [];
      }
    },
    customerNameChange(cb) {
      this.form.address = null;
      this.form.refContractId = null;
      this.form.refContractName = null;
      for (let i = 0; i < this.clientOptions.length; i++) {
        if (this.clientOptions[i].company_id === this.form.customerId) {
          this.form.customerName = this.clientOptions[i].company_name;
          if (this.clientOptions[i].badCustomer && this.clientOptions[i].badCustomer.isWork) {
            this.$alert("当前客户已被列入不良客户，处理措施包含停止签约，系统暂时不允许提交订单", "提示", {
              type: "warning",
            });
            // this.form.customerId = null;
            // this.form.customerName = null;
            // return false;
          }
          break;
        }
      }
      if (typeof cb === "function") {
        cb && cb();
      }
    },
    chooseContract() {
      if (!this.form.customerId) {
        this.$message("请先选择客户！");
        return false;
      }
      this.$refs.ref_ChooseContract.open();
    },
    handleContractSelected({ id, contractName }) {
      this.form.refContractId = id;
      this.form.refContractName = contractName;

      const loading = this.$openLoading();
      Api_getContractGoods(id).then((res) => {
        loading.close();
        this.form.goods = res.transientGoodsInfo.map((item) => ({
          id: item.id,
          order: false,
          name: item.name,
          company: item.company,
          unitPrice: null,
          send: 0,
          num: item.num - item.send,
          amount: null,
          discount: 100,
          actAmount: null,
          wrong: false,
          wrong2: false,
        }));
      });
    },
    // 打开新增收货地址
    openAdress() {
      if (!this.form.customerId) {
        this.$message.error("请先选择客户！");
        return false;
      }
      this.$refs.ref_Adress.open(this.form.customerId, this.form.customerName);
    },
    onAdressOk(addressID, address) {
      this.form.address = addressID + "," + address;
    },
    quickAddCustomer() {
      this.$nextTick(() => {
        this.$refs.ref_addBusiness.open();
      });
    },


    /**
     * @订单删除
     */
    orderDelete() {
      this.$confirm("确定订单作废吗?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          const loading = this.$openLoading();
          Api_CancelContract(this.row.id)
            .then(() => {
              loading.close();
              this.$message({
                message: "作废成功！",
                type: "success"
              });
              this.$emit("hideNewOrder");
              this.$emit("getList");

            })
            .catch((res) => {
              loading.close();
              this.$message.error(res);
            });
        })
        .catch(() => {});
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
          this.form.goods.length === 1 &&
          !this.form.goods[0].name &&
          !this.form.goods[0].company &&
          !this.form.goods[0].unitPrice &&
          !this.form.goods[0].send &&
          !this.form.goods[0].num &&
          !this.form.goods[0].amount &&
          this.form.goods[0].discount === 100 &&
          !this.form.goods[0].actAmount
        ) {
          this.form.goods = res.data;
          this.$nextTick(() => {
            this.setTotalAmount();
          });
          return;
        }
        this.$confirm(
          "当前订单中已存在产品/服务记录，请选择在导入EXCEL中新的产品/服务记录时追加或者替换。",
          "提示",
          {
            confirmButtonText: "替换",
            cancelButtonText: "追加",
            type: "warning",
          }
        )
          .then(() => {
            this.form.goods = res.data;
            this.$nextTick(() => {
              this.setTotalAmount();
            });
          })
          .catch(() => {
            this.form.goods = this.form.goods.concat(res.data);
            this.$nextTick(() => {
              this.setTotalAmount();
            });
          });
      } else {
        this.$message.error("解析文件失败，请检查文件是否按照要求填写！");
      }
    },
    getCompanyData(companyData) {
      this.remoteMethod(companyData.companyName, () => {
        this.form.customerId = companyData.companyId;
        this.form.customerName = companyData.companyName;
      });
    },
    getWrong(row) {},
  },
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

.el-input.wrong /deep/ input {
  color: red;
}



</style>
