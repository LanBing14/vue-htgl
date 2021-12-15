<template>
  <!--    <el-scrollbar ref="bar">-->
  <div class="container">
    <!--        <swiper :options="swiperOption0" ref="mySwiperLeft">-->
    <!--            <swiper-slide-->
    <!--                v-for="(item, index) in data"-->
    <!--                :key="index"-->
    <!--                class="slide-item">-->
    <!--                <div class="item-content" :style="{'background':'url('+colors[index%4].bg+') no-repeat 0 / cover'}">-->
    <!--                    <div class="title">{{ item[labelKey] }}</div>-->
    <!--                    <div class="text" :style="{'color':colors[index%4].text}">-->
    <!--                        <template v-if="item.isMoney">-->
    <!--                            <span class="num">{{ $toMoney(item[valueKey]) }}</span>-->
    <!--                            <span class="unit">元</span>-->
    <!--                        </template>-->
    <!--                        <span v-else class="num">{{ item[valueKey] }}</span>-->
    <!--                    </div>-->
    <!--                </div>-->
    <!--            </swiper-slide>-->
    <!--            <div class="swiper-button-prev" slot="button-prev"></div>-->
    <!--            <div class="swiper-button-next" slot="button-next"></div>-->
    <!--        </swiper>-->
    <div class="item-container" v-for="(item, index) in data" :key="index">
      <div
        class="item-content"
        :style="{'background':'url('+colors[index%4].bg+') no-repeat bottom center/ cover'}"
      >
        <div class="title">{{ item[labelKey] }}</div>
        <div class="text" :style="{'color':colors[index%4].text}">
          <template v-if="item.isMoney">
            <span class="unit" style="margin-right: 6px">¥</span>
            <span class="num">{{ $toMoney(item[valueKey]) }}</span>
            <span class="unit" style="margin-left: 6px">元</span>
          </template>
          <span v-else class="num">{{ item[valueKey] }}</span>
        </div>
      </div>
    </div>
  </div>
  <!--    </el-scrollbar>-->
</template>

<script>
import lightBlue from "@/assets/images/creditManagement/light-blue.png";
import lightGreen from "@/assets/images/creditManagement/light-green.png";
import lightYellow from "@/assets/images/creditManagement/light-yellow.png";
import lightPurple from "@/assets/images/creditManagement/light-purple.png";

export default {
  name: "HeadStatistics",
  props: {
    data: { type: Array, default: () => [] },
    labelKey: { type: String, default: "title" },
    valueKey: { type: String, default: "value" },
  },
  data() {
    return {
      res: {},
      colors: [
        { bg: lightBlue, text: "#409EFF" },
        { bg: lightGreen, text: "#67C23A" },
        { bg: lightYellow, text: "#E6A23C" },
        { bg: lightPurple, text: "#2b84dd" },
      ],
      swiperOption0: {
        width: 248,
        // height: 129,
        centeredSlides: true,
        centeredSlidesBounds: true,
        spaceBetween: 20,
        speed: 1000,
        observer: true,
        freeMode: true,
        navigation: {
          nextEl: ".swiper-button-next",
          prevEl: ".swiper-button-prev",
        },
      },
    };
  },
  // watch: {
  //     data() {
  //         this.$nextTick(() => {
  //             this.$refs.bar.update();
  //         });
  //     }
  // }
};
</script>

<style lang="scss" scoped>
.container {
  display: flex;

  .item-container:last-child {
    margin-right: 0;
  }

  /*.item-container {*/
  .item-content {
    padding: 20px;
    /*height: 129px;*/
    /*width: 248px;*/

    .title {
      font-size: 14px;
    }

    .text {
      font-weight: 400;
      padding-top: 15px;
      font-size: 0;

      .num {
        font-size: 22px;
        font-weight: bold;
      }

      .unit {
        font-size: 14px;
        vertical-align: super;
      }
    }
  }

  /*}*/
}
</style>
