<?php //updated:2020-01-29 20:30:53 global- v.0.73 - Author:Nikos Drosakis - License: GPL License ?>

<!---------@globs------------->    
<div style="padding:8px">
    <h3><span class="glyphicon glyphicon-<?=$this->icon('global')?>" aria-hidden="true"></span> Globals
        <button class="btn btn-success btn-xs" id="newGlobalBtn">+</button>
    </h3>
<!--------NEW Global-------------->

<div id="newglobal" style="font-size:12px;background: antiquewhite;padding: 10px;border: 1px dotted darkred;"></div>
<!--------EDIT Global-------------->
<?php $tags=$this->db->fl(array("tag","id"),"globs"); ?>
    <div class="gs-databox">
    <?php foreach($tags as $tag => $tagcount){ ?>
    <button id="globtitle<?=$tag?>" class="gs-title<?=isset($_COOKIE['globs_tab']) && $_COOKIE['globs_tab']==$tag ? "Active":""?>"><?=$tag?></button>
    <?php } ?>
    </div>

    <?php foreach($tags as $tag => $tagcount){		
    $sel= $this->db->fa("SELECT * FROM globs WHERE tag=?",array($tag)); 
	?>
    <div id="globs_<?=$tag?>"  class="gs-databox-inside" style="display:<?=isset($_COOKIE['globs_tab']) && $_COOKIE['globs_tab']==$tag ?'block':'none'?>">
    <?php for($i=0;$i<count($sel);$i++){  	
	$id=$sel[$i]['id'];
	$type=$sel[$i]['type'];	
	?>
      
	  
	  <div id="setBox<?=$id?>"  class="img-thumbnail" style="float: left;width: 250px;position:relative;margin:3px"><!--class="varbox"-->
	    <button style="float: right;" class="btn btn-xs btn-danger" id="delpvar<?=$id?>">X</button>
		<!--TYPE SELECTION-->	
			<select class="form-small" id="pvartype<?=$id?>">
			<option value="">Select</option>
		<?php foreach($this->globs_types as $typeval){ ?>		
			<option value="<?=$typeval?>" <?=$typeval==$type ? "selected='selected'":''?>><?=$typeval?></option>
			<?php } ?>
		</select>
<!--TEXT/HTML-->		        
		<label class="profile_title"><?=$sel[$i]['name']?>:</label>
				<?php if($type=='textarea' || $type=='html'){ ?>
                    <textarea style="height:150px" class="form-control input-sm" class="lang12" id="set<?=$id?>"><?=urldecode($sel[$i][$this->LOC])?></textarea>
				<?php }elseif($type=='boolean'){ ?>
					<label class="switch">
					<input id="set<?=$id?>" onclick="this.value=this.checked ? 1:0" <?=$sel[$i][$this->LOC]=="1" ? 'checked':''?> type="checkbox">
                    <span class="slider"></span></label>
				<?php }elseif($type=='integer' || $type=='decimal2'){ ?>
				<input class="form-control input-sm" type="number" class="lang12" id="set<?=$id?>" value="<?=$sel[$i][$this->LOC]?>">
				<?php }elseif($type=='read'){ ?>
				<label><?=$sel[$i][$this->LOC]?></label>
				<?php }elseif($type=='color'){ ?>
				<input class="form-control input-sm" type="color" class="lang12" id="set<?=$id?>" value="<?=urldecode($sel[$i][$this->LOC])?>">
		        <!--UPLOAD-->
	<?php }else{ ?>
				<input class="form-control input-sm" class="lang12" id="set<?=$id?>" value="<?=urldecode($sel[$i][$this->LOC])?>">
		<?php } 
	if($type=='img'){ ?>
                    <button class="btn btn-xs" onclick="$('#attachinput<?=$id?>').click();"  class="attach" data-toggle="tooltip">Select Photo</button>
                    <form action="/gaia/gajax.php" onsubmit="g.ui.form.upload.file.submit(this,event,'<?=$id?>')" id="upload<?=$id?>" method="post" enctype="multipart/form-data">
                        <input name="attach_file" onchange="g.ui.form.upload.file.opensubmit(this,'<?=$id?>')" id="attachinput<?=$id?>" type="file" style="display:none">
                        <input type="hidden" name="a" value="obj">
                        <input type="hidden" name="objgroupid" value="4">
                        <input type="hidden" name="id" value="<?=$id?>">
                        <input class="btn btn-xs" type="submit" style="display:none" name="submitUpload" id="submitAttach<?=$id?>" value="Upload" data-toggle="tooltip">
                        </form>
                <a class="viewImage" href="<?=$sel[$i]['en']?>">
                    <div id="imgView<?=$id?>">
                        <img id="img<?=$id?>" class="img-thumbnail" src="<?=!$sel[$i][$this->LOC] ? "/gaia/img/post.jpg": urldecode($sel[$i][$this->LOC])?>" style="max-height:150px;">
                    </div>
                </a>
                <button class="btn btn-xs" onclick="$('#img<?=$id?>').attr('src',$('#set<?=$id?>').val())">Show me</button>
            		
 		<?php } ?>

		</div>
		
		
    <?php }	?>    
    </div>
    <?php }	?>
