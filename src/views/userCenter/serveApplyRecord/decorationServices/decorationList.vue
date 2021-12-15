<template>
  <div class="serve-content-wrapper">
    <div class="title-name">
      <span class="name-1">装修服务</span>
    </div>
    <el-form ref="searchForm" :inline="true" :model="listQuery">
      <el-form-item prop="business">
        <el-select v-model="listQuery.business" placeholder="所在项目">
          <el-option
            v-for="item in options"
            :key="item.ID"
            :label="item.BUSINESSNAME"
            :value="item.BUSINESSID"
          >
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item prop="">
        <el-date-picker
          v-model="bxTime"
          cellClassName="decoraTime"
          type="daterange"
          start-placeholder="申请开始时间"
          end-placeholder="申请截止时间"
          @change="changeTime"
        >
        </el-date-picker>
      </el-form-item>
      <el-form-item prop="state">
        <el-select v-model="listQuery.state" placeholder="状态">
          <el-option
            v-for="item in statusList"
            :key="item.id"
            :label="item.value"
            :value="item.id"
          >
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item class="btns">
        <el-button
          class="filter-item"
          type="primary"
          icon="el-icon-search"
          @click="handleFilter"
          >查询</el-button
        >
        <el-button
          class="filter-item"
          icon="el-icon-refresh"
          @click="handleReset('searchForm')"
          >重置</el-button
        >
      </el-form-item>
    </el-form>
    <p class="title1-mechanism">装修服务列表</p>
    <TableWrapper
      ref="child"
      :fetchDataFn="Api_getDecorationList"
      :query="listQuery"
      :columns="tableCol"
    />
  </div>
</template>
<script>
import {
  Api_getDecorationList,
  Api_getDecorationDelete,
  Api_getBusiness,
} from "@/api/userCenter/propertyRepair.js";
export default {
  data() {
    return {
      options: [],
      statusList: [
        {
          id: 0,
          value: "未审批",
        },
        {
          id: 1,
          value: "通过",
        },
        {
          id: 2,
          value: "未通过",
        },
      ],
      bxTime: [],
      listQuery: {
        state: "",
        business: "",
        applyStateTime: "",
        applyEndTime: "",
      },
      tableCol: [
        {
          key: "BUSINESS_NAME",
          label: "所在项目",
          align: "left",
        },
        {
          key: "ROOM_NUMBER",
          label: "物业位置",
          align: "left",
        },
        {
          key: "START_TIME",
          label: "装修开始时间",
          align: "left",
        },
        {
          key: "END_TIME",
          label: "装修结束时间",
          align: "left",
        },
        {
          key: "APPLY_TIME",
          label: "申请时间",
          align: "left",
        },
        {
          key: "APPROVAL_STATE",
          label: "状态",
          align: "left",
            render: (h, data, row) => {
              return data =='0'?'未审批':data == '1'?'通过':'未通过'
            }
        },
        {
          key: null,
          label: "操作",
          render: (h, data, row) => {
            let html =''
           
             html = (
              <div>
                <span
                  class="btn-see"
                  style="color: #409eff"
                  onClick={this.handleSee.bind(this, row)}
                >
                  查看
                </span>
                {row.APPROVAL_STATE == '0'?
                <span
                  class="btn-see"
                  style="color: #409eff;margin-left: 10px;"
                  onClick={this.handleBackOut.bind(this, row) }
                >
                  撤销
                </span>
                :''
                  }
              </div>
            )
            
            return html
          },
        },
      ],
    };
  },
  computed: {},
  methods: {
    getList(flag) {
      this.$refs.child.fetchData(flag);
    },
    // 查看
    handleSee(row) {
      this.$emit("handleFromNotice", true, row.ID);
    },
    // 撤销
    handleBackOut(row) {
      if( row.APPROVAL_STATE =='0' ){
      this.$confirm("确定撤销吗?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          Api_getDecorationDelete(row.ID).then(res => {
             this.$message({
            type: "success",
            message: "撤销成功!",
          });
            this.$refs.child.fetchData();

          })
         
        })
        .catch(() => {
         
        });
      }else{
         this.$message({
            type: "info",
            message: "未审批的数据才能撤销",
          });
      }

    },
    Api_getDecorationList,
    handleFilter() {
      this.getList(true);
    },
    //  选择时间
    changeTime(e) {
      this.listQuery.applyStateTime =
        e && this.$moment(e[0]).format("YYYY-MM-DD");
      this.listQuery.applyEndTime =
        e && this.$moment(e[1]).format("YYYY-MM-DD");
      console.log(e);
    },
    handleReset(formName) {
      this.$refs[formName].resetFields();
      this.listQuery = {
        state: "",
        business: "",
        applyStateTime: "",
        applyEndTime: "",
      };
      this.bxTime = [];
      this.getList(true);
    },
    handleClick() {
      this.getList(true);
    },
  },
  mounted() {
    Api_getBusiness().then((res) => {
      this.options = res;
    });
    this.$nextTick(() => {
      this.$refs.child.fetchData();
    });
  },
};
</script>
<style lang="scss" scoped>
.serve-content-wrapper {
  padding: 12px 25px;
  background-color: #fff;
  /deep/ .el-input__inner {
    line-height: 30px;
    height: 30px;
  }
  /deep/ .el-button {
    padding: 7px 20px;
  }
  .page-mechanism {
    text-align: right;
    margin-top: 15px;
  }
  .title-name {
    margin-bottom: 20px;
    .name-1 {
      height: 42px;
      display: inline-block;
      line-height: 42px;
      font-size: 16px;
      border-bottom: 2px solid $light-blue;
    }
    .name-back {
      padding: 6px 14px;
      float: right;
      border: 1px solid #dcdfe6;
      border-radius: 4px;
      color: #606266;
    }
  }
  .title1-mechanism {
    line-height: 54px;
    font-size: 16px;
    color: #606266;
  }
  .tabWrap {
    display: flex;
    margin-bottom: 10px;
    p.is-active {
      color: $light-blue;
    }

    p {
      margin-right: 38px;
      line-height: 30px;
      cursor: pointer;
    }
  }
}
</style>
<style lang="scss">
.el-date-editor .serve-content-wrapper[data-v-1ebc9035] .el-input__inner {
  vertical-align: middle;
}
.el-date-editor .el-range__icon,
.el-date-editor .el-range-separator,
.el-date-editor .el-range__close-icon {
  line-height: 24px;
}
</style>