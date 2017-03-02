var SceneSample;

(function(){
	"use strict";
	var THREE = require("../lib/vendor/three.js");

	SceneSample = function(){
		// Add a repeating grid as a skybox.
		this.boxWidth = 5;
		this.createBackground();

		// Create 3D object.
		this.cubeSize = 0.5;
		this.createCube();

		GLOBAL.world.hookOnPreRender(this.update.bind(this));
	};

	SceneSample.prototype.createBackground = function(){
		var loader   = new THREE.TextureLoader();
		loader.load('public/assets/box.png', this.onBgTexLoaded.bind(this));
	};

	SceneSample.prototype.onBgTexLoaded = function(texture){
		texture.wrapS = THREE.RepeatWrapping;
		texture.wrapT = THREE.RepeatWrapping;
		texture.repeat.set(this.boxWidth, this.boxWidth);
		var geometry = new THREE.BoxGeometry(this.boxWidth, this.boxWidth, this.boxWidth);
		var material = new THREE.MeshBasicMaterial({
			map   : texture,
			color : 0x01BE00,
			side  : THREE.BackSide
		});

		this.skybox = new THREE.Mesh(geometry, material);
		GLOBAL.world.getScene().add(this.skybox);
	};

	SceneSample.prototype.createCube = function(){		var geometry = new THREE.BoxGeometry(0.5, 0.5, 0.5);
		var material = new THREE.MeshNormalMaterial();
		this.cube     = new THREE.Mesh(geometry, material);

		// Position cube mesh
		this.cube.position.z = -1;

		// Add cube mesh to your three.js scene
		GLOBAL.world.getScene().add(this.cube);
	};

	SceneSample.prototype.update = function(delta){
		// Apply rotation to cube mesh
		this.cube.rotation.y += 0.01;
	};
})();
module.exports = SceneSample;