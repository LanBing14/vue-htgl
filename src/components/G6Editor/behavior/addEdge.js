import {uniqueId} from 'lodash';

// let startPoint = null
// let startItem = null
// let endPoint = {}
// let activeItem = null
// let curInPoint = null
let startTarget
let startItem
let startPoint
let endPoint = {}
export default {
    getEvents() {
        return {
            drag: 'onDragMove',
            dragstart: 'onDragStart',
            drop: 'onDrop'
        };
    },
    onDragStart(e) {
        startItem = e.item;
        const bbox = startItem.getBBox();
        const startX = parseInt(bbox.width / 2) + bbox.x;
        const startY = parseInt(bbox.height / 2) + bbox.y;
        startPoint = {
            x: startX,
            y: startY
        };
        this.edge = this.graph.addItem('edge', {
            source: startPoint,
            target: startPoint,
            start: startPoint,
            end: startPoint,
            shape: 'link-edge',
            type: 'edge'
        });
    },
    onDragMove(e) {
        const point = {
            x: e.x,
            y: e.y
        };
        if (this.edge) {
            // 增加边的过程中，移动时边跟着移动
            this.graph.updateItem(this.edge, {
                target: point
            });
        }
    },
    onDrop(e) {
        const endItem = e.item;
        if (endItem._cfg && endItem.getType() === 'node' && this.edge) {
            const sourceId = startItem._cfg.id;
            const targetId = endItem._cfg.id;
            if (sourceId === targetId) {
                this.graph.removeItem(this.edge);
                return;
            }
            const endX = parseInt(e.target.attrs.x);
            const endY = parseInt(e.target.attrs.y);
            endPoint = {
                x: endX,
                y: endY
            };
            if (this.edge) {
                this.graph.removeItem(this.edge);
                const model = {
                    id: 'edge' + uniqueId(),
                    source: startItem,
                    target: endItem,
                    type: 'edge'
                };
                this.graph.addItem('edge', model)
            }
        } else {
            if (this.edge) this.graph.removeItem(this.edge)
        }
        if (startItem) {
            this.graph.setItemState(startItem, 'hover', false)
        }
        this.graph.setMode('default')
        startItem = undefined
        startTarget = undefined
        startPoint = undefined
        endPoint = {}
    }
}
