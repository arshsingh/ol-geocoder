(function(e,t){"use strict";this.Geocoder=function(){var s=function(e,t){var r=new s.Nominatim(this,t);this.layer=r.layer,ol.control.Control.call(this,{element:r.els.container}),this.set("geocoder","")};return ol.inherits(s,ol.control.Control),s.prototype.getSource=function(){return this.layer.getSource()},function(e){e.Nominatim=function(t,s){this.geocoder=t,this.feature_increment=0,this.layer_name="geocoder-nominatim-"+(new Date).getTime().toString(36),this.layer=new ol.layer.Vector({name:this.layer_name,source:new ol.source.Vector});var n={provider:"osm",keepOpen:!1};this.options=r.mergeOptions(n,s),this.constants={class_container:"ol-geocoder",expanded_class:"ol-geocoder-search-expanded",road:"ol-geocoder-road",city:"ol-geocoder-city",country:"ol-geocoder-country"};this.createControl();return this.els=e.Nominatim.elements,this.setListeners(),this},e.Nominatim.prototype={createControl:function(){var t=r.createElement(["div",{classname:this.constants.class_container}],e.Nominatim.html);return e.Nominatim.elements={container:t,control:t.querySelector(".ol-geocoder-search"),btn_search:t.querySelector(".ol-geocoder-btn-search"),input_search:t.querySelector(".ol-geocoder-input-search"),result_container:t.querySelector(".ol-geocoder-result")},t},setListeners:function(){var e=this,t=function(){r.hasClass(e.els.control,e.constants.expanded_class)?e.collapse():e.expand()},s=function(t){if(13==t.keyCode){var s=r.htmlEscape(e.els.input_search.value);e.query(s)}};e.els.input_search.addEventListener("keydown",s,!1),e.els.btn_search.addEventListener("click",t,!1)},expand:function(){r.removeClass(this.els.input_search,"ol-geocoder-loading"),r.addClass(this.els.control,this.constants.expanded_class);var e=this.els.input_search;window.setTimeout(function(){e.focus()},100)},collapse:function(){this.els.input_search.value="",this.els.input_search.blur(),r.removeClass(this.els.control,this.constants.expanded_class),this.clearResults()},clearResults:function(e){e?this.collapse():r.removeAllChildren(this.els.result_container)},query:function(t){var s=this,n=this.els.input_search,o=e.Nominatim.providers.names,a=this.getProvider({provider:this.options.provider,key:this.options.key,query:t,lang:this.options.lang,limit:this.options.limit});this.clearResults(),r.addClass(n,"ol-geocoder-loading"),r.json(a.url,a.params).when({ready:function(){r.removeClass(n,"ol-geocoder-loading");var e;switch(s.options.provider){case o.OSM:case o.MAPQUEST:e=this.response.length>0?this.response:void 0;break;case o.PHOTON:e=this.response.features.length>0?s.photonResponse(this.response.features):void 0}if(e){s.createList(e);var t=s.geocoder.getMap().getTargetElement();t.addEventListener("click",{handleEvent:function(e){s.clearResults(!0),t.removeEventListener(e.type,this,!1)}},!1)}},error:function(){r.removeClass(n,"ol-geocoder-loading");var e=r.createElement("li","<h5>Error! No internet connection?</h5>");s.els.result_container.appendChild(e)}})},createList:function(e){var t=this,s=this.els.result_container;e.forEach(function(e){var n=t.addressTemplate(e),o='<a href="#">'+n+"</a>",a=r.createElement("li",o);a.addEventListener("click",function(r){r.preventDefault(),t.chosen(e,n)},!1),s.appendChild(a)})},addressTemplate:function(e){var t=e.address,s=[];return t.name&&s.push('<span class="'+this.constants.road+'">{name}</span>'),(t.road||t.building)&&s.push('<span class="'+this.constants.road+'">{building} {road} {house_number}</span>'),(t.city||t.town||t.village)&&s.push('<span class="'+this.constants.city+'">{postcode} {city} {town} {village}</span>'),(t.state||t.country)&&s.push('<span class="'+this.constants.country+'">{state} {country}</span>'),r.template(s.join("<br/>"),t)},chosen:function(e,t){this.options.keepOpen===!1&&this.clearResults(!0);var s=this.geocoder.getMap(),n=r.to3857([e.lon,e.lat]),o=2.388657133911758,a=500,i={coord:n,address:t},l=ol.animation.pan({duration:a,source:s.getView().getCenter()}),c=ol.animation.zoom({duration:a,resolution:s.getView().getResolution()});s.beforeRender(l,c),s.getView().setCenter(n),s.getView().setResolution(o),this.createFeature(i)},createFeature:function(t){var r=new ol.Feature({address:t.address,geometry:new ol.geom.Point(t.coord)}),s=this.featureId(),n=this.options.featureStyle||e.Nominatim.featureStyle;this.addLayer(),r.setStyle(n),r.setId(s),this.getSource().addFeature(r),this.geocoder.set("geocoder",s)},featureId:function(){return"geocoder-"+ ++this.feature_increment},photonResponse:function(e){var t=e.map(function(e){var t={lon:e.geometry.coordinates[0],lat:e.geometry.coordinates[1],address:{name:e.properties.name,city:e.properties.city,state:e.properties.state,country:e.properties.country}};return t});return t},getSource:function(){return this.layer.getSource()},addLayer:function(){var e,t=this,r=this.geocoder.getMap();r.getLayers().forEach(function(r){e=r===t.layer?!0:!1}),e===!1&&r.addLayer(this.layer)},getProvider:function(t){var r=e.Nominatim.providers[t.provider],s=e.Nominatim.providers.names,n=["de","it","fr","en"];return r.params.q=t.query,r.params.limit=t.limit||r.params.limit,t.provider==s.MAPQUEST&&(r.params.key=t.key),t.provider==s.PHOTON?(t.lang=t.lang.toLowerCase(),r.params.lang=n.indexOf(t.lang)>-1?t.lang:r.params.lang):r.params["accept-language"]=t.lang||r.params["accept-language"],r}},e.Nominatim.elements={},e.Nominatim.providers={names:{OSM:"osm",MAPQUEST:"mapquest",PHOTON:"photon"},osm:{url:"http://nominatim.openstreetmap.org/search/",params:{format:"json",q:"",addressdetails:1,limit:10,"accept-language":"en-US"}},mapquest:{url:"http://open.mapquestapi.com/nominatim/v1/search.php",params:{key:"",format:"json",q:"",addressdetails:1,limit:10,"accept-language":"en-US"}},photon:{url:"http://photon.komoot.de/api/",params:{q:"",limit:10,lang:"en"}}},e.Nominatim.featureStyle=[new ol.style.Style({image:new ol.style.Icon({scale:.7,anchor:[.5,1],src:"//cdn.rawgit.com/jonataswalker/map-utils/master/images/marker.png"}),zIndex:5}),new ol.style.Style({image:new ol.style.Circle({fill:new ol.style.Fill({color:[235,235,235,1]}),stroke:new ol.style.Stroke({color:[0,0,0,1]}),radius:5}),zIndex:4})],e.Nominatim.html=['<div class="ol-geocoder-search ol-control">','<button class="ol-geocoder-btn-search"></button>','<input type="text" class="ol-geocoder-input-search">',"</div>",'<ul class="ol-geocoder-result"></ul>'].join("")}(s),function(e,t){var n=function(){var t=!1;if(e.XMLHttpRequest)t=new XMLHttpRequest;else if(e.ActiveXObject)try{t=new ActiveXObject("Msxml2.XMLHTTP")}catch(r){try{t=new ActiveXObject("Microsoft.XMLHTTP")}catch(r){t=!1}}return t};s.Utils={whiteSpaceRegex:/\s+/,json:function(e,t){function r(){200===c.status&&u.ready.call({response:JSON.parse(c.response)})}function s(){u.error.call({response:"Can't xhr on url: "+e})}function o(){}if(t&&"object"==typeof t){var a="",i=encodeURIComponent;for(var l in t)a+="&"+i(l)+"="+i(t[l]);t=a.slice(1),e+=(/\?/.test(e)?"&":"?")+t}var c=n(),u={};return c.open("GET",e,!0),c.setRequestHeader("Accept","application/json"),c.onload=r,c.onerror=s,c.onprogress=o,c.send(null),{when:function(e){u.ready=e.ready,u.error=e.error}}},to3857:function(e){return ol.proj.transform([parseFloat(e[0]),parseFloat(e[1])],"EPSG:4326","EPSG:3857")},to4326:function(e){return ol.proj.transform([parseFloat(e[0]),parseFloat(e[1])],"EPSG:3857","EPSG:4326")},classRegex:function(e){return new RegExp("(^|\\s+)"+e+"(\\s+|$)")},_addClass:function(e,t){e.classList?e.classList.add(t):e.className=(e.className+" "+t).trim()},addClass:function(e,t){if(Array.isArray(e))return void e.forEach(function(e){r.addClass(e,t)});for(var s=Array.isArray(t)?t:t.split(r.whiteSpaceRegex),n=s.length;n--;)r.hasClass(e,s[n])||r._addClass(e,s[n])},_removeClass:function(e,t){e.classList?e.classList.remove(t):e.className=e.className.replace(r.classReg(t)," ").trim()},removeClass:function(e,t){if(Array.isArray(e))return void e.forEach(function(e){r.removeClass(e,t)});for(var s=Array.isArray(t)?t:t.split(r.whiteSpaceRegex),n=s.length;n--;)r.hasClass(e,s[n])&&r._removeClass(e,s[n])},hasClass:function(e,t){return e.classList?e.classList.contains(t):r.classReg(t).test(e.className)},toggleClass:function(e,t){return Array.isArray(e)?void e.forEach(function(e){r.toggleClass(e,t)}):void(e.classList?e.classList.toggle(t):r.hasClass(e,t)?r._removeClass(e,t):r._addClass(e,t))},$:function(e){return e="#"===e[0]?e.substr(1,e.length):e,t.getElementById(e)},isElement:function(t){return"HTMLElement"in e?!!t&&t instanceof HTMLElement:!!t&&"object"==typeof t&&1===t.nodeType&&!!t.nodeName},getAllChildren:function(e,t){return[].slice.call(e.getElementsByTagName(t))},emptyArray:function(e){for(;e.length;)e.pop()},removeAllChildren:function(e){for(;e.firstChild;)e.removeChild(e.firstChild)},removeAll:function(e){for(var t;t=e[0];)t.parentNode.removeChild(t)},getChildren:function(e,t){return[].filter.call(e.childNodes,function(e){return t?1==e.nodeType&&e.tagName.toLowerCase()==t:1==e.nodeType})},template:function(e,t){var r=this;return e.replace(/\{ *([\w_-]+) *\}/g,function(e,s){var n=void 0===t[s]?"":t[s];return r.htmlEscape(n)})},htmlEscape:function(e){return String(e).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;").replace(/'/g,"&#039;")},mergeOptions:function(e,t){var r={};for(var s in e)r[s]=e[s];for(var s in t)r[s]=t[s];return r},createElement:function(e,r){var s;if(Array.isArray(e)){if(s=t.createElement(e[0]),e[1].id&&(s.id=e[1].id),e[1].classname&&(s.className=e[1].classname),e[1].attr){var n=e[1].attr;if(Array.isArray(n))for(var o=-1;++o<n.length;)s.setAttribute(n[o].name,n[o].value);else s.setAttribute(n.name,n.value)}}else s=t.createElement(e);s.innerHTML=r;for(var a=t.createDocumentFragment();s.childNodes[0];)a.appendChild(s.childNodes[0]);return s.appendChild(a),s}}}(e,t),s}();var r=Geocoder.Utils}).call(this,window,document);