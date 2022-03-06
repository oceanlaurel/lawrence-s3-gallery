function genTreeViews(json, type) {

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

//	if (isDebug) {
		for (i = 0; i < itemPathListArray.length; i++) {
			console.log('itemPathListArray[' + i + ']: ' + itemPathListArray[i]);
		}
//	}

	treeView = genTreeViewStructure(itemPathListArray, "Videos");

	return treeView;
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

function getReserveLabel(value, isHead) {
	if (typeof (value) != "undefined") {
		value = value.trim();
		if (isHead) {
			return "HEAD#[[#" + value + "#]]#;";
		} else {
			return "TAIL#[[#" + value + "#]]#;";
		}
	} else {
		return "";
	}
}

function getKeyFromTreeBranch(treeViewBranch) {
	head = '<li value="';
	tail = '"><code>';
	let key = treeViewBranch.substring(treeViewBranch.indexOf(head) + head.length, treeViewBranch.indexOf(tail));
	return key;
}

function genTreeViewStructure(itemPathListArray, figcaption) {

	console.log("genTreeViewStructure:");
	itemPathListArray.sort();

	const valuePrefix = "KEY=";

	var treeNumber = 0;
	var treeView = [];
	var foundItemInCurrentLevel = false;
	var bIsInitialTrees = true;
	previousLv1Label = "";

	var temp = 0;

	do {
		foundItemInCurrentLevel = false;
		for (i = 0; i < itemPathListArray.length; i++) {
			currentKEY = itemPathListArray[i];
			currentKEYSubKeys = currentKEY.split("/");
			if (2 < currentKEYSubKeys.length) {
				if (!bIsInitialTrees) {

					if (0 == "Video/Relative-WONG/Relative-WONG-2019/".localeCompare(currentKEY)) {
						console.log("Debug");
					}

					if (3 < currentKEYSubKeys.length) {
						foundItemInCurrentLevel = false;
						//						var level = 2;
						for (level = 2; level <= currentKEYSubKeys.length - 2; level++) {
							currentLabel = currentKEYSubKeys[level];
							currentLiValue = "";
							currentLiPreviousValue = "";
							for (j = 0; j <= level; j++) {
								currentLiValue += currentKEYSubKeys[j] + "/";
								if (j < level) {
									currentLiPreviousValue += currentKEYSubKeys[j] + "/";
								}
							}
							// Found treeview with matched parent value:
							var foundAtTreeNumber = -1;
							for (j = 0; j < treeView.length; j++) {
								if (-1 != treeView[j].indexOf((valuePrefix + currentLiPreviousValue), 0)) {
									foundAtTreeNumber = j;
									break;
								}
							}
							// Construct this key into matched tree view:
							if (-1 < foundAtTreeNumber) {
								try {
									if (-1 == treeView[j].indexOf((valuePrefix + currentLiValue), 0)) {
										treeView[foundAtTreeNumber] += getReserveLabel(currentLiValue, true) + "<li value=\"" + valuePrefix + currentLiValue + "\"><code>" + currentLabel + "</code>" + getReserveLabel(currentLiValue, false);
									}
								} catch (err) {
									console.log(err);
									break;
								}
								foundItemInCurrentLevel = true;

							}
						}
					} else {
						// Do nothing
					}
				} else {
					currentLabel = currentKEYSubKeys[1];
					if (0 != previousLv1Label.localeCompare(currentLabel)) {
						// Build a new tree:
						liValue = currentKEYSubKeys[0] + "/" + currentKEYSubKeys[1] + "/";
						if (typeof (treeView[treeNumber]) != "undefined") {
							treeNumber++;
							treeView[treeNumber] = "<figure><figcaption>" + figcaption + " - " + currentLabel + "</figcaption><ul class=\"tree\">";
							treeView[treeNumber] += "<li value=\"" + valuePrefix + liValue + "\"><code>" + currentLabel + "</code>";
							previousLv1Label = currentLabel;
							foundItemInCurrentLevel = true;
						} else {
							treeView[treeNumber] = "<figure><figcaption>" + figcaption + " - " + currentLabel + "</figcaption><ul class=\"tree\">";
							treeView[treeNumber] += "<li value=\"" + valuePrefix + liValue + "\"><code>" + currentLabel + "</code>";
							previousLv1Label = currentLabel;
							foundItemInCurrentLevel = true;
						}
					} else {
						// Do nothing
					}
				}
			}
		}
		if (!bIsInitialTrees) {
			foundItemInCurrentLevel = false;
		}
		bIsInitialTrees = false;

		temp++;

	} while (foundItemInCurrentLevel && temp < 100);

	var fullTreeView = "";
	for (i = 0; i < treeView.length; i++) {
		console.log("treeView[" + i + "]: " + treeView[i]);
		fullTreeView += setTreeViewStructure(treeView[i]) + "[[[TREE]]]";
	}
	
	return fullTreeView;	
}

function setTreeViewStructure(tree) {
	treeBranch = tree.split("HEAD#");
	for (branchIndex = 1; branchIndex < treeBranch.length; branchIndex++) {
//			
	}
	return tree;
} 

