<template>
  <div class="fxb-edit-table" id="contract-panel">
    <el-row class="fxb-table-tool">
      <el-form>
        <el-form-item>
          <el-row :gutter="10" type="flex" align="middle" class="marT-2">
            <el-col :span="24">
              <el-radio-group v-model="searchData.tagType" @change="tagTypeChangeEvent()">
                <el-radio :label="2">商业合同</el-radio>
                <el-radio :label="1">公共资源交易</el-radio>
                <el-radio :label="0">大宗商品交易</el-radio>
              </el-radio-group>
            </el-col>
          </el-row>

          <el-row :gutter="10" type="flex" align="middle" class="marT5 marB3">
            <el-col :span="5">
              <el-input size="small" v-model="searchData.content" placeholder="合同名称/编号"></el-input>
            </el-col>
            <el-col :span="5">
              <el-select size="small" v-model="searchData.classify" placeholder="合同分类">
                <el-option label="全部" value=" "></el-option>
                <el-option label="销售合同" value="0"></el-option>
                <el-option label="采购合同" value="1"></el-option>
              </el-select>
            </el-col>
            <el-col :span="5">
              <el-select size="small" v-model="searchData.status" placeholder="合同状态">
                <el-option label="全部" value=" "></el-option>
                <el-option label="签约" value="0"></el-option>
                <el-option label="执行中" value="1"></el-option>
                <el-option label="已完成" value="2"></el-option>
              </el-select>
            </el-col>
            <el-col :span="5">
              <el-input size="small" v-model="searchData.oppositeCompany" placeholder="对方公司名称"></el-input>
            </el-col>
            <el-col :span="5">
              <el-popover
                ref="popoverQuery"
                visible-arrow="false"
                placement="bottom-start"
                trigger="click"
                width="250"
                v-model="treeShowQuery"
              >
                <el-tree
                  :data="treeData"
                  :render-content="renderContent"
                  :props="defaultProps"
                  @node-click="handleNodeClickQuery"
                ></el-tree>
                <el-input
                  v-popover:popoverQuery
                  slot="reference"
                  size="small"
                  type="text"
                  readonly
                  placeholder="请选择所属部门"
                  v-model="searchData.deptName"
                ></el-input>
              </el-popover>
            </el-col>
          </el-row>

          <el-row :gutter="10" type="flex" align="middle">
            <el-col :span="5">
              <el-select size="small" placeholder="负责人" v-model="searchData.userName">
                <el-option
                  :key="item.id"
                  @click.native="selectClick(item.id)"
                  :value="item.realName"
                  v-for="item in departmentUsers"
                >{{ item.realName }}</el-option>
              </el-select>
            </el-col>
            <el-col :span="6">
              <el-button size="small" type="primary" @click="getPageData()" icon="el-icon-search">查询</el-button>
              <el-button size="small" icon="el-icon-refresh" @click="resetData()">重置</el-button>
            </el-col>
          </el-row>
        </el-form-item>
      </el-form>
    </el-row>

    <el-table
      class="fxb-table"
      v-loading="tableLoading"
      :data="tableData"
      :expand-row-keys="expands"
      @cell-mouse-enter="handelEnter"
      row-key="ID"
      stripe
      v-if="searchData.tagType===0"
    >
      <el-table-column label="合同名称/编号">
        <template slot-scope="scope">
          <template v-if="scope.row.CONTRACT_NAME.length > 10">
            <span
              :title="scope.row.CONTRACT_NAME"
            >{{ scope.row.CONTRACT_NAME.substring(0, 10) + '...' }}</span>
          </template>
          <template v-else>
            <span>{{ scope.row.CONTRACT_NAME }}</span>
          </template>
          <br />
          <template v-if="scope.row.CONTRACT_NO.length > 10">
            <span
              :title="scope.row.CONTRACT_NO"
            >{{ scope.row.CONTRACT_NO.substring(0, 10) + '...' }}</span>
          </template>
          <template v-else>
            <span>{{ scope.row.CONTRACT_NO }}</span>
          </template>
        </template>
      </el-table-column>
      <el-table-column label="合同分类">
        <template slot-scope="scope">
          <template v-if="scope.row.CONTRACT_CLASS === '0'">销售合同</template>
          <template v-else>采购合同</template>
        </template>
      </el-table-column>
      <el-table-column label="合同状态">
        <template slot-scope="scope">
          <template v-if="scope.row.STATUS === '0'">签约</template>
          <template v-else-if="scope.row.STATUS === '1'">执行中</template>
          <template v-else>已完成</template>
        </template>
      </el-table-column>
      <el-table-column label="我方/对方公司">
        <template slot-scope="scope">
          {{ scope.row.OWN_COMPANY }}
          <br />
          {{ scope.row.OPPOSITE_COMPANY }}
        </template>
      </el-table-column>
      <el-table-column label="负责人/部门">
        <template slot-scope="scope">
          {{ scope.row.REAL_NAME }}
          <br />
          {{ scope.row.DEPT_NAME }}
        </template>
      </el-table-column>
      <el-table-column label="全年合同量" prop="FULL_YEAR_QUANTITY"></el-table-column>
      <el-table-column label="已完成量" prop="COMPLETED_QUANTITY"></el-table-column>
      <el-table-column label="履约进度">
        <template slot-scope="scope">{{ scope.row.PERFORMANCE_PROGRESS }}%</template>
      </el-table-column>
      <el-table-column type="expand" width="1">
        <template slot-scope="props">
          <div class="row-tool-panel">
            <span @click="viewContract(props.row)">
              <svg-icon icon-class="detail" />查看
            </span>
            <span @click="editContract(props.row)" v-show="getAuthEdit()">
              <svg-icon icon-class="edit" />编辑
            </span>
          </div>
        </template>
      </el-table-column>
    </el-table>
    <el-table
      class="fxb-table"
      v-loading="tableLoading"
      :data="tableData"
      :expand-row-keys="expands"
      @cell-mouse-enter="handelEnter"
      row-key="ID"
      stripe
      v-if="searchData.tagType!==0"
    >
      <el-table-column label="合同名称/编号">
        <template slot-scope="scope">
          <template v-if="scope.row.CONTRACT_NAME.length > 10">
            <span
              :title="scope.row.CONTRACT_NAME"
            >{{ scope.row.CONTRACT_NAME.substring(0, 10) + '...' }}</span>
          </template>
          <template v-else>
            <span>{{ scope.row.CONTRACT_NAME }}</span>
          </template>
          <br />
          <template v-if="scope.row.CONTRACT_NO.length > 10">
            <span
              :title="scope.row.CONTRACT_NO"
            >{{ scope.row.CONTRACT_NO.substring(0, 10) + '...' }}</span>
          </template>
          <template v-else>
            <span>{{ scope.row.CONTRACT_NO }}</span>
          </template>
        </template>
      </el-table-column>
      <el-table-column label="合同分类">
        <template slot-scope="scope">
          <template v-if="scope.row.CONTRACT_CLASS === '0'">销售合同</template>
          <template v-else>采购合同</template>
        </template>
      </el-table-column>
      <el-table-column label="合同状态">
        <template slot-scope="scope">
          <template v-if="scope.row.STATUS === '0'">签约</template>
          <template v-else-if="scope.row.STATUS === '1'">执行中</template>
          <template v-else>已完成</template>
        </template>
      </el-table-column>
      <el-table-column label="我方/对方公司">
        <template slot-scope="scope">
          {{ scope.row.OWN_COMPANY }}
          <br />
          {{ scope.row.OPPOSITE_COMPANY }}
        </template>
      </el-table-column>
      <el-table-column label="负责人/部门">
        <template slot-scope="scope">
          {{ scope.row.REAL_NAME }}
          <br />
          {{ scope.row.DEPT_NAME }}
        </template>
      </el-table-column>
      <el-table-column label="合同金额" prop="CONTRACT_PRICE"></el-table-column>
      <el-table-column label="待收/待付" prop="WAIT_MONEY"></el-table-column>
      <el-table-column label="资金进度" :key="searchData.tagType">
        <template slot-scope="scope">{{ scope.row.FUND_PROGRESS }}%</template>
      </el-table-column>
      <el-table-column label="发票进度" :key="searchData.tagType + 11">
        <template slot-scope="scope">{{ scope.row.INVOICE_PROGRESS }}%</template>
      </el-table-column>
      <el-table-column type="expand" width="1">
        <template slot-scope="props">
          <div class="row-tool-panel">
            <span @click="viewContract(props.row)">
              <svg-icon icon-class="detail" />查看
            </span>
            <span @click="editContract(props.row)" v-show="getAuthEdit()">
              <svg-icon icon-class="edit" />编辑
            </span>
          </div>
        </template>
      </el-table-column>
    </el-table>

    <el-pagination
      class="fxb-page"
      v-loading="tableLoading"
      v-show="totalRecords>0"
      :total="totalRecords"
      :page-size="pageSize"
      :current-page.sync="pageNo"
      @current-change="changeCurrentPage"
    />
  </div>
