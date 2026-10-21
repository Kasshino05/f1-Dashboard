F1 Dashboard

A live Formula 1 dashboard that shows the current season at a glance: driver and constructor standings, the latest race result, and a countdown to the next Grand Prix.

Built with plain HTML, CSS and JavaScript — no frameworks, no build step.

Features
Next race countdown – days, hours, minutes and seconds until lights out, updated every second
Driver standings – position, driver, team and points for the current season
Constructor standings – the team championship
Last race results – finishing order with race time, or the reason a driver didn't finish
Team colours – each row has a colour bar matching the team
Podium highlights – gold, silver and bronze for the top 3
F1-inspired design – carbon-fibre background, Titillium Web font and McLaren papaya accents
How it works

All data comes from the free Jolpica-F1 API (the successor to the Ergast API). The page calls four endpoints when it loads:

Endpoint	Used for
/current/driverStandings.json	Driver standings
/current/constructorStandings.json	Constructor standings
/current/last/results.json	Last race results
/current/next.json	Next race and countdown

Because it always asks for the current season, the dashboard updates itself after every race — no manual changes needed.

Run it locally
Clone the repo:
bash
   git clone https://github.com/Kasshino05/f1-dashboard.git
Open index.html in your browser.

That's it — no installation required.

Built with
HTML5
CSS3 (flexbox, grid, gradients)
JavaScript (Fetch API, template literals, setInterval)
Jolpica-F1 API
Planned
Connect the dashboard to my own MariaDB database, filled by a Python sync script
Driver and team detail pages
Race calendar for the whole season
About

Made by Cassandra (@Kasshino05), a datatekniker student specialising in programming. Built for fun and to learn — and because I love F1.
