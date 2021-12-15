<template>
  <Dialog ref="drawer" title="查看文件" :visible.sync="visible" onlyClose width="500px" :close="closeDialog">
    <p style="margin-bottom: 10px" v-for="(item, index) in urls" :key="index">
      {{ index+1+'. ' }}
      <span class="canClick" @click="checkFile(item.domain, item.url)">{{ item.name }}</span>
    </p>
  </Dialog>
</template>

<script>
export default {
  name: "ViewPDFs",
  data() {
    return {
      visible: false,
      urls: [],
    };
  },
  methods: {
    open(_urls) {
      this.urls = _urls;
      this.visible = true;
    },
    closeDialog() {
      this.visible = false;
    },
    checkFile(_domain, _url) {
      window.open(process.env.VUE_APP_FILE_API + _url, "_blank");
    },
  },
};
</script>

<style>
</style>
