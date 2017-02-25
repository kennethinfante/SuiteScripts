-- Quarterly Campaign Report
COUNT(DISTINCT(CASE WHEN{custrecord_clientid_webform.custrecord_webform_sem_name} LIKE '%TMP%'THEN {internalid}END))/NULLIF(COUNT(DISTINCT({internalid})),0)

CASE WHEN {custentitytc_status} = 'TC Client - TC Full'
THEN
(
	CASE WHEN
	TO_CHAR({custentity_date_of_tc_status_changed}, 'IW') > TO_CHAR({custrecord_clientid_webform.created}, 'IW')
	THEN {internalid}
	END
)
END


CASE WHEN {custentitytc_status} = 'TC Client - TC Full'
THEN
(
	CASE WHEN
	{custentity_date_of_tc_status_changed} > {custrecord_clientid_webform.created}
	THEN {internalid}
	END
)
END