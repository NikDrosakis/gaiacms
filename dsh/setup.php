<?php //updated:2020-01-29 20:20:34 setup- v.0.73 - Author:Nikos Drosakis - License: GPL License ?>

<?php 
//$list=$this->db->list_tables();
//foreach($list as $db=> $table){
	//xecho($table);
	//$t[$table]=array_combine($this->db->columns($table),$this->db->comments($table));
//}
//file_put_contents("/var/www/gaia/schema.json",json_encode($t,JSON_PRETTY_PRINT));
//xecho($t);
   
define('MAIN_SETUP_EXIST',file_exists(GAIABASE.'gaia.json'));
$gaiajson= jsonget(GAIABASE.'gaia.json');
$tree= $gaiajson['domains'];
$setup=new Setup();
if($this->page!='dsh'){include GAIAROOT."gaiaheader.php";}?>

	<?php 
	if(GS.ROOTSETUP){ ?>
	<script src="/gaia/dsh/setup.js"></script> 
	<link href="https://aimd5.com/apps/bks/style.css" rel="stylesheet" type="text/css">
	<?php } ?>

	<div id="wrapper_inner" style="display:block">
	<div style="height:300px;overflow:hidden">
	<h1 class="shadow1" style="position:absolute;margin: 5% 0% 0% 5%;">GaiaCMS Setup</h1>
	<img style="width:100%" src="https://i.ytimg.com/vi/_XRRSmZH7CM/maxresdefault.jpg">
	</div>
	<div class="topnav" id="myTopnav">
  <a href="/dsh/setup" class="active">Domains</a>
  <a href="/dsh/setup?sub=new">New domain</a>  
  <a href="/dsh/setup?sub=templates">Templates</a>  
  <a href="/dsh/setup?sub=globals">Globals</a>  
  <a href="/dsh/setup?sub=info">Info</a>  
        <a href="javascript:void(0);" class="icon" onclick="myFunction()">
            <i class="fa fa-bars"></i>
        </a>
    </div>
	<input type="hidden" id="current_version" value="<?=file_get_contents(GAIAROOT."version")?>">
<!----------------------------------------------------------------
							INFO
