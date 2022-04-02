<?php //updated:2020-01-29 20:20:37 archieve- v.0.73 - Author:Nikos Drosakis - License: GPL License ?>
<style>
.card {
	padding: 2%;
	width:100%;
    box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2);
    text-align: center;
    background-color: white;    
    height:150px;
    float: left;
    margin-bottom:2%;
display:block;position:relative
}
.card a{color: #b73333;}
.cardleft{padding: 8px;
    margin: 0 auto;
    line-height: 1.5;}
	/* Remove extra left and right margins, due to padding */

	.card a{color: #b73333;}
.cardleft{padding: 8px;
    margin: 0 auto;
    line-height: 1.5;}
	
.excerpt{
	display: block;
    text-overflow: ellipsis;
	overflow: hidden;
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 6;
    text-align: justify;
	font-size: 1em;
}

.stylebox{
    position: absolute;
    right: 1%;
    top: 1%;
    color:white
}
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
    z-index: 1;
    background: #820000;
    color: #ffffff;
    bottom: 0;
    left: 0;
    opacity: 0.5;
}

</style>
<div>
<h3 class="text-inset"><?=$data['headline']?></h3>
<?php 
for ($i=0;$i<count($res);$i++) {
$postid=$res[$i]['id'];
		$img=$res[$i]['img']=='' ? '/gaia/img/myface.jpg': UPLOADS.'thumbs/'.$res[$i]['img'];
		$tags= json_decode($res[$i]['tags'],true);
?>
<div id="nodorder1_<?=$postid?>" class="card">

<div style="float: right;display: inline;width: 56%;">
<span><a href="/user/<?=$res[$i]['uri']?>"><?=$res[$i]['username']?></a></span>
<h3>
<a style="color:#000000" href="/post/<?=$res[$i]['uri']?>"><?=$res[$i]['title']?></a>
</h3>
<div class="excerpt">
<?=$res[$i]['excerpt']!='' ? strip_tags(html_entity_decode($res[$i]['excerpt'])) : strip_tags(html_entity_decode($res[$i]['content']))?>
</div>
</div>

<div style="width: 40%;height: 100%;overflow:hidden;position: relative;">
<img style="float: left;width: auto;height: 100%;position: absolute; top: 50%;
  transform: translate3d(-55%, -50%,0);" id="img<?=$postid?>" src="<?=$img?>">
</div>

<?php if($res[$i]['taxname']!= null){ ?>
<div class="tag">
<a href="/tax/"><?=$res[$i]['taxname']?></a>
</div>
<?php } ?>

<div class="tag2"><?=date('Y-m-d',$res[$i]['modified'])?></div>
</div>
<?php } ?>

</div>