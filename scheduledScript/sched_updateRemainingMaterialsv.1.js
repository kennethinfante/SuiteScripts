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
	var success = updateRecords('transaction', 'customsearch_remaining_materials_costs', 'job', 'custentityremaining_materials', 0, 2, 3);

	if(success) {
		nlapiLogExecution('debug','Success', 'Updated' + success.length + ' records');
	}
}

function updateRecords(searchType, searchId, recordType, fieldId, recId, newVal, oldVal, defaultVal){
	try{

		// this will hold the list of processed ids
		var processedIds = [],
			context = nlapiGetContext(),

			// get the list of activities present in the search
			results = nlapiSearchRecord(searchType, searchId);
			
		if(results){
			for(var i =0; i <results.length; i++){
				var columns = results[i].getAllColumns(),
					recordId = results[i].getValue(columns[recId]),
					oldValue = results[i].getValue(columns[oldVal]),
					newValue = results[i].getValue(columns[newVal]);

				if(oldValue !== newValue) {
					nlapiSubmitField(recordType, recordId, fieldId, newValue);
				}

				processedIds.push(recordId);
			}
		} else {
			nlapiLogExecution('debug','No records to update');
		}

		nlapiLogExecution('debug','Updated ' + results.length + ' records');

		// search for records not in the saved search
		var filters = [new nlobjSearchFilter('internalid',null,'noneof', processedIds)],

			columns = [new nlobjSearchColumn('internalid')],

			search = nlapiCreateSearch(recordType, filters, columns),
			resultSet = search.runSearch(),
			searchId = 0,
			searchIdStep = 1000,

			// for pre-ES6, assigning default values take this form
			defaultVal = typeof defaultVal !== 'undefined' ?  defaultVal : null;

		do {
			// get the first 1000 results in the filtered results
			var results = resultSet.getResults(searchId,searchIdStep);

			// if remaining usage is less than 50, exit and don't do the rest
			if(context.getRemainingUsage() <= 50){
				nlapiLogExecution('debug','Exiting script');
				break;
			}


			else{
				nlapiLogExecution('debug','Updating all ' + recordType);
				for(var x=0; x < results.length; x++) {
					// erroneous
					if (context.getRemainingUsage() <= 50 )
					{
						nlapiLogExecution('debug','QUEUE SCRIPT', context.getRemainingUsage() + ' ' + searchId);
						//deployrec.setFieldValue("custscript_searchid",searchid);
						//nlapiSubmitRecord(deployrec);
						var status = nlapiScheduleScript(context.getScriptId(), context.getDeploymentId())
						if ( status == 'QUEUED' )
						break;
					}

					var recordId = results[x].getId();
					nlapiSubmitField(recordType, recordId, fieldId, null);
					// nlapiSubmitField('job', 7246, 'custentityremaining_materials', null);

					processedIds.push(recordId);
				}
				searchId = searchId + searchIdStep;
				nlapiLogExecution('debug','Updated ' + results.length + ' records');
			}
		} while(results.length > 0);

		return processedIds;
	} catch(e) {
		nlapiLogExecution('error','suiteScript() has encountered an error in updating the saved search.',errText(e, recordId));
		return false;
	}
}

