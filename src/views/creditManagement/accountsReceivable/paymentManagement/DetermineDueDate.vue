<template>
    <Dialog ref="drawer" title="到期日计算方式" :visible.sync="visible" :btns="drawerBtns" width="600px" :close="closeDialog">
        <el-form
            ref="form"
            :model="type==='2'?formN:type==='3'?formM:type==='4'?formG:formE"
            :label-width="type==='4'?'90px':'120px'"
        >
            <el-form-item label="确定方式">
                <el-select v-model="type" placeholder="请选择确定方式">
                    <el-option label="交易日" value="1"></el-option>
                    <el-option label="N天后" value="2"></el-option>
                    <el-option label="月结" value="3"></el-option>
                    <el-option label="固定日" value="4"></el-option>
                </el-select>
            </el-form-item>
            <div v-if="type==='2'">
                <el-form-item
                    label="月数"
                    prop="month"
                    :rules="[{required:true,message:'请输入月数'},{type:'integer',min:0,max:36,message:'请输入0或小于等于36的正整数'}]"
                >
                    <el-input v-model.number="formN.month" placeholder="请输入月数"></el-input>
                </el-form-item>
                <el-form-item
                    label="天数"
                    prop="day"
                    :rules="[{required:true,message:'请输入天数'},{type:'integer',min:0,max:31,message:'请输入0或小于等于31的正整数' }]"
                >
                    <el-input v-model.number="formN.day" placeholder="请输入天数"></el-input>
                </el-form-item>
                <el-form-item label="是否月底" prop="endMonth" :rules="$createRules({msg:'是否月底',required:true})">
                    <el-radio-group v-model="formN.endMonth">
                        <el-radio :label="1">是</el-radio>
                        <el-radio :label="0">否</el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item
                    label="距离月底天数"
                    prop="endToMonth"
                    :rules="formN.endMonth===1?[{required:true,message:'请输入距离月底天数'},{type:'integer',min:0,max:10,message:'请输入0或小于等于10的正整数'}]:[]"
                >
                    <el-input v-model.number="formN.endToMonth" placeholder="请输入距离月底天数"></el-input>
                </el-form-item>
            </div>
            <div v-if="type==='3'">
                <el-form-item
                    label="账单结算日"
                    prop="settlementDay"
                    :rules="[{required:true,message:'请输入账单结算日'},{type:'integer',min:1,max:31,message:'请输入大于等于1小于等于31的正整数'}]"
                >
                    <el-input v-model.number="formM.settlementDay" placeholder="请输入账单结算日"></el-input>
                </el-form-item>
                <el-form-item
                    label="月数"
                    prop="month"
                    :rules="[{required:true,message:'请输入月数'},{type:'integer',min:0,max:36,message:'请输入0或小于等于36的正整数'}]"
                >
                    <el-input v-model.number="formM.month" placeholder="请输入月数"></el-input>
                </el-form-item>
                <el-form-item
                    label="天数"
                    prop="day"
                    :rules="[{required:true,message:'请输入天数'},{type:'integer',min:0,max:31,message:'请输入0或小于等于31的正整数' }]"
                >
                    <el-input v-model.number="formM.day" placeholder="请输入天数"></el-input>
                </el-form-item>
                <el-form-item label="是否月底" prop="endMonth" :rules="$createRules({msg:'是否月底',required:true})">
                    <el-radio-group v-model="formM.endMonth">
                        <el-radio :label="1">是</el-radio>
                        <el-radio :label="0">否</el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item
                    label="距离月底天数"
                    prop="endToMonth"
                    :rules="formM.endMonth===1?[{required:true,message:'请输入距离月底天数'},{type:'integer',min:0,max:10,message:'请输入0或小于等于10的正整数'}]:[]"
                >
                    <el-input v-model.number="formM.endToMonth" placeholder="请输入距离月底天数"></el-input>
                </el-form-item>
            </div>
            <div v-if="type==='4'">
                <el-form-item
                    label="月数"
                    prop="month"
                    :rules="[{required:true,message:'请输入月数'},{type:'integer',min:0,max:36,message:'请输入0或小于等于36的正整数'}]"
                >
                    <el-input v-model.number="formG.month" placeholder="请输入月数"></el-input>
                </el-form-item>
                <el-form-item
                    label="天数"
                    prop="day"
                    :rules="[{required:true,message:'请输入天数'},{type:'integer',min:0,max:31,message:'请输入0或小于等于31的正整数' }]"
                >
                    <el-input v-model.number="formG.day" placeholder="请输入天数"></el-input>
                </el-form-item>
                <el-form-item label="匹配方式" prop="matchType">
                    <el-radio-group v-model="formG.matchType" @change="matchTypeChange">
                        <el-radio label="1">向后匹配</el-radio>
                        <el-radio label="2">按区间匹配</el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-row v-for="(item, index) in formG.fixedDays" :key="index">
                    <el-col :span="formG.matchType==='1'?24:11">
                        <el-form-item
                            :label="'固定日'+(index+1)"
                            :prop="'fixedDays.'+index+'.day'"
                            :rules="[{required:true,message:'请输入天数'},{type:'integer',min:1,max:31,message:'请输入大于等于1小于等于31的正整数'},{validator:notEuql()}]"
                        >
                            <el-input v-model.number="item.day" placeholder="请输入日期"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="7" v-if="formG.matchType==='2'">
                        <el-form-item
                            label="区间"
                            label-width="60px"
                            :prop="'fixedDays.'+index+'.startDay'"
                            :rules="formG.matchType==='2'?[{required:true,message:'请输入区间'},{type:'integer',min:1,max:31,message:'请输入大于等于1小于等于31的正整数'}]:[]"
                        >
                            <el-input placeholder="日期" v-model.number="item.startDay"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="6" v-if="formG.matchType==='2'">
                        <el-form-item
                            label="-"
                            label-width="30px"
                            :prop="'fixedDays.'+index+'.endDay'"
                            :rules="formG.matchType==='2'?[{required:true,message:'请输入区间'},{type:'integer',min:1,max:31,message:'请输入大于等于1小于等于31的正整数'},{validator:ccValue(item.startDay,item.endDay)}]:[]"
                        >
                            <el-input placeholder="日期" v-model.number="item.endDay"></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
            </div>
        </el-form>
    </Dialog>
