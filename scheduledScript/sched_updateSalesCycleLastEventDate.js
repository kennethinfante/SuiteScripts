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

function updateSalesCycleLastEventDate() {
	var searchResults = getResultsFromSavedSearch('customer', 'customsearch_changes_sales_events_last_3');
	var success = updateRecordsInSavedSearch('customer', 'custentity_sales_cycle_last_event_date', searchResults, 0, 4, 3);

	if(success) {
		nlapiLogExecution('debug','Success', 'Updated' + success.length + ' records');
	}
}
