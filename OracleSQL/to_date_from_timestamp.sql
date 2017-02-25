DECODE(TO_DATE(TO_CHAR({createddate}, 'DD/MM/YYYY'), 'DD/MM/YYYY'), {today}, 1, 0)

DECODE(regexp_substr({createddate}, '^\d*/\d*/\d*'), {today}, 1, 0)
DECODE(regexp_substr({createddate}, '^\d*/\d*/\d*'), {today}, 1, 0)

CASE WHEN
(to_date(regexp_substr({createddate}, '^\d*/\d*/\d*')) = TO_DATE({today}, 'DD/MM/YYYY'))
THEN 1
ELSE 0

END

CASE WHEN
(to_date(regexp_substr({createddate}, '^\d*/\d*/\d*')) = (TO_DATE({today}, 'DD/MM/YYYY')-1) )
THEN 1
ELSE 0

END

CASE WHEN
(to_date(regexp_substr({createddate}, '^\d*/\d*/\d*')) = (TO_DATE({today}, 'DD/MM/YYYY')-7) )
THEN 1
ELSE 0

END

CASE WHEN
(TO_CHAR({today}, 'IW') - TO_CHAR({createddate}, 'IW') ) = 0
THEN 1
ELSE 0

END

CASE WHEN
(TO_CHAR({today}, 'IW') - TO_CHAR({createddate}, 'IW') ) = 1
THEN 1
ELSE 0

END

CASE WHEN
(TO_CHAR({today}, 'MM') - TO_CHAR({createddate}, 'MM') ) = 0
THEN 1
ELSE 0

END

CASE WHEN
(TO_CHAR({today}, 'MM') - TO_CHAR({createddate}, 'MM') ) BETWEEN 0 AND 1
THEN 1
ELSE 0

END