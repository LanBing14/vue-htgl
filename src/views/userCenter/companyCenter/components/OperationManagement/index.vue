<template>
  <el-row class="credit-tab-content">
    <h4 class="flex">
      <span class="flex-primary">公司治理和内控制度</span>
      <el-button size="mini" @click="addFormData5">{{ formData5.id ? '编辑' : '新增' }}</el-button>
    </h4>
    <el-row class="area">
      <Comp5 :id="id" :data="formData5" is-view></Comp5>
    </el-row>
    <Dialog
      ref="drawer"
      :visible.sync="visible5"
      :onOk="handleOk5"
      :title="(modelStatus5 ? '新增' : '修改')+'公司治理和内控制度'"
      width="500px"
    >
      <Comp5 ref="addForm5" :id="id" :modelStatus="modelStatus5" :data="formData5"></Comp5>
    </Dialog>

    <h4 class="flex">
      <span class="flex-primary">高层管理人员</span>
      <el-button size="mini" @click="addFormData6">新增</el-button>
    </h4>
    <el-row class="area">
      <el-table :data="formData6" row-key="id">
        <template slot="empty">
          <img src="../../../../../assets/images/bg/no.jpg" alt="">
        </template>
        <el-table-column label="序号" type="index" width="60"></el-table-column>
        <el-table-column label="姓名" prop="name" width="150"></el-table-column>
        <el-table-column label="职务" prop="job" width="200"></el-table-column>
        <el-table-column label="工作简历" prop="resume"></el-table-column>
        <el-table-column label="操作" width="100">
          <template slot-scope="scope">
            <i class="el-icon-edit" style="cursor: pointer" @click="editFormData6(scope.row)"></i>
            <i class="el-icon-delete" style="cursor: pointer" @click="delFormData6(scope.row)"></i>
          </template>
        </el-table-column>
      </el-table>
    </el-row>
    <Dialog
      ref="drawer"
      :visible.sync="visible6"
      :onOk="handleOk6"
      :title="(modelStatus6 ? '新增' : '修改')+'高层管理人员'"
      width="500px"
    >
      <Comp6 ref="addForm6" :id="id" :modelStatus="modelStatus6" :data="formData6Selected"></Comp6>
    </Dialog>

    <h4 class="flex">
      <span class="flex-primary">员工构成信息</span>
    </h4>
    <h5 class="flex">
      <span class="flex-primary">项目信息</span>
      <span>
        <el-button size="mini" @click="addFormData7_1">新增</el-button>
      </span>
    </h5>
    <el-row class="area">
      <template>
        <el-table :data="formData7.data1">
          <template slot="empty">
            <img src="../../../../../assets/images/bg/no.jpg" alt="">
          </template>
          <el-table-column label="起止时间" prop="total">
            <template slot-scope="scope">{{ scope.row.beginDate }} - {{ scope.row.endDate }}</template>
          </el-table-column>
          <el-table-column label="项目名称" prop="projectName"></el-table-column>
          <el-table-column label="项目人员总数(人)" prop="peopleNum"></el-table-column>
          <el-table-column label="薪酬总额(万元)" prop="totalSalary"></el-table-column>
          <el-table-column label="流动率(%)" prop="turnoverRate"></el-table-column>
          <el-table-column label prop="lease" width="80">
            <template slot-scope="scope">
              <i class="el-icon-edit" style="cursor: pointer" @click="editFormData7_1(scope.row)"></i>
              <i class="el-icon-delete" style="cursor: pointer" @click="delFormData7_1(scope.row)"></i>
            </template>
          </el-table-column>
        </el-table>
      </template>
    </el-row>
    <Dialog
      ref="drawer"
      :visible.sync="visible7_1"
      :key='key'
      :onOk="handleOk7_1"
      :title="(modelStatus7_1 ? '新增' : '修改')+'项目信息'"
      width="500px"
    >
      <Comp7_1 ref="addForm7_1" :id="id" :modelStatus="modelStatus7_1" :data="formData7Selected.data1"></Comp7_1>
    </Dialog>
    <h5 class="flex">
      <span class="flex-primary">岗位构成</span>
      <span>
        <el-button v-if="!formData7.data2.id" size="mini" @click="addFormData7_2">新增</el-button>
      </span>
    </h5>
    <el-row class="area">
      <Comp7_2 :id="id" :data="formData7.data2" is-view class="comp7-wrap">
        <div class="action" v-if="formData7.data2.id">
          <i class="el-icon-edit" style="cursor: pointer" @click="editFormData7_2()"></i>
        </div>
      </Comp7_2>
    </el-row>
    <Dialog
      ref="drawer"
      :visible.sync="visible7_2"
      :onOk="handleOk7_2"
      :title="(modelStatus7_2 ? '新增' : '修改')+'岗位构成'"
      width="500px"
    >
      <Comp7_2 ref="addForm7_2" :id="id" :modelStatus="modelStatus7_2" :data="formData7.data2"></Comp7_2>
    </Dialog>
    <h5 class="flex">
      <span class="flex-primary">学历构成</span>
      <span>
        <el-button v-if="!formData7.data3.id" size="mini" @click="addFormData7_3">新增</el-button>
      </span>
    </h5>
    <el-row class="area">
      <Comp7_3 :id="id" :data="formData7.data3" is-view class="comp7-wrap">
        <div class="action" v-if="formData7.data3.id">
          <i class="el-icon-edit" style="cursor: pointer" @click="editFormData7_3()"></i>
        </div>
      </Comp7_3>
    </el-row>
    <Dialog
      ref="drawer"
      :visible.sync="visible7_3"
      :onOk="handleOk7_3"
      :title="(modelStatus7_3 ? '新增' : '修改')+'学历构成'"
      width="500px"
    >
      <Comp7_3 ref="addForm7_3" :id="id" :modelStatus="modelStatus7_3" :data="formData7.data3"></Comp7_3>
    </Dialog>
  </el-row>
