/**
 * The recordType (internal id) corresponds to the "Applied To" record in your script deployment. 
 * @appliedtorecord recordType
 *   
 * @returns {Boolean} True to continue save, false to abort save
 */
var TimeEntryValidation = new (function TimeEntryValidation() {
	
});

TimeEntryValidation.saveRecord = function(type){
	
	
	var onweekly = false;
	if(nlapiGetFieldValue("entryformquerystring")){
		var parArr = nlapiGetFieldValue("entryformquerystring").split("&");		
		if(parArr)
		{
			for(var i = 0; i < parArr.length; i++){
				parr = parArr[i].split("=");					
				if(parr[1]){
					if(parr[0]){
						switch(parr[0])
						{
							case "weekly":
								if(parr[1].split("%20").join(" ") == "T");
								onweekly = true;
							break;
							default:							
						}
					}
				}
			}
		}
	}
	
	if(idCustomer && idProject && idItem && !onweekly){
		var idEmployee = nlapiGetFieldValue('employee');
		var isNomisInternal = nlapiGetFieldValue('custcol_scd_nomis_internal');
		var idCustomer = nlapiGetFieldValue('customer');
		var idProject = nlapiGetFieldValue('casetaskevent');
		var idItem = nlapiGetFieldValue('item');
		
		
		if(isNomisInternal == 'T' && idCustomer != 6474){
			alert("You do not have permission to log time to your selected Account. Please update accordingly or contact your Administrator for assistance.");
			return false;
		}
		var aFilter = new Array();
		aFilter.push(new nlobjSearchFilter('internalidnumber', null, 'equalto', idProject));
		aFilter.push(new nlobjSearchFilter('company', null, 'anyof', idCustomer));
		aFilter.push(new nlobjSearchFilter('custevent_scd_service_item', null, 'anyof', idItem));
		
		var res = nlapiSearchRecord('task', null, aFilter);
		
		if(!res){
			alert("Tasks are now associated with specific Project Initiatives.  Please updated your Task(s) to ensure they relate to the Project Initiatives that have been entered.");
			return false;
		}
	}
	else if(onweekly){
		
		for(var i=1; i<= nlapiGetLineItemCount('timeitem'); i++){
			var Customer = nlapiGetLineItemValue('timeitem','customer', i);
			var Project = nlapiGetLineItemValue('timeitem','casetaskevent', i);
			var Item = nlapiGetLineItemValue('timeitem','item', i);
			var NomisInternal = nlapiGetLineItemValue('timeitem','custcol_scd_nomis_internal',i);
			if(NomisInternal == 'T' && Customer != 6474){
				alert("You do not have permission to log time to your selected Account. Please update accordingly or contact your Administrator for assistance.");
				return false;
			}
			
			if(idCustomer && idProject && idItem ){
				var aFilter = new Array();
				aFilter.push(new nlobjSearchFilter('internalidnumber', null, 'equalto', Project));
				aFilter.push(new nlobjSearchFilter('company', null, 'anyof', Customer));
				aFilter.push(new nlobjSearchFilter('custevent_scd_service_item', null, 'anyof', Item));
				
				var res = nlapiSearchRecord('task', null, aFilter);
				
				if(!res){
					alert("Tasks are now associated with specific Project Initiatives.  Please updated your Task(s) to ensure they relate to the Project Initiatives that have been entered.");
					return false;
				}
			}
		}
	}
	else{
		alert('Incomplete Information');
		return false;
	}

	return true;
};

TimeEntryValidation.validateLine = function(type){
	if( type == 'timeitem'){
		
		var idCustomer = nlapiGetCurrentLineItemValue(type,'customer');
		var idProject = nlapiGetCurrentLineItemValue(type,'casetaskevent');
		var idItem = nlapiGetCurrentLineItemValue(type,'item');
		
		if(nlapiGetCurrentLineItemValue(type, 'customer') && nlapiGetCurrentLineItemValue(type, 'item')){
			
			var aFilter = new Array();
			aFilter.push(new nlobjSearchFilter('internalidnumber', null, 'equalto', idProject));
			aFilter.push(new nlobjSearchFilter('company', null, 'anyof', idCustomer));
			aFilter.push(new nlobjSearchFilter('custevent_scd_service_item', null, 'anyof', idItem));
			
			var res = nlapiSearchRecord('task', null, aFilter);
			
			if(!res){
				alert('Tasks are now associated with specific Contract/Activity. Please update your Task(s) to ensure they relate to the Contract/Activity that has been entered on this entry.');
				return false;
			}
		}
	}
	return true;
}
TimeEntryValidation.postSourcing = function(type, name, linenum){
	nlapiLogExecution('debug','postsourcing');
	var idEmployee = nlapiGetFieldValue('employee');
	var isNomisInternal = nlapiGetFieldValue('custcol_scd_nomis_internal');
	var idCustomer = nlapiGetFieldValue('customer');
	var idProject = nlapiGetFieldValue('casetaskevent');
	var idItem = nlapiGetFieldValue('item');
	
	if(name == 'customer'){
		
		if(isNomisInternal == 'T' && idCustomer != 6474){
			alert("You do not have permission to log time to your selected Account. Please update accordingly or contact your Administrator for assistance.");
			return false;
		}	
	}
	else if(name == 'item' && nlapiGetFieldValue('customer') && nlapiGetFieldValue('item')){
		
		var aFilter = new Array();
		aFilter.push(new nlobjSearchFilter('internalidnumber', null, 'equalto', idProject));
		aFilter.push(new nlobjSearchFilter('company', null, 'anyof', idCustomer));
		aFilter.push(new nlobjSearchFilter('custevent_scd_service_item', null, 'anyof', idItem));
		
		var res = nlapiSearchRecord('task', null, aFilter);
		
		if(!res){
			alert('Tasks are now associated with specific Contract/Activity. Please update your Task(s) to ensure they relate to the Contract/Activity that has been entered on this entry.');
			return false;
		}
	}
	else if( type == 'timeitem' && name == 'customer'){
		
		var idCustomer = nlapiGetCurrentLineItemValue(type,'customer');
		var isNomisInternal = nlapiGetCurrentLineItemValue(type, 'custcol_scd_nomis_internal');
		
		if(isNomisInternal == 'T' && idCustomer != 6474){
			alert('You do not have permission to log time to your selected Account. Please update accordingly or contact your Administrator for assistance.');
			return false;
		}	
	}
	else if( type == 'timeitem' && name == 'item'){
		
		var idCustomer = nlapiGetCurrentLineItemValue(type,'customer');
		var idProject = nlapiGetCurrentLineItemValue(type,'casetaskevent');
		var idItem = nlapiGetCurrentLineItemValue(type,'item');
		
		if(nlapiGetCurrentLineItemValue(type, 'customer') && nlapiGetCurrentLineItemValue(type, 'item')){
			
			var aFilter = new Array();
			aFilter.push(new nlobjSearchFilter('internalidnumber', null, 'equalto', idProject));
			aFilter.push(new nlobjSearchFilter('company', null, 'anyof', idCustomer));
			aFilter.push(new nlobjSearchFilter('custevent_scd_service_item', null, 'anyof', idItem));
			
			var res = nlapiSearchRecord('task', null, aFilter);
			
			if(!res){
				alert('Tasks are now associated with specific Contract/Activity. Please update your Task(s) to ensure they relate to the Contract/Activity that has been entered on this entry.');
				return false;
			}
		}
	}
	
	return true;
};

function hideButtonPI() {
	jQuery( "#copytimesheet" ).val("Copy Selected Week");
        jQuery( "#secondarycopytimesheet" ).val("Copy Selected Week");
}