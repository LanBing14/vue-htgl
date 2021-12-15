import G6 from '@antv/g6';
import {uniqueId} from 'lodash';
import config from '../cfg';
import {Unicode_Str} from '@/utils';

export default {

    init() {
        const {defaultAnchor, defaultNode, nodeLabel, nodeStateStyle} = config;
        // 矩形节点
        G6.registerNode('rectNode', {
            draw(cfg, group) {
                const {size, fill, stroke, lineWidth, radius, icon, iconColor, label, labelColor} = cfg;
                const nodeSize = size || [100, 50];
                const offsetX = -nodeSize[0] / 2;
                const offsetY = -nodeSize[1] / 2;
                const defaultCfg = {
                    x: offsetX,
                    y: offsetY,
                    width: nodeSize[0],
                    height: nodeSize[1],
                    radius: radius || 0,
                    fill: fill || defaultNode.style.fill,
                    stroke: stroke || defaultNode.style.stroke,
                    lineWidth: (lineWidth === '' || lineWidth === undefined) ? (defaultNode.style.lineWidth) : (lineWidth !== 0 ? lineWidth : false)
                };
                const anchorPoints = cfg.anchorPoints;
                const mainId = 'rect' + uniqueId();
                const shape = group.addShape('rect', {
                    attrs: {
                        ...defaultCfg,
                        id: mainId
                    }
                });
                if (icon) {
                    group.addShape('text', {
                        attrs: {
                            id: 'icon' + uniqueId(),
                            parent: mainId,
                            fontFamily: 'iconfont', // 对应 CSS 里面的 font-family: "iconfont";
                            text: Unicode_Str(icon.replace('&#x', '\\u').replace(';', '')),
                            fontSize: 16,
                            x: offsetX,
                            y: offsetY,
                            fill: iconColor,
                            textAlign: 'center',
                            textBaseline: 'middle'
                        },
                        draggable: true, // Allow this shape to be dragged
                        name: 'icon'
                    });
                }
                if (label) {
                    group.addShape('text', {
                        attrs: {
                            id: 'label' + uniqueId(),
                            parent: mainId,
                            text: label,
                            x: defaultCfg.width / 2 + defaultCfg.x,
                            y: defaultCfg.height / 2 + defaultCfg.y,
                            fill: labelColor || nodeLabel.style.fill,
                            textAlign: 'center',
                            textBaseline: 'middle'
                        },
                        draggable: true, // Allow this shape to be dragged
                        name: 'label'
                    })
                }
                if (anchorPoints && anchorPoints.length) {
                    for (var p = 0; p < anchorPoints.length; p++) {
                        const point = anchorPoints[p]; // 当前锚点
                        const circleMainId = 'circle' + uniqueId();
                        group.addShape('circle', {
                            attrs: {
                                id: circleMainId,
                                parent: mainId,
                                x: point[0] * defaultCfg.width + defaultCfg.x,
                                y: point[1] * defaultCfg.height + defaultCfg.y,
                                r: defaultAnchor.size,
                                fill: defaultAnchor.fill,
                                stroke: defaultAnchor.stroke,
                                opacity: 0,
                                isPoint: true
                            }
                        });
                    }
                }
                return shape;
            },
            // 设置状态
            setState(name, value, item) {
                const group = item.getContainer();
                const {model} = item._cfg;
                const shape = group.get('children')[0]; // 主shape，顺序根据 draw 时确定
                const children = group.findAll(g => {
                    return g.attrs.parent === shape.attrs.id;
                });
                const circles = group.findAll(circle => {
                    return circle.attrs.isPoint;
                });
                const selectStyles = () => {
                    shape.attr('fill', nodeStateStyle.selected.fill);
                    shape.attr('stroke', nodeStateStyle.selected.stroke);
                    shape.attr('cursor', 'move');
                    children.forEach(child => {
                        child.attr('cursor', 'move');
                        if (child.attrs.id.indexOf('icon') > 0) {
                            child.attr('fill',
                                nodeStateStyle.selected.iconColor);
                        }
                        if (child.attrs.id.indexOf('label') > 0) {
                            child.attr('fill',
                                nodeStateStyle.selected.labelColor);
                        }
                    });
                    circles.forEach(circle => {
                        circle.attr('opacity', 1);
                    });
                };
                const unSelectStyles = () => {
                    shape.attr('fill', model.fill);
                    shape.attr('stroke', model.stroke);
                    children.forEach(child => {
                        child.attr('cursor', 'move');
                        if (child.attrs.id.indexOf('icon') > 0) {
                            child.attr('fill', model.iconColor);
                        }
                        if (child.attrs.id.indexOf('label') > 0) {
                            child.attr('fill', model.labelColor);
                        }
                    });
                    circles.forEach(circle => {
                        circle.attr('opacity', 0);
                    });
                }
                switch (name) {
                    case 'selected':
                    case 'hover':
                        if (value) {
                            selectStyles();
                        } else {
                            unSelectStyles();
                        }
                        break;
                }
            }
        })

        // 菱形节点
        G6.registerNode('diamondNode', {
            draw(cfg, group) {
                const {size, fill, stroke, lineWidth} = cfg;
                const anchorStyle = defaultAnchor;
                const nodeSize = size || [100, 50];
                const offsetX = -nodeSize[0] / 2;
                const offsetY = -nodeSize[1] / 2;
                const defaultCfg = {
                    fill: fill || defaultNode.style.fill,
                    stroke: stroke || defaultNode.style.stroke,
                    lineWidth: (lineWidth === '' || lineWidth === undefined) ? (defaultNode.style.lineWidth) : (lineWidth !== 0 ? lineWidth : false)
                };
                const anchorPoints = cfg.anchorPoints;
                const mainId = 'diamond' + uniqueId();
                const shape = group.addShape('path', {
                    attrs: {
                        ...defaultCfg,
                        id: mainId,
                        path: this.getPath(cfg) // 根据配置获取路径
                    }
                });
                if (cfg.label) {
                    group.addShape('text', {
                        attrs: {
                            id: 'label' + uniqueId(),
                            parent: mainId,
                            text: cfg.label,
                            x: 0,
                            y: 0,
                            fill: cfg.labelColor || nodeLabel.style.fill,
                            textAlign: 'center',
                            textBaseline: 'middle'
                        },
                        draggable: true, // Allow this shape to be dragged
                        name: 'label'
                    });
                }
                if (anchorPoints && anchorPoints.length) {
                    for (var p = 0; p < anchorPoints.length; p++) {
                        const point = anchorPoints[p]; // 当前锚点
                        const circleMainId = 'circle' + uniqueId();
                        group.addShape('circle', {
                            attrs: {
                                id: circleMainId,
                                parent: mainId,
                                x: point[0] * nodeSize[0] + offsetX,
                                y: point[1] * nodeSize[1] + offsetY,
                                r: anchorStyle.size,
                                fill: anchorStyle.fill,
                                stroke: anchorStyle.stroke,
                                opacity: 0,
                                isPoint: true
                            }
                        });
                    }
                }
                return shape;
            },
            // 返回菱形的路径
            getPath(cfg) {
                const size = cfg.size || [40, 40]; // 如果没有 size 时的默认大小
                const width = size[0];
                const height = size[1];
                //  / 1 \
                // 4     2
                //  \ 3 /
                // const path = [
                //     ['M', width / 2, 0],
                //     ['L', width, height / 2],
                //     ['L', width / 2, height],
                //     ['L', 0, height / 2],
                //     ['Z'] // 封闭
                // ]
                const path = [
                    ['M', 0, -height / 2],
                    ['L', width / 2, 0],
                    ['L', 0, height / 2],
                    ['L', -width / 2, 0],
                    ['Z'] // 封闭
                ];
                return path;
            },
            // 设置状态
            setState(name, value, item) {
                const group = item.getContainer();
                const {model} = item._cfg;
                const shape = group.get('children')[0]; // 顺序根据 draw 时确定
                const label = group.get('children')[1]; // 顺序根据 draw 时确定
                const children = group.findAll(g => {
                    return g.attrs.parent === shape.attrs.id;
                });
                const circles = group.findAll(circle => {
                    return circle.attrs.isPoint;
                });
                const selectStyles = () => {
                    shape.attr('fill', nodeStateStyle.selected.fill);
                    shape.attr('stroke', nodeStateStyle.selected.stroke);
                    shape.attr('cursor', 'move');
                    label.attr('fill', nodeStateStyle.selected.labelColor);
                    children.forEach(child => {
                        child.attr('cursor', 'move');
                    });
                    circles.forEach(circle => {
                        circle.attr('opacity', 1);
                    });
                };
                const unSelectStyles = () => {
                    shape.attr('fill', model.fill);
                    shape.attr('stroke', model.stroke);
                    label.attr('fill', model.labelColor);
                    circles.forEach(circle => {
                        circle.attr('opacity', 0);
                    });
                }
                switch (name) {
                    case 'selected':
                    case 'hover':
                        if (value) {
                            selectStyles();
                        } else {
                            unSelectStyles();
                        }
                        break;
                }
            }
        })

        // 文本节点
        G6.registerNode('textNode', {
            draw(cfg, group) {
                const {size, fill, label} = cfg;
                const shape = group.addShape('text', {
                    attrs: {
                        id: 'label' + uniqueId(),
                        textAlign: 'center',
                        textBaseline: 'middle',
                        x: 0,
                        y: 0,
                        fill: fill || defaultNode.style.fill,
                        text: label,
                        fontSize: size
                    }
                });
                return shape;
            }
        })

        // 椭圆节点
        G6.registerNode('ellipseNode', {
            draw(cfg, group) {
                const {size, fill, stroke, lineWidth, label, labelColor} = cfg;
                const rx = size[0] / 2;
                const ry = size[1] / 2;
                const mainId = uniqueId();
                const shape = group.addShape('ellipse', {
                    attrs: {
                        id: mainId,
                        x: 0,
                        y: 0,
                        fill,
                        stroke,
                        lineWidth,
                        size,
                        label,
                        rx,
                        ry
                    }
                });
                if (label) {
                    group.addShape('text', {
                        attrs: {
                            id: 'label' + uniqueId(),
                            parent: mainId,
                            text: label,
                            x: 0,
                            y: 0,
                            fill: labelColor || nodeLabel.style.fill,
                            textAlign: 'center',
                            textBaseline: 'middle',
                            draggable: true, // Allow this shape to be dragged
                            name: 'label'
                        }
                    })
                }
                const anchorPoints = cfg.anchorPoints;
                if (anchorPoints && anchorPoints.length) {
                    for (var p = 0; p < anchorPoints.length; p++) {
                        const point = anchorPoints[p]; // 当前锚点
                        const circleMainId = 'circle' + uniqueId();
                        group.addShape('circle', {
                            attrs: {
                                id: circleMainId,
                                parent: mainId,
                                x: point[0] * size[0] - size[0] / 2,
                                y: point[1] * size[1] - size[1] / 2,
                                r: defaultAnchor.size,
                                fill: defaultAnchor.fill,
                                stroke: defaultAnchor.stroke,
                                opacity: 0,
                                isPoint: true
                            }
                        });
                    }
                }
                return shape;
            },
            // 设置状态
            setState(name, value, item) {
                const group = item.getContainer();
                const {model} = item._cfg;
                const shape = group.get('children')[0]; // 顺序根据 draw 时确定
                const label = group.get('children')[1]; // 顺序根据 draw 时确定
                const children = group.findAll(g => {
                    return g.attrs.parent === shape.attrs.id;
                });
                const circles = group.findAll(circle => {
                    return circle.attrs.isPoint;
                });
                const selectStyles = () => {
                    shape.attr('fill', nodeStateStyle.selected.fill);
                    shape.attr('stroke', nodeStateStyle.selected.stroke);
                    shape.attr('cursor', 'move');
                    label.attr('fill', nodeStateStyle.selected.labelColor);
                    children.forEach(child => {
                        child.attr('cursor', 'move');
                    });
                    circles.forEach(circle => {
                        circle.attr('opacity', 1);
                    });
                };
                const unSelectStyles = () => {
                    shape.attr('fill', model.fill);
                    shape.attr('stroke', model.stroke);
                    label.attr('fill', model.labelColor || nodeLabel.style.fill);

                    circles.forEach(circle => {
                        circle.attr('opacity', 0);
                    });
                }
                switch (name) {
                    case 'selected':
                    case 'hover':
                        if (value) {
                            selectStyles();
                        } else {
                            unSelectStyles();
                        }
                        break;
                }
            }
        })

        // 圆节点
        G6.registerNode('circleNode', {
            draw(cfg, group) {
                const {size, fill, stroke, lineWidth, label, labelColor} = cfg;
                const mainId = uniqueId();
                const shape = group.addShape('circle', {
                    attrs: {
                        id: mainId,
                        r: size,
                        x: 0,
                        y: 0,
                        fill,
                        stroke,
                        lineWidth
                    }
                });
                group.addShape('circle', {
                    attrs: {
                        id: 'inner' + mainId,
                        parent: mainId,
                        r: size - 5,
                        x: 0,
                        y: 0,
                        fill,
                        stroke,
                        lineWidth: lineWidth / 2
                    },
                    draggable: true, // Allow this shape to be dragged
                    name: 'circle'
                });
                if (label) {
                    group.addShape('text', {
                        attrs: {
                            id: 'label' + uniqueId(),
                            parent: mainId,
                            text: label,
                            x: 0,
                            y: 0,
                            fill: labelColor || nodeLabel.style.fill,
                            textAlign: 'center',
                            textBaseline: 'middle'
                        },
                        draggable: true, // Allow this shape to be dragged
                        name: 'label'
                    });
                }
                const anchorPoints = cfg.anchorPoints;
                if (anchorPoints && anchorPoints.length) {
                    for (var p = 0; p < anchorPoints.length; p++) {
                        const point = anchorPoints[p]; // 当前锚点
                        const circleMainId = 'circle' + uniqueId();
                        group.addShape('circle', {
                            attrs: {
                                id: circleMainId,
                                parent: mainId,
                                x: point[0] * (size * 2) - size,
                                y: point[1] * (size * 2) - size,
                                r: defaultAnchor.size,
                                fill: defaultAnchor.fill,
                                stroke: defaultAnchor.stroke,
                                opacity: 0,
                                isPoint: true
                            }
                        });
                    }
                }
                return shape;
            },
            // 设置状态
            setState(name, value, item) {
                const group = item.getContainer();
                const {model} = item._cfg;
                const shape = group.get('children')[0]; // 顺序根据 draw 时确定
                const innerShape = group.get('children')[1]; // 顺序根据 draw 时确定
                const label = group.get('children')[2]; // 顺序根据 draw 时确定
                const children = group.findAll(g => {
                    return g.attrs.parent === shape.attrs.id;
                });
                const circles = group.findAll(circle => {
                    return circle.attrs.isPoint;
                });
                const selectStyles = () => {
                    shape.attr('fill', nodeStateStyle.selected.fill);
                    shape.attr('stroke', nodeStateStyle.selected.stroke);
                    innerShape.attr('fill', nodeStateStyle.selected.fill);
                    innerShape.attr('stroke', nodeStateStyle.selected.stroke);
                    shape.attr('cursor', 'move');
                    label.attr('fill', nodeStateStyle.selected.labelColor);
                    children.forEach(child => {
                        child.attr('cursor', 'move');
                    });
                    circles.forEach(circle => {
                        circle.attr('opacity', 1);
                    });
                };
                const unSelectStyles = () => {
                    shape.attr('fill', model.fill);
                    shape.attr('stroke', model.stroke);
                    innerShape.attr('fill', model.fill);
                    innerShape.attr('stroke', model.stroke);
                    label.attr('fill', model.labelColor || nodeLabel.style.fill);

                    circles.forEach(circle => {
                        circle.attr('opacity', 0);
                    });
                };
                switch (name) {
                    case 'selected':
                    case 'hover':
                        if (value) {
                            selectStyles();
                        } else {
                            unSelectStyles();
                        }
                        break;
                }
            }
        });
    }
}
