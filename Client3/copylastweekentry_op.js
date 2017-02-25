/*
 * Author: Katrina Castro
 * Date: Aug 8, 2015
 */

/* ---- GLOBAL VARIABLES ---- */
var log = new Logger(false); //Always include a Logger object. Set parameter to true on Client Side script implementations.
var context = nlapiGetContext(); //Always include an nlobjContext object.

/* ---- ERROR HANDLING CONSTANTS ---- */
var SCRIPT_NAME = 'ONN Make Deposit CS';
var FROM_EMAIL = -5; //Default Administrator
var TO_EMAIL = 'kat@ceecl.net';
var CC_EMAILS = null;
var CLIENT_NAME = 'ONN';
var SCRIPT_FILE_NAME = 'makedeposit_cs.js';

function onclick_callButton()
{
var employee=nlapiGetFieldValue('employee');
if(StringUtils.isEmpty(employee))
	{
		alert('Please Enter Employee.');
	}
else
	{
	 var filters = new Array();
     filters[0] = new nlobjSearchFilter( 'employee', null, 'is',employee); //Hard coding item internalID 8
     filters[1] = new nlobjSearchFilter( 'date', null, 'within','lastweek');
   //  filters[2] = new nlobjSearchFilter( 'custrecord_timesheet_task', null, 'is',item);
  var columns=new Array();
  columns[0] = new nlobjSearchColumn('date');
  columns[1] = new nlobjSearchColumn('customer');
  columns[2] = new nlobjSearchColumn('internalid','activity');
  columns[3] = new nlobjSearchColumn('internalid','item');
  columns[4] = new nlobjSearchColumn('durationdecimal');
 var searchResults= nlapiSearchRecord( 'timebill', null, filters,columns);
 //alert('searchResults.lenght'+searchResults.length);
 var timelist=new Array();
 for(var i=0;i<searchResults.length;i++){

 var searchresult = searchResults[i];
 var currentdate=searchresult.getValue('date');
//alert('currentdate'+currentdate);
 var weekdays = new Array(7);
weekdays[0] = "Sunday";
weekdays[1] = "Monday";
weekdays[2] = "Tuesday";
weekdays[3] = "Wednesday";
weekdays[4] = "Thursday";
weekdays[5] = "Friday";
weekdays[6] = "Saturday";

var current_date = nlapiStringToDate(currentdate);

weekday_value = current_date.getDay();

var dayname=weekdays[weekday_value];
//alert('dayname '+dayname);
//var timelist=new Array();
var account=searchresult.getValue('customer');
//var accountname=nlapiGetLineItemText('timeitem','customer',i);
var item=searchresult.getValue('internalid','item');
var project=searchresult.getValue('internalid','activity');
//var isutilized=nlapiGetLineItemValue('timeitem','isutilized',i);
var duration=searchresult.getValue('durationdecimal');
var hour0 =0;
var hour1 =0;
var hour2 =0;
var hour3 =0;
var hour4 =0;
var hour5 =0;
var hour6 =0;
if(dayname=='Sunday'){hour0=duration;}
if(dayname=='Monday'){hour1=duration;}
if(dayname=='Tuesday'){hour2=duration;}
if(dayname=='Wednesday'){ hour3=duration;}
if(dayname=='Thursday'){ hour4=duration;}
if(dayname=='Friday'){ hour5=duration;}
if(dayname=='Saturday'){ hour6=duration;}
/*alert('hour0'+hour0);
alert('hour1'+hour1);
alert('hour2'+hour2);
alert('hour3'+hour3);
alert('hour4'+hour4);
alert('hour5'+hour5);
alert('hour6'+hour6);*/
/*var hour0=nlapiGetLineItemValue('timeitem','hours0',i);
var hour1=nlapiGetLineItemValue('timeitem','hours1',i);
var hour2=nlapiGetLineItemValue('timeitem','hours2',i);
var hour3=nlapiGetLineItemValue('timeitem','hours3',i);
var hour4=nlapiGetLineItemValue('timeitem','hours4',i);
var hour5=nlapiGetLineItemValue('timeitem','hours5',i);
var hour6=nlapiGetLineItemValue('timeitem','hours6',i);
var hour7=nlapiGetLineItemValue('timeitem','hours7',i);
*/
timelist.push({
	   id:i,
       a: account,
       p: item,
       it: project,
       h0: hour0,
       h1: hour1,
       h2: hour2,
       h3: hour3,
       h4: hour4,
       h5: hour5,
       h6: hour6
   });

 }

 var uniqueitemIDs = _.uniq(_.pluck(timelist, 'id'));
 _.each(uniqueitemIDs, function (itemid){ try{
 	 var itemLines = _.where(timelist, {'id': itemid});
      var item = _.first(itemLines);
   var timeitemlist=nlapiGetLineItemCount('timeitem');
   var inserted='F';
   if(timeitemlist>0)
	   {
	   for(var j=1;j<=timeitemlist;j++)
		   {
		   	var taccount=nlapiGetLineItemValue('timeitem','customer',j);
			var titem=nlapiGetLineItemValue('timeitem','item',j);
			var tproject=nlapiGetLineItemValue('timeitem','casetaskevent',j);
			if(StringUtils.isNotEmpty(taccount)&&StringUtils.isNotEmpty(titem)&&StringUtils.isNotEmpty(tproject)){
			if(taccount==item.a && titem==item.p && tproject==item.it)
				{
				nlapiSelectLineItem('timeitem', j);
				if(item.h0!=0)
				{
				nlapiSetCurrentLineItemValue('timeitem','hours0',item.h0);
				}
				if(item.h1!=0)
				{
				nlapiSetCurrentLineItemValue('timeitem','hours1',item.h1);
				}
				if(item.h2!=0)
				{
				nlapiSetCurrentLineItemValue('timeitem','hours2',item.h2);
				}
				if(item.h3!=0)
				{
				nlapiSetCurrentLineItemValue('timeitem','hours3',item.h3);
				}
				if(item.h4!=0)
				{
				nlapiSetCurrentLineItemValue('timeitem','hours4',item.h4);
				}
				if(item.h5!=0)
				{
				nlapiSetCurrentLineItemValue('timeitem','hours5',item.h5);
				}
				if(item.h6!=0)
				{
				nlapiSetCurrentLineItemValue('timeitem','hours6',item.h6);
				}
				nlapiCommitLineItem('timeitem');
				//alert('commited!');
				//break;
				inserted='T';
			//	alert('INSERTED!');
				}

			//break;
			}

			//nlapiCommitLineItem('timeitem');
		   }
	   if(inserted=='F'){
			// alert('ELSE!');
			   nlapiSelectNewLineItem('timeitem');
			   nlapiSetCurrentLineItemValue('timeitem','customer',item.a);
			   nlapiSetCurrentLineItemValue('timeitem','casetaskevent',item.it);
			   nlapiSetCurrentLineItemValue('timeitem','item',item.p);
			   if(item.h0!=0)
				{
				  // alert(item.h0);
				nlapiSetCurrentLineItemValue('timeitem','hours0',item.h0);
				}
				if(item.h1!=0)
				{
					//alert(item.h1);
				nlapiSetCurrentLineItemValue('timeitem','hours1',item.h1);
				}
				if(item.h2!=0)
				{
					//alert(item.h2);
				nlapiSetCurrentLineItemValue('timeitem','hours2',item.h2);
				}
				if(item.h3!=0)
				{
					//alert(item.h3);
				nlapiSetCurrentLineItemValue('timeitem','hours3',item.h3);
				}
				if(item.h4!=0)
				{
					//alert(item.h4);
				nlapiSetCurrentLineItemValue('timeitem','hours4',item.h4);
				}
				if(item.h5!=0)
				{
					//alert(item.h5);
				nlapiSetCurrentLineItemValue('timeitem','hours5',item.h5);
				}
				if(item.h6!=0)
				{
					//alert(item.h6);
				nlapiSetCurrentLineItemValue('timeitem','hours6',item.h6);
				}
			    nlapiCommitLineItem('timeitem');
			    //break;
			   }
	   }
   else{
	   //alert('outside else')
   nlapiSelectNewLineItem('timeitem');
   nlapiSetCurrentLineItemValue('timeitem','customer',item.a);
   nlapiSetCurrentLineItemValue('timeitem','casetaskevent',item.it);
   nlapiSetCurrentLineItemValue('timeitem','item',item.p);

   if(item.h0!=0)
	{
	nlapiSetCurrentLineItemValue('timeitem','hours0',item.h0);
	}
	if(item.h1!=0)
	{
	nlapiSetCurrentLineItemValue('timeitem','hours1',item.h1);
	}
	if(item.h2!=0)
	{
	nlapiSetCurrentLineItemValue('timeitem','hours2',item.h2);
	}
	if(item.h3!=0)
	{
	nlapiSetCurrentLineItemValue('timeitem','hours3',item.h3);
	}
	if(item.h4!=0)
	{
	nlapiSetCurrentLineItemValue('timeitem','hours4',item.h4);
	}
	if(item.h5!=0)
	{
	nlapiSetCurrentLineItemValue('timeitem','hours5',item.h5);
	}
	if(item.h6!=0)
	{
	nlapiSetCurrentLineItemValue('timeitem','hours6',item.h6);
	}
    nlapiCommitLineItem('timeitem');
   }

 }catch(e){ var errorMessage = 'Error on item '+ itemid;
 logEmailError('main - ' + errorMessage, e);}
 });
	}
	/*var timelist=new Array();
	var itemcount=nlapiGetLineItemCount('timeitem');
	for(var i=1;i<=timecount;i++){
		var account=nlapiGetLineItemValue('timeitem','customer',i);
		var accountname=nlapiGetLineItemText('timeitem','customer',i);
		var item=nlapiGetLineItemValue('timeitem','item',i);
		var project=nlapiGetLineItemValue('timeitem','casetaskevent',i);
		var isutilized=nlapiGetLineItemValue('timeitem','isutilized',i);
		var hour0=nlapiGetLineItemValue('timeitem','hours0',i);
		var hour1=nlapiGetLineItemValue('timeitem','hours1',i);
		var hour2=nlapiGetLineItemValue('timeitem','hours2',i);
		var hour3=nlapiGetLineItemValue('timeitem','hours3',i);
		var hour4=nlapiGetLineItemValue('timeitem','hours4',i);
		var hour5=nlapiGetLineItemValue('timeitem','hours5',i);
		var hour6=nlapiGetLineItemValue('timeitem','hours6',i);
		var hour7=nlapiGetLineItemValue('timeitem','hours7',i);

		timelist.push({
			id:i,
               a: account,
               p: item,
               it: project,
               iu:isutilized,
               h0: hour0,
               h1: hour1,
               h2: hour2,
               h3: hour3,
               h4: hour4,
               h5: hour5,
               h6: hour6,
               h7: hour7
           });


	}*/


}

