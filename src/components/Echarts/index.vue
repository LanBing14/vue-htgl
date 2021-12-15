<template>
    <div ref="chart"   style="height: 100%;">

    </div>
</template>

<script>
import echarts from 'echarts'
import resize from './mixins/resize'
require('echarts-wordcloud');

export default {
    name: 'EchartsComp',
    mixins: [resize],
    props: {
        option: Object
    },
    data () {
        return {
            chart: null
        }
    },
    watch: {
        option () {
            this.setChartsOption()
        }
    },
    mounted () {
        this.chart = echarts.init(this.$refs.chart)
        this.setChartsOption()
    },
    beforeDestroy () {
        if (!this.chart) {
            return
        }
        this.chart.dispose()
        this.chart = null
    },
    methods: {
        setChartsOption () {
            this.chart.setOption(this.option, true)
        },
        clear() {
            this.chart.clear()
        },
        resize() {
            this.chart.resize()
        }
    }
}
</script>

<style scoped lang="scss">

</style>
