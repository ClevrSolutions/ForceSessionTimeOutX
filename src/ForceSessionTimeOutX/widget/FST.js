define([
	"dojo/_base/lang",
	"dojo/on"

], function (lang, on) {
	
if(!window.msAppWideWidgets){
window.msAppWideWidgets = [];
}
if(!window.msAppWideWidgets.ForceSessionTimeOutX){
	window.msAppWideWidgets.ForceSessionTimeOutX = new function(){
		var timeOutOn = 0;
		var eventsAreSet = false;
		var microFlow = {};
		var handler = {};
		var lastUserAction = 0;
		var debug = false;
		
		this.init = function(param){
			if(typeof param !== "object") return;
			if(param.timeOutOn)	timeOutOn = param.timeOutOn;
			if(param.timeOutMF)	microFlow.timeOut = param.timeOutMF;
			if(param.logOutMF)	microFlow.logOut = param.logOutMF;
			this.updateLastUserAction();
			this.setTimeOutValue(timeOutOn);
			this.fetchTimeOutOn();
		}		
		this.setTimeOutValue = function (param){
			try{
				parseInt(param);
				timeOutOn = param;
				if(console && debug === true) console.log('ForceSessionTimeOutX.widget: Timeout set to '+timeOutOn);
			}
			catch(e){if(console && debug === true) console.log('ForceSessionTimeOutX.widget: NaN error');}
			this.setEvents();
		}
		this.updateLastUserAction = function(e){
			lastUserAction = new Date();
			window.localStorage.setItem('CUS-FST-lastAction',lastUserAction.getTime());
			if(console && debug === true) console.log('ForceSessionTimeOutX.widget: User action at '+lastUserAction);
		}		
		this.setEvents = function(param){			
			if(console && debug === true) console.log('ForceSessionTimeOutX.widget: Set Events');
			if(eventsAreSet === false && timeOutOn > 0){
				handler.c = on(document, 'click', lang.hitch(this, this.updateLastUserAction));
				handler.ku = on(document, 'keyup', lang.hitch(this, this.updateLastUserAction));
				handler.mu = on(document, 'mouseup', lang.hitch(this, this.updateLastUserAction));
				
				eventsAreSet = true;
				this.checkTimeOut();
				if(console && debug === true) console.log('ForceSessionTimeOutX.widget: Events are set');
			}
		}
		this.fetchTimeOutOn = function(){
			if(console && debug === true) console.log('ForceSessionTimeOutX.widget: Fetch TimeOut value by Microflow');
			if(!microFlow.timeOut){
				this.setEvents();
				return false;
			}
			var guest = mx.session.isGuest();
			if(mx.session == null || guest == null || guest){
				setTimeout(lang.hitch(this, this.fetchTimeOutOn), 5000);
			}else{
				mx.data.action({
					params       : {
						actionname : microFlow.timeOut
					},
		    	callback     : lang.hitch(this, this.setTimeOutValue),
			  	error        : lang.hitch(this, this.setEvents)
				});
			}
		}
		this.checkTimeOut = function(){
			if(eventsAreSet && timeOutOn > 0){
				var guest = mx.session.isGuest();
				if(mx.session == null || guest == null || guest){
					this.updateLastUserAction();
				}else{
					if(console && debug === true) console.log('ForceSessionTimeOutX.widget: Check if TimeOut');
					if(window.localStorage.getItem('CUS-FST-lastAction') == null) this.updateLastUserAction();
					var timeNow = new Date();
					var timeDiff = timeNow.getTime() - window.localStorage.getItem('CUS-FST-lastAction');
					if(timeDiff/1000 > timeOutOn){
						if(microFlow.logOut){
							mx.ui.action(microFlow.logOut, {
					    	callback     : function() {},
				    		error        : lang.hitch(this, this.errorOnLogoutMf)
							});
						}else{
							this.errorOnLogoutMf();
						}
					}
				}
				this.toFunction = setTimeout(lang.hitch(this, this.checkTimeOut), 5000);
			}
		}
		this,erroronLogoutMf = function(e){
			if(console && debug === true) console.log('ForceSessionTimeOutX.widget: Error occured while logging out using microflow');
			this.updateLastUserAction();
			try{
				mx.session.logout();
			}catch(e){
				try{mx.logout();}catch(e){};
			}
		}
			};
		}
	});
