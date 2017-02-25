/**
 * Type: Scheduled Script
 * Description: This script uses customsearch924 to get the activity events of a customer.
				We update the custentity_sales_events if the one on the customer record does not match
            	We also look at all customer records and check if there is a record that is greater than 0 or empty, if there is we update its sales event field to 0
 */

function updateSalesEvents(){
	try{

	// declare needed variables
	var customerList = [];

	// this will hold the list of processed customerIds
	var customerIds = [];
	var context = nlapiGetContext();

	// get the list of activities present in the search
	var results = nlapiSearchRecord('activity','customsearch924');
	if(results){
		for(var a =0; a <results.length; a++){

			// get the value of 3rd column in the results
			var salesevents = parseInt(results[a].getValue('internalid',null,'COUNT'));
			// get the value of 4th column in the results - current sales events value
			var csalesevents = parseInt(results[a].getValue('custentity_sales_events','company','GROUP'));

			// if 3rd column is not equal to 4th column, there's an update
			if(salesevents != csalesevents)

			// update the sales events field with the new value of sales events define by the 3rd column
			nlapiSubmitField('customer',results[a].getValue('internalid','company','GROUP'), 'custentity_sales_events', salesevents);

			// add the processed id to the list of processed customer ids
			customerIds.push(results[a].getValue('internalid','company','GROUP'));
		}
		nlapiLogExecution('debug','Updating SavedSearch Customers', results.length);
	}
	nlapiLogExecution('debug','Finished Updating Saved Search');

	// new filter - internalid not in the customerIds
	var filters = [new nlobjSearchFilter('internalid',null,'noneof', customerIds)]

	// load this search
	var search = nlapiLoadSearch('customer','customsearch_clientsearch');

	// add this filter
	search.addFilter(new nlobjSearchFilter('internalid',null,'noneof', customerIds));

	// run the search - this will contain the clients that are not in the customsearch924
	var resultSet = search.runSearch();
	var searchid = 0;
	do{
		// get the first 1000 results in the filtered results
		var results = resultSet.getResults(searchid,searchid+1000);

		// if remaining usage is less than 50, exit and don't do the rest
		if(context.getRemainingUsage() <= 50){
			nlapiLogExecution('debug','Exiting script');
			break;
		}


		else{
			nlapiLogExecution('debug','Updating all Customers');
			for(var x=0; x < results.length; x++)
			{
				// erroneous
				if (context.getRemainingUsage() <= 50 )
				{
					nlapiLogExecution('debug','QUEUE SCRIPT', context.getRemainingUsage() + ' ' + searchid);
					//deployrec.setFieldValue("custscript_searchid",searchid);
					//nlapiSubmitRecord(deployrec);
					var status = nlapiScheduleScript(context.getScriptId(), context.getDeploymentId())
					if ( status == 'QUEUED' )
					break;
				}
				nlapiSubmitField('customer',results[x].getId(), 'custentity_sales_events', 0);
				if(customerIds.indexOf(results[x].getId()) != -1)
				nlapiLogExecution('debug','SHOULD NOT UPDATE THIS', results[x].getId());
				searchid++;
			}
			nlapiLogExecution('debug','Updated all Customers', results.length);
		}
	}
	// don't quite get why you are using while
	while(results.length >= 1000);
	}
	catch(ex){
		nlapiLogExecution('error', ex.getCode(), ex.getDetails());
	}
}