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
			var dispatch = d3.dispatch(
				'dtreeNodeClick',               //节点选中事件
				'dtreeNodeDelete',              //节点删除事件
				'dtreeNodeRemoveActiveStyle',   //节点清除选中状态事件
				'infoboxPClick',                //infobox单击事件
				'infoboxPDblclick',             //infobox双击事件
				'evaluationDialog',             //激活节点计算对话框
				'dtreePayoffEdit'               //激活payoff编辑对话框
			);
			//预定义绘图对象，一个Dtree module只能有对一对该对象
			var SVG, DIVS;
			//全局变量，用以保存数据
			var DATA, CONFIG;
			//全局可视化对象
			var ViSUALIZATION;


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
				 * fluctuating properties
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
				this.show_title = true;
				this.show_prob = true;
				this.show_info = true;
				this.show_tips = true;
				this.show_endArea = true;

				this.show_indicator = true;
				this.show_default_info = true;
				this.show_compiled_info = true;
				this.show_parsed_info = true;
				this.show_variable = true;
				this.show_tracker = true;
				this.show_payoff = true;
				//其他显示效果
				this.align_endArea = false; //让endArea对齐

				//是否绑定交互
				this.interface_contextmenu = true;    //绑定右键菜单功能
				this.interface_slider = true;         //绑定宽度滑动条功能
				this.interface_canvas_option = true;  //绑定canvas上的竖排按钮功能
				this.interface_zoom = true;           //绑定缩放效果
				/*
				 * 一些用于内部计算的属性
				 */
				this._maxId = 1;//当前最大节点id值（不等于节点个数）
				this.scale = 1;//当前缩放比例
				this.scale_offset = 0.1; //缩放比例的放大缩小偏移值
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
					}
				};
				/*
				 * shape
				 * 图形
				 */
				this.shape = {
					R:    20,
					type: ["terminal", "change", "decision", "markov", "clone"]
				};
				//terminal node
				this.shape_triangle = {
					type: "treminal",
					R:    1200
				};
				//change node
				this.shape_circle = {
					type: "change",
					R:    800
				};
				//decision node
				this.shape_square = {
					type: "decision",
					R:    1400
				};
				/*
				 * text area associated with position calculation of decision tree
				 * 与决策树位置计算相关的文字显示区域
				 */
				//终结节点文字显示区域
				this.endArea = {
					width:     200,
					height:    this.shape.R * 2,
					textStyle: this.textStyle
				};
				//小贴士显示区域
				this.tipBox = {
					min_width:      150,
					min_height:     40,
					padding_top:    10,
					padding_bottom: 0,
					textStyle:      this.textStyle,
					gettips:        function (d) {
						if (d.tip && d.show_tip) {
							h = root.tipBox.min_height + root.tipBox.padding_bottom + root.tipBox.padding_top;
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
				//标题显示区域
				this.titleBox = {
					min_width:      150,
					min_height:     22,
					padding_bottom: 6,
					height:         function () {
						return root.titleBox.min_height + root.titleBox.padding_bottom;
					},
					textStyle:      this.textStyle
				};
				//概率显示区域
				this.probBox = {
					min_width:      150,
					min_height:     22,
					padding_bottom: 6,
					height:         function (d) {
						return d.prob == "" ? root.probBox.padding_bottom : root.probBox.padding_bottom + root.probBox.min_height;
					},
					textStyle:      this.textStyle
				};
				//变量及其他参数显示区域
				this.infoBox = {
					min_width:      150,
					min_height:     22,
					lineHeight:     22,
					padding_bottom: 10,
					bottom:         6,
					textStyle:      this.textStyle,
					getinfos:       function (d) {
						var str = "";
						var p = "";
						var line_number = 0;
						var traverse = function (obj_array, index) {
							if (obj_array.length > 0) {
								//重新排序
								if (index) {
									obj_array = _.sortBy(obj_array, function (item) {
										return item[index];
									});
								}
								//编排文字
								for (var i in obj_array) {
									if (obj_array[i].display) {
										p = obj_array[i].name + " = " + obj_array[i].formula;
										str += "<p class='info-box-p' param_id='" + obj_array[i].param_id + "'>" + p + "</p>";
									} else {
										str += "<p class='info-box-p' param_id='" + obj_array[i].param_id + "'></p>";
									}
									line_number++;
								}
							}
						};
						if (root.show_default_info) {
							traverse(d.redefined_param_array);
						}

						var h = line_number * root.infoBox.lineHeight;
						if (d.type != "terminal")
							h = h > 0 ? h : root.infoBox.min_height;
						h += root.infoBox.padding_bottom;

						var result = {
							"height":  h,
							"content": str
						};
						return result;
					}
				};

				//整个文字盒子的显示区域
				this.boxArea = {
					min_width:   200,
					min_height:  root.shape.R * 2,
					top:         10,
					left:        10,
					right:       0,
					path_height: 2,
					width:       function (d) { //计算盒模型宽度，由于树是x轴向分级，所以对于树的每个层级而言宽度是一致的
						if (!root.layer_width[d.depth]) {
							console.log(d.depth, "NO layout_width! I will use default min_width");
							root.layer_width[d.depth] = root.boxArea.min_width;
						}
						return root.layer_width[d.depth];
					},
					height:      function (d) {//计算盒模型的高度
						var h = root.titleBox.height() + root.probBox.height(d) + d.info_height + root.boxArea.path_height;
						h = d.show_tip && d.show_tip == true ? h + d.tip_height : h;
						h = h > root.boxArea.min_height ? h : root.boxArea.min_height;
						return h;
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
					top:  40,
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
				console.log("dtree.js:setData:_data=", _data);
				if (!_data || _data === undefined) {
					console.log("dtree is no data!");
					return;
				}
				if (!_option) {
					console.log("dtree is no set option!");
					_option = {};
				}
				DATA = _data;
				CONFIG = new defaultOption();
				CONFIG = angular.extend(CONFIG, _option);

				ViSUALIZATION = visualize(DATA, CONFIG);
				ViSUALIZATION.update(DATA);
			};
			/*
			 * @name: updateDTree
			 * @description: Data interface function, visualization will be changed when data or option has changed
			 * 			     按照当前数据重新绘图
			 */
			var updateDTree = function () {
				if (ViSUALIZATION) {
					console.log("dtree --> updateDTree");
					ViSUALIZATION.update(DATA);
				}
			}
			/*
			 * @name: render Canvas
			 * @description: Data interface function, visualization will be changed when data or option has changed
			 * 			     按照当前数据重新绘图
			 */
			var resetDTree = function () {
				ViSUALIZATION = visualize(DATA, CONFIG);
				ViSUALIZATION.update(DATA);
			}
			/*
			 * @name: setData
			 * @description: visualize
			 * 			     绘图函数
			 * @param {Object} data model of decision tree.
			 * @param {Object} user preferences.
			 */
			var visualize = function (root, config) {
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
				/*
				 * @name: addNodeActiveStyle
				 * @description:
				 * 			     给节点绑定active特效（选中效果）
				 * @param: {object}: d3 tree node
				 */
				function addNodeActiveStyle(d) {
					if (d.status.indexOf("active") < 0) {
						d.status += " active";
						update(d);
					}
				}

				/*
				 * @name: removeAllNodesActiveStyle
				 * @description:
				 * 			     取消所有节点的active特效（选中效果）
				 * @param: {object}: d3 tree node
				 */
				function removeAllNodesActiveStyle() {
					var rootFirstSearach = function (d) {
						if (!d) return;
						if (d.status && d.status != "")
							d.status = d.status.replace(" active", "");
						var d_children = getChildren(d);
						if (d_children) {
							for (var i = 0; i < d_children.length; i++) {
								rootFirstSearach(d_children[i]);
							}
						}
					}
					rootFirstSearach(root);
					update(root);
					$($node).find(".info-box-p").removeClass("selected");
					;
					dispatch.dtreeNodeRemoveActiveStyle("dtreeNodeRemoveActiveStyle");
				}

				/*
				 * @name: removeAllNodesActiveStyle
				 * @description:
				 * 			     选中整个以该节点为首的子树
				 * @param: {object}: d3 tree node
				 */
				function selectSubtree(d) {
					removeAllNodesActiveStyle();
					d.subtreeSelect = true;
					var rootFirstSearach = function (d) {
						if (!d) return;
						addNodeActiveStyle(d);
						var d_children = getChildren(d);
						if (d_children) {
							for (var i = 0; i < d_children.length; i++) {
								rootFirstSearach(d_children[i]);
							}
						}
					}
					rootFirstSearach(d);
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
					};
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
					});
				}

				/*
				 * @name: changeNodeProb
				 * @todo: 使用了jquery
				 * @description:
				 * 			     左键单击titlebox，显示输入框，可以更改titlebox文字，结果会反馈到d.name上
				 * @param: {object}: d3 tree node
				 * @param: {dom}: the dom of probbox
				 */
				function changeNodeProb(d, probbox) {
					var finish = function () {
						d.prob = $input.val();
						var p = "<p class='title-box-p'>" + d.prob + "</p>";
						$(probbox).children().replaceWith(p);
					};
					var $input;
					if (d.prob) {
						$input = $('<input type="text" class="title-box-input" value="' + d.prob + '">');
					} else {
						$input = $('<input type="text" class="title-box-input">');
					}
					$(probbox).children(".title-box-p").replaceWith($input);
					$input.focus().blur(finish);
					$input.keydown(function (event) {
						if (event.keyCode === 13) {
							finish();
						}
					});
				}

				/*
				 * @name: changeNodeTip
				 * @todo: 使用了jquery
				 * @description:
				 * 			     左键单击tipbox，显示输入框，可以更改tipbox文字，结果会反馈到d.tip上
				 * @param: {object}: d3 tree node
				 * @param: {dom}: the dom of titlebox
				 */
				function changeNodeTip(d, tipbox) {
					var finish = function () {
						d.tip = $input.val();
						var p = "<p class='tip-box-p'>" + d.tip + "</p>";
						$(tipbox).children().replaceWith(p);
					};
					var $input;
					if (d.tip) {
						$input = $('<input type="text" class="tip-box-input" value="' + d.tip + '">');
					} else {
						$input = $('<input type="text" class="tip-box-input">');
					}
					$(tipbox).children(".tip-box-p").replaceWith($input);
					$input.focus().blur(finish);
					$input.keydown(function (event) {
						if (event.keyCode === 13) {
							finish();
						}
					});
				}

				/*
				 * @name: addTip
				 * @description:
				 * 			     初始化tip
				 * @param: {object}: d3 tree node
				 */
				function addTip(d) {
					d.tip = "click here to change tip";
					d.show_tip = true;
					update(d);
				}

				/*
				 * @name: removeTip
				 * @description:
				 * 			    删除tip
				 * @param: {object}: d3 tree node
				 */
				function removeTip(d) {
					d.tip = null;
					d.show_tip = false;
					update(d);
				}

				/*
				 * @name: highlightInfoBox
				 * @todo: 使用了jquery
				 * @description: highlight the p of infobox when it has been clicked
				 * 			     左键单机Infobox的某行，高亮该行
				 * @param: {dom}: the dom of infobox-p
				 */
				function highlightInfoBox(p) {
					d3.select(p).classed("selected", true);
					//$(p).toggleClass("selected");
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
					console.log("insertNode", d);
					type = type || "change";
					number = number || 1;
					for (var i = 0; i < number; i++) {
						var newnode = {
							//basic info
							"node_id":               ++config._maxId,
							"name":                  null,
							"type":                  type,
							"parent_id":             null,
							"node_path_array":       [],
							"tip":                   "",
							"markov_info":           [],
							"show_child":            true,
							"show_tip":              true,
							"prob":                  "",
							"redefined_param_array": [],
							"tracker_array":         [],
							"payoff_array":          [],
							//children
							"children":              [],
							"_children":             []
						};
						console.log(d);
						if (d.children) {
							d.children.push(newnode);
						} else {
							d._children.push(newnode);
						}

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
					console.log(d);
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
							});
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
						});
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
				 * @name: toggleTips
				 * @description: toggle children of the node
				 * 			     收放
				 * @param: {object}: d3 tree node
				 */
				function toggleTips(d) {
					if (d.show_tip && d.show_tip == true) {
						d.show_tip = false;
					} else {
						d.show_tip = true;
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
						var str = "#nodeshape-" + d.node_id;
						d3.select(str).classed({
							'circle':   d.type == "change" ? true : false,
							'square':   d.type == "decision" ? true : false,
							'triangle': d.type == "terminal" ? true : false
						});
						update(d);
					}
				}

				/*
				 * @name: initNodeContextmenu
				 * @todo: use jquery
				 * @description: init the right click contextmenu of dtree nodes
				 * 			     初始化节点右键菜单
				 * @param: {object}: d3 tree node
				 */
				function initNodeContextmenu(d) {
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
					if (d.tip && d.tip != "") {
						$("#remove-tip").parent().show();
						$("#add-tip").parent().hide();
					} else {
						$("#remove-tip").parent().hide();
						$("#add-tip").parent().show();
					}
				}

				/*
				 * @name: initNodeContextmenu
				 * @todo: use jquery
				 * @description: init the right click contextmenu of dtree nodes
				 * 			     初始化节点右键菜单
				 * @param: {object}: d3 tree node
				 */
				function initEndareaContextmenu(d) {
					CONTEXTMENU_CACHE = d;
					if (config.align_endArea == true) {
						d3.select("#align-payoff").classed("hide", true);
						d3.select("#not-align-payoff").classed("hide", false);
					} else {
						d3.select("#align-payoff").classed("hide", false);
						d3.select("#not-align-payoff").classed("hide", true);
					}
					if (d.status.indexOf("checked") > 0) {
						d3.select("#check-this-path").classed("hide", true);
						d3.select("#uncheck-this-path").classed("hide", false);
					} else {
						d3.select("#check-this-path").classed("hide", false);
						d3.select("#uncheck-this-path").classed("hide", true);
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
							//删除本节点
							var index = _.indexOf(P.children, CONTEXTMENU_CACHE);
							P.children.splice(index, 1);
							//对于子树展开的情况，删除节点的子节点会附着到其父节点去
							if (!CONTEXTMENU_CACHE.subtreeSelect && index > -1) {
								if (CONTEXTMENU_CACHE.children) {
									console.log("concat");
									P.children = P.children.concat(CONTEXTMENU_CACHE.children);
								}
							}
						}
						update(root);
						//发送一个自定义事件给外部
						dispatch.dtreeNodeDelete(CONTEXTMENU_CACHE);
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
						var d_children = getChildren(d);
						if (d_children) {
							for (var i = 0; i < d_children.length; i++) {
								rootFirstSearach(d_children[i], node, d);
							}
						}
					};
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
						var d_children = getChildren(d);
						if (d_children) {
							for (var i = 0; i < d_children.length; i++) {
								rootFirstSearach(d_children[i], node);
							}
						}
					};
					rootFirstSearach(rootNode, compareNode);
					return thisnode;
				}

				/*
				 * @name: initNodeData
				 * @description: init the parameters of node, mainly add node_id and compute maximum id
				 * 			     初始化节点参数，主要是增加id和计算最大ID
				 * @param: {node}: dtree node
				 */
				function initNodeData(d) {
					//初始化ID，同时config._maxId记录当前ID最大
					if (d.node_id) {
						if (config._maxId < d.node_id)
							config._maxId = d.node_id;
					} else {
						console.log("there is no id!");
						d.node_id = config._maxId;
						config._maxId++;
					}

					//获取infoBox的高度，该值的变化直接影响节点Y轴位置
					var info = config.infoBox.getinfos(d);
					d.info_content = info["content"];
					d.info_height = info["height"];
					//获取tip高度，该值的变化直接影响节点Y轴位置
					var tip = config.tipBox.gettips(d);
					d.tip_content = tip["content"];
					d.tip_height = tip["height"];
					//通过infoBox的高度和tip高度计算盒模型的高度
					d.boxArea_height = config.boxArea.height(d);

					d.status = d.status || "";
				}

				/*
				 * @name: positionSet
				 * @description: A recursive helper function for walking through nodes from top downwards;
				 * 			     计算节点位置的迭代函数,属于先根遍历
				 * @param: {node}: the root node of decision tree model
				 */
				var positionSet = function (d) {
					if (!d) return;
					//给节点添加一些属性
					initNodeData(d);

					var d_children = d.children && d.children.length > 0 ? d.children : null;
					//计算X轴位置
					config.axis_x.setnode(d);
					d.x = config.axis_x.nodes[d.depth];
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
						d.y = config.axis_y.nodes[config.axis_y.nodes.length - 2] + config.titleBox.height() + d.tip_height + config.boxArea.path_height;
					}
				};


				function editPayoff(d) {
					dispatch.dtreePayoffEdit(d);
				}

				/*
				 * @name: checkThisPath
				 * @description: check a node's children, both of node.children & node._children
				 * 				 highlight the terminal node and it's ancestors
				 * @param {d} dtree node
				 */
				function checkThisPath(node) {
					var d = node;
					while (d != null) {
						if (d.status.indexOf("checked") < 0)
							d.status = d.status + " checked";
						d = d.parent;
					}
					update(root);
				}

				/*
				 * @name: checkThisPath
				 * @description: check a node's children, both of node.children & node._children
				 * 				 highlight the terminal node and it's ancestors
				 * @param {d} dtree node
				 */
				function uncheckThisPath(node) {
					var d = node;
					while (d != null) {
						d.status = d.status.replace(" checked", "");
						d = d.parent;
					}
					update(root);
				}

				/*
				 * @name: getChildren
				 * @description: check a node's children, both of node.children & node._children
				 * 				 查看dtree
				 * @param {d} dtree node
				 * @return [d_children], a array of children nodes or null
				 */
				function getChildren(d) {
					var d_children = d.children && d.children.length > 0 ? d.children : null;
					d_children = d._children && d._children.length > 0 ? d._children : null || d_children;
					return d_children;
				}

				/*
				 * @name: zoomed
				 * @description: d3 zoom function, but we only use it for svg area draging
				 * 				 d3的缩放函数，但是我们只用它来做svg视图区域的拖拽
				 */
				function zoomed() {
					d3.select(".svg-container").attr("transform", "translate(" + d3.event.translate + ")scale(" + config.scale + ")");
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
					//重定位
					var coFindRoot = d3.select("#co-find-root")
						.on("click", function () {
							config.scale = 1;
							d3.select(".svg-container").attr("transform", "translate(0,0)scale(" + config.scale + ")");
							d3.select("div.divs").style({
								"top":               config.treeArea.top + "px",
								"left":              config.treeArea.left + "px",
								"-webkit-transform": "scale(" + config.scale + ")",
								"-moz-transform":    "scale(" + config.scale + ")",
								"transform":         "scale(" + config.scale + ")",
								"-o-transform":      "scale(" + config.scale + ")",
								"-ms-transform":     "scale(" + config.scale + ")"
							});
							//@TODO use jquery to find parent & scroll
							$($node).parent().scrollTop(0);
							$($node).parent().scrollLeft(0);
						});
					//放大
					var coZoomIn = d3.select("#co-zoom-in")
						.on("click", function () {
							config.scale += config.scale_offset;
							config.scale = config.scale > config.scale_extent[1] ? config.scale_extent[1] : config.scale;
							d3.select(".svg-container").attr("transform", "scale(" + config.scale + ")");
							d3.select("div.divs").style({
								"top":               config.treeArea.top * config.scale + "px",
								"left":              config.treeArea.left * config.scale + "px",
								"-webkit-transform": "scale(" + config.scale + ")",
								"-moz-transform":    "scale(" + config.scale + ")",
								"transform":         "scale(" + config.scale + ")",
								"-o-transform":      "scale(" + config.scale + ")",
								"-ms-transform":     "scale(" + config.scale + ")"
							});
						});
					//缩小
					var coZoomOut = d3.select("#co-zoom-out")
						.on("click", function () {
							config.scale -= config.scale_offset;
							config.scale = config.scale < config.scale_extent[0] ? config.scale_extent[0] : config.scale;
							d3.select("div.divs").style({
								"top":               config.treeArea.top * config.scale + "px",
								"left":              config.treeArea.left * config.scale + "px",
								"-webkit-transform": "scale(" + config.scale + ")",
								"-moz-transform":    "scale(" + config.scale + ")",
								"transform":         "scale(" + config.scale + ")",
								"-o-transform":      "scale(" + config.scale + ")",
								"-ms-transform":     "scale(" + config.scale + ")"
							});
							d3.select(".svg-container").attr("transform", "scale(" + config.scale + ")");
						});
					var coUndo = d3.select("#co-undo")
						.on("click", function () {
							console.log(root);
							update(root);
						})
					//全折叠
					var coCollapse = d3.select("#co-collapse")
						.on("click", function () {
							toggleChildren(root);
						});


				}
				//关于右键菜单的事件绑定
				if (config.interface_contextmenu) {
					var insertNodeBind = d3.select("#insert-node")
						.on("click", function () {
							if (CONTEXTMENU_CACHE) {
								insertNode(CONTEXTMENU_CACHE, "change");
							}
						});
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
					var selectSubtreeBind = d3.select("#select-subtree")
						.on("click", function () {
							selectSubtree(CONTEXTMENU_CACHE);
						});
					var addTipBind = d3.select("#add-tip")
						.on("click", function () {
							addTip(CONTEXTMENU_CACHE);
						});
					var removeTipBind = d3.select("#remove-tip")
						.on("click", function () {
							removeTip(CONTEXTMENU_CACHE);
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
								};
								CONTEXTMENU_CACHE.children.push(newnode);
								console.log(CUT_CACHE.node_id, config._maxId);
								update(CONTEXTMENU_CACHE);
							}
							return;
						});
					var deleteNodeBind = d3.select("#delete-node")
						.on("click", deleteNode);

					var alignPayoffBind = d3.select("#align-payoff")
						.on("click", function () {
							config.align_endArea = true;
							update(root);
						});
					var notAlignPayoffBind = d3.select("#not-align-payoff")
						.on("click", function () {
							config.align_endArea = false;
							update(root);
						});
					var editPayoffBind = d3.select("#edit-payoff")
						.on("click", function () {
							editPayoff(CONTEXTMENU_CACHE);
						});
					var checkThisPathBind = d3.select("#check-this-path")
						.on("click", function () {
							checkThisPath(CONTEXTMENU_CACHE);
						});
					var uncheckThisPathBind = d3.select("#uncheck-this-path")
						.on("click", function () {
							uncheckThisPath(CONTEXTMENU_CACHE);
						});
				}
				///////////////////////////////////////////////////////
				///////////////////////////////////////////////////////
				///////////////////////////////////////////////////////
				/*
				 * build a tree
				 */
				// *********** D3绘图配置参数 ************
				var scale = d3.scale.linear()
					.domain([0, config.svg.width])
					.range([0, config.svg.width]);

				var axis = d3.svg.axis()
					.scale(scale)
					.orient("top")
					.ticks(80);

				var tree = d3.layout.tree()
					.size([config.svg.height, config.svg.width]);

				// ************** 预定义绘图区域	 *****************
				if (SVG || DIVS) {
					SVG.remove();
					DIVS.remove();
				}


				//divs是浮动文字层，负责显示文字信息
				DIVS = d3.select($node).append("div")
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
				//SVG是图形层，负责绘制连接线和各种图形
				SVG = d3.select($node).append("svg:svg")
					.attr("class", "dtree-svg")
					.attr("width", config.svg.width)
					.attr("height", config.svg.height)
				;
				//SVG -> svg-container, zoom作用区域
				var svg_container = SVG.append("g")
						.attr("class", "svg-container")
					;
				//svg-container -> axisArea, 数轴显示区域
				var axisArea = svg_container.append("g")
						.attr("class", "axisArea")
						.attr("transform", "translate(" + config.axisArea.left + ", " + config.axisArea.top + ")")
						.call(axis)
					;
				//svg-container -> treeArea, 决策树本体显示区域
				var treeArea = svg_container.append("g")
						.attr("class", "treeArea")
						.attr("transform", "translate(" + config.treeArea.left + ", " + config.treeArea.top + ")")
					;
				//svg -> helpline 用于帮助显示每层宽度的辅助线
				var helpline = svg_container
					.append("line")
					.attr({
						"class": "helpline",
						"x1":    0,
						"y1":    0,
						"x2":    0,
						"y2":    config.svg.height
					});

				//svg -> 渐变填充
				var gradient_slider = SVG
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

				var gradient_shape = SVG
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
				// ************** end of  预定义绘图区域	 *****************

				//全局效果绑定
				SVG.on("click", function () {
					d3.event.preventDefault();
					if (d3.event.target.className == "shape-box") {
						return;
					}
					removeAllNodesActiveStyle();
				})
				//绑定缩放
				if (config.interface_zoom) {
					SVG.call(zoom);
//					SVG.on("mousedown.zoom", null);
//					SVG.on("mousemove.zoom", null);
					SVG.on("dblclick.zoom", null);
					SVG.on("touchstart.zoom", null);
					SVG.on("wheel.zoom", null);
					SVG.on("mousewheel.zoom", null);
					SVG.on("MozMousePixelScroll.zoom", null);
				}

				//************** 数据更新函数 ******************
				function update(source) {
					//置空全局变量
					config.axis_x.nodes = [];
					config.axis_y.nodes = [];
					//计算所有节点位置
					var nodes = tree.nodes(root);
					positionSet(nodes[0]);
					var links = tree.links(nodes);

					// Update the nodes…
					var node = d3.select($node).select(".treeArea").selectAll("g.node") //node来画svg图形
						.data(nodes, function (d) {
							return d.node_id;
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
								"class": "link",
								"id":    function (d) {
									return "link-" + d.node_id;
								},
								"x1":    0,
								"y1":    0,
								"x2":    function (d) {
									return -config.boxArea.width(d);
								},
								"y2":    0
							})
						;
						if (config.show_endArea) {
							var cable = nodeEnter
								.filter(function (d) {
									return d.type == "terminal"
								})
								.append("line")
								.attr({
									"class": "cable",
									"x1":    config.shape.R,
									"y1":    0,
									"x2":    function (d) {
										return config.axis_x.nodes[config.axis_x.nodes.length - 1] - config.axis_x.nodes[d.depth] + config.shape.R;
									},
									"y2":    0
								});
						}
						//drawing node of shape
						//nodeshape是图形节点
						var nodeshape = nodeEnter
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
									return "nodeshape-" + d.node_id;
								})
								.attr("transform", function (d) {
									return "rotate(180)";
								})
								.attr("class", "node-shape")
							;
						nodeshape
							.attr("transform", function (d) {
								return "translate(" + source.x + "," + source.y + ")";
							})
							.transition()
							.duration(config.anime.duration)
							.attr("transform", function (d) {
								return "translate(" + d.x + "," + d.y + ")";
							})
						;


					}
					// Update Nodes
					if (node) {
						var nodeTransition = node
								.transition()
								.duration(config.anime.duration)
								.attr("transform", function (d) {
									return "translate(" + d.x + "," + d.y + ")";
								})
							;
						node.select(".link")
							.attr("class", function (d) {
								return "link " + d.status;
							});
						nodeTransition.select(".node-shape")
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
						;
						node.select(".node-shape")
							.attr("class", function (d) {
								var str;
								var status = d.status || "";
								switch (d.type) {
									case "decision":
										str = "node-shape square" + status;
										break;
									case "change":
										str = "node-shape circle " + status;
										break;
									case "terminal":
										str = "node-shape triangle" + status;
										break;
									default :
										str = "node-shape " + status;
								}
								return str;
							})
						;
						if (config.show_endArea) {
							nodeTransition.select(".cable")
								.attr({
									"x2": function (d) {
										if (config.align_endArea == true)
											return config.axis_x.nodes[config.axis_x.nodes.length - 1] - config.axis_x.nodes[d.depth] + config.shape.R;
										else {
											return config.shape.R;
										}
									}
								});
							node.select(".cable")
								.attr("class", function (d) {
									return "cable " + d.status;
								})
								.filter(function (d) {
									return d.type != "terminal";
								})
								.remove();

						}
						node.select(".node-shape").classed("collapsed", function (d) {
							return (d._children && d._children.length) ? true : false;
						});


					}
					// Exit Nodes
					if (node) {
						var nodeExit = node.exit().transition()
							.duration(config.anime.duration)
							.attr("transform", function (d) {
								return "translate(" + source.x + "," + source.y + ")";
							})
							.remove();
					}


					//////////nodeDiv/////////////


					var nodeDiv = d3.select($node).select(".divs").selectAll("div.div-box-area")//nodeDiv来画覆盖在SVG上面的用html写成的描述区域
						.data(nodes, function (d) {
							return d.node_id;
						});
					//enter nodeDiv
					if (nodeDiv) { //enter
						var boxArea = nodeDiv.enter()
							.append("div")
							.attr("class", "div-box-area")
							.attr("id", function (d) {
								return "div-box-area-" + d.node_id;
							})
							.on("mouseenter", function (d) {
								if (d.children && d.children.length > 0 || d._children && d._children.length > 0)
									$(this).find(".toggle-children-box").show();
							})
							.on("mouseleave", function () {
								$(this).find(".toggle-children-box").hide();
							});
						boxArea
							.style({"opacity": 0})
							.transition()
							.duration(config.anime.duration)
							.style({
								"opacity": 1
							})
						;

						var shapeBox = boxArea.append("div") //图形区域
								.attr("class", "shape-box")
								.style({
									"right":  "0px",
									"bottom": function (d) {
										return d.info_height + config.probBox.height(d) - config.shape.R + "px";
									},
									"height": config.shape.R * 2 + "px",
									"width":  config.shape.R * 2 + "px"
								})
								.attr("data-toggle", "context")
								.attr("data-target", "#context-menu")
								.on('contextmenu', function (d, i) {
									d3.event.preventDefault();
									initNodeContextmenu(d);
								})
								.on('click.active', function (d) {
									d3.event.preventDefault();
									removeAllNodesActiveStyle();
									addNodeActiveStyle(d);
									dispatch.dtreeNodeClick(d);
								})
								.on("dblclick", function (d) {
									quickInsertNode(d);
								})
							;
						var toogleChildrenBox = boxArea //收放子节点按钮
								.filter(function (d) {
									return d.type != "terminal";
								})
								.append("div")
								.attr("class", "toggle-children-box")
								.style({
									"right":  config.shape.R * 0.6 + "px",
									"bottom": function (d) {
										return d.info_height + config.probBox.height(d) - config.shape.R - 16 + "px";
									}
								})
								.html(function (d) {
									return '<span class="glyphicon glyphicon-minus-sign"></span>';
								})
								.on("click.toggleChildren", toggleChildren)
							;
						if (config.show_tips) {
							var ToggleTipBox = boxArea //收放tip按钮
									.append("div")
									.attr("class", "toggle-tip-box")
									.style({
										"right":   config.shape.R * 0.6 + "px",
										"bottom":  function (d) {
											return d.info_height + config.probBox.height(d) + config.shape.R + 5 + "px";
										},
										"display": function (d) {
											return d.tip && d.tip != "" ? "block" : "none";
										}
									})
									.on("click", toggleTips)
								;
							var tipBox = boxArea //tip区域
									.append("div")
									.attr("class", "tip-box")
									.style({
										"top":         config.tipBox.padding_top + "px",
										"left":        "0px",
										"height":      "0px",
										"width":       "0px",
										"color":       config.tipBox.textStyle.text_color,
										"text-align":  config.tipBox.textStyle.text_align,
										"baseline":    config.tipBox.textStyle.baseline,
										"font-size":   config.tipBox.textStyle.font_size,
										"font-weight": config.tipBox.textStyle.font_weight,
										"font-family": config.tipBox.textStyle.font_family
									})
									.on("click", function (d) {
										changeNodeTip(d, this);
									})
								;
						}
						if (config.show_title) {
							var titleBox = boxArea.append("div")//title文字区域
									.attr("class", "title-box")
									.style({
										"left":        "0px",
										"bottom":      function (d) {
											return  d.info_height + config.probBox.height(d) + "px";
										},
										"height":      config.titleBox.min_height + "px",
										"color":       config.titleBox.textStyle.text_color,
										"text-align":  config.titleBox.textStyle.text_align,
										"baseline":    config.titleBox.textStyle.baseline,
										"font-size":   config.titleBox.textStyle.font_size,
										"font-weight": config.titleBox.textStyle.font_weight,
										"font-family": config.titleBox.textStyle.font_family,
										"opacity":     config.titleBox.textStyle.fill_opacity
									})
									.on("click", function (d) {
										changeNodeTitle(d, this);
									})
								;
						}
						if (config.show_prob) {
							var probBox = boxArea.append("div")//title文字区域
									.attr("class", function (d) {
										return d.prob == "" ? "prob-box null" : "prob-box";
									})
									.style({
										"left":        "0px",
										"bottom":      function (d) {
											return  d.info_height + "px";
										},
										"height":      function (d) {
											return config.probBox.height(d) - config.probBox.padding_bottom + "px";
										},
										"color":       config.probBox.textStyle.text_color,
										"text-align":  config.probBox.textStyle.text_align,
										"baseline":    config.probBox.textStyle.baseline,
										"font-size":   config.probBox.textStyle.font_size,
										"font-weight": config.probBox.textStyle.font_weight,
										"font-family": config.probBox.textStyle.font_family,
										"opacity":     config.probBox.textStyle.fill_opacity
									})
									.on("click", function (d) {
										changeNodeProb(d, this);
									})
								;
						}
						if (config.show_info) {
							var infobox = boxArea.append("div")//info文字区域
								.attr("class", function (d) {
									return d.info_content == "" ? "info-box null" : "info-box";
								})
								.style({
									"left":        "0px",
									"bottom":      config.infoBox.bottom + "px",
									"height":      (function (d) {
										return d.info_height;
									}),
									"width":       function (d) {
										return  config.boxArea.width(d) - config.shape.R * 2.5 + "px";
									},
									"color":       config.infoBox.textStyle.text_color,
									"text-align":  config.infoBox.textStyle.text_align,
									"baseline":    config.infoBox.textStyle.baseline,
									"font-size":   config.infoBox.textStyle.font_size,
									"font-weight": config.infoBox.textStyle.font_weight,
									"opacity":     config.infoBox.textStyle.fill_opacity,
									"font-family": config.infoBox.textStyle.font_family
								})
								.on("click.dispatch", dispatch.dtreeNodeClick);
							;
						}
						if (config.show_endArea) { //endArea区域
							var endArea = boxArea
								.filter(function (d) {
									return d.type == "terminal";
								})
								.append("div")
								.attr("class", "end-area")
								.attr("id", function (d) {
									return "end-area-" + d.node_id;
								})
								.attr("data-toggle", "context")
								.attr("data-target", "#end-area-menu")
								.style({
									"bottom": function (d) {
										return d.info_height + config.probBox.height(d) - config.shape.R + "px";
									},
									"right":  function (d) {
										return config.align_endArea == true ?
											-config.endArea.width - (config.axis_x.nodes[config.axis_x.nodes.length - 1] - config.axis_x.nodes[d.depth]) + "px"
											:
											-config.endArea.width + "px";
									},
									"width":  config.endArea.width + "px",
									"height": config.endArea.height + "px"
								})
								.on("dblclick", editPayoff)
								.on('contextmenu', function (d, i) {
									initEndareaContextmenu(d);
								});
							;
						}
					}
					//update nodeDiv
					if (nodeDiv) {
						var nodeDivUpdate = nodeDiv
								.transition()
								.duration(config.anime.duration)
								.style({
									"top":     function (d) {
										return d.y - config.titleBox.height() - d.tip_height + "px";
									},
									"left":    function (d) {
										return d.x - config.boxArea.width(d) + config.shape.R + config.boxArea.left + "px";
									},
									"height":  function (d) {
										return config.boxArea.height(d) + "px";
									},
									"width":   function (d) {
										return  config.boxArea.width(d) - config.boxArea.left + "px";
									},
									"opacity": 1
								})
							;
						nodeDivUpdate.select(".title-box")
							.style({
								"width": function (d) {
									return  config.boxArea.width(d) - config.shape.R * 2.5 + "px";
								}
							});
						nodeDiv.select(".title-box")
							.html(function (d) {
								if (d.name)
									return "<p class='title-box-p'>" + d.node_id + ":" + d.name + "</p>";
								return "<p class='title-box-p'>...</p>";
							});
						nodeDivUpdate.select(".prob-box")
							.style({
								"width": function (d) {
									return  config.boxArea.width(d) - config.shape.R * 2.5 + "px";
								}
							});
						nodeDiv.select(".prob-box")
							.html(function (d) {
								if (d.prob)
									return "<p class='title-box-p'>" + d.prob + "</p>";
								return "";
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
						nodeDiv.select(".info-box")
							.html(function (d) {
								return d.info_content;
							})
							.selectAll(".info-box-p")
							.on("click.highlightP", function () {
								highlightInfoBox(this);
								dispatch.infoboxPClick(this);
							})
							.on("dblclick.dispatch", function () {
								dispatch.infoboxPDblclick(this);
							})

						;
//						dispatch.on("infoboxPDblclick", function(d){
//							console.log(d);
//						})
						if (config.show_endArea) { //endArea区域
							nodeDivUpdate.select(".end-area")
								.style({
									"right":  function (d) {
										return config.align_endArea == true ?
											-config.endArea.width - (config.axis_x.nodes[config.axis_x.nodes.length - 1] - config.axis_x.nodes[d.depth]) + "px"
											:
											-config.endArea.width + "px";
									},
									"width":  config.endArea.width + "px",
									"height": config.endArea.height + "px"
								})
							;
							nodeDiv.select(".end-area")
								.html(function (d) {
									if (d.name)
										return "<p class='end-area-p'>" + d.name + " payoff</p>";
									return "<p class='end-area-p'>... payoff</p>";
								})
								.filter(function (d) {
									return d.type != "terminal";
								})
								.remove();
						}
						if (config.show_tips) {
							nodeDiv.select(".tip-box")
								.html(function (d) {
									if (d.tip)
										return "<p class='tip-box-p'>" + d.tip + "</p>";
									return "<p class='tip-box-p'>...</p>";
								})
								.filter(function (d) {
									return d.show_tip == true;
								})
								.transition()
								.duration(config.anime.duration)
								.style({
									"height":  (function (d) {
										return d.tip_height - config.tipBox.padding_bottom - config.tipBox.padding_top + "px";
									}),
									"width":   function (d) {
										return  config.boxArea.width(d) - config.shape.R * 2.5 + "px";
									},
									"display": function (d) {
										if (d.tip == "")
											return "none";
										return d.show_tip == true ? "block" : "none";
									}
								})
							;
							nodeDiv.select(".tip-box")
								.filter(function (d) {
									return d.show_tip == false;
								})
								.transition()
								.duration(config.anime.duration)
								.style({
									"height": "0px",
									"width":  "0px"
								})
							;
							nodeDiv.select(".toggle-tip-box")
								.style({
									"display": function (d) {
										return d.tip && d.tip != "" ? "block" : "none";
									}
								})
								.html(function (d) {
									return d.show_tip && d.show_tip == true ?
										'<i class="fa fa-file-text-o"></i>'
										:
										'<i class="fa fa-file-text"></i>'
										;
								})
							;
						}
					}
					//exit nodeDiv
					if (nodeDiv) {
						var nodeDivExit = nodeDiv.exit()
							.transition()
							.duration(config.anime.duration)
							.style({
								"top":     function () {
									return source.y + "px";
								},
								"left":    function () {
									return source.x + "px";
								},
								"height":  function () {
									return "0px";
								},
								"width":   function () {
									return  "0px";
								},
								"opacity": 0
							})
							.remove();
					}


					//define an elbow-shaped line for links
					function elbow(start_x, start_y, end_x, end_y) {
						return "M" + start_x + "," + start_y
							+ "V" + end_y + "H" + end_x;
					};

					//update the links...
					var link = d3.select($node).select(".treeArea").selectAll("path.link")
						.data(links, function (d) {
							return d.target.node_id;
						});
					//link enter;
					link.enter().insert("path", "g")
						.attr("class", "link")
						.attr("id", function (d) {
							return "link-" + d.target.node_id;
						})
						.attr("d", function () {
							if (source.x0 && source.y0)
								return elbow(source.x0, source.y0, source.x0, source.y0);
						})
					;
					// Transition links to their new position.
					link.transition()
						.duration(config.anime.duration)
						.attr("d", function (d) {
							return elbow(d.source.x, d.source.y, d.target.x, d.target.y);
						});
					//change link style
					link.attr("class", function (d) {
						return "link " + d.target.status;
					});


					// Transition exiting nodes to the parent's new position.
					link.exit().transition()
						.duration(config.anime.duration)
						.attr("d", function (d) {
							return elbow(source.x, source.y, source.x, source.y);
						})
						.remove();

					if (config.interface_slider) {
						var slider = d3.select($node).select(".axisArea").selectAll(".slider")
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
				//update(root);

				var exports = {
					update: update
				}
				return exports;
			}

			var exports = {
				setData:     setData,
				resetDTree:  resetDTree,
				visualize:   visualize,
				updateDTree: updateDTree
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