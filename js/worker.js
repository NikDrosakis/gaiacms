/*updated:2020-01-29 20:20:34 worker - v.0.73 - Author:Nikos Drosakis - License: GPL License*/
/*
 Dedicated WEB WORKERS API
 1. pass reply to public js file
 postMessage(res.responseText);

 2. include args from public js file
 self.addEventListener("message", function(e) {
 var args = e.data;
 g.ajax('/gaia/gajax.php',args,function(res){
 // do whatever you need with the arguments
 }, false);

 3. use it to load a json file with ajax
 g.ajax('data.json', function(xhr) {
 var result = xhr.responseText;
 });
 The circle is
 a) starting worker
 b) postMessage to worker.js to pass args
 c)worker.js
 1) importScripts("/gaia/js/ext/ajax.js") for ajax
 2) self.addEventListener("message", callback) to receive data
 3) on event callback and runs ajax or calculations or anything and sends
 postMessage(res.responseText);
 d) public js worker.onmessage receives data and appends or whatever

Inline web workers API
 <script id="worker1" type="javascript/worker">
 // This script won't be parsed by JS engines because its type is JavaScript/worker.
 // Simple code to calculate prime number and send it back to the parent page.
 self.onmessage = function(e) {
 self.postMessage("<h3>Worker: Started the calculation</h3><ul>");
 var n = 1;
 search: while (n < 500) {
 n += 1;
 for (var i = 2; i <= Math.sqrt(n); i += 1)
 if (n % i == 0)
 continue search;
 // found a prime!
 postMessage("<li>Worker: Found another prime: " + n + "</li>");
 }
 postMessage("</ul><h3>Worker: Done</h3>");
 }
 </script>

 Υοu can also use terminate() to stop worker.
*/ 
importScripts("/gaia/js/ext/ajax.js");

self.addEventListener("message", function(e) {
    var args = e.data;
    g.ajax('/gaia/gajax.php',args,function(res) {
    postMessage(res.responseText);
    })
}, false);