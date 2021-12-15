<template>
    <div id="visitor_registration"> 
        <el-container style="background-color:#fff;">
            <el-header>
                <FxbHeader @reload="reload"/>
            </el-header>
            <div class="add-repair" v-if="isRouterAlive">
                <div class="add-wrap-header">
                    <div class="add-title">访客预约登记</div>
                    <div>
                         <router-link  :to="{path:'/serviceFair'}">
                            <el-button size="mini"> 
                            返回
                            </el-button>
                        </router-link>
                    </div>
                </div>  
                <div class="repair-main">
                    <el-form ref="form" :model="form" :rules="rules">
                        <el-row>
                            <el-col :span="12">
                                <el-form-item label="访客姓名" prop="visitorName" label-width="10em">
                                    <el-input v-model="form.visitorName" placeholder="请输入访客姓名/企业"></el-input>
                                </el-form-item>
                            </el-col>
                         
                        </el-row>
                         <el-row>
                            <el-col :span="12">
                                <el-form-item label="计划到访时间" label-width="10em" placeholder="请选择预约时间" prop="subscribeTime">
                                    <el-date-picker
                                        style="width:100%"
                                        v-model="form.subscribeTime"
                                        value-format="yyyy-MM-dd HH:mm"
                                        format="yyyy-MM-dd HH:mm"
                                        type="datetime"
                                        placeholder="选择日期时间">
                                    </el-date-picker>
                                </el-form-item>
                            </el-col>
                        </el-row>
                        <el-row>
                            <el-col :span="12">
                                <el-form-item label="手机号码" label-width="10em" prop="phoneNumber">
                                    <el-input v-model="form.phoneNumber" placeholder="请输入手机号码"></el-input>
                                </el-form-item>
                            </el-col>
                        </el-row>

                        <el-row>
                            <el-col :span="12">
                                <el-form-item label="来访事由" label-width="10em" prop="reason">
                                    <el-select v-model="form.reason" placeholder="请选择来访原由" style="width:100%">
                                        <el-option
                                        v-for="item in options"
                                        :key="item.value"
                                        :label="item.label"
                                        :value="item.value">
                                        </el-option>
                                    </el-select>
                                </el-form-item>
                            </el-col>
                        </el-row>
                        <el-row>
                            <el-col :span="12">
                                <el-form-item label="随行人数" label-width="10em" prop="visitorNumber">
                                    <el-input v-model="form.visitorNumber" placeholder="请输入来访人数"></el-input>
                                </el-form-item>
                            </el-col>
                        </el-row>
               
                        <el-row>
                             <div class="regis_info">
                                车辆登记信息
                            </div>
                        </el-row>

                        <el-row v-for="(domain, index) in form.carNumber"  :key="domain.id" class="vehicle_ininformation_wrap">  
                            <el-col :span="12">
                                <el-row type="flex">
                                    <div class="serial_number">{{index+1}}</div>
                                    <div class="cp_wrap">
                                        <el-col :span="4">
                                            <!-- 车牌首字母 -->
                                                <el-form-item  :rules="moreNotifyOjbectRules.province"  :prop="'carNumber.' + index + '.province'">
                                                    <el-select v-model="domain.province" filterable placeholder="" class="province_select">
                                                        <el-option
                                                            v-for="item in che_options"
                                                            :key="item"
                                                            :label="item"
                                                            :value="item">
                                                        </el-option>
                                                    </el-select>
                                                </el-form-item>
                                        </el-col>
                                        <el-col :span="4">
                                            <!-- 车牌第二个字母 -->
                                                <el-form-item  :rules="moreNotifyOjbectRules.cityLetter"  :prop="'carNumber.' + index + '.cityLetter'">
                                                    <el-select v-model="domain.cityLetter" filterable placeholder="" class="second_select">
                                                        <el-option
                                                            v-for="item in number"
                                                            :key="item"
                                                            :label="item"
                                                            :value="item">
                                                        </el-option>
                                                    </el-select>
                                                </el-form-item>
                                        </el-col>
                                        <el-col :span="16">
                                            <!-- 车牌号 -->
                                            <el-form-item  :rules="moreNotifyOjbectRules.carNum"  :prop="'carNumber.' + index + '.carNum'">
                                                    <el-input v-model="domain.carNum" class="carNum"></el-input>
                                            </el-form-item>
                                        </el-col>
                                    </div>
                                        
                                </el-row>
                                
                            </el-col>
                            <el-col :span="6">
                                <div class="add_delete">
                                    <div @click="addCarInfo">
                                        <img src="../../assets/images/fkdj/jia.png" alt="">
                                    </div>
                                    <div v-show="index!=0" @click="removeCarInfo(index)"><img src="../../assets/images/fkdj/jian.png" alt=""></div>
                                </div>
                            </el-col>
                        </el-row>

                        <el-row style="margin-top:40px;">
                             <el-form-item label-width="10em">
                                <el-button type="primary" @click="submit('form')">生成入园码</el-button>
                            </el-form-item>
                        </el-row>
                    </el-form>
                </div>
                
            </div>
        </el-container>
        
        <Dialog
           ref="dialog"
           class="dialog"
           :visible.sync="diglogVisible"
           width="550px"
           title="生成入园码"
           :noBtns="true"
           @close="goBack"
        >
            <div class="er_wrap">
                <div class="er_title">
                    二维码可用于入园扫码核验
                </div>
                <div class="er_time">
                    预约有效期 {{useTime}} ~ {{useTime}}
                </div>
                <div class="er_img">
                    <img :src="erImg" alt="">
                </div>
                <div class="er_btn">
                    <el-button type="primary" size="small" @click="downloadImage">下载</el-button>
                </div>
                <div class="er_tips">
                    <p>注：可从 企业中心 - 服务申请记录 - 访客预约登记进行下载</p>
                    <p>入园二维码仅预约当天有效</p>
                </div>
            </div>
        </Dialog>


    </div>
