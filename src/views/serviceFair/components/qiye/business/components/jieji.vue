<template>
    <div class="chewei">
       <div class="chewei-wrap">
           <div class="chewei-content">
                <div class="chewei-title">接送机服务</div>
                <div class="chewei-tips">园区提供接送机服务</div>
                <div class="liucheng">
                    <div>程序：</div>
                    <div style="width:520px">
                        <el-steps :active="5" align-center>
                            <el-step title="预约接送机服务">
                                <div slot="icon">
                                </div>
                            </el-step>
                            <el-step title="预定信息核对">
                                 <div slot="icon">
                                </div>
                            </el-step>
                            <el-step title="车辆安排">
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

