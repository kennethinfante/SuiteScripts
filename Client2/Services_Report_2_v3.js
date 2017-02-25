// Type: Scheduled
// Name: Services Report 2
// Summary: Generate Services Report.

// Development
// var Email_From  = 35756 //38499;
// var Email_To    = 35756 //38499;
// var Folder      = 568;
// var MT3_custrecord_sr_version = null;
// [Services Report > Reports]

// Production
   var Email_From  = 31432;
   var Email_To    = 31432;
   var Folder      = 568;
   var MT3_custrecord_sr_version = null;
// [Services Report > Reports]

function Services_Report_2(){

    // GET SCRIPT PARAMETERS
    try {
	var context = nlapiGetContext();
	var MT2_custscript_sr_internal_id = context.getSetting('SCRIPT','custscript_sr_internal_id');
	var MT2_custscript_sr_user        = context.getSetting('SCRIPT','custscript_sr_user');

        if ( isEmpty(MT2_custscript_sr_internal_id) ||
             isEmpty(MT2_custscript_sr_user)){
             // EXIT SCRIPT
             return;
        }
    }
    catch(err){
        // LOG ERROR, SEND ERROR NOTIFICATION EMAIL AND EXIT SCRIPT
        var SkySuiteErrorMessage = 'Error getting script parameters';
        logAndSendEmail( SkySuiteErrorMessage, err );
        return;
    }


    // GET ENVIRONMENT
    try {
        var MT2A_environment = context.getEnvironment();

        var MT2A_environment_url = '';

        if (MT2A_environment == 'PRODUCTION'){
            MT2A_environment_url = 'https://system.netsuite.com';
        }
        else if (MT2A_environment == 'SANDBOX'){
            MT2A_environment_url = 'https://system.sandbox.netsuite.com';
        }
        else if (MT2A_environment == 'BETA'){
            MT2A_environment_url = 'https://system.beta.netsuite.com';
        }

    }
    catch(err){
        // LOG ERROR, SEND ERROR NOTIFICATION EMAIL AND EXIT SCRIPT
        var SkySuiteErrorMessage = 'Error getting environment';
        logAndSendEmail( SkySuiteErrorMessage, err );
        return;
    }


    // EXECUTE SERVICES REPORT SEARCH (CRITERIA)
    try {
        var filter = new Array();
        filter[0] = new nlobjSearchFilter( 'internalid', null, 'is', MT2_custscript_sr_internal_id );

        var column = new Array();
        column[0] = new nlobjSearchColumn( 'custrecord_sr_start_date');
        column[1] = new nlobjSearchColumn( 'custrecord_sr_end_date');
        column[2] = new nlobjSearchColumn( 'custrecord_sr_department' );
        column[3] = new nlobjSearchColumn( 'custrecord_sr_item_manufacturer' );
        column[4] = new nlobjSearchColumn( 'custrecord_sr_account_executive' );
        column[5] = new nlobjSearchColumn( 'custrecord_sr_solutions_architect' );
        column[6] = new nlobjSearchColumn( 'custrecord_sr_format' );
        column[7] = new nlobjSearchColumn( 'custrecord_sr_email' );
        column[8] = new nlobjSearchColumn( 'custrecord_sr_version' );

        var servicesReport_SearchResult = nlapiSearchRecord( 'customrecord_services_report', 'customsearch_services_report_criteria', filter, column );

        if (servicesReport_SearchResult) {
            var MT3 = servicesReport_SearchResult[0];

            var MT3_custrecord_sr_start_date               = MT3.getValue('custrecord_sr_start_date');
            var MT3_custrecord_sr_end_date                 = MT3.getValue('custrecord_sr_end_date');
            var MT3_custrecord_sr_department               = MT3.getValue('custrecord_sr_department');
            var MT3_custrecord_sr_item_manufacturer        = MT3.getValue('custrecord_sr_item_manufacturer');
            var MT3_custrecord_sr_account_executive        = MT3.getValue('custrecord_sr_account_executive');
            var MT3_custrecord_sr_account_executive_text   = MT3.getText('custrecord_sr_account_executive');
            var MT3_custrecord_sr_solutions_architect      = MT3.getValue('custrecord_sr_solutions_architect');
            var MT3_custrecord_sr_solutions_architect_text = MT3.getText('custrecord_sr_solutions_architect');
            var MT3_custrecord_sr_format                   = MT3.getValue('custrecord_sr_format');
            var MT3_custrecord_sr_email                    = MT3.getValue('custrecord_sr_email');
            MT3_custrecord_sr_version                      = MT3.getValue('custrecord_sr_version');
        }
        else {
            // EXIT RETURN
            return;
        }
    }
    catch(err){
        // LOG ERROR, SEND ERROR NOTIFICATION EMAIL AND EXIT SCRIPT
        var SkySuiteErrorMessage = 'Error executing Services Report search (customsearch_services_report_criteria)';
        logAndSendEmail( SkySuiteErrorMessage, err );
        return;
    }


    // PARSE SEARCH RESULTS
    try {

        var MT3A_custrecord_sr_department               = parseComma(MT3_custrecord_sr_department);
        var MT3A_custrecord_sr_item_manufacturer        = parseComma(MT3_custrecord_sr_item_manufacturer);
        var MT3A_custrecord_sr_account_executive        = parseComma(MT3_custrecord_sr_account_executive);
        var MT3A_custrecord_sr_account_executive_text   = parseComma(MT3_custrecord_sr_account_executive_text);
        var MT3A_custrecord_sr_solutions_architect      = parseComma(MT3_custrecord_sr_solutions_architect);
        var MT3A_custrecord_sr_solutions_architect_text = parseComma(MT3_custrecord_sr_solutions_architect_text);
        var MT3A_custrecord_sr_format                   = parseComma(MT3_custrecord_sr_format);
        var MT3A_custrecord_sr_email                    = parseComma(MT3_custrecord_sr_email);

        if (isNotEmpty(MT3A_custrecord_sr_email)) {
            // for each comma separated value, remove leading and trailing blank spaces
            for (var i = 0; i < MT3A_custrecord_sr_email.length; i++) {
                MT3A_custrecord_sr_email[i] = MT3A_custrecord_sr_email[i].replace(/^\s+/g,'').replace(/\s+$/g,'');
            }
        }
    }
    catch(err){
        // LOG ERROR, SEND ERROR NOTIFICATION EMAIL AND EXIT SCRIPT
        var SkySuiteErrorMessage = 'Error parsing search results for Services Report Internal ID ' + MT2_custscript_sr_internal_id;
        logAndSendEmail( SkySuiteErrorMessage, err );
        return;
    }


    // SORT MT3A (ACCOUNT EXECUTIVE)
    try {
        if (isNotEmpty(MT3A_custrecord_sr_account_executive_text)) {
            MT3A_custrecord_sr_account_executive_text = MT3A_custrecord_sr_account_executive_text.sort();
        }
    }
    catch(err){
        // LOG ERROR, SEND ERROR NOTIFICATION EMAIL AND EXIT SCRIPT
        var SkySuiteErrorMessage = 'Error sorting MT3A (Account Executive)';
        logAndSendEmail( SkySuiteErrorMessage, err );
        return;
    }


    // CONSTRUCT ACCOUNT EXECUTIVE VALUE
    try {
        var MT_Account_Executive = '';
        if (isNotEmpty(MT3_custrecord_sr_account_executive_text )) {
            for (var i = 0; i < MT3A_custrecord_sr_account_executive_text.length; i++ ){
                MT_Account_Executive += MT3A_custrecord_sr_account_executive_text[i];
                if (i < MT3A_custrecord_sr_account_executive_text.length - 1 ) {
                    MT_Account_Executive += ', ';
                }
            }
        }
        else {
            MT_Account_Executive = 'All';
        }
    }
    catch(err){
        // LOG ERROR, SEND ERROR NOTIFICATION EMAIL AND EXIT SCRIPT
        var SkySuiteErrorMessage = 'Error constructing Account Executive value for Services Report Internal ID ' + MT2_custscript_sr_internal_id;
        logAndSendEmail( SkySuiteErrorMessage, err );
        return;
    }


    // SORT MT3A (SOLUTIONS ARCHITECT)
    try {
        if (isNotEmpty(MT3A_custrecord_sr_solutions_architect_text)) {
            MT3A_custrecord_sr_solutions_architect_text = MT3A_custrecord_sr_solutions_architect_text.sort();
        }
    }
    catch(err){
        // LOG ERROR, SEND ERROR NOTIFICATION EMAIL AND EXIT SCRIPT
        var SkySuiteErrorMessage = 'Error sorting MT3A (Solutions Architect)';
        logAndSendEmail( SkySuiteErrorMessage, err );
        return;
    }


    // CONSTRUCT SOLUTIONS ARCHITECT VALUE
    try {
        var MT_Solutions_Architect = '';
        if (isNotEmpty(MT3_custrecord_sr_solutions_architect_text)) {
            for (var i = 0; i < MT3A_custrecord_sr_solutions_architect_text.length; i++ ){
                MT_Solutions_Architect += MT3A_custrecord_sr_solutions_architect_text[i];
                if (i < MT3A_custrecord_sr_solutions_architect_text.length - 1 ) {
                    MT_Solutions_Architect += ', ';
                }
            }
        }
        else {
            MT_Solutions_Architect = 'All';
        }
    }
    catch(err){
        // LOG ERROR, SEND ERROR NOTIFICATION EMAIL AND EXIT SCRIPT
        var SkySuiteErrorMessage = 'Error constructing Solutions Architect value for Services Report Internal ID ' + MT2_custscript_sr_internal_id;
        logAndSendEmail( SkySuiteErrorMessage, err );
        return;
    }


    // CONSTRUCT DATE AS STRING
    try {

        var MTD_start_date = constructDateAsString(MT3_custrecord_sr_start_date);
        var MTD_end_date   = constructDateAsString(MT3_custrecord_sr_end_date);

    }
    catch(err){
        // LOG ERROR, SEND ERROR NOTIFICATION EMAIL AND EXIT SCRIPT
        var SkySuiteErrorMessage = 'Error constructing date as string for Services Report Internal ID ' + MT2_custscript_sr_internal_id;
        logAndSendEmail( SkySuiteErrorMessage, err );
        return;
    }


    // EXECUTE SERVICES REPORT SEARCH (CLASSES)
    try {
        var column = new Array();
        column[0] = new nlobjSearchColumn( 'namenohierarchy');
        column[1] = new nlobjSearchColumn( 'custrecord_services_report_position_cls' );

        var classSearchResult = nlapiSearchRecord( 'classification', 'customsearch_services_report_classes', null, column );

        if (classSearchResult) {
            var MT4A = new Array();
            for (var i = 0; i < classSearchResult.length; i++) {
                MT4A[i] = new MT4A_Record(classSearchResult[i]);
            }
        }
    }
    catch(err){
        // LOG ERROR, SEND ERROR NOTIFICATION EMAIL AND EXIT SCRIPT
        var SkySuiteErrorMessage = 'Error executing Services Report search (customsearch_services_report_classes)';
        logAndSendEmail( SkySuiteErrorMessage, err );
        return;
    }


    // EXECUTE SERVICES REPORT SEARCH (DEPARTMENTS)
    try {
        var column = new Array();
        column[0] = new nlobjSearchColumn( 'namenohierarchy');
        column[1] = new nlobjSearchColumn( 'custrecord_services_report_position' );

        var departmentSearchResult = nlapiSearchRecord( 'department', 'customsearch_services_report_departments', null, column );

        if (departmentSearchResult) {
            var MT4 = new Array();
            for (var i = 0; i < departmentSearchResult.length; i++) {
                MT4[i] = new MT4_Record(departmentSearchResult[i]);
            }
        }
    }
    catch(err){
        // LOG ERROR, SEND ERROR NOTIFICATION EMAIL AND EXIT SCRIPT
        var SkySuiteErrorMessage = 'Error executing Services Report search (customsearch_services_report_departments)';
        logAndSendEmail( SkySuiteErrorMessage, err );
        return;
    }


    // EXECUTE SERVICES REPORT SEARCH (ITEM MANUFACTURERS)
    try {
        var column = new Array();
        column[0] = new nlobjSearchColumn( 'name');

        var itemManufacturerSearchResult = nlapiSearchRecord( 'customrecord_item_manufacturer', 'customsearch_item_manufacturers', null, column );

        if (itemManufacturerSearchResult) {
            var MT5 = new Array();
            for (var i = 0; i < itemManufacturerSearchResult.length; i++) {
                MT5[i] = new MT5_Record(itemManufacturerSearchResult[i]);
            }
        }
    }
    catch(err){
        // LOG ERROR, SEND ERROR NOTIFICATION EMAIL AND EXIT SCRIPT
        var SkySuiteErrorMessage = 'Error executing Services Report search (customsearch_item_manufacturers)';
        logAndSendEmail( SkySuiteErrorMessage, err );
        return;
    }


    // EXECUTE SERVICES REPORT SEARCH (SERVICES)
    try {
        var MT6 = new Array(); // Define MT6

        var filter = new Array();

        var i = 0;
        filter[i] = new nlobjSearchFilter( 'trandate', null, 'onOrAfter', MT3_custrecord_sr_start_date );

        i++;
        filter[i] = new nlobjSearchFilter( 'trandate', null, 'onOrBefore', MT3_custrecord_sr_end_date );

        if (isNotEmpty(MT3A_custrecord_sr_department)) {
            i++;
            filter[i] = new nlobjSearchFilter( 'department', null, 'anyOf', MT3A_custrecord_sr_department );
        }

        if (isNotEmpty(MT3A_custrecord_sr_item_manufacturer)) {
            i++;
            filter[i] = new nlobjSearchFilter( 'custcol_item_manufacturer', null, 'anyOf', MT3A_custrecord_sr_item_manufacturer );
        }

        if (isNotEmpty(MT3A_custrecord_sr_account_executive)) {
            i++;
            filter[i] = new nlobjSearchFilter( 'salesrep', null, 'anyOf', MT3A_custrecord_sr_account_executive );
        }

        if (isNotEmpty(MT3A_custrecord_sr_solutions_architect)) {
            i++;
            filter[i] = new nlobjSearchFilter( 'custbodysolutions_architect', null, 'anyOf', MT3A_custrecord_sr_solutions_architect );
        }

        var column = new Array();
        column[0] = new nlobjSearchColumn( 'department',               null,'group');
        column[1] = new nlobjSearchColumn( 'custcol_item_manufacturer',null,'group');
        column[2] = new nlobjSearchColumn( 'class',                    null,'group');
        column[3] = new nlobjSearchColumn( 'internalid',               null,'count');
        column[4] = new nlobjSearchColumn( 'amount',                   null,'sum');
        column[5] = new nlobjSearchColumn( 'altsalesamount',           null,'sum');
        column[6] = new nlobjSearchColumn( 'quantity',                 null,'sum');
        column[7] = new nlobjSearchColumn( 'quantitybilled',           null,'sum');

        var servicesSearchResult = nlapiSearchRecord( 'transaction', 'customsearch_services_report_services_2', filter, column );

        if (servicesSearchResult) {
            for (var i = 0; i < servicesSearchResult.length; i++) {
                MT6[i] = new MT6_Record(servicesSearchResult[i]);
            }
        }
    }
    catch(err){
        // LOG ERROR, SEND ERROR NOTIFICATION EMAIL AND EXIT SCRIPT
        var SkySuiteErrorMessage = 'Error executing Services Report search (customsearch_services_report_services_2)';
        logAndSendEmail( SkySuiteErrorMessage, err );
        return;
    }


    // EXECUTE SERVICES REPORT SEARCH (ALL)
    try {
        var filter = new Array();
        filter[0] = new nlobjSearchFilter( 'trandate', null, 'onOrAfter',  MT3_custrecord_sr_start_date );
        filter[1] = new nlobjSearchFilter( 'trandate', null, 'onOrBefore', MT3_custrecord_sr_end_date );

        var column = new Array();
        column[0] = new nlobjSearchColumn( 'internalid',     null,'count');
        column[1] = new nlobjSearchColumn( 'amount',         null,'sum');
        column[2] = new nlobjSearchColumn( 'altsalesamount', null,'sum');
        column[3] = new nlobjSearchColumn( 'quantity',       null,'sum');
        column[4] = new nlobjSearchColumn( 'quantitybilled', null,'sum');

        var allSearchResult = nlapiSearchRecord( 'transaction', 'customsearch_services_report_all_2', filter, column );

        if (allSearchResult) {
            var MT7_internalid     = allSearchResult[0].getValue( 'internalid',     null,'count');
            var MT7_amount         = allSearchResult[0].getValue( 'amount',         null,'sum');
            var MT7_altsalesamount = allSearchResult[0].getValue( 'altsalesamount', null,'sum');
            var MT7_quantity       = allSearchResult[0].getValue( 'quantity',       null,'sum');
            var MT7_quantitybilled = allSearchResult[0].getValue( 'quantitybilled', null,'sum');
        }
    }
    catch(err){
        // LOG ERROR, SEND ERROR NOTIFICATION EMAIL AND EXIT SCRIPT
        var SkySuiteErrorMessage = 'Error executing Services Report search (customsearch_services_report_all_2)';
        logAndSendEmail( SkySuiteErrorMessage, err );
        return;
    }


    // PERFORM CALCULATION (BILLED PERCENT)
    try {
        if (isNotEmpty(MT6)) {
            // For each record in MT6
            for (var i = 0; i < MT6.length; i++) {
                var BPS = MT6[i].MT6_quantitybilled / MT6[i].MT6_quantity;
                BPS = dropDigitsAfterTwoDecimals(BPS);
                MT6[i].MT6_billed_percent_services = BPS;
            }
        }

        if (isNotEmpty(allSearchResult)) { // Validate is MT7 was found.
            // For record in MT7
            var BPA = MT7_quantitybilled / MT7_quantity;
            BPA = dropDigitsAfterTwoDecimals(BPA);
            var MT7_billed_percent_all = BPA;
        }
    }
    catch(err){
        // LOG ERROR, SEND ERROR NOTIFICATION EMAIL AND EXIT SCRIPT
        var SkySuiteErrorMessage = 'Error performing calculation for billed percent';
        logAndSendEmail( SkySuiteErrorMessage, err );
        return;
    }


    // PERFORM CALCULATION (ATTACH RATE PERCENT)
    try {
        for (var i = 0; i < MT6.length; i++) {
            if (isEmpty(MT6[i].MT6_internalid) ||
                isEmpty(MT7_internalid)        ||
                MT7_internalid == 0){
                MT6[i].MT6_attach_rate_percent = 0.00;
            }
            else {
                var ARP = ((MT6[i].MT6_internalid * MT6[i].MT6_billed_percent_services) /
                           (MT7_internalid * MT7_billed_percent_all)) * 100;
                ARP = dropDigitsAfterTwoDecimals(ARP);
                MT6[i].MT6_attach_rate_percent = ARP;
            }
        }
    }
    catch(err){
        // LOG ERROR, SEND ERROR NOTIFICATION EMAIL AND EXIT SCRIPT
        var SkySuiteErrorMessage = 'Error performing calculation for attach rate percent';
        logAndSendEmail( SkySuiteErrorMessage, err );
        return;
    }


    // PERFORM CALCULATION (SALES DOLLARS)
    try {
        if (MT3_custrecord_sr_version == 2){
            for (var i = 0; i < MT6.length; i++) {
                if (isEmpty(MT6[i].MT6_amount) || isEmpty(MT6[i].MT6_billed_percent_services)){
                    MT6[i].MT6_attach_rate_percent = 0.00;
                }
                else {
                    var ARP = (MT6[i].MT6_amount * MT6[i].MT6_billed_percent_services);
                    ARP = dropDigitsAfterTwoDecimals(ARP);
                    MT6[i].MT6_attach_rate_percent = ARP;
                }
            }
        }
    }
    catch(err){
        // LOG ERROR, SEND ERROR NOTIFICATION EMAIL AND EXIT SCRIPT
        var SkySuiteErrorMessage = 'Error performing calculation for sales dollars';
        logAndSendEmail( SkySuiteErrorMessage, err );
        return;
    }


    // PERFORM CALCULATION (SALES PENETRATION RATE PERCENT)
    try {
        for (var i = 0; i < MT6.length; i++) {
            if (isEmpty(MT6[i].MT6_amount) ||
                isEmpty(MT7_amount)        ||
                MT7_amount == 0){
                MT6[i].MT6_sales_penetration_rate_percent = 0.00;
            }
            else {
                var SPRP = ((MT6[i].MT6_amount * MT6[i].MT6_billed_percent_services) /
                           (MT7_amount * MT7_billed_percent_all)) * 100;
                SPRP = dropDigitsAfterTwoDecimals(SPRP);
                MT6[i].MT6_sales_penetration_rate_percent = SPRP;
            }
        }
    }
    catch(err){
        // LOG ERROR, SEND ERROR NOTIFICATION EMAIL AND EXIT SCRIPT
        var SkySuiteErrorMessage = 'Error performing calculation for sales penetration rate percent';
        logAndSendEmail( SkySuiteErrorMessage, err );
        return;
    }


    // PERFORM CALCULATION (GP DOLLARS)
    try {
        if (MT3_custrecord_sr_version == 2) {
            for (var i = 0; i < MT6.length; i++) {
                if (isEmpty(MT6[i].MT6_altsalesamount) || isEmpty(MT6[i].MT6_billed_percent_services)){
                    MT6[i].MT6_sales_penetration_rate_percent = 0.00;
                }
                else {
                    var SPRP = (MT6[i].MT6_altsalesamount  * MT6[i].MT6_billed_percent_services);
                    SPRP = dropDigitsAfterTwoDecimals(SPRP);
                    MT6[i].MT6_sales_penetration_rate_percent = SPRP;
                }
            }
        }
    }
    catch(err){
        // LOG ERROR, SEND ERROR NOTIFICATION EMAIL AND EXIT SCRIPT
        var SkySuiteErrorMessage = 'Error performing calculation for GP dollars';
        logAndSendEmail( SkySuiteErrorMessage, err );
        return;
    }


    // PERFORM CALCULATION (GP PENETRATION RATE PERCENT)
    try {
        for (var i = 0; i < MT6.length; i++) {
            if (isEmpty(MT6[i].MT6_altsalesamount) ||
                isEmpty(MT7_altsalesamount)        ||
                MT7_altsalesamount == 0){
                MT6[i].MT6_gp_penetration_rate_percent = 0.00;
            }
            else {
                var GPPRP = ((MT6[i].MT6_altsalesamount * MT6[i].MT6_billed_percent_services) /
                            (MT7_altsalesamount * MT7_billed_percent_all)) * 100;
                GPPRP = dropDigitsAfterTwoDecimals(GPPRP);
                MT6[i].MT6_gp_penetration_rate_percent = GPPRP;
            }
        }
    }
    catch(err){
        // LOG ERROR, SEND ERROR NOTIFICATION EMAIL AND EXIT SCRIPT
        var SkySuiteErrorMessage = 'Error performing calculation for GP penetration rate percent';
        logAndSendEmail( SkySuiteErrorMessage, err );
        return;
    }


    // PERFORM CALCULATION (GP PERCENT)
    try {
        if (MT3_custrecord_sr_version == 2){
            for (var i = 0; i < MT6.length; i++) {
                if (isEmpty(MT6[i].MT6_altsalesamount)          ||
                    isEmpty(MT6[i].MT6_billed_percent_services) ||
                    MT6[i].MT6_billed_percent_services == 0     ||
                    isEmpty(MT6[i].MT6_amount)                  ||
                    MT6[i].MT6_amount == 0)
                {
                    MT6[i].MT6_gp_penetration_rate_percent = 0.00;
                }
                else {
                    var GPPRP = ((MT6[i].MT6_altsalesamount * MT6[i].MT6_billed_percent_services) /
                                (MT6[i].MT6_amount * MT6[i].MT6_billed_percent_services)) * 100;
                    GPPRP = dropDigitsAfterTwoDecimals(GPPRP);
                    MT6[i].MT6_gp_penetration_rate_percent = GPPRP;
                }
            }

        }

    }
    catch(err){
        // LOG ERROR, SEND ERROR NOTIFICATION EMAIL AND EXIT SCRIPT
        var SkySuiteErrorMessage = 'Error performing calculation for GP percent';
        logAndSendEmail( SkySuiteErrorMessage, err );
        return;
    }


    // ADD LABELS AND POSITIONS
    try {
        for (var i = 0; i < MT6.length; i++) {
            // CLASS
            for (var j = 0; j < MT4A.length; j++){
                if (MT4A[j].MT4A_internalid == MT6[i].MT6_class) {
                    MT6[i].MT6_class_label    = MT4A[j].MT4A_namenohierarchy;
                    MT6[i].MT6_class_position = MT4A[j].MT4A_custrecord_services_report_position_cls;
                    break;
                }
            }

            // DEPARTMENT
            for (var j = 0; j < MT4.length; j++){
                if (MT4[j].MT4_internalid == MT6[i].MT6_department) {
                    MT6[i].MT6_department_label    = MT4[j].MT4_namenohierarchy;
                    MT6[i].MT6_department_position = MT4[j].MT4_custrecord_services_report_position;
                    break;
                }
            }

            // ITEM MANUFACTURER
            for (var j = 0; j < MT5.length; j++){
                if (MT5[j].MT5_internalid == MT6[i].MT6_custcol_item_manufacturer) {
                    MT6[i].MT6_custcol_item_manufacturer_label  = MT5[j].MT5_name;
                    break;
                }
            }
        }
    }
    catch(err){
        // LOG ERROR, SEND ERROR NOTIFICATION EMAIL AND EXIT SCRIPT
        var SkySuiteErrorMessage = 'Error adding labels and positions to report data';
        logAndSendEmail( SkySuiteErrorMessage, err );
        return;
    }


    // SORT AND GROUP
    try {
        // SORT
        MT6 = MT6.sort(sortBy_MT6_DepartmentItemClass);

        // GROUP
        var MT6_depGroup        = new Array();  // Department Group
        var MT6_depItemGroup    = new Array();  // Deparment Item Manufacturer Group
        var previousDepartment  = '';
        var previousItem        = '';
        var depCount            = -1;
        var itemsInDepCount     = -1;
        var itemDepCount        = -1;
        var itemsInItemDepCount = -1;
        for (var i = 0; i < MT6.length; i++){
            if (previousDepartment != MT6[i].MT6_department_position){
                previousDepartment = MT6[i].MT6_department_position;
                depCount++;
                itemsInDepCount = -1;
                MT6_depGroup[depCount] = new MT6_DepartmentGroup(MT6[i]);
                previousItem        = '';
                itemDepCount        = -1;
                itemsInItemDepCount = -1;
                MT6_depItemGroup[depCount] = new Array();
            }

            if (previousItem != MT6[i].MT6_custcol_item_manufacturer_label){
                previousItem = MT6[i].MT6_custcol_item_manufacturer_label;
                itemDepCount++;
                itemsInItemDepCount = -1;
                MT6_depItemGroup[depCount][itemDepCount] = new MT6_DepartmentItemManufacturerGroup(MT6[i]);
            }

            // Count by Department Group
            itemsInDepCount ++;
            MT6_depGroup[depCount].MT6_itemsInDep[itemsInDepCount] = i;

            // Count by Department Item Manufacturer Group
            itemsInItemDepCount ++;
            MT6_depItemGroup[depCount][itemDepCount].MT6_itemsInDepItem[itemsInItemDepCount] = i;
        }
    }
    catch(err){
        // LOG ERROR, SEND ERROR NOTIFICATION EMAIL AND EXIT SCRIPT
        var SkySuiteErrorMessage = 'Error sorting and grouping report data';
        logAndSendEmail( SkySuiteErrorMessage, err );
        return;
    }


    // CONSTRUCT REPORT(S)
    try {
        var MT3A_custrecord_sr_format2HTML = false;
        var MT3A_custrecord_sr_format1CSV = false;

        for (var i = 0; i < MT3A_custrecord_sr_format.length; i++) {
            if (MT3A_custrecord_sr_format[i] == 2) {
                MT3A_custrecord_sr_format2HTML = true;
            }
            if (MT3A_custrecord_sr_format[i] == 1) {
                MT3A_custrecord_sr_format1CSV = true;
            }
        }

        if (MT3A_custrecord_sr_format2HTML) {
            var Report_HTML = '';
        }

        if (MT3A_custrecord_sr_format1CSV) {
            var Report_CSV = '';
        }

        if (MT3A_custrecord_sr_format1CSV == false &&
            MT3A_custrecord_sr_format2HTML == false){
            //EXIT SCRIPT
            return;            
        }
        
        // TITLE SECTION
        {

            if (MT3A_custrecord_sr_format2HTML) {
                Report_HTML += '<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">';
                Report_HTML += '<html>';
                Report_HTML += '<head>';
                Report_HTML += '<title>Services Report</title>';
                Report_HTML += '<link rel=stylesheet href="https://system.netsuite.com/core/media/media.nl?id=6196&c=090166&h=38618ff4d46463a3aeeb&_xt=.css" type="text/css">';
                Report_HTML += '</head>';

                Report_HTML += '<body leftmargin=5 rightmargin=5 topmargin=0>';

                Report_HTML += '<div id="wrapper">';

                Report_HTML += '<div id="title_wrapper">';

                Report_HTML += '<!-- TITLE -->';

                Report_HTML += '<div id="title">Mobius Partners</div>';

                Report_HTML += '<div id="new_row">';
                Report_HTML += '<div id="blank_row">&nbsp;</div>';
                Report_HTML += '</div>';

                Report_HTML += '<div id="title">Services Report</div>';

                Report_HTML += '<div id="new_row">';
                Report_HTML += '<div id="blank_row">&nbsp;</div>';
                Report_HTML += '</div>';

                Report_HTML += '<div id="D">' + MTD_start_date + ' - ' + MTD_end_date + '</div>';

                Report_HTML += '<div id="new_row">';
                Report_HTML += '<div id="blank_row">&nbsp;</div>';
                Report_HTML += '</div>';

                Report_HTML += '</div>';

                {
                    // CRITERIA SECTION
                    var AE = MT_Account_Executive;
                    var SA = MT_Solutions_Architect;

                    Report_HTML += '<!-- CRITERIA -->';

                    Report_HTML += '<div id="criteria_wrapper">';

                    Report_HTML += '<div id="blank_row">&nbsp;</div>';
                    Report_HTML += '<div id="AE"><b>Account Executive: </b>' + AE + '</div>';
                    Report_HTML += '<div id="SA"><b>Solutions Architect: </b>' + SA +'</div>';

                    Report_HTML += '</div>';
                }

            }


            if (MT3A_custrecord_sr_format1CSV) {
                // CRITERIA SECTION
                var AE = MT_Account_Executive;
                var SA = MT_Solutions_Architect;

                Report_CSV += 'Mobius Partners,,,,,,,,,,,,,,,,\n';
                Report_CSV += ',Account Executive: ,"'+ AE +'",,,,,,,,,,,,,,\n';
                Report_CSV += 'Services Report,,,,,,,,,,,,,,,,\n';
                Report_CSV += ',Solutions Architect: ,"'+ SA +'",,,,,,,,,,,,,,\n';
                Report_CSV += '"' + MTD_start_date + ' - ' + MTD_end_date +'",,,,,,,,,,,,,,,,\n';
                Report_CSV += ',,,,,,,,,,,,,,,,\n';
            }
        }

        // HEADER SECTION
        {
            if (MT3A_custrecord_sr_format2HTML) {
                if (MT3_custrecord_sr_version == 1) {   // Header %
                    Report_HTML += '<!-- HEADER -->';
                    Report_HTML += '<div id="new_row">';
                    Report_HTML += '<div id="blank_cell_608">&nbsp;</div>';
                    Report_HTML += '<div id="hdr1">Vendor Delivered</div>';
                    Report_HTML += '<div id="hdr2">Mobius Delivered - Mobius</div>';
                    Report_HTML += '<div id="hdr3">Mobius Delivered - Vendor</div>';
                    Report_HTML += '<div id="hdr4">Outsourced</div>';
                    Report_HTML += '<div id="hdr5">Total</div>';
                    Report_HTML += '</div>';

                    Report_HTML += '<div id="new_row">';
                    Report_HTML += '<div id="hdr6">Department</div>';
                    Report_HTML += '<div id="hdr7">Item Manufacturer</div>';
                    Report_HTML += '<div id="attach_hdr">Attach Rate %</div>';
                    Report_HTML += '<div id="sls_penetration_hdr">Sales Penetration Rate %</div>';
                    Report_HTML += '<div id="gp_penetration_hdr">GP Penetration Rate %</div>';
                    Report_HTML += '<div id="attach_hdr">Attach Rate %</div>';
                    Report_HTML += '<div id="sls_penetration_hdr">Sales Penetration Rate %</div>';
                    Report_HTML += '<div id="gp_penetration_hdr">GP Penetration Rate %</div>';
                    Report_HTML += '<div id="attach_hdr">Attach Rate %</div>';
                    Report_HTML += '<div id="sls_penetration_hdr">Sales Penetration Rate %</div>';
                    Report_HTML += '<div id="gp_penetration_hdr">GP Penetration Rate %</div>';
                    Report_HTML += '<div id="attach_hdr">Attach Rate %</div>';
                    Report_HTML += '<div id="sls_penetration_hdr">Sales Penetration Rate %</div>';
                    Report_HTML += '<div id="gp_penetration_hdr">GP Penetration Rate %</div>';
                    Report_HTML += '<div id="attach_hdr">Attach Rate %</div>';
                    Report_HTML += '<div id="sls_penetration_hdr">Sales Penetration Rate %</div>';
                    Report_HTML += '<div id="penetration_hdr_right">GP Penetration Rate %</div>';
                    Report_HTML += '</div>';

                    Report_HTML += '<div id="new_row">';
                    Report_HTML += '<div id="blank_row">&nbsp;</div>';
                    Report_HTML += '</div>';
                }
                if (MT3_custrecord_sr_version == 2) {   // Header $
                    Report_HTML += '<!-- HEADER -->';
                    Report_HTML += '<div id="new_row">';
                    Report_HTML += '<div id="blank_cell_608">&nbsp;</div>';
                    Report_HTML += '<div id="hdr1">Vendor Delivered</div>';
                    Report_HTML += '<div id="hdr2">Mobius Delivered - Mobius</div>';
                    Report_HTML += '<div id="hdr3">Mobius Delivered - Vendor</div>';
                    Report_HTML += '<div id="hdr4">Outsourced</div>';
                    Report_HTML += '<div id="hdr5">Total</div>';
                    Report_HTML += '</div>';

                    Report_HTML += '<div id="new_row">';
                    Report_HTML += '<div id="hdr6">Department</div>';
                    Report_HTML += '<div id="hdr7">Item Manufacturer</div>';
                    Report_HTML += '<div id="attach_hdr">Sales $</div>';
                    Report_HTML += '<div id="sls_penetration_hdr">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;GP $</div>';
                    Report_HTML += '<div id="gp_penetration_hdr">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;GP %</div>';
                    Report_HTML += '<div id="attach_hdr">Sales $</div>';
                    Report_HTML += '<div id="sls_penetration_hdr">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;GP $</div>';
                    Report_HTML += '<div id="gp_penetration_hdr">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;GP %</div>';
                    Report_HTML += '<div id="attach_hdr">Sales $</div>';
                    Report_HTML += '<div id="sls_penetration_hdr">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;GP $</div>';
                    Report_HTML += '<div id="gp_penetration_hdr">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;GP %</div>';
                    Report_HTML += '<div id="attach_hdr">Sales $</div>';
                    Report_HTML += '<div id="sls_penetration_hdr">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;GP $</div>';
                    Report_HTML += '<div id="gp_penetration_hdr">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;GP %</div>';
                    Report_HTML += '<div id="attach_hdr">Sales $</div>';
                    Report_HTML += '<div id="sls_penetration_hdr">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;GP $</div>';
                    Report_HTML += '<div id="penetration_hdr_right">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;GP %</div>';
                    Report_HTML += '</div>';

                    Report_HTML += '<div id="new_row">';
                    Report_HTML += '<div id="blank_row">&nbsp;</div>';
                    Report_HTML += '</div>';
                }
            }
            if (MT3A_custrecord_sr_format1CSV) {
                if (MT3_custrecord_sr_version == 1) {   // Header %
                    Report_CSV += ',,Vendor Delivered,,,Mobius Delivered - Mobius,,,Mobius Delivered - Vendor,,,Outsourced,,,Total,,\n';
                    Report_CSV += 'Department,Item Manufacturer,Attach Rate %,Sales Penetration Rate %,GP Penetration Rate %,Attach Rate %,Sales Penetration Rate %,GP Penetration Rate %,Attach Rate %,Sales Penetration Rate %,GP Penetration Rate %,Attach Rate %,Sales Penetration Rate %,GP Penetration Rate %,Attach Rate %,Sales Penetration Rate %,GP Penetration Rate %\n';
                    Report_CSV += ',,,,,,,,,,,,,,,,\n';
                }
                if (MT3_custrecord_sr_version == 2) {   // Header $
                    Report_CSV += ',,Vendor Delivered,,,Mobius Delivered - Mobius,,,Mobius Delivered - Vendor,,,Outsourced,,,Total,,\n';
                    Report_CSV += 'Department,Item Manufacturer,Sales $,GP $,GP %,Sales $,GP $,GP %,Sales $,GP $,GP %,Sales $,GP $,GP %,Sales $,GP $,GP %\n';
                    Report_CSV += ',,,,,,,,,,,,,,,,\n';
                }
            }

            if (MT3A_custrecord_sr_format2HTML && isEmpty(MT6)){
                Report_HTML += '<div id="new_row">';
                Report_HTML += '<div id="NDA">No Data Available</div>';
                Report_HTML += '</div>';
            }
            if (MT3A_custrecord_sr_format1CSV && isEmpty(MT6)){
                Report_CSV += 'No Data Available,,,,,,,,,,,,,,,,\n';;
            }

        }

        if (isNotEmpty(MT6)) {
            // BEGIN LOOP
            {
                // SUB TOTAL SECTION
                for (var dCount = 0;dCount < MT6_depGroup.length;dCount++) {
                    // Summing by Department group
                    for (var iCount = 0; iCount < MT6_depGroup[dCount].MT6_itemsInDep.length; iCount++){
                        var iMT6 = MT6_depGroup[dCount].MT6_itemsInDep[iCount];

                        if (MT6[iMT6].MT6_class_position == 1) {
                            MT6_depGroup[dCount].VDARST  += MT6[iMT6].MT6_attach_rate_percent;
                            MT6_depGroup[dCount].VDSRST  += MT6[iMT6].MT6_sales_penetration_rate_percent;
                            MT6_depGroup[dCount].VDGPRST += MT6[iMT6].MT6_gp_penetration_rate_percent;
                        }
                        else if (MT6[iMT6].MT6_class_position == 2) {
                            MT6_depGroup[dCount].MDMARST  += MT6[iMT6].MT6_attach_rate_percent;
                            MT6_depGroup[dCount].MDMSRST  += MT6[iMT6].MT6_sales_penetration_rate_percent;
                            MT6_depGroup[dCount].MDMGPRST += MT6[iMT6].MT6_gp_penetration_rate_percent;
                        }
                        else if (MT6[iMT6].MT6_class_position == 3) {
                            MT6_depGroup[dCount].MDVARST  += MT6[iMT6].MT6_attach_rate_percent;
                            MT6_depGroup[dCount].MDVSRST  += MT6[iMT6].MT6_sales_penetration_rate_percent;
                            MT6_depGroup[dCount].MDVGPRST += MT6[iMT6].MT6_gp_penetration_rate_percent;
                        }
                        else if (MT6[iMT6].MT6_class_position == 4) {
                            MT6_depGroup[dCount].OARST   += MT6[iMT6].MT6_attach_rate_percent;
                            MT6_depGroup[dCount].OSRST   += MT6[iMT6].MT6_sales_penetration_rate_percent;
                            MT6_depGroup[dCount].OGPRST  += MT6[iMT6].MT6_gp_penetration_rate_percent;

                        }

                        MT6_depGroup[dCount].TARST  += MT6[iMT6].MT6_attach_rate_percent;
                        MT6_depGroup[dCount].TSRST  += MT6[iMT6].MT6_sales_penetration_rate_percent;
                        MT6_depGroup[dCount].TGPRST += MT6[iMT6].MT6_gp_penetration_rate_percent;
                    }

                    if (MT3A_custrecord_sr_format2HTML) {
                        Report_HTML += '<!-- SUB TOTAL -->';


                        Report_HTML += '<div id="new_row">';
                        Report_HTML += '<div id="DP">' + MT6_depGroup[dCount].DP + '</div>';
                        Report_HTML += '<div id="blank_cell_303">&nbsp;</div>';
                        Report_HTML += '<div id="VDARST">'   + Format_Commas(formatTwoDecimals(MT6_depGroup[dCount].VDARST))   + '</div>';
                        Report_HTML += '<div id="VDSRST">'   + Format_Commas(formatTwoDecimals(MT6_depGroup[dCount].VDSRST))   + '</div>';
                        Report_HTML += '<div id="VDGPRST">'  + formatTwoDecimals(MT6_depGroup[dCount].VDGPRST)  + '</div>';
                        Report_HTML += '<div id="MDMARST">'  + Format_Commas(formatTwoDecimals(MT6_depGroup[dCount].MDMARST))  + '</div>';
                        Report_HTML += '<div id="MDMSRST">'  + Format_Commas(formatTwoDecimals(MT6_depGroup[dCount].MDMSRST))  + '</div>';
                        Report_HTML += '<div id="MDMGPRST">' + formatTwoDecimals(MT6_depGroup[dCount].MDMGPRST) + '</div>';
                        Report_HTML += '<div id="MDVARST">'  + Format_Commas(formatTwoDecimals(MT6_depGroup[dCount].MDVARST))  + '</div>';
                        Report_HTML += '<div id="MDVSRST">'  + Format_Commas(formatTwoDecimals(MT6_depGroup[dCount].MDVSRST))  + '</div>';
                        Report_HTML += '<div id="MDVGPRST">' + formatTwoDecimals(MT6_depGroup[dCount].MDVGPRST) + '</div>';
                        Report_HTML += '<div id="OARST">'    + Format_Commas(formatTwoDecimals(MT6_depGroup[dCount].OARST))    + '</div>';
                        Report_HTML += '<div id="OSRST">'    + Format_Commas(formatTwoDecimals(MT6_depGroup[dCount].OSRST))    + '</div>';
                        Report_HTML += '<div id="OGPRST">'   + formatTwoDecimals(MT6_depGroup[dCount].OGPRST)   + '</div>';
                        Report_HTML += '<div id="TARST">'    + Format_Commas(formatTwoDecimals(MT6_depGroup[dCount].TARST))    + '</div>';
                        Report_HTML += '<div id="TSRST">'    + Format_Commas(formatTwoDecimals(MT6_depGroup[dCount].TSRST))    + '</div>';
                        Report_HTML += '<div id="TGPRST">'   + formatTwoDecimals(MT6_depGroup[dCount].TGPRST)   + '</div>';
                        Report_HTML += '</div>';
                    }

                    if (MT3A_custrecord_sr_format1CSV) {
                        Report_CSV += MT6_depGroup[dCount].DP + ',';
                        Report_CSV += ',';
                        Report_CSV += Format_Commas(formatTwoDecimals(MT6_depGroup[dCount].VDARST),'CSV')   + ',';
                        Report_CSV += Format_Commas(formatTwoDecimals(MT6_depGroup[dCount].VDSRST),'CSV')   + ',';
                        Report_CSV += formatTwoDecimals(MT6_depGroup[dCount].VDGPRST)  + ',';
                        Report_CSV += Format_Commas(formatTwoDecimals(MT6_depGroup[dCount].MDMARST),'CSV')  + ',';
                        Report_CSV += Format_Commas(formatTwoDecimals(MT6_depGroup[dCount].MDMSRST),'CSV')  + ',';
                        Report_CSV += formatTwoDecimals(MT6_depGroup[dCount].MDMGPRST) + ',';
                        Report_CSV += Format_Commas(formatTwoDecimals(MT6_depGroup[dCount].MDVARST),'CSV')  + ',';
                        Report_CSV += Format_Commas(formatTwoDecimals(MT6_depGroup[dCount].MDVSRST),'CSV')  + ',';
                        Report_CSV += formatTwoDecimals(MT6_depGroup[dCount].MDVGPRST) + ',';
                        Report_CSV += Format_Commas(formatTwoDecimals(MT6_depGroup[dCount].OARST),'CSV')    + ',';
                        Report_CSV += Format_Commas(formatTwoDecimals(MT6_depGroup[dCount].OSRST),'CSV')    + ',';
                        Report_CSV += formatTwoDecimals(MT6_depGroup[dCount].OGPRST)   + ',';
                        Report_CSV += Format_Commas(formatTwoDecimals(MT6_depGroup[dCount].TARST),'CSV')    + ',';
                        Report_CSV += Format_Commas(formatTwoDecimals(MT6_depGroup[dCount].TSRST),'CSV')    + ',';
                        Report_CSV += formatTwoDecimals(MT6_depGroup[dCount].TGPRST);
                        Report_CSV += '\n';
                    }

                    // DATA SECTION
                    {
                        // Summing by Department Item Manufacturer Group

                        for (var iCount = 0; iCount < MT6_depItemGroup[dCount].length; iCount++){
                            for (var diCount = 0; diCount < MT6_depItemGroup[dCount][iCount].MT6_itemsInDepItem.length; diCount ++) {
                                var diMT6 = MT6_depItemGroup[dCount][iCount].MT6_itemsInDepItem[diCount];

                                if (MT6[diMT6].MT6_class_position == 1) {
                                    MT6_depItemGroup[dCount][iCount].VDAR  = MT6[diMT6].MT6_attach_rate_percent;
                                    MT6_depItemGroup[dCount][iCount].VDSR  = MT6[diMT6].MT6_sales_penetration_rate_percent;
                                    MT6_depItemGroup[dCount][iCount].VDGPR = MT6[diMT6].MT6_gp_penetration_rate_percent;
                                }
                                else if (MT6[diMT6].MT6_class_position == 2) {
                                    MT6_depItemGroup[dCount][iCount].MDMAR  = MT6[diMT6].MT6_attach_rate_percent;
                                    MT6_depItemGroup[dCount][iCount].MDMSR  = MT6[diMT6].MT6_sales_penetration_rate_percent;
                                    MT6_depItemGroup[dCount][iCount].MDMGPR = MT6[diMT6].MT6_gp_penetration_rate_percent;
                                }
                                else if (MT6[diMT6].MT6_class_position == 3) {
                                    // Summing by Department Item Manufacturer Group
                                    MT6_depItemGroup[dCount][iCount].MDVAR  = MT6[diMT6].MT6_attach_rate_percent;
                                    MT6_depItemGroup[dCount][iCount].MDVSR  = MT6[diMT6].MT6_sales_penetration_rate_percent;
                                    MT6_depItemGroup[dCount][iCount].MDVGPR = MT6[diMT6].MT6_gp_penetration_rate_percent;
                                }
                                else if (MT6[diMT6].MT6_class_position == 4) {
                                    // Summing by Department Item Manufacturer Group
                                    MT6_depItemGroup[dCount][iCount].OAR  = MT6[diMT6].MT6_attach_rate_percent;
                                    MT6_depItemGroup[dCount][iCount].OSR  = MT6[diMT6].MT6_sales_penetration_rate_percent;
                                    MT6_depItemGroup[dCount][iCount].OGPR = MT6[diMT6].MT6_gp_penetration_rate_percent;
                                }

                                MT6_depItemGroup[dCount][iCount].TAR  += MT6[diMT6].MT6_attach_rate_percent;
                                MT6_depItemGroup[dCount][iCount].TSR  += MT6[diMT6].MT6_sales_penetration_rate_percent;
                                MT6_depItemGroup[dCount][iCount].TGPR += MT6[diMT6].MT6_gp_penetration_rate_percent;

                            }

                            if (MT3A_custrecord_sr_format2HTML) {

                                Report_HTML += '<!-- DATA -->';

                                Report_HTML += '<div id="new_row">';
                                Report_HTML += '<div id="blank_cell_304">&nbsp;</div>';
                                Report_HTML += '<div id="IM">'     + MT6_depItemGroup[dCount][iCount].IM     + '</div>';
                                Report_HTML += '<div id="VDAR">'   + Format_Commas(formatTwoDecimals(MT6_depItemGroup[dCount][iCount].VDAR))   + '</div>';
                                Report_HTML += '<div id="VDSR">'   + Format_Commas(formatTwoDecimals(MT6_depItemGroup[dCount][iCount].VDSR))   + '</div>';
                                Report_HTML += '<div id="VDGPR">'  + formatTwoDecimals(MT6_depItemGroup[dCount][iCount].VDGPR)  + '</div>';
                                Report_HTML += '<div id="MDMAR">'  + Format_Commas(formatTwoDecimals(MT6_depItemGroup[dCount][iCount].MDMAR))  + '</div>';
                                Report_HTML += '<div id="MDMSR">'  + Format_Commas(formatTwoDecimals(MT6_depItemGroup[dCount][iCount].MDMSR))  + '</div>';
                                Report_HTML += '<div id="MDMGPR">' + formatTwoDecimals(MT6_depItemGroup[dCount][iCount].MDMGPR) + '</div>';
                                Report_HTML += '<div id="MDVAR">'  + Format_Commas(formatTwoDecimals(MT6_depItemGroup[dCount][iCount].MDVAR))  + '</div>';
                                Report_HTML += '<div id="MDVSR">'  + Format_Commas(formatTwoDecimals(MT6_depItemGroup[dCount][iCount].MDVSR))  + '</div>';
                                Report_HTML += '<div id="MDVGPR">' + formatTwoDecimals(MT6_depItemGroup[dCount][iCount].MDVGPR) + '</div>';
                                Report_HTML += '<div id="OAR">'    + Format_Commas(formatTwoDecimals(MT6_depItemGroup[dCount][iCount].OAR))    + '</div>';
                                Report_HTML += '<div id="OSR">'    + Format_Commas(formatTwoDecimals(MT6_depItemGroup[dCount][iCount].OSR))    + '</div>';
                                Report_HTML += '<div id="OGPR">'   + formatTwoDecimals(MT6_depItemGroup[dCount][iCount].OGPR)   + '</div>';
                                Report_HTML += '<div id="TAR">'    + Format_Commas(formatTwoDecimals(MT6_depItemGroup[dCount][iCount].TAR))    + '</div>';
                                Report_HTML += '<div id="TSR">'    + Format_Commas(formatTwoDecimals(MT6_depItemGroup[dCount][iCount].TSR))    + '</div>';
                                Report_HTML += '<div id="TGPR">'   + formatTwoDecimals(MT6_depItemGroup[dCount][iCount].TGPR)   + '</div>';
                                Report_HTML += '\n';
                            }
                            if (MT3A_custrecord_sr_format1CSV) {
                                Report_CSV += ',';
                                Report_CSV += MT6_depItemGroup[dCount][iCount].IM     + ',';
                                Report_CSV += Format_Commas(formatTwoDecimals(MT6_depItemGroup[dCount][iCount].VDAR),'CSV')   + ',';
                                Report_CSV += Format_Commas(formatTwoDecimals(MT6_depItemGroup[dCount][iCount].VDSR),'CSV')   + ',';
                                Report_CSV += formatTwoDecimals(MT6_depItemGroup[dCount][iCount].VDGPR)  + ',';
                                Report_CSV += Format_Commas(formatTwoDecimals(MT6_depItemGroup[dCount][iCount].MDMAR),'CSV')  + ',';
                                Report_CSV += Format_Commas(formatTwoDecimals(MT6_depItemGroup[dCount][iCount].MDMSR),'CSV')  + ',';
                                Report_CSV += formatTwoDecimals(MT6_depItemGroup[dCount][iCount].MDMGPR) + ',';
                                Report_CSV += Format_Commas(formatTwoDecimals(MT6_depItemGroup[dCount][iCount].MDVAR),'CSV')  + ',';
                                Report_CSV += Format_Commas(formatTwoDecimals(MT6_depItemGroup[dCount][iCount].MDVSR),'CSV')  + ',';
                                Report_CSV += formatTwoDecimals(MT6_depItemGroup[dCount][iCount].MDVGPR) + ',';
                                Report_CSV += Format_Commas(formatTwoDecimals(MT6_depItemGroup[dCount][iCount].OAR),'CSV')    + ',';
                                Report_CSV += Format_Commas(formatTwoDecimals(MT6_depItemGroup[dCount][iCount].OSR),'CSV')    + ',';
                                Report_CSV += formatTwoDecimals(MT6_depItemGroup[dCount][iCount].OGPR)   + ',';
                                Report_CSV += Format_Commas(formatTwoDecimals(MT6_depItemGroup[dCount][iCount].TAR),'CSV')    + ',';
                                Report_CSV += Format_Commas(formatTwoDecimals(MT6_depItemGroup[dCount][iCount].TSR),'CSV')    + ',';
                                Report_CSV += formatTwoDecimals(MT6_depItemGroup[dCount][iCount].TGPR);
                                Report_CSV += '\n';
                            }
                        }
                    }
                }
            }   // END LOOP


            // GRAND TOTAL SECTION
            {
                // Summing total group
                var MT6_totalGroup     = new MT6_TotalGroup();
                for (var i = 0; i < MT6.length; i++) {
                    if (MT6[i].MT6_class_position == 1) {
                        MT6_totalGroup.VDARGT  += MT6[i].MT6_attach_rate_percent;
                        MT6_totalGroup.VDSRGT  += MT6[i].MT6_sales_penetration_rate_percent;
                        MT6_totalGroup.VDGPRGT += MT6[i].MT6_gp_penetration_rate_percent;
                    }
                    else if (MT6[i].MT6_class_position == 2) {
                        MT6_totalGroup.MDMARGT  += MT6[i].MT6_attach_rate_percent;
                        MT6_totalGroup.MDMSRGT  += MT6[i].MT6_sales_penetration_rate_percent;
                        MT6_totalGroup.MDMGPRGT += MT6[i].MT6_gp_penetration_rate_percent;
                    }
                    else if (MT6[i].MT6_class_position == 3) {
                        MT6_totalGroup.MDVARGT  += MT6[i].MT6_attach_rate_percent;
                        MT6_totalGroup.MDVSRGT  += MT6[i].MT6_sales_penetration_rate_percent;
                        MT6_totalGroup.MDVGPRGT += MT6[i].MT6_gp_penetration_rate_percent;
                    }
                    else if (MT6[i].MT6_class_position == 4) {
                        MT6_totalGroup.OARGT   += MT6[i].MT6_attach_rate_percent;
                        MT6_totalGroup.OSRGT   += MT6[i].MT6_sales_penetration_rate_percent;
                        MT6_totalGroup.OGPRGT  += MT6[i].MT6_gp_penetration_rate_percent;
                    }

                    MT6_totalGroup.TARGT  += MT6[i].MT6_attach_rate_percent;
                    MT6_totalGroup.TSRGT  += MT6[i].MT6_sales_penetration_rate_percent;
                    MT6_totalGroup.TGPRGT += MT6[i].MT6_gp_penetration_rate_percent;
                }

                if (MT3A_custrecord_sr_format2HTML) {

                    Report_HTML += '<!-- GRAND TOTAL -->';

                    Report_HTML += '<div id="new_row">';
                    Report_HTML += '<div id="gtotal">Total</div>';
                    Report_HTML += '<div id="VDARGT">'   + Format_Commas(formatTwoDecimals(MT6_totalGroup.VDARGT))   + '</div>';
                    Report_HTML += '<div id="VDSRGT">'   + Format_Commas(formatTwoDecimals(MT6_totalGroup.VDSRGT))   + '</div>';
                    Report_HTML += '<div id="VDGPRGT">'  + formatTwoDecimals(MT6_totalGroup.VDGPRGT)  + '</div>';
                    Report_HTML += '<div id="MDMARGT">'  + Format_Commas(formatTwoDecimals(MT6_totalGroup.MDMARGT))  + '</div>';
                    Report_HTML += '<div id="MDMSRGT">'  + Format_Commas(formatTwoDecimals(MT6_totalGroup.MDMSRGT))  + '</div>';
                    Report_HTML += '<div id="MDMGPRGT">' + formatTwoDecimals(MT6_totalGroup.MDMGPRGT) + '</div>';
                    Report_HTML += '<div id="MDVARGT">'  + Format_Commas(formatTwoDecimals(MT6_totalGroup.MDVARGT))  + '</div>';
                    Report_HTML += '<div id="MDVSRGT">'  + Format_Commas(formatTwoDecimals(MT6_totalGroup.MDVSRGT))  + '</div>';
                    Report_HTML += '<div id="MDVGPRGT">' + formatTwoDecimals(MT6_totalGroup.MDVGPRGT) + '</div>';
                    Report_HTML += '<div id="OARGT">'    + Format_Commas(formatTwoDecimals(MT6_totalGroup.OARGT))    + '</div>';
                    Report_HTML += '<div id="OSRGT">'    + Format_Commas(formatTwoDecimals(MT6_totalGroup.OSRGT))    + '</div>';
                    Report_HTML += '<div id="OGPRGT">'   + formatTwoDecimals(MT6_totalGroup.OGPRGT)   + '</div>';
                    Report_HTML += '<div id="TARGT">'    + Format_Commas(formatTwoDecimals(MT6_totalGroup.TARGT))    + '</div>';
                    Report_HTML += '<div id="TSRGT">'    + Format_Commas(formatTwoDecimals(MT6_totalGroup.TSRGT))    + '</div>';
                    Report_HTML += '<div id="TGPRGT">'   + formatTwoDecimals(MT6_totalGroup.TGPRGT)   + '</div>';
                    Report_HTML += '</div>';

                    Report_HTML += '</div>';

                    Report_HTML += '</body>';
                    Report_HTML += '</html>';

                }

                if (MT3A_custrecord_sr_format1CSV) {

                    Report_CSV += 'Total' + ',,';
                    Report_CSV += Format_Commas(formatTwoDecimals(MT6_totalGroup.VDARGT),'CSV')   + ',';
                    Report_CSV += Format_Commas(formatTwoDecimals(MT6_totalGroup.VDSRGT),'CSV')   + ',';
                    Report_CSV += formatTwoDecimals(MT6_totalGroup.VDGPRGT)  + ',';
                    Report_CSV += Format_Commas(formatTwoDecimals(MT6_totalGroup.MDMARGT),'CSV')  + ',';
                    Report_CSV += Format_Commas(formatTwoDecimals(MT6_totalGroup.MDMSRGT),'CSV')  + ',';
                    Report_CSV += formatTwoDecimals(MT6_totalGroup.MDMGPRGT) + ',';
                    Report_CSV += Format_Commas(formatTwoDecimals(MT6_totalGroup.MDVARGT),'CSV')  + ',';
                    Report_CSV += Format_Commas(formatTwoDecimals(MT6_totalGroup.MDVSRGT),'CSV')  + ',';
                    Report_CSV += formatTwoDecimals(MT6_totalGroup.MDVGPRGT) + ',';
                    Report_CSV += Format_Commas(formatTwoDecimals(MT6_totalGroup.OARGT),'CSV')    + ',';
                    Report_CSV += Format_Commas(formatTwoDecimals(MT6_totalGroup.OSRGT),'CSV')    + ',';
                    Report_CSV += formatTwoDecimals(MT6_totalGroup.OGPRGT)   + ',';
                    Report_CSV += Format_Commas(formatTwoDecimals(MT6_totalGroup.TARGT),'CSV')    + ',';
                    Report_CSV += Format_Commas(formatTwoDecimals(MT6_totalGroup.TSRGT),'CSV')    + ',';
                    Report_CSV += formatTwoDecimals(MT6_totalGroup.TGPRGT);
                    Report_CSV += '\n';

                }
            }
        }

    }
    catch(err){
        // LOG ERROR, SEND ERROR NOTIFICATION EMAIL AND EXIT SCRIPT
        var SkySuiteErrorMessage = 'Error constructing report(s)';
        logAndSendEmail( SkySuiteErrorMessage, err );
        return;
    }


    // GET DATE AND TIME
    var serverDate = new Date();

    var MT8_mm   = addLeadingZero(serverDate.getMonth()+1, 2);
    var MT8_dd   = addLeadingZero(serverDate.getDate(), 2);
    var MT8_yyyy = serverDate.getFullYear();
    var MT8_hh   = addLeadingZero(serverDate.getHours(), 2);
    var MT8_min  = addLeadingZero(serverDate.getMinutes(), 2);
    var MT8_ss   = addLeadingZero(serverDate.getSeconds(), 2);


    // CONSTRUCT FILE NAME(S)
    try {

        if (MT3A_custrecord_sr_format2HTML) {
            var MT9_file_name_html = '';
            MT9_file_name_html += 'Services_Report_' + MT2_custscript_sr_internal_id;
            MT9_file_name_html += '_' + MT8_yyyy;
            MT9_file_name_html += '_' + MT8_mm;
            MT9_file_name_html += '_' + MT8_dd;
            MT9_file_name_html += '_' + MT8_hh;
            MT9_file_name_html += '_' + MT8_min;
            MT9_file_name_html += '_' + MT8_ss;
            MT9_file_name_html += '.html';

        }

        if (MT3A_custrecord_sr_format1CSV) {
            var MT9_file_name_csv = '';
            MT9_file_name_csv += 'Services_Report_' + MT2_custscript_sr_internal_id;
            MT9_file_name_csv += '_' + MT8_yyyy;
            MT9_file_name_csv += '_' + MT8_mm;
            MT9_file_name_csv += '_' + MT8_dd;
            MT9_file_name_csv += '_' + MT8_hh;
            MT9_file_name_csv += '_' + MT8_min;
            MT9_file_name_csv += '_' + MT8_ss;
            MT9_file_name_csv += '.csv';

        }
    }
    catch(err){
        // LOG ERROR, SEND ERROR NOTIFICATION EMAIL AND EXIT SCRIPT
        var SkySuiteErrorMessage = 'Error constructing file name(s)';
        logAndSendEmail( SkySuiteErrorMessage, err );
        return;
    }

    
    // CREATE FILE(S)
    try {

        if (MT3A_custrecord_sr_format2HTML) {

            var htmlFile = nlapiCreateFile( MT9_file_name_html, 'HTMLDOC', Report_HTML );
            htmlFile.setFolder( Folder );
            htmlFile.setIsOnline( true );

            var MT10_file_internalid_html = nlapiSubmitFile( htmlFile );
        }

        if (MT3A_custrecord_sr_format1CSV) {

            var csvFile = nlapiCreateFile( MT9_file_name_csv, 'CSV', Report_CSV );
            csvFile.setFolder( Folder );
            csvFile.setIsOnline( true );

            var MT10_file_internalid_csv = nlapiSubmitFile( csvFile );
        }
    }
    catch(err){
        // LOG ERROR, SEND ERROR NOTIFICATION EMAIL AND EXIT SCRIPT
        var SkySuiteErrorMessage = 'Error creating file';
        logAndSendEmail( SkySuiteErrorMessage, err );
        return;
    }


    // GET FILE URL(S)
    try {
        var fileInternalId = MT10_file_internalid_html;
        if (MT3A_custrecord_sr_format2HTML) {
            var htmlFile = nlapiLoadFile( MT10_file_internalid_html );
            var MT11_file_url_html_data = htmlFile.getURL();
        }

        var fileInternalId = MT10_file_internalid_csv;
        if (MT3A_custrecord_sr_format1CSV) {
            var csvFile = nlapiLoadFile( MT10_file_internalid_csv );
            var MT11_file_url_csv_data = csvFile.getURL();
        }
        
    }
    catch(err){
        // LOG ERROR, SEND ERROR NOTIFICATION EMAIL AND EXIT SCRIPT
        var SkySuiteErrorMessage = 'Error getting data for File Internal ID ' + fileInternalId;
        logAndSendEmail( SkySuiteErrorMessage, err );
        return;
    }


    // CONSTRUCT URL(S)
    try {

        var fileInternalId = MT10_file_internalid_html;
        if (MT3A_custrecord_sr_format2HTML) {
            var MT11_file_url_html =  MT2A_environment_url + MT11_file_url_html_data + '&_xd=T&e=T';
        }

        var fileInternalId = MT10_file_internalid_csv;
        if (MT3A_custrecord_sr_format1CSV) {
            var MT11_file_url_csv =  MT2A_environment_url + MT11_file_url_csv_data + '&_xd=T&e=T';
        }
    }
    catch(err){
        // LOG ERROR, SEND ERROR NOTIFICATION EMAIL AND EXIT SCRIPT
        var SkySuiteErrorMessage = 'Error constructing URL for File Internal ID ' + fileInternalId;
        logAndSendEmail( SkySuiteErrorMessage, err );
        return;
    }


    // REPORT NOTIFICATION EMAIL
    try {

        if (isNotEmpty(MT11_file_url_html) || isNotEmpty(MT11_file_url_csv)) {
            var body_Message = '<html><body style="font-family: Verdana; font-size: 10pt; color: black;" >';
            body_Message += "<div style='font-family: Verdana; font-size: 10pt; color: black;'>Please access your report(s):</div><br>";
            if (isNotEmpty(MT11_file_url_html)) {
                body_Message += "<a href='" + MT11_file_url_html + "' style='font-family: Verdana; font-size: 10pt; color: black;' >Services Report.html</a><br><br>";
            }
            if (isNotEmpty(MT11_file_url_csv)) {
                body_Message += "<a href='" + MT11_file_url_csv  + "' style='font-family: Verdana; font-size: 10pt; color: black;' >Services Report.csv</a><br><br>";
            }
            body_Message += "<div style='font-family: Verdana; font-size: 10pt; color: black;'>Please note that report(s) are available for 90 days.</div><br>";
            body_Message += "<div style='font-family: Verdana; font-size: 10pt; color: black;'>Mobius Partners</div><br>";
            body_Message += "</body></html>";

            nlapiSendEmail( MT2_custscript_sr_user, MT2_custscript_sr_user, 'Services Report', body_Message, null );

            if (isNotEmpty(MT3A_custrecord_sr_email)) {
                for (var i = 0; i < MT3A_custrecord_sr_email.length; i++  ){
                    nlapiSendEmail( MT2_custscript_sr_user, MT3A_custrecord_sr_email[i], 'Services Report', body_Message, null );
                }
            }

        }
    }
    catch(err){
        // LOG ERROR, SEND ERROR NOTIFICATION EMAIL AND EXIT SCRIPT
        var SkySuiteErrorMessage = 'Error sending report notification email';
        logAndSendEmail( SkySuiteErrorMessage, err );
        return;
    }
}



