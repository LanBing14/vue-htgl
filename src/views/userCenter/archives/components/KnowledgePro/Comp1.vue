<template>
  <div>
    <h4 class="flex">
      <div class="flex-primary">经营概况</div>
    </h4>
    <el-row>
      <TableWrapper
        ref="table"
        :fetchDataFn="Api_EconomicOverviewPage"
        :query="listQuery"
        :columns="tableCol1"
        :showTotalCount="showTotalCount"
      />
    </el-row>
    <Dialog
      title="经营概况详情"
      :visible.sync="visible"
      :showBtn="false"
      width="1000px"
      @close="onClose"
    >
      <el-form
        ref="form"
        :model="formData"
        label-width="6em"
        label-position="right"
      >
        <el-row>
          <el-col :span="6">
            <el-form-item label="年度：" prop="title" class="eyear">
              <el-input v-model="formData.eyear" :disabled="disabled" :title="formData.eyear">
                <template slot="append"><div>万元</div></template>
              </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="总资产：" prop="totalAssets" :title="formData.totalAssets">
              <el-input v-model="formData.totalAssets" :disabled="disabled">
                <template slot="append"><div>万元</div></template>
              </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="总负债：" prop="totalLiabilities" :title="formData.totalLiabilities">
              <el-input v-model="formData.totalLiabilities" :disabled="disabled">
                <template slot="append"><div>万元</div></template>
              </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="净资产：" prop="netAssets" :title="formData.netAssets">
              <el-input v-model="formData.netAssets" :disabled="disabled">
                <template slot="append"><div>万元</div></template>
              </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="总销售：" prop="salesVolume" :title="formData.salesVolume">
              <el-input v-model="formData.salesVolume" :disabled="disabled">
                <template slot="append"><div>万元</div></template>
              </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="净利润：" prop="netProfit" :title="formData.netProfit">
              <el-input v-model="formData.netProfit" :disabled="disabled">
                <template slot="append"><div>万元</div></template>
              </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="总税收：" prop="totalTax" :title="formData.totalTax">
              <el-input v-model="formData.totalTax" :disabled="disabled">
                <template slot="append"><div>万元</div></template>
              </el-input>
            </el-form-item>
          </el-col>
          <!-- <div>相关附件：</div> -->
        </el-row>
      </el-form>
    </Dialog>
  </div>
</template>

<script type="text/jsx">
import {
  Api_EconomicOverviewPage,
  Api_EconomicOverviewDetail,
} from "@/api/creditManagement/customerProfile/customerManagemCustomer/knowledgePro";
import axios from "axios";
import { mapGetters } from "vuex";

export default {
  name: "Comp1",
  props: {
    companyName: String, // 客户名称
    isFxb: Boolean,
  },
  computed: {
    ...mapGetters(["CompanyId"]),
  },
  data() {
    const createRules = this.$createRules;
    return {
      disabled:true,
      visible: false,
      showTotalCount: true,
      listQuery: {
        id: this.CompanyId,
      },
      tableCol1: [
        {
          key: "eYear",
          label: "年度",
        },
        {
          key: "totalAssets",
          label: "总资产（万元）",
        },
        {
          key: "totalLiabilities",
          label: "总负债（万元）",
        },
        {
          key: "netAssets",
          label: "净资产（万元）",
        },
        {
          key: "salesVolume",
          label: "总销售（万元）",
        },
        {
          key: "netProfit",
          label: "净利润（万元）",
        },
        {
          key: "totalTax",
          label: "总税收（万元）",
        },
        {
          label: "操作",
          key: null,
          render: (h, data, row) => {
            return !this.isFxb
              ? [
                  <el-link
                    type="primary"
                    onClick={this.openModal.bind(this, row)}
                  >
                    {" "}
                    详情{" "}
                  </el-link>,
                ]
              : "";
          },
        },
      ],
      formData: {
        eyear: "",
        totalTax: "",
        netProfit: "",
        totalLiabilities: "",
        totalAssets: "",
        salesVolume: "",
        netAssets: "",
      },
      detailData: {},
    };
  },
  mounted() {
    this.listQuery.id = this.CompanyId;
    this.$nextTick(() => {
      this.$nextTick(() => {
        this.getList();
      });
    });
  },
  methods: {
    Api_EconomicOverviewPage,
    getList() {
      this.$refs.table.fetchData();
    },
    openModal(row) {
      let $this = this;
      Api_EconomicOverviewDetail(row.id).then((res) => {
        if (res) {
          $this.$nextTick(() => {
            $this.formData = res;
            $this.visible = true;
          });
        } else {
          this.$message.error(res.message);
        }
      });
    },
    onClose() {
      this.$refs.form.resetFields();
    },
  },
};
</script>

<style scoped>
</style>
