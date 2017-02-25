/**
 * This is the scheduled script that runs a search on the records to get the latest total project costs.
 * 
 */
function main_UpdateProjectCosts() {
    // Get The search results to update
    var searchResults = getAllProjects();
    // Check if search results not null or empty
    if (searchResults != null && searchResults != '') {
	// Loop to go through every result
	for ( var i = 0; i < searchResults.length; i++) {
	    // Load the record
	    var loadedRec = nlapiLoadRecord('job', searchResults[i].getId());
	    nlapiLogExecution('DEbug', 'Project Internal ID', searchResults[i].getId());
	    // Set the custom field value to true so that it shows it was updated in case we rerun the search
	    loadedRec.setFieldValue('custentity_record_updated', 'T');
	    // Submit the record
	    nlapiSubmitRecord(loadedRec, false, true);
	}
    }
}

/**
 * Search all the projects for which we will have to update the cost values
 * 
 * @returns all the projects to update
 * @author: fred.maamari@acumenfactory.com
 */
function getAllProjects() {
    var filterExpressions = [ [ 'isinactive', 'is', 'F' ], 'and', [ 'internalid', 'noneof', '1525' ], 'and', [ [ 'custentity30', 'onorafter', 'monthsago48' ], 'or', [ 'startdate', 'onorafter', 'monthsago48' ] ] ];
    
    var results = nlapiSearchRecord('job', null, filterExpressions, null);
    return results;
}