// ********************************************************************************
// HELPER FUNCTIONS
// ********************************************************************************

function logAndSendEmail( str_Message, err )
{
    // Need to check for NetSuite error message and JavaScript error message
    var err_Details = "";
    if ( err != null )
    {
        try {
            err_Details = err.getDetails();
        }
        catch( e ){
            err_Details = err;
        }
    }

    // LOG ERROR
    nlapiLogExecution( "error", "Error Notification", str_Message + '.  ' + err_Details );

    // ERROR NOTIFICATION EMAIL
    var SkySuiteErrorMessage = "Error sending email";

    // GET SERVER DATE AND TIME
    var MT1_Date_Time = ( new Date() ).toString();

    var message = "Script: Services Report 2\n\n";
    message += "Date and Time: " + MT1_Date_Time + "\n\n";
    message += "Notification: " + str_Message + '. ' + err_Details + "\n";

    try {
        nlapiSendEmail( Email_From, Email_To, "Error Notification", message, null );
    }
    catch(err){
        // LOG ERROR AND CONTINUE
        nlapiLogExecution( 'error', 'Error Notification', SkySuiteErrorMessage + '.  ' + err.getDetails() );
        return false;
    }

    return true;
}

// FORMAT (COMMAS)
function Format_Commas(nStr,formatType){

    if (MT3_custrecord_sr_version == 2) {
        nStr += '';
        var x = nStr.split('.');
        var x1 = x[0];
        var x2 = x.length > 1 ? '.' + x[1] : '';
        var rgx = /(\d+)(\d{3})/;
        while (rgx.test(x1)) {
                x1 = x1.replace(rgx, '$1' + ',' + '$2');
        }

        if (formatType == 'CSV') {
            var numberFormatCommas = '"' + x1 + x2 + '"';
        }
        else {
            var numberFormatCommas = x1 + x2;
        }

        return numberFormatCommas;
    }
    else {
        return nStr;
    }
}

