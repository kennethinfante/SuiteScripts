

EC.onStart = function(){

    // Enable ability to run lazy search
    EC.enableLazySearch();

    // Define filters for search
    var filters = [
        ['custrecord_ec_process_status', 'anyof', ['1']] // 1 == Not Started
        , 'AND'
        , ['custrecord_ec_integration_type', 'anyof', ['2']] // 2 == Agent Upload
    ];

    // Retrieve master record ID from input parameter. This will only be provided if the script is requeueing itself. We
    // want to continue processing the same upload record. If empty, just continue process all open records
    var masterRecordId = nlapiGetContext().getSetting('SCRIPT', 'custscript_au_master_record_id_1');
    Log.d('masterRecordId', masterRecordId);
    if(masterRecordId)
        filters.push('AND', ['internalid', 'is', masterRecordId]);

    // Retrieve the first integration master record in the result set
    var integrationMasterRecord = EC.createSearch('customrecord_ec_integration_master', filters
        , [['custrecord_ec_upload_file'], ['custrecord_ec_process_status'], ['internalid']
            , ['custrecord_ec_integration_type']])
        .nsSearchResult2obj().first();
    Log.d('integrationMasterRecord', integrationMasterRecord);

    // If there is no integration master record then do not bother continuing to process script.
    if(!integrationMasterRecord){
        Log.d('No Master Records to Process');
        return;
    }

    // Loads the CSV file content from the associated file attached to the master record. Will return a
    // collection of objects. Each object is a row in the CSV file uploaded
    var fileContent = EC.loadFileContent(integrationMasterRecord.custrecord_ec_upload_file);
    Log.d('fileContent', fileContent);


    // Group by the sales order property, then add a property to the grouping as the key identifier value. This is
    // used below to exclude already processed child records.
    fileContent = _.map(_.groupBy(fileContent, 'nsOrderNumber'), function(obj, soNum){ obj.recordKey = soNum; return obj;});

    // We need to know which have already been created to void them from our base CSV file and exclude them from being
    // created again. If this is the first script execution this will not remove any from the base file content
    fileContent = EC.removeAlreadyCreatedItems(fileContent, integrationMasterRecord, 'recordKey');
    Log.d('fileContent - After', fileContent);

    // Create the child records.
    var stillProcessing = EC.createChildRecords(fileContent, integrationMasterRecord, 'recordKey');

    // If processing is completed and all child records are created, meaning it's not in a rescheduled state, then
    // flag the parent master record as completed and set it in a ready to process for another script to pick it up.
    if(stillProcessing == false){
        // Update the master record to identify that it's ready to process. Meaning all children have been created.
        nlapiSubmitField('customrecord_ec_integration_master', integrationMasterRecord.internalid
            , 'custrecord_ec_process_status', '2'); // 2 == Ready to Process
        Log.d('Update Master Record as completed. Ready to begin processing.')
    }
};


/**
 * Checks governance and reschedules this script if it has dropped below the threshold. This is intended to
 * be used in a .takeWhile()
 * @returns {boolean} true if sufficient governance units still remain
 */
function governanceRemains(param) {
    var ctx = nlapiGetContext();
    var threshold = 9960;
    var governanceRemains = ctx.getRemainingUsage() > threshold;
    Log.d('governanceRemaining', ctx.getRemainingUsage());
    if (governanceRemains == false) {
        Log.a('rescheduling script', 'remaining governance units slipped below threshold: ' + threshold);
        nlapiScheduleScript(ctx.getScriptId(),ctx.getDeploymentId()
            , {'custscript_au_master_record_id_1':(param.internalid || '')});
    }
    return governanceRemains
}