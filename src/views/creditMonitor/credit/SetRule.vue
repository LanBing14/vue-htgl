<template>
  <el-row>
   
    <el-row :span="24" :gutter="30" class="set-indicators" v-loading="loading"  element-loading-text="拼命加载中" element-loading-spinner="el-icon-loading">
      <el-col :span="8" v-for="(item,index) in sysRule" :key="index">
        <div class="rule-box" v-if="index < showSysRule">
          <h3>
            <el-tag
              size="small"
              class="tags"
              :class="level[item.warningLevel]"
            >{{ item.warningLevel | levelText }}</el-tag>
            <span class="name">{{ item.warningName }}</span>
          </h3>
          <p>{{ item.ruleDesc }}</p>
          <div class="funcBox">
            <el-switch
              v-model="item.enable"
              active-color="#409eff"
              inactive-color="#dcdfe6"
              @change="changeSwitchStatus(item.id, item.enable)"
            ></el-switch>
          </div>
        </div>
      </el-col>
    </el-row>
    <p
      class="el-dropdown-link font18 fxb-999 taCenter"
      @click="moreClick"
      v-if="sysRule.length>6"
      style="background: #f7f8f9; padding: 10px;"
    >
      <i
        class="el-icon--right"
        :class="showSysRule === sysRule.length ? 'el-icon-arrow-up' : 'el-icon-arrow-down'"
      ></i>
    </p>

    <!-- 自定义预警规则 -->
    <h2 style="font-size: 16px">自定义预警规则</h2>
    <el-row :span="24" :gutter="30" class="set-indicators" v-loading="loading"   element-loading-text="拼命加载中" element-loading-spinner="el-icon-loading">
      <el-col :span="8" v-for="(item,index) in customRule" :key="index">
        <div class="rule-box">
          <h3>
            <el-tag
              size="small"
              class="tags"
              :class="level[item.warningLevel]"
            >{{ item.warningLevel | levelText }}</el-tag>
            <span class="name">{{ item.warningName }}</span>
          </h3>
          <p>{{ item.ruleDesc }}</p>
          <div class="funcBox">
            <a href="javascript:void(0);" @click="editRule(item.id, index)">编辑</a>
            <a href="javascript:void(0);" @click="delRule(item.id, index)">删除</a>
            <el-switch
              v-model="item.enable"
              active-color="#409eff"
              inactive-color="#dcdfe6"
              @change="changeSwitchStatus(item.id, item.enable)"
            ></el-switch>
          </div>
        </div>
      </el-col>
      <el-col :span="8">
        <div class="rule-box add font18" @click="setBlank()">+ 自定义</div>
      </el-col>
    </el-row>

    <!-- 自定义预警规则弹窗 -->
    <el-dialog
      :visible.sync="dialogAddVisible"
      :close-on-click-modal="false"
      title="自定义预警规则"
      width="550px"
      @closed="beforeClose"
      top="20px"
    >
      <el-form
        id="addRuleForm"
        :model="ruleItem"
        ref="ruleItemForm"
        :rules="ruleItemFormRules"
        label-width="85px"
      >
        <el-form-item label="预警名称" prop="warningName">
          <el-input v-model="ruleItem.warningName" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="规则描述" prop="ruleDesc">
          <el-input v-model="ruleItem.ruleDesc" type="textarea" rows="3"></el-input>
        </el-form-item>
        <el-form-item label="预警级别" prop="warningLevel">
          <el-radio-group size="default" v-model="ruleItem.warningLevel">
            <el-radio-button label="0">重大预警</el-radio-button>
            <el-radio-button label="1">警示预警</el-radio-button>
            <el-radio-button label="2">关注预警</el-radio-button>
            <el-radio-button label="3">提示预警</el-radio-button>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="预警事件" prop="monitorTypeId1">
          <el-cascader
            placeholder="请选择预警事件"
            expand-trigger="hover"
            :options="monitorTypeOptions"
            v-model="ruleItem.monitorTypeId1"
            @change="cascaderChange"
            style="width: 100%;"
          ></el-cascader>
        </el-form-item>
        <el-form-item label="时间范围" prop="timeRange">
          <el-select v-model="ruleItem.timeRange" placeholder="请选择时间范围" style="width: 100%;">
            <!--<el-option label="自列入监测开始" value="0"></el-option>-->
            <el-option label="近一个月" value="1"></el-option>
            <el-option label="近三个月" value="2"></el-option>
            <el-option label="近半年" value="3"></el-option>
            <el-option label="近一年" value="4"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="预警指标" prop="warningItem">
          <el-select
            v-model="ruleItem.warningItem"
            placeholder="请选择预警指标"
            style="width: 100%;"
            :disabled="warningItem3"
          >
            <el-option label="次数" value="0"></el-option>
            <el-option label="户数" value="1"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="规则限制" prop="ruleLimit">
          <el-row :span="24">
            <el-col :span="2">超过</el-col>
            <el-col :span="12" :offset="1">
              <el-input v-model.number="ruleItem.ruleLimit" placeholder="请输入内容"></el-input>
            </el-col>
            <el-col :span="2" :offset="1">{{ ruleItem.warningItem | setUnit }}</el-col>
          </el-row>
        </el-form-item>
      </el-form>
      <div align="center" class="dialog-footer" slot="footer">
        <el-button
          type="primary"
          size="small"
          @click="submitForm('ruleItemForm')"
          :loading="submitLoading"
        >确 定</el-button>
        <el-button size="small" @click="dialogAddVisible = false">取 消</el-button>
      </div>
    </el-dialog>
  </el-row>
