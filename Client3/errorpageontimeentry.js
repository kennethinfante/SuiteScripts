/*
 * Author: Katrina Castro
 * Date: Nov 10, 2015
 */

/* ---- GLOBAL VARIABLES ---- */
var log = new Logger(false); //Always include a Logger object. Set parameter to true on Client Side script implementations.
var context = nlapiGetContext(); //Always include an nlobjContext object.

/* ---- ERROR HANDLING CONSTANTS ---- */
var SCRIPT_NAME = 'Error Prompt for Entering Hours';
var FROM_EMAIL = -5; //Default Administrator
var TO_EMAIL = 'katpenguin627@gmail.com';
var CC_EMAILS = null;
var CLIENT_NAME = 'Nomis Solutions';
var SCRIPT_FILE_NAME = 'errorfornomisinternal.js';

/* ---- REVISION HISTORY ---- */
// 11/10/2015 - Created Script - KAC

function beforeSubmit(type,form)
{ 
	
//	var req = request.getParameter('weekly');
//	if(req == 'T'){
	   
	
			var employee=nlapiGetFieldValue('employee');
			var nomisinternal=nlapiLookupField('employee', employee, 'custentity_nomis_internal_time_only');
			var accountlist=new Array();
			var itemlist=new Array();
			//alert(nomisinternal);
			//alert(account);
			var timecount=nlapiGetLineItemCount('timeitem');
			log.debug('timecount',timecount);
			
			for(var i=1;i<=timecount;i++){
			var account=nlapiGetLineItemValue('timeitem','customer',i);
			var accountname=nlapiGetLineItemText('timeitem','customer',i);
			var item=nlapiGetLineItemValue('timeitem','item',i);
			var project=nlapiGetLineItemValue('timeitem','casetaskevent',i);
			log.debug('account: '+account);
			log.debug('accountname: '+accountname);
			if(nomisinternal=='T' && account!='6474')
				{
					accountlist.push(accountname);
					//alert('You do not have permission to log time to your selected Account. Please update accordingly or contact your Administrator for assistance.');
					
				
				}
			if(StringUtils.isNotEmpty(item)&&StringUtils.isNotEmpty(project)&&StringUtils.isNotEmpty(account))
			{
			  var filters = new Array();
	          filters[0] = new nlobjSearchFilter( 'custrecord_timesheet_account', null, 'is',account); //Hard coding item internalID 8
	          filters[1] = new nlobjSearchFilter( 'custrecord_timesheet_project_initiative', null, 'is',project);
	          filters[2] = new nlobjSearchFilter( 'custrecord_timesheet_task', null, 'is',item);
	       
	          var itemSearch = nlapiSearchRecord( 'customrecord29', null, filters);
	          if(StringUtils.isEmpty(itemSearch))
        	  {
        	  	itemlist.push(item);
        	  	
        	  }
			}
			if(StringUtils.isNotEmpty(accountlist))
				{
				log.debug('Entered HERE!');
			    throw nlapiCreateError("Error On Time Entry", "You do not have permission to log time to your selected Account. Please update accordingly or contact your Administrator for assistance.");
				return false;
				}
			if(StringUtils.isNotEmpty(itemlist))
			{
			log.debug('Entered HERE!');
		    throw nlapiCreateError("Error On Time Entry","Tasks are now associated with specific Project Initiatives.  Please updated your Task(s) to ensure they relate to the Project Initiatives that have been entered.");
			return false;
			}
			
			}
			
		
		
			
			
	//}
}