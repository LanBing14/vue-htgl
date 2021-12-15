<template>
  <div class="tableWrapper">
     <span class="pageText" v-show="showTotalCount">显示第 {{total?currentPage:0}} 至 {{total}} 项结果，共 {{ total }}项</span>
    <div class="tool-wrap flex">
      <div class="flex-primary">
        <!--table工具按钮-->
        <slot name="tool">
          <el-button
            v-for="(el, index) in toolActions"
            :key="index"
            type="primary"
            class="tool-btn"
            plain
            @click="el.click"
          >
            <i v-if="el.icon" :class="el.icon" class="iconfont"></i>
            {{ el.text }}
          </el-button>
        </slot>
      </div>
      
      <div
        v-if="filterGroup"
        style="padding: 0 0 10px;margin-right: -10px;text-align: right;cursor:pointer;"
      >
        <el-checkbox-group v-model="filterOptions">
          <el-dropdown :hide-on-click="false" class="el-dropdown-link">
            <el-button type="primary">
              列筛选
              <i class="el-icon-arrow-down el-icon--right"></i>
            </el-button>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item v-for="(el, index) in columns" :key="index">
                <el-checkbox :label="index">{{ el.label }}</el-checkbox>
              </el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </el-checkbox-group>
      </div>
    </div>
    <el-table
      ref="table"
      v-loading="listLoading"
      element-loading-text="拼命加载中"
      element-loading-spinner="el-icon-loading"
      :data="list"
      :highlight-current-row="highlight"
      :rowClassName="rowClassName"
      row-key="id"
      v-bind="tableProps"
      :header-cell-style="tableHeaderColor"
      style="width: 100%;"
      stripe
      @current-change="currentChange"
      @row-click="rowClick"
      @sort-change="sortChange"
      @select="onSelect"
      @select-all="onSelectAll"
    >
      <template slot="empty">
        <img src="../../assets/images/bg/no.jpg" alt="" style="width: 300px;height:280px">
      </template>

      <el-table-column v-if="radio" align="center" width="45">
        <template slot-scope="scope">
          <el-radio
            :label="scope.row.id"
            v-model="scope.row.checked"
            @change="onRadioChange($event, scope.row)"
          >
            <span></span>
          </el-radio>
        </template>
      </el-table-column>
      <el-table-column v-if="checkbox" type="selection" align="center" width="45" />
      <el-table-column
        :index="getTableIndex"
        :label="indexLabel"
        type="index"
        align="center"
        :width="serialWidth"
        v-if="isShowIndex"
        show-overflow-tooltip
      >
        <!-- <template slot-scope="scope"> 
          {{getTableIndex(scope.$index)}}
        </template> -->
      
      </el-table-column>
      <el-table-column v-if="expand" class="expandColumn" type="expand" align="center" :width="expandWshow? 'auto':1">
        <template slot-scope="scope">
          <slot :props="scope.row" />
        </template>
      </el-table-column>
      <el-table-column
        v-for="(column, index) in columnsData"
        :key="index"
        :label="column.label"
        :prop="column.key"
        :width="column.width"
        :align="(column.align || 'center')"
        :header-align="(column.align || 'center')"
        v-bind="column.props"
        show-overflow-tooltip
      >
        <template slot-scope="scope">
          <Render
            v-if="column.render"
            :row="scope.row"
            :index="scope.$index"
            :field="column.key"
            :render="column.render"
          />
          <template v-else>{{ scope.row[column.key]?scope.row[column.key]:'-' }}</template>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      v-if="pagination && total>0"
      :total="total"
      :current-page.sync="currentPage"
      :page-size.sync="pageSize"
      :page-sizes="pageSizes"
      background
      class="tableWrapper-pagination"
      layout="prev, pager, next"
      @size-change="fetchData"
      @current-change="fetchData"
    ></el-pagination>
  </div>
</template>
<script>
import Pagination from "@/components/Pagination"; // Secondary package based on el-pagination
import Render from "./render";
import { isObject } from "lodash";

