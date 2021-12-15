<template>
  <el-container style="background-color:#fff;">
    <el-header>
      <FxbHeader @reload="reload"/>
    </el-header>
    <el-main class="content" v-if="isRouterAlive">
      <div class="tip-word">按需选择版本，全面满足各行业多场景应用</div>
      <div class="buy-wrap flex">
        <div class="buy-item buy-item-1">
          <div class="buy-title">基础版</div>
          <div class="buy-content">
            <div class="text-wrap">
              <p class="text">快捷注册风信标平台，免费试用全面</p>
              <p class="text">风险管理平台，</p>
              <p class="text">构建企业信用管理体系</p>
            </div>
            <div class="buy-btn">
              <p class="money-wrap">
                <span class="money-unit"></span>
                <span class="money-num">免费试用</span>
                <span class="money-year"></span>
              </p>
              <el-button class="btn" @click="toLogin">
                <span>立即申请</span>
                <img class="icon arror-right" src="../../assets/images/buy/arrow-right.png" alt />
              </el-button>
            </div>
          </div>
        </div>
        <div class="buy-item buy-item-2">
          <div class="buy-title">企业版</div>
          <div class="buy-content">
            <div class="text-wrap">
              <p class="text">适合小型业务团队使用，满足小微企业</p>
              <p class="text">用户需要，辅助建</p>
              <p class="text">立全面风险管理体系</p>
            </div>
            <div class="buy-btn">
              <p class="money-wrap">
                <!-- <span class="old-money" v-if="oldEnterprisePrice!=EnterprisePrice">¥ {{oldEnterprisePrice}}</span>
                <span class="money-unit">￥</span> -->
                <span class="money-num">{{EnterprisePrice}}</span>
                <span class="money-year">/年</span>
              </p>
              <el-button class="btn" @click="gotoVip('1')">
                <span>立即申请</span>
                <img class="icon arror-right" src="../../assets/images/buy/arrow-right.png" alt />
              </el-button>
            </div>
          </div>
        </div>
        <div class="buy-item buy-item-3">
          <div class="buy-title">专业版</div>
          <div class="buy-content">
            <div class="text-wrap">
              <p class="text">适合较大业务团队使用，风险</p>
              <p class="text">监测企业数量不限,事前、</p>
              <p class="text">事中、事后风险全面管控</p>
            </div>
            <div class="buy-btn">
              <p class="money-wrap">
                <!-- <span
                  class="old-money"
                  v-if="oldProfessionalPrice!=ProfessionalPrice"
                >¥ {{oldProfessionalPrice}}</span>
                <span class="money-unit">￥</span> -->
                <span class="money-num">{{ProfessionalPrice}}</span>
                <span class="money-year">/年</span>
              </p>
              <el-button class="btn" @click="gotoVip('2')">
                <span>立即申请</span>
                <img class="icon arror-right" src="../../assets/images/buy/arrow-right.png" alt />
              </el-button>
            </div>
          </div>
        </div>
      </div>
      <div :class="{fixed: isHeaderFixed}" class="list-wrap">
        <div ref="titleHeader" :style="style" class="list-header flex">
          <div class="flex-primary"></div>
          <div class="head-1">
            <span class="t">基础版</span>
            <el-button class="green-btn head-btn" @click="toLogin">立即申请</el-button>
          </div>
          <div class="head-2">
            <span class="t">企业版</span>
            <el-button class="blue-light-btn head-btn" @click="otherLogin">联系我们</el-button>
          </div>
          <div class="head-3">
            <span class="t">专业版</span>
            <el-button class="blue-btn head-btn" @click="otherLogin">联系我们</el-button>
          </div>
        </div>
        <div class="list-body">
          <div v-for="(el, index) in list" :key="index">
            <div class="row-title">
              <div class="row-label">{{ el.label }}</div>
            </div>
            <div v-for="(item, itemIndex) in el.children" :key="itemIndex" class="row-normal flex">
              <div class="row-label flex-primary">{{ item.label }}</div>
              <div class="row-item-1">
                <template v-if="isString(item.check1)">
                  <span class="text-blue">{{ item.check1 }}</span>
                </template>
                <template v-else>
                  <img v-if="item.check1" src="../../assets/images/buy/check.png" alt />
                  <img v-else src="../../assets/images/buy/uncheck.png" alt />
                </template>
              </div>
              <div class="row-item-2">
                <template v-if="isString(item.check2)">
                  <span class="text-blue">{{ item.check2 }}</span>
                </template>
                <template v-else>
                  <img v-if="item.check2" src="../../assets/images/buy/check.png" alt />
                  <img v-else src="../../assets/images/buy/uncheck.png" alt />
                </template>
              </div>
              <div class="row-item-3">
                <template v-if="isString(item.check3)">
                  <span class="text-blue">{{ item.check3 }}</span>
                </template>
                <template v-else>
                  <img v-if="item.check3" src="../../assets/images/buy/check.png" alt />
                  <img v-else src="../../assets/images/buy/uncheck.png" alt />
                </template>
              </div>
            </div>
          </div>
        </div>
      </div>
      <el-dialog :visible.sync="visible" title="联系我们" width="500px">
        <el-form label-width="6em" class="form">
          <el-form-item label="电话:">0512-88880812</el-form-item>
          <el-form-item label="邮箱:">marketing@citgc.com</el-form-item>
        </el-form>
      </el-dialog>
    </el-main>
    <el-footer>
      <FxbFooter />
    </el-footer>
    <OpenVip ref="ref_OpenVip"></OpenVip>
  </el-container>
