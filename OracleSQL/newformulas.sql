-- Referrer Pay Day
CASE WHEN TO_NUMBER(TO_CHAR({hiredate},'dd')) < 6 then LAST_DAY(ADD_MONTHS({hiredate}, -1))+6 WHEN TO_NUMBER(TO_CHAR({hiredate},'dd')) > 22 then LAST_DAY(ADD_MONTHS({hiredate}, 0))+6else LAST_DAY(ADD_MONTHS({hiredate}, -1))+21 END

-- Referrer 90 Days Pay Day
CASE WHEN TO_NUMBER(TO_CHAR(ADD_MONTHS({hiredate},3),'dd')) < 6 then LAST_DAY(ADD_MONTHS({hiredate}, 2))+6 WHEN TO_NUMBER(TO_CHAR(ADD_MONTHS({hiredate},3),'dd')) > 22 then LAST_DAY(ADD_MONTHS({hiredate}, 3))+6 else LAST_DAY(ADD_MONTHS({hiredate}, 2))+21 END

-- Referrer Pay Day with Highlight
CASE
WHEN TO_NUMBER(TO_CHAR({today}, 'dd')) BETWEEN 1 AND 6
THEN
	(CASE WHEN (CASE WHEN TO_NUMBER(TO_CHAR({hiredate},'dd')) < 6 then LAST_DAY(ADD_MONTHS({hiredate}, -1))+6 WHEN TO_NUMBER(TO_CHAR({hiredate},'dd')) > 22 then LAST_DAY(ADD_MONTHS({hiredate}, 0))+6else LAST_DAY(ADD_MONTHS({hiredate}, -1))+21 END)  = TO_DATE(CONCAT('6/',TO_CHAR({today}, 'mm/yyyy')),'dd/mm/yyyy')
	THEN
		'<span style="color:green; font-weight: bold">' || (CASE WHEN TO_NUMBER(TO_CHAR({hiredate},'dd')) < 6 then LAST_DAY(ADD_MONTHS({hiredate}, -1))+6 WHEN TO_NUMBER(TO_CHAR({hiredate},'dd')) > 22
		then LAST_DAY(ADD_MONTHS({hiredate}, 0))+6else LAST_DAY(ADD_MONTHS({hiredate}, -1))+21 END) || '<span>'
	ELSE TO_CHAR(CASE WHEN TO_NUMBER(TO_CHAR({hiredate},'dd')) < 6 then LAST_DAY(ADD_MONTHS({hiredate}, -1))+6 WHEN TO_NUMBER(TO_CHAR({hiredate},'dd')) > 22 then LAST_DAY(ADD_MONTHS({hiredate}, 0))+6else LAST_DAY(ADD_MONTHS({hiredate}, -1))+21 END) END)

WHEN TO_NUMBER(TO_CHAR({today}, 'dd')) BETWEEN 22 AND 31
THEN
	(CASE WHEN (CASE WHEN TO_NUMBER(TO_CHAR({hiredate},'dd')) < 6 then LAST_DAY(ADD_MONTHS({hiredate}, -1))+6 WHEN TO_NUMBER(TO_CHAR({hiredate},'dd')) > 22 then LAST_DAY(ADD_MONTHS({hiredate}, 0))+6else LAST_DAY(ADD_MONTHS({hiredate}, -1))+21 END)  = (LAST_DAY({today})+6)
	THEN
		'<span style="color:green; font-weight: bold">' || (CASE WHEN TO_NUMBER(TO_CHAR({hiredate},'dd')) < 6 then LAST_DAY(ADD_MONTHS({hiredate}, -1))+6 WHEN TO_NUMBER(TO_CHAR({hiredate},'dd')) > 22
		then LAST_DAY(ADD_MONTHS({hiredate}, 0))+6else LAST_DAY(ADD_MONTHS({hiredate}, -1))+21 END) || '<span>'
	ELSE TO_CHAR(CASE WHEN TO_NUMBER(TO_CHAR({hiredate},'dd')) < 6 then LAST_DAY(ADD_MONTHS({hiredate}, -1))+6 WHEN TO_NUMBER(TO_CHAR({hiredate},'dd')) > 22 then LAST_DAY(ADD_MONTHS({hiredate}, 0))+6else LAST_DAY(ADD_MONTHS({hiredate}, -1))+21 END) END)

WHEN TO_NUMBER(TO_CHAR({today}, 'dd')) BETWEEN 7 and 21
THEN
	(CASE WHEN (CASE WHEN TO_NUMBER(TO_CHAR({hiredate},'dd')) < 6 then LAST_DAY(ADD_MONTHS({hiredate}, -1))+6 WHEN TO_NUMBER(TO_CHAR({hiredate},'dd')) > 22 then LAST_DAY(ADD_MONTHS({hiredate}, 0))+6else LAST_DAY(ADD_MONTHS({hiredate}, -1))+21 END)  = TO_DATE(CONCAT('21/',TO_CHAR({today}, 'mm/yyyy')),'dd/mm/yyyy')
	THEN
		'<span style="color:green; font-weight: bold">' || (CASE WHEN TO_NUMBER(TO_CHAR({hiredate},'dd')) < 6 then LAST_DAY(ADD_MONTHS({hiredate}, -1))+6 WHEN TO_NUMBER(TO_CHAR({hiredate},'dd')) > 22 then LAST_DAY(ADD_MONTHS({hiredate}, 0))+6else LAST_DAY(ADD_MONTHS({hiredate}, -1))+21 END) || '<span>'
	ELSE TO_CHAR(CASE WHEN TO_NUMBER(TO_CHAR({hiredate},'dd')) < 6 then LAST_DAY(ADD_MONTHS({hiredate}, -1))+6 WHEN TO_NUMBER(TO_CHAR({hiredate},'dd')) > 22 then LAST_DAY(ADD_MONTHS({hiredate}, 0))+6else LAST_DAY(ADD_MONTHS({hiredate}, -1))+21 END) END)
