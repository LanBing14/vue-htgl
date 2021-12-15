<template>
  <div>
    <div class="page-header">
      <h1 class="page-name">
        <span>发票跟踪详情</span>
      </h1>
      <div>
        <el-button @click="back">返回</el-button>
      </div>
    </div>
    <div v-loading="loading" class="page-content">
      <el-form ref="form" :model="form" label-width="100px">
        <el-row>
          <el-col :span="8">
            <el-form-item label="客户名称">
              <span class="canClick" @click="clientProfileDetail">{{ form.companyName }}</span>
            </el-form-item>
          </el-col>
        </el-row>
        <div>
          <el-row>
            <el-col :span="8">
              <el-form-item label="订单名称">
                <span class="canClick" @click="orderDetail">{{ form.contractCode }}/{{ form.contractName }}</span>
              </el-form-item>
            </el-col>
          </el-row>
          <div style="background-color: #f5f7fa;border: 1px solid #eaedf4;padding: 16px">
            <div
              class="title"
              style="margin-bottom: 15px;font-size: 15px;color: #333;font-weight: bold;"
            >当前订单开票情况</div>
            <el-row>
              <el-col :span="6">
                <el-form-item label="订单金额">{{ form.contractAmount }}元</el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item label="待开金额">{{ form.dkAmount }}元</el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item label="已申请金额">{{ form.ysqAmount }}元</el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item label="已开金额">{{ form.ykAmount }}元</el-form-item>
              </el-col>
            </el-row>
          </div>
          <el-row style="margin-top: 20px">
            <el-col :span="6">
              <el-form-item label="申请编码">{{ form.invoiceCode }}</el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="发票抬头">
                <span class="canClick" @click="goToTitle">{{ form.archivesInvoiceName }}</span>
              </el-form-item>
            </el-col>
            <el-col :span="24">
              <el-divider class="detail-divider"></el-divider>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="6">
              <el-form-item label="发票类型">{{ form.invoiceType === '0' ? '增值税普通发票' : '增值税专用发票' }}</el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="开票金额">{{ form.applyContractMoney }}</el-form-item>
            </el-col>
            <el-col :span="24">
              <el-divider class="detail-divider"></el-divider>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="18">
              <el-form-item label="备注">{{ form.remark }}</el-form-item>
            </el-col>
            <el-col :span="24">
              <el-divider class="detail-divider"></el-divider>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="6">
              <el-form-item label="申请人">{{ form.createName }}</el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="申请状态">{{ form.status | filterStatus }}</el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="申请时间">{{ form.createDate }}</el-form-item>
            </el-col>
          </el-row>
        </div>
      </el-form>

      <el-tabs value="1" type="border-card" style="margin-left: 28px;">
        <el-tab-pane label="发票登记信息" name="1">
          <TableWrapper ref="child" :data="dataList" :columns="tableCol" />
          <template v-if="invoiceRegisterBackList.length">
            <div class="sub-title">打回信息</div>
            <TableWrapper
              ref="child"
              :data="invoiceRegisterBackList"
              :columns="tableColUpBack"
              style="margin-top: 20px"
            />
          </template>
        </el-tab-pane>
        <el-tab-pane label="发票领取信息" name="2" v-if="selectData.status !== '2'&& receiveForm.isReceive">
          <el-form ref="receiveForm" :model="receiveForm">
            <el-row>
              <el-col :span="8">
                <el-form-item label="领取状态">{{ receiveForm.isReceive }}</el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="领取日期">{{ $dateFormat(receiveForm.invoiceDate, 'yyyy-MM-dd') }}</el-form-item>
              </el-col>
              <el-col :span="24">
                <el-divider class="detail-divider"></el-divider>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="18">
                <el-form-item label="发票备注">{{ receiveForm.remark }}</el-form-item>
              </el-col>
              <el-col :span="24">
                <el-divider class="detail-divider"></el-divider>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="8">
                <el-form-item label="快递公司">{{ receiveForm.expressCompany }}</el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="快递单号">{{ receiveForm.expressCode }}</el-form-item>
              </el-col>
              <el-col :span="24">
                <el-divider class="detail-divider"></el-divider>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="8">
                <el-form-item label="领取人">{{ receiveForm.receiveName }}</el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="登记日期">{{ $dateFormat(receiveForm.registerDate, 'yyyy-MM-dd') }}</el-form-item>
              </el-col>
            </el-row>
          </el-form>
          <template v-if="invoicingBackList.length">
            <div class="sub-title">打回信息</div>
            <TableWrapper
              ref="child"
              :data="invoicingBackList"
              :columns="tableBack"
              style="margin-top: 20px"
            />
          </template>
        </el-tab-pane>
        <el-tab-pane
          label="发票签收信息"
          name="3"
          v-if="(selectData.status !== '2' && selectData.status !== '3') && signedForm.signType"
        >
          <el-form ref="signedForm" :model="signedForm">
            <el-row>
              <el-col :span="8">
                <el-form-item label="签收状态">{{ signedForm.signType === '1' ? '签收异常' : '正常签收' }}</el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="送达方式">{{ signedForm.sendType | sendType }}</el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="签收时间">{{ $dateFormat(signedForm.signDate, 'yyyy-MM-dd') }}</el-form-item>
              </el-col>
              <el-col :span="24">
                <el-divider class="detail-divider"></el-divider>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="8">
                <el-form-item label="登记人">{{ signedForm.registerUser }}</el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="登记时间">{{ $dateFormat(signedForm.registerDate, 'yyyy-MM-dd') }}</el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="签收人">{{ signedForm.signName }}</el-form-item>
              </el-col>
              <el-col :span="24">
                <el-divider class="detail-divider"></el-divider>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="8">
                <el-form-item label="附件">
                  <span
                    style="color: #00BFF3;cursor: pointer;"
                    @click.prevent="checkFiles(signedForm.attachment)"
                  >查看附件</span>
                </el-form-item>
              </el-col>
              <el-col :span="24">
                <el-divider class="detail-divider"></el-divider>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="18">
                <el-form-item label="发票备注">{{ signedForm.remark }}</el-form-item>
              </el-col>
            </el-row>
          </el-form>
        </el-tab-pane>
      </el-tabs>
      <!--<el-form ref="form" :model="form" label-width="8em">
                <el-row>
                    <el-col :span="8">
                        <el-form-item label="申请编号">{{ form.invoiceCode }}</el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="合同编码/名称">{{ form.contractCode }}/ {{ form.contractName }}</el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="客户名称">{{ form.companyName }}</el-form-item>
                    </el-col>
                    <el-col :span="24">
                        <el-divider class="detail-divider"></el-divider>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="应收金额">{{ $toMoney(form.totalMoney, 2) }} 元</el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="待开发票">{{ $toMoney(form.waitMoney, 2) }} 元</el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="已开发票">{{ $toMoney(form.alreadyMoney, 2) }} 元</el-form-item>
                    </el-col>
                    <el-col :span="24">
                        <el-divider class="detail-divider"></el-divider>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="申请金额">{{ $toMoney(form.invoiceMoney, 2) }} 元</el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="申请时间">{{ form.applyDate?form.applyDate:'-' }}</el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="申请备注">{{ form.remark?form.remark:'-' }}</el-form-item>
                    </el-col>
                    <el-col :span="24">
                        <el-divider class="detail-divider"></el-divider>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="发票状态">{{ form.status | filterStatus }}</el-form-item>
                    </el-col>
                </el-row>
      </el-form>-->
      <!--申请被打回, 打回信息-->
      <!--<template v-if="invoicingBackList.length">
                <div class="sub-title">开票申请打回信息</div>
                <TableWrapper ref="child" :data="invoicingBackList" :columns="tableBack" style="margin-top: 20px"/>
      </template>-->
      <!--发票登记信息-->
      <!--<template v-if="invoiceRegister">
                <div class="sub-title">发票登记信息</div>
                <el-form ref="form" :model="invoiceRegister" label-width="8em" style="margin-top: 20px">
                    <el-row>
                        <el-col :span="8">
                            <el-form-item label="发票号码">{{ invoiceRegister.invoiceCode }}</el-form-item>
                        </el-col>
                        <el-col :span="8">
                            <el-form-item label="开票金额">{{ $toMoney(invoiceRegister.invoiceMoney, 2) }} 元</el-form-item>
                        </el-col>
                        <el-col :span="8">
                            <el-form-item label="开票日期">{{ $dateFormat(invoiceRegister.invoiceDate) }}</el-form-item>
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col :span="8">
                            <el-form-item label="应收金额">{{ $toMoney(invoiceRegister.totalMoney, 2) }} 元</el-form-item>
                        </el-col>
                        <el-col :span="8">
                            <el-form-item label="发票附件">
                                <span @click="checkFiles(invoiceRegister.attachment)">查看附件</span>
                                &lt;!&ndash;<a v-for="(el,index) in invoiceRegister.attachment"
                                   :key="index"
                                   :href="'/'+el.url"
                                   class="a-link"
                                   download>
                                    {{ el.originalName }}
                                </a>&ndash;&gt;
                            </el-form-item>
                        </el-col>
                        <el-col :span="8">
                            <el-form-item label="发票备注">{{ invoiceRegister.remark }}</el-form-item>
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col :span="8">
                            <el-form-item label="登记人员">{{ invoiceRegister.register_user }}</el-form-item>
                        </el-col>
                        <el-col :span="8">
                            <el-form-item label="登记时间">{{ invoiceRegister.register_date }}</el-form-item>
                        </el-col>
                    </el-row>
                </el-form>
                <template v-if="invoiceRegisterBackList.length">
                    <div class="sub-title">发票登记打回信息</div>
                    <TableWrapper
                        ref="child"
                        :data="invoiceRegisterBackList"
                        :columns="tableColUpBack"
                        style="margin-top: 20px"
                    />
                </template>
      </template>-->
      <!--发票领取信息-->
      <!--<template v-if="invoiceReceive">
                <div class="sub-title">发票领取信息</div>
                <el-form ref="form" :model="invoiceReceive" label-width="8em" style="margin-top: 20px">
                    <el-row>
                        <el-col :span="8">
                            <el-form-item label="领取状态">{{ invoiceReceive.isReceive }}</el-form-item>
                        </el-col>
                        <el-col :span="8">
                            <el-form-item label="领取人">{{ invoiceReceive.receiveName }}</el-form-item>
                        </el-col>
                        <el-col :span="8">
                            <el-form-item label="领取日期">{{ $dateFormat(invoiceReceive.invoiceDate) }}</el-form-item>
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col :span="8">
                            <el-form-item label="发票备注">{{ invoiceReceive.remark }}</el-form-item>
                        </el-col>
                        <el-col :span="8">
                            <el-form-item label="登记日期">{{ $dateFormat(invoiceReceive.registerDate) }}</el-form-item>
                        </el-col>
                    </el-row>
                </el-form>
      </template>-->
      <!--发票签收信息-->
      <!--<template v-if="invoiceSignList.length">
                <div class="sub-title">发票签收信息</div>
                <TableWrapper ref="child" :data="invoiceSignList" :columns="invoiceSignColumn"
                              style="margin-top: 20px"/>
      </template>-->
    </div>
    <Comp1 ref="ref_Comp1"></Comp1>
    <Comp2 ref="ref_Comp2"></Comp2>
    <TitleDetail ref="ref_TitleDetail"></TitleDetail>
    <div class="demo-image__preview" style="position: fixed; top: -200px; left: -200px;">
      <el-image
        ref="ref_Img"
        style="width: 100px; height: 100px"
        :src="srcList[0]"
        :preview-src-list="srcList"
      ></el-image>
    </div>
    <!--        <el-image-viewer v-show="showViewer" :on-close="closeViewer" :url-list="srcList"/>-->
  </div>
