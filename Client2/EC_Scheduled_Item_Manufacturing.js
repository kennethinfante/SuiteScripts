/**
 * Created by jelvidge on 2/4/2016.
 */

// Enable ability to run lazy search
EC.enableLazySearch();

// Custom mapping that is helpful because item search columns return bad record types. Need to map to proper record
// type in order to load the record.
var mapItemType = {'InvtPart':'inventoryitem', 'NonInvtPart':'noninventoryitem', 'Group':'itemgroup', 'Kit':'kititem'
    , 'Assembly':'assemblyitem', 'Service':'serviceitem', 'Description':'descriptionitem', 'Discount':'discountitem'
    , 'OthCharge':'otherchargeitem', 'GiftCert':'giftcertificateitem', 'Markup':'markupitem', 'Payment':'paymentitem'
    , 'Subtotal':'subtotalitem'};

EC.onStart = function(input) {

    // Define filters for search
    var filters = [
        ['custrecord_ec_process_status', 'anyof', ['2', '3']] // 2 == Ready to Process || 3 == Processing
        , 'AND'
        , ['custrecord_ec_integration_type', 'is', '1'] // 1 == Item Manufacturer
    ];

    // Retrieve upload record ID from input parameter. This will only be provided if the script is requeueing itself. We
    // want to continue processing the same upload record. If empty, just continue process all open records
    var masterRecordId = nlapiGetContext().getSetting('SCRIPT', 'custscript_int_master_record_id');
    Log.d('masterRecordId', masterRecordId);
    if(masterRecordId)
        filters.push('AND', ['internalid', 'is', masterRecordId]);

    // Retrieve and process all records associated to the master record
    EC.createSearch('customrecord_ec_integration_master', filters
        , [['internalid'], ['custrecord_ec_upload_file'], ['custrecord_ec_process_status']])
        .nsSearchResult2obj()
        .each(function (result) {
            Log.d('result', result);

            // Update the Manufacturer Upload record to identify its in processing mode
            nlapiSubmitField('customrecord_ec_integration_master', result.internalid
                , 'custrecord_ec_process_status', '2'); // 2 == Processing

            //  Handle updating the item manufacturer records
            var stillProcessingMfg = EC.itemMfgRecordUpdates(result);
            if(stillProcessingMfg == false){

                // Handles updating all of the item records with their new manufacturing record reference.
                var stillProcessingItems = EC.updateItemRecords(result);
                if(stillProcessingItems == false){

                    // Process transactions to update line items
                    var stillProcessing = EC.processTransactions(result);
                    
                    // Update upload record to be completed status when processing is complete
                    if(stillProcessing == false)
                        nlapiSubmitField('customrecord_ec_integration_master', result.internalid
                            , 'custrecord_ec_process_status', '4'); // 4 == Completed
                }
            }
        });
};

/**
 * Handles updating all of the item manufacturing records
 * @param result
 * @returns {boolean}
 */