export default {
  name: "TableWrapper",
  components: { Pagination, Render },
  props: {
    // 传递给el-table的属性
    tableProps: Object,
    // 传过来的数据，如果有则不进行接口调用
    data: {
      type: Array,
      default: () => null
    },
    // 获取数据的接口
    fetchDataFn: {
      type: Function,
      default: () => null
    },
    // 接口查询条件
    query: {
      type: Object,
      default: () => ({})
    },
    // 定义显示列的相关配置
    columns: {
      type: Array,
      default: () => []
    },
    // 是否处于加载中
    loading: {
      type: Boolean,
      default: () => false
    },
    // 是否开启多选
    checkbox: {
      type: Boolean,
      default: () => false
    },
    defaultChecked: {
      type: Array,
      default: () => []
    },
    // 是否开启单选
    radio: {
      type: Boolean,
      default: () => false
    },
    indexLabel: {
      type: String,
      default: () => "序号"
    },
    // 是不是显示序号
    isShowIndex:{
      type:Boolean,
      default: () => true
    },

    // 序号的宽度
    serialWidth:{
      type:Number||String,
      default:()=>50
    },

    // 上一次的数据索引
    preIndex: {
      type: Number,
      default: () => 0
    },
    // 单选时表格行数据改变时
    currentChange: {
      type: Function,
      default: () => () => {}
    },
    // 单选时表格行数据改变时
    sortChange: {
      type: Function,
      default: () => () => {}
    },
    // 每行的点击
    rowClick: {
      type: Function,
      default: () => () => {}
    },
    // 是否需要分页
    pagination: {
      type: Boolean,
      default: () => true
    },
    // 每页显示数量
    size: {
      type: Number,
      default: () => 10
    },
    // 当前页
    page: {
      type: Number,
      default: () => 1
    },
    // 每面显示条目控制
    pageSizes: {
      type: Array,
      default: () => [10, 20, 30, 50, 100]
    },
    // 是否开启展开行功能
    expand: {
      type: Boolean,
      default: () => false
    },
    // 是否需要列筛选
    filterGroup: {
      type: Boolean,
      default: () => false
    },
    // 是否要高亮当前行
    highlight: {
      type: Boolean,
      default: () => true
    },
    // 可选择给创建每行加上class类名
    rowClassName: {
      type: Function,
      default: () => () => {}
    },
    // 是否显示展开行小箭头列
    expandWshow:{
      type:Boolean,
      default:()=>true
    },
    showTotalCount:{
       type:Boolean,
      default:()=>false
    },
    toolActions: Array,
    orderProperty: String, // 排序字段名
    order: String // 排序升、降
  },
  data() {
    const data = this.radio ? this.bindRadio(this.data) : this.data;
    return {
      listLoading: this.loading,
      list: data || [],
      total: 0,
      pageSize: this.size,
      currentPage: this.page,
      filterOptions: [],
      formTheadOptions: [],
      columnsData: this.columns
    };
  },
  watch: {
    data: {
      handler: function(val, oldVal) {
        this.list = this.radio ? this.bindRadio(val || []) : val || [];
      },
      deep: true
    },
    // data: function (val) {
    //     this.list = val;
    // },
    loading: function(val) {
      this.listLoading = val;
    },
    filterOptions: function(valArr) {
      this.columnsData = this.columns.filter((i, index) => {
        return valArr.indexOf(index) >= 0;
      });
    },
    size(val) {
      this.pageSize = val;
    },
    page(val) {
      this.currentPage = val;
    }
  },
  created() {
    this.filterOptions = this.columns.map((item, index) => {
      return index;
    });
    this.toggleDefaultCheckbox();
    // if (this.checkbox) {
    //     if (this.defaultChecked.length) {
    //         this.setChecked(this.defaultChecked)
    //     } else {
    //         this.clearChecked()
    //     }
    // }
  },
  methods: {
    // 更改表头样式
    tableHeaderColor ({ row, column, rowIndex, columnIndex }) {
      if (rowIndex === 0) {
          return 'background-color: #eaedf4;color: #7088a4'
      }
    },

    // 获取数据
    fetchData(pageReset) {

      if (this.fetchDataFn === null || this.data !== null) return;
      if (pageReset === true) {
        this.currentPage = 1;
        this.pageSize = this.size;
      }
      this.listLoading = true;
      const query = {
        currentPage: this.currentPage,
        pageSize: this.pageSize,
        ...this.query
      };

      if (this.orderProperty) {
        query.orderProperty = this.orderProperty;
        query.asc = this.order === "ascending";
      }
      this.fetchDataFn(query)
        .then(response => {

          const list = response? isObject(response)
              ? response.data
                ? response.data
                : response.result
              : response || []
            : [];


          this.list = this.radio ? this.bindRadio(list) : list;
          this.total = response.totalRecordNumber
            ? response.totalRecordNumber
            : response.totalRecords || 0;
          this.listLoading = false;
          this.$emit(
            "onSuccessData",
            this.list,
            response.totalRecordNumber ? response.totalRecordNumber : 0
          );

        })
        .catch(e => {
          console.log(e);
          this.listLoading = false;
          this.$message.error(e);
        });
    },
    // 生成正确的行索引
    getTableIndex(index) {
      return index + 1 + (this.currentPage - 1) * this.pageSize + this.preIndex;
    },
    // 获取当前表格数据
    getData() {
      return this.list;
    },
    // checkbox时，设置默认选中
    setChecked(checkedArr) {
      checkedArr.forEach(id => {
        const findRow = this.list.find(item => item.id === id);
        this.$refs.table.toggleRowSelection(findRow, true);
      });
    },
    clearChecked() {
      this.list.forEach(item => {
        this.$refs.table.toggleRowSelection(item, false);
      });
    },
    toggleDefaultCheckbox() {},
    onSelect(data) {
      this.$emit("onCheckedChange", data);
    },
    onSelectAll(data) {
      this.$emit("onCheckedChange", data);
    },
    // 获取展示的当前列信息
    getColumnsData() {
      return this.columnsData;
    },
    bindRadio(data) {
      return data.map(item => ({
        ...item,
        checked: ""
      }));
    },
    onRadioChange(value, row) {
      if (value) {
        this.list.forEach(item => {
          if (item.id !== value) {
            item.checked = "";
          }
        });
      }
      this.$emit("radioChange", value, row);
    },
    /**展开行手动切换 */
    toogleExpand(row) {
      let $table = this.$refs.table;
      
      this.list.map((item) => {
        if (row.id != item.id) {
          $table.toggleRowExpansion(item, false)
        }
      })
      $table.toggleRowExpansion(row)
    }
  }
};
</script>

<style scoped lang="scss">
.tableWrapper {
  background-color: #fff;
  width: 100%;
  .pageText {
    padding-top: 9px;
    color: #666;
    display: block;
    font-size: 13px;
    margin-bottom: 6px;
  }

  .tool-wrap {
    .tool-btn {
      margin-right: 10px;
      margin-bottom: 15px;
    }
  }

  .iconfont {
    margin-right: 10px;
  }

  .iconfont:last-child {
    margin-right: 0;
  }

  /deep/ .el-table__empty-text {
    line-height: normal;
  }
}

.tableWrapper-pagination {
  text-align: right;
  padding: 20px 0;

  & > button:last-of-type {
    margin-right: 0;
  }
}
</style>
