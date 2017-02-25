// var ITEM_SEARCH_ID = 95; // Test account
var ITEM_SEARCH_ID = nlapiGetContext().getSetting('SCRIPT', 'custscript_item_search_id');
// var SCRIPT_ID = 19; // Test account
var SCRIPT_ID = nlapiGetContext().getSetting('SCRIPT', 'custscript_script_id');
// var TRANS_DISCOUNT_ITEM = 397; // Test account
var TRANS_DISCOUNT_ITEM = nlapiGetContext().getSetting('SCRIPT', 'custscript_trans_discount_item');

var ALL_ITEMS = '999999';

var GLOBAL_NONE = 0;
var GLOBAL_DISCOUNT = '1';
var GLOBAL_COST_PLUS = '2';
var GLOBAL_TRANS_DISCOUNT = '3';


 function init(request, response){
 	try{
 		nlapiLogExecution('debug','started script');
 		var tranType = request.getParameter('tranType');
 		nlapiLogExecution('debug','trantype=' + tranType);
 		// ITEM_SEARCH_ID = nlapiGetContext().getSetting('SCRIPT', 'custscript_item_search_id');
 		nlapiLogExecution('debug', 'init', 'ITEM_SEARCH_ID= ' + ITEM_SEARCH_ID + ' SCRIPT_ID= ' + SCRIPT_ID + ' TRANS_DISCOUNT_ITEM= ' + TRANS_DISCOUNT_ITEM );
	 	if (request.getParameter('custpage_pricingoptions') == null){
	 		createForm(request, response, tranType);
	 	}else{
	 		var tranId = request.getParameter('custpage_tranid');
	 		tranType = request.getParameter('custpage_trantype');
	 		doUpdate(request, response, tranId, tranType);
	 		createResponsePage(response, null);
	 	}
	
 	}catch(e){
 		nlapiLogExecution('error', 'init', 'error occurred=' + e.toString());
 		createResponsePage(response, e);
 	}
 	
 }
 
 function createForm(request, response, tranType){
 	
 	//get the opportunity id from the request.
 	var opportunityId = request.getParameter('tranid');
 	var form = nlapiCreateForm('Pricing Tool');
	form.setScript(SCRIPT_ID);
	//var updateButton = form.addButton('custpage_update', 'Submit', 'doSubmit()');
	var updateButton = form.addSubmitButton('Submit');
	var cancelButton = form.addResetButton('Cancel');
	
	
	var selectBox = form.addField('custpage_pricingoptions', 'select', 'Pricing Options', '', '');
	
	selectBox.addSelectOption('1', 'Discount List Price (%)', false );
	selectBox.addSelectOption('2', 'Markup Item Cost (%)', false );
	selectBox.addSelectOption('3', 'Discount Entire Transaction ($)', false );
	
	
	var txtGlobalValue = form.addField('custpageglobalvalue', 'float', 'Global Value', '', '');
	
	var subList = form.addSubList('custpagefindlist', 'inlineeditor', 'Find and Replace', '');
	var itemField = subList.addField('finditem', 'select', 'Select Specific Items or All Items', 'customsearch_itemsearch');
	populateItems(itemField, opportunityId);
	subList.addField('findpercent', 'percent', 'Find Original %', '');
	subList.addField('replacepercent', 'percent', 'Replace with %', '');
	
	var textBox = form.addField('custpage_tranid', 'text', 'Opportunity Id', '','');
	textBox.setDefaultValue(opportunityId);
	textBox.setDisplayType('hidden');
	
	textBox = form.addField('custpage_trantype', 'text', 'Transaction type', '','');
	textBox.setDefaultValue(tranType);
	textBox.setDisplayType('hidden');
	
	response.writePage(form);	
 }
 
 function createResponsePage(response, e){
 	var form = null;
 	var field = null;
 	
 	if (e == null){
 		response.writeLine('<head><title>Transaction Updated</title></head>');
 		response.writeLine("<link rel='stylesheet' href='/core/styles/pagestyles.nl?ct=0&bglt=F1F3F9&bgmd=DBE1EB&bgdk=6C7789&bgon=B8C7DB&bgoff=748DB4&bgbar=B8C7DB&tasktitletext=000000&crumbtext=607CA9&headertext=3F444B&ontab=000000&offtab=FFFFFF&text=000000&link=000000&bgbody=FFFFFF&bghead=FFFFFF&portlet=DBE1EB&portletlabel=000000&bgbutton=FFE599&bgrequiredfld=FFFFE5&font=Verdana%2CHelvetica%2Csans-serif&size_site_content=8pt&size_site_title=8pt&size=1.0&nlinputstyles=T&NS_VER=2008.1.0'>");
 		response.writeLine("<body onload='window.opener.location.reload(true);' bgcolor='#FFFFFF' link='#000000' vlink='#000000' alink='#330099' text='#000000' topmargin=0 marginheight=1>" +
			"<img src='/images/nav/stretch.gif' width='20'><a href='http://www.netsuite.com/portal/home.shtml'><img src='/images/logos/netsuite30.gif' height='30' border=0></a>" +
			"<TABLE border=0 cellPadding=0 cellSpacing=0 width=100%>" +
			"<tr><td class=bglt>" +
			"<table border=0 cellspacing=0 cellpadding=5 width=100%>" +
			"<tr><td class=textboldnolink>Opportuntiy Updated</td></tr>" +
			"<tr><td vAlign=top>" +
			"<table border=0 cellspacing=0 cellpadding=0 width=100%>" +
			"<TR><TD class=text>&nbsp;</TD></TR>" +
			"<tr><td class=text><img src='/images/5square.gif' width=5 height=5>The transaction has been updated. Click Close to view the revised Transaction</td></tr>" +
			"<TR><TD class=text>&nbsp;</TD></TR>" +
			"<TR><TD class=text>&nbsp;</TD></TR>" +
			"</table></td></tr></table></td></tr>" +
			"<tr><TD><INPUT type='button' class='bgbutton' style='' value='Close Window' id='closewindow' name='closewindow' onkeypress='event.cancelBubble=true;' onclick='window.close();return false;'></TD></tr>" +
			"</table>" +
			"</body>");
			
 		/*
	 	form = nlapiCreateForm('Opportunity Updated');
		form.setScript(SCRIPT_ID);	
		field = form.addField('custpageresponsetext', 'inlinehtml', '', '');
		field.setDefaultValue('<h2>The opportunity has been updated</h2>');
		*/
 	}else{
 		form = nlapiCreateForm("Error Occurred");
 		form.setScript(SCRIPT_ID);	
 		field = form.addField('custpageresponsetext', 'inlinehtml', '', '');
		field.setDefaultValue('<h2>An error has occurred - ' + e.toString() + "</h2>");
		
		field = form.addField('custpagaerefreshopener', 'inlinehtml', '', '');
		field.setDefaultValue('<script></script>window.opener.refresh()');
		response.writePage(form);
 	}
	//response.writePage(form);
 }
 
 function populateItems(itemField,tranId){
 	var filters = new Array();
 	filters[0] = new nlobjSearchFilter('internalid', null, 'is', tranId)
	var searchResults = nlapiSearchRecord('transaction', ITEM_SEARCH_ID, filters, null);
		
	itemField.addSelectOption(ALL_ITEMS, '- All Items - ', true);
	for(i=0; searchResults != null && i<searchResults.length; i++){
		itemField.addSelectOption(searchResults[i].getValue('internalid', 'item', null),
			//searchResults[i].getValue('itemid', 'item', null), false);
			searchResults[i].getValue('itemid', 'item', null), false);
	}
	
	

 }
 
 function doSubmit(){
	var pricingOptions = nlapiGetFieldValue('custpage_pricingoptions');
	var lineCount = nlapiGetLineItemCount('custpagefindlist');
	
	

	document.forms['_form'].submit();

}

