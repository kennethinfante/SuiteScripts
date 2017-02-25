function EntityFormUsedmassUpdate(rec_type, rec_id) {
 var rec = nlapiLoadRecord(rec_type, rec_id);
 var cf = rec.getFieldText('customform');
 nlapiSubmitField(rec_type, rec_id, 'custentity7', cf); 
}
