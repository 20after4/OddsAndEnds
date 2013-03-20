
var Cu = Components.utils;
var Ci = Components.interfaces;
var Cc = Components.classes;

Cu.import("resource://app/modules/nativeJSON.jsm");
Cu.import("resource://app/modules/logging.jsm");


function jsonrpc(url,useragent) {
  this.url = url;
	if (useragent) {
		this.useragent = useragent;
	}
}

jsonrpc.prototype = {
	id: 0,
	useragent: 'json-rpc.js',
	call: function(method,params,callback,errorCallback) {
		var id = this.id++; 
		var req = {
			'method': method,
			'params': params,
			'id':	'req-'+id
		};
		req = JSON.encode(req);
		LOG.msg("Request:"+req);
		var options = {
			'type': "POST",
			'url': this.url,
			'contentType': 'application/json',
			'dataType': 'text',
			'data': req,
			'global': false,
			'beforeSend': this.beforeSendHandler,
			'success': this.completeHandler,
			'error': this.errorHandler,
			'callback': callback
			
		};

		jQuery.ajax(options);
	},
	beforeSendHandler:function(req) {
	},
	completeHandler: function(data,sts) {
		LOG.msg("Callback ["+ sts+"] " + data );
		data=JSON.decode(data);
		if (data.error)
			LOG.err('obj',data.error);
		if (this.callback)
			this.callback(data.result,sts);
	},
	errorHandler: function(req,msg,err) {
		var errMsg = msg+":"+err;
		Cu.reportError(errMsg);
	},
	
};
