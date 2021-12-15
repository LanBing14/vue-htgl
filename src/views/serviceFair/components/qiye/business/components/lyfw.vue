<template>
    <div class="chewei">
       <div class="chewei-wrap">
           <div class="chewei-content">
                <div class="chewei-title">礼仪服务</div>
                <div class="chewei-tips">园内提供多种礼仪服务形式：接待礼仪、签约礼仪、展会礼仪、庆典礼仪、揭牌礼仪等。</div>
                <div class="liucheng">
                    <div>流程：</div>
                    <div style="width:520px">
                        <el-steps :active="6" align-center>
                            <el-step title="需求提出">
                                <div slot="icon">
                                </div>
                            </el-step>
                            <el-step title="意向沟通">
                                 <div slot="icon">
                                </div>
                            </el-step>
                            <el-step title="商务洽谈">
                                 <div slot="icon">
                                </div>
                            </el-step>
                            <el-step title="确认方案">
                                 <div slot="icon">
                                </div>
                            </el-step>
                            <el-step title="服务执行">
                                 <div slot="icon">
                                </div>
                            </el-step>
                            <el-step title="服务结算">
                                 <div slot="icon">
                                </div>
                            </el-step>
                        </el-steps>
                    </div>

                </div>               
    
           </div>
       </div>
    </div>
</template>

