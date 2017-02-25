function TransactionFormUsedmassUpdate(rec_type, rec_id) {
 var rec = nlapiLoadRecord(rec_type, rec_id);
 var cf = rec.getFieldText('customform');
 nlapiSubmitField(rec_type, rec_id, 'custbody37', cf); 
}
