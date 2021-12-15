<template>
  <div>
    <div class="page-header">
      <h1 class="page-name">
        <span>{{ isView ? '评估详情' : '评估执行' }}</span>
      </h1>
      <div>
        <!-- v-if="status === "0""  onClick={this.setVoid.bind(this, row)}-->
        <el-button v-if="data.status == 0 && !isView" type="primary" @click="setVoid"> 置为无效 </el-button>
        <el-button @click="back">返回</el-button>
      </div>
    </div>
    <div class="page-content">
      <el-form ref="form" :model="formData" label-width="100px">
        <el-row>
          <el-col :span="8">
            <el-form-item label="评估编码">{{ data.evalCode }}</el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="客户名称"   >
                <span class="canClick" @click="$gotoCustomerDetail(data.companyId)">{{ data.companyName }}</span></el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="评估人员">{{ name }}</el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="8">
            <el-form-item label="评估时间">{{ $dateFormat(data.evaluationDate, 'yyyy-MM-dd') }}</el-form-item>
          </el-col>
          <el-col :span="8" v-if="isView">
            <el-form-item label="信用评分">{{ data.score }}</el-form-item>
          </el-col>
          <el-col :span="8" v-if="isView">
            <el-form-item label="信用等级">{{ data.grade }}</el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24" v-if="isView">
            <el-form-item label="等级说明">{{ data.gradeDesc }}</el-form-item>
          </el-col>
        </el-row>
        <el-table
          v-loading="tableLoading"
          :data="formData.waitList"
          border
          style="width: 100%; margin-top: 20px"
        >
          <el-table-column type="index" label="序号"></el-table-column>
          <el-table-column prop="label" label="一级分类名称">
              <template slot-scope="scope">
                  <div style="padding:0 10px">
                    {{scope.row.label}}
                  </div>
              </template>
          </el-table-column>
          <el-table-column  label="一级权重">
                <template slot-scope="scope">
                  <div style="padding:0 10px">
                    {{scope.row.weight}}
                  </div>
              </template>
          </el-table-column>
          <el-table-column :label="'二级'+(isTwo?'指标':'分类')+'名称'">
            <template slot-scope="scope">
              <div v-for="(el, index) in scope.row.children" :style="{'height':el.children? el.children.length*60+'px':60+'px'}" :key="index" class="table-td-item">
                {{
                el.label }}
              </div>
            </template>
          </el-table-column>
          <el-table-column label="二级权重">
            <template slot-scope="scope">
              <div v-for="(el, index) in scope.row.children" 
                :key="index" 
                :style="{'height':el.children? el.children.length*60+'px':60+'px'}"
                :class="{'table-td-item':true,isChuBottomLine:index===scope.row.children.length-1}"
              >
                {{ el.weight }}
                <!--<el-input v-model.number="el.weight"></el-input>-->
              </div>
            </template>
          </el-table-column>
          <el-table-column v-if="!isTwo" label="三级指标名称">
         
            <template slot-scope="scope">
                 
               <template>
                  <div v-for="(el, index) in scope.row.children"  :key="index+el.label">
                      <div 
                      v-for="(elChild, indexChild) in el.children" 
                      :class="{'table-td-item':true,isChuBottomLine:indexChild===el.children.length-1&&index===scope.row.children.length-1}"
                      :key="indexChild+elChild.label">
                          {{ elChild.label }}
                      </div>
                  </div>
                </template>
            </template>


            <!-- <template slot-scope="scope">
              <template v-if="scope.row.children[scope.$index]">
                <div
                  v-for="(el, index) in scope.row.children[scope.$index].children"
                  :key="index"
                  class="table-td-item"
                >{{ el.label }}</div>
              </template>
            </template> -->

          </el-table-column>
          <el-table-column v-if="!isTwo" label="三级权重">

            <template slot-scope="scope">
             
               <template v-if="scope.row.children[scope.$index]">
                  <div v-for="(el, index) in scope.row.children"  :key="index+el.label">
                      <div v-for="(elChild, indexChild) in el.children" 
                      :class="{'table-td-item':true,isChuBottomLine:indexChild===el.children.length-1&&index===scope.row.children.length-1}"
                      :key="indexChild+elChild.label">
                          {{ elChild.weight }}
                      </div>
                  </div>
                </template>
            </template>




            <!-- <template slot-scope="scope" v-if="scope.row.children[scope.$index]">
              <div
                v-for="(el, index) in scope.row.children[scope.$index].children"
                :key="index"
                class="table-td-item"
              >
                {{ el.weight }}
               
              </div>
            </template> -->
          </el-table-column>





          <!-- <el-table-column label="指标取值">
            <template slot-scope="scope">
              <template v-if="!isView">

                <el-form-item
                  v-for="(el, index) in getRowChildren(scope)"
                  :key="index"
                  :prop="getRowProp(scope, index)"
                  :rules="getKpiWeightRules(el)"
                  class="table-td-item"
                  label-width="0"
                >
                  <template v-if="el.defaultValue">
                    <template v-if="el.kpiType === '1'">
                      <el-select v-model="el.defaultValue" disabled>
                        <el-option
                          v-for="(item, index) in el.scoreHistories"
                          :key="index"
                          :label="item.scoreStandard"
                          :value="item.scoreProportion"
                        ></el-option>
                      </el-select>
                    </template>
                    <template v-else>
                      <el-input :value="el.defaultValue==='-1'?'0':el.defaultValue" disabled></el-input>
                    </template>
                  </template>
                  <template v-else>
                    <template v-if="el.kpiType === '1'">
                      <el-select v-model="el.value">
                        <el-option
                          v-for="(item, index) in el.scoreHistories"
                          :key="index"
                          :label="item.scoreStandard"
                          :value="item.scoreProportion"
                        ></el-option>
                      </el-select>
                    </template>
                    <template v-else>
                      <el-input v-model="el.value"></el-input>
                    </template>
                  </template>
                </el-form-item>

              </template>
              <template v-else>
                <div v-for="(el, index) in scope.row.children" :key="index" class="table-td-item">
                  <div v-if="el.defaultValue">
                    <template
                      v-if="el.kpiType === '1'"
                    >{{ getScoreHistories(el.defaultValue, el.scoreHistories) }}</template>
                    <template v-else>{{ el.defaultValue==='-1'?'0':el.defaultValue }}</template>
                  </div>
                  <div v-else>
                    <template v-if="el.kpiType === '1'">{{ getScoreHistories(el.value, el.scoreHistories) }}</template>
                    <template v-else>{{ el.value }}</template>
                  </div>
                </div>
              </template>
            </template>
          </el-table-column> -->


          <el-table-column label="指标取值">
            <template slot-scope="scope">
              <template v-if="!isView">
                <!-- 若是二层则循环一次 -->
                <div v-if="isTwo">
                    <el-form-item
                      v-for="(el, index) in getRowChildren(scope)"
                      :key="index"
                      :prop="getRowProp(scope, index)"
                      :rules="getKpiWeightRules(el)"
                      class="table-td-item"
                      label-width="0"
                    >
                      <template v-if="el.defaultValue">
                        <template v-if="el.kpiType === '1'">
                          <el-select v-model="el.defaultValue" disabled>
                            <el-option
                              v-for="(item, index) in el.scoreHistories"
                              :key="index"
                              :label="item.scoreStandard"
                              :value="item.scoreProportion"
                            ></el-option>
                          </el-select>
                        </template>
                        <template v-else>
                          <el-input :value="el.defaultValue==='-1'?'0':el.defaultValue" disabled></el-input>
                        </template>
                      </template>
                      <template v-else>
                        <template v-if="el.kpiType === '1'">
                          <el-select v-model="el.value">
                            <el-option
                              v-for="(item, index) in el.scoreHistories"
                              :key="index"
                              :label="item.scoreStandard"
                              :value="item.scoreProportion"
                            ></el-option>
                          </el-select>
                        </template>
                        <template v-else>
                          <el-input v-model="el.value"></el-input>
                        </template>
                      </template>
                    </el-form-item>
                </div>
                <!-- 若是三层则循环2次 -->
                <div v-if="!isTwo">
                    <div v-for="(el, index) in scope.row.children"  :key="index+el.label">
                          <el-form-item
                          v-for="(el2, index2) in el.children"
                          :key="index2+el2.label"
                          :prop="getRowProp(scope,index, index2)"
                          :rules="getKpiWeightRules(el2)"
                          :class="{'table-td-item':true,isChuBottomLine:index2===el.children.length-1&&index===scope.row.children.length-1}"
                          label-width="0"
                        >
                          <template v-if="el2.defaultValue">
                            <template v-if="el2.kpiType === '1'">
                              <el-select v-model="el2.defaultValue" disabled>
                                <el-option
                                  v-for="(item, index) in el2.scoreHistories"
                                  :key="index"
                                  :label="item.scoreStandard"
                                  :value="item.scoreStandard"
                                ></el-option>
                              </el-select>
                            </template>
                            <template v-else>
                              <el-input :value="el2.defaultValue==='-1'?'0':el2.defaultValue" disabled></el-input>
                            </template>
                          </template>
                          <template v-else>
                            <template v-if="el2.kpiType === '1'">
                              <el-select v-model="el2.value">
                                <el-option
                                  v-for="(item, index) in el2.scoreHistories"
                                  :key="index"
                                  :label="item.scoreStandard"
                                  :value="item.scoreProportion"
                                ></el-option>
                              </el-select>
                            </template>
                            <template v-else>
                              <el-input v-model="el2.value"></el-input>
                            </template>
                          </template>
                        </el-form-item>
                    </div>
                </div>
              </template>
              <template v-else>
                <!-- 若是二层的话 -->
                <template v-if="isTwo">
                  <div v-for="(el, index) in scope.row.children" :key="index" class="table-td-item">
                    <div v-if="el.defaultValue">
                      <template
                        v-if="el.kpiType === '1'"
                      >{{ getScoreHistories(el.defaultValue, el.scoreHistories) }}</template>
                      <template v-else>{{ el.defaultValue==='-1'?'0':el.defaultValue }}</template>
                    </div>
                    <div v-else>
                      <template v-if="el.kpiType === '1'">{{ getScoreHistories(el.value, el.scoreHistories) }}</template>
                      <template v-else>{{ el.value }}</template>
                    </div>
                  </div>
                </template>


                <!-- 若是三层的话 -->
                <!-- 若是三层则循环2次 -->
                <template v-if="!isTwo">
                    <div v-for="(el, index) in scope.row.children"  :key="index+el.label">
                          <div v-for="(elChild, indexChild) in el.children"  class="table-td-item"  :key="indexChild+elChild.label">
                             
                            <div v-if="elChild.defaultValue">
                              <template
                                v-if="elChild.kpiType === '1'"
                              >{{ getScoreHistories(elChild.defaultValue, elChild.scoreHistories) }}</template>
                              <template v-else>{{ elChild.defaultValue==='-1'?'0':elChild.defaultValue }}</template>
                            </div>
                            <div v-else>
                              <template v-if="elChild.kpiType === '1'">{{ getScoreHistories(elChild.value, elChild.scoreHistories) }}</template>
                              <template v-else>{{ elChild.value }}</template>
                            </div>

                          </div>
                    </div>
                </template>


              </template>
            </template>
          
          </el-table-column>


