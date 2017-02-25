function massUpdateInvoiceWithTime(rec_type, rec_id)
{

    try {
        nlapiLogExecution ( 'DEBUG', 'current record id', rec_id );
        var currentRec = nlapiLoadRecord(rec_type, rec_id)
        // Get the number of line Time Tracking items submitted
        var timeLines = currentRec.getLineItemCount('time');

        var timeRecIdArray = [];
        for ( var i=1; i<=timeLines; i++ ) {
            //get the ID of the Time Tracking
            var timeRecId = currentRec.getLineItemValue('time', 'doc', i);

            nlapiLogExecution ( 'DEBUG', 'time selected id', timeRecId );

            // array notation for push does not work
            timeRecIdArray.push(timeRecId);
            // currentRec.setLineItemValue('time', 'custcol3', i, timeRecId);
            // nlapiLogExecution ( 'DEBUG', 'successfully stamp', timeRecId );
        }

        var itemLines = currentRec.getLineItemCount('item');

        for ( var i=1; i<=itemLines; i++ ) {
            currentRec.setLineItemValue('item', 'custcolrelated_time', i, timeRecIdArray);
        }

        nlapiLogExecution ( 'DEBUG', 'time array', timeRecIdArray );
        nlapiSubmitRecord(currentRec);
    } catch (e) {
        var txt='';
        if (e instanceof nlobjError) {
            //this is netsuite specific error
            txt = 'NLAPI Error: Record ID :: '+rec_id+' :: '+e.getCode()+' :: '+e.getDetails() + ' :: ' + e.getStackTrace().join(', ');
        } else {
            //this is generic javascript error
            txt = 'JavaScript/Other Error: Record ID :: '+rec_id+' :: '+e.toString()+' : '+e.stack;
        }
        nlapiLogExecution('error','suiteScript() has encountered an error.',txt);
    }

}