-- Referrer Pay Day
CASE WHEN TO_NUMBER(TO_CHAR({hiredate},'dd')) < 15 then LAST_DAY(ADD_MONTHS({hiredate}, 0))+15 WHEN TO_NUMBER(TO_CHAR({hiredate},'dd')) >= 15 then LAST_DAY(ADD_MONTHS({hiredate}, 0))+30 END

-- Referrer 90 Days Pay Day
CASE WHEN TO_NUMBER(TO_CHAR(ADD_MONTHS({hiredate},3),'dd')) < 15 then LAST_DAY(ADD_MONTHS({hiredate}, 2))+15 WHEN TO_NUMBER(TO_CHAR(ADD_MONTHS({hiredate},3),'dd')) >= 15 then LAST_DAY(ADD_MONTHS({hiredate}, 2))+30 END

-- Referrer Pay Day with Highlight (skeleton)
CASE
WHEN TO_NUMBER(TO_CHAR({today}, 'dd')) BETWEEN 30 AND 31
THEN
	(CASE WHEN ()  = (LAST_DAY({today})+15)
	THEN
		'<span style="color:green; font-weight: bold">' || () || '<span>'
	ELSE TO_CHAR() END)
WHEN TO_NUMBER(TO_CHAR({today}, 'dd')) BETWEEN 1 AND 14
THEN
	(CASE WHEN ()  = TO_DATE(CONCAT('15/',TO_CHAR({today}, 'mm/yyyy')),'dd/mm/yyyy')
	THEN
		'<span style="color:green; font-weight: bold">' || () || '<span>'
	ELSE TO_CHAR() END)

WHEN TO_NUMBER(TO_CHAR({today}, 'dd')) BETWEEN 15 AND 29
THEN
	(CASE WHEN ()  = TO_DATE(CONCAT('30/',TO_CHAR({today}, 'mm/yyyy')),'dd/mm/yyyy')
	THEN
		'<span style="color:green; font-weight: bold">' || () || '<span>'
	ELSE TO_CHAR() END)
END


-- Referrer Pay Day with Highlight
CASE
WHEN TO_NUMBER(TO_CHAR({today}, 'dd')) BETWEEN 30 AND 31
THEN
	(CASE WHEN (CASE WHEN TO_NUMBER(TO_CHAR({hiredate},'dd')) < 15 then LAST_DAY(ADD_MONTHS({hiredate}, 0))+15 WHEN TO_NUMBER(TO_CHAR({hiredate},'dd')) >= 15 then LAST_DAY(ADD_MONTHS({hiredate}, 0))+30 END)  = (LAST_DAY({today})+15)
	THEN
		'<span style="color:green; font-weight: bold">' || (CASE WHEN TO_NUMBER(TO_CHAR({hiredate},'dd')) < 15 then LAST_DAY(ADD_MONTHS({hiredate}, 0))+15 WHEN TO_NUMBER(TO_CHAR({hiredate},'dd')) >= 15 then LAST_DAY(ADD_MONTHS({hiredate}, 0))+30 END) || '<span>'
	ELSE TO_CHAR(CASE WHEN TO_NUMBER(TO_CHAR({hiredate},'dd')) < 15 then LAST_DAY(ADD_MONTHS({hiredate}, 0))+15 WHEN TO_NUMBER(TO_CHAR({hiredate},'dd')) >= 15 then LAST_DAY(ADD_MONTHS({hiredate}, 0))+30 END) END)
WHEN TO_NUMBER(TO_CHAR({today}, 'dd')) BETWEEN 1 AND 14
THEN
	(CASE WHEN (CASE WHEN TO_NUMBER(TO_CHAR({hiredate},'dd')) < 15 then LAST_DAY(ADD_MONTHS({hiredate}, 0))+15 WHEN TO_NUMBER(TO_CHAR({hiredate},'dd')) >= 15 then LAST_DAY(ADD_MONTHS({hiredate}, 0))+30 END)  = TO_DATE(CONCAT('15/',TO_CHAR({today}, 'mm/yyyy')),'dd/mm/yyyy')
	THEN
		'<span style="color:green; font-weight: bold">' || (CASE WHEN TO_NUMBER(TO_CHAR({hiredate},'dd')) < 15 then LAST_DAY(ADD_MONTHS({hiredate}, 0))+15 WHEN TO_NUMBER(TO_CHAR({hiredate},'dd')) >= 15 then LAST_DAY(ADD_MONTHS({hiredate}, 0))+30 END) || '<span>'
	ELSE TO_CHAR(CASE WHEN TO_NUMBER(TO_CHAR({hiredate},'dd')) < 15 then LAST_DAY(ADD_MONTHS({hiredate}, 0))+15 WHEN TO_NUMBER(TO_CHAR({hiredate},'dd')) >= 15 then LAST_DAY(ADD_MONTHS({hiredate}, 0))+30 END) END)

