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

function updateLastOpportunityDate() {
	var searchResults = getResultsFromSavedSearch('customer', 'customsearch_changes_sales_opportunities');
	var success = updateRecordsInSavedSearch('customer', 'custentity_last_opportunity_date', searchResults, 0, 4, 3);

	if(success) {
		nlapiLogExecution('debug','Success', 'Updated' + success.length + ' records');
	}
}
