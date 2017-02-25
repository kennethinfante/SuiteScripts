/*******************************************************************************
*
* Creates a button to the Opportunity Pricing Tool when the transaction is in View
* mode
*
********************************************************************************/
/*
function onAfterSubmit(action){
	nlapiLogExecution('debug', 'onBeforeSubmit', 'in function');
	var SCRIPT_ID = "19";
	var opportunity = nlapiGetNewRecord();
	var id = opportunity.getId();
	var url = 'https://system.netsuite.com/app/site/hosting/scriptlet.nl'
	url += "?script=" + SCRIPT_ID + "&deploy=1&tranid=" + id;
	var html = "<a href=javascript:window.open('" + url + "','pricingtool')>Pricing Tool</a>";
	
	var newOpp = nlapiLoadRecord('opportunity', id);
	newOpp.setFieldValue('custbody_pricing_tool_url', url);
	nlapiSubmitRecord(newOpp, false, true);
}*/

function onBeforeLoad(type, form){
	//var SCRIPT_ID = 20;
	if (type == 'view'){
		var trans = nlapiGetNewRecord();
		var url = nlapiResolveURL('SUITELET','customscript_opportunity_pricing_tool','customdeploy_opportunity_pricing_tool');
	    var id = nlapiGetFieldValue("id");
	    var tranType = nlapiGetFieldValue("recordType");
		//url = 'https://system.netsuite.com/app/site/hosting/scriptlet.nl'
		//url += "?script=" + SCRIPT_ID + "&deploy=1&tranid=" + id;
		url+= '&tranid=' + id + '&tranType=' + trans.getRecordType();
	   var script = "window.open('" +url + "','pricingtool','height=700,width=700,status=no,toolbar=no,menubar=no,location=no')"
	   
	   	form.addButton('custpage_pricingtool','Pricing Tool', script);	
	}
}

