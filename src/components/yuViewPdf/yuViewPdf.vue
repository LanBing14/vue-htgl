<template>
    <div>
        <p  v-for="(item, index) in urls" :key="index">
        {{ index+1+'. ' }}
        <span class="canClick" @click="checkFile(item.domain, item.url)">{{item.name? item.name:item.originalName? item.originalName:'-'}}</span>
        </p>
    </div>
</template>
<script>
export default {
  name: "yuView",
  props:['urls'],
  data() {
    return {
 
    };
  },

  methods: {
    checkFile(_domain, _url) {
      window.open(process.env.VUE_APP_FILE_API + _url, "_blank");
    },
  },
};
</script>