</template>

<script>
import { isString } from "lodash";
import FxbHeader from "@/views/layouts/fxb/components/FxbHeader";
import FxbFooter from "@/views/layouts/fxb/components/FxbFooter";
import OpenVip from "@/views/userCenter/vipCenter/OpenVip.vue";
import { Api_versionProducts } from "@/api/userCenter/vip.js";

export default {
  name: "Buy",
  components: {
    FxbHeader,
    FxbFooter,
    OpenVip,
  },
  data() {
    return {
      isRouterAlive: true,
      visible: false,
      isHeaderFixed: false,
      headerLeft: 0,
      headerTop: 0,
      headerWidth: 0,
      list: [
        {
          label: "信用查询",
          children: [
            { label: "信用评价", check1: true, check2: true, check3: true },
            { label: "基本信息", check1: true, check2: true, check3: true },
            { label: "企业画像", check1: true, check2: true, check3: true },
            { label: "司法风险", check1: true, check2: true, check3: true },
            { label: "经营状况", check1: false, check2: true, check3: true },
            { label: "知识产权", check1: true, check2: true, check3: true },
            { label: "动态监测", check1: false, check2: true, check3: true },
            { label: "基础信用报告", check1: "10份/天", check2: "50份/天", check3: "100份/天" },
            { label: "信用风险报告", check1: false, check2: true, check3: true },
          ],
        },
        {
          label: "风险管理",
          children: [
            {
              label: "客户管理/履约情况",
              check1: "10家",
              check2: "200家",
              check3: "1000家",
            },
            { label: "不良客户", check1: true, check2: true, check3: true },
            { label: "财务分析", check1: true, check2: true, check3: true },
            { label: "风险评估", check1: true, check2: true, check3: true },
            {
              label: "评估指标、模型自定义",
              check1: true,
              check2: true,
              check3: true,
            },
            { label: "授信管理", check1: true, check2: true, check3: true },
            { label: "合同管理", check1: true, check2: true, check3: true },
            { label: "发货管理", check1: true, check2: true, check3: true },
            { label: "应收账款管理", check1: true, check2: true, check3: true },
            { label: "对账管理", check1: true, check2: true, check3: true },
            { label: "发票管理", check1: true, check2: true, check3: true },
            {
              label: "信用催收",
              check1: "预设催收方案",
              check2: "可自定义",
              check3: "可自定义",
            },
          ],
        },
        {
          label: "辅助决策",
          children: [
            { label: "分析报表", check1: true, check2: true, check3: true },
            { label: "信用监测", check1: "10家", check2: "200家", check3: "1000家" },
            {
              label: "信用预警设置",
              check1: "预设规则",
              check2: "可自定义",
              check3: "可自定义",
            },
            {
              label: "用户数",
              check1: "5个",
              check2: "20个" + "（50元/新增子账户）",
              check3: "100个",
            },
            { label: "流程管理", check1: true, check2: true, check3: true },
          ],
        },
        {
          label: "增值服务",
          children: [
            {
              label: "数据接口",
              check1: false,
              check2: "按需购买",
              check3: "按需购买",
            },
          ],
        },
      ],
      EnterprisePrice: '',
      ProfessionalPrice: '',
      oldEnterprisePrice: '',
      oldProfessionalPrice: '',
    };
  },
  computed: {
    userInfo() {
      return this.$store.getters.userInfo;
    },
    style() {
      if (this.isHeaderFixed) {
        return {
          left: this.headerLeft + "px",
          width: this.headerWidth + "px",
        };
      } else {
        return null;
      }
    },
  },
  mounted() {
    window.addEventListener("scroll", this.onScroll, false);
    const { top: t, left } = this.$getOffset(this.$refs.titleHeader);
    const { width } = this.$refs.titleHeader.getBoundingClientRect();
    this.headerTop = t - 50;
    this.headerLeft = left;
    this.headerWidth = width;
    Api_versionProducts().then((res) => {
      let _qiyeban = res.filter((i) => i.name === "企业版");
      let _zhuanyeban = res.filter((i) => i.name === "专业版");
      this.EnterprisePrice = _qiyeban[0].newPrice;
      this.oldEnterprisePrice = _qiyeban[0].oldPrice;
      this.ProfessionalPrice = _zhuanyeban[0].newPrice;
      this.oldProfessionalPrice = _zhuanyeban[0].oldPrice;
    });
  },
  beforeDestory() {
    window.removeEventListener("scroll", this.onScroll);
  },
  methods: {
    isString,
    onScroll() {
      const scrollTop = window.scrollY;
      this.isHeaderFixed = scrollTop >= this.headerTop;
    },
    toLogin() {
      if (this.userInfo.id) {
        // 已 登录
        this.$message.info("您已登录风信标全面风险管理平台");
      } else {
        // 去 登录
        this.$login.register();
      }
    },
    otherLogin() {
      this.visible = true;
    },
    gotoVip(tag) {
      if (!this.$store.getters.userInfo.id) {
        this.$login.login();
      } else {
        this.$refs.ref_OpenVip.open(tag);
      }
    },
    reload() {
      this.isRouterAlive = false;
      this.$nextTick(() => (this.isRouterAlive = true));
    }
  }
};
</script>

