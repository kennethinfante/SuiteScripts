/*jsl:option explicit*/

	function getCurrentServiceTermsRef(includeText){
		var columns = [ new nlobjSearchColumn('custrecord_tnc_date_valid').setSort(true)];
		if(includeText) columns.push(new nlobjSearchColumn('custrecord_tnc_text'));
		var x = nlapiSearchRecord('customrecord_service_tc', null,
				[
					new nlobjSearchFilter('custrecord_tnc_date_valid', null, 'onorbefore', 'today'),
					new nlobjSearchFilter('isinactive', null, 'is', 'F')
				],columns);
		if(!x) return null;
		return {termsid:x[0].getId(), validDate:nlapiStringToDate(x[0].getValue('custrecord_tnc_date_valid')), serviceText:(includeText ? x[0].getValue('custrecord_tnc_text') : null)};
	}

function serviceTermsAcceptance(request, response){

	function trim (val) {
		var	str = val.replace(/^\s+/, ''), ws = /\s/, i = str.length;
		while (ws.test(str.charAt(--i)));
		return str.slice(0, i + 1);
	}

	function getUserInfo(){
		var context = nlapiGetContext();
		var userAccountId = parseInt(context.getUser(), 10) || 0;
		var userEmail = context.getEmail();

		if(userAccountId > 0){
			var searchResults = nlapiSearchRecord('contact', null, [
				new nlobjSearchFilter('email', null, 'is', userEmail),
				new nlobjSearchFilter('internalid', 'customer', 'is', userAccountId)
			]);
		}

		return {userAccountId:userAccountId, userEmail:userEmail, contactId:searchResults ? searchResults[0].getId() : 0};
	}

	function returnError(response, reason, action){
		//response.sendRedirect('EXTERNAL', nlapiGetContext().getSetting('SCRIPT', 'custscript_service_tc_accepted_landing'));
		throw nlapiCreateError('GILKATHO_INVALID_TERMS_POST', 'Invalid post: '+reason);
	}

	if(request.getMethod() == 'GET'){ // return current terms page
		//var stage = request.getParameter('stage') || 'getterms';
		nlapiLogExecution("DEBUG", "requesting stage for user "+ nlapiGetContext().getUser());
		KOTNUtil.sendJSResponse(request, response, (function(){
			// get latest valid terms
			var x = getCurrentServiceTermsRef(true);
			//nlapiLogExecution('debug', 'boolean on success', x.termsid + ' ' + x.validDate + ' ' + x.serviceText);
			if(!x) return {success:false};
			return {success:true, termsid:x.termsid, validDate:x.validDate, serviceText:x.serviceText};
		})());
	}else if(request.getMethod() == 'POST'){
		if('T' == request.getParameter('custpage_accept_terms')){

			var validationHash = hex_hmac_sha1("askadfe9354kq,", request.getParameter('custid') + '::'+ request.getParameter('ts'));
			if(validationHash != request.getParameter('invitehash')){
				nlapiLogExecution('debug','InviteHash Not Match',validationHash + ' <br /> ' + request.getParameter('invitehash'));
				returnError(response, 'Field Service Terms page loaded from an invalid or expired URL', 'Please contact support for a valid service terms acceptance invitation');
				return;
			}

			var termsId = request.getParameter('termsid');
			if(!termsId) {
			nlapiLogExecution('debug','debug','termsid');
				returnError(response, 'Field Service Terms page loaded from an invalid or expired URL', 'Please contact support for a valid service terms acceptance invitation');
				return;
			}

			var custId = request.getParameter('custid');
			var custType = nlapiLookupField('contact', custId, 'entityid') ? 'contact' : 'customer';
			nlapiSubmitField(custType, custId, 'custentity_accepted_service_tc', termsId);
			response.sendRedirect('EXTERNAL', nlapiGetContext().getSetting('SCRIPT', 	'custscript_tnc_accepted_landing_url'));
			return;

		}else{
			// return with error
			throw nlapiCreateError('GILKATHO_REJECT_TERMS_VERSION', 'Invalid post; user did not accept terms');
		}
	}
}


