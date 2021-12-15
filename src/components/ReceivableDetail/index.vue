<template>
    <div class="animation">
        <div class="container">
            <div class="content">
                <div class="item">
                    <div class="title">当前应收账款及已收情况</div>
                    <div class="item-container">
                        <div class="item-content">
                            <div class="text-container">
                                <p class="text-title">应收未收</p>
                                <p class="text-content">{{ $toMoney(data.oweMoney) }}元</p>
                            </div>
                            <div class="text-container">
                                <p class="text-title">已收金额</p>
                                <p class="text-content">{{ $toMoney(data.receivable) }}元</p>
                            </div>
                            <div class="text-container">
                                <p class="text-title">确认日期</p>
                                <p class="text-content">{{ $dateFormat(data.startDate) }}</p>
                            </div>
                        </div>
                        <div class="item-content">
                            <div class="text-container">
                                <p class="text-title">到期日</p>
                                <p class="text-content">{{ $dateFormat(data.endDate) }}</p>
                            </div>
                            <div class="text-container">
                                <p class="text-title">{{ type?'预警' :'逾期' }}天数</p>
                                <p class="text-content">{{ getDay() }}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    export default {
        name: "ReceivableDetail",
        props: {
            data: {
                type: Object,
                default: () => ({})
            },
            type: Boolean
        },
        data() {
            return {};
        },
        methods: {
            getDay() {
                if (!this.data.endDate) {
                    return ''
                }
                return Math.abs(new Date().getDate() - new Date(this.data.endDate).getDate())
            }
        }
    };
</script>

<style scoped lang="scss">
    .container {
        padding: 10px 0 20px;
        position: relative;

        .content {
            display: flex;
            background-color: #f5f7fa;
            border: 1px solid #eaedf4;

            .item {
                flex: 0 550px;
                padding: 16px 0 16px 16px;

                .title {
                    font-size: 15px;
                    color: #333;
                    font-weight: bold;
                    margin-bottom: 15px;
                }

                .item-container {
                    display: flex;

                    .item-content {
                        flex: 0 50%;
                        padding-right: 16px;

                        .text-container {
                            display: flex;
                            line-height: 28px;
                            color: #606266;

                            .text-title {
                                flex: 0 110px;
                                font-size: 13px;
                            }

                            .text-content {
                                flex: 1;
                                font-size: 13px;
                            }
                        }
                    }
                }
            }

            .item-s {
                padding: 16px;
                flex: 0 110px;
                overflow: hidden;
                align-self: center;

                /deep/ .el-tabs__header {
                    border-bottom: 0;
                }
            }

            .item:not(:first-child) {
                border-left: 1px solid #eaedf4;
            }
        }
    }
</style>
