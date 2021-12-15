<template>
<div class="section1" style="margin-bottom:20px">
    <!-- 日期选择 -->
   <div class="dateSelection clearfix" style="display:none">
     <div class="dateChooseParent">
          <el-date-picker
            v-model="dateChoose"
            type="daterange"
            style="float:left;margin-top:25px"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期">
          </el-date-picker>
         <ul class="dateSmallBtn">
           <li><el-button type="text" @click="today">今天</el-button></li>
           <li><el-button type="text" @click="week">近一周</el-button></li>
           <li><el-button type="text" @click="month">近一月</el-button></li>
         </ul>
     </div>
   </div>
  <section>
    <div class="header flex">
      <div class="flex-primary">
        <span class="title">我的简报</span>
        <el-select v-model="typeId" clearable @change="onChange">
          <el-option v-for="(el, index) in options1" :key="index" :label="el.label" :value="el.value" />
        </el-select>
      </div>
      <div>
        <el-tooltip content="刷新" placement="top">
          <el-button type="text" @click="getHeadData" style="color: #c0c4cc;">
            <i class="el-icon-refresh"></i>
          </el-button>
        </el-tooltip>
        <el-tooltip content="设置" placement="top">
          <el-button type="text" @click="setup" style="color: #c0c4cc;">
            <i class="el-icon-setting"></i>
          </el-button>
        </el-tooltip>
      </div>
    </div>
    <ScrollBtn>
      <HeadStatisticsDynamics
        v-loading="loadingHead"
        ref="ref_HeadStatistics"
        :data="headData"
        class="tags-wrap"
      />
    </ScrollBtn>
    <el-dialog :visible.sync="visible" title="我的简报" width="500px" @close="closeDialog">
      <el-table ref="table" :data="tableData" row-key="id">
        <el-table-column width="80px" align="center">
          <template slot-scope="scope">
            <div class="sort-item">
              <i class="iconfont icon-menu"></i>
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="name" label="统计项名称"></el-table-column>
        <el-table-column prop="isShow" label="显示/隐藏" width="90px" align="center">
          <template slot-scope="scope">
            <el-switch v-model="scope.row.isShow"></el-switch>
          </template>
        </el-table-column>
      </el-table>
      <div class="footer" slot="footer">
        <el-button type="primary" @click="onSetupOk">确定</el-button>
        <el-button @click="onClose">取消</el-button>
        <el-button class="restore-btn" type="text" @click="restore">恢复默认</el-button>
      </div>
    </el-dialog>
  </section>
</div>
</template>

<script>
import Sortable from "sortablejs";
import ScrollBtn from "@/components/ScrollBtn";
import HeadStatisticsDynamics from "@/components/HeadStatisticsDynamics";
import {
  Api_GetWorkBenchAuthority,
  Api_GetConfigList,
  Api_ChangeConfig,
  Api_GetBrief,
  Api_ResetConfig,
} from "@/api/creditManagement/dashboard";

