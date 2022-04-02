/*updated:2020-01-29 20:20:34 list - v.0.73 - Author:Nikos Drosakis - License: GPL License*/

/*
* g.ui.list extends g.ui
* new extension producing g.ui.form && g.ui.table
* for user, post, taxonomies and other dsh pages
* containts core list object producing
* list gshead with filters and gsbody with records loop
* at post.js, user.js file g.ui.list is instantiated
* with a) g.ui.list.param b) custom g.ui.list.events other from existant in g.ui.list
* Νο php file required!
* only <div id="[table]_container" class="board_id_container"> for the function to append everything
* styles is included in dhs.css
 * */
g.ui.list = {
    param : {},
    order : ['ASC','DESC'],
    head : function(){
        var table= this.param.table;
        //<!----line 1 RESET - SEARCH ---->
        list_head = '<button id="' + table+'_reset" style="float:left" onclick="g.ui.list.reset(this)" class="btn btn-default btn-sm">Reset</button>'+
            '<input type="text" id="' + table+'_search" style="width: 80%;display:inline-flex;float: left;margin-left: 1%;" onkeyup=" g.ui.list.search(this)" placeholder="search" value="'+(g.cookie.get(table+"'_search") ? g.cookie.get(table+"_search") :"")+'" class="form-control input-sm">'+
            // <!----line 2 DATE FROM ---->
        '<div class="toFromTitle">'+
            '<span>Date from:</span><input style="display:inline-flex" type="date" onchange="g.ui.list.dateselection(this)" value="'+(g.cookie.get(table+"_from") ? g.cookie.get(table+"_from"):"")+'" id="' + table+'_from" class="form-control input-sm">'+
            '</div>'+
            // <!----line 3 DATE FROM ---->
        '<div class="toFromTitle">'+
            '<span>to:</span><input style="display:inline" type="date" class="form-control input-sm" onchange="g.ui.list.dateselection(this)" value="'+(g.cookie.get(table+"_to") ? g.cookie.get(table+"_to"):"")+'" id="' + table+'_to">'+
            '</div>'+
            // <!----LINE 4 ORDER POST VALUE---->
        'OrderBy: <select style="width:52%;display:inline-flex" id="order_' + table+'_value" class="form-control input-sm" onchange="g.ui.list.orderby(this);" >';
        var orders= g.ui.list.param.orders;
        for(i in orders) {
            list_head += '<option value="' + orders[i] + '" ' + (g.cookie.get(table+"_order") && orders[i] == g.cookie.get(table+"_order").split(" ")[2] ? "selected=selected" : "") + '>' + orders[i] + '</option>';
        }
        list_head += '</select>'+
        // <!----ORDER POST SORT---->
        '<select style="width:25%;display:inline-flex" class="form-control input-sm" id="order_' + table+'_sort" onchange="g.ui.list.orderby(this)" >';
        for(i in this.order){
            list_head += '<option value="'+this.order[i]+'" '+(g.cookie.get(table+"_order") && this.order[i]==g.cookie.get(table+"_order").split(" ")[3] ? "selected=selected":"")+'>'+this.order[i]+'</option>';
        }
        list_head += '</select>'+
        // <!----line 5 COUNTER - SELECTBY ---->
        '<div>'+
        '<span id="'+table+'_counter" style="background:red;color:white;padding:3px">0</span> records'+
            // <!----SELECT BY---->
        '- select by taxonomy:'+
            '<select style="width:25%;display:inline-flex" class="form-control input-sm" id="'+table+'_select" onchange="g.ui.list.selectby(this);" >'+
            '<option value="" class="btn btn-default">All</option>';
        var taxuri= g.get.tax_uri;
        for(i in taxuri) {
            list_head += '<option value="'+taxuri[i]+'" '+(g.cookie.get(table+"_select")==taxuri[i] ? "selected=selected":"")+'>'+taxuri[i]+'</option>';
        }
        list_head += '</select>'+
        '</div>'+
        // <!----line 6 PAGINATION ---->
        '<div id="pagination" class="paginikCon"></div>'+
        '<div id="'+table+'" class="group1"></div>';
        $('.' + table+'_container').prepend(list_head);
    },
    get: function () {
        var table= this.param.table;
        var order= this.param.order;
        var select= !g.cookie.get(table+'_select') ? this.param.select : g.cookie.get(table+'_select');
        var search= !g.cookie.get(table+'_search') ? this.param.search : g.cookie.get(table+'_search');
        var from= !g.cookie.get(table+'_from') ? this.param.from : g.cookie.get(table+'_from');
        var to= !g.cookie.get(table+'_to') ? this.param.to: g.cookie.get(table+'_to');

        //set page 1
        if(!g.cookie.get(table+'_page')){g.cookie.set(table + '_page', 1);}
        var page= g.cookie.get(table+'_page');

        // var param= !param ? '' : param;
        var list = '';
        $.ajax({
            type: 'POST',
            url: g.ajaxfile,
            data: {a: 'list',order:order, table:table,page:page,search:search,select:select,from:from,to:to,date_filter:this.param.date_filter,query:this.param.query,groupby:this.param.groupby,selectby:this.param.selectby},
            dataType: 'json',
            success: function (data) {
               g.l(data.query);g.l(data)
                var counter = data.count;
                //get  pagination
                g.ui.pagination.get(page, data.count, g.get.is.pagin, table);
                //get loop
                if (counter != 0) {
                    list += g.ui.list.param.body(data.loop);
                } else {
                    list += '<div class="gs-field" id="nodorder1"><legend class="gshead" style="cursor:pointer">No results</div></div>';
                }
                $('#' + table).html(list);
                $('#' + table + '_counter').text(counter);
            }, error: function (xhr, status, error) {
                g.l(data);g.l(error);g.l(xhr);g.l('error ' + status);
            }

        });
    },
//ORDER BY
    orderby: function (obj) {
        var exp = g.explode('_', obj.id);
        g.ui.reset('#' + exp[1]);
        var table= exp[1];
        var val= $('#order_'+table+'_value').val();
        var sort= $('#order_'+table+'_sort').val();
        var orderby= 'ORDER BY '+val+' '+sort;
        g.cookie.set(table+'_order',orderby);
        this.param.order = orderby;
        this.get();
    },
//SELECT BY
selectby: function (obj) {
    var exp = g.explode('_', obj.id);
    g.ui.reset('#' + exp[0]);
    g.cookie.set(exp[0]+'_select',obj.value);
    this.param.select = obj.value;
    g.cookie.set(exp[0]+'_page',1);
    this.get();
},
//DATE SELECTION
    dateselection: function (obj) {
        var exp = g.explode('_', obj.id);
        g.ui.reset('#' + exp[0]);
        g.cookie.set(obj.id,obj.value);
        g.cookie.set(exp[0]+'_page',1);
        this.param[exp[1]] = obj.value;
        this.get();
    },
//list search
    search: function (obj) {
        var exp = g.explode('_', obj.id);
        g.cookie.set(obj.id, obj.value);
        // cookieSet('userlist_page',1)
        g.ui.reset('#' + exp[0]);
        g.cookie.set(exp[0]+'_page',1);
        this.param.search = obj.value
        this.get();
    },
    reset: function (obj) {
        var exp = g.explode('_', obj.id);
       var ids= ['from','to','order','search','select','order'];
       for(var i in ids){
           g.cookie.delete(exp[0]+'_'+ids[i]);
           $('#'+exp[0]+'_'+ids[i]).val('');
       }
        g.cookie.set(exp[0]+'_page',1);
        g.ui.reset('#' + exp[0]);
        this.get();
    },
    events: function() {
        $(document)
            .on("click", "legend[id^='gshead']", function () {
                var id = this.id.replace('gshead', '');
                g.ui.switcher('#gsbody' + id, 'slide', 'inline-block');
            })
    }
}