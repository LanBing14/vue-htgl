<template>
    <div>
        <div class="filing-title">
            <span class="name floatL">{{ title }}</span>
            <a class="floatR font14" @click="Dialog">
                <svg-icon icon-class="fileadd" class="font18" />新增企业简介
            </a>
        </div>
    </div>
</template>

<script>
export default {
    name: "Level1Title",
    props: {
        title: {
            type: String,
            default: () => ""
        }
    }
};
</script>

<style scoped lang="scss">
.filing-title {
    margin-bottom: 30px;
    overflow: hidden;
    font-size: 20px;
    color: #333333;
    font-weight: bold;

    a {
        color: #b3becb;
        font-weight: normal;
    }

    svg-icon {
        margin-right: 8px;
    }
}
</style>
