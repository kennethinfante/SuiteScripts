function autopopulate_address(){
//alert('Currently this form is on development stage but it will not affect the transaction.');

	setSelectIndex(document.forms['address_form'].elements['billaddresslist'],3);
        /*if (nlapiGetFieldValue('billaddresslist') == ''){
           setSelectIndex(document.forms['address_form'].elements['billaddresslist'],3);
            
        }else if (nlapiGetFieldValue('billaddresslist') <= '1'){
            setSelectIndex(document.forms['address_form'].elements['billaddresslist'],3);
        }*/
	nlapiSetFieldValue('billaddresslist', '124');
        nlapiSetFieldValue('billaddress', '124');

	setSelectIndex(document.forms['address_form'].elements['shipaddresslist'],3);
	nlapiSetFieldValue('shipaddresslist', '124');
        nlapiSetFieldValue('shipaddress', '124');
        

}
//end

function round_decimals(original_number, decimals) {
    var result1 = original_number * Math.pow(10, decimals);
    var result2 = Math.round(result1);
    var result3 = result2 / Math.pow(10, decimals);
    return pad_with_zeros(result3, decimals);
}

function pad_with_zeros(rounded_value, decimal_places) {

    // Convert the number to a string
    var value_string = rounded_value.toString();

    // Locate the decimal point
    var decimal_location = value_string.indexOf(".");

    // Is there a decimal point?
    if (decimal_location == -1) {

        // If no, then all decimal places will be padded with 0s
        decimal_part_length = 0;

        // If decimal_places is greater than zero, tack on a decimal point
        value_string += decimal_places > 0 ? "." : "";
    }
    else {

        // If yes, then only the extra decimal places will be padded with 0s
        decimal_part_length = value_string.length - decimal_location - 1;
    }

    // Calculate the number of decimal places that need to be padded with 0s
    var pad_total = decimal_places - decimal_part_length;

    if (pad_total > 0) {

        // Pad the string with 0s
        for (var counter = 1; counter <= pad_total; counter++)
            value_string += "0";
        }
    return value_string;
}

function createWarrantyProjectAS(type){
	/* a serverside aftersubmit script that works on create
	 * On Create it checks the flags offer support and create project.
	 * If either of these flags are true (they are independant) then create the warranty record or the project as appropriate
	 *
	 */
	if(type=='create'){
	var rec = nlapiGetNewRecord();
	for (var i = 1; i <= rec.getLineItemCount('item'); i++) {
		//if (rec.getLineItemValue('item', 'custcol_warranty_item', i) == 'T') {
		if (nlapiLookupField('item', rec.getLineItemValue('item', 'item', i), 'costingmethod', true) == 'Serialized') {
			var serialtxt = rec.getLineItemValue('item', 'serialnumbers', i);
			if(serialtxt){
				var separator = String.fromCharCode(5);

				var serial = serialtxt.split(separator);
				for (var j = 0; j < serial.length; j++) {


					var warranty = nlapiCreateRecord('customrecord_warranty_items');

					warranty.setFieldValue('name', serial[j] + '/' + rec.getLineItemText('item', 'item', i) + ' ' + rec.getLineItemValue('item', 'custcol_machine_location', i));
					warranty.setFieldValue('custrecord_customer', rec.getFieldValue('entity'));
					warranty.setFieldValue('custrecord_cup_count', 0);
					warranty.setFieldValue('custrecord_item', rec.getLineItemValue('item', 'item', i));
					warranty.setFieldValue('custrecord_contact', rec.getLineItemValue('item', 'custcol_site_contact', i));
					//warranty.setFieldValue('custrecord_location', rec.getLineItemValue('item', 'custcol_machine_location', i))
					warranty.setFieldValue('custrecord_machine_type', rec.getLineItemValue('item', 'description', i));
					warranty.setFieldValue('custrecord_place_of_purchase', 'Gilkatho');
					//warranty.setFieldValue('custrecord_pma_frequency', rec.getLineItemValue('item', 'custcol_pma_frequency', i))
					warranty.setFieldValue('custrecord_purchase_date', rec.getFieldValue('trandate'));
					warranty.setFieldValue('custrecord_created_from', nlapiGetRecordId());
					warranty.setFieldValue('custrecord_service_level', rec.getLineItemValue('item', 'custcol_service_level', i));
					warranty.setFieldValue('custrecord_warranty_end_date', rec.getLineItemValue('item', 'custcol_warranty_end_date', i));


					var intId = nlapiSubmitRecord(warranty, false, true);
				}
			}
		}


	}
	}
}

