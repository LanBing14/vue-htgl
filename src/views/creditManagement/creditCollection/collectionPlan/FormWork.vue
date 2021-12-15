<template>
  <div style="height: 100%;">
    <div class="page-header">
      <h1 class="page-name">
        <span>催收函模板配置</span>
      </h1>
      <div>
        <el-button size="small" @click="back">返回</el-button>
      </div>
    </div>
    <div class="page-content">
      <div class="flex" style="height: 100%;">
        <div style="flex: 0 320px">
          <el-card v-loading="listLoading" shadow="never" class="box-card">
            <div slot="header" class="clearfix">
              <div class="flex">
                <span class="flex-primary">催收函模板</span>
                <div class="action">
                  <el-button type="text" class="tree-btn-font" @click="addRow">新增</el-button>
                </div>
              </div>
            </div>
            <div>
              <el-radio-group v-model="listSelectId" @change="onSelectChange" class="radio-group-wrap">
                <el-radio-button v-for="el in list" :key="el.id" :label="el.id">
                  <div class="flex">
                    <span class="flex-primary">{{ el.name }}</span>
                    <span @click="delRow(el.id)" class="del">删除</span>
                  </div>
                </el-radio-button>
              </el-radio-group>
            </div>
          </el-card>
        </div>
        <div v-loading="contentLoading" style="flex: 1;padding:0 20px;overflow: auto">
          <el-form ref="form" :model="formData" :rules="formRules" label-width="7em" class="form">
            <el-form-item label="模板名称" prop="name">
              <el-input v-model="formData.name" :disabled="isDefault" placeholder="请输入催收模板名称"></el-input>
            </el-form-item>
            <el-form-item label="模板正文" prop="text">
              <el-input
                v-model="formData.text"
                :disabled="isDefault"
                :rows="10"
                type="textarea"
                placeholder="请输入催收函模板正文信息"
              ></el-input>
            </el-form-item>
          </el-form>
          <div class="btns size-btn-change">
            <el-button :loading="btnLoading" :disabled="isDefault" type="primary" @click="handleSure()">保存</el-button>
            <el-button :loading="btnLoading" :disabled="isDefault" @click="handleRest()">重置</el-button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import {
  Api_CollectionPlanModel,
  Api_CollectionPlanModelAdd,
  Api_CollectionPlanModelUpdate,
  Api_CollectionPlanModelDelete
} from "@/api/creditManagement/creditCollection/collectionPlan";

export default {
  name: "FormWork",
  data() {
    const createRules = this.$createRules;

    return {
      listSelectId: "", // 当前列表选中的id
      listLoading: false,
      list: [], // 模板列表
      contentLoading: false,
      btnLoading: false, // 按钮loading
      modelStatus: "add", // add: 新增，update: 修改
      selectData: {}, // 当前选中的模型数据
      formData: {
        name: "",
        text: ""
      },
      formRules: {
        name: createRules({
          msg: "模板名称",
          required: true,
          max: 20
        }),
        text: createRules({
          msg: "模本正文",
          max: 1000
        })
      },
      isDefault: false // 当前选中编辑的模板是否是默认的
    };
  },
  created() {
    this.getList().then(res => {
      if (res[0]) {
        this.listSelectId = res[0].id;
        this.onSelectChange(res[0].id);
      }
    });
  },
  methods: {
    getList() {
      return new Promise((resolve, reject) => {
        this.listLoading = true;
        Api_CollectionPlanModel()
          .then(res => {
            this.list = res;
            this.listLoading = false;
            resolve(res);
          })
          .catch(e => {
            this.$message.error(e);
            this.listLoading = false;
            reject(e);
          });
      });
    },
    // 新增
    addRow() {
     
      this.handleRest();
      this.modelStatus = "add";
    },
    // 列表选择切换事件
    onSelectChange(id) {
      this.selectData = this.list.find(item => item.id === id);
      this.modelStatus = "update";
      this.formData.name = this.selectData.name;
      this.formData.text = this.selectData.textVo.text;
      this.isDefault = this.selectData.type;
    },
    delRow(id) {
      this.$confirm("确定要删除该催收函模板吗？删除后不可恢复。", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
        const loading = this.$openLoading();
        Api_CollectionPlanModelDelete(id)
          .then(res => {
            loading.close();
            this.$message.success(res);
            this.getList();
          })
          .catch(e => {
            loading.close();
            this.$message.error(e);
          });
      });
    },
    // 保存
    handleSure() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          this.btnLoading = true;
          const postData = this.formData;
          const primiseRes =
            this.modelStatus === "add"
              ? Api_CollectionPlanModelAdd(postData)
              : Api_CollectionPlanModelUpdate(this.listSelectId, {
                  ...postData,
                  version: this.selectData.version
                });
          primiseRes
            .then(res => {
              this.btnLoading = false;
              this.$message.success(res);
              this.getList();
              if (this.modelStatus === "add") {
                this.handleRest();
              }
            })
            .catch(e => {
              this.btnLoading = false;
              this.$message.error(e);
            });
        }
      });
    },
    // 重置
    handleRest() {
      this.$refs.form.resetFields();
    },

    back() {
      this.$emit("edit", false);
    }
  }
};
</script>

<style scoped lang="scss">
@import "src/styles/mixin.scss";

.form {
  width: 90%;
  margin: auto;
}

.btns {
  text-align: center;
  margin-top: 20px;
}

.radio-group-wrap {
  .del {
    display: none;
  }

  .is-active {
    .del {
      display: initial;
    }
  }
}

/deep/ {
  @include radioGroupButton;
}
</style>
