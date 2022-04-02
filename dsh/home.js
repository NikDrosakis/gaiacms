/*updated:2020-01-29 20:20:34 home - v.0.73 - Author:Nikos Drosakis - License: GPL License*/
$(document).on("click","#system_level",function() {
    var value=$(this).attr('data');
    var newvalue= value==1 ? 2 : 1; $(this).attr('data',newvalue);
    var newclass= newvalue==1 ? "label label-danger" : "label label-success";
    var newvalue_read= newvalue==1? 'Development':'Production';
    var newvalue_button= newvalue==1 ? 'Switch to production':'Switch to development';
    var query = 'UPDATE varglobal SET value="' + newvalue + '" WHERE name="' + this.id+'"';
    g.db.func('query', query,function(data){
        if(data=='yes'){
            g._("#system_level_read").className= newclass;
            $("#system_level_read").text(newvalue_read);
            $("#system_level").val(newvalue_button)
            g.alert("System updated!");
        }
        });
    });
//g.loadJS("/gaia/js/ext/chart.js", 'head',function(){
    //g.chart.pie('#dwindow3',"/gaia/dsh/data.csv","a");
    //g.chart.bar('#dwindow4',"/gaia/dsh/data.csv","a");
//})
g.setup.gaia_update_button('#version');