function updateSalesRep(){
	//page init function that loads the sales rep field on a transaction
	if (!nlapiGetFieldValue('salesrep')) {
		try {

			nlapiSetFieldValue('salesrep', nlapiGetUser());

		}
		catch(err){

			// do nothing as the employee is not a sales rep
		}
	}
	var dt = new Date();
	nlapiSetFieldValue('startdate',nlapiDateToString(dt));
	return true;

}

function inventoryAdjAddRecipe(){
	/*
	 * a button function that adds the lines of the recipe item to an item fulfilment
	 *
	 */
	var unitCost =0;
	var finishedCost = 0;
	if (nlapiGetFieldValue('custbody_roasting_recipe') && nlapiGetFieldValue('custbody_qty_to_produce')) {
		var recipe = nlapiLoadRecord('kititem', nlapiGetFieldValue('custbody_roasting_recipe'));
		var makeQ = nlapiGetFieldValue('custbody_qty_to_produce');
		var index = nlapiGetLineItemCount('inventory');
		for (var i = 1; i <= recipe.getLineItemCount('member'); i++) {
			index++;
			nlapiSelectLineItem('inventory', index);
			nlapiSetCurrentLineItemValue('inventory', 'item',recipe.getLineItemValue('member', 'item', i), true, true);
			nlapiSetCurrentLineItemValue('inventory', 'location',4, true, true);
			nlapiSetCurrentLineItemValue('inventory', 'units', recipe.getLineItemValue('member', 'memberunit', i), true, true);
			nlapiSetCurrentLineItemValue('inventory', 'adjustqtyby', round_decimals(recipe.getLineItemValue('member', 'quantity', i) * makeQ * -1,3), true, true);
			unitCost = nlapiLookupField('item', recipe.getLineItemValue('member', 'item', i), 'cost');

			nlapiSetCurrentLineItemValue('inventory', 'unitcost',unitCost , true, true);

			nlapiCommitLineItem('inventory');
			finishedCost += Math.abs(parseFloat(nlapiGetLineItemValue('inventory','unitcost',index))*nlapiGetLineItemValue('inventory','adjustqtyby',i));
		}
		index++;

		/*var finishedCost = parseFloat(nlapiLookupField('item', recipe.getFieldValue('custitem_final_product'),'cost'));

		if(finishedCost <= 0){
			alert('The cost has not been entered for the Finished Product, please correct and re-entered the adjustment')
		}
		*/
		nlapiSelectLineItem('inventory', index);
		nlapiSetCurrentLineItemValue('inventory', 'item', recipe.getFieldValue('custitem_final_product'), true, true);
		nlapiSetCurrentLineItemValue('inventory', 'location',1, true, true);
		nlapiSetCurrentLineItemValue('inventory', 'units', recipe.getLineItemValue('member', 'memberunit', i), true, true);
		nlapiSetCurrentLineItemValue('inventory', 'adjustqtyby',  makeQ, true, true);
		nlapiSetCurrentLineItemValue('inventory', 'unitcost',finishedCost/makeQ  , true, true);
		nlapiCommitLineItem('inventory');

	}

	return true;
}

function warrantyDays(type){
	// a validate line function for the warranty days
	/*
	 * Changed to a Before Submit Script for a Cash Sales and Invoice so that the date of the warranty occurs form that point.
	 */
	if(type == 'create'){
	var rec = nlapiGetNewRecord();
	for (var i = 1; i <= rec.getLineItemCount('item'); i++) {
		if (nlapiLookupField('item', rec.getLineItemValue('item', 'item', i), 'costingmethod') == 'SERIAL') {
			var ed = null;
			//domestic
			if (rec.getLineItemValue('item', 'custcol_warranty_domestic', i) && rec.getLineItemValue('item', 'custcol_warranty_domestic', i).length && rec.getFieldValue('custbody_customer_category') == 2) {
				ed = nlapiDateToString(nlapiAddMonths(nlapiStringToDate(rec.getFieldValue('trandate')), parseInt(rec.getLineItemText('item', 'custcol_warranty_domestic', i),10)));
			}

			//commercial
			if ( rec.getLineItemValue('item', 'custcol_warranty_commercial',i) && rec.getLineItemValue('item', 'custcol_warranty_commercial',i) && rec.getFieldValue('custbody_customer_category') == 1) {
				ed = nlapiDateToString(nlapiAddMonths(nlapiStringToDate(rec.getFieldValue('trandate')), parseInt(rec.getLineItemText('item', 'custcol_warranty_commercial',i),10)));
			}
			if(ed) rec.setLineItemValue('item', 'custcol_warranty_end_date', i, ed);
		}
	}
	}
}

