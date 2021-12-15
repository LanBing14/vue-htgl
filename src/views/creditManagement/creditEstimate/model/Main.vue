<template>
  <div>
    <div class="page-header">
      <h1 class="page-name">
        <span>信用评估模型</span>
      </h1>
      <div>
        <el-button size="small" @click="handleAdd" class="btn-color-blue" icon="el-icon-plus">新增模型</el-button>
      </div>
    </div>
    <div class="page-content">
      <el-form ref="searchForm" :model="listQuery" :inline="true">
        <el-form-item prop="name">
          <el-input
            v-model="listQuery.name"
            placeholder="模型名称"
            class="filter-item"
            @keyup.enter.native="handleFilter"
          />
        </el-form-item>
        <!-- <el-form-item prop="source">
          <el-select v-model="listQuery.source" placeholder="模型来源">
            <el-option value="0" label="初始化模型"></el-option>
            <el-option value="1" label="自定义模型"></el-option>
          </el-select>
        </el-form-item> -->
        <el-form-item class="btns">
          <el-button class="filter-item" type="primary" @click="handleFilter">查询</el-button>
          <el-button class="filter-item" @click="handleReset('searchForm')">重置</el-button>
        </el-form-item>
      </el-form>
      <TableWrapper ref="table" :fetchDataFn="Api_EvaluateModelPage" :query="listQuery" :columns="tableCol" />
    </div>
    <CopyModel ref="refCopyModel" @getList="getList"></CopyModel>
  </div>
</template>

