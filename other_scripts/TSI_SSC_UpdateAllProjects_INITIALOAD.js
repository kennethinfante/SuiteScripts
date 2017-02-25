function main(){
	var columns = [];
	columns.push(new nlobjSearchColumn('internalid'));
	columns.push(columns[columns.length - 1].setSort(false));// sort ascending internalid
	var filters = [];
	filters.push(new nlobjSearchFilter('internalid', null, 'greatherthan', 644));
	var arrProject = nlapiSearchRecord('job', null, null, columns);

var netTotal = 0.00;

	//for(var i = 0; i < arrProject.length; i++){
	//for(var i = 151; i < arrProject.length; i++){
	//for(var i = 263; i < arrProject.length; i++){
	//for(var i = 368; i < arrProject.length; i++){
	//for(var i = 476; i < arrProject.length; i++){
	for(var i = 577; i < arrProject.length; i++){
		nlapiLogExecution('debug', arguments.callee.name,'current index i : ' + i);
		var projectId = arrProject[i].getId();
		nlapiLogExecution('debug', arguments.callee.name,'processing project : '+projectId);
		
		// THIS PART IS TO PROCESS THE PROJECT TOTALS FIELD ('custentity6')
		// search for at least one SO related to this record
		var sumSO = getSumOfAllSalesOrderForProject(projectId);
		var sumCM = getSumOfAllCreditMemoForProject(projectId);
		
		netTotal = sumSO + sumCM; // credit memos are negative values
		netTotal = (netTotal == '' | netTotal == null ? 0.00 : netTotal);	

		
		if(netTotal == 0){
			nlapiLogExecution('debug', arguments.callee.name,'there is nothing for the sum of SO and CM for project ' + projectId + '. The project total be set to 0.');
			nlapiSubmitField('job', projectId, 'custentity6',0);
		} else {
			// get one SO or CM related to that project, load and submit it to trigger the SUE script
			if(sumSO != 0){
				
				var idSO = getFirstSORelatedToProject(projectId);
				nlapiLogExecution('debug', arguments.callee.name,'A SO has been found, will load and submit SO ' + idSO + ' to trigger SUE');
				nlapiSubmitRecord(nlapiLoadRecord('salesorder', idSO), false, true);
			} else {
				if(sumCM != 0){
					var idCM = getFirstCMRelatedToProject(projectId);
					nlapiLogExecution('debug', arguments.callee.name,'A CM has been found, will load and submit CM ' + idCM + ' to trigger SUE');
					nlapiSubmitRecord(nlapiLoadRecord('creditmemo', idCM), false, true);
				}
			}
		}

			
		
		// THIS PART IS TO PROCESS THE AMOUNT INVOICED FIELD('custentity_amount_invoiced')
		var sumInv = getSumOfAllInvoiceForProject(projectId);
		
		if(sumInv == 0){
			nlapiLogExecution('debug', arguments.callee.name,'there is nothing for the sum of invoice for project ' + projectId + '. The amount invoiced will be set to 0.');
			nlapiSubmitField('job', projectId, 'custentity_amount_invoiced',0);
		} else {
			//var idInv = getFirstInvRelatedToProject(projectId);
			var idInv = getLastInvRelatedToProject(projectId);
			nlapiLogExecution('debug', arguments.callee.name,'A Invoice has been found, will load and submit invoice ' + idInv + ' to trigger SUE');
			try{
				nlapiSubmitRecord(nlapiLoadRecord('invoice', idInv), false, true);	
			} catch(e) {
				nlapiLogExecution('debug', arguments.callee.name, 'issue occured');
				nlapiLogExecution('debug', arguments.callee.name, e.getDetails());
				
				nlapiLogExecution('debug', arguments.callee.name, '!!!!!!it it not possible to load submit this invoice as it is locked.');
				nlapiLogExecution('debug', arguments.callee.name, 'Will set manually the sum of invoice.');
					
				var newAmountBalanceToInvoice = netTotal - sumInv;
				nlapiSubmitField('job', projectId, 'custentity_balance_to_invoice', newAmountBalanceToInvoice);		
					
			}
			
			
			
		}
		
	}
}



