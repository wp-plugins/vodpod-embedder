<?php
/*
Plugin Name: Vodpod Embedder
Description: Allows browsing of Vodpod collections and embedding from inside Wordpress
Author: Ned Watson
Version: 0.3
Author URI: http://1080d.com/code/vodpod-plugin
*/


if ( is_admin() ){ // admin actions
  add_action( 'admin_menu', 'vodpod_embedder_menu' );
  add_action( 'admin_init', 'register_vodpodsettings' );
} else {
  // non-admin enqueues, actions, and filters
}
//Now the menu will exist on the left.
function vodpod_embedder_menu() {
  add_options_page('Vodpod Options', 'Vodpod', manage_options, 'vodpod_embedder', 'vodpod_embedder_options_page');
}

//Here is where we add our settings.
function register_vodpodsettings() { // whitelist options


	register_setting('vodpod_embedder', 'vodpod_embedder_options', 'vodpod_embedder_validate');
	//And this is our section, named vodpod_options. I've titled it Vodpod Settings. A little confusing I guess.
	//Then we run vodpod_settings_validate to check our input. 
	
	
	//This is the one setting we want to keep track of.
 	//add_settings_section('vodpod_embedder_options', 'Vodpod Settings', '', 'vodpod_embedder');
	
	//This makes the line of text that says API settings. Woo!
 	add_settings_section('vodpod_embedder_main', 'API Settings', 'vodpod_embedder_main_text', 'vodpod_embedder'); 
	//And this is our field where we mess with the API key
 	add_settings_field('vodpod_embedder_api_key', 'Vodpod API Key', 'vodpod_embedder_api_field', 'vodpod_embedder', 'vodpod_embedder_main');
	
}
//Define our options page function.
function vodpod_embedder_options_page() {
	?>
	<div class="wrap">
	<h2>Vodpod Embedder Settings</h2>
	<form method="post" action="options.php">
	<?php 
	settings_fields('vodpod_embedder');
	do_settings_sections('vodpod_embedder');
	//This is very important.
	//
	?>
	<input type="submit" class="button-primary" value="<?php _e('Save Changes') ?>" />
	</form>
	</div>
	<?php
}
//Callback for the section titled vodpod_embedder_main
function vodpod_embedder_main_text() {
	//Useful instructions right here.
	echo "<p>Enter your API Key</p>";
}
//Form input field here.
function vodpod_embedder_api_field() {
	$options = get_option('vodpod_embedder_options', true);
	$api_key = $options['api_key'];
	echo "<input type='text' id='vodpod_embedder_api_key' name='vodpod_embedder_options[api_key]' value='{$options[api_key]}' size='40' />";
}
function vodpod_embedder_validate($input) {
	if(! preg_match('/^[a-z0-9]*$/', $input['api_key'])) {
		$newinput['api_key'] = '';
		}
		else
		{
			$newinput[api_key] = $input[api_key];
		}
	return $newinput;

}
//Woo! This menu section is done.

