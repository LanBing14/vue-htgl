<template>
<div class="user-center">

   
    <div class="user-center-content">
        <router-view id="user-content" name="creditTraining" />
    </div>
    
</div>
</template>

<script>
    import {getUserInfo} from "@/utils/auth";

    export default {
    data() {
        return {
            userInfo: getUserInfo()
        };
    },
    mounted() {},
    methods: {
    }
};
</script>
