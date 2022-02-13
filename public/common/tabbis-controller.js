tabbis({
	memory: true
});

function switchTabbisPanel(obj) {

	//	$('#'+obj.id).html(content);

	var url = window.location.href;
	if (url.indexOf('?') > -1) {

		const queryString = window.location.search;
		console.log(queryString);
		const urlParams = new URLSearchParams(queryString);
		const param = urlParams.get('tabselected');

		newurl = url.replace(param, obj.id);
		window.history.replaceState(null, null, newurl);
	} else {
		url += '?tabselected=' + obj.id;
		window.history.replaceState(null, null, url);
	}
	window.location.reload();
};

$(document).ready(function() {
	//window.scrollTo(0, 500);
	const queryString = window.location.search;
	const urlParams = new URLSearchParams(queryString);
	const paramTabSelectedName = 'tabselected';
	const paramTabSelected = urlParams.get(paramTabSelectedName);
	console.log('Parameter: ' + paramTabSelectedName + '; Value: ' + paramTabSelected);

});