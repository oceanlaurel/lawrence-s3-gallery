function genTabbis(json, type) {

	const isDebug = false;
	var itemPathList = "";
	const buttonName = [];
	const itemName = [];
	var fileCount = 0;

	for (i = 0; i < json.file_list.length; i++) {
		var key = json.file_list[i].object_summary.key;
		if (isDebug) console.log(i + ') Key: ' + key);
		if (0 == '/'.localeCompare(key[(key.length - 1)])) {
			if (isDebug) console.log('Type: folder');
			nameAry = key.split('/');
			buttonName[key] = nameAry[(nameAry.length - 2)];
			itemPathList += key + ',';
			if (isDebug) console.log('name: ' + buttonName[key]);

			//			buttonList[buttonIndex][0] = (key.split('/').length - 1) - 1;
			//			console.log('Level: ' + buttonList[buttonIndex][0]);
		} else {
			if (isDebug) console.log('Type: file');
			nameAry = key.split('/');

			if (1 == itemPathList.split(nameAry[(nameAry.length - 2)]).length) {
				buttonName[key] = nameAry[(nameAry.length - 2)];
				itemPathList += key.replace((nameAry[(nameAry.length - 1)]), "") + ',';
			}

			itemName[key] = nameAry[(nameAry.length - 1)];
			if (isDebug) console.log('name: ' + itemName[key]);
			++fileCount;
		}
	}
	if (isDebug) console.log('Item path list: ' + itemPathList);
	const itemPathListArray = itemPathList.split(',');
	if (isDebug) {
		console.log('Total ' + type + ' folder amount: ' + (itemPathListArray.length - 1));
		console.log('Total ' + type + ' file amount: ' + fileCount);
	}
	tabbisDataTabsArray = getTabbisStructure(itemPathListArray);

	if (isDebug) {
		for (i = 0; i < tabbisDataTabsArray.length; i++) {
			console.log('Level ' + i + ' folder list: ' + tabbisDataTabsArray[i]);
		}
	}

	tabbis = '';
	for (i = 0; i < tabbisDataTabsArray.length; i++) {
		tabbis += tabbisDataTabsArray[i];
	}

	return tabbis;
}

String.prototype.replaceLast = function(search, replace) {
	try {
		return this.replace(new RegExp(search + "([^" + search + "]*)$"), replace + "$1");
	} catch (err) {
		console.log('String.prototype.replaceLast - Error: ');
		console.log('Error message: ' + err.message);
		console.log('Parameter - search: ' + search);
		console.log('Parameter - replace: ' + replace);
		throw 'String.prototype.replaceLast - Error: ' + err.message;
	}
}

function getTabbisStructure(itemPathListArray) {
	const isDebug = true;
	const tabbisDataTabsArray = [];
	const itemPathListArrayLength = itemPathListArray.length;

	var level = 0;
	try {
		do {
			var previousButtonName = '';
			for (i = 0; i < itemPathListArrayLength - 1; i++) {
				foundSubFolderInThisLevel = false;
				const currentPathArray = itemPathListArray[i].split('/');
				if (typeof (currentPathArray[level]) != "undefined") {
					if (0 < level) {
						if (0 != ''.localeCompare(currentPathArray[level].trim())) {
							foundSubFolderInThisLevel = true;

							if (typeof (tabbisDataTabsArray[level]) != "undefined") {
								if (0 != previousButtonName.localeCompare(currentPathArray[level].trim())) {
									const previousPathArray = itemPathListArray[i - 1].split('/');
									previousPathPreviousLevelFolderName = previousPathArray[level - 1].trim();
									currentPathPreviousLevelFolderName = currentPathArray[level - 1].trim();
									if ((0 == previousPathPreviousLevelFolderName.localeCompare(currentPathPreviousLevelFolderName))
										&& 0 != ''.localeCompare(previousPathArray[level].trim())) {
										tabbisDataTabsArray[level] += '<button class="button-tabbis"><span>' + currentPathArray[level] + '</span></button>';
										previousButtonName = currentPathArray[level].trim();
									} else {
										tabbisDataTabsArray[level] += '</div><div data-tabs><button class="button-tabbis"><span>' + currentPathArray[level] + '</span></button>';
										previousButtonName = currentPathArray[level].trim();
									}
								}
							} else {
								tabbisDataTabsArray[level] = '<div data-tabs><button class="button-tabbis"><span>' + currentPathArray[level] + '</span></button>';
								previousButtonName = currentPathArray[level].trim();
							}
						}
					} else {
						if (0 != ''.localeCompare(currentPathArray[0].trim())) {
							foundSubFolderInThisLevel = true;
							if (typeof (tabbisDataTabsArray[0]) != "undefined") {
								if (0 != previousButtonName.localeCompare(currentPathArray[0].trim())) {
									tabbisDataTabsArray[0] += '<button class="button-tabbis"><span>' + currentPathArray[0] + '</span></button>';
									previousButtonName = currentPathArray[0].trim();
								}
							} else {
								tabbisDataTabsArray[0] = '<div data-tabs><button class="button-tabbis"><span>' + currentPathArray[0] + '</span></button>';
								previousButtonName = currentPathArray[level].trim();
							}
						}
					}
				}
			}
			if (typeof (tabbisDataTabsArray[level]) != "undefined") {
				tabbisDataTabsArray[level] += '</div>';
			}
			level++;
		} while (foundSubFolderInThisLevel);
	} catch (err) {
		console.log('Error: ' + err.message);
	}

	for (i = 1; i < tabbisDataTabsArray.length; i++) {
		tabbisDataTabsArray[i] = '<div data-panes>' + tabbisDataTabsArray[i] + '</div>';
	}

	if (isDebug) {
		console.log('Deepest sub-folder level: ' + tabbisDataTabsArray.length);
		for (i = 0; i < tabbisDataTabsArray.length; i++) {
			console.log('Level ' + i + ' folder list: ' + tabbisDataTabsArray[i]);
		}
	}

	return tabbisDataTabsArray;
}


