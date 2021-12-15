<template>
  <el-row class="credit-tab-content">
    <Comp1 :companyName="companyName" :companyId="id" :isFxb="isFxb"></Comp1>
    <!-- comp2 -->
    <h4 class="flex">
      <span class="flex-primary">软件著作权</span>
      <el-button size="mini" @click="openComp2()" v-if="!isFxb">新增</el-button>
    </h4>
    <TableWrapper
      ref="ref_tableComp2"
      :fetchDataFn="Api_GeSoftwareCopyrightsByPage"
      :query="{companyId:id}"
      :columns="col_tableComp2"
    />
    <Dialog
      :title="'软件著作权'+(statusComp2==='add'?'新增':'修改')"
      :visible.sync="visibleComp2"
      :onOk="handleSureComp2"
      width="500px"
      @close="onCloseComp2"
    >
      <el-form ref="ref_formComp2" :model="formComp2" label-width="6em" label-position="right">
        <el-form-item label="名称" prop="name" :rules="$createRules({required:true,msg:'名称'})">
          <el-input v-model="formComp2.name"></el-input>
        </el-form-item>
        <el-form-item label="登记号" prop="registerNo" :rules="$createRules({required:true,msg:'登记号'})">
          <el-input v-model="formComp2.registerNo"></el-input>
        </el-form-item>
        <el-form-item label="著作权人" prop="owner">
          <el-input v-model="formComp2.owner"></el-input>
        </el-form-item>
        <el-form-item label="登记日期" prop="registerAperDate">
          <el-date-picker
            type="date"
            v-model="formComp2.registerAperDate"
            value-format="yyyy-MM-dd"
            style="width: 100%;"
          ></el-date-picker>
        </el-form-item>
        <el-form-item label="作品类型" prop="category">
          <el-input v-model="formComp2.category"></el-input>
        </el-form-item>
        <el-form-item label="发布日期" prop="publishDate">
          <el-date-picker
            type="date"
            v-model="formComp2.publishDate"
            value-format="yyyy-MM-dd"
            style="width: 100%;"
          ></el-date-picker>
        </el-form-item>
      </el-form>
    </Dialog>
    <!-- comp3 -->
    <h4 class="flex">
      <span class="flex-primary">作品著作权</span>
      <el-button size="mini" @click="openComp3()" v-if="!isFxb">新增</el-button>
    </h4>
    <TableWrapper
      ref="ref_tableComp3"
      :fetchDataFn="Api_GeCopyrightInfoByPage"
      :query="{companyId:id}"
      :columns="col_tableComp3"
    />
    <Dialog
      :title="'作品著作权'+(statusComp3==='add'?'新增':'修改')"
      :visible.sync="visibleComp3"
      :onOk="handleSureComp3"
      width="500px"
      @close="onCloseComp3"
    >
      <el-form ref="ref_formComp3" :model="formComp3" label-width="6em" label-position="right">
        <el-form-item label="名称" prop="name" :rules="$createRules({required:true,msg:'名称'})">
          <el-input v-model="formComp3.name"></el-input>
        </el-form-item>
        <el-form-item label="登记号" prop="registerNo" :rules="$createRules({required:true,msg:'登记号'})">
          <el-input v-model="formComp3.registerNo"></el-input>
        </el-form-item>
        <el-form-item label="著作权人" prop="owner">
          <el-input v-model="formComp3.owner"></el-input>
        </el-form-item>
        <el-form-item label="登记日期" prop="registerDate">
          <el-date-picker
            type="date"
            v-model="formComp3.registerDate"
            value-format="yyyy-MM-dd"
            style="width: 100%;"
          ></el-date-picker>
        </el-form-item>
        <el-form-item label="作品类型" prop="category">
          <el-input v-model="formComp3.category"></el-input>
        </el-form-item>
        <el-form-item label="发布日期" prop="publishDate">
          <el-date-picker
            type="date"
            v-model="formComp3.publishDate"
            value-format="yyyy-MM-dd"
            style="width: 100%;"
          ></el-date-picker>
        </el-form-item>
      </el-form>
    </Dialog>
    <!-- comp4 -->
    <h4 class="flex">
      <span class="flex-primary">网站信息</span>
      <el-button size="mini" @click="openComp4()" v-if="!isFxb">新增</el-button>
    </h4>
    <TableWrapper
      ref="ref_tableComp4"
      :fetchDataFn="Api_GetWebsiteInfoByPage"
      :query="{companyId:id}"
      :columns="col_tableComp4"
    />
    <Dialog
      :title="'网站信息'+(statusComp4==='add'?'新增':'修改')"
      :visible.sync="visibleComp4"
      :onOk="handleSureComp4"
      width="500px"
      @close="onCloseComp4"
    >
      <el-form ref="ref_formComp4" :model="formComp4" label-width="6em" label-position="right">
        <el-form-item label="网址" prop="homeSite" :rules="$createRules({required:true,msg:'网址'})">
          <el-input v-model="formComp4.homeSite"></el-input>
        </el-form-item>
        <el-form-item label="网站类别" prop="typeName">
          <el-input v-model="formComp4.typeName"></el-input>
        </el-form-item>
        <el-form-item label="域名" prop="yuMing">
          <el-input v-model="formComp4.yuMing"></el-input>
        </el-form-item>
        <el-form-item label="备案" prop="beiAn">
          <el-input v-model="formComp4.beiAn"></el-input>
        </el-form-item>
        <el-form-item label="审核时间" prop="sDate">
          <el-date-picker
            type="date"
            v-model="formComp4.sDate"
            value-format="yyyy-MM-dd"
            style="width: 100%;"
          ></el-date-picker>
        </el-form-item>
      </el-form>
    </Dialog>
    <!-- comp5 -->
    <h4 class="flex">
      <span class="flex-primary">证书信息</span>
      <el-button size="mini" @click="openComp5()" v-if="!isFxb">新增</el-button>
    </h4>
    <TableWrapper
      ref="ref_tableComp5"
      :fetchDataFn="Api_GetCertificateInfoByPage"
      :query="{companyId:id}"
      :columns="col_tableComp5"
    />
    <Dialog
      :title="'证书信息'+(statusComp5==='add'?'新增':'修改')"
      :visible.sync="visibleComp5"
      :onOk="handleSureComp5"
      width="500px"
      @close="onCloseComp5"
    >
      <el-form ref="ref_formComp5" :model="formComp5" label-width="6em" label-position="right">
        <el-form-item label="证书名称" prop="name" :rules="$createRules({required:true,msg:'证书名称'})">
          <el-input v-model="formComp5.name"></el-input>
        </el-form-item>
        <el-form-item label="证书编号" prop="certificateNumber" :rules="$createRules({required:true,msg:'证书编号'})">
          <el-input v-model="formComp5.certificateNumber"></el-input>
        </el-form-item>
        <el-form-item label="发证日期" prop="startDate">
          <el-date-picker
            type="date"
            v-model="formComp5.startDate"
            value-format="yyyy-MM-dd"
            style="width: 100%;"
          ></el-date-picker>
        </el-form-item>
        <el-form-item label="证书状态" prop="currentState">
          <el-input v-model="formComp5.currentState"></el-input>
        </el-form-item>
      </el-form>
    </Dialog>
    <!-- comp6 -->
    <h4 class="flex">
      <span class="flex-primary">商标信息</span>
      <el-button size="mini" @click="openComp6()" v-if="!isFxb">新增</el-button>
    </h4>
    <TableWrapper
      ref="ref_tableComp6"
      :fetchDataFn="Api_GetTmInfoByPage"
      :query="{companyId:id}"
      :columns="col_tableComp6"
    />
    <Dialog
      :title="'商标信息'+(statusComp6==='add'?'新增':'修改')"
      :visible.sync="visibleComp6"
      :onOk="handleSureComp6"
      width="500px"
      @close="onCloseComp6"
    >
      <el-form ref="ref_formComp6" :model="formComp6" label-width="6em" label-position="right">
        <el-form-item label="商标名称" prop="name" :rules="$createRules({required:true,msg:'商标名称'})">
          <el-input v-model="formComp6.name"></el-input>
        </el-form-item>
        <el-form-item label="商标图案" prop="imageUrl">
          <Upload v-model="imageUrl" fileType="jpg,png" :limit="1" :fileSize="20"></Upload>
        </el-form-item>
        <el-form-item label="申请/注册号" prop="regNo">
          <el-input v-model="formComp6.regNo"></el-input>
        </el-form-item>
        <el-form-item label="申请日期" prop="appDate">
          <el-date-picker
            type="date"
            v-model="formComp6.appDate"
            value-format="yyyy-MM-dd"
            style="width: 100%;"
          ></el-date-picker>
        </el-form-item>
        <el-form-item label="申请人姓名" prop="applicantCn">
          <el-input v-model="formComp6.applicantCn"></el-input>
        </el-form-item>
        <el-form-item label="商标类型" prop="intClsDesc">
          <el-input v-model="formComp6.intClsDesc"></el-input>
        </el-form-item>
        <el-form-item label="商标状态" prop="status">
          <el-select v-model="formComp6.status" placeholder="请选择商标状态" style="width: 100%">
            <el-option label="有效" value="1"></el-option>
            <el-option label="无效" value="2"></el-option>
            <el-option label="待审" value="3"></el-option>
            <el-option label="不定" value="4"></el-option>
            <el-option label="未知状态" value="5"></el-option>
          </el-select>
        </el-form-item>
      </el-form>
    </Dialog>
  </el-row>
