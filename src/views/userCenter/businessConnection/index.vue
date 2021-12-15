<template>
  <div class="serve-content-wrapper">
    <div class="title-name">
      <span class="name-1">企业绑定审核</span>
    </div>

    <div class="clearfix tabWrap">
      <p class="is-active" @click="searchStatus($event, '')">全部</p>
      <p @click="searchStatus($event, '0')">未审核</p>
      <p @click="searchStatus($event, '1')">已通过</p>
      <p @click="searchStatus($event, '2')">已驳回</p>
    </div>
    <p class="title1-mechanism">申请绑定的用户信息</p>
    <TableWrapper
      ref="child"
      :fetchDataFn="Api_gusersAudit"
      :query="listQuery"
      :columns="tableCol"
    />

    <el-dialog title="企业绑定确认" :visible.sync="dialogVisible" width="30%" append-to-body :before-close="handleClose">
      <el-form ref="form" :model="departmentForm" label-width="80px">
        <el-form-item label="所在部门">
          <el-select v-model="departmentForm.departmentId" placeholder="请选择" style="width:100%">
            <el-option
              v-for="item in departmentList"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            >
            </el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer" >
        <el-button type="primary" @click="handelSubmin">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import {
  Api_gusersAudit,
  Api_usersAudit,
  Api_getDepartmen
} from "@/api/userCenter/propertyRepair.js";
export default {
  data() {
    return {
      userMesId: null,
      dialogVisible: false,
      departmentList: [],
      departmentForm: {
        departmentId: "",
      },
      listQuery: {
        status: "",
      },
      tableCol: [
        {
          key: "username",
          label: "姓名",
          width: 150,
        },
        {
          key: "name",
          label: "微信号",
          align: "left",
        },
        {
          key: "mobile",
          label: "手机号",
          align: "left",
        },
        {
          key: "departmentName",
          label: "所在部门",
          align: "left"
        },
        {
          key: "isAudit",
          label: "审核状态",
          align: "left",
          render: (h, data, row) => {
            return data == 0 ? "未审核" : data == 1 ? "已通过" : data == 2 ? "已驳回" : "已邀请";
          },
        },
        {
          key: null,
          label: "操作",
          render: (h, data, row) => {
            let html = ""
            if(row.isAudit == '0'){
              html = (
              <div>
                <span
                  class="btn-see"
                  style="color: #409eff"
                  onClick={this.handle.bind(this, row, 1)}
                >
                  通过
                </span>
                <span
                  class="btn-see"
                  style="color: #409eff;margin-left:10px"
                  onClick={this.handle.bind(this, row, 2)}
                >
                  驳回
                </span>
              </div>
            )
            }else{
           html = (
              <div>
                <span
                  class="btn-see"
                  style="color: #909399;"
                >
                  通过
                </span>
                <span
                  class="btn-see"
                  style="color: #909399;margin-left:10px"
                >
                  驳回
                </span>
              </div>
            )
            }
            return html;
          },
        },
      ],
    };
  },
  computed: {
    companyId() {
      return this.$store.getters.userInfo.companyId;
    },
  },
  methods: {
    getList(flag) {
      this.$refs.child.fetchData(flag);
    },
    Api_gusersAudit,
    handle(row, status) {
      let _this = this;
        this.userMesId = row.id;
        if (status == 1) {
          this.dialogVisible = true;
        } else {
          this.$confirm("确定 驳回 该条申请吗?", "提示", {
            confirmButtonText: "确定",
            cancelButtonText: "取消",
            type: "warning",
          })
            .then(() => {
              _this.checkUserType(status);
            })
            .catch(() => {});
        }
      

      // this.$emit("handleFromNotice", true, row.ID);
    },
    handleClose(){
      this.departmentForm.departmentId=''
      this.dialogVisible = false
    },
    //  弹框确认
    handelSubmin() {
      // if(!this.departmentForm.departmentId){
      //   this.$message({
      //     type: "warning",
      //     message: '部门不能为空',
      //   });
      //   return
      // }
      this.checkUserType(1, this.departmentForm.departmentId);
    },
    checkUserType(status, departmentId = "") {
      Api_usersAudit(this.userMesId, status, {departmentId}).then((res) => {
        this.$message({
          type: "success",
          message: '数据审核完成',
        });
        this.userMesId = null;
        this.departmentForm.departmentId=''
        this.dialogVisible = false
        this.$refs.child.fetchData();
      });
    },
    searchStatus(event, id) {
      var divAll = document.getElementsByClassName("tabWrap")[0].children;
      for (var i = 0; i < divAll.length; i++) {
        divAll[i].className = "";
      }
      event.target.className = "is-active";
      this.listQuery.status = id;
      this.getList(true);
    },
  },
  mounted() {
    this.$nextTick(() => {
      this.$refs.child.fetchData();
      Api_getDepartmen().then(res => {
        this.departmentList = res
      })
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