<!--          <el-table-column label="单位" width="100" v-if="!isView">-->
<!--            <template slot-scope="scope">-->
<!--              <template v-if="isTwo">-->
<!--                <div-->
<!--                  v-for="(el, index) in scope.row.children"-->
<!--                  :key="index"-->
<!--                  class="table-td-item"-->
<!--                >{{ el.unit }}</div>-->
<!--              </template>-->
<!--              <template v-else>-->
<!--                <div v-for="(el, index) in scope.row.children" :key="index" class="table-td-item">-->
<!--                  <template v-for="(elChild) in el.children">{{ elChild.unit }}</template>-->
<!--                </div>-->
<!--              </template>-->
<!--            </template>-->
<!--          </el-table-column>-->


          <el-table-column label="单项得分" width="100" v-if="isView">
            <template slot-scope="scope">
              <template v-if="isTwo">
                <div
                  v-for="(el, index) in scope.row.children"
                  :key="index"
                  class="table-td-item"
                >{{ el.score }}</div>
              </template>
              <template v-else>
                <!-- <div v-for="(el, index) in scope.row.children" :key="index" class="table-td-item">
                  <template v-for="(elChild) in el.children">{{ elChild.score }}</template>
                </div> -->

              <div v-for="(el, index) in scope.row.children"  :key="index+el.label">
                  <div v-for="(elChild, indexChild) in el.children"  class="table-td-item"  :key="indexChild+elChild.label">
                      {{ elChild.score }}
                  </div>
              </div>



              </template>
            </template>
          </el-table-column>





          <el-table-column label="单项得分比例" width="100" v-if="isView">
            <template slot-scope="scope">
              <template v-if="isTwo">
                <div
                  v-for="(el, index) in scope.row.children"
                  :key="index"
                  class="table-td-item"
                >{{ el.scorePercent }}</div>
              </template>
              <template v-else>
                <!-- <div v-for="(el, index) in scope.row.children" :key="index" class="table-td-item">
                  <template v-for="(elChild) in el.children">{{ elChild.score }}</template>
                </div> -->

              <div v-for="(el, index) in scope.row.children"  :key="index+el.label">
                  <div v-for="(elChild, indexChild) in el.children"  class="table-td-item"  :key="indexChild+elChild.label">
                      {{ elChild.scorePercent }}
                  </div>
              </div>



              </template>
            </template>
          </el-table-column>
        </el-table>
      </el-form>
      <div v-if="!isView" style="text-align: center;margin-top: 20px;" class="size-btn-change">
        <el-button type="primary" @click="submit">提交</el-button>
        <el-button @click="save">保存</el-button>
      </div>
    </div>

    <!-- 总分计算的弹窗 -->
    <Result ref="ref_Result" :data="scoreData" :id="data.id" @goBackList="goBackList"></Result>
  </div>
