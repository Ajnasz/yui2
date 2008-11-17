<?php
$docroot = ""; //path to distribution's yui root
require("/home/y/share/pear/Yahoo/YUI/loader.php");
//require("/Sites/yahoo/presentation/tools/phploader/loader.php");

//for customizing build path during development:
if(!isset($buildpath)) {
	$buildpath = (isset($_GET['buildpath'])) ? $_GET['buildpath'] : false;
}

//instantiate Loader:
$loader = new YAHOO_util_Loader();
if ($buildpath) {$loader->base = $buildpath;}

//always load YUI Loader, Dom and Event -- this provides the foundation for adding
//additional funcitionality in a flexible way to the site chrome:
$loader->load("yuiloader", "event", "dom");

require("examples/data/examplesInfo.php");
$title = "The Yahoo! User Interface Library (YUI)";
$prepend = "<style type='text/css'>
#components:after {content:'.';visibility:hidden;clear:both;height:0;display:block;}
#components {zoom:1;}
</style>";
include($docroot."inc/header.php");
?>
<div id="yui-main">
	<div class="yui-b">
		<div class="yui-g">

<h1 class="firstContent">Welcome to the Yahoo! User Interface Library (YUI)</h1>

<p>Thanks for downloading the YUI Library of JavaScript and CSS components.  The files you've downloaded contain all of the source code for YUI (in the <a href="build/"><code>/build</code></a> directory) as well as <a href="#examples">functional examples</a> for each component.  They also contain documentation in the form of <a href="docs/index.html">API docs</a>.  <a href="http://developer.yahoo.com/yui/docs/assets/cheatsheets.zip">PDF cheatsheets for most components are available as an external download</a>.</p>

<h3>Getting Started:</h3>
<ol>
  <li><strong>Check out the examples of YUI in action. </strong>We recommend starting with the <a href="examples/event/index.html">Event Utility</a> and <a href="examples/dom/index.html">Dom Collection</a> examples; Event and Dom provide an important foundation for JavaScript developers using YUI. Once you've reviewed those two foundational pieces, go on to explore utilities like <a href="examples/dragdrop/index.html">Drag and Drop</a> and <a href="examples/animation/index.html">Animation</a> or UI controls like <a href="examples/button/index.html">Button</a>, <a href="examples/calendar/index.html">Calendar</a> and <a href="examples/tabview/index.html">TabView</a>. If you're interested in YUI's CSS components, read through the examples for <a href="examples/reset/index.html">Reset</a>, <a href="examples/base/index.html">Base</a>, <a href="examples/fonts/index.html">Fonts</a>, and <a href="examples/grids/index.html">Grids</a> in that order.</li>
  <li><strong>Remember that there are full user's guides</strong> for each component on the <a href="http://developer.yahoo.com/yui/">YUI website</a> (external link). If you have any questions about a component as you play with the examples, check out the component's user's guide or the <a href="docs/index.html">searchable API documentation</a>.</li>
  <li><strong>Remember that you can download <a href="http://developer.yahoo.com/yui/docs/assets/cheatsheets.zip">cheat sheets (external)</a></strong> for most YUI components. These one- or two-page printable PDFs make for a good starting point as you explore the various aspects of YUI. </li>
  <li><strong>Start building.</strong> You can include YUI scripts and CSS from this distribution (in the <code><a href="build/">/build</a></code> directory) or <a href="http://developer.yahoo.com/yui/articles/hosting/">directly from Yahoo! servers</a>. <a href="http://developer.yahoo.com/yui/yuiloader/">The YUI Loader Utility</a> is a client-side loading package that can dynamically pull in YUI scripts as needed, whether from your servers or from ours.</li>
  <li><strong>Become a member of the YUI community.</strong> YUI developers and implementers share thoughts and solutions and provide a helping hand <a href="http://tech.groups.yahoo.com/group/ydn-javascript/">in our forums</a> (external link; requires a Yahoo! ID). YUI developers also contribute to <a href="http://yuiblog.com/">the YUIBlog</a>, where you'll find in-depth articles, videos and other great content about YUI and the world of frontend engineering. </li>
