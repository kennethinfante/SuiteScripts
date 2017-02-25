/**
 * Company            Explore Consulting
 * Copyright            2013 Explore Consulting, LLC
 * Type                NetSuite EC_Scheduled_CreateSerialNumberRecords
 * Version            1.0.0.0
 * Description        This scheduled script will create the custom serial number records and connect them to the
 *                      invoice, customer and item records respectively.
 *
 *  CREATED 3/05/2013   rhackey
 *
 **/

var ScriptInputs =
{
    SearchID: 'customsearch_invoices_pending_sn_process'
    , ExecutionLimit: '200'
    , ScriptID: 'customscript31'
    , ScriptName: 'EC_Scheduled_CreateSerialNumberRecords'
    , AlertEmail: 'mobius@exploreconsulting.com'
}

var ScriptOutputs =
{
    ErrorOccurred: false
    , ErrorMessage: ''
}


function onStart() {
    processInvoices();
}

function processInvoices()
{
    try
    {
        var results = nlapiSearchRecord('transaction', ScriptInputs.SearchID, null, null);

        if ( results != null )
        {
            if ( results.length == 1000 )
                var rerun = true;
            else
                var rerun = false;

            var context = nlapiGetContext();
            for ( var i=0; context.getRemainingUsage() > ScriptInputs.ExecutionLimit && i<results.length; i++ )
            {
                var invID = results[i].getId();
                var skipSecondSubmit = false;
                if ( invID != null )
                {
                    nlapiLogExecution("DEBUG", "processInvoices", "Inv ID:  " + invID);
                    var invRec = nlapiLoadRecord('invoice', invID);
                    var invProcessingType = invRec.getFieldValue('custbody_serial_number_processing_stat');
                    var custID = invRec.getFieldValue('entity');

                    var lc = invRec.getLineItemCount('item');
                    for ( var r=1; r<=lc; r++ )
                    {
                        nlapiLogExecution("DEBUG", "processInvoices", "Processing Line:  " + r);
                        var lineProcessingStatus = invRec.getLineItemValue('item', 'custcol_pending_sn_processing', r);
                        nlapiLogExecution("DEBUG", "processInvoices", "lineProcessingStatus:  " + lineProcessingStatus);
                        var itemID = invRec.getLineItemValue('item', 'item', r);
                        nlapiLogExecution("DEBUG", "processInvoices", "itemID:  " + itemID);
                        var serialString = invRec.getLineItemValue('item', 'custcol_serialno', r);
                        nlapiLogExecution("DEBUG", "processInvoices", "serialString:  " + serialString);

                        if ( lineProcessingStatus == 'T' && (serialString != null && serialString != '') )
                        {
                            var serialArray = new Array();
                            serialArray = getSerialNumbers(serialString, r);
                            if ( serialArray != null && serialArray.length > 0 )
                            {
                                nlapiLogExecution("DEBUG", "processInvoices", "invProcessingType:  " + invProcessingType);
                                if ( invProcessingType == 2 )        // 2 = Pending Initial Processing
                                {
                                    var id = createSerialNumberRecords(serialArray, custID, invID, itemID, r);
                                    nlapiLogExecution("DEBUG", "processInvoices", "after createSerialNumberRecords");
                                }
                                else if ( invProcessingType == 3 )   // 3 = Pending Update
                                {
                                    var id = updateSerialNumberRecords(serialArray, custID, invID, itemID, r);
                                    nlapiLogExecution("DEBUG", "processInvoices", "after updateSerialNumberRecords");
                                }

                                nlapiLogExecution("DEBUG", "processInvoices", "Set Pending SN Processing Checkbox:  " + id);
                                invRec.setLineItemValue('item', 'custcol_pending_sn_processing', r, 'F');       // PROCESSING DONE
                            }
                            else if ( serialArray == null )
                            {
                                nlapiLogExecution("DEBUG", "processInvoices", "This line is not ready for processing - " + r);
                                invRec.setLineItemValue('item', 'custcol_pending_sn_processing', r, 'F');       // PROCESSING DONE

                                nlapiLogExecution("DEBUG", "processInvoices", "serialArray was empty - an error must have occurred - LEAVE INVOICE");
                                invRec.setFieldValue('custbody_serial_number_processing_stat', 5);         // 5 = ERROR
                                invRec.setFieldValue('custbody_sn_processing_errors', ScriptOutputs.ErrorMessage);
                                var id = nlapiSubmitRecord(invRec, false, true);
                                nlapiLogExecution("DEBUG", "processInvoices", "Invoice Record Update:  " + id);
                                skipSecondSubmit = true;
                                break;      // Move on to next Invoice - don't process anymore lines for this invoice
                            }
                        }
                    }

                    if ( skipSecondSubmit == false )
                    {
                        invRec.setFieldValue('custbody_sn_processing_errors', '');
                        nlapiLogExecution("DEBUG", "processInvoices", "about to set SN Procesing Status to 4");
                        invRec.setFieldValue('custbody_serial_number_processing_stat', 4);       // 4 = Complete status

                        var id2 = nlapiSubmitRecord(invRec, false, true);
                        nlapiLogExecution("DEBUG", "processInvoices", "Invoice Record Updated:  " + id2);
                    }
                }
                else
                {
                    nlapiLogExecution("DEBUG", "processInvoices", "Inv ID was null");
                }
            }

            if ( context.getRemainingUsage() <= ScriptInputs.ExecutionLimit || rerun == true)
            {
                Logger.Write(Logger.LogType.Debug, 'Scheduling Script to continue updating');
                var result = nlapiScheduleScript(ScriptInputs.ScriptID, null, null);                  // 20 units
                Logger.Write(Logger.LogType.Debug, 'Scheduling Script RESULT:  ' + result);
                if ( result != 'QUEUED' )
                {
                    Logger.Write(Logger.LogType.Debug,'scheduled script not queued',
                        'expected QUEUED but scheduled script api returned ' + result);
                    var emailBody5 = "Script: " + ScriptInputs.ScriptName + "\nFunction: processInvoices\nError: There was an issue re-scheduling the scheduled script in this script";
                    Messaging.SendMessage(101575, ScriptInputs.AlertEmail, ScriptInputs.ScriptName, emailBody5);

                }
                else
                {
                    Logger.Write(Logger.LogType.Debug,'Re-Scheduling Script Status', "Result:  " + result);
                }
            }

        }
        else
        {
            nlapiLogExecution("DEBUG", "processInvoices", "No Search Results found");
        }
    }
    catch(e)
    {
        var msg = Logger.FormatException(e);
        nlapiLogExecution("DEBUG", "processInvoices", "Unexpected error occurred in EC_Scheduled_CreateSerialNumberRecords:  " + msg);
    }
}

