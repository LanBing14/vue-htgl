<template>
    <div id="decoration_application"> 
        <el-container style="background-color:#fff;">
            <el-header>
                <FxbHeader @reload="reload"/>
            </el-header>
            <div class="add-repair" v-if="isRouterAlive">
                <div class="add-wrap-header">
                    <div class="add-title">装修申请</div>
                    <div>
                         <router-link  :to="{path:'/serviceFair'}">
                            <el-button size="mini"> 
                            返回
                            </el-button>
                        </router-link>
                    </div>
                </div>  

                <div>
                     <div class="common_title zxwz">
                        装修物业位置
                     </div>
                     <div>
                         <div class="tag-item" v-for="(item,index) in address" :key="item.businessId">
                            <div class="tag-title">{{item.businessName}}</div>
                            <div>
                                <el-tag
                                    v-for="(tag,index2) in item.houseList"
                                    :key="tag.leaseHouseId"
                                    closable
                                    size="medium"
                                    @close="closeTag(index,index2)"
                                    type="info">
                                    {{tag.address}}
                                </el-tag>
                            </div>
                            
                         </div>
                        

                     </div>
                </div>

                <div>
                     <div class="common_title zxwz">
                        装修信息
                     </div>
                     <el-form ref="form" :model="form" :rules="rules">
                   
                        <el-row>
                            <el-col :span="12">
                                <el-form-item label="装修时间" label-width="10em" prop="decorationTime">
                                    <el-date-picker
                                        v-model="form.decorationTime"
                                        type="daterange"
                                        unlink-panels
                                        value-format="yyyy-MM-dd"
                                        format="yyyy-MM-dd"
                                        range-separator="-"
                                        start-placeholder="开始日期"
                                        end-placeholder="结束日期">
                                    </el-date-picker>
                                </el-form-item>
                            </el-col>
                        </el-row>
                        <el-row>
                            <el-col :span="12">
                                <el-form-item label="预计装修天数" label-width="10em">
                                    <div>
                                        {{howDays}}天
                                    </div>
                                </el-form-item>
                            </el-col>
                        </el-row>
                        <el-row>
                            <el-col :span="11">
                                <el-form-item label="装修面积" prop="decorationArea" label-width="10em">
                                    <el-input v-model="form.decorationArea" placeholder=""></el-input>
                                </el-form-item>
                            </el-col>
                            <el-col :span="1" style="line-height:40px;padding-left:11px" >
                                ㎡
                            </el-col>
                        </el-row>

                        <el-row>
                            <el-col :span="18">
                                <el-form-item label="装修内容" label-width="10em" prop="decorationNeir">
                                    <el-input type="textarea" rows="4" maxlength="500" v-model="form.decorationNeir" resize="none"></el-input>
                                </el-form-item>
                            </el-col>
                        </el-row>

                        <el-row>
                            <el-col :span="12">
                                <el-form-item label="相关附件" label-width="10em">
                                
                                    <Upload class="uploadBtn" v-model="form.uploadFileUrls" :fileSize="20" fileType="jpg,png,doc,zip" tip="支持上传jpg、png、doc、zip附件；单个附件大小不能超过20M"></Upload>
                                </el-form-item>
                            </el-col>
                        </el-row>
                        <el-row style="margin-top:10px;">
                             <el-form-item label-width="10em">
                                <el-button type="primary" @click="submit('form')">提交</el-button>
                            </el-form-item>
                        </el-row>

                       
                    </el-form>

                </div>

              
                
            </div>
  
        </el-container>
    </div>
</template>

