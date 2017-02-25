-- ST Employees Eligible For Insurance
CASE WHEN {today}-{hiredate} BETWEEN 60 AND 90 THEN 1 ELSE 0 END


CASE
WHEN {today}-{hiredate} BETWEEN 1 AND 15 THEN 'Initial Referral Fee'
WHEN {today}-{hiredate} BETWEEN 91 AND 105 THEN '90 Days Referral Fee'
END