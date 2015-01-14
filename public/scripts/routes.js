define([], function () {
	return {
		defaultRoutePath: '/signin',
		routes:           {
			'select':           {
				url:          "/select",
				templateUrl:  '/views/v_Common/select-DTree.html',
				dependencies: [
					'Common/controllers/c-select-DTree-ctrl',
					'Common/directives/UIDirective',
					'Common/services/dialog-service'
				]
			},
			'create':           {
				url:          "/creates/:project_id/:project_name",
				templateUrl:  '/views/v_Create/tpl-C.html',
				dependencies: [
					'Create/controllers/c-createTree-ctrl',
					'Create/controllers/c-dialog-ctrl',
					'Create/controllers/c-dialog-ctrl',
					'Create/directives/c-DTree-directive',
					'Create/services/c-DTree-service',
					'Create/services/c-DTree-crud-service',
					'Common/directives/UIDirective',
					'Common/services/dialog-service'
				]
			},
			'fuck':             {
				url:          "/fuck/:project_id/:project_name",
				templateUrl:  '/views/v_Create/tmp-tpl-C.html',
				dependencies: [
					'Create/controllers/tmp-c-createTree-ctrl',
					'Create/directives/tmp-c-DTree-directive',
					'Create/services/c-DTree-service',
					'Common/directives/UIDirective',
					'Common/services/dialog-service'
				]
			},
			'publish':          {
				url:          "/publish",
				templateUrl:  '/views/v_Publish/tpl-P.html',
				dependencies: [
					'Publish/controllers/PublishViewController',
					'Common/directives/barChart-directive',
					'Common/directives/chartForm-directive'
				]
			},
			'history':          {
				url:          "/history",
				templateUrl:  '/views/v_Publish/tpl-H.html',
				dependencies: [
					'Publish/controllers/HistoryViewController',
					'Common/directives/barChart-directive',
					'Common/directives/chartForm-directive'
				]
			},
			'analyze_rollback': {
				url:          "/analyze_rollback",
				templateUrl:  '/views/v_Analyze/tpl-rollback.html',
				dependencies: [
					'Analyze/controllers/a-rollback-ctrl'
				]
			},
			'404':              {
				url:         "/404",
				templateUrl: '/views/v_Common/404.html'
			},
			'lock-screen':      {
				url:         "/lock-screen",
				templateUrl: '/views/v_Common/lock-screen.html'
			},
			'signin':           {
				url:          "/signin",
				noAuth:       true, //该页面不进行用户验证
				templateUrl:  '/views/v_Common/signin.html',
				dependencies: [
					'Common/controllers/signinCtrl'
				]
			},
			'signup':           {
				url:          "/signup",
				noAuth:       true, //该页面不进行用户验证
				templateUrl:  '/views/v_Common/signup.html',
				dependencies: [
					'Common/controllers/signupCtrl'
				]
			},
			'profile':          {
				url:         "/profile",
				templateUrl: '/views/v_Common/profile.html'
			},
			'component':        {
				url:          "/component",
				templateUrl:  '/views/v_Common/component.html',
				dependencies: [
					'Common/controllers/UICtrl',
					'Common/directives/UIDirective',
					'Common/services/UIService'
				]
			},

			'person': {
				noAuth:       true,
				url:         "/about/:person",
				templateUrl: '/views/v_Common/about.html'
			}
		}
	};
});