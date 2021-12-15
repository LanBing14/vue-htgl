<template>
    <div class="chewei">
       <div class="chewei-wrap">
           <div class="chewei-content">
                <div class="chewei-title">报修服务</div>
                <div class="chewei-tips">企业可对所租赁房间内损坏的基础设施等进行物业的报修；服务热线：XXXX-XXXXXX</div>
                <div class="liucheng">
                    <div>流程：</div>
                    <div style="width:480px">
                        <el-steps :active="5" align-center>
                            <el-step title="填写填写内容">
                                <div slot="icon">
                                </div>
                            </el-step>
                            <el-step title="提交报修申请">
                                 <div slot="icon">
                                </div>
                            </el-step>
                            <el-step title="报修申请审批">
                                 <div slot="icon">
                                </div>
                            </el-step>
                            <el-step title="报修事项处理">
                                 <div slot="icon">
                                </div>
                            </el-step>
                            <el-step title="报修结果确认">
                                 <div slot="icon">
                                </div>
                            </el-step>
                        </el-steps>
                    </div>

                </div>
                <div class="che-gong">
                    <div>
                        <i class="iconfont icon-bianji"> </i>
                        <router-link  :to="{path:'/repair_application'}">报修申请</router-link>
                    </div>
                 
                </div>
           </div>
       </div>
    </div>
</template>

