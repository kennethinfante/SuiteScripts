CASE WHEN
SUM(CASE WHEN {transaction.accounttype} = 'Cost of Goods Sold' AND {transaction.posting} = 'T' THEN {transaction.amount} ELSE 0 END /
	{custentity_budgeted_costs_percentage})) > {custentity6}
THEN 0
ELSE SUM(CASE WHEN {transaction.accounttype} = 'Cost of Goods Sold' AND {transaction.posting} = 'T' THEN {transaction.amount} ELSE 0 END / {custentity_budgeted_costs_percentage})
END

--
LEAST(SUM(CASE WHEN {transaction.accounttype} = 'Cost of Goods Sold' AND {transaction.posting} = 'T' THEN {transaction.amount} ELSE 0 END
	/ {custentity_budgeted_costs_percentage}),({custentity_total_cost_val}/{custentity_budgeted_costs_percentage}),{custentity6})

LEAST(GREATEST(SUM(CASE WHEN {transaction.accounttype} = 'Cost of Goods Sold' AND {transaction.posting} = 'T' THEN {transaction.amount} ELSE 0 END
	/ {custentity_budgeted_costs_percentage})),LEAST(({custentity_total_cost_val}/{custentity_budgeted_costs_percentage}),{custentity6}))

--

CASE WHEN
SUM(CASE WHEN {transaction.accounttype} = 'Cost of Goods Sold' AND {transaction.posting} = 'T' THEN {transaction.amount} ELSE 0 END
	/ {custentity_budgeted_costs_percentage}) > LEAST(({custentity_total_cost_val}/{custentity_budgeted_costs_percentage}),{custentity6})
THEN 0
ELSE SUM(CASE WHEN {transaction.accounttype} = 'Cost of Goods Sold' AND {transaction.posting} = 'T' THEN {transaction.amount} ELSE 0 END
	/ {custentity_budgeted_costs_percentage})
END
--
CASE WHEN
SUM(CASE WHEN {transaction.accounttype} = 'Cost of Goods Sold' AND {transaction.posting} = 'T' THEN {transaction.amount} ELSE 0 END
	/ {custentity_budgeted_costs_percentage}) > 
TO_NUMBER(CASE WHEN {custentity_total_cost_val}/{custentity_budgeted_costs_percentage} > {custentity6}
	then {custentity6} else {custentity_total_cost_val}/{custentity_budgeted_costs_percentage}  END)
THEN 0
ELSE SUM(CASE WHEN {transaction.accounttype} = 'Cost of Goods Sold' AND {transaction.posting} = 'T' THEN {transaction.amount} ELSE 0 END / {custentity_budgeted_costs_percentage})
END

-- 
CASE WHEN
RANK(SUM(CASE WHEN {transaction.accounttype} = 'Cost of Goods Sold' AND {transaction.posting} = 'T' THEN {transaction.amount} ELSE 0 END / {custentity_budgeted_costs_percentage})) > {custentity6}
THEN 0
ELSE SUM(CASE WHEN {transaction.accounttype} = 'Cost of Goods Sold' AND {transaction.posting} = 'T' THEN {transaction.amount} ELSE 0 END / {custentity_budgeted_costs_percentage})
END

SUM(CASE WHEN {transaction.accounttype} = 'Cost of Goods Sold' AND {transaction.posting} = 'T' THEN {transaction.amount} ELSE 0 END / {custentity_budgeted_costs_percentage})