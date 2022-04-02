<?php //updated:2020-01-29 20:20:34 header- v.0.73 - Author:Nikos Drosakis - License: GPL License ?>
<!--updated:2020-01-01 18:12:01 - v.0.52 - Author:Nikos Drosakis - License: GPL License-->
<!DOCTYPE HTML>
<html>
<head>
	<meta charset="UTF-8">
	<meta name="description" content="Gaia Dashboard">
    <meta HTTP-EQUIV="CACHE-CONTROL" CONTENT="NO-CACHE">
    <meta HTTP-EQUIV="PRAGMA" CONTENT="NO-CACHE">
	<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
	<link href="/gaia/css/dsh.css" rel="stylesheet" type="text/css" />
	<link href="/gaia/css/global.css" rel="stylesheet" type="text/css" />
	<link rel="icon" href="/gaia/img/logo.png" type="image/png"/>
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <!-- ====Mobile Specific Metas==== -->
    <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1 shrink-to-fit=no">
    <base href="">
	<?php
	//redirect if not authorised superuser
	if(!$this->is_authorised(range(2,14)) || empty($_COOKIE['sp'])){ redirect(SITE_URL); }
	?>

<title>Dashboard > <?php echo ($this->sub!=''? ucfirst($this->sub).'-':'').ucfirst($this->mode);?></title>

<script src="/gaia/js/libs.js"></script>

<!--<link href="/gaia/lib/editor/summernote.css" rel="stylesheet">-->
<!--	<script src="/gaia/lib/editor/summernote.js"></script>-->
<!--	<link href="/gaia/lib/prism.css" rel="stylesheet" />-->
	

<script>var GS=<?=json_encode($this->GS, JSON_UNESCAPED_UNICODE)?></script>
<script>var my=<?=json_encode($_COOKIE, JSON_UNESCAPED_UNICODE)?></script>
<script src="/gaia/js/gaia.js"></script>
<script src="/gaia/dsh/init.js"></script>


</head>

<body>

<div class="container">
