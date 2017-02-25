/**
 * Module Description
 * 
 *
 */

/**
 * The recordType (internal id) corresponds to the "Applied To" record in your script deployment. 
 * @appliedtorecord recordType
 * 
 * @param {String} type Operation types: create, edit, delete, xedit,
 *                      approve, cancel, reject (SO, ER, Time Bill, PO & RMA only)
 *                      pack, ship (IF only)
 *                      dropship, specialorder, orderitems (PO only) 
 *                      paybills (vendor payments)
 * @returns {Void}
 */
function setPredictDateAS(type){
	if (type == 'delete' ){
		return;
	}
	var idCustomer = nlapiGetFieldValue('entity');
	var srcTrans = nlapiLoadSearch(null, 'customsearch_scd_prediction_date');
	srcTrans.addFilter(new nlobjSearchFilter('entity', null, 'anyof', idCustomer));

	var srcTrans = nlapiLoadSearch(null, 'customsearch_scd_prediction_date');
	srcTrans.addFilter(new nlobjSearchFilter('entity', null, 'anyof', idCustomer));
	var execSrc = srcTrans.runSearch(); 
	var resTrans  = execSrc.getResults(0, 1);
	nlapiLogExecution('debug', 'customer', idCustomer);
        nlapiLogExecution('debug', 'predictions', resTrans.length);
	if(resTrans.length > 0){
		var dFirst = nlapiStringToDate(resTrans[0].getValue('trandate', null, 'MIN'));
		var dLatest = nlapiStringToDate(resTrans[0].getValue('trandate', null, 'MAX'));
		var nTransCount = parseInt(resTrans[0].getValue('tranid', null, 'COUNT'));
		if (nTransCount > 1 ){
		    var nBetween = nDateBetween(dLatest, dFirst);
		    var nAverage = parseInt(nBetween/(nTransCount-1));
		    var dPrediction = nlapiAddDays(dLatest, nAverage);
                     nlapiLogExecution('debug', 'date', dPrediction);
		    nlapiSubmitField('customer', idCustomer, 'custentity_predicted_next_coffee_date', nlapiDateToString(dPrediction, 'dd/mm/yyyy'));
		}		
	}
}


function nDateBetween(date1, date2) {
    var ONE_DAY = 1000 * 60 * 60 * 24;
    var date1_ms = date1.getTime();
    var date2_ms = date2.getTime();
    var difference_ms = Math.abs(date1_ms - date2_ms)
    return Math.round(difference_ms/ONE_DAY);
}