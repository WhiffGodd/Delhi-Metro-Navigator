# Smart-exit data and behaviour

Smart exit uses DMRC’s official station gate destinations, accessibility flags and published status. The snapshot was checked on 8 October 2026 and covers 239 station records and 724 gates. Examples:

- Rajiv Chowk: https://delhimetrorail.com/station/RCK
- Hauz Khas: https://delhimetrorail.com/station/HKS
- Vaishali: https://delhimetrorail.com/station/VASI

Each record in `data/exits.json` links to its own official station page. `data/station-codes.json` maps the app’s station ids to the published DMRC station codes. The map includes reviewed spelling and name aliases; no fuzzy match is used when importing data.

The browser uses `data/exits.json`. Java reads `data/exit-gates.tsv`, generated from the same records and packaged in the executable web app. This replaces the previous five hand-written recommendations. Gate-linked lifts/escalators and walking times are left unknown when the source does not publish them. An accessibility flag is not represented as a guaranteed operational lift.

## Recommendations

Users can type the road, market or landmark they want after exiting, or select one of the listed gate destinations. Recommendations match all typed words against the gate number and destination. The accessibility option requires an explicit true accessibility flag. Gates marked `close`, `closed` or `inactive` in the snapshot are excluded. Ties use gate number; no shortest-walk claim is made. With no landmark selected, the first listed eligible gate is presented as a listed exit rather than an optimal exit.

The snapshot is not live gate monitoring. The UI displays its checked date and advises confirming access with station signs/staff. Unmatched destinations and missing accessible routes have explicit messages, with no invented fallback gate.

The 21 NMRC Aqua Line stations have no gate records in this DMRC snapshot. They show an unavailable state linking to NMRC rather than reusing a nearby DMRC station’s gates.

## Refreshing

With Playwright and Chrome available, run `node scripts/sync-exit-guide.cjs` from the repository root. It reads public station records with two workers and writes both snapshots. It stops on denied/rate-limited responses; it does not bypass access controls. Recheck source coverage, aliases and tests when refreshing. The checked date in the script must be updated for a new capture.

The Java exit endpoint also accepts `destination` and `accessible=true`, for example:
`/api/exit-recommendation?station=rajiv_chowk&destination=Palika&accessible=true`.
