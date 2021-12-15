<template>
  <el-row>
    <h4 style="font-weight: normal">关联链图</h4>
    <div v-loading="loading" id="GLLT" ref="GLLT" style="width:100%; height: 500px;"></div>
  </el-row>
</template>

<script>
import { Api_getLinkDatas, Api_GraphDeep } from "@/api/advanceSearch";

export default {
  name: "CompanyMap",
  data() {
    return {
      loading: false,
      myChart: {},
      nodes: [],
      links: [],
      eNodes: [],
      eLinks: [],
      shapeList: [],
      onNode: [],
      fullOffX: 0,
      fullOffY: 0,
      companyId: "",
      hasFetchCompanyIds: []
    };
  },
  mounted() {
    this.companyId = this.$route.query.id;

    this.initEcharts();
  },
  methods: {
    // 关联链图
    initEcharts() {
      // eslint-disable-next-line no-undef
      this.myChart = echarts.init(document.getElementById("GLLT"));
      this.loading = true;
      Api_getLinkDatas(this.companyId)
        .then(res => {
          this.loading = false;
          this.drawDatas(res);
        })
        .catch(() => {
          this.loading = false;
        });
      this.hasFetchCompanyIds.push(this.companyId);
      Api_GraphDeep(this.companyId)
        .then(res => {
          this.loading = false;
          const { nodes, links } = res;
          this.turnData(nodes, links);
          this.drawDatas({
            Nodes: nodes,
            Links: links
          });
        })
        .catch(() => {
          this.loading = false;
        });
    },
    turnData(nodes, links) {
      nodes.forEach(item => {
        if (item.type === "companyInfo") {
          item.Category = 1;
          item.Name = item.company_name;
        } else if (item.type === "partner") {
          item.Category = 2;
          item.Name = item.stock_name;
        }
      });
      links.forEach(item => {
        const sourceNode = nodes.find(i => i.id === item.source);
        const targetNode = nodes.find(i => i.id === item.target);
        item.Source = sourceNode.type === "companyInfo" ? sourceNode.company_name : sourceNode.stock_name;
        item.Target = targetNode.type === "companyInfo" ? targetNode.company_name : targetNode.stock_name;
        item.Relation = item.type;
      });
    },
    drawDatas(data) {
      var cLinks = [];
      var cNodes = [];
      var width = this.$refs.GLLT.offsetWidth;
      var height = this.$refs.GLLT.offsetHeight;
      const centerX = width / 2;
      const centerY = height / 2;
      var personRadius = 100;
      var personAngle = 270;
      var personCount = 0;
      var personIndex = 0;
      var companyRadius = 270;
      var companyAngle = 270;
      var companyCount = 0;
      var companyIndex = 0;

      let companyLevel = 1; // 等级

      data.Nodes.forEach(node => {
        if (node.Category === 1) {
          companyCount++;
        }
        if (node.Category === 2) {
          personCount++;
        }
      });

      let personAngleOff = 360 / personCount; // 夹角
      let tempRadius = 100;
      if (personCount > 12) {
        personAngleOff = 360 / 12;
        let num = 0;
        for (let i = 0; i < 20; i++) {
          num += 12 + 9 * i;
          if (num < personCount) {
            tempRadius += 70;
          }
        }
      }

      let companyAngleOff = 360 / 34;
      if (tempRadius > 100) {
        companyRadius = tempRadius + 90;
      }
      if (companyCount > 95) {
        companyLevel = 5;
        companyAngleOff = 360 / 13;
        companyRadius = 180;
      } else if (companyCount > 61 && companyCount <= 95) {
        companyLevel = 4;
        companyAngleOff = 360 / 34;
        companyRadius = 450;
      } else if (companyCount > 34 && companyCount <= 61) {
        companyLevel = 3;
        companyAngleOff = 360 / 27;
        companyRadius = 360;
      } else if (companyCount > 21 && companyCount <= 34) {
        companyLevel = 2;
        companyAngleOff = 360 / 20;
      } else if (companyCount <= 21) {
        companyLevel = 1;
        companyAngleOff = 360 / companyCount;
      }

      data.Nodes.forEach(node => {
        let color = "#40bfd5"; // 公司 2ec7c9
        var symbolSize = 37;
        // eslint-disable-next-line no-unused-vars
        var fixX = true;
        // eslint-disable-next-line no-unused-vars
        var fixY = true;
        var x;
        var y;
        if (node.Category === 1) {
          // 圆周运动
          x = centerX + Math.sin((companyAngle * Math.PI) / 180) * companyRadius;
          y = centerY + Math.cos((companyAngle * Math.PI) / 180) * companyRadius;
          companyAngle += companyAngleOff;
          companyIndex++;
          switch (companyLevel) {
            default:
              break;
            case 2:
              if (companyIndex === 20) {
                companyRadius -= 90;
                companyAngle = 0;
                companyAngleOff = 360 / (companyCount - 20);
              }
              break;
            case 3:
              if (companyIndex === 27) {
                companyRadius -= 90;
                companyAngle = 0;
                if (companyCount - 27 > 21) {
                  companyAngleOff = 360 / 20;
                } else {
                  companyAngleOff = 360 / (companyCount - 27);
                }
              }
              if (companyCount - 27 > 21 && companyIndex === 47) {
                companyRadius -= 90;
                companyAngle = 0;
                companyAngleOff = 360 / (companyCount - 47);
              }
              break;
            case 4:
              if (companyIndex === 34) {
                companyRadius -= 90;
                companyAngle = 0;
                if (companyCount - 34 > 28) {
                  companyAngleOff = 360 / 27;
                } else {
                  companyAngleOff = 360 / (companyCount - 34);
                }
              }
              if (companyCount - 34 > 28 && companyIndex === 61) {
                companyRadius -= 90;
                companyAngle = 0;
                if (companyCount - 61 > 21) {
                  companyAngleOff = 360 / 20;
                } else {
                  companyAngleOff = 360 / (companyCount - 61);
                }
              }
              if (companyCount - 61 > 21 && companyIndex === 81) {
                companyRadius -= 90;
                companyAngle = 0;
                companyAngleOff = 360 / (companyCount - 81);
              }
              break;
            case 5:
              for (let i = 0; i < 20; i++) {
                if (((13 + 13 + i * 7) * (i + 1)) / 2 === companyIndex) {
                  companyRadius += 90;
                  if (companyCount - companyIndex > 13 + (i + 1) * 7) {
                    companyAngleOff = 360 / (13 + (i + 1) * 7);
                  } else {
                    companyAngleOff = 360 / (companyCount - companyIndex);
                  }
                }
              }
              break;
          }
        } else if (node.Category === 2) {
          color = "#6c89cb"; // 31e0b9  2aaedc 2fb1e3  人
          symbolSize = 25;
          fixX = false;
          fixY = false;
          x = centerX + Math.sin((personAngle * Math.PI) / 180) * personRadius;
          y = centerY + Math.cos((personAngle * Math.PI) / 180) * personRadius;
          personAngle += personAngleOff;
          personIndex++;
          if (personCount > 10) {
            for (let i = 0; i < 20; i++) {
              if (((12 + 12 + i * 9) * (i + 1)) / 2 === personIndex) {
                personRadius += 70;
                if (personCount - personIndex > 12 + (i + 1) * 9) {
                  personAngleOff = 360 / (12 + (i + 1) * 9);
                } else {
                  personAngleOff = 360 / (personCount - personIndex);
                }
              }
            }
          }
        }
        cNodes.push({
          id: node.id,
          name: node.Name, // 节点名称
          keyNo: node.Name, // 标识
          initial: [x, y], // 强制指定节点的初始值
          fixX: true, // 是否固定
          fixY: true,
          category: node.Category, // 节点的 category index
          label: node.Name.replace(/(.{5})(?=.)/g, "$1\n"), // 名称过长换行 //节点标签名称
          symbolSize: symbolSize, // 强制指定节点的大小
          itemStyle: { normal: { color: color } }
        });
      });
      data.Links.forEach(link => {
        cLinks.push({
          source: link.Source, // 源节点
          target: link.Target, // 目标节点
          name: link.Relation, // 关系
          weight: 1, // 边的权重
          itemStyle: {
            normal: {
              text: link.Relation,
              textColor: "#999",
              textFont: "normal 12px 微软雅黑",
              textPosition: "inside"
            }
          }
        });
      });
      // 初始化图谱
      this.drawChartRelation(cNodes, cLinks);
    },
    drawChartRelation(nodes, links) {
      var self = this;
      const option = {
        tooltip: { show: false },
        animation: true,
        series: [
          {
            type: "force",
            name: "关联分析",
            ribbonType: false,
            linkSymbol: "arrow",
            linkSymbolSize: [10, 10], // 对箭头的控制力导向图的边两端图形大小
            large: true,
            useWorker: true, // 是否在浏览器支持 web worker 的时候把布局计算放入 web worker 中
            steps: 10, // 每一帧布局计算的迭代次数
            roam: true, // 是否开启滚轮缩放和拖拽漫游
            itemStyle: {
              normal: {
                label: {
                  show: true,
                  textStyle: { color: "#fff" }
                },
                nodeStyle: {
                  brushType: "both",
                  borderColor: "#dfdfdf",
                  borderWidth: 0
                },
                linkStyle: { color: "#ddd" }
              },
              emphasis: {
                label: { show: false },
                nodeStyle: {
                  brushType: "both",
                  borderColor: "#dfdfdf",
                  borderWidth: 4
                },
                linkStyle: {}
              }
            },
            nodes: nodes,
            links: links
          }
        ]
      };
      console.log(option);
      this.myChart.setOption(option);
      this.initZrender();
      this.animatieChartLink(0, 0);

      this.myChart.on("restore", function() {
        this.initZrender();
        this.animatieChartLink(0, 0);
      });

      this.myChart.on("click", function(param) {
        const hoverNode = param.value;
        for (let i = 0; i < self.eNodes.length; i++) {
          self.eNodes[i].style.lineWidth = 0;
          self.eNodes[i].z = 2;
        }
        for (let i = 0; i < self.eLinks.length; i++) {
          self.eLinks[i].style.textColor = "#999";
          self.eLinks[i].style.strokeColor = "#ddd";
          self.eLinks[i].style.textFont = "normal 12px 微软雅黑";
          self.eLinks[i].arrow.style.color = "#ddd";
          self.eLinks[i].z = 2;
          self.eLinks[i].arrow.z = 2;
        }
        if (self.onNode !== hoverNode && hoverNode.keyNo) {
          for (let i = 0; i < self.eLinks.length; i++) {
            const edata = self.eLinks[i]._echartsData._data;
            if (edata.source === hoverNode.name || edata.target === hoverNode.name) {
              self.eLinks[i].style.textColor = "#00457d";
              self.eLinks[i].style.strokeColor = "#005fac";
              self.eLinks[i].style.textFont = "bold 12px 微软雅黑";
              self.eLinks[i].arrow.style.color = "#005fac";
              self.eLinks[i].z = 5;
              self.eLinks[i].arrow.z = 5;
              for (let j = 0; j < self.eNodes.length; j++) {
                const edata1 = self.eNodes[j]._echartsData._data;
                if (edata1.keyNo === edata.source || edata1.keyNo === edata.target) {
                  self.eNodes[j].style.lineWidth = 4;
                  self.eNodes[j].z = 6;
                }
              }
            }
          }
          self.onNode = hoverNode;
        } else {
          self.onNode = "";
        }
        self.myChart.getZrender().refreshShapes(self.shapeList, function() {}); // 更新视图
      });
    },
    initZrender() {
      this.eNodes = [];
      this.eLinks = [];
      this.shapeList = this.myChart.getZrender().storage.getShapeList();
      for (let i = 0; i < this.shapeList.length; i++) {
        if (this.shapeList[i]._echartsData && this.shapeList[i]._echartsData._data) {
          const edata = this.shapeList[i]._echartsData._data;
          if (edata.keyNo) {
            this.eNodes.push(this.shapeList[i]);
          } else {
            this.shapeList[i].arrow = this.shapeList[i + 1];
            this.eLinks.push(this.shapeList[i]);
          }
        }
        if (this.shapeList[i].fullscreenMove) {
          this.myChart.getZrender().delShape(this.shapeList[i].id);
        }
      }
    },
    animatieChartLink(targetX, targetY) {
      const self = this;
      var centerX = self.myChart.getZrender().getWidth() / 2;
      var centerY = self.myChart.getZrender().getHeight() / 2;
      var layer = self.myChart.getZrender().painter._layers[1];
      var animation = self.myChart.getZrender().animation;
      layer.scale = [0.0001, 0.0001, centerX, centerY];
      layer.rotation = [0, centerX, centerY];
      layer.position = [targetX || 0, targetY || 0];
      self.myChart.getZrender().painter.refresh();

      animation
        .animate(layer)
        .when(400, {
          scale: [1, 1, centerX, centerY]
        })
        .start("spline")
        .done(function() {
          layer.scale[2] = 0;
          layer.scale[3] = 0;
        });
      animation
        .animate(layer)
        .when(1000, {
          rotation: [Math.PI * 2, centerX, centerY]
        })
        .start("ElasticOut")
        .done(function() {
          layer.rotation[1] = 0;
          layer.rotation[2] = 0;
        })
        .during(function() {
          self.myChart.getZrender().refreshShapes(self.shapeList, function() {});
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
</style>
