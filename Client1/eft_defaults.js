/**
 * @author test
 * 
 * $Id: eft_sl_payment_selection.js 289 2009-11-18 06:31:18Z ATHERTON\mmasiello $ 
 * 
 * include list : eft_lib.js
 */
 
 
 /**
  * 1. Generate a form which displays all vendor bills/expenses for 1 or all vendors/employees which require payment.
  * 2. Items will be selected by the user 'checking' applicable payments.
  * 3. On selection, an ABA entry will be created together with a flag setting on bill payment record.
  * 4. A scheduled script will be called to process any marked for payment bills/expenses.
  * 
  * Note, 
  * 	- no 2 ABA payment files can be generated at once - check before enabling processing.
  * 	- client side checking will perform data validation.
  * 
  * @param {Object} request
  * @param {Object} response
  */
 function main(request, response)
 {
 	nlapiLogExecution('DEBUG', 'EFT ABA Processing', 'EFT ABA Payment Selection');
 	
	// Ensure that if you're refreshing the page, that header details are set.
	var lRefreshPage = request.getParameter('custpage_eft_refresh_page') != null ? request.getParameter('custpage_eft_refresh_page') : 'F';
	if (lRefreshPage != 'T') 
	{
		// Check to establish whether there are any items.
		var npayLineCount = (request.getLineItemCount('custpage_eft_payment_sublist') != null) ? request.getLineItemCount('custpage_eft_payment_sublist') : 0;
		
		// Process lines based on lines (bills and journals) being marked for processing.
		var nABARef = 0;
		if (npayLineCount > 0) 
		{
			// Create ABA custom record entry and updated selected payments.	
			nABARef = processPayments(request);
		}
		
		// If an ABA record entry has been created - Kick off the scheduled process then redirect to the queue. 
		if (nABARef > 0) 
		{
			nlapiLogExecution('DEBUG', 'EFT ABA Processing', 'Schedule EFT ABA processing');
			
			// Schedule the EFT ABA processing.
			var rtnSchedule = nlapiScheduleScript('customscript_eft_sc_payment_processing', 'customdeploy_eft_sc_payment_processing');
			
			nlapiLogExecution('debug', 'EFT ABA Processing', 'Scheduling EFT ABA process. The schedule is : ' + rtnSchedule);
			
			// Redirect to the ABA File to view the file. 
			nlapiSetRedirectURL('RECORD', 'customrecord_eft_aba_file', nABARef);
		}
	}
	
	// build and render the form to the screen.
	var form = displayForm(request, lRefreshPage);
	response.writePage(form);

 }


 /**
  * Display the form.
  * 
  * @param {Object} request
  * @param {Object} lRefreshPage
  */
 function displayForm(request, lRefreshPage)
 { 
   	nlapiLogExecution('DEBUG', 'EFT ABA Processing', 'EFT ABA Payment Selection')


	// Ensure that header details are re-entered if you're refreshing the page.

	var strABAAccount = (lRefreshPage == 'T' && request.getParameter('custpage_eft_aba_account') != null) ? request.getParameter('custpage_eft_aba_account') : '';
	var strVendor = (lRefreshPage == 'T' && request.getParameter('custpage_eft_vendor') != null) ? request.getParameter('custpage_eft_vendor') : '';
	var strEmployee = (lRefreshPage == 'T' && request.getParameter('custpage_eft_employee') != null) ? request.getParameter('custpage_eft_employee') : '';
	var strPayRef = (lRefreshPage == 'T' && request.getParameter('custpage_eft_payment_ref') != null) ? request.getParameter('custpage_eft_payment_ref') : '';
	var strDate = (lRefreshPage == 'T' && request.getParameter('custpage_eft_process_date') != null) ? request.getParameter('custpage_eft_process_date') : '';
	var strPostPeriod = (lRefreshPage == 'T' && request.getParameter('custpage_eft_postingperiod') != null) ? request.getParameter('custpage_eft_postingperiod') : '';
	var strAPAccount = (lRefreshPage == 'T' && request.getParameter('custpage_eft_ap_account') != null) ? request.getParameter('custpage_eft_ap_account') : '';
	var strDateFrom = (lRefreshPage == 'T' && request.getParameter('custpage_eft_date_from') != null) ? request.getParameter('custpage_eft_date_from') : '';
	var strDateTo = (lRefreshPage == 'T' && request.getParameter('custpage_eft_date_to') != null) ? request.getParameter('custpage_eft_date_to') : '';
	
	// Create the form.
	var form = nlapiCreateForm('EFT - Bill Payments');
	
	// Client side validation.    	
	form.setScript('customscript_eft_cs_payment_selection');
    
    var fld = form.addField('custpage_eft_aba_account','select', 'Bank account', 'customrecord_eft_bank_company_id');
	fld.setMandatory(false);
 fld.setDefaultValue(strABAAccount);


  	fld = form.addField('custpage_eft_ap_account','select', 'A/P account');
	fld.setMandatory(false);
	
	// Set a default list of AP Accounts off type Account Payable.
	var searchResults = nlapiSearchRecord('account', 'customsearch_eft_ap_account_search', null, null);	
	
	// Iterate over returned saved search values.
	for (var i = 0; !isNullorEmpty(searchResults) && i < searchResults.length; i++) 
	{
		fld.addSelectOption(searchResults[i].getValue('internalid'),searchResults[i].getValue('name'), false);
		strAPAccount = ( strAPAccount == null || strAPAccount == '' ) ? searchResults[i].getValue('internalid') : strAPAccount;
	}
	fld.setDefaultValue(strAPAccount);
	
	fld = form.addField('custpage_eft_process_date','date','Date to be processed');
    fld.setMandatory(false);
	fld.setDefaultValue(strDate);
		
	fld = form.addField('custpage_eft_postingperiod','select', 'Posting period', 'accountingperiod');
   	fld.setMandatory(false);
	
	// Only update the posting period on refresh. Otherwise the current period defaults.
	if (lRefreshPage == 'T') 
	{
		fld.setDefaultValue(strPostPeriod);
	}
	
	fld = form.addField('custpage_eft_payment_ref','text','ABA file reference note');
    fld.setMandatory(false);
	fld.setDefaultValue(strPayRef);
	   		
	fld = form.addField('custpage_eft_vendor','select', 'Vendor', 'vendor');
	fld.setMandatory(false);
	fld.setDefaultValue(strVendor);
		
	fld = form.addField('custpage_eft_employee','select', 'Employee', 'employee');
	fld.setMandatory(false);
	fld.setDefaultValue(strEmployee);
	
	fld = form.addField('custpage_eft_date_from','date','Due date from');
    fld.setMandatory(false);
	fld.setDefaultValue(strDateFrom);

	fld = form.addField('custpage_eft_date_to','date','to');
    fld.setMandatory(false);
	fld.setDefaultValue(strDateTo);
	
	// Set display fields - lines select and sum(amount)
	fld = form.addField('custpage_eft_payment_lines', 'integer', 'Lines Selected');
    fld.setDefaultValue('0');
    fld.setDisplayType('inline');
    fld.setLayoutType('normal','startcol');
    
	fld = form.addField('custpage_eft_total_amount','currency', 'Total Payment Amount');
	fld.setDefaultValue('0.00');
	fld.setDisplayType('inline');
    fld.setLayoutType('normal','startcol');
  
  	// Set a form variable which determines the last EFT File.
	fld = form.addField('custpage_eft_last_eft_id','text','Last file to be processed');
    fld.setDisplayType('hidden');
	
	// Set a form variable which determines whether the EFT process should be aborted.
	fld = form.addField('custpage_eft_abort','checkbox','Abort');
    fld.setDisplayType('hidden');
	
	// Set a page refresh field to be used when either the vendor, AP Account, date to or from is altered.
	fld = form.addField('custpage_eft_refresh_page','checkbox','Refresh Page');
    fld.setDisplayType('hidden');
	fld.setDefaultValue(lRefreshPage);
	
	// Add sublist of available bill payments based on Vendor selection.
	getBillPaymentLines(form, strVendor, strEmployee, strAPAccount, strDateFrom, strDateTo);
 	
    // Add buttons (Submit and Reset)
    form.addSubmitButton('Submit');
    form.addResetButton();
            
	return form;
 }
	
	
 /**
  * Get bill payments for display - may vary depend on whether the varying filters have been entered.
  * 
  * @param {Object} form
  * @param {Object} strVendor
  * @param {Object} strEmployee
  * @param {Object} strAPAccount
  * @param {Object} strDateFrom
  * @param {Object} strDateTo
  */
 function getBillPaymentLines(form, strVendor, strEmployee, strAPAccount, strDateFrom, strDateTo)
 { 
    // Add sublist.
    var sublist = form.addSubList('custpage_eft_payment_sublist','list', 'Select Bill Payments');

    // Add the select column plus Mark and Unmark columns.
	sublist.addField('custpage_eft_pay', 'checkbox', 'Pay');
	sublist.addButton('custpage_eft_mark', 'Mark All', 'eftMarkAll()');
	sublist.addButton('custpage_eft_mark', 'Unmark All', 'eftUnmarkAll()');

	// The following are populated form the savedsearch.
	// Add the vendor and bill payment transaction internal id - to be used for referencing the selected transaction back to the record.
	fld = sublist.addField('name_display','text','Payee');

   	fld = sublist.addField('internalid','integer','ID');
    fld.setDisplayType('hidden');
	
	fld = sublist.addField('type','text','Type');
	fld = sublist.addField('number','text','Reference Number');
	fld = sublist.addField('trandate','date','Date')
	fld = sublist.addField('duedate','date','Due Date');
	fld = sublist.addField('amount','currency','Amount');
	fld = sublist.addField('amountremaining','currency','Amount Remaining');
	fld = sublist.addField('custpage_eft_payment','currency','Payment Amount');
	fld.setDisplayType('entry');
		
	// Use defined SavedSearch for line retreival.
	// Add ap account and vendor filter. 
	strAPAccount = (strAPAccount == '') ? '@NONE@' : strAPAccount;
	var nPos = 0;
	var filters = new Array();
	filters[nPos++] = new nlobjSearchFilter('account', null, 'anyof', strAPAccount);	

	// Note that the vendor filter is only used when entered.
	if ( !isNullorEmpty(strVendor) ) 
	{		
		filters[nPos++] = new nlobjSearchFilter('internalid', 'vendor', 'anyof', strVendor);	
	}
	
	// Note that the employee filter is only used when entered.
	if ( !isNullorEmpty(strEmployee) ) 
	{		
		filters[nPos++] = new nlobjSearchFilter('internalid', 'employee', 'anyof', strEmployee);	
	}
	
	// Add from due date filters.
	if ( !isNullorEmpty(strDateFrom) ) 
	{		
		filters[nPos++] = new nlobjSearchFilter('duedate', null, 'onorafter', strDateFrom);	
	}
	
	// Add To due date filter.
	if ( !isNullorEmpty(strDateTo) ) 
	{		
		filters[nPos++] = new nlobjSearchFilter('duedate', null, 'onorbefore', strDateTo);
	}
	
	// Create search with which to populate the Sublist
	// Set the eft payment amount to the amount remaining.
    var columns = new Array();
    columns[0] = new nlobjSearchColumn('name');
    columns[1] = new nlobjSearchColumn('internalid');
    columns[2] = new nlobjSearchColumn('type');
    columns[3] = new nlobjSearchColumn('number');
    columns[4] = new nlobjSearchColumn('trandate');
    columns[5] = new nlobjSearchColumn('duedate');
    columns[6] = new nlobjSearchColumn('amount');
    columns[7] = new nlobjSearchColumn('amountremaining');
	
	// Populate the sublist from the search.
    var searchResults = nlapiSearchRecord('transaction', 'customsearch_eft_vbill_payments', filters, columns);
    sublist.setLineItemValues(searchResults);    
	
	return true;
 }

	
 /**
  * Create ABA record and update payments where payments have been marked.
  * 
  * @param {Object} request
  */
 function processPayments(request)
 {
 	var nABAId = 0;
	var strLinesToBeProcessedId = '';
	var strLinesToBeProcessedAmt = '';
	
	// Loop through item lines updating selected vendor bills and journals.
	for (var i = 1; i <= request.getLineItemCount('custpage_eft_payment_sublist'); i++) 
	{
		// Only process selected payments.
		if (request.getLineItemValue('custpage_eft_payment_sublist', 'custpage_eft_pay', i) == 'T' && 
		    request.getLineItemValue('custpage_eft_payment_sublist', 'custpage_eft_payment', i) > 0) 
		{
			// Update the payment string - one for Internal Id's, another for amount. This is to cater to the saved search return limitations (4000 characters).
			// Ensure that a new line delimiter is added if required. 
			strLinesToBeProcessedId = ( strLinesToBeProcessedId.length > 0 ? strLinesToBeProcessedId + '|' : strLinesToBeProcessedId );
			strLinesToBeProcessedId += request.getLineItemValue('custpage_eft_payment_sublist', 'internalid', i) 

			strLinesToBeProcessedAmt = ( strLinesToBeProcessedAmt.length > 0 ? strLinesToBeProcessedAmt + '|' : strLinesToBeProcessedAmt );
			strLinesToBeProcessedAmt += request.getLineItemValue('custpage_eft_payment_sublist', 'custpage_eft_payment', i) 									
		}		
	}
	
	// Create ABA record. Ensure that it is only created if there are valid available entries.
	if ( strLinesToBeProcessedId.length > 0 ) 
	{
		nABAId = createABAEntry(request, strLinesToBeProcessedId, strLinesToBeProcessedAmt );
		nlapiLogExecution('debug', 'EFT ABA Processing', 'ABA record entry created internal id : ' + nABAId);
	}
				
 	return nABAId;
 }


 /**
  *  Create ABS Record entry.
  *  
  * @param {Object} request
  * @param {Object} strLinesToBeProcessedId
  * @param {Object} strLinesToBeProcessedAmt
  */
 function createABAEntry(request, strLinesToBeProcessedId, strLinesToBeProcessedAmt)
 {
	// Create an ABA custom record.
	var record = nlapiCreateRecord('customrecord_eft_aba_file');
 	record.setFieldValue('custrecord_eft_aba_account', request.getParameter('custpage_eft_aba_account'));
	record.setFieldValue('custrecord_eft_aba_ref_note', request.getParameter('custpage_eft_payment_ref'));
	record.setFieldValue('custrecord_eft_aba_process_date', request.getParameter('custpage_eft_process_date'));
	record.setFieldValue('custrecord_eft_aba_file_processed', PAYQUEUED);
	record.setFieldValue('custrecord_eft_payments_for_process_id',  strLinesToBeProcessedId);
	record.setFieldValue('custrecord_eft_payments_for_process_amt', strLinesToBeProcessedAmt);
	record.setFieldValue('custrecord_eft_postingperiod',  request.getParameter('custpage_eft_postingperiod'));
	record.setFieldValue('custrecord_eft_ap_account', request.getParameter('custpage_eft_ap_account'));
	
	// Return true of false based on whether an update has occurred.
	return nlapiSubmitRecord(record, true);
 }