</template>

<script>
import {
  Api_GetAllRules,
  Api_ChangeRulesState,
  Api_DelRule,
  Api_GetRules,
  Api_SaveCustomRules,
  Api_GetWarningEvent,
} from "@/api/creditMonitor";
import { merge } from "lodash";

export default {
  name: "SetPushType",
  filters: {
    // 根据后台返回的预警级别过滤为文字显示
    levelText: function (value) {
      switch (value) {
        case "1":
          return "警示预警";

        case "2":
          return "关注预警";

        case "3":
          return "提示预警";

        default:
          return "重大预警";
      }
    },
    setUnit: function (value) {
      switch (value) {
        case "1":
          return "户";

        default:
          return "次";
      }
    },
  },
  data() {
    return {
      loading: true,
      submitLoading: false,
      level: {
        0: "red", // 重大预警
        1: "yellow", // 警示预警
        2: "blue", // 关注预警
        3: "green", // 提示预警
      },
      sysRule: [],
      customRule: [],
      showSysRule: 6,
      dialogAddVisible: false,
      // 自定义预警规则弹窗表单
      ruleItem: {
        warningName: "",
        ruleDesc: "",
        warningLevel: "",
        monitorTypeId1: [],
        timeRange: "",
        warningItem: "0",
        ruleLimit: "",
      },
      ruleItemFormRules: {
        warningName: [
          { required: true, message: "设置预警规则名称，不超过10个字", trigger: "blur" },
          { min: 1, max: 10, message: "不超过10个字", trigger: "blur" },
        ],
        ruleDesc: [
          { required: true, message: "请输入规则描述，不超过50字", trigger: "blur" },
          { min: 1, max: 50, message: "不超过50字", trigger: "blur" },
        ],
        warningLevel: [{ required: true, message: "请选择预警级别", trigger: "blur" }],
        monitorTypeId1: [{ required: true, message: "请选择预警事件", trigger: "change" }],
        timeRange: [{ required: true, message: "请选择时间范围", trigger: "change" }],
        warningItem: [{ required: true, message: "请选择预警指标", trigger: "change" }],
        ruleLimit: [
          { required: true, message: "请输入规则限制" },
          { min: 0, max: 999, type: "number", message: "必须为数字值，最大999", pattern: /[1-9]\d*/ },
        ],
      },
      monitorTypeOptions: [],
      editIndex: "", // 获取当前编辑规则的index
      warningItem3: true,
      this_message: null,
    };
  },
  // 初始化数据
  mounted() {
    // 获取所有预警事件
    this.getAllRules();

    // 获取自定义弹窗中的预警事件选项列表
    this.getWarningEvent();
  },
  methods: {
    // 获取自定义弹窗中的预警事件选项列表
    getWarningEvent() {
      Api_GetWarningEvent()
        .then((res) => {
          for (const elem of res) {
            // 处理二级栏目数据格式
            const childArr = [];
            for (const ele of elem.child) {
              childArr.push({
                value: ele.id,
                label: ele.typeName,
                parentId: ele.parentId,
                warningIndex: ele.warningIndex,
              });
            }
            // 处理数据格式
            this.monitorTypeOptions.push({
              value: elem.id,
              label: elem.typeName,
              children: childArr,
            });
          }
        })
        .catch((e) => {
          this.$message.error("获取预警规则列表失败，请稍后在试");
        });
    },
    // 获取所有预警规则
    getAllRules() {
      Api_GetAllRules()
        .then((res) => {
          if (res !== "") {
            this.sysRule = [];
            this.customRule = [];
            for (const elem of res) {
              // 系统规则
              if (elem.warningType === "1") {
                elem.status = elem.status === "0";
                this.sysRule.push(elem);
              } else {
                // 自定义规则
                elem.status = elem.status === "0";
                this.customRule.push(elem);
              }
            }
            this.loading = false;
          }
        })
        .catch((e) => {
          this.$message.error("获取预警规则列表失败，请稍后在试");
        });
    },
    delRule(item) {
      Api_DelRule(item)
        .then((res) => {
          this.getAllRules();
          this.$message.success("删除成功");
        })
        .catch((e) => {
          this.$message.error("系统错误");
        });
    },
    // 编辑规则
    editRule(item, index) {
      Api_GetRules(item).then((res) => {
        this.editIndex = index;
        // this.ruleItem = res;
        this.ruleItem.id = res.id;
        this.ruleItem.warningName = res.warningName;
        this.ruleItem.ruleDesc = res.ruleDesc;
        this.ruleItem.warningLevel = res.warningLevel;
        this.ruleItem.monitorTypeId = res.monitorTypeId;
        this.ruleItem.timeRange = res.timeRange;
        this.ruleItem.warningItem = res.warningItem;
        this.ruleItem.ruleLimit = Number(res.ruleLimit);

        // 根据二级栏目的id获取一级栏目id
        for (const elem of this.monitorTypeOptions.entries()) {
          for (const ele of elem[1].children.entries()) {
            if (ele[1].value === this.ruleItem.monitorTypeId) {
              this.ruleItem.monitorTypeId1 = [ele[1].parentId, ele[1].value];
            }
          }
        }
      });
      this.dialogAddVisible = true;
    },
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.submitLoading = true;
          const postData = merge({}, this.ruleItem);
          delete postData.monitorTypeId1;
          Api_SaveCustomRules(postData)
            .then((res) => {
              this.submitLoading = false;
              this.getAllRules();
              this.dialogAddVisible = false;
              this.$message.success("保存成功");
              this.resetForm();
            })
            .catch((e) => {
              this.submitLoading = false;
              this.$message.error(e);
            });
        } else {
          return false;
        }
      });
    },
    resetForm() {
      this.$refs["ruleItemForm"].resetFields();
    },
    // 展开收起更多
    moreClick() {
      this.showSysRule = this.showSysRule === this.sysRule.length ? 6 : this.sysRule.length;
    },
    // 启用、禁用规则
    changeSwitchStatus(id, enable) {
      const loading = this.$openLoading();
      Api_ChangeRulesState({ id, status: enable === 1 ? 0 : 1 })
        .then((res) => {
          this.this_message && this.this_message.close();
          loading.close();
          this.this_message = this.$message.success("修改成功");
        })
        .catch((e) => {
          this.this_message && this.this_message.close();
          loading.close();
          this.this_message = this.$message.error("系统错误");
        });
    },
    // 自定义规则里的级联菜单
    cascaderChange(value) {
      if (value[1]) {
        this.ruleItem.monitorTypeId = value[1];
      }

      // 根据二级栏目的id获取一级栏目id
      for (const elem of this.monitorTypeOptions.entries()) {
        for (const ele of elem[1].children.entries()) {
          if (ele[1].value === this.ruleItem.monitorTypeId) {
            if (ele[1].warningIndex === 0) {
              this.ruleItem.warningItem = "0";
              this.warningItem3 = true;
            } else if (ele[1].warningIndex === 1) {
              this.ruleItem.warningItem = "1";
              this.warningItem3 = true;
            } else {
              this.warningItem3 = false;
            }
          }
        }
      }
    },
    beforeClose() {
      this.resetForm("ruleItemForm");
    },
    setBlank() {
      this.dialogAddVisible = true;
    },
  },
};
</script>