function setLocationFieldService(type,fld){
	if (type =='item' && fld == 'item') {
		nlapiSetCurrentLineItemValue('item', 'location', 2,'F');
	}
	return true;

}


function setLocationWorkshop(type){
	if(type == 'item'){
		nlapiSetCurrentLineItemValue('item','location',3);
	}
}

function serviceJobPost(){
	nlapiSetFieldValue('title',nlapiGetFieldText('company'));
	return true;
}

function serviceJobPI(){
	if (nlapiGetFieldValue('company')) {
		nlapiSetFieldValue('title', nlapiGetFieldText('company'));
	}
	return true;
}

function printRunSheetHeader(){
	var xml = "<?xml version=\"1.0\"?>\n<!DOCTYPE pdf PUBLIC \"-//big.faceless.org//report\" \"report-1.1.dtd\">\n<pdf>\n";

 xml += "<head>";
 xml += "<style>";
 xml += ".normal {	font-family: Arial, Helvetica, sans-serif;	font-size: 12px;	margin: 0px;	padding: 0px;}";

 xml += ".normalBold {	font-family: Arial, Helvetica, sans-serif;	font-size: 12px;	font-weight: bold;}";
 xml += ".normalBold14 {	font-family: Arial, Helvetica, sans-serif;	font-size: 14px;	font-weight: bold;}";
 xml += ".normal14 {	font-family: Arial, Helvetica, sans-serif;	font-size: 14px;}";
 xml += ".table {	font-family: Arial, Helvetica, sans-serif;	font-size: 10px;	color: #888;	background-color: #00A;}";
 xml += ".tableLine {	align: center; padding: 1px;	border-top-color: #00A;	border-right-color: #00A;	border-bottom-color: #00A;	border-left-color: #00A;	border-right-width: thin;	border-left-width: thin;	border-right-style: solid;	border-left-style: solid;}";
 xml += ".tableBottom {	border-bottom-width: thin;	border-bottom-style: solid;	border-bottom-color: #008;}";
 xml += ".normal table {	text-align: left;}";

 xml += "</style></head>";
 return xml;
}

