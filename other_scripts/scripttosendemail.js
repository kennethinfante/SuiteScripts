var fromId = 5079; //Gloria's Internal ID
var sbj = 'Hello World';
var msg = 'Hello World Message';
//associate with Customer Record 123
var customerRecId = '2358';
//associate with Cash Sale Record 222
var cashSaleRecId = '67127';

//create object of record to associate
var assoRecs = new Object();
assoRecs['transaction']=cashSaleRecId;
assoRecs['entity']=customerRecId;

nlapiSendEmail(fromId, 'ar@cpagroup.com.au', sbj, msg, null, null, assoRecs, null);