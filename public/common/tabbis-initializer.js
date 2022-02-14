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
	const itemPathListArray = itemPathList.split(',');
	console.log('Total ' + type + ' folder amount: ' + (itemPathListArray.length - 1));
	console.log('Total ' + type + ' file amount: ' + fileCount);

	tabbisDataTabsArray = getTabbisStructure(itemPathListArray);

	for (i = 0; i < tabbisDataTabsArray.length; i++) {
		console.log('Tabbis ' + i + ': ' + tabbisDataTabsArray[i]);
	}
}

function getTabbisStructure(itemPathListArray) {
	const tabbisDataTabsArray = [];
	const itemPathListArrayLength = itemPathListArray.length;
	var previousKeyRoot = [];
	for (i = 0; i < itemPathListArrayLength - 1; i++) {
		console.log('Index: ' + i);
		console.log('Current key: ' + itemPathListArray[i]);
		const currentPathArray = itemPathListArray[i].split('/');
		const currentButtonText = currentPathArray[(currentPathArray.length - 2)];
		const currentPathLevel = currentPathArray.length - 2;
		console.log('Level: ' + currentPathLevel);
		//		console.log("array:"+tabbisDataTabsArray[currentPathLevel]);
		if (currentPathLevel > 0) {
			//			previousKeyRoot = itemPathListArray[i].replace(currentButtonText, '');
			if ((previousKeyRoot[currentPathLevel] + currentButtonText + '/').localeCompare(itemPathListArray[i]) == 0) {
				console.log('previousKeyRoot A: ' + previousKeyRoot[currentPathLevel]);
				if (typeof (tabbisDataTabsArray[currentPathLevel]) != "undefined") {
					tabbisDataTabsArray[currentPathLevel] += '<button>' + currentButtonText + '</button>';
				} else {
					tabbisDataTabsArray[currentPathLevel] = '<button data-active>' + currentButtonText + '</button>';
				}
			} else {
				console.log('previousKeyRoot B: ' + previousKeyRoot[currentPathLevel]);
				if (typeof (tabbisDataTabsArray[currentPathLevel]) != "undefined") {
					tabbisDataTabsArray[currentPathLevel] += '</div><div data-tabs><button data-active>' + currentButtonText + '</button>';
				} else {
					tabbisDataTabsArray[currentPathLevel] = '<div data-panes><div data-tabs><button>' + currentButtonText + '</button>';
				}
				previousKeyRoot[currentPathLevel] = itemPathListArray[i].replace(currentButtonText, '');
				previousKeyRoot[currentPathLevel] = previousKeyRoot[currentPathLevel].substring(0, previousKeyRoot[currentPathLevel].length - 1);
			}
		} else {
			if (typeof (tabbisDataTabsArray[currentPathLevel]) != "undefined") {
				tabbisDataTabsArray[currentPathLevel] += '<button>' + currentButtonText + '</button>';
			} else {
				tabbisDataTabsArray[currentPathLevel] = '<button data-active>' + currentButtonText + '</button>';
			}
		}
	}

	tabbisDataTabsArray[0] = '<div data-tabs>' + tabbisDataTabsArray[0] + '</div>';
	var i = 1;
	do {
		if (typeof (tabbisDataTabsArray[i]) != "undefined") {
			tabbisDataTabsArray[i] += '</div></div>';
		}
		i++;
	} while ((typeof (tabbisDataTabsArray[i]) != "undefined"));

	return tabbisDataTabsArray;
}

/*
Video/,Video/Friend or Other/,Video/Friend or Other/Friend or Other-2003/,Video/Friend or Other/Friend or Other-2004 北京交流團/Friend or Other-2004 北京交流團 Day 1/,Video/Friend or Other/Friend or Other-2004 北京交流團/Friend or Other-2004 北京交流團 Day 2/,Video/Friend or Other/Friend or Other-2004 北京交流團/Friend or Other-2004 北京交流團 Day 3/,Video/Friend or Other/Friend or Other-2004 北京交流團/Friend or Other-2004 北京交流團 Day 4/,Video/Friend or Other/Friend or Other-2004 北京交流團/Friend or Other-2004 北京交流團 Day 5/,Video/Friend or Other/Friend or Other-2016/,Video/Friend or Other/Friend or Other-Joey Ku/,Video/Friend or Other/Friend or Other-Other/,Video/Friend or Other/Friend or Other-Team building/,Video/Hobby/Hobby/,Video/Lawrence/,Video/Lawrence/Lawrence-20081130 Grad/,Video/My Sweet Family/,Video/My Sweet Family/My Sweet Family-2011 Propose Marriage/,Video/My Sweet Family/My Sweet Family-20110726 最佳女朋友/,Video/My Sweet Family/My Sweet Family-20111128 Disneyland HK/,Video/My Sweet Family/My Sweet Family-2012/,Video/My Sweet Family/My Sweet Family-2013 Wedding/,Video/My Sweet Family/My Sweet Family-2014 Honeymoon/,Video/My Sweet Family/My Sweet Family-2015/,Video/My Sweet Family/My Sweet Family-2016 Featured/,Video/My Sweet Family/My Sweet Family-2017 Christmas/,Video/My Sweet Family/My Sweet Family-2017 Featured/,Video/My Sweet Family/My Sweet Family-2018 Christmas/,Video/My Sweet Family/My Sweet Family-2018 Featured/,Video/My Sweet Family/My Sweet Family-2019 Featured/,Video/My Sweet Family/My Sweet Family-2019 Twins Birthday/,Video/My Sweet Family/My Sweet Family-2019 京都大阪遊/My Sweet Family-2019 京都大阪遊-20190323/,Video/My Sweet Family/My Sweet Family-2019 京都大阪遊/My Sweet Family-2019 京都大阪遊-20190325/,Video/My Sweet Family/My Sweet Family-2019 京都大阪遊/My Sweet Family-2019 京都大阪遊-20190328/,Video/My Sweet Family/My Sweet Family-2019 京都大阪遊/My Sweet Family-2019 京都大阪遊-20190329/,Video/My Sweet Family/My Sweet Family-2019 京都大阪遊/My Sweet Family-2019 京都大阪遊-20190330/,Video/My Sweet Family/My Sweet Family-2020 Featured/,Video/My Sweet Family/My Sweet Family-2020 Jennies Birthday/,Video/My Sweet Family/My Sweet Family-2021 Featured/,Video/Relative-HO/Relative-HO-2012/,Video/Relative-HO/Relative-HO-2019/,Video/Relative-HO/Relative-HO-2020/,Video/Relative-WONG/,Video/Relative-WONG/Relative-WONG-2011/,Video/Relative-WONG/Relative-WONG-2019/, tabbis-initializer.js:34:10


 */