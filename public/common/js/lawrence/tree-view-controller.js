function genExhibitItems(json, folderKey, type) {
	console.log('genExhibitItems() - Folder Key: ' + folderKey);

	const isDebug = false;

	if (null == json || null == folderKey) {
		return null;
	} else {
		folderKey = folderKey.trim();
	}

	const contentHead = '<div id="exhibit-items"><section class="section"><div class="container"><div class="row"><h3>' + type + ' gallery</h3>'
		+ '<h6>Key: "' + folderKey + '"</h6><ul class="box-container three-cols">';

	const contentTail = '</ul></div></div></div></section></div>';

	var exhibitItems = '';
	var bFileItemFound = false;
	for (i = 0; i < json.file_list.length; i++) {
		var key = json.file_list[i].object_summary.key;
		key = key.trim();
		if (isDebug) console.log(i + ') Key: ' + key);

		if (0 != '/'.localeCompare(key[(key.length - 1)])) {
			// Handle file keys only:
			if (-1 != key.indexOf(folderKey, 0)
				&& key.split('/').length == folderKey.split('/').length) {

				var fileExt = '';
				const filePart = key.split('.');
				if (null != filePart && filePart.length > 1) {
					fileExt = filePart[(filePart.length - 1)];
					fileExt = fileExt.toLowerCase();
				}

				if (0 == 'PHOTO'.localeCompare(type)) {
					const fullURL = galleryRootURL + key;
					exhibitItems += '<li class="box"><div class="inner"><a href="' + fullURL + '" class="glightbox"><img src="' + fullURL
						+ '" alt="image" /></a></div><a href="' + fullURL + '" target="_blank" download>Download &darr;</a>Type: image/' + fileExt + '</li>';

					bFileItemFound = true;
				} else if (0 == 'VIDEO'.localeCompare(type)) {
					const fullURL = galleryRootURL + key;

					var obj = document.createElement('video');
					//					console.log('Can Play video/' + fileExt + ': ' + obj.canPlayType('video/' + fileExt));
					var detectCanPlayResult = obj.canPlayType('video/' + fileExt);
					if (0 == "".localeCompare(detectCanPlayResult)) {
						detectCanPlayResult = "cannot"
					}

					exhibitItems += '<li class="box"><div class="inner"><a href="'
						+ fullURL + '" class="glightbox3"><video width="300" height="200" src="' + fullURL + '" type="video/' + fileExt + '" controls></video>'
						+ '<source src="' + fullURL + '" type="video/' + fileExt + '"></source></a></div><a href="' + fullURL + '" target="_blank" download>Download &darr;</a>Type: video/'
						+ fileExt + '<br /> Your browser can play? ' + detectCanPlayResult + '</li>';

					bFileItemFound = true;
				}
			}
		}
	}

	if (bFileItemFound) {
		return contentHead + exhibitItems + contentTail;
	} else {
		return '<div id="exhibit-items"><h3>No media within this folder!</h3></div>';
	}

}


function getTreeNodeData(videoS3KeylistJson, photoS3KeylistJson) {

	const url = window.location.href;
	if (url.indexOf('?') > -1) {
		const queryString = window.location.search;
		const urlParams = new URLSearchParams(queryString);
		var key = decodeURI(urlParams.get('key'));
		var type = decodeURI(urlParams.get('type'));

		var treeNodeData = null;
		const storageKey = type + '##' + key;
		if (typeof (Storage) !== "undefined") {
			if (null == sessionStorage.getItem(storageKey)) {
				var result = '';

				//?type=PHOTO&key=Photo/Friend%20or%20Other/Friend%20or%20Other-2004%20北京交流團/Friend%20or%20Other-2004%20北京交流團%20Day%203/
				//Photo/Friend or Other/Friend or Other-2004 北京交流團/Friend or Other-2004 北京交流團 Day 3/
				if (null != key && null != type) {
					type = type.trim();
					key = key.trim();
					if (0 == 'PHOTO'.localeCompare(type)) {
						result = genExhibitItems(photoS3KeylistJson, key, 'PHOTO');
					} else if (0 == 'VIDEO'.localeCompare(type)) {
						result = genExhibitItems(videoS3KeylistJson, key, 'VIDEO');
					}
				}

				sessionStorage.setItem(storageKey, result);
				//				sessionStorage.setItem(storageKey, poc);
			}
			treeNodeData = sessionStorage.getItem(storageKey);
		} else {
			treeNodeData = 'poc:' + storageKey;
		}
		document.getElementById("exhibition-hall").innerHTML = treeNodeData;
	}
}

function switchTreeViewPanel(obj, mediaType) {

	var newurl;
	var url = window.location.href;
	var bIsReloadRequired = false;
	if (url.indexOf('?') > -1) {

		const queryString = window.location.search;
		const urlParams = new URLSearchParams(queryString);
		const paramkey = decodeURI(urlParams.get('key'));
		const paramtype = decodeURI(urlParams.get('type'));
		//"KEY=Video/My Sweet Family/My Sweet Family-2017 Featured/"

		if (0 != paramkey.trim().localeCompare((obj.id).replace('KEY=', '').trim())) {
			//			getTreeLeaveLightboxItem(mediaType, obj.id);

			newurl = decodeURI(url).replace(paramkey, (obj.id).replace('KEY=', ''));
			newurl = newurl.replace(('?type=' + paramtype), ('?type=' + mediaType));
			//		newurl = url.replace(param, obj.value);
			window.history.replaceState(null, null, newurl);
			bIsReloadRequired = true;
		}
	} else {
		url += '?type=' + mediaType + '&key=' + (obj.id).replace('KEY=', '');

		const urlParams = new URLSearchParams(url);
		if ((decodeURI(urlParams.get('type'))) === "null") {
			bIsReloadRequired = true;
		}

		window.history.replaceState(null, null, url);
	}

	if (bIsReloadRequired) {
		window.location.reload();
	}

};

$(document).ready(function() {
	//window.scrollTo(0, 500);
	const queryString = window.location.search;
	const urlParams = new URLSearchParams(queryString);

	console.log('Parameters:');

	const type = urlParams.get('type');
	console.log('type=' + type);

	const key = urlParams.get('key');
	console.log('key=' + key);

	if (null != type && null != key) {

		if (0 == 'PHOTO'.localeCompare(type.trim().toUpperCase())) {
			var element = document.getElementById("exhibition-hall");
			element.scrollIntoView();
		} else if (0 == 'VIDEO'.localeCompare(type.trim().toUpperCase())) {
			var element = document.getElementById("exhibition-hall");
			element.scrollIntoView();
		}

	}

});