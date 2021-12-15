<template>
  <div>
    <h4 class="flex">
      <span class="flex-primary">法院公告</span>
      <el-button size="mini" @click="openModal()" v-if="!isFxb">新增</el-button>
    </h4>
    <el-row>
      <TableWrapper
        ref="table"
        :fetchDataFn="Api_GetCourtNoticeInfoByPage"
        :query="listQuery"
        :columns="tableCol1"
      />
    </el-row>
    <Dialog
      :title="modelStatus === 'add' ? '新增': '修改'"
      :visible.sync="visible"
      :onOk="handleSure"
      width="500px"
      @close="onClose"
    >
      <el-form ref="form" :model="formData" :rules="formRules" label-width="6em" label-position="right">
        <el-form-item label="公示时间" prop="publicationDate">
          <el-date-picker
            type="date"
            v-model="formData.publicationDate"
            value-format="yyyy-MM-dd"
            style="width: 100%;"
          ></el-date-picker>
        </el-form-item>
        <el-form-item label="分类" prop="category">
          <el-input v-model="formData.category"></el-input>
        </el-form-item>
        <el-form-item label="当事人" prop="party">
          <el-input v-model="formData.party"></el-input>
        </el-form-item>
        <el-form-item label="法院公告" prop="content">
          <el-input v-model="formData.content"></el-input>
        </el-form-item>
      </el-form>
    </Dialog>
  </div>
</template>

<script type="text/jsx">
import {
  Api_GetCourtNoticeInfoByPage,
  Api_CourtNoticeAdd,
  Api_CourtNoticeUpdate,
  Api_CourtNoticeDelete
} from "@/api/creditManagement/customerProfile/customerManagemCustomer/judicialInfo";

export default {
  name: "Comp1",
  props: {
    companyName: String, // 客户名称
    isFxb:Boolean,
    isDelete:Boolean
  },
  data() {
    const createRules = this.$createRules;
    return {
      visible: false,
      modelStatus: "add",
      listQuery: {
        companyId: this.$route.query.id
      },
      tableCol1: [
        {
          key: "publicationDate",
          label: "公示时间",
          render: (h, data) => {
            return this.$dateFormat(data);
          }
        },
        {
          key: "category",
          label: "分类"
        },
        {
          key: "party",
          label: "当事人"
        },
        {
          key: "content",
          label: "法院公告"
        },
        {
          label: "操作",
          key: null,
          render: (h, data, row) => {
              return !this.isFxb ? [<el-link type="primary" onClick={this.openModal.bind(this, row)}> 编辑 </el-link>,
                  <el-link type="primary" onClick={this.handleDelete.bind(this, row)}> 删除 </el-link>
              ] : ""
          }
        }
      ],
      formData: {
        companyId: this.$route.query.id,
        companyName: "",
        publicationDate: "",
        category: "",
        party: "",
        content: ""
      },
      formRules: {
        party: createRules({
          msg: "当事人",
          required: true
        })
      },
      detailData: {}
    };
  },
  mounted() {
    this.getList();
  },
  methods: {
    Api_GetCourtNoticeInfoByPage,
    getList() {
      this.$refs.table.fetchData();
    },
    openModal(row) {
      if(this.isDelete){
        this.$alert('该企业不在您当前客户列表，请重新加入','提示', {
          confirmButtonText: '确定',
          type: 'warning'
        });
        return 
    }
      this.visible = true;
      this.$nextTick(() => {
        if (!row) {
          this.detailData = {};
          this.modelStatus = "add";
        } else {
          this.detailData = { ...row };
          this.modelStatus = "update";
          Object.keys(this.formData).forEach(key => {
            if (key === "publicationDate") {
              this.formData[key] = this.$dateFormat(row[key]);
            } else {
              this.formData[key] = row[key];
            }
          });
        }
      });
    },
    handleSure() {
      this.$refs.form.validate(valid => {
        if (!valid) return;
        const id = this.detailData.id;
        const postData = {
          ...this.formData,
          companyName: this.companyName,
          saasCode: this.$store.getters.saasCode
        };
        const loading = this.$openLoading();
        const promiseRes = !id
          ? Api_CourtNoticeAdd(this.formData.companyId, postData)
          : Api_CourtNoticeUpdate(id, this.formData.companyId, {
              ...postData,
              version: this.detailData.version
            });
        promiseRes
          .then(res => {
            loading.close();
            this.getList();
            this.visible = false;
            this.$message.success(res);
            this.onClose();
          })
          .catch(e => {
            loading.close();
            this.$message.error(e);
          });
      });
    },
    handleDelete(row) {
      this.$confirm("确认删除？", "提示", {
        type: "warning"
      }).then(() => {
        const loading = this.$openLoading();
        Api_CourtNoticeDelete(row.id, this.formData.companyId)
          .then(res => {
            loading.close();
            this.getList();
            this.$message.success(res);
          })
          .catch(e => {
            loading.close();
            this.$message.error(e);
          });
      });
    },
    onClose() {
      this.$refs.form.resetFields();
    }
  }
};
</script>

<style scoped>
</style>
