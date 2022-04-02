/*updated:2020-01-29 20:20:34 aaa - v.0.73 - Author:Nikos Drosakis - License: GPL License*/
/*updated:2020-01-01 18:10:19
v.0.52
Author:Nikos Drosakis*/

/*updated:2020-01-01 18:02:14
v.
Author:Nikos Drosakis*/

//2017-11-01 09:29:17

/*
*
* AAA standards for people with disabilities
*
* */
g.ui.aaa= function (e) {
    //SET KEYBOARD SHORTCUTS
    var keys = {};
    var gotolist = {48: '/dsh', 49: '/', 50: '/whois', 51: '/faq', 52: '/contact'}

    function printKeys() {
        if (18 in keys) {  //alt is pressed
            for (i in gotolist) {
                if (i in keys) {
                    location.href = gotolist[i];
                }
            }
        }
    }

    $(document)
        .keydown(function (e) {
            keys[e.which] = true;
            printKeys();
        })
        .keyup(function (e) {
            delete keys[e.which];
            printKeys();
        });

    //SET SIZES
    var sizes = '<div id="aaa" style="position: absolute;top:0;margin: -3px 0 0 10%;">' +
        '<span style="margin-left:10px;color:white">Font Size</span>' +
        '<button class="btn btn-xs btn-primary" data-toggle="tooltip" title="Μικρό Μέγεθος" id="size-0.9" style="font-size:12px;margin:5px;">A</button>' +
        '<button class="btn btn-xs btn-primary" data-toggle="tooltip" title="Μεσαίο Μέγεθος" id="size-1" style="font-size:18px;margin:5px;">A</button>' +
        '<button class="btn btn-xs btn-primary" id="size-1.1" data-toggle="tooltip" title="Μεγάλο Μέγεθος" style="font-size:24px;margin:5px;">A</button>' +
        '<span style="margin-left:10px;color:white">Page Contast</span>' +
        '<button class="btn btn-xs btn-primary" id="bg-#fafafa" data-toggle="tooltip" title="Λευκό background" style="font-size:17px;color:black;background:white;margin:5px;">A</button>' +
        '<button class="btn btn-xs btn-primary" id="bg-gray" data-toggle="tooltip" title="Γκρι background" style="font-size:17px;color:black;background:gray;margin:5px;">A</button>' +
        '<button class="btn btn-xs btn-primary" id="bg-black" data-toggle="tooltip" title="Μαύρο background" style="font-size:17px;color:white;background:black;margin:5px;">A</button>' +
        '</div>';
    $('.gs-topheader1').append(sizes)

    $(document)
        .on("click", "button[id*='size-']", function () {
            var val = this.id.replace('size-', '');
            g.db.func('query', "UPDATE varglobal SET value='" + val + "' WHERE name='aaa-size'", function (data) {
                if (data == 'yes') {
                    $('html').css({'zoom': val});
                }
            });

        })
        .on("click", "button[id*='bg-']", function () {
            var val = this.id.replace('bg-', '');
            g.db.func('query', "UPDATE varglobal SET value='" + val + "' WHERE name='aaa-bg'", function (data) {
                if (data == 'yes') {
                    $('body').css({'background-color': val});
                }
            });
        })
};