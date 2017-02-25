function EntityFormbeforeSubmit(type, form) {
   var cf =  nlapiGetFieldText('customform');
   nlapiSetFieldValue('custentity7', cf); 
}
