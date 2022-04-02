<?php //updated:2020-02-05 05:18:54 widget- v.0.73 - Author:Nikos Drosakis - License: GPL License ?>

<?php 
/* 
update with new json file if not exist
get all widgetized areas - update with PHP DOM parser for finding wid classes and inserting to areas json
*/
?>
<style>
#areas{
	width:50%; float:left;
	     display: inline-block;	
		 		 background: lightgray;	
}
#areas > div{	
	list-style: none;
    margin:2%;		 
    padding: 10px;
    background: antiquewhite;
	
}
.unwid{background: wheat}
#wid{
	width:50%;float: left;
	     display: inline-block;
}
#wid > div{
	width: 33%;float:left;height: 150px;
	list-style: none;
    margin-bottom: 10px;
    padding: 10px;
    background: antiquewhite;	
}
.widheader{background: aliceblue;padding: 5px;font-size: 1.1em;}
.list-group-item{margin-bottom:5px !important}
</style>
<!----------------------------------------------------------------------------------
					WIDGETS <-> WIDGETIZED AREAS 
----------------------------------------------------------------------------------->
<?php 
if($this->sub==""){
$selectedpage=isset($_COOKIE['page_selected']) ? $_COOKIE['page_selected'] : "index";
?>
<h2><?=$this->template?> template
<button class="btn btn-primary" id="savepagejson">Save page json</button>	</h2>
<p>Widgets (Select page and drag & drop widgets to widgetized areas and set details)</p>
<select class="form-control" id="page">
<?php 
$pages=read_folder($this->PAGESURI);
foreach($pages as $page){ 
if(explode('.',$page)[1]=="php"){
?>
	<option value="<?=explode('.',$page)[0]?>" <?=$selectedpage==explode('.',$page)[0] ? "selected='selected'":""?>><?=$page?></option>
<?php }} ?>
</select>

<!--
get saved order from widgets/[widget].json

ok DEBUG MULTIPLE INSTANCES OF SAME WIDGET DO NOT SAVE!!!
ok SIMPLE DRUG AND DROP RETURNS EVERYTHING TO DEFAULT VALUES!!!
ok widget delete from [page].json
ok correct ajax page buffer at methods improving My Methods
ok NEW EDIT WIDGET DEFAULTS
-->
<div id="wid" class="list-group-item nested-1">

<?php 
foreach($this->localwidgets as $wid){
$wid=explode('.',basename($wid))[0];
$widjson= jsonget($this->WIDGETLOCALURI.$wid.'.json');
?>
	<div class="list-group-item local nested-<?=$wid?> wid" id="wid-<?=$wid?>">
        <div class="widheader"><?=$wid?> <a style="color:red" href="/dsh/widget?sub=edit&name=<?=$wid?>">edit</a>
		<span style="float:right">v.<?=$widjson['version']?></span>
		</div>
			<div style="background:antiquewhite;font-size: 12px;">
			<div>Method:<?=$widjson['method']?></div>  			
            <div><label>Defaults</label>
			<div>
			<?=$widjson['where']!="" ? "Criteria: ".$widjson['where']:""?>
			<?=$widjson['wherekey']!="" ? $widjson['wherekey']:""?>
			</div>
			<div><?=$widjson['limit']!="" ? "Limit: ".$widjson['limit']:''?></div>
			<div><?=$widjson['orderby']!="" ? "Orderby: ".$widjson['orderby']:''?></div>
			</div>
			</div>						
    </div>
<?php } ?>

<?php foreach($this->widgets as $wid){
$wid=explode('.',basename($wid))[0];
$widjson= jsonget($this->WIDGETURI.$wid.'.json');
?>
	<div style="background:#ffd9a7" class="list-group-item global nested-<?=$wid?> wid" id="wid-<?=$wid?>">
        <div class="widheader"><?=$wid?> <a style="color:red" href="/dsh/widget?sub=edit&name=<?=$wid?>">edit</a>
		<span style="float:right">v.<?=$widjson['version']?></span>
		</div>
			<div style="background:antiquewhite;font-size: 12px;">
			<div>Method:<?=$widjson['method']?></div>  			
            <div><label>Defaults</label>
			<div>
			<?=$widjson['where']!="" ? "Criteria: ".$widjson['where']:""?>
			<?=$widjson['wherekey']!="" ? $widjson['wherekey']:""?>
			</div>
			<div><?=$widjson['limit']!="" ? "Limit: ".$widjson['limit']:''?></div>
			<div><?=$widjson['orderby']!="" ? "Orderby: ".$widjson['orderby']:''?></div>
			</div>
			</div>						
    </div>
<?php } ?>

<div style="width: 33%;float:left;height: 150px;" class="list-group-item nested-<?=$wid?> wid" id="wid-<?=$wid?>">
<a href="/dsh/widget?sub=new">New widget</a>
</div>
</div>

<?php 
//$pagejsonfile=$this->PAGESURI.$selectedpage.'.json';
$pagejsonfile=$this->template_rootpath.'page.json';
if(!file_exists($pagejsonfile)){ ?>
	<button class="btn btn-primary" id="create_json">create page json</button>	
<?php }else{ ?>
<?php 
//!!! in global pages user,post,tax default and required widget with the same name
//so that uri rules are according to page and widgets.
//type:undraggable means unmoveable ie can only get parameters  to [page].json file 
$pagejsonfile=$this->template_rootpath.'page.json';
$pagejson= jsonget($pagejsonfile);
$areas= $pagejson['areas'];
$order= $pagejson[$selectedpage];
?>
<script>
var areas=<?=json_encode($areas)?>;
var order=<?=json_encode($order)?>;
if(!g.local.get("pageareas_<?=$selectedpage?>")){g.local.set("pageareas_<?=$selectedpage?>",JSON.stringify(areas));}
if(!g.local.get("pageorder_<?=$selectedpage?>")){g.local.set("pageorder_<?=$selectedpage?>",JSON.stringify(order));}
</script>

<div id="areas" class="list-group nested-sortable">
<!--appended loop from localstorage-->
</div>
<?php } ?>
<!---------------------------------------------------------------------------------------
					NEW widget
---------------------------------------------------------------------------------------->
<?php }elseif($this->sub=='new'){ ?>
<h2>New widget <a class="btn btn-primary" href="/dsh/widget">back</a></h2>

    <div class="wid">
	<form id="form-new">
	<input id="name" name="widget"  class="form-control" required onkeyup="this.value=g.greeklish(this.value);$('#file').val(this.value+'.php')" style="display: inline;width:220px;" placeholder="name">
	<div>Version:<input class="form-control" name="version" min="0" step=".1" type="number" placeholder="version" value="1.0"></div>
		<div background="antiquewhite">					
		<label>Headline</label><input class="form-control" name="headline" value="">
		<div><label>Method</label>  		
			<select required name="method" style="display:inline;width: 170px;margin-bottom:0;" class="form-control">
				<option value="">My Method</option>
				<?php foreach($this->mymethods as $meth){ ?>
				<option value="<?=$meth?>"><?=$meth?></option>
				<?php  } ?>
			</select>
		</div>  		
		<div>Where:<input name="wherekey" placeholder="" class="form-control" value=""></div>				
		<div>Where:<input name="where" placeholder="" class="form-control" value=""></div>				
		<div>Limit:<input name="limit" type="number" min="1" placeholder="" class="form-control" value=""></div>				
		<div>Orderby:<input name="orderby" placeholder="" class="form-control" value=""></div>		
		
		<button class="btn btn-info" id="addparam">Add Params</button>		
		<button class="btn btn-success" id="savewid">Save</button>		
		</div>
	</form>
	
	<code contenteditable="true" name="html" id="phpeditor" style="white-space: pre-wrap; overflow-y: scroll; min-height: 300px;color: white;background:black;font-family:Monospace;" class="form-control"></code>
		
	</div>
	<br/>
	<br/>
	<br/>
	
<!---------------------------------------------------------------------------------------
					EDIT widget
---------------------------------------------------------------------------------------->
<?php }elseif($this->sub=='edit' && $this->name!=''){ 
//$owidjson=jsonget($this->SITE_ROOT.'templates/'.$this->template.'/widgets/'.$this->name.'.json');
$iswidgetlocal= file_exists($this->WIDGETLOCALURI.$this->name.'.json') ? true : false;
$owidjson=$iswidgetlocal ? jsonget($this->WIDGETLOCALURI.$this->name.'.json'): jsonget($this->WIDGETURI.$this->name.'.json');
$phpfile=$iswidgetlocal ? $this->WIDGETLOCALURI.$this->name.'.php' : $this->WIDGETURI.$this->name.'.php';
?>
<h2>Edit widget <b><?=$this->name?></b> <a class="btn btn-primary" href="/dsh/widget">back</a></h2>
    <div class="wid">
	<form id="form-new">
	<input value="<?=$this->name?>" id="name" name="widget" class="form-control" required onkeyup="this.value=g.greeklish(this.value);$('#file').val(this.value+'.php')" style="display: inline;width:220px;" placeholder="name">
	<div>Version:<input class="form-control" name="version" min="0" step=".1" type="number" placeholder="version" value="<?=$owidjson['version']!='' ? '1.0':''?>"></div>
			<div background="antiquewhite">
		<label>Headline</label><input class="form-control" name="headline" value="<?=$owidjson['headline']?>">
		<div><label>Method</label>  		
			<select required name="method" style="display:inline;width: 170px;margin-bottom:0;" class="form-control">
				<option value="">My Method</option>
				<?php foreach($this->mymethods as $meth){ ?>
				<option value="<?=$meth?>" <?=$meth==$owidjson['method'] ? "selected='selected'":""?>><?=$meth?></option>
				<?php  } ?>
			</select>
		</div>  		
		<div>Where:<?=$owidjson['wherekey']?>
		<input name="wherekey" type="hidden" value="<?=$owidjson['wherekey']?>">				
		<input name="where" placeholder="<?=$owidjson['wherekey']?>=" class="form-control" value="<?=$owidjson['where']?>">
		</div>				
		<div>Limit:<input name="limit" type="number" min="1" placeholder="" class="form-control" value="<?=$owidjson['limit']?>"></div>				
		<div>Orderby:<input name="orderby" placeholder="" class="form-control" value="<?=$owidjson['orderby']?>"></div>		
		<!--<button class="btn btn-info" id="addparam">Add Params</button>		-->
				
		<button class="btn btn-success" id="savewid">Save</button>		
		</div>
	</form>	
	<code contenteditable="true" id="phpeditor" style="white-space: pre-wrap; overflow-y: scroll; min-height: 300px;color: white;background:black;font-family:Monospace;" class="form-control"><?=file_exists($phpfile) ? htmlentities(file_get_contents($phpfile),ENT_COMPAT, 'UTF-8'):''?></code>	
	</div>
	<br/>
	<br/>
	<br/>
<?php } ?>