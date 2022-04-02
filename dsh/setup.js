/*updated:2020-01-29 20:20:34 setup - v.0.73 - Author:Nikos Drosakis - License: GPL License*/

g.setup.gaia_update_button('#version');
//update event with 
$(document).on("click","#setup_domain",function(){	
        event.preventDefault();
		var ver=$('#current_version').val().trim();
		var webserver=$('#webserver').text().trim();
		var domain=$('#domain_name').val();
		var dbhost=$('#dbhost').val();
		var dbuser=$('#dbuser').val();
		var dbname=$('#dbname').val();
		var email=$('#email').val();
		var system=$('#system').text();
		var domtype=$('#domtype').val();
        var gform = $("#gaiaform_install").serializeArray();
		var cmsjson = {};
        for (var i in gform) {
			if(gform[i].name=='domain_name'){
			//	var domain=gform[i].value;
				cmsjson[domain]={};
			}else{
            cmsjson[domain][gform[i].name] = gform[i].value;
			}
        }			
		var folder=cmsjson[domain].domain_folder;
		var cmsjsonfile= folder+"setup.json";
		g.l(folder);
		g.l(cmsjsonfile);
		g.l(cmsjson);
		g.l(domain);
		
		//1 send cmsjson of installation in COUCHDB/installations
		if(system=="Linux"){
		//2 create setup.json if not exist else update	
		var uri='/var/www/setup.json';	
		
		if(domtype=="main"){ //add to existing json based on tree given in setup.php
				newjson={}
				for (var i in tree){			
				newjson[i]=tree[i];						
				}
				newjson[domain]=cmsjson[domain];							
				g.file.put_contents(uri, newjson,function(data){
					if(data="ok"){g.ui.notify("success","Setup json finished");}
					})
			
		}else if(domtype=="parent"){
			g.file.put_contents(uri, cmsjson,function(data){
				g.l(data);		
			});
		}
		//3 run bash installation file setpu.sh
		//ver=$1 webserver=$2 domain=$3 dbhost=$4 dbuser=$5 dbname=$6 email=$7 domtype=$8		
		var command={a:"exec",b:"bash /var/www/gaia/dsh/setup_domain.sh "+ver+" "+webserver+" "+domain+" "+dbhost+" "+dbuser+" "+dbname+" "+email+" "+domtype+""};
		g.l(command);
		$.get('/gaia/dsh/clijax.php',command,function(res){
		 g.l(res)
		 if(res=="setup_domain_complete"){
			 g.ui.notify("success","Setup domain complete");
		 }		 
		});
		}else if(system=="WIN"){
		    $.ajax({
                type: "POST",
                data: {a: 'setup_domain', b: encodeURIComponent(cmsjsonfile),c: JSON.stringify(cmsjson,null,2),folder:folder,domain:domain},
                url: g.ajaxfile,
                success: function(data){
					g.l(data)
					//$.get(g.ajaxfile,{a:"exec",b:"NET STOP wampapache64 && NET START wampapache64"},function(shell){
					//g.l(shell);
					//g.init.register.submit();
					location.href="http://"+cmsjson[domain].domain_name;
					//})
				},
                error: function(xhr, ajaxOptions, thrownError){
					g.l(xhr)
					g.l(ajaxOptions)
					g.l(thrownError)
				}
            });
		}else{
		g.ui.notify("danger","Unknown or unsupported system");	
		}
     })
	 
	 /*
	 SYNC TEMPLATE
	 sync upload local to store
	 if api is in this computer
	 */
	 $(document).on("click","button[id^='synctemplate']",function(){
	 var id=this.id;
	 var exp=g.explode('_',this.id);
	 var domain=exp[1];
	 var template=exp[2];
	 var newver=String($(this).attr('version'));
	 var created=String(g.date('Y-m-d H:i'));
	var newdata={summary: "updated in "+domain+"", created: created}; //update with modal asking for a summary of changes
	//1 run bash installation file setpu.sh
	//ver=$1 webserver=$2 domain=$3 dbhost=$4 dbuser=$5 dbname=$6 email=$7 domtype=$8			
	
	//update template.json 
			var path= GS.REFERER+domain+"/templates/"+template+"/template.json";
			var uri= GS.GAIABASE+domain+"/templates/"+template+"/template.json";
			g.cors(path,{},function(res){
                var newjsonfile=res;
                newjsonfile["version"]=newver;                                
                g.file.put_contents(uri, newjsonfile,function(data){
                    g.l(data);
                })})
				
	//if sh file ok step 4) couch new version template
	g.cors("https://api.aimd5.com:6984/templates/"+template+"-"+newver,JSON.stringify(newdata),function(couch){ g.l(couch);
	
	var command={a:"exec",b:"bash /var/www/gaia/dsh/setup_synctemplate.sh "+newver+" "+domain+" "+template+""};
	g.l(command);
	$.get('/gaia/dsh/clijax.php',command,function(res){
	 g.l(res)	
		 g.ui.notify("success","Template "+template+" synced");
		 $("#"+id).hide();
			 
	});
	},'PUT');	
	 
	 	
	 })
	 
