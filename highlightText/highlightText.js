/**
 * Created by yz on 2017/1/3.
 *
 * 为某标签内的特定文字加上高亮class--highlighted
 */
{
    angular.module('utilsModule')
        .directive('highlightText',highlightText);
    highlightText.$inject=['$timeout'];
    function highlightText($timeout) {
        return {
            restrict: 'A',
            scope: {
                highlightText: '='
            },
            controller: function postLink($scope, $element, $attrs) {
                      if ($scope.highlightText && $scope.highlightText != '') {
                          $timeout(function() {
                              let text = $element.html();
                              text = text.replace(eval('/'+$scope.highlightText+'/g'),
                                  '<span class="highlighted">'+$scope.highlightText+'</span>');
                              $element.html(text);
                          }, 0);
                      }
                  }

        };
    }
}