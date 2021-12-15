<script src="../../../../新建日记本文档.js"></script>
<template>
  <el-container style="background-color:#fff;">
    <el-header class="header-no-color">
      <FxbHeader setClass="fxb-header1" />
    </el-header>
    <!--        banner轮播图-->
    <div class="banner-wrap" style="width:100%;">
      <swiper :options="swiperOption" :style="{height: swiperHeight + 'px'}" ref="mySwiper">
        <swiper-slide class="slide-item slide-item-4">
          <el-main class="banner-content">
            <div class="banner-img-wrap" style="height: 250px;">
              <img class="img-title" src="../../assets/images/home/bannerbg1.png" alt="">
            </div>
            <el-button class="btn1">
              <span>信用修复</span>
              <img class="icon arror-right" src="../../assets/images/home/arrow-right.png" alt />
            </el-button>
          </el-main>
        </swiper-slide>
        <swiper-slide class="slide-item slide-item-1">
          <el-main class="banner-content">
            <div class="banner-img-wrap">
              <img class="img-title" src="../../assets/images/home/banner-title-1.png" alt />
              <img class="img-text" src="../../assets/images/home/banner-text-1.png" alt />
            </div>
            <!--<div class="b-text">-->
            <!--    <span>助力</span><span>企业建立全面风险管理！</span>-->
            <!--</div>-->
            <!--<div class="text">-->
            <!--    <p>风信标2.0发布，SaaS化服务，区块链数据安全保障，低成本搭</p>-->
            <!--    <p>建企业全面风险管理平台！</p>-->
            <!--</div>-->
            <el-button class="btn">
              <span>免费试用</span>
              <img class="icon arror-right" src="../../assets/images/home/arrow-right.png" alt />
            </el-button>
          </el-main>
        </swiper-slide>
        <swiper-slide class="slide-item slide-item-2">
          <el-main class="banner-content">
            <div class="banner-img-wrap">
              <img class="img-title" src="../../assets/images/home/banner-title-2.png" alt />
              <img class="img-text" src="../../assets/images/home/banner-text-2.png" alt />
            </div>
            <!--<div class="b-text">-->
            <!--    <span>显著降低企业授信风险</span><span>坏账率降低95%！</span>-->
            <!--</div>-->
            <!--<div class="text">-->
            <!--    <p>完善企业客户资信调查、授信、合同、发货、发票、应收账款、坏账管理，</p>-->
            <!--    <p>全流程风险实时监测，服务企业降本增效。</p>-->
            <!--</div>-->
            <el-button class="btn">
              <span>免费试用</span>
              <img class="icon arror-right" src="../../assets/images/home/arrow-right.png" alt />
            </el-button>
          </el-main>
        </swiper-slide>
        <swiper-slide class="slide-item slide-item-3">
          <el-main class="banner-content">
            <div class="banner-img-wrap">
              <img class="img-title" src="../../assets/images/home/banner-title-3.png" alt />
              <img class="img-text" src="../../assets/images/home/banner-text-3.png" alt />
            </div>
            <!--<div class="b-text">-->
            <!--    <span>携手企业共抗疫情</span><span>共创信用未来！</span>-->
            <!--</div>-->
            <!--<div class="text">-->
            <!--    <p>风信标2.0携手企业，关注信用风险，强化信用管理理念，共抗疫情，</p>-->
            <!--    <p>防患于未然，共创信用未来！</p>-->
            <!--</div>-->
            <el-button class="btn">
              <span>免费试用</span>
              <img class="icon arror-right" src="../../assets/images/home/arrow-right.png" alt />
            </el-button>
          </el-main>
        </swiper-slide>
       
        <div class="swiper-pagination" slot="pagination"></div>
      </swiper>
    </div>
    <!--        快捷入口-->
    <div class="quick-enter-wrap">
      <el-main>
        <div class="quick-enter flex v-center">
          <div class="quick-item">
            <router-link to="/advanceSearch">
              <span class="quick-icon-wrap">
                <svg
                  class="svg-icon"
                  width="61px"
                  viewBox="0 0 1024 1024"
                  version="1.1"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    fill="#4b9df3"
                    d="M512.1 893.5H168.7V128.7h618.6v303.1h-50V178.7H218.7v664.8h293.4z"
                  />
                  <path
                    fill="#4b9df3"
                    d="M644.4 811.4c-2 0-4 0-6-0.1-43.1-1.6-83-19.8-112.3-51.3-29.4-31.6-44.7-72.6-43.1-115.7 1.6-43.1 19.8-83 51.3-112.3 31.6-29.4 72.7-44.7 115.7-43.1 43.1 1.6 83 19.8 112.3 51.3 29.4 31.6 44.7 72.6 43.1 115.7-1.6 43.1-19.8 83-51.3 112.3-30.1 28-68.8 43.2-109.7 43.2z m-0.3-272.7c-28.2 0-55 10.5-75.7 29.8-21.8 20.3-34.4 47.8-35.4 77.5-1.1 29.7 9.5 58.1 29.7 79.9 20.3 21.8 47.8 34.4 77.5 35.4 29.7 1.1 58.1-9.5 79.9-29.7 21.8-20.3 34.4-47.8 35.4-77.5 1.1-29.7-9.5-58.1-29.7-79.9s-47.8-34.4-77.5-35.4c-1.4-0.1-2.8-0.1-4.2-0.1z"
                  />
                  <path
                    fill="#4b9df3"
                    d="M709.193 756.609l36.61-34.055 126.82 136.336-36.61 34.055zM289.4 278h231.9v50H289.4zM289.4 393h231.9v50H289.4z"
                  />
                  <path fill="#4b9df3" d="M289.4 508h135v50h-135z" />
                </svg>
              </span>
              <span class="quick-text">风险查询</span>
            </router-link>
          </div>
          <div class="quick-item">
            <router-link to="/front/creditManagement/contractManagement/contractLedger">
              <span class="quick-icon-wrap">
                <svg
                  class="svg-icon"
                  width="45px"
                  viewBox="0 0 1024 1024"
                  version="1.1"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    fill="#4b9df3"
                    d="M959 825.17V629.52c0-22.29-3.05-44.23-17-62.65-18.22-24.11-44.7-37.8-75.1-37.85h-49.2V199.7c0-10.75 0.71-21.85-0.37-32.58-3.05-30.33-17.11-57.34-43-74.35C761 84 744.75 79.89 728.85 79.85H306.66c-20.63 0-40.75 1.67-58.52 14-25.47 17.65-39.76 45.44-41.61 76.17-0.22 3.64-0.13 7.31-0.13 11V529h-48.57c-25.23 0-50.15 9.16-67.64 27.82a92.28 92.28 0 0 0-25 62.37v134.34c0 33.42-0.31 66.86 0 100.28 0.2 22.06 8.09 42.19 22.07 59.07 15.32 18.5 37.73 28.37 61.2 30.86a153.52 153.52 0 0 0 16.2 0.39h704.11c0.58 0 1.16 0 1.73-0.06 23.32-0.69 46.09-10.05 62.5-26.81A91.82 91.82 0 0 0 959 854c0.05-9.64 0-19.24 0-28.83z m-71.85-230a11.48 11.48 0 0 1-1.41-1.1c0.05-0.07 0.65 0.38 1.37 1.05zM751.26 152.06a16.91 16.91 0 0 1-1.23-1.61c0.72 0.77 1.31 1.47 1.23 1.61zM282 143c0.06 0.08-0.61 0.59-1.41 1.18z m-2.46 2.09c2-1.22 4-2.4 6-3.47a56.92 56.92 0 0 1 5.59-1.51c4.35-0.24 8.74-0.11 13.08-0.11h374.26c17.13 0 34.27-0.15 51.4 0 1 0 2.06 0.05 3.09 0.11a55.63 55.63 0 0 1 5.66 1.53c2 1 3.84 2.12 5.72 3.29 1.18 1.06 2.35 2.12 3.46 3.26 0.16 0.17 0.93 0.93 1.71 1.74 0.32 0.45 0.64 0.91 1 1.38a65.93 65.93 0 0 1 4 7.13 74.65 74.65 0 0 1 2.86 10.56c1.13 12.93 0.2 26.35 0.2 39.21v293.25c0 9.18-0.11 18.37-0.13 27.56H266.52V216.8c0-14.06-0.1-28.13 0-42.19 0-2 0.1-3.9 0.25-5.84a75.9 75.9 0 0 1 2.82-10.36 65.24 65.24 0 0 1 3.69-6.57c0.14-0.23 0.39-0.59 0.68-1 0.8-0.93 1.9-2.22 2.34-2.68 1.04-1.07 2.13-2.1 3.25-3.1zM131.23 600.87a9.07 9.07 0 0 1-1.1 1.41c-0.07-0.09 0.44-0.69 1.1-1.41zM137 878a10.19 10.19 0 0 1 1.42 1.1c-0.12 0.11-0.71-0.4-1.42-1.1z m582.63 6h-563.6c-1.59 0-3.17-0.06-4.75-0.16a66.25 66.25 0 0 1-7.72-2.12 60.31 60.31 0 0 1-6-3.43c-0.37-0.24-0.74-0.5-1.1-0.75-1.1-1-2.28-2.23-2.39-2.35-1-1-1.9-2.12-2.87-3.15a59.71 59.71 0 0 1-3.66-6.35 65.47 65.47 0 0 1-2.13-7.79c-0.61-8.29-0.15-16.78-0.15-25V646c0-10-0.67-20.45 0.11-30.55a66.71 66.71 0 0 1 2.17-8 61.31 61.31 0 0 1 3.43-6c0.24-0.38 0.5-0.74 0.75-1.1 1-1.1 2.23-2.28 2.35-2.4 1-1 2.12-1.89 3.15-2.86a59.71 59.71 0 0 1 6.35-3.66 64 64 0 0 1 7.7-2.12c7.12-0.5 14.39-0.16 21.47-0.16h695.29c1.6 0 3.19 0.06 4.78 0.16a64 64 0 0 1 7.73 2.12 60.31 60.31 0 0 1 6 3.43c0.37 0.24 0.73 0.5 1.1 0.75 1.1 1 2.28 2.23 2.39 2.34 1 1 1.89 2.13 2.86 3.16a58 58 0 0 1 3.66 6.35 63.18 63.18 0 0 1 2.14 7.79c0.61 8.29 0.15 16.78 0.15 25v186.94c0 10 0.66 20.45-0.12 30.55a62.55 62.55 0 0 1-2.17 8 58.4 58.4 0 0 1-3.43 6c-0.24 0.37-0.49 0.74-0.75 1.1-1 1.1-2.23 2.28-2.34 2.39-1 1-2.12 1.9-3.16 2.87a60.58 60.58 0 0 1-6.34 3.66 65.52 65.52 0 0 1-7.76 2.13c-1.33 0.08-2.66 0.14-4 0.15H719.61z m173.25-11.72a11.17 11.17 0 0 1 1.1-1.42c0.02 0.14-0.45 0.7-1.12 1.43z"
                  />
                  <path
                    fill="#4b9df3"
                    d="M457.8 299.93l81.4-0.33 129.58-0.54 29.51-0.13c15.72-0.06 30.79-13.78 30.06-30.06s-13.21-30.13-30.06-30.06l-81.4 0.34-129.58 0.54-29.51 0.12c-15.72 0.07-30.79 13.78-30.06 30.06S441 300 457.8 299.93zM698.29 367.29H457.8c-15.73 0-30.79 13.82-30.06 30.06s13.26 30.06 30.06 30.06h240.49c15.73 0 30.79-13.83 30.06-30.06s-13.21-30.06-30.06-30.06z"
                  />
                  <path
                    fill="#4b9df3"
                    d="M325.8 239.31m30.06 0l0 0q30.06 0 30.06 30.06l0 0q0 30.06-30.06 30.06l0 0q-30.06 0-30.06-30.06l0 0q0-30.06 30.06-30.06Z"
                  />
                  <path
                    fill="#4b9df3"
                    d="M325.8 368.43m30.06 0l0 0q30.06 0 30.06 30.06l0 0q0 30.06-30.06 30.06l0 0q-30.06 0-30.06-30.06l0 0q0-30.06 30.06-30.06Z"
                  />
                </svg>
              </span>
              <span class="quick-text">合同管理</span>
            </router-link>
          </div>
          <div class="quick-item">
            <router-link to="/front/creditManagement/creditGranting/customer">
              <span class="quick-icon-wrap">
                <svg
                  class="svg-icon"
                  width="57px"
                  viewBox="0 0 1024 1024"
                  version="1.1"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    fill="#4b9df3"
                    d="M736.8 235.1h-89.6L509.1 97 371 235.1h-83.8L148.3 662.7 512 927l363.7-264.3-138.9-427.6z m-227.7-73l73 73H436l73.1-73z m-306.8 483l118.3-364h382.8l118.3 364-309.7 225-309.7-225zM703.7 488.5L569.2 469l-60.1-121.8L448.9 469l-134.5 19.5 97.3 94.8-23 133.9L509 654l120.3 63.2-23-133.9 97.4-94.8zM568.2 633.2L509 602.1l-59.2 31.1 11.3-65.9-47.9-46.7 66.2-9.6 29.6-60 29.6 60 66.2 9.6-47.9 46.7 11.3 65.9z"
                  />
                </svg>
              </span>
              <span class="quick-text">授信管理</span>
            </router-link>
          </div>
          <div class="quick-item">
            <router-link to="/creditRestoration">
              <span class="quick-icon-wrap">
                <!-- <svg
                  class="svg-icon"
                  width="47px"
                  viewBox="0 0 1024 1024"
                  version="1.1"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    fill="#4b9df3"
                    d="M960.1 159.2c0-17.7-14.3-32-32-32H100.2c-1.3-0.2-2.6-0.3-3.9-0.3-14.4 0-26.5 9.5-30.6 22.5-1 3.1-1.5 6.3-1.5 9.7 0 0.7 0 1.5 0.1 2.2v512c0.8 17 14.8 30.5 32 30.5 9.4 0 17.9-4.1 23.7-10.6l231.5-231.5L465 575.6c12.5 12.5 32.8 12.5 45.3 0l1-1 133-133c13.3 6.6 28.4 10.3 44.3 10.3 55.2 0 99.9-44.7 99.9-99.9s-44.7-99.9-99.9-99.9-99.9 44.7-99.9 99.9c0 15.9 3.7 30.9 10.3 44.3L487.6 507.6 376.5 396.5c-0.7-0.9-1.5-1.7-2.3-2.5-12.5-12.5-32.8-12.5-45.3 0L128.2 594.6V191.2H896v448.7H518.2c-1.7-0.3-3.4-0.4-5.2-0.4-1.8 0-3.5 0.1-5.2 0.4H288.2c-17.7 0-32 14.3-32 32s14.3 32 32 32H481V832H288c-17.7 0-32 14.3-32 32s14.3 32 32 32h448c17.7 0 32-14.3 32-32s-14.3-32-32-32H545V703.9h378.7c1.4 0.2 2.9 0.3 4.3 0.3 17.7 0 32-14.3 32-32V161.8c0.1-0.9 0.1-1.7 0.1-2.6z m-271.6 157c19.8 0 35.9 16.1 35.9 35.9S708.3 388 688.5 388s-35.9-16.1-35.9-35.9 16.1-35.9 35.9-35.9z"
                  />
                </svg> -->
                <svg class="svg-icon" width="47px" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg">
                  <path fill="#4b9df3" d="M229.9 794.1m-60 0a60 60 0 1 0 120 0 60 60 0 1 0-120 0Z"  />
                  <path fill="#4b9df3" d="M229.8 962c-43 0-86-16.3-118.7-49.1-65.5-65.5-65.4-172.2 0.2-237.8 0.3-0.3 0.6-0.6 0.9-0.8l345.5-318.7c-5.6-35.8-3.6-72.7 6.1-107.6 11.6-42 34.1-80.6 65.1-111.5C594 71.4 689.5 46.7 778.2 72c10.2 2.9 18.1 11 20.8 21.3 2.7 10.3-0.3 21.2-7.8 28.7l-45.3 45.3c-30.6 30.6-30.6 80.4 0 111 14.7 14.7 34.4 22.9 55.5 22.9s40.8-8.1 55.5-22.9l45.3-45.3c7.5-7.5 18.4-10.5 28.7-7.8s18.4 10.6 21.3 20.8c25.3 88.6 0.6 184.2-64.5 249.3-31 31-69.5 53.5-111.5 65.1-35 9.7-71.8 11.7-107.6 6.1L349.7 911.8c-0.3 0.3-0.6 0.6-0.8 0.9-32.9 32.9-76 49.3-119.1 49.3z m-76.5-244.1c-20.1 20.3-31.2 47.3-31.2 76.2 0 29 11.1 56.1 31.4 76.4 20.3 20.3 47.4 31.4 76.4 31.4 28.8 0 55.8-11.1 76.2-31.2l329.6-357.3c7.3-7.9 18.3-11.3 28.8-8.9 31.5 7.3 64.5 6.6 95.6-2 32-8.9 61.5-26 85.1-49.7 36.3-36.3 56.1-84.9 56.7-134.8l-2.7 2.7c-26.1 26.1-60.8 40.4-97.9 40.4s-71.9-14.4-97.9-40.4c-54-54-54-141.9 0-195.9l2.7-2.7c-49.9 0.6-98.5 20.4-134.8 56.7-23.7 23.7-40.8 53.1-49.7 85.1-8.6 31.1-9.3 64.2-2 95.6 2.4 10.5-1 21.5-8.9 28.8L153.3 717.9z"  /><path fill="#4b9df3" d="M842.2 956c-29.7 0-59.4-11.3-82-33.9L519.7 681.6c-11.4-11.4-11.8-29.7-0.8-41.6l116.7-126.6c5.5-6 13.3-9.5 21.4-9.7 8.2-0.2 16 3 21.8 8.8l245.4 245.4c21.8 21.8 33.9 51 33.9 82 0 31.1-12 60.2-33.9 82l-21.2-21 21.2 21.2c-22.6 22.6-52.3 33.9-82 33.9zM582.5 659.6l220.1 220.1c21.8 21.8 57.4 21.8 79.2 0 10.5-10.5 16.3-24.6 16.3-39.6s-5.8-29.1-16.3-39.6L658.5 577.2l-76 82.4zM190.3 273.6c-21.9 0-43.8-8.3-60.5-25l-55.5-55.5c-11.7-11.7-11.7-30.7 0-42.4l78.5-78.5c5.6-5.6 13.3-8.8 21.2-8.8 8 0 15.6 3.2 21.2 8.8l55.5 55.5c33.3 33.3 33.3 87.6 0 120.9-16.7 16.7-38.5 25-60.4 25z m-52.4-101.7l34.3 34.3c9.9 9.9 26.1 9.9 36.1 0 9.9-9.9 9.9-26.1 0-36.1L174 135.8l-36.1 36.1z"  />
                  <path fill="#4b9df3" d="M426.5 454.4c-7.7 0-15.4-2.9-21.2-8.8l-197-197c-11.7-11.7-11.7-30.7 0-42.4s30.7-11.7 42.4 0l197 197c11.7 11.7 11.7 30.7 0 42.4-5.8 5.9-13.5 8.8-21.2 8.8z"  />
                </svg>
              </span>
              <span class="quick-text">信用修复</span>
            </router-link>
          </div>
          <div class="quick-item">
            <router-link to="/relation/relation">
              <span class="quick-icon-wrap">
                <svg
                  class="svg-icon"
                  width="47px"
                  viewBox="0 0 1024 1024"
                  version="1.1"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    fill="#4b9df3"
                    d="M824.889 682.667c-28.445 0-56.889 11.377-79.645 22.755l-45.51-45.51c22.755-34.134 39.822-73.956 39.822-119.468 0-62.577-28.445-119.466-73.956-153.6l22.756-45.51h22.755c79.645 0 142.222-62.578 142.222-142.223S790.756 56.89 711.111 56.89 568.89 119.467 568.89 199.11c0 51.2 28.444 91.022 62.578 119.467L614.4 358.4c-22.756-11.378-45.511-17.067-73.956-17.067-108.088 0-199.11 91.023-199.11 199.111 0 28.445 5.688 51.2 17.066 73.956l-39.822 17.067c-28.445-34.134-68.267-62.578-119.467-62.578-79.644 0-142.222 62.578-142.222 142.222s62.578 142.222 142.222 142.222 142.222-62.577 142.222-142.222v-22.755l45.511-22.756c34.134 45.511 91.023 73.956 153.6 73.956 45.512 0 85.334-17.067 119.467-39.823l45.511 45.511c-11.378 22.756-22.755 51.2-22.755 79.645 0 79.644 62.577 142.222 142.222 142.222S967.11 904.533 967.11 824.89 904.533 682.667 824.89 682.667zM711.11 113.777c45.511 0 85.333 39.823 85.333 85.334s-39.822 85.333-85.333 85.333-85.333-39.822-85.333-85.333 39.822-85.333 85.333-85.333z m-512 682.667c-45.511 0-85.333-39.822-85.333-85.333s39.822-85.333 85.333-85.333 85.333 39.822 85.333 85.333-39.822 85.333-85.333 85.333z m199.111-256c0-79.644 62.578-142.222 142.222-142.222S682.667 460.8 682.667 540.444s-62.578 142.223-142.223 142.223-142.222-62.578-142.222-142.223zM824.89 910.222c-45.511 0-85.333-39.822-85.333-85.333s39.822-85.333 85.333-85.333 85.333 39.822 85.333 85.333-39.822 85.333-85.333 85.333z"
                  />
                </svg>
              </span>
              <span class="quick-text">关系挖掘</span>
            </router-link>
          </div>
        </div>
      </el-main>
    </div>
    <!--        信息项-->
    <div class="info-wrap">
      <el-main>
        <div class="flex info-item info-item1">
          <div class="left wow animate__fadeInLeft">
            <swiper :options="swiperOption0"  ref="mySwiperLeft" @ready="onReadyLeft">
              <swiper-slide class="slide-item">
                <img src="../../assets/images/home/info-img-g-1.png" alt />
              </swiper-slide>
              <swiper-slide class="slide-item">
                <img src="../../assets/images/home/info-img-g-2.png" alt />
              </swiper-slide>
              <swiper-slide class="slide-item">
                <img src="../../assets/images/home/info-img-g-3.png" alt />
              </swiper-slide>
              <swiper-slide class="slide-item">
                <img src="../../assets/images/home/info-img-g-4.png" alt />
              </swiper-slide>
              <swiper-slide class="slide-item">
                <img src="../../assets/images/home/info-img-g-5.png" alt />
              </swiper-slide>
            </swiper>
          </div>
          <div class="right wow animate__fadeInRight">
            <div class="p1">企业信用管理</div>
            <swiper :options="swiperOption1" ref="mySwiper1" @ready="onReady">
              <swiper-slide class="slide-item">
                <div class="inner">
                  <h3 class="title">海量信用数据支撑，企业建档自动识别补全</h3>
                  <p
                    class="desc"
                  >通过对海量信用数据进行分析，打通多元化数据来源壁垒，帮助用户对企业客户信息进行快速建档自动化补全，并提供及时更新机制，降低企业信用管理工作人员的维护成本。利用人工智能、机器学习技术进行深入挖掘企业信用价值，降低企业业务经营风险，提高企业整体竞争力。</p>
                </div>
              </swiper-slide>
              <swiper-slide class="slide-item">
                <div class="inner">
                  <h3 class="title">先进的风险评估模型，全行业深度资信评级</h3>
                  <p
                    class="desc"
                  >风信标平台根据不同的行业、不同的企业类型，以及可能存在的多种风险，建立风险评估模型，运用大数据、机器学习算法，构建企业全面信用风险知识图谱，从海量的企业信用数据中对企业客户可能存在的潜在风险进行及时监控预警，服务全行业企业信用深度资信评级。</p>
                </div>
              </swiper-slide>
              <swiper-slide class="slide-item">
                <div class="inner">
                  <h3 class="title">信用管理定制化流程，风险全流程实施监控</h3>
                  <p
                    class="desc"
                  >企业全流程风险管控包括对企业在各个交易流程中的风险的监测、预警以及风险预案的制定。针对交易过程中存在的关键节点流程进行及时风险把控，同时对接风信标云数据平台，根据预设的指标及时获取最新风险信息，起到监测预警的作用</p>
                </div>
              </swiper-slide>
              <swiper-slide class="slide-item">
                <div class="inner">
                  <h3 class="title">AI智能化决策引擎，全方位提升企业商业价值</h3>
                  <p
                    class="desc"
                  >风信标平台通过AI智能化决策引擎，对平台各功能区间、各业务流程、各功能操作提供监测，并针对不同业务场景提供指定信用策略。帮助企业降低经营成本，提升销售收入，缩短资金周转周期，降低坏账损失，提升企业经营效率，全方位提升企业商业价值。</p>
                </div>
              </swiper-slide>
              <swiper-slide class="slide-item">
                <div class="inner">
                  <h3 class="title">信用管理风险监测，自动化分析报表输出</h3>
                  <p
                    class="desc"
                  >平台提供智能化报表分析工具，针对对账龄、汇款、信用评估进行分析，阶段性对网络舆论进行研判分析，包括周、月、季、年及专项报告等，及时反馈修正信用评估方案，通过基本图表和可视化分析相结合的技术，对企业的信用管理的不同维度进行分析展示。</p>
                </div>
              </swiper-slide>
              <div class="swiper-pagination" slot="pagination"></div>
            </swiper>
            <router-link class="a-todo" to="/front/creditManagement/todo">
              <el-button type="primary" clasfs="btn">立即使用</el-button>
            </router-link>
          </div>
        </div>
      </el-main>
      <el-main>
        <div class="flex v-center info-item info-item2" style="padding-top:20px">
          <div class="left wow animate__fadeInLeft">
            <img src="../../assets/images/home/info-img-2.png" alt />
          </div>
          <div class="right wow animate__fadeInRight">
            <div class="p1">企业风险监测</div>
            <h3 class="title">海量信用风险挖掘，大数据AI智能分析预警</h3>
            <p
              class="desc"
            >风信标依托于海量企业信用数据库，及时获取最新信用风险信息，结合数据风险分析挖掘技术，帮助客户从海量企业信息中高效挖掘有效风险，通过AI智能分析预警服务帮助客户获取新的分析视野，及时洞察风险，建立全面风险管理体系。</p>
            <router-link class="a-todo" to="/monitor/creditInfo">
              <el-button type="primary" class="btn">立即使用</el-button>
            </router-link>
          </div>
        </div>
      </el-main>
      <el-main>
        <div class="flex info-item info-item3">
          <div class="left wow animate__fadeInLeft">
            <img src="../../assets/images/home/info-img-3.png" alt />
          </div>
          <div class="right wow animate__fadeInRight">
            <div class="p1">风险信息交换</div>
            <h3 class="title">搭建信用联盟平台，助力风险信息交换共享</h3>
            <p
              class="desc"
            >风信标为信用服务机构、金融服务机构、行业协会商会、企业客户提供信用联盟平台，为联盟成员提供风险信息交换功能，通过区块链分布式加密技术，为联盟成员提供私有化风险信息联盟共享交换，服务联盟成员提供更为多维的风险预警防控方案。</p>
            <el-button type="primary" class="btn" @click="otherLogin">立即使用</el-button>
          </div>
        </div>
      </el-main>
      <el-main>
        <div class="info-item info-item4">
          <h2 class="title wow animate__lightSpeedInRight">
            提供超过
            <span>6000万</span>
            家企业实时信用风险监测
          </h2>
          <p
            class="title-sub wow animate__lightSpeedInLeft"
          >风信标-企业全面风险管理平台提供全国超过6000万家企业的信用信息查询功能。企业用户可根据需要进行企业关键词匹配或法人查询</p>
          <img src="../../assets/images/home/info-img-4.png" alt />
        </div>
      </el-main>
      <el-main>
        <div class="info-item info-item5"  @mouseenter="stopLun"  @mouseleave="startLun">
          <swiper :options="swiperOption2"  ref="mySwiper2">
          
            <swiper-slide class="slide-item">
              <!--                            <div ref="chart1" style="height: 400px;"></div>-->
              <h2 class="title wow animate__lightSpeedInRight">
                全国各区域经营违约风险发生指数
                <router-link :to="{name:'riskIndex'}">
                  <!-- <img src="../../assets/images/home/arrow-right-top.png" alt /> -->
                  <el-button type="primary" style="vertical-align: middle;">查看详情</el-button>
                </router-link>
              </h2>
              <p class="title-sub wow animate__lightSpeedInLeft">
                以全国失信被执行人、被执行人、行政处罚、经营异常记录为基础数据，根据省级区划划分进行分类统计，将通过科学计算、加权得出风险指数，
                <br />以下数据更新时间为{{month}}-01，仅供参考；
              </p>
              <!--              <img class="chart-img" src="../../assets/images/home/img-chart-1.png" alt />-->
              <div id="areaChart" style="width: 1160px;height: 424px;"></div>
            </swiper-slide>
            <swiper-slide class="slide-item">
              <!--                            <div ref="chart2" style="height: 400px;"></div>-->
              <h2 class="title wow animate__lightSpeedInRight">
                全国各行业经营违约风险发生指数
                <router-link :to="{name:'riskIndex'}">
                  <!-- <img src="../../assets/images/home/arrow-right-top.png" alt /> -->
                <el-button type="primary" style="vertical-align: middle;">查看详情</el-button>
                </router-link>
              </h2>
              <p class="title-sub wow animate__lightSpeedInLeft">
                以全国失信被执行人、被执行人、行政处罚、经营异常记录为基础数据，根据行业门类划分进行分类统计，将通过科学计算、加权得出风险指数，
                <br />以下数据更新时间为{{month}}-01，仅供参考；
              </p>
              <div id="industryChart" style="width: 1160px;height: 424px;"></div>
              <!--              <img class="chart-img" src="../../assets/images/home/img-chart-2.png" alt />-->
            </swiper-slide>
            <div class="swiper-pagination" slot="pagination"></div>
          </swiper>
        </div>
      </el-main>
      <el-main>
        <div class="flex info-item info-item6" style="padding-top:55px;padding-bottom:55px">
          <div class="box">
            <img class="bg" src="../../assets/images/home/info-img-5.png" alt />
            <div class="c">
              <div class="text-wrap">
                <p class="t">SaaS化云平台保障</p>
                <p class="d">SaaS化云平台方式为企业用户提供服务，增强企业抵御风险、防御风险的能力，多点备份、异地备份等机制确保数据可靠性高达99.999%。</p>
              </div>
              <div class="top-right">
                <img src="../../assets/images/home/top-right-1.png" alt />
              </div>
            </div>
          </div>
          <div class="box">
            <img class="bg" src="../../assets/images/home/info-img-6.png" alt />
            <div class="c">
              <div class="text-wrap">
                <p class="t">区块链云存储技术</p>
                <p
                  class="d"
                >基于高效的区块链信用数据共享平台，聚焦企业内、外部信用风险管理业务，通过分布式数据存储、点对点传输、共识机制、加密算法等技术保障平台数据安全可靠可追溯。</p>
              </div>
              <div class="top-right">
                <img src="../../assets/images/home/top-right-2.png" alt />
              </div>
            </div>
          </div>
          <div class="box">
            <img class="bg" src="../../assets/images/home/info-img-7.png" alt />
            <div class="c">
              <div class="text-wrap">
                <p class="t">信息安全管理</p>
                <p class="d">风信标从网络安全防护、数据库安全防护、存储安全防护、运维安全等多维度保障平台信息安全，确保用户信息的自有性、不可篡改、高可用、高可靠。</p>
              </div>
              <div class="top-right">
                <img src="../../assets/images/home/top-right-3.png" alt />
              </div>
            </div>
          </div>
        </div>
      </el-main>
    </div>
    <RiskModel :risk="false" v-if='IsRiskShow'></RiskModel>
     <!-- 注册成功弹窗 -->
     <RiskSuccessModel v-if="registerSuccess" @chageSuccess='chageSuccess' @hideModel="hideModel"></RiskSuccessModel>
    <el-footer>
      <FxbFooter />

    </el-footer>
  </el-container>
