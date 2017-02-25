function massUpdateTimeTracking(rec_type, rec_id)
{

    try {

        var currentRec = nlapiLoadRecord(rec_type, rec_id)
        // nlapiLogExecution ( 'DEBUG', 'current record id', rec_id );
        lines = currentRec.getLineItemCount('time'); 

        //parse the list of time records
        for ( var i=1; i<=lines; i++ ) {
            //get the ID of the Time Tracking 
            var timeRecId = currentRec.getLineItemValue('time', 'doc', i);
            // nlapiLogExecution ( 'DEBUG', 'time rec id', timeRecId );
            var timeRecord = nlapiLoadRecord('timebill', timeRecId);
            var timeSelected = currentRec.getLineItemValue('time', 'apply', i);

            // nlapiLogExecution ( 'DEBUG', 'time selected id', timeSelected );
            //if it's selected on the invoice, update its custom field
            if (timeSelected == 'T') {
                timeRecord.setFieldValue('custcol2', rec_id );
                // nlapiLogExecution ( 'DEBUG', 'time selected id', rec_id );
                nlapiSubmitRecord(timeRecord, {disabletriggers:true, ignoremandatoryfields:true}); 
            }
        }

    } catch(e) {
        nlapiLogExecution('error','Script has encountered an error.',e.getCode()+' :: '+e.getDetails() + ' :: ' + e.getStackTrace().join(', '));
    }

    // nlapiSubmitRecord(currentRec); 
} 