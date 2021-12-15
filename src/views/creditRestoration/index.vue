<template>
    <el-container style="background-color: #fff">
        <el-header>
            <FxbHeader />
        </el-header>
        <!-- banner -->
        <div class="banner-box">
            <div class="banner-img banerxin">
                <div class="banner-img-wrap" style="height: 250px;">
                    <img class="img-title" src="../../assets/images/home/bannerbg1.png" alt="">
                </div>
                <el-button class="btn" @click="atOnceApply">
                    <span>立即申请</span>
                    <img class="icon arror-right" src="../../assets/images/home/arrow-right.png" alt />
                </el-button>
            </div>
        </div>
        <div class="banerxin">
            <div class="item_style" style="margin-bottom: 40px;">
                <p class="top_title top_title_content">信用修复业务介绍</p>
                <p class="content">未至科技是国家公共信用信息中心发布第一批可为信用修复申请人出具报告的信用服务机构名单，风信标作为未至科技服务企业信用风险管理平台产品。</p>
                <p class="content" style="margin-top: 20px;">致力于服务企业维护自身信用的同时，提供企业信用风险防范，协助企业针对各主流信用平台（包括公共信用信息平台，如：国家、省、市公共信用信息平台，市场信用信息平台，如：企查查、天眼查、启信宝等平台）上的行政处罚信息、失信黑名单等失信记录进行修复。</p>
            </div>
        </div>
        
        <div class="containbg">
            <div class="banerxin">
                <div class="contanier" style="position: relative;">
                    <p class="contain_title">信用修复流程/ <span style="color: #d3d3d3;">Credit repair process</span></p>
                </div>
                <div class="line">
                    <img src="../../assets/images/fxrepair/line.png" alt="" class="line-img">
                    <div class="circle1">
                        <img src="../../assets/images/fxrepair/circle.png" alt="">
                    </div>
                    <div class="circle2">
                        <img src="../../assets/images/fxrepair/circle.png" alt="">
                    </div>
                    <div class="container_content" >
                        <div class="content_item item1">
                            <img src="../../assets/images/fxrepair/1.png" alt="" class="img_content">
                            <div class="item_tile_icon">
                                <p style="color: #424242">1.提交申请</p>
                                <p style="color: #858585;">申请主体提交信用修复申请</p>
                            </div>
                        </div>
                    </div>
                    <div class="container_content" >
                        <div class="content_item item2">
                            <img src="../../assets/images/fxrepair/2.png" alt="" class="img_content">
                            <div class="item_tile_icon Item2">
                                <p style="color: #424242">2.修复认定</p>
                                <p style="color: #858585;">未至科技认定申请主体是否可修复</p>
                            </div>
                        </div>
                    </div>
                    <div class="container_content" >
                        <div class="content_item item3">
                            <img src="../../assets/images/fxrepair/3.png" alt="" class="img_content">
                            <div class="item_tile_icon Item3">
                                <p style="color: #424242">3.修复培训</p>
                                <p style="color: #858585;">未至科技进行信用修复培训，并出具培训证明材料</p>
                            </div>
                        </div>
                    </div>
                    <div class="container_content" >
                        <div class="content_item item4">
                            <img src="../../assets/images/fxrepair/4.png" alt="" class="img_content">
                            <div class="item_tile_icon Item4">
                                <p style="color: #424242">4.信用报告</p>
                                <p style="color: #858585;">未至科技对完成修复培训的主体出具信用报告</p>
                            </div>
                        </div>
                    </div>
                    <div class="container_content" >
                        <div class="content_item item5">
                            <img src="../../assets/images/fxrepair/5.png" alt="" class="img_content">
                            <div class="item_tile_icon Item5">
                                <p style="color: #424242">5.实施修复</p>
                                <p style="color: #858585;">"信用中国"审核通过撤销公示</p>
                            </div>
                        </div>
                    </div>
                </div>
                
            </div>
        </div>
        <div class="banerxin">
        <div class="item_style">
            <p class="top_title top_title_content">信用修复政策解读</p>
            <div class="content_item">
                <img src="../../assets/images/fxrepair/comput.png" alt="" class="img_left">
                <div class="content_right">
                    <div class="content_right_item">
                        <p class="content_right_item_title">政策鼓励:开展信用修复培训</p>
                        <p class="content_right_item_content">
                发改办财金〔2018〕893号文件 ——《国家发展改革委办公厅 人民银行办公厅关于对失信主体加强信用监管的通知》中明确提出要“广泛开展信用修复专题培训。建立失信个人、失信单位法定代表人（主要负责人）信用修复培训制度。”号召县级以上地方政府社会信用体系建设牵头单位应组织对辖区内黑名单、重点关注名单主体主要负责人开展信用修复培训
                        </p>
                    </div>
                    <div class="content_right_item" style="margin-top: 18px;">
                        <p class="content_right_item_title">政策鼓励:开展信用修复培训</p>
                        <p class="content_right_item_content">参加由信用服务机构或信用管理部门举办的信用培训，培训内容包括：宣讲国家社会信用体系建设法规政策、失信联合惩戒措施及其对各类主体的影响、信用修复的方式和程序等，培训不少于3个学时。</p>
                    </div>
                </div>
            </div>
            <div class="content_top_item">
                <p class="content_right_item_title">政策鼓励:开展信用修复培训</p>
                <p class="content_right_item_content">893号文件中还指出：失信主体被列入黑名单或重点关注名单后，应于申请退出黑名单或重点关注名单时主动提交信用报告。认定部门（单位）在受理失信主体申请退出黑名单或重点关注名单时，应将其信用报告作为重要参考。信用报告由具有资质的信用服务机构出具，并共享至全国信用信息共享平台。</p>
            </div>
        </div>

        <div class="item_style">
            <p class="top_title contcenter" >三类行政处罚信息信用修复</p>
            <p class="content_item_bottom contcenter">
                根据发改办财金〔2019〕527号文件，失信主体按失信行为行政处罚轻重主要分为三类：一般失信行为主体、严重失信行为主体、特定严重失信行为主体，其中每一种市场主体信用修复的操作都有所不同。
            </p>
            <div>
                <div class="item_title_top mgt"  style="height: 35px;">
                    <img src="../../assets//images/fxrepair/san.png" alt="" style="width: 20px;height: 20px;">
                    一般失信行为主体信用修复
                </div>
                <p class="content_item_bottom">
                    涉及一般失信行为的行政处罚信息信用修复申请人须向信用网站提供相关身份材料和已履行行政处罚材料，公开做出信用修复承诺，并经信用网站核实后，在最短公示期期满后撤下相关公示信息。行政相对人主动向行政处罚决定机关提请开展信用修复的，应参照信用网站修复要求，公开做出信用修复承诺，行政处罚决定机关通过相关信息系统报送信用修复完成情况，经信用信息公示的责任部门核实后，在最短公示期期满后撤下相关公示信息。
                    </p>
            </div>
            <div>
                <div class="item_title_top mgt"  style="height: 35px;">
                    <img src="../../assets//images/fxrepair/san.png" alt="" style="width: 20px;height: 20px;">
                    严重失信行为主体信用修复
                </div>
                <p class="content_item_bottom">
                    涉及严重失信行为的行政处罚信息信用修复申请人除参照一般失信行为行政处罚信息信用修复要求外，应按照《国家发展改革委办公厅 人民银行办公厅关于对失信主体加强信用监管的通知》（发改办财金〔2018〕893号）要求，主动参加信用修复专题培训，并向信用网站提交信用报告，经信用网站核实后，在最短公示期期满后撤下相关公示信息。
                </p>
            </div>
            <div>
                <div class="item_title_top mgt"  style="height: 35px;">
                    <img src="../../assets//images/fxrepair/san.png" alt="" style="width: 20px;height: 20px;">
                    特定严重失信行为主体信用修复
                </div>
                <p class="content_item_bottom">
                    对涉及特定严重失信行为的行政处罚信息严格按最长公示期限予以公示，公示期间不予修复。在食品药品、生态环境、工程质量、安全生产、消防安全、强制性产品认证等领域被处以责令停产停业，或吊销许可证、吊销执照的行政处罚信息；因贿赂、逃税骗税、恶意逃废债务、恶意拖欠货款或服务费、恶意欠薪、非法集资、合同欺诈、传销、无证照经营、制售假冒伪劣产品和故意侵犯知识产权、出借和借用资质投标、围标串标、虚假广告、侵害消费者或证券期货投资者合法权益、严重破坏网络空间传播秩序、聚众扰乱社会秩序等行为被处以责令停产停业，或吊销许可证、吊销执照的行政处罚信息；以及法律、法规、规章另有规定不可修复的行政处罚信息，均按最长公示期限予以公示，公示期间不予修复。
                </p>
            </div>
        </div>
        </div>
        <el-button type="primary" center size="small" class="button" @click="atOnceApply">立即申请</el-button>
        <el-footer>
            <FxbFooter />
        </el-footer>
    </el-container>
