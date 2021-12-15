<template>
  <Dialog
    ref="drawer"
    title="评估结果确认"
    width="660px"
    :visible.sync="visible"
    :btns=btns
    @close="handleClose"
  >
    <el-row :gutter="20" style="margin-bottom: 20px">
      <el-col :span="6">
        <div class="result-title">
          <div class="item-title">{{ data.score ? data.score : '-' }}</div>
          <div class="item-subtitle">信用评分</div>
        </div>
      </el-col>
      <el-col :span="6">
        <div class="result-title">
          <div class="item-title">{{ data.level ? data.level : '-' }}</div>
          <div class="item-subtitle">信用等级</div>
        </div>
      </el-col>
      <el-col :span="12">
        <div class="result-title" style="text-align: left">
          <span class="result-msg">等级说明：{{ data.remark ? data.remark : '-' }}</span>
        </div>
      </el-col>
    </el-row>
    <TableWrapper ref="table" :data="data.classifyWaitList" :columns="tableCol" />
    <div class="result-tip">完善客户档案可以有助于提升客户信用评价结果，该客户得分概览情况如下附表所示，确定要提交该项评价结果吗？</div>
  </Dialog>
</template>

<script>
import {
  Api_EvaluateRecordExecuteScoreSave
} from "@/api/creditManagement/creditEstimate/record";

export default {
  name: "Result",
  props: {
    data: {
      type: Object,
      default: () => {}
    },
    id: String
  },
  data() {
    return {
      visible: false,
      tableCol: [
        { label: "分类名称", key: "modelClassifyName" },
        {
          label: "得分",
          key: "score",
          width: 150,
          render: (h, data, row) => {
            let per = Math.round(this.$divide(data,row.fullScore)*100);
            let style = { width: per*1.32 + "px" };
            return (
              <div>
                <div class="score-container">
                  <div class="score-content-actual">{ data }</div>
                  <div class="score-content-percent">{ per }%</div>
                </div>
                <div class="score-progress">
                  <div class="score-progress-active" style={style}></div>
                </div>
              </div>
            );
          },
        },
      ],
      btns: [
        {
          text: "提交",
          type: "primary",
          click: this.handleSure,
        },
        {
          text: "取消",
          click: this.handleClose,
        },
      ]
    };
  },
  methods: {
    open() {
      this.visible = true;
    },
    // 提交
    handleSure() {
      const loading = this.$openLoading();
      // status: 0 保存 1 提交 
      Api_EvaluateRecordExecuteScoreSave(this.id, 1).then( res => {
        loading.close();
        
        this.visible = false;

        this.$nextTick( () => {
          this.$emit("goBackList");
        })
        this.$message.success(res);
      }).catch((e) => {
        loading.close();
        this.$message.error(e);
      });
    },
    handleClose() {
      this.visible = false;
    },
  },
};
</script>

<style lang="scss" scoped>
.result-title {
  background-color: #f2f2f2;
  height: 100px;
  text-align: center;
  padding: 15px;
  .item-title {
    color: #333;
    font-size: 26px;
    font-weight: bold;
    line-height: 44px;
  }
  .item-subtitle {
    color: #606266;
    font-size: 15px;
    padding-top: 5px;
  }
  .result-msg {
    font-weight: bold;
    color: #333;
    display: block;
    max-height: 60px;
    overflow: hidden;
  }
}
/deep/ .score-container {
  display: flex;
  .score-content-actual {
    flex: 1;
    text-align: left;
    color: #606266;
    font-size: 13px;
  }
  .score-content-percent {
    flex: 1;
    text-align: right;
    color: #606266;
    font-size: 13px;
  }
}
/deep/ .score-progress {
  margin-top: 4px;
  width: 100%;
  height: 5px;
  background-color: #606266;
  position: relative;
  .score-progress-active {
    background-color: #409eff;
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
  }
}
.result-tip {
  margin-top: 20px;
  line-height: 20px;
  text-indent: 28px;
}
</style>
