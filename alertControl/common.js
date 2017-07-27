/*
使用alertControl实现的alert，prompt，loading

 用法示例：
 let alert=alertControl.show('标题',
 '内容',
 [{
 'title':'按钮1',
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
    angular
        .module("utilsModule")
        .factory("utils.common", common);
    common.$inject = ['alertControl' ,'$timeout'];
    function common(alertControl,$timeout) {
        let loading=null;
        let reuseCount=0;
        let collect={
            'alert':alert,
            'prompt':prompt,
            'loading':{
                'show':showLoading,
                'hide':hideLoading
            },

            'convertDate':convertDate
        }

        function alert( title,content,buttons) {
            let btns=buttons;
            let alert=null;
            if(!btns||typeof(btns)=='undefined'||btns.length==0){
                btns=[{
                    'title':'确定',
                    'action':function(){
                        alert.close();
                    }
                }];
            }
            alert=alertControl.show(title,content,btns);
            return alert;
        }
        function prompt(content){
            let prompt=alertControl.show(null,content);
            $timeout(function () {
                prompt.close();
            }, 1500);
            
        }
        function showLoading(content){
            reuseCount++;
            if(!loading){
                loading=alertControl.show(null,content||'请稍候...');
            }
        }
        function hideLoading(content){
            reuseCount--;
            if(reuseCount==0){
                loading.close();
                loading=null;
            }
        }

        //将年月日时间转成时间
        function convertDate(dateStr){
            return Date.parse(dateStr.replace('年','-').replace('月','-').replace('日',''));
        }
        return collect;
    }
}