</template>

<script type="text/jsx">
import Comp0 from "./Comp0";
import Comp1 from "./Comp1"; // 经营环境
import Comp2_1 from "./Comp2_1"; // 生产情况--生产、经营场所
import Comp2_2 from "./Comp2_2"; // 生产情况--经营场所视察情况
import Comp3_1 from "./Comp3_1"; // 主营业务及收入情况--业务概况
import Comp3_2 from "./Comp3_2"; // 主营业务及收入情况--收入构成
import Comp4_1 from "./Comp4_1"; // 供应商/客户--供应商
import Comp4_2 from "./Comp4_2"; // 供应商/客户--客户
import Comp5 from "./Comp5"; // 公司治理和内控制度
import Comp6 from "./Comp6"; // 高层管理人员
import Comp7_1 from "./Comp7_1"; // 员工构成信息--项目信息
import Comp7_2 from "./Comp7_2"; // 员工构成信息--岗位构成
import Comp7_3 from "./Comp7_3"; // 员工构成信息--学历构成
import FollowUpInves from "@/views/creditManagement/customerProfile/customerManagement/FollowUpInves.vue";
import {
  Api_CustomerArchivesGetEnvrmt, // 经营环境--信息
  Api_CustomerArchivesSaveEnvrmt, // 经营环境--保存
  Api_CustomerArchivesGetPlace, // 生产情况--生产、经营场所--信息
  Api_CustomerArchivesSavePlace, // 生产情况--生产、经营场所--保存
  Api_CustomerArchivesEditPlace, // 生产情况--生产、经营场所--编辑
  Api_CustomerArchivesGetPlaceInspect, // 生产情况--经营场所视察情况--信息
  Api_CustomerArchivesSavePlaceInspect, // 生产情况--经营场所视察情况--保存
  Api_CustomerArchivesEditPlaceInspect, // 生产情况--经营场所视察情况--编辑
  Api_CustomerArchivesGetBusinessOverview, // 主营业务及收入情况--业务概况--信息
  Api_CustomerArchivesSaveBusinessOverview, // 主营业务及收入情况--业务概况--保存
  Api_CustomerArchivesEditBusinessOverview, // 主营业务及收入情况--业务概况--编辑
  Api_CustomerArchivesGetIncome, // 主营业务及收入情况--收入构成--信息
  Api_CustomerArchivesSaveIncome, // 主营业务及收入情况--收入构成--保存
  Api_CustomerArchivesEditIncome, // 主营业务及收入情况--收入构成--编辑
  Api_CustomerArchivesGetSupplierList, // 供应商/客户--供应商--列表信息
  Api_CustomerArchivesSaveSupplier, // 供应商/客户--供应商--保存
  Api_CustomerArchivesEditSupplier, // 供应商/客户--供应商--编辑
  Api_CustomerArchivesDeleteSupplier, // 供应商/客户--供应商--删除
  Api_CustomerArchivesGetCustomerList, // 供应商/客户--客户--列表信息
  Api_CustomerArchivesAddCustomer, // 供应商/客户--客户--保存
  Api_CustomerArchivesEditCustomer, // 供应商/客户--客户--编辑
  Api_CustomerArchivesDeleteCustomer, // 供应商/客户--客户--删除
  Api_CustomerArchivesGetInternalCon, // 公司治理和内控制度--信息
  Api_CustomerArchivesSaveInternalCon, // 公司治理和内控制度--保存
  Api_CustomerArchivesEditInternalCon, // 公司治理和内控制度--编辑
  Api_CustomerArchivesGetTopManagersList, // 公司治理和内控制度--列表信息
  Api_CustomerArchivesAddTopManagers, // 公司治理和内控制度--保存
  Api_CustomerArchivesEditTopManagers, // 公司治理和内控制度--编辑
  Api_CustomerArchivesDeleteTopManagers, // 公司治理和内控制度--删除
  Api_CustomerArchivesProjectList, // 员工构成信息--项目信息--列表信息
  Api_CustomerArchivesAddProjects, // 员工构成信息--项目信息--保存
  Api_CustomerArchivesEditProjects, // 员工构成信息--项目信息--编辑
  Api_CustomerArchivesDeleteProject, // 员工构成信息--项目信息--删除
  Api_CustomerArchivesGetPostComposition, // 员工构成信息--岗位构成--信息
  Api_CustomerArchivesSavePostComposition, // 员工构成信息--岗位构成--保存
  Api_CustomerArchivesEditPostComposition, // 员工构成信息--岗位构成--编辑
  Api_CustomerArchivesGetEduComposition, // 员工构成信息--学历构成--信息
  Api_CustomerArchivesSaveEduComposition, // 员工构成信息--学历构成--保存
  Api_CustomerArchivesEditEduComposition, // 员工构成信息--学历构成--编辑
  Api_archivesGetFiles,
} from "@/api/creditManagement/customerProfile/customerManagemCustomer/dueDiligence";
import {
  Api_trackingSurveyTable,
  Api_trackingSurveyDel,
  Api_trackingSurveyState,
} from "@/api/creditManagement/customerProfile/customerManagement.js";

