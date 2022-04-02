<?php //updated:2020-02-11 12:26:16 widget_loop- v.0.73 - Author:Nikos Drosakis - License: GPL License ?>

<?php //get saved order from pages/[page].json > order
$selectpage=$_POST['page'];
$pagejsonfile=$cms->template_rootpath.'page.json';
$pagejson= jsonget($pagejsonfile);
$areas= $pagejson['areas'];
$order= !empty($_POST['order']) ? json_decode($_POST['order'],true) : $pagejson[$selectpage];
foreach($areas as $area){ 
$area=ltrim($area,"#"); 
?>
<div class="list-group-item nested-1"><?=$area?>
<div id="area-<?=ltrim($area,"#")?>" class="list-group nested-sortable">
<?php 
if(!empty($order)){	
foreach($order as $owid =>$owidjson){ 
if($area==$owidjson['to']){
$widget=explode('.',$owid)[0];
//$widget=$owid;
//$owidjson= jsonget($cms->WIDGETLOCALURI.$owid.'.json');
?>
	<div class="list-group-item nested-<?=$widget?> <?=$owidjson['type']!="undraggable"?"wid":"unwid"?>" id="wid-<?=$area?>-<?=$widget?>">
	<form method="POST" id="form-<?=$widget?>">
	<input type="hidden" name="version" value="<?=$owidjson['version']?>">
	<input type="hidden" name="wherekey" value="<?=$owidjson['wherekey']?>">
	<input type="hidden" name="method" value="<?=$owidjson['method']?>">
	<input type="hidden" name="to" value="<?=$area?>">	
	<div class="widheader"><label><?=$widget?></label>
        <button onclick="event.preventDefault();g.ui.switcher('#subox-<?=$area?><?=$widget?>')" style="float:left;margin-right:20px" class="btn btn-info btn-xs">></button>
        <button style="float:right" class="btn btn-danger btn-xs" id="delwid-<?=$widget?>">X</button>
        <span style="margin-left:20px">v.<?=$owidjson['version']?></span>
    </div>
        <div id="subox-<?=$area?><?=$widget?>" background="antiquewhite" class="subox" style="display:none">
		<label>Headline</label><input class="form-control" name="headline" value="<?=!$owidjson['headline'] ? '':$owidjson['headline']?>">			
		<div>Criteria:	 <?=$owidjson['wherekey']?>	from <?=strtoupper($owidjson['method'])?>
		<?php 
		//selector 
		$wheres=$cms->{str_replace(".","",$where)};
		if(strpos($owidjson['wherekey'],"|")!==false){ 
		$exp=explode('|',$owidjson['wherekey']);
		$selector=$exp[0]; //if ==select
		$values=explode(',',$exp[1]);
		//xecho($values);
		//$wheres=$cms->db->fl($values,$owidjson['method']);
		if($wheres!=false){
		?>
		<select name="where" style="display:inline;width: 170px;margin-bottom:0;" class="form-control">
		<?php 		
		foreach($wheres as $whereval =>$wheretext){ ?>
		<option value="<?=$whereval?>" <?=$whereval==$owidjson['where'] ? "selected='selected'":''?>><?=$wheretext?></option>
		<?php  } ?>
		</select>
		<?php }}else{ ?>		
		<input name="where" class="form-small" value="<?=$owidjson['where']?>">				
		<?php } ?>
		</div>
		<div>Limit:<input name="limit" type="number" min="1" class="form-small" value="<?=$owidjson['limit']?>"></div>				
		<div>Order:<input name="orderby" class="form-small" value="<?=$owidjson['orderby']?>"></div>		
		<button class="btn btn-success btn-xs" id="savewid-<?=$area?>-<?=$widget?>">Save</button>
		</div>
	</form>
	</div>

<?php }}} ?>	

</div>
</div>
<?php } ?>