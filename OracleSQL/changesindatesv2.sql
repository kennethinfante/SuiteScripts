Sales Opportunities

Formula(Numeric)
Minimum

ABS(DECODE((CASE WHEN {opportunity.custbody28} IN ('Will Quote', 'Undecided?') AND (MONTHS_BETWEEN({today},{opportunity.datecreated}) BETWEEN 0 AND 4)
	THEN TO_DATE({opportunity.datecreated}, 'MM/DD/YYYY') END), NULL, {today}, (CASE WHEN {opportunity.custbody28} IN ('Will Quote', 'Undecided?')AND (MONTHS_BETWEEN({today},{opportunity.datecreated}) BETWEEN 0 AND 4)
	THEN TO_DATE({opportunity.datecreated}, 'MM/DD/YYYY') END))
-
DECODE({custentity_last_opportunity_date}, NULL, {today}, {custentity_last_opportunity_date}))