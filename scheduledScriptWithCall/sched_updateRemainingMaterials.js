/**
 * Developer: Kenneth Infante
 * Email: kenneth@suitetoday.com
 * Type: Schedule script
 * SuiteScript Version: 1.0
 * Description:
 * 		This script uses customsearch977 to get the remaining materials costs of each project
 * 		We update the job/project custentityremaining_materials if the it doesn't match what's shown in the search.
 *
 */

function updateRemainingMaterials() {

	var searchResults = getResultsFromSavedSearch('transaction', 'customsearch_remaining_materials_costs');
	var success = updateRecordsInSavedSearch('job', 'custentityremaining_materials', searchResults, 0, 2, 3);
	if(success) {
		nlapiLogExecution('error','Success', 'Updated' + success.length + ' records');
	}

	var list = updateRecordsNotInSavedSearch('job', 'custentityremaining_materials', success, 0);

	if(list) {
		nlapiLogExecution('error','Success', 'Updated' + list.length + ' records');
	}
}

function updateRecordsNotInSavedSearch(recordType, fieldId, list, defaultVal){
	try{

		// search for records not in the saved search
		var filters = [new nlobjSearchFilter('internalid',null,'noneof', list)],

			columns = [new nlobjSearchColumn('internalid')],

			results = nlapiSearchRecord(recordType,null,filters,columns),

			context = nlapiGetContext(),
			processedIds = [],
			// for pre-ES6, assigning default values take this form
			// defaultVal = typeof defaultVal !== 'undefined' ?  defaultVal : null;

		if (results) {
			for(var i = 0, y = results.length; i < y; i++) {
				var columnsList = results[i].getAllColumns(),
					recordId = results[i].getValue(columnsList[0]);

				if (context.getRemainingUsage() <= 5 && (i+1) < y) {
				   var status = nlapiScheduleScript(context.getScriptId(), context.getDeploymentId());
				   if ( status == 'QUEUED' )
				      break;
				}

				nlapiSubmitField(recordType, recordId, fieldId, defaultVal)
				processedIds.push(recordId);

			}
			nlapiLogExecution('error','Finished Updating Saved Search');
			return processedIds;
		}
	} catch(e) {
		nlapiLogExecution('error','suiteScript() has encountered an error in updating the saved search.',errText(e, recordId));
		return false;
	}
}

