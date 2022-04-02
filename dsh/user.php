<?php //updated:2020-01-29 20:20:34 user- v.0.73 - Author:Nikos Drosakis - License: GPL License ?>

<head><link href="/gaia/lib/editor/summernote.css" rel="stylesheet">
<script src="/gaia/lib/editor/summernote.js"></script>
</head>
<a class="btn btn-success" href="/dsh/user?sub=new">New User</a>

<?php if($this->sub=='superusers'){ ?>
    <a class="btn btn-primary" href="/dsh/user">All users</a>
<?php }else{ ?>
    <a class="btn btn-primary" href="/dsh/user?sub=superusers">Superusers</a>
<?php } ?>

<button class="btn btn-info" id="groups">Usergroups</button>

<div class="post_container">

<?php if($this->uid!=""){ ?>
<!-----------------------------------------------------
                    USER EDIT
------------------------------------------------------>
    <span style="float:left;" onclick="g.ui.goto(['previous','user','id',g.get.uid,'/dsh/user?uid='])" class="next glyphicon glyphicon-chevron-left" aria-hidden="true"></span>
    <span style="float:right" onclick="g.ui.goto(['next','user','id',g.get.uid,'/dsh/user?uid='])" class="next glyphicon glyphicon-chevron-right" aria-hidden="true"></span>

    <?php $sel= $this->db->f("SELECT user.*,usergrp.name as usergrp FROM user
  LEFT JOIN usergrp ON user.grp=usergrp.id
    WHERE user.id=?",array($this->uid));
    ?>
    <div class="pagetitle" id="title"><?=$sel['name']?></div>
	<?php  $cols= $this->db->columns('user'); ?>
    <?=$this->form($this->mode,$cols,false,$sel)?>

<?php }elseif($this->sub=='new'){ ?>
    <!-----------------------------------------------------
                    USER NEW
    ------------------------------------------------------>

    <?=$this->form($this->mode,array('name','firstname','lastname','status','uri','grp'),true);?>

<?php }elseif($this->sub=='' || $this->sub=="superusers"){ ?>
<!-----------------------------------------------------
                    USER LIST
------------------------------------------------------>

    <div id="pagination" class="paginikCon"></div>

            <table class="TFtable"><tbody>
                <tr class="board_titles">
                    <th><button onclick="g.table.orderby(this);" class="orderby" id="order_id">id</button></th>
                    <th>img</th>
                    <th><button onclick="g.table.orderby(this);" class="orderby" id="order_name">name</button></th>
                    <th><button onclick="g.table.orderby(this);" class="orderby" id="order_name">fullname</button></th>
                    <th><button onclick="g.table.orderby(this);" class="orderby" id="order_status">status</button></th>
                    <th><button onclick="g.table.orderby(this);" class="orderby" id="order_uri">uri</button></th>
                    <th><button onclick="g.table.orderby(this);" class="orderby" id="order_usergrpid">usergrp</button></th>
                    <th><button onclick="g.table.orderby(this);" class="orderby" id="order_published">registered</button></th>
                    <th><button onclick="g.table.orderby(this);" class="orderby" id="order_delete">delete</button></th>
                </tr></tbody>
                <?php
                $supQ= $this->GS['sub']=="superusers" ? "WHERE grp > 2":"";
                $sel= $this->db->fa("SELECT user.* FROM user $supQ ORDER BY user.id");
                ?>

                <tbody id="list1" class="group1">
                <?php for($i=0;$i<count($sel);$i++){
                    $userid=$sel[$i]['id'];
                    ?>
                    <tr id="nodorder1_<?=$userid?>" style="cursor:move;">
                        <td id="id<?=$userid?>"><span id="id<?=$userid?>"><?=$userid?></span></td>
                        <td><img id="img<?=$userid?>" src="<?=$sel[$i]['img']!='' ? UPLOADS.'thumbs/'.$sel[$i]['img'] : '/gaia/img/user.png'?>" width="30" height="30"></td>
                        <td><a href="/dsh/user?uid=<?=$sel[$i]['id']?>"><?=$sel[$i]['name']?></a></td>
                        <td><a href="/dsh/user?uid=<?=$sel[$i]['id']?>"><?=$sel[$i]['firstname'].' '.$sel[$i]['lastname']?></a></td>
                        <td id="status<?=$userid?>"><span id="status<?=$userid?>"><?=$this->GS['status'][$sel[$i]['status']]?></span></td>
                        <td><a href="/<?=$sel[$i]['uri']?>"><?=$sel[$i]['uri']?></a></td>
                        <td><?=$this->usergrps[$sel[$i]['grp']]?></td>
                        <td id="published<?=$userid?>"><?=date('Y-m-d H:i',$sel[$i]['registered'])?></td>
                        <td><button id="delete<?=$userid?>" value="<?=$userid?>" title="delete" class="btn btn-default btn-xs" >Delete</button></td>
                    </tr>
                <?php } ?>

                </tbody></table>



<?php }elseif($this->sub=="groups") { ?>
<!---------------------------------------------------------
                            GROUPS
---------------------------------------------------------->
   <!-- <button class="btn btn-info" id="newgroupsbtn">New Usergroup</button>-->
<?php $sel=$this->db->fa("SELECT * FROM usergrp"); ?>
<table class="TFtable">
    <tr class="board_titles">
        <th>id</th>
        <th>name</th>
        <th>permissions</th>
    </tr>
    <tbody>
    <?php for($i=0;$i<count($sel);$i++){ ?>
        <tr>
            <td><?=$sel[$i]['id']?></td>
            <td><?=$sel[$i]['name']?></td>
            <td>
                <?php
                if($sel[$i]['id'] > 1){
                    $perm= json_decode($sel[$i]['permissions'],true);
                    foreach ($this->apages as $page){ ?>
                        <span style="margin-left:2%;margin-right:10px;float: left;"><?=$page?>
                            <input id="per-<?=$sel[$i]['id']?>-<?=$page?>" <?=!empty($perm) && in_array($page,$perm) ? "checked" :""?> type="checkbox" style="float: left;margin-right:4px;" >
</span>
                    <?php }} ?>
            </td>
        </tr>
    <?php } ?>
    </tbody>
</table>
<?php } ?>
</div>