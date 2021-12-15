<template>
  <div class="messageCenter">
    <el-row class="fxb-table-tool">

      <div class="clearfix" style="margin-bottom:20px">
          <div class="fl clearfix tabWrap">
              <div class="is-active" @click='searchStatus($event,"")'>全部</div>
              <div  @click='searchStatus($event,"0")'>未读({{weiT}})</div>
              <div  @click='searchStatus($event,"1")'>已读</div>
          </div>
          <div class="fr rightBtn-yu">
                <el-button icon="el-icon-document" size="small" @click="setIsRead()" class="btn-color-blue">标为已读</el-button>
                <el-button icon="el-icon-document" size="small" @click="deleteMessage()" class="btn-color-orange">删除消息</el-button>
          </div>
      </div>
      <!-- <el-form>
        <el-form-item>
          <el-row :gutter="10" type="flex" align="middle">
            <el-col :span="10">
              <el-select @change="searchStatus" v-model="readStatus" placeholder="请选择" size="small">
                <el-option
                  v-for="item in messageStates"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                ></el-option>
              </el-select>

            </el-col>
            <el-col :span="14" align="right">
              <el-button icon="el-icon-document" size="small" @click="setIsRead()" class="btn-color-blue">标为已读</el-button>
              <el-button icon="el-icon-document" size="small" @click="deleteMessage()" class="btn-color-orange">删除消息</el-button>
            </el-col>
          </el-row>
        </el-form-item>
      </el-form> -->
    </el-row>
    <div v-loading="listLoading">
      <el-table
        class="fxb-table"
        ref="multipleTable"
        :data="list"
        tooltip-effect="dark"
        style="width: 100%"
        stripe
        :tableProps="{class: 'fxb-table'}"
        @selection-change="handleSelectionChange"
      >
        <template slot="empty">
          <img src="../../../assets/images/bg/no.jpg" alt="" style="width: 300px;height:280px">
        </template>
        <el-table-column type="selection" width="55" align="center"></el-table-column>
        <el-table-column label="标题" show-overflow-tooltip>
          <template slot-scope="scope">
            <el-button size="mini" type="text" @click="showDetail(scope.row.id)">{{scope.row.title}}</el-button>
          </template>
        </el-table-column>
        <el-table-column prop="status" label="状态" width="120">
          <template slot-scope="scope">
            <template v-if="scope.row.status === '0'">未读</template>
            <template v-else-if="scope.row.status === '1'">已读</template>
            <template v-else>-</template>
          </template>
        </el-table-column>
        <el-table-column prop="createDate" label="更新时间" width="150"></el-table-column>
        <!-- <el-table-column label="操作" width="120">
          <template slot-scope="scope">
            <el-button size="mini" type="text" @click="showDetail(scope.row.id)">查看详情</el-button>
          </template>
        </el-table-column> -->
      </el-table>
      <el-pagination
        class="fxb-page"
        v-show="totalRecords>0"
        :total="totalRecords"
        :page-size="pageSize"
        :current-page.sync="pageNo"
        @current-change="changeCurrentPage"
      />
    </div>
    <el-dialog
      :title="detailMessage.title"
      :append-to-body="true"
      :visible.sync="dialogVisible"
      width="43%"
      :before-close="handleClose"
      center
    >
      <div v-html="detailMessage.detail" style="line-height: 30px;min-height: 200px;padding: 5px 35px;"></div>
      <div v-if="detailMessage.attachments.length" class="files-info">
        <p class="files-info-tip">附件信息：</p>
        <ul>
          <li v-for="el in detailMessage.attachments" :key="el.id">
            <span>{{ el.originalName }}</span>
            <a :href="el.url" target="_blank" download>
              <el-button type="primary" icon="download">下载</el-button>
            </a>
          </li>
        </ul>
        <el-alert v-if="!detailMessage.attachments.length" :closable="false" title="暂无附件" type="info"></el-alert>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="handleClose()">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import {
  Api_DelPMessage,
  Api_GetMesDetailById,
  Api_FindUserMessage,
  Api_FindCCount,
  Api_EditPMesReadStatus,
  Api_UserMessageCount
} from "@/api/userCenter/messageCenter";
import { dateFormat } from "@/utils/index";