</template>

<script type="text/jsx">
import {
  Api_invoiceDetail,
  Api_GetInvoiceTrackingInfo,
} from "@/api/creditManagement/invoice/invoiceTracking.js";
import Comp1 from "./Comp1";
import Comp2 from "./Comp2";
import TitleDetail from "../invoiceList/TitleDetail";

export default {
  name: "BillingDetails",
  components: { Comp1, Comp2, TitleDetail },
  filters: {
    filterStatus(data) {
      let newData = "";
      if (data === "0") {
        newData = "开票申请";
      }
      if (data === "1") {
        newData = "发票待开";
      }
      if (data === "2") {
        newData = "待领取";
      }
      if (data === "3") {
        newData = "待签收";
      }
      if (data === "4") {
        newData = "已签收";
      }
      if (data === "5") {
        newData = "签收异常";
      }
      if (data === "6") {
        newData = "已作废";
      }
      return newData;
    },
    sendType(data) {
      let newData = "";
      if (data === "0") {
        newData = "快递送达";
      }
      if (data === "1") {
        newData = "当面递交";
      }
      if (data === "2") {
        newData = "随货物送达";
      }
      if (data === "3") {
        newData = "其他";
      }
      return newData;
    },
  },
  props: {
    showDetail: Boolean,
    selectData: Object,
  },
  data() {
    return {
      showViewer: false,
      form: {
        companyId: "",
        companyName: "",
        contractCode: "",
        contractName: "",
        contractAmount: "",
        dkAmount: "",
        ysqAmount: "",
        ykAmount: "",
        invoiceCode: "",
        archivesInvoiceId: "",
        archivesInvoiceName: "",
        invoiceType: "",
        applyContractMoney: "",
        remark: "",
        createName: "",
        status: "",
        createDate: "",
      },
      dataList: [],
      tableCol: [
        {
          key: "archive",
          label: "发票抬头",
          render: (h, data) => {
            return data.invoice;
          },
        },
        {
          key: "invoiceCode",
          label: "发票号码",
        },
        {
          key: "applyContractMoney",
          label: "发票金额（元）",
          render: (h, data) => {
            return this.$toMoney(data, 2);
          },
        },
        {
          key: "invoiceDate",
          label: "开票日期",
          render: (h, data) => {
            return this.$dateFormat(data, "yyyy-MM-dd");
          },
        },
        {
          key: "attachment",
          label: "附件",
          render: (h, data) => {
            return (
              <span class="canClick" onClick={this.checkFiles.bind(this, data)}>
                查看附件
              </span>
            );
          },
        },
        {
          key: "registerUser",
          label: "登记人",
        },
        {
          key: "registerDate",
          label: "登记时间",
          render: (h, data) => {
            return this.$dateFormat(data, "yyyy-MM-dd");
          },
        },
      ],
      receiveForm: {},
      signedForm: {},
      // form: {
      //     contractCode: "", //    合同编码/名称
      //     contractName: "",
      //     companyName: "", //     客户名称
      //     contractMoney: "",
      //     totalMoney: "", //  	应收金额
      //     uncollectedMoney: "",
      //     toBeOpenMoney: "",
      //     invoiceMoney: "", //	申请金额
      //     alreadyMoney: "", // 	已开发票
      //     waitMoney: "", // 	    待开发票
      //     remake: "", // 	        申请备注
      //     applyDate: "", // 	    申请时间
      //     invoiceCode: "", // 	申请编号
      //     status: "" // 	        发票状态
      // },
      invoicingBackList: [], // 申请被打回, 打回信息
      invoiceRegisterBackList: [], // 发票登记打回记录
      invoiceReceive: null, // 发票领取
      invoiceRegister: null, // 发票登记
      invoiceSignList: [], // 发票签收

      tableColUpBackList: [], // 发票登记打回信息
      tableColUpList: [],
      tableColDownList: [],
      tableBack: [
        {
          label: "打回时间",
          key: "createDate",
          render: (h, data) => {
            return this.$dateFormat(data);
          },
        },
        {
          label: "打回原因",
          key: "returnRemark",
        },
        {
          label: "打回人",
          key: "returnName",
        },
        {
          label: "打回时申请信息",
          key: null,
          render: (h, data, row) => {
            return (
              <a href="#" class="a-link" onClick={this.openBackRegDetail.bind(this, row)}>
                打回时申请信息
              </a>
            );
          },
        },
      ],
      tableColUpBack: [
        {
          label: "打回时间",
          key: "createDate",
          render: (h, data) => {
            return this.$dateFormat(data);
          },
        },
        {
          label: "打回原因",
          key: "returnRemark",
        },
        {
          label: "打回人",
          key: "returnName",
        },
        {
          label: "打回时申请信息",
          key: null,
          render: (h, data, row) => {
            return (
              <a href="#" class="a-link" onClick={this.openBackInvoiceDetail.bind(this, row)}>
                打回时申请信息
              </a>
            );
          },
        },
      ],
      tableColDown: [
        { label: "申请编号", key: "applyCode" },
        { label: "客户名称", key: "companyName" },
        { label: "发票号码", key: "invoiceCode" },
        {
          label: "开票金额",
          key: "invoiceMoney",
          align: "right",
          render: (h, data) => {
            return this.$toMoney(data, 2);
          },
        },
        {
          label: "开票日期",
          key: "invoiceDate",
          render: (h, data) => {
            return this.$dateFormat(data);
          },
        },
        { label: "发票状态", key: "invoiceDate" },
        {
          label: "签收时间",
          key: "signDate",
          render: (h, data) => {
            return this.$dateFormat(data);
          },
        },
        { label: "备注", key: "remark" },
        { label: "发票附件", key: "" },
      ],
      // 发票签收table-column
      invoiceSignColumn: [
        {
          label: "领取状态",
          key: "sign",
        },
        {
          label: "领取人",
          key: "signName",
        },
        {
          label: "领取日期",
          key: "signDate",
          render: (h, data) => {
            return this.$dateFormat(data);
          },
        },
        {
          label: "发票备注",
          key: "remark",
        },
        {
          label: "登记日期",
          key: "registerDate",
        },
      ],
      srcList: [],
    };
  },
  created() {
    this.getDetail();
  },
  methods: {
    closeViewer() {
      this.showViewer = false;
    },
    getDetail() {
      this.loading = true;
      Api_invoiceDetail(this.selectData.id)
        .then((res) => {
          Object.keys(this.form).forEach((key) => {
            this.form[key] = res.invoice[key];
          });

          this.form.contractAmount = res.ysAmount;
          this.form.dkAmount = res.dkAmount;
          this.form.ysqAmount = res.ysqAmount;
          this.form.ykAmount = res.ykAmount;

          this.dataList = res.invoiceRegister ? [res.invoiceRegister] : [];
          this.receiveForm = res.invoiceReceive || {};
          this.signedForm = res.invoiceSign || {};

          this.invoicingBackList = res.invoicingBackList || [];
          this.invoiceRegisterBackList = res.invoiceRegisterBackList || [];
          this.invoiceReceive = res.invoiceReceive;
          this.invoiceRegister = res.invoiceRegister;
          this.invoiceSignList = res.invoiceSignList || [];
          this.loading = false;
        })
        .catch((res) => {
          this.$message.error(res);
          this.loading = false;
        });
    },
    // 打回开票申请信息
    openBackInvoiceDetail(row) {
      this.$refs.ref_Comp1.open(row);
    },
    // 打回发票登记申请信息
    openBackRegDetail(row) {
      this.$refs.ref_Comp2.open(row);
    },
    back() {
      this.$emit("edit", false);
    },
    checkFiles(row) {
      if (!row || !row.length) {
        this.$message.error("没有上传图片！");
        return false;
      }
      this.srcList = row.map((item) => process.env.VUE_APP_FILE_API + item.url);
      this.$nextTick(() => {
        this.$refs.ref_Img.clickHandler();
      });
      // this.showViewer = true
    },
    // 跳转客户档案
    clientProfileDetail() {
      this.$gotoCustomerDetail(this.selectData.companyId);
    },
    // 订单详情
    orderDetail() {
      if (this.selectData.orders) {
        // 订单详情
        this.$gotoOrderDetail(this.selectData.contractId);
      } else {
        // 合同详情
        this.$gotoContractDetail(this.selectData.contractId);
      }
    },
    // 发票详情
    goToTitle() {
      this.$refs.ref_TitleDetail.open(this.form.archivesInvoiceId);
    },
  },
};
</script>

<style>
.el-form-item__content {
  color: #666666;
}
</style>
