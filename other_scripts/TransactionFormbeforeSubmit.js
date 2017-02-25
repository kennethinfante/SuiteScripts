function TransactionFormbeforeSubmit(type, form) {
   var cf =  nlapiGetFieldText('customform');
   nlapiSetFieldValue('custbody37', cf); 
}
