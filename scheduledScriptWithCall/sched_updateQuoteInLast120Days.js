/**
 * Developer: Kenneth Infante
 * Email: kenneth@suitetoday.com
 * SuiteScript Version: 1.0
 *
 */

function updateQuoteInLast120Days() {
	var searchResults = getResultsFromSavedSearch('customer', 'customsearch_changes_sales_quotes');
	var success = updateRecordsInSavedSearch('customer', 'custentity_last_quote_date', searchResults, 0, 7, 6);

	if(success) {
		nlapiLogExecution('debug','Success', 'Updated' + success.length + ' records');
		nlapiScheduleScript('customscript_sched_update_sales_status');
	}
}


