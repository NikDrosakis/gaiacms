// "use strict";
/*
 spdjs v2.0
 main object 
 - notify 
 - add location/classification chained forms 
 
 UPDATES
 groups all functions
 1. g.forms
 runs libs.js
+ form 
+ s.api that talks to api express 3004 (mongo,maria,redis)
? add multiple maria requests for count/search
+ s.chat integration with WebSocket talks with nodejs webrtc 3003
 
 make extendable 
 ? add rules 
 ? add talking with socketio webrtc streaming
 --> work with async await 
 
 */
( function( global, factory ) {
    if ( typeof module === "object" && typeof module.exports === "object" ) {
        module.exports = global.document ?
            factory( global, true ) :
            function( w ) {
                if ( !w.document ) {
                    throw new Error( "spd requires a window with a document" );
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
            s.alert("Version is not compatible. Please, update Internet Explorer.");
        }
    };
    /*
     FIXES OLD BROWSERS
     */
    if (typeof String.prototype.trim !== 'function') {
        String.prototype.trim = function () {
            return this.replace(/^\s+|\s+$/g, '');
        }
    };

    //check for enabled cookies
    if (navigator.cookieEnabled == false) {
        s.alert("Please, enable cookies from your browser settings to continue.");
    }
//set g
    var s = {};

    s.webstorage = {
        name : "",
        cookie: {
            get: function (name, r) {
                return (r = RegExp('(^|; )' + encodeURIComponent(name) + '=([^;]*)').exec(document.cookie)) ? r[2] : false;
            },
            set: function (name, value,time,domain) {
                var dmn= !domain ? ((s.serverbase()) ? ";domain=" + s.serverbase() : "") : ";domain=" + domain;
                if (document.cookie.indexOf(name) >= 0) {this.clear(name);}
                var now = s.Dat(),nowtime = now.getTime(),expireTime = !time ? nowtime+ 1000*36000*1000 : nowtime + (time*1000);now.setTime(expireTime);
                document.cookie = name + "=" + value + ";expires=" + now.toUTCString() +";"+ dmn + ";path=/;SameSite=None; Secure";
                return true;
            },
            expires: function (name, value, expires, path) {
                if (document.cookie.indexOf(name) >= 0) {
                    document.cookie = name + "=" + value + "; expires=" + expires + "; path=/";
                }
            },
            clear: function (name) {
                if (document.cookie.indexOf(name) >= 0) {
                    document.cookie = name + "=; expires=Thu, 01 Jan 1970 00:00:00 UTC";
                }
            },
            del: function (name,domain) {
                    var dmn= !domain ? (s.serverbase()!=null ? ";domain=" + '.'+s.serverbase() : "") : ";domain=" + domain;
                    document.cookie = name+"=;"+dmn+";path=/;expires=Thu, 01 Jan 1970 00:00:01 GMT;max-age=0";
            },			
            delAll: function (except) {
				s.l(document.cookie)
                var cookies = document.cookie.split(";");
                for (var i = 0; i < cookies.length; i++) {
                    var cookie = cookies[i];
                    var eqPos = cookie.indexOf("=");
                    var name = eqPos > -1 ? cookie.substr(0, eqPos).trim() : cookie.trim();
                    if (!s.inList(name, except)) {
                        s.l(name)
                        this.del(name);
                    }
                }
            }
        },
        //sessionStorage update with Chainable (Cascading) Methods
        session: {
            'name':'',
            'get': function (name) {
                if (sessionStorage.getItem(name)) {
                    return sessionStorage.getItem(name);
                }else{
                    return false;
                }
            },
            'set': function (name, value) {
                sessionStorage.setItem(name, value);
                return this;
            },
            'unset': function (name) {
                sessionStorage.removeItem(this.name);
                return this;
            },
            'clear': function () {
                sessionStorage.clear();
                return this;
            }
        },
        //sessionStorage
        local: {
            get: function (name) {
                if (localStorage.getItem(name)) {
                    return localStorage.getItem(name);
                } else {
                    return false;
                }
            },
            getby : function(k) {
                var results = [];
                for (var key in window.localStorage) {
                    if (key.indexOf(k) !== -1) {
                        results.push(key);
                    }
                }
                return results.length > 0 ? results :false;
            },
            set: function (name, value) {
                localStorage.setItem(name, value);
            },
            unset: function (name) {
                localStorage.removeItem(name);
            },
            clear: function (name) {
                localStorage.clear();
            }
        }
    };

    s.vars = {	
	 size : function(obj) {
            var size = 0, key;
            for (key in obj) {
                if (obj.hasOwnProperty(key)) size++;
            }
            return size;
        },
        hash: function () {
            function s4() {
                return Math.floor((1 + Math.random()) * 0x10000)
                    .toString(26)
                    .substring(1);
            }
            return s4() + s4() + s4() + s4() + s4() + s4() + s4() + s4();
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
		sizeobj: function  (obj) {
            var size = 0, key;
            for (key in obj) {
                if (obj.hasOwnProperty(key)) size++;
            }
            return size;
        },
        getkey:function(obj,val){
            for( var prop in obj) {
                if( obj.hasOwnProperty( prop ) ) {
                    if( obj[ prop ] === val )
                        return prop;
                }
            }
        },
        changeObjkey: function(obj,key,newkey,del){
            if(del==true) {delete obj[key];}else {Object.defineProperty(obj, newkey,Object.getOwnPropertyDescriptor(obj, key));delete obj[key];}return obj;
        },	
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
		streamapps:{1:"inter",2:"offer",3:"prop",4:"loan",5:"afer"},
        interval:[],
        interval_order:function() {
            var order={};
            for(var i in this.interval) {
                order[i]= this.interval[i];
            }
            return order;
            // setInterval(function(){
            // for(var i in this.interval) {
            //   this.interval[i]();
            // }
            // },starting);
        },
        _: function (selector) {
            return document.querySelector(selector);
        },
		i:function(x){
			return isNaN(parseInt(x)) ? x : parseInt(x);
		},
        l: function (val, color, style) {
            if (window.console)
                if(window.navigator.userAgent.indexOf("Edge") > -1){
                    return console.log(val);
                }else {
                    if (typeof val == 'object') {
                        return console.table(val);
                    } else {                        
						var style='font-weight: bold; font-size: 30px;color: red;';
                        return console.log('%c' + val, style);
                    }
                }
        },
        isMacLike : function(){return navigator.platform.match(/(Mac|iPhone|iPod|iPad)/i) ? true : false;},
        isNotification: function(){return !("Notification" in window) ? false : true},
        serverbase: function () {
            return this.hostArray.length == 3 ? this.hostArray[1] + "." + this.hostArray[2] : window.location.host
        },
        isWorkersAvailable: function() {
            return !!window.Worker;
        },
        isJS : function (url) {
                var scripts = document.getElementsByTagName('script');
                for (var i = scripts.length; i--;) {
                    if (scripts[i].src == url) return true;
                }
        return false;
        },
        isCSS : function (url) {
                var cssfiles = document.getElementsByTagName('link');
                for (var i = cssfiles.length; i--;) {
                    if (cssfiles[i].href == url) return true;
                }
        return false;
        },
        is_json :function(str) {
            try {JSON.parse(str);} catch (e) {return false;}return true;
        },
        isFunction :function(checkedfunction) {
        return checkedfunction && {}.toString.call(checkedfunction) === '[object Function]';
        },
        urlExists: function (url){
            if(url){
                var req = new XMLHttpRequest();
                req.open('GET', url, false);
                req.send();
                return req.status==200;
            } else {
                return false;
            }
        },
		inList: function (needle, haystack, argStrict) { //in_array
			var key = '',
				strict = !! argStrict;
			//we prevent the double check (strict && arr[key] === ndl) || (!strict && arr[key] == ndl)
			//in just one for, in order to improve the performance
			//deciding wich type of comparation will do before walk array
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
		find:function(q){
			
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
        shell_exec: function (command, callback) {
            $.get('/ajax/init.ajax.php', {a: 'shell_exec', b: command}, callback);
        },
        cachereset: function () {
            $.get('/ajax/init.ajax.php', {a: 'cachereset'},function(data){s.l(data);});
        },
        get_css:function(div){
            var para = document.querySelector(div);
            return window.getComputedStyle(para);
        },
        addmod:function(mod,params,callback){
            this.loadCSS('/mods/' + mod + '/style.css','head');            
            this.loadJS('/mods/' + mod + '/' + mod + '.js','body',function(){
            $.ajax({
                type: 'POST',
                url: "/mods/" + mod + "/" + params.file + ".php",
                data: params,
                success: function (res) {
                    bootbox.dialog({
                        className: (!params.class ? "" : params.class),
                        title: params.file,
                        success: {},
                        callback: function () {},
                        message: res
                    });
                }, error: function (xhr, status, error) {
                    log(status);
                    log(xhr.responseText);
                    log(error);
                }
            }).then(callback)
            });
        },
        whichBrowser:function(){
                var ua= navigator.userAgent, tem,
                    M= ua.match(/(opera|chrome|safari|firefox|msie|trident(?=\/))\/?\s*(\d+)/i) || [];
                if(/trident/i.test(M[1])){
                    tem=  /\brv[ :]+(\d+)/g.exec(ua) || [];
                    return 'IE '+(tem[1] || '');
                }
                if(M[1]=== 'Chrome'){
                    tem= ua.match(/\b(OPR|Edge)\/(\d+)/);
                    if(tem!= null) return tem.slice(1).join(' ').replace('OPR', 'Opera');
                }
                M= M[2]? [M[1], M[2]]: [navigator.appName, navigator.appVersion, '-?'];
                if((tem= ua.match(/version\/(\d+)/i))!= null) M.splice(1, 1, tem[1]);
                return M.join(',');
        },
        phptimestamp: function () {
            // var time= typeof timestamp!='undefined' ? jstimestamp: Date.now();
            return Math.floor(Date.now() / 1000);
        },
		//replace new Date() with s.Dat() that takes timezone difference		
		Dat:function(){
			var d= new Date();
			if(s.cookie.get('tzdiff')!=false){				
			d.setHours( d.getHours() + s.i(s.cookie.get('tzdiff')) );	
			}			
			return d;
		},
        date: function(format, timestamp) {
        var that = this;
		//var timestamp= !timest ?  this.phptimestamp() : timest;
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
        var formatChrCb = function(t, s) {
            return f[t] ? f[t]() : s;
        };
        var _pad = function(n, c) {
            n = String(n);
            while (n.length < c) {
                n = '0' + n;
            }
            return n;
        };
        f = {
            // Day
            d: function() { // Day of month w/leading 0; 01..31
                return _pad(f.j(), 2);
            },
            D: function() { // Shorthand day name; Mon...Sun
                return f.l()
                    .slice(0, 3);
            },
            j: function() { // Day of month; 1..31
                return jsdate.getDate();
            },
            l: function() { // Full day name; Monday...Sunday
                return txt_words[f.w()] + 'day';
            },
            N: function() { // ISO-8601 day of week; 1[Mon]..7[Sun]
                return f.w() || 7;
            },
            S: function() { // Ordinal suffix for day of month; st, nd, rd, th
                var j = f.j();
                var i = j % 10;
                if (i <= 3 && parseInt((j % 100) / 10, 10) == 1) {
                    i = 0;
                }
                return ['st', 'nd', 'rd'][i - 1] || 'th';
            },
            w: function() { // Day of week; 0[Sun]..6[Sat]
                return jsdate.getDay();
            },
            z: function() { // Day of year; 0..365
                var a = this.Dat(f.Y(), f.n() - 1, f.j());
                var b = this.Dat(f.Y(), 0, 1);
                return Math.round((a - b) / 864e5);
            },

            // Week
            W: function() { // ISO-8601 week number
                var a = this.Dat(f.Y(), f.n() - 1, f.j() - f.N() + 3);
                var b = this.Dat(a.getFullYear(), 0, 4);
                return _pad(1 + Math.round((a - b) / 864e5 / 7), 2);
            },

            // Month
            F: function() { // Full month name; January...December
                return txt_words[6 + f.n()];
            },
            m: function() { // Month w/leading 0; 01...12
                return _pad(f.n(), 2);
            },
            M: function() { // Shorthand month name; Jan...Dec
                return f.F()
                    .slice(0, 3);
            },
            n: function() { // Month; 1...12
                return jsdate.getMonth() + 1;
            },
            t: function() { // Days in month; 28...31
                return (this.Dat(f.Y(), f.n(), 0))
                    .getDate();
            },

            // Year
            L: function() { // Is leap year?; 0 or 1
                var j = f.Y();
                return j % 4 === 0 & j % 100 !== 0 | j % 400 === 0;
            },
            o: function() { // ISO-8601 year
                var n = f.n();
                var W = f.W();
                var Y = f.Y();
                return Y + (n === 12 && W < 9 ? 1 : n === 1 && W > 9 ? -1 : 0);
            },
            Y: function() { // Full year; e.g. 1980...2010
                return jsdate.getFullYear();
            },
            y: function() { // Last two digits of year; 00...99
                return f.Y()
                    .toString()
                    .slice(-2);
            },

            // Time
            a: function() { // am or pm
                return jsdate.getHours() > 11 ? 'pm' : 'am';
            },
            A: function() { // AM or PM
                return f.a()
                    .toUpperCase();
            },
            B: function() { // Swatch Internet time; 000..999
                var H = jsdate.getUTCHours() * 36e2;
                // Hours
                var i = jsdate.getUTCMinutes() * 60;
                // Minutes
                var s = jsdate.getUTCSeconds(); // Seconds
                return _pad(Math.floor((H + i + s + 36e2) / 86.4) % 1e3, 3);
            },
            g: function() { // 12-Hours; 1..12
                return f.G() % 12 || 12;
            },
            G: function() { // 24-Hours; 0..23
                return jsdate.getHours();
            },
            h: function() { // 12-Hours w/leading 0; 01..12
                return _pad(f.g(), 2);
            },
            H: function() { // 24-Hours w/leading 0; 00..23
                return _pad(f.G(), 2);
            },
            i: function() { // Minutes w/leading 0; 00..59
                return _pad(jsdate.getMinutes(), 2);
            },
            s: function() { // Seconds w/leading 0; 00..59
                return _pad(jsdate.getSeconds(), 2);
            },
            u: function() { // Microseconds; 000000-999000
                return _pad(jsdate.getMilliseconds() * 1000, 6);
            },

            // Timezone
            e: function() { // Timezone identifier; e.g. Atlantic/Azores, ...
                // The following works, but requires inclusion of the very large
                // timezone_abbreviations_list() function.
                /*              return that.date_default_timezone_get();
                 */
                throw 'Not supported (see source code of date() for timezone on how to add support)';
            },
            I: function() { // DST observed?; 0 or 1
                // Compares Jan 1 minus Jan 1 UTC to Jul 1 minus Jul 1 UTC.
                // If they are not equal, then DST is observed.
                var a = this.Dat(f.Y(), 0);
                // Jan 1
                var c = Date.UTC(f.Y(), 0);
                // Jan 1 UTC
                var b = this.Dat(f.Y(), 6);
                // Jul 1
                var d = Date.UTC(f.Y(), 6); // Jul 1 UTC
                return ((a - c) !== (b - d)) ? 1 : 0;
            },
            O: function() { // Difference to GMT in hour format; e.g. +0200
                var tzo = jsdate.getTimezoneOffset();
                var a = Math.abs(tzo);
                return (tzo > 0 ? '-' : '+') + _pad(Math.floor(a / 60) * 100 + a % 60, 4);
            },
            P: function() { // Difference to GMT w/colon; e.g. +02:00
                var O = f.O();
                return (O.substr(0, 3) + ':' + O.substr(3, 2));
            },
            T: function() {
                return 'UTC';
            },
            Z: function() { // Timezone offset in seconds (-43200...50400)
                return -jsdate.getTimezoneOffset() * 60;
            },

            // Full Date/Time
            c: function() { // ISO-8601 date.
                return 'Y-m-d\\TH:i:sP'.replace(formatChr, formatChrCb);
            },
            r: function() { // RFC 2822
                return 'D, d M Y H:i:s O'.replace(formatChr, formatChrCb);
            },
            U: function() { // Seconds since UNIX epoch
                return jsdate / 1000 | 0;
            }
        };
        this.date = function(format, timestamp) {			
			format=!format ? 'Y-m-d H:i' : format;
			//offset=!offset ? 2 : offset;
            that = this;			
			jsdate = (timestamp === undefined ? this.Dat() : // Not provided			
                    (timestamp instanceof Date) ? this.Dat(timestamp) : // JS Date()
                        this.Dat(timestamp * 1000) // UNIX timestamp (auto-convert to int)
            );			
			//jsdate.getHours()+offset;
            return format.replace(formatChr, formatChrCb);
        };
        return this.date(format, timestamp);
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
                    return Math.round(future / 1000) + ' ' + "SECONDS";
                }
                else if (future < msPerHour) {
                    return Math.round(future / msPerMinute) + ' ' + "MINUTES";
                }
                else if (future < msPerDay) {
                    return Math.round(future / msPerHour) + ' ' + "HOURS";
                }
                else if (future < msPerMonth) {
                    return Math.round(future / msPerDay) + ' ' + "DAYS";
                }
                else if (future < msPerYear) {
                    return 'approx ' + Math.round(future / msPerMonth) + ' ' + "MONTHS";
                }
                else {
                    return 'approx ' + Math.round(future / msPerYear) + ' ' + "YEARS1";
                }
            } else {
                if (elapsed < msPerMinute) {
                    return Math.round(elapsed / 1000) + ' ' + "SECONDS" + ' ' + "AGO";
                }
                else if (elapsed < msPerHour) {
                    return Math.round(elapsed / msPerMinute) + ' ' + "MINUTES" + ' ' + "AGO";
                }
                else if (elapsed < msPerDay) {
                    return Math.round(elapsed / msPerHour) + ' ' + "HOURS" + ' ' + "AGO";
                }
                else if (elapsed < msPerMonth) {
                    return Math.round(elapsed / msPerDay) + ' ' + "DAYS" + ' ' + "AGO";
                }
                else if (elapsed < msPerYear) {
                    return 'approx ' + Math.round(elapsed / msPerMonth) + ' ' + "MONTHS" + ' ' + "AGO";
                }
                else {
                    return 'approx ' + Math.round(elapsed / msPerYear) + ' ' + "YEARS1" + ' ' + "AGO";
                }
            }
        },
        get: typeof G!='undefined' ? G :'',
        // man: "PHP timestamp, equivalent to php time()",
        // usage: "g.phptimestamp.get()",
        // get : function() { var vars = {}; var parts = window.location.href.replace(/[?&]+([^=&]+)=([^&]*)/gi, function(m,key,value) {vars[key] = value;});return vars;},
        hash_target: window.location.hash.split('#')[1],
        // siteurl: GS.REFERER+ window.location.host + '/',
        hostArray: window.location.host.split('.'),
        host: function () {
            if (this.hostArray[0] == 'www') {
                this.hostArray.splice(0, 1);
            }
            return this.hostArray.join('.');
        },
        pathExt: window.location.host.toString().split('.')[0] == 'm' ? window.location.host.toString().split('.')[2]  //mobile m.
            : (typeof window.location.host.toString().split('.')[2] != 'undefined' //com.au
                ? window.location.host.toString().split('.')[1] + '.' + window.location.host.toString().split('.')[2]
                : window.location.host.toString().split('.')[1]),
        country: typeof window.location.host.toString().split('.')[2] != 'undefined'
            ? window.location.host.toString().split('.')[2]
            : window.location.host.toString().split('.')[1],
        serverbase: function () {
            return this.hostArray.length == 3 ? this.hostArray[1] + "." + this.hostArray[2] : window.location.host;
        },
        curdir: window.location.href.toString().split('/')[3],
        urlfile: typeof window.location.href.toString().split('/')[3] == 'undefined'
            ? window.location.href.toString().split('/')[2]
            : window.location.href.toString().split('/')[3],
        url: window.location.pathname,
        redirect:function(link){location.href=link;},
        lastget: function () {
            return window.location.pathname.substring(this.url.lastIndexOf('/') + 1);
        },
        my: typeof s.G != "undefined" ? s.G.my : '',
        loc: window.country,
        getJSON: function(json){
            // log(G)
            return G[json];
        },
        //type :  info |  danger | success | warning

        notify : function(type,message,title,url,img){
            $.notify({
                icon: !img ? 'glyphicon glyphicon-'+type+'-sign': img,
                title: title,
                message: message,
                url: url,
                target: '_blank'
            },{
                // options
                icon_type:(!img ? 'class': "image"),
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
                delay: 20000,
                timer: 1000,
                url_target: '_blank',
                mouse_over: null,
                animate: {
                    enter: 'animated fadeInUp',
                    exit: 'animated fadeOutUp'
                },
                onShow: null,
                onShown: null,
                onClose: null,
                onClosed: null,
                template: '<div data-notify="container" class="col-xs-11 col-sm-3 alert alert-{0}" style="width:'+(G.mobile ? "80":"20")+'% !important" role="'+type+'">' +
                '<button type="button" aria-hidden="true" class="close" data-notify="dismiss">×</button>' +
                '<span data-notify="icon"></span> ' +
                '<span data-notify="title">{1}</span> ' +
                '<span data-notify="message">{2}</span>' +
                '<div class="progress" data-notify="progressbar">' +
                '<div class="progress-bar progress-bar-{0}" role="progressbar" aria-valuenow="0" aria-valuemin="0" aria-valuemax="100" style="width: 0%;"></div>' +
                '</div>' +
                '<a href="{3}" target="{4}" data-notify="url"></a>' +
                '</div>'
            });
        },
        notification : {
            permission : function () {
                // Let's check if the browser supports notifications
                if (!("Notification" in window)) {
                    s.l("This browser does not support desktop notification");
                }else {

                    // Let's check whether notification permissions have already been granted
                    if (Notification.permission === "granted") {
                        // If it's okay let's create a notification
                        log('notication granted');
                    }

                    // Otherwise, we need to ask the user for permission
                    else if (Notification.permission !== "denied") {
                        Notification.requestPermission(function (permission) {
                            // If the user accepts, let's create a notification
                            if (permission === "granted") {
                                s.l('notication granted');
                                // var notification = new Notification("Hi there!");
                            }
                        });
                    }
                    // At last, if the user has denied notifications, and you
                    // want to be respectful there is no need to bother them any more.
                    // var iOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
                    // var mac =navigator.userAgent.indexOf('Mac OS X') != -1 ? true: false;
                    if (!s.isMacLike) {
                        Notification.requestPermission().then(function (result) {
                            log(result);
                        });
                    }
                }
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
         unset : function(){     },
        create:function(obj,callback){
            var json={}
            json["created"]=s.phptimestamp();
            json["img"]="/img/notifAlert4.png";
            json["uid"]=SPID;
            json["status"]=3;
            json["message"]="default content";
            var list=["uid","img","url","title","message"]
            //set default
            for(var i in list){
                if(obj.hasOwnProperty(list[i])){
                    json[list[i]]=obj[list[i]];
                    delete obj[list[i]];
                }
            }
            //set extra properties
            if(!isEmpty(obj)){for(var j in obj){json[j]=obj[j];}}
            s.l(json)
            //write to mongo through rest api
			s.api.mo.ins('activity',json);            
            //connect ui notification
  //s.notify("info","llalala","adsfasd","","https://scontent.fskg1-1.fna.fbcdn.net/v/t1.0-1/cp0/p48x48/1618687_409406912566708_1747594385123908937_n.jpg?_nc_cat=109&_nc_ohc=81eeP_-oXz8AX9_Xnx0&_nc_ht=scontent.fskg1-1.fna&oh=65ccba8ca1334b12aff41e0edc251575&oe=5E938048")
         //   s.notify("info",json.message,json.title,json.url,json.img);
        }
        },
        loadExt: function(ext,callback){
            this.loadJS('/js/ext/'+ext+'.js','head',callback);
        },
        roundTo: function(n, digits) {
            if (digits === undefined) {
                digits = 0;
            }
            var multiplicator = Math.pow(10, digits);
            n = parseFloat((n * multiplicator).toFixed(11));
            return (Math.round(n) / multiplicator).toFixed(2);
        },
        swap: function (json){
        var ret = {};
        for(var key in json){
            ret[json[key]] = key;
        }
        return ret;
        },
        gotorel : function (val){
            var exp= explode('_',val);
            if(exp[0]=='interview'){
                s.session.set('i_button',22);
                s.session.set('i_status',23);
                s.session.set('i_contact',exp[1]);
                location.href='/interview';
            }
        },
        func : function(b,c,d) {
            var b= b || '',c= c || '',d= d || '',
            di= typeof d === 'object' ? JSON.stringify(d): d;
         $.get('/ajax/init.ajax.php', {a: 'func', b:b, c: c, d: di}, function (data) {
            s.l(data);
            }, 'json');
        },
        counter : function(data) {
			return new Promise(function (resolve, reject) {
				s.api.ma.count(1,2,function(d){
					var res = d.val;
					d.uid = data.uid;
					d.savedat=date('Y-m-d H:i:s');
							resolve(d);
				});
			})
		},
        // $("ul[id^='iContainer_']").append("<li>dafadsfa<li>");
        interview_choices : function(iobj){        
        var ipanel='';
        iobj.grp=SPGROUP;
        iobj.now=s.phptimestamp();
        // iobj.start=Math.floor(Date.parse(iobj.start) / 1000);
        // iobj.start=Math.floor(Date.parse(iobj.start) / 1000);

        /*
         '0' => DELETED,			CLEAR
         '1' => TO_BE_DELETED,	NOT SUITABLE
         '2' => CV_VIEWED,
         '3' => SHORT_LISTED,
         '4' => SHORT_LIST_ALERTED, FINAL LIST
         '5' => INTERVIEW_REQUESTED,
         '6' => ASK RESCHEDULE,
         '7' => RESCHEDULE,
         '8' => INTERVIEW_CONFIRMED,
         '9' => INTERVIEW_DECLINED,
         '10' => INTERVIEW_CANCELLED,
         '11' => INTERVIEW_COMPLETED
         */
        //[status][grp]
// log(iobj.now)
// log(parseInt(iobj.start))
// log(parseInt(iobj.start))
// log(parseInt(iobj.start))
        var choi=[];choi[0]=[];choi[1]=[];choi[2]=[];choi[3]=[];choi[4]=[];choi[5]=[];choi[6]=[];choi[7]=[];choi[8]=[];choi[9]=[];choi[10]=[];choi[11]=[];
        choi[0][1]=null;
        choi[0][2]=[1,2,3,4,5];
        choi[1][1]=null;
        choi[1][2]=[0,2,3,4,5];
        choi[2][1]=null;
        choi[2][2]=[0,1,3,4,5];
        choi[3][1]=null;
        choi[3][2]=[0,1,2,4,5];
        choi[4][1]=null;
        choi[4][2]=[0,1,2,3,5];
        choi[5][1]= iobj.now > iobj.start + parseInt(is.inter_duration) ? [6] : (iobj.now > iobj.start ? [6,8] : [6,8,9]);
        choi[5][2]=[7,10];
        choi[6][1]=iobj.now > iobj.start + parseInt(is.inter_duration) ? [6] : (iobj.now > iobj.start ? [6,8] : [6,8,9]);
        choi[6][2]=[7,10];
        choi[7][1]=iobj.now > iobj.start + parseInt(is.inter_duration) ? [6] : (iobj.now > iobj.start ? [6,8] : [6,8,9]);
        choi[7][2]=[7,10];
        choi[8][1]=iobj.now > parseInt(iobj.start) - 1200 ? null : [9];
        choi[8][2]=[10,11];
        choi[9][1]=null;
        choi[9][2]=null;
        choi[10][1]=null;
        choi[10][10]=null;
        choi[11][1]=null;
        choi[11][2]=null;
        var line=[];
        var checkedLine='';
        var interviewed=[5,6,7,8];
        iobj.choices= choi;
        // s.l(iobj)
        for (var lin=0; lin<=11; lin++){

            checkedLine= lin==iobj.status ?'checked="checked"':'';
            if(G.uname=='interview'){
                line.push('<li><input ' + checkedLine + ' id="status_' + iobj.interid + '_' + lin + '" type="radio" name="interFlag' + iobj.interid + '" value="' + lin + '">' +
                    '<label for="Delete" id="lstatus_' + iobj.interid + '_' + lin + '" style="background-color:' + decodeURIComponent(L.iColorFlags[lin]) + '">' + G.INTERVIEWS.status2[lin][LANG] + '</label></li>');
            }else {
                line.push('<li><input ' + checkedLine + ' id="status_' + iobj.cid + '_'+ iobj.eoid + '_' + lin + '" type="radio" name="interFlag' + iobj.cid + '_'+ iobj.eoid + '" value="' + lin + '">' +
                    '<label for="status_' + iobj.cid + '_'+ iobj.eoid + '_' + lin + '" id="lstatus_' + iobj.cid + '_' + iobj.eoid + '_' + lin + '" style="background-color:' + decodeURIComponent(G.iColorFlags[lin]) + '">' + G.INTERVIEWS.status2[lin][LANG] + '</label></li>');
            }
        }

        if(choi.hasOwnProperty(iobj.status) && choi[iobj.status].hasOwnProperty([iobj.grp])){
            for(var x in choi[iobj.status][iobj.grp])	{
                if (iobj.interviewExist=='1' && s.inList(choi[iobj.status][iobj.grp][x],interviewed)) break;
                ipanel += line[choi[iobj.status][iobj.grp][x]];
            }
            return ipanel;
        }
    }
};

    /*
    * eg s.spd({b:'get',c:'isactive_1'},function(data){log(data)})
    * better
    * function(params){
            params['a']='func';
            $.get('/ajax/init.ajax.php',params,function(data){
                s.l(data);
            });
    * */
    s = $.extend({}, s.webstorage, s.vars);
    s.worker = function(file, args,callback,id) {
        if(s.isWorkersAvailable) {
            var name='wrk'+id;
            window[name] = new Worker(file);
            window[name].onerror = function (e) {
                throw new Error(e.message + " (" + e.filename + ":" + e.lineno + ")");
            };
            window[name].postMessage(args);
            window[name].onmessage = callback;
        }
    }

    s.ajax= function (file, params,callback,method) {
        var xhr;
        if(typeof XMLHttpRequest !== 'undefined') xhr = new XMLHttpRequest();
        else {
            var versions = ["MSXML2.XmlHttp.5.0",
                "MSXML2.XmlHttp.4.0",
                "MSXML2.XmlHttp.3.0",
                "MSXML2.XmlHttp.2.0",
                "Microsoft.XmlHttp"]
            for(var i = 0, len = versions.length; i < len; i++) {
                try {
                    xhr = new ActiveXObject(versions[i]);
                    break;
                }
                catch(e){}
            } // end for
        }
        xhr.onreadystatechange = ensureReadiness;
        function ensureReadiness() {
            if(xhr.readyState < 4) {
                return;
            }
            if(xhr.status !== 200) {
                return;
            }
            // all is well
            if(xhr.readyState === 4) {
                callback(xhr);
            }
        }
        var method = typeof method != 'undefined' ? method : 'GET';
        // params= {a:5,b:4}
        var res = [];
        for (var i in params) {
            res.push(i + '=' + params[i]);
        };
        var url = file + '?' + res.join('&');
        xhr.open(method, url, true);
        xhr.send('');
    };

    s.cors = function (url, params,callback,method) {
        var method=!method ? "GET" : method;         
		$.ajax({
            method: method,
            data:params,
            url:url,
            xhrFields: {
                withCredentials: true
            },
            crossDomain: true,
            success:callback			
        }).fail(function (msg) {
			s.l(msg);
		})
		};

    s.ui={
        // s.notify("info",json.message,json.title,json.url,json.img);
//sent when a notification is new
//status 3 new - status 2 active - status 0 checked read
//c_notify c_notify_payment
        abox: function(data,param) {
        var support = '', unread = 0, payment = 0;
        for (var i = 0; i < data.length; i++) {
            if (s.inList(data[i].status, [2, 3])) {unread += 1;}
            if (data[i].type == "payment" && s.inList(data[i].status, [2, 3])) {payment += 1;}
            var readClass = data[i].status == 2 ? 'messageMin' : 'messageMinUnread';
            var readTitle = data[i].status == 2 || data[i].status == 3 ? dic.MARK_AS_READ : dic.MARK_AS_UNREAD;
            var mark = data[i].status == 2 || data[i].status == 3 ? "style='background:#0B5C7B'" : "";
            var type=!data[i].type ? '' : data[i].type;
            support += '<div class="nCont aline' + data[i]._id + '">' +
                '<div class="phNotif"><img src="' + data[i].img + '" class="profile_photo7"></div>' +
                '<div class="nTit"><b>' + data[i].title + '</b></div>' +
                '<div class="nText">' + data[i].message + '</div>' +
                '<span class="nDate"><b>' + date('Y-m-d H:i', data[i].created) + '</b></span>' +
                (s.inList(data[i].status, [2, 3]) ? '<button param="'+param+'" type="'+type+'" id="statusaline' + data[i]._id + '" class="readMAct" ' + mark + ' title="' + readTitle + '"></button>':'') +
                '</div>';
            if (data[i].status == 3) {
                //update new to status 2
				s.api.mo.set('activity',{_id: data[i]._id},{status: "2"});                
                //send s.notify
                s.notify("info", data[i].message, data[i].title, data[i].url, data[i].img);
            }
        }
        //counters
        if(param!='page') {
            if (param=="list") {
                s.local.set('s_notify', unread);
                s.local.set('s_notify_payment', payment);
            } else if (param == "new") {
                s.local.set('s_notify', s.i(s.local.get('s_notify')) + unread);
                s.local.set('s_notify_payment', s.i(s.local.get('s_notify_payment')) + payment);
            }
            var unread_stored = s.i(s.local.get('s_notify'));
            var payment_stored = s.i(s.local.get('s_notify_payment'));
            if (unread_stored > 0) {$('.c_notify').html('<em class="c_Bottom ccyan">' + unread_stored + '</em>');} else {$('.c_notify').html('')}
            if (payment_stored > 0) {$('.c_notify_payment').html('<em class="c_Bottom ccyan">' + payment_stored + '</em>');} else {$('.c_notify_payment').html('')}
        }
        return support;
    },
	obj2table:function(obj,div){
			var cols = [];
			for (var k in obj) {
			  for (var c in obj[k]) {
				if (cols.indexOf(c)===-1) cols.push(c);
			  }
			}
			var html = '<table class=tftable><thead><tr>'+
				cols.map(function(c){ return '<th>'+c+'</th>' }).join('')+
				'</tr></thead><tbody>';
			for (var l in obj) {
			  html += '<tr>'+cols.map(function(c){ return '<td>'+(obj[l][c]||'')+'</td>' }).join('')+'</tr>';
			}
			html += '</tbody></table>';		  
			document.getElementById(div).innerHTML = html;
		},
        pagination: function (current,total_results,results_per_page,pgtitle){
		var pgtitle=!pgtitle ? '':pgtitle;
        var current = s.i(current);
        var last= Math.ceil(total_results/results_per_page);
        var previous = current!=1 ? '<button id="'+pgtitle+'_'+(s.i(current)-1)+'" class="but47"></button>':'';
        var firstb = '<button id="page'+pgtitle+'_1">1</button>';
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
            list += '<button id="page'+pgtitle+'_'+i+'">'+i+'</button>';
        }
        // var lastb = last >= 10 && current!=last ? '<button id="page_'+last+'">Last</button>':'';
        var lastb ='';
        var next = current!=last ? '<button id="page'+pgtitle+'_'+(s.i(current)+1)+'" class="but46"></button>':'';
        var pagination= '<div class="pagin">'+previous+firstb+list+lastb+next+'</div>';
        $('#paginik'+pgtitle).html(pagination);
        //set selected page
        $('#page'+pgtitle+'_'+current).addClass('but45'); //selected
    },
        gutu:function(obj){
            var exp= explode('|',obj.id);            
            $.get('/ajax/affiliate.ajax.php', {a: 'switch_profile2', b: exp[1],grp:exp[3],dir:CUR_DIR}, function (dat) {                
                var oldid= cookie('session-id');

                var sp= hash('sha256',dat.code+s.phptimestamp());
                cookieSet('sp', sp);
                s.ui.session.set(dat.uid,sp);

                if(CUR_DIR=='admin'){
                    cookieSet('session-id', exp[1]);
                    cookieSet('session-group', exp[3]);
                    cookieSet('su_uid', G.my.uid);
                    cookieSet('su_status', G.my.status);
                    if(exp[4]!=null){s.local.set('prev_dash','admiral');}
					if(exp[2]==""){
					var link='/user/' + dat["name"];						
					}else{
                    var link =  exp[3]=='1'
                        ? '/user/' + dat["name"] + '/cv?ep=' + exp[2] + '#cv'
                        : '/user/' + dat["name"] + '/post?pname=' + exp[2] + '#post';
					}
                    location.href = link;
                }else{
                    cookieSet('session-id', exp[1]);
                    cookieSet('session-group', 2);
                    // delete_cookie('su_uid');
                    $.get('/ajax/login.ajax.php', {
                        a: 'dashu',
                        b: cookie('su_uid'),
                        c: cookie('su_status'),
                        d: cookie('su_uid')
                    }, function (data) {                        
                        if (data != 'no') {
                            if(s.local.get('prev_dash')=='admiral') {
                                location.href = SITE_URL + 'admin/admiral?mode=list';
                            }else{
                                location.href = SITE_URL + 'admin/user?mode=board&uid=' + oldid;
                            }
                        } else {
                            bootbox.alert(dic.USERNAME_PASSWORD_NOT_CORRECT)
                        }
                    });
                }
            },'json');
        },
        view:{
            pdf:function(obj){
                event.preventDefault();
                var pdf_link = $(obj).attr('href');
                var iframe = '<div class="iframe-container"><iframe src="' + pdf_link + '"></iframe></div>'
                $.createModal({
                    title: obj.title,
                    message: iframe,
                    printButton: true,
                    closeButton: true,
                    scrollable: false
                });
                return false;
            }
        },
        logout:function(){
            //last logins
            var cu= s.i(s.cookie.get('session-id'));
            var pl = s.local.get('ll');
            var lls = !pl ? [] : JSON.parse(pl);
            if(!s.inList(cu,lls)){lls.push(cu);}
            s.local.set('ll',JSON.stringify(lls));
            s.local.unset('potentialCounter');
            //logout event
            $.get('/ajax/login.ajax.php',{a:'logout'},function(data){
                if(data=='yes'){
                    //clear session
                    var exceptPages=['prlgn','LANG','logo','old_userid'];
					s.cookie.set('old_userid',cu);
					
				//    s.cors("https://dev.speedemployer.gr:3005/mo/sessions", {a: "UNPUSH", uid:  s.i(s.cookie.get('session-id')),sp:s.cookie.get('sp'),updated:s.phptimestamp()},function(res){s.l(res)},'POST')
                    //last logins save
                    s.cookie.delAll(exceptPages);
                    //cookieSet('PHPSESSID',hash());
                    sessionClear();
                    //sessionSet('SPLOGGEDIN',0);
                    location.href=SITE_URL;
                }
            })
        },
        session: {
            set:function(uid,sp){
          //      if (window.navigator.geolocation) {
                var options = {
                    enableHighAccuracy: true,
                    timeout: 5000,
                    maximumAge: 0
                };
                function success(position) {
                    $.get('/ajax/init.ajax.php',{a:"sessions"},function(se) {
                        se['latitude'] = position.coords.latitude.toFixed(6);
                        se['longitude'] = position.coords.longitude.toFixed(6);
                        $.get("https://dev.virtualearth.net/REST/v1/Locations/" + se['latitude'] + "," + se['longitude'] + "?key=ArDnDPGYvEzVGfTSVEEG1HDm7F0SUmr6OlSaUA_XnjSASoFT4W2PjYW-lMqeWfGY", {}, function (res) {
                            se['location'] = res.resourceSets[0].resources[0].name;
                            //WRITE MONGO
                            var nest = JSON.stringify(se);
                            //s.cors("https://dev.speedemployer.gr:3005/mo/sessions", {a: "PUSH",nest: nest,uid: uid,sp: sp}, function (data) {
                              //  if (data.value != null) {log("it exists")} else {log("not exists")}
                            //}, "post");
                        })
                    },'json')
                }
                function error(err) {
                    log(err)
                    $.get('/ajax/init.ajax.php',{a:"sessions"},function(se) {
                            var nest = JSON.stringify(se);
                            //s.cors("https://dev.speedemployer.gr:3005/mo/sessions", {a: "PUSH",nest: nest,uid: uid,sp: sp}, function (data) {
                              //  if (data.value != null) {log("it exists")} else {log("not exists")}
                            //}, "post");
                    },'json')
                }
                if(!window.navigator.geolocation){
					$.get('/ajax/init.ajax.php',{a:"sessions"},function(se) {
                            var nest = JSON.stringify(se);
                           // s.cors("https://dev.speedemployer.gr:3005/mo/sessions", {a: "PUSH",nest: nest,uid: uid,sp: sp}, function (data) {
                             //   if (data.value != null) {log("it exists")} else {log("not exists")}
                            //}, "post");
                    },'json')
				}else{
				window.navigator.geolocation.getCurrentPosition(success, error, options);
				}
            },
            get:function(uid,callback){
                //s.cors("https://dev.speedemployer.gr:3005/mo/sessions",{limit:1,uid:uid}, callback);
            }
        },
		saveform(obj,table){
			//update with <form> non saving 			
			var newform=table.indexOf('|') !== -1 ? 1 : 0;
			var frm=table+"form";
			var coldo=G.schemado[table];
			var exp=explode('|',obj.id);
					s.l(exp)				
		
			if(exp[0]=="submit"){		
				var col=exp[1].replace(frm,'');	
				var val=in_array(coldo[col],['textarea2','textarea3']) ? $('#'+exp[1]).html() : $('#'+exp[1]).val();	
			}else if(in_array(exp[0],["check","radio"])){
				var col=obj.name.indexOf(frm)!== -1 ? obj.name.replace(frm,''):obj.id.replace(frm,'');			
				var checked=[];
				$(obj).each(function(){checked.push($(this).val());});
				var val=JSON.stringify(checked);
			}else{
				var col=obj.name.indexOf(frm)!== -1 ? obj.name.replace(frm,''):obj.id.replace(frm,'');
				//add checkbool checkbox
				var val= in_array(coldo[col],["checkbool"])?($(obj).is(':checked')?1:0):obj.value;		
			}					
			//	if(col in coldo){ 				
				var lapdotype=coldo[col]=="drop" ? "select":"input";	
				var postid=$('#postid').val();			
				var call={a:'dynform',b:table,c:col, d:val, e:postid,f:coldo[col]}
				s.l(call)
				if(!newform){
				$.get('/ajax.php',call,function(data){	if(data=='colok'){location.reload()}else{					
					if(exp[0]=="submit"){s.notify('success',"Saved")}else{s.notify('fail',"Not Saved")}
					}})						
				}
			},		
			formx(){
				s.l('running form','green')
			}			
    }
/*
return new Promise((resolve, reject) => {					
$.get(s.api.uri+'mo/'+col,params,function(d){	
	resolve(s.is_json(d) ? JSON.parse(d) : d)
	})
})	
*/
var my={};
	my.uid=s.cookie.get('session-id');
	my.grp=s.cookie.get('session-group');
const socket = new WebSocket('wss://aimd5.com:3003');
socket.onopen = function(e) {
	  s.notify("success",`WEBSOCKET Connection established`);
	s.sock.send({type:'open',uid:SPID,c:"connection established"});
	};
socket.onmessage = function(event) {s.sock.get(event);};
socket.onclose = function(event) {
  if (event.wasClean) {
    s.notify("info",`Connection closed cleanly, code=${event.code} reason=${event.reason}`);
  } else {
    s.notify("info",`Connection died`);
  }
};
socket.onerror = function(error) {
  s.notify("info",`${error.message}`);
};
/*WEBSOCKET 3003*/	
s.sock={ //type:open,message
	// Create WebSocket connection.
	send:function(mes){		
		socket.send(JSON.stringify(mes));		
	},
	get:function(ev){
		var data= JSON.parse(ev.data);
		if(data.type=='notify'){
		s.notify("info",`Data received from server: ${data.c}`) 
		}		
	if(data.type=="chat"){
		var now = date('Y-m-d H:i');	
		 var receive = `<div id='chatLine_${data.time}' class='chatLine'><div class='chatResponceCont'> \
            <img id='thatImage' class='chatBoardName1' src='${data.img}'> \
            <p class='triangle-isosceles left' id='remoteMember'>${data.c}</p> \
            <div class='chatDatetime'>${now}</div></div></div>`;		
		$('#chato').append(receive)
		scrollBottom('chato');		
	}
	}
}
s.chat={	
	start:function(cid,whom) {
		s.cookie.set('chatline',cid)
		 s.api.mo.getOne('chat',{cid: cid},function(d){
			 if(d.length==0){
				//get data from {1:"contact",2:"offercontact",3:"propcontact",4:"loadcontaxt"}
			 }
			 var html='';
			 var remoteuid=SPID==d.uid1?d.uid2:d.uid1;
			var chat=d.chat;
			s.api.ma.getOne("img,firstname,lastname FROM ur WHERE uid="+remoteuid,function(remote){			
			$('#chattitle').html(remote.firstname+" "+remote.lastname);
			var chatbox='';
			// if(typeof (d.length) !='undefined') {
			if(typeof chat !='undefined'){
            for (var i in chat) {
                if (SPID == chat[i].u) {
                    chatbox += '<div id="chatLine_' + chat[i].t + '" class="chatLine"><p class="triangle-isosceles right" id="localMember' + chat[i].u + '">' + chat[i].c + '</p>' +
                        '<div class="chatDatetime">' + date('Y-m-d H:i', chat[i].t) + '</div></div>';
                } else {
                    chatbox += '<div id="chatLine_' + chat[i].t + '" class="chatLine"><div class="chatResponceCont"><img id="thatImage' + chat[i].u + '" class="chatBoardName1" src="' + remote.img + '"><p class="triangle-isosceles left" id="remoteMember' + chat[i].u + '">' + chat[i].c + '</p>' +
                        '<div class="chatDatetime" >' + date('Y-m-d H:i', chat[i].t) + '</div></div></div>';
                }
            }
            $('#chato').html(chatbox);
			$('#chatsend').attr('data-uid1',d.uid1).attr('data-uid2',d.uid2).attr('data-cid',cid);
            s.cookie.set('chatline',cid)
			scrollBottom('chato');
			}		 
		 })		 
		 })		 
		if(mobile && mode!='chat'){location.href='/message/chat';}
	},
	send:function(obj){
		var mes= $(obj).data();
		var txt=$('#chatinput').text().trim();
		if(txt.length>0){
		mes.type="chat";
		mes.touid=mes.uid1==SPID ? mes.uid2:mes.uid1;
		mes.img=my.img
		mes.time=s.phptimestamp();
		mes.c=txt;$('#chatinput').text('');		
		var time = s.phptimestamp();
        var now = date('Y-m-d H:i');
       // var img = grp == 1 ? res.img2 : res.img1;
        //ui
		$('#chato').append("<div id='chatLine_" + time + "'><p class='triangle-isosceles right'>" + mes.c + "</p>" +
            "<div class='chatDatetime'>" + now + "</div></div>");
		scrollBottom('chato');				
		//send to peer
		s.sock.send(mes);
		//write to mongo 
		//s.api.mo.chatins(mes);
		const unread=mes.uid1==mes.touid ? "unread1" : "unread2";
		const who=mes.uid1==mes.touid ? s.i(mes.uid1) : s.i(mes.uid2);
		//s.api.mo.fup("chat",{cid:mes.cid},{$push: {chat: {"u": who, "c": mes.c, "t": mes.time}},$inc:{total:1},$inc:{[unread]:1}})
		//this one creates new also 
		s.api.mo.up('chat',{cid:s.i(mes.cid)},{$set:{cid:s.i(mes.cid),uid1:s.i(mes.uid1),uid2:s.i(mes.uid2)},$push:{chat: {"u": who, "c": mes.c, "t": mes.time}},$inc:{total:1},$inc:{[unread]:1}})
        //var who = res.sender == uid ? "local" : "remote";
        //var chat = who == "local" ? local : remote;
        //$("#chati").append(chat);
        //$('#chatText').show().focus();        
        //update counters
        // var where = grp== 1 ? {uid2: res.receiver}: {uid1: res.receiver};
				
	  //var json= {a: "UPDATE",INCR: {c_message_chat: 1, n_message_chat: 1},WHERE: {uid: res.receiver}};
        //s.cors('https://' + location.hostname + ":3005/m/dev1/counters",json,function(data){
          //  log(data);
            //},"POST");
		}
	},
	render:function(obj){
		if(typeof(obj)=="string"){
			var cid = obj;
			s.chat.start(cid)
			}else{
				if($(obj).attr('disabled')){
					bootbox.alert(dic.COM_NOT_ACTIVE);
					}else{						
					//$(obj).prop('disabled', true);
					var exp = explode('_', obj.id);
					log(exp)
					var whom = exp[1];
				if(G.mode=="chat"){
					$(".chatListMesLoop").css("backgroundColor","")
					$(obj).prop('disabled',false).css("backgroundColor","#ffffd7");
					var agent=!cookie('agent_uid')? 0 : 1;
					$.get('/ajax/message.ajax.php',{a:"mgt",b:whom,c:agent},function(code){
						log(code)
						if(code!="no") {
							$('#mgtContainer').html("<button class='mgt mgtinC' onclick='s.cookie.set(&quot;clients_page&quot;,1);s.cookie.set(&quot;mcli_q&quot;,&quot;" + code + "&quot;);location.href=&quot;/home/manage&quot;'>MGT</button>")
						}else{
							$('#mgtContainer').html("")
						}
					},"json")
				}
				var confirmTerms = exp[2];
				//check if terms & condition control box
				if (confirmTerms == 'confirmTerms' && !cookie('agent_uid')) {
					var cid = exp[3];
					$(document).on("click", "#confirmTerms", function () {
						if ($(obj).is(':checked')) {
							$('.btn-primary').removeClass('disabled');
							ajax('?a=affiliate_terms&b=' + cid + '&c=1', '/ajax/contact.ajax.php');
							$('#chat_' + whom + '_confirmTerms_' + cid).attr('id', 'chat_' + whom)
							// }
						} else {
							$('.btn-primary').addClass('disabled');
							ajax('?a=affiliate_terms&b=' + cid + '&c=0', '/ajax/contact.ajax.php');
							$('#chat_' + whom).attr('id', 'chat_' + whom + '_confirmTerms_' + cid)
						}
					})
					bootbox.dialog({
						message: confirmationText(0, cid),
						buttons: {
							main: {
								label: dic.PROCEED,
								className: "btn-primary disabled",
								callback: function () {
									s.chat.start(cid)
								}
							}
						}
					});
				} else {
					var cid = exp.length == 2 ? exp[1] : (exp.length == 4 ? exp[3] : exp[2]);
					s.chat.start(cid,whom)
				}
			}
			}
	}
}

s.api={
	uri:"https://dev.speedemployer.gr:3005/",	    
	version: 2.0,
	port: 3005,	
	mo:{		
		url:'mongodb://localhost:27017/',
		db:"dev1",		
		get:function(col,params,call){					
			if(typeof(params)!='undefined'){params['a']="get";}else{var params={a:'get'};}
			if(!call){			
				$.get(s.api.uri+'mo/'+col,params,function(d){	
				console.table(s.is_json(d) ? JSON.parse(d) : d);			
				})
			}else{
				$.get(s.api.uri+'mo/'+col,params,call);
			}	
		},		
		getOne:function(col,params,call){					
			if(typeof(params)!='undefined'){params['a']="getOne";}else{var params={a:'getOne'};}
			if(!call){			
				$.get(s.api.uri+'mo/'+col,params,function(d){	
				console.table(s.is_json(d) ? JSON.parse(d) : d);			
				})
			}else{
				$.get(s.api.uri+'mo/'+col,params,call);
			}	
		},
		set:function(col,where,params,call){	
			if(!call){			
				$.post(s.api.uri+'mo/'+col,{a:"set",where:JSON.stringify(where),params:JSON.stringify(params)},function(d){					
						console.table(s.is_json(d) ? JSON.parse(d) : d);							
					});
			}else{
				$.post(s.api.uri+'mo/'+col,{a:"set",where:JSON.stringify(where),set:JSON.stringify(params)},call);
			}	
		},		
		up:function(col,where,params,call){					
			if(!call){			
				$.post(s.api.uri+'mo/'+col,{a:"upsert",where:JSON.stringify(where),set:JSON.stringify(params)},function(d){					
						console.table(s.is_json(d) ? JSON.parse(d) : d);								
					});
			}else{
				$.post(s.api.uri+'mo/'+col,{a:"upsert",where:JSON.stringify(where),set:JSON.stringify(params)},call);
			}	
		},			
		fup:function(col,where,params,call){					
			if(!call){			
				$.post(s.api.uri+'mo/'+col,{a:"fup",where:JSON.stringify(where),set:JSON.stringify(params)},function(d){					
						console.table(s.is_json(d) ? JSON.parse(d) : d);								
					});
			}else{
				$.post(s.api.uri+'mo/'+col,{a:"fup",where:JSON.stringify(where),set:JSON.stringify(params)},call);
			}	
		},			
		upMany:function(col,where,params,call){	//updateMany add upsert inc decr	 			
			if(!call){			
				$.post(s.api.uri+'mo/'+col,{a:"upMany",where:JSON.stringify(where),set:JSON.stringify(params)},function(d){					
						console.table(s.is_json(d) ? JSON.parse(d) : d);								
					});
			}else{
				$.post(s.api.uri+'mo/'+col,{a:"upMany",where:JSON.stringify(where),set:JSON.stringify(params)},call);
			}	
		},
		del:function(col,params,call){	
			if(typeof(params)!='undefined'){params['a']="del";}else{var params={a:'del'};}
			if(!call){			
				$.post(s.api.uri+'mo/'+col,params,function(d){					
						console.table(s.is_json(d) ? JSON.parse(d) : d);								
					});
			}else{
				$.post(s.api.uri+'mo/'+col,params,call);
			}	
		},			
		delMany:function(col,params,call){	
			if(typeof(params)!='undefined'){params['a']="delMany";}else{var params={a:'delMany'};}
			if(!call){			
				$.post(s.api.uri+'mo/'+col,params,function(d){					
						console.table(s.is_json(d) ? JSON.parse(d) : d);								
					});
			}else{
				$.post(s.api.uri+'mo/'+col,params,call);
			}	
		},
		ins:function(col,obj,call){
			obj['a']="ins";
			if(!call){
			$.post(s.api.uri+'mo/'+col,obj,function(d){					
					console.table(s.is_json(d) ? JSON.parse(d) : d);						
				});
			}else{
			$.post(s.api.uri+'mo/'+col,obj,call);
			}
		},		
		insMany:function(col,obj,call){			
			if(!call){
			$.post(s.api.uri+'mo/'+col,{a:"insMany",set:JSON.stringify(obj)},function(d){					
					console.table(s.is_json(d) ? JSON.parse(d) : d);						
				});
			}else{
			$.post(s.api.uri+'mo/'+col,obj,call);
			}
		},
		chatins(msg,call){
			if(!call){
			$.post(s.api.uri+'mo/chatins',{q:JSON.stringify(msg)},function(d){
					console.table(s.is_json(d) ? JSON.parse(d) : d);
			});
			}else{
			$.post(s.api.uri+'mo/chatins',{q:JSON.stringify(msg)},call);	
			}
		}		
	},		
	ma:{
		db:"spd5devgr",
		methods:{},
		//api.mo.get('cols',{},function(res){obj2table(res,'dshResultBox')})
		show:function(query,call){				
			//var action=query.split(" ")[0].trim().toLowerCase();				
			//var query=query.split(' ').slice(1).join(' ');
			if(!call){
				$.get(s.api.uri+'ma/show',{q:query},function(d){					
					console.table(s.is_json(d) ? JSON.parse(d) : d);						
				},"JSON");
			}else{
				$.get(s.api.uri+'ma/show',{q:query},call,"JSON");
			}
		},
		get:function(query,call){								
			if(!call){
				$.get(s.api.uri+'ma/get',{q:query},function(d){					
					console.table(s.is_json(d) ? JSON.parse(d) : d);						
				},"JSON");
			}else{
				$.get(s.api.uri+'ma/get',{q:query},call,"JSON");
			}
		},		
		getOne:function(query,call){								
			if(!call){
				$.get(s.api.uri+'ma/getOne',{q:query},function(d){					
					console.table(s.is_json(d) ? JSON.parse(d) : d);						
				},"JSON");
			}else{
				$.get(s.api.uri+'ma/getOne',{q:query},call,"JSON");
			}
		},			
		set:function(query,call){								
			if(!call){
				$.post(s.api.uri+'ma/update',{q:query},function(d){					
					console.table(s.is_json(d) ? JSON.parse(d) : d);						
				},"JSON");
			}else{
				$.post(s.api.uri+'ma/update',{q:query},call,"JSON");
			}
		},		
		ins:function(query,array,call){ //??not finished
			if(!call){
				$.post(s.api.uri+'ma/insert into',{q:query,ins:JSON.stringify(array)},function(d){					
					console.table(s.is_json(d) ? JSON.parse(d) : d);						
				},"JSON");
			}else{
				$.post(s.api.uri+'ma/insert into',{q:query,ins:JSON.stringify(array)},call,"JSON");
			}
		},		
		count(uid,grp,call){
			if(!call){
			$.get(s.api.uri+'ma/count',{uid:uid,grp:grp},function(d){
					console.table(s.is_json(d) ? JSON.parse(d) : d);
			},"JSON");
			}else{
			$.get(s.api.uri+'ma/count',{uid:uid,grp:grp},call,"JSON");	
			}
		}	
	},	
	red:{
		get:function(key,call){	
			var action =key.indexOf("*") !== -1 ? 'keys':'get';
		if(!call){
			$.get(s.api.uri+'red/'+key,{action:action},function(d){					
				console.table(s.is_json(d) ? JSON.parse(d) : d);								
			});
		}else{
			$.get(s.api.uri+'red/'+key,call);
		}
		},
		lrange:function(key,call){		
		if(!call){
			$.get(s.api.uri+'red/'+key,{action:'lrange'},function(d){					
				console.table(s.is_json(d) ? JSON.parse(d) : d);								
			});
		}else{
			$.get(s.api.uri+'red/'+key,{action:'lrange'},call);
		}
		},
		set:function(key,val,call){					
		var val=typeof(val)=="object" ? JSON.stringify(val):val;
			if(!call){
			$.post(s.api.uri+'red/'+key,{action:"set",val:val},function(d){					
			console.table(s.is_json(d) ? JSON.parse(d) : d);								
				});
			}else{
				$.post(s.api.uri+'red/'+key,{val:val},call);
			}
		},
		rpush:function(key,val,call){					
		var val=typeof(val)=="object" ? JSON.stringify(val):val;
			if(!call){
			$.post(s.api.uri+'red/'+key,{action:"rpush",val:val},function(d){					
			console.table(s.is_json(d) ? JSON.parse(d) : d);								
				});
			}else{
				$.post(s.api.uri+'red/'+key,{val:val},call);
			}
		},
		del:function(key,call){		
		if(!call){
			$.post(s.api.uri+'red/'+key,{action:'del'},function(d){					
				console.table(s.is_json(d) ? JSON.parse(d) : d);								
			});
		}else{
			$.post(s.api.uri+'red/'+key,call);
		}
		},
	},	
	form:function(name,call){
	if(!call){
		s.api.mo.getOne('form',{name:name},function(d){					
		console.table(s.is_json(d) ? JSON.parse(d) : d);
		})
		}else{
			s.api.mo.getOne('form',{name:name},call)
		}
	},		
	my:function(uid,call){
	if(!call){
			s.api.mo.getOne('my',{uid:uid},function(d){					
			console.table(s.is_json(d) ? JSON.parse(d) : d);								
		});
		}else{
			s.api.mo.get('my',{uid:uid},call)
		}
	},
	path: {
		plugins: '/plugins/',
		img: '/img/',
		uploads: '/uploads/',
		thumbs: '/uploads/thumbs/',
		modules: '/modules/',
		templates: '/templates/',
		ajax: '/ajax/',
		css: '/css/',
		lib: '/lib/',
	}
	};	

    "use strict";
//	window.dic=await s.api.mo.get('form',{name:'dicen'});
    window.s= s;
    return s;
});