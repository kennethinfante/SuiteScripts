/**
 * Company            Explore Consulting
 * Copyright            2013 Explore Consulting, LLC
 * Type                NetSuite EC_Scheduled_DeleteUnneededSerialNumberRecords
 * Version            1.0.0.0
 * Description        Scheduled script to go through and delete any un-linked Serial Number Records.
 **/

function onStart() {
    deleteSNRecords();
}


function deleteSNRecords()
{
    try
    {
        // Need to search for Serial Number records that are no longer linked to a transaction and delete them
        var filters = new Array();
        filters[0] = new nlobjSearchFilter('custrecord_sn_sales_order', null, 'is', '@NONE@');
        var columns = new Array();
        columns[0] = new nlobjSearchColumn('internalid');

        var sr = nlapiSearchRecord('customrecord_serial_numbers', null, filters, columns);
        if ( sr != null )
        {
            // Go through these results and delete them
            for ( var y=0; y<sr.length; y++ )
            {
                var id3 = nlapiDeleteRecord(sr[y].getRecordType(), sr[y].getId());
                nlapiLogExecution("DEBUG", "updateSerialNumberRecords", "Serial Number Record DELETED:  " + id3);
            }
        }
        else
        {
            nlapiLogExecution("DEBUG", "updateSerialNumberRecords", "NO Serial Number Records to be DELETED");
        }
    }
    catch(e)
    {
        var msg = Logger.FormatException(e);
        Logger.Write(Logger.LogType.Debug, 'Unexpected Error in EC_Scheduled_DeleteUnneededSerialNumberRecords script -- deleteSNRecords function', 'ERROR DETAILS:  ' + msg);
    }
}