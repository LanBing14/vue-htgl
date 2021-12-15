<template>
  <div>
      <h4 class="flex cp-title-wrap">
          <span class="flex-primary  cp-title">合同台账</span>
      </h4>
      <el-row>
        <TableWrapper
          ref="table"
          :fetchDataFn="Api_contractList"
          :query="listQuery"
          :columns="tableCol1"
          @onSuccessData="onSuccessData"
        >
        </TableWrapper>
      </el-row>

    <!-- 详情弹窗 -->
    <Dialog
      :visible.sync="visible"
      :onOk="handleSure"
      width="952px"
      title="合同台账详情"
      append-to-body
      :noBtns="true"
      @close="onClose"
    >
      
      <div class="allDiaWrap" style="height:320px">
         <el-scrollbar ref="scrollWrapMenu" style="height: 100%;">
            <div class="wrap-item">
              <div class="wrap-title">
                  <span class="title">
                    合同信息
                  </span>
                  <img src="../../../../../assets/images/zulinInfo/jian.png" alt="">
              </div>
              <div class="wrap-content">
                  <div class="content-item">
                      <div class="item">
                        <div class="item-title">企业名称：</div>
                        <div class="item-content">江苏未至科技股份有限公司"</div>
                      </div>
                  </div>
                  <div class="content-item">
                      <div class="item">
                        <div class="item-title">合同编号：</div>
                        <div class="item-content">SZCYYHTBH05874</div>
                      </div>
                      <div class="item">
                        <div class="item-title">所属项目：</div>
                        <div class="item-content">创业园创新企业项目</div>
                      </div>

                      <div class="item">
                        <div class="item-title">合同类型：</div>
                        <div class="item-content">租赁</div>
                      </div>
                  </div>
                  <div class="content-item">
                      <div class="item">
                        <div class="item-title">甲方：</div>
                        <div class="item-content">苏州高新技术创新服务中心</div>
                      </div>
                  </div>
                  <div class="content-item">
                      <div class="item">
                        <div class="item-title">法定代表人： </div>
                        <div class="item-content">刘玉凤</div>
                      </div>
                      <div class="item">
                        <div class="item-title">联系人：</div>
                        <div class="item-content"> 张三</div>
                      </div>
                      <div class="item">
                        <div class="item-title">联系电话：</div>
                        <div class="item-content"></div>
                      </div>
                  </div>
                  <div class="content-item">
                      <div class="item">
                        <div class="item-title">联系邮箱：   </div>
                        <div class="item-content">2460954311@qq.com</div>
                      </div>
                      <div class="item">
                        <div class="item-title">租赁房间：</div>
                        <div class="item-content"> 3-304,305,306 | 4-403,603</div>
                      </div>
                      <div class="item">
                        <div class="item-title">租赁面积：  </div>
                        <div class="item-content">100</div>
                      </div>
                  </div>
                  <div class="content-item">
                      <div class="item">
                        <div class="item-title">合同生效日期：</div>
                        <div class="item-content">2020-10-10~2021-01-03</div>
                      </div>
                      <div class="item">
                        <div class="item-title">租赁日期：</div>
                        <div class="item-content">2020-01-01~2021-01-01</div>
                      </div>
                      <div class="item">
                        <div class="item-title">合同状态：</div>
                        <div class="item-content">归档</div>
                      </div>
                  </div>
                  <div class="content-item">
                      <div class="item">
                        <div class="item-title">装修优惠：  </div>
                        <div class="item-content">2020-10-10~2021-01-03</div>
                      </div>
                      <div class="item">
                        <div class="item-title">首付日期： </div>
                        <div class="item-content">2020-10-10</div>
                      </div>
                      <div class="item">
                        <div class="item-title">提前支付天数：</div>
                        <div class="item-content">20</div>
                      </div>
                  </div>
                  <div class="content-item">
                      <div class="item"  style="width:100%">
                        <div class="item-title">附加条款：    </div>
                        <div class="item-content">asssssssssassssssssssssssssssssssssasssssssssssssssssssssssssssssssssssssss</div>
                      </div>
                  </div>
                  <div class="content-item">
                      <div class="item"  style="width:100%">
                        <div class="item-title">备注：</div>
                        <div class="item-content">asssssssssassssssssssssssssssssssssasssssssssssssssssssssssssssssssssssssss</div>
                      </div>
                  </div>
                  <div class="content-item">
                      <div class="item"  style="width:100%;line-height:36px">
                        <div class="item-title">合同附件：</div>
                        <div class="item-content">
                            <div>附件1</div>
                            <div>附件2</div>
                        </div>
                      </div>
                  </div>



              </div>
            </div>

            <div class="wrap-item">
              <div class="wrap-title">
                  <span class="title">
                    费用条款
                  </span>
                  <img src="../../../../../assets/images/zulinInfo/jian.png" alt="">
              </div>
              <div class="wrap-content">
                  <TableWrapper
                    ref="table2"
                    :fetchDataFn="Api_contractList"
                    :query="listQuery"
                    :columns="tableCol2"
                  >
                  </TableWrapper>
              </div>
            </div>
            <!-- 出账计划 -->
            <div class="wrap-item">
              <div class="wrap-title">
                  <span class="title">
                    出账计划
                  </span>
                  <img src="../../../../../assets/images/zulinInfo/jian.png" alt="">
              </div>
              <div class="wrap-content">
                  <TableWrapper
                    ref="table3"
                    :fetchDataFn="Api_contractList"
                    :query="listQuery"
                    :columns="tableCol3"
                  >
                  </TableWrapper>
              </div>
            </div>



         </el-scrollbar>
      </div>

    </Dialog>
  </div>
