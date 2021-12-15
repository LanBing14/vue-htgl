<template>
  <Dialog
    ref="drawer"
    :title="pageStatus==='add'?'新增收货地址':'编辑收货地址'"
    :visible.sync="visible"
    :onOk="onOk"
    @close="closeDialog"
    width="500px"
  >
    <el-form v-if="visible" ref="form" :model="form" :rules="rules" label-width="100px">
      <el-form-item label="收货人" prop="receiverName">
        <el-input v-model="form.receiverName" placeholder="请输入收货人" :maxlength="30"></el-input>
      </el-form-item>
      <el-form-item label="所在地区" prop="address">
        <el-cascader size="large" :options="options" v-model="form.address" style="width: 100%;"></el-cascader>
      </el-form-item>
      <el-form-item label="详细地址" prop="detailAddress">
        <el-input v-model="form.detailAddress" placeholder="请输入详细地址"></el-input>
      </el-form-item>
      <el-form-item label="联系电话" prop="receiverPhone">
        <el-input v-model="form.receiverPhone" placeholder="请输入联系电话" :maxlength="50"></el-input>
      </el-form-item>
    </el-form>
  </Dialog>
</template>

<script>
import { merge } from "lodash";
import {
  Api_ReceiverAdd,
  Api_ReceiverUpdate,
} from "@/api/creditManagement/customerProfile/customerManagemCustomer/OtherInformation.js";
import { regionData, CodeToText, TextToCode } from "element-china-area-data";

export default {
  name: "NewAdress",
  data() {
    const createRules = this.$createRules;
    return {
      pageStatus: "",
      rowData: {},
      form: {
        address: [],
        companyId: "",
        companyName: "",
        receiverName: "", // 收货人
        province: "", // 省
        city: "", // 市
        county: "", // 区
        detailAddress: "", // 详细地址
        receiverPhone: "", // 联系电话
      },
      rules: {
        receiverName: createRules({ msg: "收货人", required: true, max: 10 }),
        receiverPhone: createRules({ msg: "联系电话", required: true, phone: true }),
        address: [{ required: true, type: "array", message: "请选择所在地区" }],
        detailAddress: [
          { required: true, message: "详细地址必填" },
          { min: 5, message: "最少填写5个字" },
          { max: 50, message: "最多填写50个字" },
        ],
      },
      visible: false,
      provinceOptions: [], // 省级数据
      cityOptions: [], // 市级数据
      countyOptions: [], // 区级数据
      options: regionData,
      dataId: "", // 编辑时才有
    };
  },
  methods: {
    open(_pageStatus, companyId, companyName, _rowData) {
      this.visible = true;
      this.$nextTick(() => {
        this.$refs.form.resetFields();
        this.pageStatus = _pageStatus;
        if (_pageStatus === "edit") {
          this.form.receiverName = _rowData.receiverName;
          this.form.detailAddress = _rowData.detailAddress;
          this.form.receiverPhone = _rowData.receiverPhone;
          if (_rowData.province) {
            const provinceObj = TextToCode[_rowData.province];
            let cityObj = null;
            let countyObj = null;
            if (_rowData.city) {
              cityObj = provinceObj[_rowData.city];
            }
            if (_rowData.city) {
              countyObj = cityObj[_rowData.county];
            }
            const addressArr = [provinceObj.code];
            cityObj && addressArr.push(cityObj.code);
            countyObj && addressArr.push(countyObj.code);
            this.form.address = addressArr;
          }
          this.dataId = _rowData.id;
        } else {
          this.dataId = "";
        }
        this.form.companyId = companyId;
        this.form.companyName = companyName;
      });
    },
    onOk() {
      this.$refs.form.validate((valid) => {
        if (valid) {
          const postData = merge({}, this.form);
          postData.province = CodeToText[postData.address[0]];
          if (postData.address[1]) {
            postData.city = CodeToText[postData.address[1]];
          }
          if (postData.address[2]) {
            postData.county = CodeToText[postData.address[2]];
          }
          delete postData.address;
          const loading = this.$openLoading();
          const promiseRes =
            this.pageStatus === "add" ? Api_ReceiverAdd(postData) : Api_ReceiverUpdate(this.dataId, postData);
          promiseRes
            .then((res) => {
              loading.close();
              this.$message.success(res);
              this.visible = false;
              this.closeDialog();
              this.$emit("getList");
            })
            .catch((e) => {
              loading.close();
              this.$message.error(e);
            });
        }
      });
    },
    handleChange(value) {
      console.log(value);
    },
    closeDialog() {
      this.$refs.form.resetFields();
    },
  },
};
</script>

<style>
</style>
