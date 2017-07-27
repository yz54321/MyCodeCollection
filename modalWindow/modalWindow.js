/**
 * Created by yz on 2016/11/7.
 *
 * 通用弹窗组件
 * 
 * 使用示例：
 * let window = ModalWindow.open({
                templateUrl:'app/main/modals/searchModal.html',//弹窗内容模板
                scope:$scope,//父级scope，可用于传入参数
                width:400,
                height:300,
                windowClass:"searchWindow"//整个modal视图的根级标签的样式class
            });
 window.close();//关闭

 //在模板对应controller中关闭
 $scope.$close();
 *
 */

{

    require('./modalWindow.css');
    const modalWindowViewTemplate='app/service/utils/modalWindow/modalWindow.html';

    angular
        .module("utilsModule")
        .factory("ModalWindow", ModalWindow)
        .factory('WindowManager',WindowManager)
        .directive('modalWindowView',modalWindowView);


    ModalWindow.$inject = ['$rootScope','WindowManager','$http','$q', '$templateCache','$injector','$controller'];
    function ModalWindow($rootScope,WindowManager,$http, $q, $templateCache,$injector,$controller) {
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
                    return WindowManager.close(modalInstance);
                }
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


                WindowManager.open(modalInstance, {
                        parentSelector:parentView,
                        scope: modalScope,
                        content: tpl,
                    width:modalOptions.width,
                    height:modalOptions.height,
                    windowClass:modalOptions.windowClass
                        // animation: modalOptions.animation,
                        // backdrop: modalOptions.backdrop,
                        // keyboard: modalOptions.keyboard,
                        // backdropClass: modalOptions.backdropClass,
                        // windowTopClass: modalOptions.windowTopClass,
                        // windowClass: modalOptions.windowClass,
                        // windowTemplateUrl: modalOptions.windowTemplateUrl,
                        // openedClass: modalOptions.openedClass

                    });
                }

            );


            return modalInstance;
        };
        return $slideView;
    }

    WindowManager.$inject = ['$rootScope','$compile','$timeout','$q'];
    function WindowManager($rootScope,$compile,$timeout,$q){



        var windowManager={
            stack:[]
            // getPrevTop:function(instance){
            //     for(let i=windowManager.stack.length-1;i>=0;i--){
            //         if(windowManager.stack[i]!==instance&&windowManager.stack[i].parentSelector===instance.parentSelector){
            //             return windowManager.stack[i];
            //         }
            //     }
            //     return null;
            // }
        };
        windowManager.open= function (instance,modalOptions) {
            instance.containerWidth=modalOptions.width;
            instance.containerHeight=modalOptions.height;
            instance.windowClass=modalOptions.windowClass;
            instance.parentSelector=modalOptions.parentSelector;

            var parentEle = document.querySelectorAll(modalOptions.parentSelector)[0];

            var modalScope = modalOptions.scope;

            var angularDomEl = angular.element('<modal-window-view style="">modalWindowView</modal-window-view>');
            angularDomEl.attr({
                'close':"close()",
                'container_width':modalOptions.width,
                'container_height':modalOptions.height,
                'window_class':modalOptions.windowClass,
                'ng-init':'onLoad()'
            }).html(modalOptions.content);

            modalScope.close=function(){
                windowManager.close(instance)
            };
            var modalDomEl = $compile(angularDomEl)(modalScope);

            instance.modalDomEl=modalDomEl;
            instance.modalScope=modalScope;


            windowManager.stack.push(instance);
            angular.element(parentEle).append(modalDomEl);


            modalScope.onLoad=function(){//console.log('onLoad');
                $timeout(function(){
                    windowManager.animateTo(instance,'show');
                    // if(windowManager.getPrevTop(instance)){
                    //     windowManager.transTo(windowManager.getPrevTop(instance),'left');
                    // }
                },200);

            };
        };

        windowManager.animateTo=function(instance,state){//console.log('transTo'+state+':'+instance.parentSelector)
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
                        return transitions[t];
                    }
                }
            }


            /* 监听 transition! */
            var transitionEvent = whichTransitionEvent();

            var deferred = $q.defer();
            // console.log(instance.modalDomEl);
            let containerEle=instance.modalDomEl.find('div')[1];
            // let containerEle=instance.modalDomEl[0];
            // $document.find();
            // console.log(containerEle);

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
            };
            transitionEvent && containerEle.addEventListener(transitionEvent, transitionEnd);
            if(state === 'show'){
                containerEle.style.transform="translate(-50%,-50%)";
            }else if(state === 'hide'){
                containerEle.style.transform='';
            }
            return deferred.promise;
        };

        windowManager.close =function(instance) {console.log(instance);
            windowManager.animateTo(instance,'hide').then(function(){
                instance.modalDomEl.remove();
                instance.modalScope.$destroy();
            });
            // if(windowManager.getPrevTop(instance)) {
            //     windowManager.transTo(windowManager.getPrevTop(instance), 'center');
            // }
            var index = windowManager.stack.indexOf(instance);
            if (index > -1) {
                windowManager.stack.splice(index, 1);
            }
        };

        return windowManager;
    }


    modalWindowView.$inject = [];
    function modalWindowView() {

        return {
            restrict: 'EA',
            scope: {
                close:'&'
            },
            replace: true,
            transclude: true,
            templateUrl: modalWindowViewTemplate,
            controller: function($scope, $element, $attrs) {
                // console.log($element.height(),$element.innerHeight(),$element.outerHeight());
                // console.log($attrs)
                $scope.containerStyle='';
                if($attrs.containerWidth){
                    $scope.containerStyle+='width:'+$attrs.containerWidth+'px;';
                    // if($attrs.containerWidth<$element.innerWidth()){
                    //     $scope.containerStyle+='left:calc(50% - '+$attrs.containerWidth/2+'px);'
                    // }
                }
                if($attrs.containerHeight){
                    $scope.containerStyle+='height:'+$attrs.containerHeight+'px;';
                    // if($attrs.containerHeight<$element.innerHeight()){
                    //     $scope.containerStyle+='top:calc(50% - '+$attrs.containerHeight/2+'px);'
                    // }
                }
                if($attrs.windowClass){
                    $scope.windowClass=$attrs.windowClass;
                }
            }
        };
    }
}