function getSerialNumbers(snString, lineNumber)
{
    var LegalSeparator = "%0A";
    var SpaceCharacter = "%20";
    nlapiLogExecution("DEBUG", "getSerialNumbers", "snString:  " + snString);
    nlapiLogExecution("DEBUG", "getSerialNumbers", "snString-escaped:  " + escape(snString));

    snString = escape(snString);

    // Remove all spaces
    while ( snString.indexOf(SpaceCharacter) > -1 )
    {
        snString = snString.replace(SpaceCharacter, "");
    }

    try
    {
        var myArray = new Array();
        if ( snString != null && snString != '' )
        {
            if ( snString.indexOf(SpaceCharacter) > -1 )
            {
                nlapiLogExecution("DEBUG", "getSerialNumbers", "This string contains spaces - throw error that no comma delimiter was found");
                ScriptOutputs.ErrorOccurred = true;
                nlapiLogExecution("DEBUG", "getSerialNumbers", "ErrorMessage - before set:  " + ScriptOutputs.ErrorMessage);
                if ( ScriptOutputs.ErrorMessage != '' && ScriptOutputs.ErrorMessage != null ){ ScriptOutputs.ErrorMessage += '\n'; }
                ScriptOutputs.ErrorMessage += 'Line Number: ' + lineNumber + '\nError: Serial Numbers not comma delimited\n';
                nlapiLogExecution("DEBUG", "getSerialNumbers", "ErrorMessage - after set:  " + ScriptOutputs.ErrorMessage);
                myArray = null;
            }
            else if ( snString.indexOf(LegalSeparator) > -1 )
            {
                myArray = snString.split(LegalSeparator);
            }
            else
            {
                myArray.push(snString);
            }
        }
    }
    catch(e)
    {
        var msg = Logger.FormatException(e);
        nlapiLogExecution("DEBUG", "getSerialNumbers", "Unexpected error occurred in EC_Scheduled_CreateSerialNumberRecords:  " + msg);
    }

    return myArray;
}

