CASE WHEN
({custentity_last_sale_1000} IS NOT NULL) THEN
(
	CASE WHEN MONTHS_BETWEEN({today}, {custentity_last_sale_1000}) BETWEEN 0 AND 6 THEN '1. Active Client'
	ELSE
	(
		CASE WHEN MONTHS_BETWEEN({today}, {custentity_last_sale_1000}) BETWEEN 6.01 AND 12 THEN '2. At Risk Client'
		ELSE
		(
			CASE WHEN (MONTHS_BETWEEN({today}, {custentity_last_sale_1000}) BETWEEN 12.01 AND 15) AND
			({custentity_sales_cycle_last_event_date} IS NULL) AND ({custentity_last_quote_date} IS NULL) AND
				({custentity_last_opportunity_date} IS NULL)
			THEN '3. Lost Client'
			ELSE
			(

				CASE WHEN (({custentity_sales_cycle_last_event_date} IS NOT NULL) OR ({custentity_last_quote_date}
				IS NOT NULL) OR ({custentity_last_opportunity_date} IS NOT NULL))
				THEN '4. Active Prospect'
				ELSE ''
				END

			)
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

{custentity_total_costs_value}/(100%-{custentity65})


CASE WHEN (CASE WHEN({custentity_last_sale_1000} IS NOT NULL) THEN(	CASE WHEN MONTHS_BETWEEN({today}, {custentity_last_sale_1000}) BETWEEN 0 AND 6 THEN '1. Active Client'	ELSE	(		CASE WHEN MONTHS_BETWEEN({today}, {custentity_last_sale_1000}) BETWEEN 6.01 AND 12 THEN '2. At Risk Client'		ELSE		(			CASE WHEN (MONTHS_BETWEEN({today}, {custentity_last_sale_1000}) BETWEEN 12.01 AND 15) AND			({custentity_sales_cycle_last_event_date} IS NULL) AND ({custentity_last_quote_date} IS NULL) AND				({custentity_last_opportunity_date} IS NULL)			THEN '3. Lost Client'			ELSE			(				CASE WHEN (({custentity_sales_cycle_last_event_date} IS NOT NULL) OR ({custentity_last_quote_date}				IS NOT NULL) OR ({custentity_last_opportunity_date} IS NOT NULL))				THEN '4. Active Prospect'				ELSE ''				END			)			END		)		END	)	END)ELSE(	CASE WHEN (({custentity_sales_cycle_last_event_date} IS NOT NULL) OR ({custentity_last_quote_date}	IS NOT NULL) OR ({custentity_last_opportunity_date} IS NOT NULL))	THEN '4. Active Prospect'	ELSE ''	END)END) != {custentity_pending_status_update_v2} THEN 1 ELSE 0 END


