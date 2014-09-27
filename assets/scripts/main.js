require.config({
    baseUrl: '/scripts',
    //路径
    paths: {
		'angular':                '../lib/angular-1.2.17/angular'
        ,'angular_route':         '../lib/angular-1.2.17/angular-route.min'
        ,'angular_animate':       '../lib/angular-1.2.17/angular-animate.min'
        ,'angular_sanitize':      '../lib/angular-1.2.17/angular-sanitize.min'
		,'angular-resource':      '../lib/angular-1.2.17/angular-resource.min'
        ,'angular_ui_bootstrap':  '../lib/angular-ui-bootstrap-0.11.0/ui-bootstrap-tpls-0.11.0'
        ,'angrid':                '../lib/angrid-1.0/angrid'
        ,'jquery':                '../lib/jquery-2.1.1/jquery-2.1.1.min'
        ,'jquery_ui':             '../lib/jquery.ui.1.10.3/jquery-ui-1.10.3.min'
        ,'jquery_layout':         '../lib/jquery.layout.1.3.0/jquery.layout-min.1.3.0'
        ,'jquery_slimscroll':     '../lib/jquery.slimscroll-1.3.1/jquery.slimscroll.min'
        ,'jquery_toastr':         '../lib/toastr/toastr'
        ,'bootstrap_contextmenu': '../lib/bootstrap-contextmenu-0.2.0/bootstrap-contextmenu'

        ,'bootstrap':             '../lib/bootstrap.3.1.1/js/bootstrap.min'

        ,'underscore':            '../lib/underscore-1.6.0/underscore'

        ,'d3' : '../lib/d3/require-d3'
		,'d3.superformula' : '../lib/d3/d3.superformula'

        //echart及其组件
        ,echarts: '../lib/echarts-2.0/echarts-original'
        ,"echarts/chart/line": '../lib/echarts-2.0/echarts-original'
        ,"echarts/chart/bar": '../lib/echarts-2.0/echarts-original'
        ,'echarts/chart/scatter': '../lib/echarts-2.0/echarts-original'
        ,'echarts/chart/k': '../lib/echarts-2.0/echarts-original'
        ,'echarts/chart/pie': '../lib/echarts-2.0/echarts-original'
        ,'echarts/chart/radar': '../lib/echarts-2.0/echarts-original'
        ,'echarts/chart/map': '../lib/echarts-2.0/echarts-original-map'
        ,'echarts/chart/chord': '../lib/echarts-2.0/echarts-original'
        ,'echarts/chart/force': '../lib/echarts-2.0/echarts-original'
        ,zrender: '../lib/zrender-2.0/zrender'
        ,'angular-ui-router':'../js/angular-ui-router.js'
    },
    //依赖关系
	shim: {
		'angular_route':          ['angular']
        ,'angular_animate':       ['angular']
        ,'angular_sanitize':      ['angular']
		,'angular-resource':      ['angular']
        ,'angrid':                ['angular', 'angular_sanitize']
        ,'angular_ui_bootstrap':  ['angular']
		,'bootstrap':             ['jquery']
		,'bootstrap_contextmenu': ['jquery']
        ,'jquery_ui':             ['jquery']
        ,'jquery_layout':         ['jquery', 'jquery_ui']
        ,'jquery_slimscroll':     ['jquery']
        ,'jquery_toastr':         ['jquery']
		,'d3.superformula':       ['d3']
		// app的依赖最为重要，直接决定运行时依赖关系
        ,'app':                   ['angular',
								   'angular_route',
								   'angular_animate',
								   'angular_sanitize',
								   'angular-resource',
								   'angrid',
								   'angular_ui_bootstrap',
								   'underscore']
	}
});

require([
        'app'
        //注意，与jquery相关的依赖不要写在shim里，而应该像下面这样单独require，这样可以避免加载不到
        ,'jquery'
        ,'jquery_layout'
        ,'jquery_slimscroll'
        ,'bootstrap'
        ,'bootstrap_contextmenu'
    ],
    function(app){
        angular.bootstrap(document, ['app']);
    }
);