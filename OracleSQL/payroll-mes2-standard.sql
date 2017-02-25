CASE WHEN {custentity_bir_status} = 'ME2/S2'
THEN
(
CASE
	WHEN
	(({custentity_basic_pay_semi_calc}+ (NVL({custentity_transportation_allowance},0)+ NVL({custentity_rice_subsidy},0)+NVL({custentity_clothing_allowance},0)+NVL({custentity_laundry_allowance},0)+NVL({custentity_mobile_phone_allowance},0))/2
+ {custentity_night_differential}/2*(DECODE( {time.item},'Regular Hours',{time.durationdecimal},0)/8)/10)-{custentity_total_stat_deductions}) > 7083 then 0

	WHEN
	(({custentity_basic_pay_semi_calc}+ (NVL({custentity_transportation_allowance},0)+ NVL({custentity_rice_subsidy},0)+NVL({custentity_clothing_allowance},0)+NVL({custentity_laundry_allowance},0)+NVL({custentity_mobile_phone_allowance},0))/2
+ {custentity_night_differential}/2*(DECODE( {time.item},'Regular Hours',{time.durationdecimal},0)/8)/10)-{custentity_total_stat_deductions}) > 5417 then 0.15*(({custentity_basic_pay_semi_calc}+ (NVL({custentity_transportation_allowance},0)+ NVL({custentity_rice_subsidy},0)+NVL({custentity_clothing_allowance},0)+NVL({custentity_laundry_allowance},0)+NVL({custentity_mobile_phone_allowance},0))/2
+ {custentity_night_differential}/2*(DECODE( {time.item},'Regular Hours',{time.durationdecimal},0)/8)/10)-{custentity_total_stat_deductions}-5417)+104.17

	WHEN
	(({custentity_basic_pay_semi_calc}+ (NVL({custentity_transportation_allowance},0)+ NVL({custentity_rice_subsidy},0)+NVL({custentity_clothing_allowance},0)+NVL({custentity_laundry_allowance},0)+NVL({custentity_mobile_phone_allowance},0))/2
+ {custentity_night_differential}/2*(DECODE( {time.item},'Regular Hours',{time.durationdecimal},0)/8)/10)-{custentity_total_stat_deductions}) > 4583 then 0.10*(({custentity_basic_pay_semi_calc}+ (NVL({custentity_transportation_allowance},0)+ NVL({custentity_rice_subsidy},0)+NVL({custentity_clothing_allowance},0)+NVL({custentity_laundry_allowance},0)+NVL({custentity_mobile_phone_allowance},0))/2
+ {custentity_night_differential}/2*(DECODE( {time.item},'Regular Hours',{time.durationdecimal},0)/8)/10)-{custentity_total_stat_deductions}-4583)+20.83

	ELSE
	0.5*(({custentity_basic_pay_semi_calc}+ (NVL({custentity_transportation_allowance},0)+ NVL({custentity_rice_subsidy},0)+NVL({custentity_clothing_allowance},0)+NVL({custentity_laundry_allowance},0)+NVL({custentity_mobile_phone_allowance},0))/2
+ {custentity_night_differential}/2*(DECODE( {time.item},'Regular Hours',{time.durationdecimal},0)/8)/10)-{custentity_total_stat_deductions}-4167)
END
)
END

