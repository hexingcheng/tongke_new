var BASEURL = 'http://tongke.shenyao.net/apis';
function Ajax(options, successcb, errorcb,nonetworkcb){
	var net = plus.networkinfo.getCurrentType();
	if (net != 0 && net != 1) {
		innerAjax(options, successcb, errorcb)
	} else {
		if(nonetworkcb){
			nonetworkcb()
		} else {
			mui.toast('未连接网络,请链接网络');
		}
	}
}
function innerAjax(options,successcb,errorcb) {
	var op = {
		dataType:'json',
		type:'post',
		url:'',
		data:{},
		wait:false
	};
	copyobj(options,op);
	if(op.wait){
		plus.nativeUI.showWaiting('请求中',{background:"#d1d1d1"})
	}
	mui.ajax(BASEURL + op.url, {
		type: op.type,
		data: op.data,
		dataType:op.dataType,
		success: function(data) {
			if(op.wait){
				plus.nativeUI.closeWaiting();
			}
			if(data.status=='success'){
				successcb()
			}else if(data.status=='errors'){
				errorcb();
			}
//			if (data.ret == 1) {
//				successcb(data);
//			} else if (data.ret == -101) {
//				if(getstorage('token')){
//					var token = getstorage('token');
//					mui.ajax(BASEURL+'auth/activate',{
//						type:'post',
//						data:{
//							token:token
//						},
//						success:function(data){
//							if(data.ret==1){
//								innerAjax(options,successcb,errorcb);
//							}else if(data.ret==-1){
//								mui.toast('身份校验异常,请重新登录');
//								mui.ajax(BASEURL+'auth/out',{
//									type:'get',
//									success:function(){
//										openWindow('./page/logupin/login.html')
//									}
//								})
//							}
//						}
//					})
//				} else {
//					openWindow('./page/logupin/login.html');
//				}
//			} else{
//				if(op.wait){
//					plus.nativeUI.closeWaiting()
//				}
//				successcb(data);
//
//			}
		},
		error: function(data){
			if(op.wait){
				plus.nativeUI.closeWaiting();
			}
			
			errorcb(data)
		}
	})
}
	function getwebid(url){
		var start = url.lastIndexOf('/');
		var end = url.indexOf('.html');
		var pageid = url.substring(start + 1, end);
		return pageid;
	}
function copyobj(from,to){
	for(var i in from){
		if(typeof from[i]=='object'){
			copyobj(from[i],to[i])
		}else{
			to[i]=from[i];
		}
	}
}

function preload(webArr,cb){
	var len  = webArr.length;
	for(var i = 0;i<len;i++){
		var pageid = getwebid(webArr[i]);
		var temppage = 'page'+i;
		temppage = mui.preload({
			url:webArr[i],
			id:pageid
		})
	}
	cb&&cb();
}
