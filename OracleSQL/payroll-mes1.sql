CASE WHEN {custentity_bir_status} = 'ME1/S1'
THEN
(
CASE
	WHEN
	({custentity_basic_pay_semi_calc}
	+ {custentity_night_differential}/2*(DECODE( {time.item},'Regular Hours',{time.durationdecimal},0)/8)/10
	- DECODE({time.item},'Leave Without Pay',{time.durationdecimal},0,{time.item},'Sick Leave',{time.durationdecimal},0,{time.item},'Vacation Leave',{time.durationdecimal},0 )/8 * {custentity_basic_pay_semi_calc} * 2 * 12 / 264 
	-{custentity_total_stat_deductions}) > 6042 then 0

	WHEN
	({custentity_basic_pay_semi_calc}
	+ {custentity_night_differential}/2*(DECODE( {time.item},'Regular Hours',{time.durationdecimal},0)/8)/10
	- DECODE({time.item},'Leave Without Pay',{time.durationdecimal},0,{time.item},'Sick Leave',{time.durationdecimal},0,{time.item},'Vacation Leave',{time.durationdecimal},0 )/8 * {custentity_basic_pay_semi_calc} * 2 * 12 / 264 
	-{custentity_total_stat_deductions}) > 4375 then 0.15*({custentity_basic_pay_semi_calc}
	+ {custentity_night_differential}/2*(DECODE( {time.item},'Regular Hours',{time.durationdecimal},0)/8)/10
	- DECODE({time.item},'Leave Without Pay',{time.durationdecimal},0,{time.item},'Sick Leave',{time.durationdecimal},0,{time.item},'Vacation Leave',{time.durationdecimal},0 )/8 * {custentity_basic_pay_semi_calc} * 2 * 12 / 264 
	-{custentity_total_stat_deductions}-4375)+104.17

	WHEN
	({custentity_basic_pay_semi_calc}
	+ {custentity_night_differential}/2*(DECODE( {time.item},'Regular Hours',{time.durationdecimal},0)/8)/10
	- DECODE({time.item},'Leave Without Pay',{time.durationdecimal},0,{time.item},'Sick Leave',{time.durationdecimal},0,{time.item},'Vacation Leave',{time.durationdecimal},0 )/8 * {custentity_basic_pay_semi_calc} * 2 * 12 / 264 
	-{custentity_total_stat_deductions}) > 3542 then 0.10*({custentity_basic_pay_semi_calc}
	+ {custentity_night_differential}/2*(DECODE( {time.item},'Regular Hours',{time.durationdecimal},0)/8)/10
	- DECODE({time.item},'Leave Without Pay',{time.durationdecimal},0,{time.item},'Sick Leave',{time.durationdecimal},0,{time.item},'Vacation Leave',{time.durationdecimal},0 )/8 * {custentity_basic_pay_semi_calc} * 2 * 12 / 264 
	-{custentity_total_stat_deductions}-3542)+20.83

	ELSE
	0.5*({custentity_basic_pay_semi_calc}
	+ {custentity_night_differential}/2*(DECODE( {time.item},'Regular Hours',{time.durationdecimal},0)/8)/10
	- DECODE({time.item},'Leave Without Pay',{time.durationdecimal},0,{time.item},'Sick Leave',{time.durationdecimal},0,{time.item},'Vacation Leave',{time.durationdecimal},0 )/8 * {custentity_basic_pay_semi_calc} * 2 * 12 / 264 
	-{custentity_total_stat_deductions}-3125)
END
)
END

