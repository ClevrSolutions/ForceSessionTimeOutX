dojo.provide("ForceSessionTimeOutX.widget.ForceSessionTimeOutX");
mendix.widget.declare('ForceSessionTimeOutX.widget.ForceSessionTimeOutX', {
	addons       : [],
	inputargs: {
		timeoutOn: '',
		logOutMF: '',
		getTimeoutMF: ''
	},
	
	postCreate: function(){
		if(this.timeoutOn == null || this.timeoutOn == undefined || this.timeoutOn == ''){
			this.timeoutOn = 0;
		}
		if(typeof(Storage) !== "undefined"){
			dojo.require("ForceSessionTimeOutX.widget.FST");
			this.externalIsLoaded();
		}
		this.actRendered();
	},
	externalIsLoaded: function(e){
		if (typeof window.msAppWideWidgets === "undefined" || typeof window.msAppWideWidgets.ForceSessionTimeOutX === "undefined"){
			setTimeout(dojo.hitch(this, this.externalIsLoaded()),500);
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