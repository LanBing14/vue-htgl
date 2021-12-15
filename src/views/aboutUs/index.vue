<template>
  <el-container style="background-color:#fff;">
    <el-header class="header-no-color">
      <FxbHeader @reload="reload" />
    </el-header>
    <div class="content" v-if="isRouterAlive">
      <div class="banner-wrap">
        <el-main class="top-main" style="height: 100%;">
          <div class="l">
            <div class="t-wrap">
              <span>关于</span>
              <span>未 / 至 / 科 / 技</span>
            </div>
            <div class="s-wrap">
              <span>ABOUT UDATECH</span>
              <span>
                <span>诚信</span>
                <span>协作</span>
                <span>拼搏</span>
                <span>创新</span>
              </span>
            </div>
          </div>
          <img class="r" src="../../assets/images/aboutUs/img-big-right.png" alt />
        </el-main>
      </div>
      <el-main class="text-wrap">
        <p>江苏未至科技股份有限公司（简称“未至科技”）成立于2009年，是国内最早涉足社会信用体系建设的高新技术企业，国家发改委首批26家综合信用服务机构试点单位之一。</p>
        <p>公司基于信用信息化、大数据分析技术与云计算应用创建产品体系和解决方案，是一家面向政府、行业协会商会、企业机构等提供信用体系建设咨询规划及综合解决方案、信用评价服务、金融交易服务、企业风险管理综合解决方案等多维度服务的供应商。</p>
      </el-main>
      <el-main class="main-2">
        <h2 class="title">我们的企业理念</h2>
        <div class="list flex">
          <div class="item item-1">
            <h5>企业愿景</h5>
            <p class="p-tip">信用赋能商业智慧</p>
          </div>
          <div class="item item-2">
            <h5>价值观</h5>
            <p class="p-tip">诚信 协作 拼搏 创新</p>
          </div>
          <div class="item item-3">
            <h5>质量理念</h5>
            <p class="p-tip">品质成就未来</p>
          </div>
          <div class="item item-4">
            <h5>文化理念</h5>
            <p class="p-tip">开放 合作 成长 共赢</p>
          </div>
        </div>
      </el-main>
      <el-main class="main-3">
        <div class="w flex">
          <div class="l">
            <div id="map-container"></div>
            <!--                   你好啊美女 1111    <img src="../../assets/images/aboutUs/map.png" alt="">-->
          </div>
          <div class="r flex-primary concat" id="concat">
            <h2 class="title">联系我们</h2>
            <p>
              <span>市场电话</span>
              <span>0512-88880812</span>
            </p>
            <p>
              <span>商务合作</span>
              <span style="font-size: 18px;">marketing@citgc.com</span>
              <img
                src="../../assets/images/aboutUs/copy.png"
                width="15"
                @click="copy"
                style="cursor: pointer; transition: none 0s ease 0s; position: relative; top: -2px; left: -1px;"
              />
            </p>
            <p>
              <span>公司地址</span>
              <span>苏州高新区竹园路209号</span>
            </p>
            <p>
              <span>公司官网</span>
              <span>
                <a
                  href="https://www.udatech.com"
                  target="_blank"
                  style="color: #4b9df3;"
                >https://www.udatech.com</a>
              </span>
            </p>
          </div>
        </div>
      </el-main>
    </div>
    <el-footer>
      <FxbFooter />
    </el-footer>
  </el-container>
</template>

<script>
import FxbHeader from "@/views/layouts/fxb/components/FxbHeader";
import FxbFooter from "@/views/layouts/fxb/components/FxbFooter";

export default {
  name: "AboutUs",
  components: {
    FxbHeader,
    FxbFooter
  },
  data () {
    return {
      isRouterAlive: true,
    }
  },
  mounted () {
    const lng = 120.538834;
    const lat = 31.275733;
    const map = new AMap.Map('map-container', {
      zoom: 16,//级别
      center: [lng, lat]//中心点坐标
    });
    var marker1 = new AMap.Marker({
      position: new AMap.LngLat(lng, lat),   // 经纬度对象，如 new AMap.LngLat(116.39, 39.9); 也可以是经纬度构成的一维数组[116.39, 39.9]
      title: '江苏未至科技股份有限公司'
    }); map.add(marker1);
    //锚点定位
    if (this.$route.params.viewPoint) { window.scrollTo(0, 0) }

  },
  methods: {
    copy () {
      let transfer = document.createElement('input');
      document.body.appendChild(transfer);
      transfer.value = "marketing@citgc.com";  // 这里表示想要复制的内容
      transfer.focus();
      transfer.select();
      if (document.execCommand('copy')) {
        document.execCommand('copy');
      }
      transfer.blur();
      document.body.removeChild(transfer);
      this.$message.success('复制成功！')
    },
    reload () {
      this.isRouterAlive = false;
      this.$nextTick(() => (this.isRouterAlive = true));
    }
  }
}
</script>

