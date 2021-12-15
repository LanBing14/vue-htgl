<template>
  <div>
    <div class="page-header">
      <h1 class="page-name">
        <span>异常处理</span>
      </h1>
      <div>
        <el-button @click="back">返回</el-button>
      </div>
    </div>
    <div class="page-content">
      <el-form ref="form" :model="form" label-width="100px">
        <el-form-item label="客户名称">
          <span
            class="canClick"
            @click="$gotoCustomerDetail(displayInfo.customerId)"
          >{{ displayInfo.customerName }}</span>
        </el-form-item>
        <el-form-item label="订单名称">
          <span
            class="canClick"
            @click="$gotoOrderDetail(displayInfo.contractId)"
          >{{ displayInfo.contractNo }}/{{ displayInfo.contractName }}</span>
        </el-form-item>
        <el-row>
          <el-col :span="8">
            <el-form-item label="发货编码">
              <span
                class="canClick"
                @click="$gotoShippingDetail(displayInfo.shipmentId,displayInfo.contractId)"
              >{{ displayInfo.code }}</span>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="签收人">{{ displayInfo.arrivalInfo.name }}/{{displayInfo.headDept}}</el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="签收日期">{{ $dateFormat(displayInfo.arrivalInfo.signDate) }}</el-form-item>
          </el-col>
        </el-row>
        <TableWrapper
          ref="ref_arrival"
          :data="displayInfo.arrivalInfo.goods?displayInfo.arrivalInfo.goods.filter(item=>item.sendNum!==item.arrivalNum):[]"
          :query="{}"
          :columns="arrivalCol"
          style="margin: 10px 0"
        />
        <el-form-item label="到货备注">{{ displayInfo.arrivalInfo.arrivalRemark||'-' }}</el-form-item>
        <el-form-item label="附件查看">
          <!-- <div
            v-if="displayInfo.arrivalInfo.attachmentVo&&displayInfo.arrivalInfo.attachmentVo.length"
            class="demo-image__preview"
          >
            <el-image
              v-for="(item, index) in displayInfo.arrivalInfo.attachmentVo"
              :key="index"
              style="width: 100px; height: 100px; margin-right: 6px"
              :src="item.url"
              :preview-src-list="displayInfo.arrivalInfo.attachmentVo.map(i=>i.url)"
            ></el-image> -->
          <!-- </div> -->
          <!-- <span v-else>无</span> -->

           <span class="canClick" @click="checkFiles(displayInfo.arrivalInfo.attachmentVo)">查看附件</span>
        </el-form-item>
        <el-row>
          <el-col :span="8">
            <el-form-item
              label="异常原因"
              prop="abnormalReason"
              :rules="$createRules({msg:'异常原因',required:true})"
            >
              <el-select v-model="form.abnormalReason" placeholder="请选择异常原因分析" style="width: 100%">
                <el-option label="发货登记错误" value="1"></el-option>
                <el-option label="运输损耗" value="2"></el-option>
                <el-option label="货品丢失" value="3"></el-option>
                <el-option label="质量问题" value="4"></el-option>
                <el-option label="其他" value="5"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="8">
            <el-form-item label="处理措施" prop="dealMeasure" :rules="$createRules({msg:'处理措施',required:true})">
              <el-select v-model="form.dealMeasure" placeholder="请选择异常处理措施" style="width: 100%">
                <el-option label="补发货品差额" value="1"></el-option>
                <el-option label="其他处理措施" value="2"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="8">
            <el-form-item label="处理描述" prop="remark">
              <el-input v-model="form.remark" type="textarea" :rows="4" placeholder="请输入异常处理详细描述信息"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="8">
            <el-form-item label="附件上传">
              <Upload v-model="urls" fileType="jpg,png" :limit="5" :fileSize="20"></Upload>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div style="text-align: center size-btn-change">
        <el-button type="success" @click="saveHandle">保存</el-button>
        <el-button type="primary" @click="submitHandle">提交</el-button>
      </div>
    </div>
     <div class="demo-image__preview" style="position: fixed; top: -200px; left: -200px; z-index: 10000">
      <el-image
        ref="ref_Img"
        style="width: 100px; height: 100px"
        :src="srcList[0]"
        :preview-src-list="srcList"
      ></el-image>
    </div>   
  </div>
