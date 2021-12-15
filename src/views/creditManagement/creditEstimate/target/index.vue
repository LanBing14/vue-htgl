<template>
  <div>
    <div class="page-header">
      <h1 class="page-name">
        <span>信用评估指标</span>
      </h1>
    </div>
    <div class="page-content" style="position: relative">
      <div style="position: sticky; top: 20px; float: left; width: 300px">
        <el-card ref="card" :style="{height: height +'px'}" shadow="never" class="box-card left-card-body">
          <div slot="header" class="clearfix">
            <div class="flex">
              <span class="flex-primary">指标</span>
              <div class="action">
                <el-button type="text" icon="el-icon-plus" class="tree-btn-font" @click="addFenlei">分类</el-button>
                <el-button type="text" icon="el-icon-plus" class="tree-btn-font" @click="addZhibiao">指标</el-button>
              </div>
            </div>
          </div>
          <el-scrollbar
            ref="scrollWrapLeft"
            style="height: 100%; overflow: hidden"
            @mouseover.native="onMouseOverLeft"
          >
            <div style="padding: 20px">
              <div style="margin-bottom: 15px;">
                <el-input v-model="filterText" suffix-icon="el-icon-search" />
              </div>
              <el-tree
                v-loading="treeLoading"
                element-loading-text="拼命加载中"
                element-loading-spinner="el-icon-loading"
                ref="tree"
                :data="treeData"
                :filter-node-method="filterNode"
                :default-expanded-keys="defaultExpandedKeys"
                node-key="id"
                highlight-current
                default-expand-all
                @node-click="nodeClick"
              >
                <div class="custom-tree-node" slot-scope="{ node, data }">
                  <span :title="data.label || data.classifyName || data.kpiName">
                    <i v-if="data.isFenLei" class="el-icon-reading"></i>
                    {{ data.label || data.classifyName || data.kpiName }}
                  </span>
                  <!-- v-if="!isArray(node.parent.data)" -->
                  <template >
                    <div v-if="data.isFenLei" class="tree-item-action">
                      <el-tooltip content="编辑分类" placement="top">
                        <!-- <el-button v-if="!data.init" type="text" @click.stop="editFenLei(node, data)"> -->
                          <el-button type="text" @click.stop="editFenLei(node, data)">
                          <i class="el-icon-edit"></i>
                        </el-button>
                      </el-tooltip>
                      <el-tooltip content="删除分类" placement="top">
                        <!-- <el-button v-if="!data.init" type="text" @click.stop="delTreeRow(node, data)"> -->
                          <el-button  type="text" @click.stop="delTreeRow(node, data)">
                          <i class="el-icon-delete"></i>
                        </el-button>
                      </el-tooltip>
                    </div>
                    <div v-else class="tree-item-action">
                      <el-tooltip content="复制指标" placement="top">
                        <!-- <el-button v-if="data.init" type="text" @click.stop="copyZhibiao(node, data)"> -->
                          <el-button  type="text" @click.stop="copyZhibiao(node, data)">
                          <i class="el-icon-copy-document"></i>
                        </el-button>
                      </el-tooltip>
                      <el-tooltip content="编辑指标" placement="top">
                        <!-- <el-button v-if="!data.init" type="text" @click.stop="editZhibiao(node, data)"> -->
                          <el-button type="text" @click.stop="editZhibiao(node, data)">
                          <i class="el-icon-edit"></i>
                        </el-button>
                      </el-tooltip>
                      <el-tooltip content="删除指标" placement="top" :hide-after="1000"  >
                        <!-- <el-button v-if="!data.init" type="text" @click.stop="delTreeRow(node, data)"> -->
                          <el-button  type="text" @click.stop="delTreeRow(node, data)">
                          <i class="el-icon-delete"></i>
                        </el-button>
                      </el-tooltip>
                    </div>
                  </template>
                </div>
              </el-tree>
            </div>
          </el-scrollbar>
        </el-card>
      </div>
      <div style="padding-left: 20px; width: calc(100% - 300px); overflow: auto; float: left">
        <!-- <div :style="{height: height +'px'}"> -->
        <!-- <el-scrollbar
            ref="scrollWrapRight"
            style="height: 100%; overflow: hidden"
            @mouseover.native="onMouseOverRight"
        >-->
        <div v-if="isViewFenlei!==null">
          <div
            class="sub-title"
            style="margin-top: 0; margin-bottom: 10px"
          >{{ isViewFenlei ? '分类详情' : '指标详情' }}</div>
          <el-form
            v-if="isViewFenlei===true"
            ref="viewFenleiForm"
            label-position="right"
            label-width="7em"
            class="form-wrap"
          >
            <el-form-item label="分类名称:">{{ viewFenleiFormData.classifyName }}</el-form-item>
            <el-divider class="detail-divider"></el-divider>
            <el-form-item label="分类描述:">{{ viewFenleiFormData.classifyDesc }}</el-form-item>
            <el-divider class="detail-divider"></el-divider>
          </el-form>
          <el-form
            v-else-if="isViewFenlei===false"
            ref="form"
            label-position="right"
            label-width="12em"
            class="form-wrap"
          >
            <el-form-item label="指标名称:">{{ viewZhibiaoFormData.kpiName }}</el-form-item>
            <el-divider class="detail-divider"></el-divider>
            <el-form-item label="指标描述:">{{ viewZhibiaoFormData.kpiDesc }}</el-form-item>
            <el-divider class="detail-divider"></el-divider>
            <el-form-item label="指标类型:">{{ viewZhibiaoFormData.kpiType | filterType }}</el-form-item>
            <el-divider class="detail-divider"></el-divider>

            <el-form-item label="系统指标:"  v-if="viewZhibiaoFormData.elementName" style="color: #409eff;cursor:pointer" @click.native="showXiTong(viewZhibiaoFormData.elementName)">{{viewZhibiaoFormData.elementName}}</el-form-item>
            <el-form-item label="系统指标:"  v-else>-</el-form-item>
            
            <el-divider class="detail-divider"></el-divider>

            <el-form-item label="单位:">
              <el-form-item>{{ viewZhibiaoFormData.kpiUnit }}</el-form-item>
            </el-form-item>
            <el-divider class="detail-divider"></el-divider>
            <!-- <el-form-item label="评分标准:"></el-form-item> -->
            <el-form-item label="评分标准:"  class="score-form-item" style="margin-right: 0;">
              <el-table
                v-if="viewZhibiaoFormData.kpiType==='0'"
                :data="viewZhibiaoFormData.scoreList"
                stripe
                class="score-table"
                style="margin-top: 10px"
              >
                <el-table-column type="index" label="序号" width="60"></el-table-column>
                <!-- <el-table-column prop="scoreStandard" label="评分标准"></el-table-column> -->
                <el-table-column prop="valueBegin" label="实际数值起"></el-table-column>
                <el-table-column prop="valueEnd" label="实际数值至"></el-table-column>
                <el-table-column prop="scoreProportion" label="得分比例" width="100" align="center"></el-table-column>
              </el-table>
              <el-table
                v-else
                :data="viewZhibiaoFormData.scoreList"
                stripe
                class="score-table"
                style="margin-top: 10px"
              >
                <el-table-column type="index" label="序号" width="60"></el-table-column>
                <el-table-column prop="scoreStandard" label="评分标准"></el-table-column>
                <el-table-column prop="scoreProportion" label="得分比例" width="100" align="center"></el-table-column>
              </el-table>
            </el-form-item>
          </el-form>
        </div>
        <div v-else>
          <Fenlei
            v-if="formType === 1"
            ref="fenlei"
            :currentNode="currentNode"
            @getTreeData="getTreeData"
            @showDetail="showDetail"
          ></Fenlei>
          <Zhibiao
            v-else
            ref="zhibiao"
            :treeData="treeData"
            :selectFenlei="selectFenlei"
            @getTreeData="getTreeData"
            @showDetail="showDetail"
          ></Zhibiao>
        </div>
        <!-- </el-scrollbar> -->
        <!-- </div> -->
      </div>
    </div>
    <xitong ref="xitong" :modelStatus="false"></xitong>
    <CopyZhibiao :treeData="treeData" ref="copyZhibiao" @getTreeData="getTreeData"></CopyZhibiao>
  </div>
