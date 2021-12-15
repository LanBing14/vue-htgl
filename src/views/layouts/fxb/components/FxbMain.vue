<template>
    <div>
        <slot name="credit"></slot>
        <section class="app-main">
            <keep-alive>
                <router-view :key="key" />
            </keep-alive>
        </section>
    </div>
</template>

<script>
export default {
    name: "FxbMain",
    computed: {
        key() {
            return this.$route.fullPath;
        }
    }
};
</script>

<style scoped lang="scss">
@import "~@/styles/variables.scss";
.app-main {
    width: 100%;
    position: relative;
    overflow: hidden;
}
</style>
