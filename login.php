<?php //updated:2020-01-29 20:20:37 login- v.0.73 - Author:Nikos Drosakis - License: GPL License ?>
<!DOCTYPE html>
<head>
        <meta charset="UTF-8">
        <meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1"> 
		<title><?=$this->is('title');?></title>
	<meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1">
		<link rel="shortcut icon" type="image/x-icon" href="/gaia/img/logo.png">
	<script src="/gaia/js/libs.js"></script>	
	<link href="/gaia/css/global.css" rel="stylesheet" type="text/css"/>
	<link href="/gaia/css/login.css" rel="stylesheet" type="text/css" />
</head>
<body>
<script>var GS=<?php echo json_encode($this->GS, JSON_UNESCAPED_UNICODE);?>;</script>
	<script src="/gaia/js/gaia.js"></script>
	<script src="/gaia/init.js"></script>

<div id="bg">
<div class="module">
<div id="login-box">
	<h1>
		<img src="/gaia/img/logo.png" style="width: 50px;">
		<a href="/"><?=$this->is('title');?></a> Login
		</h1>
</div>

     <label for="name"><input class="form-control" id="name" required type="text" autocomplete="on" placeholder="Username"></label>
		 <label for="pass"><input class="form-control" id="pass" required type="password" placeholder="Password"></label>
			 <label for="loginf"><input class="button key13"  type="button" onclick="g.init.login()" id="loginf" value="Enter"></label>
	<a class="form-control" href="register">Register</a>

  </div>
  </div>

</body>
</html>
<script>	
$(document).on("click",'#forgot_password',function () {
    g.dialog({
        message: "<input type='text' id='forgotmail'>",
        title: "INSERT_EMAIL_ADDRESS",
        buttons: {
            main: {
                label: "Send",
                className: "btn-primary",
                callback: function () {
                    var forgotmail = $('#forgotmail').val();
                    // g.l(forgotmail)
                    if (forgotmail != '') {
                        $.get(g.ajaxfile, {a: 'forgot_password', b: forgotmail}, function (data) {
                            // g.l(data)
                            if (data == 'yes') {
                                g.alert("EMAIL_SENT_MAILBOX");
                            } else {
                                g.alert('Email can not be sent right now');
                            }
                        })
                    }
                }
            }
        }
    })
});
</script>	