function addLeadingZero(n, totalDigits) {
    n = n.toString();
    var pd = '';
    if (totalDigits >= n.length) {
        for (var i=0; i < (totalDigits-n.length); i++) {
            pd += '0';
        }
    }
    return pd + n.toString();
}

function constructDateAsString(dateToConvert){
    var monthInLetters = ['January', 'February', 'March','April','May','June','July','August','September','October','November','December'];

    var MTD_date = new Date(dateToConvert);

    var MTD_mm_date   = MTD_date.getMonth();
    var MTD_dd_date   = MTD_date.getDate();
    var MTD_yyyy_date = MTD_date.getFullYear();

    var dateAsString = monthInLetters[MTD_mm_date] + ' ' + MTD_dd_date + ', ' + MTD_yyyy_date;
    return dateAsString;
}

function dropDigitsAfterTwoDecimals(
    number
){

    var stringNumber = String(number);
    if (stringNumber.indexOf('.') == -1) {
        stringNumber += '.';
    }
    stringNumber += '00';
    var twoDecimalsNumber = stringNumber.substring(0,stringNumber.indexOf('.') + 3);

    var newNumber = Number(twoDecimalsNumber);

    return newNumber;
}

function formatTwoDecimals(number){

    var twoDecimalsNumber = number.toFixed(2);

    return twoDecimalsNumber;
}

