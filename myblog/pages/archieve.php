<?php //updated:2020-01-29 20:20:37 archieve- v.0.73 - Author:Nikos Drosakis - License: GPL License ?>

<div id="topbar"><img id="topbar-bg" class="pvar">
    <div id="toptitle">
        <a href="/"><img id="logo" src="/gaia/img/logo.png"> </a>
        <h1 id="top-title" class="pvar"></h1>
        <h2  id="top-subtitle" class="pvar"></h2>
    </div>
</div>

    <div id="sidebar" class="desktop wid">
	<?php //$this->module('sidebarleft'); ?>
    </div>

    <div id="sidebar2" class="desktop">
        <ul style="list-style-type: none;">
            <!-------WIDGET 1--------->
            <li><div id="sidewidget1" class="widget wid"></div></li>

            <!-------WIDGET 2--------->
            <li>
                <div  id="sidewidget2" class="widget wid" style="height: 150px;">

                </div>
            </li>

            <!-------WIDGET 3--------->
            <li>
                <div class="widget wid" id="sidewidget3" style="height: 280px;">

                </div>
            </li>
        </ul>
    </div>

    <div id="main">

        <span style="cursor:pointer" onclick="g.ui.switcher('#menu.mobile')" class="glyphicon glyphicon-menu-hamburger mobile">Documentation</span>

		
        <div id="ele1" class="wid" style="font-size=16px">
		ARCHIEVE
		</div>

</div>

<div id="sidebar2" class="mobile">
    <?php //$this->module('sidebar'); ?>
</div>

<footer>

    <div id="footcol1" class="footcol widget wid"></div>
    <div id="footcol2" class="footcol widget wid"></div>
    <div id="footcol3" class="footcolb widget wid"></div>
    <div id="footcol4" class="footcolc widget wid"></div>
    © Powered By <a href="http://gaiasys.com">Gaiasys</a>.
    All rights reserved.
    Designed and Developed by <a href="">Nikos Drosakis</a> v.<?=$this->is('system-version')?>
</footer>

</div><!------WRAPPER END------>
</div><!------main_window END------>

<script>
   /* $(document).ready(function(){
        var mainh= $('#main').height();
        var sidebar2h=$('#sidebar2').height();
        var sidebarh=$('#sidebar').height();
        if(mainh >sidebar2h && mainh >sidebarh){
            $('#sidebar2').height(mainh);$('#sidebar').height(mainh);
        }else if(sidebar2h >sidebarh && sidebar2h >mainh){
            $('#main').height(sidebar2h);$('#sidebar').height(sidebar2h);
        }else{
            $('#main').height(sidebarh);$('#sidebar2').height(sidebarh);
        }
        var widgets = [];$('.wid').each(function () {widgets.push(this.id);});
        g.l(widgets)
        var pvars = [];$('.pvar').each(function () {pvars.push(this.id);});
        g.l(pvars)
    })
	*/
</script>