window.GLOBAL = {};
window.THREE = require("../lib/vendor/three.js");
(function(){
	"use strict";

	var World = require("../lib/intern/world.js");
	var THREE = require("../lib/vendor/three.js");
	var Glob  = require("./globals.js");

	GLOBAL.env = (location.href.indexOf("3000") !== -1 || location.href.indexOf("debug=true") !== -1 ? "dev" : "prod");

	if(Glob.isSamsung()){
		document.getElementById("carmel-button").addEventListener("click", function(){
			var ocurl = "ovrweb:" + location.href;
			
			window.location.href = ocurl;
		});
		document.getElementById("carmel-button").style.display = "block";
	}

	var world            = new World({
		color : 0x999999,
		fov   : 75,
		near  : 0.1,
		far   : 10000
	});
	world.getRenderer().domElement.className = "mainCanvas";
	world.getRenderer().domElement.id        = "mainCanvas";
	GLOBAL.world = world;

	// Add a repeating grid as a skybox.
	var boxWidth = 5;
	var loader   = new THREE.TextureLoader();
	loader.load('public/assets/box.png', onTextureLoaded);
	function onTextureLoaded(texture) {
		texture.wrapS = THREE.RepeatWrapping;
		texture.wrapT = THREE.RepeatWrapping;
		texture.repeat.set(boxWidth, boxWidth);
		var geometry = new THREE.BoxGeometry(boxWidth, boxWidth, boxWidth);
		var material = new THREE.MeshBasicMaterial({
			map   : texture,
			color : 0x01BE00,
			side  : THREE.BackSide
		});
		var skybox = new THREE.Mesh(geometry, material);
		world.getScene().add(skybox);
	}

	// Create 3D objects.
	var geometry = new THREE.BoxGeometry(0.5, 0.5, 0.5);
	var material = new THREE.MeshNormalMaterial();
	var cube     = new THREE.Mesh(geometry, material);

	// Position cube mesh
	cube.position.z = -1;

	// Add cube mesh to your three.js scene
	world.getScene().add(cube);

	world.hookOnPreRender(function(){
		// Apply rotation to cube mesh
		cube.rotation.y += 0.01;
	});

	// Kick off animation loop
	world.start();
})();