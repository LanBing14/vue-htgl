<template>
    <div>
        <div class="page-header">
            <h1 class="page-name">
                <span>模型详情</span>
            </h1>
            <div>
                <el-button size="small" @click="back">返回</el-button>
            </div>
        </div>
        <div class="page-content">
            <!--<ul class="flex steps" style="width: 75%; margin: 50px auto 50px">
                <li class="flex flex-primary v-center">
                    <div>
                        <img src="~@/assets/images/creditManagement/step1.png" alt />
                    </div>
                    <div class="flex-primary">
                        新建模型&nbsp;&nbsp;
                        <img src="~@/assets/images/creditManagement/jiantou.png" alt />
                    </div>
                </li>
                <li class="flex flex-primary v-center">
                    <div>
                        <img v-if="active<1" src="~@/assets/images/creditManagement/step2-yet.png" alt />
                        <img v-else src="~@/assets/images/creditManagement/step2.png" alt />
                    </div>
                    <div class="flex-primary">
                        选择指标&nbsp;&nbsp;
                        <img src="~@/assets/images/creditManagement/jiantou.png" alt />
                    </div>
                </li>
                <li class="flex flex-primary v-center">
                    <div>
                        <img v-if="active<2" src="~@/assets/images/creditManagement/step3-yet.png" alt />
                        <img v-else src="~@/assets/images/creditManagement/step3.png" alt />
                    </div>
                    <div class="flex-primary">
                        设定分值&nbsp;&nbsp;
                        <img src="~@/assets/images/creditManagement/jiantou.png" alt />
                    </div>
                </li>
                <li class="flex v-center">
                    <div>
                        <img v-if="active<3" src="~@/assets/images/creditManagement/step4-yet.png" alt />
                        <img v-else src="~@/assets/images/creditManagement/step4.png" alt />
                    </div>
                    <div class="flex-primary">设定等级</div>
                </li>
            </ul>-->
            <el-form ref="form" :model="formData" label-width="7em" class="form">
                <el-form-item label="模型名称">{{ formData.modelName }}</el-form-item>
                <el-form-item label="模型描述">{{ formData.modelDesc || '-' }}</el-form-item>
                <el-form-item label="模型层级">{{ formData.modelLevel === '0' ? '两层' : '三层' }}</el-form-item>
            </el-form>
            <el-tabs value="1" type="border-card">
                <el-tab-pane label="指标分值" name="1">
                    <StepDetail3
                        ref="step2"
                        :modelStatus="modelStatus"
                        :rowId="rowId"
                        :isTwo="isTwo"
                        :data="step1Data"
                    ></StepDetail3>
                </el-tab-pane>
                <el-tab-pane label="等级设定" name="2">
                    <StepDetail4 ref="step3" :modelStatus="modelStatus" :rowId="rowId"></StepDetail4>
                </el-tab-pane>
            </el-tabs>
            <!-- <div style="margin-top: 40px;">
                 &lt;!&ndash;                <keep-alive>&ndash;&gt;
                 <StepDetail1
                     ref="step0"
                     v-if="active===0"
                     :modelStatus="modelStatus"
                     :rowId="rowId"
                     @addNewId="addNewId"
                     @levelChange="onLevelChange"
                 ></StepDetail1>
                 <StepDetail2 ref="step1" v-else-if="active===1" :modelStatus="modelStatus" :rowId="rowId" :isTwo="isTwo"></StepDetail2>
                 <StepDetail3
                     ref="step2"
                     v-else-if="active===2"
                     :modelStatus="modelStatus"
                     :rowId="rowId"
                     :isTwo="isTwo"
                     :data="step1Data"
                 ></StepDetail3>
                 <StepDetail4 ref="step3" v-else-if="active===3" :modelStatus="modelStatus" :rowId="rowId"></StepDetail4>
                 &lt;!&ndash;                </keep-alive>&ndash;&gt;
             </div>
             <div class="btns">
                 <el-button v-if="active>0" type="info" @click="prev" class="btn-prev">上一步</el-button>
                 <el-button v-if="active<3" :loading="btnNextLoading" type="primary" @click="next" class="btn-next">下一步</el-button>
             </div>-->
        </div>
    </div>
</template>

<script>
    import StepDetail1 from "./components/StepDetail1";
    import StepDetail2 from "./components/StepDetail2";
    import StepDetail3 from "./components/StepDetail3";
    import StepDetail4 from "./components/StepDetail4";
    import {Api_EvaluateModelFirstGet} from "@/api/creditManagement/creditEstimate/model";

    export default {
        name: "Detail",
        components: {
            StepDetail1,
            StepDetail2,
            StepDetail3,
            StepDetail4
        },
        props: {
            modelStatus: Boolean,
            selectData: {
                type: Object,
                default: () => ({})
            }
        },
        data() {
            // const createRules = this.$createRules;
            return {
                visible: false,
                active: 0,
                isTwo: true, // 模型层级，true：两层，false：三层
                step0Data: undefined,
                step1Data: undefined,
                step2Data: undefined,
                step3Data: undefined,
                btnNextLoading: false, // 下一步按钮loading
                rowId: this.selectData.id, // 模型id
                formData: {
                    modelName: '',
                    modelDesc: '',
                    modelLevel: ''
                }
            };
        },
        mounted() {
            Api_EvaluateModelFirstGet(this.rowId).then(res => {
                this.formData.modelName = res.modelName;
                this.formData.modelDesc = res.modelDesc;
                this.formData.modelLevel = res.modelLevel;
                if (res.modelLevel === '0') {
                    this.isTwo = true
                } else {
                    this.isTwo = false
                }
            }).catch(res => {
                this.$message.error(res)
            });
        },
        methods: {
            back() {
                this.$emit("edit", false);
            }
            // next() {
            //     const validateResult = this.$refs["step" + this.active].validate;
            //     this.btnNextLoading = true;
            //     validateResult()
            //         .then(data => {
            //             this["step" + this.active + "Data"] = data;
            //             this.active++;
            //             this.btnNextLoading = false;
            //         })
            //         .catch(() => {
            //             this.btnNextLoading = false;
            //         });
            // },
            // prev() {
            //     this.active--;
            // },
            // onLevelChange(flag) {
            //     this.isTwo = flag;
            // },
            // 初始第一步新增模型成功时返回的id
            // addNewId(id) {
            //     this.rowId = id;
            // }
        }
    }
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
</style>
