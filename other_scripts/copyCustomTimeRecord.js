function copyCustomTimeRecord(){

	// TODO: refactor

	var customTimeRecId = nlapiGetRecordId();
	var emp = nlapiGetFieldValue('custrecord_time_track_emp_name');
	var date = nlapiGetFieldValue('custrecord_time_track_date');
	var duration = nlapiGetFieldValue('custrecord_time_track_duration');
	var item = nlapiGetFieldValue('custrecord_time_track_item');
	var dep = nlapiGetFieldValue('custrecord_time_track_department');
	nlapiLogExecution('debug','Record details', customTimeRecId + " " + emp + " " + date + " " + duration + " " + item + " " + dep); // 36425 8/8/2016 2 1 1

	try {
		var timeRec = nlapiCreateRecord('timebill');

		// set values
		timeRec.setFieldValue('employee', emp);
		timeRec.setFieldValue('trandate', date);
		timeRec.setFieldValue('hours', duration);

		var itemList = {
			1: 18144,
			2: 18145,
			3: 18146,
			4: 18147,
			5: 18149,
			6: 18150,
			7: 18151
		};

		timeRec.setFieldValue('item', itemList[parseInt(item)]);
		timeRec.setFieldValue('department', dep);
		timeRec.setFieldValue('custcol_related_custom_time_record', customTimeRecId);
		

		var timeRecId = nlapiSubmitRecord(timeRec, true); 

		if(timeRecId) nlapiLogExecution('debug','Record successfully saved', timeRecId);
		
	} catch(e) {
		nlapiLogExecution('debug','Error', errText(e));
	}


}

function errText(e)
{
    var txt='';
    if (e instanceof nlobjError) {
        //this is netsuite specific error
        txt = 'NLAPI Error: Record ID :: '+' :: '+e.getCode()+' :: '+e.getDetails() + ' :: ' + e.getStackTrace().join(', ');
    } else {
        //this is generic javascript error
        txt = 'JavaScript/Other Error: Record ID :: '+' :: '+e.toString()+' : '+e.stack;
    }
    return txt;
}

