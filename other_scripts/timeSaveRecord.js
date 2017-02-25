function timeSaveRecord(){

// TODO: refactor
var emp = nlapiGetFieldValue('custrecord_time_track_emp_name');
var date = nlapiGetFieldValue('custrecord_time_track_date');
var duration = nlapiGetFieldValue('custrecord_time_track_duration');
var item = nlapiGetFieldValue('custrecord_time_track_item');
var dep = nlapiGetFieldValue('custrecord_time_track_department');
// alert(emp + " " + date + " " + duration + " " + item + " " + dep); // 36425 8/8/2016 2 1 1

	try {
	var customerRec = nlapiCreateRecord('time');

	// set values
	customerRec.setFieldValue('employee', emp);
	customerRec.setFieldValue('trandate', date);
	customerRec.setFieldValue('hours', duration);
	customerRec.setFieldValue('item', item + 18143);
	customerRec.setFieldValue('department', dep);
		
	} catch(e) {
		alert(errText(e));
	}

// var customerId = nlapiSubmitRecord(customerRec, true); 

// if(customerId) alert("Record successfully saved");

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

