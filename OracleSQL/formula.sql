DECODE({custbody_cseg_region}, 'CORP', {grossamount},0)
DECODE({custbody_cseg_region}, 'NA', {grossamount},0)
DECODE({custbody_cseg_region}, 'EU', {grossamount},0)
DECODE({custbody_cseg_region}, 'APAC', {grossamount},0)

-- NOT IN does not work
CASE WHEN
{custbody_cseg_region} IN ('CORP', 'NA', 'EU', 'APAC')
THEN 0
ELSE {grossamount}
END


DECODE({custbody_cseg_region}, 'CORP', {quantity},0)
DECODE({custbody_cseg_region}, 'NA', {quantity},0)
DECODE({custbody_cseg_region}, 'EU', {quantity},0)
DECODE({custbody_cseg_region}, 'APAC', {quantity},0)


CASE WHEN
({custbody_cseg_region} IN ('CORP', 'NA', 'EU', 'APAC'))
THEN 0
ELSE {quantity}
END


DECODE({custbody_cseg_region}, 'CORP', {costestimaterate}*{quantity},0)
DECODE({custbody_cseg_region}, 'NA', {costestimaterate}*{quantity},0)
DECODE({custbody_cseg_region}, 'EU', {costestimaterate}*{quantity},0)
DECODE({custbody_cseg_region}, 'APAC', {costestimaterate}*{quantity},0)


CASE WHEN
({custbody_cseg_region} IN ('CORP', 'NA', 'EU', 'APAC'))
THEN 0
ELSE ({quantity}*{costestimaterate})
END

DECODE({item.custitem_bundle}, 'T', {amount}, 0)
DECODE({item.custitem_bundle}, 'T', {estgrossprofit}, 0)
DECODE({item.custitem_bundle}, 'T', {estgrossprofitpct}, 0)

DECODE({item.custitem_bundle}, 'T', 0, {amount})
DECODE({item.custitem_bundle}, 'T', 0, {estgrossprofit})
DECODE({item.custitem_bundle}, 'T', 0, {estgrossprofitpct})


SUM(DECODE({item.custitem_bundle}, 'T', 0, {estgrossprofit}))/NULLIF(SUM(DECODE({item.custitem_bundle}, 'T', 0, {amount})), 0)

DECODE({custbody_cseg_region}, 'CORP', DECODE({accounttype},'Cost of Goods Sold',-{grossamount}, {grossamount}), 0)
DECODE({custbody_cseg_region}, 'NA', DECODE({accounttype},'Cost of Goods Sold',-{grossamount}, {grossamount}), 0)
DECODE({custbody_cseg_region}, 'EU', DECODE({accounttype},'Cost of Goods Sold',-{grossamount}, {grossamount}), 0)
DECODE({custbody_cseg_region}, 'APAC', DECODE({accounttype},'Cost of Goods Sold',-{grossamount}, {grossamount}), 0)

CASE WHEN {custbody_cseg_region} IN ('CORP', 'NA', 'EU', 'APAC') THEN 0 ELSE DECODE({accounttype},'Cost of Goods Sold',-{grossamount}, {grossamount}) END

saved search looking sales opp that has next follow up 2 days in advance create a task link to that opp for the next sales action


replace(regexp_substr({job.entityid}, ':[^:]*$'),':','')


weekly advert leads - summary - cli created


DECODE({custentitytc_status}, 'TC Prospect - Lost',{internalid},null) + DECODE({custentitytc_status}, 'Prospect - LOST do not contact',{internalid},null)
+ DECODE({custentitytc_status}, 'DO NOT CALL',{internalid},null)
+DECODE({custentitytc_status}, 'TC - Lead LOST',{internalid},null) + DECODE({custentitytc_status}, 'Lead - LOST do not contact',{internalid},null)


CASE WHEN
{custentitytc_status} in ('TC Prospect - LOST', 'Prospect - LOST do not contact', 'DO NOT CALL', 'TC - Lead LOST', 'Lead - LOST do not contact')
THEN {internalid}
END

DECODE({custentitytc_status}, 'Bad Number',{internalid},null)
+DECODE({custentitytc_status}, 'TC Lead - Bad Number',{internalid},null) +DECODE({custentitytc_status}, 'TC Prospect - Bad Number',{internalid},null)


CASE WHEN
{custentitytc_status} in ('Bad Number', 'TC Lead - Bad Number', 'TC Prospect - Bad Number')
THEN {internalid}
END