EC.itemMfgRecordUpdates = function(result){

    // Retrieves the first 900 child item records ready for processing
    var stillProcessing = EC.createSearch('customrecord_ec_integration_child'
        , [
            ['custrecord_ec_parent_record', 'is', result.internalid]
            , 'AND'
            , ['custrecord_ec_status', 'anyof', ['1']] // 1 = Not Started
        ]
        , [['custrecord_ec_parent_record'], ['custrecord_ec_raw_data'], ['internalid']
            , ['custrecord_ec_key'],['custrecord_ec_status']])
        .nsSearchResult2obj()
        .takeWhile(governanceRemains)
        .each(function (result) {

            // Retrieve raw data from child record field and parse it. If unable to parse, will return null
            var rawDataObj = JSON.parse(result.custrecord_ec_raw_data) || null;
            Log.d('rawDataObj', rawDataObj);

            // Retrieve the item name from the raw obj
            var fileItemMfgId = _.get(rawDataObj, 'itemMfg');
            Log.d('fileItemMfgId', fileItemMfgId);

            // Run a search to retrieve all of the item manufacturing records in NetSuite.
            var nsItemMfgRecords = EC.createSearch('customrecord_item_manufacturer', null, [['internalid'], ['name']])
                .nsSearchResult2obj().toArray();

            try{
                //Determine if the item Name exists in the list of results for all item manufacturer records in NetSuite
                var itemMatch = _.find(nsItemMfgRecords
                    , function(resultItem){ return resultItem.internalid == fileItemMfgId;});
                Log.d('itemMatch', itemMatch);

                // If an item match is not found then we want to create a new one
                if(itemMatch){
                    // Update the child item record to reflect that the item manufacturing processing has been completed
                    // Completed means that it already exists in the system and is ready to use
                    nlapiSubmitField('customrecord_ec_integration_child', result.internalid
                        , 'custrecord_ec_status', '2'); // 2 == Processing - Item Mfg Update Complete
                }
                else{
                    Log.d('Item Match Not Found. Flag child to stop processing due to name no match.');
                    // Update the child item record to reflect that the item manufacturing processing has been completed
                    nlapiSubmitField('customrecord_ec_integration_child', result.internalid
                        , 'custrecord_ec_status', '6'); // 6 == Error - Item Mfg Does Not Exist
                }
            }
            catch(e){
                Log.e('Failed to process item manufacturing for child record', EC.getExceptionDetail(e));

                // Update the child item record to reflect that the item manufacturing processing has been completed
                nlapiSubmitField('customrecord_ec_integration_child', result.internalid
                    , 'custrecord_ec_status', '5'); // 5 == Error
            }
        });
    Log.d('Item Manufacturing - stillProcessing', stillProcessing);
    return stillProcessing;
};

/**
 * Process all transactions with the new item data. For each child record that is ready to process, it will search all
 * transactions that have this item on it. It will update the transaction to use the new proper manufacturing data on
 * that item record. Once that line is updated, it will submit the order with that new line item data.
 * @param uploadRecord
 */
EC.processTransactions = function(uploadRecord){

    // Create search and process transactions against child integration records
    var stillProcessing = EC.createSearch('customrecord_ec_integration_child'
        , [
            ['custrecord_ec_parent_record', 'is', uploadRecord.internalid]
            , 'AND'
            , ['custrecord_ec_status', 'anyof', ['3']] // 3 == Processing - Item Update Complete
        ]
        , [['custrecord_ec_parent_record'], ['custrecord_ec_raw_data'], ['internalid']
            , ['custrecord_ec_key'],['custrecord_ec_status']])
        .nsSearchResult2obj()
        .takeWhile(governanceRemains)
        .each(function (result) {
            try
            {
                Log.d('transaction - processing child record', result);

                // Retrieve special item obj. Pass in result as array as this function expects a collection of records
                // rather than a single record.
                var itemMfgDataObj = EC.buildItemMfgObj(result);
                Log.d('itemMfgDataObj', itemMfgDataObj);

                // Retrieve transaction records to process for the item
                var transactionsToProcess = EC.getTransactionRecords(itemMfgDataObj);

                // Process each unique transaction. Load the record and update the lines on the record. Submit record
                // once complete. Rinse and repeat. If we run out of governance processing these transactions the script
                // will reschedule itself using the take while and return of the governance remaining
                _.takeWhile(transactionsToProcess, function(transactionResult){
                    Log.d('Updating Transaction', transactionResult);

                    // Update the transaction record
                    EC.updateTransactionRecord(transactionResult, itemMfgDataObj);

                    //Update related records if there are any
                    _.each(transactionResult.relatedRecords, function(relatedRecordData){
                        Log.d('updating related record', relatedRecordData);

                        // Handles updating the transaction of the related record
                        EC.updateTransactionRecord(relatedRecordData, itemMfgDataObj);
                    });

                    return governanceRemains(result);
                });

                // Update the child item record to reflect that the item processing has been completed successfully
                nlapiSubmitField('customrecord_ec_integration_child', result.internalid
                    , 'custrecord_ec_status', '4'); // 4 == Complete
            }
            catch(e){
                // Update the child item record to reflect that the item manufacturing processing has been completed
                nlapiSubmitField('customrecord_ec_integration_child', result.internalid
                    , 'custrecord_ec_status', '5'); // 5 == Error
            }
        });
    Log.d('stillProcessingTransactions', stillProcessing);

    return stillProcessing;
};

