<template>
  <div>
    <div class="page-header">
      <h1 class="page-name">
        <span>{{ modelStatus ? '新增':'修改' }}模型</span>
      </h1>
      <div>
        <el-button size="small" v-if="active===0 && !modelStatus" @click="deleteModel" type="danger">删除</el-button>
        <el-button size="small" v-if="active===0" @click="back">返回</el-button>
      </div>
    </div>
    <div class="page-content">
      <ul class="flex steps" style="width: 75%; margin: 50px auto 50px">
        <li class="flex flex-primary v-center">
          <div>
            <img src="~@/assets/images/creditManagement/step1.png" alt />
          </div>
          <div class="flex flex-primary">
            <span>新建模型</span>
            <div class="next-icon-wrap flex-primary">
              <img src="~@/assets/images/creditManagement/jiantou.png" alt />
            </div>
          </div>
        </li>
        <li class="flex flex-primary v-center">
          <div>
            <img v-if="active<1" src="~@/assets/images/creditManagement/step2-yet.png" alt />
            <img v-else src="~@/assets/images/creditManagement/step2.png" alt />
          </div>
          <div class="flex flex-primary">
            <span>选择指标</span>
            <div class="next-icon-wrap flex-primary">
              <img src="~@/assets/images/creditManagement/jiantou.png" alt />
            </div>
          </div>
        </li>
        <li class="flex flex-primary v-center">
          <div>
            <img v-if="active<2" src="~@/assets/images/creditManagement/step3-yet.png" alt />
            <img v-else src="~@/assets/images/creditManagement/step3.png" alt />
          </div>
          <div class="flex flex-primary">
            <span>设定分值</span>
            <div class="next-icon-wrap flex-primary">
              <img src="~@/assets/images/creditManagement/jiantou.png" alt />
            </div>
          </div>
        </li>
        <li class="flex v-center">
          <div>
            <img v-if="active<3" src="~@/assets/images/creditManagement/step4-yet.png" alt />
            <img v-else src="~@/assets/images/creditManagement/step4.png" alt />
          </div>
          <div class="flex-primary">设定等级</div>
        </li>
      </ul>
      <div style="margin-top: 60px;">
        <!--                <keep-alive>-->
        <Step1
          ref="step0"
          v-if="active===0"
          :modelStatus="modelStatus"
          :rowId="rowId"
          @addNewId="addNewId"
          @levelChange="onLevelChange"
        ></Step1>
        <Step2 ref="step1" v-else-if="active===1" :modelStatus="modelStatus" :rowId="rowId" :isTwo="isTwo" @sendFrom="isMytwo"></Step2>
        <Step3
          ref="step2"
          v-else-if="active===2"
          :modelStatus="modelStatus"
          :rowId="rowId"
          :isTwo="isTwo1"
          :data="step1Data"
        ></Step3>
        <Step4 ref="step3" v-else-if="active===3" :modelStatus="modelStatus" :rowId="rowId"></Step4>
        <!--                </keep-alive>-->
      </div>
      <div class="btns size-btn-change">
        <el-button v-if="active>0" type="info" @click="prev" class="btn-prev">上一步</el-button>
        <el-button v-if="active<3" :loading="btnNextLoading" type="primary" @click="next" class="btn-next">下一步</el-button>
        <el-button v-if="active===3" :loading="btnNextLoading" type="primary" @click="save">保存</el-button>
      </div>
    </div>
  </div>
</template>

<script>
import Step1 from "./components/Step1";
import Step2 from "./components/Step2";
import Step3 from "./components/Step3";
import Step4 from "./components/Step4";
import {
        Api_deleteModel,
    } from "@/api/creditManagement/creditEstimate/model";
export default {
  name: "CreateUpdate",
  components: {
    Step1,
    Step2,
    Step3,
    Step4,
  },
  props: {
    modelStatus: Boolean,
    selectData: {
      type: Object,
      default: () => ({}),
    },
  },
  data() {
    // const createRules = this.$createRules;
    return {
      visible: false,
      active: 0,
      isTwo: true, // 模型层级，true：两层，false：三层
      isTwo1:null,
      step0Data: undefined,
      step1Data: undefined,
      step2Data: undefined,
      step3Data: undefined,
      btnNextLoading: false, // 下一步按钮loading
      rowId: this.selectData.id, // 模型id
    };
  },
  methods: {
      isMytwo(value){
        this.isTwo1 = value
      },
       //删除模型
       deleteModel() {
        this.$confirm('是否删除改模型', '提示', {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              type: 'warning'
            }).then(() => {
            const loading = this.$openLoading();
            Api_deleteModel(this.rowId)
                .then((res) => {
                    this.$message.success(res);
                    loading.close();
                    this.$emit("edit", false);
                    this.getList();
                })
                .catch((e) => {
                    this.$message.error(e);
                    loading.close();
                });
            }).catch(() => {
              this.$message({
                type: 'info',
                message: '已取消删除'
              });          
            })
      },
    open() {
      this.visible = true;
    },
    back() {
      this.$emit("edit", false);
    },
    handleAdd() {
      this.$refs.step3.handleAdd();
    },
    next() {
      const validateResult = this.$refs["step" + this.active].validate;
      this.btnNextLoading = true;
      validateResult()
        .then((data) => {
          this["step" + this.active + "Data"] = data;
          this.active++;
          this.btnNextLoading = false;
        })
        .catch(() => {
          this.btnNextLoading = false;
        });
    },
    prev() {
      this.active--;
    },
    onLevelChange(flag) {
      this.isTwo = flag;
    },
    save() {
      const validateResult = this.$refs["step3"].validate;
      this.btnNextLoading = true;
      validateResult()
        .then((data) => {
          this["step4Data"] = data;
          this.btnNextLoading = false;
          this.$message.success("保存成功！");
          this.$emit("edit", false);
        })
        .catch(() => {
          this.btnNextLoading = false;
        });
    },
    // 初始第一步新增模型成功时返回的id
    addNewId(id) {
      this.rowId = id;
    },
    cancel() {},
  },
};
</script>

<style scoped lang="scss">
.showSelectIcon {
  margin-right: 10px;
  font-size: 22px;
  vertical-align: middle;
}

.btns {
  text-align: center;
  margin-top: 20px;
}

.steps {
  & > li {
    & > .flex-primary {
      padding-left: 15px;
      font-size: 16px;
    }
  }
}

.btn-prev {
  background-color: rgba(244, 244, 245, 1);
  border: 1px solid rgba(211, 212, 214, 1);
  color: #909399;
}

.btn-next {
  background-color: $--color-primary;
}

.next-icon-wrap {
  text-align: center;
}
</style>
