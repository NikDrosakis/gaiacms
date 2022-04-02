/*updated:2020-02-11 12:34:53 gaia - v.0.73 - Author:Nikos Drosakis - License: GPL License*/
/*
 gaiajs v0.04
UPDATES
 needs libs.js to run
 groups all functions in 7 categories
 1. g.webstorage
 2. g.vars
 3. g.gen mostly functions from generic.php
 4. g.db
 5. g.file
 6. g.ui (form,table)
 7. g.api
 8. g.setup
 9. g.media
 10.g.init
 11. g.json
*/
( function( global, factory ) {
    "use strict";
    if ( typeof module === "object" && typeof module.exports === "object" ) {
        module.exports = global.document ?
            factory( global, true ) :
            function( w ) {
                if ( !w.document ) {
                    throw new Error( "gaia requires a window with a document" );
                }
                return factory( w );
            };
    } else {
        factory( global );
    }	
// Pass this if window is not defined yet
} )( typeof window !== "undefined" ? window : this, function( window, noGlobal ) {

    /*
     * page compatibility
     * */
    if (/MSIE (\d+\.\d+);/.test(navigator.userAgent)) {
        var ieversion = new Number(RegExp.$1);
        if (ieversion <= 7) {
            g.alert("Version is not compatible. Please, update Internet Explorer.");
        }
    }
    ;
    /*
     FIXES OLD BROWSERS
     */
    if (typeof String.prototype.trim !== 'function') {
        String.prototype.trim = function () {
            return this.replace(/^\s+|\s+$/g, '');
        }
    }
    ;
    //check for enabled cookies
    if (navigator.cookieEnabled == false) {
        g.alert("Please, enable cookies from your browser settings to continue.");
    }

//set g
    var g = {};
    // WEB STORAGE
    // cookies and session functions
    // - cookie (get | set | expires | clear | delete)
    // - session (get | set | unset | clear)
    // - local (get | set | unset | clear)
    // todo clean out cookie expires
    g.webstorage = {
        name : "",
        cookie: {
            get: function (name, r) {
                return (r = RegExp('(^|; )' + encodeURIComponent(name) + '=([^;]*)').exec(document.cookie)) ? r[2] : false;
            },
            set: function (name, value,time,domain) {
                var dmn= !domain ? ((g.serverbase()) ? ";domain=" + g.serverbase() : "") : ";domain=" + domain;
                if (document.cookie.indexOf(name) >= 0) {this.clear(name);}
                var now = new Date(),nowtime = now.getTime(),expireTime = !time ? nowtime+ 1000*36000*1000 : nowtime + (time*1000);now.setTime(expireTime);
                var secured=location.protocol == 'https:' ? "path=/;SameSite=None;secure;":"";
				document.cookie = name + "=" + value + ";expires=" + now.toUTCString() +" "+ dmn + ";"+secured;				
                return true;
            },            
			expires: function (name, value, expires, path) {
                if (document.cookie.indexOf(name) >= 0) {
                    document.cookie = name + "=" + value + "; expires=" + expires + "; path=/;SameSite=None;secure";
                }
            },
            clear: function (name) {
                if (document.cookie.indexOf(name) >= 0) {
                    document.cookie = name + "=; expires=Thu, 01 Jan 1970 00:00:00 UTC";
                }
            },
            delete: function (name) {
                if (this.get(name)) {
                    document.cookie = name + "=" +
                        ";path=/" +
                        ((g.serverbase()) ? ";domain=" + g.serverbase() : "") +
                        ";expires=Thu, 01 Jan 1970 00:00:01 GMT";
                    return true;
                }
            },
            deleteAll: function (except) {
                var cookies = document.cookie.split(";");

                for (var i = 0; i < cookies.length; i++) {
                    var cookie = cookies[i];
                    var eqPos = cookie.indexOf("=");
                    var name = eqPos > -1 ? cookie.substr(0, eqPos).trim() : cookie.trim();
                    if (!g.inlist(name, except)) {
                        //g.l(name)
                        this.delete(name);
                    }
                }
            }
        },
        //sessionStorage update with Chainable (Cascading) Methods
        session: {
            'get': function (name) {
                if (sessionStorage.getItem(name)) {
                    return sessionStorage.getItem(name);
                }else{
                    return false;
                }
            },
            'set': function (name, value) {
                sessionStorage.setItem(name, value);
            },
            'unset': function (name) {
				if(Array.isArray(name)){for(var i in name){sessionStorage.removeItem(name[i]);}
				}else{sessionStorage.removeItem(name);}
            },
            'clear': function () {
                sessionStorage.clear();
            }
        },
        //sessionStorage
        local: {
            'get': function (name) {
                if (localStorage.getItem(name)) {
                    return localStorage.getItem(name);
                } else {
                    return false;
                }
            },
            'set': function (name, value) {
                localStorage.setItem(name, value);
            },
            'unset': function (name) {
                if(Array.isArray(name)){for(var i in name){localStorage.removeItem(name[i]);}
				}else{localStorage.removeItem(name);}
            },
            'clear': function (name) {
                localStorage.clear();
            }
        }
    };

    g.vars = {
        get: typeof GS!='undefined' ? GS :'',
        phptimestamp: function () {
            // var time= typeof timestamp!='undefined' ? jstimestamp: Date.now();
            return Math.floor(Date.now() / 1000);
        },
        hash_target: window.location.hash.split('#')[1],
        ajaxfile: '/gaia/gajax.php',
        clijax: '/gaia/dsh/clijax.php',
        // siteurl: GS.REFERER+ window.location.host + '/',
        hostArray: window.location.host.split('.'),
        host: function () {
            if (this.hostArray[0] == 'www') {
                this.hostArray.splice(0, 1);
            }
            return this.hostArray.join('.');
        },
        // pathExt: window.location.host.toString().split('.')[0] == 'm' ? window.location.host.toString().split('.')[2]  //mobile m.
        //     : (typeof window.location.host.toString().split('.')[2] != 'undefined' //com.au
        //         ? window.location.host.toString().split('.')[1] + '.' + host.toString().split('.')[2]
        //         : window.location.host.toString().split('.')[1]),
        country: typeof window.location.host.toString().split('.')[2] != 'undefined'
            ? window.location.host.toString().split('.')[2]
            : window.location.host.toString().split('.')[1],
        serverbase: function () {
            return this.hostArray.length == 3 ? this.hostArray[1] + "." + this.hostArray[2] : window.location.host
        },
        path: {
            plugins: '/plugins/',
            images: '/gaia/img/',
            uploads: '/media/',
            thumbs: '/media/thumbs/',
            modules: '/modules/',
            templates: '/templates/',
            ajax: '/gaia/gajax.php',
            css: '/gaia/css/',
            lib: '/gaia/lib/',
        },
        curdir: window.location.href.toString().split('/')[3],
        urlfile: typeof window.location.href.toString().split('/')[3] == 'undefined'
            ? window.location.href.toString().split('/')[2]
            : window.location.href.toString().split('/')[3],
        url: window.location.pathname,
        lastget: function () {
            return window.location.pathname.substring(this.url.lastIndexOf('/') + 1);
        },
        my: typeof g.GS != "undefined" ? g.GS.my : '',
        lang: !g.webstorage.cookie.get('LANG') ? (typeof g.GS != "undefined" ? g.GS.my.lang : 'en') : g.webstorage.cookie.get('LANG'),
        loc: window.country
    };

    g.gen = {
        _: function (selector) {
            return document.querySelector(selector);
        },
        i:function(val){return parseInt(val)},
        isWorkersAvailable: function() {
            return !!window.Worker;
        },
        eval : function (action){
            return eval(action);
        },
        randomove: function(moves){return moves[Math.floor(Math.random()*moves.length)];},
        array_diff : function  (a1, a2) {
            var a = [], diff = [];
            for (var i = 0; i < a1.length; i++) {
                a[a1[i]] = true;
            }
            for (var i = 0; i < a2.length; i++) {
                if (a[a2[i]]) {
                    delete a[a2[i]];
                } else {
                    a[a2[i]] = true;
                }
            }
            for (var k in a) {
                diff.push(k);
            }
            return diff;
        },
        changeObjkey: function(obj,key,newkey,del){
            if(del==true) {delete obj[key];}else {Object.defineProperty(obj, newkey,Object.getOwnPropertyDescriptor(obj, key));delete obj[key];}return obj;
        },
        changekey: function(ar,key,newkey,del){
            if(del==true){
                delete ar[key];
            }else {
                ar[key] = ar[newkey];
                delete ar[key];
            }
            return ar;
        },
        getkey:function(obj,val){
            for( var prop in obj) {
                if( obj.hasOwnProperty( prop ) ) {
                    if( obj[ prop ] === val )
                        return prop;
                }
            }
        },
        isJS : function (url) {
            var scripts = document.getElementsByTagName('script');
            for (var i = scripts.length; i--;) {
                if (scripts[i].src == url) return true;
            }
            return false;
        },
        isCSS : function (url) {
            var scripts = document.getElementsByTagName('link');
            for (var i = scripts.length; i--;) {
                if (scripts[i].href == url) return true;
            }
            return false;
        },
        loadJS: function (url, div, callback) {
            if(!this.isJS(url)) {
                var div = typeof(div) != 'undefined' ? div : 'head';
                // Adding the script tag to the head as suggested before
                var head = document.getElementsByTagName(div)[0];
                var script = document.createElement('script');
                script.type = 'text/javascript';
                script.src = url;
                // Then bind the event to the callback function.
                // There are several events for cross browser compatibility.
                script.onreadystatechange = callback;
                script.onload = callback;
                head.appendChild(script);
            }
        },
        loadExt: function(ext,callback){
            this.loadJS('/gaia/js/ext/'+ext+'.js','head',callback);
        },
        loadCSS: function (url, callback) {
            if(!this.isCSS(url)) {
                // Adding the script tag to the head as suggested before
                var head = document.getElementsByTagName('head')[0];
                var script = document.createElement('link');
                script.type = 'text/css';
                script.rel = 'stylesheet';
                script.href = url;
                // Then bind the event to the callback function.
                // There are several events for cross browser compatibility.
                script.onreadystatechange = callback;
                script.onload = callback;
                head.appendChild(script);
            }
        },
        redirect: function(url){
            location.href=url;
        },
        htmlentities: {
            //Converts a string to its html characters completely.
            // @param {String} str String with unescaped HTML characters
            encode: function (str) {
                var buf = [];

                for (var i = str.length - 1; i >= 0; i--) {
                    buf.unshift(['&#', str[i].charCodeAt(), ';'].join(''));
                }

                return buf.join('');
            },
            /**
             * Converts an html characterSet into its original character.
             *
             * @param {String} str htmlSet entities
             **/
            decode: function (str) {
                return str.replace(/&#(\d+);/g, function (match, dec) {
                    return String.fromCharCode(dec);
                });
            }
        },
        fetch: function(file,callback){
            fetch(file).then(function (response) {
           return response.json();
           })
           .then(callback);
        },
//        .then(function (response) {
//            return response.text();
//        })
//        .then(function (body) {
//           log(body);
//            var duration= startime - s.phptimestamp();
//            log(duration)
//        });
        // AJAX (faster than  AJAX REQUEST updated with object params and callback
        ajax: function (file, params, method, append) {
            //var echo_div;
            if (window.XMLHttpRequest) {
                // code for IE7+, Firefox, Chrome, Opera, Safari
                xmlhttp = new XMLHttpRequest();
            } else { // code for IE6, IE5
                xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
            }
            if (typeof append != 'undefined') {
                xmlhttp.onreadystatechange = function () {
                    if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
                        $(append).html(xmlhttp.responseText);
                    }
                }
            }
            var method = typeof method != 'undefined' ? method : 'GET';
            // params= {a:5,b:4}
            var res = [];
            for (var i in params) {
                res.push(i + '=' + params[i]);
            }
            ;
            var request = file + '?' + res.join('&');
            xmlhttp.open(method, request, true);
            xmlhttp.send();
        },
	    cors : function (url, params,callback,method) {
        var method=!method ? "GET" : method;
        $.ajax({
            method: method,
            data:params,
            url:url,
            // headers: {
            //     "My-First-Header":"first value",
            //     "My-Second-Header":"second value"
            // }
            // dataType: 'html',
            xhrFields: {
                withCredentials: true
            },
            crossDomain: true,
            success:callback
        });
     },
/*       cors :function (url, params,callback,method,contentType) {
            var method=!method ? "GET" : method;
			var type=!contentType ? "application/json;charset=utf-8": contentType;
           $.ajax({
               method: method,
               data:params,
               contentType: type,
               url:url,
		//	   headers: {				   
			//	   'Access-Control-Allow-Origin': 'https://aimd5.com',
				//  "Authorization": "Basic "+ btoa(g.cookie.get('GSID') + g.cookie.get('sp')),
				   //'Access-Control-Allow-Methods':'GET,POST,OPTIONS',
				 //'Access-Control-Allow-Headers':'x-requested-with, Content-Type, origin, authorization, accept, client-security-token',
                  //"Access-Control-Allow-Credentials" : true  
				   //},			                 
               // dataType: 'html',
           //     dataType: 'json',
                xhrFields: {
                    withCredentials: false
                },
               crossDomain: true,
               success:callback,
               error:callback
           });
        }, */
        worker : function(file, args,callback,id) {
        if(g.isWorkersAvailable) {
            window['worker'+id] = new Worker(file);
            window['worker'+id].onerror = function (e) {
                throw new Error(e.message + " (" + e.filename + ":" + e.lineno + ")");
            };
            window['worker'+id].postMessage(args);
            window['worker'+id].onmessage = callback;
            // g.l('worker'+id);
        }
        },
        l: function (val, color, background) {
            if (window.console)
                if(window.navigator.userAgent.indexOf("Edge") > -1){
                    return console.log(val);
                }else {
                    if (typeof val == 'object') {
                        return console.dir(val);
                    } else {
                        var col = typeof (color) != 'undefined' ? color : '#111900';
                        var bg = typeof (background) != 'undefined' ? background : '#fff';
                        return console.log('%c' + val, 'background: ' + bg + '; color:' + col);
                    }
                }
        },
        divid: function (id) {
            return document.getElementById(id);
        },
        isInt: function (n) {
            return n % 1 === 0;
        },
        hash: function () {
            function s4() {
                return Math.floor((1 + Math.random()) * 0x10000)
                    .toString(26)
                    .substring(1);
            }

            return s4() + s4() + s4() + s4() + s4() + s4() + s4() + s4();
        },
        //objects size
        size : function(obj) {
            var size = 0, key;
            for (key in obj) {
                if (obj.hasOwnProperty(key)) size++;
            }
            return size;
        },
        time_diff: function (timestamp) {
            //now
            var current = Date.now();
            var jstimestamp = timestamp * 1000;

            var msnow = 15 * 1000;
            var msPerMinute = 60 * 1000;
            var msPerHour = msPerMinute * 60;
            var msPerDay = msPerHour * 24;
            var msPerMonth = msPerDay * 30;
            var msPerYear = msPerDay * 365;
            var elapsed = current - jstimestamp;
            //return elapsed;
            if (elapsed < 0) {
                var future = jstimestamp - current;
                if (future < msPerMinute) {
                    return Math.round(future / 1000) + ' ' + dic.SECONDS;
                }
                else if (future < msPerHour) {
                    return Math.round(future / msPerMinute) + ' ' + dic.MINUTES;
                }
                else if (future < msPerDay) {
                    return Math.round(future / msPerHour) + ' ' + dic.HOURS;
                }
                else if (future < msPerMonth) {
                    return Math.round(future / msPerDay) + ' ' + dic.DAYS;
                }
                else if (future < msPerYear) {
                    return 'approx ' + Math.round(future / msPerMonth) + ' ' + dic.MONTHS;
                }
                else {
                    return 'approx ' + Math.round(future / msPerYear) + ' ' + dic.YEARS1;
                }
            } else {
                if (elapsed < msPerMinute) {
                    return Math.round(elapsed / 1000) + ' ' + dic.SECONDS + ' ' + dic.AGO;
                }
                else if (elapsed < msPerHour) {
                    return Math.round(elapsed / msPerMinute) + ' ' + dic.MINUTES + ' ' + dic.AGO;
                }
                else if (elapsed < msPerDay) {
                    return Math.round(elapsed / msPerHour) + ' ' + dic.HOURS + ' ' + dic.AGO;
                }
                else if (elapsed < msPerMonth) {
                    return Math.round(elapsed / msPerDay) + ' ' + dic.DAYS + ' ' + dic.AGO;
                }
                else if (elapsed < msPerYear) {
                    return 'approx ' + Math.round(elapsed / msPerMonth) + ' ' + dic.MONTHS + ' ' + dic.AGO;
                }
                else {
                    return 'approx ' + Math.round(elapsed / msPerYear) + ' ' + dic.YEARS1 + ' ' + dic.AGO;
                }
            }
        },
        vareplace: function (string, value) {
            var res = string.match(/@[a-z_-]+/g);
            var res1 = res != null ? res[0].substr(1) : '';
            var value = typeof value != 'object' ? value : value[res1];
            return string.replace(/@[a-z_-]+/g, value);
        },
        chrono: function () {
            var startTime = 0;
            var start = 0;
            var end = 0;
            var diff = 0;
            var timerID = 0;
            end = new Date();
            diff = end - start;
            diff = new Date(diff);
            var sec = diff.getSeconds();
            var min = diff.getMinutes();
            var hr = min > 59 ? 1 : 0;
            var day = hr > 23 ? 1 : 0;
            //need to reset to 2
            if (min < 10) {
                min = "0" + min;
            }
            if (sec < 10) {
                sec = "0" + sec;
            }
            document.getElementById("chronotime").innerHTML = (day != 0 ? (day + ":") : "") + (hr != 0 ? (hr + ":") : "") + ( min != 0 ? (min + ":" ) : "") + sec;
            timerID = setTimeout("chrono()", 1000);
        },
        link_exist: function (image_url) {
            var http = new XMLHttpRequest();
            if (image_url != '/media/null') {
                http.open('HEAD', image_url, false);
                http.send();
                return http.status != 404;
            }
        },
        array_combine: function (keys, values) {
            var new_array = {},
                keycount = keys && keys.length,
                i = 0;
            // input sanitation
            if (typeof keys !== 'object' || typeof values !== 'object' || // Only accept arrays or array-like objects
                typeof keycount !== 'number' || typeof values.length !== 'number' || !keycount) { // Require arrays to have a count
                return false;
            }
            // number of elements does not match
            if (keycount != values.length) {
                return false;
            }
            for (i = 0; i < keycount; i++) {
                new_array[keys[i]] = values[i];
            }
            return new_array;
        },

        explode: function (delimiter, string, limit) {
            if (arguments.length < 2 || typeof delimiter === 'undefined' || typeof string === 'undefined') return null;
            if (delimiter === '' || delimiter === false || delimiter === null) return false;
            if (typeof delimiter === 'function' || typeof delimiter === 'object' || typeof string === 'function' || typeof string ==='object') {
                return {
                    0: ''
                };
            }
            if (delimiter === true) delimiter = '1';
            delimiter += '';
            string += '';
            var s = string.split(delimiter);
            if (typeof limit === 'undefined') return s;
            // Support for limit
            if (limit === 0) limit = 1;
            // Positive limit
            if (limit > 0) {
                if (limit >= s.length) return s;
                return s.slice(0, limit - 1)
                    .concat([s.slice(limit - 1)
                        .join(delimiter)
                    ]);
            }
            // Negative limit
            if (-limit >= s.length) return [];
            s.splice(s.length + limit);
            return s;
        },

        implode: function (glue, pieces) {
            var i = '',
                retVal = '',
                tGlue = '';
            if (arguments.length === 1) {
                pieces = glue;
                glue = '';
            }
            if (typeof pieces === 'object') {
                if (Object.prototype.toString.call(pieces) === '[object Array]') {
                    return pieces.join(glue);
                }
                for (i in pieces) {
                    retVal += tGlue + pieces[i];
                    tGlue = glue;
                }
                return retVal;
            }
            return pieces;
        },

        array_unique: function (inputArr) {
            var key = '',
                tmp_arr2 = {},
                val = '';
            var __array_search = function (needle, haystack) {
                var fkey = '';
                for (fkey in haystack) {
                    if (haystack.hasOwnProperty(fkey)) {
                        if ((haystack[fkey] + '') === (needle + '')) {
                            return fkey;
                        }
                    }
                }
                return false;
            };

            for (key in inputArr) {
                if (inputArr.hasOwnProperty(key)) {
                    val = inputArr[key];
                    if (false === __array_search(val, tmp_arr2)) {
                        tmp_arr2[key] = val;
                    }
                }
            }
            return tmp_arr2;
        },
		
        inlist: function (needle, haystack, argStrict) {
            var key = '',
                strict = !!argStrict;
            if (strict) {
                for (key in haystack) {
                    if (haystack[key] === needle) {
                        return true;
                    }
                }
            } else {
                for (key in haystack) {
                    if (haystack[key] == needle) {
                        return true;
                    }
                }
            }
            return false;
        },
        str_replace: function (search, replace, subject, countObj) {
            var i = 0
            var j = 0
            var temp = ''
            var repl = ''
            var sl = 0
            var fl = 0
            var f = [].concat(search)
            var r = [].concat(replace)
            var s = subject
            var ra = Object.prototype.toString.call(r) === '[object Array]'
            var sa = Object.prototype.toString.call(s) === '[object Array]'
            s = [].concat(s)

            var $global = (typeof window !== 'undefined' ? window : GLOBAL)
            $global.$locutus = $global.$locutus || {}
            var $locutus = $global.$locutus
            $locutus.php = $locutus.php || {}

            if (typeof (search) === 'object' && typeof (replace) === 'string') {
                temp = replace
                replace = []
                for (i = 0; i < search.length; i += 1) {
                    replace[i] = temp
                }
                temp = ''
                r = [].concat(replace)
                ra = Object.prototype.toString.call(r) === '[object Array]'
            }

            if (typeof countObj !== 'undefined') {
                countObj.value = 0
            }

            for (i = 0, sl = s.length; i < sl; i++) {
                if (s[i] === '') {
                    continue
                }
                for (j = 0, fl = f.length; j < fl; j++) {
                    temp = s[i] + ''
                    repl = ra ? (r[j] !== undefined ? r[j] : '') : r[0]
                    s[i] = (temp).split(f[j]).join(repl)
                    if (typeof countObj !== 'undefined') {
                        countObj.value += ((temp.split(f[j])).length - 1)
                    }
                }
            }
            return sa ? s : s[0]
        },
        range: function (low, high, step) {
            var matrix = [];
            var inival, endval, plus;
            var walker = step || 1;
            var chars = false;

            if (!isNaN(low) && !isNaN(high)) {
                inival = low;
                endval = high;
            } else if (isNaN(low) && isNaN(high)) {
                chars = true;
                inival = low.charCodeAt(0);
                endval = high.charCodeAt(0);
            } else {
                inival = (isNaN(low) ? 0 : low);
                endval = (isNaN(high) ? 0 : high);
            }

            plus = ((inival > endval) ? false : true);
            if (plus) {
                while (inival <= endval) {
                    matrix.push(((chars) ? String.fromCharCode(inival) : inival));
                    inival += walker;
                }
            } else {
                while (inival >= endval) {
                    matrix.push(((chars) ? String.fromCharCode(inival) : inival));
                    inival -= walker;
                }
            }
            return matrix;
        },
        greeklish: function (str) {
            var str = str.replace(/[\#\[\]\/\{\}\(\)\*\<\>\%\@\:\>\<\~\"\'\=\*\+\!\;\-\,\?\.\\\^\$\|]/g, "_");
            var greekLetters = [' ', 'α', 'β', 'γ', 'δ', 'ε', 'ζ', 'η', 'θ', 'ι', 'κ', 'λ', 'μ', 'ν', 'ξ', 'ο', 'π', 'ρ', 'σ', 'τ', 'υ', 'φ', 'χ', 'ψ', 'ω', 'A', 'Β', 'Γ', 'Δ', 'Ε', 'Ζ', 'Η', 'Θ', 'Ι', 'Κ', 'Λ', 'Μ', 'Ν', 'Ξ', 'Ο', 'Π', 'Ρ', 'Σ', 'Τ', 'Υ', 'Φ', 'Χ', 'Ψ', 'Ω', 'ά', 'έ', 'ή', 'ί', 'ό', 'ύ', 'ώ', 'ς'];
            var enLetters = ['_', 'a', 'v', 'g', 'd', 'e', 'z', 'i', 'th', 'i', 'k', 'l', 'm', 'n', 'x', 'o', 'p', 'r', 's', 't', 'u', 'f', 'h', 'ps', 'o', 'A', 'B', 'G', 'D', 'E', 'Z', 'I', 'Th', 'I', 'K', 'L', 'M', 'N', 'X', 'O', 'P', 'R', 'S', 'T', 'Y', 'F', 'Ch', 'Ps', 'O', 'a', 'e', 'i', 'i', 'o', 'u', 'o', 's'];
            return this.str_replace(greekLetters, enLetters, str);
        },
        date: function (format, timestamp) {
            var that = this;
            var jsdate, f;
            // Keep this here (works, but for code commented-out below for file size reasons)
            // var tal= [];
            var txt_words = [
                'Sun', 'Mon', 'Tues', 'Wednes', 'Thurs', 'Fri', 'Satur',
                'January', 'February', 'March', 'April', 'May', 'June',
                'July', 'August', 'September', 'October', 'November', 'December'
            ];
            // trailing backslash -> (dropped)
            // a backslash followed by any character (including backslash) -> the character
            // empty string -> empty string
            var formatChr = /\\?(.?)/gi;
            var formatChrCb = function (t, s) {
                return f[t] ? f[t]() : s;
            };
            var _pad = function (n, c) {
                n = String(n);
                while (n.length < c) {
                    n = '0' + n;
                }
                return n;
            };
            f = {
                // Day
                d: function () { // Day of month w/leading 0; 01..31
                    return _pad(f.j(), 2);
                },
                D: function () { // Shorthand day name; Mon...Sun
                    return f.l()
                        .slice(0, 3);
                },
                j: function () { // Day of month; 1..31
                    return jsdate.getDate();
                },
                l: function () { // Full day name; Monday...Sunday
                    return txt_words[f.w()] + 'day';
                },
                N: function () { // ISO-8601 day of week; 1[Mon]..7[Sun]
                    return f.w() || 7;
                },
                S: function () { // Ordinal suffix for day of month; st, nd, rd, th
                    var j = f.j();
                    var i = j % 10;
                    if (i <= 3 && parseInt((j % 100) / 10, 10) == 1) {
                        i = 0;
                    }
                    return ['st', 'nd', 'rd'][i - 1] || 'th';
                },
                w: function () { // Day of week; 0[Sun]..6[Sat]
                    return jsdate.getDay();
                },
                z: function () { // Day of year; 0..365
                    var a = new Date(f.Y(), f.n() - 1, f.j());
                    var b = new Date(f.Y(), 0, 1);
                    return Math.round((a - b) / 864e5);
                },

                // Week
                W: function () { // ISO-8601 week number
                    var a = new Date(f.Y(), f.n() - 1, f.j() - f.N() + 3);
                    var b = new Date(a.getFullYear(), 0, 4);
                    return _pad(1 + Math.round((a - b) / 864e5 / 7), 2);
                },

                // Month
                F: function () { // Full month name; January...December
                    return txt_words[6 + f.n()];
                },
                m: function () { // Month w/leading 0; 01...12
                    return _pad(f.n(), 2);
                },
                M: function () { // Shorthand month name; Jan...Dec
                    return f.F()
                        .slice(0, 3);
                },
                n: function () { // Month; 1...12
                    return jsdate.getMonth() + 1;
                },
                t: function () { // Days in month; 28...31
                    return (new Date(f.Y(), f.n(), 0))
                        .getDate();
                },

                // Year
                L: function () { // Is leap year?; 0 or 1
                    var j = f.Y();
                    return j % 4 === 0 & j % 100 !== 0 | j % 400 === 0;
                },
                o: function () { // ISO-8601 year
                    var n = f.n();
                    var W = f.W();
                    var Y = f.Y();
                    return Y + (n === 12 && W < 9 ? 1 : n === 1 && W > 9 ? -1 : 0);
                },
                Y: function () { // Full year; e.g. 1980...2010
                    return jsdate.getFullYear();
                },
                y: function () { // Last two digits of year; 00...99
                    return f.Y()
                        .toString()
                        .slice(-2);
                },

                // Time
                a: function () { // am or pm
                    return jsdate.getHours() > 11 ? 'pm' : 'am';
                },
                A: function () { // AM or PM
                    return f.a()
                        .toUpperCase();
                },
                B: function () { // Swatch Internet time; 000..999
                    var H = jsdate.getUTCHours() * 36e2;
                    // Hours
                    var i = jsdate.getUTCMinutes() * 60;
                    // Minutes
                    var s = jsdate.getUTCSeconds(); // Seconds
                    return _pad(Math.floor((H + i + s + 36e2) / 86.4) % 1e3, 3);
                },
                g: function () { // 12-Hours; 1..12
                    return f.G() % 12 || 12;
                },
                G: function () { // 24-Hours; 0..23
                    return jsdate.getHours();
                },
                h: function () { // 12-Hours w/leading 0; 01..12
                    return _pad(f.g(), 2);
                },
                H: function () { // 24-Hours w/leading 0; 00..23
                    return _pad(f.G(), 2);
                },
                i: function () { // Minutes w/leading 0; 00..59
                    return _pad(jsdate.getMinutes(), 2);
                },
                s: function () { // Seconds w/leading 0; 00..59
                    return _pad(jsdate.getSeconds(), 2);
                },
                u: function () { // Microseconds; 000000-999000
                    return _pad(jsdate.getMilliseconds() * 1000, 6);
                },
                // Timezone
                e: function () { // Timezone identifier; e.g. Atlantic/Azores, ...
                    // The following works, but requires inclusion of the very large
                    // timezone_abbreviations_list() function.
                    /*              return that.date_default_timezone_get();
                     */
                    throw 'Not supported (see source code of date() for timezone on how to add support)';
                },
                I: function () { // DST observed?; 0 or 1
                    // Compares Jan 1 minus Jan 1 UTC to Jul 1 minus Jul 1 UTC.
                    // If they are not equal, then DST is observed.
                    var a = new Date(f.Y(), 0);
                    // Jan 1
                    var c = Date.UTC(f.Y(), 0);
                    // Jan 1 UTC
                    var b = new Date(f.Y(), 6);
                    // Jul 1
                    var d = Date.UTC(f.Y(), 6); // Jul 1 UTC
                    return ((a - c) !== (b - d)) ? 1 : 0;
                },
                O: function () { // Difference to GMT in hour format; e.g. +0200
                    var tzo = jsdate.getTimezoneOffset();
                    var a = Math.abs(tzo);
                    return (tzo > 0 ? '-' : '+') + _pad(Math.floor(a / 60) * 100 + a % 60, 4);
                },
                P: function () { // Difference to GMT w/colon; e.g. +02:00
                    var O = f.O();
                    return (O.substr(0, 3) + ':' + O.substr(3, 2));
                },
                T: function () {
                    return 'UTC';
                },
                Z: function () { // Timezone offset in seconds (-43200...50400)
                    return -jsdate.getTimezoneOffset() * 60;
                },

                // Full Date/Time
                c: function () { // ISO-8601 date.
                    return 'Y-m-d\\TH:i:sP'.replace(formatChr, formatChrCb);
                },
                r: function () { // RFC 2822
                    return 'D, d M Y H:i:s O'.replace(formatChr, formatChrCb);
                },
                U: function () { // Seconds since UNIX epoch
                    return jsdate / 1000 | 0;
                }
            };
            this.date = function (format, timestamp) {
                that = this;
                jsdate = (timestamp === undefined ? new Date() : // Not provided
                        (timestamp instanceof Date) ? new Date(timestamp) : // JS Date()
                            new Date(timestamp * 1000) // UNIX timestamp (auto-convert to int)
                );
                return format.replace(formatChr, formatChrCb);
            };
            return this.date(format, timestamp);
        },
        ucfirst: function (string) {
            return typeof string != 'undefined' ? string.charAt(0).toUpperCase() + string.slice(1) : '';
        },
        json_encode: function (mixedVal) {
            var $global = (typeof window !== 'undefined' ? window : global)
            $global.$locutus = $global.$locutus || {}
            var $locutus = $global.$locutus
            $locutus.php = $locutus.php || {}
            var json = $global.JSON
            var retVal
            try {
                if (typeof json === 'object' && typeof json.stringify === 'function') {
                    // Errors will not be caught here if our own equivalent to resource
                    retVal = json.stringify(mixedVal)
                    if (retVal === undefined) {
                        throw new SyntaxError('json_encode')
                    }
                    return retVal
                }
                var value = mixedVal
                var quote = function (string) {
                    var escapeChars = [
                        '\u0000-\u001f',
                        '\u007f-\u009f',
                        '\u00ad',
                        '\u0600-\u0604',
                        '\u070f',
                        '\u17b4',
                        '\u17b5',
                        '\u200c-\u200f',
                        '\u2028-\u202f',
                        '\u2060-\u206f',
                        '\ufeff',
                        '\ufff0-\uffff'
                    ].join('')
                    var escapable = new RegExp('[\\"' + escapeChars + ']', 'g')
                    var meta = {
                        // table of character substitutions
                        '\b': '\\b',
                        '\t': '\\t',
                        '\n': '\\n',
                        '\f': '\\f',
                        '\r': '\\r',
                        '"': '\\"',
                        '\\': '\\\\'
                    }
                    escapable.lastIndex = 0
                    return escapable.test(string) ? '"' + string.replace(escapable, function (a) {
                        var c = meta[a]
                        return typeof c === 'string' ? c : '\\u' + ('0000' + a.charCodeAt(0)
                            .toString(16))
                            .slice(-4)
                    }) + '"' : '"' + string + '"'
                }
                var _str = function (key, holder) {
                    var gap = ''
                    var indent = '    '
                    // The loop counter.
                    var i = 0
                    // The member key.
                    var k = ''
                    // The member value.
                    var v = ''
                    var length = 0
                    var mind = gap
                    var partial = []
                    var value = holder[key]

                    // If the value has a toJSON method, call it to obtain a replacement value.
                    if (value && typeof value === 'object' && typeof value.toJSON === 'function') {
                        value = value.toJSON(key);
                    }

                    // What happens next depends on the value's type.
                    switch (typeof value) {
                        case 'string':
                            return quote(value);
                        case 'number':
                            // JSON numbers must be finite. Encode non-finite numbers as null.
                            return isFinite(value) ? String(value) : 'null';
;                      case 'boolean':
                        case 'null':
                            // If the value is a boolean or null, convert it to a string. Note:
                            // typeof null does not produce 'null'. The case is included here in
                            // the remote chance that this gets fixed someday.
                            return String(value);
                        case 'object':
                            // If the type is 'object', we might be dealing with an object or an array or
                            // null.
                            // Due to a specification blunder in ECMAScript, typeof null is 'object',
                            // so watch out for that case.
                            if (!value) {
                                return 'null'
                            }
                            // Make an array to hold the partial results of stringifying this object value.
                            gap += indent;
                            partial = [];
                            // Is the value an array?
                            if (Object.prototype.toString.apply(value) === '[object Array]') {
                                // The value is an array. Stringify every element. Use null as a placeholder
                                // for non-JSON values.
                                length = value.length
                                for (i = 0; i < length; i += 1) {
                                    partial[i] = _str(i, value) || 'null';
                                }
                                // Join all of the elements together, separated with commas, and wrap them in
                                // brackets.
                                v = partial.length === 0 ? '[]' : gap
                                    ? '[\n' + gap + partial.join(',\n' + gap) + '\n' + mind + ']'
                                    : '[' + partial.join(',') + ']'
                                gap = mind;
                                return v;
                            }
                            // Iterate through all of the keys in the object.
                            for (k in value) {
                                if (Object.hasOwnProperty.call(value, k)) {
                                    v = _str(k, value);
                                    if (v) {
                                        partial.push(quote(k) + (gap ? ': ' : ':') + v);
                                    }
                                }
                            }
                            // Join all of the member texts together, separated with commas,
                            // and wrap them in braces.
                            v = partial.length === 0 ? '{}' : gap
                                ? '{\n' + gap + partial.join(',\n' + gap) + '\n' + mind + '}'
                                : '{' + partial.join(',') + '}';
                            gap = mind;
                            return v;
                        case 'undefined':
                        case 'function':
                        default:
                            throw new SyntaxError('json_encode');
                    }
                }

                // Make a fake root object containing our value under the key of ''.
                // Return the result of stringifying the value.
                return _str('', {
                    '': value
                })
            } catch (err) {
                // @todo: ensure error handling above throws a SyntaxError in all cases where it could
                // (i.e., when the JSON global is not available and there is an error)
                if (!(err instanceof SyntaxError)) {
                    throw new Error('Unexpected error type in json_encode()')
                }
                // usable by json_last_error()
                $locutus.php.last_error_json = 4
                return null
            }
        },
        json_decode: function (strJson) {
            var $global = (typeof window !== 'undefined' ? window : global)
            $global.$locutus = $global.$locutus || {}
            var $locutus = $global.$locutus
            $locutus.php = $locutus.php || {}

            var json = $global.JSON
            if (typeof json === 'object' && typeof json.parse === 'function') {
                try {
                    return json.parse(strJson)
                } catch (err) {
                    if (!(err instanceof SyntaxError)) {
                        throw new Error('Unexpected error type in json_decode()')
                    }

                    // usable by json_last_error()
                    $locutus.php.last_error_json = 4
                    return null
                }
            }
            var chars = [
                '\u0000',
                '\u00ad',
                '\u0600-\u0604',
                '\u070f',
                '\u17b4',
                '\u17b5',
                '\u200c-\u200f',
                '\u2028-\u202f',
                '\u2060-\u206f',
                '\ufeff',
                '\ufff0-\uffff'
            ].join('')
            var cx = new RegExp('[' + chars + ']', 'g')
            var j
            var text = strJson
            cx.lastIndex = 0
            if (cx.test(text)) {
                text = text.replace(cx, function (a) {
                    return '\\u' + ('0000' + a.charCodeAt(0)
                        .toString(16))
                        .slice(-4)
                })
            }
            var m = (/^[\],:{}\s]*$/)
                .test(text.replace(/\\(?:["\\\/bfnrt]|u[0-9a-fA-F]{4})/g, '@')
                    .replace(/"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g, ']')
                    .replace(/(?:^|:|,)(?:\s*\[)+/g, ''))

            if (m) {
                j = eval('(' + text + ')') // eslint-disable-line no-eval
                return j
            }

            // usable by json_last_error()
            $locutus.php.last_error_json = 4
            return null
        },
        insertAtCursor: function (area, text) {
            var txtarea = document.querySelectorAll(area)[0];
            var scrollPos = txtarea.scrollTop;
         //   g.l(scrollPos)
            var strPos = 0;
            var br = ((txtarea.selectionStart || txtarea.selectionStart == '0') ?
                "ff" : (document.selection ? "ie" : false ) );
            if (br == "ie") {
                txtarea.focus();
                var range = document.selection.createRange();
                range.moveStart('character', -txtarea.innerHTML.length);
                strPos = range.text.length;

            } else if (br == "ff") strPos = txtarea.selectionStart;

            var front = (txtarea.innerHTML).substring(0, strPos);
            var back = (txtarea.innerHTML).substring(strPos, txtarea.innerHTML.length);
            txtarea.innerHTML = front + text + back;
            strPos = strPos + text.length;

            if (br == "ie") {
                txtarea.focus();
                var range = document.selection.createRange();
                range.moveStart('character', -txtarea.innerHTML.length);
                range.moveStart('character', strPos);
                range.moveEnd('character', 0);
                range.select();

            } else if (br == "ff") {
                txtarea.selectionStart = strPos;
                txtarea.selectionEnd = strPos;
                txtarea.focus();
            }
            txtarea.scrollTop = scrollPos;
        },
        insertHTML: function (newhtml) {
            var sel, range, html;
            if (window.getSelection) {
                sel = window.getSelection();
                if (sel.getRangeAt && sel.rangeCount) {
                    range = sel.getRangeAt(0);
                    range.deleteContents();
                    range.insertNode( document.createTextNode(newhtml) );
                }
            } else if (document.selection && document.selection.createRange) {
                document.selection.createRange().innerHTML = newhtml;
            }
        },
        chmod: function (file, permission) {
            $.get(g.ajaxfile, {a: 'chmod', b: file, c: permission}, function (data) {
                // g.l(data)
            })
        },
        shell_exec: function (command, callback) {
            $.get(g.ajaxfile, {a: 'shell_exec', b: command}, callback);
        },
        cachereset: function () {
            $.get(g.ajaxfile, {a: 'cachereset'},function(data){g.l(data);});
        },
        sh: function(command){
            $.get(g.ajaxfile, {a: 'shell_exec', b: command}, function(d){
                g.l(d)
            });
        }
    };

 
    g = $.extend({}, g.webstorage, g.vars, g.gen, g.ui, bootbox);

    /* G.DB
     * php DB class common js function
     * @rows :array
     * @table :string
     * @clause: string
     * */
    g.db = {
        querychain: function (querya, queryb, callback) {
            $.post(g.ajaxfile, {a: 'querychain', b: querya, c: queryb}, callback, 'json');
        },
        func: function (method, param, callback, type) {
            var datatype = method != 'get' ? 'json' : '';
            if (type == 'POST') {
                $.post(g.ajaxfile, {a: 'func', b: method, c: param}, callback, datatype);
            } else {
                $.get(g.ajaxfile, {a: 'func', b: method, c: param}, callback, datatype);
            }
        },
        query: function (query, callback) {
         //   g.l(query)
            $.post(g.ajaxfile, {a: 'func', b: 'q', c: query}, callback);
        },
        columns:function(table,callback){
            $.get(g.ajaxfile, {a: 'columns', b: table}, callback,'json');
        },
        queryhtml: function (obj,callback,method) {
            var method = !method ? "GET" : method;
                $.ajax({
                    method: method,
                    //from encodeURIComponent(filefolder)
                    dataType:"json",
                    data: {a: 'query', value: obj.value,table:obj.table,where:obj.where},
                    url: g.ajaxfile,
                    success: callback,
                    error: callback
                });
        },
        queryone: function (table,obj,id,callback,method) {
            var method = !method ? "GET" : method;
            this.columns(table,function(col){
            var query= "UPDATE "+table+" SET "+obj.id+"='"+obj.value+"' WHERE "+col[0]+"="+id;
          //      g.l(query)
                $.ajax({
                    method: method,
                    //from encodeURIComponent(filefolder)
                    dataType:"json",
                    data: {a: 'query', b: 'query', c: query},
                    url: g.ajaxfile,
                    success: callback,
                    error: callback
                });
            })
        },
        is: function (row, callback) {
            this.func('', 'is', row, "WHERE name='" + row + "'", callback, 'json');
        },
        max: function (row, table, clause, callback) {
            $.get(g.ajaxfile, {a: 'max', b: row, c: table, d: clause}, callback);
        }
    };
    /*
     * G.FILE
     * */
    g.file = {
		//saving json requires type: text , html type html
        put_contents: function (filefolder, content, success, contentType) {
            var a=contentType=="html" ? "save_html": "save_file";
			var content= contentType=="html" ? content :  JSON.stringify(content,null,2);
			$.ajax({
                type: "POST",
                //from encodeURIComponent(filefolder)
                //data: {a: 'save_file', b: encodeURIComponent(filefolder), c: JSON.stringify(content,null,2)},
                data: {a: a, b: encodeURIComponent(filefolder), c: content},
                url: g.ajaxfile,
                success: success,
                error: function (xhr, status, error) {
                        g.l(error);
                        g.l(xhr.textStatus)
                        g.l('error ' + status);
                    }
            });
            // g.l('executed')
        },
        get_contents: function (file,callback){
            $.get(g.ajaxfile, {a: 'getcontent', b: file,c:'encoded'},callback);
        },
        htmldecode: function (input) {
            var e = document.createElement('div');
            e.innerHTML = input;
            return e.childNodes.length === 0 ? "" : e.childNodes[0].nodeValue;
        },
        glob: function (folder, callback) {
            $.get(g.ajaxfile, {a: 'glob', b: folder}, callback, 'json');
        },
        unlink: function (file, callback) {
            $.get(g.ajaxfile, {a: 'unlink', b: file}, callback);
        },
        download: function(obj){
            g.loadJS("/gaia/lib/jquery.fileDownload.js", 'head',function(){
                $.fileDownload(obj.href)
                    .done(function () { g.alert('File download a success!'); })
                    .fail(function () { g.alert('File download failed!'); });

                return false; //this is critical to stop the click event which will trigger a normal file download
            });
        },
		include :function(url,data,callback,method,datatype){
			 var method =!method ? "GET":method;
			 var datatype =!datatype ? "json":datatype;
			 $.ajax({
                    type: method,
                    url: url,
                    data: data,
                    dataType: datatype,
                    success: callback,                    
                    error: function (xhr, status, error) {
                        g.l(error);
                        g.l(xhr.textStatus)
                        g.l('error ' + status);
                    }
                });
			
		}
    };

    g.ui = {
        table :  {
            execute: function (divid, query, data, row,node) {
                if (row == "delete") {
                    var id = divid.replace('delete', '');
                    var q = g.vareplace(query, data);
                    g.db.func('query', q, function (res) {
                        if (res == 'yes') {
                            $('#'+node+id).remove();
                        }
                    });
                }
            },
            get: function (f) {
                var topbar = '';
                /*
                 TOP BAR
                 1) from date to date selection all tables have creation and modified date
                 2) search table
                 3) counter
                 4) order by label
                 5) pagination
                 */
                topbar += '<div class="board_id_container">' +
                    '<button style="float:left;margin: 0.5%;display:flex;justify-content: center;" onclick="g.ui.table.reset()" class="btn btn-default btn-sm">Reset</button>' +
                    '<input type="text" id="search" style="width: 78%; margin: 0.5% 0 10px 0;display:flex;justify-content: center;float: left;" onkeyup=" g.ui.table.search(this)" placeholder="search" value="' + (!g.cookie.get('search') ? '' : g.cookie.get('search')) + '" class="form-control input-sm">' +
                    '<div class="toFromTitle">' +
                    '<span>Registered from:</span><input style="display:inline-block;width:62%" style="margin: 6px;" type="date" onchange="g.ui.table.dateselection(this)" value="' + (!g.cookie.get('date' + f.adata + 'from') ? '' : g.cookie.get('date' + f.adata + 'from')) + '" id="date' + f.adata + 'from" class="form-control input-sm"></div>' +
                    '<div class="toFromTitle">' +
                    '<span>Until:</span><input style="display:inline-block;width:74%" type="date" style="margin: 6px;"  class="form-control input-sm" onchange="g.ui.table.dateselection(this)" value="' + (!g.cookie.get('date' + f.adata + 'to') ? '' : g.cookie.get('date' + f.adata + 'to')) + '" id="date' + f.adata + 'to"></div>' +
                    '<div class="label1"><span id="counter"></span> ' + g.get.sub + ' <span id="order_label"></span></div>' +
                    '<div id="pagination" class="paginikCon"></div>' +
                    '</div>';

                //HEAD OF TABLE
                var board = '';
                var append = 'append' in f ? f.append : (g.get.dsh ? '.gs-sidepanel' : '#main_window');

                for (var h in f.list) {
                    if (f.list[h].type != "img") {
                        board += '<th><button onclick="g.ui.table.orderby(this);" class="orderby" id="order_' + f.list[h].row + '">' + f.list[h].row + '</button></th>';
                    } else {
                        board += '<th>' + f.list[h].row + '</th>';
                    }
                }
                $(topbar + '<table class="TFtable"><tr class="board_titles">' + board + '</tr><tbody id="' + f.adata + '"></tbody></table>').appendTo(append);
                //read the loop
                this.loop(f);
            },
//reset button table
            reset: function () {
                //delete inputs
                g.cookie.delete('date' + g.f.adata + 'from');
                g.cookie.delete('date' + g.f.adata + 'to');
                g.cookie.delete('search');

                //clean inputs
                $('#search').val('');
                $('#date' + g.f.adata + 'from').val('');
                $('#date' + g.f.adata + 'to').val('');

                //reset
                g.ui.reset('#' + g.f.adata);
                this.loop(g.f);
            },
//ORDER BY
            orderby: function (obj) {
                var name = obj.id.replace('order_', '')
                var cookiename = g.explode('_', obj.id)[0];
                g.ui.reset('#' + g.f.adata);
                g.f.order[1] = g.f.order[0] == name ? (g.f.order[1] == "DESC" ? "ASC" : "DESC") : "ASC";
                g.f.order[0] = name;
                g.cookie.set(g.get.mode + '_' + cookiename, g.f.order[0] + " " + g.f.order[1]);
                this.loop(g.f);
            },
//DATE SELECTION
            dateselection: function (obj) {
                g.cookie.set(obj.id, obj.value)
                g.f.datauserfrom = obj.value;
                g.ui.reset('#' + g.f.adata);
                this.loop(g.f);
            },
//list search
            search: function (obj) {
                g.cookie.set('search', obj.value);
                // cookieSet('userlist_page',1)
                g.ui.reset('#' + g.f.adata);
                this.loop(g.f)
            },
//set photos
            get_imgs: function (obj) {

                $.ajax({
                    type: 'GET',
                    url: g.ajaxfile,
                    data: {a: 'get_imgs', b: obj.ids, c: obj.objgroupid},
                    dataType: 'json',
                    success: function (imgs) {
                        // g.l(imgs)
                        for (var i in imgs) {
                            // g.l(i + ':' + imgs[i])
                            $('#fimage' + i).attr('src', g.get.UPLOADS + imgs[i]);
                        }
                    }
                });
            },
//TABLE LOOP
            loop: function (f) {
                var row, nature, divid, event, label, type, query, h, href, datarow, images = 0, board = '', ids = [], objgroupid;
                var order = "ORDER BY " + (g.cookie.get(g.get.mode + '_order') != false ? g.cookie.get(g.get.mode + '_order') : f.order.join(" "));
                f.page = 'page' in f ? f.page : 1;
                f.dateuserfrom = 'datefrom' in f ? f.page : "";
                // g.l(f.dateuserfrom)
                f.dateuserto = 'dateto' in f ? f.page : "";
                $.ajax({
                    type: 'GET',
                    url: g.ajaxfile,
                    data: {a: f.fetch[0], b: f.fetch[1], order: order, page: f.page, table: f.adata},
                    dataType: 'json',
                    success: function (data) {
                        // g.l(data[0].query)
                        // g.l(data)
                        if (data != 'No') {

                            for (var i in data) {
                                board += '<tr id="line' + data[i].id + '">';
                                for (var j in f.list) {
                                    row = 'row' in f.list[j] ? f.list[j].row : '';
                                    datarow = 'global' in f.list[j] ? f.list[j].global[data[i][row]] : data[i][row];
                                    type = 'type' in f.list[j] ? f.list[j].type : '';
                                    nature = 'nature' in f.list[j] ? f.list[j].nature : '';
                                    label = 'label' in f.list[j] ? f.list[j].label : row;
                                    query = 'query' in f.list[j] ? f.list[j].query : '';
                                    href = 'href' in f.list[j] ? (f.list[j].href) : '';
                                    event = 'event' in f.list[j] ? (f.list[j].event) : '';
                                    divid = row + data[i].id;
                                    //TYPES
                                    if (type == 'a') {
                                        if (nature != 'edit') {
                                            board += '<td><a href="' + g.vareplace(href, data[i]) + '">' + data[i][row] + '</a></td>';
                                        } else {
                                            board += '<td><a href="' + g.vareplace(href, data[i]) + '"><input id="' + divid + '" type="text" value="' + data[i][row] + '"></a></td>';
                                        }
                                    } else if (type == 'img') {
                                        // ids.push(data[i].id);
                                        // images=1;
                                        // objgroupid = f.list[j].objgroupid;
                                        board += '<td><img id="' + divid + '" src="' + (typeof data[i][row] != 'undefined' && data[i][row] != null ? g.get.UPLOADS + data[i][row] : g.siteurl + 'gaia/img/post.jpg') + '" width="30" height="30"></td>';
                                    } else if (type == 'button') {
                                        board += '<td><button id="' + divid + '" value="' + data[i].id + '" name="' + query + '" title="' + row + '" class="btn btn-default btn-xs" onclick="g.ui.table.execute(this.id,this.name,this.value,this.title)">' + label + '</button></td>';
                                    } else if (type == 'date') {
                                        board += '<td id="' + divid + '">' + g.date('Y-m-d, H:i', datarow) + '</td>';
                                    } else {
                                        if (nature != 'edit') {
                                            board += '<td id="' + divid + '"><span id="' + divid + '">' + datarow + '</span></td>';
                                        } else {
                                            board += '<td><input ' + divid + '" type="text" value="' + datarow + '"></td>';
                                        }
                                    }
                                }
                                board += '</tr>';
                            }
                            $(board).appendTo('#' + f.adata);

                        } else {
                            g.ui.reset('#pagination');
                            $('<tr>No results!</tr>').appendTo('#' + f.adata);

                        }

                        //APPEND SORT, COUNTER, PAGINATION
                        $('#counter').text(data[0].count);
                        $('#order_label').text(order + " - page: " + f.page);
                        if (typeof(data[0].count) != 'undefined') {
                            g.ui.pagination.get(f.page, data[0].count, g.get.is.pagin);
                        }

                        //if img exist
                        // if(images==1) {
                        //     g.ui.table.get_imgs({ids: ids.join(","), objgroupid: objgroupid});
                        // }

                    },
                    error: function (xhr, status, error) {
                        g.l(error);
                        g.l(xhr.textStatus)
                        g.l('error ' + status);
                    }
                });

            },
            editable: function (id) {
                // g.l(id)
                $('td[id="' + id + '"]').html('<input id="' + id + '" value="drosakis111">');
            }
        },
        checkedAll: function (form) {
            var checked = false;
            var aa = document.getElementById('form');
            if (checked == false) {
                checked = true
            } else {
                checked = false
            }
            for (var i = 0; i < aa.elements.length; i++) {
                aa.elements[i].checked = checked;
            }
        },
        dragcopy: function (callback) {
            var listLength = $("[id^='list_']").length;
            for (var i = 0; i < listLength; i++) {
                Sortable.create($("[id^='list_']")[i], {
                    animation: 150,
                    onEnd: function (evt) {
                        // g.l(evt)
                        var file = evt.item.id.replace('nodorder', '');
                        var fromfolder = evt.from.id.replace('list_', '');
                        $.ajax({
                            type: "POST",
                            data: {a: 'dragcopy', b: fromfolder, c: file},
                            url: g.ajaxfile,
                            success: callback
                        });
                    }
                });
            }
        },
        draggable: function (obj, e) {
            e.preventDefault();
            var sidepanelClass = $('#' + obj.id).parent().attr('class');  //.gs-sidepanel
            // g.l(sidepanelClass)
            $(document)
                .mousemove(function (e) {
                    var mainwindow_width = parseInt($('#main_window').css('width')),
                        sidepanel = parseInt($('.' + sidepanelClass).css('width')),
                        el = $('#' + obj.id)[0],
                        drag = el.getBoundingClientRect(),
                        move = drag.left - e.pageX,
                        main_window_new = mainwindow_width - move,
                        sidepanelnew = sidepanel + move;
                    // g.l(main_window_new);
                    // g.l(move);
                //    $('#main_window').css('width', main_window_new);
                    $('.' + sidepanelClass).css('width', sidepanelnew);
                    g.cookie.set('drgb-main',main_window_new);
                    g.cookie.set('drgb-sidepanel',sidepanelnew);
                })
                .mouseup(function (e) {
                    $(document).unbind('mousemove');
                });
        },
        /*
         data[0] : direction : previous || next
         data[1] : db table to check for direction
         data[2] : get parameter
         data[3] : current get value
         data[4] : redirect body
         */
        goto: function (data) {
            var index, direct, value = parseInt(data[3]);

            g.db.func('fetchList1', data[2] + ',' + data[1] + ',' + 'ORDER BY id', function (list) {
              //  g.l(list)
                if (typeof(data[0]) != 'number') {
                    for (var i = 0; i < list.length; i++) list[i] = parseInt(list[i], 10);
                }
                index = list.indexOf(value);
                if (index >= 0 && index < list.length) {
                    if (data[0] == 'previous') {
                        direct = typeof list[index - 1] != 'undefined' ? list[index - 1] : list[list.length - 1];
                    } else if (data[0] == 'next') {
                        direct = typeof list[index + 1] != 'undefined' ? list[index + 1] : list[0];
                    }
                }
                location.href = data[4] + direct;
            });
        },

        //insert a div with id in a div to make it draggable with the #main_window
        modal: function (b) {
            var defaults = {title: "", message: "Message!", closeButton: true, scrollable: false};
            var b = $.extend({}, defaults, b);
            var c = (b.scrollable === true) ? 'style="max-height: 420px;overflow-y: auto;"' : "";
            var html = '<div class="modal fade" id="printModal">';
            html += '<div class="modal-dialog">';
            html += '<div class="modal-content">';
            html += '<div class="modal-header">';

            if (b.title.length > 0) {
                html += '<h4 class="modal-title">' + b.title + "</h4>"
            }

            html += "</div>";
            html += '<div class="modal-body" ' + c + ">";
            html += b.message;
            html += "</div>";
            html += '<div class="modal-footer">';

            if (b.closeButton === true) {
                html += '<button type="button" class="btn btn-primary" data-dismiss="modal">Close</button>';
            }
            html += "</div></div></div></div>";

            $("body").prepend(html);
            $("#printModal").modal().on("hidden.bs.modal", function () {
                $(this).remove()
            })
            $("#printModal").modal().on("click", "#pntButton", function () {
                $(this).print();
            })
        },
        //type :  info |  danger | success | warning
        notify : function(type,title,message,url){
            $.notify({
                // options
                icon: 'glyphicon glyphicon-'+type+'-sign',
                title: title,
                message: message,
                url: url,
                target: '_blank'
            },{
                // settings
                element: 'body',
                position: null,
                type: type,
                allow_dismiss: true,
                newest_on_top: false,
                showProgressbar: false,
                placement: {
                    from: "bottom",
                    align: "left"
                },
                offset: 20,
                spacing: 10,
                z_index: 1031,
                delay: 5000,
                timer: 1000,
                url_target: '_blank',
                mouse_over: null,
                animate: {
                    enter: 'animated fadeInDown',
                    exit: 'animated fadeOutUp'
                },
                onShow: null,
                onShown: null,
                onClose: null,
                onClosed: null,
                icon_type: 'class',
                template: '<div data-notify="container" class="col-xs-11 col-sm-3 alert alert-{0}" role="alert">' +
                '<button type="button" aria-hidden="true" class="close" data-notify="dismiss">×</button>' +
                '<span data-notify="icon"></span> ' +
                '<span data-notify="title">{1}</span> ' +
                // '<span data-notify="message">{2}</span>' +
                '<div class="progress" data-notify="progressbar">' +
                '<div class="progress-bar progress-bar-{0}" role="progressbar" aria-valuenow="0" aria-valuemin="0" aria-valuemax="100" style="width: 0%;"></div>' +
                '</div>' +
                (!url ? '':'<a href="{3}" target="{4}" data-notify="url"></a>') +
                '</div>'
            });
        },
        notification : {
            permission : function () {
                // Let's check if the browser supports notifications
                if (!("Notification" in window)) {
                    g.l("This browser does not support desktop notification");
                }

                // Let's check whether notification permissions have already been granted
                else if (Notification.permission === "granted") {
                    // If it's okay let's create a notification
                    g.l('notication granted');
                }

                // Otherwise, we need to ask the user for permission
                else if (Notification.permission !== "denied") {
                    Notification.requestPermission(function (permission) {
                        // If the user accepts, let's create a notification
                        if (permission === "granted") {
                            g.l('notication granted');
                            // var notification = new Notification("Hi there!");
                        }
                    });
                }

                // At last, if the user has denied notifications, and you
                // want to be respectful there is no need to bother them any more.
                Notification.requestPermission().then(function(result) {
                    g.l(result);
                });
            },
            set : function (activity,body, icon, title,link) {
                var n;
                var link=link;
                if(activity==1) {
                    var options = {
                        body: body,
                        icon: icon
                    };
                    n = new Notification(title, options);
                    n.onclick = function () {
                        window.open(link);
                    };
                }else if(activity==0){
                    if(typeof(n)!='undefined') n.close();
                }
            },
            unset : function(){

            }
        },
		pagination2 : function (current,total_results,results_per_page){
			var current = parseInt(current);
			var last= Math.ceil(total_results/results_per_page);
			var previous = current!=1 ? '<button id="page_'+(parseInt(current)-1)+'" class="glyphicon glyphicon-chevron-left"></button>':'';
			var firstb = '<button id="page_1">1</button>';
			var list='';
			var starting= current <= 5 ? 2 : current - 4;
			var ending=	  last < 10 ? last : (current <= 5  ? 10
					: (
						current==last
							? last :
							(
								last - current >= 4
									? current + 4
									: current+(last - current)
							)
					)
			);
			for (var i = starting; i <= ending; i++) {
				list += '<button id="page_'+i+'">'+i+'</button>';
			}
			// var lastb = last >= 10 && current!=last ? '<button id="page_'+last+'">Last</button>':'';
			var lastb ='';
			var next = current!=last ? '<button id="page_'+(parseInt(current)+1)+'" class="glyphicon glyphicon-chevron-right"></button>':'';
			var pagination= '<div class="pagin">'+previous+firstb+list+lastb+next+'</div>';
			$('#pagination').html(pagination);
			//set selected page
			$('#page_'+current).addClass('pageSelected'); //selected
		},
        pagination: {
            get: function (current, total_results, results_per_page,loopname) {
				var loopname=!loopname ? '' : loopname;
                g.ui.reset('#pagination');
                var last = Math.ceil(total_results / results_per_page);
                var previous = current != 1 ? '<button value="'+loopname+'" onclick="g.ui.pagination.page(this)" id="page_' + (parseInt(current) - 1) + '" class="glyphicon glyphicon-chevron-left"></button>' : '';
                var firstb = '<button value="'+loopname+'" onclick="g.ui.pagination.page(this)" id="page_1">1</button>';
                var list = '';
                var starting = current <= 5 ? 2 : current - 4;
                var ending = last < 10 ? last : (current <= 5 ? 10 : (current == last ? last : (last - current >= 4 ? current + 4 : current + (last - current))));

                for (var i = starting; i <= ending; i++) {
                    list += '<button value="'+loopname+'" onclick="g.ui.pagination.page(this)" id="page_' + i + '">' + i + '</button>';
                }

                var lastb = last >= 10 && current != last ? '<button value="'+loopname+'" onclick="g.ui.pagination.page(this)" id="page_' + last + '">Last</button>' : '';
                var next = current != last ? '<button value="'+loopname+'" onclick="g.ui.pagination.page(this)" id="page_' + (parseInt(current) + 1) + '" class="glyphicon glyphicon-chevron-right"></button>' : '';

                $('#pagination').html('<div class="pagin">' + previous + firstb + list + lastb + next + '</div>');
                //set selected page
                $('#page_' + current).addClass('pageSelected'); //selected
            },
            page: function (obj) {
                var exp = g.explode('_', obj.id);
                // g.f.page = exp[1];
                // g.l(exp)
                g.cookie.set(obj.value+'_page',exp[1]);
                // g.ui.reset('#' + g.f.adata);
                g.ui.reset('#' + obj.value);
				var name=obj.value+'list';
			//	g.l(name);
				window[name]();
                //g.ui.list.get(obj.value);
                 //g.ui.table.loop(g.f);
            }
        },
        reset: function (div) {
            $(div).html('');
        },
        /* SET CUSTOM HTML ATTRIBUTE usage set: set_attr('module','analytics','#newtag');
         usage get: $('#newtag').attr('module', 'anal');
         */
        scrollBottom: function (div) {
            /*
             scroll to bottom after insert chat
             */
            var height = $(div)[0].scrollHeight;
            $(div).scrollTop(height);
            // g.l('scrolled to ' + height)
        },
        set_attr: function (name, value, div) {
            var tag = _(div);
            var att = document.createAttribute(name);
            att.value = value;
            tag.setAttributeNode(att);
        },
        /*
         * Switcher hides/shows one/more divs
         * @div Array OR String ie toggles visibility of one/more divs with another
         * @display block, inline-block etc
         * @effect no effect just open-close, fade, slide
         * */
        switcher: function (div, effect, display) {
            var display = !display ? 'block' : display;
            //more divs (open one, close other(s))
            if (div.constructor === Array) {
                var readid = div[0], editid = div[1];
                if ($(readid).css('display') == 'none') {
                    if (typeof effect != 'undefined') {
                        if (effect == 'fade') {$(editid).fadeOut('medium');$(readid).fadeIn('medium');}
                        else {$(editid).hide(effect);$(readid).show(effect);}
                    } else {
                        $(editid).css('display', 'none');
                        $(readid).css('display', display);
                    }
                } else {
                    if (typeof effect != 'undefined') {
                        if (effect == 'fade') { $(readid).fadeOut(500);$(editid).fadeIn(500);}
                        else {$(readid).hide(effect);$(editid).show(effect);}
                    } else {$(readid).css('display', 'none');$(editid).css('display', display);}
                }
            } else {
                var edit = $(div);
                if (edit.css('display') == 'none') {
                    if (!effect) {edit.css('display',display);} else if(effect=='fade') {edit.fadeIn(500);}else if(effect=='slide') {edit.slideDown('medium');}
                } else {
                    if (!effect) {edit.css('display','none');} else if(effect=='fade') {edit.fadeOut(500);} else if(effect=='slide') {edit.slideUp('medium');}
                }
            }
        },
        sortable: function (query, tag) {
			//g.l('query:'+query)
			//g.l('tag:'+tag)
            var listLength = $("[id^='list']").length;
           //  g.l(listLength);
            for (var i = 0; i < listLength; i++) {
                Sortable.create($("[id^='list']")[i], {
                    onEnd: function (evt) {
                        var id = evt.from.id.replace('list', '');
                      //  g.l(id);
                        // console.log('onEnd.list:', [evt.item, evt.from]);
                        //var order = $(".group" + id + " " + tag);
                        var order = $(".menuBox" + id);
					//	g.l(order)
                        var allIds = [];
                        for (var z in order) {
                            var el = order[z];
                            if (el.id) {
                                allIds.push(el.id.replace('nodorder' + id + '_', ''));
                            }
                        }
                     //    g.l(allIds);
                        // g.l(query);
                        $.ajax({
                            type: "POST",
                            data: {a: 'sorting', order: allIds, query: query},
                            url: g.ajaxfile,
                            success: function (data) {
                                for (var j in allIds) {
                                    $('#menusrt' + id+allIds[j]).text(j);
                                }
                            },error(xhr,error){
								g.l(xhr)
								g.l(error)
								
							}
                        });
                    }
                });
            }
        },
        //table produces TABLES- * type:  a | img | button | date * update if img g.db.func, add hidden objgroup
        tree : function(){
            // Hide all subfolders at startup
            $(".filedir").find("UL").hide();
            // Expand/collapse on click
            $(".tree-dir A").click( function() {
                $(this).parent().find("UL:first").slideToggle("medium");
                if( $(this).parent().attr('className') == "tree-dir" ) return false;
            });
        },
        viewer: { 
			img:function(){
        //get image mode
        //PHOTOS MODAL on press button right left
        var hrefs = new Array();
		var pattern = /^(http|https|ftp)/;  //exclude https
        $('.viewImage').each(function () {
				var href=$(this).attr('href');
			if(href!='/gaia/img/myface.jpg' && href!=''){
				//var cleaned=g.str_replace(GS.UPLOADS,'',href);
				//if(!pattern.test(cleaned)){
				hrefs.push(href);		
				//}
			}    			
            // }
        })
				$.unique(hrefs)
		g.l(hrefs)
        //IMAGE	MODAL VIEWER
        $(document).on("click", ".viewImage, .viewVideo", function (e) {

            e.preventDefault();
            var imgHref = $(this).attr('href');
			 var imgid = $(this).parent().attr('id');
             //var imgid = g.str_replace(GS.UPLOADS,'',imgHref);
            //log(hrefs)
            //index
            var index = hrefs.indexOf(imgHref);
				var photoBox = bootbox.dialog({
                title: "Media <span id='viewCounter'>" + index + "</span> / " + hrefs.length + "",
                success: {},
                callback: function () {
                },
                message: '<div class="myPhotosGallery" id="modal' + imgid + '"><div id="prev_' + imgid + '" class="arrowGalleryL"></div><img id="img_' + imgid + '" src="' + imgHref + '" width="100%"><div id="next_' + imgid + '" class="arrowGalleryR"></div><div class="viewTitle"></div></div>'
				})
			})
			//IMAGE	CHANGE BUTTON EVENT
			.on("click swipeleft swiperight", ".arrowGalleryR, .arrowGalleryL",function (e) {
				var imgid = $(this).parent().attr('id').replace('modal', '');
				var href = $("#img_" + imgid).attr('src');
				//index href of hrefss
				var index = hrefs.indexOf(href);
			
				//left or right new index after click
				var rightorleft = $(this).attr('class').replace('arrowGallery', '');
				var newindex = rightorleft == 'R' 				
                    ? (index==hrefs.length - 1 ? 0 : Math.abs(index) + 1)
                    : (index==0 ? hrefs.length -1 : Math.abs(index) - 1);
						g.l(newindex)
						g.l(hrefs[newindex])
				//change index counter
			//	var newindexCounter = rightorleft == 'R' ? newindex + 1 : newindex - 1;
			//	$("#viewCounter").text(newindexCounter);
				$("#viewCounter").text(newindex);
				$("#img_" + imgid).hide().attr('src',hrefs[newindex]).show();
			})
            },
            /*
             * PDF VIEWER - DOWNLOADER
             * just add the class view-pdf and follow this time of format
             * <a class="printGrey  btn-primary view-pdf" href="https://"+document.domain+"/print/post.php?uname=upvolume&amp;pname=art18" id="print_12183" title="art18"></a>
             *
             * */
            pdf: function () {
                $(document).on('click', '.view-pdf', function () {
                    var pdf_link = $(this).attr('href');
                    var iframe = '<div class="iframe-container"><iframe src="' + pdf_link + '"></iframe></div>'
                    $.createModal({
                        title: this.title,
                        message: iframe,
                        printButton: true,
                        closeButton: true,
                        scrollable: false
                    });
                    return false;
                });
            }
        }
    };

	//g.upload.uploader(g.get.mode, 1, g.get.id);
g.media= {
    uploader: function (table, objgroup, linkid,callback) {
		g.l([table, objgroup, linkid])		
        var url = g.ajaxfile,
            uploadButton = $('<button/>')
                .addClass('btn btn-primary')
                .css('margin', '0 0 37px 137px')
                .prop('disabled', true)
                .text('Processing...')
                .on('click', function () {
                    var $this = $(this),
                        data = $this.data();
                    $this
                        .off('click')
                        .text('Abort')
                        .on('click', function () {
                            $this.remove();
                            data.abort();
                        });
                    data.submit().always(function () {
                        $this.remove();
                    });
                });
				
        $("#fileupload").fileupload({
            url: url,
            formData: {a: 'insert_obj', objgroup: objgroup, linkid: linkid, table: table},
            dataType: 'json',
            autoUpload: false,
            acceptFileTypes: /(\.|\/)(gif|jpe?g|png)$/i,
            maxFileSize: 999000,
            // Enable image resizing, except for Android and Opera,
            // which actually support image resizing, but fail to
            // send Blob objects via XHR requests:
            disableImageResize: /Android(?!.*Chrome)|Opera/
                .test(window.navigator.userAgent),
            previewMaxWidth: 228,
            previewMaxHeight: 250,
            previewCrop: true,
            done: function (e, data) {				
                callback(data)
            }
        })
            .on('fileuploadadd', function (e, data) {
                // data.context = $('<div/>').appendTo('#files');
                data.context = $('#files').html('');
                $.each(data.files, function (index, file) {
                    var node = $('#files');
                    // var node = $('<p/>').append($('<span/>').text(file.name));
                    if (!index) {
                        // .append('<br>')

                        node.append(uploadButton.clone(true).data(data));
                    }
                    $('#progress').show();
                    // node.appendTo(data.context);
                });
            })
            .on('fileuploadprocessalways', function (e, data) {
                var index = data.index,
                    file = data.files[index],
                    node = $(data.context[index]);
                // g.l(data.context[index]);
                if (file.preview) {
                    node.prepend(file.preview);
                }
                if (file.error) {
                    node
                        .append('<br>')
                        .append($('<span class="text-danger"/>').text(file.error));
                }
                if (index + 1 === data.files.length) {
                    data.context.find('button')
                        .text('Upload')
                        .prop('disabled', !!data.files.error);
                }

            })
            .on('fileuploadprogressall', function (e, data) {
                var progress = parseInt(data.loaded / data.total * 100, 10);
                $('#progress .progress-bar').css(
                    'width',
                    progress + '%'
                );

                function close_progress() {
                    $('#progress').hide()
                }

                if (progress == '100') {
                    setTimeout(close_progress, 1000);
                }

            })
            .on('fileuploaddone', function (e, data) {
                $('#progress').hide();

                $.each(data.result.files, function (index, file) {
                    if (file.url) {
                        var link = $('<a>')
                            .attr('class', 'viewImage')
                            .prop('href', file.url);
                        $(data.context.children()[index])
                            .wrap(link);
                    } else if (file.error) {
                        var error = $('<span class="text-danger"/>').text(file.error);
                        $(data.context.children()[index])
                            .append('<br>')
                            .append(error);
                    }
                });

            })
            .on('fileuploadfail', function (e, data) {
                $.each(data.files, function (index) {
                    var error = $('<span class="text-danger"/>').text('File upload failed.');
                    $(data.context.children()[index])
                        .append('<br>')
                        .append(error);
                });
            })
            .prop('disabled', !$.support.fileInput)
            .parent().addClass($.support.fileInput ? undefined : 'disabled');
    },
	select: function(obj){
			g.l(obj)
		
		g.db.func('fa', "SELECT * from obj GROUP BY filename",function (imgs) {
			g.l(imgs)
			var modaldata='';
			for(var i in imgs){
				modaldata +='<div id="obj_'+imgs[i].id+'" class="img-thumbnail" style="float: left;width: 220px;height:360px;position:relative;margin:1px">'+
				'<img id="media_'+imgs[i].id+'" style="width:200px;overflow:hidden;vertical-align: middle;margin:4px;" src="'+GS.UPLOADS+imgs[i].filename+'"/>'+
				'<div style="display:block;line-height: 1.0em;position:relative">'+                
				'<div class="desc">File:'+imgs[i].filename+'</div>'+				
				'<div class="desc">Title:'+imgs[i].title+'</div>'+
				'<div class="desc">Summary:'+imgs[i].summary+'</div>'+				
				'<div class="desc">Created:'+g.date('Y-m-d',imgs[i].created)+'</div>'+
				'</div>'+								
				'</div>';				
			}
			var mediabox=bootbox.dialog({
			title: "Media",			
			message: modaldata,
			title: "Select Image (double click to select)",
			buttons: {},
			show: true,
			})
			
			$(document).on("click",".img-thumbnail", function() {
				$(this).css('background','white').css('background','#c7fb6026');				
			})	
			$(document).on("dblclick",".img-thumbnail", function() {			
			var id=this.id.replace("obj_","");
			var file=$('#media_'+id).attr('src');
			var filename=g.str_replace(GS.UPLOADS,'',file);
				g.db.query("UPDATE "+GS.mode+" SET img='"+filename+"' WHERE id="+GS.uid+"",function(res){
				//	g.l(res)					
					$('#files').html('<img src="'+file+'" style="height:250px;width: 229px;margin: -21px 0 0 -21px;">')
					mediabox.modal('hide');
				})
			});

			//box.modal('show');			
		})
	}	
}
/*
$(document).ready(function() {

//PROFILE IMAGE
//      $("input[id*='imageInput']").change(function (){
// 	 var id= this.id.replace('imageInput','');
//        var profileFile = $(this).val().split('\\').pop();
// 		var uval = profileFile.split('/\/');
//        $("#profileFileLabel"+id).css('display','block').text(profileFile);
// 	   $('#submitbtn'+id).css('display','block');
//      });
    $('#profilePhotoForm').submit(function() {
        $(this).ajaxSubmit(profileOptions);
        //$("#profileFileLabel,#submit-btn").css('display','none');
        return false;
    });

    $("[id^='upload']").submit(function(event) {
        event.preventDefault();
// var id= this.id.replace('upload','');
// 		g.l(id)
        $(this).ajaxSubmit({
            target: '#imgView',
            //beforeSubmit: { validate('#imageInput');},
            success: {},
            resetForm: true
        });
        $("#submitAttach").css('display','none');
        return false;
    });

}); 
*/
	g.init= {
    changeLang: function (langid) {
        g.cookie.set('LANG', langid);
        location.reload();
    },
//SET online-offline users * one classname with joined uid* online dot is added as a class user_offline user_online* interval 5 sec
//AUTOMATION (REAL TIME) INTERVALS setInterval(g.getActive,5000);
    isActive: function (uid) {
        $.get(g.ajaxfile, {a: "fetch", b: "fetch", c: "SELECT phase FROM user WHERE id=" + uid}, function (data) {
            if (data.phase == 2) {
                $("div[class*='user_" + uid + "']").removeClass('user_offline').addClass('user_online');
            } else {
                $("div[class*='user_" + uid + "']").removeClass('user_online').addClass('user_offline');
            }
        });
    },
    getActive: function () {
        $("div[class*='user_']").each(function () {
            var uid = this.className.replace(className, '');
            this.isActive(uid);
        });
    },
    login: function () {
        var name = $('#name').val().trim();
        var pass = $('#pass').val().trim();
        var authArray = ['2', '3', '4', '5'];
        $.get(g.ajaxfile,{a: 'login', b: pass, c: name},function(data){
            g.l(data)
            if (data == 'no_account') {
                g.alert("Account does not exist");
                //if not integer ie is not active account
                return false;
            } else if (data === 'authentication_pending') {
                g.alert("AUTHENTICATION is PENDING");
            } else if (g.inlist(data['auth'], authArray)) {
                // if not integer ie authentication pending
                g.confirm(g.get.auth[data['auth']], function (result) {
                    if (result == true) {
                        if (data.authentication == '4') {
                            g.cookie.set('GSREGID', data['id']);
                            g.cookie.set('GSAUTH', 2);
                            g.cookie.set('GSREGGROUP', data['grp']);
                        }
                    }
                });
            } else {
                var gcookies = {
                    GSID: 'id',
                    GSGRP: 'grp',
                    GSNAME: 'name',
                    GSIMG: 'img',
                    LANG: 'lang',
                    sp: 'sp'
                };
                for (var c in gcookies) {
                    g.cookie.set(c, data[gcookies[c]]);
                }
				g.l(data)
				if(g.cookie.get('GSID')!='undefined'){
                location.href = "/";
				}
              //  g.l(data);
            }
        },'json');
    },
	register : {
		submit: function () {
			//check if mail exist
			var mail = $('#gs-mail').val().trim();
			var name = $('#gs-name').val().trim();
			g.db.func('validate', mail, function (mailres) {				
				if (mailres == "ok") {
					g.db.func('name_not_exist', name, function (nameres) {
						if (nameres == "ok") {
							var firstname = $('#gs-firstname').val().trim();
							var lastname = $('#gs-lastname').val().trim();
							var pass = $('#gs-pass').val().trim();
							var pass2 = $('#gs-pass2').val().trim();
							if (pass == pass2) {
								g.db.func("f","SELECT id FROM user WHERE mail='" + mail + "' OR name='" + name + "'", function (data) {																	
								if (data === false) {
									g.db.query("INSERT INTO user(name,firstname,lastname,mail,pass,grp,auth,registered) VALUES('" + name + "','" + firstname + "','" + lastname + "','" + mail + "','" + pass + "',2,1," + g.phptimestamp() + ")", function (insert) {										
									if (insert!='No') {
										g.ui.notify("success","Registration successfull");
										$("input").val('');
										}
									});
								} else {
									g.ui.notify("danger","Email or Name already exist");
								}
								//	$('#gs-subscribe-mail').val('');
								});
							}else{g.ui.notify("danger",'Password do not match!');}
						//	g.ui.form.reset_inputs(['#gs-mail', '#gs-name', '#gs-pass', '#gs-pass2'])
						}else{g.ui.notify("danger","Username validation problem")}
					})
				}else{g.ui.notify("danger","Email validation problem")}
			})
		},
		subscribe: function (mail) {
			//check if mail exist
			var mail = mail.trim();
			g.db.func('validate', mail, function (mailres) {				
				if (mailres == "ok") {
				g.db.func("f", "SELECT id FROM user WHERE mail='" + mail + "'", function (data) {
				//insert email, status
				if (data == 'No') {
				g.db.query("INSERT INTO user(mail,grp,registered) VALUES('" + mail + "',1," + g.phptimestamp() + ")", function (insert) {
				// g.l(insert)
				if (insert != 'No') {
					g.ui.notify("success","Subscription successfull");
				}
				});
				} else {
					g.ui.notify("danger","Email already exist");
				}
				$('#gs-subscribe-mail').val('');				
				});
				}else{g.ui.notify("danger","Email validation problem")}
			})				
			}
		},

		/********************
	LOAD PVARS TO PAGE
	!!! pvars should be load after widgets, so pvars inside widgets would load correctly
	********************/	
         pvars_get: function(){
		var pvars = $(".pvar").map(function () {
            return this.id;
        }).get();
		//g.l(pvars);
        // and insert and create an array
		if(pvars.length > 0){
        $.ajax({
            type: "POST",
            data: {a: 'pvars_get', b: JSON.stringify(pvars)},
            url: g.ajaxfile,
            dataType: "json",
            success: function (data) {
                //append pvars
                for (var i in data) {
					var content=decodeURIComponent(data[i].en);
                    if (data[i].type == "text" || data[i].type == "textarea") {
                        $('#' + data[i].name).text(content);
                    } else if (data[i].type == "html") {						
                        $('#' + data[i].name).html(content);
                    } else if(data[i].type == "img") {
                        $('#' + data[i].name).attr("src",content);
					} else if(data[i].type == "color") {
						$('#' + data[i].name).css("background",content);
                    }
                }
            },error:function(xhr,error){
				g.l(xhr)
				g.l(error)
			}
        });
		}
		},
	
/*	g.loadExt('form',function(){
	g.ui.form.newsubmit({
		adata:"user",
		append:"#registration",
		list:{
			0:{name:'name',placeholder:"username", params:"required"},
			1:{name:'firstname'},
			2:{name:'lastname'},
			3:{name:'nickname'},
			4:{name:'mail'},
			5:{name:'pass',params:"required"},
			6:{name:'pass1',params:"required"}
		}
	});
	})
	*/
    logout: function () {
        //clear session
        g.session.clear();
        g.cookie.deleteAll(['LANG']);
        location.href = '/';
    }
}

    // g.f={
//     adata: 'post',
//     fetch: ["fetchAll","SELECT post.*,user.id as userid,user.name,user.firstname,user.lastname,user.id as uid " +
//         "FROM post " +
//     "LEFT JOIN user ON post.uid=user.id"],
//     order: ["post.modified","DESC"],
//     params: "",
//     list: {
//         0: {row: 'id'},
//         1: {row: 'img', type: 'img'},
//         2: {row: 'name', type: 'a', href: "/dsh/users?uid=@uid"},
//         // 3: {row: 'firstname',nature:'editable'},
//         // 4: {row: 'lastname',nature:'editable'},
//         5: {row: 'status'},
//         6: {row: 'title', type: 'a', href: "/dsh/post?id=@id"},
//         7: {row: 'uri', type: 'a', href: g.siteurl+"@uri"},
//         // 8: {row: 'subtitle',attributes: ['class="gs-desktop"']},
//         // 9: {row: 'postgrpid'},
//         10: {row: 'published',type:'date'},
//         11: {row:'delete',label:'Delete',type:'button',query:"DELETE FROM post WHERE id=@id"}
//     }};

    //API
    g.api = function (com, callback){
        // g.l(command);
        //  var res = [];for (var i in command) {res.push(i + '=' + command[i]);};
        var idQ= typeof(com.id)!='undefined' ? "/"+com.id: "";
        var request = "https://"+document.domain+"/api/"+com.method+"/"+com.table+idQ;
        g.l(request);
        $.getJSON(request,callback);
    };

	g.setup={
	//gaia update
	gaia_update_button:function(appendid){    
		var find={
		   "selector": {"_id": {"$gt": null}},
		   "sort": [{"_id": "desc"}],"limit": 1
		   };
	g.cors("https://api.aimd5.com:6984/gaia/_find",JSON.stringify(find),function(res){ 
		g.l(res.docs[0]._id);	 					
		var gaia_latest_version=parseFloat(res.docs[0]._id).toFixed(2)
		var gaia_current_version= !GS.is ? parseFloat($('#current_version').val()).toFixed(2) : parseFloat(GS.is.system_version).toFixed(2);
		if (gaia_current_version==0){
			var html = '<button class="btn btn-success" id="update_gaia'+gaia_latest_version+'">Install GaiaCMS '+gaia_latest_version+'</button>';		
		}else if(gaia_latest_version == gaia_current_version){
				var html = 'Latest installed GaiaCMS version '+gaia_latest_version;				
		}else if(gaia_latest_version > gaia_current_version){		
				var html = 'Current GaiaCMS version '+gaia_current_version+' <button class="btn btn-success" id="update_gaia'+gaia_latest_version+'">Update gaiaCMS to '+gaia_latest_version+'</button>';
		}
			$(appendid).append(html);		
		},'POST');
		
	$(document).on("click","button[id^='update_gaia']",function(data){
		var version = this.id.replace('update_gaia','')
		$.get(g.ajaxfile,{a:"gaia_update",b:version},function(res){
			g.l(res);
			if(res[0]=="copied" && res[1]=="extracted"){
			g.ui.notify("success","GaiaCMS Update successful")	
			}else if (res=='nossh'){
			g.ui.notify("danger","SSH is not working on this system. Try download template and extract folder to domain/templates folder")
			}
		},"JSON");
	})		
	},
	//template update
	template_update_button:function(template,appendid){    
		var find={
		   "selector": {"_id": {"$gt": null}},
		   "sort": [{"_id": "desc"}],"limit": 1
		   };
	g.cors("https://api.aimd5.com:6984/templates/_find",JSON.stringify(find),function(res){ 
		g.l(res.docs[0]._id);	 					
		var template_latest_version=parseFloat(res.docs[0]._id).toFixed(2)
		var template_current_version= !GS.is ? parseFloat($('#template_current').val()).toFixed(2) : parseFloat(GS.is.system_version).toFixed(2);
		if (template_current_version==0){
			var html = '<button class="btn btn-success" id="update_gaia'+template_latest_version+'">Install tepmlate '+template_latest_version+'</button>';		
		}else if(template_latest_version == template_current_version){
				var html = 'Latest installed tepmlate version '+template_latest_version;				
		}else if(template_latest_version > template_current_version){		
				var html = 'Current tepmlate version '+template_current_version+' <button class="btn btn-success" id="update_template_'+template+'_'+template_latest_version+'">Update template '+template+' to '+template_latest_version+'</button>';
		}
			$(appendid).append(html);		
		},'POST');
		
	$(document).on("click","button[id^='template_update']",function(data){
		var version = this.id.replace('template_update','')
		$.get(g.ajaxfile,{a:"template_update",b:version},function(res){
			g.l(res);
			if(res[0]=="copied" && res[1]=="extracted"){
			g.ui.notify("success","GaiaCMS Update successful")	
			}else if (res=='nossh'){
			g.ui.notify("danger","SSH is not working on this system. Try download template and extract folder to domain/templates folder")
			}
		},"JSON");
	})		
	}
	}
	g.json={
		 form: function(id){
					var newform = $(id).serializeArray();	
					var json={};
					for(var i in newform){
						json[newform[i].name]=newform[i].value;
					}
					return json;
				}
	}
	
    "use strict";
    window.gaia = window.g= g;
    return gaia;
});