<style scoped lang="scss">
$color-green: #2bc7c3;
$color-blue-light: #0aafe4;
$color-blue: #368fe9;
.green-btn {
  color: #fff;
  background-color: $color-green;
}

.blue-light-btn {
  color: #fff;
  background-color: $color-blue-light;
}

.blue-btn {
  color: #fff;
  background-color: $color-blue;
}

.content {
  width: 1163px;
  padding-top: 109px;
  padding-bottom: 60px;
}

.tip-word {
  font-size: 40px;
  text-align: center;
  margin-bottom: 65px;
}

.buy-wrap {
  justify-content: space-between;
  margin-bottom: 55px;

  .buy-item {
    width: 358px;
    text-align: center;

    &.buy-item-1 {
      .buy-title {
        background: linear-gradient(90deg, rgba(8, 216, 211, 1), rgba(11, 192, 187, 1));
      }

      .buy-btn {
        color: $color-green;

        .btn {
          background-color: $color-green;
        }
      }
    }

    &.buy-item-2 {
      .buy-title {
        position: relative;
        background: linear-gradient(90deg, rgba(21, 185, 239, 1), rgba(0, 164, 218, 1));

        &::after {
          content: "";
          position: absolute;
          width: 100%;
          height: 100%;
          top: 0;
          left: 0;
          background: url("../../assets/images/buy/m.png") no-repeat;
        }
      }

      .buy-btn {
        color: $color-blue-light;

        .btn {
          background-color: $color-blue-light;
        }
        p {
          .money-num {
            background-image: linear-gradient(0deg, rgba(0, 164, 218, 1) 0%, rgba(21, 185, 239, 1) 100%);
            -webkit-background-clip: text;
            color: transparent;
          }
        }
      }
    }

    &.buy-item-3 {
      .buy-title {
        background: linear-gradient(90deg, rgba(56, 152, 242, 1), rgba(52, 134, 225, 1));
      }

      .buy-btn {
        color: $color-blue;

        .btn {
          background-color: $color-blue;
        }
      }
    }
  }

  .buy-title {
    height: 85px;
    line-height: 85px;
    text-align: center;
    color: #fff;
    font-size: 30px;
  }

  .buy-content {
    border: 1px solid rgba(238, 238, 238, 1);
    box-shadow: 0 0 25px 0 rgba(12, 3, 6, 0.05);

    .text-wrap {
      margin: 35px auto 68px;

      .text {
        color: #999;
        line-height: 14px;

        &:nth-child(2) {
          margin: 16px 0;
        }
      }
    }

    .buy-btn {
      p {
        font-size: 24px;
        line-height: 24px;
        color: inherit;
        margin-bottom: 33px;
        font-weight: bold;
        .money-unit {
          font-size: 24px;
          font-weight: normal;
        }
        .money-num {
          font-size: 36px;
        }
        .money-year {
          font-size: 18px;
          color: #999;
          font-weight: normal;
        }
      }

      .btn {
        color: #fff;
        border-radius: 6px;
        width: 160px;
        height: 55px;
        border: none;
        font-size: 0;
        margin-bottom: 65px;

        span {
          font-size: 20px;
          vertical-align: middle;
        }

        .icon.arror-right {
          margin-left: 20px;
        }
      }
    }
  }
}

