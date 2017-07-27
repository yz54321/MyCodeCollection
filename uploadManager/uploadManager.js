/**
 * Created by yz on 2017/5/25.

 报修图片上传
 */

{
    angular.module('utilsModule')
        .factory('utils.uploadManager', uploadManager);
    uploadManager.$inject = ['utils.constant','FileUploader'];
    function uploadManager(constant,FileUploader) {
        let collect={
            'init':init,
            'uploader':null,
            'callbackDelegateList':[],
                
        }

        function init(){
            if(collect.uploader){
                return;
            }
            let uploader = collect.uploader=new FileUploader({
                url: constant.config.sitePath+constant.action.repair.uploadPicture,
                
                //alias :'Filedata'
            });

            uploader.filters.push({
                name: 'imageFilter',
                fn: function(item /*{File|FileLikeObject}*/, options) {
                    var type = '|' + item.type.slice(item.type.lastIndexOf('/') + 1) + '|';
                    return '|jpg|png|jpeg|bmp|gif|'.indexOf(type) !== -1;
                }
            });

            // CALLBACKS
            function doCallback(funcName,...args){
                // console.log('doCallback',collect.callbackDelegateList.length);
                for(let i=0;i<collect.callbackDelegateList.length;i++){
                    // console.log(typeof(collect.callbackDelegateList[i].onProgressItem));
                    if(typeof(collect.callbackDelegateList[i][funcName])=='function'){
                        collect.callbackDelegateList[i][funcName](...args);
                    }
                }
            }
            uploader.onWhenAddingFileFailed = function(item /*{File|FileLikeObject}*/, filter, options) {
                // console.info('onWhenAddingFileFailed', item, filter, options);
                doCallback('onWhenAddingFileFailed',item, filter, options);
            };
            uploader.onAfterAddingFile = function(fileItem) {
                // console.info('onAfterAddingFile', fileItem);
                // console.info(uploader.queue);
                fileItem.upload();
                doCallback('onAfterAddingFile',fileItem);
            };
            uploader.onAfterAddingAll = function(addedFileItems) {
                // console.info('onAfterAddingAll', addedFileItems);
            };
            uploader.onBeforeUploadItem = function(item) {
                // console.info('onBeforeUploadItem', item);
            };
            uploader.onProgressItem = function(fileItem, progress) {
                // console.info('onProgressItem', fileItem, progress);
                //doCallback('onProgressItem',fileItem, progress);
            };
            uploader.onProgressAll = function(progress) {
                // console.info('onProgressAll', progress);
            };
            uploader.onSuccessItem = function(fileItem, response, status, headers) {
                // console.info('onSuccessItem', fileItem, response, status, headers);
                console.log(response);

                doCallback('onSuccessItem',fileItem, response, status, headers);
            };
            uploader.onErrorItem = function(fileItem, response, status, headers) {
                // console.info('onErrorItem', fileItem, response, status, headers);
                
                doCallback('onErrorItem',fileItem, response, status, headers);
            };
            uploader.onCancelItem = function(fileItem, response, status, headers) {
                // console.info('onCancelItem', fileItem, response, status, headers);
                
                doCallback('onCancelItem',fileItem, response, status, headers);
            };
            uploader.onCompleteItem = function(fileItem, response, status, headers) {
                // console.info('onCompleteItem', fileItem, response, status, headers);
            };
            uploader.onCompleteAll = function() {
                // console.info('onCompleteAll');
            };
        }

        return collect;
    }

}