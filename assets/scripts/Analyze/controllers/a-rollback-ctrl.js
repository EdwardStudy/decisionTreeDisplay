define([
    '../../app',
    'echarts',
    "echarts/chart/line",
    "echarts/chart/bar",
    'd3'
], function(app, ec){
    app.controller('aRollbackCtrl', [
        '$scope',
        '$timeout',
        function($scope, $timeout){
            $scope.testdata = [
                {"profits": 200, "income": 320, "outcome": -120},
                {"profits": 170, "income": 302, "outcome": -132},
                {"profits": 240, "income": 341, "outcome": -101},
                {"profits": 244, "income": 374, "outcome": -134},
                {"profits": 200, "income": 390, "outcome": -190},
                {"profits": 220, "income": 450, "outcome": -230},
                {"profits": 210, "income": 420, "outcome": -210}
            ];

            $scope.dataClearing = function(){
                var testdata_profits = [];
                var testdata_income = [];
                var testdata_outcome = [];
                angular.forEach($scope.testdata, function(obj, i){
                    testdata_profits.push(obj.profits);
                    testdata_income.push(obj.income);
                    testdata_outcome.push(obj.outcome);
                });
                //测试数据
                var defaultOption = {
                    tooltip : {
                        trigger: 'axis',
                        axisPointer : {            // 坐标轴指示器，坐标轴触发有效
                            type : 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
                        }
                    },
                    legend: {
                        data:['利润', '支出', '收入']
                    },
                    toolbox: {
                        show : true,
                        feature : {
                            mark : {show: true},
                            dataView : {show: true, readOnly: false},
                            magicType : {show: true, type: ['line', 'bar']},
                            restore : {show: true},
                            saveAsImage : {show: true}
                        }
                    },
                    calculable : true,
                    xAxis : [
                        {
                            type : 'value'
                        }
                    ],
                    yAxis : [
                        {
                            type : 'category',
                            axisTick : {show: false},
                            data : ['周一','周二','周三','周四','周五','周六','周日']
                        }
                    ],
                    series : [
                        {
                            name:'利润',
                            type:'bar',
                            itemStyle : { normal: {label : {show: true, position: 'inside'}}},
                            data:testdata_profits
                        },
                        {
                            name:'收入',
                            type:'bar',
                            stack: '总量',
                            barWidth : 5,
                            itemStyle: {normal: {
                                label : {show: true}
                            }},
                            data:testdata_income
                        },
                        {
                            name:'支出',
                            type:'bar',
                            stack: '总量',
                            itemStyle: {normal: {
                                label : {show: true, position: 'left'}
                            }},
                            data:testdata_outcome
                        }
                    ]
                };
                return defaultOption;
            }



            //主题相关
            $scope.themes = [
                {name :'macarons'},
                {name :'infographic'},
                {name :'shine'},
                {name :'dark'},
                {name :'blue'},
                {name :'green'},
                {name :'red'},
                {name :'gray'},
                {name :'default'}
            ];
            $scope.selectTheme = $scope.themes[0];
            $scope.curTheme = {};

            //echart基本配置
            var domMain = document.getElementById('graph');  //实际绘图区域
            var domMessage = document.getElementById('wrong-message'); //echart报错提示
            var needRefresh = false;  //动态刷新标志
            var myChart = ec.init(domMain); //echart实例

            //渲染函数 @todo: 未来可能要抽取到factory里
            $scope.refresh = function(option, isBtnRefresh){
                if (isBtnRefresh) {
                    needRefresh = true;
                    if (needRefresh) {
                        myChart.showLoading();
                        $timeout($scope.refresh(option), 500);
                    }
                    return;
                }
                needRefresh = false;
                if (myChart && myChart.dispose) {
                    myChart.dispose();
                }
                myChart = ec.init(domMain, $scope.curTheme);
                window.onresize = myChart.resize;
                myChart.setOption($scope.defaultOption, true);
                domMessage.innerHTML = '';
            };

            //切换主题
            $scope.changeTheme = function(){
                var curTheme;
                myChart.showLoading();
                require(['../lib/echarts-2.0/theme/' + $scope.selectTheme.name], function(tarTheme){
                    $scope.curTheme = tarTheme;
                    $timeout(function(){
                        myChart.hideLoading();
                        myChart.setTheme($scope.curTheme);
                    }, 500);
                })
            }

            //执行函数
            $scope.ajaxChartData = function(){
                myChart.showLoading({
                    text: '正在努力的读取数据中...'    //loading话术
                });

                $timeout(function(){
                    $scope.defaultOption = $scope.dataClearing();
                    $scope.refresh($scope.defaultOption, true);
                    myChart.hideLoading();
                }, 500);
            };

            $scope.ajaxChartData();






            //表相关数据
            $scope.mySelections = [];
            $scope.myData = [];
            $scope.myData = $scope.testdata;
            //demo3, use default width ( no cssClass & width set )
            $scope.angridOptions = {
                angridStyle: "th-list",
                canSelectRows: false,
                multiSelectRows: false, //多选
                displaySelectionCheckbox: false, //不显示多选框
                data: 'myData', //数据输入
                selectedItems: $scope.mySelections, //返回选中对象
                columnDefs: 					 //用一个对象数组定义每一列
                    [
                        { field: 'profits', displayName: '利润', width: '30%', columnTemplete: '<input type="text" ng-model="rowData[colData.field]" class="span1" />'}
                        ,
                        { field: 'income', displayName: '收入', width: '30%', columnTemplete: '<input type="text" ng-model="rowData[colData.field]" class="span1" />'}
                        ,
                        { field: 'outcome', displayName: '支出', width: '30%', columnTemplete: '<input type="text" ng-model="rowData[colData.field]" class="span1" />'}
                    ]
            }


//            $scope.$watch("testdata", function(newValue, oldValue) {
//                console.log(newValue);
//                angular.forEach(newValue, function(obj, i){
//                    console.log(obj);
//                    $scope.testdata_profits = [];
//                    $scope.testdata_profits.push(obj.profits);
//                    $scope.testdata_income = [];
//                    $scope.testdata_income.push(obj.income);
//                    $scope.testdata_outcome = [];
//                    $scope.testdata_outcome.push(obj.outcome);
//                });
//            })




        }
    ]);
});