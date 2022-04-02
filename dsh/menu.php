<?php //updated:2020-01-29 20:20:34 menu- v.0.73 - Author:Nikos Drosakis - License: GPL License ?>
<?php //updated:2020-01-01 18:12:01 - v.0.52 - Author:Nikos Drosakis - License: GPL License?>
<?php $colors=array("green","blue","greenyellow","brown");?>
<?php $menulist= $this->db->fl(array('id','title'),'menu'); ?>

    <button class="btn btn-success" id="newmenuBtn" onclick="g.ui.switcher('#newmenuBox','','inline-block')">Create menu</button>
	custom dynamic
	
<!---INSERT AND CREATE menu--->
 <div id="newmenuBox" style="display:none">
    <script type="text/javascript">
    var menu_list=<?php if(!empty($menulist)){echo json_encode($menulist, JSON_UNESCAPED_UNICODE);}?>;
    </script>
    <?php
    //if menu module install then install
    if(isset($_POST['submit_menu'])){
    $title= trim($_POST['title']);
    $children= isset($_POST['children']) ? 1 : 0;
    $query= $this->db->q("INSERT INTO menu (title,children) VALUES(?,?)",array(
        $title,
        $children
    ));
    if($query)redirect(0);
    }
    ?>
    <form method="POST">
       <label><input class="form-control" placeholder="title" name="title"></label>
       <input type="checkbox" placeholder="children" name="children">Children Links	   
    <input class="btn btn-success" type="submit" name="submit_menu">
    </form>
</div>

<!---MANAGE MENU--->
    <h2>Μenus</h2>
<?php 
$orient=array(1=>'horizontal',2=>'vertical');
$status=array(0=>'inactive',1=>'active');
?>
<!---MENU LINKS--->
<?php 
$langprefix=$this->GS['langprefix'];
//if menu module install then install
if(isset($_POST['submit_menu_link'])){
$title= trim($_POST['title'.$langprefix]);
$uri=trim($_POST['uri']);
$menuid=trim($_POST['menuid']);
$query= $this->db->q("INSERT INTO links (menuid,title$langprefix,uri) VALUES(?,?,?)",array($menuid,$title,$uri));
if($query)redirect(0);
}
?>

<?php if(!empty($menulist)){foreach($menulist as $menu =>$menualias){ ?>

<div id="mBox<?=$menu?>">
<button onclick="g.ui.switcher(['#mealias_<?=$menu?>','#malias_<?=$menu?>'],'','inline-block')"  class="glyphicon glyphicon-pencil"></button>
<button class="btn btn-xs btn-danger" style="float:right" id="delmenu<?=$menu?>">X</button>
<label>
   <span id="malias_<?=$menu?>"  style="color:<?=$colors[$menu]?>"><?=$menualias?></span>
   <input id="mealias_<?=$menu?>" style="display:none" value="<?=$menualias?>">   
</label>

   <button id="newlinkbut<?=$menu?>" onclick="g.ui.switcher('#newlinkbox<?=$menu?>')" class="btn btn-success btn-xs">+</button>
<div id="newlinkbox<?=$menu?>" style="display:none">
		<!--main page selection-->
		<select id="newmenuselector<?=$menu?>" class="form-small">
	   
	   <?php 
	   $pagemenus=array(
	   "Home"=>"",
	   "Category"=>"tax",
	   "Static Page"=>implode(',',$this->static_pages),
	   "user"=>"user",
	   "post"=>"post",
	   "login"=>"login",
	   "register"=>"register",
	   "External Link Secure"=>"https://",
	   "External Link"=>"http://"
	   );	   
	   ?>
	   <option value=0>Select</option>
	   <?php foreach($pagemenus as $pagemval=>$pagem){ ?>
	   <option value="<?=$pagem?>"><?=$pagemval?></option>
	   <?php } ?>
	   </select>
	   
	   <!--input of 1st level-->
	   <div style="display: inline-block;">
	   <input class="form-small" id="newmenupage<?=$menu?>" placeholder="URI 1st level" value="">
	   <!--sub selection 1st-->
	   <select  class="form-small" id="subnewmenu1<?=$menu?>" style="display:none">
	   </select>
	   </div>
	   
	   <!--input of 2nd level-->
	   <div style="display: inline-block;">
	   <input class="form-small" id="newmenumode<?=$menu?>" placeholder="URI 2nd level" value="">
	   <!--sub selection 2nd level-->
	   <select  class="form-small" id="subnewmenu2<?=$menu?>" style="display:none">
	   </select>
	   </div>
	    <input class="form-small" id="newmenutitle<?=$menu?>" placeholder="title" value="">
	  <button id="savenewmenu<?=$menu?>" class="btn btn-success">Save</button>
   </div>
<!--------------------------------------
MENU LINKS
------------------------------------>
<?php $sel= $this->db->fa("SELECT * FROM links WHERE menuid=? ORDER BY sort",array($menu));  ?>

   <div id="newlink<?=$menu?>"></div>
   <ul id="list<?=$menu?>" style="width:100%" class="list-group">
      <?php   for($i=0;$i<count($sel);$i++){
         $selid=$sel[$i]['id']; ?>

   <li style="cursor:move" id="nodorder<?=$menu?>_<?=$selid?>" class="list-group-item menuBox<?=$menu?>">
      <button class="glyphicon glyphicon-pencil" id="close<?=$selid?>" onclick="g.ui.switcher(['#read_<?=$menu?><?=$selid?>','#edit_<?=$menu?><?=$selid?>'],'','inline-block')"></button>
	  <span id="menusrt<?=$menu?><?=$selid?>"><?=$sel[$i]['sort']?></span>
      <!---title--->
      <span id="read_<?=$menu?><?=$selid?>">
	  <span id="menuals<?=$menu?>_<?=$selid?>" style="font-weight:bold"><?=$sel[$i]['title'.$langprefix]?></span>
      <span id="menulink<?=$menu?>_<?=$selid?>" style="color:red"><?=$sel[$i]['uri']?></span>
	  </span>
      <span id="edit_<?=$menu?><?=$selid?>" style="display:none">
         <input class="form-small" id="title<?=$langprefix?>_<?=$menu?>_<?=$selid?>" placeholder="title" value="<?=$sel[$i]['title'.$langprefix]?>">                  
         <input class="form-small" id="uri_<?=$menu?>_<?=$selid?>" placeholder="uri" value="<?=$sel[$i]['uri']?>">
      </span>
      <button class="btn btn-xs btn-danger" style="float:right" id="delink_<?=$menu?>_<?=$selid?>">X</button>      
   </li>
      <?php } ?>
   </ul>
</div>
<?php }} ?>

