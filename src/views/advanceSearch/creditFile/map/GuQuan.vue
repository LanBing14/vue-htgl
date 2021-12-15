<template>
  <el-row>
    <h4 style="font-weight: normal">股权结构</h4>
    <div v-loading="loading" id="GQJG" ref="GQJG" style="width:100%; height: 500px;"></div>
  </el-row>
</template>

<script>
import { merge } from "lodash";
import { Api_GraphPartner } from "@/api/advanceSearch";

export default {
  name: "GQJG",
  data() {
    return {
      loading: false,
      myChart: "",
      rootGQData: "",
      optionGuQ: {},
      companyId: "",
      links: [],
      hasLoaded: [], // 当前已经进行过数据加载的节点id
      nodeChildData: {}
    };
  },
  mounted() {
    this.companyId = this.$route.query.id;
    this.initEcharts();
  },
  methods: {
    // 股权结构
    initEcharts() {
      // eslint-disable-next-line no-undef
      this.myChart = echarts.init(document.getElementById("GQJG"));
      // Api_getGUQuanDatasByQcc(this.companyId).then(res => {
      //     // this.loading = false;
      //     // this.rootGQData = res;
      //     // this.transTree(this.rootGQData);
      //     // this.initTree(this.rootGQData);
      //     // this.drawGQChart();
      // }).catch(() => {
      //     // this.loading = false;
      // });
      this.getData(this.companyId).then(({ res, arr }) => {
        const data = {
          children: arr
        };
        data.name = res.nodes[0].company_name;
        data.labelClick = false;
        data.symbolSize = [60, 60];
        data.symbol = "circle";
        data.itemStyle = {
          normal: {
            color: "#40bfd5",
            borderWidth: "5",
            borderColor: "#E8E8E8",
            label: {
              show: !0,
              position: "right",
              textStyle: { fontFamily: "MicroSoft YaHei", fontSize: 14, fontStyle: "normal" }
            }
          },
          emphasis: { color: "#40bfd5", borderWidth: "3", borderColor: "#E8E8E8" }
        };
        this.drawGQChart(data);
      });
      // Api_GraphPartner(this.companyId)
      //     .then(res => {
      //         const {nodes, links} = res;
      //         this.links = links;
      //         const firstNode = nodes.shift();
      //         this.turnData(nodes).then(c => {
      //             const root = {
      //                 KeyNo: null,
      //                 Category: 1,
      //                 FundedRatio: "100%",
      //                 grade: 1,
      //                 Name: firstNode.company_name,
      //                 Children: c
      //             };
      //             this.rootGQData = root;
      //             this.transTree(this.rootGQData);
      //             this.initTree(this.rootGQData);
      //             this.drawGQChart();
      //             this.loading = false;
      //         });
      //     })
      //     .catch(e => {
      //         this.loading = false;
      //     });
    },
    getData(companyId) {
      return new Promise((resolve, reject) => {
        this.loading = true;
        Api_GraphPartner(companyId)
          .then(res => {
            const { nodes, links } = res;
            const arr = this.tData(merge([], nodes), links);
            resolve({
              res,
              arr
            });
            this.loading = false;
          })
          .catch(e => {
            reject(e);
            this.loading = false;
          });
      });
    },
    tData(nodes, links) {
      const newNodes = nodes;
      newNodes.shift();
      const arr = [];
      for (let i = 0; i < nodes.length; i++) {
        const item = nodes[i];
        const findLink = links.find(l => l.source === item.id);
        const cfg = {
          name: findLink.links,
          symbol: "arrowdown",
          symbolSize: [12, 12],
          tooltip: { show: !1 },
          clickable: !1,
          itemStyle: {
            normal: {
              color: "#999",
              label: {
                show: !0,
                position: "right",
                textStyle: { fontFamily: "MicroSoft YaHei", fontSize: 14, fontStyle: "normal" }
              }
            },
            emphasis: {
              color: "#999",
              label: {
                show: !0,
                position: "right",
                textStyle: { fontFamily: "MicroSoft YaHei", fontSize: 14, fontStyle: "normal" }
              }
            }
          },
          lineStyle: { width: 1, color: "#E8E8E8" },
          children: []
        };
        const linkChild = {};
        if (item.type === "companyInfo") {
          linkChild.keyNo = item.company_id;
          linkChild.name = item.company_name.replace(/(.{5})(?=.)/g, "$1\n");
          linkChild.category = 1;
          linkChild.category = 1;
          linkChild.labelClick = true;
          linkChild.symbol = "circleCross";
          linkChild.symbolSize = [30, 30];
          linkChild.itemStyle = {
            normal: {
              color: "#40bfd5",
              borderWidth: "6",
              borderColor: "#E8E8E8",
              label: {
                show: true,
                position: "right",
                textStyle: {
                  fontFamily: "MicroSoft YaHei",
                  fontSize: 14,
                  color: "#666",
                  fontStyle: "normal"
                }
              }
            },
            emphasis: { color: "#40bfd5", borderWidth: "4", borderColor: "#E8E8E8" }
          };
        } else {
          linkChild.keyNo = item.partner_id;
          linkChild.name = item.stock_name;
          linkChild.category = 2;
          linkChild.clickable = false;
          linkChild.symbol = "rectangle";
          linkChild.labelClick = false;
          linkChild.symbolSize = [30, 30];
          linkChild.itemStyle = {
            normal: {
              color: "#6c89cb",
              borderWidth: "4",
              borderColor: "#E8E8E8",
              label: {
                show: !0,
                position: "right",
                textStyle: {
                  color: "#666",
                  fontFamily: "MicroSoft YaHei",
                  fontSize: 14,
                  fontStyle: "normal"
                }
              }
            },
            emphasis: { color: "#6c89cb", borderWidth: "2", borderColor: "#E8E8E8" }
          };
        }
        cfg.children.push(linkChild);
        arr.push(cfg);
      }
      return arr;
    },
    async turnData(nodes) {
      const arr = [];
      for (let i = 0; i < nodes.length; i++) {
        const item = nodes[i];
        const findLink = this.links.find(l => l.source === item.id);
        if (item.type === "companyInfo") {
          if (!this.hasLoaded.includes(item.company_id)) {
            this.hasLoaded.push(item.company_id);
            const res = await Api_GraphPartner(item.company_id);
            res.nodes.shift();
            this.turnData(res.nodes).then(c => {
              arr.push({
                KeyNo: item.company_id,
                Category: 1,
                FundedRatio: findLink ? findLink.links : null,
                grade: 2,
                Name: item.company_name,
                Children: c
              });
            });
          }
        } else {
          arr.push({
            KeyNo: item.partner_id,
            Category: 2,
            FundedRatio: findLink ? findLink.links : null,
            grade: 2,
            Name: item.stock_name
          });
        }
      }
      return arr;
    },
    transTree(data) {
      const self = this;
      data.children = data.Children;
      data.Children = undefined;
      data.name = data.Name.replace(/(.{5})(?=.)/g, "$1\n");
      const children = data.children;
      if (!children) {
        data.symbol = "circle";
        data.symbolSize = [30, 30];
        data.labelClick = true;
        data.itemStyle = {
          normal: {
            color: "#40bfd5",
            borderWidth: "4",
            borderColor: "#E8E8E8",
            label: {
              show: true,
              position: "right",
              textStyle: {
                fontFamily: "MicroSoft YaHei",
                fontSize: 14,
                color: "#666",
                fontStyle: "normal"
              }
            }
          },
          emphasis: { color: "#40bfd5", borderWidth: "2", borderColor: "#E8E8E8" }
        };
      } else {
        data.symbol = "circleCross";
        data.symbolSize = [30, 30];
        data.labelClick = true;
        data.itemStyle = {
          normal: {
            color: "#40bfd5",
            borderWidth: "6",
            borderColor: "#E8E8E8",
            label: {
              show: true,
              position: "right",
              textStyle: {
                fontFamily: "MicroSoft YaHei",
                fontSize: 14,
                color: "#666",
                fontStyle: "normal"
              }
            }
          },
          emphasis: { color: "#40bfd5", borderWidth: "4", borderColor: "#E8E8E8" }
        };
        for (let i = 0; i < children.length; i++) {
          self.transTree(children[i]);
          var tamp = children[i];
          var Ratio = children[i].FundedRatio || "";
          if (Ratio) {
            Ratio =
              (
                (children[i].FundedRatio.substr(0, children[i].FundedRatio.length - 1) * 10000) /
                10000
              ).toFixed(4) + "%";
          }
          children[i] = {
            name: Ratio,
            symbol: "arrowdown",
            symbolSize: [12, 12],
            tooltip: { show: !1 },
            clickable: !1,
            itemStyle: {
              normal: {
                color: "#999",
                label: {
                  show: !0,
                  position: "right",
                  textStyle: { fontFamily: "MicroSoft YaHei", fontSize: 14, fontStyle: "normal" }
                }
              },
              emphasis: {
                color: "#999",
                label: {
                  show: !0,
                  position: "right",
                  textStyle: { fontFamily: "MicroSoft YaHei", fontSize: 14, fontStyle: "normal" }
                }
              }
            },
            lineStyle: { width: 1, color: "#E8E8E8" },
            children: [tamp]
          };
        }
      }
      if (data.Category === 2) {
        data.symbol = "rectangle";
        data.clickable = false;
        data.labelClick = false;
        data.symbolSize = [30, 30];
        data.itemStyle = {
          normal: {
            color: "#6c89cb",
            borderWidth: "4",
            borderColor: "#E8E8E8",
            label: {
              show: !0,
              position: "right",
              textStyle: {
                color: "#666",
                fontFamily: "MicroSoft YaHei",
                fontSize: 14,
                fontStyle: "normal"
              }
            }
          },
          emphasis: { color: "#6c89cb", borderWidth: "2", borderColor: "#E8E8E8" }
        };
      }
    },
    initTree(data) {
      data.name = data.Name;
      data.labelClick = false;
      data.symbolSize = [60, 60];
      data.symbol = "circle";
      data.itemStyle = {
        normal: {
          color: "#40bfd5",
          borderWidth: "5",
          borderColor: "#E8E8E8",
          label: {
            show: !0,
            position: "right",
            textStyle: { fontFamily: "MicroSoft YaHei", fontSize: 14, fontStyle: "normal" }
          }
        },
        emphasis: { color: "#40bfd5", borderWidth: "3", borderColor: "#E8E8E8" }
      };

      this.getNode(data);
    },
    getNode(data) {
      const self = this;
      if (data.children) {
        for (let i = 0; i < data.children.length; i++) {
          self.getNode(data.children[i]);
        }
      }
      if (data.children && data.KeyNo && data.KeyNo !== self.companyId) {
        data._children = data.children;
        data.children = null;
        data.symbol = "circleCross";
      }
    },
    drawGQChart(data) {
      const self = this;
      this.optionGuQ = {
        title: { text: "" },
        series: [
          {
            type: "tree",
            orient: "vertical",
            nodePadding: 100,
            layerPadding: 50,
            symbol: "circle",
            roam: true,
            rootLocation: { x: "48%", y: "65%" },
            direction: "inverse",
            data: [data]
          }
        ]
      };

      this.myChart.setOption(this.optionGuQ);

      this.myChart.on("click", e => {
        if (e.data.category === 1 && e.data.keyNo) {
          const option = this.myChart.getOption();
          const { series } = option;
          const data = series[0].data[0];
          // const findNode = this.findNode(e.data.keyNo, data.children||findNode._children)
          this.myChart.clear();
          if (this.nodeChildData[e.data.keyNo]) {
            // const children = findNode.children || findNode._children
            this.toggleNodeExpand(e.data.keyNo, data.children);
            option.series[0].data = [data];
            // console.log(merge({},data));
            this.myChart.setOption(option);
          } else {
            this.getData(e.data.keyNo).then(({ arr }) => {
              this.setNodeData(e.data.keyNo, arr, data.children);
              this.nodeChildData[e.data.keyNo] = arr;
              option.series[0].data = [data];
              this.myChart.setOption(option);
            });
          }
        }
      });
    },
    findNode(id, children) {
      let f = null;
      for (let i = 0; i < children.length; i++) {
        const item = children[i].children[0];
        if (item.keyNo === id) {
          f = item;
          break;
        }
        if (item.children) {
          f = this.findNode(id, item.children);
        }
      }
      return f;
    },
    setNodeData(id, dataArr, children) {
      for (let i = 0; i < children.length; i++) {
        const item = children[i].children[0];
        if (item.keyNo === id) {
          item.children = dataArr;
          break;
        }
        if (item.children) {
          this.setNodeData(id, dataArr, item.children);
        }
      }
    },
    toggleNodeExpand(id, children) {
      for (let i = 0; i < children.length; i++) {
        const item = children[i].children[0];
        if (item.keyNo === id) {
          // item.children = null
          if (item.children) {
            // item._children = item.children;
            item.children = null;
            // item.symbol = "circleCross";
          } else {
            item.children = this.nodeChildData[id];
            // item._children = null;
            // item.symbol = "circleMinus";
          }
          break;
        }
        if (item.children) {
          this.toggleNodeExpand(id, item.children);
        }
      }
    },
    troggleTree(KeyNo) {
      // const self = this;

      if (KeyNo === this.companyId) {
        return false;
      }

      getNode(this.rootGQData);

      function getNode(data) {
        if (data.KeyNo && data.KeyNo === KeyNo) {
          if (data.children) {
            data._children = data.children;
            data.children = null;
            data.symbol = "circleCross";
          } else if (data._children) {
            data.children = data._children;
            data._children = null;
            data.symbol = "circleMinus";
          }
          return false;
        }
        if (data.children) {
          for (let i = 0; i < data.children.length; i++) {
            getNode(data.children[i]);
          }
        }
      }

      this.myChart.clear();
      this.myChart.setOption(this.optionGuQ);
      // this.initGQZrender()
    },
    initGQZrender() {
      const self = this;
      var shapeList = self.myChart.getZrender().storage.getShapeList();
      for (var j = 0; j < shapeList.length; j++) {
        if (shapeList[j].clickcom) {
          self.myChart.getZrender().delShape(shapeList[j].id);
        }
      }
      for (var i = 0; i < shapeList.length; i++) {
        if (shapeList[i]._echartsData && shapeList[i]._echartsData._data.labelClick) {
          var shape = new Text({
            style: {
              x: shapeList[i].rotation[1] + 25,
              y: shapeList[i].rotation[2],
              text: shapeList[i]._echartsData._name,
              color: "#333",
              textFont: "normal 13px 微软雅黑",
              lineWidth: 0
            },
            highlightStyle: {
              lineWidth: 0,
              strokeColor: "rgba(0,0,0,0)"
            }
          });
          shape.keyNo = shapeList[i]._echartsData._data.KeyNo;
          shape.zlevel = 1;
          shape.z = 4;
          shape.clickcom = true;
          shape.clickable = true;
          self.myChart.getZrender().addShape(shape);
        }
      }
    },
    animatieGQChart(targetX, targetY) {
      var centerX = this.myChart.getZrender().getWidth() / 2;
      var centerY = this.myChart.getZrender().getHeight() / 2;
      var layer = this.myChart.getZrender().painter._layers[1];
      var animation = this.myChart.getZrender().animation;
      layer.scale = [0.2, 0.2, centerX, centerY];
      layer.rotation = [0, centerX, centerY];
      layer.position = [targetX || 0, targetY || 0];
      this.myChart.getZrender().render();

      animation
        .animate(layer)
        .when(400, {
          scale: [1, 1, centerX, centerY]
        })
        .start("spline")
        .done(function() {
          layer.scale[2] = 0;
          layer.scale[3] = 0;
        })
        .during(function() {
          this.myChart.getZrender().render();
        });
    }
  }
};
</script>
