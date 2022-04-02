<?php //updated:2020-01-29 20:20:34 home- v.0.73 - Author:Nikos Drosakis - License: GPL License ?>

<script src="/gaia/lib/d3.js" charset="utf-8"></script>
	<div id="dwindow1" class="double_window one">

		<h4><span class="glyphicon glyphicon-<?=$this->icon('stats')?>" aria-hidden="true"></span>AI Multiple Daemon 5 cms- v1.0 (GAIA) Setup</h4>
		<div id="version" style="text-align: center;"></div>
		<div style="margin-top: 10px;">
		<a href="/dsh/templates?sub=<?=$this->template?>"><span class="label label-success"><?=$this->template?></span> template active</a>
		<a href="/dsh/templates"><span class="label label-success"><?=@count($this->templates)?></span> templates installed</a>
		<a href="/dsh/widget"><span class="label label-success"><?=@count($this->widgets)?></span> widgets installed</a>
		<a href="/dsh/menu"><span class="label label-success"><?=@count($this->menus)?></span> menus active</a>
		<a href="/dsh/user"><span class="label label-success"><?=@count($this->users)?></span> users</a>
		<a href="/dsh/user?sub=superusers"><span class="label label-success"><?=@count($this->supusers)?></span> superusers</a>
		<a href="/dsh/user?sub=groups"><span class="label label-success"><?=@count($this->usergrps)?></span> users groups</a>
		<a href="/dsh/page"><span class="label label-success"><?=@count($this->pages)?></span> pages</a>
		<a href="/dsh/post"><span class="label label-success"><?=@count($this->posts)?></span> posts</a>
		<a href="/dsh/post?sub=groups"><span class="label label-success"><?=@count($this->postgrps)?></span> post groups</a>
			<a href="/dsh/taxonomy"><span class="label label-success"><?=@count($this->taxgrps)?></span> taxonomy groups</a>
		<a href="/dsh/apps"><span class="label label-success"><?=@count($this->apps)?></span> apps installed</a>    
		</div>
		
		
	</div>


	<div id="dwindow2" class="double_window two even">
		
	</div>

<div id="dwindow3" class="double_window three">    
  
</div>


<div id="dwindow4" class="double_window four">
    <h4><span class="glyphicon glyphicon-<?=$this->icon('notifications')?>" aria-hidden="true"></span>11 Steps after shell installation</h4>
	<ol>
	<li>Install a template from templates</li>
	<li>Use globs to add globals</li>	
	<li>Create and modify pages in page builder</li>
	<li>Add page variable (varpages)</li>
	<li>Customize and use widgets</li>	
		<!--<li>Update template style with <button class="btn btn-xs" onclick="location.href='/dsh/page'">Page Builder</button></li>-->
	<li>Create new user with <button class="btn btn-xs" id="newusersbtn">New User</button></li>
	<li>Create new post with <button class="btn btn-xs" id="newpostsbtn">New Post</button></li>
	<li>Add Category and Tags or custom taxonomy</li>
	<li>Create menus</li>
	<li>Offer privileges to other registered users</li>
	<li>Create SEO pages</li>
	<li>Share posts</li>	
	</ol>
</div>
