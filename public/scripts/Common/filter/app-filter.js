angular.module('app.filter', [])
    //'reverse', reverse the string
    .filter('instance_status', function() {
        return function(input) {
            var statusList = {
                'active':   '<i class="fa fa-arrows-alt nav-icon"></i>'
                ,'loading':  '<i class="fa fa-arrows-alt nav-icon"></i>'
                ,'danger':  '<i class="fa fa-arrows-alt nav-icon"></i>'
                ,'shutdown':  '<i class="fa fa-arrows-alt nav-icon"></i>'
            }
            return statusList[input] || '';
        }
    })
    .filter('unsafe', function($sce) {
        return function(val) {
            return $sce.trustAsHtml(val);
        };
    })
;
