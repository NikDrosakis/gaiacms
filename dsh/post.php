<?php //updated:2020-01-29 20:20:34 post- v.0.73 - Author:Nikos Drosakis - License: GPL License ?>
<!--updated:2020-01-01 18:12:01 - v.0.52 - Author:Nikos Drosakis - License: GPL License-->
<head><link href="/gaia/lib/editor/summernote.css" rel="stylesheet">
<script src="/gaia/lib/editor/summernote.js"></script>
</head>
<div class="post_container">
<?php if($this->sub!='new'){ ?>
<a href="/dsh/post?sub=new" class="btn btn-success" >New Post</button>
<?php } ?>
<a href="/dsh/post?sub=groups" class="btn btn-info" id="groups">Postgroups</a>

<?php $cols= $this->db->columns('post'); ?>
<?php if($this->id!=""){ ?>
    <!------------------------------------------------------
                        POST EDIT
    -------------------------------------------------------->
    <span style="float:left;" onclick="g.ui.goto(['previous','post','id',g.get.id,'/dsh/post?id='])" class="next glyphicon glyphicon-chevron-left" aria-hidden="true"></span>
    <span style="float:right" onclick="g.ui.goto(['next','post','id',g.get.id,'/dsh/post?id='])" class="next glyphicon glyphicon-chevron-right" aria-hidden="true"></span>

    <?php
    $sel= $this->db->f("SELECT post.*,tax.name as taxname,user.name as username FROM post
    LEFT JOIN user ON post.uid=user.id
    LEFT JOIN tax ON post.taxid=tax.id  
    WHERE post.id=?
    ORDER BY post.sort",array($this->GS['id']));
    ?>
    <div id="title" class="pagetitle"><?=$sel['title']?>
	<a style="float:right;font-size:small" target="_blank" href="/<?=$sel['uri']?>" class="pagetitle">Public view</a>
	</div>
    

    <div class="subbox">
        <?php include GAIAROOT.'dsh/taxpanel.php'; ?>
    </div>

    <?php
    //create edit post form
    echo $this->form($this->mode,$cols,false,$sel);
    ?>


<?php }elseif($this->sub=='groups'){ ?>

    <button class="btn btn-info" id="newgroupsbtn">New Post Group</button>

<?php }elseif($this->sub=='new'){ ?>
<!-----------------------------------------------------
                POST NEW
------------------------------------------------------>

        <?php
        //create new post form
        echo $this->form($this->mode,array('title','titlegr','uri','subtitle','subtitlegr','status','sort','excerpt','content','excerptgr','contentgr','html1','html2','html3'),true);
        ?>
		<br/>
		<br/>

<?php }elseif($this->sub=='' || in_array($this->sub,$this->tax_uri)){ ?>
    <!-----------------------------------------------------
                    POST LIST
    ------------------------------------------------------>
<div class="stylebox">
       <button type="button" class="btn btn-<?=$_COOKIE['list_style']=='boxy' ? 'success':'info'?>" onclick="g.cookie.set('list_style','archieve');location.reload()">Archieve Style</button>
        <button type="button" class="btn btn-<?=$_COOKIE['list_style']=='table' ? 'success':'info'?>" onclick="g.cookie.set('list_style','table');location.reload()">Table Style</button>
    </div>
<div class="flag_books" id="count_post"></div>	
<div id="pagination" class="paginikCon"></div>
<div id="post">
<!--APPEND BOXY OR ARCHIVE STYLE-->
</div>

<?php } ?>

</div>