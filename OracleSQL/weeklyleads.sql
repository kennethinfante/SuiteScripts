CASE
WHEN TO_NUMBER(TO_CHAR({datecreated}, 'IW')) = TO_NUMBER(TO_CHAR({custrecord_clientid_webform.created}, 'IW'))
THEN {internalid}
END

-- BecomeATrader
CASE WHEN {custrecord_clientid_webform.custrecord_webform_campaign} in ('Become A Trader', 'BecomeATrader', 'BecomeTrader')
THEN {internalid} END

CASE WHEN {custrecord_clientid_webform.custrecord_webform_campaign} in ('Become A Trader', 'BecomeATrader', 'BecomeTrader')
THEN (
	CASE WHEN TO_NUMBER(TO_CHAR({datecreated}, 'IW')) = TO_NUMBER(TO_CHAR({custrecord_clientid_webform.created}, 'IW'))
	THEN {internalid}
	END
)
END

CASE WHEN {custrecord_clientid_webform.custrecord_webform_campaign} in ('Become A Trader', 'BecomeATrader', 'BecomeTrader')
THEN (
	CASE WHEN TO_NUMBER(TO_CHAR({datecreated}, 'IW')) <> TO_NUMBER(TO_CHAR({custrecord_clientid_webform.created}, 'IW'))
	THEN {internalid}
	END
)
END

-- Ebook
CASE WHEN {custrecord_clientid_webform.custrecord_webform_campaign} LIKE '%Ebook%'
THEN {internalid} END

CASE WHEN {custrecord_clientid_webform.custrecord_webform_campaign} LIKE '%Ebook%'
THEN (
	CASE WHEN TO_NUMBER(TO_CHAR({datecreated}, 'IW')) = TO_NUMBER(TO_CHAR({custrecord_clientid_webform.created}, 'IW'))
	THEN {internalid}
	END
)
END

CASE WHEN {custrecord_clientid_webform.custrecord_webform_campaign} LIKE '%Ebook%'
THEN (
	CASE WHEN TO_NUMBER(TO_CHAR({datecreated}, 'IW')) <> TO_NUMBER(TO_CHAR({custrecord_clientid_webform.created}, 'IW'))
	THEN {internalid}
	END
)
END

-- Webcast
CASE WHEN {custrecord_clientid_webform.custrecord_webform_campaign} LIKE '%Webcast%'
THEN {internalid} END

CASE WHEN {custrecord_clientid_webform.custrecord_webform_campaign} LIKE '%Webcast%'
THEN (
	CASE WHEN TO_NUMBER(TO_CHAR({datecreated}, 'IW')) = TO_NUMBER(TO_CHAR({custrecord_clientid_webform.created}, 'IW'))
	THEN {internalid}
	END
)
END

CASE WHEN {custrecord_clientid_webform.custrecord_webform_campaign} LIKE '%Webcast%'
THEN (
	CASE WHEN TO_NUMBER(TO_CHAR({datecreated}, 'IW')) <> TO_NUMBER(TO_CHAR({custrecord_clientid_webform.created}, 'IW'))
	THEN {internalid}
	END
)
END

-- Competition

CASE WHEN {custrecord_clientid_webform.custrecord_webform_campaign} LIKE '%Competition%'
THEN {internalid} END

CASE WHEN {custrecord_clientid_webform.custrecord_webform_campaign} LIKE '%Competition%'
THEN (
	CASE WHEN TO_NUMBER(TO_CHAR({datecreated}, 'IW')) = TO_NUMBER(TO_CHAR({custrecord_clientid_webform.created}, 'IW'))
	THEN {internalid}
	END
)
END

CASE WHEN {custrecord_clientid_webform.custrecord_webform_campaign} LIKE '%Competition%'
THEN (
	CASE WHEN TO_NUMBER(TO_CHAR({datecreated}, 'IW')) <> TO_NUMBER(TO_CHAR({custrecord_clientid_webform.created}, 'IW'))
	THEN {internalid}
	END
)
END

