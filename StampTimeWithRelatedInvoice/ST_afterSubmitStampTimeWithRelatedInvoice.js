function afterSubmitUpdateTimeTracking(type)
{
    //get the current invoice record    
    currentRecordId = nlapiGetRecordId();
    // nlapiLogExecution ( 'DEBUG', 'current record id', currentRecordId );
    var currentRec= nlapiLoadRecord('invoice',currentRecordId);
    // Get the number of line Time Tracking items submittedUser Event
    lines = currentRec.getLineItemCount('time'); 
    //parse the list of time records
    for ( var i=1; i<=lines; i++ )
        {
        //get the ID of the Time Tracking 
        var timeRecId = currentRec.getLineItemValue('time', 'doc', i);
        // nlapiLogExecution ( 'DEBUG', 'time rec id', timeRecId );
        var timeSelected = currentRec.getLineItemValue('time', 'apply', i);
        // nlapiLogExecution ( 'DEBUG', 'time selected id', timeSelected );
        //if it's selected on the invoice, update its custom field
        if (timeSelected == 'T')
                 nlapiSubmitField('timebill', timeRecId, 'custcol2', currentRecordId );
        else
            {
            //ensure that updates on invoices when Time Tracking records are unapplied
            var timeRecord = nlapiLoadRecord('timebill', timeRecId);
            var invoiceNoSet = timeRecord.getFieldValue('custcol2');
            if (invoiceNoSet != null)
                nlapiSubmitField('timebill', timeRecId, 'custcol2', null );            
            }
        }
} 