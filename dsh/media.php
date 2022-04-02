<?php //updated:2020-01-29 20:20:34 media- v.0.73 - Author:Nikos Drosakis - License: GPL License ?>
<div>
<a class="btn btn-info" href="/dsh/media?sub=groups">Groups</a>
</div>

<div>
<script src='/gaia/lib/jquery.ui.widget.js'></script>
<script src='/gaia/lib/jquery.form.js'></script>
<script src='/gaia/lib/load-image.all.min.js'></script>
<script src='/gaia/lib/canvas-to-blob.min.js'></script>
<script src='/gaia/lib/jquery.fileupload.js'></script>
<script src='/gaia/lib/jquery.fileupload-process.js'></script>
<script src='/gaia/lib/jquery.fileupload-image.js'></script>
<script src='/gaia/lib/jquery.fileupload-audio.js'></script>
<script src='/gaia/lib/jquery.fileupload-video.js'></script>
<script src='/gaia/lib/jquery.fileupload-validate.js'></script>
<link href='/gaia/lib/uploader/css/jquery.fileupload.css' rel="stylesheet" type="text/css" />                
  <div class="imgBox">
  <div id="files" class="files" style=""><img src='/gaia/img/post.jpg' style="height:250px;width: 229px;margin: -21px 0 0 -21px;"></div>
  <span class="btn btn-success btn-sm fileinput-button">
  <i class="glyphicon glyphicon-plus"></i>
  <span>Add file</span>
  <input id="fileupload" type="file" name="files">
  </span>
  <div id="progress" class="progress" style="display:none">
  <div class="progress-bar progress-bar-success"></div>
  </div>
  </div>
</div>
				  
<div style="padding: 10px">
<?php
if($this->sub!="") { ?>
  
  <button class="btn btn-success" id="newobjgrpbtn">New media group</button>
<div id="newobjgrp"></div>

<?php }else{ 
$imgs= $this->db->fa("SELECT * FROM obj WHERE uid=?",array($this->my['GSID']));
if(!empty($imgs)){
for($i=0;$i<count($imgs);$i++){            
?>
        <div class="img-thumbnail" id="photo<?=$imgs[$i]['id']?>" class="img" style="float: left;width: 220px;height:370px;position:relative;margin:3px">
		<button type="button" class="close" aria-label="delete" file="<?=$imgs[$i]['filename']?>" id="del<?=$imgs[$i]['id']?>"><span aria-hidden="true">×</span></button>
            <a class="viewImage" style="width: 220px;height: 370px;overflow: hidden; background-size: cover;" href="<?=UPLOADS.$imgs[$i]['filename']?>">
                <img src="<?=UPLOADS.$imgs[$i]['filename']?>" style="width:200px;overflow:hidden;vertical-align: middle;margin:4px;">
            </a>
            <div style="display:block;line-height: 1.0em;position:relative">                
				<div class="desc">File:<?=$imgs[$i]['filename']?></div>
				
				<div class="desc">Title:
				<input class="form-control input-sm" id="title_<?=$imgs[$i]['id']?>" value="<?=$imgs[$i]['title']?>">
				</div>
				
				<div class="desc">Summary:				
				<textarea class="form-control input-sm" id="summary_<?=$imgs[$i]['id']?>"><?=$imgs[$i]['summary']?></textarea>
				</div>
				
				<div class="desc">Created:<?=date('Y-m-d',$imgs[$i]['created'])?></div>
            </div>
        </div>
    <?php 
	} }else{ ?>
    No images
<?php } ?>
<?php } ?>

</div>