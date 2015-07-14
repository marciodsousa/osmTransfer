var locale = window.location.host.split(".")[0];

function createCell(cell, text, style, playerId, sellValue) {
	var div = document.createElement('div'),
		text = ''	// create DIV element
	
	realValue = getRealValue(playerId);
	realValue = formatValue(realValue);
	re = new RegExp(find, 'g');
	percentage = calculatePercentage(sellValue, realValue);
	if (percentage){
		text = percentage + "%";
	}
	txt = document.createTextNode(text); // create text node
	div.appendChild(txt);                    // append text node to the DIV
	div.setAttribute('class', 'center');        // set DIV class attribute
	div.setAttribute('className', style);    // set DIV class attribute for IE (?!)
	cell.appendChild(div);                   // append DIV to the table cell
	return percentage;
}

function formatValue(value) {
	value = value.replace(/\€/g, "");
	value = value.replace(/\./g, "");
	value = value.replace(/\,/g, "");
	
	return value;
}

function go(){
	var tbl  =  document.getElementById("tableTransfer"),
	playerId;
	
	if (tbl.rows[0].childElementCount === 12){
		tbl.rows[0].lastElementChild.setAttribute('class', 'right header');
		th = document.createElement('th');
		th.innerHTML = "%";
		th.setAttribute('class', 'center rightSide header');
		tbl.rows[0].appendChild(th);

		for (i  =  1; i < tbl.rows.length; i++) {
			//playerId = tbl.rows[i].getElementsByClassName("aPlayerPop")[0].innerHTML;
			playerIdInnerHTML = tbl.rows[i].cells[1].innerHTML;
			playerId = playerIdInnerHTML.substring(31, playerIdInnerHTML.lastIndexOf("\""));
			sellValue  =  tbl.rows[i].cells[10].innerHTML.trim();
			sellValue = formatValue(sellValue);
			percentage = createCell(tbl.rows[i].insertCell(tbl.rows[i].cells.length), i, 'col', playerId, sellValue);
			colorizeRow(percentage, tbl.rows[i]);
		}
	}

}
function colorizeRow(percentage, row) {
	if (percentage <=150 && percentage > 0)
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

go();