function createSerialNumberRecords(snArray, custID, soID, itemID, orderLine)
{
    try
    {
        var id2 = null;
        if ( snArray != null )
        {
            nlapiLogExecution("DEBUG", "createSerialNumberRecords", "snArray.length:  " + snArray.length);

            for ( var s = 0; s<snArray.length; s++ )
            {
                var currentSerialNumber = snArray[s];
                if ( currentSerialNumber != null )
                {
                    var snRecord = nlapiCreateRecord('customrecord_serial_numbers');
                    snRecord.setFieldValue('name', currentSerialNumber);                   // TODO:  Comment out this line to test ERROR HANDLING
                    snRecord.setFieldValue('custrecord_sn_sales_order', soID);
                    snRecord.setFieldValue('custrecord_sn_customer', custID);
                    snRecord.setFieldValue('custrecord_sn_order_line', orderLine);
                    snRecord.setFieldValue('custrecord_sn_item', itemID);

                    id2 = nlapiSubmitRecord(snRecord, true, false);
                    nlapiLogExecution("DEBUG", "createSerialNumberRecords", "NEW Serial Number Record Created:  " + id2);
                }
            }
        }
    }
    catch(e)
    {
        var msg = Logger.FormatException(e);
        nlapiLogExecution("DEBUG", "createSerialNumberRecords", "Unexpected error occurred in EC_Scheduled_CreateSerialNumberRecords:  " + msg);
    }

    return id2;
}

function updateSerialNumberRecords(snArray, custID, soID, itemID, orderLine)
{
    try
    {
        var id2 = null;
        if ( snArray != null )
        {
            nlapiLogExecution("DEBUG", "updateSerialNumberRecords", "snArray.length:  " + snArray.length);

            // If Serial Numbers already exist for this Invoice and Line Number, they need to be deleted
            var filters = new Array();
            filters[0] = new nlobjSearchFilter('custrecord_sn_sales_order', null, 'is', soID);
            filters[1] = new nlobjSearchFilter('custrecord_sn_customer', null, 'is', custID);
            filters[2] = new nlobjSearchFilter('custrecord_sn_order_line', null, 'is', orderLine);
            var columns = new Array();
            columns[0] = new nlobjSearchColumn('internalid');

            var sr = nlapiSearchRecord('customrecord_serial_numbers', null, filters, columns);
            if ( sr != null )
            {
                // Go through these results and delete them
                for ( var y=0; y<sr.length; y++ )
                {
                    var id3 = nlapiDeleteRecord(sr[y].getRecordType(), sr[y].getId());
                    nlapiLogExecution("DEBUG", "updateSerialNumberRecords", "Serial Number Record DELETE:  " + id3);
                }

                // No pre-existing SN Customer records were found, so we will just move forward with creating new SN records
                for ( var s = 0; s<snArray.length; s++ )
                {
                    var currentSerialNumber = snArray[s];
                    if ( currentSerialNumber != null )
                    {
                        var snRecord = nlapiCreateRecord('customrecord_serial_numbers');
                        snRecord.setFieldValue('name', currentSerialNumber);                    // TODO:  Comment out this line to test ERROR HANDLING
                        snRecord.setFieldValue('custrecord_sn_sales_order', soID);
                        snRecord.setFieldValue('custrecord_sn_customer', custID);
                        snRecord.setFieldValue('custrecord_sn_order_line', orderLine);
                        snRecord.setFieldValue('custrecord_sn_item', itemID);

                        id2 = nlapiSubmitRecord(snRecord, true, false);
                        nlapiLogExecution("DEBUG", "updateSerialNumberRecords", "NEW Serial Number Record Created:  " + id2);
                    }
                }
            }
            else
            {
                // No pre-existing SN Customer records were found, so we will just move forward with creating new SN records
                for ( var s = 0; s<snArray.length; s++ )
                {
                    var currentSerialNumber = snArray[s];
                    if ( currentSerialNumber != null )
                    {
                        var snRecord = nlapiCreateRecord('customrecord_serial_numbers');
                        snRecord.setFieldValue('name', currentSerialNumber);                    // TODO:  Comment out this line to test ERROR HANDLING
                        snRecord.setFieldValue('custrecord_sn_sales_order', soID);
                        snRecord.setFieldValue('custrecord_sn_customer', custID);
                        snRecord.setFieldValue('custrecord_sn_order_line', orderLine);
                        snRecord.setFieldValue('custrecord_sn_item', itemID);

                        id2 = nlapiSubmitRecord(snRecord, true, false);
                        nlapiLogExecution("DEBUG", "updateSerialNumberRecords", "NEW Serial Number Record Created:  " + id2);
                    }
                }
            }
        }
    }
    catch(e)
    {
        var msg = Logger.FormatException(e);
        nlapiLogExecution("DEBUG", "createSerialNumberRecords", "Unexpected error occurred in EC_Scheduled_CreateSerialNumberRecords:  " + msg);
    }

    return id2;
}