</template>

<script>
import echarts3 from "echarts";
import { mapState } from "vuex";
import { WOW } from "wowjs";
import {
  Api_analysisResultsMap,
  Api_analysisResultsArea,
  Api_analysisResultsTrend,
  Api_analysisResultsWork,
  Api_analysisResultsWorkTrend,
  Api_analysisResultsMonth,
} from "@/api/creditManagement/index.js";
import RiskSuccessModel from "@/components/Riskexamination/registerSuccess"
import FxbHeader from "@/views/layouts/fxb/components/FxbHeader";
import RiskModel from "@/components/Riskexamination"
import FxbFooter from "@/views/layouts/fxb/components/FxbFooter";
import {
    getToken,
    getRefToken
} from '../../utils/auth';
export default {
  name: "Index",
  components: {
    FxbHeader,
    FxbFooter,
    RiskModel,
    RiskSuccessModel
  },
  data () {
    const swiperHeight = 570;
    const _this = this;
    return {
      IsRiskShow:false,
      registerSuccess: false,
      swiperHeight,
      swiperOption: {
        direction: "vertical",
        autoplay: {
          delay: 8000,
          disableOninteraction: true
        },
        loop: true,
        speed: 1500,
        observer: true,
        observeParents: true,
        height: swiperHeight,
        pagination: {
          el: ".swiper-pagination",
          clickable: true,
        },
        on: {
          click: (e) => {
            const button = e.target.closest(".btn");
            const button1 = e.target.closest(".btn1");
            if (button) {
              this.bannerLogin();
            }else if (button1)  {
              this.handleClick()
            }
          },
        },
      },
      swiperOption0: {
        effect: "fade",
        fadeEffect: {
          crossFade: true,
        },
        // autoplay: true,
        loop: true,
        speed: 2000,
        observer: true,
        observeParents: true,
      },
      swiperOption1: {
        // effect: 'fade',
        // autoplay: true,
        loop: true,
        speed: 5000,
        observer: true,
        observeParents: true,
        pagination: {
          el: ".swiper-pagination",
          clickable: true,
        },
        on: {
          slideChangeTransitionStart () {
            const wrap = _this.$refs.mySwiper1.$el;
            const slideItemDuplicateActive = wrap.querySelector(".swiper-slide-duplicate-active .inner");
            if (slideItemDuplicateActive) {
              const classNameDuplicateActive = slideItemDuplicateActive.className.replace(/hide/g, "");
              slideItemDuplicateActive.className = classNameDuplicateActive + " show";
            }
            const slideItemPrev = wrap.querySelector(".swiper-slide-prev .inner");
            const classNamePre = slideItemPrev.className.replace(/show/g, "");
            slideItemPrev.className = classNamePre + " hide";
            const slideItemActive = wrap.querySelector(".swiper-slide-active .inner");
            const classNameActive = slideItemActive.className.replace(/hide/g, "");
            slideItemActive.className = classNameActive + " show";
            const slideItemNext = wrap.querySelector(".swiper-slide-next .inner");
            const classNameNext = slideItemNext.className.replace(/show/g, "");
            slideItemNext.className = classNameNext + " hide";
          },
        },
      },
      activeIndex: 0,
      swiperOption2: {
        // effect: "fade",
        autoplay: true,
        // loop: true,
        speed: 7000,
        observer: true,
        observeParents: true,
        pagination: {
          el: ".swiper-pagination",
          clickable: true,
        },
        on: {
          slideChange () {
            _this.activeIndex = this.activeIndex;
          },
        },
      },
      chart1: null,
      chart2: null,
      isRegister: false,//是否从注册页面而来
      swiperLeft: null,
      swiper1: null,
      month: '',
      loading_area: false,
      loading_industry: false,
      tokenRef: getRefToken()
    };
  },
  computed: {
    IsShowF() {
      return this.$store.state.user.IsShowF;
    },
    userInfo () {
      return this.$store.getters.userInfo;
    },
    ...mapState({
      isMobile: (state) => state.global.isMobile,
    }),
  },
  created() {
    if (this.$store.state.user.userInfo && getRefToken() && this.$route.query.IsShowF == '1') {
      this.registerSuccess = true       
    }
  },
  watch: {
    $route:{
      handler(val,oldval){
        if ( getRefToken() && this.$route.query.IsShowF && this.$route.query.IsShowF == 1 ) {
          this.registerSuccess = true    
        }
      },
      deep: true,
      immediate:true
    }
  },
  mounted () {

    new WOW({
      live: false,
      animateClass: "animate__animated",
      scrollContainer: "#app .scroll-wrap .el-scrollbar__wrap",
    }).init();
    this.$refs.mySwiperLeft.$el.addEventListener("mouseover", this.onMouseover, false);
    this.$refs.mySwiperLeft.$el.addEventListener("mouseleave", this.onMouseleave, false);
    this.$refs.mySwiper1.$el.addEventListener("mouseover", this.onMouseover, false);
    this.$refs.mySwiper1.$el.addEventListener("mouseleave", this.onMouseleave, false);
    Api_analysisResultsMonth().then((res) => {
      this.month = res;
      this.fetchData();
    });
  },
  beforeDestory () {
    this.$refs.mySwiperLeft.$el.removeEventListener("mouseover", this.onMouseover);
    this.$refs.mySwiperLeft.$el.removeEventListener("mouseleave", this.onMouseleave);
    this.$refs.mySwiper1.$el.removeEventListener("mouseover", this.onMouseover);
    this.$refs.mySwiper1.$el.removeEventListener("mouseleave", this.onMouseleave);
  },
  methods: {
    // 暂停轮播图
    stopLun(){
      this.$refs.mySwiper2.swiper.autoplay.stop()
    },
    // 开始轮播图
    startLun(){
      this.$refs.mySwiper2.swiper.autoplay.start()
    },
    hideModel(val){
      this.registerSuccess = val
      this.IsRiskShow = val
    },
    handleClick(){
      this.$router.push('/creditRestoration')
    },
    chageSuccess(val){
      this.IsRiskShow = val
      this.registerSuccess = false
    },
    onReadyLeft (swiper) {
      this.swiperLeft = swiper;
    },
    onReady (swiper) {
      this.swiper1 = swiper;
    },
    onMouseover () {
      this.swiperLeft.autoplay.stop();
      this.swiper1.autoplay.stop();
    },
    onMouseleave () {
      this.swiperLeft.autoplay.start();
      this.swiper1.autoplay.start();
    },
    bannerLogin () {
      if (this.userInfo.id) {
        this.$router.push("/front/creditManagement/todo");
      } else {
        this.$login.register();
      }
    },
    otherLogin () {
      if (this.userInfo.id) {
        this.$message.info("您已成功登录平台");
      } else {
        this.$login.register();
      }
    },
    fetchData () {
      this.getListArea();
      this.getListIndustry()
    },
    getListArea () {
      this.loading_area = true;
      Api_analysisResultsArea(this.month, { area: "" })
        .then((res) => {
          this.loading_area = false;
          this.areaChart(res)
        })
        .catch((res) => {
          this.loading_area = false;
        });
    },
    areaChart (res) {
      const indexChart = echarts3.init(document.getElementById("areaChart"));
      const option = {
        tooltip: {
          trigger: "axis",
          axisPointer: {
            // 坐标轴指示器，坐标轴触发有效
            type: "shadow", // 默认为直线，可选为：'line' | 'shadow'
          },
        },
        grid: {
          left: "3%",
          right: "4%",
          bottom: "3%",
          top: 15,
          containLabel: true,
        },
        xAxis: [
          {
            type: "category",
            data: res.map((i) => i.indexProvince),
            axisTick: {
              alignWithLabel: true,
            },
            axisLabel: {
              rotate: -45
            },
            axisLine: {
              lineStyle: {
                color: "#aaa",
              },
            },
            splitLine: {
              lineStyle: {
                color: "#eee",
              },
            },
          },
        ],
        yAxis: [
          {
            type: "value",
            axisLine: {
              lineStyle: {
                color: "#aaa",
              },
            },
            splitLine: {
              lineStyle: {
                color: "#eee",
              },
            },
          },
        ],
        series: [
          {
            name: "指数",
            type: "bar",
            barWidth: "13",
            data: res.map((i) => i.indexScorce),
            itemStyle: {
              normal: {
                barBorderRadius: [3, 3, "", ""],
                color: new echarts3.graphic.LinearGradient(0, 0, 0, 1, [
                  { offset: 0, color: "#67A8F8" },
                  { offset: 1, color: "#76B1F9" },
                ]),
              },
            },
          },
        ],
      };
      indexChart.setOption(option);
    },
    getListIndustry () {
      this.loading_industry = true;
      Api_analysisResultsWork(this.month, { area: "" })
        .then((res) => {
          this.loading_industry = false;
          this.industryChart(res)
        })
        .catch((res) => {
          this.loading_industry = false;
        });
    },
    industryChart (res) {
      const indexChart = echarts3.init(document.getElementById("industryChart"));
      const option = {
        tooltip: {
          trigger: "axis",
          axisPointer: {
            // 坐标轴指示器，坐标轴触发有效
            type: "shadow", // 默认为直线，可选为：'line' | 'shadow'
          },
        },
        grid: {
          left: "3%",
          right: "4%",
          bottom: "3%",
          top: 15,
          containLabel: true,
        },
        xAxis: [
          {
            type: "category",
            data: res.map((i) => i.indexIndustry),
            axisTick: {
              alignWithLabel: true,
            },
            axisLabel: {
              rotate: -45
            },
            axisLine: {
              lineStyle: {
                color: "#aaa",
              },
            },
            splitLine: {
              lineStyle: {
                color: "#eee",
              },
            },
          },
        ],
        yAxis: [
          {
            type: "value",
            axisLine: {
              lineStyle: {
                color: "#aaa",
              },
            },
            splitLine: {
              lineStyle: {
                color: "#eee",
              },
            },
          },
        ],
        series: [
          {
            name: "指数",
            type: "bar",
            barWidth: "13",
            data: res.map((i) => i.indexScorce),
            itemStyle: {
              normal: {
                barBorderRadius: [3, 3, "", ""],
                color: new echarts3.graphic.LinearGradient(0, 0, 0, 1, [
                  { offset: 0, color: "#67A8F8" },
                  { offset: 1, color: "#76B1F9" },
                ]),
              },
            },
          },
        ],
      };
      indexChart.setOption(option);
    },
  },
};
</script>

