/*
Copyright (c) 2006, Yahoo! Inc. All rights reserved.
Code licensed under the BSD License:
http://developer.yahoo.net/yui/license.txt
Version 0.11.3
*/

/**
* Tooltip is an implementation of Overlay that behaves like an OS tooltip, displaying when the user mouses over a particular element, and disappearing on mouse out.
* @extends YAHOO.widget.Overlay
* @param {string}	el	The element ID representing the Tooltip <em>OR</em>
* @param {Element}	el	The element representing the Tooltip
* @param {object}	userConfig	The configuration object literal containing the configuration that should be set for this Overlay. See configuration documentation for more details.
* @constructor
*/
YAHOO.widget.Tooltip = function(el, userConfig) {
	YAHOO.widget.Tooltip.superclass.constructor.call(this, el, userConfig);
};

YAHOO.extend(YAHOO.widget.Tooltip, YAHOO.widget.Overlay);

/**
* Constant representing the Tooltip CSS class
* @type string
* @final
*/
YAHOO.widget.Tooltip.CSS_TOOLTIP = "tt";

/**
* The Tooltip initialization method. This method is automatically called by the constructor. A Tooltip is automatically rendered by the init method, and it also is set to be invisible by default, and constrained to viewport by default as well.
* @param {string}	el	The element ID representing the Tooltip <em>OR</em>
* @param {Element}	el	The element representing the Tooltip
* @param {object}	userConfig	The configuration object literal containing the configuration that should be set for this Tooltip. See configuration documentation for more details.
*/
YAHOO.widget.Tooltip.prototype.init = function(el, userConfig) {
	if (document.readyState && document.readyState != "complete") {
		var deferredInit = function() {
			this.init(el, userConfig);
		};
		YAHOO.util.Event.addListener(window, "load", deferredInit, this, true);
	} else {
		YAHOO.widget.Tooltip.superclass.init.call(this, el);

		this.beforeInitEvent.fire(YAHOO.widget.Tooltip);

		YAHOO.util.Dom.addClass(this.element, YAHOO.widget.Tooltip.CSS_TOOLTIP);

		if (userConfig) {
			this.cfg.applyConfig(userConfig, true);
		}
		
		this.cfg.queueProperty("visible",false);
		this.cfg.queueProperty("constraintoviewport",true);

		this.setBody("");
		this.render(this.cfg.getProperty("container"));

		this.initEvent.fire(YAHOO.widget.Tooltip);
	}
};

/**
* Initializes the class's configurable properties which can be changed using the Overlay's Config object (cfg).
*/
YAHOO.widget.Tooltip.prototype.initDefaultConfig = function() {
	YAHOO.widget.Tooltip.superclass.initDefaultConfig.call(this);

	this.cfg.addProperty("preventoverlap",		{ value:true, validator:this.cfg.checkBoolean, supercedes:["x","y","xy"] } );

	this.cfg.addProperty("showdelay",			{ value:200, handler:this.configShowDelay, validator:this.cfg.checkNumber } );
	this.cfg.addProperty("autodismissdelay",	{ value:5000, handler:this.configAutoDismissDelay, validator:this.cfg.checkNumber } );
	this.cfg.addProperty("hidedelay",			{ value:250, handler:this.configHideDelay, validator:this.cfg.checkNumber } );

	this.cfg.addProperty("text",				{ handler:this.configText, suppressEvent:true } );
	this.cfg.addProperty("container",			{ value:document.body, handler:this.configContainer } );
};

// BEGIN BUILT-IN PROPERTY EVENT HANDLERS //

/**
* The default event handler fired when the "text" property is changed.
*/
YAHOO.widget.Tooltip.prototype.configText = function(type, args, obj) {
	var text = args[0];
	if (text) {
		this.setBody(text);
	}
};

/**
* The default event handler fired when the "container" property is changed.
*/
YAHOO.widget.Tooltip.prototype.configContainer = function(type, args, obj) {
	var container = args[0];
	if (typeof container == 'string') {
		this.cfg.setProperty("container", document.getElementById(container), true);
	}
};

/**
* The default event handler fired when the "context" property is changed.
*/
YAHOO.widget.Tooltip.prototype.configContext = function(type, args, obj) {
	var context = args[0];
	if (context) {
		
		// Normalize parameter into an array
		if (! (context instanceof Array)) {
			if (typeof context == "string") {
				this.cfg.setProperty("context", [document.getElementById(context)], true);
			} else { // Assuming this is an element
				this.cfg.setProperty("context", [context], true);
			}
			context = this.cfg.getProperty("context");
		}


		// Remove any existing mouseover/mouseout listeners
		if (this._context) {
			for (var c=0;c<this._context.length;++c) {
				var el = this._context[c];
				YAHOO.util.Event.removeListener(el, "mouseover", this.onContextMouseOver);
				YAHOO.util.Event.removeListener(el, "mousemove", this.onContextMouseMove);
				YAHOO.util.Event.removeListener(el, "mouseout", this.onContextMouseOut);
			}
		}

		// Add mouseover/mouseout listeners to context elements
		this._context = context;
		for (var d=0;d<this._context.length;++d) {
			var el2 = this._context[d];
			YAHOO.util.Event.addListener(el2, "mouseover", this.onContextMouseOver, this);
			YAHOO.util.Event.addListener(el2, "mousemove", this.onContextMouseMove, this);
			YAHOO.util.Event.addListener(el2, "mouseout", this.onContextMouseOut, this);
		}
	}
};

