/*updated:2020-01-29 20:20:34 apis - v.0.73 - Author:Nikos Drosakis - License: GPL License*/
/*updated:2020-01-01 18:10:19
v.0.52
Author:Nikos Drosakis*/

/*updated:2020-01-01 18:02:14
v.
Author:Nikos Drosakis*/

//2017-11-01 09:29:17

/*
 * G.APIS
 * */
g.apis = {
    analytics: function () {
        var _gaq = _gaq || [];
        _gaq.push(['_setAccount', 'UA-48757242-1']);
        _gaq.push(['_trackPageview']);

        (function () {
            var ga = document.createElement('script');
            ga.type = 'text/javascript';
            ga.async = true;
            ga.src = ('https:' == document.location.protocol ? 'https://ssl' : 'http://www') + '.google-analytics.com/ga.js';
            var s = document.getElementsByTagName('script')[0];
            s.parentNode.insertBefore(ga, s);
        })();
    },
    socialbar: function () {
        var social = '<li><a href="#" class="icon fa-twitter"><span class="label">Twitter</span></a></li>' +
            '<li><a href="#" class="icon fa-facebook"><span class="label">Facebook</span></a></li>' +
            '<li><a href="#" class="icon fa-dribbble"><span class="label">Dribbble</span></a></li>' +
            '<li><a href="#" class="icon fa-linkedin"><span class="label">LinkedIn</span></a></li>' +
            '<li><a href="#" class="icon fa-tumblr"><span class="label">Tumblr</span></a></li>' +
            '<li><a href="#" class="icon fa-google-plus"><span class="label">Google+</span></a></li>' +
            '<li><a href="#" class="icon fa-github"><span class="label">Github</span></a></li>';

        $('#social').append('<ul class="social">' + social + '</ul>')
    },
    // FACEBOOK This function is called when someone finishes with the Login Button.  See the onlogin handler attached to it in the sample code below. Load the SDK asynchronously
    fb: function () {
        (function (d, s, id) {
            var js, fjs = d.getElementsByTagName(s)[0];
            if (d.getElementById(id)) return;
            js = d.createElement(s);
            js.id = id;
            js.src = "//connect.facebook.net/en_US/sdk.js";
            fjs.parentNode.insertBefore(js, fjs);
        }(document, 'script', 'facebook-jssdk'));
        // Now that we've initialized the JavaScript SDK, we call
        // FB.getLoginStatus().  This function gets the state of the
        // person visiting this page and can return one of three states to
        // the callback you provide.  They can be:
        //
        // 1. Logged into your app ('connected')
        // 2. Logged into Facebook, but not your app ('not_authorized')
        // 3. Not logged into Facebook and can't tell if they are logged into
        //    your app or not.
        //
        // These three cases are handled in the callback function.

        // window.fbAsyncInit = function () {
        //     FB.init({
        //         appId: '1202058519872630',
        //         cookie: true,  // enable cookies to allow the server to access
        //                        // the session
        //         xfbml: true,  // parse social plugins on this page
        //         version: 'v2.8' // use graph api version 2.8
        //     })
        //
        //     FB.getLoginStatus(function (response) {
        //         statusChangeCallback(response);
        //     });
        //
        // };

        // This is called with the results from from FB.getLoginStatus().
        function statusChangeCallback(response) {
            g.l(response);
            // The response object is returned with a status field that lets the
            // app know the current login status of the person.
            // Full docs on the response object can be found in the documentation
            // for FB.getLoginStatus().
            if (response.status === 'connected') {
                // Logged into your app and Facebook.
                connect();
            } else if (response.status === 'not_authorized') {
                // The person is logged into Facebook, but not your app.
                document.getElementById('status').innerHTML = 'Please log ' +
                    'into this app.';
            } else {
                // The person is not logged into Facebook, so we're not sure if
                // they are logged into this app or not.
                document.getElementById('status').innerHTML = 'Please log ' +
                    'into Facebook.';
            }
        };

        function checkLoginState() {
            FB.getLoginStatus(function (response) {
                statusChangeCallback(response);
            });
        };


        // Only works after `FB.init` is called
        function connect() {
//            FB.api('/me', function(response) {
//                g.l(response)
//                console.log('Successful login for: ' + response.name);
//                document.getElementById('status').innerHTML =
//                    'Thanks for logging in, ' + response.name + '!';
//            });
            FB.api('/me', 'GET',
                {"fields": "id,name,first_name,last_name,email,link,about,education,age_range,context,posts,gender,picture,cover,birthday,hometown,inspirational_people"},
                function (response) {
                    g.l(response);
                    //check if exists

                    //if not exist write data with phase==2 and reload page
                }
            );

        };
        function post_message(mes) {
            FB.login(function () {
                FB.api('/me/feed', 'post', {message: mes});
            }, {scope: 'publish_actions'});
        }

    }
};