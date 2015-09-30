var BASEURL = 'http://tongke.shenyao.net/apis';

function Ajax(options, successcb, errorcb, nonetworkcb) {
	var net = plus.networkinfo.getCurrentType();
	if (net != 0 && net != 1) {
		innerAjax(options, successcb, errorcb)
	} else {
		if (nonetworkcb) {
			nonetworkcb()
		} else {
			mui.toast('未连接网络,请链接网络');
		}
	}
}
function iflog(){
	var userinfo = JSON.parse(plus.storage.getItem('userinfo'));
	if(userinfo){
		var phone = userinfo.mobile;
		var pwd = userinfo.password;
		var data = {
			username:phone,
			password:pwd
		}
		Ajax({
			url:'/members/logins',
			data:data
		},function(data){
			alert('login success')
		},function(){
			alert('something error')
		})
	}else{
		openWindow('./pages/log/login-up.html')
	}
	
}
function innerAjax(options, successcb, errorcb) {
	var op = {
		dataType: 'json',
		type: 'post',
		url: '',
		data: {},
		wait: false
	};
	copyobj(options, op);
	if (op.wait) {
		plus.nativeUI.showWaiting('请求中', {
			background: "#d1d1d1"
		})
	}
	mui.ajax(BASEURL + op.url, {
		type: op.type,
		data: op.data,
		dataType: op.dataType,
		success: function(data) {
			if (op.wait) {
				plus.nativeUI.closeWaiting();
			}
			if (data.status == 'success') {
				successcb(data)
			} else if (data.status == 'errors') {
				errorcb(data);
			}
		},
		error: function(data) {
			if (op.wait) {
				plus.nativeUI.closeWaiting();
			}

			errorcb(data)
		}
	})
}

function getwebid(url) {
	var start = url.lastIndexOf('/');
	var end = url.indexOf('.html');
	var pageid = url.substring(start + 1, end);
	return pageid;
}

function copyobj(from, to) {
	for (var i in from) {
		if (typeof from[i] == 'object') {
			copyobj(from[i], to[i])
		} else {
			to[i] = from[i];
		}
	}
}

function preload(webArr, cb) {
		var len = webArr.length;
		for (var i = 0; i < len; i++) {
			var pageid = getwebid(webArr[i]);
			var temppage = 'page' + i;
			if (webArr) {
				temppage = mui.preload({
					url: webArr[i],
					id: pageid
				})
			}
		}
		cb && cb();
	}
	// 打开窗口

function openWindow(url, param, aniType, aniTime) {
	// 通过url获取当前id

	if (window.plus) {
		mui.openWindow({
			id: getwebid(url),
			url: url,
			extras: param || {},
			show: {
				autoShow: true,
				aniShow: aniType || "slide-in-right",
				duration: aniTime || 300
			},
			waiting: {
				autoShow: false,
				title: '正在加载...',
				options: {
					background: '#d1d1d1',
					width: 100,
					height: 100
				}
			}
		})
	} else {
		alert('system is not ready')
	}
}