<template>
  <div class="baseInfo-comp1">
    <h4 class="flex cp-title-wrap">
      <span class="flex-primary  cp-title">企业概况</span>
    </h4>
    <el-row v-loading="comLoading"   element-loading-spinner="el-icon-loading" element-loading-text="拼命加载中">
  
        <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="12em" size="medium">
      <el-row>
          <el-col :span="16">
              <el-form-item label="企业名称" prop="enterpriseName">
                  <el-input v-model="ruleForm.enterpriseName" :disabled="isreadOnly"></el-input>
              </el-form-item>
          </el-col>
          <el-col :span="8">
            <div>
                <el-form-item label="统一社会信用代码" prop="createCode" label-width="12em">
                  <el-input v-model="ruleForm.createCode" :disabled="isreadOnly"></el-input>
                </el-form-item>
            </div>
          </el-col>
        </el-row>
         <el-row>
          <el-col :span="16" >
              <el-form-item label="曾用名" prop="oldName">
                  <el-input v-model="ruleForm.oldName" :disabled="isreadOnly"></el-input>
              </el-form-item>
              <el-row>
                <el-col :span="12">
                    <el-form-item label="成立时间" prop="incorporationDate">
                      <el-date-picker type="date"  :disabled="isreadOnly" v-model="ruleForm.incorporationDate" style="width: 100%;"></el-date-picker>
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-row>
                      <div style="display:flex">
                        <div style="flex:5"> 
                          <el-form-item label="注册资本" prop="registeredCapital">
                            <el-input v-model="ruleForm.registeredCapital"  :disabled="isreadOnly"></el-input>
                          </el-form-item>
                        </div>
                        <div style="flex:2">
                            <el-form-item  prop="registeredCapitalUnit" label-width="0">
                              <el-select style="width:100%" v-model="ruleForm.registeredCapitalUnit" :disabled="isreadOnly">
                                <el-option
                                  v-for="item in options"
                                  :key="item.value"
                                  :label="item.label"
                                  :value="item.value">
                                </el-option>
                              </el-select>
                          </el-form-item>
                        </div>
                      </div>
                  </el-row>
                </el-col>
                <el-col :span="12">
                    <el-form-item label="法定代表人" prop="representativeLegal">
                        <el-input v-model="ruleForm.representativeLegal" :disabled="isreadOnly"></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-row>
                          <div style="display:flex">
                            <div style="flex:5">
                              <el-form-item label="成立时注册资本" prop="establishRegisteredCapital">
                                <el-input v-model="ruleForm.establishRegisteredCapital" :disabled="isreadOnly"></el-input>
                              </el-form-item>
                        
                            </div>
                            <div style="flex:2">
                              <el-form-item  prop="establishCapitalUnit" label-width="0">
                                  <el-select v-model="ruleForm.establishCapitalUnit"  :disabled="isreadOnly">
                                    <el-option
                                      v-for="item in options"
                                      :key="item.value"
                                      :label="item.label"
                                      :value="item.value">
                                    </el-option>
                                  </el-select>
                              </el-form-item>
                            </div>
                          </div>
                      
                    </el-row>
                </el-col>
              </el-row>
              <el-form-item label="企业类型" prop="enterprisesType">
                  <el-input v-model="ruleForm.enterprisesType" :disabled="isreadOnly"></el-input>
              </el-form-item>  
              <el-form-item label="注册地址" prop="registeredAddress">
                  <el-input v-model="ruleForm.registeredAddress"  :disabled="isreadOnly"></el-input>
              </el-form-item>  
              <el-form-item label="经营范围" prop="businessNature">
                  <el-input type="textarea" v-model="ruleForm.businessNature" resize='none' :disabled="isreadOnly"></el-input>
              </el-form-item>  
              <el-form-item label="现经营地址" prop="managementAddress">
                  <el-input v-model="ruleForm.managementAddress" :disabled="isreadOnly"></el-input>
              </el-form-item>
          </el-col>

          <el-col :span="8">
            <div style="margin-left:12em" class="upload-wrap">
              <div v-if="!isreadOnly">
                <el-upload
                  class="avatar-uploader"
                  action="https://jsonplaceholder.typicode.com/posts/"
                  :show-file-list="false"
                  :on-success="handleAvatarSuccess"
                  :before-upload="beforeAvatarUpload">
                  <img v-if="imageUrl" :src="imageUrl" class="avatar">
                  <div v-else>
                      <div class="upload-main2">
                        <div class="upload-title">统一社会信用代码营业执照</div>
                        <div class="upload-content">
                          <div class="guihui">
                            <img src="../../../../../assets/images/baseInfo/guohui.png" alt="">
                          </div>
                        
                          <div>
                            <i class="el-icon-plus avatar-uploader-icon"></i>
                          </div>
                        </div>
                        <div class="upload-tips">仅支持上传JPG、PNG图片格式</div>
                      </div>
                  </div>
                
                </el-upload>
              </div>
               <div v-else>
                  <div v-if="imageUrl">
                     <img  :src="imageUrl" class="avatar">
                  </div>
                  <div v-else>
                      <div class="upload-main2 noImgWrap">
                        <div class="upload-title">统一社会信用代码营业执照</div>
                        <div class="upload-content">
                          <div class="guihui">
                            <img src="../../../../../assets/images/baseInfo/guohui.png" alt="">
                          </div>
                        
                          <div>
                            <i class="el-icon-plus avatar-uploader-icon"></i>
                          </div>
                        </div>
                        <div class="upload-tips">仅支持上传JPG、PNG图片格式</div>
                      </div>
                  </div>
               </div>
            </div>
          </el-col>
        </el-row>
        <el-row type="flex">
            <el-col :span="8">
              <el-form-item label="行业类型" prop="industryType1">
                  <el-select v-model="ruleForm.industryType1" placeholder="" style="width:100%" :disabled="isreadOnly">
                    <el-option
                      v-for="item in hangOptions"
                      :key="item.industryCode"
                      :label="item.industryName"
                      :value="item.industryCode">
                    </el-option>
                  </el-select>
              </el-form-item>
          </el-col>          
            <el-col :span="8">
              <el-form-item label="行业类型二" prop="industryType2">
                  <el-select placeholder=""  v-model="ruleForm.industryType2" style="width:100%" :disabled="isreadOnly">
                    <el-option
                      v-for="item in hangOptions2"
                      :key="item.industryCode"
                      :label="item.industryName"
                      :value="item.industryCode">
                    </el-option>
                  </el-select>
              </el-form-item>
          </el-col>  
        
          <el-col :span="8">
            <div>
                <el-form-item label="国民经济行业分类代码" label-width="12em" prop="industryClassification">
                  <el-input v-model="ruleForm.industryClassification" :disabled="isreadOnly"></el-input>
                </el-form-item>
            </div>
          </el-col>
        </el-row>  
        <el-row>
            <el-col :span="8">
              <el-form-item label="纳税类型" prop="taxTypes">
                  <el-select v-model="ruleForm.taxTypes" placeholder="" style="width:100%" :disabled="isreadOnly">
                    <el-option
                      v-for="item in naShuiOptions"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value">
                    </el-option>
                  </el-select>
              </el-form-item>
          </el-col>          
            <el-col :span="16">
              <el-form-item label="经营领域" prop="jyly">
                    <el-select placeholder="" v-model="ruleForm.nslx" style="width:100%" :disabled="isreadOnly">
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
            <el-col>
              <el-form-item label="企业简介" prop="companyProfile">
                 <el-input type="textarea" v-model="ruleForm.companyProfile" resize='none' :disabled="isreadOnly"></el-input>
              </el-form-item>
          </el-col>  
        </el-row>   
        <el-row>
            <el-col :span="8">
              <el-form-item label="孵化性质" prop="hatchingNature">
                  <el-select v-model="ruleForm.hatchingNature" placeholder="" style="width:100%" :disabled="isreadOnly">
                    <el-option
                      v-for="item in fuHuaOptions"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value">
                    </el-option>
                  </el-select>
              </el-form-item>
          </el-col>          
            <el-col :span="16" class="sszt-wrap">
              <el-form-item label="所属科创载体" prop="spaceSelection">
                  <el-autocomplete
                    :disabled="isreadOnly"
                    v-model="ruleForm.spaceSelection"
                    :fetch-suggestions="querySearchAsync"
                    @select="handleSelect"
                    suffix-icon="el-icon-search"
                  ></el-autocomplete>
              </el-form-item>
          </el-col>  
        
         
        </el-row>
        <el-row>
            <el-col :span="8">
              <el-form-item label="技术领域" prop="jsly">
                  <el-select v-model="ruleForm.technicalField" style="width:100%" placeholder="" :disabled="isreadOnly">
                    <el-option
                      v-for="(item,index) in jiShuOptions"
                      :key="index"
                      :label="item.dataName"
                      :value="item.dataCode">
                    </el-option>
                  </el-select>
              </el-form-item>
          </el-col>          
            <el-col :span="8">
              <el-form-item label="孵化状态" prop="hatchingState">
                  <el-select v-model="ruleForm.hatchingState" placeholder="" disabled style="width:100%">
                    <el-option
                      v-for="item in fuHuaZTOptions"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value">
                    </el-option>
                  </el-select>
              </el-form-item>
          </el-col>  
        
          <el-col :span="8">
              <el-form-item label="入驻状态" prop="entryStatus" label-width="12em">
                  <el-select v-model="ruleForm.entryStatus" :disabled="isreadOnly" placeholder="" style="width:100%">
                    <el-option
                      v-for="item in ruzhuOptions"
                      :key="item.dataCode"
                      :label="item.dataName"
                      :value="item.dataCode">
                    </el-option>
                  </el-select>
              </el-form-item>           
          </el-col>
        </el-row>  
        <el-row>
            <el-col :span="8">
              <el-form-item label="孵化协议" prop="incubationAgreement">
                  <el-select v-model="ruleForm.incubationAgreement" placeholder="" :disabled="isreadOnly" style="width:100%">
                    <el-option
                      v-for="item in fuHuaXieYOptions"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value">
                    </el-option>
                  </el-select>
              </el-form-item>
          </el-col>          
            <el-col :span="8">
              <el-form-item label="导师协议" prop="mentorAgreement">
                  <el-select v-model="ruleForm.mentorAgreement" :disabled="isreadOnly" placeholder="" style="width:100%">
                    <el-option
                      v-for="item in daoShiXieYOptions"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value">
                    </el-option>
                  </el-select>
              </el-form-item>
          </el-col>  
        
          <el-col :span="8">
              <el-form-item label="负责人是否联系连续创业" prop="isContinuous" label-width="12em">
                  <el-select v-model="ruleForm.isContinuous" :disabled="isreadOnly"  placeholder="" style="width:100%">
                    <el-option
                      v-for="item in isConYe"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value">
                    </el-option>
                  </el-select>
              </el-form-item>           
          </el-col>
        </el-row>  
        <el-row>
            <el-col :span="24">
              <el-form-item label="企业类型" prop="enterprisesType">
                  <el-select v-model="ruleForm.enterprisesType" :disabled="isreadOnly" placeholder="" style="width:100%">
                    <el-option
                      v-for="item in qiyeOptions"
                      :key="item.dataCode"
                      :label="item.dataName"
                      :value="item.dataCode">
                    </el-option>
                  </el-select>
              </el-form-item>
          </el-col>          
        </el-row>  


        <el-row>
          <el-col :span="8">
            <el-form-item label="租赁协议起始时间" prop="leaseAgreementStarttime">
                <el-date-picker type="date" :disabled="isreadOnly" v-model="ruleForm.leaseAgreementStarttime" style="width: 100%;"></el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="入孵时间" prop="incubationTime">
                <el-date-picker type="date" :disabled="isreadOnly" v-model="ruleForm.incubationTime" style="width: 100%;"></el-date-picker>
            </el-form-item>
          </el-col>  
          <el-col :span="8">
            <el-form-item label="搬离时间" prop="moveOutTime" label-width="12em">
                <el-date-picker type="date" :disabled="isreadOnly" v-model="ruleForm.moveOutTime" style="width: 100%;"></el-date-picker>
            </el-form-item>
          </el-col>                                
        </el-row>  

        <el-row>
            <el-col :span="24">
              <el-form-item label="企业跟踪人员" prop="enterpriseTracker">
                  <el-select v-model="ruleForm.a8" :disabled="isreadOnly" placeholder="" style="width:100%">
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
            <el-col :span="24">
              <el-form-item label="引进人员" prop="personnelIntroduction">
                  <el-input v-model="ruleForm.personnelIntroduction" :disabled="isreadOnly"></el-input>
              </el-form-item>
          </el-col>          
        </el-row>   
      </el-form>
    </el-row>
  </div>
