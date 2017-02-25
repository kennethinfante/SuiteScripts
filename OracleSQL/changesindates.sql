-- ST Changes Sales Orders
-- Standard Filter
CASE WHEN(({transaction.type} = 'Sales Order') AND ({transaction.amount} > 1000) AND (TO_DATE({transaction.datecreated}, 'MM/DD/YYYY') > {custentity_last_sale_1000}))
THEN 1
ELSE 0
END

-- Summary Filter
MAXIMUM({transaction.datecreated} IS NOT EMPTY)


-- ST Changes Sales Quotes
-- Standard Filter
CASE WHEN (({transaction.type} = 'Quote')
AND (MONTHS_BETWEEN({today},{transaction.datecreated}) BETWEEN 0 AND 4) AND (TO_DATE({transaction.datecreated}, 'MM/DD/YYYY') > {custentity_last_quote_date}))
THEN 1
ELSE 0
END
-- Summary Filter
MAXIMUM({transaction.datecreated} IS NOT EMPTY)

-- ST Changes Sales Opportunities Open
-- Standard Filter
CASE WHEN (({opportunity.custbody28} IN ('Will Quote', 'Undecided?')) AND (MONTHS_BETWEEN({today},{opportunity.datecreated}) BETWEEN 0 AND 4)
AND (TO_DATE({opportunity.datecreated}, 'MM/DD/YYYY')>{custentity_last_opportunity_date}))
THEN 1
ELSE 0
END


-- Summary Filter
MAXIMUM({opportunity.datecreated} IS NOT EMPTY)


-- ST Changes Sales Events Last 3 Mos
-- Standard Filter
CASE WHEN (({activity.assigned} IN ('Brian M Cox', 'Donald R Grant', 'David M Cruz'))
AND (MONTHS_BETWEEN({today}, {activity.date}) BETWEEN 0 AND 3)
AND (TO_DATE({activity.createddate}, 'MM/DD/YYYY')>{custentity_sales_cycle_last_event_date}))
THEN 1
ELSE 0
END

-- Summary Filter
MAXIMUM({activity.createddate} IS NOT EMPTY)



