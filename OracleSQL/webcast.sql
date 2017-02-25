CASE
WHEN {usernotes.notetype} LIKE '%Appointment%'
AND (TO_DATE({usernotes.notedate}) > TO_DATE({custrecord_clientid_webform.custrecord_webform_sem_date}))
THEN {internalid}
END



COUNT(DECODE({custrecord_clientid_webform.custrecord_sales_seminar_status}, 'Confirmed', {custrecord_clientid_webform.custrecord_webform_seminar}, null))/NULLIF(COUNT({custrecord_clientid_webform.custrecord_webform_seminar}),0)

DECODE({custrecord_clientid_webform.custrecord_sales_seminar_attended}, 'T', {custrecord_clientid_webform.custrecord_webform_seminar}, null)

COUNT(DECODE({custrecord_clientid_webform.custrecord_sales_seminar_attended}, 'T', {custrecord_clientid_webform.custrecord_webform_seminar}, null))/NULLIF(COUNT({custrecord_clientid_webform.custrecord_webform_seminar}),0)


DECODE({custentity_call_stage}, 'W-NA1', {internalid}, null)
DECODE({custentity_call_stage}, 'W-NA2', {internalid}, null)
DECODE({custentity_call_stage}, 'W-NA3', {internalid}, null)
DECODE({custentity_call_stage}, 'W-NA4', {internalid}, null)
DECODE({custentity_call_stage}, 'W-NA5', {internalid}, null)
DECODE({custentity_call_stage}, 'Contacted', {internalid}, null)
DECODE({custentity_call_stage}, 'Contacted', null, {internalid})


DECODE({custrecord_clientid_webform.custrecord_sales_seminar_status}, 'Rebooked', {internalid}, null)

CASE WHEN
{systemnotes.field} = 'TC Status' AND ({systemnotes.newvalue} = 'TC Client - TC Full') AND (TO_DATE({systemnotes.date},'DD/MM/YYYY') > TO_DATE({custrecord_clientid_webform.custrecord_webform_sem_date},'DD/MM/YYYY'))
THEN {intenalid}
END

DECODE({custentitytc_status}, 'TC Client - TC Full', {internalid}, null)


CASE WHEN {custentity_call_stage}= 'Contacted' then {internalid} WHEN {custentity_call_stage}= 'W-NA1' then {internalid}  WHEN {custentity_call_stage}= 'W-NA2' then {internalid}  WHEN {custentity_call_stage}= 'W-NA3' then {internalid} WHEN {custentity_call_stage}= 'W-NA4' then {internalid}  WHEN {custentity_call_stage}= 'W-NA5' then {internalid} WHEN {custentity_call_stage}= 'W-Contacted' then {internalid} else null END

CASE WHEN {custentity_call_stage}= 'Contacted' then null WHEN {custentity_call_stage}= 'W-NA1' then null WHEN {custentity_call_stage}= 'W-NA2' then null  WHEN {custentity_call_stage}= 'W-NA3' then null WHEN {custentity_call_stage}= 'W-NA4' then null WHEN {custentity_call_stage}= 'W-NA5' then null  WHEN {custentity_call_stage}= 'W-Contacted' then null else {internalid}  END


CASE
WHEN {custrecord_clientid_webform.custrecord_sales_seminar_attended} = 'T' AND {custentity_call_stage} = 'W-NA1'
THEN {internalid}
END

CASE
WHEN {custrecord_clientid_webform.custrecord_sales_seminar_attended} = 'T' AND {custentity_call_stage} = 'W-NA2'
THEN {internalid}
END

CASE
WHEN {custrecord_clientid_webform.custrecord_sales_seminar_attended} = 'T' AND {custentity_call_stage} = 'W-NA3'
THEN {internalid}
END

CASE
WHEN {custrecord_clientid_webform.custrecord_sales_seminar_attended} = 'T' AND {custentity_call_stage} = 'W-NA4'
THEN {internalid}
END

CASE
WHEN {custrecord_clientid_webform.custrecord_sales_seminar_attended} = 'T' AND {custentity_call_stage} = 'W-NA5'
THEN {internalid}
END

CASE
WHEN TO_DATE({systemnotes.date}, 'DD/MM/YYYY') > TO_DATE({custrecord_clientid_webform.custrecord_webform_sem_date}, 'DD/MM/YYYY')
AND {systemnotes.newvalue} = 'TC Client - TC Full' AND {custrecord_clientid_webform.custrecord_sales_seminar_attended} = 'T'
THEN {internalid}
END

DECODE({custentitytc_status}, 'TC Client - TC Full', {internalid}, null)

CASE WHEN {custentitytc_status} = 'TC Client - TC Full' AND {custrecord_clientid_webform.custrecord_sales_seminar_attended} = 'T'
THEN {internalid}
END



