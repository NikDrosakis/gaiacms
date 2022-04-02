/*updated:2020-02-05 06:09:52 widget - v.0.73 - Author:Nikos Drosakis - License: GPL License*/
//check if name exists
var page_selected=!g.cookie.get('page_selected') ? "index" : g.cookie.get('page_selected');

function save_html2file(filename){								
					var html = $('#phpeditor').html();
					g.l(filename)
					g.l(html)
					g.file.put_contents(filename, html, function (data) {
						g.l(data)
						if (data == 'ok') {
							g.ui.notify("info","FILE SAVED!")
						} else {
							g.ui.notify("danger","FILE NOT SAVED!")
						}
					},"html")
		}
if(GS.sub=='') {
        function create_order(){			
            //var url=GS.SITE_URL+'templates/'+GS.template+'/pages/'+page_selected+'.json';
            var uri=GS.TEMPLATESURI+GS.template+'/pages/'+page_selected+'.json';
			   var newjsondata= {areas:[],order:{}};
                g.file.put_contents(uri, newjsondata,function(data){
                    g.l(data);
					location.reload()
                });
                g.l(newjsonfile);
        }
	
	function save_order(sortlist){
		
	//	var area=sortlist[0].split('-')[0];		
		var neworder={};        
		var url=GS.SITE_URL+'templates/'+GS.template+'/pages.json';
        var uri=GS.SITE_ROOT+'templates/'+GS.template+'/pages.json';		
		$.get(url,{},function(res){            
			var newres=res;	
			for (var i in sortlist){
			var widget=sortlist[i].split('-')[1];
            var form = $("#form-"+widget).serializeArray();
			neworder[widget]={}			
			for(var j in form){neworder[widget][form[j].name]=form[j].value;}
			}
			newres[page_selected]=neworder;			
            g.file.put_contents(uri, newres,function(data){
				g.l(data)
				if(data=='ok'){
					g.ui.notify("info","Order saved")
				}
				})
        })
	}
//create_order('index.json');
        function transform_widget(obj){
            //get new sorting
            var newarray=[];
			//read order from localstorage
			var porder= JSON.parse(g.local.get('pageorder_'+page_selected));
			//loop all items			
            $(obj.item).parent().find('.list-group-item').each(function() {
                var  wid = $(this).attr('id').replace('wid-','');
                newarray.push(wid);
            })
			var to=$(obj.item).parent().attr('id').replace('area-','');
			var widtype= $(obj.item).hasClass("local") ? "local" : ($(obj.item).hasClass("global") ? "global":"");
				var widget=obj.item.id.split('-')[1];
				var path= widtype=="local" ? GS.WIDGETLOCALPATH+widget+'.json': GS.WIDGETPATH+widget+'.json';                					
				//add prefix 
				var tag = 0;
				var key = true;
				while (key) {				
				if(!JSON.parse(g.local.get('pageorder_'+page_selected)).hasOwnProperty(widget+"_"+tag)){					
					key = false;
				}tag += 1;
				}
				var widgetprefix=widget+"_"+tag;
				
				$.get(path,{},function(wres){
                    	g.l(wres)
                   obj.item.innerHTML='<form method="POST" id="form-'+widgetprefix+'">'+
                        '<input type="hidden" name="version" value="'+wres.version+'">'+                       
                        '<input type="hidden" name="method" value="'+wres.method+'">'+
                        '<input type="hidden" name="to" value="'+to+'">'+                        
					    '<div class="widheader"><label>'+widgetprefix+'</label>'+
                        '<button onclick="event.preventDefault();g.ui.switcher(&quot;#subox-'+to+widget+'&quot;)" style="float:left;margin-right:20px" class="btn btn-info btn-xs">></button>'+
                        '<button style="float:right" class="btn btn-danger btn-xs" id="delwid-'+widgetprefix+'">X</button>'+
                        '<span style="margin-left:20px">v.'+wres.version+'</span>'+
                        '</div>'+
                        '<div id="subox-'+to+widget+'" background="antiquewhite" class="subox">'+
                        '<label>Headline</label><input name="headline" class="form-control" value="'+wres.headline+'">'+                        
						'<div>Where:<input name="wherekey" class="form-small" value="'+wres.wherekey+'">'+
						'<input name="where" class="form-small" value="'+wres.where+'">'+
						'</div>'+
                        '<div>Limit:<input name="limit" type="number" min="1" class="form-small" value="'+wres.limit+'"></div>'+
                        '<div>Orderby:<input name="orderby" class="form-small" value="'+wres.orderby+'"></div>'+
                        '<button class="btn btn-success btn-xs" id="savewid-'+to+'-'+widget+'">Save</button>'+
                        '</div></form>';                    
                    $(obj.item).attr('id','wid-'+to+'-'+widgetprefix).removeClass('nested-'+widget).addClass('nested-'+widgetprefix);
					
					//	save_order(newarray);
				//add to localstorage dnd effect				
				g.l(newarray)	
				//save to neworder	
				for(var i in newarray){
				var widget=newarray[i].indexOf('-') > 1 ?  newarray[i].split('-')[1] : widgetprefix;	
				g.l(widget)				
				if(!porder[widget]){porder[widget]=g.json.form("#form-"+widget);}
				porder[widget]['sort']=i;		
				}
				//saving
				g.local.set('pageorder_'+page_selected,JSON.stringify(porder));					
                
				},'json');			
        }
		
        function areaboard(){
                //create sortable areas
                var nestedSortables = [].slice.call(document.querySelectorAll('.nested-sortable'));
                for (var z = 0; z < nestedSortables.length; z++) {
                    new Sortable(nestedSortables[z], {
                        group: 'nested',
                        //sort: false,
                        pull:false,
                        easing: "cubic-bezier(1, 0, 0, 1)",
                        filter: ".ignore-elements",
                        animation: 150,
                        fallbackOnBody: true,
                        swapThreshold: 0.65,
                        invertSwap :true,
                        draggable: ".wid",
					//	filter: '.subox',
                        onEnd: function(evt) {							
							//transform_widget(evt)
							var newarray=[];
							$(evt.item).parent().find('.list-group-item').each(function() {                
								var  wid = $(this).attr('id').replace('wid-','');
								newarray.push(wid);
							})
							
							//internal dnd saved to localstorage
						//	var porder= JSON.parse(g.local.get('pageorder_'+page_selected));
						//	var area=newarray[0].split('-')[0];	
						//	for(var i in newarray){
						//	var widget=newarray[i].split('-')[1];				
						//	porder[widget]['sort']=i;		
						//	}
						//	g.local.set('pageorder_'+page_selected,JSON.stringify(porder));
						//save_order(newarray);
						}
						
					});
                }
                //create sortable widgets
                new Sortable(wid, {
                    group: {
                        name: 'nested',
                        draggable: ".wid",
                        sort: false,
                        pull: 'clone' // To clone: set pull to 'clone'
                    },
                    animation: 150,
                    onEnd: function(evt) {
						var newarray=[];
						$(evt.item).parent().find('.list-group-item').each(function() {                
							var  wid = $(this).attr('id').replace('wid-','');
							newarray.push(wid);
						})
                        transform_widget(evt);
                    }
                });
        }
        
		//append loop with widget_loop.php request

		g.file.include(g.ajaxfile,{a:"load_widgetloop",page:page_selected,order:g.local.get("pageorder_"+page_selected)},function(res){
		$.when($('#areas').html(res)).then(function(){	 
		areaboard();
		})
		},'POST');
		
		
  }

