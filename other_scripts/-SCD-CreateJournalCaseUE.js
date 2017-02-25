/**
 * Module Description
 * 
 * Version    Date            Author           Remarks
 * 1.00       23 Aug 2014     SCD
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
function createJournalAS(type){

    if (type == 'delete' || nlapiStringToDate(nlapiGetFieldValue('enddate'))  <  nlapiStringToDate('1/7/2014 00:00 am')){
    	return;
    }

	var idStatus = nlapiGetFieldValue('status');
	var nManhours = nlapiGetFieldValue('custevent_manhours');
	var idCategory = nlapiGetFieldValue('category');
	var idJournal = nlapiGetFieldValue('custevent_scd_relatedjournal');
	var nCost = nlapiLookupField('employee', nlapiGetFieldValue('assigned'), 'custentity_service_call_cost_estimate');
	nlapiLogExecution('debug', 'case id', nlapiGetRecordId());
	
	if (idStatus == 5 && nManhours > 0 && nCost > 0 && (idCategory == 14 || idCategory == 16 || idCategory == 13 || idCategory == 15 || idCategory == 18 || idCategory == 19  || idCategory == 9)){
		nlapiLogExecution('debug', 'create/update journal entry', 'entry');
		var idCustomer = nlapiGetFieldValue('company');
		var nAmount = nCost * nManhours;
		var sMemo = nlapiGetFieldValue('title');
		var dClose = nlapiGetFieldValue('enddate').split(' ')[0];
		
		var recJournal;
		if (idJournal){
			recJournal = nlapiLoadRecord('journalentry', idJournal);
			nlapiLogExecution('debug', 'create/update journal entry', 'updating');
		}
		else{
			recJournal = nlapiCreateRecord('journalentry');
			nlapiLogExecution('debug', 'create/update journal entry', 'creating');
		}
		
		
		
		var idClass;
		
		if (idCategory == 14 || idCategory == 16){///Service : Field Service
			idClass  = 17;
		} 
		else if(idCategory == 13 || idCategory == 15 || idCategory == 18 || idCategory == 19 ){//Service : Workshop Service
			idClass  = 18;
		}
		else if (idCategory == 9){//Service : Maintenance Contracts
			idClass  = 16;
		}
		
		recJournal.setFieldValue('currency', 1);
		recJournal.setFieldValue('trandate', dClose);
		recJournal.setFieldValue('custbody_journal_type', 3);
		recJournal.setFieldValue('custbody_scd_createdfrom_case', nlapiGetRecordId());
		
		
		if (idJournal){
			recJournal.selectLineItem('line', 1); 
		}
		else{
			recJournal.selectNewLineItem('line');
		}
		
		recJournal.setCurrentLineItemValue('line','account', 351); 
		recJournal.setCurrentLineItemValue('line', 'credit', nAmount);
		recJournal.setCurrentLineItemValue('line', 'memo', sMemo);
		recJournal.setCurrentLineItemValue('line', 'entity', idCustomer);
		recJournal.setCurrentLineItemValue('line', 'class', idClass);
		recJournal.commitLineItem('line');
		
		if (idJournal){
			recJournal.selectLineItem('line', 2); 
		}
		else{
			recJournal.selectNewLineItem('line');
		}
		
		recJournal.setCurrentLineItemValue('line','account', 350); 
		recJournal.setCurrentLineItemValue('line', 'debit', nAmount);
		recJournal.setCurrentLineItemValue('line', 'memo', sMemo);
		recJournal.setCurrentLineItemValue('line', 'entity', idCustomer);
		recJournal.setCurrentLineItemValue('line', 'class', idClass);
		recJournal.commitLineItem('line');   
		
		var idJournal = nlapiSubmitRecord(recJournal, true, true);
		nlapiSubmitField(nlapiGetRecordType(), nlapiGetRecordId(), 'custevent_scd_relatedjournal', idJournal);
	}
	
}