<script type="text/jsx">
    // import {Switch} from 'element-ui';
    import CopyModel from "./CopyModel";
    import {
        Api_deleteModel,
        Api_EvaluateModelPage,
        Api_EvaluateModelRefresh,
        Api_EvaluateModelStatus,
        Api_EvaluateModelStatusUpdate,
        Api_publishModel,
        Api_xian
    } from "@/api/creditManagement/creditEstimate/model";

    export default {
  name: "Main",
  components: { CopyModel },
  data() {
    return {
      listQuery: {
        source: "", // 模型来源
        name: "", // 模型名称
      },
      tableCol: [
        {
          key: "modelName",
          label: "模型名称",
          align: "left",
          props: { "show-overflow-tooltip": true, "min-width": 150 },
          render: (h, data, row) => {
            return (
              <span class="canClick" onClick={this.handleDetail.bind(this, row)}>
                {data}
              </span>
            );
          },
        },
        {
          key: "modelDesc",
          label: "模型描述",
          align: "left",
          props: { "min-width": 150 },
          render: (h, data) => {
            return <div class="ellipsis">{data}</div>;
          },
        },
        // {
        //   key: "modelSource",
        //   label: "模型来源",
        //   render: (h, data) => {
        //     return data === "0" ? "初始化" : "自定义";
        //   },
        // },
        {
          key: "createDate",
          label: "创建时间",
          render: (h, data) => {
            return data && data.split(" ")[0];
          },
        },
        {
          key: "modifyDate",
          label: "更新时间",
          render: (h, data) => {
            return data && data.split(" ")[0];
          },
        },
        {
          key: "kpiStatus",
          label: "状态",
          render: (h, data, row) => {
            // return row.isRelease === "0"
            //   ? "未发布"
            //   : row.isRelease === "1"
            //   ? "已发布"
            //   : row.kpiStatus
            //   ? "已启用"
            //   : "已停用";
            return (
             [ <el-switch
                value={row.kpiStatus}
                active-color="#409eff"
                inactive-color="#dcdfe6"
                onChange={this.statusChange.bind(this, row)}
              ></el-switch>]
            );
          },
        },
        {
          key: null,
          label: "操作",
          align: "center",
          width: 150,
          render: (h, data, row) => {
            const { modelSource } = row;
            const { kpiStatus } = row;
            // modelSource !== "0" && !kpiStatus?
            //<el-link type="primary" onClick={this.deleteModel.bind(this, row)}> 移除 </el-link>
            //: <el-link type="info" disabled> 移除 </el-link>,
              return [
                  <el-link type="primary" onClick={this.handleCopy.bind(this, row)}> 复制 </el-link>,
                  //<el-link type="primary" onClick={this.handleCopy.bind(this, row)}> 更新 </el-link>,
                  // modelSource !== "0" && !kpiStatus  ?  
                  <el-link type="primary" onClick={this.handleEdit.bind(this, row)}> 编辑 </el-link>
                  //  :
                  //     <el-link type="info" disabled> 编辑 </el-link>
              ]
          },
        },
      ],
    };
  },
  created() {
    this.$nextTick(() => {

      Api_xian().then(()=>{
          this.getList();
      })

    });
  },
  methods: {
    Api_EvaluateModelPage,
    handleAdd() {
      if (this.$isVip()) {
        this.$emit("edit", true, true, {}, true);
      } else {
        this.$message.error("当前企业会员已到期，请联系管理员进行续费。");
      }
    },
    // 获取主列表数据
    getList(flag) {
      this.$refs.table.fetchData(flag);
    },
    // 根据查询条件获取数据
    handleFilter() {
      this.getList(true);
    },
    // 重置查询条件
    handleReset(formName) {
      this.$refs[formName].resetFields();
        this.getList(true);
    },
      // 开关切换事件
      statusChange(row,status) {
          const loading = this.$openLoading();
          Api_EvaluateModelStatus(row.id)
              .then((res) => {
                  if (status==='0') {//禁用 判断是否需要提示
                      this.$confirm("当前模型将被禁用，请至少保留一个启用模型！", "提示", {
                          type: "warning",
                      })
                          .then((res) => {
                              this.handleStatusUpdate(row, loading);
                          })
                          .catch(() => {
                              loading.close();
                          });
                  }else
                  if (!res) {
                      this.$confirm("当前存在已启用状态的评估模型，当前启用生效后原模型将被禁用。", "提示", {
                          type: "warning",
                      })
                          .then((res) => {
                              this.handleStatusUpdate(row, loading);
                          })
                          .catch(() => {
                              loading.close();
                          });
                  } else {
                      this.handleStatusUpdate(row, loading);
                  }
              })
              .catch(() => {
                  loading.close();
              });
      },
      handleStatusUpdate(row, loading) {
        if(!row.kpiStatus){//启用
            Api_publishModel(row.id)
                .then((res) => {
                    Api_EvaluateModelStatusUpdate(row.id, !row.kpiStatus ? 1 : 0)
                        .then((msg) => {
                            this.$message.success(msg);
                            loading.close();
                            this.getList();
                        })
                        .catch((e) => {
                            this.$message.error(e);
                            loading.close();
                        });
                }) .catch((e) => {
                this.$message.error(e);//判断是否可以启用
                loading.close();
            });
        }else{
            Api_EvaluateModelStatusUpdate(row.id, !row.kpiStatus ? 1 : 0)
                .then((msg) => {
                    this.$message.success(msg);
                    loading.close();
                    this.getList();
                })
                .catch((e) => {
                    this.$message.error(e);
                    loading.close();
                });
        }
      },
      pulishModel(row) {
          const loading = this.$openLoading();
          Api_publishModel(row.id)
              .then((res) => {
                  this.$message.success(res);
                  loading.close();
                  this.getList();
              })
              .catch((e) => {
                  this.$message.error(e);
                  loading.close();
              });
      },
      //删除模型
      deleteModel(row) {

        this.$confirm('是否删除改模型', '提示', {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              type: 'warning'
            }).then(() => {
            const loading = this.$openLoading();
            Api_deleteModel(row.id)
                .then((res) => {
                    this.$message.success(res);
                    loading.close();
                    this.getList();
                })
                .catch((e) => {
                    this.$message.error(e);
                    // loading.close();
                });
            }).catch(() => {
              this.$message({
                type: 'info',
                message: '已取消删除'
              });          
            })
      },
    // 复制模型
    handleCopy(row) {
      this.$nextTick(() => {
        this.$refs.refCopyModel.openModel(row);
      });
    },
    // 更新模型
    handleUpdate({ id }) {
      this.$confirm("该模型选取的部分指标已被编辑,是否同步指标到新模型?", "提示", {
        type: "warning",
      }).then(() => {
        const loading = this.$openLoading();
        Api_EvaluateModelRefresh(id)
          .then((res) => {
            this.$message.success("更新成功");
            loading.close();
            this.getList();
          })
          .catch(() => {
            this.$message.error("更新失败");
            loading.close();
          });
      });
    },
    // 打开修改界面
    handleEdit(row) {
      this.$emit("edit", true, false, row, true);
    },
    // 删除
    handleDel(row) {
      this.$confirm("确定删除该菜单?", "提示", {
        type: "warning",
      }).then(() => {
        const loading = this.$openLoading();
        // Api_MenuDel(row.id).then(msg => {
        //     this.$message.success(msg);
        //     this.getList();
        //     this.getDepTree();
        //     loading.close();
        // }).catch(() => {
        //     loading.close();
        // });
      });
    },
    // 查看详情
    handleDetail(row) {
      this.$emit("edit", true, false, row, false);
    },
  },
};
</script>

<style scoped>
</style>
