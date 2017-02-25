function createJournalFromCM() {

	// get the value for reason
	var reason = nlapiGetFieldValue('custbody_cm_reason');
	nlapiLogExecution('debug', 'cm reason', reason);

	// get the date
	var date = nlapiGetFieldValue('trandate');
	nlapiLogExecution('debug', 'cm date', date);

	// get the customer
	var customer = nlapiGetFieldValue('entity');
	nlapiLogExecution('debug', 'cm customer', customer);

	// get the memo
	var memo = nlapiGetFieldValue('memo');
	nlapiLogExecution('debug', 'cm memo', memo);

	// get the amount
	var arAmount;
	var salesAmount;
	var taxAmount;

	// create JE 
	var recJournal = nlapiCreateRecord('journalentry');
	nlapiLogExecution('debug', 'create journal entry', 'creating');

	// fill the journal based on the value of the reason
	if(reason == 1) { // return
		// set value of journal for return
		// select first line
		recJournal.selectNewLineItem('line');
		recJournal.setCurrentLineItemValue('line','account', 4052); 
		recJournal.setCurrentLineItemValue('line', 'debit', nAmount);
		recJournal.setCurrentLineItemValue('line', 'memo', sMemo);
		recJournal.setCurrentLineItemValue('line', 'entity', customer);
		recJournal.commitLineItem('line');

		// select second line
		recJournal.selectNewLineItem('line');
		recJournal.setCurrentLineItemValue('line','account', 351); 
		recJournal.setCurrentLineItemValue('line', 'credit', nAmount);
		recJournal.setCurrentLineItemValue('line', 'memo', sMemo);
		recJournal.setCurrentLineItemValue('line', 'entity', customer);
		recJournal.commitLineItem('line');

		// reverse the GL Impact of CM
		// select first line
		recJournal.selectNewLineItem('line');
		recJournal.setCurrentLineItemValue('line','account', 351); 
		recJournal.setCurrentLineItemValue('line', 'debit', nAmount);
		recJournal.setCurrentLineItemValue('line', 'memo', sMemo);
		recJournal.setCurrentLineItemValue('line', 'entity', customer);
		recJournal.commitLineItem('line');

		// select second line
		recJournal.selectNewLineItem('line');
		recJournal.setCurrentLineItemValue('line','account', 351); 
		recJournal.setCurrentLineItemValue('line', 'credit', nAmount);
		recJournal.setCurrentLineItemValue('line', 'memo', sMemo);
		recJournal.setCurrentLineItemValue('line', 'entity', customer);
		recJournal.commitLineItem('line');

	}
	// else if (reason == 2) { // rotation
	// 	// set value of journal for rotation

	// 	// select first line
	// 	recJournal.selectNewLineItem('line');
	// 	recJournal.setCurrentLineItemValue('line','account', 351); 
	// 	recJournal.setCurrentLineItemValue('line', 'credit', nAmount);
	// 	recJournal.setCurrentLineItemValue('line', 'memo', sMemo);
	// 	recJournal.setCurrentLineItemValue('line', 'entity', idCustomer);
	// 	recJournal.setCurrentLineItemValue('line', 'class', idClass);
	// 	recJournal.commitLineItem('line');

	// 	//select second line
	// 	recJournal.selectNewLineItem('line');
	// 	recJournal.setCurrentLineItemValue('line','account', 351); 
	// 	recJournal.setCurrentLineItemValue('line', 'credit', nAmount);
	// 	recJournal.setCurrentLineItemValue('line', 'memo', sMemo);
	// 	recJournal.setCurrentLineItemValue('line', 'entity', idCustomer);
	// 	recJournal.setCurrentLineItemValue('line', 'class', idClass);
	// 	recJournal.commitLineItem('line');
	// }

	// submit the journal
	var idJournal = nlapiSubmitRecord(recJournal, true, true);
	nlapiSubmitField(nlapiGetRecordType(), nlapiGetRecordId(), 'custbody_cm_related_journal', idJournal);

}