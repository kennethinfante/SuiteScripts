/**
 * Update records in a saved search.
 *
 * @params {string} recordType the record type containing the field to be updated
 * @params {string} fieldId the field id of the field to be updated
 * @params {object} the instance of nlobjSearchResult containing the saved search results
 * @params {integer} recordIdColumn the column index for the internal id of the record containing the field to be updated
 * @params {integer} oldValueColumn the column index for the value to be updated
 * @params {integer} newValueColumn the column index for the new value
 * @return {array} returns the processed internal ids
 */
function updateRecordsInSavedSearch(recordType, fieldId, searchResults, recordIdColumn, newValueColumn, oldValueColumn) {

	try {
		var context = nlapiGetContext();
		var processedIds = [];
		if (searchResults) {
			for(var i = 0, y = searchResults.length; i < y; i++) {
				// get the values of columns needed in each row
				var columns = searchResults[i].getAllColumns(),
					recordId = searchResults[i].getValue(columns[recordIdColumn]),
					oldValue = searchResults[i].getValue(columns[oldValueColumn]),
					newValue = searchResults[i].getValue(columns[newValueColumn]);

				// get remaining usage
				if (context.getRemainingUsage() <= 5 && (i+1) < y) {
				   var status = nlapiScheduleScript(context.getScriptId(), context.getDeploymentId())
				   if ( status == 'QUEUED' )
				      break;
				}

				// if the new value is not equal to the current value is not equal, update the field with the new value
				if(oldValue !== newValue) {
					nlapiSubmitField(recordType, recordId, fieldId, newValue);
				}

				// add to the list of processed ids the latest processed id
				processedIds.push(recordId);
			}
		} else {
			nlapiLogExecution('debug', 'No records to update');
		}

		nlapiLogExecution('debug', 'Finished Updating Saved Search');
		return processedIds;

	} catch(e) {
		nlapiLogExecution('error','suiteScript() has encountered an error in updating the saved search.',errText(e, recordId));
		return false;
	}

}

/**
 * Perform a record search using an existing search or filters and columns.
 *
 * @param  {string} type the type of saved search
 * @param  {string} id   the internal id of the saved search
 */
function getResultsFromSavedSearch(type, id) {
	return nlapiSearchRecord(type, id);
}

/**
 * Provides detailed error message.
 *
 * @params {error} e the error instance
 * @params {integer} internalId the internal id of the record when the error occurred
 * @return {string}
 */

function errText(e, internalId)
{
    if(!(typeof internalId==='number' && (internalId%1)===0)) {
        internalId = 0;
    }

    var txt='';
    if (e instanceof nlobjError) {
        //this is netsuite specific error
        txt = 'NLAPI Error: Record ID :: '+internalId+' :: '+e.getCode()+' :: '+e.getDetails() + ' :: ' + e.getStackTrace().join(', ');
    } else {
        //this is generic javascript error
        txt = 'JavaScript/Other Error: Record ID :: '+internalId+' :: '+e.toString()+' : '+e.stack;
    }
    return txt;
}

/**
 * Convert a string into a number
 *
 * @param  {string} value the string to be converted
 */
function toNumber(value) {
	return (parseFloat(value) == NaN)?0.0:parseFloat(value);
}

/**
 * Convert a string into a Date object
 *
 * @param  {string} value the string to be converted
 */
function toDate(value) {
	return nlapiStringToDate(value);
}

/**
 * Checks if filter is empty or null
 *
 * @param  {mixed} value the filter value to check
 * @return {mixed}
 */
function emptyFilterCheck(value) {
	if(value) {
		return value;
	} else {
		return '@NONE@';
	}
}

// not fully tested
function getResultsLength(results) {
        var length = 0;
        var count = 0, pageSize = 100;
        var currentIndex = 0;
        do{
                count = results.getResults(currentIndex, currentIndex + pageSize).length;
                currentIndex += pageSize;
                length += count;
        }
        while(count == pageSize);
        return length;
}