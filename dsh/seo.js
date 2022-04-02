/*updated:2020-01-29 20:20:34 seo - v.0.73 - Author:Nikos Drosakis - License: GPL License*/
/*updated:2020-01-01 18:10:19
v.0.52
Author:Nikos Drosakis*/

/*updated:2020-01-01 18:02:13
v.
Author:Nikos Drosakis*/

//2017-11-01 09:29:16

/*
 Search results
 developed by Nikos Drosakis
 Public & Dashboard js file
 */
$(document).ready(function() {


    $(document)
    .on('click','div[id^="btn_"]',function(){
        var id=this.id.replace('btn_','')
        g.ui.switcher('#seo_'+id,'slide')
    })
    //delete
    .on('click','#deletexml',function(){
        g.confirm("The xml root files will be deleted.Are you sure?",function(result){
            if (result==true){
                g.ajax(g.ajaxfile,{a:'deletexml'});
                location.reload();
            }
        })
    })
//create
        .on('click','#createxml',function(){
        g.confirm("New xml root files will be created.Are you sure?",function(result){
            if (result==true){
                $.get(g.ajaxfile,{a:'createxml'},function(res){
                    location.reload();
                });
            }
        })
    })
//save
    .on('click',"button[id^='savexml']",function(){
        var file = this.id.replace('savexml','');
        var content = $('#content'+file).html();
        $.ajax({
            type: "POST",
            data: {a:'savexml',b:file,c:content},
            url:g.ajaxfile,
            success: function(data){
                if(data!='ok'){
                    g.alert("FILE NOT SAVED!")
                }else{
                    g.alert("FILE SAVED!")
                }
            },error: function(xhr, error){
                g.l(xhr.responseText);
                g.l(error + " at producing results");
            }
        });
    })

/*
* robots
* */
        .on("click","#saverobots",function(event) {
            g.file.file_put_contents(g.get.SITE_ROOT+'robots.txt',$('#robots').val().trim(),function(suc){
                g.alert("robots.txt saved")
            })
        })
        .on("click","#createrobots",function(event) {
            var robots= "User-agent: *\n Disallow: / \n";
            g.file.put_contents(GS.SITE_ROOT+'robots.txt',robots,function(suc){
                location.reload()
            })
        })
/*
 * google save
 * */
        .on("click","#googlemetasave",function(event){
            var datastring = $('#tagmanagerdata').html();
            $.ajax({
                type: "POST",
                url: "//admin/ajax/ajax_update_setting.php?a=googleTagManager",
                data: datastring,
                dataType: "json",
                success: function(data) {
                    g.alert('success');
                },
                error: function(){
                    g.alert('error handing here');
                }
            });
        })

    //priority
      .on('keyup change','input[id^="priority"]',function(){
        var id=this.id.replace('priority','');
        var table=$(this).attr('table');
          g.l(['seo_priority',this.value,id,table])

        g.ajax(g.ajaxfile,{a:'seo_priority',b:this.value,c:id,d:table});
    })

})