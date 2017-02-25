/*jsl:option explicit*/
/*
Utility Functions
copyright 2008 - 2011 Brett Knights.
This EULA grants you the following rights:
Installation and Use. You may install and use an unlimited number of copies of the SOFTWARE PRODUCT.
Reproduction and Distribution. You may reproduce and distribute an unlimited number of copies of the SOFTWARE PRODUCT
either in whole or in part; each copy should include all copyright and trademark notices, and shall be accompanied by a copy of this EULA.
Copies of the SOFTWARE PRODUCT may be distributed as a standalone product or included with your own product.
Commercial Use. You may sell for profit and freely distribute scripts and/or compiled scripts that were created with the SOFTWARE PRODUCT.

For permission, contact brett@knightsofthenet.com

*/


KOTNUtil = (function(){

if(!this.JSON){this.JSON={};}(function(){function f(n){return n<10?"0"+n:n;}if(typeof Date.prototype.toJSON!=="function"){Date.prototype.toJSON=function(key){return isFinite(this.valueOf())?this.getUTCFullYear()+"-"+f(this.getUTCMonth()+1)+"-"+f(this.getUTCDate())+"T"+f(this.getUTCHours())+":"+f(this.getUTCMinutes())+":"+f(this.getUTCSeconds())+"Z":null;};String.prototype.toJSON=Number.prototype.toJSON=Boolean.prototype.toJSON=function(key){return this.valueOf();};}var cx=/[\u0000\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g,escapable=/[\\\"\x00-\x1f\x7f-\x9f\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g,gap,indent,meta={"\b":"\\b","\t":"\\t","\n":"\\n","\f":"\\f","\r":"\\r",'"':'\\"',"\\":"\\\\"},rep;function quote(string){escapable.lastIndex=0;return escapable.test(string)?'"'+string.replace(escapable,function(a){var c=meta[a];return typeof c==="string"?c:"\\u"+("0000"+a.charCodeAt(0).toString(16)).slice(-4);})+'"':'"'+string+'"';}function str(key,holder){var i,k,v,length,mind=gap,partial,value=holder[key];if(value&&typeof value==="object"&&typeof value.toJSON==="function"){value=value.toJSON(key);}if(typeof rep==="function"){value=rep.call(holder,key,value);}switch(typeof value){case"string":return quote(value);case"number":return isFinite(value)?String(value):"null";case"boolean":case"null":return String(value);case"object":if(!value){return"null";}gap+=indent;partial=[];if(Object.prototype.toString.apply(value)==="[object Array]"){length=value.length;for(i=0;i<length;i+=1){partial[i]=str(i,value)||"null";}v=partial.length===0?"[]":gap?"[\n"+gap+partial.join(",\n"+gap)+"\n"+mind+"]":"["+partial.join(",")+"]";gap=mind;return v;}if(rep&&typeof rep==="object"){length=rep.length;for(i=0;i<length;i+=1){k=rep[i];if(typeof k==="string"){v=str(k,value);if(v){partial.push(quote(k)+(gap?": ":":")+v);}}}}else{for(k in value){if(Object.hasOwnProperty.call(value,k)){v=str(k,value);if(v){partial.push(quote(k)+(gap?": ":":")+v);}}}}v=partial.length===0?"{}":gap?"{\n"+gap+partial.join(",\n"+gap)+"\n"+mind+"}":"{"+partial.join(",")+"}";gap=mind;return v;}}if(typeof JSON.stringify!=="function"){JSON.stringify=function(value,replacer,space){var i;gap="";indent="";if(typeof space==="number"){for(i=0;i<space;i+=1){indent+=" ";}}else{if(typeof space==="string"){indent=space;}}rep=replacer;if(replacer&&typeof replacer!=="function"&&(typeof replacer!=="object"||typeof replacer.length!=="number")){throw new Error("JSON.stringify");}return str("",{"":value});};}if(typeof JSON.parse!=="function"){JSON.parse=function(text,reviver){var j;function walk(holder,key){var k,v,value=holder[key];if(value&&typeof value==="object"){for(k in value){if(Object.hasOwnProperty.call(value,k)){v=walk(value,k);if(v!==undefined){value[k]=v;}else{delete value[k];}}}}return reviver.call(holder,key,value);}cx.lastIndex=0;if(cx.test(text)){text=text.replace(cx,function(a){return"\\u"+("0000"+a.charCodeAt(0).toString(16)).slice(-4);});}if(/^[\],:{}\s]*$/.test(text.replace(/\\(?:["\\\/bfnrt]|u[0-9a-fA-F]{4})/g,"@").replace(/"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g,"]").replace(/(?:^|:|,)(?:\s*\[)+/g,""))){j=eval("("+text+")");return typeof reviver==="function"?walk({"":j},""):j;}throw new SyntaxError("JSON.parse");};}}());
// "


	function _unique(arr){
		var u = [];
		noadd : for(var i = 0; i< arr.length;i++){
			for(var k = 0; k< u.length; k++){
				if(arr[i] == u[k]) continue noadd;
			}
			u.push(arr[i]);
		}
		return u;
	}


	function _foldL(init, arr, fcn){
		if(! arr) return init;
		var x = init;
		for(var f in arr){
				x = fcn(x, arr[f]);
		}
		return x;
	}


	function _each(arr, fcn){ // mimics jQuery each. no more redef of i!
		if (!arr || arr.length === 0) return;
		for(var i in arr){
			var x = fcn.call(arr[i], i, arr[i]);
			if(typeof x != 'undefined' && !(x)) break;
		}
	}

	function _map(arr, fcn){
		if (!arr || arr.length === 0) return [];
		var result = [];
		for(var i in arr){
			var x = fcn.call(arr[i], i, arr[i]);
			if(typeof x !== 'undefined' && x !== null) result.push(x);
		}
		return result;
	}


	function _find(arr, fcn){ // finds first item
		if (!arr || arr.length === 0) return null;
		for(var i in arr){
			if(arr[i] && fcn.call(arr[i], i, arr[i])) return arr[i];
		}
		return null;
	}

		return {

			toJSON: function(target){return JSON.stringify(target).replace(/:(\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}Z)/g, ':"$1"');},
			sendJSResponse: function (request, response, respObject){
					var startTime = new Date().getTime();
					response.setContentType('JAVASCRIPT');
					var callbackFcn = request.getParameter("jsoncallback");
					if(callbackFcn){
						response.writeLine( callbackFcn + "(" + this.toJSON(respObject) + ");");
					}else response.writeLine(this.toJSON(respObject));
					nlapiLogExecution("DEBUG", "sendJSResponse", (new Date().getTime() - startTime) +" ms");
			},
			each: _each,
			find: _find,
			foldLeft: _foldL,
			map: _map,
			unique: _unique
		};


})();