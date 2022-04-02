/*updated:2020-01-29 20:20:34 upload - v.0.73 - Author:Nikos Drosakis - License: GPL License*/

g.upload= {
    uploader: function (table, objgroup, linkid,callback) {
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
        var formdata= {a: 'insert_obj', objgroup: objgroup, linkid: linkid, table: table};

        $('#fileupload').fileupload({
            url: url,
            formData: formdata,
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
            previewCrop: true,
            done: function (e, data) {
                callback(data)
            }
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

            })
            .on('fileuploadprogressall', function (e, data) {
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

            })
            .on('fileuploaddone', function (e, data) {
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

            })
            .on('fileuploadfail', function (e, data) {
                $.each(data.files, function (index) {
                    var error = $('<span class="text-danger"/>').text('File upload failed.');
                    $(data.context.children()[index])
                        .append('<br>')
                        .append(error);
                });
            })
            .prop('disabled', !$.support.fileInput)
            .parent().addClass($.support.fileInput ? undefined : 'disabled');
    }
}

$(document).ready(function() {

//PROFILE IMAGE
//      $("input[id*='imageInput']").change(function (){
// 	 var id= this.id.replace('imageInput','');
//        var profileFile = $(this).val().split('\\').pop();
// 		var uval = profileFile.split('/\/');
//        $("#profileFileLabel"+id).css('display','block').text(profileFile);
// 	   $('#submitbtn'+id).css('display','block');
//      });
    $('#profilePhotoForm').submit(function() {
        $(this).ajaxSubmit(profileOptions);
        //$("#profileFileLabel,#submit-btn").css('display','none');
        return false;
    });

    $("[id*='upload']").submit(function(event) {
        event.preventDefault();
// var id= this.id.replace('upload','');
// 		g.l(id)
        $(this).ajaxSubmit({
            target: '#imgView',
            //beforeSubmit: { validate('#imageInput');},
            success: {},
            resetForm: true
        });
        $("#submitAttach").css('display','none');
        return false;
    });

}); 