</template>

<script>
import FxbHeader from "@/views/layouts/fxb/components/FxbHeader";
import FxbMain from "@/views/layouts/fxb/components/FxbMain";
import FxbFooter from "@/views/layouts/fxb/components/FxbFooter";
import { getToken } from "@/utils/auth"; // getToken from cookie
export default {
    components: {
        FxbHeader,
        FxbMain,
        FxbFooter
    },
    data() {
        return {
        };
    },
    computed: {
        userInfo() {
         return this.$store.getters.userInfo;
        },
    },
    methods:{
        atOnceApply(){
            if (this.userInfo.id) {
                this.$router.push('/creditRestoration/apply')
            } else {
                this.$login.login();
               
            }
        }
    }
    
};
</script>

<style lang="scss" >
  .banerxin {
    width: 1160px;
    margin: 0 auto;
  }
.creditrepair-form {
    .el-form-item {
        margin-bottom: 0;
    }
    .el-input__inner {
        border: 0;
    }
    .el-textarea__inner {
        border: 0;
        resize: none;
    }
    .el-form-item__label {
        text-align: left;
        padding: 0 0 0 18px;
    }
}
</style>

<style scoped lang="scss">
     .contanier {
         margin-left: 20px;
    }
    .contcenter {
        text-align: center;
    }
    .heOnly{
        height: 100%;
    }
    .containbg {
        background-color: #f9f9f9;
        height: 315px;
        padding-top: 30px;
        padding-bottom: 52px;
        position: relative;
        .line {
            width: 1100px;
            height: 200px;
            margin:0 auto;
            position: relative;
            .line-img {
                width: 1100px;
                position: absolute;
                left: 50%;
                top: 51%;
                transform: translate(-50%,-50%)
            }
        }
        .circle1 {
            position: absolute;
            left: 8px;
            top: 50%;
            transform: translate(-50%,-50%)
        }
        .circle2 {
            position: absolute;
            right: -9px;
            top: 50%;
            transform: translate(-50%,-50%)
        }
        .container_content {
            position: relative;
            .item1 {
                left: 40px;
                top: 130px;
            }
            .item2 {
                /* left: 210px; */
                left: 224px;
                top: 26px;
            }
            .item3 {
                /* left: 385px; */
                left: 430px;
                top: 130px;
            }
            .item4 {
                /* left: 580px; */
                left: 640px;
                top: 26px;
            }
            .item5 {
                /* left: 740px; */
                left: 855px;
                top: 130px;
            }
            .content_item {
                position: absolute;
                .img_content{
                    display: block;
                    width: 42px;
                    height: 54px;
                    float: left;
                }
                
                .item_tile_icon {
                    width: 114px;  
                    float: left;
                    line-height: 24px;
                    margin-left: 18px;

                    p:last-child{
                        line-height: 18px
                    }
                }
                .Item2 {
                    width: 134px;    
                }
                .Item3 {
                    width: 170px;    
                }
                .Item4 {
                    width: 156px;    
                }
                .Item5 {
                    width: 142px;    
                }
            }
        }
    }
    .contain_title {
        font-size: 20px;
        color: #2c2c2c;
        padding-bottom: 20px;
        padding-left: 8px;
    }