function doUpdate(request, response, tranId, tranType){
	
	var transaction = nlapiLoadRecord(tranType, tranId);
	
	/*
	var params = request.getAllParameters()
	
	for ( param in params )
	{
		
		nlapiLogExecution('debug', 'doUpdate', 'parameter: ' + param + 'value: '+params[param])
	}*/
	
	var pricingOption = request.getParameter('custpage_pricingoptions');
	var globalValue = request.getParameter('custpageglobalvalue');
	
	if (!isEmpty(globalValue)) { 
		doGlobalUpdate(transaction, globalValue, pricingOption)
	}else{
		if ( request.getLineItemCount('custpagefindlist') > 0 ) {
		doSpecificUpdate(transaction, request, pricingOption);
		}
	}
	nlapiLogExecution('debug', 'init', 'completed sub functions time to submit ' + transaction );
	// var lineCnt = opportunity.getLineItemCount('item');
	
	// if (lineCnt > 0) doSpecificUpdate(opportunity, request, pricingOption); // Robert added pricingOption 5/29/08
	
	nlapiSubmitRecord(transaction, false, false);
	
	return transaction;
}
/****************************************************************************/
 	function doGlobalUpdate(transaction, globalValue, pricingOption){
	var lineCnt = transaction.getLineItemCount('item');
	var newRate = 0.0;
	globalValue = getFloat(globalValue);
	globalValue = round(globalValue);
	//globalValue = roundSixDigits(globalValue);
	var discountAmt = globalValue * -1;
	var listPrice = 0.0;
	var unitCost = 0.0;
	var total = 0.0;
	var qty = 0.0;
	var amount = 0.0;
	
	if (pricingOption == GLOBAL_TRANS_DISCOUNT){
		if( transaction.getLineItemValue('item','item', lineCnt) == TRANS_DISCOUNT_ITEM ) {
		 // nlapiLogExecution('debug', 'doGlobalUpdate', 'in Global trans discount ' + ' line= ' + lineCnt + ' item= ' + opportunity.getLineItemValue('item','item', lineCnt));
		 	// update the discount item only
			transaction.setLineItemValue('item', 'amount', lineCnt, discountAmt);
			transaction.setLineItemValue('item', 'custcol_unit_cost', lineCnt, '0');
			
		}else{
		//add a new line item if discount doesn't exist as last item
			lineCnt++;
			transaction.insertLineItem('item', lineCnt);
			transaction.setLineItemValue('item', 'item', lineCnt, TRANS_DISCOUNT_ITEM);
			transaction.setLineItemValue('item', 'amount', lineCnt, discountAmt);
			transaction.setLineItemValue('item', 'custcol_unit_cost', lineCnt, '0');
		}
		for(var i=1; i<=lineCnt; i++){
			listPrice = getFloat(transaction.getLineItemValue('item','custcollist_price', i))
			transaction.setLineItemValue('item', 'rate', i, listPrice);
			transaction.setLineItemValue('item', 'custcoldiscount', i, 0);
			
			qty = getFloat(transaction.getLineItemValue('item', 'quantity', i));
			// amount = round(qty * listPrice);
			amount = getFloat(transaction.getLineItemValue('item','amount', i));
			total += amount;
		}
	}else{
		for(var i=1; i<=lineCnt; i++){
			
			transaction.setLineItemValue('item', 'custcoldiscount', i, roundSixDigits(globalValue));
			switch(pricingOption){
				
				case GLOBAL_DISCOUNT:
					listPrice = getFloat(transaction.getLineItemValue('item','custcollist_price', i));
					// newRate = Math.abs(listPrice * (1-globalValue)); // original
					newRate = round(listPrice * (1 - Math.abs(globalValue)/100) ); // Robert 5/29/08
					transaction.setLineItemValue('item', 'rate', i, newRate);
					// nlapiLogExecution('debug', 'doGlobalUpdate', 'in Global discount ' + ' line= ' + i + ' listPrice= ' + listPrice + ' newRate= ' + newRate);
					break;
					
				case GLOBAL_COST_PLUS:
					unitCost = getFloat(transaction.getLineItemValue('item', 'custcol_unit_cost', i));
					// newRate = Math.abs(unitCost * (1 + globalValue)); //original
					newRate = round(unitCost * (1 + Math.abs(globalValue)/100) ); // Robert 5/29/08
					transaction.setLineItemValue('item', 'rate', i, newRate);
					
					// nlapiLogExecution('debug', 'doGlobalUpdate', 'in Global cost plus ' + ' line= ' + i + ' unitCost= ' + unitCost + ' newRate= ' + newRate);
					break;
					
			}
		qty = getFloat(transaction.getLineItemValue('item', 'quantity', i));
		
		amount = round(qty * newRate);
		total += amount;
		} // end for
	} // end else
	
	var shippingCost = getFloat(transaction.getFieldValue('shippingcost'));
	var newTotal = total + shippingCost;
	transaction.setFieldValue('total', newTotal);
	
	 // end for calc total
	nlapiLogExecution('debug', 'doGlobalUpdate', 'completed doGlobalUpdate ' + ' line= ' + i  + ' shippingCost= ' + shippingCost + ' total= ' + newTotal);
}
/****************************************************************************/
function doSpecificUpdate(transaction, request, pricingOption){
	// Robert added pricingOption 5/29/08
	var lineCnt = request.getLineItemCount('custpagefindlist');
	// nlapiLogExecution('debug', 'doSpecificUpdate', 'lineCnt=' + lineCnt);
	var item = '';
	var findValue = '';
	var replaceValue = '';
	var originalValue = '';
	var rate = 0.0;
	var amount = 0.0;
	var total = 0.0;
	var qty = 0;
	for(var i=1; i<=lineCnt; i++){
		
		replaceValue = request.getLineItemValue('custpagefindlist', 'replacepercent', i);
		replaceValue = getDecimalFromPercent(replaceValue);
		replaceValue = round(replaceValue);
		
		item = request.getLineItemValue('custpagefindlist', 'finditem', i);
		findValue = getDecimalFromPercent( request.getLineItemValue('custpagefindlist', 'findpercent', i));
	
		// nlapiLogExecution('debug', 'doSpecificUpdate', 'lineCnt= ' + lineCnt + ' line= ' + i + ' findValue= ' + findValue + ' replaceValue= ' + replaceValue );				
		
		for(var q = 1; q <= transaction.getLineItemCount('item'); q++){
			nlapiLogExecution('debug', 'doSpecificUpdate', 'lines= ' + transaction.getLineItemCount('item') + ' begin line= ' + q );
			
			originalValue = getDecimalFromPercent(transaction.getLineItemValue('item', 'custcoldiscount', q));
			qty = getFloat(transaction.getLineItemValue('item', 'quantity', q));
			
			switch(pricingOption){
				
				case GLOBAL_DISCOUNT:
					listPrice = getFloat(transaction.getLineItemValue('item','custcollist_price', q));
					rate = round(listPrice * round((1 - Math.abs(replaceValue)))); 
					// nlapiLogExecution('debug', 'doSpecificUpdate', 'discount GLOBAL_DISCOUNT ' + ' rate= ' + rate + ' findpercent= ' + findValue + ' replacePercent= ' + replaceValue);
					break;
					
				case GLOBAL_COST_PLUS:
					unitCost = getFloat(transaction.getLineItemValue('item', 'custcol_unit_cost', q));
					rate = round(unitCost * round((1 + Math.abs(replaceValue)))); 
					// nlapiLogExecution('debug', 'doSpecificUpdate', 'markup GLOBAL_COST_PLUS ' + ' rate= ' + rate + ' findpercent= ' + findValue + ' replacePercent= ' + replaceValue);
					break;
				}			

			amount = round(qty * rate);
			total += amount;
			// nlapiLogExecution('debug', 'doSpecificUpdate', 'item= ' + item + ' findValue= ' + findValue + ' originalValue= ' + originalValue + ' replaceValue= ' + replaceValue + ' total= ' + total);
			if (item == ALL_ITEMS){
				
				if (findValue == originalValue){
					transaction.setLineItemValue('item', 'custcoldiscount', q, roundSixDigits(replaceValue*100)); 
					transaction.setLineItemValue('item', 'rate', q, rate);
					transaction.setLineItemValue('item', 'amount', q, amount);
				}
				
			}else{
				if (item == transaction.getLineItemValue('item', 'item', q)){
					transaction.setLineItemValue('item', 'custcoldiscount', q, roundSixDigits(replaceValue*100)); 
					transaction.setLineItemValue('item', 'rate', q, rate);
					transaction.setLineItemValue('item', 'amount', q, amount);	
				}
			}
			var shippingCost = getFloat(transaction.getFieldValue('shippingcost'));
			// var taxTotal = getFloat(record.getFieldValue('taxtotal'));
			// var newTotal = (total - discountTotal) + taxTotal + shippingCost;
			var newTotal = total + shippingCost;
			// transaction.setFieldValue('total', newTotal);
			transaction.setFieldValue('total', newTotal);
			nlapiLogExecution('debug', 'doSpecificUpdate', ' completed line= ' + q + ' total= ' +total + ' rate= ' + rate 
				+ ' newTotal= ' + newTotal + ' shippingCost= ' + shippingCost + ' findValue= ' + findValue
				+ ' replaceValue= ' + replaceValue);
		} // end for q
		
	} // end for i
	return transaction;
}
/***********************************************************************************
	Utility functions
************************************************************************************/
function getFloat(aValue){
	if (aValue == null ||  isNaN(aValue) || aValue=='') return 0;
	
	return parseFloat(aValue);
}

function isEmpty(aValue){
	if (aValue == null || aValue == '')return true;
	
	return false;
}

function getDecimalFromPercent(aValue){
	// nlapiLogExecution('debug', 'getDecimalFromPercent', 'aValue in = ' + aValue);
	if (aValue == null ) aValue = ''; // indexOf can't evaluate null
	if (aValue.indexOf('%') > -1){
		aValue = aValue.substr(0, aValue.length - 1);
		aValue = getFloat(aValue);
		aValue = aValue/100;
		
	}else{
		aValue = 0;
	}
	// nlapiLogExecution('debug', 'getDecimalFromPercent', 'decimal out = ' + aValue);	
	return round(aValue);
}

function round(amount){
	amount = Math.round(amount * 100)/100;
	return amount;	
}

function roundSixDigits(amount){
	amount = Math.round(amount * 1000000)/1000000;
	return amount;	
}