</template>

<script>
import {merge} from "lodash";

export default {
    name: "DetermineDueDate",
    data() {
        return {
            visible: false,
            rowIndex: "",
            oldConditions: {},
            type: "1",
            formN: {
                month: "",
                day: "",
                endMonth: 0,
                endToMonth: ""
            },
            formM: {
                settlementDay: "",
                month: "",
                day: "",
                endMonth: 0,
                endToMonth: ""
            },
            formG: {
                month: "",
                day: "",
                matchType: "1",
                fixedDays: [
                    { day: "", startDay: "", endDay: "" },
                    { day: "", startDay: "", endDay: "" },
                    { day: "", startDay: "", endDay: "" }
                ]
            },
            formE: {},
            drawerBtns: [
                {
                    text: "确定",
                    type: "primary",
                    click: () => {
                        this.$refs["form"].validate(valid => {
                            if (valid) {
                                this.$emit(
                                    "getPaymentConditions",
                                    this.type,
                                    this.type === "2"
                                        ? this.formN
                                        : this.type === "3"
                                        ? this.formM
                                        : this.type === "4"
                                        ? this.formG
                                        : this.formE,
                                    this.rowIndex
                                );
                                this.visible = false;
                            }
                        });
                    }
                },
                {
                    text: "返回",
                    click: () => {
                        this.visible = false;
                    }
                }
            ]
        };
    },
    methods: {
        open(_row, _index, _type, _conditions) {
            console.log(_row, _index, _type, _conditions);
            // empty forms BEGIN
            this.type = "1";
            this.formN = {
                month: "",
                day: "",
                endMonth: 0,
                endToMonth: ""
            };
            this.formM = {
                settlementDay: "",
                month: "",
                day: "",
                endMonth: 0,
                endToMonth: ""
            };
            this.formG = {
                month: "",
                day: "",
                matchType: "1",
                fixedDays: [
                    { day: "", startDay: "", endDay: "" },
                    { day: "", startDay: "", endDay: "" },
                    { day: "", startDay: "", endDay: "" }
                ]
            };
            this.formE = {};
            this.oldConditions = {};
            // empty forms END
            this.rowIndex = _index;
            this.type = _type;
            this.oldConditions = merge({}, _conditions);
            delete this.oldConditions.type;
            if (this.type === "2") {
                this.formN = this.oldConditions;
            } else if (this.type === "3") {
                this.formM = this.oldConditions;
            } else if (this.type === "4") {
                this.formG = this.oldConditions;
            }
            this.visible = true;
        },
        closeDialog() {
            this.visible = false;
        },
        matchTypeChange() {
            if (this.formG.matchType === "1") {
                for (let i = 0; i < this.formG.length; i++) {
                    this.formG[i].startDay = "";
                    this.formG[i].endDay = "";
                }
            }
        },
        ccValue(min, max) {
            return (rule, value, callback) => {
                if (Number(min) > Number(max)) {
                    callback(new Error("区间需从小至大"));
                    return;
                }
                callback();
            };
        },
        notEuql() {
            return (rule, value, callback) => {
                if (
                    Number(this.formG.fixedDays[0].day) &&
                    Number(this.formG.fixedDays[1].day) &&
                    Number(this.formG.fixedDays[2].day) &&
                    (Number(this.formG.fixedDays[0].day) === Number(this.formG.fixedDays[1].day) ||
                        Number(this.formG.fixedDays[0].day) === Number(this.formG.fixedDays[2].day) ||
                        Number(this.formG.fixedDays[2].day) === Number(this.formG.fixedDays[1].day))
                ) {
                    callback(new Error("固定日不能相同"));
                    return;
                }
                callback();
            };
        }
    }
};
</script>

<style>
</style>
