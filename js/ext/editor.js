/*updated:2020-01-29 20:20:34 editor - v.0.73 - Author:Nikos Drosakis - License: GPL License*/
/*updated:2020-01-01 18:10:19
v.0.52
Author:Nikos Drosakis*/

/*updated:2020-01-01 18:02:14
v.
Author:Nikos Drosakis*/

//2018-08-16 22:41:53

g.editor= {
    cliedit: function (file, selector) {
        var id = selector.replace('#', '');
        g.ui.reset(selector);
        $.get(g.ajaxfile, {a: 'getcontent', b: file, c: 'encoded'}, function (data) {
            // g.l(data)
            $(selector)
            $(selector).replaceWith(function () {
                return $("<textarea href=" + file + " id=" + id + ">", {html: $(this).html()});
            });
            $(selector).html(data);
            var clisave = 'clisave-' + id;
            if ($("#" + clisave).length == 0) {
                $("<button id='" + clisave + "' class='console-save'>Save</button>").insertBefore($(selector));
            }
        });

        $(document)
            .on("click", "[id^='clisave-']", function () {
                var id = '#' + this.id.replace('clisave-', '');
                var file = $(id).attr('href'), val = $(id).val();
                // g.l(val)
                g.file.file_put_contents(file, val, function (res) {
                    if (res == 'ok') {
                        g.alert("FILE SAVED!");
                    } else {
                        g.alert("FILE NOT SAVED!");
                    }
                }, function () {
                    g.alert("FILE NOT SAVED!")
                });
                return false;
            })
        return false;
    },
    get: function () {
        var editor_length = $('div[id*="fileditor_"]').length;

        if (editor_length) {
            var filefolder = '', fileeditor = '';

            filefolders = [];
            $('div[id*="fileditor_"]').each(function () {
                filefolders.push($('#fileditor_' + (this.id.replace('fileditor_', ''))).attr('file'))
            });
            // g.l(filefolders)

            $.get(g.ajaxfile, {a: 'getcontents', b: filefolders}, function (data) {

                for (vol = 0; vol < editor_length; vol++) {
                    fileeditor = '<textarea id="contentFile_' + vol + '" class="form-control long">' + data[vol] + '</textarea><br/>' +
                        '<button onclick="g.file.editor.save(this)" id="saveFile_' + vol + '" class="btn btn-success">Save File</button>';
                    $('#fileditor_' + vol).html(fileeditor);
                }
            }, 'json');
        }
    },
    fditor: function (div, file) {
        var bfile = file.split('/');
        var basefile = bfile[bfile.length - 1].split('.')[0].trim();
        var basefilebox = $('#fileditor_' + basefile).html();
        // g.l(basefile)
        if (typeof(basefilebox) != 'undefined') {
            $('#fileditor_' + basefile).remove();
        } else {
            $.get(g.ajaxfile, {a: 'getcontent', b: file}, function (data) {
                var modul = '<option value="">Insert Module</option>';
                for (i in g.get.modules) {
                    modul += '<option value="' + i + '">' + g.get.modules[i] + '</option>';
                }
                var editor = '<div id="fileditor_' + basefile + '" class="file_editor"  file="' + file + '">' +
                    '<h2 style="display:block">' + basefile + '</h2>' +
                    '<select id="insertmodule' + basefile + '" class="form-control" style="width:126px;display: inline;margin-bottom:0;">' + modul + '</select>' +
                    '<button id="inc-div-' + basefile + '" style="width: 40px;" class="btn btn-sm btn-info">div</button>' +
                    '<button id="inc-span-' + basefile + '" style="width: 46px;" class="btn btn-sm btn-info">span</button>' +
                    '<button id="include_pvar' + basefile + '" class="btn btn-sm btn-info">Include pvar</button>' +
                    '<button class="btn btn-sm btn-success" id="saveToFile' + basefile + '">Save to file</button>' +
                    '<textarea name="contentFile_' + basefile + '" id="phpeditor' + basefile + '" style="float: left;height: 620px;display: inline;" class="form-control">' + data + '</textarea></div>';
                $(div).append(editor);
            });

        }
    },
    save: function (obj, content) {
        var id = typeof obj === 'object' ? obj.id.replace('saveFile_', '') : obj,
            filefolder = $('#fileditor_' + id).attr('file'),
            content = typeof content != 'undefined' ? content : $('#contentFile_' + id).html();
        // g.l(content)
        // g.l(id)
        // g.l(id)
        g.file.file_put_contents(filefolder, content, function (data) {
            if (data == 'ok') {
                g.alert("FILE SAVED!")
            } else {
                g.alert("FILE NOT SAVED!")
            }
        }, function (xhr, error) {
            g.l(xhr.responseText);
            g.l(error + " at producing results");
        })
    },
    editor: function (selector) {
        $(selector).summernote({
            height: 300,
            toolbar: [
                // [groupName, [list of button]]
                ['do', ['undo', 'redo']],
                ['style', ['bold', 'italic', 'underline', 'clear']],
                ['font', ['blockquote', 'superscript', 'subscript', 'hr']],
                ['fontsize', ['style', 'fontsize', 'fontname', 'color']],
                ['list', ['ul', 'ol', 'paragraph', 'height']],
                ['insert', ['picture', 'video', 'link', 'table']],
                ['mybutton', ['image']],
                ['help', ['codeview', 'help']]
            ]
        });
    },
    sethead: '<!DOCTYPE HTML>\n' +
    '<head>\n' +
    '<meta charset="utf-8">\n' +
    '<!--==== Website title==== -->\n' +
    '<meta name="description" content="">\n' +
    '<!-- ====Mobile Specific Metas==== -->\n' +
    '<meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1">\n' +
    '<!-- ====Stylesheets===== -->\n' +
    '<script src="/gaia/js/libs.js"></script>\n' +
    '<script type="text/javascript">var GS=<?php echo json_encode($this->GS, JSON_UNESCAPED_UNICODE);?>;</script>\n' +
    '<script src="/gaia/js/gaia.js"></script>\n' +
    '<link rel="stylesheet" href="/gaia/css/global.css" />\n',
    set: function (what, id) {
        var header = sethead + '<style>\n' +
            'html{ font-size:100%;zoom: <?=$this->is("aaa-size")?>}\n' +
            'body{ background-color: <?=$this->is("aaa-bg")?>}\n' +
            '</style>\n' +
            '</head>\n' +
            '<body>\n' +
            '<div id="wrapper">';
        var footer = '<footer>\n' +
            '<div class="copyright">\n' +
            '<ul class="copyright"> <li>© Powered By <a href="https://"+document.domain+"">Gaiasys</a>. All rights reserved.</li><li>Design: <a href="">HTML5.UP</a></li> </ul> v.0.131\n' +
            '</footer>\n' +
            '</div>\n';
        var what = what == 'header' ? header : footer;
        g.insertAtCursor('#texteditor' + id, what);
    }
}