/************************************
				EVENTS
************************************/
    $(document)	
	//check if unique
	.on("keyup","#name",function(){
		
	})
	.on("click","#savepagejson",function(){	
			var url=GS.SITE_URL+'templates/'+GS.template+'/page.json';
			var uri=GS.SITE_ROOT+'templates/'+GS.template+'/page.json';	
			var newres={}
			$.get(url,{},function(res){			
			newres=res;
			newres[page_selected]=JSON.parse(g.local.get('pageorder_'+page_selected));	
			g.l(newres)
			g.file.put_contents(uri, newres,function(data){
			g.l(data)
			if(data=='ok'){
				g.ui.notify("info","Order saved")
			}
			})				
		})				
	})
	.on("click","button[id^='delwid-']",function(){
        event.preventDefault();
     //   var area=g.explode('-',this.id)[1];
        var widget=this.id.replace('delwid-','');

		//del from localstorage
		//add to localstorage dnd effect				
			var porder= JSON.parse(g.local.get('pageorder_'+page_selected));
			delete porder[widget];
			g.local.set('pageorder_'+page_selected,JSON.stringify(porder));
		$("div[id*='"+widget+"']").hide();
        //var url=GS.SITE_URL+'templates/'+GS.template+'/pages/'+page_selected+'.json';
        //var uri=GS.SITE_ROOT+'templates/'+GS.template+'/pages/'+page_selected+'.json';
        //$.get(url,{},function(res){
            //var newres=res;
            //delete newres.order[area][widget];
            //g.file.put_contents(uri, newres,function(data){
                //$('#wid-'+area+'-'+widget).hide();
            //})
        //})
    })
    .on("click","button[id^='savewid-']",function(){
        g.l('saving edit widget')
		event.preventDefault();
        var area=g.explode('-',this.id)[1];
        var widget=g.explode('-',this.id)[2];
        
		var porder= JSON.parse(g.local.get('pageorder_'+page_selected));
		porder[widget]=g.json.form("#form-"+widget);		
		g.local.set('pageorder_'+page_selected,JSON.stringify(porder));
		//create widget php file 
      /*  var url=GS.SITE_URL+'templates/'+GS.template+'/page.json';
        var uri=GS.SITE_ROOT+'templates/'+GS.template+'/page.json';
        $.get(url,{},function(res){
            var neworder={};
            for(var i in form){neworder[form[i].name]=form[i].value;}
            var newres=res;
			//reorder index
            if(!newres.order[area]){newres.order[area]={};}
            newres.order[area][widget]=neworder;
            g.file.put_contents(uri, newres,function(data){
                g.l(data);
				if(data=='ok'){
					g.ui.notify("info","Order saved")
				}
            })
        })
		*/
		
    })
	//new & edit widget
    .on("click", "#savewid", function () {
		g.l('saving new widget')
        event.preventDefault();
        var widget = $('#name').val().trim();
        var form = $("#form-new").serializeArray();
        var newid = {};
        for (var i in form) {
            newid[form[i].name] = form[i].value;
        }
        //var urijson = GS.SITE_ROOT + 'templates/' + GS.template + '/widgets/' + newid.widget + '.json';
        var urijson = GS.WIDGETLOCALURI + widget + '.json';
        g.file.put_contents(urijson, newid, function (data) {
         //   g.l(data);
                   
        if(GS.sub=='new' || GS.sub=='edit'){
            //var phpjson = GS.SITE_ROOT + 'templates/' + GS.template + '/widgets/' + newid.widget + '.php';
            var phpwidget = GS.WIDGETLOCALURI + newid.widget + '.php';
            save_html2file(phpwidget);			
        }
			if(GS.sub=='new'){
			location.href = '/dsh/widget?sub=edit&name=' + newid.widget;
			}
		 })
        //save file
    })
	.on("click","#create_json",function(){
            //var newjson=this.value.split('.')[0]+'.json';
            create_order()
    })
    .on("change","#page",function(){
            g.cookie.set('page_selected',this.value);
            //var newjson=this.value.split('.')[0]+'.json';
            //g.l(newjson)
			location.reload();
            //areaboard();
        })