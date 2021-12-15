<template>
  <div class="jianCeSetting">
    <div class="page-header">
      <!-- <h1 class="page-name">
        <span>监测设置</span>
      </h1> -->

      <el-tabs v-model="activeName">
        <el-tab-pane label="预警规则设置" name="first">
          <SetRule></SetRule>
        </el-tab-pane>
        <el-tab-pane label="推送方式设置" name="second">
          <SetPushType></SetPushType>
        </el-tab-pane>
      </el-tabs>


    </div>
    <!-- <div class="page-content">
      <el-row style="padding: 0 0 20px 0">
        <el-col :span="24" style="text-align: right">
       
          <el-button class="marR6 btn-color-blue" id="warningBtn" @click="compKey='SetRule'"  >
            <i class="el-icon-bell"></i>
            预警规则设置
          </el-button>

          <el-button id="pushTypeBtn" @click="compKey='SetPushType'"  class="btn-color-orange">
            <i class="el-icon-position"></i>
            推送方式设置
          </el-button>
 
        </el-col>
      </el-row>
      <component :is="compKey"></component>

    </div> -->
  </div>
</template>

<script>
import SetRule from "./SetRule";
import SetPushType from "./SetPushType";

export default {
  name: "CreditSet",
  components: {
    SetRule,
    SetPushType,
  },
  data() {
    return {
      activeName:'first',
      compKey: "SetRule",
    };
  },
};
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.set-way,
.set-indicators {
  padding: 20px;

  h3 {
    margin-bottom: 20px;
  }
}

.indicators-list {
  height: 280px;
  border: 1px solid #eee;
  margin: 10px 15px 0 0;
  padding: 0px 15px;
}

.set-save {
  margin-bottom: 30px;
}

.indicators-item {
  margin: 10px 0;
}

// .link-btn {
//     margin-left: 3px;
//     padding: 0 10px 0 30px;
//     border: 1px solid #d2d8e4;
//     line-height: 36px;
//     display: inline-block;
//     border-radius: 5px;
//     color: #032c59;

//     &.router-link-exact-active.router-link-active,
//     &:hover {
//         box-shadow: 0 0 3px #d2d8e4;
//     }
// }

// #warningBtn {
//     background: url(../../../assets/images/ico-warning.png) no-repeat 10px center;
// }

// #pushTypeBtn {
//     background: url(../../../assets/images/ico-fly.png) no-repeat 10px center;
// }


</style>


<style lang="scss">

.jianCeSetting {
	.el-tabs__item {
		height: auto;
		line-height: initial;
		font-size: 16px;
    padding-bottom: 11px;
    margin-top:2px;
    // line-height: 1.15;
    margin-bottom: 1px;
	}

	.el-tabs__nav-wrap::after {
		display: none;
  }
  .el-tabs__header {
    margin-bottom: 7px;
  }
}
</style>