/*
 ***********************************************************************
 *
 * The following javascript code is created by ERP Guru,
 * a NetSuite Partner. It is a SuiteFlex component containing custom code
 * intented for NetSuite (www.netsuite.com) and use the SuiteScript API.
 * The code is provided "as is": ERP Guru shall not be liable
 * for any damages arising out the intended use or if the code is modified
 * after delivery.
 *
 * Company:	ERP Guru, www.erpguru.com
 * Author: 	yannick.beaudoin@erpguru.com
 * File: 	GLK_SSS_PMACaseCreation.js
 * Date Modified:	O7/27/2011
 * Modified by: noushin.reisi@erpguru.com
 * Date Modified:   07/27/2012 
 ***********************************************************************/
//Month - Script Parameter Mapping
var MONTH_SEARCH_MAPPING = [];
MONTH_SEARCH_MAPPING[0] = 'custscript_january_id';
MONTH_SEARCH_MAPPING[1] = 'custscript_february_id';
MONTH_SEARCH_MAPPING[2] = 'custscript_march_id';
MONTH_SEARCH_MAPPING[3] = 'custscript_april_id';
MONTH_SEARCH_MAPPING[4] = 'custscript_may_id';
MONTH_SEARCH_MAPPING[5] = 'custscript_june_id';
MONTH_SEARCH_MAPPING[6] = 'custscript_july_id';
MONTH_SEARCH_MAPPING[7] = 'custscript_august_id';
MONTH_SEARCH_MAPPING[8] = 'custscript_september_id';
MONTH_SEARCH_MAPPING[9] = 'custscript_october_id';
MONTH_SEARCH_MAPPING[10] = 'custscript_november_id';
MONTH_SEARCH_MAPPING[11] = 'custscript_december_id';

var MONTH_WORD_MAPPING = [];
MONTH_WORD_MAPPING[0] = 'January';
MONTH_WORD_MAPPING[1] = 'February';
MONTH_WORD_MAPPING[2] = 'March';
MONTH_WORD_MAPPING[3] = 'April';
MONTH_WORD_MAPPING[4] = 'May';
MONTH_WORD_MAPPING[5] = 'June';
MONTH_WORD_MAPPING[6] = 'July';
MONTH_WORD_MAPPING[7] = 'August';
MONTH_WORD_MAPPING[8] = 'September';
MONTH_WORD_MAPPING[9] = 'October';
MONTH_WORD_MAPPING[10] = 'November';
MONTH_WORD_MAPPING[11] = 'December';

var DEFAULT_CASE_TITLE = 'PMA service for month of';

var ORIGIN_OTHER = 3;

var TYPE_PMA_SERVICE = 9;

var ERPGURU_EMPLOYEE = 19179;
var LOGGING_EMAIL = 'logging@erpguru.com';
var ADMIN_EMAIL ='wayne@gilkatho.com.au';//admin email 
var g_processingMonth; //Stores the month we are creating cases against
/**
 * Entry point for the scheduled script
 */
function processCaseCreation(){
    try {
        //Retreive the correct search id
        var searchId = getSearchIdNextMonth(new Date().getMonth()); //prod
        //var searchId = '631'; //Single time
        //g_processingMonth = 7; //Single time, August
        //Search
        var results = getSearchResults(searchId); //10 units
        //Generate cases from search results
        generateCases(results); //15*nbResults units
    } catch (e) {
        logError(e, 'An error has occured', ERPGURU_EMPLOYEE);
    }
}

/**
 * This function calculates the next month and returns the search id to be used for the following month
 * @param month The current month
 * @return The search Id to be used to create cases for the next month
 */
function getSearchIdNextMonth(month){
    nlapiLogExecution('debug', 'month parameter', month);
    var nextMonth;
    if (month == 11) {
        nextMonth = 0;
    } else {
        nextMonth = month + 1;
    }
    nlapiLogExecution('debug', 'Returning search for month:', nextMonth);
    g_processingMonth = nextMonth; //Store the value for re-use later
    return nlapiGetContext().getSetting('SCRIPT', MONTH_SEARCH_MAPPING[nextMonth]);
    
}

/**
 * This function receives a search id in parameter and returns the search results
 * @param searchId The search id to use to retreive data
 * @return An array of search results
 */
function getSearchResults(searchId){
    var columns = [];
    columns[0] = new nlobjSearchColumn('formulatext');
    columns[0].setFormula('{contact.internalid}');
    columns[1] = new nlobjSearchColumn('email');
    columns[2] = new nlobjSearchColumn('custentity_pma_performed_by');
    columns[3] = new nlobjSearchColumn('internalid', 'custrecord_customer');
    return nlapiSearchRecord('customer', searchId, null, columns); //10 units
}

/**
 * This function creates cases based on the search results it receivess
 * @param {nlobjSearchResult[]} searchResults An array of results to be used in the case creation process
 */