-- Others
CASE WHEN
{custrecord_clientid_webform.custrecord_webform_campaign} IN ('Become A Trader', 'BecomeATrader', 'BecomeTrader')
OR {custrecord_clientid_webform.custrecord_webform_campaign} LIKE '%Competition%'
OR {custrecord_clientid_webform.custrecord_webform_campaign} LIKE '%Ebook%'
OR {custrecord_clientid_webform.custrecord_webform_campaign} LIKE '%Webcast%'
THEN null else {internalid} END


CASE WHEN
{custrecord_clientid_webform.custrecord_webform_campaign} IN ('Become A Trader', 'BecomeATrader', 'BecomeTrader')
OR {custrecord_clientid_webform.custrecord_webform_campaign} LIKE '%Competition%'
OR {custrecord_clientid_webform.custrecord_webform_campaign} LIKE '%Ebook%'
OR {custrecord_clientid_webform.custrecord_webform_campaign} LIKE '%Webcast%'
THEN null else (
	CASE WHEN TO_NUMBER(TO_CHAR({datecreated}, 'IW')) = TO_NUMBER(TO_CHAR({custrecord_clientid_webform.created}, 'IW'))
	THEN {internalid}
	END
)
END

CASE WHEN
{custrecord_clientid_webform.custrecord_webform_campaign} IN ('Become A Trader', 'BecomeATrader', 'BecomeTrader')
OR {custrecord_clientid_webform.custrecord_webform_campaign} LIKE '%Competition%'
OR {custrecord_clientid_webform.custrecord_webform_campaign} LIKE '%Ebook%'
OR {custrecord_clientid_webform.custrecord_webform_campaign} LIKE '%Webcast%'
THEN null else (
	CASE WHEN TO_NUMBER(TO_CHAR({datecreated}, 'IW')) <> TO_NUMBER(TO_CHAR({custrecord_clientid_webform.created}, 'IW'))
	THEN {internalid}
	END
)
END

-- sum formula without grouping (WORKING!!!)
sum/*comment*/(TO_NUMBER({custrecord_commission_employee_name.custrecord_commission_amount})) OVER (PARTITION BY {entityid} ORDER BY {internalid})

-- sum formula for commission
sum(CASE WHEN {time.item} = 'Regular Hours' THEN {custrecord_commission_employee_name.custrecord_commission_amount} ELSE 0 END)/count(DISTINCT({time.internalid}))


-- formula for Remaining Time to Respond
CASE
WHEN {custevent_time_to_respond} IS NOT NULL THEN ({now}-TO_TIMESTAMP(TO_CHAR({createddate}, 'MM/DD/YYYY HH24:MI:SS'), 'MM/DD/YYYY HH24:MI:SS'))
END

CASE WHEN
(
CASE
WHEN {custevent_time_to_respond} IS NOT NULL THEN
{custevent_time_to_respond}-
trunc(
         extract(day from ({now}-TO_TIMESTAMP(TO_CHAR({createddate}, 'MM/DD/YYYY HH24:MI:SS'), 'MM/DD/YYYY HH24:MI:SS'))) * 24
       + extract(hour from ({now}-TO_TIMESTAMP(TO_CHAR({createddate}, 'MM/DD/YYYY HH24:MI:SS'), 'MM/DD/YYYY HH24:MI:SS')))
       + extract(minute from ({now}-TO_TIMESTAMP(TO_CHAR({createddate}, 'MM/DD/YYYY HH24:MI:SS'), 'MM/DD/YYYY HH24:MI:SS')))/60
       + extract(second from ({now}-TO_TIMESTAMP(TO_CHAR({createddate}, 'MM/DD/YYYY HH24:MI:SS'), 'MM/DD/YYYY HH24:MI:SS')))/(60*60)
       )
END
) < 0
THEN 0
ELSE
(
CASE
WHEN {custevent_time_to_respond} IS NOT NULL THEN
{custevent_time_to_respond}-
trunc(
         extract(day from ({now}-TO_TIMESTAMP(TO_CHAR({createddate}, 'MM/DD/YYYY HH24:MI:SS'), 'MM/DD/YYYY HH24:MI:SS'))) * 24
       + extract(hour from ({now}-TO_TIMESTAMP(TO_CHAR({createddate}, 'MM/DD/YYYY HH24:MI:SS'), 'MM/DD/YYYY HH24:MI:SS')))
       + extract(minute from ({now}-TO_TIMESTAMP(TO_CHAR({createddate}, 'MM/DD/YYYY HH24:MI:SS'), 'MM/DD/YYYY HH24:MI:SS')))/60
       + extract(second from ({now}-TO_TIMESTAMP(TO_CHAR({createddate}, 'MM/DD/YYYY HH24:MI:SS'), 'MM/DD/YYYY HH24:MI:SS')))/(60*60)
       )
END
)
END

