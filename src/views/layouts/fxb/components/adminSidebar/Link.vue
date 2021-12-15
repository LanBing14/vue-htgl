<template>
  <component :is="type" v-bind="linkProps(to)" @click.native="linkR(to)">
    <slot />
  </component>
</template>

<script>
import { isExternal } from "@/utils";

export default {
  inject:['reload'],
  props: {
    to: {
      type: String,
      required: true
    }
  },

  computed: {
    isExternal() {
      return isExternal(this.to)
    },
    type() {
      if (this.isExternal) {
        return 'a'
      }
      return 'router-link'
    }
  },
  methods: {
    linkProps(to) {
      if (this.isExternal) {
        return {
          href: to,
          target: '_blank',
          rel: 'noopener'
        }
      }
      return {
        to: to
      }
    },
    linkR(to){
      if(to==this.$route.fullPath){
        if(this.reload){
          this.reload()
        }
          
      }
    }
  }
}
</script>
