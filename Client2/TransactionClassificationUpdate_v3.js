// Type: Scheduled
// Name: Transaction Classification Update
// Summary: Script will update transaction line item department, class and item manufacturer based 
// on item department, class and item manufacturer on opportunities, estimates, sales orders, invoices and purchase orders.

// Item Class
function Item( internalid, departmentid, classid, manufacturer )
{
	this.internalid = internalid;
	this.departmentid = departmentid;
	this.classid = classid;
    this.manufacturer = manufacturer;
}

function TransactionClassificationUpdate()
{
	
	// **************************************************************************************************************
	// EXECUTE TRANSACTION SAVED SEARCH
	// **************************************************************************************************************
	
	try {
		var tran_search = nlapiSearchRecord( 'transaction', 'customsearch_tran_classification_update', null, null );
	}catch(err){
		nlapiLogExecution( 'error', 'Transaction Search Execution Error', 'Error executing transaction search (customsearch_tran_classification_update). ' + err.getDetails() );
		// Exit Script
		return;
	}
	
	// Create Memory Table
	var MemoryTable1 =  new Array();
	var itemsArray = new Array();
	var foundID = false;
		
	if ( tran_search != null )
	{
		
		// Traverse all returns to gather Transaction ID's
		for ( var i = 0; i < tran_search.length; i++ )
		{
			
			// Get ID, Type and Item
			var internalid = checkIfNull( tran_search[i].getId() );
			var type = checkIfNull( tran_search[i].getValue( 'type' ) );
			var item = checkIfNull( tran_search[i].getValue( 'item' ) );
			
			// Get current index of Memory Table
			var index = MemoryTable1.length;
								
			foundID = false;
			// check if ID is already in Memory Table 1
			for ( var x = 0; x < index; x++ )
			{
				if ( MemoryTable1[x][0] == internalid )
				{	
					// If we found the internal id in MemoryTable,
					// We don't need to add it to the table
					// We don't want duplicate internal ID's
					foundID = true;
					break;
				}
			}
			
			if ( !foundID )
			{			
				// If we didn't find the Internal ID in MemoryTable,
				// Add it along with the type
				MemoryTable1[ index ] = new Array();
				MemoryTable1[ index ][0] = internalid;
				MemoryTable1[ index ][1] = type;
				//MemoryTable1[ index ][2] = item;
			}
			
			foundID = false;
			for ( var a = 0; a < itemsArray.length; a++ )
			{
				if ( itemsArray[a] == item )
				{	
					// If we found the item in the itemsArray list,
					// We don't need to add it again
					// This is for the item search
					foundID = true;
					break
				}
			}
			
			if ( !foundID )
			{
				// If we didn't find the item, add it
				itemsArray[ itemsArray.length ] = item;
			}
			
		}
	}
	
	if ( MemoryTable1.length <= 0 || itemsArray.length <= 0 )
	{
		// If there are no Transactions or Items, exit script
		return;
	}
	
	// **************************************************************************************************************
	// EXECUTE ITEM SAVED SEARCH
	// **************************************************************************************************************
	
	var ItemList = new Array();
	var filters = new Array();
	filters[0] = new nlobjSearchFilter( 'internalid', null, 'anyof', itemsArray );
					
	try {
		var item_search = nlapiSearchRecord( 'item', 'customsearch_item_classification', filters, null ); 
	}catch(err){
		nlapiLogExecution( 'error', 'Item Search Execution Error', 'Error executing item search (customsearch_item_classification). ' + err.getDetails() );
		// Exit Script
		return;
	}	
	
	
	if ( item_search != null ) 
	{ 
		for ( var i = 0; i < item_search.length; i++ )
		{
			var id = item_search[i].getId();
			var department = checkIfNull( item_search[i].getValue( 'department' ) );
			var classId = checkIfNull( item_search[i].getValue( 'class' ) );
            var manufacturer = checkIfNull( item_search[i].getValue( 'custitemitemmanufacturer' ) );
			// Load the Item Class List
			ItemList[ ItemList.length ] = new Item( id, department, classId, manufacturer );
		}
		
	}
	
	if ( ItemList.length <= 0 )
	{
		// If no items department or class were returned, exit script
		return;
	}
	
	// **********************************************************************************************************************
	// Start the MemoryTable loop
	// Begin Loop
	// **********************************************************************************************************************
	
	for ( y = 0; y < MemoryTable1.length; y++ )
	{
		// **************************************************************************************************************
		// CHECK UNITS
		// **************************************************************************************************************
		
		// Check and see if there are enough units for another transaction update
		try {
			if ( nlapiGetContext().getRemainingUsage() < 30 )
				return;

		}catch(err){
			nlapiLogExecution( 'error', 'Units Error', 'Error checking usage units. ' + err.description );
			// Exit Script
			return;
		}
		
		// **************************************************************************************************************
		// UPDATE TRANSACTION
		// **************************************************************************************************************
		
		var transactionId = MemoryTable1[ y ][0];
		var transactionType = MemoryTable1[ y ][1];
		
		// These are the type of records that come from the saved search
		// SalesOrd = salesorder
		// PurchOrd = purchaseorder
		// Opprtnty = opportunity
		// CustInvc = invoice
		// Estimate = estimate
		
		if ( transactionType == "SalesOrd" )
			transactionType = "salesorder";
		else if ( transactionType == "PurchOrd" )
			transactionType = "purchaseorder";
		else if ( transactionType == "Opprtnty" )
			transactionType = "opportunity";
		else if ( transactionType == "CustInvc" )
			transactionType = "invoice";
		else if ( transactionType == "Estimate" )
			transactionType = "estimate";
		else
			continue;

		// Load transaction record
		try {
			var tran_rs = nlapiLoadRecord( transactionType, transactionId );
		}catch(err){
			nlapiLogExecution( 'error', 'Transaction Error', 'Error updating transaction Internal ID ' + transactionId + ".  " + err.description );
			tran_rs = null;
		}
		
		if ( tran_rs != null )
		{
			// Traverse the line items 
			for ( var b = 1; b <= tran_rs.getLineItemCount('item'); b++ )
			{
				var item = checkIfNull( tran_rs.getLineItemValue( 'item', 'item', b ) );
				var custcol = checkIfNull( tran_rs.getLineItemValue( 'item', 'custcol_classification_update_3', b ) );
				
				// If custcol_classification_update_3 equals True, we already checked this line
				// Continue to the next line
				if ( custcol == 'T' )
					continue;
				
				// Check the line item with the returned items from the search to get Department and class
				for ( var w = 0; w < ItemList.length; w++ )
				{
					if ( item == ItemList[w].internalid )
					{
						// We found the Item, now set the Department and Class if they are available
						// If they are not available, don't set it to blank
						if ( ItemList[w].departmentid != '' )
						{
							tran_rs.setLineItemValue( 'item', 'department', b, ItemList[w].departmentid );
						}
						
						if ( ItemList[w].classid != '' )
						{
							tran_rs.setLineItemValue( 'item', 'class', b, ItemList[w].classid );
						}
						// Set this field to True
						// We already checked this line
						tran_rs.setLineItemValue( 'item', 'custcol_classification_update_3', b, 'T' );
                        
                        if (ItemList[w].manufacturer != '')
                        {
                            tran_rs.setLineItemValue( 'item', 'custcol_item_manufacturer', b, ItemList[w].manufacturer);                         
                        }
						
						break;
					}
					
					
				}
			}
			
			try {
				nlapiSubmitRecord( tran_rs, false, true );
			}catch(err){
				nlapiLogExecution( 'error', 'Transaction Error', 'Error updating transaction Internal ID ' + transactionId + ".  " + err.description );
			}
			
		}
		
	}
	
	return;
}

function checkIfNull( valuex )
{
	if ( valuex == null || valuex == "undefined" )
	{
		return '';
	}
	return valuex;
}

// END