-- formula for Remaining Time to Action
CASE WHEN
(
CASE
WHEN {custevent_time_to_action} IS NOT NULL THEN
{custevent_time_to_action}-
trunc(
         extract(day from ({now}-TO_TIMESTAMP(TO_CHAR({lastmodifieddate}, 'MM/DD/YYYY HH24:MI:SS'), 'MM/DD/YYYY HH24:MI:SS'))) * 24
       + extract(hour from ({now}-TO_TIMESTAMP(TO_CHAR({lastmodifieddate}, 'MM/DD/YYYY HH24:MI:SS'), 'MM/DD/YYYY HH24:MI:SS')))
       + extract(minute from ({now}-TO_TIMESTAMP(TO_CHAR({lastmodifieddate}, 'MM/DD/YYYY HH24:MI:SS'), 'MM/DD/YYYY HH24:MI:SS')))/60
       + extract(second from ({now}-TO_TIMESTAMP(TO_CHAR({lastmodifieddate}, 'MM/DD/YYYY HH24:MI:SS'), 'MM/DD/YYYY HH24:MI:SS')))/(60*60)
       )
END
) < 0
THEN 0
ELSE
(
CASE
WHEN {custevent_time_to_action} IS NOT NULL THEN
{custevent_time_to_action}-
trunc(
         extract(day from ({now}-TO_TIMESTAMP(TO_CHAR({lastmodifieddate}, 'MM/DD/YYYY HH24:MI:SS'), 'MM/DD/YYYY HH24:MI:SS'))) * 24
       + extract(hour from ({now}-TO_TIMESTAMP(TO_CHAR({lastmodifieddate}, 'MM/DD/YYYY HH24:MI:SS'), 'MM/DD/YYYY HH24:MI:SS')))
       + extract(minute from ({now}-TO_TIMESTAMP(TO_CHAR({lastmodifieddate}, 'MM/DD/YYYY HH24:MI:SS'), 'MM/DD/YYYY HH24:MI:SS')))/60
       + extract(second from ({now}-TO_TIMESTAMP(TO_CHAR({lastmodifieddate}, 'MM/DD/YYYY HH24:MI:SS'), 'MM/DD/YYYY HH24:MI:SS')))/(60*60)
       )
END
)
END


