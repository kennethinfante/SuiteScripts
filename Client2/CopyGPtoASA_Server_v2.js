/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
* @ FILENAME      : CopyGPtoASA.js 
* @Business Logic : Copy Standard Gross Profit module GP$ to ASA
*
* 
* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *

var DEBUG = true;

function validateLine(type)
{
	try {
		if (type == 'item')
		{
			if (DEBUG) alert("ValidateLine");
			var costestimate = parseFloat(nlapiGetCurrentLineItemValue('item', 'costestimate'));
			if (DEBUG) alert("costestimate: " + costestimate);
				
			if ((costestimate == '') || (isNaN(costestimate)))
			{
				if (DEBUG) alert("Cost Estimate blank or NaN");
				costestimate = 0;
			}

			var amount = parseFloat(nlapiGetCurrentLineItemValue('item', 'amount'));
			if (DEBUG) alert("amount: " + amount);

			if ((amount == '') || (isNaN(amount)))
			{
				if (DEBUG) alert("Amount blank or NaN");
				amount = 0;
			}

			var gp = parseFloat(amount - costestimate);

			nlapiSetCurrentLineItemValue('item', 'altsalesamt', gp);
		}
	}
	catch (e)
	{
		alert(e);
	}
	return true;
}


function fieldChanged(type, name)
{
	try {
		if (type == 'item'  && name == 'costestimate')
		{
			if (DEBUG) alert("FieldChanged");
			var costestimate = parseFloat(nlapiGetCurrentLineItemValue('item', 'costestimate'));
			if (DEBUG) alert("costestimate: " + costestimate);
			if ((costestimate == '') || (isNaN(costestimate)))
			{
				if (DEBUG) alert("Cost Estimate blank or NaN");
				costestimate = 0;
			}

			var amount = parseFloat(nlapiGetCurrentLineItemValue('item', 'amount'));
			if (DEBUG) alert("Amount: " + amount);

			if ((amount == '') || (isNaN(amount)))
			{
				if (DEBUG) alert("Amount blank or NaN");
				amount = 0;
			}

			var gp = parseFloat(amount - costestimate);

			nlapiSetCurrentLineItemValue('item', 'altsalesamt', gp);
		}
	}
	catch (e)
	{
		alert(e);
	}
	return true;
}

function saveOrder(type)
{
	if (DEBUG) nlapiLogExecution('debug','Start', 1);

	try {
		if (DEBUG) nlapiLogExecution('debug','Started type:', type);

  		if ((type == 'create') ||  (type == 'edit'))
		{
			
			intRecordId = nlapiGetRecordId();
			if (DEBUG) nlapiLogExecution('debug','intRecordId', intRecordId);

        		recPORecord = nlapiLoadRecord('purchaseorder', intRecordId);
			if (DEBUG) nlapiLogExecution('debug','recPORecord', recPORecord);

			var intIDcreatedFrom = recPORecord.getFieldValue("createdfrom");
			if (DEBUG) nlapiLogExecution('debug','CreatedFrom', intIDcreatedFrom);

			if ((intIDcreatedFrom != 0) && (intIDcreatedFrom != null))
			{
				Record = nlapiLoadRecord('salesorder', intIDcreatedFrom);
				if (DEBUG) nlapiLogExecution('debug','Record', Record);
				

				var LineCount = Record.getLineItemCount("item");
				if (DEBUG) nlapiLogExecution('debug','Line Count', LineCount);

				for (var i = 1; i<=LineCount; i++)
				{
					if (DEBUG) nlapiLogExecution('debug','In Loop', i);
					var costestimate = parseFloat(Record.getLineItemValue("item","costestimate",i));
					if (DEBUG) nlapiLogExecution('debug','costestimate', costestimate);

					if ((costestimate == '') || (isNaN(costestimate)))
					{
						costestimate = 0;
						if (DEBUG) nlapiLogExecution('debug','costestimate NaN', costestimate);
					}

					var amount = parseFloat(Record.getLineItemValue("item","amount",i));
					if (DEBUG) nlapiLogExecution('debug','amount', amount);
	
					if ((amount == '') || (isNaN(amount)))
					{
						amount = 0;
						if (DEBUG) nlapiLogExecution('debug','amount NaN', amount);
					}

					var custcol_alt_sales_deduction = parseFloat(Record.getLineItemValue("item","custcol_alt_sales_deduction",i));
										
					if ((custcol_alt_sales_deduction == '') || (isNaN(custcol_alt_sales_deduction)))
					{
						custcol_alt_sales_deduction = 0;
					}
					
					var grossprofit = parseFloat(amount) - parseFloat(costestimate) - parseFloat(custcol_alt_sales_deduction);
					//var grossprofit = parseFloat(amount) - parseFloat(costestimate);
					// var gp = parseFloat(1.01);
					if (DEBUG) nlapiLogExecution('debug','gp', grossprofit);
					if (DEBUG) nlapiLogExecution('debug','At line', i);
	
					Record.setLineItemValue("item","altsalesamt",i,grossprofit);
					if (DEBUG) nlapiLogExecution('debug','Set GP Line', i);
				}
		
				nlapiSubmitRecord(Record, true);
			}
		}
	} catch (e) {
		if (DEBUG) nlapiLogExecution('debug','Exception', e);
	}
	if (DEBUG) nlapiLogExecution('debug','End', 1);
	return true;

}