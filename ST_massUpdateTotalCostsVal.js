function massUpdateTotalCostsVal(rec_type, rec_id)
{

    try {
        var currentRec = nlapiLoadRecord(rec_type, rec_id),
            totalCosts = currentRec.getFieldValue ('custentity_total_costs');

        currentRec.setFieldValue('custentity_total_costs_val', totalCosts );
        nlapiSubmitRecord(currentRec, {disabletriggers:true, ignoremandatoryfields:true});

    } catch(e) {
        nlapiLogExecution('error','Script has encountered an error.',e.getCode()+' :: '+e.getDetails() + ' :: ' + e.getStackTrace().join(', '));
    }

    // nlapiSubmitRecord(currentRec); 
} 