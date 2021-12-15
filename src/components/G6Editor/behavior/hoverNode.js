export default {
    getEvents() {
        return {
            'node:mousedown': 'onMousedown'
        }
    },
    onMousedown(e) {
        if (e.item.hasState('selected')) {
            this.graph.setMode('addEdge');
        } else {
            this.graph.setMode('default');
        }
    }
}