</template>

<script>
import Result from "./Result";
import {
  Api_EvaluateRecordExecute,
  Api_EvaluateRecordExecuteAdd,
  Api_setVoid,
  Api_EvaluateRecordExecuteScore
} from "@/api/creditManagement/creditEstimate/record";
import Dialog from "../../../../components/Dialog/index";

export default {
  name: "Do",
  components: { Dialog, Result },
  props: {
    isView: Boolean,
    data: Object, // 当前当数据
  },
  data() {
    return {
      formData: {
        waitList: [],
      },
      name:'',
      isTwo: true,
      tableLoading: false,
      scoreData: {},
      isSave: false
    };
  },
  created() {
    if (this.data && this.data.id) {
      this.tableLoading = true;

        Api_EvaluateRecordExecute(this.data.id, { companyId: this.data.companyId })
        .then((res) => {
        
          this.name=res.creditName;
          const level1Arr = res.waitList.filter((item) => !item.pid);
          const level2Arr = res.waitList.filter((item) => item.pid);
          
          if (level1Arr.length && level2Arr.length) {
            // 三层
            this.isTwo = false;
            level1Arr.forEach((item) => {
              item.label = item.modelClassifyName;
              item.isFenLei = true;
              item.children = [];
            });
            level2Arr.forEach((itemLevel2) => {
              const { pid } = itemLevel2;
              level1Arr.forEach((itemLevel1) => {
                if (itemLevel1.id === pid) {
                  const children2 = itemLevel2.kpiWait.map(
                    ({ id, kpiName, kpiUnit, weight, kpiRecord, ...rest }) => {
                      return {
                        id,
                        label: kpiName,
                        value: kpiRecord ? kpiRecord.kpiValue : "",
                        unit: kpiUnit,
                        score:kpiRecord ? kpiRecord.score : "",
                        scorePercent:kpiRecord ? kpiRecord.scorePercent : "",
                        kpiRecordId: kpiRecord ? kpiRecord.id : "",
                        weight,
                        ...rest,
                      };
                    }
                  );
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
            this.formData.waitList = level1Arr;

    
      
          } else {
            // 二层
            this.isTwo = true;
            this.formData.waitList = res.waitList.map((item1) => {
              const children = item1.kpiWait.map(({ id, kpiName, weight, kpiUnit, kpiRecord, ...rest }) => {
                return {
                  id,
                  weight: weight,
                  value: kpiRecord ? kpiRecord.kpiValue : "",
                  unit: kpiUnit,
                  kpiRecordId: kpiRecord ? kpiRecord.id : "",
                  scorePercent:kpiRecord ? kpiRecord.scorePercent : "",
                  score:kpiRecord ? kpiRecord.score : "",
                  label: kpiName,
                  ...rest,
                };
              });
              return {
                id: item1.id,
                label: item1.modelClassifyName,
                isFenLei: true,
                weight: item1.weight,
                children,
              };
            });
          }
          this.tableLoading = false;
        })
        .catch(() => {
          this.tableLoading = false;
        });
    }



  },
  methods: {
    setVoid() {
      const loading = this.$openLoading();
        this.$confirm("确定置为无效吗？", "提示", {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: "warning",
        })  .then(() => {
            Api_setVoid(this.data.id)
                .then((msg) => {
                    this.$message.success(msg);
                    loading.close();
                    this.$emit("edit", false);
                })
                .catch((e) => {
                    loading.close();
                    this.$message.error(e);
                });
        }).catch(() => {
           loading.close();
          this.$message({
            type: 'info',
            message: '已取消置为无效'
          });          
        });;
    },
    goBackList(){
      this.$emit("edit", false);
    },
    back() {
      if (this.isView) {
        this.$emit("edit", false);
      } else {
        this.$confirm("您存在尚未保存信息，需要保存后退出吗？", "提示", {
          type: "warning",
        })
          .then(() => {
            this.save();
            this.$emit("edit", false);
          })
          .catch(() => {
            this.$emit("edit", false);
          });
      }
    },
    getRowChildren(scope) {
      if (this.isTwo) {
        return scope.row.children;
      } else {
        return scope.row.children[scope.$index].children;
      }
    },

   getRowProp(scope,index, index2) {

      if (this.isTwo) {

        return "waitList." + scope.$index + ".children." + index + ".value";
      } else {
        return "waitList." + scope.$index + ".children." + index + ".children." + index2 + ".value";
      }
    },




    // getRowProp(scope, index) {

    //   if (this.isTwo) {

    //     return "waitList." + scope.$index + ".children." + index + ".value";
    //   } else {

    //     return "waitList." + scope.$index + ".children." + scope.$index + ".children." + index + ".value";
    //   }
    // },





    getScoreHistories(value, options) {
      if (value == '是' || value == '否' || value == '有' || value == '无') {
          return value
      }else{
        const findRes = options.find((i) => i.scoreProportion === value);
        return findRes ? findRes.scoreStandard : "";
      }
    },
    // 提交
    submit() {
      if (!this.formData.waitList.length) {
        return;
      }

      this.isSave = false;

      this.$refs.form.validate((valid) => {
        if (valid) {
          this.handleSure(1);
        }
      });
    },
    save() {
      if (!this.formData.waitList.length) {
        return;
      }

      this.isSave = true;

      this.$refs.form.validate((valid) => {
        // if (valid) {
          this.handleSure(0);
        // }
      });
    },
    handleSure(status) {
      const mapArr = [];
      let flag = true;
      // 处理当前数据格式
      if (this.isTwo) {

        this.formData.waitList.forEach((item) => {
          item.children.forEach((item) => {
            if (!String(item.value) && !String(item.defaultValue)) {
              flag = false;
            }


            // 对item的defaultValue进行处理
            if (item.defaultValue == '是' || item.defaultValue == '否' || item.defaultValue == '有' || item.defaultValue == '无') {
              // 找到scoreHistories中对应的分数
              if(item.scoreHistories.length>0){
                  item.scoreHistories.forEach(child=>{
                    if(child.scoreStandard==item.defaultValue){
                        // 改写defaultValue  变成数值
                        item.defaultValue=child.scoreProportion
                    }
                  })
              }
            }

            mapArr.push({
              id: item.id,
              value: item.defaultValue ? Number(item.defaultValue) : item.value,
              unit: item.unit || "",
            });
          });
        });
      } else {
        // console.log(this.formData.waitList,'啦啦啦啦9999')

        let copyFormData=JSON.parse(JSON.stringify(this.formData.waitList))
        // return
        copyFormData.forEach((item) => {
        
          item.children.forEach((item) => {

            item.children.forEach((item) => {

              if (!String(item.value) && !String(item.defaultValue)) {
                flag = false;
              }

               // 对item的defaultValue进行处理
               if (item.defaultValue == '是' || item.defaultValue == '否' || item.defaultValue == '有' || item.defaultValue == '无') {
                  // 找到scoreHistories中对应的分数
                  if(item.scoreHistories.length>0){
                     item.scoreHistories.forEach(child=>{
                        if(child.scoreStandard==item.defaultValue){
                            // 改写defaultValue  变成数值
                            item.defaultValue=child.scoreProportion
                        }
                     })
                  }
               }

              mapArr.push({
                id: item.id,
                value: item.defaultValue ? Number(item.defaultValue) : item.value,
                unit: item.unit || "",
              });
            });
          });
        });
      }

      if (!flag) {
        this.$message.warning("指标取值必填");
        return;
      }
      const loading = this.$openLoading();
      Api_EvaluateRecordExecuteAdd(this.data.id, status, mapArr)
        .then((res) => {
          if (status === 0) {
            loading.close();
            this.$emit("edit", false);
            this.$message.success("保存成功");
          }else{
                // 根据接口拿到总分
                Api_EvaluateRecordExecuteScore(this.data.id).then( res => {
                    this.scoreData = res

                    this.$refs.ref_Result.open()

                    loading.close();
                }).catch((e) => {
                    loading.close();
                    this.$message.error(e);
                });
            }
        })
        .catch((e) => {
          loading.close();
          this.$message.error(e);
        });
    },
    getKpiWeightRules(el) {
      if (el.defaultValue) {
        return [];
      } else if (el.kpiType === "1") {
        return [{ required: true, message: "请选择指标取值" }];
      } else {
        return [
          { required: true, message: "指标取值必填" },
          { pattern: /^(0|[1-9]\d{0,8})$|\d{1,9}\.\d{1,2}$/, message: "请输入不超过两位小数的数字" },
        ];
      }
    },
  },
};
</script>

<style scoped lang="scss">
.el-table {
  .el-form-item {
    margin-bottom: 0;
  }
}


/deep/ .el-form-item__content {
  color: #666666;
}

.table-td-item {
  // margin-left: -10px;
  // margin-right: -10px;
  margin-left: 0px!important;
  margin-right: 0px!important;
  padding: 10px;
  height: 60px;
  display: flex;
  align-items: center;

  & + & {
    border-top: 1px solid #ebeef5;
  }

  &:first-child {
    padding-top: 2px;
  }

  &:last-child {
    padding-bottom: 2px;
  }
}
// .isChuBottomLine{
//   border-bottom: none!important;
// }
/deep/ .el-table {
  overflow: initial;

  .el-table__body-wrapper {
    overflow: initial;
  }

  .cell {
    overflow: initial;
    padding:0
  }

  .icon-info-circle {
    margin-right: 0;
  }

  td{
    padding:0;
  }
}

/deep/ .el-input {
  width: 100% !important;
}

/deep/ .el-form-item__content {
  width: 100%;
  margin-left: 0!important;
}

/deep/ .el-select {
  width: 100%;
}


/deep/  .cell .table-td-item:last-child {
    border-bottom: 1px solid #ebeef5;
}
</style>
