/**
 * Company            Explore Consulting
 * Copyright            2014 Explore Consulting, LLC
 * Type                NetSuite EC_UE_PopulateCDFields
 * Version            1.0.0.0
 * Requires: EC-Libs 4.0.3
 *
 * Populates Customer Deposit fields with values from the attached
 * Sales Order.
 **/

EC.onBeforeLoad = function(type, form, request) {
    /* Get cdFields from sales order */
    var cdFields = [
        'salesorder',
        'custbody_so_num',
        'custbody_job_name'
    ];

    var soFields = [
        'job'
    ];

    var record = nsdal.fromRecord(nlapiGetNewRecord(), cdFields);
    Log.d("record.salesorder", record.salesorder);
    if (record.salesorder != null) {
        var so_rec = nsdal.fromRecord(nlapiLoadRecord('salesorder', record.salesorder), soFields);
        Log.d("so_rec", JSON.stringify(so_rec));
        record.custbody_so_num = record.salesorder;
        record.custbody_job_name = so_rec.job;
    }
    Log.d("custbody_so_num", nlapiGetFieldValue(cdFields[0]));
    Log.d("custbody_job_name", nlapiGetFieldValue(cdFields[2]));
}