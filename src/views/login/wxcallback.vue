<template lang="">
    <div>
       
    </div>
</template>

<script>
export default {
    data(){
        return{
                code: ''
        }
    },
    watch: {
        $route(){
            if(this.$route.query.code!=undefined)
            {
                this.getWeixin(this.$route.query.code,this.$route.query.state);
            }
        }
    },
    created () {
        this.code = this.getUrlKey("code");
        console.log('code',this.code)
    },
     methods: {
        //  公共方法
        getUrlKey (name) {
            return decodeURIComponent((new RegExp('[?|&amp;]' + name + '=' + '([^&amp;;]+?)(&amp;|#|;|$)').exec(location.href) || [",",""])[1].replace(/\+/g, '%20')) || null;
        },
        // 通过code获取微信信息
        getWeixin(){
        	//调用接口，将code传给后端
                setToken(access_token);
                setRefToken(refresh_token);
                store.dispatch("GetUserInfo");
                this.$router.replace('/front/workportal/notice')
                this.$message({
                    message: "登录成功",
                    type: "success",
                    duration: 1000,
               });
        }
    }
}
</script>
<style lang="">
    
</style>