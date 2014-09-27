define([
		'd3',
		'd3.superformula'
	],
	function (d3) {
		/**
		 * decision tree module
		 *
		 * @desc Decision Tree visual module based on d3
		 * @author Zhang Di (zhangdiwaa@163.com)
		 *
		 */
		var module = function ($node) {
			//declare custom event, these event will be used with the upper modules
			//创建一些自定义事件，这些事件将于外层进行交互
			var dispatch = d3.dispatch('nodeClick', 'evaluationDialog', 'infoboxDblclick');


			//defaultOption
			//默认参数，构造函数
			/*
			 * @name: defaultOption
			 * @description: the constructor of default option for decision tree
			 * 			     决策树默认参数的构造函数
			 */
			var defaultOption = function () {
				var root = this;
				/*
				 *  fluctuating properties
				 * 直接与外层交互，经常变动的属性
				 */
				this.name = "dtree";
				this.description = "";
				this.last_saved = "";
				//security level 决定树是否可以被共享，
				//private不能被别人看到不能被修改， readable被同伴可见可分析不能修改，modifiable被同伴可分析可修改, public任何人可见可修改
				this.security_level = "private";
				//layout style 记录用户所选树的外观
				//可能的值：white-print， blue-print
				this.layout_style = "white-print";
				//记录每层宽度，
				this.layer_width = [];

				//是否显示某些文字
				this.show_podpis = true;
				this.show_title = true;
				this.show_prob = true;
				this.show_info = true;
				this.show_tips = true;
				this.show_indicator = true;
				this.show_default_info = true;
				this.show_compiled_info = true;
				this.show_parsed_info = true;
				this.show_variable = true;
				this.show_tracker = true;
				this.show_payoff = true;

				//是否绑定交互
				this.interface_contextmenu = true;
				this.interface_slider = true;
				this.interface_canvas_option = true;

				/*
				 *
				 * 一些用于内部计算的属性
				 */
				this._maxId = 1;//当前最大节点id值（不等于节点个数）
				this.scale = 1;//当前缩放比例
				this.scale_offset = 0.2; //缩放比例的放大缩小偏移值
				this.scale_extent = [0.2, 4];
				/*
				 * default style
				 * 通用默认样式
				 */
				//文字格式
				this.textStyle = {
					text_color:   "#000",
					text_align:   "left",
					baseline:     "top",
					font_size:    "12px",
					font_weight:  "normal",
					font_family:  '"Helvetica Neue", Helvetica, Arial, "Microsoft Yahei UI", "Microsoft YaHei", SimHei, "\5B8B\4F53", simsun, sans-serif',
					fill_opacity: 0.8
				};
				//标签
				this.indicatorStyle = {
					show_indicator: false,
					color:          "red",
					width:          10
				};
				//边框
				this.borderStyle = {
					show_border:  true,
					border_color: "#ddd",
					border_style: "solid",
					border_width: "1px"
				};
				//填充区域
				this.areaStyle = {
					color:   "none",
					opacity: 1.0
				};
				//动画
				this.anime = {
					show_anime: true,
					duration:   750
				};
				/*
				 * line
				 * 线条
				 */
				//连接线
				this.line = {
					stroke_width: 3,
					stroke_color: "rgb(168, 170, 169)",
					line_solid:   "solid"
				};
				//引用线
				this.citeline = {
					stroke_width: 3,
					stroke_color: "#000",
					line_solid:   "dotted"
				};
				//x轴分段坐标
				this.axis_x = {
					nodes:   [],
					setnode: function (d) {
						//计算X轴当前节点的坐标，
						root.axis_x.nodes[d.depth] =
							(d.depth > 0) ?
								root.axis_x.nodes[d.depth - 1] + root.boxArea.width(d)
								:
								root.boxArea.width(d);
					}
				};
				//y轴分段坐标
				this.axis_y = {
					nodes:   [],
					setnode: function (d) {
						//计算y轴当前节点的坐标，
						//节点间距为每个节点盒模型的高度
						root.axis_y.nodes[0] = 0;
						var lastnode = root.axis_y.nodes[root.axis_y.nodes.length - 1];
						var thisnode = lastnode + root.boxArea.height(d);
						root.axis_y.nodes.push(thisnode);

//						if (root.axis_y.nodes.length > 0) {
//							var lastnode = root.axis_y.nodes[root.axis_y.nodes.length - 1];
//							var thisnode = lastnode + root.boxArea.height(d);
//							root.axis_y.nodes.push(thisnode);
//						} else {
//							root.axis_y.nodes.push(root.boxArea.height(d));
//						}
					}
				};
				/*
				 * floating element
				 * 浮动元素
				 */
				//贴个小图标
				this.addIcon = {
					position: [0, 0],
					width:    20,
					height:   20,
					padding:  [0, 0, 0, 0],
					type:     ["number", "boolen", "pic", "cartogram"]
				};
				/*
				 * shape
				 * 图形
				 */
				this.shape = {
					R:            20,
					fill_color:   "url(#shape-color)",
					stroke_width: 2,
					type:         ["terminal", "change", "decision", "markov", "clone"]
				};
				//terminal node
				this.shape_triangle = {
					type:         "treminal",
					R:            1200,
					fill_color:   this.shape.fill_color,
					stroke_width: this.shape.stroke_width,
					stroke_color: "ff1418"
				};
				//change node
				this.shape_circle = {
					type:         "change",
					R:            800,
					fill_color:   this.shape.fill_color,
					stroke_width: this.shape.stroke_width,
					stroke_color: "08b259"
				};
				//decision node
				this.shape_square = {
					type:         "decision",
					R:            1400,
					fill_color:   this.shape.fill_color,
					stroke_width: this.shape.stroke_width,
					stroke_color: "006fbd"
				};
				/*
				 * text area associated with position calculation of decision tree
				 * 与决策树位置计算相关的文字显示区域
				 */
				//终结节点文字显示区域
				this.endArea = {
					width:          150,
					height:         20,
					areaStyle:      this.areaStyle,
					borderStyle:    this.borderStyle,
					textStyle:      this.textStyle,
					indicatorStyle: this.indicatorStyle
				};
				//标题显示区域
				this.titleBox = {
					min_width:      150,
					min_height:     24,
					areaStyle:      this.areaStyle,
					borderStyle:    this.borderStyle,
					textStyle:      this.textStyle,
					indicatorStyle: this.indicatorStyle
				};
				this.tipsBox = {
					min_width:      150,
					min_height:     0,
					areaStyle:      this.areaStyle,
					borderStyle:    this.borderStyle,
					textStyle:      this.textStyle,
					indicatorStyle: this.indicatorStyle,
					gettips:        function (d) {
						if (d.tip) {
							h = 40;
							str = d.tip;
						} else {
							h = 0;
							str = "";
						}
						var result = {
							"height":  h,
							"content": str
						};
						return result;
					}
				};
				//信息显示区域
				this.infoBox = {
					min_width:      150,
					min_height:     20,
					lineHeight:     20,
					areaStyle:      this.areaStyle,
					borderStyle:    this.borderStyle,
					textStyle:      this.textStyle,
					indicatorStyle: this.indicatorStyle,
					getinfos:       function (d) {
						var str = "";
						var line_number = 0;
						var traverse = function (obj, name) {
							if (obj) {
								for (var i in obj) {
									line_number++;
									var p = i + "=" + obj[i];
									str += "<p id='" + d.id + "_" + name + "' class='info-box-p'>" + p + "</p>";
								}
							}
						};
						if (root.show_default_info) {
							if (d.prob) {
								str += "<p id='" + d.id + "_prob' class='info-box-p'>" + d.prob + "</p>";
								line_number++;
							}
							traverse(d.variable, "variable");
							traverse(d.tracker, "tracker");
							traverse(d.payoff, "payoff");
						}
						if (root.show_compiled_info) {
							traverse(d.compiled_prob, "compiled_prob");
							traverse(d.compiled_variable, "compiled_variable");
							traverse(d.compiled_tracker, "compiled_tracker");
							traverse(d.compiled_payoff, "compiled_payoff");
						}
						if (root.show_parsed_info) {
							traverse(d.parsed_prob, "parsed_prob");
							traverse(d.parsed_variable, "parsed_variable");
							traverse(d.parsed_tracker, "parsed_tracker");
							traverse(d.parsed_payoff, "parsed_payoff");
						}

						var h = line_number * root.infoBox.lineHeight;

						var result = {
							"height":  h,
							"content": str
						};
						return result;
					}
				};

				//整个文字盒子的显示区域
				this.boxArea = {
					min_width:  200,
					min_height: root.shape.R * 2,
					top:        10,
					left:       10,
					right:      0,
					bottom:     15,
					width:      function (d) { //计算盒模型宽度，由于树是x轴向分级，所以对于树的每个层级而言宽度是一致的
						if (!root.layer_width[d.depth]) {
							console.log(d.depth, "NO layout_width!");
							root.layer_width[d.depth] = root.boxArea.min_width;
						}
						return root.layer_width[d.depth];
					},
					height:     function (d) {//计算盒模型的高度
						var h = root.titleBox.min_height + d.info_height + root.line.stroke_width;
						h = h > root.boxArea.min_height ? h : root.boxArea.min_height;
						return h + root.boxArea.bottom;
					}
				};
				/*
				 * the final display area of decision tree
				 * 最终的图形显示区域
				 */
				//决策树模型的位置
				this.svg = {
					width:  8000,
					height: 6000
				}
				this.treeArea = {
					top:  25,
					left: 10
				}
				//数轴的位置
				this.axisArea = {
					top:  20,
					left: root.treeArea.left
				}
				//数轴上滑块的大小
				this.axisSlider = {
					width:  8,
					height: 15
				}
			};//end of defaultOption


			/*
			 * @name: setData
			 * @description: Data interface function, visualization will be changed when data or option has changed
			 * 			     数据接口函数，接收数据模型和用户参数，开启可视化进程
			 * @param {Object} data model of decision tree.
			 * @param {Object} user preferences.
			 */
			var setData = function (_data, _option) {
				if (!_data) {
					console.log("dtree is no data!");
					return;
				}
				if (!_option) {
					console.log("dtree is no set option!");
					_option = {};
				}
				var data = _data;
				var config = new defaultOption();
				config = angular.extend(config, _option);
				console.log(config);
				visualize(data, config);
			};

			function visualize(root, config) {
				/*
				 * 全局事件和全局变量
				 */
				var CUT_CACHE = null; //剪切时缓存当前节点（的一个引用）
				var CONTEXTMENU_CACHE = null; //右键点击时保存当前节点（的一个引用）
				//来自superformula的预定义图形数值
				var square = d3.superformula()
					.type("square")
					.size(config.shape_square.R)
					.segments(360);
				var circle = d3.superformula()
					.type("circle")
					.size(config.shape_circle.R)
					.segments(360);
				var triangle = d3.superformula()
					.type("triangle")
					.size(config.shape_triangle.R)
					.segments(360);

				/*
				 * 交互方法
				 */
				function nodeClickStyle(d) {
					console.log(d);
					d3.event.preventDefault();
					d3.selectAll(".node-shape")
						.style("stroke-width", config.shape.stroke_width)
						.style("fill", "#fff");
					d3.select("#nodeshape-" + d.id)
						.style("stroke-width", config.shape.stroke_width * 1.5)
						.style("fill", config.shape.fill_color);

					d3.selectAll(".link")
						.style("stroke-width", config.line.stroke_width)
						.style("stroke", config.line.stroke_color);
					d3.select("#link-" + d.id)
						.style("stroke-width", config.line.stroke_width * 1.5)
						.style("stroke", "#545454");
				}

				/*
				 * @name: changeNodeTitle
				 * @todo: 使用了jquery
				 * @description:
				 * 			     左键单击titlebox，显示输入框，可以更改titlebox文字，结果会反馈到d.name上
				 * @param: {object}: d3 tree node
				 * @param: {dom}: the dom of titlebox
				 */
				function changeNodeTitle(d, titlebox) {
					var finish = function () {
						d.name = $input.val();
						var p = "<p class='title-box-p'>" + d.name + "</p>";
						$(titlebox).children().replaceWith(p);
					}
					var $input;
					if (d.name) {
						$input = $('<input type="text" class="title-box-input" value="' + d.name + '">');
					} else {
						$input = $('<input type="text" class="title-box-input">');
					}
					$(titlebox).children(".title-box-p").replaceWith($input);
					$input.focus().blur(finish);
					$input.keydown(function (event) {
						if (event.keyCode === 13) {
							finish();
						}
					})
				}

				/*
				 * @name: highlightInfoBox
				 * @todo: 使用了jquery
				 * @description: highlight the p of infobox when it has been clicked
				 * 			     左键单机Infobox的某行，高亮该行
				 * @param: {dom}: the dom of infobox-p
				 */
				function highlightInfoBox(p) {
					//d3.select(this).classed("selected", true);
					$(p).toggleClass("selected");
				}

				/*
				 * @name: insertNode
				 * @description: create child nodes
				 * 			     添加子节点
				 * @param: {object}: d3 tree node
				 * @param: {string}: node type, e.g. decision, change(prob), terminal
				 * @param: {number=} the number of nodes which will insert
				 */
				function insertNode(d, type, number) {
					type = type || "change";
					number = number || 1;
					for (var i = 0; i < number; i++) {
						var newnode = {
							//basic info
							"id":                ++config._maxId,
							"name":              null,
							"type":              type,
							"prob":              null,
							"markov_info":       null,
							//parameter list
							"variable":          null,
							"tracker":           null,
							"payoff":            null,
							//compiled parameter values
							"compiled_prob":     null,
							"compiled_variable": null,
							"compiled_tracker":  null,
							"compiled_payoff":   null,
							//parsed parameter values
							"parsed_prob":       null,
							"parsed_variable":   null,
							"parsed_tracker":    null,
							"parsed_payoff":     null,
							//children
							"children":          [],
							"_children":         []
						}
						d.children.push(newnode);
					}
					update(d);
				}

				/*
				 * @name: quickInsertNode
				 * @description: Quickly create child nodes, always when dblclick a non-terminal node
				 * 			     快速创建子节点, 通常是双击非终结节点后显示
				 * @param: {object}: d3 tree node
				 */
				function quickInsertNode(d) {
					if (d.type == "terminal")
						return;
					if (d.children && d.children.length > 0) {
						//有子节点，就创建一个新的change节点
						insertNode(d);
					} else {
						//无子节点，就创建两个新的change节点
						insertNode(d, "change", 2);
					}
				}

				function inBoundaries(x, y) {
					return (x >= (0) && x <= (config.svg.width))
						&& (y >= (0) && y <= (config.svg.height));
				}

				/*
				 * @name: dragSlider, dragSliderStart, dragSliderEnd
				 * @description:
				 * 			     拖拽数轴上的滑块，以修改树的某个层次的宽度
				 * @param: {object}: d3 tree node
				 */
				function dragSlider() {
					d3.event.sourceEvent.stopPropagation();
					var x = d3.event.x, // <-C
						y = d3.event.y;
					console.log(x, y);

					if (inBoundaries(x, y)) {
						d3.select(this)
							.attr("transform", function (d) { // <-D
								return "translate(" + x + ", -5)";
							})
						d3.select(".helpline")
							.attr("transform", function (d) { // <-D
								return "translate(" + (x + config.treeArea.left + config.axisSlider.width / 2) + ", 0)";
							})
							.style("stroke-opacity", "0.8");
					}
				}

				function dragSliderStart() {
					d3.event.sourceEvent.stopPropagation();
					var str = d3.select(this).attr("transform");
					var x = str.split("(")[1].split(",")[0];

					d3.select(".axisArea").selectAll("path")
						.style("stroke-opacity", "0.8");
					d3.select(".axisArea").selectAll("line")
						.style("stroke-opacity", "0.8");
					d3.select(".axisArea").selectAll("text")
						.style("opacity", "0.8");

					d3.select(".helpline")
						.attr("transform", function () { // <-D
							return "translate(" + (x + config.treeArea.left + config.axisSlider.width / 2) + ", 0)";
						})
						.style("stroke-opacity", "0.8");
				}

				function dragSliderEnd(d) {
					d3.event.sourceEvent.stopPropagation();
					d3.select(".helpline")
						.style("stroke-opacity", "0.0");
					var str = d3.select(".helpline").attr("transform"),
						x = str.split("(")[1].split(",")[0];
					x = x > config.svg.width ? 0 : x; //为了避免0移动导致的极大值bug
					var i = _.indexOf(config.axis_x.nodes, d),
						offset = x - config.axis_x.nodes[i],
						newWidth = config.layer_width[i] + offset;

					newWidth = newWidth > config.boxArea.min_width ? newWidth : config.boxArea.min_width;

					config.layer_width[i] = newWidth;

					config.axis_x.nodes[0] = config.layer_width[0];
					for (var j = 1; j < config.axis_x.nodes.length; j++) {
						config.axis_x.nodes[j] = config.axis_x.nodes[j - 1] + config.layer_width[j];
					}

					d3.select(".axisArea").selectAll("path")
						.style("stroke-opacity", "0.2");
					d3.select(".axisArea").selectAll("line")
						.style("stroke-opacity", "0.2");
					d3.select(".axisArea").selectAll("text")
						.style("opacity", "0.2");

					d3.selectAll(".slider")
						.data(config.axis_x.nodes)
						.transition()
						.duration(config.anime.duration)
						.attr("transform", function (d) {
							return "translate(" + (d - config.axisSlider.width / 2) + "," + (-5) + ")";
						})
					update(root);
				}

				/*
				 * @name: toggleChildren
				 * @description: toggle children of the node
				 * 			     收放子节点
				 * @param: {object}: d3 tree node
				 */
				function toggleChildren(d) {
					if (d.children) {
						$(this).html('<span class="glyphicon glyphicon-plus-sign"></span>');
						d._children = d.children;
						d.children = null;
					}
					else {
						$(this).html('<span class="glyphicon glyphicon-minus-sign"></span>');
						d.children = d._children;
						d._children = null;
					}
					update(d);
				}

				/*
				 * @name: changeNodeType
				 * @todo: use undercore
				 * @description: change node type
				 * 			     更改节点类型
				 * @param: {object}: d3 tree node
				 * @param: {string}: type name (it must be defined in the array of config.shape.type)
				 */
				function changeNodeType(d, newtype) {
					console.log(config.shape.type, _.indexOf(config.shape.type, newtype));
					if (_.indexOf(config.shape.type, newtype) > -1) {
						//有子节点的节点不可更改为终结节点
						if ((d.children && d.children.length > 0) || (d._children && d._children.length > 0)) {
							if (newtype == "terminal")
								return;
						}
						d.type = newtype;
						update(d);

						var str = "#nodeshape-" + d.id;
						d3.select(str).style("stroke", function (d) {
							switch (newtype) {
								case "terminal":
									return config.shape_triangle.stroke_color;
								case "change":
									return config.shape_circle.stroke_color;
								case "decision" :
									return config.shape_square.stroke_color;
								default:
									return "hsl(" + Math.random() * 360 + ",100%,50%)";
							}
						})
					}
				}

				/*
				 * @name: contextmenuInit
				 * @todo: use jquery
				 * @description: init the right click contextmenu of dtree nodes
				 * 			     初始化右键菜单
				 * @param: {object}: d3 tree node
				 */
				function contextmenuInit(d) {
					CONTEXTMENU_CACHE = d;
					//首节点不可删除
					if (d == root) {
						$("#delete-node").parent().addClass("disabled");
					} else {
						$("#delete-node").parent().removeClass("disabled");
					}
					//终结节点不可以添加节点
					if (d.type === "terminal") {
						$("#insert-node").parent().addClass("disabled");
						$("#insert-node ~ ul").css("visibility", "hidden");
						$("#paste-node").parent().addClass("disabled");
					} else {
						$("#insert-node").parent().removeClass("disabled");
						$("#insert-node ~ ul").css("visibility", "visible");
						$("#paste-node").parent().removeClass("disabled");
					}
					//有子节点的节点不可更改为终结节点
					if ((d.children && d.children.length > 0) || (d._children && d._children.length > 0)) {
						$("#change-to-terminal-node").parent().addClass("disabled");
					} else {
						$("#change-to-terminal-node").parent().removeClass("disabled");
					}
					//粘贴按钮的出现条件
					if (CUT_CACHE) {
						$("#paste-node").parent().removeClass("disabled");
					} else {
						$("#paste-node").parent().addClass("disabled");
					}
				}

				/*
				 * @name: deleteNode
				 * @description:
				 * 			     删除节点
				 */
				function deleteNode() {
					if (CONTEXTMENU_CACHE) {
						//根节点不可被删除
						if (CONTEXTMENU_CACHE == root)
							return;
						var P = searchParent(root, CONTEXTMENU_CACHE);
						if (P) {
							var index = _.indexOf(P.children, CONTEXTMENU_CACHE);
							P.children.splice(index, 1);
							//删除节点的子节点会附着到其父节点去
							if (CONTEXTMENU_CACHE.children.length > 0) {
								console.log(CONTEXTMENU_CACHE.children);
								P.children = P.children.concat(CONTEXTMENU_CACHE.children);
							}
						}
						update(root);
					}
					return;
				}

				/*
				 * @name: searchParent
				 * @description:
				 * 			     递归查找决策树节点的父节点
				 * @param: {object}: d3 tree node，the entrance node for search
				 * @param: {object}: d3 tree node，the node which need to find parent
				 */
				function searchParent(rootNode, compareNode) {
					var P = null;
					var rootFirstSearach = function (d, node, parent) {
						if (!d) return;
						if (d == node) {
							P = parent;
							return;
						}
						var d_children = d.children && d.children.length > 0 ? d.children : null;
						if (d_children) {
							for (var i = 0; i < d_children.length; i++) {
								rootFirstSearach(d_children[i], node, d);
							}
						}
					}
					rootFirstSearach(rootNode, compareNode);
					return P;
				}

				/*
				 * @name: searchNode
				 * @description:
				 * 			     递归查找此节点
				 * @param: {object}: d3 tree node，the entrance node for search
				 * @param: {object}: d3 tree node，the node which need to find parent
				 */
				function searchNode(rootNode, compareNode) {
					var thisnode = null;
					var rootFirstSearach = function (d, node) {
						if (!d) return;
						if (d == node) {
							thisnode = d;
							return;
						}
						var d_children = d.children && d.children.length > 0 ? d.children : null;
						if (d_children) {
							for (var i = 0; i < d_children.length; i++) {
								rootFirstSearach(d_children[i], node);
							}
						}
					}
					rootFirstSearach(rootNode, compareNode);
					return thisnode;
				}

				/*
				 * @name: zoomed
				 * @description: d3 zoom function, but we only use it for svg area draging
				 * 				 d3的缩放函数，但是我们只用它来做svg视图区域的拖拽
				 *
				 */
				function zoomed() {
					//console.log(d3.event.translate);
					svg_container.attr("transform", "translate(" + d3.event.translate + ")scale(" + config.scale + ")");
					d3.select("div.divs").style({
						"transform":         "translate(" + d3.event.translate[0] + "px," + d3.event.translate[1] + "px)scale(" + config.scale + ")",
						"-webkit-transform": "translate(" + d3.event.translate[0] + "px," + d3.event.translate[1] + "px)scale(" + config.scale + ")",
						"-moz-transform":    "translate(" + d3.event.translate[0] + "px," + d3.event.translate[1] + "px)scale(" + config.scale + ")",
						"-o-transform":      "translate(" + d3.event.translate[0] + "px," + d3.event.translate[1] + "px)scale(" + config.scale + ")",
						"-ms-transform":     "translate(" + d3.event.translate[0] + "px," + d3.event.translate[1] + "px)scale(" + config.scale + ")"
					});
				}

				///////////////////////////////////////////////////////
				///////////////////////////////////////////////////////
				///////////////////////////////////////////////////////

//				//全局zoom行为定义
				var zoom = d3.behavior.zoom()
					.scaleExtent(config.scale_extent)
					.on("zoom", zoomed);
				//拖拽滑块slider行为定义
				var dragslider = d3.behavior.drag()
					.on("drag", dragSlider)
					.on("dragstart", dragSliderStart)
					.on("dragend", dragSliderEnd);


				//右侧画布菜单的事件绑定
				if (config.interface_canvas_option) {
					var coFindRoot = d3.select("#co-find-root")
						.on("click", function () {
							config.scale = 1;
							svg_container.attr("transform", "translate(0,0)scale(" + config.scale + ")");
							divs.style({
								"top":               config.treeArea.top + "px",
								"left":              config.treeArea.left + "px",
								"-webkit-transform": "scale(" + config.scale + ")",
								"-moz-transform":    "scale(" + config.scale + ")",
								"transform":         "scale(" + config.scale + ")",
								"-o-transform":      "scale(" + config.scale + ")",
								"-ms-transform":     "scale(" + config.scale + ")"
							});
						});
					var coZoomIn = d3.select("#co-zoom-in")
						.on("click", function () {
							config.scale += config.scale_offset;
							config.scale = config.scale > config.scale_extent[1] ? config.scale_extent[1] : config.scale;
							console.log(svg_container, config.scale);
							divs.style({
								"top":               config.treeArea.top * config.scale + "px",
								"left":              config.treeArea.left * config.scale + "px",
								"-webkit-transform": "scale(" + config.scale + ")",
								"-moz-transform":    "scale(" + config.scale + ")",
								"transform":         "scale(" + config.scale + ")",
								"-o-transform":      "scale(" + config.scale + ")",
								"-ms-transform":     "scale(" + config.scale + ")"
							});
							svg_container.attr("transform", "scale(" + config.scale + ")");
						});
					var coZoomOut = d3.select("#co-zoom-out")
						.on("click", function () {
							config.scale -= config.scale_offset;
							config.scale = config.scale < config.scale_extent[0] ? config.scale_extent[0] : config.scale;
							divs.style({
								"top":               config.treeArea.top * config.scale + "px",
								"left":              config.treeArea.left * config.scale + "px",
								"-webkit-transform": "scale(" + config.scale + ")",
								"-moz-transform":    "scale(" + config.scale + ")",
								"transform":         "scale(" + config.scale + ")",
								"-o-transform":      "scale(" + config.scale + ")",
								"-ms-transform":     "scale(" + config.scale + ")"
							});
							svg_container.attr("transform", "scale(" + config.scale + ")");
						});
					var coCollapse = d3.select("#co-collapse")
						.on("click", function () {
							update(root);
						});

				}
				//关于右键菜单的事件绑定
				if (config.interface_contextmenu) {
					var insertChangeNodeBind = d3.select("#insert-change-node")
						.on("click", function () {
							if (CONTEXTMENU_CACHE) {
								insertNode(CONTEXTMENU_CACHE, "change");
							}
						});
					var insertTerminalNodeBind = d3.select("#insert-terminal-node")
						.on("click", function () {
							if (CONTEXTMENU_CACHE) {
								insertNode(CONTEXTMENU_CACHE, "terminal");
							}
						});
					var insertDecisionNodeBind = d3.select("#insert-decision-node")
						.on("click", function () {
							if (CONTEXTMENU_CACHE) {
								insertNode(CONTEXTMENU_CACHE, "decision");
							}
						});
					var changeToChangeNodeBind = d3.select("#change-to-change-node")
						.on("click", function () {
							changeNodeType(CONTEXTMENU_CACHE, "change");
						});
					var changeToTerminalNodeBind = d3.select("#change-to-terminal-node")
						.on("click", function () {
							changeNodeType(CONTEXTMENU_CACHE, "terminal");
						});
					var changeToDecisionNodeBind = d3.select("#change-to-decision-node")
						.on("click", function () {
							changeNodeType(CONTEXTMENU_CACHE, "decision");
						});
					var evaluationDialog = d3.select("#evaluation-node")
						.on("click", dispatch.evaluationDialog);
					var copyNodeBind = d3.select("#copy-node")
						.on("click", function () {
							if (CONTEXTMENU_CACHE)
								CUT_CACHE = CONTEXTMENU_CACHE;
						});
					var cutNodeBind = d3.select("#cut-node")
						.on("click", function () {
							if (CONTEXTMENU_CACHE)
								CUT_CACHE = CONTEXTMENU_CACHE;
							deleteNode();
						});
					var pasteNodeBind = d3.select("#paste-node")
						.on("click", function () {
							if (CUT_CACHE) {
								var newnode = {
									//basic info
									"id":                ++config._maxId,
									"name":              CUT_CACHE.name,
									"type":              CUT_CACHE.type,
									"prob":              CUT_CACHE.prob,
									"markov_info":       CUT_CACHE.markov_info,
									//parameter list
									"variable":          CUT_CACHE.variable,
									"tracker":           CUT_CACHE.tracker,
									"payoff":            CUT_CACHE.payoff,
									//compiled parameter values
									"compiled_prob":     CUT_CACHE.compiled_prob,
									"compiled_variable": CUT_CACHE.compiled_variable,
									"compiled_tracker":  CUT_CACHE.compiled_tracker,
									"compiled_payoff":   CUT_CACHE.compiled_payoff,
									//parsed parameter values
									"parsed_prob":       CUT_CACHE.parsed_prob,
									"parsed_variable":   CUT_CACHE.parsed_variable,
									"parsed_tracker":    CUT_CACHE.parsed_tracker,
									"parsed_payoff":     CUT_CACHE.parsed_payoff,
									//children
									"children":          [],
									"_children":         []
								}
								CONTEXTMENU_CACHE.children.push(newnode);
								console.log(CUT_CACHE.id, config._maxId);
								update(CONTEXTMENU_CACHE);
							}
							return;
						});

					var deleteNodeBind = d3.select("#delete-node")
						.on("click", deleteNode);
				}
				///////////////////////////////////////////////////////
				///////////////////////////////////////////////////////
				///////////////////////////////////////////////////////
				/*
				 * build a tree
				 */
				var scale = d3.scale.linear()
					.domain([0, config.svg.width])
					.range([0, config.svg.width]);

				var axis = d3.svg.axis()
					.scale(scale)
					.orient("top")
					.ticks(80);

				var tree = d3.layout.tree()
					.size([config.svg.height, config.svg.width]);
				// ************** Generate the tree diagram	 *****************
				var divs = d3.select($node).append("div")
						.attr("width", config.svg.width)
						.attr("height", config.svg.height)
						.attr("class", "divs")
						.style({
							"transform":         "scale(" + config.scale + ")",
							"-webkit-transform": "scale(" + config.scale + ")",
							"-moz-transform":    "scale(" + config.scale + ")",
							"-o-transform":      "scale(" + config.scale + ")",
							"-ms-transform":     "scale(" + config.scale + ")",
							"top":               config.treeArea.top + "px",
							"left":              config.treeArea.left + "px"
						})
					;
				var svg = d3.select($node).append("svg:svg")
						.attr("width", config.svg.width)
						.attr("height", config.svg.height)
						.call(zoom)
					;


//				svg.on("mousedown.zoom", null);
//				svg.on("mousemove.zoom", null);
				svg.on("dblclick.zoom", null);
				svg.on("touchstart.zoom", null);
				svg.on("wheel.zoom", null);
				svg.on("mousewheel.zoom", null);
				svg.on("MozMousePixelScroll.zoom", null);
				//zoom作用区域
				var svg_container = svg.append("g")
						.attr("class", "svg-container")
					;
				//axisArea, 数轴显示区域
				var axisArea = svg_container.append("g")
						.attr("class", "axisArea")
						.attr("transform", "translate(" + config.axisArea.left + ", " + config.axisArea.top + ")")
						.call(axis)
					;
				//treeArea, 决策树本体显示区域
				var treeArea = svg_container.append("g")
						.attr("class", "treeArea")
						.attr("transform", "translate(" + config.treeArea.left + ", " + config.treeArea.top + ")")
					;
				//用于帮助显示每层宽度的辅助线
				var helpline = svg_container
					.append("line")
					.attr({
						"class": "helpline",
						"x1":    0,
						"y1":    0,
						"x2":    0,
						"y2":    config.svg.height
					});

				//哥查遍stackoverflow,最后发现d3.js的渐变填充只能这么搞
				var gradient_slider = svg
					.append("linearGradient")
					.attr("y1", 0)
					.attr("y2", 0)
					.attr("x1", "0")
					.attr("x2", "20")
					.attr("id", "slider-color")
					.attr("gradientUnits", "userSpaceOnUse");
				gradient_slider
					.append("stop")
					.attr("offset", "0")
					.attr("stop-color", "#ffffff");
				gradient_slider
					.append("stop")
					.attr("offset", "0.7")
					.attr("stop-color", "#9A9B9B");

				var gradient_shape = svg
					.append("linearGradient")
					.attr("y1", 0)
					.attr("y2", 0)
					.attr("x1", "0")
					.attr("x2", "20")
					.attr("id", "shape-color")
					.attr("gradientUnits", "userSpaceOnUse");
				gradient_shape
					.append("stop")
					.attr("offset", "0")
					.attr("stop-color", "#f6f6f6");
				gradient_shape
					.append("stop")
					.attr("offset", "0.9")
					.attr("stop-color", "#f2f2f2");

				function update(source) {
					/*
					 * @name: positionSet
					 * @description: A recursive helper function for walking through nodes from top downwards;
					 * 			     计算节点位置的迭代函数,属于先根遍历
					 * @param: {node}: the root node of decision tree model
					 */
					var positionSet = function (d) {
						//console.log(d.name, d.id);
						if (!d) return;
						var d_children = d.children && d.children.length > 0 ? d.children : null;
						//计算X轴位置
						config.axis_x.setnode(d);
						d.x = config.axis_x.nodes[d.depth];
						//获取infoBox的高度，该值的变化直接影响节点Y轴位置
						var info = config.infoBox.getinfos(d);
						d.info_content = info["content"];
						d.info_height = info["height"];
						//获取tip高度，该值的变化直接影响节点Y轴位置
						var tip = config.tipsBox.gettips(d);
						d.tip_content = tip["content"];
						d.tip_height = tip["height"];
						d.boxArea_height = config.boxArea.height(d);

						//计算Y轴位置
						if (d_children) {
							//递归
							for (var i = 0; i < d_children.length; i++) {
								positionSet(d_children[i]);
							}
							//中间节点的位置是依赖于其子终结节点，以及它自己的盒模型
							var spacing = (d.children[d.children.length - 1].y - d.children[0].y) > config.boxArea.height(d) ?
								(d.children[d.children.length - 1].y - d.children[0].y)
								:
								config.boxArea.height(d);
							d.y = d.children[0].y + Math.round(spacing / 2);
						} else {
							//没有children，是为终结节点
							config.axis_y.setnode(d);
							d.y = config.axis_y.nodes[config.axis_y.nodes.length - 2] + config.titleBox.min_height + d.tip_height;
							console.log(d.y);

						}
					};


					// Compute the new tree layout.
					var nodes = tree.nodes(root),
						links = tree.links(nodes);
					console.log(links);
					//置空全局变量
					config.axis_x.nodes = [];
					config.axis_y.nodes = [];
					//计算所有节点位置
					positionSet(nodes[0]);
					console.log(config.axis_x.nodes, config.axis_y.nodes);

					// Update the nodes…
					var node = treeArea.selectAll("g.node") //node来画svg图形
						.data(nodes, function (d, i) {
							//config._maxId记录当前ID最大
							if (d.id) {
								if (config._maxId < d.id)
									config._maxId = d.id;
								return d.id;
							} else {
								console.error("there is no id!");
								d.id = i + 1;
								return d.id;
							}
						});
					//Enter Node;
					if (node) {
						var nodeEnter = node.enter().append("g")
								.attr("class", "node")
							;
						//add a line before the root node
						nodeEnter
							.filter(function (d) {
								return d == root ? this : null;
							})
							.append("line")
							.attr({
								"class": "rootlink",
								"x1":    0,
								"y1":    0,
								"x2":    function (d) {
									return -config.boxArea.width(d);
								},
								"y2":    0
							})
							.style({
								"stroke":       config.line.stroke_color,
								"stroke-width": config.line.stroke_width
							})
						;
						//drawing node of shape
						//nodeshape是图形节点
						var nodeshape = nodeEnter.append("g")
								.attr("class", "node-shape-g")
//							.attr("data-toggle", "context")
//							.attr("data-target", "#context-menu") //右键菜单
//							.on('contextmenu', function (d, i) {
//								d3.event.preventDefault();
//								contextmenuInit(d);
//							})
							;

						nodeshape
							.append("svg:path")
							.attr("d", function (d) {
								switch (d.type) {
									case "decision":
										return square();
									case "change":
										return circle();
									case "terminal":
										return triangle();
									default :
										return square();
								}
							})
							.attr("id", function (d) {
								return "nodeshape-" + d.id;
							})
							.attr("transform", function (d) {
								return "rotate(180)";
							})
							.attr("class", "node-shape")
							.style("stroke", function (d) {
								switch (d.type) {
									case "decision":
										return config.shape_square.stroke_color;
									case "change":
										return config.shape_circle.stroke_color;
									case "terminal":
										return config.shape_triangle.stroke_color;
									default :
										return config.shape_square.stroke_color;
								}
							})
							.style("stroke-width", config.shape.stroke_width)
//							.on('click.dispatch', dispatch.nodeClick)
//							.on('click.visualize', nodeClickStyle)
//							.on("dblclick", quickInsertNode);
						;


						/*
						 //绘制每个节点的文字显示区域
						 var textBoxArea = nodeEnter
						 .append("g")
						 .attr("class", "text-box-area");
						 //titleBox
						 if (config.show_title) {
						 textBoxArea
						 .append("foreignObject")
						 .attr({
						 "class":  'title-box',
						 "height": (function (d) {
						 return config.titleBox.min_height;
						 }),
						 "width":  (function (d) {
						 return  config.boxArea.width(d) - 2 * config.shape.R;
						 })
						 })
						 .style({
						 "color":        config.titleBox.textStyle.text_color,
						 "text-align":   config.titleBox.textStyle.text_align,
						 "baseline":     config.titleBox.textStyle.baseline,
						 "font-size":    config.titleBox.textStyle.font_size,
						 "font-weight":  config.titleBox.textStyle.font_weight,
						 "font-family":  config.titleBox.textStyle.font_family,
						 "fill-opacity": config.titleBox.textStyle.fill_opacity
						 })
						 .html(function (d) {
						 if (d.name)
						 return "<p class='title-box-p'>" + d.name + "</p>";
						 return "<p class='title-box-p'>...</p>"
						 })
						 .on("click", function (d) {
						 changeNodeTitle(d, this);
						 })
						 ;

						 }
						 //infoBox
						 if (config.show_info) {
						 textBoxArea
						 .append("foreignObject")
						 .attr({
						 "class":  'info-box',
						 "height": (function (d) {
						 return d.info_height;
						 }),
						 "width":  (function (d) {
						 return  config.boxArea.width(d) - 2 * config.shape.R;
						 })
						 })
						 .style({
						 "color":        config.infoBox.textStyle.text_color,
						 "text-align":   config.infoBox.textStyle.text_align,
						 "baseline":     config.infoBox.textStyle.baseline,
						 "font-size":    config.infoBox.textStyle.font_size,
						 "font-weight":  config.infoBox.textStyle.font_weight,
						 "font-family":  config.infoBox.textStyle.font_family,
						 "fill-opacity": config.infoBox.textStyle.fill_opacity
						 })
						 .html(function (d) {
						 return d.info_content;
						 })
						 .selectAll(".info-box-p")
						 .on("click", function () {
						 highlightInfoBox(this);
						 })
						 .on("dblclick", dispatch.infoboxDblclick)
						 ;
						 }
						 }
						 */
					}
					// Update Nodes
					if (node) {
						var nodeUpdate = node
								.transition()
								.duration(config.anime.duration)
								.attr("transform", function (d) {
									return "translate(" + d.x + "," + d.y + ")";
								})
							;

						nodeUpdate.select(".rootlink")
							.attr({
								"x2": function (d) {
									return -config.boxArea.width(d);
								}
							});

						nodeUpdate.select(".node-shape")
							.attr("d", function (d) {
								switch (d.type) {
									case "decision":
										return square();
									case "change":
										return circle();
									case "terminal":
										return triangle();
									default :
										return square();
								}
							})
							.attr("transform", function (d) {
								return "rotate(180)";
							})
							.style("stroke-width", config.shape.stroke_width)
							.style("fill", function (d) {
								if (d._children && d._children.length) {
									switch (d.type) {
										case "decision":
											return "lightsteelblue";
										case "change":
											return "#E0FFE0";
										case "terminal":
											return "lightred";
										default :
											return config.shape.fill_color;
									}
								}
								return config.shape.fill_color;
							});
						;

//						nodeUpdate.select(".title-box")
//							.attr({
//								"x":      function (d) {
//									return -config.boxArea.width(d) + config.shape.R;
//								},
//								"y":      -config.titleBox.min_height - config.line.stroke_width,
//								"height": (function (d) {
//									return config.titleBox.min_height;
//								}),
//								"width":  (function (d) {
//									return  config.boxArea.width(d) - 2 * config.shape.R;
//								})
//							});
//						nodeUpdate.select(".info-box")
//							.attr({
//								"x":      function (d) {
//									return -config.boxArea.width(d) + config.shape.R;
//								},
//								"y":      0,
//								"height": (function (d) {
//									return d.info_height;
//								}),
//								"width":  (function (d) {
//									return  config.boxArea.width(d) - 2 * config.shape.R;
//								})
//							});
					}

					// Exit Nodes
					if (node) {
						var nodeExit = node.exit().transition()
							.duration(config.anime.duration)
							.attr("transform", function (d) {
								return "translate(" + source.x + "," + source.y + ")";
							})
							.remove();
//						nodeExit.select(".title-box")
//							.style("fill-opacity", .1);
//						nodeExit.select(".prob-box")
//							.style("fill-opacity", .1);
//						nodeExit.select(".info-box")
//							.style("fill-opacity", .1);
					}


					var nodeDiv = divs.selectAll("div.div-box-area")//nodeDiv来画覆盖在SVG上面的用html写成的描述区域
						.data(nodes, function (d, i) {
							//config._maxId记录当前ID最大
							if (d.id) {
								if (config._maxId < d.id)
									config._maxId = d.id;
								return d.id;
							} else {
								console.error("there is no id!");
								d.id = i + 1;
								return d.id;
							}
						});
					if (nodeDiv) { //enter
						var boxArea = nodeDiv.enter()
							.append("div")
							.attr("class", "div-box-area")
							.attr("id", function (d) {
								return "div-box-area-" + d.id;
							})
							.on("mouseenter", function (d) {
								if(d.children && d.children.length > 0 || d._children && d._children.length > 0 )
									$(this).find(".toggle-children-box").show();
							})
							.on("mouseleave", function () {
								$(this).find(".toggle-children-box").hide();
							});
						boxArea
							.style({"opacity": 		0})
							.transition()
							.duration(config.anime.duration)
							.style({
								"opacity": 		1
							})
						;

						var shapeBox = boxArea.append("div") //图形区域
								.attr("class", "shape-box")
								.style({
									"height": config.shape.R * 2 + "px",
									"width":  config.shape.R * 2 + "px"
								})
								.attr("data-toggle", "context")
								.attr("data-target", "#context-menu")
								.on('contextmenu', function (d, i) {
									d3.event.preventDefault();
									contextmenuInit(d);
								})
								.on('click.dispatch', dispatch.nodeClick)
								.on('click.visualize', nodeClickStyle)
								.on("dblclick", quickInsertNode)
							;
						var toogleChildrenBox = boxArea //收放子节点按钮
								.filter(function (d) {
									return d.type != "terminal";
								})
								.append("div")
								.attr("class", "toggle-children-box")
								.style({
									"top":   config.shape.R * 2.2 + "px",
									"right": config.shape.R * 0.6 + "px",
								})
								.html(function (d) {
									return '<span class="glyphicon glyphicon-minus-sign"></span>';
								})
								.on("click.toggleChildren", toggleChildren)
							;
						if (config.show_title) {
							var titleBox = boxArea.append("div")//title文字区域
									.attr("class", "title-box")
									.style({
										"height":       config.titleBox.min_height,
										"color":        config.titleBox.textStyle.text_color,
										"text-align":   config.titleBox.textStyle.text_align,
										"baseline":     config.titleBox.textStyle.baseline,
										"font-size":    config.titleBox.textStyle.font_size,
										"font-weight":  config.titleBox.textStyle.font_weight,
										"font-family":  config.titleBox.textStyle.font_family,
										"opacity": 		config.titleBox.textStyle.fill_opacity
									})
									.html(function (d) {
										if (d.name)
											return "<p class='title-box-p'>" + d.name + "</p>";
										return "<p class='title-box-p'>...</p>"
									})
									.on("click", function (d) {
										changeNodeTitle(d, this);
									})
								;
						}
						if (config.show_info) {
							var infobox = boxArea.append("div")//info文字区域
									.attr("class", function (d) {
										return d.info_content == "" ? "info-box null" : "info-box";
									})
									.style({
										"height":       (function (d) {
											return d.info_height;
										}),
										"width":        function (d) {
											return  config.boxArea.width(d) - config.shape.R * 2.5 + "px";
										},
										"color":        config.infoBox.textStyle.text_color,
										"text-align":   config.infoBox.textStyle.text_align,
										"baseline":     config.infoBox.textStyle.baseline,
										"font-size":    config.infoBox.textStyle.font_size,
										"font-weight":  config.infoBox.textStyle.font_weight,
										"opacity": 		config.infoBox.textStyle.fill_opacity,
										"font-family":  config.infoBox.textStyle.font_family
									})
									.html(function (d) {
										return d.info_content;
									})
									.selectAll(".info-box-p")
									.on("click", function () {
										highlightInfoBox(this);
									})
									.on("dblclick", dispatch.infoboxDblclick)
								;
						}
					}
					//update nodeDiv
					if (nodeDiv) {
						var nodeDivUpdate = nodeDiv
								.transition()
								.duration(config.anime.duration)
								.style({
									"top":    function (d) {
										return d.y - config.titleBox.min_height + "px";
									},
									"left":   function (d) {
										return d.x - config.boxArea.width(d) + config.shape.R + config.boxArea.left + "px";
									},
									"height": function (d) {
										return config.boxArea.height(d) + "px";
									},
									"width":  function (d) {
										return  config.boxArea.width(d) - config.boxArea.left + "px";
									},
									"opacity": 		1
								})
							;
						nodeDivUpdate.select(".title-box")
							.style({
								"width":  function (d) {
									return  config.boxArea.width(d) - config.shape.R * 2.5 + "px";
								}
							});
						nodeDivUpdate.select(".info-box")
							.style({
								"height": (function (d) {
									return d.info_height;
								}),
								"width":  function (d) {
									return  config.boxArea.width(d) - config.shape.R * 2.5 + "px";
								}
							});
					}
					//exit nodeDiv
					if (nodeDiv) {
						var nodeDivExit = nodeDiv.exit()
							.transition()
							.duration(config.anime.duration)
							.style({
								"top":    function () {
									return source.y + "px";
								},
								"left":   function () {
									return source.x + "px";
								},
								"height": function () {
									return "0px";
								},
								"width":  function () {
									return  "0px";
								},
								"opacity" : 0
							})
							.remove();
					}


					//define an elbow-shaped line for links
					function elbow(start_x, start_y, end_x, end_y) {
						return "M" + start_x + "," + start_y
							+ "V" + end_y + "H" + end_x;
					};

					//update the links...
					var link = treeArea.selectAll("path.link")
						.data(links, function (d) {
							return d.target.id;
						});
					//link enter;
					link.enter().insert("path", "g")
						.attr("class", "link")
						.attr("id", function (d) {
							return "link-" + d.target.id;
						})
						.attr("d", function () {
							if (source.x0 && source.y0)
								return elbow(source.x0, source.y0, source.x0, source.y0);
						})
						.style("stroke-width", config.line.stroke_width)
						.style("stroke", config.line.stroke_color);

					// Transition links to their new position.
					link.transition()
						.duration(config.anime.duration)
						.attr("d", function (d) {
							return elbow(d.source.x, d.source.y, d.target.x, d.target.y);
						});

					// Transition exiting nodes to the parent's new position.
					link.exit().transition()
						.duration(config.anime.duration)
						.attr("d", function (d) {
							return elbow(source.x, source.y, source.x, source.y);
						})
						.remove();

					if (config.interface_slider) {
						var slider = axisArea.selectAll(".slider")
							.data(config.axis_x.nodes)
							.enter()
							.append("polygon")
							//.attr("points", "10, 15 10, 0 0, 0 0, 15 5, 20")
							.attr("points", "0 0, 8 0, 8 10, 4 15, 0 10")
							.attr("class", "slider gradient-slider")
							.call(dragslider);

						slider.transition()
							.duration(config.anime.duration)
							.attr("transform", function (d) {
								return "translate(" + (d - config.axisSlider.width / 2) + "," + (-5) + ")";
							})
						;
					}

					//Stash the old positions for transition
					nodes.forEach(function (d) {
						d.x0 = d.x;
						d.y0 = d.y;
					});

				};// end of update

				update(root);


			}

			var exports = {
				setData:   setData,
				visualize: visualize
			};

			// rebind event handlers
			d3.rebind(exports, dispatch, 'on');

			return exports;
		};

// return module
		return module;

//---------------------------------------------------
// END code for this module
//---------------------------------------------------
	});