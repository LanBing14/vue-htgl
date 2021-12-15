<template>
<div class="inputSearch-wrap" @click.stop>
    <el-input v-model="inputVal"
              :placeholder="placeholder"
              @focus="onFocus"
              @change="onChange"
              @input="onInput"
    />
    <div class="search-result-wrap" v-show="resultShow">
        <el-scrollbar>
            <ul class="search-ul">
                <li
                    v-for="(el, index) in result"
                    :key="index"
                    :class="{selected: filterSelected(el.value)}"
                    @click="handleChange(el)"
                >
                    <span>{{ el.label }}</span>
                    <i class="select-status el-icon-check"></i>
                </li>
                <li v-if="result.length === 0">
                    <p style="text-align: center;margin: 0;">暂无数据</p>
                </li>
            </ul>
        </el-scrollbar>

        <div x-arrow="" class="popper__arrow" style="left: 35px;"></div>

    </div>
</div>
</template>

<script>
    export default {
        name: 'InputSearch',
        props: {
            fetchDataFn: {
                type: Function,
                default: () => null
            },
            defaultData: {
                type: Array,
                default: () => []
            },
            placeholder: {
                type: String,
                default: () => ''
            },
            data: {
                type: Array,
                default: () => []
            }
        },
        data() {
            return {
                inputVal: '',
                result: [], // 搜索结果
                checkedList: [], // 选中的数据
                inputTimer: null, // 搜索的延时器
                resultShow: false // 是否显示结果
            }
        },
        // watch: {
        //     defaultData(newDataArr) {
        //         this.checkedList.forEach(oldItem => {
        //             const findRes = newDataArr.find(newItem => oldItem.value === newItem.value)
        //             if (!findRes) {
        //                 this.handleChange(oldItem)
        //             }
        //         })
        //     }
        // },
        mounted() {
            document.addEventListener('click', () => {
                this.resultShow = false
            }, false)
        },
        methods: {
            onFocus() {
                if (this.result.length) {
                    this.resultShow = true
                }
            },
            onChange() {
                this.$emit('change', this.inputVal);
            },
            onInput() {
                this.$emit('input', this.inputVal);
                // if (!this.fetchDataFn) {
                //     return;
                // }
                if (this.inputVal) {
                    if (this.inputTimer) {
                        clearTimeout(this.inputTimer)
                    }
                    this.inputTimer = setTimeout(() => {
                        this.result = [{
                            label: '我是1',
                            value: 'a1'
                        }, {
                            label: '我是2',
                            value: 'a2'
                        }, {
                            label: '我是3',
                            value: 'a3'
                        }];
                        this.$emit('update:data', this.result);
                        this.checkedList = [];
                        this.resultShow = true;
                        // this.fetchDataFn(this.inputVal).then(res => {
                        //     this.result = res
                        // })
                        const defaultDataArr = this.defaultData;
                        this.result.forEach(newItem => {
                            const findRes = defaultDataArr.find(defaultItem => newItem.value === defaultItem.value)
                            if (findRes) {
                                this.handleChange(newItem)
                            }
                        })
                    }, 300)
                } else {
                    this.result = [];
                }
            },
            // 列表选中切换事件
            handleChange(row) {
                let index = null;
                const res = this.checkedList.find((item, i) => {
                    const flag = item.value === row.value;
                    if (flag) {
                        index = i
                    }
                    return flag;
                });
                if (res && index !== null) {
                    this.checkedList.splice(index, 1)
                } else {
                    this.checkedList.push(row)
                }
                this.$emit('selectChange', row); // 当前选中状态变化时通知父级
            },
            // 过滤选中的元素的状态
            filterSelected(value) {
                const res = this.checkedList.find(item => item.value === value);
                if (res) {
                    return true;
                } else {
                    return false;
                }
            },
            // 清空输入的值
            clearInputVal() {
                this.inputVal = '';
                this.onInput()
            }
        }
    }
</script>

<style lang="scss">
    @import '../../styles/element-variables.scss';

    .inputSearch-wrap {
        position: relative;

        &::after {
            content: '';
            display: block;
            clear: both;
        }

        .el-scrollbar__wrap {
            max-height: 250px;
        }

        div.search-result-wrap {
            position: absolute;
            z-index: 10;
            width: 100%;
            top: 100%;
            margin-top: 15px;
            left: 0;
            border: solid 1px #e4e7ed;
            border-radius: 4px;
            background-color: #fff;
            -webkit-box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
            box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
            -webkit-box-sizing: border-box;
            box-sizing: border-box;

            ul.search-ul {
                list-style: none;
                padding: 6px 0;
                margin: 0;
                -webkit-box-sizing: border-box;
                box-sizing: border-box;

                li {
                    font-weight: 700;
                    font-size: 14px;
                    padding: 0 20px;
                    position: relative;
                    white-space: nowrap;
                    overflow: hidden;
                    text-overflow: ellipsis;
                    color: #606266;
                    height: 34px;
                    line-height: 34px;
                    -webkit-box-sizing: border-box;
                    box-sizing: border-box;
                    cursor: pointer;

                    &:hover {
                        background-color: #f5f7fa;
                    }

                    .select-status {
                        display: none;
                        float: right;
                        margin-top: 9px;
                    }
                }

                li.selected {
                    color: $--color-primary;

                    .select-status {
                        display: initial;
                    }
                }
            }

            .popper__arrow, .popper__arrow:after {
                position: absolute;
                display: block;
                width: 0;
                height: 0;
                border-color: transparent;
                border-style: solid;
            }

            .popper__arrow:after {
                content: " ";
                border-width: 6px;
            }

            .popper__arrow, .popper__arrow:after {
                position: absolute;
                display: block;
                width: 0;
                height: 0;
                border-color: transparent;
                border-style: solid;
            }

            .popper__arrow:after {
                top: 1px;
                margin-left: -6px;
                border-top-width: 0;
                border-bottom-color: #fff;
            }

            .popper__arrow {
                border-width: 6px;
                filter: drop-shadow(0 2px 12px rgba(0, 0, 0, .03));
            }

            .popper__arrow {
                top: -6px;
                left: 50%;
                margin-right: 3px;
                border-top-width: 0;
                border-bottom-color: #ebeef5;
            }

        }

    }
</style>
