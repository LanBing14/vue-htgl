<template>
    <div  class="wx_dialog_toiast">
        <!-- 承载二维码的容器 -->
        <div class="wx_dialog_toiast_delltet" >
            <div class="wx_dialog_button_delete" @click="close_wchat_qrcode">
                <i class="el-icon-close" style="font-size: 26px"></i>
            </div>
            <div id="login_container"></div>
        </div>
        
    </div>
</template>

<script>
export default {
    data(){
        return{            
            Wechat_authorized_login:false,
        }
    },
    mounted () {
        this.get_wx_qrcode();   
    },
    methods:{
        wechatLogin(){
            this.Wechat_authorized_login = true
        },
        get_wx_qrcode(){    
            var call_back_domain_name = process.env.VUE_APP_BASE_API + '/wxcallback';
            var  call_back_domain_name = encodeURIComponent('http://www.fengxinbiao.cn/loginAuth');
            var obj = new WxLogin({
                self_redirect: false,
                id: 'login_container', 
                appid: 'wx22b28622e4e299c9', 
                scope: 'snsapi_login', 
                redirect_uri: call_back_domain_name , // 授权成功后回调的
                state: Math.ceil(Math.random() * 1000), 
                style: 'black', 
                href: '' 
           });
        },
        close_wchat_qrcode(){
            this.$emit('handleWxShow',false)
        }
    }
}
</script>

<style scoped lang="scss">
.wx_dialog_toiast {
    position: fixed;
    top: 0px;
    left: 0px;
    right: 0;
    bottom: 0;
    width: 100%;
    height: 100%;
    z-index: 9854647;
    background: rgba(0,0,0,.5);
    display: flex;
    justify-content: center;
    align-items: center;

    .wx_dialog_toiast_delltet {
        width: 400px;
        height: 500px;
        display: flex;
        background: #fff;
        justify-content: center;
        align-items: center;
        position: relative;
        border-radius: 4px;
    }

    .wx_dialog_button_delete {
        position: absolute;
        right: -25px;
        top: 25px;
        transform: translateY(-50%);
        height: 100px;
        width: 100px;
        display: flex;
        justify-content: center;
        align-items: center;
        z-index: 98546473;
    }

    #login_container {
      
    }

}
</style>
