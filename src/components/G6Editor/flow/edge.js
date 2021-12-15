import G6 from '@antv/g6';
import {uniqueId} from 'lodash';
import {getLineCenter} from '@/utils';
import cfg from '../cfg';
import config from "@/components/G6Editor/cfg";

export default {
    init() {
        const {nodeLabel} = config;

        G6.registerEdge('polyline2', {
            draw(cfg, group) {
                const startPoint = cfg.startPoint;
                const endPoint = cfg.endPoint;
                const style = cfg.style;
                if (!cfg.points) {
                    const center = getLineCenter({
                        x: startPoint.x,
                        y: startPoint.y
                    }, {
                        x: endPoint.x,
                        y: endPoint.y
                    });
                    // 为方便计算，将points的元素个数与path写成一致
                    // 数据中元素属性：
                    // fixed表示开始与结束点，无需绘制到canvas上。
                    // x、y中点位置。
                    // solid为true时表示是可真实拖动的节点false则是不可拖动的辅助点。
                    // status表示当前节点是否已经进行过拖动，未拖动时代表要在拖动的节点前后各插入一个虚化的辅助节点，已拖动过的则只进行更新自己位置
                    cfg.points = [
                        {
                            x: parseInt(startPoint.x),
                            y: parseInt(startPoint.y),
                            fixed: true
                        }, {
                            ...center,
                            solid: true,
                            status: true // 表示当前节点是否进行过拖动
                        }, {
                            x: parseInt(endPoint.x),
                            y: parseInt(endPoint.y),
                            fixed: true
                        }]
                }

                // 实时更新开始与结束点在points中的信息，方便后面的计算
                cfg.points[0].x = parseInt(startPoint.x);
                cfg.points[0].y = parseInt(startPoint.y);
                cfg.points[cfg.points.length - 1].x = parseInt(endPoint.x);
                cfg.points[cfg.points.length - 1].y = parseInt(endPoint.y);

                const ctrlPoints = cfg.points;
                const filterPoints = ctrlPoints.filter(item => item.solid); // 过滤只留下是实际节点的数据
                const mapPoints = filterPoints.map(
                    item => ['L', item.x, item.y]);
                // 绘制线段的路径
                const path = [
                    ['M', parseInt(startPoint.x), parseInt(startPoint.y)],
                    ...mapPoints,
                    ['L', parseInt(endPoint.x), parseInt(endPoint.y)]
                ];
                const shape = group.addShape('path', {
                    attrs: {
                        path,
                        ...style
                    }
                });
                // 控制点数据大于3，表示初始的实际控制点被拖动过，此时需要将线段中看得到的第1个和最后1个虚点的位置改变
                if (ctrlPoints.length > 3) {
                    const firstCtrlCenter = getLineCenter({
                        x: ctrlPoints[0].x,
                        y: ctrlPoints[0].y
                    }, {
                        x: ctrlPoints[2].x,
                        y: ctrlPoints[2].y
                    });
                    ctrlPoints[1].x = firstCtrlCenter.x;
                    ctrlPoints[1].y = firstCtrlCenter.y;
                    const lastCtrlCenter = getLineCenter({
                        x: ctrlPoints[ctrlPoints.length - 3].x,
                        y: ctrlPoints[ctrlPoints.length - 3].y
                    }, {
                        x: ctrlPoints[ctrlPoints.length - 1].x,
                        y: ctrlPoints[ctrlPoints.length - 1].y
                    });
                    ctrlPoints[ctrlPoints.length - 2].x = lastCtrlCenter.x;
                    ctrlPoints[ctrlPoints.length - 2].y = lastCtrlCenter.y;
                }
                ctrlPoints.forEach(point => {
                    if (!point.fixed) {
                        const itemCfg = this.getCtrlPointCfg(group, point);
                        if (point.solid) {
                            itemCfg.attrs.r = 4;
                        }
                        // 拖动节点过程中，如果正好在两点之间的直线上，则临时将前后的虚化点隐藏掉
                        if (point.delete) {
                            itemCfg.attrs.opacity = 0;
                        }
                        group.addShape('circle', itemCfg);
                    }
                });
                if (cfg.label) {
                    const center = shape.getPoint(0.5);
                    group.addShape('text', {
                        attrs: {
                            id: 'label' + uniqueId(),
                            text: cfg.label,
                            x: center.x,
                            y: center.y,
                            fill: nodeLabel.style.fill,
                            textAlign: 'center',
                            textBaseline: 'middle'
                        }
                    });
                }
                return shape;
            },
            setState(name, value, item) {
                const group = item.getContainer();
                const children = group.get('children').concat([]);
                const shape = children[0];
                if (name === 'selected') {
                    children.shift();
                    if (children[children.length - 1].attrs.id.indexOf('label') !== -1) {
                        children.pop();
                    }
                    if (value) {
                        let {points} = group.cfg.item._cfg.model;
                        points = points.filter(item => !item.fixed);
                        children.forEach((item, index) => {
                            if (points[index].delete) {
                                item.attr('opacity', 0);
                            } else {
                                item.attr('opacity', 1);
                            }
                        });
                        shape.attr('stroke', item._cfg.styles.selected.stroke);
                    } else {
                        children.forEach(item => {
                            item.attr('opacity', 0);
                        });
                        shape.attr('stroke', item._cfg.model.style.stroke);
                    }
                }
            },
            // 获取边上的控制点的配置
            getCtrlPointCfg(group, {
                x,
                y,
                status
            }) {
                const circleMainId = 'circle' + uniqueId();
                return {
                    attrs: {
                        id: circleMainId,
                        // parent: mainId,
                        x: x,
                        y: y,
                        r: 3,
                        fill: cfg.edgeStateStyle.selected.stroke,
                        stroke: cfg.edgeStateStyle.selected.stroke,
                        opacity: 0,
                        status: status
                    }
                }
            }
        })
        G6.registerEdge('link-edge', {
            draw(cfg, group) {
                let sourceNode, targetNode, start, end;
                if (!cfg.source.x) {
                    sourceNode = cfg.source.getModel();
                    start = {
                        x: sourceNode.x + cfg.start.x,
                        y: sourceNode.y + cfg.start.y
                    };
                } else {
                    start = cfg.source;
                }
                if (!cfg.target.x) {
                    targetNode = cfg.target.getModel();
                    end = {
                        x: targetNode.x + cfg.end.x,
                        y: targetNode.y + cfg.end.y
                    };
                } else {
                    end = cfg.target;
                }

                let path = [];
                path = [
                    ['M', start.x, start.y],
                    ['L', end.x, end.y]
                ]
                const keyShape = group.addShape('path', {
                    attrs: {
                        id: 'edge' + uniqueId(),
                        path: path,
                        stroke: '#1890FF',
                        strokeOpacity: 0.9,
                        lineDash: [5, 5]
                    }
                });
                return keyShape;
            }
        })
    }
}
