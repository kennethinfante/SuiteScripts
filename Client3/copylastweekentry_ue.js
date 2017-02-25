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

function beforeLoad_addButton(type, form,request) {

        nlapiLogExecution('debug', 'test', 'entry');
	   
	form.addButton('custpage_buttonnewcustom2', 'Copy Selected Week', 'onclick_callButton2()');  
	
	form.setScript('customscript4'); 
	
	} 