var cons= $('#console');

function runTabs(radioid){
	if(radioid==1) { //mysql
		$('#domain-choice').show();
	}else if(radioid==2) {
		cons.html('<iframe src="https://'+window.location.hostname+'/gaia/tools/mongo/index.php?action=admin.index" style="width:100%;height:100%"></iframe>')
	}else if(radioid==4) {
		cons.html('<iframe src="https://'+window.location.hostname+'/gaia/tools/memcached/commands.php" style="width:100%;height:100%"></iframe>')
	}else if(radioid==5){
		cons.html('<iframe src="https://'+window.location.hostname+'/gaia/tools/redis/public/index.php/keys/search/0/'+g.get.REDISDB+'?key=*" style="width:100%;height:100%"></iframe>')
	}else if(radioid==6){
		cons.html('<iframe src="https://'+window.location.hostname+':4200" style="width:100%;height:100%"></iframe>')
	}else if(radioid==8){
		cons.html('<iframe src="https://'+window.location.hostname+'/gaia/tools/sqlite/phpliteadmin.php" style="width:100%;height:100%"></iframe>')
	}else if(radioid==9){
		cons.html('<iframe src="https://'+window.location.hostname+'/gaia/tools/opcache/index.php" style="width:100%;height:100%"></iframe>')
	}else if(radioid==10){
		cons.html('<iframe src="https://'+window.location.hostname+'/gaia/tools/info.php" style="width:100%;height:100%"></iframe>')
	}else if(radioid==11){
		$('#logs-choice').show();
		read_log();
	}else{
		g.ui.reset('#console'); cons.focus();
	}
}

function runCommand(){
	var command = $('#command').val().trim();
	var type= $('input[name=console-type]:checked').val();

	if(type=='mysql') {
		run_mysql(command);

	}else if(type=='shell'){
		cons.html('Loading...');
		$.get(g.ajaxfile, {a: 'cli', b: command}, function (data) {
			cons.append('<br/><div style="color:#88ffd6">' + data + '</div>')
		})

	}else if(type=='api') {
		g.l(command)
        $.getJSON( "/gaia/api/index.php?" + command, function( data ) {
			g.l(JSON.stringify(data.val))
			cons.append('<br/><div>' + JSON.stringify(data.val)+ '</div>')
		});

	}else if(type=='gaiajs') {
		var arr=command.split(' ');
		var cat= arr[0].trim();
		var prop= arr[1] ? arr[1].trim() : '';
		var param= arr[2] ? arr[2].trim() : '';
		// var προπ= param!='undefined'
		var execute= prop!='' ? (param!=''
			? g[cat][prop](param)
			: g[cat][prop]
			) : g[cat];
		cons.append('<div style="color:#fc8102">g.'+cat+'.'+prop+'('+param+')<br/></div><pre>'+JSON.stringify(execute, null, 2)+'</pre>')
		$('#command').val('');

	}else if(type=='update-all-dbs'){
		$.get(g.ajaxfile, {a: type, b: command}, function (data) {
			cons.append('<div style="color:#88ffd6">' + command + '</div>' + data);
		})
	}
}
function run_mysql(command) {
	var db = $('#domain-choice').val();
	$.get(g.ajaxfile, {a: 'results', b: db, c: command}, function (data) {
		cons.append('<div style="color:#88ffd6">' + command + ' (' + data.length + ' results)</div>' + data);
	})
}
function read_log(){
	var file=$('#logs-choice').val();
	var logconf= g.get.CONF.server.errorlog;
	var logfile= logconf.replace('[domain]',file);
	// g.l(logfile)
	cons.html('Loading...');
	$.ajax({type: "GET",
		url: g.ajaxfile,
		data : {a:'read_file',b:logfile},
		headers : { "Range" : 'bytes=0-320000' },
		success : function(data){cons.append('<br/>'+data);},
		error: function(data){cons.append('<br/>file cannot be read');}
	})
}