function printRunSheetBody(rec){
	var xml = '<body width="210mm" height="297mm" class="normal" margin="1cm">';
 xml += '<span class="normalBold"></span>';
 xml += '<table width="100%" border="0" cellpadding="0" class="normal">';
   xml += "<tr>";
     xml += '<td width="72%" class="normal"><img src="https://system.netsuite.com/core/media/media.nl?id=262685&c=894408&h=6dcd39513be6ef3e5a92" /></td>';
     xml += '<td colspan="2" ><p margin="0">Unit 9, 43 Lang Parade<br></br>';
     xml += "MILTON QLD 4064<br></br>";
     xml += "ABN 35 076 660 396<br></br>";
     xml += "</p></td>";
   xml += "</tr>";
   xml += "<tr>";
     xml += '<td class="normal"></td>';
     xml += '<td colspan="2" class="normalBold14">Delivery Run Sheet</td>';
   xml += "</tr>";
   xml += "<tr>";
     xml += '<td class="normal"></td>';
     xml += '<td width="12%" class="normalBold14">Sales Order #</td>';
     xml += '<td width="16%" class="normalBold14"></td>';
   xml += "</tr>";
 xml += "</table>";
 xml += "<p>";
 xml += "</p>";
 xml += '<table width="100%" border="0" cellpadding="0" class="normal">';
   xml += "<tr>";
     xml += '<td width="50%"><span class="normalBold">Bill To:</span></td>';
     xml += '<td width="50%"><span class="normalBold">Ship To:</span></td>';

   xml += "</tr>";
   xml += "<tr> </tr>";
   xml += "<tr>";
     xml += '<td class="normal">';
	 xml += rec.getFieldValue('defaultaddress').replace(/\n/g, "<br />");
	 xml += '</td>';
     xml += "<td>";

	 for(var j=1;j<=rec.getLineItemCount('addressbook');j++){
	 	if(rec.getLineItemValue('addressbook','defaultshipping',j) == 'T'){
			xml += rec.getLineItemValue('addressbook','addrtext',j).replace(/\n/g, "<br />");
		}
	 }
	 xml += "</td>";
   xml += "</tr>";
 xml += "</table>";
 xml += "<p >";
 xml += "</p>";

 xml += '<table width="100%" border="0" cellpadding="0"  class="tableBottom" margin="0">';
   xml += '<tr class="table">';
     xml += '<td>Site Count</td>';
     xml += "<td>Par Level</td>";
     xml += "<td>Qty Delivered</td>";
     xml += "<td>Units</td>";

     xml += "<td>Item No.</td>";
    // xml += "<td>Description</td>"
   xml += "</tr>";
   for(var i =1;i<=rec.getLineItemCount('recmachcustrecord_customer_id_par');i++){
   xml += "<tr>";
     xml += '<td  class="tableLine">';
	//blank
	 xml += '</td>';
     xml += '<td  class="tableLine">';
	 xml += rec.getLineItemValue('recmachcustrecord_customer_id_par','custrecord_par_qty',i);
	 xml += '</td>';
     xml += '<td  class="tableLine">';
	 //blank
	 xml += '</td>';
     xml += '<td  class="tableLine">';
	 //blank;
	 xml += '</td>';
     xml += '<td  class="tableLine">';
	 xml += rec.getLineItemText('recmachcustrecord_customer_id_par','custrecord_par_item',i);
	 xml += '</td>';
    /* xml += '<td class="tableLine">'
	 xml += rec.getLineItemText('recmachcustrecord_customer_id_par','custrecord_description',1)
	 xml += '</td>'*/
   xml += "</tr>";
   }
   xml += '<tr class="tableBottom"></tr>';
 xml += "</table>";
 xml += '<table height="3cm">';
 xml += '<tr><td></td></tr>';
 xml += '</table>';
 xml += "<p>The above goods have been received in good order. </p>";
 xml += '<table width="80%" border="0" cellpadding="0">';
   xml += '<tr>';
     xml += '<td width="35%"></td>';
     xml += '<td width="65%" class="tableBottom"></td>';
   xml += '</tr>';
   xml += '<tr></tr>';
   xml += '<tr></tr>';
   xml += "<tr>";
     xml += '<td></td>';
     xml += "<td>Signature</td>";
   xml += "</tr>";
   xml += "<tr>";

     xml += '<td height="38"></td>';
     xml += '<td class="tableBottom"></td>';
   xml += "</tr>";
   xml += "<tr>";
     xml += "<td></td>";
     xml += "<td>Print Name</td>";
   xml += "</tr>";
 xml += "</table>";

 xml += '<table width="80%" border="0" cellpadding="0">';
   xml += "<tr>";
     xml += '<td class="tableBottom"></td>';
   xml += "</tr>";

   xml += "<tr>";
     xml += "<td>Site Details</td>";
   xml += "</tr>";
   xml += "<tr>";
     xml += "<td>Audit Counter</td>";
   xml += "</tr>";
   xml += "<tr>";
     xml += "<td>Parts Used</td>";
   xml += "</tr>";
   xml += "<tr>";
     xml += '<td height="59" class="tableBottom">Notes</td>';
   xml += "</tr>";
 xml += "</table>";

 xml += "</body>";
 xml = replaceChar(xml);
	return xml;
}
function printRunSheetHTML(){
	var rec = nlapiLoadRecord(request.getParameter('trantype'), request.getParameter('tranid'));
	var xml = printRunSheetHeader();
	xml += printRunSheetBody(rec);


 xml += "</pdf>";

var file = nlapiXMLToPDF(xml);
		response.setContentType('PDF', 'runlist.pdf');
		response.write(file.getValue());
}

function replaceChar(str){
	// function to replace characters that cause the XML to fail
	var newStr = '';
	if (!str) {
		return str;
	}
	else{
		newStr = str.replace(/&/g, "&amp;");
		//newStr = str.replace(//g, "\&");
		return newStr;
	}

}

