-- total earned
-- total costs > budgeted costs THEN revenue else total costs/(1-actual GP%)
CASE WHEN {custentity_total_cost_val} > ({custentity6}*(1-NVL({custentity153},0))) THEN {custentity6} ELSE {custentity_total_cost_val} / (1-NVL({custentity153},0)) END

CASE WHEN
NVL({custentity_total_cost_val}, 0) > NVL(({custentity6}*(1-NVL({custentity153},0))),0)
THEN NVL({custentity6},0)
ELSE NVL({custentity_total_cost_val} / (1-NVL({custentity153},0)),0)
END


-- earned but unbilled
-- total billed < revenue then total earned - total billed else 0
CASE WHEN
{custentity_amount_invoiced} < {custentity6} THEN
(CASE WHEN {custentity_total_cost_val} > ({custentity6}*(1-NVL({custentity153},0))) THEN {custentity6} ELSE {custentity_total_cost_val} / (1-NVL({custentity153},0))  END) - {custentity_amount_invoiced}
ELSE 0
END


CASE WHEN
{custentity_amount_invoiced} < {custentity6} THEN
NVL((CASE WHEN {custentity_total_cost_val} > ({custentity6}*(1-NVL({custentity153},0))) THEN {custentity6} ELSE {custentity_total_cost_val} / (1-NVL({custentity153},0))  END),0) - NVL({custentity_amount_invoiced},0)
ELSE 0
END

CASE WHEN
NVL({custentity_amount_invoiced},0) < NVL({custentity6},0) THEN
NVL((CASE WHEN {custentity_total_cost_val} > ({custentity6}*(1-NVL({custentity153},0))) THEN {custentity6} ELSE {custentity_total_cost_val} / (1-NVL({custentity153},0))  END),0) - NVL({custentity_amount_invoiced},0)
ELSE 0
END

-- status
CASE WHEN
(CASE WHEN
{custentity_amount_invoiced} < {custentity6} THEN
(CASE WHEN {custentity_total_cost_val} > ({custentity6}*(1-NVL({custentity153},0))) THEN {custentity6} ELSE {custentity_total_cost_val} / (1-NVL({custentity153},0))  END) - {custentity_amount_invoiced}
ELSE 0
END) < 0
THEN 
'<span style="color:red">'||{status}||'<span>'
ELSE
{status}
END

CASE WHEN
(CASE WHEN
{custentity_amount_invoiced} < {custentity6} THEN
NVL((CASE WHEN {custentity_total_cost_val} > ({custentity6}*(1-NVL({custentity153},0))) THEN {custentity6} ELSE {custentity_total_cost_val} / (1-NVL({custentity153},0))  END),0) - NVL({custentity_amount_invoiced},0)
ELSE 0
END) < 0
THEN 
'<span style="color:red">'||{status}||'<span>'
ELSE
{status}
END

CASE WHEN
(CASE WHEN
NVL({custentity_amount_invoiced},0) < NVL({custentity6},0) THEN
NVL((CASE WHEN {custentity_total_cost_val} > ({custentity6}*(1-NVL({custentity153},0))) THEN {custentity6} ELSE {custentity_total_cost_val} / (1-NVL({custentity153},0))  END),0) - NVL({custentity_amount_invoiced},0)
ELSE 0
END) < 0
THEN 
'<span style="color:red">'||{status}||'<span>'
ELSE
{status}
END