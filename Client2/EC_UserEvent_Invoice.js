/**
 * Company            Explore Consulting
 * Copyright            2013 Explore Consulting, LLC
 * Type                NetSuite EC_UserEvent_Invoice
 * Version            1.0.0.0
 * Description        User event script to execute on Invoice transaction.
 *
 *
 * CREATED 3/14/2013        Explore Consulting - rhackey
 *
 **/

SNProcessingStatus =
{
   NoProcessingRequired: 1
    , PendingInitialProcessing: 2
    , PendingUpdate: 3
    , Complete: 4
    , Error: 5
}


function onBeforeLoad(type, form, request) {

}

function onBeforeSubmit(type) {

}

function onAfterSubmit(type) {
    if ( type == 'delete' ){ return; }
    markForSerialNumberRecordCreation(type);
}

function markForSerialNumberRecordCreation(type)
{
    try
    {
        var context = nlapiGetContext();
        if ( type == 'create' )
        {
            var invID = nlapiGetRecordId();
            var invoice = nlapiLoadRecord('invoice', invID);
            var lc = invoice.getLineItemCount('item');

            var changesMade = false;
            var formerStatus = invoice.getFieldValue('custbody_serial_number_processing_stat');

            for ( var i=1; i<=lc; i++ )
            {
                var serialNumbers = invoice.getLineItemValue('item', 'custcol_serialno', i);
                if ( serialNumbers != '' && serialNumbers != null )
                {
                    invoice.setLineItemValue('item', 'custcol_pending_sn_processing', i, 'T');
                    changesMade = true;
                }
                else
                {
                    invoice.setLineItemValue('item', 'custcol_pending_sn_processing', i, 'F');
                }
            }

            if ( changesMade == true && formerStatus == SNProcessingStatus.Complete )
            {
                invoice.setFieldValue('custbody_serial_number_processing_stat', SNProcessingStatus.PendingUpdate);
            }
            else if ( changesMade == true )
            {
                invoice.setFieldValue('custbody_serial_number_processing_stat', SNProcessingStatus.PendingInitialProcessing);
            }
            else       // No changes made
            {
                invoice.setFieldValue('custbody_serial_number_processing_stat', SNProcessingStatus.NoProcessingRequired);
            }

            var id = nlapiSubmitRecord(invoice, false, true);
            Logger.Write(Logger.LogType.Debug, 'markForSerialNumberRecordCreation', 'Invoice Record Updated:  ' + id);
        }
        else if ( type == 'edit' && context.getExecutionContext() != 'scheduled')
        {
            var invID = nlapiGetRecordId();
            var invoice = nlapiLoadRecord('invoice', invID);
            var lc = invoice.getLineItemCount('item');

            var changesMade = false;
            var formerStatus = invoice.getFieldValue('custbody_serial_number_processing_stat');

            for ( var i=1; i<=lc; i++ )
            {
                var processingNeeded = invoice.getLineItemValue('item', 'custcol_pending_sn_processing', i);
                if ( processingNeeded == 'T' )
                {
                    changesMade = true;
                }
            }

            if ( changesMade == true && formerStatus == SNProcessingStatus.Complete )
            {
                invoice.setFieldValue('custbody_serial_number_processing_stat', SNProcessingStatus.PendingUpdate);
            }
            else if ( changesMade == true )
            {
                invoice.setFieldValue('custbody_serial_number_processing_stat', SNProcessingStatus.PendingInitialProcessing);
            }
            else       // No changes made
            {
                invoice.setFieldValue('custbody_serial_number_processing_stat', SNProcessingStatus.NoProcessingRequired);
            }

            var id = nlapiSubmitRecord(invoice, false, true);
            Logger.Write(Logger.LogType.Debug, 'markForSerialNumberRecordCreation', 'Invoice Record Updated:  ' + id);
        }
    }
    catch(e)
    {
        var msg = Logger.FormatException(e);
        Logger.Write(Logger.LogType.Debug, 'Unexpected Error in EC_UserEvent_Invoice script -- markForSerialNumberRecordCreation function', 'ERROR DETAILS:  ' + msg);
    }
}

