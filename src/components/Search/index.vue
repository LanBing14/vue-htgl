<template>
    <div class="inputSearch-wrap" @click.stop>
        <el-input
            v-model="inputVal"
            :placeholder="placeholder"
            @focus="onFocus"
            @input="onSearch"
        />
        <div class="search-result-wrap" v-show="resultShow">
            <el-scrollbar>
                <ul class="search-ul">
                    <li
                        v-for="(el, index) in result"
                        :key="index"
                        @click="handleClick(el)"
                    >
                        <span>{{ el[prop.label] }}</span>
                    </li>
                    <li v-if="result.length === 0">
                        <p style="text-align: center;margin: 0;">暂无数据</p>
                    </li>
                </ul>
            </el-scrollbar>
        </div>
    </div>
</template>

<script>
    export default {
        name: "Search",
        props: {
            placeholder: String,
            fetchDataFn: Function,
            prop: {
                type: Object,
                default: () => ({
                    label: 'label',
                    id: 'id'
                })
            },
            data: Array
        },
        data() {
            return {
                inputVal: '',
                result: [], // 搜索结果
                inputTimer: null, // 搜索的延时器
                resultShow: false // 是否显示结果
            };
        },
        mounted() {
            document.addEventListener('click', this.documentClick, false);
        },
        beforeDestroy() {
            document.removeEventListener('click', this.documentClick);
        },
        methods: {
            onFocus() {
                if (this.result.length) {
                    this.resultShow = true;
                }
            },
            // 进行搜索操作
            onSearch(value) {
                if (!this.fetchDataFn) {
                    console.warn('请传入接口请求方法');
                    return;
                }
                clearTimeout(this.inputTimer);
                this.inputTimer = setTimeout(() => {
                    this.fetchDataFn({companyName: value}).then((res) => {
                        this.result = res;
                        this.resultShow = true;
                        console.log(1);
                    });
                }, 300);
            },
            // 点击每一条记录
            handleClick(row) {
                this.$emit('itemClick', row);
            },
            documentClick() {
                this.resultShow = false;
            }
        }
    };
</script>

<style scoped lang="scss">
    .inputSearch-wrap {
        position: relative;

    }

    .search-result-wrap {
        position: absolute;
        z-index: 1;
        width: 100%;
        top: 105%;
        left: 0;
        background-color: #fff;
        box-shadow: 0 0 5px 0 #ccc;
        li{
            padding: 0 15px;
            cursor: pointer;
        }
    }
</style>
