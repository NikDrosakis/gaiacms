/*updated:2020-01-29 20:20:34 ajax - v.0.73 - Author:Nikos Drosakis - License: GPL License*/
/*updated:2020-01-01 18:10:19
v.0.52
Author:Nikos Drosakis*/

/*updated:2020-01-01 18:02:14
v.
Author:Nikos Drosakis*/

//2017-11-01 09:29:17

if(!g){var g={};}

g.ajax= function (file, params,callback,method) {
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
}