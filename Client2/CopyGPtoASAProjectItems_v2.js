/*
Type: User Event
Name: Copy GP to ASA (Project Items)
Summary: When a sales order is created or edited, script will recalculate ASA to handle project items.
*/


function CopyGPtoASAProjectItems()
{
	if ( ( type == 'create' ) ||  ( type == 'edit') )
	{
		// GET SALES ORDER INTERNAL ID
		var internalId = nlapiGetRecordId();
		
		// LOAD SALES ORDER
		try {
			rs = nlapiLoadRecord( nlapiGetRecordType(), internalId );
		}catch( err ){
			nlapiLogExecution( 'error', 'Sales Order Error', "Error loading Sales Order Internal ID " + internalId + ".  " + err.getDetails() );
			// Exit script
			return;
		}
		
		// UPDATE SALES ORDER LINE ITEMS
		// Get the line item count
		var LineCount = rs.getLineItemCount( 'item' );
		
		for ( var i = 1; i <= LineCount; i++ )
		{
			// If the altsalesamt field is not blank, then continue to next line
			var altsalesamt = parseFloat( rs.getLineItemValue( "item", "altsalesamt" ,i ) );
			if ( parseFloat( altsalesamt ) )
				continue;
			var costestimate = parseFloat( rs.getLineItemValue( "item", "costestimate" ,i ) );
			
			if ( ( costestimate == '' ) || ( isNaN( costestimate ) ) )
				costestimate = 0;

			var amount = parseFloat( rs.getLineItemValue( "item", "amount", i ) );
			
			if ( ( amount == '' ) || ( isNaN( amount ) ) )
				amount = 0;
			
			var custcol_alt_sales_deduction  = parseFloat( rs.getLineItemValue( "item", "custcol_alt_sales_deduction", i ) );
			
			if ( ( custcol_alt_sales_deduction  == '' ) || ( isNaN( custcol_alt_sales_deduction  ) ) )
				custcol_alt_sales_deduction  = 0;

			var grossprofit = parseFloat( amount ) - parseFloat( costestimate ) - parseFloat( custcol_alt_sales_deduction );
			//var grossprofit = parseFloat( amount ) - parseFloat( costestimate );
		
			rs.setLineItemValue( "item", "altsalesamt", i, grossprofit );
			
		}
		
		// Update the sales order
		// doSourcing = False
		// ignoremandatoryfields = True
		try {
			nlapiSubmitRecord( rs, false, true );
		}catch( err ){
			nlapiLogExecution( 'error', 'Sales Order Error', "Error updating ASA for Sales Order Internal ID " + internalId + ".  " + err.getDetails() );
			// Exit script
			return;
		}
	
	}
	
	return;

}


// END
