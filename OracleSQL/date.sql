TO_DATE(TO_CHAR({opportunity.datecreated}, 'MM/DD/YYYY'),  'MM/DD/YYYY')


CASE WHEN
{systemnotes.date}- {custevent_call_start_time} > 0 THEN TO_CHAR({systemnotes.date}- {custevent_call_start_time}, 'DD-MM-YYY HH24:MI:SS')
END

Format in HH:MM
regexp_substr(replace(regexp_substr(substr({systemnotes.date}-{custevent_call_start_time},instr({systemnotes.date}-{custevent_call_start_time},' ')+1), ':[^:]*:[^:]*.'),'.000000','')
,'[^:]*:[^:]*$')

replace(regexp_substr(substr({systemnotes.date}-{custevent_call_start_time},instr({systemnotes.date}-{custevent_call_start_time},' ')+1), '[^:]*:[^:]*.000000$'),'.000000','')

TO_NUMBER({systemnotes.date})-TO_NUMBER({custevent_call_start_time})
TO_NUMBER({systemnotes.date})-TO_NUMBER({custevent_call_start_time})*24*60*60
(TO_DATE({systemnotes.date}, 'YYYY-MM-DD hh24:mi:ss')-TO_DATE({custevent_call_start_time}, 'YYYY-MM-DD hh24:mi:ss'))*24*60*60
to_number(((cast {systemnotes.date} as date)-(cast {custevent_call_start_time} as date))*24*60*600)
to_number(( {systemnotes.date}- {custevent_call_start_time})*24*60*60)
(( {systemnotes.date}- {custevent_call_start_time})*24*60)/60

// number of minutes
ROUND((TO_NUMBER(replace(regexp_substr(substr({systemnotes.date}-{custevent_call_start_time},instr({systemnotes.date}-{custevent_call_start_time},' ')+1), ':[^:]*:'), ':', ''))*60 +
TO_NUMBER(replace(regexp_substr(substr({systemnotes.date}-{custevent_call_start_time},instr({systemnotes.date}-{custevent_call_start_time},' ')+1), '[^:]*.000000$'),'.000000','')))/60,2)


-- ST Sales Opportunities v.2
TO_DATE(TO_CHAR({opportunity.datecreated}, 'MM/DD/YYYY'),  'MM/DD/YYYY')

CASE WHEN
{opportunity.custbody28} IN ('Will Quote', 'Undecided') THEN TO_DATE(TO_CHAR({opportunity.datecreated}, 'MM/DD/YYYY'),  'MM/DD/YYYY')
END


-- ST Sales Orders > $1000 v.2
TO_DATE(TO_CHAR({transaction.datecreated}, 'MM/DD/YYYY'),  'MM/DD/YYYY')

CASE WHEN
{transaction.type} = 'Sales Order' AND {transaction.amount} > 1000 THEN TO_DATE(TO_CHAR({transaction.datecreated}, 'MM/DD/YYYY'),  'MM/DD/YYYY')
END

-- ST Sales Quote v.2

CASE WHEN
{transaction.type} = 'Quote' AND ({today}-{transaction.datecreated} BETWEEN 0 AND 120) THEN TO_DATE(TO_CHAR({transaction.datecreated}, 'MM/DD/YYYY'),  'MM/DD/YYYY')
END

-- Sales Events Last Three Months
CASE WHEN
{activity.assigned} IN ('Brian M Cox', 'Donald R Grant', 'David M Cruz') AND ({today}-{activity.date} BETWEEN 0 AND 90) THEN {activity.createddate}
END

-- 3 Sixty Remaining Materials
CASE WHEN
{type} = 'Sales Order' AND {status} IN ('Pending Billing', 'Pending Billing/Partially Fulfilled', 'Sales Order:Partially Fulfilled') AND {account} = '3040 Product'
AND {job.status} IN ('1. Awarded', '2. In Progress', '6. Signed off/ Invoiced 100%') THEN ({quantity}-{quantityshiprecv})*({costestimate}/NULLIF({quantity},0)) ELSE 0
END

-- Project Profitability Report
replace(regexp_substr({altname}, ':[^:]*$'),':','')


CASE WHEN
{transaction.type} = 'Sales Order' THEN {transaction.amount} ELSE 0
END

-- ST Sales Cycle Stage Summary Monthly Changes Ver 6
CASE WHEN  {transaction.type}  = 'Quote' AND {transaction.forecasttype} IN ('Worst Case', 'Most Likely', 'Upside') AND {transaction.custbody34} != 'ICO'
	AND  {transaction.probability} BETWEEN 0 AND 100 AND {transaction.department} != 'Service' then {transaction.amount}  else 0 END

-- Total Partner and Misc Items for Project SO
CASE WHEN
{item} = 'Partner' THEN {costestimate} ELSE 0
END

replace(regexp_substr({job.entityid}, '^[^:]*:'),':','')
replace(regexp_substr({job.entityid}, ':[^:]*$'),':','')

({time.durationdecimal}*{projecttaskassignment.unitprice}) - ({time.durationdecimal}*{projecttaskassignment.unitcost})