


 {
angular.module("utilsModule")
    .factory("utils.platform",  platform);
    platform.$inject = ['$window'];
    function platform($window) {
    	let collect={
    		'isIOS':isIOS,
    		'isAndroid':isAndroid,
            'isWechat':isWechat
    	}
    	let ua=$window.navigator.userAgent;
        console.log(ua);
    	function isIOS(){
    		return /iPhone|iPad|iPod/.test(ua);
    	}

    	function isAndroid(){
    		return ua.indexOf('Android') > 0;
    	}

        function isWechat(){
            return ua.toLowerCase().match(/MicroMessenger/i)=="micromessenger";
        }

    	return collect;
    }
}