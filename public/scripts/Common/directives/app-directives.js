(function() {
    angular.module('app.directives', []).directive('imgHolder', [
        function() {
            return {
                restrict: 'A',
                link: function(scope, ele, attrs) {
                    return Holder.run({
                        images: ele[0]
                    });
                }
            };
        }
    ])
	//背景变换，根据不同的连接更改背景
    .directive('customBackground', function() {
        return {
            restrict: "A",
            controller: [
                '$scope', '$element', '$location', function($scope, $element, $location) {
                    var addBg, path;
                    path = function() {
                        return $location.path();
                    };
                    addBg = function(path) {
                        $element.removeClass('body-home body-special body-tasks body-lock body-select');
                        switch (path) {
                            case '/404':
                            case '/500':
                            case '/signin':
                            case '/signup':
                                return $element.addClass('body-special');
							case '/select':
								return $element.addClass('body-select');
                            case '/lock-screen':
                                return $element.addClass('body-special body-lock');
                            case '/tasks':
                                return $element.addClass('body-tasks');
							default:
								return $element.addClass('body-home');
                        }
                    };
                    addBg($location.path());
                    return $scope.$watch(path, function(newVal, oldVal) {
                        if (newVal === oldVal) {
                            return;
                        }
                        return addBg($location.path());
                    });
                }
            ]
        };
    })
    //修改UI主题样式，即更换全局CSS，实际上没有使用
    .directive('uiColorSwitch', [
        function() {
            return {
                restrict: 'A',
                link: function(scope, ele, attrs) {
                    return ele.find('.color-option').on('click', function(event) {
                        var $this, hrefUrl, style;
                        $this = $(this);
                        hrefUrl = void 0;
                        style = $this.data('style');
                        if (style === 'loulou') {
                            hrefUrl = 'styles/main.css';
                            $('link[href^="styles/main"]').attr('href', hrefUrl);
                        } else if (style) {
                            style = '-' + style;
                            hrefUrl = 'styles/main' + style + '.css';
                            $('link[href^="styles/main"]').attr('href', hrefUrl);
                        } else {
                            return false;
                        }
                        return event.preventDefault();
                    });
                }
            };
        }
    ])
    //收放导航栏
    .directive('toggleMinNav', [
        '$rootScope', function($rootScope) {
            return {
                restrict: 'A',
                link: function(scope, ele, attrs) {
                    var $window, Timer, app, updateClass, icon;
                    app = $('#app');
                    icon = $(ele).find("i:first");
                    $window = $(window);
                    ele.on('click', function(e) {
                        if (app.hasClass('nav-min')) {
                            app.removeClass('nav-min');
                            icon.removeClass('fa-toggle-right').addClass("fa-toggle-left");
                        } else {
                            app.addClass('nav-min');
                            icon.removeClass('fa-toggle-left').addClass("fa-toggle-right");
                            $rootScope.$broadcast('minNav:enabled');
                        }
                        return e.preventDefault();
                    });
                    Timer = void 0;
                    updateClass = function() {
                        var width;
                        width = $window.width();
                        if (width < 768) {
                            return app.removeClass('nav-min');
                        }
                    };
                    return $window.resize(function() {
                        var t;
                        clearTimeout(t);
                        return t = setTimeout(updateClass, 300);
                    });
                }
            };
        }
    ])
    //收放NAV栏内子项
    .directive('collapseNav', [
        function() {
            return {
                restrict: 'A',
                link: function(scope, ele, attrs) {
                    var $a, $aRest, $lists, $listsRest, app;
                    $lists = ele.find('ul').parent('li');
                    $lists.append('<i class="fa fa-caret-right icon-has-ul"></i>');
                    $a = $lists.children('a');
                    $listsRest = ele.children('li').not($lists);
                    $aRest = $listsRest.children('a');
                    app = $('#app');
                    $a.on('click', function(event) {
                        var $parent, $this;
                        if (app.hasClass('nav-min')) {
                            return false;
                        }
                        $this = $(this);
                        $parent = $this.parent('li');
                        $lists.not($parent).removeClass('open').find('ul').slideUp();
                        $parent.toggleClass('open').find('ul').slideToggle();
                        return event.preventDefault();
                    });
                    $aRest.on('click', function(event) {
                        return $lists.removeClass('open').find('ul').slideUp();
                    });
                    return scope.$on('minNav:enabled', function(event) {
                        return $lists.removeClass('open').find('ul').slideUp();
                    });
                }
            };
        }
    ])
    //根据当前链接，高亮导航栏内子项
    .directive('highlightActive', [
        function() {
            return {
                restrict: "A",
                controller: [
                    '$scope', '$element', '$attrs', '$location', function($scope, $element, $attrs, $location) {
                        var highlightActive, links, path;
                        links = $element.find('a');
                        path = function() {
                            return $location.path();
                        };
                        highlightActive = function(links, path) {
                            //path = '#' + path;
                            return angular.forEach(links, function(link) {
                                var $li, $link, href;
                                $link = angular.element(link);
                                $li = $link.parent('li');
                                href = $link.attr('href');
                                if ($li.hasClass('active')) {
                                    $li.removeClass('active');
                                }
                                if (path.indexOf(href) === 0) {
                                    return $li.addClass('active');
                                }
                            });
                        };
                        highlightActive(links, $location.path());
                        return $scope.$watch(path, function(newVal, oldVal) {
                            if (newVal === oldVal) {
                                return;
                            }
                            return highlightActive(links, $location.path());
                        });
                    }
                ]
            };
        }
    ])
    //?
    .directive('toggleOffCanvas', [
        function() {
            return {
                restrict: 'A',
                link: function(scope, ele, attrs) {
                    return ele.on('click', function() {
                        return $('#app').toggleClass('on-canvas');
                    });
                }
            };
        }
    ])
    //?
    .directive('slimScroll', [
        function() {
            return {
                restrict: 'A',
                link: function(scope, ele, attrs) {
                    return ele.slimScroll({
                        height: '100%'
                    });
                }
            };
        }
    ])
    //?
    .directive('goBack', [
        function() {
            return {
                restrict: "A",
                controller: [
                    '$scope', '$element', '$window', function($scope, $element, $window) {
                        return $element.on('click', function() {
                            return $window.history.back();
                        });
                    }
                ]
            };
        }
    ])
    //全屏模式，依赖jquery
    .directive('launchFullScreen', [
        function() {
            return {
                restrict: 'A',
                scope : {element:'@launchFullScreen'},
                link: function(scope, ele) {
                    return ele.on('click', function(event) {
                        var body = $(body);
                        //这里其实做了一个测试，看看有属性requestFullscreen的对象都有谁
                        var element = eval(scope.element);
                        if (!body.hasClass("full-screen")) {
                            body.addClass("full-screen");

                            if (element.requestFullscreen) {
                                element.requestFullscreen();
                            } else if (element.mozRequestFullScreen) {
                                element.mozRequestFullScreen();
                            } else if (element.webkitRequestFullscreen) {
                                element.webkitRequestFullscreen();
                            } else if (element.msRequestFullscreen) {
                                element.msRequestFullscreen();
                            }
                        } else {
                            body.removeClass("full-screen");

                            if (document.exitFullscreen) {
                                document.exitFullscreen();
                            } else if (document.mozCancelFullScreen) {
                                document.mozCancelFullScreen();
                            } else if (document.webkitExitFullscreen) {
                                document.webkitExitFullscreen();
                            }
                        }
                    });
                }
            };
        }
    ])
	//自定义select单项选择器
	.directive('selectList', ['$compile',
		function($compile) {
			return {
				restrict:   'E',
				scope:      {
					array:     "=",
					select:    "=",
					templete:  "="
				},
				replace:    true,
				transclude: true,
				link: function ($scope, $element, $attrs) {
					//一开始默认选中第一个
					$scope.select = $scope.select || $scope.array[0];

					$scope.returnData = function(a){
						$scope.select = a;
					}

					//默认模版
					var defaultTemplete =
							'<div class="well well-lg">'
							+'<div ng-repeat="a in array" ng-click="returnData(a)">{{a.name}}</div>'
							+'</div>';
					var T = $scope.templete ? $scope.templete : defaultTemplete;
					$element.append($compile( T )($scope));
				}
			};
		}
	])
    //jquery layout插件
    .directive('appLayout', [
        function(){
            return function(scope, $element){
                $($element).layout({
                    south__size: 			.40		// percentage size expresses as a decimal
                });
            };
        }
    ])
    //更换create页面中的工作区背景
    .directive('canvasUiSwitch', [
        '$rootScope', function($rootScope) {
            return {
                restrict: 'EA',
                scope: {
                    canvasUiSwitch: "@canvasUiSwitch"
                },
                link: function(scope, ele) {
                    return ele.on('click', function(event) {
                        //把值冒泡传给父作用域
                        scope.$emit("canvasUiSwitch", scope.canvasUiSwitch);
                    });
                }
            };
        }
    ])
    /* factory function safeApply
	 *
	 * @description If you find yourself triggering the '$apply already in progress' error while developing with Angular.JS
	 * (for me I find I hit most often when integrating third party plugins that trigger a lot of DOM events),
	 * you can use a 'safeApply' method that checks the current phase before executing your function.
	 *
	 * @param scope, the action scope, mostly is the topmost controller
	 * @param fn, the function which you want to apply into scope
	 * @see  https://coderwall.com/p/ngisma
	 */
	 .factory('safeApply', function($rootScope) {
		return function(scope, fn) {
			var phase = scope.$root.$$phase;
			if (phase == '$apply' || phase == '$digest') {
				if (fn && ( typeof (fn) === 'function')) {
					fn();
				}
			} else {
				scope.$apply(fn);
			}
		};
	});
}).call(this);

//# sourceMappingURL=directives.js.map