function getSumOfAllSalesOrderForProject(pProjectId){
	var returnAmount = 0.00;
	
	var filters = [];
	filters.push(new nlobjSearchFilter('voided', null, 'is', 'F'));
	filters.push(new nlobjSearchFilter('internalid', 'jobmain', 'is', pProjectId));
	filters.push(new nlobjSearchFilter('mainline', null, 'is', 'T'));
	
	var columns = [];
	columns.push(new nlobjSearchColumn('totalamount', null , 'sum'));		
	columns.push(new nlobjSearchColumn('taxtotal', null , 'sum'));
			
	try {
		var results = nlapiSearchRecord('salesorder', null,filters, columns);
		
		if (results != '' && results != null) {
			var totalAmount = results[0].getValue('totalamount', null , 'sum');
			totalAmount = parseFloat(totalAmount);
			totalAmount = (isNaN(totalAmount) ? 0 : totalAmount);
			
			var taxAmount = results[0].getValue('taxtotal', null , 'sum');
			taxAmount = parseFloat(taxAmount);
			taxAmount = (isNaN(taxAmount) ? 0 : taxAmount);
			
			returnAmount = totalAmount - taxAmount;
		} else {
			nlapiLogExecution('DEBUG', arguments.callee.name, 'The search did not return any results.');
		}
	} catch (e) {
		nlapiLogExecution('DEBUG', arguments.callee.name, e.message);
	}
	
	return returnAmount;
}



function getSumOfAllCreditMemoForProject(pProjectId){
	var returnAmount = 0.00;
	
	var filters = [];
	filters.push(new nlobjSearchFilter('voided', null, 'is', 'F'));
	filters.push(new nlobjSearchFilter('internalid', 'jobmain', 'is', pProjectId));
	filters.push(new nlobjSearchFilter('mainline', null, 'is', 'T'));
	
	var columns = [];
	columns.push(new nlobjSearchColumn('totalamount', null , 'sum'));		
	columns.push(new nlobjSearchColumn('taxtotal', null , 'sum'));
			
	try {
		var results = nlapiSearchRecord('creditmemo', null,filters, columns);
		
		if (results != '' && results != null) {
			var totalAmount = results[0].getValue('totalamount', null , 'sum');
			totalAmount = parseFloat(totalAmount);
			totalAmount = (isNaN(totalAmount) ? 0 : totalAmount);
			
			var taxAmount = results[0].getValue('taxtotal', null , 'sum');
			taxAmount = parseFloat(taxAmount);
			taxAmount = (isNaN(taxAmount) ? 0 : taxAmount);
			
			returnAmount = totalAmount - taxAmount;
		} else {
			nlapiLogExecution('DEBUG', arguments.callee.name, 'The search did not return any results.');
		}
	} catch (e) {
		nlapiLogExecution('DEBUG', arguments.callee.name, e.message);
	}
	
	return returnAmount;
}







function getFirstSORelatedToProject(pProjectId){
	var returnValue;
	var filters = [];
	filters.push(new nlobjSearchFilter('voided', null, 'is', 'F'));
	filters.push(new nlobjSearchFilter('internalid', 'jobmain', 'is', pProjectId));
	filters.push(new nlobjSearchFilter('mainline', null, 'is', 'T'));
	
	var columns = [];
			
	try {
		var results = nlapiSearchRecord('salesorder', null,filters, columns);
		
		if (results != '' && results != null) {
			returnValue = results[0].getId();
		} else {
			nlapiLogExecution('DEBUG', arguments.callee.name, 'The search did not return any results.');
		}
	} catch (e) {
		nlapiLogExecution('DEBUG', arguments.callee.name, e.message);
	}
	
	return returnValue;
}

function getFirstCMRelatedToProject(pProjectId){
	var returnValue;
	var filters = [];
	filters.push(new nlobjSearchFilter('voided', null, 'is', 'F'));
	filters.push(new nlobjSearchFilter('internalid', 'jobmain', 'is', pProjectId));
	filters.push(new nlobjSearchFilter('mainline', null, 'is', 'T'));
	
	var columns = [];
			
	try {
		var results = nlapiSearchRecord('creditmemo', null,filters, columns);
		
		if (results != '' && results != null) {
			returnValue = results[0].getId();
		} else {
			nlapiLogExecution('DEBUG', arguments.callee.name, 'The search did not return any results.');
		}
	} catch (e) {
		nlapiLogExecution('DEBUG', arguments.callee.name, e.message);
	}
	
	return returnValue;
}



