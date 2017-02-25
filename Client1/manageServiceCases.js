/*jsl:option explicit*/

var kotnCaseEvent = new (function(){

	function needsTerms(caseType){
		var types  = nlapiGetContext().getSetting('SCRIPT', 'custscript_case_type_for_tc');
		if(!types) return false;
		var targetTypes = types.split(/\s*,\s*/);
		for(var i = 0; i< targetTypes.length; i++){
			if(caseType == targetTypes[i]) return true;
		}
		return false;
	}

	function needsTermsUserEvent(oldRec){
		if(!needsTerms(nlapiGetFieldValue('category'))) return null;
		var contactId = nlapiGetFieldValue('contact');

		var entitySpec = contactId ? {type: 'contact', id: contactId} : {type:'customer', id:nlapiGetFieldValue('company')};
		var caseNeedsTerms = (function(){
			if(oldRec){
				if(entitySpec.type == 'contact' && entitySpec.id == oldRec.getFieldValue('contact')) return false; // only proceed on changed contact
				if(entitySpec.type == 'customer' && entitySpec.id == oldRec.getFieldValue('company')) return false; // only proceed on changed contact
			}
			var signedTerms = nlapiLookupField(entitySpec.type, entitySpec.id, 'custentity_accepted_service_tc');
			return !signedTerms || signedTerms != (getCurrentServiceTermsRef(false)).termsid;
		})();
		return caseNeedsTerms ? entitySpec : null;
	}

	function needsTermsSuitelet(caseId){
		var rec = nlapiLoadRecord('supportCase', caseId);
		if(!needsTerms(rec.getFieldValue('category'))) return null;
		var contactId = rec.getFieldValue('contact');
		var entitySpec = contactId ? {type: 'contact', id: contactId} : {type:'customer', id:rec.getFieldValue('company')};

		var signedTerms = nlapiLookupField(entitySpec.type, entitySpec.id, 'custentity_accepted_service_tc');
		if(!signedTerms || signedTerms != (getCurrentServiceTermsRef(false)).termsid) return entitySpec;
		return null;
	}


	this.beforeLoad = function (type, form){
		if(type == 'view' && needsTermsUserEvent()){
			var url = nlapiResolveURL('SUITELET', 'customscript_resend_service_tnc', 'customdeploy_resend_service_tnc');
			form.addButton("custpage_resend_tnc", "Resend T&C", "location.href='"+ url +"&custpage_caseid="+ nlapiGetRecordId()+"'");
		}
	};

	this.resendTnC = function (request, response){ // suitelet to resend terms.
		var caseId = request.getParameter('custpage_caseid');
		if(!caseId) throw nlapiCreateError('CASE_RESEND_TC', 'Missing case id parameter for re-sending T&C');

		var entitySpec = needsTermsSuitelet(caseId);
		if(entitySpec) {
			var caseInfo = nlapiLookupField('supportcase', caseId, ['custevent_created_by', 'internalid']);
			sendTnCRequest(caseInfo, entitySpec);
		}
		response.sendRedirect('RECORD', 'supportcase', caseId);
	};

	this.beforeSubmit = function (type){
		if(type == 'create'){
			var user = nlapiGetContext().getUser();
			if(nlapiSearchRecord('employee', null, new nlobjSearchFilter('internalid', null, 'is', user))){
				var newRec = nlapiGetNewRecord();
				newRec.setFieldValue('custevent_created_by', user); // if user who creates the record is an employee then set the field.
			}
		}
	};

	this.afterSubmit = function (type){
		//nlapiLogExecution('DEBUG', 'in support case with type: '+ type);
		if(type == 'create' || type == 'edit'){
			var entitySpec = needsTermsUserEvent(nlapiGetOldRecord());
			if((entitySpec)  && nlapiGetFieldValue('company') == 30233){ // only for Test:Ebeacon
				sendTnCRequest({internalid:nlapiGetRecordId(), custevent_created_by:nlapiGetFieldValue('custevent_created_by')}, entitySpec);
			}
		}
	};

	function sendTnCRequest(caseSpec, entitySpec){
		nlapiLogExecution('DEBUG', 'Send terms and conditions request to '+ entitySpec.type +': '+ entitySpec.id);
		try{

			var templateId = nlapiGetContext().getSetting('SCRIPT', 'custscript_tnc_email_template');
			var fromEmp = caseSpec.custevent_created_by || nlapiGetContext().getSetting('SCRIPT', 'custscript_tnc_dflt_from_emp');

			var msg = nlapiMergeRecord(templateId, entitySpec.type, entitySpec.id, 'supportcase', caseSpec.internalid);
			nlapiLogExecution('debug','msg value',msg.getValue());
			var msgBody = msg.getValue().replace(/%([a-z0-9]+)%/gi, function(all, m){
			nlapiLogExecution('debug','all m', all + " " + m);
				switch(m){
					case 'customerkeys': // create customer
						var keys={
							custid:entitySpec.id,
							ts:(new Date().getTime())
						};
						keys.invitehash = hex_hmac_sha1("askadfe9354kq,", keys.custid + '::'+ keys.ts);
						var params = [];
						for(var k in keys) params.push(k +'='+ encodeURIComponent(keys[k]));
						//nlapiLogExecution('debug','params', params.join("&"));
						return params.join("&");
					default : return all;
				}
			});
			// nlapiLogExecution('debug','sent to', entitySpec.id);
			// nlapiLogExecution('debug','from', fromEmp);
			// nlapiLogExecution('debug','subject', msg.getName());
			// nlapiLogExecution('debug','sent to', msgBody);
			nlapiSendEmail(fromEmp, entitySpec.id, msg.getName(), msgBody, null, null, {activity:caseSpec.internalid, entity:entitySpec.id});
		}catch(e){
			nlapiLogExecution('ERROR', "Sending Terms and Conditions to "+nlapiLookupField(entitySpec.type, entitySpec.id, 'entityid'), (e.message || e.toString()) + (e.getStackTrace ? ("\n\n"+ e.getStackTrace().join("\n")) : ''));
			// should inform someone so action can take place.
		}
	}
})();