-- not done
CASE
WHEN {today} BETWEEN (LAST_DAY(ADD_MONTHS({today}, -1))+1) AND (LAST_DAY(ADD_MONTHS({today}, -1))+15)
THEN
(
	CASE
	WHEN {releasedate} IS NULL
	THEN
		(
			CASE WHEN
			{hiredate} BETWEEN (LAST_DAY(ADD_MONTHS({today}, -1))+1) AND (LAST_DAY(ADD_MONTHS({today}, -1))+15)
			THEN 
			((LAST_DAY(ADD_MONTHS({today}, -1))+15)-{hiredate})/15*
			({custentity_basic_pay_semi_calc}+ (NVL({custentity_transportation_allowance},0)+ NVL({custentity_rice_subsidy},0)+NVL({custentity_clothing_allowance},0)+NVL({custentity_laundry_allowance},0)+NVL({custentity_mobile_phone_allowance},0))/2)
			ELSE
			({custentity_basic_pay_semi_calc}+ (NVL({custentity_transportation_allowance},0)+ NVL({custentity_rice_subsidy},0)+NVL({custentity_clothing_allowance},0)+NVL({custentity_laundry_allowance},0)+NVL({custentity_mobile_phone_allowance},0))/2)
		)
	WHEN {releasedate} IS NOT NULL
	THEN
		(
			CASE WHEN
			{releasedate} BETWEEN (LAST_DAY(ADD_MONTHS({today}, -1))+1) AND (LAST_DAY(ADD_MONTHS({today}, -1))+15)
			THEN 
			({releasedate}-(LAST_DAY(ADD_MONTHS({today}, -1))+1))/15*
			({custentity_basic_pay_semi_calc}+ (NVL({custentity_transportation_allowance},0)+ NVL({custentity_rice_subsidy},0)+NVL({custentity_clothing_allowance},0)+NVL({custentity_laundry_allowance},0)+NVL({custentity_mobile_phone_allowance},0))/2)
			ELSE
			({custentity_basic_pay_semi_calc}+ (NVL({custentity_transportation_allowance},0)+ NVL({custentity_rice_subsidy},0)+NVL({custentity_clothing_allowance},0)+NVL({custentity_laundry_allowance},0)+NVL({custentity_mobile_phone_allowance},0))/2)
		)

)
WHEN {today} BETWEEN (LAST_DAY(ADD_MONTHS({today}, -1))+16) AND (LAST_DAY({today}))
THEN
(
	CASE
	WHEN {releasedate} IS NULL
	THEN
		(
			CASE WHEN
			{hiredate} BETWEEN (LAST_DAY(ADD_MONTHS({today}, -1))+16) AND (LAST_DAY({today}))
			THEN 
			((LAST_DAY({today}))-{hiredate})/15*
			({custentity_basic_pay_semi_calc}+ (NVL({custentity_transportation_allowance},0)+ NVL({custentity_rice_subsidy},0)+NVL({custentity_clothing_allowance},0)+NVL({custentity_laundry_allowance},0)+NVL({custentity_mobile_phone_allowance},0))/2)
			ELSE
			({custentity_basic_pay_semi_calc}+ (NVL({custentity_transportation_allowance},0)+ NVL({custentity_rice_subsidy},0)+NVL({custentity_clothing_allowance},0)+NVL({custentity_laundry_allowance},0)+NVL({custentity_mobile_phone_allowance},0))/2)
		)
	WHEN {releasedate} IS NOT NULL
	THEN
		(
			CASE WHEN
			{releasedate} BETWEEN (LAST_DAY(ADD_MONTHS({today}, -1))+1) AND (LAST_DAY(ADD_MONTHS({today}, -1))+15)
			THEN 
			({releasedate}-(LAST_DAY(ADD_MONTHS({today}, -1))+1))/15*
			({custentity_basic_pay_semi_calc}+ (NVL({custentity_transportation_allowance},0)+ NVL({custentity_rice_subsidy},0)+NVL({custentity_clothing_allowance},0)+NVL({custentity_laundry_allowance},0)+NVL({custentity_mobile_phone_allowance},0))/2)
			ELSE
			({custentity_basic_pay_semi_calc}+ (NVL({custentity_transportation_allowance},0)+ NVL({custentity_rice_subsidy},0)+NVL({custentity_clothing_allowance},0)+NVL({custentity_laundry_allowance},0)+NVL({custentity_mobile_phone_allowance},0))/2)
		)

)

-- service incentive leave
({custentity_basic_pay_semi_calc} * 2 * 12 / 264)*5/12


-- nature of work
CASE WHEN {internalid} IN (37284, 37388)
THEN {internalid}
END

CASE WHEN {internalid} IN (37386, 37385)
THEN {internalid}
END

CASE WHEN {internalid} NOT IN (37284, 37388, 37386, 37385)
THEN {internalid}
END

DECODE({custentity_address_cdc_report}, 'Angeles', {internalid}, null)
DECODE({custentity_address_cdc_report}, 'Mabalacat', {internalid}, null)
DECODE({custentity_address_cdc_report}, 'Porac', {internalid}, null)
DECODE({custentity_address_cdc_report}, 'Other Pampanga Areas', {internalid}, null)

-- gender
CASE
WHEN {custentity_gender} = 'Male'
THEN {internalid}
END
DECODE({custentity_gender}, 'Male', {internalid}, null)
CASE
WHEN {custentity_gender} = 'Female'
THEN {internalid}
END
DECODE({custentity_gender}, 'Female', {internalid}, null)


-- Probation
DECODE({custentity_emp_status}, 'Probationary', {internalid}, null)
DECODE({custentity_emp_status}, 'Finished Probation', {internalid}, null)




-- Hired This Month
{hiredate} BETWEEN (LAST_DAY(ADD_MONTHS({today}, -1))+1) AND (LAST_DAY({today}))

-- Separated This Month
CASE WHEN ({releasedate} IS NOT NULL) AND {releasedate} BETWEEN (LAST_DAY(ADD_MONTHS({today}, -1))+1) AND (LAST_DAY({today}))THEN {internalid}END