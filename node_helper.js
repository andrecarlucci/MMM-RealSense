// /* global Module */

// /* Magic Mirror
//  * Module: MMM-RealSense
//  *
//  * André Carlucci
//  * Based on work of Paul-Vincent Roll http://paulvincentroll.com
//  * MIT Licensed.
//  */

const NodeHelper = require("node_helper");
const url = require("url");

module.exports = NodeHelper.create({
	
	start: function() {
		this.expressApp.get('/login', (req, res) => {
			var query = url.parse(req.url, true).query;
			var user = query.user;

			if (user == null){
				res.send({"status": "failed", "error": "No user given."});
			}
			else {
				this.sendSocketNotification('login', user );
				res.send({"status": "success", "login": user});
			}
		});

		this.expressApp.get('/logout', function (req, res) {
			this.sendSocketNotification('logout', user);
			res.send({"status": "success", "logout": user});
		});
 	}	
});