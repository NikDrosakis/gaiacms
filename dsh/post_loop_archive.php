<?php //updated:2020-02-03 06:48:33 post_loop_archive- v.0.73 - Author:Nikos Drosakis - License: GPL License ?>

<style>
.tag {
    padding: 8px 30px 2px 10px;
    position: absolute;
    z-index: 200;
    border-top-left-radius: 16px;
    background: #4e4e4e;
    bottom: 0;
    right:0;
}.tag a{color: white;}
.tag2 {
    padding: 5px 5px 5px 5px;
    position: absolute;
    z-index: 200;
    background: #820000;
    color: #ffffff;
    bottom: 0;
    left: 0;
    opacity: 0.5;
}

</style>
<div>
<?php 
$langprefix=$cms->GS['langprefix'];
for ($i=0;$i<count($sel);$i++) {
$postid=$sel[$i]['id'];
		$img=$sel[$i]['img']=='' ? '/gaia/img/myface.jpg': UPLOADS.$sel[$i]['img'];
		$tags= json_decode($sel[$i]['tags'],true);
?>
<div id="nodorder1_<?=$postid?>" class="card">
<button  type="button" class="close" aria-label="delete" id="del<?=$postid?>"><span aria-hidden="true">&times;</span></button>

<div style="float: right;display: inline;width: 56%;">
<span><a href="/dsh/user?uid=<?=$sel[$i]['uid']?>"><?=$sel[$i]['username']?></a></span>
<h3 style="margin-top: 2%;margin-bottom: 2%;">
<a style="color:#000000" href="/<?=$sel[$i]['uri']?>"><?=$sel[$i]['title'.$langprefix]?></a>
<button onclick="location.href='/dsh/post?id=<?=$postid?>'" style="position:absolute" type="button" class="close" aria-label="delete" id="del<?=$postid?>"><span class="glyphicon glyphicon-pencil" aria-hidden="true"></span></button>
</h3>
<div class="excerpt">
<?=$sel[$i]['excerpt']!='' ? strip_tags(html_entity_decode($sel[$i]['excerpt'.$langprefix])) : strip_tags(html_entity_decode($sel[$i]['content']))?>
</div>
</div>

<div style="width: 40%;height: 100%;overflow:hidden;position: relative;">
<img style="float: left;width: auto;height: 100%;position: absolute; top: 50%;
  transform: translate3d(-55%, -50%,0);" id="img<?=$postid?>" src="<?=$img?>">
</div>

<?php if($sel[$i]['taxname'] != null){ ?>
<div class="tag">
<a href="/taxonomy?id=1"><?=$sel[$i]['taxname']?></a>
</div>
<?php } ?>

<div class="tag2"><?=date('Y-m-d',$sel[$i]['modified'])?></div>
</div>
<?php } ?>

</div>