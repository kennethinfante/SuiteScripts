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

function updateOpportunitiesProjectedTotal() {

	var searchResults = getResultsFromSavedSearch('opportunity', 'customsearch_opportunity_projected_total');
	var success = updateRecordsInSavedSearch('customer', 'custentity_opportunities_projected_total', searchResults, 0, 1, 2);
	if(success) {
		nlapiLogExecution('error','Success', 'Updated ' + success.length + ' records');
	}
}