/**
 * Handles updating the transaction record based on the result data (type and id) that we need to update. Includes
 * an item data object which provides data on what values to set on the line level properties.
 * @param transactionResult. Search result for a transaction record.
 * @param itemData. Values that need to be set on the lines of a transaction record.
 */
EC.updateTransactionRecord = function(transactionResult, itemData){
    // Load the transaction record
    var transactionRecord = nsdal.loadObject(transactionResult.recordtype, transactionResult.internalid
        , ['tranid'])
        .withSublist('item', ['item', 'quantity', 'custcol_item_manufacturer', 'custcol_integration_rec_update_ref']);
    Log.d('transactionRecord', transactionRecord);

    // Iterate through all of the transaction lines and update if needed
    _.each(transactionRecord.item, function(item){
        // If Manufacturing Item was matched to the current line then update it. Otherwise do nothing to the line.
        if(itemData.nsItemRecordId == item.item){
            Log.d('updating line', item);
            item.custcol_item_manufacturer = itemData.mfgRecordId;
            item.custcol_integration_rec_update_ref = itemData.childRecordId;
        }
    });

    // Submit the transaction record
    var transactionId = transactionRecord.save();
    Log.d('Record Saved', transactionId);
};

EC.getTransactionRecords = function(itemMfgDataObj){

    // Define transaction search filters
    var filters = [
        ['mainline', 'is', 'F']
        , 'AND', ['item', 'anyof', itemMfgDataObj.nsItemRecordId]
        , 'AND', ['custcol_integration_rec_update_ref', 'noneof', itemMfgDataObj.childRecordId]
    ];

    // If a cutoff date is provided add it as a filter. Otherwise if empty, do not apply the date filter.
    if(itemMfgDataObj.cutoffDate){
        filters.push('AND'); filters.push(['trandate', 'onorafter', itemMfgDataObj.cutoffDate])
    }

    // Search for all transaction records that match our criteria. We are pulling lines on a transaction not the actual
    // orders themselves
    var results = EC.createSearch('transaction', filters
        , [['custcol_integration_rec_update_ref'], ['internalid'], ['recordtype'], ['createdfrom'], ['customform']])
        .nsSearchResult2obj().uniq('internalid').toArray();
    Log.d('getTransactionRecords - results', results);

    var salesOrderResults =  _.filter(results, function(result)
        { return ((result.recordtype == 'salesorder') && (result.customform == '174' || result.customform == '149'))});
    ////////////////////////////////////////
    _.each(salesOrderResults, function(salesOrder){
        // Retrieve all of the related transaction records that need to be updated, associated to the sales order.
        // We are running a new separate search without the date filter. More efficient than loading ALL transactions
        // in the system and applying a filter to the results.
        salesOrder.relatedRecords = EC.createSearch('transaction',
            [
                ['mainline', 'is', 'F']
                , 'AND', ['createdfrom', 'is', salesOrder.internalid]
                , 'AND', ['item', 'anyof', itemMfgDataObj.nsItemRecordId]
                , 'AND', ['custcol_integration_rec_update_ref', 'noneof', itemMfgDataObj.childRecordId]
            ]
            , [['custcol_integration_rec_update_ref'], ['internalid'], ['recordtype'], ['createdfrom']])
            .nsSearchResult2obj()
            .uniq('internalid')
            .filter(function(result){ return (result.recordtype == 'invoice' || result.recordType == 'estimate')})
            .toArray();
    });
    Log.d('salesOrderResults', salesOrderResults);

    // Retrieve the purchase order results and retrieve all related records
    var purchaseOrderResults = _.filter(results, function(result){ return result.recordtype == 'purchaseorder'});
    _.each(purchaseOrderResults, function(purchaseOrder){
        // Retrieve all of the related transaction records that need to be updated, associated to the sales order.
        // We are running a new separate search without the date filter. More efficient than loading ALL transactions
        // in the system and applying a filter to the results.
        purchaseOrder.relatedRecords = EC.createSearch('transaction',
            [
                ['mainline', 'is', 'F']
                , 'AND', ['createdfrom', 'is', purchaseOrder.internalid]
                , 'AND', ['item', 'anyof', itemMfgDataObj.nsItemRecordId]
                , 'AND', ['custcol_integration_rec_update_ref', 'noneof', itemMfgDataObj.childRecordId]
            ]
            , [['custcol_integration_rec_update_ref'], ['internalid'], ['recordtype'], ['createdfrom']])
            .nsSearchResult2obj()
            .uniq('internalid')
            .filter(function(result){ return (result.recordtype == 'vendorbill' || result.recordType == 'cashsale')})
            .toArray();
    });
    Log.d('purchaseOrderResults', purchaseOrderResults);

    // Retrieve the quote record type results
    var quoteResults = _.filter(results, function(result){ return result.recordtype == 'estimate'});
    Log.d('quoteResults', quoteResults);

    // Retrieve the opportunity record type results
    var opportunityResults = _.filter(results, function(result){ return result.recordtype == 'opportunity'});
    Log.d('opportunityResults', opportunityResults);

    // Concatenate all of the filters result sets.
    var transactionsToProcess = _.concat(salesOrderResults, purchaseOrderResults, quoteResults, opportunityResults);
    Log.d('transactionsToProcess', transactionsToProcess);

    return transactionsToProcess;
};