-- formula for Remaining Time Before Escalation
CASE WHEN
(
CASE
WHEN {custevent_time_to_escalation} IS NOT NULL THEN
{custevent_time_to_escalation}-
trunc(
         extract(day from ({now}-TO_TIMESTAMP(TO_CHAR({lastmodifieddate}, 'MM/DD/YYYY HH24:MI:SS'), 'MM/DD/YYYY HH24:MI:SS'))) * 24
       + extract(hour from ({now}-TO_TIMESTAMP(TO_CHAR({lastmodifieddate}, 'MM/DD/YYYY HH24:MI:SS'), 'MM/DD/YYYY HH24:MI:SS')))
       + extract(minute from ({now}-TO_TIMESTAMP(TO_CHAR({lastmodifieddate}, 'MM/DD/YYYY HH24:MI:SS'), 'MM/DD/YYYY HH24:MI:SS')))/60
       + extract(second from ({now}-TO_TIMESTAMP(TO_CHAR({lastmodifieddate}, 'MM/DD/YYYY HH24:MI:SS'), 'MM/DD/YYYY HH24:MI:SS')))/(60*60)
       )
END
) < 0
THEN 0
ELSE
(
CASE
WHEN {custevent_time_to_escalation} IS NOT NULL THEN
{custevent_time_to_escalation}-
trunc(
         extract(day from ({now}-TO_TIMESTAMP(TO_CHAR({lastmodifieddate}, 'MM/DD/YYYY HH24:MI:SS'), 'MM/DD/YYYY HH24:MI:SS'))) * 24
       + extract(hour from ({now}-TO_TIMESTAMP(TO_CHAR({lastmodifieddate}, 'MM/DD/YYYY HH24:MI:SS'), 'MM/DD/YYYY HH24:MI:SS')))
       + extract(minute from ({now}-TO_TIMESTAMP(TO_CHAR({lastmodifieddate}, 'MM/DD/YYYY HH24:MI:SS'), 'MM/DD/YYYY HH24:MI:SS')))/60
       + extract(second from ({now}-TO_TIMESTAMP(TO_CHAR({lastmodifieddate}, 'MM/DD/YYYY HH24:MI:SS'), 'MM/DD/YYYY HH24:MI:SS')))/(60*60)
       )
END
)
END


-- AGGREGRATE
LEAST(
(CASE WHEN {custevent_time_to_respond} IS NOT NULL THEN {custevent_time_to_respond}- trunc(          extract(day from ({now}-TO_TIMESTAMP(TO_CHAR({createddate}, 'MM/DD/YYYY HH24:MI:SS'), 'MM/DD/YYYY HH24:MI:SS'))) * 24        + extract(hour from ({now}-TO_TIMESTAMP(TO_CHAR({createddate}, 'MM/DD/YYYY HH24:MI:SS'), 'MM/DD/YYYY HH24:MI:SS')))        + extract(minute from ({now}-TO_TIMESTAMP(TO_CHAR({createddate}, 'MM/DD/YYYY HH24:MI:SS'), 'MM/DD/YYYY HH24:MI:SS')))/60        + extract(second from ({now}-TO_TIMESTAMP(TO_CHAR({createddate}, 'MM/DD/YYYY HH24:MI:SS'), 'MM/DD/YYYY HH24:MI:SS')))/(60*60)        ) END),
(CASE WHEN {custevent_time_to_action} IS NOT NULL THEN {custevent_time_to_action}- trunc(          extract(day from ({now}-TO_TIMESTAMP(TO_CHAR({lastmodifieddate}, 'MM/DD/YYYY HH24:MI:SS'), 'MM/DD/YYYY HH24:MI:SS'))) * 24        + extract(hour from ({now}-TO_TIMESTAMP(TO_CHAR({lastmodifieddate}, 'MM/DD/YYYY HH24:MI:SS'), 'MM/DD/YYYY HH24:MI:SS')))        + extract(minute from ({now}-TO_TIMESTAMP(TO_CHAR({lastmodifieddate}, 'MM/DD/YYYY HH24:MI:SS'), 'MM/DD/YYYY HH24:MI:SS')))/60        + extract(second from ({now}-TO_TIMESTAMP(TO_CHAR({lastmodifieddate}, 'MM/DD/YYYY HH24:MI:SS'), 'MM/DD/YYYY HH24:MI:SS')))/(60*60)        ) END),
(CASE WHEN {custevent_time_to_escalation} IS NOT NULL THEN {custevent_time_to_escalation}- trunc(          extract(day from ({now}-TO_TIMESTAMP(TO_CHAR({lastmodifieddate}, 'MM/DD/YYYY HH24:MI:SS'), 'MM/DD/YYYY HH24:MI:SS'))) * 24        + extract(hour from ({now}-TO_TIMESTAMP(TO_CHAR({lastmodifieddate}, 'MM/DD/YYYY HH24:MI:SS'), 'MM/DD/YYYY HH24:MI:SS')))        + extract(minute from ({now}-TO_TIMESTAMP(TO_CHAR({lastmodifieddate}, 'MM/DD/YYYY HH24:MI:SS'), 'MM/DD/YYYY HH24:MI:SS')))/60        + extract(second from ({now}-TO_TIMESTAMP(TO_CHAR({lastmodifieddate}, 'MM/DD/YYYY HH24:MI:SS'), 'MM/DD/YYYY HH24:MI:SS')))/(60*60)        ) END)
)

