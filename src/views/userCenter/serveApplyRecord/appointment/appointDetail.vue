<template>
  <div class="detail-content-wrapper">
    <div class="title-name">
      <span class="name-1">访客预约详情</span>
      <el-button class="name-back" @click="returnNotice">返回</el-button>

      <div class="repair-main">
        <el-form ref="form" :model="appointDetail">
          <el-row>
            <el-col :span="8">
              <el-form-item
                label="访客姓名"
                prop="visitorName"
                label-width="10em"
              >
                {{appointDetail.visitorName}}
              </el-form-item>
            </el-col>

            <el-col :span="8">
              <el-form-item
                label="计划到访时间"
                label-width="10em"
                placeholder="请选择预约时间"
                prop="subscribeTime"
              >
                  {{appointDetail.subscribeTime?$moment(appointDetail.subscribeTime).format('YYYY-MM-DD'):'-'}}
              </el-form-item>
            </el-col>

            <el-col :span="8">
              <el-form-item
                label="手机号码"
                label-width="10em"
                prop="phoneNumber"
              >
                {{appointDetail.phoneNumber}}
              </el-form-item>
            </el-col>

            <el-col :span="8">
              <el-form-item label="来访事由" label-width="10em" prop="reason">
                {{appointDetail.reason}}
              </el-form-item>
            </el-col>

            <el-col :span="8">
              <el-form-item
                label="随行人数"
                label-width="10em"
                prop="visitorNumber"
              >
                {{appointDetail.visitorNumber}}
              </el-form-item>
            </el-col>
          </el-row>

          <p class="title-p leftline">车辆登记信息</p>
          <el-row style="margin-top: 40px" v-if="appointDetail.carNumber">
            <el-form-item label="1" label-width="10em" v-for="(item,index) in appointDetail.carNumber.split(',')" :key="index" prop="visitorNumber">
              <div>{{appointDetail.carNumber}}</div>
            </el-form-item>
          </el-row>
          <el-row style="margin-top: 40px">
            <el-col :span="24" class="enterORCode">
              <div class="ORCode-title">二维码可用于入园扫码核验</div>
              <div class="ORCode-time">预约有效期 {{appointDetail.subscribeTime?$moment(appointDetail.subscribeTime).format('YYYY-MM-DD'):'-'}} ~ {{appointDetail.subscribeTime?$moment(appointDetail.subscribeTime).format('YYYY-MM-DD'):'-'}}</div>
              <div class="ORCode-img-box" v-if="appointDetail.uploadFiles&& appointDetail.uploadFiles[0]">
                <el-image
                  :src="downUrl + appointDetail.uploadFiles[0].url"
                  fit="fit"
                />
              </div>
              <el-button
                type="primary"
                hover-class="button-hover"
                @click="handelDown"
                 v-if="appointDetail.uploadFiles&& appointDetail.uploadFiles[0]"
              >
              <a class="a-block" :href="downUrl + appointDetail.uploadFiles[0].url" download>下载</a>
              </el-button>
            </el-col>
          </el-row>
          <p class="title-p leftline">预约核验信息</p>
          <el-row style="margin-top: 40px">
            <el-form-item
              label="到访时间"
              label-width="10em"
              prop="visitorNumber"
            >
              <div>{{appointDetail.visitingTime?$moment(appointDetail.visitingTime).format('YYYY-MM-DD'):'-' }}</div>
            </el-form-item>
          </el-row>
        </el-form>
      </div>
    </div>
  </div>
</template>
<script>
import { Api_getVistorDetail } from "@/api/userCenter/propertyRepair.js";
export default {
  props: {
    modelId: {
      type: String,
    },
  },
  data() {
    return {
      appointDetail: {},
      downUrl: process.env.VUE_APP_FILE_IMG_API,
    };
  },
  computed: {},
  mounted() {
    this.getListDetail();
  },
  methods: {
    // 返回
    returnNotice() {
      this.$emit("handleReturn", false);
    },
    getListDetail() {
      Api_getVistorDetail(this.modelId).then((res) => {
        this.appointDetail = res;
      });
    },
    //  下载
    handelDown() {},
  },
};
</script>

<style lang="scss" scoped>
.detail-content-wrapper {
  padding:12px 25px;
  background-color: #fff;

  .title-name {
    margin-bottom: 20px;

    .name-1 {
      height: 42px;
      display: inline-block;
      line-height: 42px;
      font-size: 16px;
      border-bottom: 2px solid $light-blue;
    }

    .name-back {
      padding: 7px 20px;
      float: right;
      margin-top: 12px;
      // border: 1px solid #dcdfe6;
      // border-radius: 4px;
      // color: #606266;
    }
  }
  .title-p {
    color: #333;
    font-size: 16px;
    padding-left: 20px;
    line-height: 21px;
    width: 100%;
    position: relative;
    margin: 10px 0;
  }
  .title-p::before {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    width: 4px;
    height: 21px;
    background-color: #3399e6;
  }
  .apply-see-content {
    .see-wrapper {
      display: flex;
      color: #606266;
      margin-top: 5px;
      line-height: 35px;
      font-size: 14px;
      .apply-name {
        width: 110px;
        margin-right: 25px;
        text-align: right;
      }

      .apply-explain {
        width: 83%;
      }

      .apply-enclosure {
        color: #4b9df3;
        width: 80%;
        .apply-pass {
          padding: 4px 7px;
          background: #67c23a;
          border-radius: 3px;
          font-size: 14px;
          color: #fff;
        }
      }
      .img-some {
        img {
          width: 195px;
          height: 125px;
          margin-right: 10px;
        }
      }
    }
  }
}
.enterORCode {
  text-align: center;
  line-height: 1.5;
  .ORCode-title {
    font-size: 16px;
  }
  .ORCode-time {
    font-size: 14px;
    color: #c8c8c8;
  }
  .ORCode-img-box {
    margin: 10px;
    el-image {
      width: 145px;
      height: 145px;
    }
  }
}
</style>