function afterSubmitStampInvoiceWithTime(type)
{
    try {
        //get the current invoice record    
        currentRecordId = nlapiGetRecordId();
        nlapiLogExecution ( 'DEBUG', 'current record id', currentRecordId );
        var currentRec= nlapiLoadRecord('invoice',currentRecordId);
        // Get the number of line Time Tracking items submitted
        lines = currentRec.getLineItemCount('time'); 
        //parse the list of time records
        for ( var i=1; i<=lines; i++ ) {
            //get the ID of the Time Tracking 
            var timeRecId = currentRec.getLineItemValue('time', 'doc', i);

            nlapiLogExecution ( 'DEBUG', 'time selected id', timeRecId );
            //if it's selected on the invoice, update its custom field
            // nlapiSetCurrentLineItemValue('time','custcol23', timeRecId );
            // nlapiSubmitField(('invoice',currentRecordId, 'custcol3', timeRecId );

            currentRec.setLineItemValue('time', 'custcol3', i, timeRecId);
            nlapiLogExecution ( 'DEBUG', 'successfully stamp', timeRecId );
        }

        nlapiSubmitRecord(currentRec);
    } catch (e) {
        var txt='';
        if (e instanceof nlobjError) {
            //this is netsuite specific error
            txt = 'NLAPI Error: Record ID :: '+currentRecordId+' :: '+e.getCode()+' :: '+e.getDetails() + ' :: ' + e.getStackTrace().join(', ');
        } else {
            //this is generic javascript error
            txt = 'JavaScript/Other Error: Record ID :: '+currentRecordId+' :: '+e.toString()+' : '+e.stack;
        }
        nlapiLogExecution('error','suiteScript() has encountered an error.',txt);
    }

}

// error function
function errText(internalId, e)
{
    var txt='';
    if (e instanceof nlobjError) {
        //this is netsuite specific error
        txt = 'NLAPI Error: Record ID :: '+internalId+' :: '+e.getCode()+' :: '+e.getDetails() + ' :: ' + e.getStackTrace().join(', ');
    } else {
        //this is generic javascript error
        txt = 'JavaScript/Other Error: Record ID :: '+internalId+' :: '+e.toString()+' : '+e.stack;
    }
    return txt;
}