</template>

<script>
    import FxbHeader from "@/views/layouts/fxb/components/FxbHeader";
    /**弹窗组件*/
    import Dialog from "@/components/Dialog/index.vue"
    import {Api_visitorSq} from "@/api/ServiceMarket/Servicemarket.js";
    export default {
        name: "repair",
        components: {
            FxbHeader,
            Dialog
        },
        data() {
            const createRules = this.$createRules;
            return {
                /**二维码图片 */
                erImg:'',
                /**弹窗是否显示 */
                diglogVisible:false,
                isRouterAlive: true,
                useTime:'', //二维码使用时间
                pickerOptions:{
                     disabledDate(time) {
                        return time.getTime() < Date.now();
                    },
                },
                options: [
                    {
                        value: '1',
                        label: '面试'
                    }, 
                    {
                        value: '2',
                        label: '商务'
                    }, 
                    {
                        value: '3',
                        label: '参观'
                    }, 
                    {
                        value: '4',
                        label: '其他'
                    }
                ],
                form:{
                    carNumber:[
                        {   
                            id:Date.now(),
                            province: '',  // 首字母
                            cityLetter:'',  // 第二个字母
                            carNum:'' //车牌号
                        }
                    ]
                },


                /** 车辆登记信息首字母筛选*/
                che_options: ['京', '津', '冀', '晋', '蒙', '辽', '吉', '黑', '沪', '苏', '浙', '皖', '闽', '赣', '鲁', '豫', '鄂', '湘', '粤', '桂', '琼', '渝', '川', '贵', '云', '藏', '陕', '甘', '青','宁','新','台','港','澳','使','领','警','学'],
                    number: ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'A', 'B', 'C','D', 'E', 'F', 'G','H', 'J', 'K', 'L', 'M', 'N', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z', '学', '港', '澳'],
                rules:{
                    visitorName:createRules({
                        msg:'访客姓名',
                        required:true,
                        max:30
                    },'blur'),
                    subscribeTime:createRules({
                        msg:'计划到访时间',
                        required:true
                    }),
                    phoneNumber:createRules({
                        msg:'手机号码',
                        required:true,
                        number11:true
                    },'blur'),
                    reason:createRules({
                        msg:'来访事由',
                        required:true,
                        max:500
                    }),
                    visitorNumber:createRules({
                        msg:'随行人数',
                        cipint0:true,
                        max:15
                    },'blur')
                
                },
                /**动态验证 */
                 moreNotifyOjbectRules:{
                     province:createRules({
                        required:true,
                    }),

                    cityLetter:createRules({
                        required:true,
                    }),

                    carNum:createRules({
                        required:true,
                        max:30
                    },'blur'),
                 }
   
            }
        },
        computed: {

        },
        mounted(){
            
        },
        methods: {
            /**返回 */
            goBack(){
                this.$router.push({
                    path:'/serviceFair'
                })
            },
            reload() {
                this.isRouterAlive = false;
                this.$nextTick(() => (this.isRouterAlive = true));
            },
            /**下载图片 */
            downloadImage(){
                // 将链接地址字符内容转变成blob地址, 解决图片下载直接打开问题
                // url 为图片地址
                const url=this.erImg;
                fetch(url).then(async res => await res.blob()).then((blob) => {
                    // 创建隐藏的可下载链接
                    const a = document.createElement('a');
                    a.style.display = 'none';
                    a.href = URL.createObjectURL(blob);
                    // 保存下来的文件名
                    a.download = this.useTime+'入园二维码.png';
                    document.body.appendChild(a);
                    a.click();
                    // 移除元素
                    document.body.removeChild(a);
                })  
            },
            /**添加car的信息*/
            addCarInfo(){
                this.form.carNumber.push({   
                    id:Date.now(),
                    province: '',  // 首字母
                    cityLetter:'',  // 第二个字母
                    carNum:'' //车牌号
                })

            },

            removeCarInfo(index){
                this.form.carNumber.splice(index,1)
            },
            // 表单提交
            submit(formName){
             
 
                this.$refs[formName].validate((valid) => {
                if (valid) {
                  
                    Api_visitorSq(this.form)
                        .then((res) => { 
                            this.erImg=process.env.VUE_APP_FILE_IMG_API+res.imgUrl;
                            this.diglogVisible=true;
                            this.useTime=this.form.subscribeTime.split(" ")[0];
                        })
                        .catch((e) => {
                           this.$message.error(e);
                    });

                } else {
                    return false;
                }
                });
            },

        },
        beforeRouteLeave(to,from,next){
           
            if(to.fullPath== "/serviceFair"){
                to.meta.keepAlive=true;
                next() 
            }else{
           
                next() 
            }
           
        }


    }