/**
 * This function handles updating the item record. We have new inbound data that needs to be set on item records in
 * netSuite. For every item manufacturing object in the collection of imported data, we need to update the associated
 * item record with the new reference to the item manufacturer.
 * @param uploadRecord. The master record result data
 */
EC.updateItemRecords = function(uploadRecord){

    // Process items associated to integration child records
    var stillProcessing = EC.createSearch('customrecord_ec_integration_child'
        , [
            ['custrecord_ec_parent_record', 'is', uploadRecord.internalid]
            , 'AND'
            , ['custrecord_ec_status', 'anyof', ['2']] // 2 == Processing - Item Mfg Update Complete
        ]
        , [['custrecord_ec_parent_record'], ['custrecord_ec_raw_data'], ['internalid']
            , ['custrecord_ec_key'],['custrecord_ec_status']])
        .nsSearchResult2obj()
        .takeWhile(governanceRemains)
        .each(function (result) {
            // Add important attributes to our base inbound data in order to help with easier processing of this script content
            var mfgItemData = EC.buildItemMfgObj(result);
            Log.d('updateItemRecords - mfgItemData', mfgItemData);

            try{
                Log.d('trying to load item record');
                Log.d('itemType', mapItemType[mfgItemData.nsItemRecordType]);
                Log.d('itemId', mfgItemData.nsItemRecordId);
                // Load the item record
                var itemRecord = nsdal.loadObject(mapItemType[mfgItemData.nsItemRecordType], mfgItemData.nsItemRecordId
                    , ['custitemitemmanufacturer', 'custitem_ec_last_update_file']);
                Log.d('itemRecord', itemRecord);

                // Update the item record with the new manufacturing item record reference.
                itemRecord.custitemitemmanufacturer = mfgItemData.mfgRecordId;
                itemRecord.custitem_ec_last_update_file = uploadRecord.custrecord_ec_upload_file;

                var itemRecordId = itemRecord.save();
                Log.d('Item Record Updated', itemRecordId);

                // Update the child item record to reflect that the item processing has been completed successfully
                nlapiSubmitField('customrecord_ec_integration_child', mfgItemData.internalid
                    , 'custrecord_ec_status', '3'); // 3 == Processing - Item Update Complete
            }
            catch(e){
                Log.e('Failed to process item manufacturing for child record', EC.getExceptionDetail(e));

                // Update the child item record to reflect that the item manufacturing processing has been completed
                nlapiSubmitField('customrecord_ec_integration_child', mfgItemData.internalid
                    , 'custrecord_ec_status', '5'); // 5 == Error
            }
        });
    Log.d('updateItemRecords - stillProcessing', stillProcessing);
    return stillProcessing;
};

