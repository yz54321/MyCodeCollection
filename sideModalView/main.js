var module=angular.module('app', []);

module.controller('RootController', RootController);
RootController.$inject = ["$scope",'SideModalView'];
function RootController($scope,SideModalView){
    $scope.showInRoot=function(){
            var modal=SideModalView.open({
                                                    parentView:'#wrap',
                                                    width:300,
                                                    templateUrl:'modalTemplate1.html',
                                                    controller:'ModalController',
                                                    scope:$scope
                                            });
    }
        $scope.showInContent=function(){
            var modal=SideModalView.open({
                                                    parentView:'#main',
                                                    width:200,
                                                    templateUrl:'modalTemplate2.html',
                                                    controller:'ModalController',
                                                    scope:$scope
                                            });
    }
}

module.controller('ModalController',ModalController);
ModalController.$inject = ["$scope",'SideModalView'];
function ModalController($scope,SideModalView){
    $scope.showInContent=function(){
            var modal=SideModalView.open({
                                                    parentView:'#main',
                                                    width:400,
                                                    templateUrl:'modalTemplate2.html',
                                                    controller:'ModalController',
                                                    scope:$scope
                                            });
        }
}




/**
 * Created by yz on 2016/6/12.
 *侧边滑出视图
 *  * 通用弹窗组件
 *
 * 使用示例：
 * let modal=SideModalView.open({
                parentView:'#wrap',
                width:400,
                templateUrl:'templates/demo.html',
                controller:'DemoController',
                scope:$scope
            });
 modal.close();//关闭

 //在模板对应controller中关闭
 $scope.$close();
 */
{

    angular
        .module("app")
        .factory("SideModalView", SideModalView)
        .factory('SideModalViewStack',SideModalViewStack)
        .directive('sideview',sideview);

    SideModalView.$inject = ['$rootScope','SideModalViewStack','$http','$q', '$templateCache','$injector','$controller'];
    function SideModalView($rootScope,SideModalViewStack,$http, $q, $templateCache,$injector,$controller) {
        var $slideView = {};
        $slideView.open = function (modalOptions) {
            let getTemplatePromise=function(options) {
                let fromString = function (template) {
                    return angular.isFunction(template) ? template() : template;
                };

                let fromUrl = function (url) {
                    if (angular.isFunction(url)) {
                        url = url();
                    }
                    if (url == null) {
                        return null;
                    }
                    else {
                        return $http.get(url, { cache: $templateCache, headers: { Accept: 'text/html' }})
                            .then(function(response) {
                                return response.data;
                            });
                    }
                };

                var templateStr=angular.isDefined(options.template) ? fromString(options.template) :
                    angular.isDefined(options.templateUrl) ? fromUrl(options.templateUrl) :
                        "";
                return $q.when(templateStr);
            };


            var modalInstance = {
                close: function () {console.log('close');
                    return SideModalViewStack.close(modalInstance);
                }
                // dismiss: function (reason) {
                //     return windowManager.dismiss(modalInstance, reason);
                // },
                // hide:function (result) {
                //     return windowManager.hide(modalInstance, result);
                // },
                // show:function () {
                //     return windowManager.show(modalInstance,modalOpenedDeferred);
                // }
            };


            getTemplatePromise(modalOptions).then(function (tpl) {

                    var modalScope = (modalOptions.scope || $rootScope).$new();
                    modalScope.$close = modalInstance.close;
                    // modalScope.$dismiss = modalInstance.dismiss;
                    let parentView=modalOptions.parentView?modalOptions.parentView:'body';

                    //controllers
                    var ctrlInstance, ctrlLocals = {};

                    if (modalOptions.controller) {
                        ctrlLocals.$scope = modalScope;
                        ctrlLocals.$modalInstance = modalInstance;
                        

                        ctrlInstance = $controller(modalOptions.controller, ctrlLocals);

                    }


                    SideModalViewStack.open(modalInstance, {
                        parentSelector:parentView,
                        scope: modalScope,
                        content: tpl,
                        width:modalOptions.width,

                        animation: modalOptions.animation,
                        backdrop: modalOptions.backdrop,
                        keyboard: modalOptions.keyboard,
                        backdropClass: modalOptions.backdropClass,
                        windowTopClass: modalOptions.windowTopClass,
                        windowClass: modalOptions.windowClass,
                        windowTemplateUrl: modalOptions.windowTemplateUrl,
                        openedClass: modalOptions.openedClass

                    });
                }

            );


            return modalInstance;
        };
        return $slideView;
    }

    SideModalViewStack.$inject = ['$rootScope','$compile','$timeout','$q'];
    function SideModalViewStack($rootScope,$compile,$timeout,$q){

                var animating=false;

        var windowManager={
            stack:[],
            getPrevTop:function(instance){
                for(let i=windowManager.stack.indexOf(instance)-1;i>=0;i--){
                    if(windowManager.stack[i].parentSelector===instance.parentSelector){
                                            console.log(i);
                        return windowManager.stack[i];
                    }
                }
                return null;
            }
        };
        windowManager.open= function (instance,modalOptions) {
                    if(animating){
                        console.log('正在执行动画，请稍候再操作');
                        return;
                    }
                    
                    animating=true;
                    
            instance.containerWidth=modalOptions.width;
            instance.parentSelector=modalOptions.parentSelector;

            var parentEle = document.querySelectorAll(modalOptions.parentSelector)[0];

            var modalScope = (modalOptions.scope || $rootScope).$new();

            var angularDomEl = angular.element('<sideView style="">sideView</sideView>');
            angularDomEl.attr({
                'close':"close()",
                'container_width':modalOptions.width,
                'ng-init':'onLoad()'
            }).html(modalOptions.content);

            modalScope.close=function(){
                windowManager.close(instance)
            }
            var modalDomEl = $compile(angularDomEl)(modalScope);

            instance.modalDomEl=modalDomEl;
            instance.modalScope=modalScope;


            windowManager.stack.push(instance);
            angular.element(parentEle).append(modalDomEl);


            modalScope.onLoad=function(){
                            console.log('onLoad');
                $timeout(function(){
                    windowManager.transTo(instance,'center');
                                    
                    /*if(windowManager.getPrevTop(instance)){
                        windowManager.transTo(windowManager.getPrevTop(instance),'left');
                    }*/
                                    
                                    
                                    var curIns=windowManager.getPrevTop(instance);
                                    var countWidth=instance.containerWidth;
                                    for(var i=0;i<10&&curIns;i++){
                                        countWidth+=curIns.containerWidth;
                                        windowManager.transTo(curIns,'left',countWidth);
                                        curIns=windowManager.getPrevTop(curIns);
                                    }
                },0);

            };
        };

        windowManager.transTo=function(instance,state,distanceForLeft){console.log('transTo'+state+':'+instance.parentSelector)
            function whichTransitionEvent(){
                var t;
                var el = document.createElement('fakeelement');
                var transitions = {
                    'transition':'transitionend',
                    'OTransition':'oTransitionEnd',
                    'MozTransition':'transitionend',
                    'WebkitTransition':'webkitTransitionEnd',
                    'MsTransition':'msTransitionEnd'
                }

                for(t in transitions){
                    if( el.style[t] !== undefined ){
                                            //console.log( transitions[t]);
                        return transitions[t];
                    }
                }
            }


            /* 监听 transition! */
            var transitionEvent = whichTransitionEvent();

            var deferred = $q.defer();
            let containerEle=instance.modalDomEl[0];//.find('div')[1];
 //console.log(containerEle);

            let transitionEnd = function(e) {
                // console.log('transitionEnd:')
                // console.log(e.target)
                // console.log(e.propertyName)
                if(e.target===containerEle&&e.propertyName==='transform') {
                    // console.log(e)
                    // console.log(state);
                    deferred.resolve({
                        instance: instance,
                        state: state
                    });
                                    
                    containerEle.removeEventListener(transitionEvent, transitionEnd);
                }
                            
                            animating=false;
            };
            transitionEvent && containerEle.addEventListener(transitionEvent, transitionEnd);
            if(state === 'left'){
                            console.log(distanceForLeft);
                            if(distanceForLeft&&distanceForLeft<containerEle.offsetWidth){
                                containerEle.style.transform='translateX(-'+distanceForLeft+'px)';
                            }else{
                                containerEle.style.transform="translateX(-100%)";
                            }
                            
                
            }else if(state === 'center'){
                containerEle.style.transform='translateX(-'+instance.containerWidth+'px)';
            }else if(state === 'right'){
                containerEle.style.transform="translateX(0)";
            }
            return deferred.promise;
        };

        windowManager.close =function(instance) {
                    
                    if(animating){
                        console.log('正在执行动画，请稍候再操作');
                        return;
                    }
                    animating=true;
                    
                    console.log(instance);
                                                                                                 
                        //console.log(windowManager.transTo(instance,'right'))                                                                       
            windowManager.transTo(instance,'right').then(function(){
                instance.modalDomEl.remove();
                instance.modalScope.$destroy();
            });
                    
                    
                    var curIns=windowManager.getPrevTop(instance);
                    if(curIns) {
                windowManager.transTo(curIns, 'center');
            }
                    
                    
                    
                                    var countWidth=0;
                    
                    for(var i=0;i<10&&curIns;i++){
                        windowManager.transTo(curIns,'left',countWidth+curIns.containerWidth);
                                        countWidth+=curIns.containerWidth;
                                        curIns=windowManager.getPrevTop(curIns);
                                    }
                    
            
            var index = windowManager.stack.indexOf(instance);
            if (index > -1) {
                windowManager.stack.splice(index, 1);
            }
        };

        return windowManager;
    }


    sideview.$inject = [];
    function sideview() {

        return {
            restrict: 'EA',
            scope: {
                close:'&'
            },
            replace: true,
            transclude: true,
            templateUrl: 'sideModalView.html',
            link: function(scope, element, attrs) {
                scope.containerStyle='';
                if(attrs.containerWidth){
                    scope.containerStyle+='width:'+attrs.containerWidth+'px;';
                }

            }
        };
    }
}