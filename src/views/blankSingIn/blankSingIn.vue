<template>
    <div>
       
    </div>
</template>
<script>
import {  Api_LoginByUsername } from "@/api/login";
import { getJessionID, getUserStore, setJessionID, setToken, setRefToken } from "@/utils/auth";
import store from "@/store";
export default {
    data(){
        return{

        }
    },
    created(){
       
        this.handleLogin()
    },
    methods:{
    // 登录
    handleLogin () {
          const loginPromise = Api_LoginByUsername({
                username:  "yanjn",
                password: "ttxoMQsIaX7KXWEASIyG3A==",
                "randomStr": "5e7c8b12-0982-4383-8012-39c2c29b87e2",
                "code": "8888",
                "roleType": 1,
                "grant_type": "password",
                "remember-me": false,
                sso_type : 1
              })
              
          loginPromise
            .then(({ expires_in, refresh_token, access_token }) => {
              store.commit("SAVE_refresh_token", refresh_token);
              if (expires_in < 43199) {
                Api_LoginByUsername({
                  grant_type: "refresh_token",
                  refresh_token,
                }).then(({ access_token }) => {
                    setToken(access_token);
                    setRefToken(refresh_token);
                    store.dispatch("GetUserInfo"); 
                    this.$router.push({
                        path:'/'
                    })
                });
              } else {
                 setToken(access_token);
                    setRefToken(refresh_token);
                    store.dispatch("GetUserInfo"); 
                    this.$router.push({
                        path:'/'
                    })
              }
            })
            .catch((e) => {
              console.log(e, "test");
              // this.changeCaptcha();
             
              this.$message({
                message: e,
                type: "error",
                duration: 5 * 1000,
              });
            });
    
        }
    },


}
</script>
