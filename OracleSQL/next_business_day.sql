CASE WHEN
{custentity_last_contact_date_field} IS NOT NULL
THEN
(
CASE WHEN
{custentity_frequency} = 'Monthly'
THEN 
(
	CASE WHEN TO_CHAR(ADD_MONTHS({custentity_last_contact_date_field}, 1), 'd') NOT IN (1, 7) 
	THEN ADD_MONTHS({custentity_last_contact_date_field}, 1)
	ELSE
		(
			CASE WHEN TO_CHAR(ADD_MONTHS({custentity_last_contact_date_field}, 1), 'd') = 7
			THEN ADD_MONTHS({custentity_last_contact_date_field}, 1) + 2
			ELSE ADD_MONTHS({custentity_last_contact_date_field}, 1) + 1
			END
		)
	END
)

ELSE
	(CASE WHEN
	{custentity_frequency} = 'Weekly'
	THEN
	(
		CASE WHEN TO_CHAR({custentity_last_contact_date_field} + 7, 'd') NOT IN (1, 7) 
		THEN {custentity_last_contact_date_field} + 7
		ELSE
			(
				CASE WHEN TO_CHAR({custentity_last_contact_date_field} + 7, 'd') = 7
				THEN {custentity_last_contact_date_field} + 7 + 2
				ELSE {custentity_last_contact_date_field} + 7 + 1
				END
			)
		END
	)
	ELSE
	(
		CASE WHEN TO_CHAR({custentity_last_contact_date_field} + 1, 'd') NOT IN (1, 7) 
		THEN {custentity_last_contact_date_field} + 1
		ELSE
			(
				CASE WHEN TO_CHAR({custentity_last_contact_date_field} + 1, 'd') = 7
				THEN {custentity_last_contact_date_field} + 1 + 2
				ELSE {custentity_last_contact_date_field} + 1 + 1
				END
			)
		END
	)

	END)
END
)
END