function generateCases(searchResults){

    //Make sure there is results passed in parameter
    if (searchResults == null) {
        return;
    }
    
    var previousCustomer;
    
    for (var i = 0; i < searchResults.length; i++) {
        var multipleEquipment = false;
        //Only create 1 case per customer
        if (searchResults[i].getValue('custrecord_customer', 'custrecord_customer') == previousCustomer) {
            continue; //Skip that line
        } else {
            //We found the the first line for a new customer, we now have to know if they have more than 1 Equipment (multiple lines)
            previousCustomer = searchResults[i].getValue('custrecord_customer', 'custrecord_customer');
            
            //If the following line is for the same customer, we assume that they have multiple machines
            
            //If it's not the last line of the search results
            if (i != (searchResults.length - 1)) {
                if (searchResults[i + 1].getValue('custrecord_customer', 'custrecord_customer') == previousCustomer) {
                    //Then the next line is for the same customer, so they have multiple equipments
                    multipleEquipment = true;
                }
            }
            
            //Create the case
            
            var caseId = createSingleCase(searchResults[i], g_processingMonth, multipleEquipment); //15 units
            if (caseId != null && caseId != '') {
                nlapiLogExecution('audit', 'Created PMA support case with Id ' + caseId, 'customer: ' + previousCustomer);
            } else {
                nlapiLogExecution('audit', 'FAILED to create PMA support case', 'customer: ' + previousCustomer);
            }
            
            
        }
    }
}

/**
 *
 * @param {nlobjSearchResult} resultLine A line result from one of the 6 searches
 * @param {Integer} month The month the case should be created against
 * @param {Boolean} multipleEquipment Tells if the customer of that resultLine has multiple machines
 */
function createSingleCase(resultLine, month, multipleEquipment){


	
	
		//Gather the information we need to create the case record
		nlapiLogExecution('debug', 'createSingleCase : init', resultLine + '<br>' + month + '<br>' + multipleEquipment);
		var newCase = nlapiCreateRecord('supportcase'); //5 units
		//try catch added to avoid stopping the script on error occurance.(noushin.reisi@erpguru.com- 26 July 2012)
		try {
			//Customer/Company
			//newCase.setFieldValue('company', resultLine.getValue('custrecord_customer', 'custrecord_customer'));
			//nlapiLogExecution('debug', 'createSingleCase : customer', resultLine.getValue('custrecord_customer', 'custrecord_customer'));

                        //added phone
			var idCustomer = resultLine.getValue('custrecord_customer', 'custrecord_customer');
			newCase.setFieldValue('company', idCustomer);
			newCase.setFieldValue('custevent_case_phone', nlapiLookupField('customer', idCustomer, 'phone'));
			
			//Overdue Balance (this is already a sourced field on the case record)
			//nlapiLookupField('customer', resultLine.getValue('customer', 'customrecord_warranty_items'), 'overduebalance');
			
			//Title
			newCase.setFieldValue('title', DEFAULT_CASE_TITLE + ' ' + MONTH_WORD_MAPPING[g_processingMonth]);
			nlapiLogExecution('debug', 'createSingleCase : title', DEFAULT_CASE_TITLE + ' ' + MONTH_WORD_MAPPING[g_processingMonth]);
			
			//Start Date (Incident Date) should be the last day of the applicable month
			//var myDate = new Date(2011, 7, 31); //Single time - August 31st
			var incidentDate = new Date(); //Prod
			incidentDate = nlapiAddMonths(incidentDate, 1);
			
			var myDate = new Date(incidentDate.getFullYear(), incidentDate.getMonth(), daysInMonth(incidentDate.getMonth(), incidentDate.getFullYear()));
			
			newCase.setFieldValue('startdate', nlapiDateToString(myDate));
			nlapiLogExecution('debug', 'createSingleCase : incident date', myDate);
			
			//Contact
			var contact = resultLine.getValue('formulatext');
			if (contact != null && contact != '') {
				newCase.setFieldValue('contact', contact);
				nlapiLogExecution('debug', 'createSingleCase : contact', contact);
			}
			
			//Email (directly sourced from the customer record)
			/*if (resultLine.getValue('email') != null && resultLine.getValue('email') != '') {
			 newCase.setFieldValue('contact', resultLine.getValue('contact'));
			 }*/
			//Phone (directly sourced from the customer record)
			
			//Equipment (if there is more than 1 equipment, do not set anything)
			if (!multipleEquipment) {
				newCase.setFieldValue('custevent_equipment', resultLine.getValue('internalid', 'custrecord_customer'));
				nlapiLogExecution('debug', 'createSingleCase : equipment', resultLine.getValue('internalid', 'custrecord_customer'));
			} else {
				nlapiLogExecution('debug', 'createSingleCase : equipment', 'Multiple Equipment - Leaving field blank');
			}
			
			//Origin
			newCase.setFieldValue('origin', ORIGIN_OTHER);
			nlapiLogExecution('debug', 'createSingleCase : origin', ORIGIN_OTHER);
			
			//Assigned to the "PMA Performed by" on the customer record
			newCase.setFieldValue('assigned', resultLine.getValue('custentity_pma_performed_by'));
			nlapiLogExecution('debug', 'createSingleCase : assigned', resultLine.getValue('custentity_pma_performed_by'));
			
			//Type is PMA Service
			newCase.setFieldValue('category', TYPE_PMA_SERVICE);
			nlapiLogExecution('debug', 'createSingleCAse : type', TYPE_PMA_SERVICE);
			
			var caseId = nlapiSubmitRecord(newCase, true, false); //10 units; Second parameter is set to true in order for the sourcing to occur (email, phone, etc.)
		} catch (err) {
			//in case of error in craeting the case an email will be send to admin to alert about the problem.(noushin.reisi@erpguru.com- 26 July 2012)	
			emailErrorToAdmin(err, resultLine.getValue('custrecord_customer', 'custrecord_customer'));
			return null;
		}
		return caseId;
	
}
/**
 * This function verifies if usage metering is getting dangerously low
 * If so, it schedules another execution of the script, then throws an error to kill the current execution
 */
