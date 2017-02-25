/**creat
 * Module Description
 * 
 * Version    Date            Author           Remarks
 * 1.00       30 Jul 2014     SCD
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
function updateCaseStatusAS(type){
	if (type == 'create'){
		var recSo = nlapiLoadRecord(nlapiGetRecordType(), nlapiGetRecordId());
		var sMemo = recSo.getFieldValue('memo');
		var idCase= recSo.getFieldValue('custbody_case_number');
		if(idCase && sMemo){
			var sCaseNum = nlapiLookupField('supportcase', idCase, 'casenumber');

			if(sMemo == 'Created from Case #' + sCaseNum){
				var id = nlapiSubmitField('supportcase', idCase, 'status', 7);
			}
			else if (sMemo.substring(0, 3) == 'JOB'){
				var id = nlapiSubmitField('supportcase', idCase, 'status', 7);
			}
		}
	}
}