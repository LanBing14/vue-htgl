<template>
  <div>
    <el-form ref="form" :model="formData">
      <!-- <el-form-item prop="score">
                <el-input v-model="formData.score" placeholder="请输入模型满分分值" style="width: auto;"></el-input>
      </el-form-item>-->
      <el-form-item>
        <el-table  :data="formData.tableData" border stripe style="width: 100%; margin-top: 20px">
          <el-table-column type="index" label="序号" width="50"></el-table-column>
          <el-table-column label="一级分类名称">
                 <template slot-scope="scope">
                      <div style="padding:0 10px">
                        {{scope.row.label}}
                      </div>
                 </template>
          </el-table-column>
          <el-table-column label="一级权重">
            <template slot-scope="scope">
         
                <el-form-item
                  style="padding:0 10px"
                  :prop="'tableData.'+scope.$index+'.weight'"
                  :rules="[{required: true,message: '权重必填'},{type: 'number',min: 0,max:100,message: '请输入0-100之间的数字'}]"
                >
                  <el-input v-model.number="scope.row.weight"></el-input>
                </el-form-item>
              
            </template>
          </el-table-column>




          <el-table-column :label="'二级'+(isTwo?'指标':'分类')+'名称'">
            <template slot-scope="scope">
   
                 <div v-for="(el, index) in scope.row.children"   class="table-td-item" :style="{'height':el.children? el.children.length*60+'px':60+'px'}" :key="index" >{{ el.label }}</div>
            </template>
          </el-table-column>





          <el-table-column label="二级权重">
            <template slot-scope="scope">
    
                  <el-form-item
                    v-for="(el, index) in scope.row.children"
                    :key="index"
                    :style="{'height':el.children? el.children.length*60+'px':60+'px'}"
                    :prop="'tableData.'+scope.$index+'.children.'+index+'.weight'"
                    :rules="[{required: true,message: '权重必填'},{type: 'number',min: 0,max:100,message: '请输入0-100之间的数字'}]"
                    class="table-td-item"
                  >
                    <el-input v-model.number="el.weight"></el-input>
                
                </el-form-item>
          
            </template>
          </el-table-column>
          <el-table-column v-if="!isTwo" label="三级指标名称">
            <template slot-scope="scope">
              <div v-for="(el, index) in scope.row.children" :key="index+el.label">
                <div
                  class="table-td-item"
                  v-for="(elChild, indexChild) in el.children"
                  :key="index+''+indexChild"
                >{{ elChild.label }}</div>
              </div>
            </template>
          </el-table-column>
          <el-table-column v-if="!isTwo" label="三级权重">
            <template slot-scope="scope">
            
                  <div v-for="(el, index) in scope.row.children" :key="index">
                      <el-form-item
                        v-for="(elChild, indexChild) in el.children"
                        :key="indexChild"
                        :prop="'tableData.'+scope.$index+'.children.'+ index + '.children.' + indexChild +'.weight'"
                        :rules="[{required: true,message: '权重必填'},{type: 'number',min: 0,max:100,message: '请输入0-100之间的数字'}]"
                        class="table-td-item"
                      >
                        <el-input v-model.number="elChild.weight"></el-input>
                      </el-form-item>
                  </div>
            </template>
          </el-table-column>
        </el-table>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import { merge } from "lodash";
import {
  Api_EvaluateModelThird,
  Api_EvaluateModelThirdGet,
} from "@/api/creditManagement/creditEstimate/model";

