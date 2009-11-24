jQuery(function($) {
	$('form').submit(function(){ 
	$('#output').html('');
		if ($('#type').val() == 'video_id')
		{
			var params = {"subject" : "video",
			  "action" : "details",
			  "video_id" : $('#search').val()
			  };
			  
			var call = build_call(vapi, params);
			$.getJSON(call.url + call.data, function(json) {
			var id = json['video'].video_id;
		
			var title = json['video'].title;
			var embed_tag = json['video'].embed_tag;
			var var_string = embed_tag.split('flashvars="');
			if (var_string.length == 1)
			{
				flash_vars = '';
			}
			else
			{
				var last = var_string[1].split('"');
				var flash_vars = last[0];
			}
			var text_to_append = "[vodpod id=Groupvideo." + id + "&w=425&h=350&fv=" + flash_vars +"]";
			//alert(item.video.title);
			var thumbnail = json['video'].thumbnails.small;
			$('#output').append("<div class=\"vodpodVideo\" id=\"vodpodVideo" + json['video'].video_id + "\"><h3>" + json['video'].title + "</h3><span class=\"video_id\">" + json['video'].video_id + "</span><span class=\"fv\">" + flash_vars + "</span><img src='" + thumbnail + "' alt='" + json['video'].title + "'/><textarea>" + text_to_append + "</textarea></div>");

			});
		
			bind_videos();
		}
		if ($('#type').val() == 'videos') {
			var params = {"subject" : "video",
				"action" : "search",
				"query" : $('#search').val(),
				"sort" : $('#order').val(),
				"page" : $('#current_page').val(),
				"per_page" : $('#per_page').val()
				};
			var call = build_call(vapi, params);
			$.getJSON(call.url + call.data, function(json) {
				var total = json['videos'].total;
					$('#controller #total span').html("total");
					$.each(json.videos.items, function(i,item) {
					var thumbnail = item.video.thumbnails.small;
					var embed_tag = item.video.embed_tag;
					var var_string = embed_tag.split('flashvars="');
					if (var_string.length == 1)
					{
						flash_vars = '';
					}
					else
					{
						var last = var_string[1].split('"');
						var flash_vars = last[0];
					}
					var src_string = embed_tag.split('src="');
					if (src_string.length == 1)
					{
						
					}
					else
					{
						var last = src_string[1].split('"');
						var src = last[0];
					}
					var video_id = item.video.video_id.replace('Video.', '');
					var text_to_append = "[vodpod id=Groupvideo." + video_id + "&w=425&h=350&fv=" + flash_vars +"]";
					//alert(item.video.title);
					$('#output').append("<div class=\"vodpodVideo\" id=\"vodpodVideo" + video_id + "\"><h3 class=\"video_title\">" + item.video.title + "</h3><span class=\"video_id\">" + video_id + "</span><span class=\"num_collectors\">" + item.video.num_collectors + "</span><span class=\"fv\">" + flash_vars + "</span><span class=\"flash_src\">" + src + "</span><img src='" + thumbnail + "' alt='" + item.video.title + "'/><textarea>" + text_to_append + "</textarea></div>");
				});
				
			bind_videos();
			});
		}
		if ($('#type').val() == 'pod')
		{
			var params = {"subject" : "pod",
				"action" : "videos",
				"pod_id" : $('#search').val(),
				"sort" : $('#order').val(),
				"page" : $('#current_page').val(),
				"per_page" : $('#per_page').val()
				}
			var call = build_call(vapi, params);
			$.getJSON(call.url + call.data, function(json) {
				var total = json['videos'].total;
				$('#controller #total span').html(total);
					
					$.each(json.videos.items, function(i,item) {
					var thumbnail = item.video.thumbnails.small;
					var embed_tag = item.video.embed_tag;
					var var_string = embed_tag.split('flashvars="');
					if (var_string.length == 1)
					{
						flash_vars = '';
					}
					else
					{
						var last = var_string[1].split('"');
						var flash_vars = last[0];
					}
					var src_string = embed_tag.split('src="');
					if (src_string.length == 1)
					{
						
					}
					else
					{
						var last = src_string[1].split('"');
						var src = last[0];
					}
					var text_to_append = "[vodpod id=Groupvideo." + item.video.video_id + "&w=425&h=350&fv=" + flash_vars +"]";
					//alert(item.video.title);
					$('#output').append("<div class=\"vodpodVideo\" id=\"vodpodVideo" + item.video.video_id + "\"><h3 class=\"video_title\">" + item.video.title + "</h3><span class=\"video_id\">" + item.video.video_id + "</span><span class=\"fv\">" + flash_vars + "</span><span class=\"flash_src\">" + src + "</span><img src='" + thumbnail + "' alt='" + item.video.title + "'/><textarea>" + text_to_append + "</textarea></div>");
				});
				bind_videos();
			});
		}
		return false;
	});
	$('#search').keypress(function(e) {
		if (e.keyCode == 13)
		{
			$('form').submit();
			return false;
		}
	});
});
function build_call(api, params)
{
	var call = {"url" : api.url + params.subject + '/' + params.action + '.js',
				"data" : '?api_key=' + api.key
				};
			if (params.pod_id != undefined)
			{
				call['data'] += '&pod_id=' + params.pod_id;
			}
			if (params.video_id != undefined)
			{
				call['data'] += '&video_id=' + params.video_id;
			}
			if (params.query != undefined)
			{
				call['data'] += '&query=' + params.query;
			}
			if (params.sort != undefined)
			{
				call['data'] += '&sort=' + params.sort;
			}
			if (params.page != undefined)
			{
				call['data'] += '&page=' + params.page;
			}
			if (params.per_page != undefined)
			{
				call['data'] += '&per_page=' + params.per_page;
			}
			call['data'] += '&callback=?';
	return call;
}
function bind_videos()
{
	jQuery('.vodpodVideo img').click(function()
	{
		var video_id = jQuery(this).siblings('.video_id').html();
		var shortcode = jQuery(this).siblings('textarea').val();
		var fv = jQuery(this).siblings('.fv').html();
		var flash_src = jQuery(this).siblings('.flash_src').html();
		if (fv != '')
		{
			swfobject.embedSWF("http://widgets.vodpod.com/w/video_embed/Groupvideo." + video_id, "player", "240", "160", "9.0.0", "", fv);	
		}
		else if (flash_src != '')
		{
			swfobject.embedSWF(flash_src, "player", "240", "160", "9.0.0", "", fv);	
		}
		var html = '<div id="currentVideoInfo"><h2 class="video_title">' + jQuery(this).siblings('.video_title').html() + '</h2></div>';
		jQuery('#playerControls').html(html + '<input type="submit" value="Insert into Post" id="addVodpod" class="button" name="insertToVodpodButton"/>');
		jQuery('#addVodpod').unbind("click");
		jQuery('#addVodpod').bind("click", function() {
			jQuery('#playerControls').append('<span class="notification">Added</a>');
			var win = window.dialogArguments || opener || parent || top;
			win.send_to_editor(shortcode);

		});
	});
	jQuery('#pager .next').unbind("click");
	jQuery('#pager .next').bind("click", function() {
		var current_page = parseInt(jQuery('#current_page').val());
		jQuery('#current_page').val(current_page + 1);
		jQuery('form').submit();
	});
	jQuery('#pager .prev').unbind("click");
	jQuery('#pager .prev').bind("click", function() {
		var current_page = parseInt(jQuery('#current_page').val());
		jQuery('#current_page').val(current_page - 1);
		if (parseInt(jQuery('#current_page').val()) < 1)
		{
			jQuery('#current_page').val(1);
		}
		else
		{
			jQuery('form').submit();
		}
	});
	jQuery('#pager #current_page').unbind("keypress");
	jQuery('#pager #current_page').bind("keypress", function(e) {
		if (e.keyCode == 13)
		{
			jQuery('#form').submit();
			return false;
		}
	});
	jQuery('#pager #current_page').unbind("keyup");
	jQuery('#pager #current_page').bind("keyup", function(e) {
		if ((e.keyCode == 38) || (e.keyCode == 39))
		{
			jQuery('#pager .next').click();
		}
		if ((e.keyCode == 37) || (e.keyCode == 40))
		{
			jQuery('#pager .prev').click();
		}
	});
}