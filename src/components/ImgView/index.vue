<template>
    <!-- <div>
        <div v-if="urlsList.length" class="demo-image__preview">
            <el-image :style="{ width: size+'px', height: size+'px' }" :src="urlsList[0]" :preview-src-list="urlsList"></el-image>
        </div>
        <span v-else>无</span>
    </div> -->



    <div>
        <span class="canClick" @click="checkFiles(urlsList)">查看附件</span>
        <div class="demo-image__preview" style="position: fixed; top: -200px; left: -200px; z-index: 10000">
            <el-image
                ref="ref_Img"
                :style="{ width: size+'px', height: size+'px' }"
                :src="urlsList[0]"
                :preview-src-list="urlsList"
            ></el-image>
        </div>
        <!-- <div v-if="urlsList.length" class="demo-image__preview">
            <el-image :style="{ width: size+'px', height: size+'px' }" :src="urlsList[0]" :preview-src-list="urlsList"></el-image>
        </div>
        <span v-else>无</span> -->
    </div>
</template>

<script>
// export default {
//     name: "ImgView",
//     props: {
//         urls: {
//             type: Array,
//             default: () => []
//         },
//         size: {
//             type: Number||String,
//             default: 100
//         }
//     },
//     data() {
//         return {
//             imgUrlO:process.env.VUE_APP_FILE_API,
//             urlsList: []
//         };
//     },
//     watch: {
//         urls(val) {

//             this.urlsList = this.urls.map(item =>{
//                return item.url? this.imgUrlO+item.url:this.imgUrlO+item
//             });
//         }
//     },
//     mounted() {
      
//         this.urlsList = this.urls.map(item =>{
//               return  item.url? this.imgUrlO+item.url:this.imgUrlO+item
//         });
//     }
// };


export default {
    name: "ImgView",
    props: {
        urls: {
            type: Array,
            default: () => []
        },
        size: {
            type: Number||String,
            default: 100
        }
    },
    data() {
        return {
            imgUrlO:process.env.VUE_APP_FILE_API,
            urlsList: []
        };
    },
    watch: {
        urls(val) {
            if(Array.isArray(this.urls)&&this.urls.length>0){
                this.urlsList = this.urls.map(item =>{
                    return item.url? this.imgUrlO+item.url:this.imgUrlO+item
                });
            }

        }
    },
    methods:{
        // 查看图片
        checkFiles(row) {
        if (!row || !row.length) {
            this.$message.error("没有上传图片！");
            return false;
        }
        // this.urlsList = row.map((item) => process.env.VUE_APP_FILE_API + item.url);
        this.$nextTick(() => {
            this.$refs.ref_Img.clickHandler();
        });
        }
    },
    mounted() {
        if(Array.isArray(this.urls)&&this.urls.length>0){
            this.urlsList = this.urls.map(item =>{
                return  item.url? this.imgUrlO+item.url:this.imgUrlO+item
            });
        }
    }
};


















</script>

<style>
</style>
