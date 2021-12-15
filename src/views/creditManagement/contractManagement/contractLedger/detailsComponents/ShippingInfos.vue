<template>
  <div>
    <TableWrapper v-loading="loading" ref="ref_table" :data="tableData" :query="{id:id}" :columns="tableCol" />
  </div>
</template>

<script>
import { Api_shipDetailList ,Api_shipDetailOrder} from "@/api/creditManagement/contractManagement/orders.js";
export default {
  name: "ShippingInfos",
  props: { id: { type: String, default: "" } },
  data() {
    return {
      loading: false,
      tableData: [],
      tableCol: [
        {
          label: "发货编码",
          key: "shipCode",
          render: (h, data, row) => {
            return (
              <span class="canClick" onClick={this.$gotoShippingDetail.bind(this, row.id, row.contractId)}>
                {data}
              </span>
            );
          }
        },
        { label: "订单编码", key: "contractNo" },
        { label: "发货数量", key: "sendNum", align: "right" },
        { label: "负责人", key: "creatorId" },
        {
          label: "出库日期",
          key: "deliveryTime",
          render: (h, data, row) => {
            return data ? this.$dateFormat(data) : "-";
          }
        },
        {
          label: "签收日期",
          key: "signDate",
          render: (h, data, row) => {
            return data ? this.$dateFormat(data) : "-";
          }
        },
        {
          label: "申请时间",
          key: "createDate",
          render: (h, data, row) => {
            return data 
            // return data ? data.substr(0, 10) : "-";
          }
        },
        {
          label: "当前状态",
          key: "state",
          render: (h, data, row) => {
            return data === "0" ? "待提交" : data === "1" ? "待签收" : data === "2" ? "已签收" : "-";
          }
        }
      ]
    };
  },
  watch: {
    id(_v) {
      if (_v) {
        this.$nextTick(() => {
          this.getData(_v);
        });
      }
    }
  },
  mounted() {
    this.$nextTick(() => {
      if (this.id) {
        this.getData(this.id);
      }
    });
  },
  methods: {
    getData(_v) {
      this.loading = true;
      Api_shipDetailOrder({ id: _v }).then(res => {
        this.tableData = res;
        this.loading = false;
      });
    }
  }
};
</script>

<style>
</style>
