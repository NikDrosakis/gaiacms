/*
* NODEJS API v0.1
- runs gaia library
 SUPPORTS
 A) GET MONGO,MYSQL,REDIS,JSON FILES
 B) POST MONGO,MYSQL,REDIS, JSON FILES
 C) DELETE MONGO,MYSQL,REDIS, JSON FILES
 D) REDIS PUBSUB R CHANNEL (PHP INSE(), QUERY() FUNCTIONS TO MYSQL sent as JQL)
 E) REDIS PUBSUB N CHANNEL  (COUNTERS DOTTED STRINGS converted to JQL)

 GET DATA FROM JSONS AND MYSQLS
 UPDATED req.query.[var] gets all query string variables, so
 we keep global schema /mongo/:first [database]/:sec [collection] / third is auth token
  m is for mongo
  l is for mysql
  r is for redis
  e is for exec
  c is for cassandra
  j is for json file


     //   if (err.toString().indexOf("EADDRINUSE")!== -1){
     //     shell.exec("/bin/bash /var/www/api/nodemon.sh 3005");
     //     }
     log(err);
* */
var g = require('./api/gaia'), https = require('https'), fs = require("fs"),
privateKey = fs.readFileSync( '/etc/letsencrypt/live/api.aimd5.com/privkey.pem', 'utf8'),
certificate = fs.readFileSync( '/etc/letsencrypt/live/api.aimd5.com/fullchain.pem', 'utf8'),
credentials = {key: privateKey, cert: certificate},
express = require('express'), app = express(),
httpsServer = https.createServer(credentials, app),
redis = require("redis").createClient,
red = redis({host:'0.0.0.0', port:6379, auth_pass: "n130177!" })
red.on("error", function (err) {g.l("Error " + err);});
const bodyParser = require("body-parser");
const { promisify } = require('util');
var cookieParser = require('cookie-parser');
app.use(bodyParser.json())
app.use(cookieParser())

