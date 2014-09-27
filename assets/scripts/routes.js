define([], function()
{
    return {
        defaultRoutePath: '/404',
        routes: {
            '/': {
                templateUrl: '/views/v_Create/tpl-C.html',
                dependencies: [
					'Create/controllers/c-createTree-ctrl',
					'Create/directives/c-DTree-directive',
					'Create/services/c-DTree-service',
					'Common/directives/UIDirective',
					'Common/services/dialog-service'
                ]
            },
            '/create': {
                templateUrl: '/views/v_Create/tpl-C.html',
                dependencies: [
					'Create/controllers/c-createTree-ctrl',
					'Create/directives/c-DTree-directive',
					'Create/services/c-DTree-service',
					'Common/directives/UIDirective',
					'Common/services/dialog-service'
                ]
            },
            '/publish': {
                templateUrl: '/views/v_Publish/tpl-P.html',
                dependencies: [
                    'Publish/controllers/PublishViewController',
                    'Common/directives/barChart-directive',
                    'Common/directives/chartForm-directive'
                ]
            },
            '/history': {
                templateUrl: '/views/v_Publish/tpl-H.html',
                dependencies: [
                    'Publish/controllers/HistoryViewController',
                    'Common/directives/barChart-directive',
                    'Common/directives/chartForm-directive'
                ]
            },

            '/analyze_rollback': {
                templateUrl: '/views/v_Analyze/tpl-rollback.html',
                dependencies: [
                    'Analyze/controllers/a-rollback-ctrl'
                ]
            },
            '/404': {
                templateUrl: '/views/v_Common/404.html'
            },
            '/lock-screen': {
                templateUrl: '/views/v_Common/lock-screen.html'
            },
            '/signin': {
                templateUrl: '/views/v_Common/signin.html'
            },
            '/signup': {
                templateUrl: '/views/v_Common/signup.html'
            },
            '/profile': {
                templateUrl: '/views/v_Common/profile.html'
            },
            '/component': {
                templateUrl: '/views/v_Common/component.html',
                dependencies: [
                    'Common/controllers/UICtrl',
                    'Common/directives/UIDirective',
                    'Common/services/UIService'
                ]
            },

            '/about/:person': {
                templateUrl: '/views/v_Common/about.html'
            }
        }
    };
});