<template>
    <router-view :key="key" />
</template>

<script>
export default {
    name: "Blank",
    computed: {
        key() {
            return this.$route.fullPath + "-child";
        }
    }
};
</script>

<style scoped></style>
