// http://codeboxllc.com/ksc/script-library/scheduled-scripts/scheduled-script-template/

/**
 *This is a generic template I use to create Scheduled Script. If you are using this, please make sure
 * You follow the requirements below:
 *
 * REQUIREMENTS:
 * Scheduled script should ALWAYS have parameter called "Last Processed Internal ID"
 * - Search SHOULD always be ordered by Internal ID in descending order.
 * - When lastProcessedId is not null and it is of type Number, Additional search filter should be added
 *
 * EXCEPTION to the Last Processed Internal ID rule is when scheduled script IS running based on
 *   - Pre determined exit flag on a record or TIME based execution
 *
 * ASSUMPTION:
 * - Script assumes that you are using Saved Search to generate the record sets already ordered by Internal ID in DESC order.
 * 		-> If you create your own search filter/cols make sure you use .sort by Internal ID. NOT JavaScript sort, NetSuite API sort!!!
 */

//each scheduled script MUST have script parameter called Last Processed Internal ID.
//ID of last proessed internal id is defined in CMWL_Constants.js
var SCRIPT_PARAM_PROC_INTERNALID='custscript_[ID of your script parameter]';
var lastProcessedId = '';
var EXIT_COUNT=500;
var MAIN_SEARCH_ID='[ID of your saved search you plan to use]';
var ctx = nlapiGetContext(); //get execution context from server

//main function
function myMainFunction() {
	try {
		initScriptParam();
		var rslt = getMainSearch();
		if (rslt && rslt.length > 0) {
			//begin executing scheduled script
			for (var i=0; i < rslt.length; i++) {

				if (meterCheckRescheduler(i,rslt)) {
					break;
				}
			}
		}
	} catch (e) {
		nlapiLogExecution('ERROR','Runtime Error','[Print out error message]');
		//Additionally, you may want to send error email to your admins here
	}
}

/**
 * Checks to see if script needs to be rescheduled based on remaining script meter.
 * Scheduled script comes with 10000 points.
 * Make sure you set EXIT_COUNT variable above.
 * @param _curArrayIndex
 * @param _rslt
 * @returns {Boolean}
 */
function meterCheckRescheduler(_curArrayIndex, _rslt) {
	if (ctx.getRemainingUsage() <= _exitCnt && (_curArrayIndex+1) < _rslt.length) {
		var schStatus = nlapiScheduleScript(ctx.getScriptId(), ctx.getDeploymentId(), getParam(_rslt[_curArrayIndex]));
		if (schStatus=='QUEUED') {
			return true;
		}
	} else {
		return false;
	}
}

function getParam(_rsltrow) {
	var param = new Array();
	param[SCRIPT_PARAM_PROC_INTERNALID] = _rsltrow.getValue(INTERNALID);
	//ADD additional paramter. last processed internal ID is automatically added

	return param;
}

/**
 * Search items
 */
function getMainSearch() {
	var flt=null, col=null;
	if (lastProcessedId && !isNaN(parseInt(lastProcessedId))) {
		flt = new Array();
		//add in additional filter option to reduce the result set: where internalID < last processed
		flt[0] = new nlobjSearchFilter(INTERNALIDNUM,null,LESSTHAN,lastProcessedId);

		//ADD IN ADDITIONAL DYNAMIC FILTER OPTION HERE
	}

	//return nlapiSearchRecord([internal id of record],['internal id of saved search if used'],flt,col);
;

}

/**
 * sets up script parameter if any.
 */
function initScriptParam() {
	lastProcessedId = ctx.getSetting('SCRIPT',SCRIPT_PARAM_PROC_INTERNALID);
}