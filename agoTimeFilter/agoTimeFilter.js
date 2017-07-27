/**
 * Created by yz on 2017/7/27.
 * 
 * 把时间转成
 *
 */
{
    angular
        .module('utilsModule')
        .filter('agoTimeFilter', agoTimeFilter);

    function agoTimeFilter() {
        return function (item) {
            if (item === undefined) {
                return;
            }
            let date = new Date(item);
            // console.log(date);
            let now = new Date();

            let digit=parseInt((now.getTime()-date.getTime())/1000);
            let suffix='秒前';
            //let yestoday = new Date().setDate(now.getDate()-1);
            if(digit>=60){
                digit=parseInt(digit/60);
                suffix='分钟前';
                if(digit>=60){
                    digit=parseInt(digit/60);
                    suffix='小时前';

                    if(digit>=24){
                        digit=parseInt(digit/24);
                        suffix='天前';
                        if(digit>=30){
                            digit=parseInt(digit/30);
                            suffix='个月前';
                        }
                    }
                }
            }
            return digit+suffix;
        }
    }



}