function getSumOfAllInvoiceForProject(pProjectId){
	var returnAmount = 0.00;
	
	var filters = [];
	filters.push(new nlobjSearchFilter('voided', null, 'is', 'F'));
	filters.push(new nlobjSearchFilter('internalid', 'jobmain', 'is', pProjectId));
	filters.push(new nlobjSearchFilter('mainline', null, 'is', 'T'));
	
	var columns = [];
	columns.push(new nlobjSearchColumn('totalamount', null , 'sum'));		
	columns.push(new nlobjSearchColumn('taxtotal', null , 'sum'));
			
	try {
		var results = nlapiSearchRecord('invoice', null,filters, columns);
		
		if (results != '' && results != null) {
			var totalAmount = results[0].getValue('totalamount', null , 'sum');
			totalAmount = parseFloat(totalAmount);
			totalAmount = (isNaN(totalAmount) ? 0 : totalAmount);
			
			var taxAmount = results[0].getValue('taxtotal', null , 'sum');
			taxAmount = parseFloat(taxAmount);
			taxAmount = (isNaN(taxAmount) ? 0 : taxAmount);
			
			returnAmount = totalAmount - taxAmount;
		} else {
			nlapiLogExecution('DEBUG', arguments.callee.name, 'The search did not return any results.');
		}
	} catch (e) {
		nlapiLogExecution('DEBUG', arguments.callee.name, e.message);
	}
	
	return returnAmount;
}




function getFirstInvRelatedToProject(pProjectId){
	var returnValue;
	
	var filters = [];
	filters.push(new nlobjSearchFilter('voided', null, 'is', 'F'));
	filters.push(new nlobjSearchFilter('internalid', 'jobmain', 'is', pProjectId));
	filters.push(new nlobjSearchFilter('mainline', null, 'is', 'T'));
	
	var columns = [];
			
	try {
		var results = nlapiSearchRecord('invoice', null,filters, columns);
		
		if (results != '' && results != null) {
			returnValue = results[0].getId();
		} else {
			nlapiLogExecution('DEBUG', arguments.callee.name, 'The search did not return any results.');
		}
	} catch (e) {
		nlapiLogExecution('DEBUG', arguments.callee.name, e.message);
	}
	
	return returnValue;
}



function getLastInvRelatedToProject(pProjectId){
	var returnValue;
	
	var filters = [];
	filters.push(new nlobjSearchFilter('voided', null, 'is', 'F'));
	filters.push(new nlobjSearchFilter('internalid', 'jobmain', 'is', pProjectId));
	filters.push(new nlobjSearchFilter('mainline', null, 'is', 'T'));
	
	var columns = [];
	columns.push(new nlobjSearchColumn('internalid', null, 'max'));
			
	try {
		var results = nlapiSearchRecord('invoice', null,filters, columns);
		
		if (results != '' && results != null) {
			returnValue = results[0].getValue('internalid', null, 'max');
		} else {
			nlapiLogExecution('DEBUG', arguments.callee.name, 'The search did not return any results.');
		}
	} catch (e) {
		nlapiLogExecution('DEBUG', arguments.callee.name, e.message);
	}
	
	return returnValue;
}

function getSumOfAllBudgetedHoursForProject(pProjectId){
	var returnValue = 0.00;
	
	var filters = [];
	filters.push(new nlobjSearchFilter('company', null, 'is', pProjectId));
	
	var columns = [];
	columns.push(new nlobjSearchColumn('custevent16', null , 'sum'));		
			
	try {
		var results = nlapiSearchRecord('projecttask', null,filters, columns);
		
		if (results != '' && results != null) {
			returnValue = results[0].getValue('custevent16', null , 'sum');
		} else {
			nlapiLogExecution('DEBUG', arguments.callee.name, 'The search did not return any results.');
		}
	} catch (e) {
		nlapiLogExecution('DEBUG', arguments.callee.name, e.message);
	}
	
	return returnValue;
}


function getFirstProjectTaskForProject(pProjectId){
	var returnValue = 0.00;
	
	var filters = [];
	filters.push(new nlobjSearchFilter('company', null, 'is', pProjectId));
	
	var columns = [];
			
	try {
		var results = nlapiSearchRecord('projecttask', null,filters, columns);
		
		if (results != '' && results != null) {
			returnValue = results[0].getId();
		} else {
			nlapiLogExecution('DEBUG', arguments.callee.name, 'The search did not return any results.');
		}
	} catch (e) {
		nlapiLogExecution('DEBUG', arguments.callee.name, e.message);
	}
	
	return returnValue;
}