function main_updateProjects() {

    // Search ran on Sales Orders
    var listOfSOsToUpdate = getAllSOs();
    // Search ran on Invoices
    var listOfInvoicesToUpdate = getAllInvoices();

    // If the search results are not null or empty then go in the loop
    if (listOfSOsToUpdate != null && listOfSOsToUpdate != '') {
	for ( var i = 0; i < listOfSOsToUpdate.length; i++) {
	    var loadRecord = nlapiLoadRecord('salesorder', listOfSOsToUpdate[i].getValue('internalid', null, 'max'));

	    var updatedLYProjects = getSumOfAllSalesOrdersLastYearForProject(listOfSOsToUpdate[i].getValue('internalid', 'jobmain', 'group'));
	    nlapiSubmitField('job', listOfSOsToUpdate[i].getValue('internalid', 'jobmain', 'group'), 'custentity_last_year_pretax', updatedLYProjects, false);

	    var updatedTYProjects = getSumOfAllSalesOrdersThisYearForProject(listOfSOsToUpdate[i].getValue('internalid', 'jobmain', 'group'));
	    nlapiSubmitField('job', listOfSOsToUpdate[i].getValue('internalid', 'jobmain', 'group'), 'custentity_this_year_pretax', updatedTYProjects, false);
	}
    }

    // If the search results are not null or empty then go in the loop
    if (listOfInvoicesToUpdate != null && listOfInvoicesToUpdate != '') {
	for ( var i = 0; i < listOfInvoicesToUpdate.length; i++) {

	    var loadRecord = nlapiLoadRecord('invoice', listOfInvoicesToUpdate[i].getValue('internalid', null, 'max'));
	    nlapiLogExecution('debug', 'InternalID of invoice', listOfInvoicesToUpdate[i].getValue('internalid', null, 'max'));

	    var updatedTYInvoicesProjects = getSumOfAllInvoicesThisYearForProject(listOfInvoicesToUpdate[i].getValue('internalid', 'jobmain', 'group'));
	    nlapiLogExecution('debug', 'InternalID of invoice', listOfInvoicesToUpdate[i].getValue('internalid', 'jobmain', 'group'));

	    nlapiSubmitField('job', listOfInvoicesToUpdate[i].getValue('internalid', 'jobmain', 'group'), 'custentity_amount_invoiced_ytd', updatedTYInvoicesProjects, false);
	}
    }
}

/**
 * This function runs a search on all Sales Orders and returns the internal id
 * 
 * @returns: internal ID
 * @author: fred.maamari@acumenfactory.com
 */
function getAllSOs() {
    var filters = [];
    filters.push(new nlobjSearchFilter('trandate', null, 'onorafter', '1/1/2013'));
    filters.push(new nlobjSearchFilter('mainline', null, 'is', 'T'));
    filters.push(new nlobjSearchFilter('internalid', 'jobmain', 'noneof', '@NONE@'));

    var columns = [];
    columns.push(new nlobjSearchColumn('internalid', 'jobmain', 'group').setSort());
    columns.push(new nlobjSearchColumn('internalid', null, 'max'));

    var results = nlapiSearchRecord('salesorder', null, filters, columns);
    return results;
}

/**
 * This function runs a search on all Invoices and returns the internal id
 * 
 * @returns: Internal ID
 * @author: fred.maamari@acumenfactory.com
 */
function getAllInvoices() {
    var filters = [];
    filters.push(new nlobjSearchFilter('trandate', null, 'onorafter', '1/1/2013'));
    filters.push(new nlobjSearchFilter('mainline', null, 'is', 'T'));
    filters.push(new nlobjSearchFilter('internalid', 'jobmain', 'noneof', '@NONE@'));

    var columns = [];
    columns.push(new nlobjSearchColumn('internalid', 'jobmain', 'group').setSort());
    columns.push(new nlobjSearchColumn('internalid', null, 'max'));

    var results = nlapiSearchRecord('invoice', null, filters, columns);
    return results;
}

/**
 * This function runs a search on Sales Orders to get the total amount of all
 * sales order from last year
 * 
 * @param pProjectId:takes
 *                the project internal id
 * @returns {Number}: returns the total amount
 */
