/**
Type: User Event
Name: Services Report 1
Summary: Get user selected report criteria and pass to Suitelet script.
**/

//Remove two forward slashes from the start of a line, to uncomment that line.
//Add two forward slashes to the start of a line, to comment that line.

/* Production Account */
//var FROM_EMPLOYEE = 'MemoryTable2B.user else MemoryTable2C.user';
//var TO_EMPLOYEE = 'MemoryTable2B.user else MemoryTable2C.user';
//var maxEmailCount = '80';

/* Development Account */
var FROM_EMPLOYEE = '38499';
var TO_EMPLOYEE = '38499';
var maxEmailCount = '2';

var memoryTable1A = new Array();
var memoryTable1B = new Array();
var memoryTable1C = new Array();
var memoryTable2A = new Array();
var memoryTable2B = new Array();
var memoryTable2C = new Array();
var memoryTable3B = new Array();
var memoryTable3C = new Array();
var memoryTable4C = new Array();
var memoryTable4D = new Array();
var memoryTable5C = new Array();
var memoryTable6C = new Array();

function Services_Report_1A(stType)
{
   var stContextError = 'Error Notification';
   var stContextDescription = '';
	
    //GET CONTEXT
    if (stType == 'edit')
    {
       nlapiLogExecution('debug', 'Exit Log', stType + ' Type of Operation Unsupported.  Exit Before Load Successfully.');
       return;
    } 
    // EXIT FUNCTION	   

    memoryTable1A['eventtype'] = stType;
		
    // GET SERVER DATE
    var srDate = new Date();
    var sr_dateToString = nlapiDateToString(srDate);
    var sr_dateArr = sr_dateToString.split('/');
	
    var sr_defaultStartdate = nlapiStringToDate('1/1/' + sr_dateArr[2]);
    var sr_defaultEnddate = nlapiStringToDate('12/31/' + sr_dateArr[2]);

    memoryTable2A['start_date'] = nlapiDateToString(sr_defaultStartdate);
    memoryTable2A['end_date'] = nlapiDateToString(sr_defaultEnddate);
	
    nlapiSetFieldValue('custrecord_sr_start_date', memoryTable2A['start_date']);
    nlapiSetFieldValue('custrecord_sr_end_date', memoryTable2A['end_date']);
}