<style rel="scss" lang="scss">
.swiper-slide {
  width: 100% !important;
}

.home-item {
  border-radius: 0 !important;

  .el-card__body {
    padding: 0;
  }
}
</style>

<style rel="scss" lang="scss" scoped>
.home-title {
  text-align: center;
  margin-top: 0;
  margin-bottom: 25px;
}

.home-tip {
  text-align: center;
  margin-bottom: 50px;
}

.home-tip2 {
  text-align: center;
}

.home-item {
  margin-bottom: 85px;

  .img-box {
    width: 100%;
    height: 245px;
    overflow: hidden;
  }

  &:hover img {
    transform: scale(1.1);
    transition: all 0.2s linear;
  }
}

.home-left {
  position: relative;

  p {
    color: #eee;
    position: absolute;
    width: 170px;
    bottom: 76px;
    left: 44px;
    line-height: 24px;
  }

  h2 {
    color: #eee;
    position: absolute;
    bottom: 37px;
    left: 43px;
  }
}

.home-wz {
  background-color: #f7f8f9;
  padding: 80px 0 94px 0;
  margin-left: -79px;

  h4 {
    font-size: 16px;
    position: relative;
    padding-left: 32px;
    margin-top: 23px;
    margin-left: 32px;

    &:before {
      content: "";
      background-color: #4888cb;
      height: 18px;
      width: 18px;
      position: absolute;
      top: 4px;
      left: 0;
    }
  }

  h1 {
    width: 621px;
    line-height: 45px;
  }

  p {
    width: 415px;
    line-height: 24px;
  }
}

