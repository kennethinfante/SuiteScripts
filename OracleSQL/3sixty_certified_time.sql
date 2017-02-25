

(Case WHEN {payitem} = 'Installation - Hourly' THEN {durationdecimal} ELSE 0 END) *
(Case WHEN {job.custentity139} > {employee.custentity165}THEN ({job.custentity139}-{employee.custentity165}) ELSE 0 END)


(Case WHEN {payitem} = 'Installation - Overtime' THEN {durationdecimal} ELSE 0 END)*
(Case WHEN (({job.custentity139}*1.50) > {employee.custentity166}) THEN (({job.custentity139}*1.50)-{employee.custentity166}) ELSE 0 END)