</ol>
<h2 id="examples">YUI Functional Examples Included with This Download:</h2>

<p>Along with the source code for YUI, your download includes <a href="examples/index.html"><?php echo sizeof($examples);?> functional examples and tutorials</a> that demonstrate each component in action.  Use the list below or the menu at left to review these YUI demos &mdash; they're the best way to get oriented to what YUI can do and to grab sample code that can help you get started.  Remember that these examples and more, in addition to user's guides for each YUI component, can also be found on the <a href="http://developer.yahoo.com/yui/">YUI website</a> (external link).  (<strong>Note:</strong> Almost all examples in this distribution will work if you are browsing them from your filesystem, but some examples included here do need to be deployed on a PHP-enabled http server to function properly; if you don't have access to such a setup, just check out those examples <a href="http://developer.yahoo.com/yui/">on our website</a> to see how they work.)</p>

</div>
<!--stacked three-column grid-->
	<div class="yui-gb" id="components">
		<div class="yui-u first">
		<h3>CSS:</h3>
<ul>
<?php
//Going to print out the CSS Modules by hand to enforce the logical ordering:
/*$aUtils = getModulesByType("css",$modules);
foreach($aUtils as $key=>$aUtil) {
	echo "<li><a href='examples/$key/index.html'>".$aUtil[name]."</a></li>\n";
}*/
?>
<li><a href='examples/reset/index.html'>Reset CSS</a></li>
<li><a href='examples/base/index.html'>Base CSS</a></li>
<li><a href='examples/fonts/index.html'>Fonts CSS</a></li>
<li><a href='examples/grids/index.html'>Grids CSS</a></li>
</ul>


		<h3>Developer Tools:</h3>
			<ul>
<?php
$aUtils = getModulesByType("tool",$modules);
foreach($aUtils as $key=>$aUtil) {
	echo "<li><a href='examples/$key/index.html'>".$aUtil[name]."</a></li>\n";
}
?>
			</ul>

		</div>
		<div class="yui-u">
        
        <h3>YUI Core:</h3>
			<ul>
				<li><a href="examples/yahoo/index.html">YAHOO Global Object</a> (including language and environment utilities)</li>
				<li><a href="examples/dom/index.html">Dom Collection</a> (including helper methods for class managment, positioning, and more)</li>
				<li><a href="examples/event/index.html">Event Utility</a> (including support for cross-browser DOM events and Custom Events)</li>
			</ul>

        
		<h3>Utilities:</h3>
			<ul>
<?php
$aUtils = getModulesByType("utility",$modules);
foreach($aUtils as $key=>$aUtil) {
	echo "<li><a href='examples/$key/index.html'>".$aUtil[name]."</a></li>\n";
}
?>
			</ul>
		</div>
		<div class="yui-u">
		  <h3>UI Controls/Widgets:</h3>
		  	<ul>
<?php
$aWidgets = getModulesByType("widget",$modules);
foreach($aWidgets as $key=>$aWidget) {
	echo "<li><a href='examples/$key/index.html'>".$aWidget[name]."</a></li>\n";
}				
?>
			</ul>	
            

		</div>
	</div>

<div class="yui-g">
<h2>More from the YUI Project:</h2>

<p>The YUI Project also includes the YUI Compressor, a safe and powerful server-side JavaScript/CSS minifier.  We use YUI Compressor to pack the YUI Library's <code>-min</code> files, and you can use it on your own files as well.  <a href="http://developer.yahoo.com/yui/compressor/">Check out the YUI Compressor page on the YUI website</a>.</p>
</div>

	</div>
</div>

<?php include ($docroot."inc/side.php"); ?>
<?php include ($docroot."inc/footer.php"); ?>
