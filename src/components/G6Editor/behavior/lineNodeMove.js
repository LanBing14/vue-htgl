import {getLineCenter} from '@/utils';

export default {
    getEvents() {
        return {
            'edge:mousedown': 'onEdgeMousedown',
            'mousemove': 'onMousemove',
            'mouseup': 'onMouseup'
        }
    },
    onEdgeMousedown(e) {
        const target = e.target;
        const item = e.item;
        const edges = this.graph.getEdges();
        edges.forEach(e => {
            if (e._cfg.id !== item._cfg.id) {
                e.setState('selected', false);
            }
        });
        if (!target.isKeyShape) {
            const group = item.getContainer();
            const gid = group.cfg.id;
            const children = group.get('children').concat([]);
            const points = item._cfg.model.points;
            children.shift();
            let index = children.findIndex(
                i => i.attrs.id === target.attrs.id) + 1;
            if (target.attrs.status) {
                const prePoint = points[index - 1]; // 上一个点
                const curPoint = points[index]; // 当前点
                const nextPoint = points[index + 1]; // 下一个点
                const preCenter = getLineCenter({
                    x: prePoint.x,
                    y: prePoint.y
                }, {
                    x: curPoint.x,
                    y: curPoint.y
                });
                const nextCenter = getLineCenter({
                    x: curPoint.x,
                    y: curPoint.y
                }, {
                    x: nextPoint.x,
                    y: nextPoint.y
                });
                points[index].status = false;
                points[index].solid = true;
                points.splice(index, 0, {
                    ...preCenter,
                    status: true,
                    solid: false
                });
                points.splice(index + 2, 0, {
                    ...nextCenter,
                    status: true,
                    solid: false
                });
                this.graph.updateItem(gid, {
                    points: points
                });
                index++;
            }
            this.moveNodeIndex = index;
            this.moveNode = item;
        } else {

        }
    },
    onMousemove(e) {
        if (this.moveNodeIndex) {
            const index = this.moveNodeIndex;
            const group = this.moveNode.getContainer();
            const gid = group.cfg.id;
            const points = this.moveNode._cfg.model.points;
            console.log(points, index);
            const preCenter = getLineCenter(points[index - 2], points[index]);
            const curCenter = getLineCenter(points[index - 1],
                points[index + 1]);
            const nextCenter = getLineCenter(points[index], points[index + 2]);
            const isOnline = this.dotOnLine({
                dot: [e.x, e.y],
                terminal1: [preCenter.x, preCenter.y],
                terminal2: [nextCenter.x, nextCenter.y]
            });
            if (isOnline) {
                points[index - 1].delete = true;
                points[index + 1].delete = true;
                points[index].solid = false;
            } else {
                points[index - 1].delete = false;
                points[index + 1].delete = false;
                points[index].solid = true;
            }
            points[index - 1].x = preCenter.x;
            points[index - 1].y = preCenter.y;
            points[index].x = isOnline ? curCenter.x : e.x;
            points[index].y = isOnline ? curCenter.y : e.y;
            points[index + 1].x = nextCenter.x;
            points[index + 1].y = nextCenter.y;

            this.graph.updateItem(gid, {
                points: points
            });
        }
    },
    onMouseup() {
        if (this.moveNodeIndex) {
            const index = this.moveNodeIndex;
            const group = this.moveNode.getContainer();
            const gid = group.cfg.id;
            let points = this.moveNode._cfg.model.points;
            if (!points[index].solid) {
                points[index].status = true;
            }
            points = points.filter(item => !item.delete);
            this.graph.updateItem(gid, {
                points: points
            });
        }
        this.moveNodeIndex = undefined;
        this.moveNode = undefined;
    },
    dotOnLine(coords = {}) {
        const defaults = {
            dot: [],
            terminal1: [],
            terminal2: []
        }

        Object.assign(defaults, coords);

        const {
            dot,
            terminal1,
            terminal2
        } = defaults;
        let isBetweenX = false;
        let isBetweenY = false;

        if (terminal1[0] < terminal2[0]) {
            // x1 < x2
            if (dot[0] >= terminal1[0] && dot[0] <= terminal2[0]) {
                // dotX 在两端点横坐标之间
                isBetweenX = true;
            } else {
                // dotX 不在两端点横坐标之间
                isBetweenX = false;
            }
        } else {
            // x1 >= x2
            if (dot[0] >= terminal2[0] && dot[0] <= terminal1[0]) {
                // dotX 在两端点横坐标之间
                isBetweenX = true;
            } else {
                // dotX 不在两端点横坐标之间
                isBetweenX = false;
            }
        }

        if (terminal1[1] < terminal2[1]) {
            // y1 < y2
            if (dot[1] >= terminal1[1] && dot[1] <= terminal2[1]) {
                // dotY 在两端点横坐标之间
                isBetweenY = true;
            } else {
                // dotY 不在两端点横坐标之间
                isBetweenY = false;
            }
        } else {
            // y1 >= y2
            if (dot[1] >= terminal2[1] && dot[1] <= terminal1[1]) {
                // dotY 在两端点横坐标之间
                isBetweenY = true;
            } else {
                // dotY 不在两端点横坐标之间
                isBetweenY = false;
            }
        }

        if (isBetweenX && isBetweenY) {
            // dot 有可能在线段上
            const k = (terminal2[1] - terminal1[1]) /
                (terminal2[0] - terminal1[0]);
            const b = terminal1[1] - terminal1[0] * k;
            const absValue = Math.abs(dot[1] - (k * dot[0] + b));
            if (absValue >= -4 && absValue < 4) {
                // dot 在线段上
                return true;
            } else {
                // dot 不在线段上
                return false;
            }
        } else {
            // dot 没可能在线段上
            return false;
        }
    }
}