</template>

<script>
 /**接口导入 */
import {
  Api_baseInfo,
  /**行业领域下拉 */
  Api_dictionary,
  Api_xiaLa
} from "@/api/creditManagement/customerProfile/customerManagemCustomer/baseInfo";
export default {
  name: "Comp1",
  
  props:{
    /**是不是只读 */
    isreadOnly:Boolean,
    companyId:String

  },
  data() {
    const createRules = this.$createRules;
    return {
        information:{},
        /** 基本信息loading*/
        comLoading:false,
        hangOptions:[],
        /**行业类型2 */
        hangOptions2:[],

        /**技术领域 */
        jiShuOptions:[],

        /**企业类型 */
        qiyeOptions:[],

        /**孵化性质 */
        fuHuaOptions: [
            {value: '0',label: '科创载体'}, 
            {value: '1',label: '非科创载体'}, 
            {value: '2',label: '科创载体下企业'}
        ],

        /**孵化状态option */
       fuHuaZTOptions: [
            {value: '0',label: '中心在孵化'}, 
            {value: '1',label: '留创园在孵化'}, 
            {value: '2',label: '中心毕业'},
            {value: '3',label: '留创园毕业'},
        ],
        /**纳税option*/
        naShuiOptions: [
            {value: '0',label: '一般纳税'}, 
            {value: '1',label: '小规模纳税'}
        ],

        /**入驻状态 */
       ruzhuOptions:[],
        /**孵化协议 */
        fuHuaXieYOptions:[
            {value: '0',label: '否'}, 
            {value: '1',label: '是'}
        ],
        /**导师协议 */
        daoShiXieYOptions:[
            {value: '0',label: '否'}, 
            {value: '1',label: '是'}
        ],
        /**负责人是否连续创业 */
        isConYe:[
            {value: '0',label: '否'}, 
            {value: '1',label: '是'}
        ],
        /**所属科创载体 */

        /**注册资本 */
        options: [
            {value: '1',label: '万元人民币'}, 
            {value: '10',label: '万加元'}, 
            {value: '11',label: '万瑞士法郎'},
            {value: '12',label: '万德国马克'},
            {value: '13',label: '万澳门元'},
            {value: '14',label: '万法国法郎'},
            {
              value: '15',
              label: '万韩元'
            },
            {
              value: '16',
              label: '万瑞典克朗'
            },
            {
              value: '17',
              label: '万丹麦克朗'
            },
            {
              value: '18',
              label: '万挪威克朗'
            },
            {
              value: '19',
              label: '万智利比索'
            },
            {
              value: '2',
              label: '万美元'
            },
            {
              value: '20',
              label: '万新台湾元'
            },
            {
              value: '3',
              label: '万港元'
            },
            {
              value: '4',
              label: '万欧元'
            },
            {
              value: '5',
              label: '万日元'
            },
            {
              value: '6',
              label: '万阿富汗尼'
            },
            {
              value: '7',
              label: '万澳大利亚元'
            },
            {
              value: '8',
              label: '万新加坡元'
            },
            {
              value: '9',
              label: '万英镑'
            }
        ],

        rules: {
         enterpriseName:createRules({msg:'企业名称',required:true},'blur'),
         kczt:createRules({msg:'所属科创载体',required:true},'blur')
        },

        /**图片上传 */
         imageUrl: '',
        /**远程搜索 */
        restaurants: [],
        timeout:  null,
        ruleForm:{
          
        }

    };
  },

  computed:{

  },
  created() {
    this.baseInfo().then(()=>{
       this.hangXia2()
    })
    this.hangXia()
  },
  mounted(){
    this.restaurants = this.loadAll();
  },
  methods: {
    hangXia(){
      Api_dictionary().then((res)=>{
          this.hangOptions=this.$deepCopy(res)
        }).catch(err=>{
           this.$message.error(err);
        })
      /**技术领域*/
      Api_xiaLa('technicalField').then(res2=>{
        this.jiShuOptions=this.$deepCopy(res2.data)
      }).catch(err=>{
         this.$message.error(err);
      })
      /**企业类型 */
      Api_xiaLa('enterprise_type').then(res2=>{
        this.qiyeOptions=this.$deepCopy(res2.data)
      }).catch(err=>{
         this.$message.error(err);
      })

      /**入驻状态 */
      Api_xiaLa('settled_status').then(res=>{
        this.ruzhuOptions=this.$deepCopy(res.data)
      }).catch(err=>{
         this.$message.error(err);
      })
    },

    hangXia2(){

       Api_dictionary({code:this.ruleForm.industryType1}).then((res)=>{
           this.hangOptions2=this.$deepCopy(res)
           this.comLoading=false;
        }).catch(err=>{
           this.comLoading=false;
           this.$message.error(err);
        })
    },

    baseInfo(){
      /**基本信息 */
      return  new Promise((resolve, reject)=>{
          this.comLoading=true;
          Api_baseInfo(this.companyId).then((res)=>{
            this.ruleForm={...this.$deepCopy(res)};
           
            this.ruleForm.registeredCapital? this.ruleForm.registeredCapital=this.$toMoney( this.ruleForm.registeredCapital):'';
            this.ruleForm.establishRegisteredCapital? this.ruleForm.establishRegisteredCapital=this.$toMoney( this.ruleForm.establishRegisteredCapital):''

            if(this.ruleForm.incorporationDate){
                this.ruleForm.incorporationDate=this.$dateFormat(this.ruleForm.incorporationDate)
            }
            if(this.ruleForm.incorporationDate){
              this.ruleForm.incorporationDate=this.$dateFormat(this.ruleForm.leaseAgreementStarttime)
            }
            if(this.ruleForm.leaseAgreementStarttime){
              this.ruleForm.leaseAgreementStarttime=this.$dateFormat(this.ruleForm.leaseAgreementStarttime)
            }
          
            if(this.ruleForm.incubationTime){
              this.ruleForm.incubationTime=this.$dateFormat(this.ruleForm.incubationTime)
            }

            if(this.ruleForm.moveOutTime){
              this.ruleForm.moveOutTime=this.$dateFormat(this.ruleForm.moveOutTime)
            }
            
            resolve()
        }).catch(err=>{
           this.$message.error(err);
           this.comLoading=false;
        })  
      })



    },
      /** 统一社会信用代码营业执照上传*/
      handleAvatarSuccess(res, file) {
        this.imageUrl = URL.createObjectURL(file.raw);
      },
      beforeAvatarUpload(file) {
        const isJPG = file.type === 'image/jpeg';
        const isLt2M = file.size / 1024 / 1024 < 2;

        if (!isJPG) {
          this.$message.error('上传头像图片只能是 JPG 格式!');
        }
        if (!isLt2M) {
          this.$message.error('上传头像图片大小不能超过 2MB!');
        }
        return isJPG && isLt2M;
      },


      /** 所属科创载体远程搜索*/
      loadAll() {
        return [
          { "value": "三全鲜食（北新泾店）", "address": "长宁区新渔路144号" },
          { "value": "Hot honey 首尔炸鸡（仙霞路）", "address": "上海市长宁区淞虹路661号" },
          { "value": "新旺角茶餐厅", "address": "上海市普陀区真北路988号创邑金沙谷6号楼113" },
          { "value": "泷千家(天山西路店)", "address": "天山西路438号" },
          { "value": "胖仙女纸杯蛋糕（上海凌空店）", "address": "上海市长宁区金钟路968号1幢18号楼一层商铺18-101" },
          { "value": "贡茶", "address": "上海市长宁区金钟路633号" },
          { "value": "豪大大香鸡排超级奶爸", "address": "上海市嘉定区曹安公路曹安路1685号" },
          { "value": "茶芝兰（奶茶，手抓饼）", "address": "上海市普陀区同普路1435号" },
          { "value": "十二泷町", "address": "上海市北翟路1444弄81号B幢-107" },
          { "value": "星移浓缩咖啡", "address": "上海市嘉定区新郁路817号" },
          { "value": "阿姨奶茶/豪大大", "address": "嘉定区曹安路1611号" },
          { "value": "新麦甜四季甜品炸鸡", "address": "嘉定区曹安公路2383弄55号" },
          { "value": "Monica摩托主题咖啡店", "address": "嘉定区江桥镇曹安公路2409号1F，2383弄62号1F" },
          { "value": "浮生若茶（凌空soho店）", "address": "上海长宁区金钟路968号9号楼地下一层" },
          { "value": "NONO JUICE  鲜榨果汁", "address": "上海市长宁区天山西路119号" },
          { "value": "CoCo都可(北新泾店）", "address": "上海市长宁区仙霞西路" },
          { "value": "快乐柠檬（神州智慧店）", "address": "上海市长宁区天山西路567号1层R117号店铺" },
          { "value": "Merci Paul cafe", "address": "上海市普陀区光复西路丹巴路28弄6号楼819" },
          { "value": "猫山王（西郊百联店）", "address": "上海市长宁区仙霞西路88号第一层G05-F01-1-306" },
          { "value": "枪会山", "address": "上海市普陀区棕榈路" },
          { "value": "纵食", "address": "元丰天山花园(东门) 双流路267号" },
          { "value": "钱记", "address": "上海市长宁区天山西路" },
          { "value": "壹杯加", "address": "上海市长宁区通协路" },
          { "value": "唦哇嘀咖", "address": "上海市长宁区新泾镇金钟路999号2幢（B幢）第01层第1-02A单元" },
          { "value": "爱茜茜里(西郊百联)", "address": "长宁区仙霞西路88号1305室" },
          { "value": "爱茜茜里(近铁广场)", "address": "上海市普陀区真北路818号近铁城市广场北区地下二楼N-B2-O2-C商铺" },
          { "value": "鲜果榨汁（金沙江路和美广店）", "address": "普陀区金沙江路2239号金沙和美广场B1-10-6" },
          { "value": "开心丽果（缤谷店）", "address": "上海市长宁区威宁路天山路341号" },
          { "value": "超级鸡车（丰庄路店）", "address": "上海市嘉定区丰庄路240号" },
          { "value": "妙生活果园（北新泾店）", "address": "长宁区新渔路144号" },
          { "value": "香宜度麻辣香锅", "address": "长宁区淞虹路148号" },
          { "value": "凡仔汉堡（老真北路店）", "address": "上海市普陀区老真北路160号" },
          { "value": "港式小铺", "address": "上海市长宁区金钟路968号15楼15-105室" },
          { "value": "蜀香源麻辣香锅（剑河路店）", "address": "剑河路443-1" },
          { "value": "北京饺子馆", "address": "长宁区北新泾街道天山西路490-1号" },
          { "value": "饭典*新简餐（凌空SOHO店）", "address": "上海市长宁区金钟路968号9号楼地下一层9-83室" },
          { "value": "焦耳·川式快餐（金钟路店）", "address": "上海市金钟路633号地下一层甲部" },
          { "value": "动力鸡车", "address": "长宁区仙霞西路299弄3号101B" },
          { "value": "浏阳蒸菜", "address": "天山西路430号" },
          { "value": "四海游龙（天山西路店）", "address": "上海市长宁区天山西路" },
          { "value": "樱花食堂（凌空店）", "address": "上海市长宁区金钟路968号15楼15-105室" },
          { "value": "壹分米客家传统调制米粉(天山店)", "address": "天山西路428号" },
          { "value": "福荣祥烧腊（平溪路店）", "address": "上海市长宁区协和路福泉路255弄57-73号" },
          { "value": "速记黄焖鸡米饭", "address": "上海市长宁区北新泾街道金钟路180号1层01号摊位" },
          { "value": "红辣椒麻辣烫", "address": "上海市长宁区天山西路492号" },
          { "value": "(小杨生煎)西郊百联餐厅", "address": "长宁区仙霞西路88号百联2楼" },
          { "value": "阳阳麻辣烫", "address": "天山西路389号" },
          { "value": "南拳妈妈龙虾盖浇饭", "address": "普陀区金沙江路1699号鑫乐惠美食广场A13" }
        ];
      },
      querySearchAsync(queryString, cb) {
        var restaurants = this.restaurants;
        var results = queryString ? restaurants.filter(this.createStateFilter(queryString)) : restaurants;

        clearTimeout(this.timeout);
        this.timeout = setTimeout(() => {
          cb(results);
        }, 3000 * Math.random());
      },
      createStateFilter(queryString) {
        return (state) => {
          return (state.value.toLowerCase().indexOf(queryString.toLowerCase()) === 0);
        };
      },
      handleSelect(item) {
        console.log(item);
      }

  }
};
</script>

