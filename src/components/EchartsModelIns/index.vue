<template>
    <EchartsComp 
    v-loading="loading"
    element-loading-spinner="el-icon-loading" 
    element-loading-text="拼命加载中"
    ref="ref_echarts" :option="echartOption"></EchartsComp>
</template>

<script>
    import echarts from 'echarts';
    // 动态图表实例组件
    import EchartsComp from '@/components/Echarts';
    import {ajax} from '@/utils/index';
    import {
        Api_EchartsModelDetail
    } from '@/api/creditManagement/index';

    export default {
        name: 'Ins',
        components: {
            EchartsComp
        },
        props: {
            modelId: String, // 图表模型的id
            query: Object // 查询参数
        },
        data() {
            return {
                loading:false,
                echartOption: {},
                jsModel: '' // js编辑器生成的数据，在配置图表模型时设置
            };
        },
        watch: {
            query() {
                this.initChart();
            }
        },
        mounted() {
            this.initModel();
        },
        methods: {
            initModel() {
                Api_EchartsModelDetail(this.modelId).then(({js}) => {
                    if (js) {
                        this.jsModel = js;
                        this.initChart();
                    }
                });
            },
            initChart() {
                // this.loading=true;
                try {
                    new Function(
                        'echarts',
                        'ajax',
                        'setOption',
                        'query',
                        'Ins',
                        'loadingClose',
                        this.jsModel
                    )(
                        echarts,
                        ajax,
                        this.setOption,
                        this.queryFn,
                        
                        this
                    );
                   
                } catch (e) {
                    this.loading=false;
                    console.log(e);
                    this.$message.error('图表配置项错误！');
                }
            },
            setOption(option) {
                this.loading=false;
                this.echartOption = option;
            },
            loadingClose(){
                this.loading=false;
            },
            queryFn() {
                return this.query
            },
            resize() {
                this.$refs['ref_echarts'].resize()
            }
        }
    };
</script>

<style scoped lang="scss">

</style>
