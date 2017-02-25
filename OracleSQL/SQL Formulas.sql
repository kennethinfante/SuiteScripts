NEXT_DAY(ADD_MONTHS({custrecord_bts_employee.custrecord_bts_to_date},1),2)


CASE WHEN NEXT_DAY(ADD_MONTHS({custrecord_bts_employee.custrecord_bts_to_date},1),2)={today} 
AND {custrecord_bts_employee.custrecord_bts_hours}=0 
THEN 1 ELSE 0 END

nlapiLookupField('customer',customer_id,cust_fields)

CASE WHEN NEXT_DAY(ADD_MONTHS({custrecord_bts_employee.custrecord_bts_to_date},1),2)={today} 
AND {custrecord_bts_employee.custrecord_bts_hours}=0 
THEN 1 ELSE 0 END

CASE WHEN NEXT_DAY(ADD_MONTHS({custrecord_bts_employee.lastpaiddate.custrecord_bts_to_date},1),2)={today} 
AND {custrecord_bts_employee.custrecord_bts_hours}=0 
THEN 1 ELSE 0 END{custentity_pr_last_payslip}


CASE WHEN NEXT_DAY(ADD_MONTHS({custrecord_bts_employee.custentity_pr_last_payslip.custrecord_bts_to_date},1),2)={today} 
AND {custrecord_bts_employee.custrecord_bts_hours}=0 
THEN 1 ELSE 0 END

Working Formulas
	CASE WHEN ABS({custrecord_ps_employee.custrecord_pr_ps_pay_date}-{today})<=7 THEN 1 ELSE 0 end

Formula for Substring
	CASE WHEN LOWER{custrecord_ps_employee.custrecord_pr_ps_payrun} LIKE '%termination%' THEN 1 else 0 end

Debtors to Chase
CASE WHEN ROUND({today}-MAX{messages.messagedate}) > 10 THEN 1 ELSE 0 END
CASE WHEN ROUND({today}-(MAX{messages.messagedate} KEEP (dense_rank last order by {messages.messagedate})) ) > 10 THEN 1 ELSE 0 END
DENSE_RANK({messages.messagedate}) WITHIN GROUP (ORDER BY {messages.messagedate} DESC)
MAX(RANK() WITHIN GROUP (ORDER BY {messages.messagedate} DESC))

CASE WHEN MAX(RANK() WITHIN GROUP (ORDER BY {messages.messagedate} DESC)) > 0 THEN 1 ELSE 0 END
MAX(RANK() WITHIN GROUP (ORDER BY {messages.messagedate}DESC))

RANK(messages.messagedate) WITHIN GROUP (ORDER BY {messages.messagedate} DESC)

max({messages.messagedate}) keep (dense_rank last order by {messages.messagedate})

CASE WHEN MAX(ROUND({today}-{messages.messagedate})) > 10 THEN 1 ELSE 0 END