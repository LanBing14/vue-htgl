<template>
  <div class="user-center">
    <el-row class="user-center-top">
      <el-col :span="18">
        <ul class="center-tab">
          <!-- <router-link tag="li" :to="'analysis'" :class="{'active': $route.path.indexOf('analysis')>=0 }">数据分析</router-link> -->
<!--          <router-link-->
<!--            tag="li"-->
<!--            :to="'contract'"-->
<!--            :class="{'active': $route.path.indexOf('contract/contract')>=0 }"-->
<!--          >合同管理</router-link>-->
          <router-link
            tag="li"
            :to="'financial'"
            :class="{'active': $route.path.indexOf('financial')>=0 }"
          >财务管理</router-link>
          <router-link
            tag="li"
            :to="'matters'"
            :class="{'active': $route.path.indexOf('matters')>=0 }"
          >事项管理</router-link>
          <router-link
            tag="li"
            :to="'remind'"
            :class="{'active': $route.path.indexOf('remind')>=0 }"
          >合同提醒</router-link>
        </ul>
      </el-col>
      <el-col :span="6" align="right" v-if="$route.path.indexOf('contract/contract')>=0">
        <span class="top-btn" v-show="getAuthEdit()" @click="dialogVisible = true">
          <svg-icon icon-class="fileadd" />
          <span style="vertical-align: top">新增合同</span>
        </span>
        <!-- <span class="top-btn" @click="dialogVisible = true">
        <svg-icon icon-class="fileimport" />导入合同 </span>-->
      </el-col>
    </el-row>
    <div class="user-center-content">
      <router-view :key="$route.fullPath" id="user-content" name="contractManage" />
    </div>
    <el-dialog title="请选择合同类型" :visible.sync="dialogVisible" :close-on-click-modal="false" width="30%">
        <el-row :gutter="20">
            <el-col :span="8" align="center">
                <div class="contract-type three" @click="addContract(2)"></div>
                <p>商业合同</p>
            </el-col>
            <el-col :span="8" align="center">
                <div class="contract-type two" @click="addContract(1)"></div>
                <p>公共资源交易</p>
            </el-col>
            <el-col :span="8" align="center">
          <div class="contract-type one" @click="addContract(0)"></div>
          <p>大宗商品交易</p>
        </el-col>
      </el-row>
    </el-dialog>
  </div>
</template>

<script>
import { getAuthEdit } from "@/utils/auth";

export default {
  data() {
    return {
      dialogVisible: false
    };
  },
  mounted() {},
  methods: {
    addContract(type) {
      this.$router.push({
        path: "/userCenter/contract/contractadd",
        query: {
          type: type
        }
      });
      this.dialogVisible = false;
    },
    getAuthEdit() {
      return getAuthEdit();
    }
  }
};
</script>

<style lang="scss" scoped>
.top-btn {
  cursor: pointer;
  display: inline-block;
  color: #abb7c5;
  font-size: 14px;
  margin-top: 6px;

  svg {
    font-size: 20px;
    margin-right: 0px;
  }
}
.contract-type {
  cursor: pointer;
  width: 80px;
  height: 80px;
  border: 1px solid #dcdfe6;
  border-radius: 4px;
  margin-bottom: 15px;

  &.one {
    background: #fff url(../../../assets/images/type.png) no-repeat -4px -7px;

    &:hover {
      background: #439eff url(../../../assets/images/typehover.png) no-repeat -1px -7px;
    }
  }

  &.two {
    background: #fff url(../../../assets/images/type.png) no-repeat -135px -7px;

    &:hover {
      background: #439eff url(../../../assets/images/typehover.png) no-repeat -133px -4px;
    }
  }

  &.three {
    background: #fff url(../../../assets/images/type.png) no-repeat -265px -7px;

    &:hover {
      background: #439eff url(../../../assets/images/typehover.png) no-repeat -263px -4px;
    }
  }
}
</style>
