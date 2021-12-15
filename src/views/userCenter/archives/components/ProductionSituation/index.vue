<template>
  <el-row class="credit-tab-content containerRow">
    <!-- 知识产权概览 -->
    <h4 class="flex">
      <span class="flex-primary">知识产权概览</span>
    </h4>
    <el-row class="area">
      <el-form
        ref="form"
        :model="formData1"
        label-width="9em"
        label-position="right"
      >
        <el-row>
          <el-col :span="8">
            <el-form-item
              label="知识产权申请数："
              prop="intellectualApplyNumber"
              class="eyear"
            >
              <el-input
                v-model="formData1.intellectualApplyNumber"
                :disabled="disabled1"
              >
              </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item
              label="知识产权授权数："
              prop="intellectualAuthorizedNumber"
              :title="formData1.intellectualAuthorizedNumber"
            >
              <el-input
                v-model="formData1.intellectualAuthorizedNumber"
                :disabled="disabled1"
              >
              </el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="8">
            <el-form-item
              label="专利转让数："
              prop="patentTransfersNumber"
              :title="formData1.patentTransfersNumber"
            >
              <el-input
                v-model="formData1.patentTransfersNumber"
                :disabled="disabled1"
              >
              </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item
              label="专利许可数："
              prop="patentLicensesNumber"
              :title="formData1.patentLicensesNumber"
            >
              <el-input
                v-model="formData1.patentLicensesNumber"
                :disabled="disabled1"
              >
              </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item
              label="技术引进数："
              prop="technologyIntroducedNumber"
              :title="formData1.technologyIntroducedNumber"
            >
              <el-input
                v-model="formData1.technologyIntroducedNumber"
                :disabled="disabled1"
              >
              </el-input>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <!-- <div style="text-align: center">
        <el-button>保存</el-button>
      </div> -->
    </el-row>

    <h4 class="flex">
      <span class="flex-primary">发明专利</span>
    </h4>
    <el-row class="area">
      <TableWrapper
        ref="ref_tableComp2"
        :fetchDataFn="Api_InventionPatentPage"
        :query="{ id: CompanyId }"
        :showTotalCount="true"
        :columns="col_tableComp2"
      />
    </el-row>

    <Dialog
      ref="drawer"
      :visible.sync="visible2"
      title="发明专利详情"
      :showBtn="false"
      @close="onCloseComp2"
      width="1100px"
    >
      <el-form
        ref="ref_formComp2"
        :model="modelForm2"
        label-width="8em"
        label-position="right"
      >
        <el-row>
          <el-col :span="24">
            <el-form-item label="专利名称：" prop="patentName">
              <el-input
                v-model="modelForm2.patentName"
                :disabled="disabled2"
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="专利类型：" prop="patentType">
              <el-input
                v-model="modelForm2.patentType"
                :disabled="disabled2"
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="专利申请号：" prop="patentApplicationNo">
              <el-input
                v-model="modelForm2.patentApplicationNo"
                :disabled="disabled2"
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="专利申请日：" prop="patentApplyingDate">
              <el-date-picker   style="width:100%"
                v-model="modelForm2.patentApplyingDate"
                :disabled="disabled2"
                type="date"
                placeholder="选择日期"
              >
              </el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="地区：" prop="region">
              <el-input
                v-model="modelForm2.region"
                :disabled="disabled2"
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="地址：" prop="address">
              <el-input
                v-model="modelForm2.address"
                :disabled="disabled2"
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="专利授权日：" prop="patentAuthorizationDate">
              <el-date-picker   style="width:100%"
                v-model="modelForm2.patentAuthorizationDate"
                :disabled="disabled2"
                type="date"
                placeholder="选择日期"
              >
              </el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="专利授权号：" prop="patentAuthorizationNumber">
              <el-input
                v-model="modelForm2.patentAuthorizationNumber"
                :disabled="disabled2"
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="备注：" prop="remarks">
              <el-input
                type="textarea"
                :autosize="{ minRows: 4 }"
                placeholder="请输入内容"
                :disabled="disabled2"
                v-model="modelForm2.remarks"
              >
              </el-input>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </Dialog>

    <h4 class="flex">
      <span class="flex-primary">软著</span>
    </h4>

    <el-row class="area">
      <TableWrapper
        ref="ref_tableComp3"
        :fetchDataFn="Api_SoftWorkPage"
        :query="{ id: CompanyId }"
        :showTotalCount="true"
        :columns="col_tableComp3"
      />
    </el-row>

    <Dialog
      ref="drawer"
      :visible.sync="visible3"
      title="软著详情"
      :showBtn="false"
      @close="onCloseComp3"
      width="1100px"
    >
      <el-form
        ref="ref_formComp3"
        :model="modelForm3"
        label-width="9em"
        label-position="right"
      >
        <el-row>
          <el-col :span="24">
            <el-form-item label="软件全称：" prop="softwareFullName">
              <el-input
                v-model="modelForm3.softwareFullName"
                :disabled="disabled3"
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="软件简称：" prop="softwareAbbreviation">
              <el-input
                v-model="modelForm3.softwareAbbreviation"
                :disabled="disabled3"
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="受理号：" prop="acceptanceNumber">
              <el-input
                v-model="modelForm3.acceptanceNumber"
                :disabled="disabled3"
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="登记号：" prop="registrationNumber">
              <el-input
                v-model="modelForm3.registrationNumber"
                :disabled="disabled3"
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="分类号：" prop="classificationNumber">
              <el-input
                v-model="modelForm3.classificationNumber"
                :disabled="disabled3"
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="版本号：" prop="versionNumber">
              <el-input
                v-model="modelForm3.versionNumber"
                :disabled="disabled3"
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="16">
            <el-form-item label="著作人（国籍）：" prop="copyrightNationality">
              <el-input
                v-model="modelForm3.copyrightNationality"
                :disabled="disabled3"
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="首次发表日期：" prop="firstPublicationDate">
              <el-date-picker   style="width:100%"
                v-model="modelForm3.firstPublicationDate"
                :disabled="disabled3"
                type="date"
                placeholder="选择日期"
              >
              </el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="登记日期：" prop="registrationDate">
              <el-date-picker   style="width:100%"
                v-model="modelForm3.registrationDate"
                :disabled="disabled3"
                type="date"
                placeholder="选择日期"
              >
              </el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="备注：" prop="remarks">
              <el-input
                type="textarea"
                :autosize="{ minRows: 4 }"
                placeholder="请输入内容"
                v-model="modelForm3.remarks"
                :disabled="disabled3"
              >
              </el-input>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </Dialog>

    <h4 class="flex">
      <span class="flex-primary">商标</span>
    </h4>

    <el-row class="area">
      <TableWrapper
        ref="ref_tableComp4"
        :fetchDataFn="Api_TrademarkDetailsPage"
        :query="{ id: CompanyId }"
        :showTotalCount="true"
        :columns="col_tableComp4"
      />
    </el-row>

    <Dialog
      ref="drawer"
      :visible.sync="visible4"
      title="商标详情"
      :showBtn="false"
      width="1100px"
      @close="onCloseComp4"
    >
      <el-form
        ref="ref_formComp4"
        :model="modelForm2"
        label-width="9em"
        label-position="right"
      >
        <el-row>
          <el-col :span="24">
            <el-form-item label="商标名称：" prop="trademarkName">
              <el-input
                v-model="modelForm4.trademarkName"
                :disabled="disabled4"
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="商标分类码：" prop="trademarkSort">
              <el-input
                v-model="modelForm4.trademarkSort"
                :disabled="disabled4"
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="商标分类码描述：" prop="trademarkSortDesc">
              <el-input
                v-model="modelForm4.trademarkSortDesc"
                :disabled="disabled4"
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item
              label="商标申请号："
              prop="trademarkApplicationNumber"
            >
              <el-input
                v-model="modelForm4.trademarkApplicationNumber"
                :disabled="disabled4"
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="商标申请日" prop="trademarkApplicationDate">
              <el-date-picker   style="width:100%"
                v-model="modelForm4.trademarkApplicationDate"
                :disabled="disabled4"
                type="date"
                placeholder="选择日期"
              >
              </el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item
              label="商标授权号："
              prop="trademarkAuthorizationNumber"
            >
              <el-input
                v-model="modelForm4.trademarkAuthorizationNumber"
                :disabled="disabled4"
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item
              label="商标授权日："
              prop="trademarkAuthorizationDate"
            >
              <el-date-picker   style="width:100%"
                v-model="modelForm4.trademarkAuthorizationDate"
                :disabled="disabled4"
                type="date"
                placeholder="选择日期"
              >
              </el-date-picker>
            </el-form-item>
          </el-col>

          <el-col :span="24">
            <el-form-item label="备注：" prop="remarks">
              <el-input
                type="textarea"
                :autosize="{ minRows: 4 }"
                placeholder="请输入内容"
                v-model="modelForm4.remarks"
                :disabled="disabled4"
              >
              </el-input>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </Dialog>
  </el-row>
