// Base address of the Jolpica-F1 API
const API = "https://api.jolpi.ca/ergast/f1";

// Team colours (key = team ID from the API, value = colour)
const teamColors = {
    mclaren: "#ff8000",
    ferrari: "#e8002d",
    red_bull: "#3671c6",
    mercedes: "#27f4d2",
    aston_martin: "#229971",
    alpine: "#ff87bc",
    williams: "#64c4ff",
    rb: "#6692ff",
    sauber: "#52e252",
    audi: "#bb0a30",
    haas: "#b6babd",
    cadillac: "#c0a062"
};

// Look up a team's colour, grey if the team isn't in the list
function getColor(teamId) {
    return teamColors[teamId] || "#666";
}

// Gold / silver / bronze class for the top 3
function podiumClass(position) {
    if (position === "1") return "p1";
    if (position === "2") return "p2";
    if (position === "3") return "p3";
    return "";
}


// ----- Driver standings -----
fetch(API + "/current/driverStandings.json")
    .then(res => res.json())
    .then(data => {
        const drivers = data.MRData.StandingsTable.StandingsLists[0].DriverStandings;

        let html = "";
        for (const d of drivers) {
            const team = d.Constructors[0];

            html += `
                <div class="row">
                    <div class="pos ${podiumClass(d.position)}">${d.position}</div>
                    <div class="bar" style="background: ${getColor(team.constructorId)}"></div>
                    <div class="name">
                        ${d.Driver.givenName} <b>${d.Driver.familyName}</b>
                        <div class="team">${team.name}</div>
                    </div>
                    <div class="points">${d.points}</div>
                </div>`;
        }

        document.getElementById("drivers").innerHTML = html;
    })
    .catch(error => {
        console.error(error);
        document.getElementById("drivers").textContent = "Kunne ikke hente data";
    });


// ----- Constructor standings -----
fetch(API + "/current/constructorStandings.json")
    .then(res => res.json())
    .then(data => {
        const teams = data.MRData.StandingsTable.StandingsLists[0].ConstructorStandings;

        let html = "";
        for (const t of teams) {
            html += `
                <div class="row">
                    <div class="pos ${podiumClass(t.position)}">${t.position}</div>
                    <div class="bar" style="background: ${getColor(t.Constructor.constructorId)}"></div>
                    <div class="name"><b>${t.Constructor.name}</b></div>
                    <div class="points">${t.points}</div>
                </div>`;
        }

        document.getElementById("teams").innerHTML = html;
    })
    .catch(error => {
        console.error(error);
        document.getElementById("teams").textContent = "Kunne ikke hente data";
    });


// ----- Last race results -----
fetch(API + "/current/last/results.json")
    .then(res => res.json())
    .then(data => {
        const race = data.MRData.RaceTable.Races[0];

        document.getElementById("race-title").textContent = race.raceName;
        document.getElementById("race-place").textContent =
            race.Circuit.circuitName + " · " + race.date;

        let html = "";
        for (const r of race.Results) {
            console.log(r.Driver.familyName, r.status, r.Time);

            // Winner gets the race time, others the gap, DNFs their status
            const result = r.Time ? r.Time.time : r.status;

            html += `
                <div class="row">
                    <div class="pos ${podiumClass(r.position)}">${r.position}</div>
                    <div class="bar" style="background: ${getColor(r.Constructor.constructorId)}"></div>
                    <div class="name">
                        ${r.Driver.givenName} <b>${r.Driver.familyName}</b>
                        <div class="team">${result}</div>
                    </div>
                    <div class="points">${r.points}</div>
                </div>`;
        }

        document.getElementById("race").innerHTML = html;
    })
    .catch(error => {
        console.error(error);
        document.getElementById("race").textContent = "Kunne ikke hente data";
    });


// ----- Next race countdown -----
fetch(API + "/current/next.json")
    .then(res => res.json())
    .then(data => {
        const race = data.MRData.RaceTable.Races[0];

        if (!race) {
            document.getElementById("next-name").textContent = "Season finished";
            return;
        }

        document.getElementById("next-name").textContent = race.raceName;
        document.getElementById("next-place").textContent =
            race.Circuit.Location.locality + ", " + race.Circuit.Location.country;

        // Race start as a real date (date + time from the API)
        const start = new Date(race.date + "T" + (race.time || "12:00:00Z"));

        function tick() {
            const diff = start - new Date();   // milliseconds left

            if (diff <= 0) {
                document.getElementById("next-name").textContent = race.raceName + " — LIVE!";
                clearInterval(timer);
                return;
            }

            const days  = Math.floor(diff / (1000 * 60 * 60 * 24));
            const hours = Math.floor(diff / (1000 * 60 * 60)) % 24;
            const mins  = Math.floor(diff / (1000 * 60)) % 60;
            const secs  = Math.floor(diff / 1000) % 60;

            document.getElementById("days").textContent  = String(days).padStart(2, "0");
            document.getElementById("hours").textContent = String(hours).padStart(2, "0");
            document.getElementById("mins").textContent  = String(mins).padStart(2, "0");
            document.getElementById("secs").textContent  = String(secs).padStart(2, "0");
        }

        let timer;                          // will hold the interval's ID

        tick();                             // run once right away
        timer = setInterval(tick, 1000);    // save the ID so we can stop it
    })
    .catch(error => {
        console.error(error);
        document.getElementById("next-name").textContent = "Kunne ikke hente data";
    });