g.l('RUNNING NODEJS API '+g.version+ ' at port:'+g.port);
//log uncaught errors
// process.on('uncaughtException',function(err){g.l(err)});
//A GET METHODS
app.get('/:type/:db/:collect', function (req, res) {
    var authorization=  Buffer.from(req.cookies['GSID']+req.cookies['sp']).toString('base64');
 //   res.header("Content-Type", "application/json; charset=utf-8");
    res.header('Access-Control-Allow-Methods', 'GET');
    res.header('Transfer-Encoding', 'chunked');
    res.header('Access-Control-Allow-Origin', req.get('origin'));
    res.header("Access-Control-Allow-Credentials", true);
    res.header("Authorization","Basic "+authorization);
    var type = req.params.type || '';
    var db = req.params.db || '';
    var collect = req.params.collect || '';
    // g.l(req.params);
    /*
    * MONGO GET API
    * */
    // g.l(req.params)
    if(type=="m") {
        //query params are two types: a) those for dbquery and b) reserved (not for dbquery use)
        // RESERVED: identity, limit
        var identity= req.query.hasOwnProperty('identity') ? req.query.identity : 0;
        var load= req.query.hasOwnProperty('load') ? req.query.load : "";
        //how we divid them
        req.params.q=req.query;
        g.l(req.params);
        var mon = require('./api/mongo')(req.params);
        mon.fetch(function (data) {
            if (!isNaN(data)) {
                res.status(200).send(data.toString());
            }else if (data == "no") {
                res.write(data);
                res.end();
            } else {
                /*
                * METHOD IDENTITY
                * PUSH REDIS identity
                * a) all users must be cached in redis
                *  implement with data[i]= s.identity(data[i]);
                * */
                /*
                * IDENTITY LOOP
                * */
                var dred = [], d = 0;
                d1 = 0;
                d2 = 0;
                if (identity == 1) {
                    for (var i in data) { //if one
                        if (typeof data[i]['uid'] != 'undefined') {
                            d += 1;
                            dred.push("me" + data[i]['uid']);
                        }
                        if (typeof data[i]['uid1'] != 'undefined') {
                            d1 += 1;
                            dred.push("me" + data[i]['uid1']);
                        }
                        if (typeof data[i]['uid2'] != 'undefined') {
                            d2 += 1;
                            dred.push("me" + data[i]['uid2']);
                        }
                    }
                }
                //askredis
                if (identity == 1 && dred.length > 0) {

                    red.select(2, function () {
                        if (dred.length > 0) {
                            red.mget(dred, function (error, result) {
                                if (error) {
                                    g.l(error);
                                }
                                if (d > 0) {
                                    var uid = result.slice(0, d);
                                    for (var j in uid) {
                                        data[j].identity = uid[j];
                                    }
                                }
                                if (d1 > 0) {
                                    var uid1 = result.slice(d, d + d1);
                                    for (var j in uid1) {
                                        data[j].identity1 = uid1[j];
                                    }
                                }
                                if (d2 > 0) {
                                    var uid2 = result.slice(d + d1, d + d1 + d2);
                                    for (var j in uid2) {
                                        data[j].identity2 = uid2[j];
                                    }
                                }
                                res.send(data);
                                res.end();
                            })
                        } // red.quit();
                    })
                } else if (identity == 1) {
                    g.l("case ONe Identity")
                    if (typeof data['uid'] != 'undefined') {
                        dred.push("me" + data['uid']);
                    }
                    if (typeof data['uid1'] != 'undefined') {
                        dred.push("me" + data['uid1']);
                    }
                    if (typeof data['uid2'] != 'undefined') {
                        dred.push("me" + data['uid2']);
                    }
                    red.select(2, function () {
                        red.get(dred, function (error, result) {
                            data['identity'] = result;
                            res.send(data);
                            res.end();
                        })
                    })
                } else {
                    //load is only for findOne
                    // if(load!="" && data.hasOwnProperty(load)){
                    //     res.send(data[load]);
                    // }else{
                    res.send(data);
                    // }
                    res.end();
                }
            }
        });

 /*
* MYSQL GET API
* */
    }else if (type=="e") {
        /*
		shell.exec('/usr/bin/php7.0 /var/www/spd4/crons/identity.php gr', function(code, stdout, stderr) {
            g.l('Exit code:', code);
            // console.log('Program output:', stdout);
            // console.log('Program stderr:', stderr);
        });
        // shell.exec("/bin/bash /var/www/api/nodemon.sh 3005");
//run a php cron
		*/
    }else if (type=="l") {
        var mon = require('./api/mysql')(req.params);
        mon.fetch(function (data) {
            // res.send(data);
            res.send(data);
            res.end();
        });
/*
* REDIS GET API
* */
    }else if (type=="r") {
        // var redis = require('redis').createClient;
        //UPDATE DIVIDE COLLECTION WITH (-) FOR MGET (MULTIPLE GET)

        red.select(db, function() {
            //c for command
             var c= !req.query.c ? 'get' : req.query.c;
             var col= c==='mget' ? collect.split('-') : collect;

            //UPDATE1 create POST
            //UPDATE2 return json of multiple results on criteria*
            red[c](col, function(error, result) {
                if (error) {g.l(error);}
                // var result= JSON.parse(result);
                res.send(result);
                // res.end();
            });
        });
/*
* json GET API
* */
    }else if (type=="j") {
        var data = fs.readFileSync(__dirname + "/local/" + sec + "/" + first + "_" + sec + ".json", 'utf8');
        res.send(data);
/*
* cassandra GET API
* */
    }else if (type=="c") {
        var mon = require('./api/cassandra')(req.params);
        mon.f(function (data) {
            res.send(data);
        });
    }
});

app.use(bodyParser.urlencoded({extended: false}));
//B  POST METHODS
app.post('/:type/:db/:collect', function (req, res) {
    //  res.header("Content-Type", "application/json; charset=utf-8");
     res.header('Access-Control-Allow-Origin', req.get('origin'));
     res.header('Access-Control-Allow-Methods', 'GET,POST');
    res.header("Access-Control-Allow-Credentials", true);
    // res.header("Authorization", "Basic " . base64_encode($_COOKIE['session-id'] . $_COOKIE['sp']));
    var type = req.params.type || '';
    var collect = req.params.collect || '';
    var db = req.params.db || '';
    var params= req.body;
    req.params.q=req.body;
    if(type=='m'){
        var mon = require('./api/mongo')(req.params);
        mon.query(function (data) {
            // g.l(data);
            res.send(data);
            res.end();
        });
    }else if(type=='sh'){
        /*
		//shell prm 1 2
        if(db!='' && collect!='') {
            shell.exec('/bin/bash /var/www/api/'+db+'.sh '+collect+' '+params.prm1+' ' + params.prm2, function(code, stdout, stderr) {
                // g.l('Exit code:', code);
                g.l('Program output:', stdout);
                g.l('Program stderr:', stderr);
                res.status(200).send(stdout.toString());
                res.end();
                // shell.exit(1);
            });
        }
		*/
    }
});

//C DELETE METHODS
app.delete('/:type/:db/:collect', function (req, res){
});

// startServer();
httpsServer.listen(g.port, function(){
    g.l('listening on *:'+g.port);
});