var customerUserEvents = {

beforeLoadSetField : function (type, form){
	if ((nlapiGetContext().getExecutionContext() == 'userinterface') && (type == 'edit' | type == 'view') && 'CUSTOMER' == nlapiGetFieldValue('stage')) {
		var createNewReqLink = form.addField('custpage_new_req_link', 'inlinehtml', null, null, 'support');
		var linkURL = nlapiResolveURL('SUITELET', 'customscript32', 'customdeploy1') + '&tranid=' + nlapiGetRecordId() + '&trantype=' + nlapiGetRecordType();
		createNewReqLink.setDefaultValue('<B>Click <A HREF="' + linkURL + '">here</A> to print the run list.</B>');
	}

},

afterSubmit : function (type){
	var grantAccess = (function(){
		//if(nlapiGetContext().getUser() != 19526) return false;
		if(type != 'create' && type != 'edit') return false;
		nlapiLogExecution("DEBUG", "checking access for "+ nlapiGetFieldValue('email'), nlapiGetFieldValue('stage') +' '+ nlapiGetFieldValue('status'));
		if(type == 'create' && nlapiGetFieldValue('email') && 'T' != nlapiGetFieldValue('giveaccess') && 'CUSTOMER' == nlapiGetFieldValue('stage')) return true;
		if(type == 'edit'){
			var rec = nlapiLoadRecord(nlapiGetRecordType(), nlapiGetRecordId());
			var oldRec = nlapiGetOldRecord();
			var isNowCustomer = 'CUSTOMER' == rec.getFieldValue('stage') && (!oldRec || (oldRec && oldRec.getFieldValue('stage') != 'CUSTOMER'));
			if(isNowCustomer && nlapiGetFieldValue('email') && 'T' != nlapiGetFieldValue('giveaccess') && 'T' != nlapiGetFieldValue('isinactive')) return true; // should allow an existing customer to have access turned off.
		}
		return false;
	})();
	if(grantAccess){
		var rec = nlapiLoadRecord(nlapiGetRecordType(), nlapiGetRecordId());
		nlapiLogExecution("AUDIT", "granting access to "+ nlapiGetFieldValue('email'), rec.getFieldValue('stage') +' '+ rec.getFieldValue('status'));
		rec.setFieldValue('giveaccess', 'T');
		rec.setFieldValue('sendemail', 'T');
		rec.setFieldValue('password', 'coffee');
		rec.setFieldValue('password2', 'coffee');
		var role = nlapiLoadConfiguration('companypreferences').getFieldValue('customerrole');
		rec.setFieldValue('accessrole', role);
		nlapiSubmitRecord(rec, false, true);
	}

}
};

function createfrom(request,response){
	//server form to print out all the customer on a run sheet
	if (request.getMethod() == 'GET') {
		var form = nlapiCreateForm('Print Bulk Run List');

		var fld = form.addField('custpage_search_field', 'select', 'Please select the search to print', '-119');

		form.addSubmitButton();
		response.writePage(form);
	}else
	{
		var rec = '';
		var xml = printRunSheetHeader();
		var sr = nlapiSearchRecord('customer',request.getParameter('custpage_search_field'),null,null);
		for(var i=0; sr && i< sr.length; i++ ){
			rec = nlapiLoadRecord(sr[i].getRecordType(),sr[i].getId());
			xml += printRunSheetBody(rec);
		}
		xml += '</pdf>';

		var file = nlapiXMLToPDF(xml);
		response.setContentType('PDF', 'runlist.pdf');
		response.write(file.getValue());
	}
}

function customerDefaultValue(){
	/* terms - prepay
	 * credit limit 0
	 * email preference pdf
	 * customer category should be mandatory
	 * price level - base price
	 * coffee supplt - no
	 * Servie Priority - standard service
	 * response target - 3 day service
	 */
	nlapiSetFieldValue('terms',9);
	nlapiSetFieldValue('creditlimit',0);
	//nlapiSetFieldValue('pricelevel',1);
	nlapiSetFieldValue('custentity_coffee_supply',2);
	nlapiSetFieldValue('custentity_service_priority',3);
	nlapiSetFieldValue('custentity_response_target',1);

	nlapiSetFieldText('emailpreference','PDF');
	return true;


}

function itemDefaults(){
	/*
	 * preferred location - Workshop
	 *
	 */
	nlapiSetFieldValue('preferredlocation',3);
	for (var i = 1; i <= nlapiGetLineItemCount('locations'); i++) {
		if (nlapiGetLineItemValue('locations', 'location', i) == 3) {
			nlapiSetLineItemValue('locations', 'reorderpoint', i, 0);
			nlapiSetLineItemValue('locations', 'preferredstocklevel', i, 0);
		}
	}
	return true;

}

