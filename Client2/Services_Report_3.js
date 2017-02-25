/**
Type: Scheduled
Name: Services Report 3
Summary: Delete report files in file cabinet.
**/

//Remove two forward slashes from the start of a line, to uncomment that line.
//Add two forward slashes to the start of a line, to comment that line.

/* Production Account */
//var FROM_EMPLOYEE = '22937';
//var TO_EMPLOYEE = '22937';
//var maxCount = '499';

/* Development Account */
var FROM_EMPLOYEE = '38499';
var TO_EMPLOYEE = '38499';
var maxCount = '2';

function Services_Report_3(stType)
{
   try
   {
      var stContextError = 'Error Notification';
      var stContextDescription = '';

      // EXECUTE DOCUMENT SAVED SEARCH
		
      stContextDescription = 'Error executing Document search (customsearch_services_report_files)';
		
      var memoryTable1 = new Array();
		
      var results = nlapiSearchRecord('file', 'customsearch_services_report_files');
		
      if (!isArrayEmpty(results))
      {
         var intMaxCount = results.length;
            
         if (intMaxCount > maxCount)
         {
            intMaxCount = maxCount;
         }
            
         for (var i = 0; i < intMaxCount; i++)
         {
           memoryTable1.push(results[i].getId());
         }
       }
		
       // DELETE RECORD(S)
       // Units: 20/record
		
	for (var j = 0; j < memoryTable1.length; j++)
        {
            try
            {
                stContextDescription = 'Error deleting File Internal ID ' + memoryTable1[j];
                
                nlapiLogExecution('debug', 'file deleted', nlapiDeleteFile(memoryTable1[j]));
            }
            catch (error)
            {
                // LOG ERROR, SEND ERROR NOTIFICATION EMAIL AND CONTINUE
            
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
            }            
	  }

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

// HELPER FUNCTION
function sendNotificationEmail(stSubject, stMessage)
{
   try
   {
        var stBody = 'Script: Services Report 3' + '\n';
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