CASE WHEN {custentity_bir_status} = 'ME2/S2'
THEN
(
CASE 
	WHEN
	(({custentity_basic_pay_semi_calc}+ (NVL({custentity_transportation_allowance},0)+ NVL({custentity_rice_subsidy},0)+NVL({custentity_clothing_allowance},0)+NVL({custentity_laundry_allowance},0)+NVL({custentity_mobile_phone_allowance},0))/2
+ {custentity_night_differential}/2*(DECODE( {time.item},'Regular Hours',{time.durationdecimal},0)/8)/10)-{custentity_total_stat_deductions}) > 25000 then 0.32*(({custentity_basic_pay_semi_calc}+ (NVL({custentity_transportation_allowance},0)+ NVL({custentity_rice_subsidy},0)+NVL({custentity_clothing_allowance},0)+NVL({custentity_laundry_allowance},0)+NVL({custentity_mobile_phone_allowance},0))/2
+ {custentity_night_differential}/2*(DECODE( {time.item},'Regular Hours',{time.durationdecimal},0)/8)/10)-{custentity_total_stat_deductions}-25000)+5208.33

	WHEN
	(({custentity_basic_pay_semi_calc}+ (NVL({custentity_transportation_allowance},0)+ NVL({custentity_rice_subsidy},0)+NVL({custentity_clothing_allowance},0)+NVL({custentity_laundry_allowance},0)+NVL({custentity_mobile_phone_allowance},0))/2
+ {custentity_night_differential}/2*(DECODE( {time.item},'Regular Hours',{time.durationdecimal},0)/8)/10)-{custentity_total_stat_deductions}) > 14583 then 0.30*(({custentity_basic_pay_semi_calc}+ (NVL({custentity_transportation_allowance},0)+ NVL({custentity_rice_subsidy},0)+NVL({custentity_clothing_allowance},0)+NVL({custentity_laundry_allowance},0)+NVL({custentity_mobile_phone_allowance},0))/2
+ {custentity_night_differential}/2*(DECODE( {time.item},'Regular Hours',{time.durationdecimal},0)/8)/10)-{custentity_total_stat_deductions}-14583)+2083.33

	WHEN
	(({custentity_basic_pay_semi_calc}+ (NVL({custentity_transportation_allowance},0)+ NVL({custentity_rice_subsidy},0)+NVL({custentity_clothing_allowance},0)+NVL({custentity_laundry_allowance},0)+NVL({custentity_mobile_phone_allowance},0))/2
+ {custentity_night_differential}/2*(DECODE( {time.item},'Regular Hours',{time.durationdecimal},0)/8)/10)-{custentity_total_stat_deductions}) > 10000 then 0.25*(({custentity_basic_pay_semi_calc}+ (NVL({custentity_transportation_allowance},0)+ NVL({custentity_rice_subsidy},0)+NVL({custentity_clothing_allowance},0)+NVL({custentity_laundry_allowance},0)+NVL({custentity_mobile_phone_allowance},0))/2
+ {custentity_night_differential}/2*(DECODE( {time.item},'Regular Hours',{time.durationdecimal},0)/8)/10)-{custentity_total_stat_deductions}-10000)+937.50
	WHEN
	(({custentity_basic_pay_semi_calc}+ (NVL({custentity_transportation_allowance},0)+ NVL({custentity_rice_subsidy},0)+NVL({custentity_clothing_allowance},0)+NVL({custentity_laundry_allowance},0)+NVL({custentity_mobile_phone_allowance},0))/2
+ {custentity_night_differential}/2*(DECODE( {time.item},'Regular Hours',{time.durationdecimal},0)/8)/10)-{custentity_total_stat_deductions}) > 7083 then 0.20*(({custentity_basic_pay_semi_calc}+ (NVL({custentity_transportation_allowance},0)+ NVL({custentity_rice_subsidy},0)+NVL({custentity_clothing_allowance},0)+NVL({custentity_laundry_allowance},0)+NVL({custentity_mobile_phone_allowance},0))/2
+ {custentity_night_differential}/2*(DECODE( {time.item},'Regular Hours',{time.durationdecimal},0)/8)/10)-{custentity_total_stat_deductions}-7083)+354.17

	ELSE
	0
END
)
END

CASE
WHEN ROUND(TRUNC({custentity_sss_half_deduction}/0.0363, -1)*0.07366,1) >= 1105
THEN ROUND(TRUNC({custentity_sss_half_deduction}/0.0363, -1)*0.07366,1) + 30
ELSE ROUND(TRUNC({custentity_sss_half_deduction}/0.0363, -1)*0.07366,1) + 10
END


({custentity_basic_salary}+NVL({custentity_transportation_allowance},0)+ NVL({custentity_rice_subsidy},0)+NVL({custentity_clothing_allowance},0)+NVL({custentity_laundry_allowance},0)+NVL({custentity_mobile_phone_allowance},0)+NVL({custentity_night_differential},0))+
(((CASE WHEN ROUND(TRUNC({custentity_sss_half_deduction}/0.0363, -1)*0.07366,1) >= 1105 THEN ROUND(TRUNC({custentity_sss_half_deduction}/0.0363, -1)*0.07366,1) + 30 ELSE ROUND(TRUNC({custentity_sss_half_deduction}/0.0363, -1)*0.07366,1) + 10 END)+{custentity_philhealth}+{custentity_pagibig_half})*2)+
(({custentity_basic_salary}+NVL({custentity_night_differential},0))/12)