function onclick_callButton2()
{
var employee=nlapiGetFieldValue('employee');
var trandate=nlapiStringToDate(nlapiGetFieldValue('trandate'));
var trandate2=nlapiGetFieldValue('trandate');
//alert('trandate: '+trandate);
var weekdate=nlapiDateToString(nlapiAddDays(trandate,6));

//alert('weekdate: '+weekdate);
//alert('trandate: '+trandate2);
if(StringUtils.isEmpty(employee))
	{
		alert('Please Enter Employee.');
	}
else if (StringUtils.isEmpty(trandate))
	{
		alert('Please Enter Date.');
	}
else
	{
	 var filters = new Array();
     filters[0] = new nlobjSearchFilter( 'employee', null, 'is',employee); //Hard coding item internalID 8
     filters[1] = new nlobjSearchFilter( 'date', null, 'within',[trandate2,weekdate]);
   //  filters[2] = new nlobjSearchFilter( 'custrecord_timesheet_task', null, 'is',item);
  var columns=new Array();
  columns[0] = new nlobjSearchColumn('date');
  columns[1] = new nlobjSearchColumn('customer');
  columns[2] = new nlobjSearchColumn('internalid','activity');
  columns[3] = new nlobjSearchColumn('internalid','item');
  columns[4] = new nlobjSearchColumn('durationdecimal');
 var searchResults= nlapiSearchRecord( 'timebill', null, filters,columns);
 //alert('searchResults.lenght'+searchResults.length);
 var timelist=new Array();
 for(var i=0;i<searchResults.length;i++){

 var searchresult = searchResults[i];
 var currentdate=searchresult.getValue('date');
//alert('currentdate'+currentdate);
 var weekdays = new Array(7);
weekdays[0] = "Sunday";
weekdays[1] = "Monday";
weekdays[2] = "Tuesday";
weekdays[3] = "Wednesday";
weekdays[4] = "Thursday";
weekdays[5] = "Friday";
weekdays[6] = "Saturday";

var current_date = nlapiStringToDate(currentdate);

weekday_value = current_date.getDay();

var dayname=weekdays[weekday_value];
//alert('dayname '+dayname);
//var timelist=new Array();
var account=searchresult.getValue('customer');
//var accountname=nlapiGetLineItemText('timeitem','customer',i);
var item=searchresult.getValue('internalid','item');
var project=searchresult.getValue('internalid','activity');
//var isutilized=nlapiGetLineItemValue('timeitem','isutilized',i);
var duration=searchresult.getValue('durationdecimal');
var hour0 =0;
var hour1 =0;
var hour2 =0;
var hour3 =0;
var hour4 =0;
var hour5 =0;
var hour6 =0;
if(dayname=='Sunday'){hour0=duration;}
if(dayname=='Monday'){hour1=duration;}
if(dayname=='Tuesday'){hour2=duration;}
if(dayname=='Wednesday'){ hour3=duration;}
if(dayname=='Thursday'){ hour4=duration;}
if(dayname=='Friday'){ hour5=duration;}
if(dayname=='Saturday'){ hour6=duration;}
/*alert('hour0'+hour0);
alert('hour1'+hour1);
alert('hour2'+hour2);
alert('hour3'+hour3);
alert('hour4'+hour4);
alert('hour5'+hour5);
alert('hour6'+hour6);*/
/*var hour0=nlapiGetLineItemValue('timeitem','hours0',i);
var hour1=nlapiGetLineItemValue('timeitem','hours1',i);
var hour2=nlapiGetLineItemValue('timeitem','hours2',i);
var hour3=nlapiGetLineItemValue('timeitem','hours3',i);
var hour4=nlapiGetLineItemValue('timeitem','hours4',i);
var hour5=nlapiGetLineItemValue('timeitem','hours5',i);
var hour6=nlapiGetLineItemValue('timeitem','hours6',i);
var hour7=nlapiGetLineItemValue('timeitem','hours7',i);
*/
timelist.push({
	   id:i,
       a: account,
       p: item,
       it: project,
       h0: hour0,
       h1: hour1,
       h2: hour2,
       h3: hour3,
       h4: hour4,
       h5: hour5,
       h6: hour6
   });

//alert('i'+i);
//alert('account'+ account);
//alert('item'+item);
//alert('project'+ project);
//alert(isutilized);
//alert('hour0'+hour0);
//alert('hour1'+hour1);
//alert('hour2'+hour2);
//alert('hour3'+hour3);
//alert('hour4'+hour4);
//alert('hour5'+hour5);
//alert('hour6'+hour6);

 }
//(JSON.stringify(timelist));
//nlapiSendEmail('-5', 'katpenguin627@gmail.com', 'json', JSON.stringify(timelist));
 var uniqueitemIDs = _.uniq(_.pluck(timelist, 'id'));
// alert(uniqueitemIDs.lenght);
 _.each(uniqueitemIDs, function (itemid){ try{
	// alert('WENT INSIDE!');
 	 var itemLines = _.where(timelist, {'id': itemid});
      var item = _.first(itemLines);
  // alert('NUMBER: '+itemid);
  // alert('itemh1: '+item.h1);
   var timeitemlist=nlapiGetLineItemCount('timeitem');
   var inserted='F';
  // alert('timeitemlist'+timeitemlist);
   if(timeitemlist>0)
	   {
	   for(var j=1;j<=timeitemlist;j++)
		   {
		   	var taccount=nlapiGetLineItemValue('timeitem','customer',j);
			var titem=nlapiGetLineItemValue('timeitem','item',j);
			var tproject=nlapiGetLineItemValue('timeitem','casetaskevent',j);
		//	alert('j: '+ j);
		//	alert('taccount: '+taccount+' item.a:' +item.a);
		//	alert('titem'+titem+' item.p:' +item.p);
		//	alert('tproject'+tproject+' item.it:' +item.it);
			if(StringUtils.isNotEmpty(taccount)&&StringUtils.isNotEmpty(titem)&&StringUtils.isNotEmpty(tproject)){
			if(taccount==item.a && titem==item.p && tproject==item.it)
				{
				nlapiSelectLineItem('timeitem', j);
				if(item.h0!=0)
				{
				nlapiSetCurrentLineItemValue('timeitem','hours0',item.h0);
				}
				if(item.h1!=0)
				{
				nlapiSetCurrentLineItemValue('timeitem','hours1',item.h1);
				}
				if(item.h2!=0)
				{
				nlapiSetCurrentLineItemValue('timeitem','hours2',item.h2);
				}
				if(item.h3!=0)
				{
				nlapiSetCurrentLineItemValue('timeitem','hours3',item.h3);
				}
				if(item.h4!=0)
				{
				nlapiSetCurrentLineItemValue('timeitem','hours4',item.h4);
				}
				if(item.h5!=0)
				{
				nlapiSetCurrentLineItemValue('timeitem','hours5',item.h5);
				}
				if(item.h6!=0)
				{
				nlapiSetCurrentLineItemValue('timeitem','hours6',item.h6);
				}
				nlapiCommitLineItem('timeitem');
				//alert('commited!');
				//break;
				inserted='T';
			//	alert('INSERTED!');
				}

			//break;
			}

			//nlapiCommitLineItem('timeitem');
		   }
	   if(inserted=='F'){
			// alert('ELSE!');
			   nlapiSelectNewLineItem('timeitem');
			   nlapiSetCurrentLineItemValue('timeitem','customer',item.a);
			   nlapiSetCurrentLineItemValue('timeitem','casetaskevent',item.it);
			   nlapiSetCurrentLineItemValue('timeitem','item',item.p);
			   if(item.h0!=0)
				{
				  // alert(item.h0);
				nlapiSetCurrentLineItemValue('timeitem','hours0',item.h0);
				}
				if(item.h1!=0)
				{
					//alert(item.h1);
				nlapiSetCurrentLineItemValue('timeitem','hours1',item.h1);
				}
				if(item.h2!=0)
				{
					//alert(item.h2);
				nlapiSetCurrentLineItemValue('timeitem','hours2',item.h2);
				}
				if(item.h3!=0)
				{
					//alert(item.h3);
				nlapiSetCurrentLineItemValue('timeitem','hours3',item.h3);
				}
				if(item.h4!=0)
				{
					//alert(item.h4);
				nlapiSetCurrentLineItemValue('timeitem','hours4',item.h4);
				}
				if(item.h5!=0)
				{
					//alert(item.h5);
				nlapiSetCurrentLineItemValue('timeitem','hours5',item.h5);
				}
				if(item.h6!=0)
				{
					//alert(item.h6);
				nlapiSetCurrentLineItemValue('timeitem','hours6',item.h6);
				}
			    nlapiCommitLineItem('timeitem');
			    //break;
			   }
	   }
   else{
	   //alert('outside else')
   nlapiSelectNewLineItem('timeitem');
   nlapiSetCurrentLineItemValue('timeitem','customer',item.a);
   nlapiSetCurrentLineItemValue('timeitem','casetaskevent',item.it);
   nlapiSetCurrentLineItemValue('timeitem','item',item.p);

   if(item.h0!=0)
	{
	nlapiSetCurrentLineItemValue('timeitem','hours0',item.h0);
	}
	if(item.h1!=0)
	{
	nlapiSetCurrentLineItemValue('timeitem','hours1',item.h1);
	}
	if(item.h2!=0)
	{
	nlapiSetCurrentLineItemValue('timeitem','hours2',item.h2);
	}
	if(item.h3!=0)
	{
	nlapiSetCurrentLineItemValue('timeitem','hours3',item.h3);
	}
	if(item.h4!=0)
	{
	nlapiSetCurrentLineItemValue('timeitem','hours4',item.h4);
	}
	if(item.h5!=0)
	{
	nlapiSetCurrentLineItemValue('timeitem','hours5',item.h5);
	}
	if(item.h6!=0)
	{
	nlapiSetCurrentLineItemValue('timeitem','hours6',item.h6);
	}
    nlapiCommitLineItem('timeitem');
   }

 }catch(e){ var errorMessage = 'Error on item '+ itemid;
 logEmailError('main - ' + errorMessage, e);}
 });
	}
	/*var timelist=new Array();
	var itemcount=nlapiGetLineItemCount('timeitem');
	for(var i=1;i<=timecount;i++){
		var account=nlapiGetLineItemValue('timeitem','customer',i);
		var accountname=nlapiGetLineItemText('timeitem','customer',i);
		var item=nlapiGetLineItemValue('timeitem','item',i);
		var project=nlapiGetLineItemValue('timeitem','casetaskevent',i);
		var isutilized=nlapiGetLineItemValue('timeitem','isutilized',i);
		var hour0=nlapiGetLineItemValue('timeitem','hours0',i);
		var hour1=nlapiGetLineItemValue('timeitem','hours1',i);
		var hour2=nlapiGetLineItemValue('timeitem','hours2',i);
		var hour3=nlapiGetLineItemValue('timeitem','hours3',i);
		var hour4=nlapiGetLineItemValue('timeitem','hours4',i);
		var hour5=nlapiGetLineItemValue('timeitem','hours5',i);
		var hour6=nlapiGetLineItemValue('timeitem','hours6',i);
		var hour7=nlapiGetLineItemValue('timeitem','hours7',i);

		timelist.push({
			id:i,
               a: account,
               p: item,
               it: project,
               iu:isutilized,
               h0: hour0,
               h1: hour1,
               h2: hour2,
               h3: hour3,
               h4: hour4,
               h5: hour5,
               h6: hour6,
               h7: hour7
           });


	}*/


}

