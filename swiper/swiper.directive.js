/**
 *
 * 基于swiper的angular组件
 *
 * 使用示例
 <swiper-container ng-if="vm.collect.pageImages.length>0" class="image_container" swiper='vm.collect.swiper'
 on-changed="vm.collect.onPageChanged(swiper)">
 <swiper-slide class="image_slide" ng-repeat="page in vm.collect.pageImages">
 <img ng-src='{{page}}'>
 </swiper-slide>
 </swiper-container>
*/
{

    const swiperContainerTemplate='app/directives/swiper/swiperContainerTemplate.html';
    
    angular.module('utilsModule')
        .directive('swiperContainer',swiperContainer)
        .directive('swiperSlide',swiperSlide);

    function createUUID() {
        // http://www.ietf.org/rfc/rfc4122.txt
        var s = [];
        var hexDigits = "0123456789abcdef";
        for (var i = 0; i < 36; i++) {
            s[i] = hexDigits.substr(Math.floor(Math.random() * 0x10), 1);
        }
        s[14] = "4"; // bits 12-15 of the time_hi_and_version field to 0010
        s[19] = hexDigits.substr((s[19] & 0x3) | 0x8, 1); // bits 6-7 of the clock_seq_hi_and_reserved to 01
        s[8] = s[13] = s[18] = s[23] = "-";

        var uuid = s.join("");
        return uuid;
    }

    swiperContainer.$inject=['$timeout'];
    function swiperContainer($timeout) {
        return {
            restrict: 'AE',
            templateUrl:swiperContainerTemplate,
            transclude:true,
            scope: {
                onReady: '&',
                swiper:'=',
                onChanged:'&'
            },
            controller: function($scope, $element, $attrs) {
                
                var uuid = createUUID();

                $scope.swiper_uuid = uuid;


                let params={
                    grabCursor: true,
                    paginationClickable: true,
                    slidesPerView: 'auto',
                    centeredSlides: true,
                    noSwiping : true,
                    noSwipingClass:'no-swiping',
                    onSlideChangeEnd: function(swiper){
                                            if($scope.onChanged){
                                              $scope.onChanged({'swiper':swiper});
                                            }
                                        }
                    
                }

                $timeout(function() {
                    var swiper = null;

                    if (angular.isObject($scope.swiper)) {
                        $scope.swiper = new Swiper($element[0].firstChild, params);
                        swiper = $scope.swiper;
                    } else {
                        swiper = new Swiper($element[0].firstChild, params);
                    }

                    //If specified, calls this function when the swiper object is available
                    if (!angular.isUndefined($scope.onReady)) {
                        $scope.onReady({
                            'swiper': swiper
                        });
                    }
                },200);

            },
            link: function(scope, element, attr) {
                
            }
        };
    }


    swiperSlide.$inject=[];
    function swiperSlide() {
        return {
            require:'^swiperContainer',
            restrict: 'AE',
            template:'<div class="swiper-slide no-swiping" ng-transclude></div>',
            transclude:true,
            replace: true,
            controller: function($scope, $element, $attrs) {
                // $element.addClass('swiper-slide');
            },
            link: function(scope, element, attr,controller) {

            }
        };
    }

}