


{
	angular.module("utilsModule")
		.factory("utils.platform",  platform);
	platform.$inject = ['$window'];
	function platform($window) {
		let collect={
			'isAndroid':isAndroid,
			'isIPhone':isIPhone,
			'isIPad':isIPad,
			'isIOS':isIOS,
			'isMobile':isMobile,
			'isWechat':isWechat
		}
		let ua=$window.navigator.userAgent.toLowerCase();;
		// console.log(ua);
		function isIPhone(){
			return /iphone|ipod/.test(ua);
		}
		function isIPad(){
			return /ipad/.test(ua);
		}
		function isIOS(){
			return /iphone|ipad|ipod/.test(ua);
		}

		function isAndroid(){
			return ua.indexOf('android') > 0;
		}
		function isMobile(){
			return isIPhone()||isAndroid();
		}
		function isWechat(){
			return ua.match(/MicroMessenger/i)=="micromessenger";
		}

		return collect;
	}
}