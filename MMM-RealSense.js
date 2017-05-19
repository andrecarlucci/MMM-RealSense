/* global Module */

/* Magic Mirror
 * Module: MMM-RealSense
 *
 * André Carlucci
 * Based on work of Paul-Vincent Roll http://paulvincentroll.com
 * MIT Licensed.
 */

Module.register('MMM-RealSense',{
	
	defaults: {
		//Module set used for strangers and if no user is detected
		defaultClass: "default",
		//Set of modules which should be shown for every user
		everyoneClass: "everyone",
		// Boolean to toggle welcomeMessage
		welcomeMessage: true
	},
	
	login_user: function () {
		console.log("RealSense -> login_user: " + this.current_user);
		MM.getModules().withClass(this.config.defaultClass)
					   .exceptWithClass(this.config.everyoneClass)
					   .enumerate(function(module) {
			module.hide(1000, function() {
				Log.log('RealSense -> ' + module.name + ': hide!');
			});
		});
		
		MM.getModules().withClass(this.current_user)
					   .enumerate(function(module) {
			module.show(1000, function() {
				Log.log('RealSense -> ' + module.name + ': show!');
			});
		});
		
		this.sendNotification("CURRENT_USER", this.current_user);
	},

	logout_user: function () {
		console.log("RealSense -> logout_user: " + this.current_user);
		MM.getModules().withClass(this.current_user)
					   .enumerate(function(module) {
			module.hide(1000, function() {
				Log.log('RealSense -> ' + module.name + ': hide!');
			});
		});
		
		MM.getModules().withClass(this.config.defaultClass)
					   .exceptWithClass(this.config.everyoneClass)
					   .enumerate(function(module) {
			module.show(1000, function() {
				Log.log('RealSense -> ' + module.name + ': show!');
			});
		});
		
		this.sendNotification("CURRENT_USER", "None");
	},
	
	//Override socket notification handler.
	socketNotificationReceived: function(notification, payload) {
		if (notification == "login"){
			if (this.current_user_id != payload){
				this.logout_user()
			}
			if (payload.user == -1){
				this.current_user = this.translate("stranger")
				this.current_user_id = payload;
			}
			else{				
				this.current_user = payload;
				this.current_user_id = payload;
				this.login_user()
			}
			
            if (this.config.welcomeMessage) {
                console.log("RealSense -> send alert: " + this.current_user);

                var message = '';
                var current_user = this.current_user;
                var messages = this.config.users.filter(function (item) {
                    return item.name == current_user;
                });

                if (messages.length > 0) {
                    message = messages[0].message;
                }

                if (message) {
                    this.sendNotification("SHOW_ALERT", {
                        type: "notification",
                        message: message,
                        title: ""
                    });
                }
			}
		}
		else if (payload.action == "logout"){
			this.logout_user()
			this.current_user = null;
		}
	},
	
	notificationReceived: function(notification, payload, sender) {
		if (notification === 'DOM_OBJECTS_CREATED') {
			MM.getModules().exceptWithClass("default").enumerate(function(module) {
				if(module.name != 'MMM-Face-Recognition-RealSense') {
					module.hide(1000, function() {
						Log.log('RealSense -> ' + module.name + ': hide!');
					});	
				}
			});
		}
	},
	
	start: function() {
		this.current_user = null;
		this.sendSocketNotification('CONFIG', this.config);
		Log.info('Starting module: ' + this.name);
	}

});