export default {
  name: "Section1",
  components: { ScrollBtn, HeadStatisticsDynamics },
  data() {
    return {
      dateChoose: '', // 日期选择
      visible: false,
      isMore: false,
      height: "",
      typeId: "",
      options1: [],
      sortIns: null,
      tableData: [],
      headData: [],
      loadingHead: false,
    };
  },

  created() {
    Api_GetWorkBenchAuthority().then((res) => {
      this.options1 = res.map((item) => ({
        label: item.name,
        value: item.code,
      }));
      this.typeId = this.options1[0].value;
    });
    this.getHeadData();
  },

  methods: {
    // 今天
    today(){
      const start=this.$dateFormat(new Date());
      const end = this.$dateFormat(new Date());

     
    },
    // 近一周
    week(){
        const end = new Date();
        const start = new Date();
        start.setTime(
            start.getTime() - 3600 * 1000 * 24 * 6
        );

       var startWeek= this.$dateFormat(start);
       var endWeek =this.$dateFormat(end);
       console.log(startWeek,endWeek)
    },
    // 近一月
    month(){
        const end = new Date();
        const start = new Date();
        start.setMonth(start.getMonth() - 1);
        var startMonth=this.$dateFormat(start);
        var endMonth=this.$dateFormat(end);
        console.log(startMonth,endMonth);
    },

    getHeadData() {
      this.loadingHead = true;
      Api_GetBrief({
        type: this.typeId,
      })
        .then((res) => {
          this.headData = res.map((item) => {
            return {
              value: item.value,
              title: item.name,
              isMoney: item.isMoney === "1",
            };
          });
          this.loadingHead = false;
        })
        .catch((e) => {
          this.loadingHead = false;
          this.$message.error(e);
        });
    },
    getApi_GetConfigList() {
      Api_GetConfigList().then((res) => {
        this.tableData = res;
      });
    },
    toggleUpDown() {
      this.isMore = !this.isMore;
      this.$nextTick(() => {
        if (this.isMore) {
          this.height = this.$refs.content.scrollHeight + "px";
        } else {
          this.height = "";
        }
      });
    },
    closeDialog() {
      this.tableData = [];
    },
    // 打开设置
    setup() {
      this.visible = true;
      this.getApi_GetConfigList();
      this.$nextTick(() => {
        if (!this.sortIns) {
          const body = this.$refs.table.$el.querySelector(".el-table__body-wrapper tbody");
          this.sortIns = new Sortable(body, {
            handle: ".sort-item",
            onUpdate: (e) => {
              const newIndex = e.newIndex;
              const oldIndex = e.oldIndex;
              const nItem = this.tableData.splice(oldIndex, 1);
              this.tableData.splice(newIndex, 0, nItem[0]);
            },
          });
        }
      });
    },
    // 保存设置
    onSetupOk() {
      const postData = this.tableData.map(({ id, isShow }, index) => ({
        id,
        sequence: index,
        isShow,
      }));
      const loading = this.$openLoading();
      Api_ChangeConfig(postData)
        .then((res) => {
          loading.close();
          this.$message.success(res);
          this.visible = false;
          this.getHeadData();
        })
        .catch((e) => {
          this.$message.error(e);
        });
    },
    // 取消
    onClose() {
      this.visible = false;
    },
    // 还原
    restore() {
      this.$confirm("确定重置？").then(() => {
        const loading = this.$openLoading();
        Api_ResetConfig()
          .then((res) => {
            this.getApi_GetConfigList();
            loading.close();
            this.$message.success(res);
          })
          .catch((e) => {
            loading.close();
            this.$message.error(e);
          });
      });
    },
    onChange() {
      this.getHeadData();
    },
  },
};
</script>

<style scoped lang="scss">
.list {
  display: flex;
  transition: all 0.2s;
  flex-wrap: wrap;

  .item {
    width: 16.66%;
    padding: 8px;
    height: 140px;

    .item-inner {
      height: 100%;
      padding: 10px;
      background-color: #0abab6;
      display: flex;
      flex-direction: column;

      .num {
        flex: 1;
      }
    }
  }
}

.more {
  width: 100%;
  text-align: center;
  padding: 10px;
  cursor: pointer;
}

.tags-wrap {
  margin-bottom: 0;

  /deep/ {
    .container {
      margin-bottom: 0;
      display: flex;
      width: fit-content;
    }

    .item-container {
      margin: 0 20px 0 0;
      width: 248px;

      &:last-child {
        margin-right: 0;
      }
    }
  }
}

.footer {
  text-align: center;

  .restore-btn {
    position: absolute;
    right: 20px;
    bottom: 16px;
  }
}



// 日期选择
.dateSelection{
  height: 80px;
  border-bottom: 2px solid #f7f8fa;
  background:#fff;
}

.clearfix::after{
  content:"";
  display:block;
  clear: both;
}
.dateSmallBtn{
  li{
    float: left;
    font-size: 15px;
    color:#333333;
    padding:0 20px;
  
  }
}

.dateChooseParent{
  float:right;
  line-height: 80px;
  width:600px;
}


</style>
<style lang="scss">
.dateSmallBtn{
  .el-button--text{
    color: #343434;
  }
  .el-button--text:active {
    color: #448ddb;
    border-color: transparent;
    background-color: transparent;
  }
  .el-button--text:hover, .el-button--text:focus {
    color: #6fb1f5;
    border-color: transparent;
    background-color: transparent;
  }
}

</style>