/**
 * This will add some new parameter data to our current child item record. For each item we need to associate the
 * manufacturing record internal ID along with the associated netsuite item ID. This is useful for organizing the data
 * for updating records in this script.
 * @param childRecord. A single result of a child record to process
 * @returns {Object}
 */
EC.buildItemMfgObj = function(childRecord){
    // Retrieve raw data from child record field and parse it. If unable to parse, will return null
    var rawDataObj = JSON.parse(childRecord.custrecord_ec_raw_data) || null;
    Log.d('rawDataObj', rawDataObj);

    // Retrieve the item name from the raw obj
    var fileItemName = _.get(rawDataObj, 'itemName');
    Log.d('fileItemName', fileItemName);

    // Re-run the search to get all of the manufacturing item records now that we have created new ones.
    var nsItemMfgRecords = EC.createSearch('customrecord_item_manufacturer', null, [['internalid'], ['name']])
        .nsSearchResult2obj().toArray();

    // Runs a search to retrieve all of the items in NetSuite that match the file names we want to update
    var nsItemResult = EC.getNSItem(fileItemName);
    Log.d('nsItemResult', nsItemResult);

    // Determine if the item Name exists in the list of results for all item manufacturer records in NetSuite
    var itemMfgRecordMatch = _.find(nsItemMfgRecords, function(rec){ return rec.internalid == rawDataObj.itemMfg;});
    Log.d('itemMfgRecordMatch', itemMfgRecordMatch);

    // Set the record ID's found that are associated to the file item we need to update
    childRecord.mfgRecordId = itemMfgRecordMatch ? itemMfgRecordMatch.internalid : '';
    childRecord.nsItemRecordId = nsItemResult ? nsItemResult.internalid : '';
    childRecord.nsItemRecordType = nsItemResult ? nsItemResult.type : '';
    childRecord.childRecordId = childRecord.internalid;
    childRecord.cutoffDate = _.get(rawDataObj, 'cutoffDate');

    return childRecord;
};

/**
 * Runs a search to retrieve all of the NS items based on a search. This is required because we need to update all of
 * these item records and will need to load them in order to update them with the new manufacturing item.
 * @param fileItemName. The file name we want to retrieve the item for
 * @returns {*}
 */
EC.getNSItem = function(fileItemName){
    // Search all items and return the first match where item id matches the inbound item name.
    var nsItemResult = EC.createSearch('item', ['itemid', 'is', fileItemName]
        , [['itemid'], ['internalid'], ['custitemitemmanufacturer'], ['type']])
        .nsSearchResult2obj().first();
    Log.d('nsItemResult', nsItemResult);

    return nsItemResult;
};

/**
 * Checks governance and reschedules this script if it has dropped below the threshold. This is intended to
 * be used in a .takeWhile()
 * @returns {boolean} true if sufficient governance units still remain
 */
function governanceRemains(param) {
    var ctx = nlapiGetContext();
    var threshold = 500;
    var governanceRemains = ctx.getRemainingUsage() > threshold;
    Log.d('governanceRemaining', ctx.getRemainingUsage());
    if (governanceRemains == false) {
        Log.a('rescheduling script', 'remaining governance units slipped below threshold: ' + threshold);
        nlapiScheduleScript(ctx.getScriptId(),ctx.getDeploymentId()
            , {'custscript_int_master_record_id':(param.custrecord_ec_parent_record || '')})
    }
    return governanceRemains
}

//Log.AutoLogMethodEntryExit();
//Log.AutoLogGovernanceUsage();