function getSumOfAllSalesOrdersLastYearForProject(pProjectId) {
    var returnAmount = 0.00;

    var filters = [];
    filters.push(new nlobjSearchFilter('mainline', null, 'is', 'T'));
    filters.push(new nlobjSearchFilter('trandate', null, 'within', 'lastfiscalyear'));
    filters.push(new nlobjSearchFilter('internalid', 'jobmain', 'is', pProjectId));

    var columns = [];
    columns.push(new nlobjSearchColumn('totalamount', null, 'sum'));
    columns.push(new nlobjSearchColumn('taxtotal', null, 'sum'));

    try {
	var results = nlapiSearchRecord('salesorder', null, filters, columns);

	if (results != '' && results != null) {
	    var totalAmount = results[0].getValue('totalamount', null, 'sum');
	    totalAmount = parseFloat(totalAmount);
	    totalAmount = (isNaN(totalAmount) ? 0 : totalAmount);

	    var taxAmount = results[0].getValue('taxtotal', null, 'sum');
	    taxAmount = parseFloat(taxAmount);
	    taxAmount = (isNaN(taxAmount) ? 0 : taxAmount);

	    returnAmount = totalAmount;

	} else {
	    nlapiLogExecution('DEBUG', arguments.callee.name, 'The search did not return any results.');
	}
    } catch (e) {
	nlapiLogExecution('DEBUG', arguments.callee.name, e.message);
    }
    nlapiLogExecution('DEBUG', arguments.callee.name, 'END');
    return returnAmount;
}
/**
 * This function runs a search on Sales Orders to get the total amount of all
 * sales order from last year
 * 
 * @param pProjectId:
 *                takes the project internal id
 * @returns {Number}: returns the total amount
 * 
 */
function getSumOfAllSalesOrdersThisYearForProject(pProjectId) {
    var returnAmount = 0.00;

    var filters = [];
    filters.push(new nlobjSearchFilter('mainline', null, 'is', 'T'));
    filters.push(new nlobjSearchFilter('trandate', null, 'within', 'thisyear'));
    filters.push(new nlobjSearchFilter('internalid', 'jobmain', 'is', pProjectId));

    var columns = [];
    columns.push(new nlobjSearchColumn('totalamount', null, 'sum'));
    columns.push(new nlobjSearchColumn('taxtotal', null, 'sum'));

    try {
	var results = nlapiSearchRecord('salesorder', null, filters, columns);

	if (results != '' && results != null) {
	    var totalAmount = results[0].getValue('totalamount', null, 'sum');
	    totalAmount = parseFloat(totalAmount);
	    totalAmount = (isNaN(totalAmount) ? 0 : totalAmount);

	    var taxAmount = results[0].getValue('taxtotal', null, 'sum');
	    taxAmount = parseFloat(taxAmount);
	    taxAmount = (isNaN(taxAmount) ? 0 : taxAmount);

	    returnAmount = totalAmount;

	} else {
	    nlapiLogExecution('DEBUG', arguments.callee.name, 'The search did not return any results.');
	}
    } catch (e) {
	nlapiLogExecution('DEBUG', arguments.callee.name, e.message);
    }
    nlapiLogExecution('DEBUG', arguments.callee.name, 'END');
    return returnAmount;
}

/**
 * This function get the sum of all invoices belonging to the same project
 * 
 * @param pProjectId
 * @returns {Number}
 */
function getSumOfAllInvoicesThisYearForProject(pProjectId) {
    var returnAmount = 0.00;

    var filters = [];
    filters.push(new nlobjSearchFilter('mainline', null, 'is', 'T'));
    filters.push(new nlobjSearchFilter('trandate', null, 'within', 'thisyear'));
    filters.push(new nlobjSearchFilter('internalid', 'jobmain', 'is', pProjectId));

    var columns = [];
    columns.push(new nlobjSearchColumn('total', null, 'sum'));
    columns.push(new nlobjSearchColumn('taxtotal', null, 'sum'));

    try {
	var results = nlapiSearchRecord('invoice', null, filters, columns);

	if (results != '' && results != null) {
	    var totalAmount = results[0].getValue('total', null, 'sum');
	    totalAmount = parseFloat(totalAmount);
	    totalAmount = (isNaN(totalAmount) ? 0 : totalAmount);

	    var taxAmount = results[0].getValue('taxtotal', null, 'sum');
	    taxAmount = parseFloat(taxAmount);
	    taxAmount = (isNaN(taxAmount) ? 0 : taxAmount);

	    returnAmount = totalAmount;

	} else {
	    nlapiLogExecution('DEBUG', arguments.callee.name, 'The search did not return any results.');
	}
    } catch (e) {
	nlapiLogExecution('DEBUG', arguments.callee.name, e.message);
    }
    nlapiLogExecution('DEBUG', arguments.callee.name, 'END');
    return returnAmount;
}
