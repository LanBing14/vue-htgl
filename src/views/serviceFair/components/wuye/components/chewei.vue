<template>
    <div class="chewei">
       <div class="chewei-wrap">
           <div class="chewei-content">
                <div class="chewei-title">车位服务</div>
                <div class="chewei-tips">园区与多家战略服务商联手为园区企业提供装修设计、施工、监督一条龙服务。只需提供装修风格，装修服务团队即可为您定制个性化专属方案。</div>
                <div class="liucheng">
                    <div>流程：</div>
                    <div style="width:480px">
                        <el-steps :active="4" align-center>
                            <el-step title="登记车辆信息">
                                <div slot="icon">
                                </div>
                            </el-step>
                            <el-step title="发起车位登记申请">
                                 <div slot="icon">
                                    
                                </div>
                            </el-step>
                            <el-step title="申请审批">
                                 <div slot="icon">
                                    
                                </div>
                            </el-step>
                            <el-step title="签署车位协议">
                                 <div slot="icon">
                                    
                                </div>
                            </el-step>
                        </el-steps>
                    </div>

                </div>
                <div class="che-gong">
                    <div>
                        <i class="iconfont icon-bianji"> </i>
                        车位登记
                    </div>
                    <div>
                        <i class="iconfont icon-jinrongfuwuguanli"></i>
                        车位续租
                    </div>
                </div>
           </div>
       </div>
    </div>
</template>

