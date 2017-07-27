/*

用法示例：
let alert=alertControl.show('标题',
                            '内容',
                            [{
                                'title':'按钮1',
                                'class':'blue_btn',
                                'action':function(){
                                    。。。
                                    alert.close();
                                }
                            },{
                                'title':'按钮2',
                                'action':function(){
                                    。。。
                                    alert.close();
                                }
                            }]);
*/

{
    require('./alertControl.css');
    const alertViewTemplate='app/service/utils/alertControl/alertControl.html';

    angular.module("utilsModule")
    .factory("alertControl",  alertControl)
    .directive("alertView",  alertView);
    
    alertControl.$inject = ['$rootScope','$compile'];
    function alertControl($rootScope,$compile) {
    	let collect={
    		'show':show
    	}

    	function show(title,message,buttonObjects){
    		let instance={};

            var parentEle = document.querySelectorAll('body')[0];
            var modalScope = $rootScope.$new();
            // if(buttonObjects.length==0){
            //     buttonObjects.push({
            //         'title':'确定',
            //         'action':function(){
            //             instance.close();
            //         }
            //     })
            // }
            modalScope.buttonObjects=buttonObjects;

            var angularDomEl = angular.element('<alert-view style=""></alert-view>');
            angularDomEl.attr({
                'title':title,
                'message':message,
                'button-objects':'buttonObjects',
                'ng-init':'onLoad()'
            });

            var modalDomEl = $compile(angularDomEl)(modalScope);

            instance.modalDomEl=modalDomEl;
            instance.modalScope=modalScope;

            angular.element(parentEle).append(modalDomEl);


            modalScope.onLoad=function(){//console.log('onLoad');
                // $timeout(function(){
                    // windowManager.animateTo(instance,'show');
                    // if(windowManager.getPrevTop(instance)){
                    //     windowManager.transTo(windowManager.getPrevTop(instance),'left');
                    // }
                // },0);

            };
            instance.close=function(){

                instance.modalDomEl.remove();
                instance.modalScope.$destroy();
                instance=null;
            }

            return instance;
    	}


    	return collect;
    }


    alertView.$inject = [];
    function alertView() {

        return {
            restrict: 'EA',
            scope: {
                'title':'@',
                'message':'@',
                'buttonObjects':'=',
            },
            templateUrl: alertViewTemplate,
            controller: function($scope, $element, $attrs) {
                // console.log($scope.title,$scope.message,$scope.buttonObjects);
            }
        };
    }
}