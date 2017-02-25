

// Enable ability to run lazy search
EC.enableLazySearch();

EC.onStart = function() {

    // Define filters for search for parent search
    var filters = [
        ['custrecord_ec_process_status', 'anyof', ['2', '3']] // 2 == Ready to Process || 3 == Processing
        , 'AND'
        , ['custrecord_ec_integration_type', 'is', '2'] // 2 == Agent
    ];

    // Retrieve upload record ID from input parameter. This will only be provided if the script is requeueing itself. We
    // want to continue processing the same upload record. If empty, just continue process all open records
    var masterRecordId = nlapiGetContext().getSetting('SCRIPT', 'custscript_au_master_record_id_2');
    Log.d('masterRecordId', masterRecordId);
    if(masterRecordId)
        filters.push('AND', ['internalid', 'is', masterRecordId]);

    // Retrieve and process all records associated to the master record
    EC.createSearch('customrecord_ec_integration_master', filters
        , [['internalid'], ['custrecord_ec_upload_file'], ['custrecord_ec_process_status']])
        .nsSearchResult2obj()
        .each(function (result) {
            Log.d('result', result);

            // Update the master record to identify its in processing mode
            nlapiSubmitField('customrecord_ec_integration_master', result.internalid
                , 'custrecord_ec_process_status', '2'); // 2 == Processing

            //  Handle updating the transaction records
            var stillProcessing = EC.salesOrderUpdates(result);
            if(stillProcessing == false){
                nlapiSubmitField('customrecord_ec_integration_master', result.internalid
                    , 'custrecord_ec_process_status', '3'); // 3 == Completed
            }
        });
};

/**
 * Handles updating all of the sales orders
 * @param parentRecord. The parent record search result. Only contains very few properties pertaining to parent record.
 * @returns
 */
EC.salesOrderUpdates = function(parentRecord){

    // Run and process child item records. If completed processing all results this will return false. Otherwise
    // if not completed processing all results this will return true.
    var stillProcessing = EC.createSearch('customrecord_ec_integration_child'
        , [
            ['custrecord_ec_parent_record', 'is', parentRecord.internalid]
            , 'AND'
            , ['custrecord_ec_status', 'anyof', ['1']] // 1 = Not Started
        ]
        , [['custrecord_ec_parent_record'], ['custrecord_ec_raw_data'], ['internalid']
            , ['custrecord_ec_key'],['custrecord_ec_status']])
        .nsSearchResult2obj()
        .takeWhile(governanceRemains)
        .each(function (result) {
            Log.d('childRecord', result);

            // Retrieve raw data from child record field and parse it. If unable to parse, will return null
            var rawDataColl = JSON.parse(result.custrecord_ec_raw_data) || null;
            Log.d('rawDataColl', rawDataColl);

            // Run a search to retrieve the first sales order that matches the tran id
            var nsSalesOrder = EC.createSearch('salesorder'
                , [['tranid', 'is', result.custrecord_ec_key], 'AND', ['mainline', 'is', 'T']]
                , [['internalid']])
                .nsSearchResult2obj().first();
            Log.d('nsSalesOrder', nsSalesOrder);

            try{
                // If a sales order is found, load and update the transaction. If not found flag the child with error
                if(nsSalesOrder){
                    //Determine if the item Name exists in the list of results for all item manufacturer records in NetSuite
                    var salesOrderRecord = nsdal.loadObject('salesorder', nsSalesOrder.internalid
                        , ['tranid', 'entity', 'custbody_agent_so_payment_id', 'custbody_agent_so_payment_date'
                            , 'custbody_agent_so_claim_id', 'custbodyhpsalesorder', 'otherrefnum', 'shipdate'
                            , 'custbody_updated_cloudconnect', 'custbody_cloudconnect_update_datetime'])
                        .withSublist('item', ['item']);
                    Log.d('salesOrderRecord', salesOrderRecord);

                    // Update the sales order record. If success returns true, else empty/false.
                    var orderUpdateSuccess = EC.updateSalesOrder(salesOrderRecord, rawDataColl);
                    if(orderUpdateSuccess){
                        // Update the child item record to reflect that the processing has been completed.
                        nlapiSubmitField('customrecord_ec_integration_child', result.internalid
                            , 'custrecord_ec_status', '4'); // 4 == Complete
                    }
                    else{
                        Log.e('Error - Invalid Transaction Data Provided.');
                        // // Update the child item to reflect that the sales order failed to update due to invalid data
                        nlapiSubmitField('customrecord_ec_integration_child', result.internalid
                            , 'custrecord_ec_status', '8'); // 8 == Error - Invalid Transaction Data Provided
                    }
                }
                else{
                    Log.e('Sales Order Not Found. Flag child to stop processing due to no match.');
                    // Update the child item record to reflect that the sales order does not exist
                    nlapiSubmitField('customrecord_ec_integration_child', result.internalid
                        , 'custrecord_ec_status', '7'); // 7 == Error - Transaction Does Not Exist
                }
            }
            catch(e){
                Log.e('Failed to update sales order for child record', EC.getExceptionDetail(e));

                // Update the child item record to reflect that the item manufacturing processing has been completed
                nlapiSubmitField('customrecord_ec_integration_child', result.internalid
                    , 'custrecord_ec_status', '5'); // 5 == Error
            }
        });

    Log.d('salesOrderUpdates - stillProcessing', stillProcessing);
    return stillProcessing;
};