</template>

<script>
import {
  Api_GetPageList,
  Api_GetUserByDeptId,
  Api_GetDepartListUser
} from "@/api/userCenter/contractManage";
import { getAuthEdit } from "@/utils/auth";

export default {
  data() {
    return {
      // 部门树 数据
      treeData: [],
      defaultProps: {
        children: "DEPART_CHILD_LIST",
        label: "DEPT_NAME"
      },
      departmentUsers: [],
      treeShowQuery: false,
      expands: [],
      // 列表数据
      tableLoading: false,
      tableData: [],
      pageNo: 1,
      pageSize: 10,
      totalRecords: 1,
      searchData: {
        tagType: 2,
        content: "",
        classify: "",
        status: "",
        oppositeCompany: "",
        deptName: "",
        deptId: "",
        userName: "",
        userId: ""
      },
      contractVisible: false,
      rules: {},
      dialogImageUrl: "",
      dialogVisible: false,
      contractForm: {
        casenum: "", // 案号
        casename: "", // 案件名称
        type: "", // 案件身份
        court: "", // 执行法院
        underly: "", // 执行标的
        publishtime: "", // 发布日期
        desc: "" // 案由
      }
    };
  },
  mounted() {
    // 获取部门树
    Api_GetDepartListUser().then(res => {
      if (res.stateCode === "1") {
        this.treeData = res.data;
      }
    });
    this.getPageData();
  },
  methods: {
    // 用户选择
    selectClick(id) {
      this.searchData.userId = id;
    },
    handleNodeClickQuery(item) {
      this.searchData.deptName = item.DEPT_NAME;
      this.searchData.deptId = item.ID;
      Api_GetUserByDeptId({
        deptId: item.ID
      }).then(res => {
        if (res.stateCode === "1") {
          this.searchData.userName = "";
          this.departmentUsers = res.data;
          this.treeShowQuery = false;
        } else {
          this.$message.warning("获取部门人员失败");
        }
      });
    },
    getAuthEdit() {
      return getAuthEdit();
    },
    handelEnter(row, column, cell, event) {
      const cindex = this.expands.indexOf(row.ID);
      if (cindex < 0) {
        this.expands.shift();
        this.expands.push(row.ID);
      }
    },
    tagTypeChangeEvent() {
      this.tableData = [];
      this.resetData();
      this.getPageData();
    },
    // 重置搜索数据
    resetData() {
      this.searchData.content = "";
      this.searchData.classify = "";
      this.searchData.status = "";
      this.searchData.oppositeCompany = "";
      this.searchData.deptName = "";
      this.searchData.deptId = "";
      this.searchData.userName = "";
      this.searchData.userId = "";
      this.departmentUsers = [];
    },
    getPageData() {
      this.tableLoading = true;
      Api_GetPageList(
        this.pageNo,
        this.pageSize,
        this.searchData.tagType,
        this.searchData.content,
        this.searchData.classify,
        this.searchData.status,
        this.searchData.oppositeCompany,
        this.searchData.deptId,
        this.searchData.userId
      ).then(data => {
        this.tableLoading = false;
        if (data.stateCode === "1") {
          this.pageNo = data.data.currentPage;
          this.pageSize = data.data.pageSize;
          this.totalRecords = data.data.totalRecords;
          this.tableData = data.data.list;
        } else if (data.stateCode === "80205") {
          // 权限不够
          // this.$message.warning('您尚未完成企业认证，当前仅可查看');
          this.$confirm("您尚未完成企业认证，当前仅可查看", "提示", {
            showCancelButton: true,
            confirmButtonText: "前往认证",
            cancelButtonText: "取消",
            type: "warning"
          }).then(() => {
            this.$router.push({
              path: "/userCenter/setting/basicinfo"
            });
          });
        } else {
          this.$message.error("服务器偷懒了");
        }
      });
    },
    changeCurrentPage() {
      this.getPageData();
    },
    viewContract(row) {
      this.$router.push({
        path: "/userCenter/contract/contractinfo",
        query: {
          id: row.ID,
          route: "contract"
        }
      });
    },
    editContract(row) {
      this.$router.push({
        path: "/userCenter/contract/contractadd",
        query: {
          id: row.ID
        }
      });
    },
    renderContent(h, { node, data }) {
      let name = data.DEPT_NAME;
      if (data.DEPT_NAME.length > 11) {
        name = data.DEPT_NAME.substring(0, 11) + "...";
      }
      return (
        <span class="custom-tree-node" title={data.DEPT_NAME}>
          {" "}
          {name}{" "}
        </span>
      );
    }
  }
};
</script>

<style lang="scss">
#contract-panel {
  .el-dialog__body {
    height: 360px;
    overflow-x: hidden;
    overflow-y: auto;
  }

  .el-dialog__footer {
    text-align: center;
  }
}
</style>