LEAST( (CASE WHEN {custevent_time_to_respond} IS NOT NULL THEN {custevent_time_to_respond}- trunc(          extract(day from ({now}-TO_TIMESTAMP(TO_CHAR({createddate}, 'MM/DD/YYYY HH24:MI:SS'), 'MM/DD/YYYY HH24:MI:SS'))) * 24        + extract(hour from ({now}-TO_TIMESTAMP(TO_CHAR({createddate}, 'MM/DD/YYYY HH24:MI:SS'), 'MM/DD/YYYY HH24:MI:SS')))        + extract(minute from ({now}-TO_TIMESTAMP(TO_CHAR({createddate}, 'MM/DD/YYYY HH24:MI:SS'), 'MM/DD/YYYY HH24:MI:SS')))/60        + extract(second from ({now}-TO_TIMESTAMP(TO_CHAR({createddate}, 'MM/DD/YYYY HH24:MI:SS'), 'MM/DD/YYYY HH24:MI:SS')))/(60*60)        ) END), (CASE WHEN {custevent_time_to_action} IS NOT NULL THEN {custevent_time_to_action}- trunc(          extract(day from ({now}-TO_TIMESTAMP(TO_CHAR({lastmodifieddate}, 'MM/DD/YYYY HH24:MI:SS'), 'MM/DD/YYYY HH24:MI:SS'))) * 24        + extract(hour from ({now}-TO_TIMESTAMP(TO_CHAR({lastmodifieddate}, 'MM/DD/YYYY HH24:MI:SS'), 'MM/DD/YYYY HH24:MI:SS')))        + extract(minute from ({now}-TO_TIMESTAMP(TO_CHAR({lastmodifieddate}, 'MM/DD/YYYY HH24:MI:SS'), 'MM/DD/YYYY HH24:MI:SS')))/60        + extract(second from ({now}-TO_TIMESTAMP(TO_CHAR({lastmodifieddate}, 'MM/DD/YYYY HH24:MI:SS'), 'MM/DD/YYYY HH24:MI:SS')))/(60*60)        ) END), (CASE WHEN {custevent_time_to_escalation} IS NOT NULL THEN {custevent_time_to_escalation}- trunc(          extract(day from ({now}-TO_TIMESTAMP(TO_CHAR({lastmodifieddate}, 'MM/DD/YYYY HH24:MI:SS'), 'MM/DD/YYYY HH24:MI:SS'))) * 24        + extract(hour from ({now}-TO_TIMESTAMP(TO_CHAR({lastmodifieddate}, 'MM/DD/YYYY HH24:MI:SS'), 'MM/DD/YYYY HH24:MI:SS')))        + extract(minute from ({now}-TO_TIMESTAMP(TO_CHAR({lastmodifieddate}, 'MM/DD/YYYY HH24:MI:SS'), 'MM/DD/YYYY HH24:MI:SS')))/60        + extract(second from ({now}-TO_TIMESTAMP(TO_CHAR({lastmodifieddate}, 'MM/DD/YYYY HH24:MI:SS'), 'MM/DD/YYYY HH24:MI:SS')))/(60*60)        ) END) )

