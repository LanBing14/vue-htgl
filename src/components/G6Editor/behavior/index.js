import G6 from "@antv/g6";
import addEdge from './addEdge';
import hoverNode from './hoverNode'
import hoverEdge from './hoverEdge'
import lineNodeMove from './lineNodeMove'

const behavors = {
    addEdge,
    hoverNode,
    hoverEdge,
    lineNodeMove
}
export default () => {
    for (const key in behavors) {
        G6.registerBehavior(key, behavors[key])
    }
}