<script>
    import FxbHeader from "@/views/layouts/fxb/components/FxbHeader";
    import { Api_getAddress,Api_Decapplication} from "@/api/ServiceMarket/Servicemarket.js";
    import Upload from "@/components/Upload/index";
    export default {
        name: "repair",
        components: {
            FxbHeader,
            Upload
        },
        data() {
            const createRules = this.$createRules;

            /** 装修面积检查 */
            var checkArea= (rule, value, callback) => {
                    
                let reg=/^[0-9]\d*\.?\d*$/;
              
                if (!reg.test(value)) {
                    callback(new Error('请输入数字值'));
                } else {
                    if (value>9999||value<1) {
                        callback(new Error('必须在1-9999范围内'));
                    } else {
                        callback();
                    }
                }
                   
            };
            return {
          
                isRouterAlive: true,

                /**装修物业位置 */
                address:[],

                // 装修时间
                pickerOptions: {
                    shortcuts: [{
                        text: '最近一周',
                        onClick(picker) {
                        const end = new Date();
                        const start = new Date();
                        start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
                        picker.$emit('pick', [start, end]);
                        }
                    }, {
                        text: '最近一个月',
                        onClick(picker) {
                        const end = new Date();
                        const start = new Date();
                        start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
                        picker.$emit('pick', [start, end]);
                        }
                    }, {
                        text: '最近三个月',
                        onClick(picker) {
                        const end = new Date();
                        const start = new Date();
                        start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
                        picker.$emit('pick', [start, end]);
                        }
                    }]
                    },
               
               
                form:{
                     value1: '',
                     decorationArea:"",
                     uploadFileUrls:[]
                },
                rules:{
                     decorationTime:createRules({
                        msg:'装修时间',
                        required:true
                    }),
                    decorationArea:[
                        { required: true, message: '装修面积必填', trigger: 'blur' },
                        { validator: checkArea, trigger: 'blur' }
                    ],
                    decorationNeir:createRules({
                         msg:'装修内容',
                         max:500
                    })
            
                },

   
            }
        },
        watch:{
            address:{
                handler:function(val){
                    let sum = 0;
                    val.forEach((item)=>{
                        sum+=item.houseList.reduce((acc,cur) => {
                            return acc+Number(cur.roomArea)
                        },0)
                    })

                    this.form.decorationArea = sum;
                },
                deep:true
            }
        },
        computed: {
            /** 装修开始到结束多少天 */
            howDays:function(){ 
                
                if(this.form.decorationTime){
                    return this.getDays(this.form.decorationTime[0],this.form.decorationTime[1])+1 
                }else{
                    return 0
                }
               
            }
        },
        created(){
            this.getPosition()
        },
        mounted(){
            
        },
        methods: {
    
            /**获取物业位置 */
            getPosition(){
                Api_getAddress().then((res)=>{
                    this.address=[...res];
                }).catch(err=>{
                    this.$message.error(err);
                })
            },
            getDays(strDateStart,strDateEnd){
                var strSeparator = "-"; //日期分隔符
                var oDate1;
                var oDate2;
                var iDays;
                oDate1= strDateStart.split(strSeparator);
                oDate2= strDateEnd.split(strSeparator);
                var strDateS = new Date(oDate1[0], oDate1[1]-1, oDate1[2]);
                var strDateE = new Date(oDate2[0], oDate2[1]-1, oDate2[2]);
                iDays = parseInt(Math.abs(strDateS - strDateE ) / 1000 / 60 / 60 /24)//把相差的毫秒数转换为天数
                return iDays ;
            },
            reload() {
                this.isRouterAlive = false;
                this.$nextTick(() => (this.isRouterAlive = true));
            },
            /**关闭tags触发的事件 */
            closeTag(index,index2){
                this.address[index].houseList.splice(index2,1)
            },
            submit(formName){
              
                let arrHouse=[]
                if(this.address.length>0){
                    this.address.forEach(item=>{
                        arrHouse=[...arrHouse,...item.houseList]
                    })

                    if(arrHouse.length===0){
                        this.$message.error('装修位置不存在');
                        return
                    }
                }else{
                    this.$message.error('装修位置不存在');
                    return
                }
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        let obj={
                            address:this.address,
                            decorationStartTime:this.form.decorationTime[0],
                            decorationEndTime:this.form.decorationTime[1],
                            decorationDayNum:this.howDays,
                            decorationArea:this.form.decorationArea,
                            content:this.form.decorationNeir,
                            repairUrl:this.form.uploadFileUrls
                        }
                        Api_Decapplication(obj)
                            .then((res) => { 
                              
                                /**提交装修申请成功 */
                                this.$message({
                                    message: res,
                                    type: 'success'
                                });
                                /**返回原来的页面 */
                                setTimeout(()=>{
                                    this.$router.push({
                                        path:'/serviceFair'
                                    })
                                },500)
                                
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
<style scoped lang="scss">

 #decoration_application{
    .tag-item{
        display: flex;
        margin-top: 20px;
        align-items: center;
    }

    .tag-title{
        flex:0 0 10em;
        text-align:right;
        padding-right: 15px;
        align-items: center;
        color: #606266;
	    font-size: 14px;
    }


    .zxwz{
        margin-bottom: 10px;
    }


 }



</style>

<style lang="scss">
    #decoration_application{
        
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
        .common_title{
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
        .el-tag{
            margin:0 4px;
        }

        .el-date-editor--daterange.el-input, .el-date-editor--daterange.el-input__inner, .el-date-editor--timerange.el-input, .el-date-editor--timerange.el-input__inner{
            width: 100%;
        }

        .uploadBtn{
            .el-button{
                padding: 8px 19px;
            }
        }
    }
</style>