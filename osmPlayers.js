var locale = window.location.host.split(".")[0],
	OPTIMAL_PERCENT = 150,
	OPTIMAL_PROFIT = 50;

function createCell(cellPercent, cellProfit, cellDifference, text, style, playerId, sellValue) {
	var percentage,
	    divPercent = document.createElement('div'),	
		textPercent = '',
		txtNodePercent;	// create DIV element
	var profit,
		divProfit = document.createElement('div'),
		textProfit = '',	// create DIV element
		txtNodeProfit;
    var difference,
		divDifference = document.createElement('div'),
		textDifference = '',	// create DIV element
		txtNodeDifference;

	realValue = getRealValue(playerId);
	realValue = formatValueToMath(realValue);

	//SellValue percentage column
	percentage = calculatePercentage(sellValue, realValue);
	if (percentage){
		textPercent = percentage + "%";
	}
	txtNodePercent = document.createTextNode(textPercent); // create text node
	divPercent.appendChild(txtNodePercent);                    // append text node to the DIV
	divPercent.setAttribute('class', 'center');        // set DIV class attribute
	divPercent.setAttribute('className', style);    // set DIV class attribute for IE (?!)
	if (percentage <= OPTIMAL_PERCENT && percentage > 0)
		cellPercent.setAttribute('style','background-color:#90EE90');
	cellPercent.appendChild(divPercent);                   // append DIV to the table cell


	//Potential Sell Profit column
	profit = calculatePotentialProfit(realValue, sellValue);
	textProfit = formatValueToShow(profit);
	txtNodeProfit = document.createTextNode(textProfit); // create text node
	divProfit.appendChild(txtNodeProfit);                    // append text node to the DIV
	cellProfit.setAttribute('class', 'right');  
	if ((sellValue*100)/profit >= OPTIMAL_PROFIT && profit > 0)
		cellProfit.setAttribute('style','background-color:#90EE90');
	cellProfit.appendChild(divProfit);


	//SellValue Variation column
	difference = valueDiff(playerId, sellValue);
	textDifference = formatValueToShow("" + difference);
	txtNodeDifference = document.createTextNode(textDifference); // create text node
	divDifference.appendChild(txtNodeDifference);                    // append text node to the DIV
	cellDifference.setAttribute('class', 'right');
	cellDifference.appendChild(divDifference);
	if (difference > 0){
	   cellDifference.setAttribute('style','color:#B40000');
	   cellDifference.appendChild(createArrows(-1));
    }else if(difference < 0){
	   cellDifference.setAttribute('style','color:#009033');
	   cellDifference.appendChild(createArrows(1));
    }
}

function formatValueToMath(value) {
	value = value.replace(/\€/g, "");
	value = value.replace(/\./g, "");
	value = value.replace(/\,/g, "");
	
	return value;
}

function formatValueToShow(value) {
	var size = value.length,
		finalValue = '';

	finalValue = '.' + value.substr(size - 3, 3) + ' €';
	finalValue = '.' + value.substr(size - 6, 3) + finalValue;
	finalValue = value.substr(0, size - 6) + finalValue;
	return finalValue;
}
function go(){
	var tbl  =  document.getElementById("tableTransfer"),
	playerId;
	
	if (tbl.rows[0].childElementCount === 12){
		tbl.rows[0].lastElementChild.setAttribute('class', 'right header');
		th = document.createElement('th');
		th.innerHTML = "%";
		th.setAttribute('class', 'center right header');
		tbl.rows[0].appendChild(th);

		th = document.createElement('th');
		th.innerHTML = "Lucro Pot.";
		th.setAttribute('class', 'right header');
		tbl.rows[0].appendChild(th);

		th = document.createElement('th');
		th.innerHTML = "Variação";
		th.setAttribute('class', 'right rightSide header');
		tbl.rows[0].appendChild(th);


		for (i  =  1; i < tbl.rows.length; i++) {
			playerIdInnerHTML = tbl.rows[i].cells[1].innerHTML;
			playerId = playerIdInnerHTML.substring(31, playerIdInnerHTML.lastIndexOf("\""));
			sellValue  =  tbl.rows[i].cells[10].innerHTML.trim();
			sellValue = formatValueToMath(sellValue);
			if (!isMyPlayer(tbl.rows[i]))
			 createCell(tbl.rows[i].insertCell(tbl.rows[i].cells.length), tbl.rows[i].insertCell(tbl.rows[i].cells.length), tbl.rows[i].insertCell(tbl.rows[i].cells.length), i, 'col', playerId, sellValue);

		}
	}

}
function colorizeRow(percentage, row) {
	if (percentage <= OPTIMAL_PERCENT && percentage > 0)
		row.setAttribute('style','background-color:#90EE90');
}

function isMyPlayer(row){
	var anchor = row.cells[11].getElementsByTagName("a")[0];

	if (anchor == null || (anchor.attributes.getNamedItem("class") != null && anchor.attributes.getNamedItem("class").nodeValue.includes("aBuyPlayer")))
		return false;
	else
		return true;
}

function valueDiff(playerId, sellValue) {
    var firstValue = localStorage.getItem(playerId),
        difference = 0;

    if (firstValue != null){
        difference = firstValue - sellValue;
    }else{
        localStorage.setItem(playerId, sellValue);
    }

    //cleanLocalStorage

	return ( isNaN(difference) ? "" : difference);
}

function getRealValue(playerId){
	var xmlHttp  =  new XMLHttpRequest(),
		el  =  document.createElement( 'html' );
		
	xmlHttp.open( "GET", "http://" + locale + ".onlinesoccermanager.com/Player/Profile?PlayerNr=" + playerId, false );
	xmlHttp.send( null );
	el.innerHTML  =  xmlHttp.responseText;

	return el.getElementsByTagName( 'td' )[1].innerHTML;//xmlHttp.responseText;
}

function calculatePercentage(sellValue, realValue) {
	var p = ((sellValue.valueOf()/realValue.valueOf())*100).toFixed(0);
	
	return ( isNaN(p) ? "" : p);
}

function calculatePotentialProfit(realValue, sellValue) {
	var p = ((realValue.valueOf() * 2.4) - sellValue.valueOf()).toFixed(0);
	
	return ( isNaN(p) ? "" : p);
}

function createArrows(direction) {
	var div = document.createElement('div');

	switch (direction){
	    case 1:
	       div.setAttribute('class', 'divRankContainerUp divRankContainer float-right');
	       div.setAttribute('title', '20 ? 18');
	       break;
	    case -1:
	       div.setAttribute('class', 'divRankContainerDown divRankContainer float-right');
	       div.setAttribute('title', '13 ? 17');
	       break;
	}

	return div;
}

go();