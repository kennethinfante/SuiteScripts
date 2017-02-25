/**
* Company			Explore Consulting
* Copyright			2011 Explore Consulting, LLC
* Type				NetSuite Server-Side SuiteScript
* Version			1.0.0.0
* Description		This script is executed when the user creates or edits an
* Developer         John Elvidge
**/

    //this array is going to hold all of the rows in the items lists as objects. This array stores all of the rows on the invoices-->items-->billable time subtabs as objects.(each row is an object)
    //var rowData = new Array();    //DO NOT DELETE. VERY IMPORTANT
    //used to store the loaded record. using as global variable to limit passing through functions that don't require it
    //var invoiceId = null;   //DO NOT DELETE. VERY IMPORTANT
    //var invoiceRecord = null;   //DO NOT DELETE. VERY IMPORTANT

    function afterSubmit(type) 
    {
        nlapiLogExecution("DEBUG", "afterSubmit", "ENTERING");
        try 
        {
            if (type == 'create' || type == 'edit')
            {
                processTimeData();
            }
        }
        catch (e) 
        {
            nlapiLogExecution('DEBUG', 'unexpected error', e.toString());
        }
        nlapiLogExecution("DEBUG", "afterSubmit", "EXITING");
    }

    function processTimeData()
    {
        nlapiLogExecution("DEBUG", "processTimeData", "ENTERING");

        var invoiceId = nlapiGetRecordId();
        var invoiceRecord = nlapiLoadRecord('invoice', invoiceId);

        var rowData = getTimeData(invoiceRecord);
        nlapiLogExecution("DEBUG", "processTimeData", "Original Row Data: " + JSON.stringify(rowData));
        rowData = cleanRowData(rowData);
        nlapiLogExecution("DEBUG", "processTimeData", "Final Data To Update: " + JSON.stringify(rowData));

        // Update the rows that need the description updated. The objects in the collection contain the data that needs to be updated
        // Along with the row that it is on
        if(rowData){
            for(var i = 0; i < rowData.length; i++){
                invoiceRecord.setLineItemValue('time', 'memo', rowData[i].row, rowData[i].description);
            }
        }

        var id = nlapiSubmitRecord(invoiceRecord);
        nlapiLogExecution("DEBUG", "processTimeData", "Invoice Record Updated: " + id);
    }

    function getTimeData(invoiceRecord)
    {
        var rowData = new Array();

        //gets total of rows in the sublist
        var numberOfRows = invoiceRecord.getLineItemCount('time');
        //sorting through each row in the sublist and creating objects for each row. Then pushing each object to an array. This array will contain all important content for that sublist
        for (var i = 1; i <= numberOfRows; i++)
        {
            var rowObject = new Object();
            rowObject = createRowObject(invoiceRecord, i);
            rowData.push(rowObject);
        }

        return rowData;
    }

    function createRowObject(invoiceRecord, row) 
    {
        var rowObject = new Object();

        // This will be gathered later in the process. A concatenation of other values.
        rowObject.description = '';

        // Determine if to apply this line item data to the date range string
        rowObject.apply = invoiceRecord.getLineItemValue('time', 'apply', row);

        //this is to get the Rate of the line
        rowObject.rate = invoiceRecord.getLineItemValue('time', 'rate', row);

        //this is to get the Date of the line
        rowObject.oldDate = invoiceRecord.getLineItemValue('time', 'billeddate', row);
        //this is retrieving the new date value
        rowObject.newDate = getMondayDate(rowObject.oldDate);

        //this is to get the Item ID of the line
        rowObject.itemText = invoiceRecord.getLineItemValue('time', 'itemdisp', row);
        rowObject.itemId = invoiceRecord.getLineItemValue('time', 'item', row);

        //this is to get the Employee ID and Display Name of the line
        rowObject.employeeText = invoiceRecord.getLineItemValue('time', 'employeedisp', row);
        rowObject.employeeId = invoiceRecord.getLineItemValue('time', 'employee', row);

        //the row that the object is on in the sub-list
        rowObject.row = row;

        //this is used later for logic
        rowObject.rowChecked = false;

        return rowObject;
    }

    function cleanRowData(rowData)
    {
        nlapiLogExecution("DEBUG", "cleanRowData", "ENTERING");
        //this will hold an array of objects(each object is a row) which needs to be updated with description
        var rowsToUpdate = new Array();

        //this is going to loop through each row and find a match for that item
        for (var i = 0; i < rowData.length; i++)
        {
            //if the row has already been checked/used, Do not even search for it
            if (rowData[i].rowChecked == false)
            {
                var matchingRowsData = getMatchingRows(rowData, rowData[i].employeeId, rowData[i].itemId, rowData[i].rate);
                nlapiLogExecution("DEBUG", "cleanRowData", "Matching Row Set: " + JSON.stringify(matchingRowsData));
                if(matchingRowsData && matchingRowsData.length > 0){
                    rowsToUpdate.push(buildUpdatedRowData(matchingRowsData));
                }
            }
        }

        return rowsToUpdate;
    }

    function getMatchingRows(rowData, parentEmployeeId, parentItemId, parentRate)
    {
        nlapiLogExecution("DEBUG", "matchRowsData", "ENTERING");
        var matchingRows = new Array();

        //comparing each row in the rowData object to the values brought into the function
        for (var i = 0; i < rowData.length; i++)
        {
            //if already checked, don't even check it again
            if (rowData[i].rowChecked == false && rowData[i].apply == "T")
            {
                //these are the values we need to match to see if they exist
                var childEmployeeId = rowData[i].employeeId;
                var childItemId = rowData[i].itemId;
                var childRate = rowData[i].rate;

                //if these two values match, then we want to push that row to the array of row objects that match
                if (parentEmployeeId == childEmployeeId && parentItemId == childItemId && parentRate == childRate){
                    rowData[i].rowChecked = true;
                    matchingRows.push(rowData[i]);
                }
                else {
                    //if it doesn't exist, because the ordering is grouped sequentially, we don't need to continue searching so exit loop
                    break;
                }
            }
        }

        return matchingRows;
    }

    function buildUpdatedRowData(matchingRowsData)
    {
        // Sort this data by row, because we want the first of the rows to be updated. This is because you can only update the description
        // For the first entry containing the matching data.
        matchingRowsData = matchingRowsData.sort(function(a,b) {return a.row - b.row;});

        // Retrieve the row object that will need to be updated on the record
        var returnRowData = matchingRowsData[0];
        // Build the description value. The function takes in all of the corresponding "matching" rows and return a parent description value.
        returnRowData.description = buildDescription(returnRowData, matchingRowsData);

        return returnRowData;
    }

    function buildDescription(returnRowData, matchingRowsData)
    {
        nlapiLogExecution("DEBUG", "buildDescription", "ENTERING");
        var dateCollection = new Array();
        var dateConcat = '';

        // Build a collection containing all of the new date values for all of the matching rows data
        for(var i = 0; i < matchingRowsData.length; i++){
            dateCollection.push(matchingRowsData[i].newDate);
        }

        // Call this function to remove all of the duplicate date values in the new date collection
        dateCollection = removeArrDups(dateCollection);
        dateCollection = sortDates(dateCollection);
        // Build a date string with all of the date values.
        for(var x = 0; x < dateCollection.length; x++){
            if(x > 0) { dateConcat += ', '; }
            dateConcat += dateCollection[x];
        }

        // Creating the description text string
        var description = returnRowData.employeeText + " @ $" + returnRowData.rate + " for week(s) of " + dateConcat;
        nlapiLogExecution('DEBUG', "buildDescription", "Description: " + description);

        return description;
    }

    function sortDates(dateCollection)
    {
        var date_sort_asc = function (date1, date2) { if (date1 > date2) return 1; if (date1 < date2) return -1; return 0; };
        var newDates = new Array();
        var returnDates = new Array();
        for(var i = 0; i < dateCollection.length; i++){
            newDates.push(nlapiStringToDate(dateCollection[i]));
        }
        newDates = newDates.sort(date_sort_asc);
        for(var x = 0; x < newDates.length; x++){
            returnDates.push(nlapiDateToString(newDates[x]));
        }
        return returnDates;
    }

    function removeArrDups(arr) {
        var returnArr = new Array();
        arr.sort();
        for(var i = 0; i < arr.length; i++){
            returnArr.push(arr[i]);
            for(var x = 0; x < arr.length; x++){
                if(arr[i] == arr[i+1]) {
                    i++;
                }
            }
        }
        return returnArr;
    }


    function getMondayDate(billedDate) 
    {
        var newDate;
        var daysToChange;

        //convert brought in string date to a date object
        var billedDateObj = nlapiStringToDate(billedDate);

        //get the day of the week for the date
        var dayOfWeek = billedDateObj.getDay();

        //depending on what day of the week it falls under, subtract it to get to the day of 1. (monday). 0 is sunday - 6 is saturday
        if (dayOfWeek == 6) {
            daysToChange = -5;
        }
        else if (dayOfWeek == 5) {
            daysToChange = -4;
        }
        else if (dayOfWeek == 4) {
            daysToChange = -3;
        }
        else if (dayOfWeek == 3) {
            daysToChange = -2;
        }
        else if (dayOfWeek == 2) {
            daysToChange = -1;
        }
        else if (dayOfWeek == 0) {
            daysToChange = 1;
        }
        else if (dayOfWeek == 1) {
            daysToChange = 0;
        }

        //adding or subtracting days from the date brought in, to make the new date a date of the week of that monday
        newDate = nlapiAddDays(billedDateObj, daysToChange);

        //the newly formed date, based on the monday of the week that this is based on
        var newDateString = nlapiDateToString(newDate);

        return newDateString;
    }

