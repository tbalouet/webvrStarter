var World;

(function(){
	"use strict";
	
	var THREE        = require("../vendor/three.js");

	require("../../app/globals.js");

	var WebVRManager = require("../vendor/webvr-manager.js");
	require("../vendor/webvr-polyfill.js");
	THREE.VRControls = require("../vendor/VRControls.js");
	THREE.VREffect   = require("../vendor/VREffect.js");
	var Stats        = require("../vendor/stats.js");
	var Glob         = require("../../app/globals.js");


	World = function(opts){
		var that = this;
		//Loops to add to the general animate function
		this.preRenderLoops  = {};
		this.postRenderLoops = {};

		opts.width  = opts.width || window.innerWidth;
		opts.height = opts.height || window.innerHeight;

		var renderer      = new THREE.WebGLRenderer({canvas: opts.canvas, antialias: true});
		renderer.setPixelRatio(window.devicePixelRatio);
		
		if(!opts.canvas){
			// Append the canvas element created by the renderer to document body element.
			document.body.appendChild(renderer.domElement);
		}
		
		// Create a three.js scene.
		var scene         = new THREE.Scene();
		
		// Create a three.js camera.
		var camera        = new THREE.PerspectiveCamera(opts.fov, opts.width / opts.height, opts.near, opts.far);
		camera.layers.enable(1);
		var camParent	  = new THREE.Group();
		camParent.name	  = "camParent";
		camParent.add(camera);
		scene.add(camParent);
		
		this.camDirVector = new THREE.Vector3();
		
		var controls 	  = undefined;
		if(!opts.noControls){
			// Apply VR headset positional data to camera.
		    controls = new THREE.VRControls(camera);
		}
		
		// Apply VR stereo rendering to renderer.
		var effect        = new THREE.VREffect(renderer);
		effect.setSize(opts.width, opts.height);
		
		// Create a VR manager helper to enter and exit VR mode.
		var manager       = new WebVRManager(renderer, effect);

		if ( navigator.getVRDisplays ) {
			navigator.getVRDisplays()
				.then( function ( displays ) {
					if(displays[ 0 ].capabilities.canPresent){
						effect.setVRDisplay( displays[ 0 ] );
						if(controls){
							controls.setVRDisplay( displays[ 0 ] );
						}
						effect.requestPresent();
					}
				} )
				.catch( function () {
					// no displays
				} );
		}
		
		var stats;
		if(GLOBAL.env === "dev"){
			stats = new Stats();
			stats.showPanel( 0 ); // 0: fps, 1: ms, 2: mb, 3+: custom
			stats.dom.id = "StatsCanvas";
			document.body.appendChild( stats.dom );
		}

		window.addEventListener('resize', this.onResize.bind(this), true);
		window.addEventListener('vrdisplaypresentchange', this.onResize.bind(this), true);
		
		this.getRenderer    = function(){ return renderer;};
		this.getScene       = function(){ return scene;};
		this.getCamera      = function(){ return camera;};
		this.getCamParent   = function(){ return camParent;};
		this.getControls    = function(){ return controls;};
		this.getEffect      = function(){ return effect;};
		this.getManager     = function(){ return manager;};
		this.getManagerMode = function(){ return manager.mode;};
		this.getStats       = function(){ return stats;};
	};

	World.prototype.onResize = function(e) {
		this.getEffect().setSize(window.innerWidth, window.innerHeight);
		this.getCamera().aspect = window.innerWidth / window.innerHeight;
		this.getCamera().updateProjectionMatrix();
	};

	World.prototype.start = function(){
		this.animate(0);
	};

	World.prototype.hookOnPreRender = function(func){
		var id = Glob.guid();
		this.preRenderLoops[id] = func;
		return id;
	};

	World.prototype.unHookOnPreRender = function(id){
		if(this.preRenderLoops[id]){
			delete this.preRenderLoops[id];
			return true;
		}
		return false;
	};

	World.prototype.hookOnPostRender = function(func){
		var id = Glob.guid();
		this.postRenderLoops[id] = func;
		return id;
	};

	World.prototype.unHookOnPostRender = function(id){
		if(this.preRenderLoops[id]){
			delete this.postRenderLoops[id];
			return true;
		}
		return false;
	};

	// Request animation frame loop function
	World.prototype.animate = function(timestamp) {
		if(this.getStats()){
			this.getStats().begin();
		}

		if(this.getControls()){
			// Update VR headset position and apply to camera.
			this.getControls().update();
		}

		for(var key in this.preRenderLoops){
			if(this.preRenderLoops.hasOwnProperty(key)){
				this.preRenderLoops[key](timestamp);
			}
		}

		// this.getStats().renderLoop(timestamp === 0 ? 1 : timestamp);

		// Render the scene through the manager.
		this.getManager().render(this.getScene(), this.getCamera(), timestamp);

		for(var key in this.postRenderLoops){
			if(this.postRenderLoops.hasOwnProperty(key)){
				this.postRenderLoops[key](timestamp);
			}
		}

		if(this.getStats()){
			this.getStats().end();
		}

		this.getEffect().requestAnimationFrame(this.animate.bind(this));
	};
})();
module.exports = World;