.home-wz-img {
  position: relative;

  img {
    display: block;
    position: relative;
    margin-top: 75px;

    &:before {
      content: "";
      background-color: #000;
      height: 5px;
      width: 100px;
      position: absolute;
      bottom: 0;
      right: 0;
    }
  }

  .img-border {
    background-color: #cbced1;
    height: 5px;
    width: 150px;
    margin-top: 30px;
    margin-left: 356px;
  }
}

.home-item2 {
  &.bottom65 {
    margin-bottom: 60px;
  }

  .img-box {
    width: 140px;
    height: 130px;
    float: left;
    margin-right: 28px;
    overflow: hidden;
  }

  &:hover img {
    transform: scale(1.1);
    transition: all 0.2s linear;
  }

  h2 {
    font-size: 20px;
    margin: 0;
    margin-top: 8px;
    margin-bottom: 15px;
  }

  p {
    overflow: hidden;
    font-size: 14px;
    color: #999;
    line-height: 22px;
  }
}

.home-item h2 {
  font-size: 18px;
  border-bottom: 1px dashed #ddd;
  padding-top: 20px;
  padding-bottom: 20px;
  margin: 0 15px;
}

.home-item .ellipsisMul {
  padding: 17px 15px 14px 15px;
  line-height: 23px;
}