</template>

<script type="text/jsx">
import { mapGetters } from "vuex";

import {
  Api_IntellectualProBasicInfo,
  Api_InventionPatentPage,
  Api_InventionPatentDetail,
  Api_SoftWorkPage,
  Api_SoftWorkDetail,
  Api_TrademarkDetailsPage,
  Api_TrademarkDetailsDetail,
} from "@/api/creditManagement/customerProfile/customerManagemCustomer/dueDiligence";

export default {
  name: "DueDiligence",

  props: {
    id: String, // 客户id，用于查询详情数据
    companyName: String,
  },
  computed: {
    ...mapGetters(["CompanyId"]),
  },
  data() {
    return {
      disabled1: true,
      disabled2: true,
      disabled3: true,
      disabled4: true,
      visible3: false,
      visible2: false,
      visible4: false,
      formData1: {}, // 知识产权
      formData2: [], // 专利发明
      // 专利发明列表
      col_tableComp2: [
        { label: "专利名称", key: "patentName" },
        { label: "专利申请号", key: "patentApplicationNo" },
        {
          label: "专利申请日",
          key: "patentApplyingDate",
          render: (h, data) => (data ? this.$dateFormat(data) : "-"),
        },
        { label: "专利类型", key: "patentType" },
        { label: "地区", key: "region" },
        { label: "地址", key: "address" },
        {
          label: "专利授权日",
          key: "patentAuthorizationDate",
          render: (h, data) => (data ? this.$dateFormat(data) : "-"),
        },
        {
          label: "操作",
          key: null,
          render: (h, data, row) => {
            return !this.isFxb
              ? [
                  <el-link
                    type="primary"
                    onClick={this.editComp2.bind(this, row)}
                  >
                    {" "}
                    详情{" "}
                  </el-link>,
                ]
              : "";
          },
        },
      ],
      // 专利发明弹框
      modelForm2: {},
      modelForm3: {},
      modelForm4: {},
      // 软著列表
      col_tableComp3: [
        { label: "软件全称", key: "softwareFullName" },
        { label: "软件简称", key: "softwareAbbreviation" },
        { label: "受理号", key: "acceptanceNumber" },
        { label: "登记号", key: "registrationNumber" },
        { label: "分类号", key: "classificationNumber	" },
        { label: "版本号", key: "versionNumber" },
        {
          label: "操作",
          key: null,
          render: (h, data, row) => {
            return !this.isFxb
              ? [
                  <el-link
                    type="primary"
                    onClick={this.editComp3.bind(this, row)}
                  >
                    {" "}
                    详情{" "}
                  </el-link>,
                ]
              : "";
          },
        },
      ],
      // 软著
      formData3: [],
      // 商标列表
      col_tableComp4: [
        { label: "商标名称", key: "trademarkName" },
        { label: "商标分类码", key: "trademarkSort" },
        { label: "商标分类码描述", key: "trademarkSortDesc" },
        { label: "商标申请号", key: "trademarkApplicationNumber" },
        {
          label: "商标申请日",
          key: "trademarkApplicationDate",
          render: (h, data) => (data ? this.$dateFormat(data) : "-"),
        },
        { label: "商标授权号", key: "trademarkAuthorizationNumber" },
        {
          label: "商标授权日",
          key: "trademarkAuthorizationDate	",
          render: (h, data) => (data ? this.$dateFormat(data) : "-"),
        },
        {
          label: "操作",
          key: null,
          render: (h, data, row) => {
            return !this.isFxb
              ? [
                  <el-link
                    type="primary"
                    onClick={this.editComp4.bind(this, row)}
                  >
                    {" "}
                    详情{" "}
                  </el-link>,
                ]
              : "";
          },
        },
      ],
      // 商标
      formData4: [],
    };
  },
  mounted() {
    this.getCom1();
    this.getCom2();
    this.getCom3();
    this.getCom4();
  },
  methods: {
    Api_InventionPatentPage,
    Api_SoftWorkPage,
    Api_TrademarkDetailsPage,
    getCom1() {
      Api_IntellectualProBasicInfo(this.CompanyId).then((res) => {
        if (res || res.success) {
          this.formData1 = res;
        } else {
          this.$message.error("出现未知错误，请联系管理员");
        }
      });
    },
    getCom2() {
      this.$nextTick(() => {
        this.$refs.ref_tableComp2.fetchData();
      });
    },
    getCom3() {
      this.$nextTick(() => {
        this.$refs.ref_tableComp3.fetchData();
      });
    },
    getCom4() {
      this.$nextTick(() => {
        this.$refs.ref_tableComp4.fetchData();
      });
    },
    editComp2(row) {
      console.log("---------", row);
      Api_InventionPatentDetail({ id: row.id }).then((res) => {
        if (res || res.success) {
          this.modelForm2 = res;
          this.visible2 = true;
        } else {
          this.$message.error("出现未知错误，请联系管理员");
        }
      });
    },
    editComp3(row) {
      Api_SoftWorkDetail({ id: row.id }).then((res) => {
        if (res || res.success) {
          this.modelForm3 = res;
          this.visible3 = true;
        } else {
          this.$message.error("出现未知错误，请联系管理员");
        }
      });
    },
    editComp4(row) {
      Api_TrademarkDetailsDetail({ id: row.id }).then((res) => {
        if (res || res.success) {
          this.modelForm4 = res;
          this.visible4 = true;
        } else {
          this.$message.error("出现未知错误，请联系管理员");
        }
      });
    },
    onCloseComp2() {
      this.visible2 = false;
    },
    onCloseComp3() {
      this.visible3 = false;
    },
    onCloseComp4() {
      this.visible4 = false;
    },
  },
};
</script>
<style  lang="scss">
.containerRow{
 .el-input{
    width: 100% !important;
  }
}
</style>
<style scoped lang="scss">
.flex {
  align-items: center;
}

.h {
  display: flex;

  span {
    padding: 0 10px;
    font-size: 14px;
  }
}

/deep/ {
  .el-table__expand-column {
    display: none;
  }

  .alert {
    padding-left: 0;

    .el-alert__content {
      padding: 0;
    }

    .el-alert__description {
      width: 100%;
    }
  }

  .el-form-item__content {
    color: #888;
  }
}

.person-item {
  position: relative;
  margin-left: -20px;
  padding-left: 20px;
  padding-top: 10px;
  padding-bottom: 10px;

  & + & {
    margin-top: 20px;
  }

  &:hover {
    background-color: #eee;

    .action {
      display: block;
      right: 20px;
      top: 20px;
    }
  }

  .flex:first-child {
    margin-bottom: 10px;
  }

  .person-name {
    width: 6em;
  }

  .person-desc-con {
    color: #999;
  }
}

.action {
  position: absolute;
  top: -32px;
  right: 0;
}
.comp7-wrap {
  position: relative;
}

.area {
  margin-bottom: 20px;
}

.no-data-tip {
  text-align: center;
  margin: 30px 0;
  color: #909399;
}
h5 {
  font-size: 14px;
  margin-bottom: 15px;
}
</style>
