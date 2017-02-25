/**
 * Module Description
 * 
 * Version    Date            Author           Remarks
 * 1.00       28 Feb 2015     KennethJhim
 *
 */

/**
 * The recordType (internal id) corresponds to the "Applied To" record in your script deployment. 
 * @appliedtorecord Customer, Supplier, and Employee
 *   
 * @param {String} type Operation types: create, edit, view, copy, print, email
 * @param {nlobjForm} form Current form
 * @param {nlobjRequest} request Request object
 * @returns {Void}
 */
function EntityFormBeforeLoad(type, form){
	var rec = nlapiLoadRecord(nlapiGetRecordType(), nlapiGetRecordId());
	var cf = rec.getFieldText('customform');
	nlapiSetFieldValue('custentity7', cf); // change custbody18 to id of your custom field
	 
	if(type != 'view') { // hide the custom field if not in view mode
		form.getField('custentity7').setDisplayType('hidden');
	}
}