</div>

<script>
/*updated:2020-01-17 22:43:40 global - v.0.71 - Author:Nikos Drosakis - License: GPL License*/

 g.loadExt('form',function(){
	g.loadJS(g.path.lib+'jquery.form.min.js'); 
 });
        $(document)
            .on("click", "button[id^='globtitle']", function () {
				$(".gs-titleActive").attr('class', 'gs-title')
				this.className="gs-titleActive";
				var id = this.id.replace('globtitle', '');
				$('.gs-databox-inside').hide();
				g.ui.switcher('#globs_'+id,'slide');
				g.cookie.set('globs_tab',id);
			})
            .on("click", "#newGlobalBtn", function () {
                g.loadExt('form',function(){

                if ($('#newglobal').html() == "") {
                    g.ui.form.get({
                        adata: "globs",
                        nature: "new",
                        append: "#newglobal",
                        list: {
                            0: {
                                row: 'name', placeholder: "Global Name",
                                params: "required onkeyup='this.value=g.greeklish(this.value)'"
                            },
                            1: {row: GS.LOC, placeholder: "Global Value"},
                            2: {
                                row: 'tag',
                                type: "drop",
                                global: GS.globs_tags,
                                globalkey: true,
                                placeholder: "Select Tag"
                            },
							3:{
                                row: 'type',
                                type: "drop",
                                global: GS.globs_types,
                                globalkey: true,
                                placeholder: "Select type"
                            }
                        }
                    }, function (res) {
					//	g.l(res)
                      //  location.reload();
                    })
                } else {
                    $('#newglobal').html('');
                }
                })
            })
            //REMOVE
            .on("click", "button[id^='switchSet']", function () {
                var id = this.id.replace('switchSet', '');
                var val = $(this).text() == 'Open' ? 1 : 0;

                g.db.query("UPDATE globs SET status=" + val + " WHERE id=" + id, function (data) {
                    if (data == 'yes') {
                      if (val == 1) {
                            $('#setBox' + id).css('backgroundColor', '#d3ffb1');
                            $('#switchSet' + id).text('Close').removeClass('btn-success').addClass('btn-danger');
                        } else {
                            $('#setBox' + id).css('backgroundColor', '#d8d6d6');
                            $('#switchSet' + id).text('Open').removeClass('btn-danger').addClass('btn-success');
                        }
                    } else {
                        g.alert("Setting cannot be switched!");
                    }
                })
            })	
            //EDIT
            .on("keyup change click keyup", "textarea[id^='set'], input[id^='set']", function () {  
		//	g.l(this.value)			
				var id = this.id.replace('set', '');
                g.db.query('UPDATE globs SET '+GS.LOC+'="' + encodeURIComponent(this.value) + '" WHERE id=' + id);
            })
			.on("click", "button[id^='delpvar']", function () {
                var id = this.id.replace('delpvar', '');
                g.db.query("DELETE FROM globs WHERE id=" + id, function (res) {
                    if (res != 'No') {
                        $('#setBox' + id).remove();
                    }
                })
            })
            .on("change", "select[id^='pvartype']", function () {
                var id = this.id.replace('pvartype', '');
                g.db.query("UPDATE globs SET type='"+this.value+"' WHERE id=" + id, function (res) {
                    if (res == 'yes') {
                        g.alert('true')
                    }
				});
            });
    
	g.varg_switch= function() {
        var phase = g.cookie.get('gs-sidepanel') == 'globalvarsbar' ? 0 : 1;
      //  var mainwindow = phase == 0 ? '92%' : '65%';
        var gvars = phase == 1 ? 'block' : 'none';
      //  $('#main_window').css('width', mainwindow);
        if(phase==1) {g.cookie.set('gs-sidepanel', 'globalvarsbar');}else{g.cookie.delete('gs-sidepanel');}
        $('#board_pvars').css('display', 'none');
       // $('#board_gvars').animate({width:'toggle'},500);
		 g.ui.switcher('#board_gvars');

    }
</script>