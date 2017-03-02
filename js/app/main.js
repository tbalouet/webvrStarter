window.GLOBAL = {};
window.THREE = require("../lib/vendor/three.js");
(function(){
	"use strict";

	var World       = require("../lib/intern/world.js");
	var THREE       = require("../lib/vendor/three.js");
	var Glob        = require("./globals.js");
	var SceneSample = require("./sceneSample.js");
	var GamepadState = require("../lib/vendor/GamepadState.js");

	GLOBAL.env = (location.href.indexOf("3000") !== -1 || location.href.indexOf("debug=true") !== -1 ? "dev" : "prod");

	GLOBAL.Glob = Glob;

	var world            = new World({
		color : 0x999999,
		fov   : 75,
		near  : 0.1,
		far   : 10000
	});
	world.getRenderer().domElement.className = "mainCanvas";
	world.getRenderer().domElement.id        = "mainCanvas";
	GLOBAL.world = world;

	new SceneSample();

	if(Glob.isSamsung()){
		document.getElementById("carmel-button").addEventListener("click", function(){
			var ocurl = "ovrweb:" + location.href;
			
			window.location.href = ocurl;
		});
		document.getElementById("carmel-button").style.display = "block";

		// See GamepadState.js, this is a simple wrapper around the navigator.getGamepads API with Gear VR input detection
	    var gamepadState = new GamepadState();
	    // When the gamepadState is updated it will use this callback to trigger any detected Gear VR actions
	    gamepadState.ongearvrinput = function (gearVRAction) {
	    	console.log("Gear VR Action:  " + gearVRAction);
	    };
		GLOBAL.world.hookOnPreRender(gamepadState.update.bind(gamepadState));
	}

	// Kick off animation loop
	world.start();
})();