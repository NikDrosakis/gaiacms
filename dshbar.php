<?php //updated:2020-01-29 20:20:34 dshbar- v.0.73 - Author:Nikos Drosakis - License: GPL License ?>

<!----------------------------the MENU---------------------------->
<?php $dsh=$this->page=="dsh" ? true : false; ?>
	
<?php if($this->mobile){ ?>
<div id="dashbar" style="display:none">
    <img id="logo" src="/gaia/img/logo.png">
	<div id="menuwrapper">
        <ul>            
            <?php
            $permissions= $this->db->f("SELECT permissions FROM usergrp WHERE id=?",array($_COOKIE['GSGRP']))['permissions'];            
			//$permissions=json_decode($permissions,true);
			if(is_json($permissions)){
			$permissionList=json_decode($permissions,true);			
            foreach($this->apages as $mpage){
			if(in_array($mpage,$permissionList)){
            $targ= $mpage == $this->mode ? 'style="color:greenyellow;"' : '';
            ?>
            <li <?=$mpage==$this->mode ? $targ : ''?>>                
                <a id="paging_menu" href="/dsh/<?=$mpage?>"> 
				<!--$dsh ? "/dsh/$mpage":"?dsh=$mpage"-->
                <span style="color: inherit;" class="glyphicon glyphicon-<?=$this->icon($mpage)?>" aria-hidden="true"></span>
                <?=$mpage?>
				</a>
            </li>
            <?php 	}}}  ?>
			<li>
              <a style="<?='home'==$this->mode ? 'color:greenyellow;' : ''?>" href='<?=$dsh ? "/dsh/home":"?dsh=home"?>'>
			  <span style="color: inherit;" class="glyphicon glyphicon-<?=$this->icon('home')?>" aria-hidden="true"></span>home</a>
            </li>
        </ul>
    </div>
</div>
<?php } ?>

<?php $loggedin= isset($_COOKIE['GSID']) &&  $_COOKIE['GSGRP'] > 1 ? true : false; ?>
<div id="gs-header">
<?php if($loggedin && $this->mobile){ ?>
<span id="menu-opener2" style="cursor:pointer;float:right;margin: 14px 13px 2px -28px;color: white;" class="menuopener gs-mobile"></span>
<?php } ?>
<ul class="gs-topheader" style="margin: 10px;list-style-type:none">

<?php if(isset($_COOKIE['GSID']) && $_COOKIE['GSGRP'] > 1 && $this->page != 'dsh'){ ?>
<li><a href="/dsh">Dashboard</a></li>
<?php } ?>

<?php if(isset($_COOKIE['GSID']) && $_COOKIE['GSGRP'] > 1 && $this->page != 'dsh'){ ?>
<li>
<div class="btn-group dropup" style="cursor:pointer">
<a style="cursor:pointer" type="button" role="button" class="dropdown-toggle" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
<span class="glyphicon glyphicon-heart-empty" aria-hidden="true"></span>
Apps
</a>
<ul role="menu" aria-labelledby="dLabel" class="dropdown-menu">
	<?php foreach($this->apps as $app){ ?>
	<li><a tabindex="-1" style="display:block;margin:0 0 0 0;cursor:pointer" href="https://aimd5.com/<?=$app?>"><?=strtoupper($app)?></a></li>
	<?php } ?>	
	<li><a tabindex="-1" style="display:block;margin:0 0 0 0;cursor:pointer" href="https://aimd5.com:3007">BOT:3007</a></li>
</ul>
</div>
</li>
<?php } ?>

<?php
$permissions= $this->db->f("SELECT permissions FROM usergrp WHERE id=?",array($_COOKIE['GSGRP']))['permissions'];            
//$permissions=json_decode($permissions,true);
if(is_json($permissions)){
$permissionList=json_decode($permissions,true);			
foreach($this->apages as $mpage){
if(in_array($mpage,$permissionList)){
$targ= $mpage == $this->mode ? 'style="color:greenyellow;"' : '';
?>
<li>                
	<a <?=$mpage==$this->mode ? $targ : ''?> id="paging_menu" href="/dsh/<?=$mpage?>"> 
	<!--$dsh ? "/dsh/$mpage":"?dsh=$mpage"-->
	<span style="color: inherit;" class="glyphicon glyphicon-<?=$this->icon($mpage)?>" aria-hidden="true"></span>
	<?=$mpage?>
	</a>
</li>
<?php 	}}}  ?>
<li><a style="<?='home'==$this->mode ? 'color:greenyellow;' : ''?>" href='<?=$dsh ? "/dsh/home":"?dsh=home"?>'><span class="glyphicon glyphicon-<?=$this->icon('home')?>" aria-hidden="true"></span>home</a></li>

<?php if($this->GS['page'] == 'dsh'){ ?>
<li><a href="/">Public</a></li>
<?php } ?>

<?php if($loggedin){ ?>

<?php if($this->mode!='global'){ ?>
<li><a style="cursor:pointer" onclick="if(GS.page=='dsh'){location.href='/dsh/global'}else{g.cookie.set('globs_tab','pvar');g.varg_switch();}"><span class="glyphicon glyphicon-equalizer" aria-hidden="true"></span>Globals</a></li>
<?php } ?>

<!--<li><a class="white" href="/gaiasys" target="_blank"><span class="glyphicon glyphicon-question-sign" aria-hidden="true"></span> Doc</a></li>'-->
<?php } ?>

<?php if($loggedin){ ?>
<li><astyle="cursor:pointer" onclick="g.init.logout()" id="logout"><span class="glyphicon glyphicon-hand-right" aria-hidden="true"></span>Logout</a></li>
<?php }else{ ?>
<li><a style="cursor:pointer" onclick="g.redirect(&quot;/login&quot;)"><span class="glyphicon glyphicon-hand-right" aria-hidden="true"></span>Login</a></li>
<?php } ?>
</ul>
<?php include TEMPLATESURI."/".$this->template."/pages/social.php"; ?>
<div class="gs-topheader1">

<?php if($loggedin && $this->mobile){ ?>
<div id="menu-opener"><span style="cursor:pointer;margin: 8px 0 0 8px;" class="menuopener"></span></div>
<?php } ?>


<div class="logo_image_id">
<img src="<?=isset($_COOKIE['GSIMG']) ? UPLOADS.$_COOKIE['GSIMG'] : "/gaia/img/user.png"?>" width="32" height="32" style="margin-top: 3px;">
</div>

<div style="cursor:pointer;float:right; margin-top: 5px;font-size: 20px;position: relative;">
<a onclick="event.preventDefault();g.cookie.delete('lang');location.href='?lang=en'">english</a> | 
<a onclick="event.preventDefault();g.cookie.set('lang','gr');location.href='?lang=gr'">ελληνικά</a>
</div>
<div class="gs-desktop"><p style="margin: 0 0 0 0;"><?=!isset($_COOKIE['GSGRP']) ? 'Welcome!' : $this->usergrps[$_COOKIE['GSGRP']]?></p>
<a style="margin: 0 0 0 0;" href="/dsh/user?uid=<?=$_COOKIE['GSID']?>"><?=isset($_COOKIE['GSNAME']) ?  $_COOKIE['GSNAME'] : ''?></a>
</div>

</div>
</div>