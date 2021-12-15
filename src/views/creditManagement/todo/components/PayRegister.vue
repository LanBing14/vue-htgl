<template>
  <div>
    <div class="page-header">
      <h1 class="page-name">
        <span>收款登记审批</span>
      </h1>
      <div>
        <el-button @click="back">返回</el-button>
      </div>
    </div>
    <div class="page-content">
      <el-form ref="form" :model="details" label-width="120px">
        <el-row>
          <el-col :span="8">
            <el-form-item label="客户名称">
              <span
                class="canClick"
                @click="$gotoCustomerDetail(details.contract.customerId)"
              >{{ details.contract.customerName }}</span>
            </el-form-item>
          </el-col>
        </el-row>
        <el-divider class="detail-divider"></el-divider>
        <el-row>
          <el-col :span="12">
            <el-form-item label="订单编码/名称">
              <span
                class="canClick"
                @click="details.contract.order?$gotoOrderDetail(details.contract.id):$gotoContractDetail(details.contract.id)"
              >{{ details.contract.contractCode }}/{{ details.contract.contractName }}</span>
            </el-form-item>
          </el-col>
        </el-row>
        <el-divider class="detail-divider"></el-divider>
        <el-row>
          <el-col :span="8">
            <el-form-item label="应收编码">
              <span class="canClick" @click="$gotoReceivablesDetail(details.plan.id)">{{ details.plan.code }}</span>
            </el-form-item>
          </el-col>
        </el-row>
        <el-divider class="detail-divider"></el-divider>
        <el-row>
          <el-col :span="8">
            <el-form-item label="收款状态">
              {{ details.register.state === "-1"
              ? "待提交"
              : details.register.state === "1"
              ? "待核销"
              : details.register.state === "2"
              ? "已核销"
              : details.register.state === "3"
              ? "待审核"
              : details.register.state === "0"
              ? "驳回"
              : "-" }}
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="登记人">{{ details.register.creator }}</el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="登记时间">{{ details.plan.createDate?details.plan.createDate.substr(0,10):'-' }}</el-form-item>
          </el-col>
        </el-row>
        <el-divider class="detail-divider"></el-divider>
        <el-tabs type="border-card" style="margin-top: 20px">
          <el-tab-pane label="收款登记情况">
            <el-row>
              <el-col :span="8">
                <el-form-item label="收款编码">{{ details.register.registerCode }}</el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="收款日期">{{ $dateFormat(details.register.payDate) }}</el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item
                  label="收款金额"
                >{{ $toMoney(details.register.payAmount+details.register.discountAmount) }} 元</el-form-item>
              </el-col>
            </el-row>
            <el-divider class="detail-divider"></el-divider>
            <el-row>
              <el-col :span="8">
                <el-form-item label="是否结清">{{details.register.isSettle==='1'?'结清账款':'本次不结清'}}</el-form-item>
              </el-col>
              <el-col :span="8" v-if="details.register.isSettle==='1'&&details.plan.planType==='1'">
                <el-form-item label="现金折扣">
                  <span
                    class="canClick"
                    @click="gotoDiscountDetail(details.register.moneyDiscountId)"
                  >{{details.register.moneyDiscountName}}</span>
                </el-form-item>
              </el-col>
              <el-col :span="8" v-if="details.register.isSettle==='1'&&details.plan.planType==='1'">
                <el-form-item
                  label="折扣率"
                >{{(details.register.discountPer?details.register.discountPer:0)+'%'}}</el-form-item>
              </el-col>
              <el-col :span="24" v-if="details.register.isSettle==='1'&&details.plan.planType==='1'">
                <el-divider class="detail-divider"></el-divider>
              </el-col>
              <el-col :span="8">
                <el-form-item label="实收金额">{{ $toMoney(details.register.payAmount) }} 元</el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="折扣金额">{{ $toMoney(details.register.discountAmount) }} 元</el-form-item>
              </el-col>
            </el-row>
            <el-divider class="detail-divider"></el-divider>
            <el-row>
              <el-col :span="8">
                <el-form-item label="收款备注">{{ details.register.remarks||'-' }}</el-form-item>
              </el-col>
            </el-row>
            <el-divider class="detail-divider"></el-divider>
            <el-row>
              <el-col :span="16">
                <el-form-item label="收款附件">
                  <!-- <template v-if="details.register.uploadFiles&&details.register.uploadFiles.length">
                    <el-image
                      v-for="(iimg, ii) in details.register.uploadFiles"
                      :key="ii"
                      style="width: 100px; height: 100px; margin-right: 6px; margin-top: 6px"
                      :src="imageUrl + iimg.url"
                      :preview-src-list="dealImg"
                    ></el-image>
                  </template>
                  <span v-else>-</span> -->
                  <span class="canClick" @click="checkFiles(details.register.uploadFiles)">查看附件</span>
                </el-form-item>
              </el-col>
            </el-row>
            <el-divider class="detail-divider"></el-divider>
          </el-tab-pane>
          <el-tab-pane label="核销登记情况">
            <div
              v-if="details.cancellations&&details.cancellations.length&&(details.cancellations[0].state==='0'||details.cancellations[0].state==='2')"
            >
              <el-row>
                <el-col :span="8">
                  <el-form-item label="核销选项">
                    <el-radio-group
                      :value="(details.cancellations[0].state==='2'||details.cancellations[0].state==='-1')?1:2"
                      disabled
                    >
                      <el-radio :label="1">确认核销</el-radio>
                      <el-radio :label="2">核销驳回</el-radio>
                    </el-radio-group>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-divider class="detail-divider"></el-divider>
              <el-row>
                <el-col :span="8">
                  <el-form-item label="核销备注">{{ details.cancellations[0].remarks }}</el-form-item>
                </el-col>
              </el-row>
              <el-divider class="detail-divider"></el-divider>
              <el-row>
                <el-col :span="16">
                  <el-form-item label="核销附件">
                    <template v-if="details.cancellations[0].files&&details.cancellations[0].files.length">
                      <el-image
                        v-for="(iimg, ii) in details.cancellations[0].files"
                        :key="ii"
                        style="width: 100px; height: 100px; margin-right: 6px; margin-top: 6px"
                        :src="imageUrl + iimg.url"
                        :preview-src-list="collectImg"
                      ></el-image>
                    </template>
                    <span v-else>-</span>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-divider class="detail-divider"></el-divider>
              <el-row>
                <!-- <el-col :span="8">
                                <el-form-item label="核销状态">{{ details.cancellations[0].hxzt }}</el-form-item>
                </el-col>-->
                <el-col :span="8">
                  <el-form-item label="核销人">{{ details.cancellations[0].creator }}</el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item
                    label="核销时间"
                  >{{ details.cancellations[0].createDate?details.cancellations[0].createDate.substr(0,10):'-' }}</el-form-item>
                </el-col>
              </el-row>
              <el-divider class="detail-divider"></el-divider>
            </div>
            <div v-else style="color: #909399; text-align: center; padding: 20px">暂无核销记录</div>
          </el-tab-pane>
        </el-tabs>
      </el-form>
      <slot></slot>
      <Detail ref="ref_Detail"></Detail>
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
import { Api_collectionRcordDetails } from "@/api/creditManagement/accountsReceivable/receiptRecords.js";
import Detail from "@/views/creditManagement/creditGranting/creditPolicy/discountPlanComp/Detail.vue";

export default {
  name: "PayRegister",
  props: {
    modelStatus: Boolean,
    row: Object
  },

  components: { Detail },
  data() {
    return {
      imgUrlO:process.env.VUE_APP_FILE_API,
      srcList: [],
      details: {
        cancellations: [{}],
        contract: {},
        register: {},
        plan: {}
      }
    };
  },
  computed: {
    imageUrl() {
      return process.env.VUE_APP_FILE_API
    },
    dealImg(){
      return this.details.register.uploadFiles.map(item=> process.env.VUE_APP_FILE_API + item.url)
    },
    collectImg(){
      return this.details.cancellations[0].files.map(item=> process.env.VUE_APP_FILE_API + item.url)
    }
  },
  mounted() {
    const loading = this.$openLoading();
    Api_collectionRcordDetails(this.row.business_key)
      .then(res => {
        loading.close();
        this.details = res;
      })
      .catch(() => {
        loading.close();
      });
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



    back() {
      this.$emit("edit", false);
    },
    gotoDiscountDetail(id) {
      this.$refs.ref_Detail.open({ id });
    }
  }
};
</script>

<style scoped>
</style>
