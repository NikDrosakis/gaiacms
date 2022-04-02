/*updated:2020-01-29 20:20:34 form - v.0.73 - Author:Nikos Drosakis - License: GPL License*/
/*
 * FORM FUNCTION for gaia standardised html forms with php ajax (gaia/ajax/gaia.ajax.php)
 FORM AND INPUT IN ONE FUNCTION
 ok update to give the whole table in update mode
 ok add readonly fields
 PROPERTIES
 adata ie the alias before id attributes
 form
 type:   text | number | date | textarea | drop
 format: read | editor else normal edit type
 row ie the table row
 placeholder ie placeholder attribute default ucfirst(row)
 alias ie the flag before the input default ucfirst(row)
 global: for type: drop the select array
 attributes: readonly (for input) disabled (for all types) required
 checked selected=selected
 UPDATES v1.2
 ok readonly attr
 ok bug with type: drop value=0 in lists
 οκ checkbox and radiobox
 ok rewrite with multiple select queries and multiple update tables
 ok append grand fetchall loop with params (eg input and table)
 TODO format:'editor' in textarea
 TODO type: datetime with datetimepicker
 this function replaces the routine of
 a) create the form
 b) create js event
 c) ajax request to read
 d) ajax request to write
 EXAMPLE (from dashboard > user):
 var user= {
 0 : {
 adata: 'test',
 fetch: ["fetchList1",'status,test,WHERE uid='+GS.uid],
 query: [
 "DELETE FROM test WHERE uid="+GS.uid,
 "INSERT INTO test (uid,status) VALUES("+GS.uid+",@row)"],
 form: {0: {type: "checkbox", row:'status',global: GS.status}}
 },
 1 : {
 adata: 'user',
 fetch: ["fetch","SELECT * FROM user WHERE id=" + GS.uid],
 query: "UPDATE user SET @row='@value' WHERE id=" + GS.uid,
 form: {
 0: {type: "number", format: "read", row: 'id'},
 1: {type: "date", format: "read", row: 'registered'},
 2: {type: "date", format: "read", row: 'modified'},
 3: {type: "drop", row: 'grp', alias: "Usergroup", global: GS.usergroups},
 4: {type: "text", row: 'name'},
 5: {type: "text", row: 'pass'},
 6: {type: "text", row: 'firstname'},
 7: {type: "text", row: 'lastname'},
 8: {type: "text", row: 'nickname'},
 9: {type: "text", row: 'url'},
 10: {type: "text", row: 'mail'},
 11: {type: "text", row: 'tel'},
 13: {type: "radio", row: 'phase', global: GS.phase},
 14: {type: "drop", row: 'lang', global: GS.langs},
 15: {type: "drop", row: 'authentication', global: GS.authentication},
 16: {type: "drop", row: 'privacy', global: {0: 'hidden', 1: 'visible'}}
 }
 }
 }
 * */
var s = 0, f = {};
var handlers = [], inp;

