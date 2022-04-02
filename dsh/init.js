/*updated:2020-01-29 20:20:34 init - v.0.73 - Author:Nikos Drosakis - License: GPL License*/


/*
COUCH DB CREATE INDEX
var index={
"index": {
"fields": ["_id"]
},
"name" : "id-index",
"type" : "json"
}
*/
//g.cors("https://api.aimd5.com:6984/templates/_index",JSON.stringify(index),function(res){ g.l(res);},'POST');	 


 //dsh tabs
    var at= g.cookie.get(g.get.mode+'_tab');
    if(at!=false){
        $('#t'+at).attr('class','gs-titleActive');
        $('#'+at).css('display','block');
    }

    
    //prevent contenteditable creative divs
    $('code[contenteditable]').keydown(function(e) {
        // trap the return key being pressed
        if (e.keyCode === 13) {
            // insert 2 br tags (if only one br tag is inserted the cursor won't go to the next line)
            document.execCommand('insertHTML', false, '');
            // prevent the default behaviour of return key pressed
            return false;
        }
    });

    //APPEND JS IF DASHBOARD ON PUBLIC
    if(g.get.dsh) {
        g.loadJS("/gaia/dsh/"+g.get.dsh+".js",'footer');
        // $(".double_window").css('width','100%');
        // $("#console").css('width','100%');
        // $(".sidePanel").css('width','100%');
        // $(".sidePanel2").css('width','100%');
        // $("#main_window").css('width','70%');

        var query_string,dsbase,dspage,newlink,qstr;
        $("a").each(function() {
            query_string= g.get.URL.split('?')[1];
            //public links change
            if(!this.href.includes("?")) {
                newlink=this.href + '?'+ query_string;
                $(this).attr('href', newlink);
            }else{
                if(this.href.includes("dsh/")) {
                    //sidepanel links change
                    qstr = this.href.split('?')[1];
                    dsbase = this.href.split('dsh/');
                    dspage = dsbase[1].split('?')[0];
                    newlink = dsbase[0] + '?dsh=' + dspage +'&'+qstr ;
                    g.l(this.href + ' => ' + newlink)
                    $(this).attr('href',newlink)
                }
            }
        })
    }
	
		//DASHBAR
	var usergrps = !g.get.usergrps 
			? {1: "user", 2: "subscriber", 3: "writer", 4: "editor", 5: "admin", 6: "manager", 7: "developer", 8: "CEO"}
			: g.get.usergrps;
	
    var GSID = my.GSID;
    var GSIMG = my.GSIMG;
    var GSGRP = my.GSGRP;
    var GSNAME = my.GSNAME;
    var loggedin = my.GSID != false && my.GSGRP > 2 ? true : false;
    $(document)
        .on('click', '.menuopener, #menu-opener2', function () {
            if($('#dashbar').css('display')=='none') {
                $('#dashbar').show('fast');
            }else{
                $('#dashbar').hide('fast');
            }
        })
        // .on('mouseleave','#dashbar',function () {
        //     dshb.delay(3000).slideUp('medium');
        // })
		//g.l('running dsh  init')