------------------------------------------------------------------>
<?php if($this->sub=="info"){ ?>
<h3>WEBSERVER</h3>
<span id="webserver"><?=$setup->is_webserver()['name'];?></span>
<span id="webserverversion"><?=$setup->is_webserver()['version'];?></span>
<h3 id="system"><?=$setup->is_os()?></h3>
<?php 
$webserver=$setup->is_webserver(); 
$mysqlVersion = shell_exec('mysql --version');
xecho($mysqlVersion);
 
echo $fspace= @disk_free_space("/")/(1024*1024*1024);
echo $mem= $setup->mem()/(1024*1024);
exec ("find ".SITE_ROOT." -type d -exec chmod 0777 {} +");
exec ("find ".SITE_ROOT." -type f -exec chmod 0777 {} +");

xecho($gaiajson['config']);
?>
<div id="version"></div>

<!----------------------------------------------------------------
							GLOBALS
------------------------------------------------------------------>
<?php }elseif($this->sub=="globals"){ ?>
<h3>Globals</h3>

<!----------------------------------------------------------------
							DOMAIN LIST
------------------------------------------------------------------>
<?php }elseif($this->sub==""){ ?>

<?php if(MAIN_SETUP_EXIST){ ?>
<h3>Virtual Hosts installed on this system</h3>
<div id="version"></div>
<table class="TFtable">
<tbody>
<tr class="board_titles">
<th>Domain</th>
<th>Type</th>
<th>DB</th>
</tr>
</tbody>
<?php 
foreach($tree as $dom => $domarray){ ;?>
	<tbody>
	<tr style="<?=SITE==$dom ? "background: yellow":""?>">
	<td><a href="<?=REFERER.$dom?>"><?=$dom?></a></td>
	<td><?=$domarray['type']?></td>
	<td><?=xecho($domarray['dbs'])?></td>
	</tr>
	</tbody>
<?php } ?>
</table>
<script>var tree=<?=$tree;?></script>
<?php }else{ 
xecho("No host installed");
} ?>

<!----------------------------------------------------------------
							TEMPLATES
------------------------------------------------------------------>
<?php }elseif($this->sub=="templates"){ ?>

<h3>Templates installed on this system</h3>

<table class="TFtable">
<tbody>
<tr class="board_titles">
<th>id</th>
<th>img</th>
<th>Template</th>
<th>Local date installed</th>
<th>Local version</th>
<th>Store date installed</th>
<th>Store version</th>
<th>domain</th>
<th>new files rate</th>
<th>changed files rate</th>
<th>sync upload local to store</th>
</tr>
</tbody>
<?php 
foreach($tree as $dom => $domarray){ 
foreach(glob(GAIABASE.$dom."/templates/*") as $template){ 
$name=basename($template);
$PATH=REFERER.$dom."/templates/$name";
$sim=$setup->templates_similar($template,$this->API_TEMPLATESURI);
$version=jsonget("$template/template.json")['version'];
$newver=number_format(floatval($version)+0.01, 2, '.', '');
?>
	<tbody>
	<tr>
	<td>id</td>
	<td><img src="<?="$PATH/screenshot.png"?>" style="width:50px"></td>
	<td><?=$name?></td>
		<td><?=date('Y-m-d H:i',filemtime($template))?></td>
			<td><?=$version?></td>
	
		<td><?=date('Y-m-d H:i',filemtime("/var/www/templates/$name"))?></td>
			<td><?=jsonget("/var/www/templates/$name/template.json")['version']?></td>
	<td><?=$dom?></td>	
	<td><?=$sim['new_files_rate']?></td>
	<td><?=$sim['changed_files_rate']?></td>	
	<td><?php if($sim['new_files_rate']> 0.00 || $sim['changed_files_rate']>0.00){ ?>
	<button version="<?=$newver?>" id="synctemplate_<?=$dom?>_<?=$name?>" class="btn btn-danger">Sync to <?=$newver?></button>
	<?php } ?>
	</td>	
	</tr>
	</tbody>
<?php }} ?>
</table>

<!----------------------------------------------------------------
							NEW DOMAIN
------------------------------------------------------------------>
<?php }elseif($this->sub=="new"){ ?>

<h3>New Installation</h3>
<form id="gaiaform_install" method="POST">
<label>Domain name and folder</label>
<input class="form-control" placeholder="domain name" onkeyup="$('#email').val('webmaster@'+this.value);var dbname='gs_'+this.value.replace(/\./g,'');$('#dbname').val(dbname)"  name="domain_name" id="domain_name" class="sectionSimulate1b">
<input type="hidden" name="type" id="domtype" value="<?=MAIN_SETUP_EXIST ? 'main':'parent'?>">
<input class="form-control" placeholder="ip" name="ip" value="<?=$_SERVER['REMOTE_ADDR']?>">
<input class="form-control" placeholder="superuser" name="suser" value="<?=$_SERVER['USER']?>">		
<input class="form-control" placeholder="email" name="email" id="email" value="">		
<input class="form-control" placeholder="domain folder"  name="domain_folder" value="<?=GAIABASE?>" class="sectionSimulate1b">
<label>Insert Mysql username and password</label>
<input class="form-control" placeholder="db host" name="dbhost" id="dbhost" value="localhost">
<input class="form-control" placeholder="db name" id="dbname" name="dbname" value="">
<input class="form-control" placeholder="db user"  name="dbuser" id="dbuser" value="<?=$_SERVER['USER']?>" class="sectionSimulate1b">
<input class="form-control" placeholder="db password"  name="dbpass" id="dbpass" class="sectionSimulate1b"><br/>
<button class="btn btn-success" id="setup_domain">Start Domain Installation</button>
</form>	
<?php } ?>

</div>


<?php if($this->page!='dsh'){ ?></div></div><?php } ?>