g.ui.form = {
    get: function (ob, callback) {
     //   g.l(ob)
        g.callback = !callback ? g.callback : callback;
        var append = 'append' in ob ? ob.append : (g.get.dsh ? '.gs-sidepanel' : '#main_window');
        inp = '';

        if (!ob.nature) {
            var length = Object.keys(ob).length;
            f.nature = 'nature' in ob ? ob.nature : '';
            f.query = ob[s].query;
            f.fetch = ob[s].fetch;
            f.params = ob[s].params;

            $.ajax({
                type: 'GET',
                url: g.ajaxfile,
                data: {a: f.fetch[0], b: f.fetch[1]},
                dataType: 'json',
                success: function (data) {
                    var fo = ob[s].list;
                    for (var z in fo) {
                        //vars
                        f.row = 'row' in fo[z] ? fo[z].row : '';
                        f.id = "id" in ob[s] ? ob[s].id : "";
                        f.inputid = ob[s].adata + '_' + f.row + (f.id != "" ? '_' + f.id : "");
                        f.divid = ob[s].adata + z + (f.id != "" ? '_' + f.id : "");
                        f.alias = 'alias' in fo[z] ? fo[z].alias : g.ucfirst(f.row);
                        f.placeholder = 'placeholder' in fo[z] ? fo[z].placeholder : g.ucfirst(f.row);
                        f.type = fo[z].type;
                        f.global = fo[z].global;
                        f.format = 'format' in fo[z] ? fo[z].format : '';
                        f.objgroupid = 'objgroupid' in fo[z] ? fo[z].objgroupid : '';
                        f.table = ob[s].adata;
                        f.get = 'get' in fo[z] ? fo[z].get : '';
                        f.attributes = 'attributes' in fo[z] ? fo[z].attributes.join(' ') : '';
                        f.value = 'value' in fo[z] ? fo[z].value : '';
                        data[f.row] = typeof data[f.row] != 'undefined' ? data[f.row] : '';

                        inp += g.ui.form.input(f, data);
                        // new nicEditor({fullPanel : false}).panelInstance(f.inputid);
                        //create event handlers array
                        handlers.push(f.type)

                    }
                    $('.post_container').append(inp);
                    g.loadExt('editor',function() {
                        g.editor.get("div[class^='wysiwyg']");
                    })
                    s++;
                    //run form
                    if (s < length)  form(ob);

                    //create event handlers
                    // for (var h in $.unique(handlers)) {
                    //     vartype = handlers[h] === 'number' || handlers[h] === 'date' ? 'text' : handlers[h];
                    //     g.l(vartype)
                    //     // window[vartype](f);
                    // }
                    //run summernote editor


                }
            });
        } else {
            var className, droplist, droptext = '';
            var board = '<form method="POST" id="' + ob.adata + '">' +
                '<input type="hidden" name="a" value="new">' +
                '<input type="hidden" name="table" value="' + ob.adata + '">';
            var data = [];
            for (var i in ob.list) {
                ob.type = 'type' in ob.list[i] ? ob.list[i].type : 'text';
                ob.global = ob.list[i].global;
                ob.globalkey = 'globalkey' in ob.list[i] ? true : false; //set the key of globals
                ob.row = 'row' in ob.list[i] ? ob.list[i].row : '';
                data[ob.row] = typeof data[ob.row] != 'undefined' ? data[ob.row] : '';
                ob.alias = 'alias' in ob.list[i] ? ob.list[i].alias : ob.row;
                ob.placeholder = 'placeholder' in ob.list[i] ? ob.list[i].placeholder : g.ucfirst(ob.row);
                ob.value = 'value' in ob.list[i] ? ob.list[i].value : '';
                ob.inputid = ob.row;
                ob.divid = ob.row;
                board += g.ui.form.input(ob, data);
            }
            board += '<button class="btn btn-success" onclick="event.preventDefault();g.ui.form.newsubmit(this.form)" id="' + ob.adata + '_insert">Submit</button></form>';
            $(append).append(board);
            g.loadExt('editor',function() {
                g.editor.get("div[class^='wysiwyg']");
            })
        }
    },
    newsubmit: function (obj) {
		event.preventDefault();
        var form = $("#" + obj.id).serializeArray();
     //  g.l(form);
        var callback = function (form) {
            return typeof(g.callback) === 'function' ? g.callback(form) : null;
        }
        $.post(g.ajaxfile, form, function (data, textStatus, jqXHR) {
           //  g.l(data)
            if (data.trim() != 'No') {
                document.getElementById(obj.id).reset();
            } else {
				g.l(textStatus)
                g.l(jqXHR)
                g.alert("Form cannot be submitted");                
            }
        }).done(callback(form));
    },
    input: function (f, data) {
        var part = '', part2 = '', part3 = '', string, result;
//TYPE DROP DOWN
        if (f.type == 'img') {
            if (f.format == 'form-upload') {
                g.ui.form.upload.file.get(f.objgroupid, f.get, data.img, f.table);
            }
            result = '';
        } else if (f.type == 'drop') {
            var key;
            // g.l(data[f.row])
            //     for (var j in droplist) {
            //         dropvalue = droplist.constructor == Array ? droplist[j] : j;
            //         droptext += '<option value="' + dropvalue + '">' + droplist[j] + '</option>';
            //     }
            //     droptext = typeof f.list[i].placeholder != 'undefined' ? '<option value=0>' + f.list[i].placeholder + '</option>' : '';
            var ievent = f.nature != 'new' ? 'onchange="g.ui.form.drop(this)"' : '';

            part = 0 in f.global ? '' : '<option value=0>Select</option>';
            for (var i in f.global) {
                key = f.globalkey == true ? f.global[i] : i;
                part += '<option value="' + key + '" ' + (i == data[f.row] ? 'selected="selected"' : '') + '>' + f.global[i] + '</option>';
            }
            result = '<div class="gs-span" id="' + f.divid + '"><label for="' + f.alias + '">' + f.alias + '</label>' +
                (f.format == 'read'
                        ? data[f.row]
                        : '<select name="' + f.row + '"  ' + ievent + f.attributes + ' class="gs-input" id="' + f.inputid + '">' + part + '</select>'
                ) +
                '</div>';
//TYPE TEXT | NUMBER | DATE
            //with or without submit
        } else if (f.type == 'text' || f.type == 'number' || f.type == 'date') {

            string = f.type == 'date' ? g.date('Y-m-d', data[f.row]) : data[f.row];			
            var ievent = !ievent ? '' :(f.nature != 'new' ? 'onkeyup="g.ui.form.text(this)" onchange="g.ui.form.text(this)"' : '');
            result = '<div class="gs-span" id="' + f.divid + '"><label for="' + f.alias + '">' + f.alias + '</label>' +
                (f.format == 'read'
                        ? string
                        : '<input class="gs-input" name="' + f.row + '" ' + ievent + (!f.attributes ?'':f.attributes)+ ' placeholder="' + f.placeholder + '" id="' + f.inputid + '" type="' + f.type + '" value="' + string + '">'
                ) + '</div>';
//TYPE RADIO
        } else if (f.type == 'radio') {

            var ievent = f.nature != 'new' ? 'onclick="g.ui.form.radio(this)"' : '';
            for (var i in f.global) {
                part2 += '<div class="gs-span"><label for="' + f.inputid + '">' +
                    '<input ' + ievent + f.attributes + '  name="' + f.inputid + '" type="radio" value="' + i + '" ' +
                    (i == data[f.row] ? "checked" : "") + '>' + f.global[i] + '</label></div>';
            }
            result = '<div class="" id="' + f.divid + '"><label for="' + f.alias + '">' + f.alias + '</label>' +
                (f.format == 'read' ? data[f.row] : part2) + '</div>';

//TYPE CHECKBOX
        } else if (f.type == 'checkbox') {
            var ievent = f.nature != 'new' ? 'onclick="g.ui.form.checkbox(this)"' : '';
            for (var i in f.global) {
                part3 += '<div class="gs-span"><label>' +
                    '<input ' + ievent + f.attributes + ' name="' + f.inputid + '" class="' + f.inputid + ' form-control" type="checkbox" value="' + i + '" ' +
                    ( in_array(i, data) ? "checked" : "") + '>' + f.global[i] + '</label></div>';
            }
            //radio result
            result = '<div class="gs-span"  id="' + f.divid + '"><label for="' + f.alias + '">' + f.alias + '</label>' +
                (f.format == 'read' ? data[f.row] : part3) + '</div>';
//TYPE TEXTAREA
            //with submit button (rule!) and editor (by choice)
        } else if (f.type == 'textarea') {
            result = '<div class="gs-span" id="' + f.divid + '"><label for="' + f.alias + '">' + f.alias + '</label>' +
                (f.format == 'read'
                        ? data[f.row]
                        :
                        // '<form id="form' + f.divid + '" ' + f.attributes + ' >'+
                        '<div class="wysiwyg' + f.inputid + '" name="' + f.row + '" placeholder="' + f.placeholder + '" id="' + f.inputid + '">' + g.htmlentities.decode(data[f.row]) + '</div>' +
                        (f.nature != 'new' ?
                            '<button onclick="g.ui.form.textarea(this,this.previousSibling)" class="btn btn-default" id="submit_' + f.inputid + '">Save</button>' : '')
                )
                + '</div>';

//TYPE HIDDEN
        } else if (f.type == 'hidden') {
            result = '<input name="' + f.row + '" type="hidden" value="' + f.value + '">';
        }
        return result;
    },
    reset_inputs: function (array) {
        for (var i in array) {
            $(array[i]).val('');
        }
    },
    text: function (obj) {
        var start = window.performance.now();
        // g.l(obj)
        var id = g.explode('_', obj.id)[1];
        // g.l(id)
        var q = f.query.replace("@row", id).replace("@value", obj.value);
        // g.l(q)
        g.db.func('query', q)

        var end = window.performance.now();
        // g.l(end - start)
    },
    textarea: function (obj, textarea, formid) {
        var editorid = obj.id.replace('submit_', '');
        var value = $('.wysiwyg' + editorid).summernote('code');

        var id = g.explode('_', obj.id)[2];
        var inpid = obj.id.replace('submit_', '');
        // var value = g.htmlentities.encode(textarea.value);
        var q = f.query.replace("@row", id).replace("@value", g.htmlentities.encode(value));
        // g.l(value)
        g.db.func('query', q, function (data, textStatus, jqXHR) {
            if (data == 'yes') {
                g.alert('Page Saved');
            } else {
                g.l(data);
                g.l(textStatus);
                g.l(jqXHR);
            }
        }, 'POST');
    },
    drop: function (obj) {
        // g.l(this.id)
        var id = g.explode('_', obj.id)[1];
        // var value=$("#"+f.inputid).val();
        var q = f.query.replace("@row", id).replace("@value", obj.value);
        // g.l(q)
        g.db.func('query', q, function (data) {
            if (data == 'yes') {
                g.alert("Value updated!");
            } else {
                g.alert("Value updated!");
            }
        })
    },
    radio: function (obj) {
        // var value = $('input[name=' + this.name + ']:checked').val();
        var id = g.explode('_', obj.name)[1];
        var q = f.query.replace("@row", id).replace("@value", obj.value);
        // g.l(q)
        g.db.func('query', q, function (data) {
            g.alert("Value updated!");
        })
    },
    checkbox: function (id, value) {
        var checkedArray = $("input:checkbox:checked." + f.inputid).map(function () {
            return $(this).val();
        }).get();

        g.db.func('query', f.query[0], function (data) {
            // g.l(data)
        });
        //if (f.query.constructor === Array) {
        for (var x in checkedArray) {
            var que = f.query[1].replace("@row", checkedArray[x]);
            $.get(g.ajaxfile, {a: 'query', b: que}, function (data) {
                // g.l(data)
            });
        }
        //}
    },
    /* FORM UPLOAD
     * - file
     * - img
     * jQuery File Upload Plugin PHP Example
     * https://github.com/blueimp/jQuery-File-Upload
     * Copyright 2010, Sebastian Tschan
     * https://blueimp.net
     * Licensed under the MIT license:
     * http://www.opensource.org/licenses/MIT
     * Adapted by Nikos Drosakis for gaisys.com
     * - MULTIPLE UPLOAD
     * - UPLOAD OF VIDEO AUTO FORMATS
     * - PROGRESS BAR
     */
    upload: {
        file: {
            append: ".post_container",
                get: function (objgroupid, id, img) {
                g.loadJS(g.path.lib+'jquery.form.min.js');
                var board = '<div class="imgBox">' +
                    ' <div id="imgView"><img src="' + (img ?  img : "/gaia/img/post.jpg") + '" style="height:250px;width:250px;"></div>' +
                    '<button class="btn btn-file" onclick="g.ui.form.upload.file.input()"  class="attach" data-toggle="tooltip">Select Photo</button>' +
                    '<button class="btn btn-file" id="del_' + id + '" data-toggle="tooltip">Delete</button>' +
                    '<form action="' + g.ajaxfile + '" onsubmit="g.ui.form.upload.file.submit(this,event)" id="upload" method="post" enctype="multipart/form-data">' +
                    '<input name="attach_file" onchange="g.ui.form.upload.file.opensubmit(this)" id="attachinput" type="file" style="display:none">' +
                    '<input type="hidden" name="a" value="obj">' +
                    '<input type="hidden" name="objgroupid" value="' + objgroupid + '">' +
                    '<input type="hidden" name="id" value="' + id + '">' +
                    '<input class="btn btn-success" type="submit" style="display:none" name="submitUpload" id="submitAttach" value="Upload" data-toggle="tooltip">' +
                    '</form></div>';
                $(this.append).append(board);
            },

            input: function () {
                $('#attachinput').click();
                return false;
            },
            opensubmit: function (obj, id) {
                var id = typeof(id) != "undefined" ? id : '';
                var profileFile = $('#' + obj.id).val().split('\\').pop();
                //    $("#bgFileLabel").css('display','block').text(profileFile);
                $('#submitAttach' + id).css('display', 'block');
            },
            submit: function (obj, event, id) {
                var id = typeof(id) != "undefined" ? id : '';
                event.preventDefault();
                var options = {
                    target: '#imgView' + id,
                    success: {},
                    resetForm: true
                }
                $('#upload' + id).ajaxSubmit(options);
                $("#submitAttach" + id).css('display', 'none');
                return false;
            }
        },
        img: {
            folder: g.siteurl + 'gaia/lib/uploader/',
                append: ".post_container",
                filename: '',
                get: function (objgroup, linkid, file, table) {
                $(this.append).prepend("<script src='/gaia/lib/jquery.ui.widget.js'></script>");
                $(this.append).prepend("<script src='/gaia/lib/load-image.all.min.js'></script>");
                $(this.append).prepend("<script src='/gaia/lib/canvas-to-blob.min.js'></script>");
                $(this.append).prepend("<script src='/gaia/lib/jquery.fileupload.js'></script>");
                $(this.append).prepend("<script src='/gaia/lib/jquery.fileupload-process.js'></script>");
                $(this.append).prepend("<script src='/gaia/lib/jquery.fileupload-image.js'></script>");
                $(this.append).prepend("<script src='/gaia/lib/jquery.fileupload-audio.js'></script>");
                $(this.append).prepend("<script src='/gaia/lib/jquery.fileupload-video.js'></script>");
                $(this.append).prepend("<script src='/gaia/lib/jquery.fileupload-validate.js'></script>");
                g.loadCSS(this.folder + "css/jquery.fileupload.css");
                g.loadJS(this.folder + "css/style.css");

                var board = '<div class="imgBox">' +
                    '<div id="files" class="files" style=""></div>' +
                    '<span class="btn btn-success btn-sm fileinput-button">' +
                    '<i class="glyphicon glyphicon-plus"></i>' +
                    '<span>Add file</span>' +
                    // <!-- The file input field used as target for the file upload widget -->
                    // '<input id="fileupload" type="file" name="files[]" multiple>' +
                    '<input id="fileupload" type="file" name="files">' +
                    '</span>' +
                    // <!-- The global progress bar -->
                    '<div id="progress" class="progress" style="display:none">' +
                    '<div class="progress-bar progress-bar-success"></div>' +
                    '</div>' +
                    '</div>';
                $(this.append).append(board);

                var url = g.ajaxfile,
                    uploadButton = $('<button/>')
                        .addClass('btn btn-primary')
                        .css('margin', '0 0 37px 137px')
                        .prop('disabled', true)
                        .text('Processing...')
                        .on('click', function () {
                            var $this = $(this),
                                data = $this.data();
                            $this
                                .off('click')
                                .text('Abort')
                                .on('click', function () {
                                    $this.remove();
                                    data.abort();
                                });
                            data.submit().always(function () {
                                $this.remove();
                            });
                        });
                $('#fileupload').fileupload({
                    url: url,
                    formData: {a: 'insert_obj', objgroup: objgroup, linkid: linkid, table: table},
                    dataType: 'json',
                    autoUpload: false,
                    acceptFileTypes: /(\.|\/)(gif|jpe?g|png)$/i,
                    maxFileSize: 999000,
                    // Enable image resizing, except for Android and Opera,
                    // which actually support image resizing, but fail to
                    // send Blob objects via XHR requests:
                    disableImageResize: /Android(?!.*Chrome)|Opera/
                        .test(window.navigator.userAgent),
                    previewMaxWidth: 228,
                    previewMaxHeight: 250,
                    previewCrop: true
                })
                    .on('fileuploadadd', function (e, data) {
                        // data.context = $('<div/>').appendTo('#files');
                        data.context = $('#files').html('');
                        $.each(data.files, function (index, file) {
                            var node = $('#files');
                            // var node = $('<p/>').append($('<span/>').text(file.name));
                            if (!index) {
                                // .append('<br>')

                                node.append(uploadButton.clone(true).data(data));
                            }
                            $('#progress').show();
                            // node.appendTo(data.context);
                        });
                    })
                    .on('fileuploadprocessalways', function (e, data) {
                        var index = data.index,
                            file = data.files[index],
                            node = $(data.context[index]);
                        // g.l(data.context[index]);
                        if (file.preview) {
                            node.prepend(file.preview);
                        }
                        if (file.error) {
                            node
                                .append('<br>')
                                .append($('<span class="text-danger"/>').text(file.error));
                        }
                        if (index + 1 === data.files.length) {
                            data.context.find('button')
                                .text('Upload')
                                .prop('disabled', !!data.files.error);
                        }

                    }).on('fileuploadprogressall', function (e, data) {
                    var progress = parseInt(data.loaded / data.total * 100, 10);
                    $('#progress .progress-bar').css(
                        'width',
                        progress + '%'
                    );

                    function close_progress() {
                        $('#progress').hide()
                    }

                    if (progress == '100') {
                        setTimeout(close_progress, 1000);
                    }

                }).on('fileuploaddone', function (e, data) {
                    $('#progress').hide();

                    $.each(data.result.files, function (index, file) {
                        if (file.url) {
                            var link = $('<a>')
                                .attr('class', 'viewImage')
                                .prop('href', file.url);
                            $(data.context.children()[index])
                                .wrap(link);
                        } else if (file.error) {
                            var error = $('<span class="text-danger"/>').text(file.error);
                            $(data.context.children()[index])
                                .append('<br>')
                                .append(error);
                        }
                    });

                }).on('fileuploadfail', function (e, data) {
                    $.each(data.files, function (index) {
                        var error = $('<span class="text-danger"/>').text('File upload failed.');
                        $(data.context.children()[index])
                            .append('<br>')
                            .append(error);
                    });
                }).prop('disabled', !$.support.fileInput)
                    .parent().addClass($.support.fileInput ? undefined : 'disabled');

                //append image that already exists

                if (typeof file != 'undefined' && file != null) {
                    $('#files').html('<img src="' + g.get.UPLOADS + file + '" style="height:250px;margin: -21px 0 0 -21px;">');
                } else {
                    // $.get(g.ajaxfile,{a:'select_obj',b:objgroup,c:linkid,d:table},function(data){
                    //     g.l(objgroup);
                    // if(data!='no') {
                    //     $('#files').html('<img src="'+GS.UPLOADS+data+'" style="height:250px;margin: -21px 0 0 -21px;">');
                    // }else{
                    $('#files').text('FEATURE PHOTO');
                    // }
                    // });
                }
            }

        }
    }
}