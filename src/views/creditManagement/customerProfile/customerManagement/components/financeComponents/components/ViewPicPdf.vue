<template>
<div>
  <Dialog ref="drawer" title="查看图片及文件" :visible.sync="visible" onlyClose width="500px" :close="closeDialog">
    <el-form v-model="form" label-width="100px">
      <el-form-item label="图片查看">
        <!-- <template v-if="picUrls&&picUrls.length">
          <el-image
            v-for="(el, index) in picUrls"
            :key="index"
            style="width: 100px; height: 100px"
            :src="imageUrl + el.url"
            :preview-src-list="dealImg"
          ></el-image>
        </template>
        <span v-else>-</span> -->
         <span class="canClick" @click="checkFiles(picUrls)">查看附件</span>
      </el-form-item>
      <el-form-item label="PDF查看">
        <template v-if="pdfUrls&&pdfUrls.length">
          <p style="margin-bottom: 10px" v-for="(item, index) in pdfUrls" :key="index">
            {{ index+1+'. ' }}
            <span class="canClick" @click="checkFile(item.url)">{{ item.name }}</span>
          </p>
        </template>
        <span v-else>-</span>
      </el-form-item>
    </el-form>
  </Dialog>
  <div class="demo-image__preview" style="position: fixed; top: -200px; left: -200px; z-index: 10000">
      <el-image
        ref="ref_Img"
        style="width: 100px; height: 100px"
        :src="srcList[0]"
        :preview-src-list="srcList"
      ></el-image>
  </div>
</div>
</template>

<script>
export default {
  name: "ViewPicPdf",
  data() {
    return {
      
      visible: false,
      srcList: [],
      picUrls: [],
      pdfUrls: [],
      form: {},
    };
  },
  computed:{
    imageUrl() {
      return process.env.VUE_APP_FILE_API
    },
    dealImg(){
      return this.picUrls.map(item=> process.env.VUE_APP_FILE_API + item.url)
    },
  },
  methods: {
    open(_urls) {
      const _pdfFilter = _urls.filter((item) => item.fileName.indexOf(".pdf") !== -1);
      this.pdfUrls = _pdfFilter.map((item) => ({ url: item.fileUrl, name: item.fileName }));
      const _picFilter = _urls.filter((item) => item.fileName.indexOf(".pdf") === -1);
      this.picUrls = _picFilter.map((item) => ({ url: item.fileUrl, name: item.fileName }));
      this.visible = true;
    },
    closeDialog() {
      this.visible = false;
    },
    checkFile(_url) {
      window.open(process.env.VUE_APP_FILE_API + _url, "_blank");
    },
        // 查看图片
    checkFiles(row) {
      
      if (!row || !row.length) {
        this.$message.error("没有上传图片！");
        return false;
      }
      this.srcList = row.map((item) => process.env.VUE_APP_FILE_API + item.url);
      this.$nextTick(() => {
        this.$refs.ref_Img.clickHandler();
      });
    }
  },
};
</script>

<style>
</style>
