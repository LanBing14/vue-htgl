<template>
  <div style="height:100%">
    
    <el-scrollbar style="height:100%">
      <el-menu
        :default-active="activeMenu"
        :collapse="isCollapse"
        :background-color="menuBg"
        :text-color="textColor"
        :unique-opened="true"
        :active-text-color="activeTextColor"
        :collapse-transition="false"
         mode="vertical"
      >
        <sidebar-item v-for="route in curRoutes" :key="route.path" :item="route" :base-path="route.path" />
      </el-menu>
    </el-scrollbar>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import Logo from './Logo'
import SidebarItem from './SidebarItem'
import variables from '@/styles/variables.scss'

export default {
  components: { SidebarItem },
  props: {
    curRoutes: Array,
    basePath: String,
    textColor:{
      type:String,
      default:()=>'#62676b'
    },
    activeTextColor: {
        type: String,
        default: () => "#fff"
    },
    menuBg:{
      type: String,
        default: () => "#fff"
    }
},
  computed: {
    ...mapGetters([
      // 'permission_routes',
      'sidebar'
    ]),
    activeMenu() {
      const route = this.$route
      const { meta, path } = route
      // if set path, the sidebar will highlight the path you set
      if (meta.GuidePath) {
        return meta.JumpPath
      }
      return path
    },
    showLogo() {
      return this.$store.state.settings.sidebarLogo
    },
    variables() {
      return variables
    },
    isCollapse() {
      return !this.sidebar.opened
    }
  }
}
</script>
