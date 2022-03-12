
//localStorage.setItem("videoLightboxItems", videoLightboxItems);
//var videoLightboxItems = localStorage.getItem("videoLightboxItems");
//if (0 == videoLightboxItems.localeCompare("undefined")) {
//	videoLightboxItems = [];
//} else {
//	alert(videoLightboxItems["KEY=Video/Hobby/"]);
//}
//
//localStorage.setItem("photoLightboxItems", photoLightboxItems);
//var photoLightboxItems = localStorage.getItem("photoLightboxItems");
//if (0 == photoLightboxItems.localeCompare("undefined")) {
//	photoLightboxItems = [];
//} 

//function getTreeLeaveLightboxItem(mediaType, key) {
//	if (0 == "VIDEO".localeCompare(mediaType.toUpperCase().trim())) {
//		videoLightboxItems[key] = key /*videoTreeViews*/;
//		alert(videoLightboxItems[key]);
//	} else if (0 == "PHOTO".localeCompare(mediaType.toUpperCase().trim())) {
//		photoLightboxItems[key] = key /*photoTreeViews*/;
//		alert(photoLightboxItems[key]);
//	}
//}

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
		const queryString = window.location.search;
		const urlParams = new URLSearchParams(queryString);
		if ((decodeURI(urlParams.get('type'))) === "null") {
			bIsReloadRequired = true;
		}

		url += '?type=' + mediaType + '&key=' + (obj.id).replace('KEY=', '');
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
			var element = document.getElementById("photos-section");
			element.scrollIntoView();
		} else if (0 == 'VIDEO'.localeCompare(type.trim().toUpperCase())) {
			var element = document.getElementById("videos-section");
			element.scrollIntoView();
		}
		
	}

});