<template>
  <div>
    <div class="page-header">
      <h1 class="page-name">
        <span>异常处理详情</span>
      </h1>
      <div>
        <el-button @click="back">返回</el-button>
      </div>
    </div>
    <div class="page-content">
      <el-form ref="form" v-model="displayInfo" label-width="110px">
        <el-form-item label="客户名称">
          <span
            class="canClick"
            @click="$gotoCustomerDetail(displayInfo.customerId)"
          >{{ displayInfo.customerName }}</span>
        </el-form-item>
        <el-divider class="detail-divider"></el-divider>
        <el-form-item label="订单名称">
          <span
            class="canClick"
            @click="$gotoOrderDetail(displayInfo.contractId)"
          >{{ displayInfo.contractNo }}/{{ displayInfo.contractName }}</span>
        </el-form-item>
        <el-divider class="detail-divider"></el-divider>
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
            <el-form-item label="签收人">{{ displayInfo.arrivalInfo.name }}/{{displayInfo.headDept||'-'}}</el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="签收日期">{{ $dateFormat(displayInfo.arrivalInfo.signDate) }}</el-form-item>
          </el-col>
        </el-row>
        <el-divider class="detail-divider"></el-divider>
        <el-row>
          <el-col :span="8">
            <el-form-item label="处理人">{{ details.headUser||'-' }}</el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="处理状态">
              {{details.state==='1'
              ?'待处理'
              :details.state==='2'
              ?'待审批'
              :details.state==='3'
              ?'处理中'
              :details.state==='4'
              ?'处理完成'
              :'-'}}
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="处理时间">{{ details.createDate?details.createDate.substr(0,10):'-' }}</el-form-item>
          </el-col>
        </el-row>
        <el-divider class="detail-divider"></el-divider>
        <TableWrapper
          ref="ref_arrival"
          :data="displayInfo.arrivalInfo.goods"
          :query="{}"
          :columns="arrivalCol"
          style="margin: 10px 0"
        />
        <el-form-item label="到货备注">{{ displayInfo.arrivalInfo.arrivalRemark||'-' }}</el-form-item>
        <el-divider class="detail-divider"></el-divider>
        <el-form-item label="到货附件">
            <span class="canClick" @click="checkFiles(displayInfo.arrivalInfo.attachmentVo)">查看附件</span>
          <!-- <div
            v-if="displayInfo.arrivalInfo.attachmentVo&&displayInfo.arrivalInfo.attachmentVo.length"
            class="demo-image__preview"
          >
            <el-image
              v-for="(item, index) in displayInfo.arrivalInfo.attachmentVo"
              :key="index"
              style="width: 100px; height: 100px; margin-right: 6px"
              :src="imgUrlO+item.url"
              :preview-src-list="displayInfo.arrivalInfo.attachmentVo.map(i=>imgUrlO+i.url)"
            ></el-image>
          </div>
          <span v-else>无</span> -->
            <!-- <ImgView :urls="displayInfo.arrivalInfo.attachmentVo"></ImgView> -->
        </el-form-item>
        <el-divider class="detail-divider"></el-divider>
        <el-form-item label="异常原因">{{getAbnormalReason(details.abnormalReason)}}</el-form-item>
        <el-divider class="detail-divider"></el-divider>
        <el-form-item label="处理措施">{{getDealMeasure(details.dealMeasure)}}</el-form-item>
        <el-divider class="detail-divider"></el-divider>
        <el-form-item label="处理描述">{{details.remark}}</el-form-item>
        <el-divider class="detail-divider"></el-divider>
        <el-form-item label="异常处理附件">
          <!-- <div v-if="details.files&&details.files.length" class="demo-image__preview">
            <el-image
              v-for="(item, index) in details.files"
              :key="index"
              style="width: 100px; height: 100px; margin-right: 6px"
              :src="item.url"
              :preview-src-list="details.files.map(i=>i.url)"
            ></el-image>
          </div>
          <span v-else>无</span> -->

            <span class="canClick" @click="checkFiles(details.files)">查看附件</span>
        </el-form-item>
        <el-divider class="detail-divider"></el-divider>
      </el-form>
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
import { Api_getAbnormalDetail } from "@/api/creditManagement/shippingManagement/abnormalShipment.js";
import ImgView from "@/components/ImgView/index.vue";
export default {
  name: "AbnormalDetail",
  components: {ImgView },
  data() {
    return {
      imgUrlO:process.env.VUE_APP_FILE_API,
      srcList: [],
      displayInfo: {
        customerId: null,
        customerName: null,
        contractId: null,
        contractNo: null,
        contractName: null,
        code: null,
        arrivalInfo: {},
        shipmentId: null
      },
      details: {},
      arrivalCol: [
        { label: "产品/服务名称", key: "name" },
        { label: "销售单位", key: "company" },
        { label: "发货数量", key: "sendNum" },
        {
          label: "到货数量",
          key: "arrivalNum",
          render: (h, data, row) => {
            return row.sendNum !== data ? <span style="color: #F56C6C">{data}</span> : data;
          }
        }
      ]
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
      const loading = this.$openLoading();
      Api_ArrivalDetail(rr.shipmentId)
        .then(res => {
          this.displayInfo.arrivalInfo = res[0];
          Api_getAbnormalDetail(rr.id)
            .then(res2 => {
              this.displayInfo.customerId = res2.companyId;
              this.displayInfo.customerName = res2.companyName;
              this.displayInfo.contractId = res2.contractId;
              this.displayInfo.contractNo = res2.contractCode;
              this.displayInfo.contractName = res2.contractName;
              this.displayInfo.code = res2.shipmentCode;
              this.displayInfo.headDept = res2.headDept;
              this.displayInfo.shipmentId = res2.shipmentId;
              if (res2.modifyDate) {
                this.details = res2;
              }
              loading.close();
            })
            .catch(res2 => {
              loading.close();
            });
        })
        .catch(res => {
          loading.close();
        });
    },
    getAbnormalReason(vv) {
      return vv === "1"
        ? "发货登记错误"
        : vv === "2"
        ? "运输损耗"
        : vv === "3"
        ? "货品丢失"
        : vv === "4"
        ? "质量问题"
        : vv === "5"
        ? "其他"
        : "-";
    },
    getDealMeasure(vv) {
      return vv === "1" ? "补发货品差额" : vv === "2" ? "其他处理措施" : "-";
    },
    back() {
      this.$emit("hideAbnormalDetail");
    }
  }
};
</script>

<style>
</style>