export default {
  name: "DueDiligence",
  filters: {
    filterType(value) {
      if (value === "0") {
        return "企业占地面积(平方米)";
      } else if (value === "1") {
        return "办公用房面积(平方米)";
      } else if (value === "2") {
        return "房产原值或年租金(平方米)";
      }
    },
  },
  components: {
    Comp0,
    Comp1,
    Comp2_1,
    Comp2_2,
    Comp3_1,
    Comp3_2,
    Comp4_1,
    Comp4_2,
    Comp5,
    Comp6,
    Comp7_1,
    Comp7_2,
    Comp7_3,
    FollowUpInves,
  },
  props: {
    id: String, // 客户id，用于查询详情数据
    companyName: String,
  },
  data() {
    return {
      key:0,
      expandRowKeys: [],
      formData1: {}, // 经营环境
      formData2: {
        // 生产情况
        data1: [], // 生产、经营场所
        data2: {}, // 经营场所视察情况
      },
      formData3: {
        // 主营业务及收入情况
        data1: {}, // 业务概况
        data2: [], // 收入构成
      },
      formData4: {
        // 供应商/客户
        data1: [], // 前10大供应商
        data2: [], // 前10大客户
      },
      formData5: {}, // 公司治理和内控制度
      formData6: [], // 高层管理人员
      formData7: {
        // 员工构成信息
        data1: [], // 项目信息
        data2: {}, // 岗位构成
        data3: {}, // 学历构成
      },
      formData2Selected: {
        // 生产情况--选中的数据
        data1: {}, // 生产、经营场所
      },
      formData3Selected: {
        // 主营业务及收入情况--选中的数据
        data2: {}, // 收入构成
      },
      formData4Selected: {
        // 供应商/客户--选中的数据
        data1: {}, // 供应商
        data2: {}, // 客户
      },
      formData6Selected: {}, // 高层管理人员--选中的数据
      formData7Selected: {
        // 员工构成信息--选中的数据
        data1: {}, // 项目信息
      },
      visible1: false, // 经营环境--弹框
      visible2_1: false, // 生产情况--生产、经营场所--弹框
      visible2_2: false, // 生产情况--经营场所视察情况--弹框
      visible3_1: false, // 主营业务及收入情况--业务概况--弹框
      visible3_2: false, // 主营业务及收入情况--收入构成--弹框
      visible4_1: false, // 供应商/客户--供应商--弹框
      visible4_2: false, // 供应商/客户--客户--弹框
      visible5: false, // 公司治理和内控制度--弹框
      visible6: false, // 高层管理人员--弹框
      visible7_1: false, // 员工构成信息--项目信息--弹框
      visible7_2: false, // 员工构成信息--岗位构成--弹框
      visible7_3: false, // 员工构成信息--学历构成--弹框
      modelStatus2_1: true, // 生产情况--生产、经营场所--新增或修改
      modelStatus2_2: true, // 生产情况--经营场所视察情况--新增或修改
      modelStatus3_1: true, // 主营业务及收入情况--业务概况--新增或修改
      modelStatus3_2: true, // 主营业务及收入情况--收入构成--新增或修改
      modelStatus4_1: true, // 供应商/客户--供应商--新增或修改
      modelStatus4_2: true, // 供应商/客户--客户--新增或修改
      modelStatus5: true, // 公司治理和内控制度--新增或修改
      modelStatus6: true, // 高层管理人员--新增或修改
      modelStatus7_1: true, // 员工构成信息--项目信息--新增或修改
      modelStatus7_2: true, // 员工构成信息--岗位构成--新增或修改
      modelStatus7_3: true, // 员工构成信息--学历构成--新增或修改
      trackingSurveyCol: [
        {
          label: "风险类型",
          key: "type",
          width: 100,
          render: (h, data) => {
            return data === "1"
              ? "经营管理"
              : data === "2"
              ? "财务状态"
              : data === "3"
              ? "宏观经济"
              : data === "4"
              ? "行业风险"
              : data === "5"
              ? "区域风险"
              : data === "6"
              ? "供应链风险"
              : data === "7"
              ? "其他"
              : "-";
          },
        },
        {
          label: "风险等级",
          width: 80,
          key: "riskRank",
          render: (h, data) => {
            return data === "1"
              ? "高风险"
              : data === "2"
              ? "中风险"
              : data === "3"
              ? "低风险"
              : data === "4"
              ? "不详"
              : "-";
          },
        },
        { label: "风险描述", key: "remark", props: { "show-overflow-tooltip": true } },
        { label: "信息来源", key: "source", props: { "show-overflow-tooltip": true } },
        { label: "可信度", key: "credibility", width: 80 },
        {
          label: "提示时间",
          key: "reminderTime",
          width: 100,
          render: (h, data) => (data ? this.$dateFormat(data) : "-"),
        },
        {
          label: "状态",
          key: "state",
          width: 120,
          render: (h, data, row) => {
            return (
              <el-switch
                value={data}
                active-color="#409eff"
                inactive-color="#dcdfe6"
                onChange={this.stateChange.bind(this, row)}
              ></el-switch>
            );
          },
        },
        {
          label: "操作",
          width: 80,
          key: "",
          render: (h, data, row) => {
            return (
              <button-dropdown
                data={[
                  row.editable && {
                    text: "编辑",
                    click: this.followUpInvesEdit.bind(this, row),
                  },
                  row.editable && {
                    text: "附件下载",
                    click: this.followUpInvesDown.bind(this, row),
                  },
                  row.editable && {
                    text: "删除",
                    click: this.followUpInvesDel.bind(this, row),
                  },
                ]}
              />
            );
          },
        },
      ],
    };
  },
  mounted() {
    // this.getTrackingSurveyTable();
    this.getFormData1();
    this.getFormData2_1();
    this.getFormData2_2();
    this.getFormData3_1();
    this.getFormData3_2();
    this.getFormData4_1();
    this.getFormData4_2();
    this.getFormData5();
    this.getFormData6();
    this.getFormData7_1();
    this.getFormData7_2();
    this.getFormData7_3();
  },
  methods: {
    // getTrackingSurveyTable() {
    //   this.$refs.ref_tableFollow.fetchData();
    // },
    Api_trackingSurveyTable,
    /* 经营环境--start */
    // 信息
    getFormData1() {
      Api_CustomerArchivesGetEnvrmt(this.id).then((res) => {
        this.formData1 = res || {};
      });
    },
    // 确认
    handleOk1() {
      this.$refs.addForm1.validate().then((data) => {
        const loading = this.$openLoading();
        Api_CustomerArchivesSaveEnvrmt(data)
          .then((res) => {
            loading.close();
            this.getFormData1();
            this.visible1 = false;
            this.$message.success(res);
          })
          .catch((e) => {
            loading.close();
            this.$message.error(e);
          });
      });
    },
    // 关闭
    // onClose1() {
    // this.$refs.addForm1.reset();
    // },
    /* 经营环境--end */
    /* 生产情况--生产、经营场所--start */
    // 信息
    getFormData2_1() {
      // 生产、经营场所--信息
      Api_CustomerArchivesGetPlace(this.id).then((res) => {
        this.formData2.data1 = res || [];
      });
    },
    // 确认
    handleOk2_1() {
      this.$refs.addForm2_1.validate().then((data) => {
        const loading = this.$openLoading();
        const id = data.id;
        delete data.id;
        const promiseRes = this.modelStatus2_1
          ? Api_CustomerArchivesSavePlace(data)
          : Api_CustomerArchivesEditPlace(id, data);
        promiseRes
          .then((res) => {
            loading.close();
            this.getFormData2_1();
            this.visible2_1 = false;
            this.$message.success(res);
          })
          .catch((e) => {
            loading.close();
            this.$message.error(e);
          });
      });
    },
    // 打开新增
    addFormData2_1() {
      this.modelStatus2_1 = true;
      this.formData2Selected.data1 = {};
      this.visible2_1 = true;
    },
    // 打开编辑
    editFormData2_1(row) {
      this.modelStatus2_1 = false;
      this.formData2Selected.data1 = row;
      this.visible2_1 = true;
    },
    // 关闭
    // onClose2_1() {
    // this.$refs.addForm2_1.reset();
    // },
    /* 生产情况--生产、经营场所--end */
    /* 生产情况--经营场所视察情况--start */
    getFormData2_2() {
      // 经营场所视察情况--信息
      Api_CustomerArchivesGetPlaceInspect(this.id).then((res) => {
        this.formData2.data2 = res || {};
      });
    },
    // 确认
    handleOk2_2() {
      this.$refs.addForm2_2.validate().then((data) => {
        const loading = this.$openLoading();
        const id = data.id;
        delete data.id;
        const promiseRes = this.modelStatus2_2
          ? Api_CustomerArchivesSavePlaceInspect(data)
          : Api_CustomerArchivesEditPlaceInspect(id, data);
        promiseRes
          .then((res) => {
            loading.close();
            this.getFormData2_2();
            this.visible2_2 = false;
            this.$message.success(res);
          })
          .catch((e) => {
            loading.close();
            this.$message.error(e);
          });
      });
    },
    // 打开新增
    addFormData2_2() {
      this.modelStatus2_2 = true;
      this.visible2_2 = true;
    },
    // 打开编辑
    editFormData2_2() {
      this.modelStatus2_2 = false;
      this.visible2_2 = true;
    },
    // 关闭
    // onClose2_2() {
    // this.$refs.addForm2_2.reset();
    // },
    /* 生产情况--经营场所视察情况--end */
    /* 主营业务及收入情况--业务概况--start */
    // 信息
    getFormData3_1() {
      Api_CustomerArchivesGetBusinessOverview(this.id).then((res) => {
        this.formData3.data1 = res || {};
      });
    },
    // 确认
    handleOk3_1() {
      this.$refs.addForm3_1.validate().then((data) => {
        const loading = this.$openLoading();
        const id = data.id;
        delete data.id;
        const promiseRes = this.modelStatus3_1
          ? Api_CustomerArchivesSaveBusinessOverview(data)
          : Api_CustomerArchivesEditBusinessOverview(id, data);
        promiseRes
          .then((res) => {
            loading.close();
            this.getFormData3_1();
            this.visible3_1 = false;
            this.$message.success(res);
          })
          .catch((e) => {
            loading.close();
            this.$message.error(e);
          });
      });
    },
    // 打开新增
    addFormData3_1() {
      this.modelStatus3_1 = true;
      this.visible3_1 = true;
    },
    // 打开编辑
    editFormData3_1() {
      this.modelStatus3_1 = false;
      this.visible3_1 = true;
    },
    // 关闭
    // onClose3_1() {
    // this.$refs.addForm3_1.reset();
    // },
    /* 主营业务及收入情况--业务概况--end */
    /* 主营业务及收入情况--收入构成--start */
    // 信息
    getFormData3_2() {
      Api_CustomerArchivesGetIncome(this.id).then((res) => {
        this.formData3.data2 = res || [];
        if (res) {
          this.expandRowKeys = res.map((i) => i.id);
        }
      });
    },
    // 确认
    handleOk3_2() {
      this.$refs.addForm3_2.validate().then((data) => {
        const loading = this.$openLoading();
        const id = data.id;
        delete data.id;
        const promiseRes = this.modelStatus3_2
          ? Api_CustomerArchivesSaveIncome(data)
          : Api_CustomerArchivesEditIncome(id, data);
        promiseRes
          .then((res) => {
            loading.close();
            this.getFormData3_2();
            this.visible3_2 = false;
            this.$message.success(res);
          })
          .catch((e) => {
            loading.close();
            this.$message.error(e);
          });
      });
    },
    // 打开新增
    addFormData3_2() {
      this.modelStatus3_2 = true;
      this.formData3Selected.data2 = {};
      this.visible3_2 = true;
    },
    // 打开编辑
    editFormData3_2(row) {
      this.modelStatus3_2 = false;
      this.formData3Selected.data2 = row;
      this.visible3_2 = true;
    },
    // 关闭
    // onClose3_2() {
    // this.$refs.addForm3_2.reset();
    // },
    /* 主营业务及收入情况--收入构成--end */
    /* 供应商/客户--前10大供应商--start */
    // 列表信息
    getFormData4_1() {
      Api_CustomerArchivesGetSupplierList(this.id).then((res) => {
        this.formData4.data1 = res || [];
      });
    },
    // 确认
    handleOk4_1() {
      this.$refs.addForm4_1.validate().then((data) => {
        const loading = this.$openLoading();
        const id = data.id;
        delete data.id;
        const promiseRes = this.modelStatus4_1
          ? Api_CustomerArchivesSaveSupplier(data)
          : Api_CustomerArchivesEditSupplier(id, data);
        promiseRes
          .then((res) => {
            loading.close();
            this.getFormData4_1();
            this.visible4_1 = false;
            this.$message.success(res);
          })
          .catch((e) => {
            loading.close();
            this.$message.error(e);
          });
      });
    },
    // 打开新增
    addFormData4_1() {
      if (this.formData4.data1.length > 9) {
        this.$alert("您已经添加了10个供应商，已达平台设置上限。", "提示", {
          type: "warning",
        });
        return;
      }
      this.modelStatus4_1 = true;
      this.formData4Selected.data1 = {};
      this.visible4_1 = true;
    },
    // 打开编辑
    editFormData4_1(row) {
      this.modelStatus4_1 = false;
      this.formData4Selected.data1 = row;
      this.visible4_1 = true;
    },
    // 删除
    delFormData4_1(row) {
      this.$confirm("确定要删除该条供应商记录吗？", "提示", {
        type: "warning",
      }).then(() => {
        const loading = this.$openLoading();
        Api_CustomerArchivesDeleteSupplier(row.id)
          .then((res) => {
            this.getFormData4_1();
            loading.close();
            this.$message.success(res);
          })
          .catch((e) => {
            loading.close();
            this.$message.error(e);
          });
      });
    },
    // 关闭
    // onClose4_1() {
    // this.$refs.addForm4_1.reset();
    // },
    /* 供应商/客户--前10大供应商--end */
    /* 供应商/客户--前10大客户--start */
    getFormData4_2() {
      Api_CustomerArchivesGetCustomerList(this.id).then((res) => {
        this.formData4.data2 = res || [];
      });
    },
    // 确认
    handleOk4_2() {
      this.$refs.addForm4_2.validate().then((data) => {
        const loading = this.$openLoading();
        const id = data.id;
        delete data.id;
        const promiseRes = this.modelStatus4_2
          ? Api_CustomerArchivesAddCustomer(data)
          : Api_CustomerArchivesEditCustomer(id, data);
        promiseRes
          .then((res) => {
            loading.close();
            this.getFormData4_2();
            this.visible4_2 = false;
            this.$message.success(res);
          })
          .catch((e) => {
            loading.close();
            this.$message.error(e);
          });
      });
    },
    // 打开新增
    addFormData4_2() {
      if (this.formData4.data2.length > 9) {
        this.$alert("您已经添加了10个客户，已达平台设置上限。", "提示", {
          type: "warning",
        });
        return;
      }
      this.modelStatus4_2 = true;
      this.formData4Selected.data2 = {};
      this.visible4_2 = true;
    },
    // 打开编辑
    editFormData4_2(row) {
      this.modelStatus4_2 = false;
      this.formData4Selected.data2 = row;
      this.visible4_2 = true;
    },
    // 删除
    delFormData4_2(row) {
      this.$confirm("确定要删除该客户记录吗？", "提示", {
        type: "warning",
      }).then(() => {
        const loading = this.$openLoading();
        Api_CustomerArchivesDeleteCustomer(row.id)
          .then((res) => {
            this.getFormData4_2();
            loading.close();
            this.$message.success(res);
          })
          .catch((e) => {
            loading.close();
            this.$message.error(e);
          });
      });
    },
    // 关闭
    // onClose4_2() {
    // this.$refs.addForm4_2.reset();
    // },
    /* 供应商/客户--前10大客户--end */
    /* 公司治理和内控制度--start */
    // 信息
    getFormData5() {
      Api_CustomerArchivesGetInternalCon(this.id).then((res) => {
        this.formData5 = res || {};
      });
    },
    // 保存
    handleOk5() {
      this.$refs.addForm5.validate().then((data) => {
        const loading = this.$openLoading();
        const id = data.id;
        delete data.id;
        const promiseRes = this.modelStatus5
          ? Api_CustomerArchivesSaveInternalCon(data)
          : Api_CustomerArchivesEditInternalCon(id, data);
        promiseRes
          .then((res) => {
            loading.close();
            this.getFormData5();
            this.visible5 = false;
            this.$message.success(res);
          })
          .catch((e) => {
            loading.close();
            this.$message.error(e);
          });
      });
    },
    addFormData5() {
      if (this.formData5.id) {
        this.modelStatus5 = false;
      } else {
        this.modelStatus5 = true;
      }
      this.visible5 = true;
    },
    // 关闭
    // onClose5() {
    // this.$refs.addForm5.reset();
    // },
    /* 公司治理和内控制度--end */
    /* 高层管理人员--start */
    // 信息
    getFormData6() {
      Api_CustomerArchivesGetTopManagersList(this.id).then((res) => {
        this.formData6 = res || {};
      });
    },
    // 保存
    handleOk6() {
 
      this.$refs.addForm6.validate().then((data) => {
        const loading = this.$openLoading();
        const id = data.id;
        delete data.id;
        const promiseRes = this.modelStatus6
          ? Api_CustomerArchivesAddTopManagers(data)
          : Api_CustomerArchivesEditTopManagers(id, data);
        promiseRes
          .then((res) => {
            loading.close();
            this.getFormData6();
            this.visible6 = false;
            this.$message.success(res);
            this.$emit('updateCount')
          })
          .catch((e) => {
            loading.close();
            this.$message.error(e);
          });
      });
    },
    // 新增
    addFormData6() {
      
      this.formData6Selected = {};
      this.modelStatus6 = true;
      this.visible6 = true;
    },
    // 编辑
    editFormData6(row) {
      this.formData6Selected = row;
      this.modelStatus6 = false;
      this.visible6 = true;
    },
    // 删除
    delFormData6(row) {
      this.$confirm("确定要删除该条高级管理人员信息吗？", "提示", {
        type: "warning",
      }).then(() => {
        const loading = this.$openLoading();
        Api_CustomerArchivesDeleteTopManagers(row.id)
          .then((res) => {
            this.getFormData6();
            loading.close();
            this.$message.success(res);
          })
          .catch((e) => {
            loading.close();
            this.$message.error(e);
          });
      });
    },
    // 关闭
    // onClose6() {
    // this.$refs.addForm6.reset();
    // },
    /* 高层管理人员--end */
    /* 项目信息--start */
    // 信息
    getFormData7_1() {
      Api_CustomerArchivesProjectList(this.id).then((res) => {
        this.formData7.data1 = res || [];
      });
    },
    // 保存
    handleOk7_1() {
      this.$refs.addForm7_1.validate().then((data) => {
        const loading = this.$openLoading();
        const id = data.id;
        delete data.id;
        const promiseRes = this.modelStatus7_1
          ? Api_CustomerArchivesAddProjects(data)
          : Api_CustomerArchivesEditProjects(id, data);
        promiseRes
          .then((res) => {
            loading.close();
            this.getFormData7_1();
            this.visible7_1 = false;
            this.$message.success(res);
          })
          .catch((e) => {
            loading.close();
            this.$message.error(e);
          });
      });
    },
    // 新增
    addFormData7_1() {
      if (this.formData7.data1.length > 9) {
        this.$alert("您已经添加了10条项目信息记录，已达平台设置上限。", "提示", {
          type: "warning",
        });
        return;
      }
   
      this.formData7Selected.data1 = {};
      this.modelStatus7_1 = true;
      this.visible7_1 = true;
    },
    // 编辑
    editFormData7_1(row) {
      this.formData7Selected.data1 = row;
      this.modelStatus7_1 = false;
      this.visible7_1 = true;
    },
    // 删除
    delFormData7_1(row) {
      this.$confirm("确定要删除该条项目信息记录吗？", "提示", {
        type: "warning",
      }).then(() => {
        const loading = this.$openLoading();
        Api_CustomerArchivesDeleteProject(row.id)
          .then((res) => {
            this.getFormData7_1();
            loading.close();
            this.$message.success(res);
          })
          .catch((e) => {
            loading.close();
            this.$message.error(e);
          });
      });
    },
    // 关闭
    // onClose7_1() {
    // this.$refs.addForm7_1.reset();
    // },
    /* 项目信息--end */
    /* 岗位构成--start */
    // 信息
    getFormData7_2() {
      Api_CustomerArchivesGetPostComposition(this.id).then((res) => {
        this.formData7.data2 = res || {};
      });
    },
    // 保存
    handleOk7_2() {
      this.$refs.addForm7_2.validate().then((data) => {
        const loading = this.$openLoading();
        const id = data.id;
        delete data.id;
        const promiseRes = this.modelStatus7_2
          ? Api_CustomerArchivesSavePostComposition(data)
          : Api_CustomerArchivesEditPostComposition(id, data);
        promiseRes
          .then((res) => {
            loading.close();
            this.getFormData7_2();
            this.visible7_2 = false;
            this.$message.success(res);
          })
          .catch((e) => {
            loading.close();
            this.$message.error(e);
          });
      });
    },
    // 新增
    addFormData7_2() {
      this.modelStatus7_2 = true;
      this.visible7_2 = true;
    },
    // 编辑
    editFormData7_2() {
      this.modelStatus7_2 = false;
      this.visible7_2 = true;
    },
    // 关闭
    // onClose7_2() {
    // this.$refs.addForm7_2.reset();
    // },
    /* 岗位构成--end */
    /* 学历构成--start */
    // 信息
    getFormData7_3() {
      Api_CustomerArchivesGetEduComposition(this.id).then((res) => {
        this.formData7.data3 = res || {};
      });
    },
    // 保存
    handleOk7_3() {
      this.$refs.addForm7_3.validate().then((data) => {
        const loading = this.$openLoading();
        const id = data.id;
        delete data.id;
        const promiseRes = this.modelStatus7_3
          ? Api_CustomerArchivesSaveEduComposition(data)
          : Api_CustomerArchivesEditEduComposition(id, data);
        promiseRes
          .then((res) => {
            loading.close();
            this.getFormData7_3();
            this.visible7_3 = false;
            this.$message.success(res);
          })
          .catch((e) => {
            loading.close();
            this.$message.error(e);
          });
      });
    },
    // 新增
    addFormData7_3() {
      this.modelStatus7_3 = true;
      this.visible7_3 = true;
    },
    // 编辑
    editFormData7_3() {
      this.modelStatus7_3 = false;
      this.visible7_3 = true;
    },
    // 关闭
    // onClose7_3() {
    // this.$refs.addForm7_3.reset();
    // },
    /* 学历构成--end */
    stateChange(row) {
      const loading = this.$openLoading();
      Api_trackingSurveyState(row.id)
        .then((res) => {
          loading.close();
          this.$message.success(res);
          this.getTrackingSurveyTable();
        })
        .catch((res) => {
          loading.close();
          this.$message.error(res);
        });
    },
    followUpInvesEdit(row) {
      this.$refs.ref_FollowUpInves.open({ id: this.id }, "edit", row);
    },
    followUpInvesDel(row) {
      this.$confirm("确定要删除该条风信跟踪调查记录吗？删除后不可恢复！", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      }).then(() => {
        const loading = this.$openLoading();
        Api_trackingSurveyDel(row.id)
          .then((res) => {
            loading.close();
            this.$message.success(res);
            this.getTrackingSurveyTable();
          })
          .catch((res) => {
            loading.close();
            this.$message.error(res);
          });
      });
    },
    followUpInvesDown(row) {
      window.open(process.env.VUE_APP_BASE_API + "/fxb/ecm/customer/archives/getFiles/" + row.id, "_blank");
    },
  },
};
</script>