function Services_Report_1B(stType)
{
   try 
   {
     var stContextError = 'Error Notification';
     var stContextDescription = '';
		
     // GET INTERNAL ID
     memoryTable1B['internalid'] = nlapiGetRecordId();

     if (isEmpty(memoryTable1B['internalid']))
     {
       memoryTable1B['internalid'] = 'N/A';
     }
		
     // GET CONTEXT
     memoryTable2B['user'] = nlapiGetContext().getUser();		
        
     // GET DATA 1
     var recNew = nlapiGetNewRecord();
     memoryTable3B['custrecord_sr_start_date'] = recNew.getFieldValue('custrecord_sr_start_date');        
     memoryTable3B['custrecord_sr_end_date'] = recNew.getFieldValue('custrecord_sr_end_date');
     memoryTable3B['custrecord_sr_email'] = recNew.getFieldValue('custrecord_sr_email');
     
     stContextDescription = 'Error getting data for Services Report Internal ID ' + memoryTable1B['internalid'];
 		
     var startDate = nlapiStringToDate(memoryTable3B['custrecord_sr_start_date']);
     var endDate = nlapiStringToDate(memoryTable3B['custrecord_sr_end_date']);
		
     // DATE VALIDATION
     if (startDate.getTime() > endDate.getTime())
     {
     //DISPLAY GO BACK ERROR PAGE AND EXIT SCRIPT    
	 throw nlapiCreateError('Error Notification', 'Start Date must be on or before End Date.');
     }

     // TRIM BLANK SPACES AND REMOVE COMMAS
     var emails = ifStringEmpty(memoryTable3B['custrecord_sr_email'], '').split(',');
     var stTrimmedEmail = '';
		
     for (var j = 0; j < emails.length; j++)
     {
       if (emails[j].trim().length > 0)
       {
         if (!isEmpty(stTrimmedEmail))
         {
           stTrimmedEmail += ',';
         }
           stTrimmedEmail += emails[j].trim();
         }
      }
		
     memoryTable3B['custrecord_sr_email'] = stTrimmedEmail;		

     nlapiLogExecution('debug', 'after trim', memoryTable3B['custrecord_sr_email']);
	  	
     // EMAIL ADDRESS VALIDATION

     emails = ifStringEmpty(memoryTable3B['custrecord_sr_email'], '').split(',');

     if (!isEmpty(memoryTable3B['custrecord_sr_email'])) 
     {
	   var emailRegEx = /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;
				
	   for (var i = 0; i < emails.length; i++) 
	   {
	      var stEmail = emails[i];
					
	      // DISPLAY GO BACK ERROR PAGE AND EXIT SCRIPT         
	      if (!stEmail.match(emailRegEx)) 
	      {
	        throw nlapiCreateError('Error Notification', 'Email Address must be valid.');
	      }
	   }
       } 
	  
       //UPDATE RECORD
	  
       recNew.setFieldValue('custrecord_sr_email', memoryTable3B['custrecord_sr_email']);

       stContextDescription = 'Error updating Services Report Internal ID ' + memoryTable1B['internalid'];
   
   } catch(error) {
     // LOG ERROR, SEND ERROR NOTIFICATION EMAIL AND EXIT SCRIPT
    
        var stNsError = '';
        
        if (error.getDetails != undefined)
        {
            stNsError = error.getDetails();            
            
            if (error.getCode() == 'Error Notification')
            {
                throw error;
            }
        }
        else
        {
            stNsError = error.toString();
        }
    
        nlapiLogExecution('error', stContextError, stContextDescription + '.  ' + stNsError);
        
        sendNotificationEmail(stContextError, stContextDescription + '.  ' + stNsError);
	return;
    }
}

function Services_Report_1C(stType)
{
   try
   {
      var stContextError = 'Error Notification';
      var stContextDescription = '';

      // GET INTERNAL ID
      memoryTable1C['internalid'] = nlapiGetRecordId();
		
      var ctx = nlapiGetContext();
				
      // GET CONTEXT
      memoryTable2C['user'] = ctx.getUser();
      // memoryTable3C['email'] = ctx.getEmail();
      // memoryTable5C['account'] = ctx.getCompany();
      // memoryTable6C['role'] = ctx.getRole();
    
      // GET DATA 2
      // var recNew = nlapiGetNewRecord();
      // memoryTable4C['custrecord_sr_password'] = recNew.getFieldValue('custrecord_sr_password');
	  
      // stContextDescription = 'Error getting data for Services Report Internal ID ' + memoryTable1C['internalid'];
	  
      // UPDATE RECORD
      // nlapiLogExecution('Debug', 'Password Removed', nlapiSubmitField('customrecord_services_report', memoryTable1C['internalid'], 'custrecord_sr_password', ''));	
	  
      // stContextDescription = 'Error deleting data for Services Report Internal ID ' + memoryTable1C['internalid'];
      
      // PASS SCRIPT PARAMETERS AND EXECUTE SCHEDULED SCRIPT
     
      var param = new Array();
      param['custscript_sr_internal_id'] = memoryTable1C['internalid'];
      param['custscript_sr_user'] = memoryTable2C['user'];
      // param['custscript_sr_email'] = memoryTable3C['email'];
      // param['custscript_sr_password'] = memoryTable4C['custrecord_sr_password'];
      // param['custscript_sr_role'] = memoryTable6C['role'];
      // param['custscript_sr_account'] = memoryTable5C['account'];

      nlapiScheduleScript('customscript_services_report_2', null, param);	  
      stContextDescription = 'Error passing script parameter for Services Report Internal ID ' + memoryTable1C['internalid'];
	  
    } catch(error) {
      // LOG ERROR, SEND ERROR NOTIFICATION EMAIL AND EXIT SCRIPT
      
      var stNsError = '';
        
      if (error.getDetails != undefined)
      {
        stNsError = error.getDetails();            
      }
      else
      {
        stNsError = error.toString();
      }
    
      nlapiLogExecution('error', stContextError, stContextDescription + '.  ' + stNsError);
        
      sendNotificationEmail(stContextError, stContextDescription + '.  ' + stNsError);
      return;
    }
}

