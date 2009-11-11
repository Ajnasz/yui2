(function(){YAHOO.widget.InlineEditor=function(g,Y){this.init.apply(this,arguments);};var D=YAHOO,N=D.util,V=D.lang,f=N.Event,C=N.Dom,O=YAHOO.widget.InlineEditor,M={CANCEL_BUTTON:"yui-inline-editor-cancel",SAVE_BUTTON:"yui-inline-editor-save",EDIT_BUTTON:"yui-inline-editor-edit",CONTROLS_CONTAINER:"yui-inline-editor-controls",ELEM_EDITABLE:"yui-inline-editor-editable",EDITING_ACTIVE:"yui-inline-editor-editing",RADIO_GROUP_CONTAINER:"yui-inline-editor-radio-group",RADIO_ITEM_CONTAINER:"yui-inline-editor-radio-item"},b="cancelEvent",e="saveEvent",X="editStartedEvent",K="cancelClickEvent",F="saveClickEvent",W="editClickEvent",A="emptyValueEvent",P="elementReplacedEvent",H="valueNotValidEvent",S=["text","textarea","select","radio","checkbox"],d=function(h,Y,i){if(!V.isString(h)||!V.isString(Y)||(!V.isString(i)&&!V.isNumber(i))){return false;}var g=document.createElement(h);C.setAttribute(g,"name",Y);g.value=i;return g;},G=function(Y,h,g){return new Option(Y,h,g);},U=function(Y,g){var h=d("input",Y,g);C.setAttribute(h,"type","text");return h;},I=function(j,i,l,k){var Y=document.createElement("span"),h=document.createElement("label"),m=d("input",j,l),g=C.generateId();C.addClass(Y,M.RADIO_ITEM_CONTAINER);C.setAttribute(m,"id",g);C.setAttribute(h,"for",g);h.innerHTML=i;C.setAttribute(m,"type","radio");if(k){C.setAttribute(m,"checked","checked");}Y.appendChild(m);Y.appendChild(h);return Y;},a=function(Y,g){return U(Y,g,"text");},E=function(Y,g){var h=d("input",Y,"1");C.setAttribute(h,"type","checkbox");if(g===true){C.setAttribute(h,"checked","checked");}return h;},T=function(Y,g){var h=d("textarea",Y,g);C.setAttribute(h,"rows",10);C.setAttribute(h,"cols",40);return h;},B=function(h,i,g){var j=d("select",h,""),Y;for(Y in g){if(g.hasOwnProperty(Y)){j.appendChild(G(Y,g[Y],(Y==i||g[Y]==i)));}}return j;},R=function(i,j,h){var k=document.createElement("span"),g,Y;C.addClass(k,M.RADIO_GROUP_CONTAINER);for(Y in h){if(h.hasOwnProperty(Y)){g=I(i,Y,h[Y],(Y==j||h[Y]==j));k.appendChild(g);}}return k;},Z=function(h){var Y,o={},l,j,k,g,n,m;if(h&&h.nodeName=="FORM"){Y=h.elements;j=Y.length;for(l=0;l<j;l++){k=Y[l];g=C.getAttribute(k,"name");n=k.value;if(g){if(k.nodeName=="INPUT"){m=C.getAttribute(k,"type");if(m=="checkbox"){o[g]=k.checked?true:false;}else{if(m!="radio"||k.checked){o[g]=n;}}}else{o[g]=n;}}}}return o;},Q={TYPE:"text",ALLOW_EMPTY:false,FIELD_NAME:"field",FIELD_GENERATOR:function(g,j,h,Y){var i;switch(g){case"text":i=a(j,h);break;case"textarea":i=T(j,h);break;case"select":i=B(j,h,Y);break;case"radio":i=R(j,h,Y);break;case"checkbox":i=E(j,h,Y);break;}return i;},PROCESS_BEFORE_SAVE_METHOD:function(Y){return Y;},PROCESS_BEFORE_READ_METHOD:function(Y){return Y;},VALIDATION_METHOD:function(Y){return true;},SELECTABLE_VALUES:null,ANIM_TO_COLOR:"#D7EEFF",ANIM_FROM_COLOR:"#FFFFFF",ANIM_ON_MOUSEOVER:true},J=function(g){var j=false,h=S.length,Y;if(V.isString(g)){for(Y=0;Y<h;Y++){if(S[Y]===g){j=true;break;}}}if(!j){D.log("field type is invalid:  "+j,"error");throw new Error("field type is invalid");}return j;},L=function(g){var Y=document.createElement("form");C.setAttribute(Y,"id","yui-inline-editor-"+g);C.addClass(Y,"yui-inline-editor-form");return Y;},c=function(k,i,l,Y){var h=false,g=N.KeyListener,j;if(k){j=new g(k,l,{fn:i.save,scope:i,correctScope:true});j.enable();j=new g(k,Y,{fn:i.cancel,scope:i,correctScope:true});j.enable();h=true;}return h;};V.extend(O,YAHOO.util.AttributeProvider,{save:function(){var Y=Z(this._editor),j=V.trim(Y[this.get("fieldName")]),i=this.get("processBeforeSave"),h=this.get("validator"),g=false;j=i.call(this,j);if(j===""&&!this.get("allowEmpty")){D.log("the field value is empty and it's not allowed");this.fireEvent(A);}else{if(h.call(this,j)){this.set("value",j);this._stopEdit();this.fireEvent(e,{value:j,values:Y});g=true;}else{this.fireEvent(H);}}return g;},cancel:function(){this._stopEdit();this.fireEvent(b);return true;},edit:function(){if(this._editStarted){return false;}var Y=this.get("element");C.addClass(Y,M.EDITING_ACTIVE);this._replaceElement();this._editStarted=true;this.fireEvent(X);return true;},_stopEdit:function(){if(!this._editStarted){return false;}var Y=this.get("element");C.removeClass(Y,M.EDITING_ACTIVE);this._restoreElement();this._editStarted=false;return true;},_setEditable:function(){var Y=this.get("element");C.addClass(Y,M.ELEM_EDITABLE);f.on(Y,"click",function(h){var g=f.getTarget(h);if(g==Y&&!this._editStarted){this.edit();}},this,true);if(this.get("animOnMouseover")&&V.isFunction(N.ColorAnim)){f.on(Y,"mouseover",function(){if(!this._editStarted){var g=this.get("animFromColor"),i=this.get("animToColor"),h=new N.ColorAnim(Y,{backgroundColor:{to:i,from:g}},0.3);h.onComplete.subscribe(function(){var j=new N.ColorAnim(Y,{backgroundColor:{to:g}},0.3);j.animate();});h.animate();}},this,true);}},_createEditor:function(){var Y=L(this.get("id")),j=this.get("type"),m=this.get("value"),g=this.get("processBeforeRead"),n=this.get("fieldName"),h=this.get("selectableValues"),i=this.get("fieldGenerator"),k,l=false;if(V.isFunction(g)){m=g.call(this,m);}k=i.call(this,j,n,m,h);c(k,this,this.get("saveKeys"),this.get("cancelKeys"));if(k.nodeType===1){this._createControls();Y.appendChild(k);Y.appendChild(this.controls.container);f.on(Y,"submit",f.stopEvent);l=Y;}return l;},_replaceElement:function(){var Y=this.get("element"),h=this.get("fieldName"),g=this._createEditor();if(!g){D.log("editor is not an element","error");return false;}Y.innerHTML="";Y.appendChild(g);setTimeout(function(){try{g[h].focus();}catch(i){}},100);this.fireEvent(P);this._editor=g;},_restoreElement:function(){var i=this.get("element"),j=this.get("value"),g=this.get("selectableValues"),h,Y;if(V.isObject(g)){for(Y in g){if(g[Y]==j){h=Y;break;}}}else{h=j;}i.innerHTML=h;this._addEditControl();delete this._editor;},_destroyControls:function(){var i=this.controls,k,h,j,l,g,Y;if(i){g=i.container;if(g){Y=g.parentNode;Y.removeChild(g);}else{k=i.cancel;h=k.parentNode;j=i.save;l=k.parentNode;j=i.save;l=k.parentNode;
if(h){h.removeChild(k);D.log("cancel button removed","info");}if(l){l.removeChild(j);D.log("save button removed","info");}}delete this.controls;}},_createControls:function(h){var g=document.createElement("button"),Y=document.createElement("span"),k,j,i;C.setAttribute(g,"type","button");C.addClass(g,"yui-inline-editor-button");C.addClass(Y,M.CONTROLS_CONTAINER);this._destroyControls();if(h==="edit"){i=g.cloneNode(false);C.addClass(i,M.EDIT_BUTTON);i.innerHTML="edit";f.on(i,"click",function(l){this.edit(l);this.fireEvent(W,l);},this,true);Y.appendChild(i);this.controls={edit:i,container:Y};}else{k=g.cloneNode(false);j=g.cloneNode(false);C.addClass(k,M.CANCEL_BUTTON);C.addClass(j,M.SAVE_BUTTON);k.innerHTML="cancel";j.innerHTML="save";f.on(k,"click",function(l){this.cancel(l);this.fireEvent(K,l);},this,true);f.on(j,"click",function(l){this.save(l);this.fireEvent(F,l);},this,true);Y.appendChild(k);Y.appendChild(j);this.controls={cancel:k,save:j,container:Y};}},_addEditControl:function(){this._createControls("edit");var g=this.get("element"),Y=this.controls;g.appendChild(Y.container);},_getValue:function(){var Y=this.get("htmlValue"),g=this.get("selectableValues"),i,h;if(V.isObject(g)){for(i in g){if(i==Y){h=g[i];break;}}}else{h=Y;}return h;},_setValue:function(h){var Y=this.get("selectableValues"),g;if(V.isObject(Y)){for(g in Y){if(Y[g]==h){this.set("htmlValue",g);break;}}}else{this.set("htmlValue",h);}},_getSaveKeys:function(Y,g){if(!V.isObject(g)){if(this.get("type")==="textarea"){g={ctrl:true,keys:[13]};}else{g={keys:[13]};}}return g;},_getCancelKeys:function(Y,g){if(!V.isObject(g)){g={keys:[27]};}return g;},init:function(h,Y){var g=C.get(h);if(!g){D.log("Inline Editor element not found","error");return false;}Y=Y||{};this.setAttributeConfig("id",{value:C.generateId(),readOnly:true});this.setAttributeConfig("element",{value:g,readOnly:true});this.setAttributeConfig("type",{validator:J,value:Y.type||Q.TYPE});this.setAttributeConfig("fieldName",{validator:V.isString,value:Y.fieldName||Q.FIELD_NAME});this.setAttributeConfig("fieldGenerator",{validator:V.isFunction,value:Y.fieldGenerator||Q.FIELD_GENERATOR});this.setAttributeConfig("htmlValue",{value:g.innerHTML});this.setAttributeConfig("value",{getter:this._getValue,method:this._setValue});this.setAttributeConfig("selectableValues",{validator:V.isObject,value:V.isObject(Y.selectableValues)?Y.selectableValues:Q.SELECTABLE_VALUES});this.setAttributeConfig("allowEmpty",{value:V.isBoolean(Y.allowEmpty)?Y.allowEmpty:Q.ALLOW_EMPTY});this.setAttributeConfig("processBeforeRead",{validator:V.isFunction,value:V.isFunction(Y.processBeforeRead)?Y.processBeforeRead:Q.PROCESS_BEFORE_READ_METHOD});this.setAttributeConfig("processBeforeSave",{validator:V.isFunction,value:V.isFunction(Y.processBeforeSave)?Y.processBeforeSave:Q.PROCESS_BEFORE_SAVE_METHOD});this.setAttributeConfig("validator",{validator:V.isFunction,value:V.isFunction(Y.validator)?Y.validator:Q.VALIDATION_METHOD});this.setAttributeConfig("saveKeys",{validator:V.isObject,getter:this._getSaveKeys,value:V.isObject(Y.saveKeys)?Y.saveKeys:null});this.setAttributeConfig("cancelKeys",{validator:V.isObject,getter:this._getCancelKeys,value:V.isObject(Y.cancelKeys)?Y.cancelKeys:null});this.setAttributeConfig("animOnMouseover",{validator:V.isBoolean,value:V.isBoolean(Y.animOnMouseover)?Y.animOnMouseover:Q.ANIM_ON_MOUSEOVER});this.setAttributeConfig("animToColor",{validator:V.isString,value:V.isString(Y.animToColor)?Y.animToColor:Q.ANIM_TO_COLOR});this.setAttributeConfig("animFromColor",{validator:V.isString,value:V.isString(Y.animFromColor)?Y.animFromColor:Q.ANIM_FROM_COLOR});this._addEditControl();this._setEditable();}});})();YAHOO.register("inlineeditor",YAHOO.widget.InlineEditor,{version:"@VERSION@",build:"@BUILD@"});