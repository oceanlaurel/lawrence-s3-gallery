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

	tabbisDataTabsArray = tuneTabbisStructure(tabbisDataTabsArray);

console.log('tabbisDataTabsArray: '+tabbisDataTabsArray);
console.log('here');


	for (i = 0; i < tabbisDataTabsArray.length; i++) {
		console.log('Level ' + i + ' folder list: ' + tabbisDataTabsArray[i]);
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
	const isDebug = false;
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
										tabbisDataTabsArray[level] += '<button class="button-tabbis" value="' + itemPathListArray[i] + '"><span>' + currentPathArray[level] + '</span></button>';
										previousButtonName = currentPathArray[level].trim();
									} else {
										tabbisDataTabsArray[level] += '</div><div data-tabs><button class="button-tabbis" value="' + itemPathListArray[i] + '"><span>' + currentPathArray[level] + '</span></button>';
										previousButtonName = currentPathArray[level].trim();
									}
								}
							} else {
								tabbisDataTabsArray[level] = '<div data-tabs><button class="button-tabbis" value="' + itemPathListArray[i] + '"><span>' + currentPathArray[level] + '</span></button>';
								previousButtonName = currentPathArray[level].trim();
							}
						}
					} else {
						if (0 != ''.localeCompare(currentPathArray[0].trim())) {
							foundSubFolderInThisLevel = true;
							if (typeof (tabbisDataTabsArray[0]) != "undefined") {
								if (0 != previousButtonName.localeCompare(currentPathArray[0].trim())) {
									tabbisDataTabsArray[0] += '<button class="button-tabbis" value="' + itemPathListArray[i] + '"><span>' + currentPathArray[0] + '</span></button>';
									previousButtonName = currentPathArray[0].trim();
								}
							} else {
								tabbisDataTabsArray[0] = '<div data-tabs><button class="button-tabbis" value="' + itemPathListArray[i] + '"><span>' + currentPathArray[0] + '</span></button>';
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

function getKeyFromTabbisStructure(dataTabsInDataPanes, buttonIndex) {
	head = 'value="';
	tail = '"><span>';
	let key = dataTabsInDataPanes[buttonIndex].substring(dataTabsInDataPanes[buttonIndex].indexOf(head) + head.length, dataTabsInDataPanes[buttonIndex].indexOf(tail));
	return key;
}

function tuneTabbisStructure(tabbisDataTabsArray) {
	const isDebug = false;
	try {
		for (i = tabbisDataTabsArray.length - 1; i > 0; i--) {
			dataTabsInDataPanes = tabbisDataTabsArray[i].split('</div><div data-tabs>');
			console.log("Current level: " + i);
			for (j = 0; j < dataTabsInDataPanes.length; j++) {
				// Find the 1st key:
				//				head = 'value="';
				//				tail = '"><span>';
				//				let key = dataTabsInDataPanes[j].substring(dataTabsInDataPanes[j].indexOf(head) + head.length, dataTabsInDataPanes[j].indexOf(tail));
				let key = getKeyFromTabbisStructure(dataTabsInDataPanes, j);
				console.log("Current key value: " + key);
				subKeyParts = key.split('/');
				parentFolder = subKeyParts[subKeyParts.length - 3].trim();
				console.log("Current parent folder name: " + parentFolder);
				console.log("Find [[");

				previousLevelDataTabsInDataPanes = tabbisDataTabsArray[i - 1].split('</div><div data-tabs>');
				let bMatched = false;
				for (l = 0; l < previousLevelDataTabsInDataPanes[l].length; l++) {
					console.log("Previous Level Data Tabs In Data Panes [" + l + "]:" + previousLevelDataTabsInDataPanes[l]);

					currentPreviousLevelDataTabsInDataPanes = previousLevelDataTabsInDataPanes[l].split('</button><button ');
					for (k = 0; k < currentPreviousLevelDataTabsInDataPanes.length; k++) {
						let curentBottonkey = getKeyFromTabbisStructure(currentPreviousLevelDataTabsInDataPanes, k);
						subParts = curentBottonkey.split('/');
						currentBottonFolderName = subParts[i - 1].trim();
						console.log("Current key: " + curentBottonkey);
						console.log("Current folder: " + currentBottonFolderName);
						console.log("Current previous level: " + i - 1);
						if (0 != parentFolder.localeCompare(currentBottonFolderName)) {
							// TODO...

						} else {
							console.log("Matched!");

							console.log("Refering current key: " + key);
							console.log("Matched previous level button key: " + curentBottonkey);
							console.log("Matched previous level tabbis index: " + l);
							console.log("Matched previous level button key index: " + k);
							console.log("Current level: " + i + "; Previous level: " + (i - 1));
							console.log("Current level data tabbis index: " + j);

							console.log(" ");
							dataTabsPadding = '<div data-panes>';
							if (0 == j) {
								for (m = 0; m < k; m++) {
									dataTabsPadding += '<div data-tabs>&nbsp;</div>';
								}
								tabbisDataTabsArray[i] = tabbisDataTabsArray[i].replace('<div data-panes>', dataTabsPadding);
							} else {
								// TODO...
							}

							bMatched = true;
							break;
						}
					}

					if (bMatched) break;

					//					for (k = 0; k < previousLevelDataTabsInDataPanes.length; k++) {
					//						let previousLevelKey = getKeyFromTabbisStructure(previousLevelDataTabsInDataPanes, k);
					//						console.log("Previous level key: " + previousLevelKey);
					//						previousLevelSubKeyParts = previousLevelKey.split('/');
					//						previousLevelFolder = previousLevelSubKeyParts[previousLevelSubKeyParts.length - 2].trim();
					//						if (0 != parentFolder.localeCompare(previousLevelFolder)) {
					//							console.log("Previous level target folder: " + previousLevelFolder);
					//
					//							console.log("Current previous level: " + i - 1);
					//						} else {
					//							console.log("Matched!");
					//							break;
					//						}
					//					}

				}
				console.log("]]");

				// todo...
			}
		}
	} catch (err) {
		console.log('Error: ' + err.message);
	}
	return tabbisDataTabsArray;
}

