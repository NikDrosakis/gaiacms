/*updated:2020-02-11 13:00:45 init - v.0.73 - Author:Nikos Drosakis - License: GPL License*/
/*WEB WORKERS*/
//g.worker("/gaia/js/worker.js",{a:'worker',b:1},function(e){
    //g.l(e.data);
//})

//permission for Notification API
//g.ui.notification.permission();

//keys clicked
// function printKeys() {
//     if (18 in keys) {  //alt is pressed
//         //alt+l
//         if (76 in keys) {
//             $("#logout").click();
//         }
//         //alt+p
//         if (80 in keys) {
//             location.href='/'+SPNAME;
//         }
//         //alt+h
//         if (72 in keys) {
//             location.href='/home';
//         }
//         //alt+a
//         if (65 in keys) {
//             $.get('/ajax/login.ajax.php', {
//                 a: 'dash',
//                 b: GLOBAL.my.dash.name,
//                 c: GLOBAL.my.dash.pass,
//                 d: SPID
//             }, function (data) {
//                 log(data)
//                 if (data != 'no') {
//                     location.href = '/admin/dash.php';
//                 } else {
//                     bootbox.alert(dic.USERNAME_PASSWORD_NOT_CORRECT)
//                 }
//             })
//             // location.href = '/admin/dash.php';
//         }
//         //alt+m
//         if (77 in keys) {
//             var clearurl = location.href.split('//')[1];
//             if(clearurl.split('.')[0]=='m'){
//                 location.href= location.href.split('//')[0]+'//'+clearurl.split('.')[1]+'.'+clearurl.split('.')[2];
//             }else{
//                 location.href= location.href.split('//')[0]+'//m.'+clearurl;
//             }
//         }
//         //alt+ u
//         if(85 in keys){
//             change_lang('en');
//         }
//         //alt+ g
//         if(71 in keys){
//             change_lang('el');
//         }
//     }
// }
//
// $(document)
//     .keydown(function (e) {
//         keys[e.which] = true;
//         printKeys();
//     })
//     .keyup(function (e) {
//         delete keys[e.which];
//         printKeys();
//     });


$(document).keypress(function(e) {
    if(e.which == 13) {
        g.l('pressed '+e.which)
        $('.key'+e.which).click();
    }
})

//DOCUMENT READY
$(document).ready(function () {

    //BOOTSTRAP TOOLTIPS activate
    $('[data-toggle="tooltip"]').tooltip();

    /*activate editor*/
    // if(g.get.page=='dsh') {
    //     $('.wysiwyg').summernote();
    // }
	
	/********************
	LOAD WIDGETS TO PAGE
	********************/	
	if(GS!=null){
		var widareas = $(".wid").map(function () {
            return "#"+this.id;
        }).get();
		//g.l(widareas);
		if(widareas.length > 0){		
	//if(GS.pagetype=='post' || GS.pagetype==''){
		var jsonfile=GS.PAGESURI+GS.pagetype+'.json';
	//	g.l(jsonfile);
		var page=GS.page!='' ? GS.page :'index';
		var criteria={a:'load_widgets',areas:JSON.stringify(widareas),jsonfile:jsonfile,page:page,pagetype:GS.pagetype,mode:GS.mode };
		g.l(criteria)
		$.post(g.ajaxfile,criteria,function(res){
	//	g.l(res)		
		for(var i in res){	
		$(i).append(res[i]);
		}
		
		//run pvars get
		g.init.pvars_get();
		
		
		},"json");
		}

	//DASHBAR
	var usergrps = !GS.usergrps 
			? {1: "user", 2: "subscriber", 3: "writer", 4: "editor", 5: "admin", 6: "manager", 7: "developer", 8: "CEO"}
			: GS.usergrps;
	
    var GSID = g.cookie.get("GSID");
    var GSIMG = g.cookie.get("GSIMG");
    var GSGRP = g.cookie.get("GSGRP");
    var GSNAME = g.cookie.get("GSNAME");
    var loggedin = g.cookie.get('GSID') != false && GSGRP > 2 ? true : false;
    $(document)
        .on('click', '.menuopener, #menu-opener2', function () {
            if($('#dashbar').css('display')=='none') {
                $('#dashbar').show('fast');
            }else{
                $('#dashbar').hide('fast');
            }
        })
// pagevars
//         g.varpage.get();
//         g.varglobal.get();
 //   g.loadExt('mogal',function(){
        g.ui.viewer.img();
    //})
    
   // if (GS.is == "1") {
     //       g.ui.aaa(event);
    //}
}

// if(g.curdir!='dsh') {
//     g.apis.fb();
// }
})


/* MAN 
var man = {
    cookie: 'Cookie storage object with get, set, expires, clear, delete properties.\n USAGE: \n g.cookie.get("browser"),g.cookie.set("newcookie","newcookievalue"),g.cookie.delete("newcookie")',
    session: 'Session storage object with get, set, unset and clear properties.\n USAGE: \n g.session.get("session"),g.session.set("newsession","newsessionvalue"),g.session.delete("newsession")'
}
var gprop = Object.getOwnPropertyNames(g);
for (i in gprop) {
    if (typeof (g[gprop[i]]) != 'undefined') {
        g[gprop[i]]['man'] = 'This is the man of the g.' + gprop[i] + ' of gaia.js version ' + g.version + '.\n ' + man[gprop[i]];
        // g.l(g[gprop[i]]['man'])
    }
}*/