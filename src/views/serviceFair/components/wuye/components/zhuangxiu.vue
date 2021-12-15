<template>
    <div class="chewei">
       <div class="chewei-wrap">
           <div class="chewei-content">
                <div class="chewei-title">装修服务</div>
                <div class="chewei-tips">由企业进行装修服务的线上申请，经园区审批通过后，可进行房间的装修</div>
                <div class="liucheng">
                    <div>流程：</div>
                    <div style="width:480px">
                        <el-steps :active="4" align-center>
                            <el-step title="填写装修需求">
                                <div slot="icon">
                                </div>
                            </el-step>
                            <el-step title="提交装修申请">
                                 <div slot="icon">
                                    
                                </div>
                            </el-step>
                            <el-step title="装修需求审批">
                                 <div slot="icon">
                                    
                                </div>
                            </el-step>
                            <el-step title="签署装修协议">
                                 <div slot="icon">
                                    
                                </div>
                            </el-step>
                        </el-steps>
                    </div>

                </div>
                <div class="che-gong">
                    <div>
                        <i class="iconfont icon-bianji"> </i>
                        
                         <router-link  :to="{path:'/decorationApplication'}">申请装修</router-link>
                    </div>
                 
                </div>
           </div>
       </div>
    </div>
</template>