export default {
  name: "Step3",
  props: {
    rowId: String, // 当前记录id
    isTwo: Boolean, // 两层或三层
    // data: Array, // 从step2得到的基础数据
    defaultData: Object, // 默认数据，当前步骤返回上一层时有可能作了保存数据的操作，由此重新获得上一次保存的值
  },
  data() {
    const createRules = this.$createRules;
    const data = merge([], this.defaultData ? this.defaultData.waitList : []);
    return {
      formData: {
        // score: this.defaultData ? this.defaultData.score : '',
        tableData: data,
      }
      // formRules: {
      //     score: createRules({
      //         msg: '模型满分分值',
      //         cipint1: true,
      //         required: true
      //     })
      // }
      // tableData: data
    };
  },
  watch: {
    data(val) {
      this.formData.tableData = val;
    },
  },
  created() {
    if (this.rowId) {
      Api_EvaluateModelThirdGet(this.rowId).then((res) => {
        // this.formData.score = res.fullScore;
        // this.isTwo = res.modelLevel==0?true: false
        if (this.isTwo) {
          this.formData.tableData = res.waitList.map((item1) => {
            const children = item1.kpiWait.map(({ id, kpiName, weight }) => {
              return { id, weight: weight, label: kpiName };
            });
            return {
              id: item1.id,
              label: item1.modelClassifyName,
              isFenLei: true,
              weight: item1.weight,
              children,
            };
          });
        } else {

           



          const level1Arr = res.waitList.filter((item) => !item.pid);
          const level2Arr = res.waitList.filter((item) => item.pid);
          level1Arr.forEach((item) => {
            item.label = item.modelClassifyName;
            item.isFenLei = true;
            item.children = [];
          });
          level2Arr.forEach((itemLevel2) => {
            const { pid } = itemLevel2;
            level1Arr.forEach((itemLevel1) => {
              if (itemLevel1.id === pid) {
                const children2 = itemLevel2.kpiWait.map(({ id, kpiName, weight }) => {
                  return { id, label: kpiName, weight };
                });
                itemLevel1.children.push({
                  id: itemLevel2.id,
                  label: itemLevel2.modelClassifyName,
                  isFenLei: true,
                  weight: itemLevel2.weight,
                  children: children2,
                });
              }
            });
          });
          this.formData.tableData = level1Arr;

        }
      });
    }
  },
  methods: {





    // 只获取数据，不作验证
    getData() {
      return {
        // score: this.formData.score,
        waitList: this.formData.tableData,
      };
    },
    validate() {
      return new Promise((resolve, reject) => {
        this.$refs.form.validate((valid) => {
          if (valid) {
            let flag = false;
            let flagTotal2 = true;
            var flagTotal3 = true;
            let scaleTotal1 = 0;
           




          let arr2=[];//二级权重数组
          let arr3=[];//三级权重数组


         
           try{
            this.formData.tableData.forEach(child=>{
              
              scaleTotal1 += child.weight;
              
              if(child.children){
                  let scaleTotal2 = 0;
                  // 循环children
                  for(let i=0;i<child.children.length;i++){
                    let every=child.children[i];

                    scaleTotal2+=every.weight;


                      if (!this.isTwo) {

                         let scaleTotal3=0;
                         
                          if(every.children){
                            every.children.forEach(everyChild=>{
                              scaleTotal3+=everyChild.weight
                            })
                          }

                         arr3.push(scaleTotal3)
                      }

                  }

                arr2.push(scaleTotal2)
              }

            })
           }catch(err){
             console.log(err)
           }
          

  

             




            // this.formData.tableData.forEach((item1) => {
            //   scaleTotal1 += item1.weight;
              // if (item1.children) {
              //   var scaleTotal3 = 0;
              //   item1.children.forEach((item2) => {
              //     // scaleTotal2 += item2.weight;
              //     if (this.isTwo) {
              //       if (!String(item2.weight)) {
              //         flag = true;
              //       }
              //     } else {
              //         item2.children.forEach((item3) => {
              //           // scaleTotal3 += item3.weight;
              //           if (!String(item3.weight)) {
              //             flag = true;
              //           }
              //           if (scaleTotal3 != 100) {
              //             flagTotal3 = false;
              //           }else {
              //             flagTotal3 = true
              //           }
              //         });
               
              //     }


              //     if (scaleTotal2 !== 100) {
              //       // 当前二级分类的总权重大于100
              //       flagTotal2 = false;
              //     } else {
              //       flagTotal2 = true;
              //     }

              //   });
              // }
            // });



            if (scaleTotal1 !== 100) {
              this.$message.warning("一级权重总和必须为100%");
              reject();
              return;
            }

          
            let er=arr2.every(child=>{
               return child==100
            })

            if (!er) {
              this.$message.warning("每个一级下的二级权重总和必须为100%");
              reject();
              return;
            }
            
            let san=arr3.every(child=>{
               return child==100
            })

             
            if (!san && !this.isTwo) {
              this.$message.warning("每个二级下的三级权重总和必须为100%");
              reject();
              return;
            }
            // if (!flagTotal2) {
            //   this.$message.warning("每个二级权重总和必须为100%");
            //   reject();
            //   return;
            // }
            // if (!this.isTwo && !flagTotal3) {
            //   this.$message.warning("每个三级权重总和必须为100%");
            //   reject();
            //   return;
            // }
            // if (flag) {
            //   this.$message.warning("请填写所有" + (this.isTwo ? "二" : "三") + "级权重");
            //   reject();
            //   return;
            // }














            const pastData = {
              // score: this.formData.score
            };
            if (this.isTwo) {
              pastData.weightOneVoList = this.formData.tableData.map((item) => {
                const weightTwoVoList = item.children.map((item) => {
                  return { kpiId: item.id, weight: item.weight };
                });
                return { classifyId: item.id, weight: item.weight, weightTwoVoList };
              });
            } else {
              pastData.weightOneVoList = this.formData.tableData.map((item) => {
                const weightThreeVoVoList = item.children.map((item) => {
                  const weightTwoVoList = item.children.map((item) => {
                    return { kpiId: item.id, weight: item.weight };
                  });
                  return { classifyId: item.id, weight: item.weight, weightTwoVoList };
                });
                return { classifyId: item.id, weight: item.weight, weightThreeVoVoList };
              });
            }
            Api_EvaluateModelThird(this.rowId, pastData)
              .then((res) => {
                resolve(pastData);
              })
              .catch((e) => {
                console.log(e);
                this.$message.error(e);
                reject(e);
              });
          } else {
            reject();
          }
        });
      });
    },
    objectSpanMethod({ row, column, rowIndex, columnIndex }) {
      if (columnIndex === 1) {
        if (row.rowspan1) {
          return { rowspan: row.rowspan1, colspan: 1 };
        } else {
          return { rowspan: 0, colspan: 0 };
        }
      }
      if (columnIndex === 3) {
        if (row.rowspan2) {
          return { rowspan: row.rowspan2, colspan: 1 };
        } else {
          return { rowspan: 0, colspan: 0 };
        }
      }
    },
    editChange() {
      if (this.formData.tableData.length) {
        return true;
      } else {
        return false;
      }
    },
    clearData() {
      this.$refs.form.resetFields();
      this.formData.tableData = [];
    },
  },
};
</script>

<style scoped lang="scss">
.table-td-item {
  // margin-left: -10px;
  // margin-right: -10px;
  margin-left: 0px!important;
  margin-right: 0px!important;
  padding: 10px;
  height: 60px;
  display: flex;
  align-items: center;

  &:first-child {
    // padding-top: 2px;
  }

  &:last-child {
    // padding-bottom: 2px;
  }
}
/deep/ .el-table {
  overflow: initial;
  .el-table__body-wrapper {
    overflow: initial;
  }
  .cell {
    overflow: initial;
    padding:0
  }
  td{
    padding:0;
  }
}

.table-td-item + .table-td-item {
    border-top: 1px solid #ebeef5;
}
.cell .table-td-item:last-child{
   border-bottom: 1px solid #ebeef5;
}
</style>