function setState(stateTxt){
	var stateId = 0;
	switch(stateTxt){
	case 'QLD':
		stateId = 1;
		break;
		case 'NSW':
		stateId = 2;
		break;
	case 'VIC':
		stateId = 3;
		break;
	case 'WA':
		stateId = 4;
		break;
	case 'SA':
		stateId = 5;
		break;
	case 'NT':
		stateId = 6;
		break;
	case 'ACT':
		stateId = 7;
		break;
	case 'TAS':
		stateId = 8;
		break;
	default :
	stateId = 0; break;
	}
	return stateId;

}
function updateShippingItem(recType,recId){

	var town = null;

        var rec = nlapiLoadRecord(recType,recId);
		// get the shipping town
		for (var j = 1; j <= rec.getLineItemCount('addressbook'); j++) {
			if (rec.getLineItemValue('addressbook', 'defaultshipping', j) == 'T') {
				// switch between two cases first with state, second with postcode, third with neither
				var filters = null;

				if (rec.getLineItemValue('addressbook', 'city', j)  && rec.getLineItemValue('addressbook', 'state', j)  && rec.getLineItemValue('addressbook', 'city', j) && rec.getLineItemValue('addressbook', 'state', j) ) {
					town = rec.getLineItemValue('addressbook', 'city', j).toUpperCase();
					var state = rec.getLineItemValue('addressbook', 'state', j).toUpperCase();
					//state = parseInt(setState(state))
					filters = [
						new nlobjSearchFilter('custrecord_fastway_town', null, 'is', town),
						new nlobjSearchFilter('custrecord_fastway_state', null, 'is', state)
					];

				} else if(rec.getLineItemValue('addressbook', 'city', j) && rec.getLineItemValue('addressbook', 'zip', j) && rec.getLineItemValue('addressbook', 'city', j)  && rec.getLineItemValue('addressbook', 'zip', j) ){
						town = rec.getLineItemValue('addressbook', 'city', j).toUpperCase();
						var postcode = rec.getLineItemValue('addressbook', 'zip', j);
						filters = [
							new nlobjSearchFilter('custrecord_fastway_town', null, 'is', town),
							new nlobjSearchFilter('custrecord_fastway_postcode', null, 'is', postcode)
						];
				} else{
					// third time - only test the city
					if (rec.getLineItemValue('addressbook', 'city', j)  && rec.getLineItemValue('addressbook', 'city', j)) {
						town = rec.getLineItemValue('addressbook', 'city', j).toUpperCase();
						filters = [ new nlobjSearchFilter('custrecord_fastway_town', null, 'is', town)];
					}
				}


				var columns = [];
				columns[columns.length] = new nlobjSearchColumn('custrecord_shipping_item');

				try {

					var sr = nlapiSearchRecord('customrecord_fastway_locations', null, filters, columns);
					if (sr && sr.length === 1 && sr[0].getValue('custrecord_shipping_item')) {
						rec.setFieldValue('shippingitem', sr[0].getValue('custrecord_shipping_item'));
						nlapiSubmitRecord(rec, false, true);
					}
				} catch(err){
						nlapiLogExecution('ERROR', recId, err.getDetails());
				}

			}
			break;
		}

}

function calcTime(city, offset) {

    // create Date object for current location
    d = new Date();

    // convert to msec
    // add local time zone offset
    // get UTC time in msec
    utc = d.getTime() + (d.getTimezoneOffset() * 60000);

    // create new Date object for different city
    // using supplied offset
    nd = new Date(utc + (3600000*offset));

    // return time as a string
    return  nd;

}

function updateSalesConsumableSpend(){
	/*
	 * Scheduled script that updates the customer record based on aggregated sales int he the last 90 days.
	 *
	 *
	 */


	var context = nlapiGetContext();
	var sr = nlapiSearchRecord('transaction','customsearch419',null,null);

	var dt_text = nlapiDateToString(calcTime('Brisbane','+10'));
	//var dt_text ='1/10/2010'
	var fields = ['custentity_con_date_updated','custentity_consumables_average'];
	var values = [];

	for (var i = 0; sr && sr.length > i;i++){
		values = [dt_text,sr[i].getValue('amount',null,'sum')];

		if(context.getRemainingUsage()<=0){
			var result = nlapiScheduleScript(context.getScriptId(), context.getDeploymentId());
			if(result == 'QUEUED'){
				break;
			}
		}
		else{
			try {
				nlapiSubmitField('customer', sr[i].getValue('internalid', 'customer', 'group'), fields, values);
			}
			catch(err){
				nlapiLogExecution('ERROR','Amount not updated for Customer '+ sr[i].getText('name',null,'group'),'Amount '+sr[i].getValue('amount',null,'sum'));
			}

		}


	}
}
