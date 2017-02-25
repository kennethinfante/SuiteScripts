function updateSalesCycleStatus() {
	var searchResults = getResultsFromSavedSearch('customer', 'customsearch991');
	var success = updateRecordsInSavedSearch('customer', 'custentity_pending_status_update_v2', searchResults, 0, 5, 4);

	if(success) {
		nlapiLogExecution('debug',typeof success, 'Successfully updated' + success.length + ' records');
	}

    var list = updateRecords('customer', 'custentity_pending_status_update_v2', success);

	if(list) {
		nlapiLogExecution('debug',typeof list, 'Successfully updated' + list.length + ' records');
	}
}

function updateRecords(recordType, fieldId, list) {
	var context = nlapiGetContext();
	var filters = new Array();
	filters[0] = new nlobjSearchFilter('internalid',null,'noneof', list);

	var columns = new Array();
	columns[0] = new nlobjSearchColumn('internalid');

	var results = nlapiSearchRecord(recordType,null,filters,columns);

	nlapiLogExecution('debug',typeof results, results.length);
	processedIds = [];
	if (results) {
		for(var i = 0, y = results.length; i < y; i++) {
			var columns = results[i].getAllColumns(),
				recordId = results[i].getValue(columns[0]);

			nlapiLogExecution('debug','record id', recordId);

			if (context.getRemainingUsage() <= 5 && (i+1) < y) {
			   var status = nlapiScheduleScript(context.getScriptId(), context.getDeploymentId())
			   if ( status == 'QUEUED' )
			      break;
			}

			// var record=nlapiLoadRecord(recordType, recordId);
			// record.setFieldValue(fieldId,null);
			// nlapiSubmitRecord(record, {disabletriggers:true, ignoremandatoryfields:true});

			try {
				nlapiSubmitField(recordType,recordId, fieldId, null)
				processedIds.push(recordId);
			} catch(e) {
				nlapiLogExecution('error','suiteScript() has encountered an error in updating the records.',errText(e, recordId));
				continue;
			}
		}

		nlapiLogExecution('debug','Finished Updating Saved Search');
		return processedIds;
	}

}