</template>

<script>
import { Api_ArrivalDetail } from "@/api/creditManagement/shippingManagement/shippingTracking.js";
import {
  Api_abnormalDeal,
  Api_getAbnormalDetail,
} from "@/api/creditManagement/shippingManagement/abnormalShipment.js";
import Upload from "@/components/Upload/index.vue";

export default {
  name: "AbnormalHandle",
  components: { Upload },
  data() {
    return {
      imgUrlO:process.env.VUE_APP_FILE_API,
      srcList: [],
      shipId: null,
      form: {
        abnormalReason: null,
        dealMeasure: null,
        remark: null,
        urls: [],
        state: null,
      },
      urls: [],
      displayInfo: {
        customerId: null,
        customerName: null,
        contractId: null,
        contractNo: null,
        contractName: null,
        code: null,
        arrivalInfo: {},
      },
      arrivalCol: [
        { label: "产品/服务名称", key: "name" },
        { label: "销售单位", key: "company" },
        { label: "发货数量", key: "sendNum" },
        {
          label: "到货数量",
          key: "arrivalNum",
          render: (h, data, row) => {
            return row.sendNum !== data ? <span style="color: #F56C6C">{data}</span> : data;
          },
        },
      ],
    };
  },
  methods: {
            // 查看图片
    checkFiles(row) {
      if (!row || !row.length) {
        this.$message.error("没有上传图片！");
        return false;
      }
      this.srcList = row.map((item) => process.env.VUE_APP_FILE_API + item.url);
      this.$nextTick(() => {
        this.$refs.ref_Img.clickHandler();
      });
    },
    /**
     * @rr row data
     */
    open(rr) {
      this.shipId = rr.id;
      const loading = this.$openLoading();
      Api_ArrivalDetail(rr.shipmentId)
        .then((res) => {
          this.displayInfo.arrivalInfo = res[0];
          Api_getAbnormalDetail(rr.id)
            .then((res2) => {
              this.displayInfo.customerId = res2.companyId;
              this.displayInfo.customerName = res2.companyName;
              this.displayInfo.contractId = res2.contractId;
              this.displayInfo.contractNo = res2.contractCode;
              this.displayInfo.contractName = res2.contractName;
              this.displayInfo.code = res2.shipmentCode;
              this.displayInfo.headDept = res2.headDept;
              this.displayInfo.shipmentId = res2.shipmentId;
              if (res2.modifyDate) {
                this.form.abnormalReason = res2.abnormalReason;
                this.form.dealMeasure = res2.dealMeasure;
                this.form.remark = res2.remark;
                this.urls = res2.files.map((item) => ({ name: item.originalName, url: item.url }));
              }
              loading.close();
            })
            .catch((res2) => {
              loading.close();
            });
        })
        .catch((res) => {
          loading.close();
        });
    },
    back() {
      this.$emit("hideAbnormalHandle");
    },
    saveHandle() {
      this.$refs["form"].validate((valid) => {
        if (valid) {
          this.form.state = 1;
          this.form.urls = this.urls.map((item) => item.url);
          const loading = this.$openLoading();
          Api_abnormalDeal(this.shipId, this.form)
            .then((res) => {
              loading.close();
              this.$message.success({
                dangerouslyUseHTMLString: true,
                message: res,
              });
              this.$emit("getList");
              this.$emit("hideAbnormalHandle");
            })
            .catch((res) => {
              loading.close();
              this.$message.error(res);
            });
        }
      });
    },
    submitHandle() {
      this.$refs["form"].validate((valid) => {
        if (valid) {
          this.form.state = 2;
          this.form.urls = this.urls.map((item) => item.url);
          const loading = this.$openLoading();
          Api_abnormalDeal(this.shipId, this.form)
            .then((res) => {
              loading.close();
              this.$message.success({
                dangerouslyUseHTMLString: true,
                message: res,
              });
              this.$emit("getList");
              this.$emit("hideAbnormalHandle");
            })
            .catch((res) => {
              loading.close();
              this.$message.error(res);
            });
        }
      });
    },
  },
};
</script>

<style>
</style>
