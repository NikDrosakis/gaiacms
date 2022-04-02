/*updated:2020-01-29 20:20:34 templates - v.0.73 - Author:Nikos Drosakis - License: GPL License*/

//batch create version template couch doc 
function add2couch(template,ver,sum){	
	var created=String(g.date('Y-m-d H:i'));
	var newdata={name:template,summary: sum, created: created,version:ver,"designer": "Nikos Drosakis",
			"developer": "Nikos Drosakis"};
	var _id= template+"-"+ver; 
	g.l(newdata)
	//admin:n130177!@
	 g.cors("https://api.aimd5.com:6984/templates/"+_id,JSON.stringify(newdata),function(res){ g.l(res);},'PUT');	 
}
/*
g.cors('https://api.aimd5.com/php/?method=templates', {}, function (data) {			
var templates=data.val;
		for (var t in templates) {
			add2couch(t,"0.5",templates[t].summary)
		}
})
*/
		//ΑVAILABLE TEMPLATE TO install
		//$.get("").done(function (data) {
		
		g.cors('https://api.aimd5.com:6984/templates/_all_docs?include_docs=true', {}, function (data) {			
			var templates= data.rows;
			g.l(templates)
			//g.l(dat)
			//var templates = g.array_diff(data.rows, GS.templates), 
			var box = '';
			var sum=0;
			//g.l(templates.length)
			for (var t in templates) {
				name=templates[t].doc.name;
				if(!g.in_array(name,GS.templates)){
				sum+=1;
				var id=templates[t].id
				//var img=!GS.API_TEMPLATESPATH + name + '/screenshot.png' ? '/gaia/img/templates.png': GS.API_TEMPLATESPATH + name + '/screenshot.png';
				var img=GS.API_TEMPLATESPATH + name + '/screenshot.png';
				//g.l(jsonfile)	
				
					//g.l(data)
				box += '<div id="' + name + '" class="box" style="background:#dcfbfbd9">' +
					'<span id="activeLabel' + id + '" class="label label-success" style="display:none;width: 78%;float: left;margin-right: 2px;">active</span>' +
					'<span class="label label-default" style="float:right">'+templates[t].doc.version+'</span>' +
					'<div class="title">' + name +'</div>' +
					'<img id="template_'+name+'" class="img-thumbnail" style="width: 100%;height: 100px;" src="' +img+'" width="160" height="160">' +
					'<div class="details">' +
					'<div>'+templates[t].doc.summary+'</div>' + //summary
					'<div>Updated:'+templates[t].doc.created+'</div>' +
					'<div>Designer:'+templates[t].doc.designer+'</div>' +
					'<div>Developer:'+templates[t].doc.developer+'</div>' +
					'</div>' +
					'<div class="buttonBox">' +
					'<a class="btn btn-xs btn-info preview" title="'+id+'" data="'+GS.API_TEMPLATESPATH + name + '/index.html">Preview</a>' +
					'<a style="margin: 0px 8px 0px 8px;" download class="btn btn-xs btn-info" title="'+id+'" href="'+GS.API_TEMPLATESREPOPATH+templates[t].id+'.tar.gz"><span class="glyphicon glyphicon-download-alt" aria-hidden="true"></span></a>' +
					'<button style="display:inline;margin:3px" class="btn btn-xs btn-success" id="apinstall' + templates[t].id + '">Install</button>' +
					'</div></div></form>';					
		
				}
				}
				$('#templates-available').append(box);
				$('#available_sum').text(sum);
		});

		$(document).on("click",".preview",function(data){
			event.preventDefault();						
			var link = $(this).attr('data');
			var title = $(this).attr('title');
			var name = title.split('-')[0];
			var photoimg ='<button id="screenshot_'+name+'">Screenshot</button>';
            bootbox.dialog({title: title ,success: {},callback: function () {},message: "<iframe id='iframe"+name+"' style='width:100%;float:left;position:relative;height:88vh;' frameBorder='0'  src='"+link+"' sandbox='allow-same-origin allow-scripts allow-popups allow-forms'></iframe>"})						
		})
		.on("click","button[id^='screenshot_']",function(){
			var name= this.id.replace('screenshot_','');
			g.loadJS('/gaia/lib/html2canvas.js','head',function(){				
			html2canvas(document.getElementById("iframe"+name).contentWindow.document.body.innerHTML).then(canvas => {
			 dataURL = canvas.toDataURL("image/png");
               $("#template_"+name).attr('src',dataURL);               
                var expData = {a:"screenshot",b:"/var/www/api/store/templates/"+name+"/screenshot.png",c:dataURL};
                $.post(g.ajaxfile, expData,function(data){
                    g.l(data)
                });
			});
			})
		})
/*
if in droserver (api in the same server with domain)
*/ 
		$(document)
			.on("click", "button[id^='apinstall']", function () {
				var template = this.id.replace('apinstall', '');
				var templatename = g.explode('-',template)[0];
				//var command = 'bash '+GS.GAIAROOT+'dsh/templates.sh "'+ GS.API_TEMPLATESURI + template +'" "'+GS.TEMPLATESURI+'"';
				//g.l(command)
			//	g.shell_exec(command,function(res){
				//	g.ui.notify('info','Template installation',res)
				//});
				g.l({a:"template_install",b:template});
				$.get(g.ajaxfile,{a:"template_install",b:template},function(res){
					g.l(res);
					if(res[0]=="copied" && res[1]=="extracted"){
						//moveTo installed
						var thtml = $('#' + templatename).html();
						$('#installed').append('<div id="box' + templatename + '" class="box" style="background:#f9e5e5">' + thtml + '</div>');
						$('#' + templatename).remove();		
						//del setup entry
					//		g.db.query("INSERT INTO setup (name,created) VALUES('" + template + "','" + g.phptimestamp() + "')");
					}else if (res=='nossh'){
					g.ui.notify("danger","SSH is not working on this system. Try download template and extract folder to domain/templates folder")
					}
				},"JSON")								
			});
	