</template>
<script>
import {
  Api_contractList
} from "@/api/creditManagement/customerProfile/customerManagemCustomer/baseInfo";

export default{
  data(){
    const createRules = this.$createRules;
    return{
        /**详情弹窗隐藏 */
        visible: false, 
        listQuery: {
          companyId: this.$store.getters.userInfo.companyId
        },

        tableCol1: [
          { label: "合同编号", key: "contractNo" , align: "left",},
          { label: "合同性质", key: "contractNatureDesc", align: "left", },
          { label: "所属项目", key: "projectName", align: "left", },
          { label: "合同签订日期", key: "contractTime" , align: "left",},
          { label: "物业位置", key: "rooms" , align: "left",},
          { label: "租赁面积（㎡）", key: "houseArea", align: "left", },
          { label: "合同状态", key: "statusDesc", align: "left", },
          { label: "开始日期", key: "contractStartTime", align: "left",
          render:(h,data,row) => {
             return data ? this.$moment(data).format('YYYY-MM-DD'):'-'
          } },
          { label: "到期日期", key: "endTime", align: "left",},
          { label: "距终租日", key: "moneyType", align: "left",
            render: (h,data,row)=>{
              return row.endTime ? this.DateDiff(this.$moment(new Date()).format('YYYY-MM-DD'),row.endTime):'-'
            }
         },
          { label: "经办人", key: "party" }
          // {
          //   label: "操作",
          //   key: null,
          //   render: (h, data, row) => {
          //       return [<el-link type="primary" onClick={this.openModal.bind(this, row)}> 详情 </el-link>
          //       ] 
          //   }
          // }
        ],
        tableCol2: [
          { label: "费用名称", key: "stockName" },
          { label: "单价", key: "shouldCapi" },
          { label: "单位", key: "stockPercent"},
          { label: "关联房间", key: "creditCode" },
          { label: "房间面积（㎡）", key: "creditCode",width:200 },
          { label: "租赁日期", key: "creditCode"},
          { label: "结算类型", key: "creditCode"},
          {label: "结算类型", key: "creditCode"}
        ],
        tableCol3: [
          { label: "费用名称", key: "stockName" },
          { label: "关联房间", key: "shouldCapi" },
          { label: "收款时间", key: "stockPercent"},
          { label: "账期", key: "creditCode" },
          { label: "减免面积（㎡）", key: "creditCode",width:150},
          { label: "实际计算面积（㎡）", key: "creditCode",width:150},
          { label: "金额（元）", key: "creditCode"}
        ]
    }
  },
  mounted() {
    this.$nextTick(()=>{
        this.getList();
    })
  },
  methods: {
    Api_contractList,
    getList() {
      this.$refs.table.fetchData();
    },
    // 表格加载数据成功后
    onSuccessData(list, totalRecordNumber) {
        
    },

    /**查看详情 */
    openModal(row) {
      this.visible = true;
      this.$nextTick(()=>{
        this.$refs.table2.fetchData();
        this.$refs.table3.fetchData();
      })
    },
      // 计算天数
    DateDiff( date1 , date2) {
     let a = new Date().getTime()
     let b = new Date(date2).getTime()
    let c = parseInt((b-a)/1000 / (60 * 60 * 24))
    console.log(c)
     return c>0? Math.abs(c) :'已过期'
    },

    /**关闭弹窗 */
    onClose() {
      this.visible=false;
    },

    /**弹窗确定 */
    handleSure() {
      this.visible=false;
    }
  }
}


</script>



<style scoped lang="scss">
.allDiaWrap{
  .content-item{
    display: flex;
    padding-bottom: 14px;
  
  }
  .wrap-title{
    	width: 100%;
      height: 46px;
      background-color: #f7f8fb;
      margin-bottom: 16px;
      line-height: 46px;
      padding-left: 18px;
      display: flex;
      align-items: center;
      .title{
          font-weight: bold;
          font-size:14px;
          line-height: 14px;
          padding-left: 7px;
          border-left:4px solid #2d8cf0;
      }
      img{
        width: 22px;
        height: 12px;
        vertical-align: middle;
        padding-left: 7px;
      }
  }
  .item{
    display:flex;
    // margin-right: 80px;
    width: 33.333%;
    .item-title{
      flex:0 0 auto
    }
  }
}

</style>