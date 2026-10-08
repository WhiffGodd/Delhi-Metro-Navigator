# Fare data

The fare panel uses `fare-engine.js` for both Java-served and static/offline journeys. It shows a weekday single-journey amount, a Sunday/national-holiday amount, and components grouped by operator. Smart-card and promotional discounts are excluded.

Published tariffs checked on 8 October 2026:

- Delhi Metro distance slabs and DMRC-listed Rapid Metro ₹20 fare: https://delhimetrorail.com/fare
- Airport Express seven-station QR fare matrix: https://delhimetrorail.com/fare-for-airport-express-line
- Aqua Line weekday and Sunday/national-holiday station-count fares: https://www.nmrcnoida.com/Passenger-Information/Metro-Rail/Fare-Table

## Accuracy limits

Airport Express-only and Aqua Line-only fares use published operator rules. Walking connections cost zero. Rapid Metro uses the amount currently listed on DMRC’s fare page; riders should confirm current prices at the station.

Regular Delhi Metro still uses approximate distances between station coordinates to select the published slab. These are estimates, not official station-pair quotes. DMRC’s official calculator was tested but its endpoint disallows cross-origin browser requests and rejected a server client with HTTP 403. No access restriction is bypassed and no live official integration is claimed.

Totals crossing fare systems add the displayed components and are marked as estimates. DMRC notes that Airport Express interchanges can change the actual fare. An exact paid-area ticketing model cannot be inferred from coordinates.

NMRC’s Sunday/national-holiday column applies to Sundays, Republic Day, Independence Day and Gandhi Jayanti. Both tariff columns are displayed instead of silently assuming the travel date.

## Updating

Recheck the official source pages before modifying tariffs. Update the checked date, tables and tests together. Tests cover every Airport Express table entry for symmetry, NMRC boundaries, DMRC holiday slabs, mixed operators, walking-only journeys and an example journey to every station in the bundled network.