.banner-box {
    height: 360px;
    background: url('../../assets/images/home/bg.png') no-repeat center/cover ;
    .banner-img {
        height: 100%;
        position: relative;
        .banner-img-wrap {
            position: absolute;
            left: 30px;
            top: 20px;
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
        position: absolute;
        left: 30px ;
        bottom:56px;
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

.el-main {
    width: 100%;
    height: auto;
}


.creditrepair-panel li::before {
    position: absolute;
    top: 0;
    left: -20px;
    content: "•";
    font-size: 14px;
    color: #40a4f1;
    margin: 0 12px 0 0px;
}

.creditrepair-step {
    position: relative;
    width: 1134px;
    height: 135px;
    margin: 0 auto;
    background-image: url(../../assets/images/creditrepair4.png);
    background-repeat: no-repeat;
}

.creditrepair-step li {
    line-height: 24px;
    width: 176px;
    float: left;
    margin-right: calc((1134px - 176px * 5) / 4);
}

.creditrepair-step li:last-child {
    margin-right: 0;
}

.creditrepair-step h2 {
    color: #40a4f1;
    font-size: 18px;
    text-align: center;
    margin: 45px 0 10px;
}

.creditrepair-step span {
    font-size: 12px;
    text-align: center;
    display: block;
    color: #666;
    line-height: 18px;
}
.item_style {
    font-size: 22px;
    width: 100%;
    margin-top: 40px;
    .content_top_item{
        margin-top: 18px;
        .content_right_item_title{
            font-size: 20px;
            height: 35px;
            font-weight: blod;
            color: #555555;
        }
        .content_right_item_content {
            font-size: 14px;
            color: #999;
            line-height: 28px;
        }
    }
    .mgt {
        margin-top: 20px;
        font-size: 18px;
        color:#555555;
    }
    .content_item_bottom {
        color: #999;
        line-height: 25px;
        font-size: 14px;
    }

}
.top_title{
    position: relative;
    padding-left: 20px;
    line-height: 30px;
    margin-bottom: 25px;
    color: #222222;
}
 .top_title_content::before{
    content: "";
    width: 6px;
    height: 31px;
    display: block;
    color: #409eff;
    background-color: #409eff;
    position: absolute;
    top: 0;
    left: 0;
} 
.content {
    line-height: 22px;
    font-size: 16px;
    padding-left: 13px;
    color: #999999;
}
.content_item {
    overflow: hidden;
    display: flex;
    .img_left {
        width: 438px;
        height: 310px;
        flex: 1;
    }
    .content_right {
        flex: 1;
        width: 507px;
        margin-left: 32px;
        .content_right_item{
            .content_right_item_title{
                font-size: 20px;
                height: 35px;
                font-weight: blod;
                color: #555555;
            }
            .content_right_item_content {
                font-size: 14px;
                color: #999;
                line-height: 28px;
            }
        }
    }

}

.button {
    width: 148px;
    height: 45px;
    text-align: center;
    margin: 0 auto;
    margin-bottom: 67px;
    font-size: 16px;
    border-radius: 4px;
    margin-top: 50px;
}

</style>
