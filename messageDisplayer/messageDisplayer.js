/**
 * Created by yz on 2017/2/15.
 *
 * 消息滚动展示的组件，可代码控制滚动到指定消息位置
 *
 * 使用说明：
 <message-displayer message-scroll-control="control">
     <message-cell>
         <message-block>
            。。。内容。。。
         </message-block>
         ...若干个<message-block>...
     </message-cell>
     ...若干个<message-cell>...
 </message-displayer>

 * 该指令将对messageScrollControl绑定的变量添加以下方法：
 * scrollToPosition——滚动到指定位置，参数为目标位置与顶部的距离
 * scrollToMessageAtIndex——根据index滚动到指定标签，可传1或2个index，第一个为messageCell的index，第二个为messageBlock的index
 * scrollToBottom——滚到最底
 */
{
    angular.module('utilsModule')
        .directive('messageDisplayer',messageDisplayer)
        .directive('messageCell',messageCell)
        .directive('messageBlock',messageBlock);
    messageDisplayer.$inject=[];
    function messageDisplayer() {
        return {
            restrict: 'AE',
            template:'<div class="message_displayer_wrap" ng-transclude></div>',
            transclude:true,
            scope: {
                messageScrollControl: '='
            },
            controller: function($scope, $element, $attrs) {
                if($scope.messageScrollControl){

                    var collect={
                        'scrollToPosition':scrollToPosition,//滚动到指定位置
                        'scrollToMessageAtIndex':scrollToMessageAtIndex,//根据index滚动到子标签
                        'scrollToBottom':scrollToBottom//滚到最底
                    };
                    $scope.messageScrollControl=collect;

                    //滚动到指定位置
                    function scrollToPosition(position){
                        $element.animate({'scrollTop':position},500);
                    }


                    //根据index滚动到子标签
                    function scrollToMessageAtIndex(cellIndex,blockIndex=0){


                        let targetEle=null;
                        if(cellIndex<0||cellIndex>=$element.find('.md_message_cell').length){

                            return;
                        }
                        let targetCell=$element.find('.md_message_cell').eq(cellIndex).parent();
                        // let targetBlock=targetCell.find('.md_message_block').eq(blockIndex);
                        if(typeof(blockIndex)=="undefined"){
                            targetEle=targetCell;
                        }else if(blockIndex<0||blockIndex>=targetCell.find('.md_message_block').length){
                            console.log('scrollToMessageAtIndex:blockIndex '+blockIndex+' 不存在！');
                            return;
                        }else{
                            targetEle=targetCell.find('.md_message_block').eq(blockIndex).parent();
                        }
                        let height=$element.scrollTop()+(targetEle.offset().top-$element.offset().top)-parseInt($element.css('padding-top'));
                        scrollToPosition(height);

                    }

                    //滚到最底
                    function scrollToBottom(){
                        scrollToPosition($element[0].scrollHeight-$element.outerHeight());
                    }

                }
            }
        };
    }


    messageCell.$inject=[];
    function messageCell() {
        return {
            require:'^messageDisplayer',
            restrict: 'AE',
            template:'<div class="md_message_cell" ng-transclude></div>',
            transclude:true,
            controller: function($scope, $element, $attrs) {

            },
        };
    }

    messageBlock.$inject=[];
    function messageBlock() {
        return {
            require:'^messageCell',
            restrict: 'AE',
            template:'<div class="md_message_block" ng-transclude></div>',
            transclude:true,
            controller: function($scope, $element, $attrs) {

            }
        };
    }
}