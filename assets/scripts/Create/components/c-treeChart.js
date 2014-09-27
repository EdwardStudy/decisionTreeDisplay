/**
 * Created by Zhuo on 5/21/14.
 */
define([
        'd3'
    ],
    function(d3){
//---------------------------------------------------
// BEGIN code for this module
//---------------------------------------------------
function treeChart() {
    //default dimension parameters
    var box = {
        width: 100,
        height: 20,
        color_indicator_width: 5,
        front_gap_width: 10,
        back_gap_width: 10,
        between_box_gap: 3
    };

    var title = {
        width: box.width,
        height: 20,
        title_gap: 10
    };

    var prob = {
        width: box.width,
        height: 20,
        prob_gap: 3
    };

    var shape = {
        stroke_width: 3,
        half_fill_width: 10
    }

    var line = {stroke_width: 2};
    var between_node_gap = 20;


    ///functions for calculating the node height
    function upper_height(d) {
        return d.info_box[0].height + title.title_gap;
    };


    function lower_height(d) {
        var count = d.info_box.length;
        var total_height = 0;

        if (count < 2) return 0; //no info box other than title box

        for (var i = 1; i < count; i++) {
            if (d.info_box[i].type === "prob") {
                total_height = total_height + prob.prob_gap + d.info_box[i].height;
            }
            else {
                total_height = total_height + box.between_box_gap + d.info_box[i].height;
            }
        }
        ;

        return total_height;
    }

    function total_height(d) {
        return lower_height(d) + line.stroke_width + upper_height(d);
    };


    // ************** Generate the tree diagram	 *****************
    // Get JSON data
    treeJSON = d3.json("/scripts/Create/testdata/treedata.json", function (error, treeData) {

        var margin = {top: 20, right: 120, bottom: 20, left: 20},
            width = 960 - margin.right - margin.left,
            height = 500 - margin.top - margin.bottom;

        var i = 0,
            duration = 750;

        var tree = d3.layout.tree()
            .size([height, width]);

        //define an elbow-shaped line for links
        function elbow(start_x, start_y, end_x, end_y) {
            return "M" + start_x + "," + start_y
                + "V" + end_y + "H" + end_x;
        };

        var svg = d3.select("body").append("svg")
            .attr("width", width + margin.right + margin.left)
            .attr("height", height + margin.top + margin.bottom)
            .append("g")
            .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

        var root = treeData;

        var widthArray = [];//record the depth info

        var recorder = "start";



        function update(source) {

            // Compute the new tree layout.
            var nodes = tree.nodes(root),
                links = tree.links(nodes);

            //cumulative height
            var cumulative_height = 0;

            //A recursive helper function for walking through nodes from top downwards;
            function visit(parent, visitTerminal, visitNonTerminal, widthFn, childrenFn) {
                if (!parent) return;

                var children = childrenFn(parent);

                widthFn(parent);

                if (children) {
                    var count = children.length;
                    for (var i = 0; i < count; i++) {
                        visit(children[i], visitTerminal, visitNonTerminal, widthFn, childrenFn);
                    }
                    visitNonTerminal(parent);
                }
                else {
                    visitTerminal(parent);
                }

            };

            //locate x and y position for terminal nodes;
            function terminalHeight(data) {
                //get x coordinate;
                data.x = 0;
                var count = data.depth + 1;
                for (var i = 0; i < count; i++) {
                    data.x = data.x + widthArray[i];
                }
                ;

                //get y coordinate;
                data.y = cumulative_height + between_node_gap + upper_height(data) + line.stroke_width / 2;
                cumulative_height = cumulative_height + total_height(data);
                recorder = recorder + "->(" + data.x + "," + data.y + ")";
            };

            //locate x and y position for non-terminal nodes
            function nonTerminalHeight(data) {
                //get x coordinate;
                data.x = 0;
                var count = data.depth + 1;
                for (var i = 0; i < count; i++) {
                    data.x = data.x + widthArray[i];
                }
                ;

                //get y coordinate;
                data.y = Math.round((data.children[0].y + data.children[data.children.length - 1].y) / 2);
                recorder = recorder + "->(" + data.x + "," + data.y + ")";
            };

            function widthRecorder(data) {
                widthArray[data.depth] = data.width;
            };

            function childrenCheck(data) {
                return data.children && data.children.length > 0 ? data.children : null;
            };

            visit(nodes[0],
                terminalHeight,
                nonTerminalHeight,
                widthRecorder,
                childrenCheck
            );

            // Update the nodes…
            var node = svg.selectAll("g.node")
                .data(nodes, function (d) {
                    return d.id || (d.id = ++i);
                }); //either existing id, or assign new ones


            //Enter the nodes;
            var nodeEnter = node.enter().append("g")
                .attr("class", "node")
                .attr("transform", function (d) {
                    if (!source.x0 && !source.y0) {
                        return "translate (" + d.x + "," + d.y + ")"; // if it is the initialization, then no translation
                    }
                    else {
                        return "translate (" + source.x0 + "," + source.y0 + ")";
                    }
                });

            //add a line before the root node
            nodeEnter.filter(function (d) {
                return d == root ? this : null;
            })
                .append("line")
                .attr("class", "link")
                .attr("x1", 0)
                .attr("x1", 0)
                .attr("x2", function (d) {
                    return -d.width;
                })
                .attr("y2", 0)
                .style("stroke-width", line.stroke_width);

            nodeshape = nodeEnter.append("g")
                .attr("class", "node-shape")
                .on("click", click);

            nodeshape.filter(function (d) {
                return d.type == "decision" ? this : null;
            })
                .append("rect")
                .attr("width", 1e-6)
                .attr("height", 1e-6)
                .style("stroke", "#0000CC") //blue
                .style("fill", function (d) {
                    return d._children ? "lightsteelblue" : "#fff";
                });

            nodeshape.filter(function (d) {
                return d.type == "prob" ? this : null;
            })
                .append("circle")
                .attr("r", 1e-6)
                .style("stroke", "#00B800") //green
                .style("fill", function (d) {
                    return d._children ? "#E0FFE0" : "#fff";
                });

            nodeshape.filter(function (d) {
                return d.type == "terminal" ? this : null;
            })
                .append("polygon")
                .attr("points", function (d) {
                    return "1e-6,1e-6,1e-6,1e-6,1e-6,1e-6"
                })
                .style("stroke", "#e62e00") //red
                .style("fill", function (d) {
                    return d._children ? "lightred" : "#fff";
                });

            nodeEnter.append("text")
                .attr("class", "node-title")
                .attr("dy", ".35em")
                .attr("text-anchor", "start")
                .text(function (d) {
                    return d.info_box[0].content;
                })
                .style("fill-opacity", 1e-6);

            //TODO: the info boxes;
            nodeInfoBox = nodeEnter.append("g")
                .attr("class", "info-box");


            // Transition nodes to their new position
            var nodeUpdate = node.transition().attr("transform", function (d) {
                return "translate(" + d.x + "," + d.y + ")";
            })
                .duration(duration);

            nodeUpdate.select("circle")
                .attr("r", shape.half_fill_width)
                .style("fill", function (d) {
                    return d._children ? "#E0FFE0" : "#fff";
                });

            nodeUpdate.select("rect")
                .attr("x", -shape.half_fill_width)
                .attr("y", -shape.half_fill_width)
                .attr("width", shape.half_fill_width * 2)
                .attr("height", shape.half_fill_width * 2)
                .style("fill", function (d) {
                    return d._children ? "lightsteelblue" : "#fff";
                });


            nodeUpdate.select("polygon")
                .attr("points", function () {
                    return (-shape.half_fill_width) + "," + 0 + "," + shape.half_fill_width + "," + shape.half_fill_width + "," + (shape.half_fill_width) + "," + (-shape.half_fill_width)
                })
                .style("fill", function (d) {
                    return d._children ? "lightred" : "#fff";
                });

            nodeUpdate.select("text")
                .attr("x", function (d) {
                    return (-d.width + box.front_gap_width);
                })
                .attr("y", -title.title_gap)
                .style("fill-opacity", 1);

            // Transition exiting nodes to the parent's new position.
            var nodeExit = node.exit().transition()
                .duration(duration)
                .attr("transform", function (d) {
                    return "translate(" + source.x + "," + source.y + ")";
                })
                .remove();

            nodeExit.select("circle")
                .attr("r", 1e-6);

            nodeExit.select("text")
                .style("fill-opacity", 1e-6);

            //update the links...
            var link = svg.selectAll("path.link")
                .data(links, function (d) {
                    return d.target.id;
                });

            //link enter;
            link.enter().insert("path", "g")
                .attr("class", "link")
                .attr("d", function () {
                    return elbow(source.x0, source.y0, source.x0, source.y0);
                })
                .style("stroke-width", line.stroke_width);

            // Transition links to their new position.
            link.transition()
                .duration(duration)
                .attr("d", function (d) {
                    return elbow(d.source.x, d.source.y, d.target.x, d.target.y);
                });

            // Transition exiting nodes to the parent's new position.
            link.exit().transition()
                .duration(duration)
                .attr("d", function (d) {
                    return elbow(source.x, source.y, source.x, source.y);
                })
                .remove();

            //Stash the old positions for transition
            nodes.forEach(function (d) {
                d.x0 = d.x;
                d.y0 = d.y;
            });

            //TODO: for test
            document.getElementById("aaa").innerHTML = links[0].source.x + "," + links[0].source.y + "->" + links[0].target.x + "," + links[0].target.y;
            document.getElementById("bbb").innerHTML = recorder;


        };

        update(root);

        // Toggle children on click.
        function click(d) {
            if (d.children) {
                d._children = d.children;
                d.children = null;
            }
            else {
                d.children = d._children;
                d._children = null;
            }
            update(d);
        };
    });

}


// return module
return treeChart;


//---------------------------------------------------
// END code for this module
//---------------------------------------------------
});
