function genTabbis(json, type) {

	var itemPathList = "";
	const buttonName = [];
	const itemName = [];
	var fileCount = 0;

	for (i = 0; i < json.file_list.length; i++) {
		var key = json.file_list[i].object_summary.key;
		console.log(i + ') Key: ' + key);
		if (0 == '/'.localeCompare(key[(key.length - 1)])) {
			console.log('Type: folder');
			nameAry = key.split('/');
			buttonName[key] = nameAry[(nameAry.length - 2)];
			itemPathList += key + ',';
			console.log('name: ' + buttonName[key]);

			//			buttonList[buttonIndex][0] = (key.split('/').length - 1) - 1;
			//			console.log('Level: ' + buttonList[buttonIndex][0]);
		} else {
			console.log('Type: file');
			nameAry = key.split('/');

			if (1 == itemPathList.split(nameAry[(nameAry.length - 2)]).length) {
				buttonName[key] = nameAry[(nameAry.length - 2)];
				itemPathList += key.replace((nameAry[(nameAry.length - 1)]), "") + ',';
			}

			itemName[key] = nameAry[(nameAry.length - 1)];
			console.log('name: ' + itemName[key]);
			++fileCount;
		}
	}
	console.log('Item path list: ' + itemPathList);
	console.log('Total ' + type + ' folder amount: ' + (itemPathList.split(',').length - 1));
	console.log('Total ' + type + ' file amount: ' + fileCount);
	//	
}