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

function getKeyFromTreeItem(treeViewItems, itemIndex) {
	head = '<li value="';
	tail = '"><code>';
	let key = treeViewItems[itemIndex].substring(treeViewItems[itemIndex].indexOf(head) + head.length, treeViewItems[itemIndex].indexOf(tail));
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
		console.log("treeView[:" + i + "]: " + treeView[i]);
		fullTreeView += treeView[i] + "[[[TREE]]]";
	}
	
	return fullTreeView;

	//Video/Friend or Other/Friend or Other-2003/
	/*
	treeView[:0]: <figure><figcaption>Videos: - Friend or Other</figcaption><ul class="tree"><li value="Video/Friend or Other/"><code>Friend or Other</code>
tabbis-initializer.js:148 treeView[:1]: <figure><figcaption>Videos: - Hobby</figcaption><ul class="tree"><li value="Video/Hobby/"><code>Hobby</code>
tabbis-initializer.js:148 treeView[:2]: <figure><figcaption>Videos: - Lawrence</figcaption><ul class="tree"><li value="Video/Lawrence/"><code>Lawrence</code>
tabbis-initializer.js:148 treeView[:3]: <figure><figcaption>Videos: - My Sweet Family</figcaption><ul class="tree"><li value="Video/My Sweet Family/"><code>My Sweet Family</code>
tabbis-initializer.js:148 treeView[:4]: <figure><figcaption>Videos: - Relative-HO</figcaption><ul class="tree"><li value="Video/Relative-HO/"><code>Relative-HO</code>
tabbis-initializer.js:148 treeView[:5]: <figure><figcaption>Videos: - Relative-WONG</figcaption><ul class="tree"><li value="Video/Relative-WONG/"><code>Relative-WONG</code>
	
	Video/
	tabbis-initializer.js:110 Video/Friend or Other/
	tabbis-initializer.js:110 Video/Friend or Other/Friend or Other-2003/
	tabbis-initializer.js:110 Video/Friend or Other/Friend or Other-2004 北京交流團/Friend or Other-2004 北京交流團 Day 1/
	tabbis-initializer.js:110 Video/Friend or Other/Friend or Other-2004 北京交流團/Friend or Other-2004 北京交流團 Day 2/
	tabbis-initializer.js:110 Video/Friend or Other/Friend or Other-2004 北京交流團/Friend or Other-2004 北京交流團 Day 3/
	tabbis-initializer.js:110 Video/Friend or Other/Friend or Other-2004 北京交流團/Friend or Other-2004 北京交流團 Day 4/
	tabbis-initializer.js:110 Video/Friend or Other/Friend or Other-2004 北京交流團/Friend or Other-2004 北京交流團 Day 5/
	tabbis-initializer.js:110 Video/Friend or Other/Friend or Other-2016/
	tabbis-initializer.js:110 Video/Friend or Other/Friend or Other-Joey Ku/
	tabbis-initializer.js:110 Video/Friend or Other/Friend or Other-Other/
	tabbis-initializer.js:110 Video/Friend or Other/Friend or Other-Team building/
	tabbis-initializer.js:110 Video/Hobby/Hobby/
	tabbis-initializer.js:110 Video/Lawrence/
	tabbis-initializer.js:110 Video/Lawrence/Lawrence-20081130 Grad/
	tabbis-initializer.js:110 Video/My Sweet Family/
	tabbis-initializer.js:110 Video/My Sweet Family/My Sweet Family-2011 Propose Marriage/
	tabbis-initializer.js:110 Video/My Sweet Family/My Sweet Family-20110726 最佳女朋友/
	tabbis-initializer.js:110 Video/My Sweet Family/My Sweet Family-20111128 Disneyland HK/
	tabbis-initializer.js:110 Video/My Sweet Family/My Sweet Family-2012/
	tabbis-initializer.js:110 Video/My Sweet Family/My Sweet Family-2013 Wedding/
	tabbis-initializer.js:110 Video/My Sweet Family/My Sweet Family-2014 Honeymoon/
	tabbis-initializer.js:110 Video/My Sweet Family/My Sweet Family-2015/
	tabbis-initializer.js:110 Video/My Sweet Family/My Sweet Family-2016 Featured/
	tabbis-initializer.js:110 Video/My Sweet Family/My Sweet Family-2017 Christmas/
	tabbis-initializer.js:110 Video/My Sweet Family/My Sweet Family-2017 Featured/
	tabbis-initializer.js:110 Video/My Sweet Family/My Sweet Family-2018 Christmas/
	tabbis-initializer.js:110 Video/My Sweet Family/My Sweet Family-2018 Featured/
	tabbis-initializer.js:110 Video/My Sweet Family/My Sweet Family-2019 Featured/
	tabbis-initializer.js:110 Video/My Sweet Family/My Sweet Family-2019 Twins Birthday/
	tabbis-initializer.js:110 Video/My Sweet Family/My Sweet Family-2019 京都大阪遊/My Sweet Family-2019 京都大阪遊-20190323/
	tabbis-initializer.js:110 Video/My Sweet Family/My Sweet Family-2019 京都大阪遊/My Sweet Family-2019 京都大阪遊-20190325/
	tabbis-initializer.js:110 Video/My Sweet Family/My Sweet Family-2019 京都大阪遊/My Sweet Family-2019 京都大阪遊-20190328/
	tabbis-initializer.js:110 Video/My Sweet Family/My Sweet Family-2019 京都大阪遊/My Sweet Family-2019 京都大阪遊-20190329/
	tabbis-initializer.js:110 Video/My Sweet Family/My Sweet Family-2019 京都大阪遊/My Sweet Family-2019 京都大阪遊-20190330/
	tabbis-initializer.js:110 Video/My Sweet Family/My Sweet Family-2020 Featured/
	tabbis-initializer.js:110 Video/My Sweet Family/My Sweet Family-2020 Jennies Birthday/
	tabbis-initializer.js:110 Video/My Sweet Family/My Sweet Family-2021 Featured/
	tabbis-initializer.js:110 Video/Relative-HO/Relative-HO-2012/
	tabbis-initializer.js:110 Video/Relative-HO/Relative-HO-2019/
	tabbis-initializer.js:110 Video/Relative-HO/Relative-HO-2020/
	tabbis-initializer.js:110 Video/Relative-WONG/
	tabbis-initializer.js:110 Video/Relative-WONG/Relative-WONG-2011/
	tabbis-initializer.js:110 Video/Relative-WONG/Relative-WONG-2019/
	*/


	/*
itemPathListArray[0]: Video/ tabbis-initializer.js:44:11
itemPathListArray[1]: Video/Friend or Other/ tabbis-initializer.js:44:11
itemPathListArray[2]: Video/Friend or Other/Friend or Other-2003/ tabbis-initializer.js:44:11
itemPathListArray[3]: Video/Friend or Other/Friend or Other-2004 北京交流團/Friend or Other-2004 北京交流團 Day 1/ tabbis-initializer.js:44:11
itemPathListArray[4]: Video/Friend or Other/Friend or Other-2004 北京交流團/Friend or Other-2004 北京交流團 Day 2/ tabbis-initializer.js:44:11
itemPathListArray[5]: Video/Friend or Other/Friend or Other-2004 北京交流團/Friend or Other-2004 北京交流團 Day 3/ tabbis-initializer.js:44:11
itemPathListArray[6]: Video/Friend or Other/Friend or Other-2004 北京交流團/Friend or Other-2004 北京交流團 Day 4/ tabbis-initializer.js:44:11
itemPathListArray[7]: Video/Friend or Other/Friend or Other-2004 北京交流團/Friend or Other-2004 北京交流團 Day 5/ tabbis-initializer.js:44:11
itemPathListArray[8]: Video/Friend or Other/Friend or Other-2016/ tabbis-initializer.js:44:11
itemPathListArray[9]: Video/Friend or Other/Friend or Other-Joey Ku/ tabbis-initializer.js:44:11
itemPathListArray[10]: Video/Friend or Other/Friend or Other-Other/ tabbis-initializer.js:44:11
itemPathListArray[11]: Video/Friend or Other/Friend or Other-Team building/ tabbis-initializer.js:44:11
itemPathListArray[12]: Video/Hobby/Hobby/ tabbis-initializer.js:44:11
itemPathListArray[13]: Video/Lawrence/ tabbis-initializer.js:44:11
itemPathListArray[14]: Video/Lawrence/Lawrence-20081130 Grad/ tabbis-initializer.js:44:11
itemPathListArray[15]: Video/My Sweet Family/ tabbis-initializer.js:44:11
itemPathListArray[16]: Video/My Sweet Family/My Sweet Family-2011 Propose Marriage/ tabbis-initializer.js:44:11
itemPathListArray[17]: Video/My Sweet Family/My Sweet Family-20110726 最佳女朋友/ tabbis-initializer.js:44:11
itemPathListArray[18]: Video/My Sweet Family/My Sweet Family-20111128 Disneyland HK/ tabbis-initializer.js:44:11
itemPathListArray[19]: Video/My Sweet Family/My Sweet Family-2012/ tabbis-initializer.js:44:11
itemPathListArray[20]: Video/My Sweet Family/My Sweet Family-2013 Wedding/ tabbis-initializer.js:44:11
itemPathListArray[21]: Video/My Sweet Family/My Sweet Family-2014 Honeymoon/ tabbis-initializer.js:44:11
itemPathListArray[22]: Video/My Sweet Family/My Sweet Family-2015/ tabbis-initializer.js:44:11
itemPathListArray[23]: Video/My Sweet Family/My Sweet Family-2016 Featured/ tabbis-initializer.js:44:11
itemPathListArray[24]: Video/My Sweet Family/My Sweet Family-2017 Christmas/ tabbis-initializer.js:44:11
itemPathListArray[25]: Video/My Sweet Family/My Sweet Family-2017 Featured/ tabbis-initializer.js:44:11
itemPathListArray[26]: Video/My Sweet Family/My Sweet Family-2018 Christmas/ tabbis-initializer.js:44:11
itemPathListArray[27]: Video/My Sweet Family/My Sweet Family-2018 Featured/ tabbis-initializer.js:44:11
itemPathListArray[28]: Video/My Sweet Family/My Sweet Family-2019 Featured/ tabbis-initializer.js:44:11
itemPathListArray[29]: Video/My Sweet Family/My Sweet Family-2019 Twins Birthday/ tabbis-initializer.js:44:11
itemPathListArray[30]: Video/My Sweet Family/My Sweet Family-2019 京都大阪遊/My Sweet Family-2019 京都大阪遊-20190323/ tabbis-initializer.js:44:11
itemPathListArray[31]: Video/My Sweet Family/My Sweet Family-2019 京都大阪遊/My Sweet Family-2019 京都大阪遊-20190325/ tabbis-initializer.js:44:11
itemPathListArray[32]: Video/My Sweet Family/My Sweet Family-2019 京都大阪遊/My Sweet Family-2019 京都大阪遊-20190328/ tabbis-initializer.js:44:11
itemPathListArray[33]: Video/My Sweet Family/My Sweet Family-2019 京都大阪遊/My Sweet Family-2019 京都大阪遊-20190329/ tabbis-initializer.js:44:11
itemPathListArray[34]: Video/My Sweet Family/My Sweet Family-2019 京都大阪遊/My Sweet Family-2019 京都大阪遊-20190330/ tabbis-initializer.js:44:11
itemPathListArray[35]: Video/My Sweet Family/My Sweet Family-2020 Featured/ tabbis-initializer.js:44:11
itemPathListArray[36]: Video/My Sweet Family/My Sweet Family-2020 Jennies Birthday/ tabbis-initializer.js:44:11
itemPathListArray[37]: Video/My Sweet Family/My Sweet Family-2021 Featured/ tabbis-initializer.js:44:11
itemPathListArray[38]: Video/Relative-HO/Relative-HO-2012/ tabbis-initializer.js:44:11
itemPathListArray[39]: Video/Relative-HO/Relative-HO-2019/ tabbis-initializer.js:44:11
itemPathListArray[40]: Video/Relative-HO/Relative-HO-2020/ tabbis-initializer.js:44:11
itemPathListArray[41]: Video/Relative-WONG/ tabbis-initializer.js:44:11
itemPathListArray[42]: Video/Relative-WONG/Relative-WONG-2011/ tabbis-initializer.js:44:11
itemPathListArray[43]: Video/Relative-WONG/Relative-WONG-2019/ tabbis-initializer.js:44:11
itemPathListArray[44]: tabbis-initializer.js:44:11
	
	 */
	
}