LEAST(
(CASE WHEN ({status} = 'Not Started' AND ({custevent_time_to_respond} IS NOT NULL)) THEN {custevent_time_to_respond}- trunc(          extract(day from ({now}-TO_TIMESTAMP(TO_CHAR({createddate}, 'MM/DD/YYYY HH24:MI:SS'), 'MM/DD/YYYY HH24:MI:SS'))) * 24        + extract(hour from ({now}-TO_TIMESTAMP(TO_CHAR({createddate}, 'MM/DD/YYYY HH24:MI:SS'), 'MM/DD/YYYY HH24:MI:SS')))        + extract(minute from ({now}-TO_TIMESTAMP(TO_CHAR({createddate}, 'MM/DD/YYYY HH24:MI:SS'), 'MM/DD/YYYY HH24:MI:SS')))/60        + extract(second from ({now}-TO_TIMESTAMP(TO_CHAR({createddate}, 'MM/DD/YYYY HH24:MI:SS'), 'MM/DD/YYYY HH24:MI:SS')))/(60*60)        ) END),
(CASE WHEN {custevent_time_to_action} IS NOT NULL THEN {custevent_time_to_action}- trunc(          extract(day from ({now}-TO_TIMESTAMP(TO_CHAR({lastmodifieddate}, 'MM/DD/YYYY HH24:MI:SS'), 'MM/DD/YYYY HH24:MI:SS'))) * 24        + extract(hour from ({now}-TO_TIMESTAMP(TO_CHAR({lastmodifieddate}, 'MM/DD/YYYY HH24:MI:SS'), 'MM/DD/YYYY HH24:MI:SS')))        + extract(minute from ({now}-TO_TIMESTAMP(TO_CHAR({lastmodifieddate}, 'MM/DD/YYYY HH24:MI:SS'), 'MM/DD/YYYY HH24:MI:SS')))/60        + extract(second from ({now}-TO_TIMESTAMP(TO_CHAR({lastmodifieddate}, 'MM/DD/YYYY HH24:MI:SS'), 'MM/DD/YYYY HH24:MI:SS')))/(60*60)        ) END),
(CASE WHEN {custevent_time_to_escalation} IS NOT NULL THEN {custevent_time_to_escalation}- trunc(          extract(day from ({now}-TO_TIMESTAMP(TO_CHAR({lastmodifieddate}, 'MM/DD/YYYY HH24:MI:SS'), 'MM/DD/YYYY HH24:MI:SS'))) * 24        + extract(hour from ({now}-TO_TIMESTAMP(TO_CHAR({lastmodifieddate}, 'MM/DD/YYYY HH24:MI:SS'), 'MM/DD/YYYY HH24:MI:SS')))        + extract(minute from ({now}-TO_TIMESTAMP(TO_CHAR({lastmodifieddate}, 'MM/DD/YYYY HH24:MI:SS'), 'MM/DD/YYYY HH24:MI:SS')))/60        + extract(second from ({now}-TO_TIMESTAMP(TO_CHAR({lastmodifieddate}, 'MM/DD/YYYY HH24:MI:SS'), 'MM/DD/YYYY HH24:MI:SS')))/(60*60)        ) END)
)


-- Hired Last Month
CASE WHEN {hiredate} BETWEEN (LAST_DAY(ADD_MONTHS({today}, -2)+1) AND (LAST_DAY(ADD_MONTHS({today},-1)))THEN {internalid}END

-- Separated Last Month
CASE WHEN ({releasedate} IS NOT NULL) AND {releasedate} BETWEEN (LAST_DAY(ADD_MONTHS({today}, -2))+1) AND (LAST_DAY(ADD_MONTHS({today},-1)))THEN {internalid}END

-- Hired This Month
CASE WHEN ({hiredate} IS NOT NULL) AND {hiredate} BETWEEN (LAST_DAY(ADD_MONTHS({today}, -1)+1) AND LAST_DAY({today}) THEN {internalid}END

-- Separated This Month
CASE WHEN ({releasedate} IS NOT NULL) AND {releasedate} BETWEEN (LAST_DAY(ADD_MONTHS({today}, -1))+1) AND LAST_DAY({today}) THEN {internalid}END