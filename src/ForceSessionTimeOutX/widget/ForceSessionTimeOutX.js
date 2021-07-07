define([
	"dojo/_base/declare",
	"mxui/widget/_WidgetBase",
	"dojo/_base/lang",
	"dojo/on"

], function (declare, _WidgetBase, lang, on) {
	"use strict";

	return declare("ForceSessionTimeOutX.widget.ForceSessionTimeOutX", [ _WidgetBase ], {
		timeoutOn: '',
		logOutMF: '',
		getTimeoutMF: '',
	
	postCreate: function(){
		if(this.timeoutOn == null || this.timeoutOn == undefined || this.timeoutOn == ''){
			this.timeoutOn = 0;
		}
		if(typeof(Storage) !== "undefined"){
			this.externalIsLoaded();
		}
	},
	externalIsLoaded: function(e){
		if (typeof window.msAppWideWidgets === "undefined" || typeof window.msAppWideWidgets.ForceSessionTimeOutX === "undefined"){
			setTimeout(lang.hitch(this, this.externalIsLoaded()),500);
		}else{
			var inputObj = {timeOutOn: this.timeoutOn};
			if(this.getTimeoutMF != '')	inputObj.timeOutMF = this.getTimeoutMF;
			if(this.logOutMF != '')			inputObj.logOutMF = this.logOutMF;
			window.msAppWideWidgets.ForceSessionTimeOutX.init(inputObj);
		}
	},
	uninitialize : function(){
		logger.debug(this.id + ".uninitialize");
	}
		});
	});

require([ "ForceSessionTimeOutX/widget/FST", "ForceSessionTimeOutX/widget/ForceSessionTimeOutX" ]);
