<?php //updated:2020-01-29 20:20:34 templates- v.0.73 - Author:Nikos Drosakis - License: GPL License ?>

<?php
/*function demo($tmp){ return '{
"name":"'.$tmp.'",
"version":1.0,
"summary": "Template details",
"designer": "HTML5 UP",
"developer": "Nikos Drosakis"
}';
}
*/
//$sup=new Setup();
//xecho($setup->is_os()); linux and windows ssh installation with php 

	//$sup=$setup->gaia_install($c,$b);
	//echo $sup ? json_encode("ok") : json_encode($sup);
	

?>
<div id="wrapper_inline">

<div id="installed" style="display:block;padding: 10px">
    <h3>Installed</h3>
	<span id="installed_sum" class="badge badge-danger"><?=count($this->templates);?></span>
    <br/>
<?php    //THE LOOP OF INSTALLED TEMPLATES IN DOMAIN TEMPLATES FOLDER
    foreach ($this->templates as $temp){
        $template= jsonget($this->TEMPLATESURI.$temp.'/template.json');
        ?>
        <div id="box<?=$temp?>" class="box" style="background:#<?=$temp==$this->GS['template'] ?'e7f9e5':'fbedda'?>">
            <span id="activeLabel<?=$temp?>" class="label label-success" style="display:<?=$temp==$this->GS['template']?'inline-block':'none'?>;width: 78%;float: left;margin-right: 2px;">active</span>
            <span class="label label-default" style="float:right">v.<?=$template['version']?></span>

            <div class="title"><?=$template['name']!='' ? $template['name']:$temp?></div>

            <img class="img-thumbnail" style="width: 100%;height: 100px;" src="<?=link_exist(SITE_ROOT."templates/$temp/screenshot.png") ? "/templates/$temp/screenshot.png" : "/gaia/img/templates.png"?>" width="160" height="160">
            <div class="details">
                <div><?=$template['summary']?></div>
                <div>Updated:<?=$template['updated']?></div>
                <div>Permissions:
                    <?php
                    $acceptable_perm=array('0777','0775');
                    echo substr(sprintf('%o', fileperms($this->TEMPLATESURI.$temp)), -4);
                    if (!in_array(substr(sprintf('%o', fileperms($this->TEMPLATESURI.$temp)), -4),$acceptable_perm)){ ?>
                        <button class="btn btn-xs" onclick="g.chmod('<?=$this->TEMPLATESURI.$temp?>','0777');location.reload()" class='red'>Fix</button>
                    <?php }else{ ?>
                        <span class='green'>OK</span>
                    <?php } ?>
                </div>
            </div>
            <div class="buttonBox">
                <a class="btn btn-xs btn-info preview" data="<?=$this->TEMPLATESPATH.$temp?>/index.html">Preview</a>
                <button style="<?=$temp!=$this->template ?'display:inline':'display:none'?>" class="btn btn-xs btn-success" id="binstall<?=$temp?>">Activate</button>
                <button class="btn btn-xs btn-danger" style="display:<?=$temp!=$this->template ?'inline':'none'?>" id="uninstall<?=$temp?>">X</button>
            </div>
        </div>

    <?php } ?>
</div>

<?php 
/*
ok - get the list from couchdb templates for latest versions and template.json saved there

use php form to get copysshfile(template) => to new method

installsshtemplate(template) [add untar to template folder preserving files if exist]
//in UPDATE PROCESS
//JUST REFRESH NEWER FILES    
*/
?>
<div style="display:block;clear:both;padding: 10px;">
    <div class="gs-title" style="margin: 8px;">Αvailable</div>
	<span id="available_sum" class="badge badge-danger"></span
    <br/>
    <div id="templates-available" style="margin: 8px;"></div>
</div>

</div>