/**
 * Handles updating the existing sales order record. Takes in a loaded sales order record along with the data to update
 * the transaction with. Updates all data as most data setting is direct text setting.
 * @param salesOrderRecord
 * @param rawDataColl
 * @returns {*}
 */
EC.updateSalesOrder = function(salesOrderRecord, rawDataColl){
    // If order update complete this will be true. Otherwise will default to undefined / false
    var orderUpdateSuccess;

    try{
        Log.d('begin sales order update');
        // Remove all existing lines from order. Must run this backwards due to line num changing as you remove.
        for(var i = salesOrderRecord.item.length; i--;) {
            salesOrderRecord.removeLineItem('item',i+1);
        }
        Log.d('All Lines Removed from Sales Order');

        ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
        // SET HEADER VALUES  //////////////////////////////////////////////////////////////////////////////////////////////
        ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
        // Pull the first object in the array. All lines in the data collection should contain the same header data.
        var uploadBodyData = _.first(rawDataColl);

        // Set field values
        salesOrderRecord.custbody_agent_so_payment_id = uploadBodyData.paymentId;
        salesOrderRecord.custbody_agent_so_payment_date = uploadBodyData.paymentDate;
        salesOrderRecord.custbody_agent_so_claim_id = uploadBodyData.claimId;
        salesOrderRecord.custbodyhpsalesorder = uploadBodyData.customOrderNumber;
        salesOrderRecord.otherrefnum = uploadBodyData.poNumber;
        salesOrderRecord.shipdate = moment(uploadBodyData.invoiceDate).format('MM/DD/YYYY');
        salesOrderRecord.custbody_updated_cloudconnect = true; // Default value
        salesOrderRecord.custbody_cloudconnect_update_datetime = moment().format('MM/DD/YYYY hh:mm:ss a'); // Default value
        Log.d('Header Fields Updated');
        ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
        ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

        ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
        // SET LINE ITEMS //////////////////////////////////////////////////////////////////////////////////////////////////
        ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
        // For each row on the raw data collection we need to add a line to the sales order
        _.each(rawDataColl, function(uploadRowData){
            Log.d('Processing Line', uploadRowData);

            // Find the matching item in the system based on the item name text value
            var itemRecordData = EC.createSearch('item'
                , [['itemid', 'is', uploadRowData.partNumber], 'AND', ['isinactive', 'is', 'F']], [['internalid']])
                .nsSearchResult2obj().first();
            Log.d('itemRecordData', itemRecordData);

            // Only run if item is found
            if(itemRecordData){
                // Select the new line item value
                salesOrderRecord.selectNewLineItem('item');

                // Set Line Values
                salesOrderRecord.setCurrentLineItemValue('item','item', itemRecordData.internalid);
                salesOrderRecord.setCurrentLineItemValue('item','quantity', uploadRowData.quantity);
                salesOrderRecord.setCurrentLineItemValue('item','custcol_agent_so_unit_sales_price', EC.formatCurrencyValue(uploadRowData.unitSalesPrice));
                salesOrderRecord.setCurrentLineItemValue('item','custcol_agent_so_extended_sales_total', EC.formatCurrencyValue(uploadRowData.extendedSalesTotal));
                salesOrderRecord.setCurrentLineItemValue('item','custcol_agent_so_discount_percent', uploadRowData.discountPercent);
                salesOrderRecord.setCurrentLineItemValue('item','custcol_influencer_rate', uploadRowData.commissionRate);
                salesOrderRecord.setCurrentLineItemValue('item','rate', EC.formatCurrencyValue(uploadRowData.earningsUnit));
                salesOrderRecord.setCurrentLineItemValue('item','amount', EC.formatCurrencyValue(uploadRowData.earnings));

                // Commit line changes
                salesOrderRecord.commitLineItem('item');
            }

        });
        Log.d('All Line Fields Updated');
        ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
        ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

        // Submit the sales order
        var orderId = salesOrderRecord.save();
        Log.d('Sales Order Updated', orderId);
        orderUpdateSuccess = true;
    }
    catch(e){
        Log.e('Unexpected Error Occurred', EC.getExceptionDetail(e));
        orderUpdateSuccess = false;
    }

    return orderUpdateSuccess;
};

// Clean the currency value to allow setting on NetSuite without failing validation.
EC.formatCurrencyValue = function(value){
    return value ? value.replace('$', '').replace(' ', '') : value;
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
            , {'custscript_au_master_record_id_2':(param.custrecord_ec_parent_record || '')})
    }
    return governanceRemains
}