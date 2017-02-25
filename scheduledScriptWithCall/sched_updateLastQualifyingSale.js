/**
 * Developer: Kenneth Infante
 * Email: kenneth@suitetoday.com
 * SuiteScript Version: 1.0
 *
 */

function updateLastQualifyingSale() {
	var searchResults = getResultsFromSavedSearch('customer', 'customsearch_changes_sales_orders_1000');
	var success = updateRecordsInSavedSearch('customer', 'custentity_last_sale_1000', searchResults, 0, 3, 2);

	if(success) {
		nlapiLogExecution('debug','Success', 'Updated' + success.length + ' records');
		nlapiScheduleScript('customscript_sched_update_sales_status');
	}
}