<style scoped lang="scss">
.flex {
  align-items: center;
}

.h {
  display: flex;

  span {
    padding: 0 10px;
    font-size: 14px;
  }
}

/deep/ {
  .el-table__expand-column {
    display: none;
  }

  .alert {
    padding-left: 0;

    .el-alert__content {
      padding: 0;
    }

    .el-alert__description {
      width: 100%;
    }
  }

  .el-form-item__content {
    color: #888;
  }
}

.person-item {
  position: relative;
  margin-left: -20px;
  padding-left: 20px;
  padding-top: 10px;
  padding-bottom: 10px;

  & + & {
    margin-top: 20px;
  }

  &:hover {
    background-color: #eee;

    .action {
      display: block;
      right: 20px;
      top: 20px;
    }
  }

  .flex:first-child {
    margin-bottom: 10px;
  }

  .person-name {
    width: 6em;
  }

  .person-desc-con {
    color: #999;
  }
}

.action {
  position: absolute;
  top: -32px;
  right: 0;
}
.comp7-wrap {
  position: relative;
}

.area {
  margin-bottom: 20px;
}

.no-data-tip {
  text-align: center;
  margin: 30px 0;
  color: #909399;
}
h5 {
  font-size: 14px;
  margin-bottom: 15px;
}
</style>
