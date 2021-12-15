<template>
    <div class="repair_application"> 
        <el-container style="background-color:#fff;">
            <el-header>
                <FxbHeader @reload="reload"/>
            </el-header>
            <div class="add-repair" v-if="isRouterAlive">
                <div class="add-wrap-header">
                    <div class="add-title">新增报修</div>
                    <div>
                         <router-link  :to="{path:'/serviceFair'}">
                            <el-button size="mini"> 
                            返回
                            </el-button>
                        </router-link>
                    </div>
                </div>  
                <div class="repair-main">
                    <el-form ref="form" :model="form" :rules="rules" label-width="120px">

                        <el-row>
                            <el-col :span="12">
                                <el-form-item label="当前所在园区" prop="park">
                                    <el-select v-model="form.businessId" placeholder="" @change="changePark" style="width:100%">
                                        <el-option v-for="(item) in parkArr" :key="item.businessId" :label="item.businessName"  :value="item.businessId"></el-option>
                                    </el-select>
                                </el-form-item>
                            </el-col>
                        </el-row>
                        <el-row>
                            <el-col :span="12">
                                <el-form-item label="报修房间" prop="roomNo">
                                    <el-select v-model="form.roomNo" multiple  placeholder="" style="width:100%">
                                        <el-option v-for="item in roomArr" :key="item.houseId" :label="item.houseName" :value="item.houseName"></el-option>
                                    </el-select>
                                </el-form-item>
                            </el-col>
                        </el-row>
                        <el-row>
                            <el-col :span="12">
                                <el-form-item label="报修类型" prop="type">
                                     <el-select v-model="form.type" placeholder="" style="width:100%">
                                        <el-option v-for="item in repairType" :key="item.label" :label="item.label" :value="item.value"></el-option>
                                    </el-select>
                                </el-form-item>
                            </el-col>
                        </el-row>
                        <el-row>
                            <el-form-item label="报修内容" prop="contents">
                                <el-input type="textarea" placeholder="请输入报修内容" :maxlength="500" v-model="form.contents" resize="none"></el-input>
                            </el-form-item>
                        </el-row>
                        <el-row>
                            <el-form-item label="故障图片" prop="fileList">
                                <div>
                                    <el-upload
                                        class="upload-demo"
                                        :action="uploadUrl"
                                         ref="upload"
                                        :http-request="(p)=>myUpload(p)"
                                        :multiple="true"
                                        :before-upload="beforeAvatarUpload"
                                         accept="image/jpeg,image/jpg,image/png"
                                        :on-change="handleChange"
                                        :limit="maxNumber"
                                        list-type="picture-card">
                                       <div :class="['el-upload__tip',{'isjianT':form.fileList.length>0}]" slot="tip">仅支持上传 JPG、PNG 文件，附件大小限制10M</div>
                                        <div slot="file" slot-scope="{file}" class="imgWrap">
                                            <img
                                                class="el-upload-list__item-thumbnail"
                                                :src="file.url" alt=""
                                            >
                                            <span class="el-upload-list__item-actions">
                                                <span
                                                class="el-upload-list__item-preview"
                                                @click="handlePreview(file)"
                                                >
                                                <i class="el-icon-zoom-in"></i>
                                                </span>

                                                <span
                                                v-if="!disabled"
                                                class="el-upload-list__item-delete"
                                                @click="handleRemove(file)"
                                                >
                                                <i class="el-icon-delete"></i>
                                                </span>
                                            </span>
                                        </div>
                                        </el-upload>
                                        <el-dialog :visible.sync="dialogVisible">
                                            <img width="100%" :src="dialogImageUrl" alt="">
                                        </el-dialog>
                                </div>
                            </el-form-item>
                        </el-row>
                        <el-row>
                             <el-form-item>
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
    import {Api_getParks,Api_getRooms,Api_fileUrl,Api_upload,Api_baoxiuSq} from "@/api/ServiceMarket/Servicemarket.js";
    export default {
        name: "repair",
        components: {
            FxbHeader
        },
        data() {
            const createRules = this.$createRules;
            return {
                imgUrl:process.env.VUE_APP_FILE_IMG_API,
                isRouterAlive: true,
                 curUploadFileNum: -1, // 传递给后台的图片顺序
                 maxNumber:10,
                 form:{
                     fileList:[],
                     repairUrl:[],
                     // 报修类型
                     type:'',
                    /**选择的园区 */
                     businessId:'',
                    /**选择的房间 */
                     roomNo:[]
                 },
                 rules:{
                    businessId:createRules({
                       required:true,
                       msg:'所在园区'
                    }),
                    roomNo:createRules({
                       required:true,
                       msg:'报修房间'
                    }),
                    type:createRules({
                       required:true,
                       msg:'报修类型'
                    }),
                    contents:createRules({
                        msg:'报修内容',
                        required:true,
                        max:500
                    },'blur'),
                    fileList:createRules({
                        msg:'故障图片',
                        required:false
                    }),
                 },

                uploadUrl:Api_fileUrl() + "image/",
                dialogImageUrl: '',
                dialogVisible: false,
                disabled: false,
                /**报修类型 */
                repairType:[
                    {label:"强电维修",value:0},
                    {label:"质量检查",value:1},
                    {label:"排水维修",value:2},
                    {label:"清洁",value:3},
                    {label:"暖通空调维修",value:4},
                    {label:"其他",value:5} 
                ],
                /**园区数组 */
                parkArr:[],
                /**房间数组 */
                roomArr:[]
                
            }
        },
        computed: {

        },
        mounted(){
            
        },
        created(){
            
            this.getParks().then(()=>{
                this.getRoomArr()
            })
        },
        methods: {
            /**得到园区列表 */
            getParks(){
               let p= new Promise((resolve,reject)=>{
                   
                     Api_getParks().then((res)=>{
                        this.parkArr=this.$deepCopy(res);
                        this.form.businessId = this.parkArr[0].businessId;
                        resolve()
                    }).catch(err=>{
                        this.$message.error(err);
                        reject()
                    })
                })
               return p;
            },

            /**得到报修房间 */
            getRoomArr(){
                
                Api_getRooms({businessId:this.form.businessId}).then((res)=>{
                    this.roomArr = this.$deepCopy(res)
                }).catch(err=>{
                     this.$message.error(err);
                })
            },
            changePark(){
                this.roomArr=[]
                this.form.roomNo=[]
                this.getRoomArr()
            },
            reload() {
                this.isRouterAlive = false;
                this.$nextTick(() => (this.isRouterAlive = true));
            },
            // 表单提交
            submit(formName){
                if(this.parkArr.length==0){
                    this.$message.error('没有可选园区')
                    return;
                }
              
                this.$refs[formName].validate((valid) => {
                if (valid) {
                    // 要传给后端的图片路径
                    for(let m=0;m<this.$refs.upload.uploadFiles.length;m++){
                       let item= {
                           name:this.$refs.upload.uploadFiles[m].name,
                           url:this.$refs.upload.uploadFiles[m].fullUrl,
                        }

                        this.form.repairUrl.push(item)
                    }
                    let query={
                        businessId:this.form.businessId,
                        roomNo:this.form.roomNo,
                        type:this.form.type,
                        contents:this.form.contents,
                        repairUrl:this.form.repairUrl,
                        roomNo:this.form.roomNo

                    }
        
                    Api_baoxiuSq(query)
                        .then((res) => { 
                            /**报修成功 */
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
            //上传图片涉及到的方法
            handleRemove(file) {
                let uploadFiles = this.$refs.upload.uploadFiles;
                for (var i = 0; i < uploadFiles.length; i++) {
                    if (uploadFiles[i]['url'] == file.url) {
                        uploadFiles.splice(i, 1)
                    }
                }

                this.form.fileList=uploadFiles;
                if(this.form.fileList.length==0){
                    this.$refs.form.validateField('fileList')
                }
            },
            handlePreview(file) {
                this.dialogImageUrl = file.url;
                this.dialogVisible = true;
            },
            handleChange(file,fileList){
                this.form.fileList=fileList;
                
                if(this.form.fileList.length>0){
                    this.$refs.form.clearValidate('fileList')
                }
            },
            myUpload(content) {
                let num = 0;
                this.curUploadFileNum++;
                num = this.curUploadFileNum;
                const formData = new FormData();
                formData.append("file", content.file);
                this.batchLoading = true;
                Api_upload(this.uploadUrl+num, formData)
                    .then((res) => { 
                 
                       this.$refs.upload.uploadFiles[this.$refs.upload.uploadFiles.length-1]={...this.$refs.upload.uploadFiles[this.$refs.upload.uploadFiles.length-1],
                       'fullUrl':res.url,'url':this.imgUrl+res.url};
                    })
                    .catch((e) => {
                        
                    this.$message.error(e);
                });
            },
            // 上传时判断图片格式和大小是否满足
            // 仅支持jpg、jpeg、png格式，大小不超过10M
            beforeAvatarUpload(file) {
                const isMatch = /\.(jpg|jpeg|png|JPG|JPEG|PNG)$/.test(file.name);
                const isLt2M = file.size / 1024 < 10240;

                if (!isMatch) {
                 
                    this.$message.warning("仅支持jpg、jpeg、png格式");
                    return false
                }
               
                if (!isLt2M) {
                    this.$message.warning("图片大小不超过10M");
                    return false
                }
                return isMatch && isLt2M;
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
.repair_application{
    
    .repair-main{
        margin-top: 20px;
    }

    .isjianT{
        position: relative;
        top:-10px
    }
    .el-upload__tip{
        font-family: MicrosoftYaHei;
        font-size: 14px;
        font-weight: normal;
        font-stretch: normal;
        letter-spacing: 0px;
        color: #999999;
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

}
</style>

<style lang="scss">
.repair_application{
    .el-container{
        background-color: #f7f8fa!important;
        min-height: 100vh;
    }
    .el-upload-list.el-upload-list--picture-card{
        line-height: 0;
    }
    .el-upload--picture-card{
        border: dashed 1px #dcdfe6;
        width: 194px;
	    height: 125px;
        background:#f7f8f9 url("../../assets/images/serviceFair/bgUp.png") no-repeat center center;
    }

    .el-upload-list--picture-card .el-upload-list__item{
        width: 194px;
	    height: 125px;
    }
    .el-upload-list--picture-card .el-upload-list__item{
        margin: 0px 20px 8px 0;
    }

    .el-dialog__headerbtn{
        top: 7px;
        right: 10px
    }

    .el-dialog__body {
        padding: 0px 20px 20px;
    }
    .el-dialog__header{
        border:none
    }
    .imgWrap{
        width: 100%;
        height:100%;
        img{
            width: 100%;
            height:100%
        }
    }

}

</style>