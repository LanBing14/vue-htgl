<template>
    <div class="overdueNotification">
        <div class="overMain">
             <span class="title">监测企业排行</span>
            <yuTable
                ref="table2"
                :serialWidth="90"
                :page="1"
                :fetchDataFn="companyRank"
                :query="query"
                :columns="columns"
            />
        </div>
    </div>
</template>



<script>
import {companyRank} from "@/api/monitor/overView.js"
import yuTable from './TableWrapper/index.vue'
export default {
    props:['query'],
    data(){
        return {
          currentPage:1,
          columns: [
                {
                    key: "companyName",
                    label: "客户名称",
                    align:"left",
                    props: { showOverflowTooltip: true },
                    render: (h, data, row) => {
                        return (
                            <span class="canClick" style="cursor:default">
                                {data}
                            </span>
                        )
                    }                    
                   
                }
            ]
        }
    },

    watch:{
        query:{
            handler(newVal,oldVal){
                this.$nextTick(()=>{
                    this.$refs.table2.fetchData();
                })
            },
            deep:true,
            immediate:true
        }
    },

    mounted(){  
        this.getList1();
    },
    methods:{
        companyRank,
        getList1() {
            this.$refs.table2.fetchData();
        }
    },
    components:{
        yuTable
    }
}
</script>
<style lang="scss" scoped>
.overdueNotification{
    background:#f7f8fa;
    padding-left: 20px;
    .overMain{
        height: 373px;
        overflow: hidden;
        background-color: #fff;
        padding: 24px 25px 20px;
    }
}

.overMain{
    height: 373px;
    overflow: hidden;
    .title {
        padding-left: 15px;
        font-size: 16px;
        color: #333;
        font-weight: 400;
        border-left: 4px solid #3399e6;
        margin-right: 15px;
      
    }   
    .tableWrapper{
        margin-top:20px;
    }
}

</style>