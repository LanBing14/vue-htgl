<template>
  <el-row>
    <h4 style="font-weight: normal">受益股东</h4>
    <div v-loading="loading" id="GLLT" ref="GLLT" style="width:100%; height: 500px; position: relative">
      <div v-show="isEmpty" class="no-msg">暂无数据！</div>
    </div>
  </el-row>
</template>

<script>
import G6 from "@antv/g6";
import insertCss from "insert-css";
import { Api_earningShareholder } from "@/api/advanceSearch.js";

export default {
  name: "BeneficiaryShareholders",
  components: { insertCss },
  data() {
    return {
      isEmpty: false,
      loading: false
    };
  },
  mounted() {
    this.companyId = this.$route.query.id;
    this.initChart(this.companyId);
  },
  methods: {
    initChart(cid) {
      insertCss(`
                .g6-tooltip {
                border: 1px solid #e2e2e2;
                border-radius: 4px;
                font-size: 12px;
                color: #333;
                background-color: rgba(255, 255, 255, 0.9);
                padding: 10px 8px;
                box-shadow: rgb(174, 174, 174) 0px 0px 10px;
                }
            `);

      G6.registerNode(
        "multipleLabelsNode",
        {
          // 绘制节点
          draw: function draw(cfg, group) {
            var shape = this.drawShape(cfg, group);
            if (cfg.label && cfg.label.length) {
              this.drawLabel(cfg, group);
            }
            return shape;
          },

          // 绘制label
          drawLabel: function drawLabel(cfg, group) {
            var size = this.getSize(cfg);
            var width = size[0];
            // const height = size[1];
            var label = cfg.label;
            // 绘制第一个label

            group.addShape("text", {
              attrs: {
                text: label[0] || "",
                x: 0,
                y: 0,
                fill: "#fff",
                textAlign: "center",
                textBaseline: "middle",
                fontSize: 11
              }
            });
            if (label.length > 1) {
              // 绘制第二个label
              group.addShape("rect", {
                attrs: {
                  text: label[1] || "",
                  x: 26,
                  y: -9,
                  fill: "#C0C4CC",
                  textAlign: "left",
                  textBaseline: "middle",
                  fontWeight: "bold",
                  width: 116,
                  height: 18
                }
              });
              group.addShape("text", {
                attrs: {
                  text: "最终受益股份：" + label[1] || "",
                  x: 32,
                  y: 0,
                  fill: "#fff",
                  textAlign: "left",
                  textBaseline: "middle",
                  fontSize: 10
                }
              });
            }
          }
        },
        "rect"
      );

      const width = document.getElementById("GLLT").scrollWidth;
      const height = document.getElementById("GLLT").scrollHeight || 500;
      const graph = new G6.Graph({
        container: "GLLT",
        width,
        height,
        layout: {
          type: "radial",
          edgeStrength: 1,
          preventOverlap: true,
          workerEnabled: true,
          strictRadial: true,
          unitRadius: 250,
          nodeSpacing: 50
        },
        modes: {
          default: [
            "drag-canvas",
            "zoom-canvas",
            "drag-node",
            {
              type: "tooltip",
              formatText: function formatText(model) {
                return typeof model.label === "object"
                  ? model.name + " 最终受益股份：" + model.label[1]
                  : model.name;
              }
            },
            {
              type: "edge-tooltip",
              formatText: function formatText(model, e) {
                const edge = e.item;
                return (
                  "来源：" +
                  edge.getSource().getModel().name +
                  "<br/>去向：" +
                  edge.getTarget().getModel().name
                );
              }
            }
          ]
        },
        defaultEdge: {
          size: 2,
          style: {
            stroke: "#e2e2e2",
            lineAppendWidth: 2,
            endArrow: true
          },
          labelCfg: {
            position: "start",
            refX: 50,
            refY: 5,
            autoRotate: true,
            style: {
              fill: "#909399",
              fontSize: 10
            }
          }
        },
        nodeStateStyles: {
          highlight: {
            opacity: 1
          },
          dark: {
            opacity: 0.2
          }
        },
        edgeStateStyles: {
          highlight: {
            stroke: "#999"
          }
        }
      });

      graph.node(node => {
        if (node.type === "companyInfo") {
          return {
            id: node.id,
            shape: "diamond",
            size: 20,
            style: {
              stroke: "",
              fill: "#F56C6C"
            },
            labelCfg: {
              position: "bottom",
              style: {
                fill: "#909399",
                fontSize: 11
              }
            }
          };
        } else {
          return {
            id: node.id,
            shape: "multipleLabelsNode",
            size: [40, 18],
            style: {
              lineWidth: 3,
              fill: "#66b1ff",
              stroke: ""
            },
            labelCfg: {
              style: {
                fill: "#fff",
                fontSize: 11
              }
            }
          };
        }
      });

      function clearAllStats() {
        graph.setAutoPaint(false);
        graph.getNodes().forEach(function(node) {
          graph.clearItemStates(node);
        });
        graph.getEdges().forEach(function(edge) {
          graph.clearItemStates(edge);
        });
        graph.paint();
        graph.setAutoPaint(true);
      }

      graph.on("node:mouseenter", function(e) {
        const item = e.item;
        graph.setAutoPaint(false);
        graph.getNodes().forEach(function(node) {
          graph.clearItemStates(node);
          graph.setItemState(node, "dark", true);
        });
        graph.setItemState(item, "dark", false);
        graph.setItemState(item, "highlight", true);
        findTop(item, 0);
        graph.paint();
        graph.setAutoPaint(true);
      });
      graph.on("node:mouseleave", clearAllStats);
      graph.on("canvas:click", clearAllStats);

      function findTop(_item, isTwice) {
        graph.getEdges().forEach(function(edge) {
          if (isTwice) {
            if (edge.getSource() === _item) {
              graph.setItemState(edge.getTarget(), "dark", false);
              graph.setItemState(edge.getTarget(), "highlight", true);
              graph.setItemState(edge, "highlight", true);
              edge.toFront();
              if (edge.getTarget()._cfg.model.type === "companyInfo") {
                findTop(edge.getTarget(), 1);
              }
            }
          } else {
            if (edge.getSource() === _item) {
              graph.setItemState(edge.getTarget(), "dark", false);
              graph.setItemState(edge.getTarget(), "highlight", true);
              graph.setItemState(edge, "highlight", true);
              edge.toFront();
              if (edge.getTarget()._cfg.model.type === "companyInfo") {
                findTop(edge.getTarget(), 1);
              }
            } else if (edge.getTarget() === _item) {
              graph.setItemState(edge.getSource(), "dark", false);
              graph.setItemState(edge.getSource(), "highlight", true);
              graph.setItemState(edge, "highlight", true);
              edge.toFront();
            } else {
              graph.setItemState(edge, "highlight", false);
            }
          }
        });
      }
      // 拿数据
      this.loading = true;
      Api_earningShareholder(cid, 10)
        .then(res => {
          if (!res.nodes.length) {
            this.isEmpty = true;
          } else {
            this.isEmpty = false;
          }
          this.loading = false;
          var data = res;
          console.log(data);
          var dealedData = {};
          dealedData.nodes = [];
          dealedData.edges = [];
          for (let i = 0; i < data.nodes.length; i++) {
            dealedData.nodes.push({
              ...data.nodes[i],
              label: data.nodes[i].stock_percent
                ? [data.nodes[i].name, data.nodes[i].stock_percent]
                : data.nodes[i].name
            });
          }
          for (let i = 0; i < data.edges.length; i++) {
            dealedData.edges.push({
              ...data.edges[i],
              label: data.edges[i].links
            });
          }

          graph.data({
            nodes: dealedData.nodes,
            edges: dealedData.edges.map(function(edge, i) {
              edge.id = "edge" + i;
              return Object.assign({}, edge);
            })
          });
          graph.render();
        })
        .catch(() => {
          this.loading = false;
        });
    }
  }
};
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.credit-tab-content {
  margin-top: 30px;
  padding: 20px;
  background-color: #fff;

  h4 {
    font-size: 16px;
    font-weight: bold;
    margin: 15px 0 15px -20px;
    padding: 10px 0 10px 15px;
    border-left: 4px solid #4b9df3;
  }
}

.no-msg {
  position: absolute;
  top: 50%;
  right: 0;
  bottom: 0;
  left: 0;
  margin: auto;
  text-align: center;
  color: #909399;
  font-size: 14px;
}
</style>
