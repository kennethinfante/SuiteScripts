CASE WHEN {custentity_bir_status} = 'S/ME'
THEN
(
CASE
	WHEN
	(({custentity_basic_pay_semi_calc}+ (NVL({custentity_transportation_allowance},0)+ NVL({custentity_rice_subsidy},0)+NVL({custentity_clothing_allowance},0)+NVL({custentity_laundry_allowance},0)+NVL({custentity_mobile_phone_allowance},0))/2
+ {custentity_night_differential}/2*(DECODE( {time.item},'Regular Hours',{time.durationdecimal},0)/8)/10)-{custentity_total_stat_deductions}) > 5000 then 0

	WHEN
	(({custentity_basic_pay_semi_calc}+ (NVL({custentity_transportation_allowance},0)+ NVL({custentity_rice_subsidy},0)+NVL({custentity_clothing_allowance},0)+NVL({custentity_laundry_allowance},0)+NVL({custentity_mobile_phone_allowance},0))/2
+ {custentity_night_differential}/2*(DECODE( {time.item},'Regular Hours',{time.durationdecimal},0)/8)/10)-{custentity_total_stat_deductions}) > 3333 then 0.15*(({custentity_basic_pay_semi_calc}+ (NVL({custentity_transportation_allowance},0)+ NVL({custentity_rice_subsidy},0)+NVL({custentity_clothing_allowance},0)+NVL({custentity_laundry_allowance},0)+NVL({custentity_mobile_phone_allowance},0))/2
+ {custentity_night_differential}/2*(DECODE( {time.item},'Regular Hours',{time.durationdecimal},0)/8)/10)-{custentity_total_stat_deductions}-3333)+104.17

	WHEN
	(({custentity_basic_pay_semi_calc}+ (NVL({custentity_transportation_allowance},0)+ NVL({custentity_rice_subsidy},0)+NVL({custentity_clothing_allowance},0)+NVL({custentity_laundry_allowance},0)+NVL({custentity_mobile_phone_allowance},0))/2
+ {custentity_night_differential}/2*(DECODE( {time.item},'Regular Hours',{time.durationdecimal},0)/8)/10)-{custentity_total_stat_deductions}) > 2500 then 0.10*(({custentity_basic_pay_semi_calc}+ (NVL({custentity_transportation_allowance},0)+ NVL({custentity_rice_subsidy},0)+NVL({custentity_clothing_allowance},0)+NVL({custentity_laundry_allowance},0)+NVL({custentity_mobile_phone_allowance},0))/2
+ {custentity_night_differential}/2*(DECODE( {time.item},'Regular Hours',{time.durationdecimal},0)/8)/10)-{custentity_total_stat_deductions}-2500)+20.83

	ELSE
	0.5*(({custentity_basic_pay_semi_calc}+ (NVL({custentity_transportation_allowance},0)+ NVL({custentity_rice_subsidy},0)+NVL({custentity_clothing_allowance},0)+NVL({custentity_laundry_allowance},0)+NVL({custentity_mobile_phone_allowance},0))/2
+ {custentity_night_differential}/2*(DECODE( {time.item},'Regular Hours',{time.durationdecimal},0)/8)/10)-{custentity_total_stat_deductions}-2083)
END
)
END

CASE WHEN {custentity_bir_status} = 'S/ME'
THEN
(
CASE 
	WHEN
	(({custentity_basic_pay_semi_calc}+ (NVL({custentity_transportation_allowance},0)+ NVL({custentity_rice_subsidy},0)+NVL({custentity_clothing_allowance},0)+NVL({custentity_laundry_allowance},0)+NVL({custentity_mobile_phone_allowance},0))/2
+ {custentity_night_differential}/2*(DECODE( {time.item},'Regular Hours',{time.durationdecimal},0)/8)/10)-{custentity_total_stat_deductions}) > 22917 then 0.32*(({custentity_basic_pay_semi_calc}+ (NVL({custentity_transportation_allowance},0)+ NVL({custentity_rice_subsidy},0)+NVL({custentity_clothing_allowance},0)+NVL({custentity_laundry_allowance},0)+NVL({custentity_mobile_phone_allowance},0))/2
+ {custentity_night_differential}/2*(DECODE( {time.item},'Regular Hours',{time.durationdecimal},0)/8)/10)-{custentity_total_stat_deductions}-22917)+5208.33

	WHEN
	(({custentity_basic_pay_semi_calc}+ (NVL({custentity_transportation_allowance},0)+ NVL({custentity_rice_subsidy},0)+NVL({custentity_clothing_allowance},0)+NVL({custentity_laundry_allowance},0)+NVL({custentity_mobile_phone_allowance},0))/2
+ {custentity_night_differential}/2*(DECODE( {time.item},'Regular Hours',{time.durationdecimal},0)/8)/10)-{custentity_total_stat_deductions}) > 12500 then 0.30*(({custentity_basic_pay_semi_calc}+ (NVL({custentity_transportation_allowance},0)+ NVL({custentity_rice_subsidy},0)+NVL({custentity_clothing_allowance},0)+NVL({custentity_laundry_allowance},0)+NVL({custentity_mobile_phone_allowance},0))/2
+ {custentity_night_differential}/2*(DECODE( {time.item},'Regular Hours',{time.durationdecimal},0)/8)/10)-{custentity_total_stat_deductions}-12500)+2083.33

	WHEN
	(({custentity_basic_pay_semi_calc}+ (NVL({custentity_transportation_allowance},0)+ NVL({custentity_rice_subsidy},0)+NVL({custentity_clothing_allowance},0)+NVL({custentity_laundry_allowance},0)+NVL({custentity_mobile_phone_allowance},0))/2
+ {custentity_night_differential}/2*(DECODE( {time.item},'Regular Hours',{time.durationdecimal},0)/8)/10)-{custentity_total_stat_deductions}) > 7917 then 0.25*(({custentity_basic_pay_semi_calc}+ (NVL({custentity_transportation_allowance},0)+ NVL({custentity_rice_subsidy},0)+NVL({custentity_clothing_allowance},0)+NVL({custentity_laundry_allowance},0)+NVL({custentity_mobile_phone_allowance},0))/2
+ {custentity_night_differential}/2*(DECODE( {time.item},'Regular Hours',{time.durationdecimal},0)/8)/10)-{custentity_total_stat_deductions}-7917)+937.50
	WHEN
	(({custentity_basic_pay_semi_calc}+ (NVL({custentity_transportation_allowance},0)+ NVL({custentity_rice_subsidy},0)+NVL({custentity_clothing_allowance},0)+NVL({custentity_laundry_allowance},0)+NVL({custentity_mobile_phone_allowance},0))/2
+ {custentity_night_differential}/2*(DECODE( {time.item},'Regular Hours',{time.durationdecimal},0)/8)/10)-{custentity_total_stat_deductions}) > 5000 then 0.20*(({custentity_basic_pay_semi_calc}+ (NVL({custentity_transportation_allowance},0)+ NVL({custentity_rice_subsidy},0)+NVL({custentity_clothing_allowance},0)+NVL({custentity_laundry_allowance},0)+NVL({custentity_mobile_phone_allowance},0))/2
+ {custentity_night_differential}/2*(DECODE( {time.item},'Regular Hours',{time.durationdecimal},0)/8)/10)-{custentity_total_stat_deductions}-5000)+354.17

	ELSE
	0
END
)
END