</template>

<script>
/* eslint-disable */
import { isArray, merge } from "lodash";
import Fenlei from "./Fenlei";
import Zhibiao from "./Zhibiao";
import CopyZhibiao from "./CopyZhibiao";
import xitong from './compontent/xitong'
import {
  Api_EvaluateEstimateTree,
  Api_EvaluateEstimateKpiInitTree,
  Api_EvaluateEstimateClassifyDelete,
  Api_EvaluateEstimateQuotaDelete,
  Api_EvaluateEstimateIsUse,
} from "@/api/creditManagement/creditEstimate/target";

export default {
  name: "Target",
  filters: {
    filterType(value) {
      return value === "1" ? "定性" : "定量";
    },
  },
  components: {
    Fenlei,
    Zhibiao,
    CopyZhibiao,
    xitong
  },
  data() {
    return {
      isArray,
      isShow: true,
      height: 0,
      resizeTimer: null,
      treeLoading: false,
      filterText: "",
      viewFenleiFormData: {
        classifyName: "",
        classifyDesc: "",
      }, // 分类详情查看的数据
      
      viewZhibiaoFormData: {
        kpiName: "",
        kpiDesc: "",
        kpiType: "0", // 1：定性，2：定量
        kpiUnit: "",
        elementName:"", //选择的系统指标的名称
        scoreList: [],
      }, // 指标详情查看的数据
      treeData: [],
      defaultExpandedKeys: [], // 默认展开的tree节点
      selectFenlei: {}, // 选中的指标分类
      isViewFenlei: false, // null:显示可编辑状态表单，true:分类的详情，false:指标详情
      formType: 1, // 1：分类，2：指标
      modelStatus: true, // 新增、修改
      currentNodeKey: "", // 控制左侧树当前选中的节点key
      currentNode: {}, // 控制左侧树当前选中的节点数据
    };
  },

  watch: {
    filterText(val) {
      this.$refs.tree.filter(val);
    },
  },
  mounted() {
       
  
       this.Api_InitTree(this.init)
    // this.getTreeData(() => {
    //   console.log(this.treeData,89)
    //   const firstTreeItem = this.treeData[0].children[0];
    //   console.log(firstTreeItem,888)
    //   if (firstTreeItem) {
    //     const arr = [firstTreeItem.id];
    //     arr.push(1);
    //     this.defaultExpandedKeys = arr;
    //     this.nodeClick(firstTreeItem.children[0]);
    //   }
    // });
    this.getHeight();
    window.addEventListener("resize", this.getHeight, false);
  },
  beforeDestory() {
    window.removeEventListener("resize", this.getHeight);
  },
  methods: {
    init(){
        let dataInit=this.treeData[0].children[0];
        this.currentNodeKey = dataInit.id;
        this.currentNode = dataInit;
        this.$refs.tree.setCurrentKey(this.currentNodeKey);
        this.viewZhibiaoFormData.kpiName = dataInit.kpiName;
        this.viewZhibiaoFormData.kpiDesc = dataInit.kpiDesc;
        this.viewZhibiaoFormData.kpiType = dataInit.kpiType;
        this.viewZhibiaoFormData.kpiUnit = dataInit.kpiUnit;
        this.viewZhibiaoFormData.scoreList = dataInit.scoreList;
        this.viewZhibiaoFormData.elementName = dataInit.elementName
    },
    showXiTong(elementName){
      this.$refs.xitong.open(elementName)
    },
    Api_InitTree(init){
      this.treeLoading = true
      Api_EvaluateEstimateKpiInitTree().then(res=>{
        this.getTreeData(init)
       
      }).catch(err=>{
        this.treeLoading = false
      })
    },
    getHeight() {
      clearTimeout(this.resizeTimer);
      this.resizeTimer = setTimeout(() => {
        if (!this.$refs.card) {
          return;
        }
        const { top: t } = this.$getOffset(this.$refs.card.$el);
        this.height = window.innerHeight - t - 40;
      }, 100);
    },
    onMouseOverLeft() {
      this.$refs.scrollWrapLeft.update();
    },
    onMouseOverRight() {
      this.$refs.scrollWrapRight.update();
    },
    // 获取tree数据
    getTreeData(cb) {
      // this.treeLoading = true;
      Api_EvaluateEstimateTree().then((res) => {
        const initArr = [];
        const notInitArr = [];
        const arr = res;
        if (arr) {
          arr.forEach((item) => {
            item.children = item.quotaList;
            // if (item.init) {
            //   initArr.push(item);
            // } else {
              notInitArr.push(item);
            // }
          });
        }
      
        // this.treeData = [
        //   {
        //     id: 1,
        //     label: "初始化指标",
        //     desc: "",
        //     root: true,
        //     init: true,
        //     level: 0,
        //     children: initArr,
        //   },
        //   {
        //     id: 2,
        //     label: "自定义指标",
        //     desc: "",
        //     root: true,
        //     init: false,
        //     level: 0,
        //     children: notInitArr,
        //   },
        // ];
        this.treeData  = notInitArr
     
        this.treeLoading = false;
        this.$nextTick(() => {
          if(this.$refs.tree){
            this.$refs.tree.setCurrentKey(this.currentNodeKey);
            cb && cb();
          }
        });
       
      });
    },
    // tree过滤搜索事件
    filterNode(value, data) {
      if (!value) return true;
      //data.label.indexOf(value) !== -1;
      var dataFilter = data.classifyName || data.kpiName
      return dataFilter.indexOf(value) !== -1;
    },
    // tree节点点击事件
    nodeClick(data) {
      if (data) {
        this.currentNodeKey = data.id;
        this.currentNode = data;
      }
      if (data.root) {
        this.viewFenleiFormData.classifyName = "";
        this.viewFenleiFormData.classifyDesc = "";
        this.viewZhibiaoFormData.kpiName = "";
        this.viewZhibiaoFormData.kpiDesc = "";
        this.viewZhibiaoFormData.kpiType = "0";
        this.viewZhibiaoFormData.kpiUnit = "";
        this.viewZhibiaoFormData.scoreList = [];
        return;
      }
      // 可能需要从接口获取数据
      if (data.isFenLei) {
        const newData = merge({}, data);
        this.viewFenleiFormData = newData;
        this.isViewFenlei = true;
      } else {
        const newData = merge({}, data);
        this.viewZhibiaoFormData = newData;
        this.isViewFenlei = false;
      }
    },
    // 新增分类
    addFenlei() {
      const data = this.$refs.tree.getCurrentNode();
      if (data) {
        // if ((data.init && data.isFenLei) || (data.init && data.level === 0)) {
        //   this.$message.warning("初始化指标下不允许新增分类");
        //   return;
        // }
        // if (data.level >= 1) {
        //   this.$message.warning("最多建立二级分类");
        //   return;
        // }
        this.isViewFenlei = null;
        this.formType = 1;
        this.$nextTick(() => {
          this.$refs.fenlei.open(true);
        });
      } else {
        this.isViewFenlei = null;
        this.formType = 1;
        this.$nextTick(() => {
          this.$refs.fenlei.open(true);
        });
       // this.$message.warning('请在"初始化指标"或"自定义指标下"新建分类');
      }
    },
    // 修改分类
    editFenLei(node, data) {
      // if (data.init) {
      //   this.$message.warning("初始化指标下不允许修改分类");
      //   return;
      // }
      this.isViewFenlei = null;
      this.formType = 1;
      this.$nextTick(() => {
        this.$refs.fenlei.open(false, data);
      });
    },
    // 新增指标
    addZhibiao() {
      
      this.viewZhibiaoFormData.elementName="";
      const data = this.$refs.tree.getCurrentNode();
      if (data) {
        // if (data.init && data.isFenLei) {
        //   this.$message.warning("初始化指标下不允许新增指标");
        //   return;
        // }
        if (data.isFenLei) {
          this.selectFenlei = data;
          this.isViewFenlei = null;
          this.formType = 2;
          this.$nextTick(() => {
            this.$refs.zhibiao.open(true);
          });
        } else if (Number(data.level) === 2) {
          const node = this.$refs.tree.getNode(data);
          this.selectFenlei = node.parent.data;
          this.isViewFenlei = null;
          this.formType = 2;
          this.$nextTick(() => {
            this.$refs.zhibiao.open(true);
          });
        } else if (Number(data.level) === 0) {
          this.$message.warning("请新建分类");
        }
      } else {
        this.$message.warning("请先选择分类");
      }
    },
    // 复制指标
    copyZhibiao(node, data) {
      // const options = this.treeData[1].children.map((item) => {
      const options = this.treeData.map((item) => {
        return {
          id: item.id,
          label: item.classifyName,
        };
      });
      this.$refs.copyZhibiao.open(options, data);
    },
    // 编辑指标
    editZhibiao(node, data) {
      // if (data.init) {
      //   this.$message.warning("初始化指标下不允许修指标");
      //   return;
      // }

      this.selectFenlei = node.parent.data;
      this.isViewFenlei = null;
      this.formType = 2;
      this.$nextTick(() => {
        this.$refs.zhibiao.open(false, data);
      });
    },


    // 删除分类或指标
    delTreeRow(node, data) {
      

    // 删除的是指标
    if(!data.isFenLei){
      // 看看指标有没有被使用
      Api_EvaluateEstimateIsUse(data.id).then((res) =>{
        let message=""
        if(!res){
          // 指标被模型使用了
          message='该指标已被评估模型使用，确定要删除吗？删除后不会对模型产生影响。'
        }else{
          message='确定要删除该指标吗？'
        }

          this.$confirm(message, '提示', {
               confirmButtonText: '确定',
              cancelButtonText: '取消',
              type: 'warning'
          }).then(() => {
                let postData = {};
                const children = node.parent.data.children;
                const index = node.parent.data.children.findIndex((i) => i.id === data.id);
                let flag = false;
                if (children.length === 1) {
                  const par = node.parent.data;
                  postData.id = par.id;
                  postData.classifyName = par.classifyName;
                  postData.classifyDesc = par.classifyDesc;
                  flag = true;
                } else {
                  if (index === children.length - 1) {
                    postData = children[index - 1];
                  } else {
                    postData = children[index + 1];
                  }
                }
                const loading = this.$openLoading();
                Api_EvaluateEstimateQuotaDelete(data.id)
                  .then((msg) => {
                    loading.close();
                    this.$message.success(msg);
                    this.$nextTick(() => {
                      this.showDetail(flag, postData, postData.id);
                      this.getTreeData();
                    });
                  })
                  .catch(() => {
                    loading.close();
                    this.$message.error("失败");
                  });
          }).catch(()=>{
              this.$message({
                type: 'info',
                message: '已取消删除'
              });
          })

      })

    }

    if (data.isFenLei) {
        this.$confirm('确定删除该指标？', '提示', {
            type: 'warning'
        }).then(() => {
          //  const children = node.parent.data.children; 
          //  const index = node.parent.data.children.findIndex((i) => i.id === data.id);
        let postData = {};
        if (data) {
          if (data.root) {
            return;
          }
          // if (data.init && data.isFenLei) {
          //   this.$message.warning("初始化指标下不允许删除分类");
          //   return;
          // } else if (data.init && !data.isFenLei) {
          //   this.$message.warning("初始化指标下不允许删除指标");
          //   return;
          // }
        
            const children = node.parent.data;
            const index = node.parent.data.findIndex((i) => i.id === data.id);
            if (data.children && data.children.length) {
              this.$alert("该二级分类下存在未删除的指标，不允许删除。", "提示");
              return;
            }
            if (children.length === 1) {
              const par = node.parent.data;
              postData.id = par.id;
              postData.classifyName = "";
              postData.classifyDesc = "";
            } else {
              if (index === children.length - 1) {
                postData = children[index - 1];
              } else {
                postData = children[index + 1];
              }
            }
            const loading = this.$openLoading();
            Api_EvaluateEstimateClassifyDelete(data.id)
              .then((result) => {
                loading.close();
                this.$message.success("删除成功");
                this.$nextTick(() => {
                  this.showDetail(true, postData, postData.id);
                  this.getTreeData();
                });
              })
              .catch(() => {
                loading.close();
                this.$message.error("删除失败");
              });
            this.$refs.tree.remove(data);
          
            // const children = node.parent.data.children;
            // const index = node.parent.data.children.findIndex((i) => i.id === data.id);
            // Api_EvaluateEstimateIsUse(data.id).then((res) => {
            //   if (!res) {
            //     this.$alert("该指标已被评估模型使用，不允许删除。", "提示");
            //   } else {
            //     let flag = false;
            //     if (children.length === 1) {
            //       const par = node.parent.data;
            //       postData.id = par.id;
            //       postData.classifyName = par.classifyName;
            //       postData.classifyDesc = par.classifyDesc;
            //       flag = true;
            //     } else {
            //       if (index === children.length - 1) {
            //         postData = children[index - 1];
            //       } else {
            //         postData = children[index + 1];
            //       }
            //     }
            //     const loading = this.$openLoading();
            //     Api_EvaluateEstimateQuotaDelete(data.id)
            //       .then((msg) => {
            //         loading.close();
            //         this.$message.success(msg);
            //         this.$nextTick(() => {
            //           this.showDetail(flag, postData, postData.id);
            //           this.getTreeData();
            //         });
            //       })
            //       .catch(() => {
            //         loading.close();
            //         this.$message.error("失败");
            //       });
            //   }
            // });
          
          }
        }).catch(()=>{
          this.$message({
            type: 'info',
            message: '已取消删除'
          });          
        })
      }
    },
    showDetail(flag, row, res) {
      this.isViewFenlei = flag;
      if (row) {
        this.currentNodeKey = res;
        if (flag) {
          this.viewFenleiFormData.classifyName = row.classifyName;
          this.viewFenleiFormData.classifyDesc = row.classifyDesc;
        } else {
          this.viewZhibiaoFormData.kpiName = row.kpiName;
          this.viewZhibiaoFormData.kpiDesc = row.kpiDesc;
          this.viewZhibiaoFormData.kpiType = row.kpiType;
          this.viewZhibiaoFormData.kpiUnit = row.kpiUnit;
          this.viewZhibiaoFormData.scoreList = row.scores;
        }
      }
    },
  },
};
</script>

<style scoped lang="scss">
.list-item + .list-item {
  margin-top: 15px;
}

/deep/ .el-card__body {
  padding: 0;
}

/deep/ .el-form .el-form-item__label {
  font-weight: bold;
}

.form-wrap,
/deep/ .form-wrap {
  // max-width: 600px;
  margin: auto;
}

.score-form-item {
  /deep/ .el-form-item__label {
    padding-top: 6px;
  }
}

.score-table {
  line-height: normal;
}
</style>