CASE WHEN {custentity_bir_status} = 'ME1/S1'
THEN
(
CASE 
	WHEN
	({custentity_basic_pay_semi_calc}
	+ {custentity_night_differential}/2*(DECODE( {time.item},'Regular Hours',{time.durationdecimal},0)/8)/10
	- DECODE({time.item},'Leave Without Pay',{time.durationdecimal},0,{time.item},'Sick Leave',{time.durationdecimal},0,{time.item},'Vacation Leave',{time.durationdecimal},0 )/8 * {custentity_basic_pay_semi_calc} * 2 * 12 / 264 
	-{custentity_total_stat_deductions}) > 23958 then 0.32*({custentity_basic_pay_semi_calc}
	+ {custentity_night_differential}/2*(DECODE( {time.item},'Regular Hours',{time.durationdecimal},0)/8)/10
	- DECODE({time.item},'Leave Without Pay',{time.durationdecimal},0,{time.item},'Sick Leave',{time.durationdecimal},0,{time.item},'Vacation Leave',{time.durationdecimal},0 )/8 * {custentity_basic_pay_semi_calc} * 2 * 12 / 264 
	-{custentity_total_stat_deductions}-23958)+5208.33

	WHEN
	({custentity_basic_pay_semi_calc}
	+ {custentity_night_differential}/2*(DECODE( {time.item},'Regular Hours',{time.durationdecimal},0)/8)/10
	- DECODE({time.item},'Leave Without Pay',{time.durationdecimal},0,{time.item},'Sick Leave',{time.durationdecimal},0,{time.item},'Vacation Leave',{time.durationdecimal},0 )/8 * {custentity_basic_pay_semi_calc} * 2 * 12 / 264 
	-{custentity_total_stat_deductions}) > 13542 then 0.30*({custentity_basic_pay_semi_calc}
	+ {custentity_night_differential}/2*(DECODE( {time.item},'Regular Hours',{time.durationdecimal},0)/8)/10
	- DECODE({time.item},'Leave Without Pay',{time.durationdecimal},0,{time.item},'Sick Leave',{time.durationdecimal},0,{time.item},'Vacation Leave',{time.durationdecimal},0 )/8 * {custentity_basic_pay_semi_calc} * 2 * 12 / 264 
	-{custentity_total_stat_deductions}-13542)+2083.33

	WHEN
	({custentity_basic_pay_semi_calc}
	+ {custentity_night_differential}/2*(DECODE( {time.item},'Regular Hours',{time.durationdecimal},0)/8)/10
	- DECODE({time.item},'Leave Without Pay',{time.durationdecimal},0,{time.item},'Sick Leave',{time.durationdecimal},0,{time.item},'Vacation Leave',{time.durationdecimal},0 )/8 * {custentity_basic_pay_semi_calc} * 2 * 12 / 264 
	-{custentity_total_stat_deductions}) > 8958 then 0.25*({custentity_basic_pay_semi_calc}
	+ {custentity_night_differential}/2*(DECODE( {time.item},'Regular Hours',{time.durationdecimal},0)/8)/10
	- DECODE({time.item},'Leave Without Pay',{time.durationdecimal},0,{time.item},'Sick Leave',{time.durationdecimal},0,{time.item},'Vacation Leave',{time.durationdecimal},0 )/8 * {custentity_basic_pay_semi_calc} * 2 * 12 / 264 
	-{custentity_total_stat_deductions}-8958)+937.50
	WHEN
	({custentity_basic_pay_semi_calc}
	+ {custentity_night_differential}/2*(DECODE( {time.item},'Regular Hours',{time.durationdecimal},0)/8)/10
	- DECODE({time.item},'Leave Without Pay',{time.durationdecimal},0,{time.item},'Sick Leave',{time.durationdecimal},0,{time.item},'Vacation Leave',{time.durationdecimal},0 )/8 * {custentity_basic_pay_semi_calc} * 2 * 12 / 264 
	-{custentity_total_stat_deductions}) > 6042 then 0.20*({custentity_basic_pay_semi_calc}
	+ {custentity_night_differential}/2*(DECODE( {time.item},'Regular Hours',{time.durationdecimal},0)/8)/10
	- DECODE({time.item},'Leave Without Pay',{time.durationdecimal},0,{time.item},'Sick Leave',{time.durationdecimal},0,{time.item},'Vacation Leave',{time.durationdecimal},0 )/8 * {custentity_basic_pay_semi_calc} * 2 * 12 / 264 
	-{custentity_total_stat_deductions}-6042)+354.17

	ELSE
	0
END
)
END