function isEmpty(variable){
    return (variable == null || variable == '');
}

function isNotEmpty(variable){
    return (variable != null && variable != '');
}

function parseComma(string){
    if (isEmpty(string)) {
        return null;
    }
    return string.split(",");
}

function sortBy_MT6_DepartmentItemClass(a, b){

var x = a.MT6_department_position;
var y = b.MT6_department_position;
return ( (x < y) ? -1 : ( (x > y) ? 1 : sortBy_MT6_ItemClass(a,b) ) );
}

function sortBy_MT6_ItemClass(c, d){

var x = c.MT6_custcol_item_manufacturer_label;
var y = d.MT6_custcol_item_manufacturer_label;
return ( (x < y) ? -1 : ( (x > y) ? 1 : sortBy_MT6_Class(c,d) ) );
}


function sortBy_MT6_Class(e, f){

var x = e.MT6_class_position;
var y = f.MT6_class_position;
return ((x < y) ? -1 : 1);
}

function MT4_Record(departmentRecord){

    this.MT4_internalid                          = departmentRecord.getId();
    this.MT4_namenohierarchy                     = departmentRecord.getValue('namenohierarchy');
    this.MT4_custrecord_services_report_position = departmentRecord.getValue('custrecord_services_report_position');
}

function MT4A_Record(classRecord){

    this.MT4A_internalid                              = classRecord.getId();
    this.MT4A_namenohierarchy                         = classRecord.getValue('namenohierarchy');
    this.MT4A_custrecord_services_report_position_cls = classRecord.getValue('custrecord_services_report_position_cls');
}