<style scoped lang="scss">
.banner-wrap {
  height: 355px;
  background: url("../../assets/images/aboutUs/bg.png") no-repeat center/cover;

  .top-main {
    position: relative;

    .l {
      position: absolute;
      left: 0;
      bottom: 70px;

      .t-wrap {
        height: 52px;
        margin-left: 54px;
        margin-bottom: 48px;

        span:first-child {
          font-size: 28px;
          color: #8990a4;
          letter-spacing: 10px;
          vertical-align: middle;
        }

        span:last-child {
          font-size: 50px;
          background-image: linear-gradient(
            -90deg,
            rgba(2, 252, 254, 1) 0%,
            rgba(36, 181, 230, 1) 100%
          );
          -webkit-background-clip: text;
          color: transparent;
          letter-spacing: 2px;
          vertical-align: middle;
        }
      }

      .s-wrap {
        & > span:first-child {
          color: #ebeef6;
          font-size: 27px;
          letter-spacing: 2px;
          margin-right: 46px;
        }

        & > span:last-child {
          color: #4178ae;
          font-size: 23px;
          display: inline-block;

          span {
            margin-right: 44px;
          }
        }
      }
    }

    .r {
      position: absolute;
      right: -10px;
      bottom: -95px;
    }
  }
}

.text-wrap {
  text-align: left;
  padding: 45px 0;
  color: #999;
  font-size: 15px;
  line-height: 34px;

  p {
    width: 705px;

    &:first-child {
      margin-bottom: 30px;
      letter-spacing: 1.4px;
    }

    &:last-child {
      margin-bottom: 30px;
      letter-spacing: 1.2px;
    }
  }
}

.main-2 {
  padding-left: 20px;
  padding-right: 20px;
  .title {
    font-size: 30px;
    color: #333;
    margin-bottom: 50px;
    text-align: center;
  }

  .list {
    justify-content: space-between;

    .item {
      width: 286px;
      height: 430px;
      /*background-repeat: no-repeat;*/
      /*background-size: cover;*/
      /*background-position: center;*/
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      color: #fff;
      transition: all 0.4s;

      h5 {
        font-size: 24px;
        position: absolute;
        padding-bottom: 25px;
        margin-bottom: 25px;

        &::after {
          content: "";
          position: absolute;
          bottom: 0;
          left: 50%;
          margin-left: -16px;
          width: 32px;
          height: 3px;
          background-color: #fff;
        }
      }

      p {
        margin-top: 115px;
        font-size: 18px;
      }
    }

    .item-1 {
      background: url("../../assets/images/aboutUs/item-1.png") no-repeat
        center/100% 100%;
    }

    .item-2 {
      background: url("../../assets/images/aboutUs/item-2.png") no-repeat
        center/100% 100%;
    }

    .item-3 {
      background: url("../../assets/images/aboutUs/item-3.png") no-repeat
        center/100% 100%;
    }

    .item-4 {
      background: url("../../assets/images/aboutUs/item-4.png") no-repeat
        center/100% 100%;
    }

    .item {
      &:hover {
        background-size: 130% 130%;
      }
    }
  }
}

.main-3 {
  margin-top: 20px;
  margin-bottom: 40px;
  padding-left: 20px;
  padding-right: 20px;

  .w {
    .l {
      width: 590px;

      img {
        width: 100%;
      }
    }
  }

  .concat {
    padding-left: 100px;

    .title {
      font-size: 28px;
      color: #333;
      margin-top: 45px;
      margin-bottom: 45px;
    }

    p {
      margin-bottom: 36px;
      padding-left: 30px;
      height: 24px;
      line-height: 24px;

      &:nth-of-type(1) {
        background: url("../../assets/images/aboutUs/concat-1.png") no-repeat 2px
          center;
      }

      &:nth-of-type(2) {
        background: url("../../assets/images/aboutUs/concat-2.png") no-repeat 0
          center;
      }

      &:nth-of-type(3) {
        background: url("../../assets/images/aboutUs/concat-3.png") no-repeat -2.5px
          center;
      }

      &:nth-of-type(4) {
        background: url("../../assets/images/aboutUs/concat-4.png") no-repeat 0
          center;
      }

      span {
        display: inline-block;
        margin-right: 20px;

        &:first-child {
          color: #999;
          font-size: 14px;
        }

        &:last-child {
          font-size: 18px;
        }
      }
    }
  }
}

.el-main {
  width: 1240px;
}

a:hover {
  color: $--color-primary;
}

#map-container {
  height: 340px;
}

body.mobile {
  .banner-wrap .top-main .l {
    bottom: auto;
    top: 23%;

    .t-wrap {
      margin-left: 0;
      margin-bottom: 10px;
      text-align: center;

      span:first-child {
        font-size: 18px;
      }

      span:last-child {
        font-size: 30px;
      }
    }

    .s-wrap {
      text-align: center;

      & > span:first-child {
        margin-right: 0;
        font-size: 22px;
      }

      & > span:last-child {
        margin-top: 15px;
        font-size: 20px;

        span:last-child {
          margin-right: 0;
        }
      }
    }
  }

  .text-wrap {
    margin-top: 70px;

    p {
      width: auto;
    }
  }

  .main-2,
  .main-3 {
    padding-left: 0;
    padding-right: 0;

    .concat {
      padding-left: 0;
    }
  }

  .main-2 .list .item {
    margin: 0 auto 15px;
  }
}
</style>
