function genTreeViews(json, type) {
	console.log('genTreeViews() - Type: ' + type);

	const isDebug = false;
	var itemPathList = "";
	const buttonName = [];
	const itemName = [];
	var fileCount = 0;

	for (i = 0; i < json.file_list.length; i++) {
		var key = json.file_list[i].object_summary.key;

		var bIsInIgnoreList = false;
		for (j = 0; j < ignareFolderList.length; j++) {
			if (-1 != key.indexOf(ignareFolderList[j])) {
				bIsInIgnoreList = true;
				break;
			}
		}
		if (bIsInIgnoreList) {
			continue;
		}

		if (isDebug) console.log(i + ') Key: ' + key);
		if (0 == '/'.localeCompare(key[(key.length - 1)])) {
			if (isDebug) console.log('Type: folder');
			nameAry = key.split('/');
			buttonName[key] = nameAry[(nameAry.length - 2)];
			itemPathList += key + ',';
			if (isDebug) console.log('name: ' + buttonName[key]);

		} else {
			if (isDebug) console.log('Type: file');
			nameAry = key.split('/');

			if (1 == itemPathList.split(nameAry[(nameAry.length - 2)] + '/').length) {
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

	if (isDebug) {
		for (i = 0; i < itemPathListArray.length; i++) {
			console.log('itemPathListArray[' + i + ']: ' + itemPathListArray[i]);
		}
	}

	treeView = genTreeViewStructure(itemPathListArray, type);

	return treeView;
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

	const isDebug = false;
	if (isDebug) console.log("genTreeViewStructure:");
	itemPathListArray.sort();

	const valuePrefix = "KEY_";

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
										// treeView[foundAtTreeNumber] += getReserveLabel(currentLiValue, true) + "<li value=\"" + valuePrefix + currentLiValue + "\"><code>" + currentLabel + "</code>" /*+ getReserveLabel(currentLiValue, false)*/;
										treeView[foundAtTreeNumber] += getReserveLabel(currentLiValue, true) + "<li value=\"" + valuePrefix + currentLiValue + "\"><code>"
											+ "<button class=\"tree-view-button\" onclick=\"switchTreeViewPanel(this, '" + figcaption + "')\" id=\"" + valuePrefix + currentLiValue + "\">"
											+ "<span style=\"border: none;\">" + currentLabel + "</span></button></code>";
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
							treeView[treeNumber] = "<figure><figcaption id=\"" + figcaption + "\">" + figcaption + " - " + currentLabel + "</figcaption><ul class=\"tree\">";
							treeView[treeNumber] += "<li value=\"" + valuePrefix + liValue + "\"><code>"
								+ "<button class=\"tree-view-button\" onclick=\"switchTreeViewPanel(this, '" + figcaption + "')\" id=\"" + valuePrefix + liValue + "\">"
								+ "<span style=\"border: none;\">" + currentLabel + "</span></button></code>";
							previousLv1Label = currentLabel;
							foundItemInCurrentLevel = true;
						} else {
							treeView[treeNumber] = "<figure><figcaption id=\"" + figcaption + "\">" + figcaption + " - " + currentLabel + "</figcaption><ul class=\"tree\">";
							treeView[treeNumber] += "<li value=\"" + valuePrefix + liValue + "\"><code>"
								+ "<button class=\"tree-view-button\" onclick=\"switchTreeViewPanel(this, '" + figcaption + "')\" id=\"" + valuePrefix + liValue + "\">"
								+ "<span style=\"border: none;\">" + currentLabel + "</span></button></code>";
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

	const treeViewScrollBoxHead = '<div style="border:1px solid black;height:*;width:*;overflow-y:hidden;overflow-x:scroll;"><p style="width:250%;">';
	const treeViewScrollBoxTail = '</p></div>';
	var fullTreeView = "";
	for (i = 0; i < treeView.length; i++) {
		tunedTree = setTreeViewStructure(treeView[i]) + "[[[TREE]]]";
		if (isDebug) {
			console.log("Tree View[" + i + "]: " + tunedTree);
		}

		fullTreeView += treeViewScrollBoxHead + tunedTree + treeViewScrollBoxTail + "[[[TREE]]]";

	}

	return fullTreeView;
}

function setTreeViewStructure(tree) {
	const valuePrefix = "KEY_";
	const branchSplitSign = "HEAD#";

	treeBranch = tree.split(branchSplitSign);
	for (branchIndex = 1; branchIndex < treeBranch.length; branchIndex++) {
		previousBranchKEY = getKeyFromTreeBranch(treeBranch[branchIndex - 1]);
		previousBranchKEYSubKeys = previousBranchKEY.split("/");
		currentBranchKEY = getKeyFromTreeBranch(treeBranch[branchIndex]);
		currentBranchKEYSubKeys = currentBranchKEY.split("/");

		currentBranchKEY = currentBranchKEY.replace(valuePrefix, "");
		replaceTargetLabel = getReserveLabel(currentBranchKEY, true);
		treeBranch[branchIndex] = branchSplitSign + treeBranch[branchIndex];

		if (previousBranchKEYSubKeys.length == currentBranchKEYSubKeys.length) {
			treeBranch[branchIndex] = treeBranch[branchIndex].replace(replaceTargetLabel, "</li>");
		} else if (previousBranchKEYSubKeys.length < currentBranchKEYSubKeys.length) {
			treeBranch[branchIndex] = treeBranch[branchIndex].replace(replaceTargetLabel, "<ul>");
		} else if (previousBranchKEYSubKeys.length > currentBranchKEYSubKeys.length) {
			downLevelString = "";
			for (downStep = 0; downStep < (previousBranchKEYSubKeys.length - currentBranchKEYSubKeys.length); downStep++) {
				downLevelString += "</li></ul></li>";
			}
			treeBranch[branchIndex] = treeBranch[branchIndex].replace(replaceTargetLabel, downLevelString);
		}
	}

	tree = "";
	for (branchIndex = 0; branchIndex < treeBranch.length; branchIndex++) {
		tree += treeBranch[branchIndex];
	}

	firstBranchKEY = getKeyFromTreeBranch(treeBranch[0]);
	firstBranchKEYSubKeys = firstBranchKEY.split("/");
	lastBranchKEY = getKeyFromTreeBranch(treeBranch[(treeBranch.length - 1)]);
	lastBranchKEYSubKeys = lastBranchKEY.split("/");
	downLevelString = "";
	for (downStep = 0; downStep < (previousBranchKEYSubKeys.length - currentBranchKEYSubKeys.length); downStep++) {
		downLevelString += "</li></ul></li>";
	}
	tree += downLevelString + "</ul></figure>";

	return tree;
}

