/**
 * Created by yz on 2017/3/23.
 *
 *  http请求的service
 *
 *  sendRequest：基本的发起请求的方法，不带successCallback,errorCallback参数则使用默认处理方式，带上则不执行默认处理方法
 * simpleRequest：项目中经常用到的请求方式封装
 * errorManage：默认的错误处理，项目中通用的错误处理代码写在这里，不想用此默认处理的则发请求时带上errorCallback参数
 */
{
    angular
        .module("dataModule")
        .factory("requestHandler", requestHandler);
    requestHandler.$inject = ["$http","utils.constant"];
    function requestHandler($http,constant) {
        let collect={
            'sendRequest':sendRequest,
            'simpleRequest':simpleRequest,
            'errorManage':errorManage
        }

        return collect;

        function sendRequest(method,url, paramData,successCallback,errorCallback){
            // console.log(url);

            let requestConfig = {
                'method': method,
                'url': url+"?rnd="+Math.random(),
                'headers': {
                    'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
                }
            }
            // console.log(paramData)
            if (typeof(paramData) === 'string') {
                requestConfig.data = paramData;
            } else {
                let paramsStr='';
                for(let key in paramData||{}){
                    if(paramsStr!=''){
                        paramsStr=paramsStr+'&';
                    }
                    paramsStr=paramsStr+key+'='+paramData[key];
                }
                requestConfig.data = paramsStr;
            }

            let promise = $http(requestConfig)
                .then(function (response) {
                        let callback=successCallback||function(){};
                        let promise=callback(response);
                        if(typeof(promise)==='undefined'){
                            return response;
                        }else{
                            return promise;
                        }

                    },
                    function (response){
                        // console.log('http error\n',response);
                        let callback=errorCallback||errorManage;
                        let promise=callback(response);
                        if(typeof(promise)==='undefined'){
                            throw response;
                        }else{
                            return promise;
                        }
                    });
            return promise;
        }

        function errorManage(response ){
            console.log("请求失败",response);
            return response;
        }


        function simpleRequest(action, paramData,successCallback,errorCallback) {
            return sendRequest('POST',
                constant.config.sitePath + action,
                paramData,
                successCallback,
                errorCallback);
        }

    }

}