// END BUILT-IN PROPERTY EVENT HANDLERS //

// BEGIN BUILT-IN DOM EVENT HANDLERS //

/**
* The default event handler fired when the user moves the mouse while over the context element.
* @param {DOMEvent} e	The current DOM event
* @param {object}	obj	The object argument
*/
YAHOO.widget.Tooltip.prototype.onContextMouseMove = function(e, obj) {
	obj.pageX = YAHOO.util.Event.getPageX(e);
	obj.pageY = YAHOO.util.Event.getPageY(e);

};

/**
* The default event handler fired when the user mouses over the context element.
* @param {DOMEvent} e	The current DOM event
* @param {object}	obj	The object argument
*/
YAHOO.widget.Tooltip.prototype.onContextMouseOver = function(e, obj) {

	if (obj.hideProcId) {
		clearTimeout(obj.hideProcId);
		obj.hideProcId = null;
	}
	
	var context = this;
	YAHOO.util.Event.addListener(context, "mousemove", obj.onContextMouseMove, obj);

	if (context.title) {
		obj._tempTitle = context.title;
		context.title = "";
	}

	/**
	* The unique process ID associated with the thread responsible for showing the Tooltip.
	* @type int
	*/
	obj.showProcId = obj.doShow(e, context);
};

/**
* The default event handler fired when the user mouses out of the context element.
* @param {DOMEvent} e	The current DOM event
* @param {object}	obj	The object argument
*/
YAHOO.widget.Tooltip.prototype.onContextMouseOut = function(e, obj) {
	var el = this;

	if (obj._tempTitle) {
		el.title = obj._tempTitle;
		obj._tempTitle = null;
	}
	
	if (obj.showProcId) {
		clearTimeout(obj.showProcId);
		obj.showProcId = null;
	}

	if (obj.hideProcId) {
		clearTimeout(obj.hideProcId);
		obj.hideProcId = null;
	}


	obj.hideProcId = setTimeout(function() {
				obj.hide();
				}, obj.cfg.getProperty("hidedelay"));
};

// END BUILT-IN DOM EVENT HANDLERS //

/**
* Processes the showing of the Tooltip by setting the timeout delay and offset of the Tooltip.
* @param {DOMEvent} e	The current DOM event
* @return {int}	The process ID of the timeout function associated with doShow
*/
YAHOO.widget.Tooltip.prototype.doShow = function(e, context) {
	
	var yOffset = 25;
	if (this.browser == "opera" && context.tagName == "A") {
		yOffset += 12;
	}

	var me = this;
	return setTimeout(
		function() {
			if (me._tempTitle) {
				me.setBody(me._tempTitle);
			} else {
				me.cfg.refireEvent("text");
			}

			me.moveTo(me.pageX, me.pageY + yOffset);
			if (me.cfg.getProperty("preventoverlap")) {
				me.preventOverlap(me.pageX, me.pageY);
			}
			
			YAHOO.util.Event.removeListener(context, "mousemove", me.onContextMouseMove);

			me.show();
			me.hideProcId = me.doHide();
		},
	this.cfg.getProperty("showdelay"));
};

/**
* Sets the timeout for the auto-dismiss delay, which by default is 5 seconds, meaning that a tooltip will automatically dismiss itself after 5 seconds of being displayed.
*/
YAHOO.widget.Tooltip.prototype.doHide = function() {
	var me = this;
	return setTimeout(
		function() {
			me.hide();
		},
		this.cfg.getProperty("autodismissdelay"));
};

/**
* Fired when the Tooltip is moved, this event handler is used to prevent the Tooltip from overlapping with its context element.
*/
YAHOO.widget.Tooltip.prototype.preventOverlap = function(pageX, pageY) {
	
	var height = this.element.offsetHeight;
	
	var elementRegion = YAHOO.util.Dom.getRegion(this.element);

	elementRegion.top -= 5;
	elementRegion.left -= 5;
	elementRegion.right += 5;
	elementRegion.bottom += 5;

	var mousePoint = new YAHOO.util.Point(pageX, pageY);
	
	if (elementRegion.contains(mousePoint)) {
		this.cfg.setProperty("y", (pageY-height-5));
	}
};

/**
* Returns a string representation of the object.
* @type string
*/ 
YAHOO.widget.Tooltip.prototype.toString = function() {
	return "Tooltip " + this.id;
};