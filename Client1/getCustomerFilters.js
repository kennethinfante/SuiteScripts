var manageFilters = new (function(){

function tty(msg){ if(window && window.console && window.console.log) window.console.log(msg);}

function nsDateValToTS(dateVal){
	return dateVal ? nlapiStringToDate(dateVal).getTime() : null;
}

function getFiltersPurchased(customerId){

	var filters = nlapiSearchRecord('transaction', null, [
	new nlobjSearchFilter('entity', null, 'is', customerId),
	new nlobjSearchFilter('type', null, 'anyof', ['SalesOrd', 'CustInvc', 'CashSale','CustCred', 'CashRfnd']),
	new nlobjSearchFilter('status', null, 'anyof', //filter by status so no double count of invoice or cash sale created from a sales order
		[
		'CashSale:C', //Cash Sale : Deposited
		'CashSale:B', //Cash Sale : Not Deposited
		'CustInvc:A', //Invoice : Open
		'CustInvc:B', //Invoice : Paid In Full
		'SalesOrd:D', //Sales Order : Partially Fulfilled
		'SalesOrd:F', //Sales Order : Pending Billing
		'SalesOrd:E', //Sales Order : Pending Billing/Partially Fulfilled
		'SalesOrd:B', //Sales Order : Pending Fulfillment
		'CashRfnd:Y', //Cash Refund : : Undefined
		'CustCred:B', // Credit Memo : Fully Applied],
		'CustCred:A', //Credit Memo : Open],
		'CustCred:Y' //Credit Memo : Undefined],
	]),
	new nlobjSearchFilter('mainline', null, 'is', 'F'),
	new nlobjSearchFilter('custitem_water_filter_products', 'item', 'is', 'T')
	],[
	new nlobjSearchColumn('storedisplayname', 'item', 'group'),
	new nlobjSearchColumn('internalid', 'item', 'group'),
	new nlobjSearchColumn('formulanumeric', null, 'sum').setFormula("case when {recordtype}= 'salesorder' or {recordtype} = 'cashsale' or {recordtype} = 'invoice' then  {quantity} else -1 * {quantity} end"),
	new nlobjSearchColumn('formuladate', null, 'max').setFormula("case when {recordtype}= 'salesorder' or {recordtype} = 'cashsale' or {recordtype} = 'invoice' then  {trandate} end")
	]);

	if(! filters) return null;
	return filters.filter(function(f){ return 0< f.getValue('formulanumeric', null, 'sum');}).map(function(f){
		return {
			id:f.getValue('internalid', 'item', 'group') ,
			name:f.getValue('storedisplayname', 'item', 'group'),
			qty:f.getValue('formulanumeric', null, 'sum'),
			lastPurchaseTS:nsDateValToTS(f.getValue('formuladate', null, 'max'))
		};
	});

}

function getWarrantyMachineFilters(customerId){
	var equip = nlapiSearchRecord('customrecord_warranty_items', null,
	[
		new nlobjSearchFilter('custrecord_customer', null, 'is', customerId),
		new nlobjSearchFilter('custrecord_item', null, 'noneof', ['@NONE@']),
		new nlobjSearchFilter('type', 'custrecord_item', 'is', 'InvtPart')
	],[
		new nlobjSearchColumn('custrecord_item'),
		new nlobjSearchColumn('itemid', 'custrecord_item'),
		new nlobjSearchColumn('displayname', 'custrecord_item'),
		new nlobjSearchColumn('storedisplayname', 'custrecord_item'),
		new nlobjSearchColumn('custrecord_warranty_end_date')
	]);

	if(!equip) return null;

	var knownGoodFilters = [];

	equip.forEach(function(mch){
		var machineName = mch.getValue('storedisplayname', 'custrecord_item') || mch.getValue('displayname', 'custrecord_item') || mch.getValue('itemid', 'custrecord_item').replace(/^.*:\s*/, '');
		var warrantyEnd = nsDateValToTS(mch.getValue('custrecord_warranty_end_date'));
		var x = nlapiLoadRecord('inventoryitem', mch.getValue('custrecord_item'));
		var relIds = [];
		for(var i = 1; i<= x.getLineItemCount('presentationitem'); i++){
			if('INVTITEM' == x.getLineItemValue('presentationitem', 'itemtype', i)) relIds.push(x.getLineItemValue('presentationitem', 'item', i));
		}

		var relItems = nlapiSearchRecord('item', null,
		[
		new nlobjSearchFilter('internalid', null, 'anyof', relIds),
		new nlobjSearchFilter('custitem_water_filter_products', null, 'is', 'T')
		],[
		new nlobjSearchColumn('itemid'),
		new nlobjSearchColumn('storedisplayname')
		]);

		relItems.forEach(function(it){
			knownGoodFilters.push({
				id:it.getId(),
				name: it.getValue('storedisplayname') || it.getValue('itemid').replace(/^.*:\s*/, ''),
				machine:machineName,
				warrantyEndsTS: warrantyEnd
			});
		});
	});
	return knownGoodFilters;
}

function getValidFilters(custId){
	var validFilters = [];
	var purchased = getFiltersPurchased(custId);
	var forEquip = null; // do not consider warranty equipment getWarrantyMachineFilters(custId);
	if(purchased){
		validFilters = purchased;
		if(forEquip){
			var purchaseCount = validFilters.length;
			forEquip.forEach(function(f){
				for(var i = 0; i< purchaseCount; i++){
					if(validFilters[i].id == f.id){
						validFilters[i].machine = f.machine;
						validFilters[i].warrantyEndsTS = f.warrantyEndsTS;
						return;
					}
				}
				validFilters.push(f);
			});
		}
	}
	else if(forEquip) validFilters = forEquip;

	if(!validFilters.length) return null;
	validFilters.sort(function(a,b){
		var aTS = a.lastPurchaseTS || a.warrantyEndsTS || 0;
		var bTS = b.lastPurchaseTS || b.warrantyEndsTS || 0;
		return bTS - aTS;
	});
	return validFilters;
}
this.getValidFilters = getValidFilters;

this.listValidFilters = function (request, response){
	KOTNUtil.sendJSResponse(request, response, (function(){
		var custId = request.getParameter('custid');
		if(!custId) return {success:false};

		var validFilters = getValidFilters(custId);

		if(validFilters && validFilters.length) return {success:true, filters:validFilters};
		return {success:false};

	})());
};

var customerFilters = [];
var inItemPostSource = false;

this.postSourcing = function(type, name){ // client script
	if(type == 'item' && name == 'item'){
		if(inItemPostSource) return;
		try{
			inItemPostSource = true;
			var itemId = nlapiGetCurrentLineItemValue('item', 'item');
			var custId = nlapiGetFieldValue('entity');
			tty("got item id: "+ itemId);
			if(itemId){
				var isFilter = 'T' == nlapiLookupField('item', itemId, 'custitem_water_filter_products');
				if(isFilter && custId){
					var validFilters = customerFilters[custId] || getValidFilters(custId);
					if(validFilters){
						customerFilters[custId] = validFilters;
						if(validFilters[0].id != itemId){
							var chooseOffer = confirm('The last water filter purchased by this customer was: '+ validFilters[0].name +'.\n\nWould you like to change this order to that filter?');
							if(chooseOffer){
								nlapiSetCurrentLineItemValue('item', 'item', validFilters[0].id, true, true);
							}
						}
					}
				}
			}
		}catch(e){
			tty(e.message || e.toString());
		}finally{
			inItemPostSource = false;
		}
	}
};

})();