</script>
<style lang="scss" scoped>
.er_wrap{
    text-align:center;
    .er_title{
        color: #333333;
        font-family: MicrosoftYaHei;
	    font-size: 16px;
        line-height: 16px;
        padding-bottom: 13px;
    }
    .er_time{
        color: #606266;
        font-family: MicrosoftYaHei;
	    font-size: 14px;
        line-height: 14px;
        padding-bottom: 19px;
    }

    .er_btn{
        margin-top: 26px;
    }

    .er_tips{
        margin-top: 24px;
    }
    
    .er_tips{
        font-family: MicrosoftYaHei;
	    font-size: 14px;
        color: #c0c4cc;
        line-height: 14px;
        &>p{
            padding-bottom: 10px;
        }
    }
    
}
.dialog /deep/ .el-dialog__footer{
    padding: 10px 20px;
}

</style>

<style lang="scss">
    #visitor_registration{
        
        .el-container{
            background-color: #f7f8fa!important;
            min-height: 100vh;
        }
        .repair-main{
            margin-top: 20px;
        }
        .add-repair{
            padding: 26px;
            width: 1200px;
            background-color: #fff;
            min-height: calc(100vh - 90px);;
            margin:20px auto 0;
            .add-wrap-header{
                display: flex;
                justify-content: space-between;
                .add-title{
                    font-family: MicrosoftYaHei;
                    font-size: 16px;
                    font-weight: normal;
                    font-stretch: normal;
                    line-height: 24px;
                    border-bottom:2px solid #4b9df3;
                    letter-spacing: 0px;
                    color: #333333;
                }
            }
        }
        .regis_info{
            font-family: MicrosoftYaHei;
            font-size: 16px;
            font-weight: normal;
            font-stretch: normal;
            line-height: 16px;
            letter-spacing: 0px;
            color: #333333;
            border-left: 4px solid  #4b9df3;
            padding-left: 15px;
            margin-top: 30px;
        }
        .serial_number{
            text-align:right;
            width: 10em;
            flex:0 0 10em;
            padding-right: 12px;
            line-height: 40px;
            color: #606266;
        }

        .province_select{
            .el-input__inner{
                border:none
            }
            .el-input{
                padding-right: 1px;
            }
           background:url("../../assets/images/fkdj/shu.jpg") no-repeat right center;
        }
        .second_select{
            .el-input__inner{
                border:none;
                
            }
            background:url("../../assets/images/fkdj/circular.png") no-repeat right center;
            i{
               display: none;
            }
            .el-input{
                padding-right: 6px;
            }
        }

        .carNum{
            .el-input__inner{
                border:none;
                
            }
        }

        .cp_wrap{
            display: flex;
            border: solid 1px #dcdfe6;
            border-radius: 4px;
            .el-form-item{
                margin-bottom: 0;
            }
        }
        .vehicle_ininformation_wrap{
            margin-bottom: 8px;
        }
       .add_delete{
           &>div{
               cursor: pointer;
               margin:7px 10px;
           }

           display: flex;
       }

       
    }
</style>