function MT5_Record(itemManufacturerRecord){

    this.MT5_internalid                          = itemManufacturerRecord.getId();
    this.MT5_name                                = itemManufacturerRecord.getValue('name');
}

function MT6_Record(servicesRecord){

    this.MT6_department                      = servicesRecord.getValue( 'department',               null,'group');
    this.MT6_custcol_item_manufacturer       = servicesRecord.getValue( 'custcol_item_manufacturer',null,'group');
    this.MT6_class                           = servicesRecord.getValue( 'class',                    null,'group');
    this.MT6_internalid                      = servicesRecord.getValue( 'internalid',               null,'count');
    this.MT6_amount                          = servicesRecord.getValue( 'amount',                   null,'sum');
    this.MT6_altsalesamount                  = servicesRecord.getValue( 'altsalesamount',           null,'sum');
    this.MT6_quantity                        = servicesRecord.getValue( 'quantity',                 null,'sum');
    this.MT6_quantitybilled                  = servicesRecord.getValue( 'quantitybilled',           null,'sum');
    this.MT6_billed_percent_services         = 0.00;
    this.MT6_attach_rate_percent             = 0.00;
    this.MT6_sales_penetration_rate_percent  = 0.00;
    this.MT6_gp_penetration_rate_percent     = 0.00;
    this.MT6_class_label                     = null;
    this.MT6_class_position                  = null;
    this.MT6_department_label                = null;
    this.MT6_department_position             = null;
    this.MT6_custcol_item_manufacturer_label = null;
}