function verifyMetering(maxUnits, params){
    if (isNaN(parseInt(maxUnits, 10))) {
        maxUnits = 50;
    }
    if (nlapiGetContext().getExecutionContext() == 'scheduled' && nlapiGetContext().getRemainingUsage() <= maxUnits) {
        nlapiLogExecution('audit', 'verifyMetering()', 'Metering low, scheduling anohter execution');
        nlapiScheduleScript(nlapiGetContext().getScriptId(), nlapiGetContext().getDeploymentId(), params);
        throw nlapiCreateError('METERING_LOW_ERR_CODE', 'Usage metering low, another execution has been scheduled', true);
    }
}

/**
 * This function returns the number of days in a month for a given year
 * @param {Integer} iMonth The month (Range is 0-11)
 * @param {Integer} iYear The Year (in a 4 digit format (i.e.: 1998-2011))
 * @return {Integer} The number of days in the given month/year combo
 */
function daysInMonth(iMonth, iYear){
    return 32 - new Date(iYear, iMonth, 32).getDate();
}

/**
 * Logs an error in NetSuite, whether it's and nlobjError object or a plain Javascript error.
 * @param {Object} err The nlobjError object or the plain Javascript error.
 * @param {Object} title The title that will be given to the error log.
 * @param {Object} emailAuthorID The internal ID of the active employee record which will be
 *                 used as the author of the emailed error log.
 */
function logError(err, title, emailAuthorID){
    var msg = [];
    
    if (err.getCode != null) {
        msg.push('[SuiteScript exception]');
        msg.push('Error Code: {0}' + err.getCode());
        msg.push('Error Data: {0}' + err.getDetails());
        msg.push('Error Ticket: {0}' + err.getId());
        if (err.getInternalId) {
            msg.push('Record ID: {0}' + err.getInternalId());
        }
        if (err.getUserEvent) {
            msg.push('Script: {0}' + err.getUserEvent());
        }
        msg.push('User: {0}' + nlapiGetUser());
        msg.push('Role: {0}\n' + nlapiGetRole());
        
        var stacktrace = err.getStackTrace();
        if (stacktrace) {
            msg.push('Stack Trace');
            msg.push('\n---------------------------------------------');
            
            if (stacktrace.length > 20) {
                msg.push('**stacktrace length > 20**');
                msg.push(stacktrace);
            } else {
                msg.push('**stacktrace length < 20**');
                for (var i = 0; stacktrace != null && i < stacktrace.length; i++) {
                    msg.push(stacktrace[i]);
                }
            }
        }
    } else {
        msg.push('[javascript exception]');
        msg.push('User: {0}' + nlapiGetUser());
        msg.push(err.toString());
    }
    
    nlapiLogExecution('error', title, msg);
    
    //MG Add to title the company ID and environment type, and email the error to our logging email.
    if (emailAuthorID != null && emailAuthorID != '' && !isNaN(emailAuthorID)) {
        var context = nlapiGetContext();
        var companyId = context.getCompany();
        var environment = context.getEnvironment();
        title = title + '(NS Acct #' + companyId + ' ' + environment + ')';
        nlapiSendEmail(emailAuthorID, LOGGING_EMAIL, title, msg);
    }
}


/**
 * Sends the error to the Admin.19179
 * @param {string}error:the record which after its creation the error occured
 * @param {string}customer: customer
 * @author noushin.reisi@erpguru.com
 */
function emailErrorToAdmin(error, customer){


    var emailBody = 'An error ' + error + ' has occurd in creating case for the cstomer' + customer;
    var subject = 'failur in case creation';
    
    
    
    var author = ERPGURU_EMPLOYEE;
    var email = ADMIN_EMAIL;
    
    nlapiLogExecution('debug', 'email to admin', 'EMAIL would have been sent with subject/body: ' + subject + '/' + emailBody);
    
    nlapiSendEmail(author, email, subject, emailBody);
    
    
}