.list-wrap {
  &.fixed {
    .list-header {
      background-color: #f7f8fb;
      position: fixed;
      top: 50px;

      .head-btn {
        display: block;
        margin: 15px auto 0;
      }
    }

    .list-body {
      padding-top: 135px;
    }
  }

  .list-header {
    background-color: #eaedf4;
    padding: 30px 0;

    .t {
      display: block;
      font-size: 18px;
    }

    .head-btn {
      display: none;
      border: none;
    }

    .head-1,
    .head-2,
    .head-3 {
      width: 254px;
      text-align: center;
    }
  }
  .list-body {
    .text-blue {
      color: #4c9ef3;
    }

    .row-label {
      padding-left: 138px;
    }

    .row-title {
      height: 50px;
      line-height: 50px;
      background-color: #f7f8fb;

      .row-label {
        font-size: 16px;
      }
    }

    .row-normal {
      height: 50px;
      line-height: 50px;
      border-top: 1px solid #edeff2;

      .row-label {
        color: #606266;
        font-size: 13px;
      }

      &:last-child {
        border-bottom: 1px solid #edeff2;
      }

      .row-item-1,
      .row-item-2,
      .row-item-3 {
        width: 254px;
        text-align: center;
      }
    }
  }
}
.form {
  margin: 0 0 40px 0;
  /deep/ {
    .el-form-item__label,
    .el-form-item__content {
      font-size: 24px;
      font-weight: normal;
    }
  }
}

.old-money {
  color: #999;
  font-size: 16px;
  font-weight: normal;
  text-decoration: line-through;
}
</style>
