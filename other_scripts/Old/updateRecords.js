/*
nlapiCreateSearch() and nlapiLoadSearch() returns nlobjSearch object.
When executed using runSearch() method of nlobjSearch object, System returns nlobjSearchResultSet object.
*/

/**
 * Update records based on a saved search
 * @params {string} searchType type of search
 * @params {string} searchId string search id
 * @params {string} recordType type of record to update
 * @params {string} fieldId id of field to update
 * @params {string} recId column index containing the id of record to update
 * @params {string} newVal column index containing the new value
 * @params {string} oldVal column index containing the old value
 */

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
			searchid = 0,

			// for pre-ES6, assigning default values take this form
			defaultVal = typeof defaultVal !== 'undefined' ?  defaultVal : null;

		do {
			// get the first 1000 results in the filtered results
			var results = resultSet.getResults(searchid,searchid+1000);

			// if remaining usage is less than 50, exit and don't do the rest
			if(context.getRemainingUsage() <= 50){
				nlapiLogExecution('debug','Exiting script');
				break;
			}


			else{
				nlapiLogExecution('debug','Updating all ' + recordType);
				for(var x=0; x < results.length; x++)
				{
					// erroneous
					if (context.getRemainingUsage() <= 50 )
					{
						nlapiLogExecution('debug','QUEUE SCRIPT', context.getRemainingUsage() + ' ' + searchid);
						//deployrec.setFieldValue("custscript_searchid",searchid);
						//nlapiSubmitRecord(deployrec);
						var status = nlapiScheduleScript(context.getScriptId(), context.getDeploymentId())
						if ( status == 'QUEUED' )
						break;
					}

					var recordId = results[x].getId();
					nlapiSubmitField(recordType, recordId, fieldId, null);

					processedIds.push(recordId);
					searchid++;
				}
				nlapiLogExecution('debug','Updated ' + results.length + ' records');
			}
		} while(results.length >= 1000);

		return processedIds;
	} catch(e) {
		nlapiLogExecution('error','suiteScript() has encountered an error in updating the saved search.',errText(e, recordId));
		return false;
	}
}