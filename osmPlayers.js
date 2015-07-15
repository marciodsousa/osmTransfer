var locale = window.location.host.split(".")[0],
	OPTIMAL_PERCENT = 150,
	OPTIMAL_PROFIT = 50;

function createCell(cellPercent, cellProfit, text, style, playerId, sellValue) {
	var div = document.createElement('div'),
		divProfit = document.createElement('div'),
		text = '',	// create DIV element
		textProfit = '';	// create DIV element
	
	realValue = getRealValue(playerId);
	realValue = formatValueToMath(realValue);
	re = new RegExp(find, 'g');
	percentage = calculatePercentage(sellValue, realValue);
	if (percentage){
		text = percentage + "%";
	}
	txt = document.createTextNode(text); // create text node
	div.appendChild(txt);                    // append text node to the DIV
	div.setAttribute('class', 'center');        // set DIV class attribute
	div.setAttribute('className', style);    // set DIV class attribute for IE (?!)
	if (percentage <= OPTIMAL_PERCENT && percentage > 0)
		cellPercent.setAttribute('style','background-color:#90EE90');
	cellPercent.appendChild(div);                   // append DIV to the table cell

	profit = calculatePotentialProfit(realValue, sellValue);
	textProfit = formatValueToShow(profit);
	txtProfit = document.createTextNode(textProfit); // create text node
	divProfit.appendChild(txtProfit);                    // append text node to the DIV

	cellProfit.setAttribute('class', 'right');  
	if ((sellValue*100)/profit >= OPTIMAL_PROFIT && profit > 0)
		cellProfit.setAttribute('style','background-color:#90EE90');
	cellProfit.appendChild(divProfit);
	return percentage;
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
		th.innerHTML = "Lucro";
		th.setAttribute('class', 'right rightSide header');
		tbl.rows[0].appendChild(th);

		for (i  =  1; i < tbl.rows.length; i++) {
			//playerId = tbl.rows[i].getElementsByClassName("aPlayerPop")[0].innerHTML;
			playerIdInnerHTML = tbl.rows[i].cells[1].innerHTML;
			playerId = playerIdInnerHTML.substring(31, playerIdInnerHTML.lastIndexOf("\""));
			sellValue  =  tbl.rows[i].cells[10].innerHTML.trim();
			sellValue = formatValueToMath(sellValue);
			percentage = createCell(tbl.rows[i].insertCell(tbl.rows[i].cells.length), tbl.rows[i].insertCell(tbl.rows[i].cells.length), i, 'col', playerId, sellValue);
			//colorizeRow(percentage, tbl.rows[i]);
		}
	}

}
function colorizeRow(percentage, row) {
	if (percentage <= OPTIMAL_PERCENT && percentage > 0)
		row.setAttribute('style','background-color:#90EE90');
}

function getRealValue(playerId){
	var xmlHttp  =  new XMLHttpRequest(),
		el  =  document.createElement( 'html' );
		
	xmlHttp.open( "GET", "http://" + locale + ".onlinesoccermanager.com/Player/Profile?PlayerNr=" + playerId, false );
	xmlHttp.send( null );
	el.innerHTML  =  xmlHttp.responseText;
	/*
	el.getElementsByTagName( 'td' );
	el.getElementsByTagName( 'td' )[1];

	el.getElementsByTagName( 'td' )[1].innerHTML;
	el.getElementsByTagName( 'td' )[1].innerHTML.innerHTML.substring(1);
	*/
	
	return el.getElementsByTagName( 'td' )[1].innerHTML;//xmlHttp.responseText;
}

function calculatePercentage(sellValue, realValue) {
	var p  =  ((sellValue.valueOf()/realValue.valueOf())*100).toFixed(0);
	
	//console.log(sellValue + "||" + realValue);
	//console.log(p);
	
	return ( isNaN(p) ? "" : p);
}

function calculatePotentialProfit(realValue, sellValue) {
	var p = ((realValue.valueOf() * 2.4) - sellValue.valueOf()).toFixed(0);
	
	//console.log(sellValue + "||" + realValue);
	//console.log(p);
	
	return ( isNaN(p) ? "" : p);
}

go();