// HELPER FUNCTIONS

function sendNotificationEmail(stSubject, stMessage)
{
    try
    {
        var stBody = 'Script: Service Report 1' + '\n';
        stBody += 'Date and Time: ' + new Date() + '\n';
        stBody += 'Notification: ' + stMessage + '\n';        
    
        nlapiSendEmail(FROM_EMPLOYEE, TO_EMPLOYEE, stSubject, stBody);        
    }
    catch (error)
    {
        // LOG ERROR AND EXIT SCRIPT
        
        var stNsError = '';
        
        if (error.getDetails != undefined)
        {
            stNsError = error.getDetails();            
        }
        else
        {
            stNsError = error.toString();
        }
        
        nlapiLogExecution('error', 'Email Error', 'Error sending email.  ' + stNsError);
	return;
    }
}

function QueryString(stQueryString) 
{ 
    this.params = {};
	
    if (isEmpty(stQueryString))
    {
        stQueryString = window.location.search.substring(1, window.location.search.length);
    }

    if (stQueryString.length == 0) 
    {
        return;
    }           

    stQueryString = stQueryString.replace(/\+/g, ' ');

    var args = stQueryString.split('&'); // parse out name/value pairs separated via &

    for (var i = 0; i < args.length; i++) 
    {
        var pair = args[i].split('=');
        var stName = decodeURIComponent(pair[0]);

        var stValue = (pair.length==2)
                ? decodeURIComponent(pair[1])
                : stName;

        this.params[stName] = stValue;
    }
}

QueryString.prototype.get = function QueryString_get(stKey, stDefaultValue) 
{
    var stValue = this.params[stKey];
    return (!isEmpty(stValue)) ? stValue : stDefaultValue;
}

QueryString.prototype.contains = function QueryString_contains(stKey) 
{
    var stValue = this.params[stKey];
    return (!isEmpty(stValue));
}


function isNullOrUndefined(value)
{
    if (value === null)
    {
        return true;
    }
    
    if (value === undefined)
    {
        return true;
    }  
    
    return false;
}

function isArrayEmpty(array)
{
    if (isNullOrUndefined(array))
    {
        return true;
    }
    
    if (array.length <= 0)
    {
        return true;
    }
    
    return false;
}

function isEmpty(stValue)
{
    if (isNullOrUndefined(stValue))
    {
        return true;
    }
    
    if (stValue.length == 0)
    {
        return true;
    }

    return false;
}

function forceParseInt(stValue)
{
    if (isEmpty(stValue))
    {
        return 0;
    }
    
    var intValue = parseInt(stValue.removeLeadingZeroes());
    
    if (isNaN(intValue))
    {
        return 0;
    }
    
    return intValue;
}

String.prototype.removeLeadingZeroes = function String_removeLeadingZeroes()
{
    if (isEmpty(this))
    {
        return this;
    }
    
    var stTrimmedString = this;
    
    for (var i = 0; i < stTrimmedString.length; i++)
    {
        if (stTrimmedString[i] === '0')
        {
            stTrimmedString = stTrimmedString.substring(1, stTrimmedString.length);
        }
        else
        {
            break;
        }
    }
    
    return stTrimmedString;
}

function ifStringEmpty(stSource, stDestination)
{
    if (isEmpty(stSource))
    {
        return stDestination;
    }
    
    return stSource;
}

function forceParseFloat(stValue)
{
    var flValue = parseFloat(stValue);
    
    if (isNaN(flValue))
    {
        return 0.00;
    }
    
    return flValue;
}

String.prototype.trim = function String_trim()
{
    if (this === null)
    {
        return null;
    }
    
    return this.replace(/^\s*/, '').replace(/\s+$/, '');
}