END

-- Referrer 90 Days Pay Day with Highlight

CASE
WHEN TO_NUMBER(TO_CHAR({today}, 'dd')) BETWEEN 1 AND 6
THEN
	(CASE
	WHEN (CASE WHEN TO_NUMBER(TO_CHAR(ADD_MONTHS({hiredate},3),'dd')) < 6 then LAST_DAY(ADD_MONTHS({hiredate}, 2))+6 WHEN TO_NUMBER(TO_CHAR(ADD_MONTHS({hiredate},3),'dd')) > 22 then LAST_DAY(ADD_MONTHS({hiredate}, 3))+6 else LAST_DAY(ADD_MONTHS({hiredate}, 2))+21 END) = TO_DATE(CONCAT('6/',TO_CHAR({today}, 'mm/yyyy')),'dd/mm/yyyy')
	THEN
		'<span style="color:green; font-weight:bold">' || (CASE WHEN TO_NUMBER(TO_CHAR(ADD_MONTHS({hiredate},3),'dd')) < 6 then LAST_DAY(ADD_MONTHS({hiredate}, 2))+6 WHEN TO_NUMBER(TO_CHAR(ADD_MONTHS({hiredate},3),'dd')) > 22 then LAST_DAY(ADD_MONTHS({hiredate}, 3))+6 else LAST_DAY(ADD_MONTHS({hiredate}, 2))+21 END) || '<span>'
	ELSE TO_CHAR(CASE WHEN TO_NUMBER(TO_CHAR(ADD_MONTHS({hiredate},3),'dd')) < 6 then LAST_DAY(ADD_MONTHS({hiredate}, 2))+6 WHEN TO_NUMBER(TO_CHAR(ADD_MONTHS({hiredate},3),'dd')) > 22 then LAST_DAY(ADD_MONTHS({hiredate}, 3))+6 else LAST_DAY(ADD_MONTHS({hiredate}, 2))+21 END) END)

WHEN TO_NUMBER(TO_CHAR({today}, 'dd')) BETWEEN 22 AND 31
THEN
	(CASE
	WHEN (CASE WHEN TO_NUMBER(TO_CHAR(ADD_MONTHS({hiredate},3),'dd')) < 6 then LAST_DAY(ADD_MONTHS({hiredate}, 2))+6 WHEN TO_NUMBER(TO_CHAR(ADD_MONTHS({hiredate},3),'dd')) > 22 then LAST_DAY(ADD_MONTHS({hiredate}, 3))+6 else LAST_DAY(ADD_MONTHS({hiredate}, 2))+21 END) = (LAST_DAY({today})+6)
	THEN
		'<span style="color:green; font-weight:bold">' || (CASE WHEN TO_NUMBER(TO_CHAR(ADD_MONTHS({hiredate},3),'dd')) < 6 then LAST_DAY(ADD_MONTHS({hiredate}, 2))+6 WHEN TO_NUMBER(TO_CHAR(ADD_MONTHS({hiredate},3),'dd')) > 22 then LAST_DAY(ADD_MONTHS({hiredate}, 3))+6 else LAST_DAY(ADD_MONTHS({hiredate}, 2))+21 END) || '<span>'
	ELSE TO_CHAR(CASE WHEN TO_NUMBER(TO_CHAR(ADD_MONTHS({hiredate},3),'dd')) < 6 then LAST_DAY(ADD_MONTHS({hiredate}, 2))+6 WHEN TO_NUMBER(TO_CHAR(ADD_MONTHS({hiredate},3),'dd')) > 22 then LAST_DAY(ADD_MONTHS({hiredate}, 3))+6 else LAST_DAY(ADD_MONTHS({hiredate}, 2))+21 END) END)

WHEN TO_NUMBER(TO_CHAR({today}, 'dd')) BETWEEN 7 AND 21
THEN
	(CASE
	WHEN (CASE WHEN TO_NUMBER(TO_CHAR(ADD_MONTHS({hiredate},3),'dd')) < 6 then LAST_DAY(ADD_MONTHS({hiredate}, 2))+6 WHEN TO_NUMBER(TO_CHAR(ADD_MONTHS({hiredate},3),'dd')) > 22 then LAST_DAY(ADD_MONTHS({hiredate}, 3))+6 else LAST_DAY(ADD_MONTHS({hiredate}, 2))+21 END) = TO_DATE(CONCAT('21/',TO_CHAR({today}, 'mm/yyyy')),'dd/mm/yyyy')
	THEN
		'<span style="color:green; font-weight:bold">' || (CASE WHEN TO_NUMBER(TO_CHAR(ADD_MONTHS({hiredate},3),'dd')) < 6 then LAST_DAY(ADD_MONTHS({hiredate}, 2))+6 WHEN TO_NUMBER(TO_CHAR(ADD_MONTHS({hiredate},3),'dd')) > 22 then LAST_DAY(ADD_MONTHS({hiredate}, 3))+6 else LAST_DAY(ADD_MONTHS({hiredate}, 2))+21 END) || '<span>'
	ELSE TO_CHAR(CASE WHEN TO_NUMBER(TO_CHAR(ADD_MONTHS({hiredate},3),'dd')) < 6 then LAST_DAY(ADD_MONTHS({hiredate}, 2))+6 WHEN TO_NUMBER(TO_CHAR(ADD_MONTHS({hiredate},3),'dd')) > 22 then LAST_DAY(ADD_MONTHS({hiredate}, 3))+6 else LAST_DAY(ADD_MONTHS({hiredate}, 2))+21 END) END)
END