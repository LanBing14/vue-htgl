<template>
    <div class="overdueNotification">
        <div class="overMain" style="height:418px">
             <span class="title">逾期通报</span>

            <!-- <yuTable
                ref="table1"
                :isShowIndex="false"
                :page="1"
                :fetchDataFn="overDueNot"
                :query="{}"
                :columns="columns"
            /> -->
            <TableWrapper
                ref="table1"
                :isShowIndex="false"
                :page="1"
                :fetchDataFn="overDueNot"
                :query="{}"
                :columns="columns"
            />
        </div>
    </div>
</template>



<script>
// import yuTable from "./components/TableWrapper/index.vue"
import {overDueNot} from "@/api/creditManagement/todo/index";

export default {
    data(){
        return {
          currentPage:1,
          columns: [
                {
                    key: "name",
                    label: "合同",
                    width:'170',
                    props: { showOverflowTooltip: true },
                    render: (h, data, row) => {
                            
                        if(row.orders===0){
                            // 跳转合同
                            if(row.newFlag!==0){
                                // 加新  跳转合同
                                return (
                                    <span>
                                        <span class="new_css">新</span>
                                        <span class="canClick"  onClick={this.$gotoContractDetail.bind(this, row.id)}>
                                            {data}
                                        </span>
                                    </span>
                                );

     
                            }else{
                                // 不加新  跳转合同
                                return(
                                    <span class="canClick"  onClick={this.$gotoContractDetail.bind(this,  row.id)}>
                                        {data}
                                    </span>
                                )
                            }

                        }else{
                            // 跳转订单

                            if(row.newFlag!==0){
                                // 加新  跳转订单
                                return (
                                    <span>
                                        <span class="new_css">新</span>
                                        <span class="canClick"  onClick={this.$gotoOrderDetail.bind(this,  row.id)}>
                                            {data}
                                        </span>
                                    </span>
                                );

     
                            }else{
                                // 不加新  跳转订单
                                return(
                                    <span class="canClick" onClick={this.$gotoOrderDetail.bind(this,  row.id)}>
                                        {data}
                                    </span>
                                )
                            }

                        }





                        // if(row.newFlag!==0){
                        //     return (
                        //         <span>
                        //             <span class="new_css">新</span>
                        //             <span class="canClick" style="cursor:default">
                        //                 {data}
                        //             </span>
                        //         </span>
                        //     );
                        // }else{
                        //     return (
                        //         <span class="canClick" style="cursor:default">
                        //             {data}
                        //         </span>
                        //     )
                        // }
                        
                    }
                },
                {
                    key: "money",
                    label: "逾期金额",
                    props: { showOverflowTooltip: true },
                   
                },
               
                {
                    key: "day",
                    label: "逾期事件(天)",
                    props: { showOverflowTooltip: true },
                   
                }
            ],
        }
    },
    components:{
        // yuTable
    },
    mounted(){  
        this.getList1();
    },
    methods:{
        overDueNot,
        getList1() {
            this.$refs.table1.fetchData();
        }

    }
}
</script>
<style lang="scss" >
.overdueNotification {
    .new_css{
        width: 22px;
        height: 22px;
        color:#f67777;
        display:inline-block;
        line-height: 22px;
        border:1px solid #fbc4c4;
        border-radius: 4px;
        background:#fef0f0;
        margin-right:7px;
    }
}
</style>
<style lang="scss" scoped>
.overdueNotification{
    background:#f7f8fa;
    padding-left: 20px;
    .overMain{
        height: 373px;
        background-color: #fff;
        padding: 24px 25px 20px;
    }
}

.overMain{
    .title {
        padding-left: 15px;
        font-size: 16px;
        color: #333;
        font-weight: 400;
        border-left: 4px solid #3399e6;
        margin-right: 15px;
      
    }   
    .tableWrapper{
        margin-top:26px;
    }
}

</style>