<style lang="scss">
.rule-boxP {
  .el-tag--small {
    padding: 0 5px;
  }
}
</style>
<style lang="scss" scoped>
.rule-box {
  margin: 15px 0;
  padding: 18px;
  height: 194px;
  border: 1px solid #f0f2f7;

  h3 {
    overflow: hidden;
    margin-bottom: 16px;

    .name {
      font-size: 18px;
      vertical-align: sub;
      color: #5f7b9a;
      margin-left: 10px;
    }
  }

  p {
    color: #888888;
    line-height: 30px;
    min-height: 90px;
  }

  &.add {
    background-color: #f7f8f9;
    text-align: center;
    color: #5f7b9a;
    line-height: 156px;

    &:hover {
      cursor: pointer;
    }
  }
}

.tags {
  color: #ffffff;
  border: 0;
  cursor: pointer;
  // border-radius: 2px !important;
  line-height: 24px;
  &.red {
    background-color: #ff4949;
  }

  &.yellow {
    background-color: #f7ba2a;
  }

  &.blue {
    background-color: #409eff;
  }

  &.green {
    background-color: #13ce66;
  }
}

.el-dropdown-link {
  cursor: pointer;
  outline: none;
  margin-bottom: 47px;
}

.funcBox {
  margin-top: 8px;
  overflow: hidden;

  a {
    margin-right: 15px;
    color: #409eff;
    font-size: 12px;
  }

  .el-switch {
    float: right;
  }
}

#addRuleForm {
  padding: 0 15px;
}
</style>