</template>

<script>
import Comp1 from "./Comp1";
import {
  Api_GeSoftwareCopyrightsByPage,
  Api_GetPatentDetailByPage,
  Api_GeCopyrightInfoByPage,
  Api_GetWebsiteInfoByPage,
  Api_GetCertificateInfoByPage,
  Api_GetTmInfoByPage,
  Api_archivesSoftwareCopyrightAdd,
  Api_archivesSoftwareCopyrightEdit,
  Api_archivesSoftwareCopyrightDel,
  Api_archivesCopyrightAdd,
  Api_archivesCopyrightEdit,
  Api_archivesCopyrightDel,
  Api_archivesWebsiteAdd,
  Api_archivesWebsiteEdit,
  Api_archivesWebsiteDel,
  Api_archivesCertificateAdd,
  Api_archivesCertificateEdit,
  Api_archivesCertificateDel,
  Api_archivesTmAdd,
  Api_archivesTmEdit,
  Api_archivesTmDel,
} from "@/api/creditManagement/customerProfile/customerManagemCustomer/knowledgePro";
import { dateFormat } from "@/utils";
import Upload from "@/components/Upload/index.vue";

export default {
  name: "KnowledgePro",
  components: { Comp1, Upload },
  filters: { dateFormat },
  props: {
    id: String, // 客户id，用于查询详情数据
    companyName: String, 
    isFxb: Boolean
  },
  data() {
    return {
      saasCode: this.$store.getters.saasCode,
      errorImg: 'this.src="' + require("../../../../../assets/images/zanwutupian.png") + '"',
      companyId: null,
      // comp2
      statusComp2: null,
      visibleComp2: false,
      formComp2: {
        name: null,
        registerNo: null,
        owner: null,
        registerAperDate: null,
        category: null,
        publishDate: null,
      },
      col_tableComp2: [
        { label: "名称", key: "name" },
        { label: "登记号", key: "registerNo" },
        { label: "著作权人", key: "owner" },
        {
          label: "登记日期",
          key: "registerAperDate",
          render: (h, data) => (data ? this.$dateFormat(data) : "-"),
        },
        { label: "作品类型", key: "category" },
        { label: "发布日期", key: "publishDate", render: (h, data) => (data ? this.$dateFormat(data) : "-") },
        {
          label: "操作",
          key: null,
          render: (h, data, row) => {
              return !this.isFxb ? [<el-link type="primary" onClick={this.editComp2.bind(this, row)}> 编辑 </el-link>,
                  <el-link type="primary" onClick={this.delComp2.bind(this, row)}> 删除 </el-link>
          ] : ""
          },
        },
      ],
      // comp3
      statusComp3: null,
      visibleComp3: false,
      formComp3: {
        name: null,
        registerNo: null,
        owner: null,
        registerDate: null,
        category: null,
        publishDate: null,
      },
      col_tableComp3: [
        { label: "名称", key: "name" },
        { label: "登记号", key: "registerNo" },
        { label: "著作权人", key: "owner" },
        {
          label: "登记日期",
          key: "registerDate",
          render: (h, data) => (data ? this.$dateFormat(data) : "-"),
        },
        { label: "作品类型", key: "category" },
        { label: "发布日期", key: "publishDate", render: (h, data) => (data ? this.$dateFormat(data) : "-") },
        {
          label: "操作",
          key: null,
          render: (h, data, row) => {
              return !this.isFxb ? [<el-link type="primary" onClick={this.editComp3.bind(this, row)}> 编辑 </el-link>,
                  <el-link type="primary" onClick={this.delComp3.bind(this, row)}> 删除 </el-link>
          ] : ""
          },
        },
      ],
      // comp4
      statusComp4: null,
      visibleComp4: false,
      formComp4: {
        homeSite: null,
        typeName: null,
        yuMing: null,
        beiAn: null,
        sDate: null,
      },
      col_tableComp4: [
        { label: "网址", key: "homeSite" },
        { label: "网站类别", key: "typeName" },
        { label: "域名", key: "yuMing" },
        { label: "网站备案/许可证号", key: "beiAn" },
        { label: "审核时间", key: "sDate", render: (h, data) => (data ? this.$dateFormat(data) : "-") },
        {
          label: "操作",
          key: null,
          render: (h, data, row) => {
              return !this.isFxb ? [<el-link type="primary" onClick={this.editComp4.bind(this, row)}> 编辑 </el-link>,
                  <el-link type="primary" onClick={this.delComp4.bind(this, row)}> 删除 </el-link>
          ] : ""
          },
        },
      ],
      // comp5
      statusComp5: null,
      visibleComp5: false,
      formComp5: {
        name: null,
        certificateNumber: null,
        startDate: null,
        currentState: null,
      },
      col_tableComp5: [
        { label: "证书名称", key: "name" },
        { label: "证书编号", key: "certificateNumber" },
        { label: "发证日期", key: "startDate", render: (h, data) => (data ? this.$dateFormat(data) : "-") },
        { label: "证书状态", key: "currentState" },
        {
          label: "操作",
          key: null,
          render: (h, data, row) => {
              return !this.isFxb ? [<el-link type="primary" onClick={this.editComp5.bind(this, row)}> 编辑 </el-link>,
                  <el-link type="primary" onClick={this.delComp5.bind(this, row)}> 删除 </el-link>
          ] : ""
          },
        },
      ],
      // comp6
      statusComp6: null,
      visibleComp6: false,
      formComp6: {
        name: null,
        regNo: null,
        appDate: null,
        applicantCn: null,
        intClsDesc: null,
        status: null,
      },
      imageUrl: [],
      col_tableComp6: [
        { label: "商标名称", key: "name" },
        {
          label: "商标图案",
          key: "imageUrl",
          render: (h, data) => {
            return <img src={data} onerror={this.errorImg} width="50" />;
          },
        },
        { label: "申请/注册号", key: "regNo" },
        { label: "申请日期", key: "appDate", render: (h, data) => (data ? this.$dateFormat(data) : "-") },
        { label: "申请人名称", key: "applicantCn" },
        { label: "商标类型", key: "intClsDesc" },
        {
          label: "商标状态",
          key: "status",
          render: (h, data) => {
            return data === "1"
              ? "有效"
              : data === "2"
              ? "无效"
              : data === "3"
              ? "待审"
              : data === "4"
              ? "不定"
              : data === "5"
              ? "未知状态"
              : "-";
          },
        },
        {
          label: "操作",
          key: null,
          render: (h, data, row) => {
              return !this.isFxb ? [<el-link type="primary" onClick={this.editComp6.bind(this, row)}> 编辑 </el-link>,
                  <el-link type="primary" onClick={this.delComp6.bind(this, row)}> 删除 </el-link>
          ] : ""
          },
        },
      ],
      // rows
      rowComp2: {},
      rowComp3: {},
      rowComp4: {},
      rowComp5: {},
      rowComp6: {},
    };
  },
  mounted() {
    this.companyId = this.id;
    this.getComp2();
    this.getComp3();
    this.getComp4();
    this.getComp5();
    this.getComp6();
  },
  methods: {
    Api_GeSoftwareCopyrightsByPage,
    Api_GeCopyrightInfoByPage,
    Api_GetWebsiteInfoByPage,
    Api_GetCertificateInfoByPage,
    Api_GetTmInfoByPage,
    getComp2() {
      this.$nextTick(() => {
        this.$refs.ref_tableComp2.fetchData();
      });
    },
    getComp3() {
      this.$nextTick(() => {
        this.$refs.ref_tableComp3.fetchData();
      });
    },
    getComp4() {
      this.$nextTick(() => {
        this.$refs.ref_tableComp4.fetchData();
      });
    },
    getComp5() {
      this.$nextTick(() => {
        this.$refs.ref_tableComp5.fetchData();
      });
    },
    getComp6() {
      this.$nextTick(() => {
        this.$refs.ref_tableComp6.fetchData();
      });
    },
    // comp2
    openComp2() {
      this.visibleComp2 = true;
      this.statusComp2 = "add";
    },
    handleSureComp2() {
      this.$refs["ref_formComp2"].validate((valid) => {
        if (valid) {
          const loading = this.$openLoading();
          const _prom =
            this.statusComp2 === "edit"
              ? Api_archivesSoftwareCopyrightEdit(this.id, this.rowComp2.id, {
                  version: this.rowComp2.version,
                  companyId: this.id,
                  companyName: this.companyName,
                  ...this.formComp2,
                  saasCode: this.saasCode,
                })
              : Api_archivesSoftwareCopyrightAdd(this.id, {
                  companyId: this.id,
                  companyName: this.companyName,
                  ...this.formComp2,
                  saasCode: this.saasCode,
                });
          _prom
            .then((res) => {
              loading.close();
              this.$message.success(res);
              this.getComp2();
              this.visibleComp2 = false;
            })
            .catch((res) => {
              loading.close();
              this.$message.error(res);
            });
        }
      });
    },
    onCloseComp2() {
      this.$refs["ref_formComp2"].resetFields();
      this.$nextTick(() => {
        this.visibleComp2 = false;
      });
    },
    // comp3
    openComp3() {
      this.visibleComp3 = true;
      this.statusComp3 = "add";
    },
    handleSureComp3() {
      this.$refs["ref_formComp3"].validate((valid) => {
        if (valid) {
          const loading = this.$openLoading();
          const _prom =
            this.statusComp3 === "edit"
              ? Api_archivesCopyrightEdit(this.id, this.rowComp3.id, {
                  version: this.rowComp3.version,
                  companyId: this.id,
                  companyName: this.companyName,
                  ...this.formComp3,
                  saasCode: this.saasCode,
                })
              : Api_archivesCopyrightAdd(this.id, {
                  companyId: this.id,
                  companyName: this.companyName,
                  ...this.formComp3,
                  saasCode: this.saasCode,
                });
          _prom
            .then((res) => {
              loading.close();
              this.$message.success(res);
              this.getComp3();
              this.visibleComp3 = false;
            })
            .catch((res) => {
              loading.close();
              this.$message.error(res);
            });
        }
      });
    },
    onCloseComp3() {
      this.$refs.ref_formComp3.resetFields();
      this.$nextTick(() => {
        this.visibleComp3 = false;
      });
    },
    // comp4
    openComp4() {
      this.visibleComp4 = true;
      this.statusComp4 = "add";
    },
    handleSureComp4() {
      this.$refs["ref_formComp4"].validate((valid) => {
        if (valid) {
          const loading = this.$openLoading();
          const _prom =
            this.statusComp4 === "edit"
              ? Api_archivesWebsiteEdit(this.id, this.rowComp4.id, {
                  version: this.rowComp4.version,
                  companyId: this.id,
                  companyName: this.companyName,
                  ...this.formComp4,
                  saasCode: this.saasCode,
                })
              : Api_archivesWebsiteAdd(this.id, {
                  companyId: this.id,
                  companyName: this.companyName,
                  ...this.formComp4,
                  saasCode: this.saasCode,
                });
          _prom
            .then((res) => {
              loading.close();
              this.$message.success(res);
              this.getComp4();
              this.visibleComp4 = false;
            })
            .catch((res) => {
              loading.close();
              this.$message.error(res);
            });
        }
      });
    },
    onCloseComp4() {
      this.$refs.ref_formComp4.resetFields();
      this.$nextTick(() => {
        this.visibleComp4 = false;
      });
    },
    // comp5
    openComp5() {
      this.visibleComp5 = true;
      this.statusComp5 = "add";
    },
    handleSureComp5() {
      this.$refs["ref_formComp5"].validate((valid) => {
        if (valid) {
          const loading = this.$openLoading();
          const _prom =
            this.statusComp5 === "edit"
              ? Api_archivesCertificateEdit(this.id, this.rowComp5.id, {
                  version: this.rowComp5.version,
                  companyId: this.id,
                  companyName: this.companyName,
                  ...this.formComp5,
                  saasCode: this.saasCode,
                })
              : Api_archivesCertificateAdd(this.id, {
                  companyId: this.id,
                  companyName: this.companyName,
                  ...this.formComp5,
                  saasCode: this.saasCode,
                });
          _prom
            .then((res) => {
              loading.close();
              this.$message.success(res);
              this.getComp5();
              this.visibleComp5 = false;
            })
            .catch((res) => {
              loading.close();
              this.$message.error(res);
            });
        }
      });
    },
    onCloseComp5() {
      this.$refs.ref_formComp5.resetFields();
      this.$nextTick(() => {
        this.visibleComp5 = false;
      });
    },
    // comp6
    openComp6() {
      this.visibleComp6 = true;
      this.statusComp6 = "add";
    },
    handleSureComp6() {
      this.$refs["ref_formComp6"].validate((valid) => {
        if (valid) {
          const loading = this.$openLoading();
          const _prom =
            this.statusComp6 === "edit"
              ? Api_archivesTmEdit(this.id, this.rowComp6.id, {
                  version: this.rowComp6.version,
                  companyId: this.id,
                  companyName: this.companyName,
                  ...this.formComp6,
                  imageUrl: this.imageUrl.map((item) => item.url)[0],
                  iconName: this.imageUrl.map((item) => item.name)[0],
                  saasCode: this.saasCode,
                })
              : Api_archivesTmAdd(this.id, {
                  companyId: this.id,
                  companyName: this.companyName,
                  ...this.formComp6,
                  imageUrl: this.imageUrl.map((item) => item.url)[0],
                  iconName: this.imageUrl.map((item) => item.name)[0],
                  saasCode: this.saasCode,
                });
          _prom
            .then((res) => {
              loading.close();
              this.$message.success(res);
              this.getComp6();
              this.visibleComp6 = false;
            })
            .catch((res) => {
              loading.close();
              this.$message.error(res);
            });
        }
      });
    },
    onCloseComp6() {
      this.$refs.ref_formComp6.resetFields();
      this.imageUrl = [];
      this.$nextTick(() => {
        this.visibleComp6 = false;
      });
    },
    // ////////// edit
    editComp2(row) {
      this.visibleComp2 = true;
      this.$nextTick(() => {
        this.$refs["ref_formComp2"].resetFields();
        this.rowComp2 = row;
        this.formComp2 = {
          name: row.name,
          registerNo: row.registerNo,
          owner: row.owner,
          registerAperDate: this.$dateFormat(row.registerAperDate),
          category: row.category,
          publishDate: this.$dateFormat(row.publishDate),
        };
        this.statusComp2 = "edit";
      });
    },
    editComp3(row) {
      this.visibleComp3 = true;
      this.$nextTick(() => {
        this.rowComp3 = row;
        this.formComp3 = {
          name: row.name,
          registerNo: row.registerNo,
          owner: row.owner,
          registerDate: this.$dateFormat(row.registerDate),
          category: row.category,
          publishDate: this.$dateFormat(row.publishDate),
        };
        this.statusComp3 = "edit";
      });
    },
    editComp4(row) {
      this.visibleComp4 = true;
      this.$nextTick(() => {
        this.rowComp4 = row;
        this.formComp4 = {
          homeSite: row.homeSite,
          typeName: row.typeName,
          yuMing: row.yuMing,
          beiAn: row.beiAn,
          sDate: this.$dateFormat(row.sDate),
        };
        this.statusComp4 = "edit";
      });
    },
    editComp5(row) {
      this.visibleComp5 = true;
      this.$nextTick(() => {
        this.rowComp5 = row;
        this.formComp5 = {
          name: row.name,
          certificateNumber: row.certificateNumber,
          startDate: this.$dateFormat(row.startDate),
          currentState: row.currentState,
        };
        this.statusComp5 = "edit";
      });
    },
    editComp6(row) {
      this.visibleComp6 = true;
      this.$nextTick(() => {
        this.rowComp6 = row;
        this.formComp6 = {
          name: row.name,
          regNo: row.regNo,
          appDate: row.appDate,
          applicantCn: row.applicantCn,
          intClsDesc: row.intClsDesc,
          status: row.status,
        };
        this.imageUrl = [{ url: row.imageUrl, name: row.iconName }];
        this.statusComp6 = "edit";
      });
    },
    // ////////// del
    delComp2(row) {
      this.$confirm("确定要删除此条记录吗？", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      }).then(() => {
        Api_archivesSoftwareCopyrightDel(this.id, row.id)
          .then((res) => {
            this.$message.success(res);
            this.getComp2();
          })
          .catch((res) => {
            this.$message.error(res);
          });
      });
    },
    delComp3(row) {
      this.$confirm("确定要删除此条记录吗？", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      }).then(() => {
        Api_archivesCopyrightDel(this.id, row.id)
          .then((res) => {
            this.$message.success(res);
            this.getComp3();
          })
          .catch((res) => {
            this.$message.error(res);
          });
      });
    },
    delComp4(row) {
      this.$confirm("确定要删除此条记录吗？", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      }).then(() => {
        Api_archivesWebsiteDel(this.id, row.id)
          .then((res) => {
            this.$message.success(res);
            this.getComp4();
          })
          .catch((res) => {
            this.$message.error(res);
          });
      });
    },
    delComp5(row) {
      this.$confirm("确定要删除此条记录吗？", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      }).then(() => {
        Api_archivesCertificateDel(this.id, row.id)
          .then((res) => {
            this.$message.success(res);
            this.getComp5();
          })
          .catch((res) => {
            this.$message.error(res);
          });
      });
    },
    delComp6(row) {
      this.$confirm("确定要删除此条记录吗？", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      }).then(() => {
        Api_archivesTmDel(this.id, row.id)
          .then((res) => {
            this.$message.success(res);
            this.getComp6();
          })
          .catch((res) => {
            this.$message.error(res);
          });
      });
    },
  },
};
</script>

<style scoped>
</style>
