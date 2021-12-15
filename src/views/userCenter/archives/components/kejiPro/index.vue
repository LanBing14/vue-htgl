<template>
  <el-row class="credit-tab-content">
    <h4 class="flex cp-title-wrap">
      <span class="flex-primary  cp-title">科技项目</span>
    </h4>

    <el-row>
      <TableWrapper
        ref="table"
        :fetchDataFn="technologyProjectsInfo"
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
      width="1000px"
      title="科技项目详情"
      append-to-body
      @close="onClose"
    >
      <el-form :model="form" :rules="rules" ref="form" label-width="7em" size="medium">
            <el-row>
              <el-col :span="8">
                  <el-form-item label="申请层次" prop="applicationLevel">
                        <el-select v-model="form.applicationLevel" placeholder="" :disabled="isreadOnly" style="width:100%">
                          <el-option
                            v-for="item in options"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value">
                          </el-option>
                        </el-select>
                  </el-form-item>
              </el-col>

              <el-col :span="16">
                  <el-form-item label="审请类型" prop="applicationTypeDesc">
                        <el-select v-model="form.applicationTypeDesc" :disabled="isreadOnly" placeholder="" style="width:100%">
                          <el-option
                            v-for="item in options"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value">
                          </el-option>
                        </el-select>
                  </el-form-item>
              </el-col>
            </el-row>

            <el-row>
               <el-col :span="16">
                  <el-form-item label="项目名称" prop="entryName">
                       <el-input v-model="form.entryName" :disabled="isreadOnly"></el-input>
                  </el-form-item>
              </el-col>
              <el-col :span="8">
                  <el-form-item label="获批层次" prop="approvalLevel">
                        <el-select v-model="form.approvalLevel"  placeholder="" :disabled="isreadOnly" style="width:100%">
                          <el-option
                            v-for="item in options"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value">
                          </el-option>
                        </el-select>
                  </el-form-item>
              </el-col>

             
            </el-row>


            <el-row>
               <el-col :span="8">
                  <el-form-item label="获批年度" prop="approvedYear">
                       <el-input v-model="form.approvedYear" :disabled="isreadOnly"></el-input>
                  </el-form-item>
              </el-col>
              <el-col :span="8">
                  <el-row>
                      <el-col :span="20">
                         <el-form-item label="获批金额" prop="getTheAmount">
                            <el-input v-model="form.getTheAmount" :disabled="isreadOnly"></el-input>
                         </el-form-item>
                      </el-col>
                      <el-col :span="4" style="text-align:center;line-height:36px"> 
                        万元
                      </el-col>
                  </el-row>
              </el-col>
               <el-col :span="8">
                  <el-form-item label="拟验收时间" prop="plannedAcceptanceTime">
                      <el-date-picker
                      :disabled="isreadOnly"
                      style="width:100%"
                      v-model="form.plannedAcceptanceTime"
                      type="date"
                      >
                    </el-date-picker>
                  </el-form-item>
              </el-col>
             
            </el-row>

            <el-row>
              <el-col :span="8">
                  <el-row>
                    <el-form-item label="验收情况" prop="acceptance">
                      <el-select v-model="form.acceptance"  placeholder="" :disabled="isreadOnly" style="width:100%">
                        <el-option
                          v-for="item in yanShouoptions"
                          :key="item.value"
                          :label="item.label"
                          :value="item.value">
                        </el-option>
                      </el-select>
                    </el-form-item>                     
                  </el-row>
              </el-col>

             
            </el-row>





            <el-row>
              <el-col :span="24">
                  <el-form-item label="相关附件">
                      <div>
                         
                      </div>
                  </el-form-item>
              </el-col>
            </el-row>
      </el-form>     
    </Dialog>
  </el-row>
</template>

<script>
  import {
    technologyProjectsInfo
  } from "@/api/creditManagement/customerProfile/customerManagemCustomer/baseInfo";

  export default{
    name:'keji',
    props: {
      /**是不是只读 */
      isreadOnly:Boolean,
    },
    data(){
      const createRules = this.$createRules;
      return {
      /**详情弹窗隐藏 */
      visible: false,

      /**申请层次 */
      options: [{value: 'country',label: '国家'}, {value: 'province',label: '省'}, {value: 'city',label: '市'}, {value: 'area',label: '区'}, {value: 'other',label: '其他'}],
     
      yanShouoptions:[{value:'0',label:'通过'},{value:'1',label:'未通过'},{value:'2',label:'待验收'}],
     
     /**详情的form */
      form:{},
      rules:{
        //  gdmc:createRules({msg:'股东名称',required:true},'blur')
      },
      tableCol1: [
        { label: "申请层次", 
          key: "applicationLevel",
          render:(h,data,row)=>{
            return (
              data=='country'? '国家':data=='province'? '省':data=='city'?  '市':data=='area'? '区':data=='other'? '其他':''
            )
          }
        },
        { label: "申请类型", key: "applicationTypeDesc" },
        { label: "项目名称", key: "entryName"},
        { 
          label: "获批层次",
          key: "approvalLevel",
          render:(h,data,row)=>{
            return (
              data=='country'? '国家':data=='province'? '省':data=='city'?  '市':data=='area'? '区':data=='other'? '其他':''
            )
          }
        },
        { label: "获批年度", key: "approvedYear" },
        {
          label: "操作",
          key: null,
          render: (h, data, row) => {
              return [<el-link type="primary" onClick={this.openModal.bind(this, row)}> 详情 </el-link>
              ] 
          }
        }
      ],
      listQuery: {
        id: this.$store.getters.userInfo.companyId
      },
      }
    },
    mounted(){
      this.$nextTick(()=>{
        this.getList();
      })
    
    },
    methods:{
       technologyProjectsInfo,
        getList() {
          this.$refs.table.fetchData();
        },
        onSuccessData(res){
          
        },
        /**查看详情 */
        openModal(row) {
          this.visible = true;
          this.form=this.$deepCopy(row)
        },

        /**关闭弹窗 */
        onClose() {
          this.$refs.form.resetFields();
        },

        /**弹窗确定 */
        handleSure() {
          this.visible=false;
        }



    }
  }

</script>