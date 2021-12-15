<template>
  <el-row>
    <h4 style="font-weight: normal">企业图谱</h4>
    <div v-loading="loading" id="QYTP" ref="QYTP" style="width: 100%; height: 500px;"></div>
  </el-row>
</template>

<script>
import { Api_getTuPuDatas, Api_GraphBasic } from "@/api/advanceSearch";
import axios from "axios";

export default {
  name: "GQJG",
  data() {
    return {
      companyId: "",
      rootData: "",
      loading: false
    };
  },
  mounted() {
    this.companyId = this.$route.query.id;
    this.initEcharts();
  },
  methods: {
    // 股权结构
    initEcharts() {
      this.loading = true;
      // Api_getTuPuDatas(this.companyId).then(res => {
      // this.loading = false;
      // this.rootData = res;
      // this.traverseTreeId(this.rootData);
      // this.draw(this.rootData);
      // }).catch(() => {
      // this.loading = false;
      // });

      Api_GraphBasic(this.companyId)
        .then(res => {
          const { nodes } = res;
          const firstNode = nodes.shift();
          const root = {
            Category: 1,
            depth: 0,
            name: firstNode.company_name,
            children: this.turnData(nodes, 1)
          };
          this.loading = false;
          this.rootData = root;
          this.traverseTreeId(this.rootData);
          this.draw(this.rootData);
        })
        .catch(() => {
          this.loading = false;
        });
    },
    turnData(nodes, depth) {
      const arr = [];
      const types = {
        employee: {
          Category: 3,
          depth,
          name: "高管"
        },
        partner: {
          Category: 2,
          depth,
          name: "股东"
        },
        case: {
          Category: 6,
          depth,
          name: "法院判决"
        },
        branch: {
          Category: 4,
          depth,
          name: "分支机构"
        },
        invest: {
          Category: 5,
          depth,
          name: "对外投资"
        }
      };
      for (const key in types) {
        const mapArr = nodes
          .filter(i => i.type === key)
          .map(i => {
            let name = "";
            switch (i.type) {
              case "employee":
                name = i.name;
                break;
              case "partner":
                name = i.stock_name;
                break;
              case "case":
                name = i.casename;
                break;
              case "branch":
                name = i.name;
                break;
              case "invest":
                name = i.name;
                break;
            }
            return {
              Category: types[key].Category,
              name,
              depth: depth + 1
            };
          });
        types[key].children = mapArr;
        arr.push(types[key]);
      }
      return arr;
    },
    traverseTreeId(node) {
      let id = 1;
      trId(node);

      function trId(node) {
        if (!node.id) {
          node.id = id;
          id++;
        }
        if (node.children) {
          for (var i = 0; i < node.children.length; i++) {
            trId(node.children[i]);
          }
        }
      }
    },
    draw(data) {
      const self = this;
      var width = this.$refs.QYTP.offsetWidth;
      var height = this.$refs.QYTP.offsetHeight;
      // eslint-disable-next-line no-undef
      var tree = d3.layout
        .cluster()
        .size([360, 600])
        .separation(function(a, b) {
          return (a.parent === b.parent ? 2 : 3) / a.depth;
        });
      // eslint-disable-next-line no-undef
      var svg = d3
        .select("#QYTP")
        .append("svg")
        .attr("xmlns", "http://www.w3.org/2000/svg");
      svg.empty();
      svg.attr("width", width);
      svg.attr("height", height);

      var container = svg.append("g");
      var linkContainer = container.append("g");
      // eslint-disable-next-line no-undef
      var zoom = d3.behavior
        .zoom()
        .scaleExtent([0.4, 2])
        .on("zoom", zoomed);

      svg.call(zoom);

      zoom.translate([svg.attr("width") / 2, svg.attr("height") / 2]);
      zoom.scale(0.8);
      container.attr("transform", "translate(" + zoom.translate() + ")scale(" + zoom.scale() + ")");

      function zoomed() {
        // eslint-disable-next-line no-undef
        container.attr("transform", "translate(" + d3.event.translate + ")scale(" + d3.event.scale + ")");
      }

      data.children.filter(item => {
        if (item.children.length > 0) {
          item._children = item.children;
          item.children = null;
        }
      });
      drawTree(data);

      function drawTree(data) {
        // eslint-disable-next-line no-undef
        var diagonal = d3.svg.diagonal.radial().projection(function(d) {
          return [d.y, (d.x / 180) * Math.PI];
        });
        data.x0 = 0;
        data.y0 = 0;
        var nodes = tree.nodes(self.rootData);
        var links = tree.links(nodes);

        var pathLength = 150;
        if (nodes.length > 100) {
          pathLength = 200;
        }
        nodes.forEach(function(d) {
          if (d.depth > 2) {
            d.y = d.depth * (d.depth / 2) * 150;
          } else {
            d.y = d.depth * pathLength;
          }
        });

        var linkUpdate = linkContainer.selectAll(".link").data(links, function(d) {
          return d.target.id;
        });
        var linkEnter = linkUpdate.enter();
        var linkExit = linkUpdate.exit();

        linkEnter
          .append("path")
          .attr("class", "link")
          .attr("d", function(d) {
            var o = { x: data.x0, y: data.y0 };
            return diagonal({ source: o, target: o });
          })
          .transition()
          .duration(500)
          .attr("d", diagonal);

        linkUpdate
          .attr("stroke", function(d) {
            if (d.source.Category === 2 || d.target.Category === 2) {
              return "#7ec56a";
            }
            if (d.source.Category === 3 || d.target.Category === 3) {
              return "#728dc9";
            }
            if (d.source.Category === 4 || d.target.Category === 4) {
              return "#65d289";
            }
            if (d.source.Category === 5 || d.target.Category === 5) {
              return "#a496c7";
            }
            if (d.source.Category === 6 || d.target.Category === 6) {
              return "#ee7698";
            }
            return "#f35151";
          })
          .transition()
          .duration(500)
          .attr("d", diagonal)
          .attr("style", "fill: none; stroke-opacity: 1; stroke: #9ecae1; stroke-width: 1px;");

        linkExit
          .transition()
          .duration(500)
          .attr("d", function(d) {
            var o = { x: data.x, y: data.y };
            return diagonal({ source: o, target: o });
          })
          .remove();

        var nodeUpdate = container.selectAll(".node").data(nodes, function(d) {
          return d.id;
        });
        var nodeEnter = nodeUpdate.enter();
        var nodeExit = nodeUpdate.exit();
        var enterNodes = nodeEnter
          .append("g")
          .attr("class", function(d) {
            return "node";
          })
          .attr("transform", function(d) {
            return "translate(" + self.project(data.x0, data.y0) + ")";
          });

        enterNodes
          .append("circle")
          .attr("r", 0)
          .attr("fill", function(d) {
            if (d.Category === 1) {
              return "#40bfd5";
            }
            if (d.Category === 2) {
              return "#7ec56a";
            }
            if (d.Category === 3) {
              return "#728dc9";
            }
            if (d.Category === 4) {
              return "#65d289";
            }
            if (d.Category === 5) {
              return "#a496c7";
            }
            if (d.Category === 6) {
              return "#ee7698";
            }
            return "#40bfd5";
          })
          .attr("stroke", function(d) {
            if (d.depth === 0) {
              return "#40bfd5";
            }
            if (d.depth === 1) {
              if (d.Category === 1) {
                return "#40bfd5";
              }
              if (d.Category === 2) {
                return "#7ec56a";
              }
              if (d.Category === 3) {
                return "#728dc9";
              }
              if (d.Category === 4) {
                return "#65d289";
              }
              if (d.Category === 5) {
                return "#a496c7";
              }
              if (d.Category === 6) {
                return "#ee7698";
              }
            }
            return null;
          })
          .attr("stroke-opacity", 0.5)
          .attr("stroke-width", function(d) {
            return d.depth === 0 ? 10 : d.depth === 1 ? 6 : 0;
          })
          .on("click", function(d) {
            if (d.depth > 0) {
              self.toggle(d);
              drawTree(d);
            }
          });

        enterNodes
          .append("path")
          .attr("d", function(d) {
            if (d.depth > 0 && d._children) {
              return "M-6 -1 H-1 V-6 H1 V-1 H6 V1 H1 V6 H-1 V1 H-6 Z";
            } else if (d.depth > 0 && d.children) {
              return "M-6 -1 H6 V1 H-6 Z";
            }
          })
          .attr("fill", "#ffffff")
          .attr("stroke", "#ffffff")
          .attr("stroke-width", "0.2")
          .on("click", function(d) {
            if (d.depth > 0) {
              self.toggle(d);
              drawTree(d);
            }
          });

        enterNodes
          .append("text")
          .attr("dy", function(d) {
            return d.depth === 0 ? "-1.5em" : "0.31em";
          })
          .attr("x", function(d) {
            return d.depth === 0 ? d.name.length * 8 : d.x < 180 ? 15 : -15;
          })
          .text(function(d) {
            return d.name;
          })
          .style("text-anchor", function(d) {
            return d.depth === 0 ? "end" : d.x < 180 ? "start" : "end";
          })
          .style("fill-opacity", 0)
          .attr("transform", function(d) {
            return d.depth > 0 ? "rotate(" + (d.x < 180 ? d.x - 90 : d.x + 90) + ")" : "rotate(0)";
          })
          .style("font-size", function(d) {
            return d.depth === 0 ? "16px" : "14px";
          })
          .attr("fill", function(d) {
            if (d.depth === 0) {
              return "#2c91e8";
            }
            if (d.depth === 1) {
              if (d.Category === 2) {
                return "#2db092";
              }
              if (d.Category === 3) {
                return "#3d4cd4";
              }
            }
            return "#333";
          });

        var updateNodes = nodeUpdate
          .transition()
          .duration(500)
          .attr("transform", function(d) {
            return "translate(" + self.project(d.x, d.y) + ")";
          });
        updateNodes
          .select("text")
          .style("fill-opacity", 1)
          .attr("transform", function(d) {
            return d.depth > 0 ? "rotate(" + (d.x < 180 ? d.x - 90 : d.x + 90) + ")" : "rotate(0)";
          })
          .attr("x", function(d) {
            return d.depth === 0 ? d.name.length * 8 : d.x < 180 ? 15 : -15;
          })
          .attr("fill", function(d) {
            if (d.depth === 0) {
              return "#2c91e8";
            }
            if (d.depth === 1) {
              if (d.Category === 2) {
                return "#2db092";
              }
              if (d.Category === 3) {
                return "#3d4cd4";
              }
            }
            return "#333";
          })
          .style("text-anchor", function(d) {
            return d.depth === 0 ? "end" : d.x < 180 ? "start" : "end";
          });
        updateNodes.select("circle").attr("r", function(d) {
          return d.depth === 0 ? 12 : d.depth === 1 ? 10 : 9;
        });
        updateNodes.select("path").attr("d", function(d) {
          if (d.depth > 0 && d._children) {
            return "M-6 -1 H-1 V-6 H1 V-1 H6 V1 H1 V6 H-1 V1 H-6 Z";
          } else if (d.depth > 0 && d.children) {
            return "M-6 -1 H6 V1 H-6 Z";
          }
        });

        var exitNodes = nodeExit
          .transition()
          .duration(500)
          .attr("transform", function(d) {
            return "translate(" + self.project(data.x, data.y) + ")";
          })
          .remove();
        exitNodes.select("circle").attr("r", 0);
        exitNodes.select("text").style("fill-opacity", 0);

        nodes.forEach(function(d) {
          d.x0 = d.x;
          d.y0 = d.y;
        });
      }
    },
    toggle(d) {
      if (d.children) {
        d._children = d.children;
        d.children = null;
      } else {
        d.children = d._children;
        d._children = null;
      }
    },
    project(x, y) {
      var angle = ((x - 90) / 180) * Math.PI;
      var radius = y;
      return [radius * Math.cos(angle), radius * Math.sin(angle)];
    }
  }
};
</script>