+$B2&IF($D2="x"; ", "&D$1;"")
&IF($E2="x"; ", "&E$1;"")
&IF($F2="x"; ", "&F$1;"")
&IF($G2="x"; ", "&G$1;"")
&IF($H2="x"; ", "&H$1;"")
&IF($I2="x"; ", "&I$1;"")
&IF($J2="x"; ", "&J$1;"")
&IF($K2="x"; ", "&K$1;"")
&IF($L2="x"; ", "&L$1;"")
&IF($M2="x"; ", "&M$1;"")
&IF($N2="x"; ", "&N$1;"")
&IF($O2="x"; ", "&O$1;"")
&IF($P2="x"; ", "&P$1;"")
&IF($Q2="x"; ", "&Q$1;"")
&IF($R2="x"; ", "&R$1;"")
&IF($S2="x"; ", "&S$1;"")
&IF($T2="x"; ", "&T$1;"")
&IF($U2="x"; ", "&U$1;"")
&IF($V2="x"; ", "&V$1;"")
&IF($W2="x"; ", "&W$1;"")
&IF($X2="x"; ", "&X$1;"")
&IF($Y2="x"; ", "&Y$1;"")
&IF($Z2="x"; ", "&Z$1;"")
&IF($AA2="x"; ", "&AA$1;"")
&IF($AB2="x"; ", "&AB$1;"")
&IF($AC2="x"; ", "&AC$1;"")


-- another stab
CASE
WHEN {today} BETWEEN (LAST_DAY(ADD_MONTHS({today}, -1))+22) AND (LAST_DAY({today})+6) THEN
(CASE WHEN
(CASE WHEN
TO_NUMBER(TO_CHAR({hiredate},'dd')) < 6 then LAST_DAY(ADD_MONTHS({hiredate}, -1))+6 WHEN TO_NUMBER(TO_CHAR({hiredate},'dd')) > 22 then LAST_DAY(ADD_MONTHS({hiredate}, 0))+6else LAST_DAY(ADD_MONTHS({hiredate}, -1))+21 END)
 = (LAST_DAY({today})+6)
 THEN
'<span style="background-color:green">' ||
(CASE WHEN TO_NUMBER(TO_CHAR({hiredate},'dd')) < 6 then LAST_DAY(ADD_MONTHS({hiredate}, -1))+6 WHEN TO_NUMBER(TO_CHAR({hiredate},'dd')) > 22 then LAST_DAY(ADD_MONTHS({hiredate}, 0))+6else LAST_DAY(ADD_MONTHS({hiredate}, -1))+21 END)
|| '<span>'
ELSE
TO_CHAR(CASE WHEN TO_NUMBER(TO_CHAR({hiredate},'dd')) < 6 then LAST_DAY(ADD_MONTHS({hiredate}, -1))+6 WHEN TO_NUMBER(TO_CHAR({hiredate},'dd')) > 22 then LAST_DAY(ADD_MONTHS({hiredate}, 0))+6else LAST_DAY(ADD_MONTHS({hiredate}, -1))+21 END)
END)

WHEN TO_NUMBER(TO_CHAR({today}, 'dd')) BETWEEN 7 and 21 THEN
(CASE WHEN
(CASE WHEN TO_NUMBER(TO_CHAR({hiredate},'dd')) < 6 then LAST_DAY(ADD_MONTHS({hiredate}, -1))+6 WHEN TO_NUMBER(TO_CHAR({hiredate},'dd')) > 22 then LAST_DAY(ADD_MONTHS({hiredate}, 0))+6else LAST_DAY(ADD_MONTHS({hiredate}, -1))+21 END)
 = TO_DATE(CONCAT('21/',TO_CHAR({today}, 'mm/yyyy')),'dd/mm/yyyy')

THEN
'<span style="background-color:green">' ||
(CASE WHEN TO_NUMBER(TO_CHAR({hiredate},'dd')) < 6 then LAST_DAY(ADD_MONTHS({hiredate}, -1))+6 WHEN TO_NUMBER(TO_CHAR({hiredate},'dd')) > 22 then LAST_DAY(ADD_MONTHS({hiredate}, 0))+6else LAST_DAY(ADD_MONTHS({hiredate}, -1))+21 END)
|| '<span>'
ELSE
TO_CHAR(CASE WHEN TO_NUMBER(TO_CHAR({hiredate},'dd')) < 6 then LAST_DAY(ADD_MONTHS({hiredate}, -1))+6 WHEN TO_NUMBER(TO_CHAR({hiredate},'dd')) > 22 then LAST_DAY(ADD_MONTHS({hiredate}, 0))+6else LAST_DAY(ADD_MONTHS({hiredate}, -1))+21 END)
END)


END

-- count % confirmed
COUNT(DISTINCT(DECODE({custrecord_clientid_webform.custrecord_sales_seminar_status}, 'Confirmed', {internalid}, null)))/NULLIF(COUNT(DISTINCT({internalid})),0)

-- count % attended
COUNT(DISTINCT(DECODE({custrecord_clientid_webform.custrecord_sales_seminar_attended}, 'T', {internalid}, null)))/NULLIF(COUNT(DISTINCT({internalid})),0)