function MT6_DepartmentGroup(MT6Record){

    this.DP            = MT6Record.MT6_department_label;
    this.MT6_itemsInDep = new Array();
    this.VDARST   = 0.00;
    this.VDSRST   = 0.00;
    this.VDGPRST  = 0.00;
    this.MDMARST  = 0.00;
    this.MDMSRST  = 0.00;
    this.MDMGPRST = 0.00;
    this.MDVARST  = 0.00;
    this.MDVSRST  = 0.00;
    this.MDVGPRST = 0.00;
    this.OARST    = 0.00;
    this.OSRST    = 0.00;
    this.OGPRST   = 0.00;
    this.TARST    = 0.00;
    this.TSRST    = 0.00;
    this.TGPRST   = 0.00;
}

function MT6_DepartmentItemManufacturerGroup(MT6Record){

    this.IM     = MT6Record.MT6_custcol_item_manufacturer_label;
    this.MT6_itemsInDepItem = new Array();
    this.VDAR   = 0.00;
    this.VDSR   = 0.00;
    this.VDGPR  = 0.00;
    this.MDMAR  = 0.00;
    this.MDMSR  = 0.00;
    this.MDMGPR = 0.00;
    this.MDVAR  = 0.00;
    this.MDVSR  = 0.00;
    this.MDVGPR = 0.00;
    this.OAR    = 0.00;
    this.OSR    = 0.00;
    this.OGPR   = 0.00;
    this.TAR    = 0.00;
    this.TSR    = 0.00;
    this.TGPR   = 0.00;
}

function MT6_TotalGroup(){

    this.VDARGT   = 0.00;
    this.VDSRGT   = 0.00;
    this.VDGPRGT  = 0.00;
    this.MDMARGT  = 0.00;
    this.MDMSRGT  = 0.00;
    this.MDMGPRGT = 0.00;
    this.MDVARGT  = 0.00;
    this.MDVSRGT  = 0.00;
    this.MDVGPRGT = 0.00;
    this.OARGT    = 0.00;
    this.OSRGT    = 0.00;
    this.OGPRGT   = 0.00;
    this.TARGT    = 0.00;
    this.TSRGT    = 0.00;
    this.TGPRGT   = 0.00;
}



// END