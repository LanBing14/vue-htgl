export default {
    mounted() {
        this.timerout = null;
        this.timeroutFn = () => {
            clearTimeout(this.timerout);
            this.timerout = setTimeout(() => {
                if (this.chart) {
                    this.chart.resize();
                }
            }, 100);
        };
        window.addEventListener('resize', this.timeroutFn);
    },
    beforeDestory() {
        window.removeEventListener('resize', this.timeroutFn);
        clearTimeout(this.timerout);
    }
};