//So apparently I need this to go in the media tabs.
function vodpod_add_upload_tab($content)
{
	$content["vodpod"] = __("Vodpod");
	return $content;
}
//And this is it's partner. 
add_filter("media_upload_tabs", "vodpod_add_upload_tab"); // will add tab to the modal media box
//This part is really cofusing me right now. I think these guys get build somehow....
//Perhaps it is magic. Either way it has to do with the name above. Magical though.
add_action("media_upload_vodpod", "vodpod_tab");
add_action("media_upload_vodpod_browse", "vodpod_browse_tab");
function vodpod_tab()
{
	$plugin_url = WP_PLUGIN_URL.'/'.str_replace(basename( __FILE__),"",plugin_basename(__FILE__));
	wp_enqueue_style('media');
	wp_enqueue_script('vodpod_js', $plugin_url . '/vodpod.js', array('jquery'));
	wp_enqueue_style('vodpod', $plugin_url . '/vodpod.css');
	wp_iframe('vodpod_media_tab_content');
}
/*
*/
function vodpod_media_tab_content()
{
	media_upload_header(); // will add the tabs menu
	//Grab the vodpod API key.
	$vodpod_options = get_option('vodpod_embedder_options');
	$api_key = $vodpod_options['api_key'];
	if ($api_key == '')
	{
		?>
			<div class="vodpodTab">
				<h3></h3>No API Key</h3>
				<p>Please set your API key in <a href="<?php echo admin_url('options-general.php?page=vodpod_embedder'); ?>" target="_parent">Settings->Vodpod.</a></p>
			</div>
		<?php
	}
	else
	{
		?>
<div id="vodpodEmbedder">
	<script type="text/javascript">
	var vodpod_api_key = '<?php echo esc_attr($api_key); ?>';
	var vurl = 'http://api.vodpod.com/api/';

	var vapi = { "key" : '<?php echo esc_attr($api_key); ?>',
			 	"url" : 'http://api.vodpod.com/api/'
				};
	</script>
	<h3 class="media-title">Embed Videos from VodPod</h3>
	<form name="vodpodForm" type="get" action="">
		<label for="search">Search for</label>
		<input type="text" id="search" name="search"/>
		<label for="type">in:</label>
		<select id="type" name="type">
	  		<option value="pod">Pod</option>
	  		<option value="videos">Videos</option>
	  		<option value="video_id">Video ID</option>
			</select>
		<label for="order">Order By:</label>
		<select id="order" name="order">
	 		<option value="recent">Recent</option>
	  		<option value="views">Views</option>
	  		<option value="weekly">Weekly</option>
	  		<option value="popular">Rating</option>
	  
	<?php
	/*
	  <option value="date-asc">Date ASC</option>
	  <option value="date-desc">Date DESC</option>
	  <option value="views-asc">Views ASC</option>
	  <option value="views-desc">Views DESC</option>
	  <option value="weekly-views-asc">Weekly Views ASC</option>
	  <option value="weekly-views-desc">Weekly Views DESC</option>
	  <option value="rating-asc">Rating ASC</option>
	  <option value="rating-desc">Rating DESC</option>
	  */
	  ?>
		</select>
	<input type="submit" class="button" value="Go"/>
</form>
<div id="vodpodLeft">
<div id="controller">

<div id="total"><h3>Total Videos: <span></span></h3></div>
<div id="pager"><a class="prev" href="#">Prev</a><input value="1" name="current_page" id="current_page"/><a class="next" href="#">Next</a></div>
<label for="per_page">Per page:</label>
<input id="per_page" type="text" name="per_page" value="15"/>
</div>
<div id="output"></div>
</div>
<div id="vodpodRight">
	<div id="playerHolder">
		<div id="player"></div>
	</div>
	<div id="playerControls">

	</div>
	</div>	
</div>	
		<?php
	}
}


/* Shortcode Related */

//Please forgive me for borrowing. I'll attribute awesome very soon.
function expand_vodpod_shortcode($content) {
  $pattern = '/\[vodpod id=(\w+\.\d+).*?fv=(.*?)\]/e';
  $replace = "'<embed height=\"350\" width=\"425\" src=\"http://widgets.vodpod.com/w/video_embed/\\1\" flashvars=\"'.urldecode('\\2').'\" wmode=\"transparent\" allowscriptaccess=\"never\" type=\"application/x-shockwave-flash\"'";
  $newcontent = preg_replace($pattern, $replace, $content);
  return preg_replace('/\[youtube=.*?v=(\w+).*?\]/', '<embed height="350" width="425" wmode="transparent" allowfullscreen="true" type="application/x-shockwave-flash" src="http://www.youtube.com/v/\\1&amp;rel=1&amp;fs=1&amp;showsearch=0"/>', $newcontent);
}	
add_filter('the_content', 'expand_vodpod_shortcode');
/* I have a version of this that uses swfobject which I might include with a toggle. Also need to do the more modern type of shortcode */

?>
