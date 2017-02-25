------------------------------
-- LAST WORKING SQL FORMULA --
------------------------------
CASE WHEN
TO_CHAR({custentity_last_sale_1000}, 'MM/DD/YYYY') IS NOT NULL THEN
(
	CASE WHEN MONTHS_BETWEEN({today}, {custentity_last_sale_1000}) BETWEEN 0 AND 6 THEN '1. Active Client'
	ELSE
	(
		CASE WHEN MONTHS_BETWEEN({today}, {custentity_last_sale_1000}) BETWEEN 6.01 AND 12 THEN '2. At Risk Client'
		ELSE
		(
			CASE WHEN MONTHS_BETWEEN({today}, {custentity_last_sale_1000}) > 12 AND
			(TO_CHAR({custentity_sales_cycle_last_event_date}, 'MM/DD/YYYY') IS NULL AND TO_CHAR({custentity_last_quote_date}, 'MM/DD/YYYY') IS NULL AND TO_CHAR({custentity_last_opportunity_date}, 'MM/DD/YYYY') IS NULL)
			THEN '3. Lost Client'
			ELSE '4. Active Prospect'
			END
		)
		END
	)
	END

)
ELSE
(

	CASE WHEN TO_CHAR({custentity_sales_cycle_last_event_date}, 'MM/DD/YYYY') IS NOT NULL OR TO_CHAR({custentity_last_quote_date}, 'MM/DD/YYYY')
	IS NOT NULL OR TO_CHAR({custentity_last_opportunity_date}, 'MM/DD/YYYY') IS NOT NULL
	THEN '4. Active Prospect'
	ELSE ''
	END
)
END

------------------------------
-- LAST WORKING SQL FORMULA --
------------------------------

------------------------------
   -- TRY THIS ON WINDOWS --
------------------------------

CASE WHEN
({custentity_last_sale_1000} IS NOT NULL) THEN
(
	CASE WHEN MONTHS_BETWEEN({today}, {custentity_last_sale_1000}) BETWEEN 0 AND 6 THEN '1. Active Client'
	ELSE
	(
		CASE WHEN MONTHS_BETWEEN({today}, {custentity_last_sale_1000}) BETWEEN 6.01 AND 12 THEN '2. At Risk Client'
		ELSE
		(
			CASE WHEN MONTHS_BETWEEN({today}, {custentity_last_sale_1000}) > 12 AND
			(({custentity_sales_cycle_last_event_date} IS NULL) AND ({custentity_last_quote_date} IS NULL) AND ({custentity_last_opportunity_date} IS NULL))
			THEN '3. Lost Client'
			ELSE '4. Active Prospect'
			END
		)
		END
	)
	END

)
ELSE
(

	CASE WHEN (({custentity_sales_cycle_last_event_date} IS NOT NULL) OR ({custentity_last_quote_date}
	IS NOT NULL) OR ({custentity_last_opportunity_date} IS NOT NULL))
	THEN '4. Active Prospect'
	ELSE ''
	END
)
END


-- relevant fields
Last Qualifying Sale - {custentity_last_sale_1000}
Sales Cycle Last Event Date - {custentity_sales_cycle_last_event_date}
Opportunity W/ Opp. Status = Will Quote or Undecided - {custentity_last_opportunity_date}
Quote in Last 120 Days - {custentity_last_quote_date}
Sales Cycle Status - {custentity_pending_status_update_v2}

