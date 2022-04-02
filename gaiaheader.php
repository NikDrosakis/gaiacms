<?php //updated:2020-01-29 20:42:46 gaiaheader- v.0.73 - Author:Nikos Drosakis - License: GPL License ?>
<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<meta http-equiv="Content-type" content="text/html; charset=UTF-8">  
<meta name="viewport" content="width=device-width, initial-scale=1.0">  
    <!--==== Website title==== -->
    <meta http-equiv="X-UA-Compatible" content="IE=edge">	
     <!-- ====Stylesheets===== -->
    <script src="/gaia/js/libs.js"></script>   
    <script src="/gaia/js/spd.js"></script>   
	<link rel="icon" href="<?=$this->is['logo']!='' ? $this->is['logo'] : '/gaia/img/logo.png'?>"/>
    <!------------IF DSH --------------->
    <?php if($this->page=="dsh"){ ?>
        <script src="/gaia/lib/d3.js"></script>
<!--        <script src="/gaia/lib/editor/summernote.js"></script>-->
<!--        <link rel="stylesheet" href="/gaia/lib/editor/summernote.css">-->
<!--        <link rel="stylesheet" href="/gaia/css/dsh.css">-->
    <?php } ?>

    <!------COMMON CSS------------->
    <link rel="stylesheet" href="/gaia/css/global.css">

    <!--------METATAGS----------->
	<?php $lp=$this->GS['langprefix']; 
		  $data=$this->GS['data'];
		  $locale=$this->GS['lang']=="gr" ? "el-gr":"en-us";
	?>
   		<title><?=!$data['title'.$lp] ? ($this->mode!='' ? $this->mode : urldecode($this->is['title'])) : $data['title'.$lp]?></title>
		<meta name="description" content="<?=$data['excerpt'.$lp]=='' ? urldecode($this->is['seodescription']):urldecode($data['excerpt'.$lp])?>">
		<meta name="keywords" content="<?=urldecode($this->is['seokeywords'])?>">
		<meta property="og:title" content="<?=$data['title'.$lp]!='' && $data['title'.$lp]!=null ? $data['title'.$lp] :($this->page!='' ? $this->page : urldecode($this->is['title']))?>">
		<meta property="og:type" content="article">
		<meta property="og:updated_time" content="<?=time()?>">
		<meta property="og:image" content="<?=!$data['img'] ? $this->is['logo']:$this->GS['SITE_URL']."media/".$data['img']?>">
		<meta property="og:url" content="<?=!$data['uri'] ? ((isset($_SERVER['HTTPS']) && $_SERVER['HTTPS'] === 'on' ? "https" : "http") ."://$_SERVER[HTTP_HOST]$_SERVER[REQUEST_URI]"):SITE_URL.$data['uri']."?lang=".$this->GS['lang']?>">
		<meta property="ia:markup_url" content="<?=!$data['uri'] ? ((isset($_SERVER['HTTPS']) && $_SERVER['HTTPS'] === 'on' ? "https" : "http") ."://$_SERVER[HTTP_HOST]$_SERVER[REQUEST_URI]"):SITE_URL.$data['uri']?>">
		<meta property="og:description" content="<?=$data['excerpt'.$lp]=='' ? urldecode($this->is['seodescription']):urldecode($data['excerpt'.$lp])?>">		
		<meta property="og:locale" content="<?=$locale?>">		
		<meta property="fb:app_id" content="<?=$this->is['fb_app_id']?>" /> 
		<meta name="robots" content="selection">
		<meta name="copyright" content="Nikos Drosakis">
		<meta name="googlebot" content="all">
		<meta name="language" content="<?=$this->GS['lang']?>">
		<meta name="reply-to" content="<?=$this->is['reply_address']?>">
		<meta name="web_author" content="<?=$this->is['web_author'.$lp]?>">
		<meta http-equiv="name" content="value">
		<meta name="ROBOTS" CONTENT="NOARCHIVE">		
		<meta name="google" content="notranslate">
		<meta name="google-site-verification" content="<?=urldecode($this->is['google_site_verification'])?>">
		<link href="atom.xml" type="application/atom+xml" rel="alternate" title="Sitewide ATOM Feed" >
	<?php if(file_exists($this->template_rootpath."head.php")){include $this->template_rootpath."head.php";} ?>

<?php
//$mode=$this->mode!="" ? $this->mode : ($this->page=="dsh" ? "home":"");
//$page=$this->page!="" ? $this->page : ($this->mode=="" ? "index":"");
//$sub= $this->sub !="" ? $this->sub : $mode;

//$this->mode!="" ? $this->mode:"Home"
//$this->sub!="" ? " > ".$this->sub:""
//$this->name!="" ? " > ".$this->name:""
//$this->link!="" ? " > ".$this->link:""?>		

	</head>
<body> 
<div id="fb-root"></div>
<script async defer crossorigin="anonymous" src="https://connect.facebook.net/en_US/sdk.js#xfbml=1&version=v9.0&appId=735242933867532&autoLogAppEvents=1" nonce="JKSV4YOc"></script>

 <script type="text/javascript">var GS=<?php echo json_encode($this->GS, JSON_UNESCAPED_UNICODE);?>;</script>  
    <!------------javascript api--------------->
    <script src="/gaia/js/gaia.js"></script>
    <?php if(!ROOTSETUP){ ?><script src="/gaia/init.js"></script><?php } ?> 
<?php 
if(!ROOTSETUP){
    include GAIAROOT.'dshbar.php';
if($this->inside()) {

    if ($this->page=="dsh") { ?>
        <div class="gs-sidepanel" style="
        <?= !empty($_COOKIE['drgb-sidepanel']) ? "width:" . $_COOKIE['drgb-sidepanel'] . "px;" : "" ?>
                display:<?= !empty($_GET['dsh']) ? 'block' : 'none' ?>">
            <div id="dragbar3" class="dragbar" onmousedown="g.ui.draggable(this,event)"></div>
            <?php include GS . "dsh/" . $this->page . ".php"; ?>
        </div>
    <?php }} ?>
	
	<?php if($this->mode!='global'){ ?>
    <div id="board_gvars" class="gs-sidepanel" style="<?=!empty($_COOKIE['drgb-sidepanel']) ? "width:".$_COOKIE['drgb-sidepanel']."px;":""?>
     display:<?=$_COOKIE['gs-sidepanel']=='globalvarsbar' ? 'block':'none'?>">
		<div id="dragbar1" class="dragbar" onmousedown="g.ui.draggable(this,event)"></div>
		    <!--<button style="float:left" class="btn btn-danger btn-xs" onclick="$('#main_window').css('width','100%');$('#board_gvars').animate({width:'toggle'},500);g.cookie.delete('gs-sidepanel');">Close</button>-->
		<button style="margin-bottom:10px" class="btn btn-danger btn-xs" onclick="g.ui.switcher('.gs-sidepanel');g.cookie.delete('gs-sidepanel');">X</button>

		<?php include GAIAROOT . 'dsh/global.php'; ?>
	</div>	
	<?php } ?>
	<?php } ?>

<!--<div id="main_window" style="width: <?php //echo !empty($_COOKIE['drgb-main']) && !empty($_GET['sidepanel']) ? $_COOKIE['drgb-main'].'px' : (!empty($_COOKIE['gs-sidepanel']) ? '70%':'100%')?>;">-->
<!--<div id="main_window" style="width:100%" class="pvar">
<div id="wrapper">-->
