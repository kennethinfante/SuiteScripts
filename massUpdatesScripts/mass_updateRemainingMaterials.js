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
		nlapiLogExecution('debug','Success', 'Updated' + success.length + ' records');
	}
}

