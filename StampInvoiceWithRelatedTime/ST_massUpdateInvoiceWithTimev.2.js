// script not comparing if all are the same

function massUpdateInvoiceWithTime(rec_type, rec_id)
{

    try {
        nlapiLogExecution ( 'DEBUG', 'current record id', rec_id );
        var currentRec = nlapiLoadRecord(rec_type, rec_id)
        // Get the number of line Time Tracking items submitted
        var timeLines = currentRec.getLineItemCount('time');
        var itemLines = currentRec.getLineItemCount('item');
        nlapiLogExecution ( 'DEBUG', 'number of item lines', itemLines );
        nlapiLogExecution ( 'DEBUG', 'number of time lines', timeLines );

        // var timeRecIdArray = [];
        for ( var i=1; i<=timeLines; i++ ) {
            //get the ID of the Time Tracking
            var timeRecId = currentRec.getLineItemValue('time', 'doc', i);

            nlapiLogExecution ( 'DEBUG', 'time selected id', typeof timeRecId );

            // array notation for push does not work
            // timeRecIdArray.push(timeRecId);
            // currentRec.setLineItemValue('time', 'custcolrelated_time', i, timeRecId);
            nlapiLogExecution ( 'DEBUG', 'successfully stamp', timeRecId );


            var timeRecord = nlapiLoadRecord('timebill', timeRecId);
            var timeSelected = currentRec.getLineItemValue('time', 'apply', i);

            // nlapiLogExecution ( 'DEBUG', 'time selected id', timeSelected );
            //if it's selected on the invoice, update its custom field
            if (timeSelected == 'T') {
                timeRecord.setFieldValue('custcol_related_time',
                    '<a href="https://system.sandbox.netsuite.com/app/accounting/transactions/timebill.nl?id="'+timeRecId+'>'timeRecId'</a>');
                // nlapiLogExecution ( 'DEBUG', 'time selected id', rec_id );
                nlapiSubmitRecord(timeRecord, {disabletriggers:true, ignoremandatoryfields:true});
            }
        }

        // var itemLines = currentRec.getLineItemCount('item');

        // for ( var i=1; i<=itemLines; i++ ) {
        //     currentRec.setLineItemValue('item', 'custcolrelated_time', i, timeRecIdArray);
        // }

        // nlapiLogExecution ( 'DEBUG', 'time array', timeRecIdArray );
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