export default {
  name: "MessageCenter",
  components: {},
  filters: {
    dateFormat
  },
  data() {
    return {
      weiT:null,//未读条数
      // 消息
      approveByMe: "全部",
      hasApproval: "未读",
      startByMe: "已读",
      // 消息详情内容
      detailMessage: {
        title: "",
        detail: "",
        attachments: []
      },
      // table选中的数据
      multipleSelection: [],
      // 阅读状态 （0:未读，1:已读）
      readStatus: "0",
      dialogVisible: false,
      messageStates: [
        { value: "", label: "全部" },
        { value: "0", label: "未读" },
        { value: "1", label: "已读" }
      ],
      listLoading: false,
      // 列表数据
      list: [],
      pageNo: 0,
      oldPageNo: 0,
      pageSize: 10,
      totalRecords: 1
    };
  },
  // 初始化数据
  created: function() {
    this.getPageList();
    this.getReadCount();
  },
  methods: {
    // 获取 未读/已读 的数量
    getReadCount() {
      Api_UserMessageCount().then(data => {
        this.messageStates[1].label = "未读（" + data + "）";

        this.weiT=data;
      });
    },
    // 下拉选择搜索
    searchStatus(e,a) {

      this.pageNo = 1;
      // 大清洗，当前的点亮
      var divAll=document.getElementsByClassName('tabWrap')[0].children;
      for(var i=0;i<divAll.length;i++){
        divAll[i].className=""
      }
      e.target.className='is-active';

      this.getPageList(a);
    },
    // 批量设置已读
    setIsRead() {
      if (this.multipleSelection.length === 0) {
        // 至少选择一条数据
        this.$message({
          message: "至少选择一条数据",
          type: "warning",
          duration: 5 * 1000
        });
        return false;
      }
      const ids = [];
      this.multipleSelection.forEach(data => {
        ids.push(data.id);
      });
      const loading = this.$openLoading();
      Api_EditPMesReadStatus(ids)
        .then(msg => {
          loading.close();
          this.getPageList();
          this.getReadCount();
          this.$message.success(msg);
        })
        .catch(e => {
          loading.close();
          this.$message.error(e);
        });
    },
    // 批量删除消息方法
    deleteMessage() {
      if (this.multipleSelection.length === 0) {
        // 至少选择一条数据
        this.$message({
          message: "至少选择一条数据",
          type: "warning",
          duration: 5 * 1000
        });
        return false;
      }
      this.$confirm("是否确定删除?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
        const ids = [];
        this.multipleSelection.forEach(data => {
          ids.push(data.id);
        });
        const loading = this.$openLoading();
        Api_DelPMessage(ids)
          .then(res => {
            loading.close();
            this.$message.success(res);
            // 重新加载列表
            if (this.pageNo >= this.oldPageNo) {
              this.pageNo = this.oldPageNo - 1;
            }
            console.log(this.pageNo);
            // 重新加载列表
            this.getPageList();
            this.getReadCount();
          })
          .catch(e => {
            loading.close();
            this.$message.error(e);
          });
      });
    },
    getPageList(a) {
      this.listLoading = true;
      // Api_FindUserMessage({
      //     pageNo: this.pageNo,
      //     pageSize: this.pageSize,
      //     readStatus: this.readStatus
      // }).then(data => {

      Api_FindUserMessage({
        currentPage: this.pageNo,
        pageSize: this.pageSize,
        status: a
      })
        .then(data => {
          this.listLoading = false;
          this.list = data.data;
          this.totalRecords = data.totalRecordNumber;
          this.oldPageNo = data.totalPageNumber;
        })
        .catch(e => {
          this.listLoading = false;
          this.list = [];
          this.totalRecords = null;
        });
    },
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
    changeCurrentPage() {
      this.getPageList();
    },
    handleClose() {
      this.getReadCount();
      this.getPageList();
      this.dialogVisible = false;
    },
    showDetail(messageId) {
      const loading = this.$openLoading();
      Api_GetMesDetailById(messageId)
        .then(data => {
          this.dialogVisible = true;
          this.detailMessage.title = data.title;
          this.detailMessage.detail = data.txt;
          this.detailMessage.attachments = data.attachments;
          loading.close();
        })
        .catch(e => {
          this.$message.error(e);
        });
    }
  }
};
</script>
<style lang="scss">
.messageCenter{
    .el-table--fit{
    border-bottom: 1px solid #ebeef5;
  }
}

.fxb-page{
  margin-top: 0;
}
.fxb-page.el-pagination {
    padding: 20px;
}
</style>



<style  lang="scss">

.messageCenter{
   .tabWrap{
      div{
          width: 100px;
          height: 30px;
          float:left;
          background-color: #f7f8fb;
          color:#606266;
          border:1px solid #ebeef4;
          text-align: center;
          line-height: 30px;
          cursor: pointer;
      }

      div:nth-child(1),div:nth-child(2){
        margin-right: 10px;
      }
    }


    .is-active{
        background-color: #4b9df3!important;
        color:#fff!important;
        border-color:#4b9df3!important;
    }


    .rightBtn-yu{
      button{
        height: 30px;
      }
    }

}

</style>
