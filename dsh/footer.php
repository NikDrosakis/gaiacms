<?php //updated:2020-01-29 20:20:34 footer- v.0.73 - Author:Nikos Drosakis - License: GPL License ?>
<!--updated:2020-01-01 18:12:01 - v.0.52 - Author:Nikos Drosakis - License: GPL License-->
					

					</div>

<?php if($this->mode!='global'){ ?>
<div id="board_gvars" class="gs-sidepanel" style="<?=!empty($_COOKIE['drgb-sidepanel']) ? "width:".$_COOKIE['drgb-sidepanel']."px;":""?>
display:<?=$_COOKIE['gs-sidepanel']=='globalvarsbar' ? 'block':'none'?>">
<div id="dragbar1" class="dragbar" onmousedown="g.ui.draggable(this,event)"></div>
<!--<button style="float:left" class="btn btn-danger btn-xs" onclick="$('#main_window').css('width','100%');$('#board_gvars').animate({width:'toggle'},500);g.cookie.delete('gs-sidepanel');">Close</button>-->
<button style="margin-bottom:10px" class="btn btn-danger btn-xs" onclick="g.ui.switcher('.gs-sidepanel');g.cookie.delete('gs-sidepanel');">X</button>

<?php include GAIAROOT . 'dsh/global.php'; ?>
</div>	
<?php } ?>
					
<!--<script src="/gaia/lib/prism.js"></script>-->
<?php 
$jsfile= "dsh/".($this->GS['mode']!="" ? $this->GS['mode']:'home').".js";
if(file_exists(GAIAROOT.$jsfile)){ 
?>
<script src="<?="/gaia/".$jsfile?>"></script>
<?php } ?>

<?php include GAIAROOT.'dshbar.php';?>
</body>
</html>