// var file1=GS.TEMPLATES+'dopetrope/index.html';
// var file2=GS.TEMPLATES+'dopetrope/no-sidebar.html';
// var nheader=GS.TEMPLATES+'dopetrope/header1.php';
// var nfooter=GS.TEMPLATES+'dopetrope/footer1.php';
// function areEqual(arguments){
// 		var len = arguments.length;
// 		for (var i = 1; i< len; i++){
// 			if (arguments[i] === null || arguments[i] !== arguments[i-1])
// 				return false;
// 		}
// 		return true;
// }
//
// function equality(array,i){
// 	var equals=[];
// 	for (k in array) {
// 		equals.push(array[k][i]);
// 	}
// 	g.l(equals)
// 	return areEqual(equals)
// }
//
// 	//break html to pieces
// 	g.file.glob(GS.TEMPLATES+'dopetrope/*.html',function(htmlfiles){
// 		// g.l(data)
// 	$.ajax({
// 		type: "POST",
// 		dataType: "json",
// 		url: g.ajaxfile,
// 		data: {a: 'parsehtml', b: htmlfiles},
// 		success: function (data) {
// 			g.l(data)
// 			var html = [], array = [], nbody=[],equalityBool=[];
// 			for (i in data) {
// 				html[i] = $.parseHTML(data[i]);
// 				array[i] = [];
// 				for (j in html[i]) {
// 					if (html[i][j].nodeType != '3' && typeof (html[i][j].innerHTML) != 'undefined' && html[i][j].innerHTML != '') {
// 						array[i].push(html[i][j].innerHTML.trim())
// 					}
// 				}
// 				// g.file.file_put_contents(nheader, g.ui.sethead + '<title>' + array[k][i] + '</title>\n' + g.file.htmldecode(array[k][i]) + '\n</head>\n<body>\n');
// 				// g.file.file_put_contents(nbody1, array[i][2] + array[i][3])
// 				// g.file.file_put_contents(nfooter, array[i][4])
// 				//check and create files
// 				nbody[i]=GS.TEMPLATES+'dopetrope/file'+[i]+'.php';
// 				equalityBool[i]=equality(array,i);
// 			}
// 			g.l(equalityBool)
// 					// g.l(areEqual([array[0][0],array[1][0],array[2][0],array[3][0]]))
// 					// g.l(areEqual([array[0][1],array[1][1],array[2][1],array[3][1]]))
// 					// g.l(areEqual([array[0][2],array[1][2],array[2][2],array[3][2]]))
// 					// g.l(areEqual([array[0][3],array[1][3],array[2][3],array[3][3]]))
// 					// g.l(areEqual([array[0][4],array[1][4],array[2][4],array[3][4]]))
//
// 			}
// 	});
// 	});
//
// 	$('#main_window').append('<div id="newtemplates" style="display:block"></div>');

//new templates form

        $(document)
        //    .on("click", "#newtemplatesbtn", function () {
          //      location.href = '/dsh/templates?sub=wizard';
//            })
            //uninstall
            .on("click", "button[id^='uninstall']", function () {
                var template = this.id.replace('uninstall', '');
                g.confirm("Warning! Are you sure you want to delete the template <b>" + template + "</b>? This action will be irreversible.", function (res) {
                    if (res == true) {
					 	$.ajax({
					 		type: "GET",
					 	//	dataType: "json",
					 		url: g.ajaxfile,
					 		data:  {a: 'template_uninstall', b: template},
							success: function (data) {
					 			g.l(data);
							//if (data == 'yes') {
                                //moveTo available
                                var thtml = $('#box' + template).html();
                                $('#templates-available').append('<div id="' + template + '" class="box">' + thtml + '</div>');
                                $('#box' + template).remove();
                                g.ui.notify('success', 'Template ' + template + ' Uninstalled', 'successfully.')
                            //}
							},error:function(xhr,error){
								g.l(xhr)
								g.l(error)
							}
							})
					}
                    })
                })            
			/*setup
            .on("click", "button[id^='setup']", function () {
                var th=$(this);
            	var template = this.id.replace('setup', '');

                        $.get(g.ajaxfile, {a: 'template_setup', b: template}, function (data) {
                            g.l(data)
                            if (data == 'yes') {
                                th.attr('id','uninstall'+template).text('Uninstall');
                                g.ui.notify('success', 'Template ' + template + ' Setup', 'successfully.')
                            }
                        })
            })
			*/
            //install
            .on("click", "button[id^='binstall']", function () {
                var template = GS.template;
                var name = this.id.replace('binstall', '');
                g.confirm("Your template will be changed. Are you sure?", function (res) {					
                    if (res == true) {						
						
                        $.get(g.ajaxfile, {a: 'template_activate', b: name}, function (data) {
                           if(data==true){
                                $('#binstall' + name).text('Edit');
                                $('#binstall' + template).text('Activate');
                                $('#box' + name).css('background', '#e7f9e5'); //green
                                $('#box' + template).css('background', '#f9e5e5'); //red
                                $('#activeLabel' + name).css('display', 'block');
                                $('#activeLabel' + template).css('display', 'none');
                                $('#uninstall' + name).css('display', 'none');
                                $('#uninstall' + template).css('display', 'block');
                            }
                        });
                    }
                })
            });