<style lang="scss">
/**这里是上传样式 */
  .baseInfo-comp1{

    .el-upload{
      width:100%;
      height: 317px;
      background-color: #f7f8f9;
    }
    .avatar-uploader .el-upload {
      border: 1px dashed #d9d9d9;
      border-radius: 6px;
      cursor: pointer;
      position: relative;
      overflow: hidden;
    }
    .avatar-uploader .el-upload:hover {
      border-color: #409EFF;
    }
    .avatar-uploader-icon {
      font-size: 28px;
      color:#2d8cf0;;
      text-align: center;
    }
    .avatar {
      width: 100%;
      height: 100%;
      display: block;
    }
    .noImgWrap{
      border: 1px dashed #d9d9d9;
      border-radius: 6px;
      display: inline-block;
      text-align: center;
      cursor: default;
      position: relative;
      overflow: hidden;
      width: 100%;
      height: 317px;
      background-color: #f7f8f9;
    }
    .upload-main2{
      padding: 32px 0 66px 0;
      // display: flex;
      // flex-direction: column;
      // justify-content: center;
      // align-items: center;
      .upload-title{
        	font-family: MicrosoftYaHei;
          font-size: 14px;
          font-weight: normal;
          font-stretch: normal;
          line-height: 14px;
          letter-spacing: 0px;
          color: #333333;
          padding-bottom: 35px;
      }

      .guihui{
        padding-bottom: 30px;
        padding-top: 11px;
      }
       .upload-content{
          width: 118px;
          height: 139px;
          margin: 0 auto 32px;
          background: url("./../../../../../assets/images/baseInfo/uploadBg.png");
          background-size:cover;
      }
      .upload-tips{
        	font-family: MicrosoftYaHei;
          font-size: 13px;
          font-weight: normal;
          font-stretch: normal;
          line-height: 13px;
          letter-spacing: 0px;
          color: #999999;
      }
    }
   



  /** 所属载体样式*/
   .sszt-wrap{
     .el-autocomplete{
       width:100%;
     }
   }

  }
  


  

</style>