.home-bottom {
  background-color: #2c4159;
  border-bottom: 1px solid #777;
  padding-bottom: 70px;

  h3 {
    color: #fff;
    margin: 70px 0 50px;
  }

  p {
    color: #999;
    font-size: 14px;
    line-height: 30px;
  }
}
</style>
<style scoped lang="scss">
/*@import '~@/styles/element-variables.scss';*/
.el-main {
  padding: 0;
  width: 1240px;
}

.banner-wrap {
  position: relative;

  .slide-item {
    position: relative;
    height: 570px;

    .banner-content {
      position: absolute;
      left: 50%;
      top: 160px;
      transform: translateX(-50%);

      .b-text {
        height: 49px;
        line-height: 49px;
        font-family: "siyuan";

        span:first-child {
          font-size: 36px;
          color: #019ae9;
        }

        span:last-child {
          font-size: 52px;
          background-image: linear-gradient(135deg, #16f9d0, #00c7dc);
          -webkit-background-clip: text;
          color: transparent;
          font-style: italic;
          padding-right: 20px;
        }
      }

      .text {
        line-height: 20px;
        color: #ebeef6;
        margin: 55px 0 78px;
        font-size: 20px;
        font-family: "siyuan";

        p:nth-child(2) {
          margin: 15px 0;
        }
      }

      .banner-img-wrap {
        img {
          display: block;
        }

        .img-text {
          margin-top: 55px;
          margin-bottom: 80px;
        }
      }

      .btn {
        background-color: #eee43e;
        border-radius: 6px;
        width: 160px;
        height: 55px;
        border: none;
        color: #0e1c29;
        font-size: 0;

        span {
          font-size: 20px;
          vertical-align: middle;
          font-weight: normal;
        }

        .icon.arror-right {
          margin-left: 20px;
        }
      }
      .btn1 {
        background-color: #eee43e;
        border-radius: 6px;
        width: 160px;
        height: 55px;
        border: none;
        color: #0e1c29;
        font-size: 0;

        span {
          font-size: 20px;
          vertical-align: middle;
          font-weight: normal;
        }

        .icon.arror-right {
          margin-left: 20px;
        }
      }
    }

    .image {
      display: block;
    }
  }

  .slide-item-1 {
    background: url("../../assets/images/home/banner-1.png") no-repeat
      center/cover;
  }
 .slide-item-4 {
  background: url('../../assets/images/home/banner-4.png') no-repeat center/cover;
      .banner-img {
        width: 100%;
        height: 100%;
        img {
            width: 100%;
            height: 100%;
        }
    }
   
 }
  .slide-item-2 {
    background: url("../../assets/images/home/banner-2.jpg") no-repeat
      center/cover;

    .banner-content .b-text {
      span:first-child {
        color: #ff5d5d;
      }

      span:last-child {
        font-style: normal;
        margin-left: 12px;
      }
    }
  }

  .slide-item-3 {
    background: url("../../assets/images/home/banner-3.jpg") no-repeat
      center/cover;

    .banner-content .b-text {
      span:first-child {
        color: #b04cff;
      }

      span:last-child {
        font-style: normal;
        margin-left: 12px;
      }
    }
  }

  .swiper-pagination {
    right: 32px;
    top: auto;
    bottom: 80px;

    /deep/ {
      .swiper-pagination-bullet {
        background-color: #fff;
        border-radius: 0;
        opacity: 1;
        width: 6px;
        height: 6px;
        transition: all 0.5s;
      }

      .swiper-pagination-bullet-active {
        height: 56px;
        background-color: #1fc5d3;
      }
    }
  }
}

.quick-enter-wrap {
  background: rgba(247, 250, 254, 1);
  box-shadow: 0px 6px 6px 0px rgba(75, 157, 243, 0.15);

  .quick-enter {
    height: 160px;
    justify-content: space-between;

    .quick-item {
      cursor: pointer;

      a {
        display: block;
        font-size: 0;

        span {
          vertical-align: middle;
        }
      }

      .hover {
        display: none;
      }

      &:hover {
        .quick-icon-wrap {
          &::before {
            background-color: rgba(75, 157, 243, 1);
          }

          &::after {
            /*animation: ani-round 1s infinite alternate ease-in-out;*/
            animation: ani-round2 1s infinite ease-out;
          }

          .svg-icon path {
            fill: #fff;
            /*stroke: #fff;*/
          }
        }
      }

      @keyframes ani-round {
        0% {
          transform: scale(1);
        }
        100% {
          transform: scale(1.4);
        }
      }
      @keyframes ani-round2 {
        0% {
          transform: scale(1);
          opacity: 1;
        }
        100% {
          transform: scale(1.4);
          opacity: 0;
        }
      }

      .quick-icon-wrap {
        width: 80px;
        height: 80px;
        text-align: center;
        line-height: 80px;
        margin-right: 20px;
        display: inline-flex;
        justify-content: center;
        position: relative;

        &::before {
          content: "";
          position: absolute;
          z-index: 1;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          transition: all 0.3s;
          border-radius: 50%;
          background-color: rgba(75, 157, 243, 0.3);
        }

        &::after {
          content: "";
          position: absolute;
          background-color: rgba(75, 157, 243, 0.5);
          border-radius: 50%;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          opacity: 0;
        }

        .svg-icon {
          position: relative;
          z-index: 2;

          path {
            transition: all 0.3s;
          }
        }
      }

      .quick-text {
        font-size: 20px;
        color: #333;
      }
    }
  }
}

.info-wrap {
  background: url("~@/assets/images/home/info-bg.png") no-repeat 0 0/100%;

  .info-item {
    justify-content: space-between;
    padding-top: 40px;
    padding-bottom: 40px;

    .right {
      width: 610px;

      .p1 {
        font-size: 16px;
        color: #666;
        margin-bottom: 22px;
      }

      .title {
        font-size: 29px;
        color: #333;
        margin-bottom: 30px;
      }

      .desc {
        font-size: 14px;
        color: #888;
        line-height: 28px;
        letter-spacing: 0.5px;
      }

      .btn {
        margin-top: 40px;
        height: 40px;
        padding-top: 0;
        padding-bottom: 0;
      }
    }
  }

  .info-item1 {
    padding-top: 44px;

    .left {
      width: 563px;
    }

    .left .slide-item {
      height: 374px;

      img {
        width: 420px;
        position: absolute;
        top: 50%;
        transform: translateY(-50%);
      }
    }

    .right .slide-item {
      margin-bottom: 100px;

      .inner {
        transition: opacity 2s;

        &.show {
          opacity: 1;
        }

        &.hide {
          opacity: 0;
        }
      }
    }

    .right {
      position: relative;
      padding-top: 32px;

      .a-todo {
        position: absolute;
        left: 0;
        bottom: 50px;
        z-index: 1;
      }
    }

    .swiper-pagination {
      position: absolute;
      right: 0;
      left: auto;
      width: auto;

      /deep/ {
        .swiper-pagination-bullet {
          background-color: $--color-primary;
          opacity: 1;
          border-radius: 0;
          width: 6px;
          height: 6px;
          transition: all 0.5s;
        }

        .swiper-pagination-bullet-active {
          /*height: 56px;*/
          width: 56px;
          background-color: #cbdffe;
        }
      }
    }
  }
  .info-item2 {
    flex-direction: row-reverse;

    .right {
      width: 563px;
    }
  }

  .info-item3 {
    padding-top: 0;
    padding-bottom: 75px;

    .right {
      padding-top: 100px;
    }
  }

  .info-item1,
  .info-item2,
  .info-item3,
  .info-item4 {
    overflow-x: hidden;
  }

  .info-item4,
  .info-item5 {
    .title {
      font-size: 40px;
      color: #333;
      text-align: center;
      margin-bottom: 40px;

      img {
        vertical-align: bottom;
      }

      span {
        color: $--color-primary;
        /*color: $--color-primary;*/
      }
    }

    .title-sub {
      color: #999;
      line-height: 28px;
      padding: 0 30%;
      text-align: center;
      margin-bottom: 40px;
    }
  }

  .info-item5 {
    padding-bottom: 0;

    .slide-item {
      background-color: #fff;
      .chart-img {
        display: block;
        margin: auto;
      }
    }

    .title-sub {
      padding: 0 10%;
    }

    .swiper-pagination {
      position: absolute;
      right: 0;
      left: auto;
      width: auto;

      /deep/ {
        .swiper-pagination-bullet {
          background-color: $--color-primary;
          opacity: 1;
          border-radius: 0;
          width: 6px;
          height: 6px;
          transition: all 0.5s;
        }

        .swiper-pagination-bullet-active {
          /*height: 56px;*/
          width: 56px;
          background-color: #cbdffe;
        }
      }
    }
  }

  .info-item6 {
    margin-bottom: 70px;

    .box {
      position: relative;

      & > img {
        width: 340px;
        height: 220px;
      }

      .c {
        position: absolute;
        width: 100%;
        height: 100%;
        top: 0;
        left: 0;

        .text-wrap {
          position: absolute;
          left: 7.5%;
          width: 85%;
          top: 56%;
          height: 150px;
          background: rgba(75, 157, 243, 0.95);
          color: #fff;

          .t {
            font-size: 16px;
            margin: 15px 0;
            text-align: center;
          }

          .d {
            font-size: 12px;
            line-height: 20px;
            margin-bottom: 18px;
            padding: 0 13px;
          }
        }

        .top-right {
          position: absolute;
          top: -15px;
          right: -15px;
          background: rgba(75, 157, 243, 0.95);
          width: 60px;
          height: 60px;
          line-height: 60px;
          text-align: center;
        }
      }
    }
  }
}

body.mobile {
  .info-wrap {
    .info-item {
      .left,
      .right {
        width: 90vw;
      }

      .left {
        margin-bottom: 20px;
      }
    }

    .info-item3 {
      padding-top: 40px;
      padding-bottom: 40px;

      .right {
        padding-top: 0;
      }
    }

    .info-item6 {
      .box {
        margin-bottom: 90px;

        &:last-child {
          margin-bottom: 0;
        }

        & > img {
          width: 90vw;
          height: auto;
        }
      }
    }

    .left .slide-item {
      img {
        width: 100%;
      }
    }

    .info-item4,
    .info-item5 {
      .title {
        font-size: 30px;
        line-height: 1.5;

        img {
          vertical-align: sub;
        }
      }

      .title-sub {
        padding: 0 5%;
      }
    }
  }

  .banner-wrap .slide-item .banner-content {
    left: 5vw;
    transform: translateX(0);

    .banner-img-wrap img {
      max-width: 90vw;
    }
  }

  .quick-enter-wrap {
    .quick-enter {
      flex-wrap: nowrap;
      overflow-x: auto;

      .quick-item a {
        width: 60vw;
      }
    }
  }

  .banner-wrap .swiper-pagination {
    bottom: 20px;
  }
}
</style>