$(document).ready(function() {
/*
* testing python
* */
//	$.get(g.ajaxfile,{a:'py'},function(data){
	//	g.l(data);
      //  $('#console').append(data);
	//},'json')
	/*
	 * testing c
	 * */
    //$.get(g.ajaxfile,{a:'c'},function(data){
        //g.l(data);
        //$('#console').append(data);
    //})

//	runTabs(g.cookie.get('console_channel'));
//	$('#command').focus();

//activate g.ui.tree
	// Hide all subfolders at startup
//	g.ui.tree();
})

/*	
	EVENTS
*/
$(document)
/*	.on("click",".gs-title,.gs-titleActive",function(){
		var bodyid= this.id.replace('t','');
		g.ui.switcher('#'+bodyid,'slide');
		$('.gs-databox-inside:not(#'+bodyid+')').slideUp();
		$('.gs-titleActive:not(#t'+bodyid+')').attr('class','gs-title');
		this.className = 'gs-titleActive';
		g.cookie.set(g.get.mode+'_tab',bodyid);
	})
	*/
	.on("keypress",function(e) {
    if(e.which == 13) {
		if ($('#command').is(':focus')){
			runCommand();
			g.ui.scrollBottom("#console");
		}
	}
	})
	.on("click","#console-copy",function(){
			g.l('copy fired');
			new Clipboard("#console-copy", {
				text: function() {
					return cons.text();
				}
			});
		})
	.on("click","input[id^='radio']",function() {
		var radioid=this.id.replace('radio','');
		var previous= g.cookie.get('console_channel');
		if(radioid!=previous) {
			g.ui.reset('#console');
		}
		g.cookie.set('console_channel',radioid);
		runTabs(radioid);
		if(radioid==13){
			help ="<b>***** HELP ******</b><br/>" +
				"<b>COMMON queries<b/></br>" +
				"<ul><li>add column:</li><li>ALTER TABLE table ADD COLUMN col TEXT NULL AFTER beforecol</li>" +
				"<li>drop column:</li><li>ALTER TABLE table DROP COLUMN col</li>" +
				"<li>ALTER TABLE tablename MODIFY columnname INTEGER;</li>" +
				"</ul>*******************<br/>";
			cons.append(help)
		}
	})
	.on("click","#submitCacheKeys",function() {
		runCommand('cache');
	})

	.on("change","#domain-choice",function() {
		var command= $('#command').val().trim();
		if(command!='') {
		g.ui.reset('#console');
		run_mysql(command)
		}
	})
	.on("change","#logs-choice",function() {
		g.ui.reset('#console');
		read_log();
	})
	.on("click","#backupSubmit",function(){
		var version=$('#version').val(),
		domain=$('#domain').val(),
		replica_log=$('#replica_log').val();
		cons.append("<br/>Creating backup...");
		$.get(g.ajaxfile,{a:'backup',b:domain,c:version,d:encodeURIComponent(replica_log)},function(res){
			if(res=='yes'){
				cons.append("<br/>Backup <b>"+version+"</b> to <b>"+domain+"</b> Ready");
			}else{
				cons.append("<br/>"+res+" to <b>"+domain+"</b>");
			}
		})
	})
	.on("click","#sysbackupSubmit",function(){
		var version=$('#sysversion').val(),
			replica_log=$('#sysreplica_log').val();
		cons.append("<br/>Creating backup...");
		$.get(g.ajaxfile,{a:'sysbackup',b:version,c:encodeURIComponent(replica_log)},function(res){
			if(res=='yes'){
				cons.append("<br/>Backup <b>"+version+"</b> ready");
			}else{
				cons.append("<br/>"+res);
			}
		})
	})
	.on("click","#mysqldump",function(){
		var domain= $('#domain').val();
		$.get(g.ajaxfile,{a:'mysqldump',b:domain},function(res){
			var obj={};
			var file =g.get.BACKUP_DIR+'dom/sql/'+g.get.CONF[domain].dbname+'-'+res+'.sql';
			obj.href=g.get.SITE_URL+'gaia/download.php?file='+file;
			g.file.download(obj);
		});
	})
	.on("click","#sysmysqldump",function(){
		$.get(g.ajaxfile,{a:'mysqldump'},function(res){
			var obj={};
			var file =g.get.BACKUP_DIR+'gaia/sql/gs-'+res+'.sql';
			obj.href=g.get.SITE_URL+'gaia/download.php?file='+file;
			g.file.download(obj);
		});
	})
	.on("click","#savesysini",function() {
		var arr,dom,key,nconf={server:g.get.CONF.server};
		//i domain , j key
		for(var i in g.get.CONF){
			if(i!='server'){
			nconf[i]=g.get.CONF[i];
			for(var j in g.get.CONF[i]){
				nconf[i][j]=$('input[name="'+i+'"].domconfig-'+j).val();
			}
			}
		}
		var json = JSON.stringify(nconf);
		$.ajax({
			type: "GET",
			data: {a: 'write_ini', b: json},
			url: g.ajaxfile,
			contentType: "application/json; charset=utf-8",
			dataType: "json",
			success: function(res) {
				if(res=='yes'){ cons.append("<br/>System.ini updated!");}else{g.l(res);}
			},
			error: function(data, status, error) {
				g.l('error: ' + error + 'status:' + status + ' data:' + data);
			}
		});
	})
	.on("click","#savenewdomain",function() {
		var newdomainame= $('#newdomainame').val().trim().toLowerCase();
		var newtemplate= $('#newtemplate').val();
		var newuser= $('#newuser').val().trim();
		var newpass= $('#newpass').val().trim();
		var newtitle= $('#newtitle').val().trim();
		g.ui.reset('#console');
		var command= 'bash '+g.get.API_SHELL+'newlocaldomain.sh '+newdomainame+' "'+newtemplate+'" '+ g.get.is["system-version"]+' '+newuser+' '+newpass+' "'+newtitle+'" '+g.phptimestamp()+' '+g.get.SERVERBASE;
		g.l(command)
		g.shell_exec(command,function(data){$('#console').append(data);});
		// $.get(g.ajaxfile,{a:'newdomain',b:newdomainame},function(res){
		// g.l(res)
		// })
	})
//python
// 		$.ajax({type: "GET",
// 		url: '/py/index.py',
// 		data : {a:'read_file'},
// 		async:false,
// 		dataType:'json',
// 		success : function(data){
// 			// g.l(JSON.parse(data));
// 		g.l(data)
// 		},error: function(data, status, error) {
// 				g.l('error: ' + error + 'status:' + status + ' data:' + data);
// 			}
// 		})

//cpp
// 		$.ajax({type: "GET",
// 		url: '/bin/cpp1.cgi',
// 		data : {a:'read_file'},
// 		async:false,
// 		dataType:'html',
// 		success : function(data){
// 			// g.l(JSON.parse(data));
// 		g.l(data)
// 		},error: function(data, status, error) {
// 				g.l('error: ' + error + 'status:' + status + ' data:' + data);
// 			}
// 		})