WHEN TO_NUMBER(TO_CHAR({today}, 'dd')) BETWEEN 15 AND 29
THEN
	(CASE WHEN (CASE WHEN TO_NUMBER(TO_CHAR({hiredate},'dd')) < 15 then LAST_DAY(ADD_MONTHS({hiredate}, 0))+15 WHEN TO_NUMBER(TO_CHAR({hiredate},'dd')) >= 15 then LAST_DAY(ADD_MONTHS({hiredate}, 0))+30 END)  = TO_DATE(CONCAT('30/',TO_CHAR({today}, 'mm/yyyy')),'dd/mm/yyyy')
	THEN
		'<span style="color:green; font-weight: bold">' || (CASE WHEN TO_NUMBER(TO_CHAR({hiredate},'dd')) < 15 then LAST_DAY(ADD_MONTHS({hiredate}, 0))+15 WHEN TO_NUMBER(TO_CHAR({hiredate},'dd')) >= 15 then LAST_DAY(ADD_MONTHS({hiredate}, 0))+30 END) || '<span>'
	ELSE TO_CHAR(CASE WHEN TO_NUMBER(TO_CHAR({hiredate},'dd')) < 15 then LAST_DAY(ADD_MONTHS({hiredate}, 0))+15 WHEN TO_NUMBER(TO_CHAR({hiredate},'dd')) >= 15 then LAST_DAY(ADD_MONTHS({hiredate}, 0))+30 END) END)
END

-- REFERRER 90 DAYS PAY DAYS
CASE
WHEN TO_NUMBER(TO_CHAR({today}, 'dd')) BETWEEN 30 AND 31
THEN
	(CASE WHEN (CASE WHEN TO_NUMBER(TO_CHAR(ADD_MONTHS({hiredate},3),'dd')) < 15 then LAST_DAY(ADD_MONTHS({hiredate}, 2))+15 WHEN TO_NUMBER(TO_CHAR(ADD_MONTHS({hiredate},3),'dd')) >= 15 then LAST_DAY(ADD_MONTHS({hiredate}, 2))+30 END)  = (LAST_DAY({today})+15)
	THEN
		'<span style="color:green; font-weight: bold">' || (CASE WHEN TO_NUMBER(TO_CHAR(ADD_MONTHS({hiredate},3),'dd')) < 15 then LAST_DAY(ADD_MONTHS({hiredate}, 2))+15 WHEN TO_NUMBER(TO_CHAR(ADD_MONTHS({hiredate},3),'dd')) >= 15 then LAST_DAY(ADD_MONTHS({hiredate}, 2))+30 END) || '<span>'
	ELSE TO_CHAR(CASE WHEN TO_NUMBER(TO_CHAR(ADD_MONTHS({hiredate},3),'dd')) < 15 then LAST_DAY(ADD_MONTHS({hiredate}, 2))+15 WHEN TO_NUMBER(TO_CHAR(ADD_MONTHS({hiredate},3),'dd')) >= 15 then LAST_DAY(ADD_MONTHS({hiredate}, 2))+30 END) END)
WHEN TO_NUMBER(TO_CHAR({today}, 'dd')) BETWEEN 1 AND 14
THEN
	(CASE WHEN (CASE WHEN TO_NUMBER(TO_CHAR(ADD_MONTHS({hiredate},3),'dd')) < 15 then LAST_DAY(ADD_MONTHS({hiredate}, 2))+15 WHEN TO_NUMBER(TO_CHAR(ADD_MONTHS({hiredate},3),'dd')) >= 15 then LAST_DAY(ADD_MONTHS({hiredate}, 2))+30 END)  = TO_DATE(CONCAT('15/',TO_CHAR({today}, 'mm/yyyy')),'dd/mm/yyyy')
	THEN
		'<span style="color:green; font-weight: bold">' || (CASE WHEN TO_NUMBER(TO_CHAR(ADD_MONTHS({hiredate},3),'dd')) < 15 then LAST_DAY(ADD_MONTHS({hiredate}, 2))+15 WHEN TO_NUMBER(TO_CHAR(ADD_MONTHS({hiredate},3),'dd')) >= 15 then LAST_DAY(ADD_MONTHS({hiredate}, 2))+30 END) || '<span>'
	ELSE TO_CHAR(CASE WHEN TO_NUMBER(TO_CHAR(ADD_MONTHS({hiredate},3),'dd')) < 15 then LAST_DAY(ADD_MONTHS({hiredate}, 2))+15 WHEN TO_NUMBER(TO_CHAR(ADD_MONTHS({hiredate},3),'dd')) >= 15 then LAST_DAY(ADD_MONTHS({hiredate}, 2))+30 END) END)

WHEN TO_NUMBER(TO_CHAR({today}, 'dd')) BETWEEN 15 AND 29
THEN
	(CASE WHEN (CASE WHEN TO_NUMBER(TO_CHAR(ADD_MONTHS({hiredate},3),'dd')) < 15 then LAST_DAY(ADD_MONTHS({hiredate}, 2))+15 WHEN TO_NUMBER(TO_CHAR(ADD_MONTHS({hiredate},3),'dd')) >= 15 then LAST_DAY(ADD_MONTHS({hiredate}, 2))+30 END)  = TO_DATE(CONCAT('30/',TO_CHAR({today}, 'mm/yyyy')),'dd/mm/yyyy')
	THEN
		'<span style="color:green; font-weight: bold">' || (CASE WHEN TO_NUMBER(TO_CHAR(ADD_MONTHS({hiredate},3),'dd')) < 15 then LAST_DAY(ADD_MONTHS({hiredate}, 2))+15 WHEN TO_NUMBER(TO_CHAR(ADD_MONTHS({hiredate},3),'dd')) >= 15 then LAST_DAY(ADD_MONTHS({hiredate}, 2))+30 END) || '<span>'
	ELSE TO_CHAR(CASE WHEN TO_NUMBER(TO_CHAR(ADD_MONTHS({hiredate},3),'dd')) < 15 then LAST_DAY(ADD_MONTHS({hiredate}, 2))+15 WHEN TO_NUMBER(TO_CHAR(ADD_MONTHS({hiredate},3),'dd')) >= 15 then LAST_DAY(ADD_MONTHS({hiredate}, 2))+30 END) END)
END

