<template>
  <div class="serve-content-wrapper">
    <div class="title-name">
      <span class="name-1">访客预约</span>
    </div>
    <div class="container">
      <div class="item-container" v-for="(item, index) in col" :key="index">
        <div
          class="item-content"
          :style="{ 'background-image': 'url(' + colors[index % 4].bg + ')' }"
        >
          <div class="title">{{ item.name }}</div>
          <div class="text" :style="{ color: colors[index % 4].text }">
            {{ item.num }}
          </div>
        </div>
      </div>
    </div>
    <el-form ref="searchForm" :model="listQuery" :inline="true">
      <el-form-item prop="applyName">
        <el-input
          v-model="listQuery.visitorName"
          placeholder="访客姓名"
          class="filter-item"
        />
      </el-form-item>
      <el-form-item prop="phone">
        <el-input
          v-model="listQuery.phoneNumber"
          placeholder="手机号码"
          class="filter-item"
        />
      </el-form-item>
      <el-form-item prop="applyReason">
        <el-select
          v-model="listQuery.reason"
          placeholder="来访原由"
          style="width: 178px"
        >
          <el-option
            v-for="item in reasonOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          >
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item prop="subscribeTime">
        <el-date-picker
          v-model="subscribeTime"
          type="daterange"
          range-separator="~"
          value-format="yyyy-MM-dd HH:mm:ss"
          start-placeholder="预约时间开始日期"
          end-placeholder="预约时间结束日期"
        >
        </el-date-picker>
      </el-form-item>
      <el-form-item prop="visitingTime">
        <el-date-picker
          v-model="visitingTime"
          type="daterange"
          range-separator="~"
          value-format="yyyy-MM-dd HH:mm:ss"
          start-placeholder="来访时间开始日期"
          end-placeholder="来访时间结束日期"
        >
        </el-date-picker>
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
    <p class="title1-mechanism">访客列表</p>
    <TableWrapper
      ref="childtable"
      :fetchDataFn="Api_getVistorList"
      :query="listQuery"
      :columns="tableCol"
    />
  </div>
</template>
<script>
import lightBlue from "@/assets/images/creditManagement/light-blue.png";
import lightGreen from "@/assets/images/creditManagement/light-green.png";
import lightYellow from "@/assets/images/creditManagement/light-yellow.png";
import lightPurple from "@/assets/images/creditManagement/light-purple.png";
import {
  Api_getVistorList,
  Api_getVistorNum,
  Api_cancel,
} from "@/api/userCenter/propertyRepair.js";
export default {
  data() {
    return {
      subscribeTime: [],
      visitingTime: [],
      downUrl: process.env.VUE_APP_FILE_IMG_API,
      col: [
        {
          name: "今日到访访客",
          num: 0,
        },
        {
          name: "本月到访访客数",
          num: 0,
        },
      ],
      reasonOptions: [
        {
          value: "1",
          label: "面试",
        },
        {
          value: "2",
          label: "商务",
        },
        {
          value: "3",
          label: "参观",
        },
        {
          value: "4",
          label: "其他",
        },
      ],
      colors: [
        { bg: lightBlue, text: "#409EFF" },
        { bg: lightGreen, text: "#67C23A" },
        { bg: lightYellow, text: "#E6A23C" },
        { bg: lightPurple, text: "#2b84dd" },
      ],
      listQuery: {
        visitorName: "",
        phoneNumber: "",
        reason: "",
        visitingTime: "",
        subscribeTime: "",
      },
      tableCol: [
        {
          key: null,
          label: "访客姓名",
          width: 150,
          render:(h,data,row) =>{
              return (
                   <span
                    class="btn-see seeText"
                    onClick={this.handleSee.bind(this, row)}
                  >
                   { row.VISITORNAME}
                  </span>
              )
          }
        },
        {
          key: "PHONENUMBER",
          label: "手机号码",
          align: "left",
        },
        {
          key: "VISITORNUMBER",
          label: "来访人数",
          align: "left",
        },
        {
          key: "REASON",
          label: "来访原由",
          align: "left",
          render: (h, data, row) => {
            return data == 1
              ? "面试"
              : data == 2
              ? "商务"
              : data == 3
              ? "参观"
              : data == 4
              ? "其他"
              : "-";
          },
        },
        {
          key: "STATUS",
          label: "状态",
          align: "left",
        },
        {
          key: "SUBSCRIBETIME",
          label: "预约时间",
          align: "left",
        },
        {
          key: "VISITINGTIME",
          label: "来访时间",
          align: "left",
        },
        {
          key: null,
          label: "操作",
          render: (h, data, row) => {
            let bollean = row.STATUS === '未核验'
            let html  = (
                <div>
                  <a
                    style="color: #409eff"
                     class="a-block" 
                     href={row.files && row.files.length>=1&&row.files[0].url && this.downUrl+row.files[0].url}
                     download
                  >
                    下载 
                  </a>
                  {bollean?
                  (<span
                    class="btn-see btn-click"
                    style="margin-left: 10px; "
                    onClick={this.handleCancel.bind(this, row)}
                  >
                    取消预约
                  </span>):
                  (<span
                    class="btn-see btn-click-no"
                    style="margin-left: 10px; "
                  >
                    取消预约
                  </span>)}
                  
                </div>
              );
          
            return html;
          },
        },
      ],
    };
  },
  computed: {},
  methods: {
    getList(flag) {
      this.listQuery.visitingTimeStart =
        this.visitingTime.length > 0 ? this.visitingTime[0] : "";
      this.listQuery.visitingTimeEnd =
        this.visitingTime.length > 0 ? this.visitingTime[1] : "";
      this.listQuery.subscribeTimeStart =
        this.subscribeTime.length > 0 ? this.subscribeTime[0] : "";
      this.listQuery.subscribeTimeEnd =
        this.subscribeTime.length > 0 ? this.subscribeTime[1] : "";
      this.$refs.childtable.fetchData(flag);
    },
    handleSee(row) {
      this.$emit("handleFromNotice", true, row.ID);
    },
    handleCancel(row) {
      this.$confirm("是否取消当前预约 ?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          Api_cancel(row.ID).then((res) => {
            this.$message({
              type: "success",
              message: "取消预约成功!",
            });
          });
          this.getList(true)
        })
        .catch(() => {});
    },
    Api_getVistorList,
    handleFilter() {
      this.getList(true);
    },
    handleReset(formName) {
      this.subscribeTime = [];
      this.visitingTime = [];
      this.$refs[formName].resetFields();
      this.listQuery = {
        visitorName: "",
        phoneNumber: "",
        reason: "",
      };
      this.getList(true);
    },
  },
  mounted() {
      
    Api_getVistorNum().then((res) => {
      this.col = res;
    });
    this.$nextTick(() => {
      this.$refs.childtable.fetchData();
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
  /deep/ .el-date-editor .el-range__icon {
    line-height: 22px;
  }
  /deep/ .el-date-editor .el-range-separator {
    line-height: 22px;
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

  .container {
    display: flex;
    margin: 0 -10px 22px;

    .item-container {
      // flex: 0 20%;
      // dayu修改
      flex: 0 19%;
      // 修改结束
      padding: 0 10px;

      .item-content {
        height: 95px;
        padding: 20px;

        .title {
          font-size: 14px;
        }

        .text {
          font-size: 21px;
          padding-top: 18px;
        }

        background-repeat: no-repeat;
        background-position: 0 -39px;
      }
    }
  }
}

</style>
