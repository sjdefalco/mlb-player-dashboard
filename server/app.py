from flask import Flask, jsonify
from flask_cors import CORS
import requests
import datetime

app = Flask(__name__)
CORS(app)

@app.route('/api/players')
def get_players():
    # For now, return a dummy list of players

    players = [
        {"id": 1, "name": "Player One"},
        {"id": 2, "name": "Player Two"}
    ]
    return jsonify(players)


@app.route('/api/active_hitters')
def active_hitters():
    # Fetch active teams
    teams_url = "https://statsapi.mlb.com/api/v1/teams?sportId=1&activeStatus=Y"
    teams_response = requests.get(teams_url)
    teams_data = teams_response.json()
    teams = teams_data.get("teams", [])
    
    players_list = []
    
    # For each active team, fetch its active roster
    for team in teams:
        team_id = team.get("id")
        roster_url = f"https://statsapi.mlb.com/api/v1/teams/{team_id}/roster?rosterType=active"
        roster_response = requests.get(roster_url)
        roster_data = roster_response.json()
        roster = roster_data.get("roster", [])
        for entry in roster:
            if entry.get("position", {}).get("abbreviation") == "P":
                continue
            person = entry.get("person", {})
            if person:
                players_list.append({
                    "id": person.get("id"),
                    "name": person.get("fullName")
                })
    
    return jsonify(players_list)

@app.route('/api/hitter_stats/<int:player_id>')
def hitter_stats(player_id):

    # Get current year
    current_year = datetime.datetime.now().year

    # Get list of career years

    player_desc_url = f"https://statsapi.mlb.com//api/v1/people/{player_id}"
    player_desc_response = requests.get(player_desc_url)
    player_desc_data = player_desc_response.json()
    mlb_debut_date = player_desc_data.get("people",[])[0].get("mlbDebutDate")
    debut_year = int(mlb_debut_date.split("-")[0])
    career_years = list(range(debut_year, current_year+1))

    # Fetch player stats
    player_stats = []
    for year in career_years:
        stats_url = f"https://statsapi.mlb.com/api/v1/people/{player_id}/stats?stats=season&group=hitting&season={year}"
        stats_response = requests.get(stats_url)
        stats_data = stats_response.json()
        stats = stats_data.get("stats", [])
        
        # For each season, fetch the player stats
        for stat in stats:
            stats = stat.get("splits", [])
            for s in stats:
                player_stats.append({
                    "season": str(year),
                    "avg": s.get("stat", {}).get("avg"),
                    "hr": s.get("stat", {}).get("homeRuns"),
                    "rbi": s.get("stat", {}).get("rbi"),
                    "ops": s.get("stat", {}).get("ops"),
                    "babip": s.get("stat", {}).get("babip"),
                })

    career_stats = []
    career_stats_url = f"https://statsapi.mlb.com/api/v1/people/{player_id}/stats?stats=career&group=hitting"
    career_stats_response = requests.get(career_stats_url)
    career_stats_data = career_stats_response.json()
    career = career_stats_data.get("stats", [])
    for stat in career:
        stats = stat.get("splits", [])
        for s in stats:
            season = "career"
            career_stats.append({
                "season": season,
                "avg": s.get("stat", {}).get("avg"),
                "hr": s.get("stat", {}).get("homeRuns"),
                "rbi": s.get("stat", {}).get("rbi"),
                "ops": s.get("stat", {}).get("ops"),
                "babip": s.get("stat", {}).get("babip"),
            })

    player_stats.extend(career_stats)
    
    return jsonify(player_stats)

@app.route('/api/hitter_stats/<int:player_id>/splits')
def hitter_splits(player_id):
    today = datetime.date.today()
    thirty_days_ago = today - datetime.timedelta(days=30)
    fifteen_days_ago = today - datetime.timedelta(days=15)
    season_start = datetime.date(today.year, 1, 1)  # Year start

    def get_stats(start_date, end_date):
        stats_url = f"https://statsapi.mlb.com/api/v1/people/{player_id}/stats?stats=byDateRange&group=hitting&startDate={start_date}&endDate={end_date}"
        res = requests.get(stats_url).json()
        try:
            stats = res["stats"][0]["splits"][0]["stat"]
            return {"ops": stats.get("ops"), "babip": stats.get("babip")}
        except (IndexError, KeyError):
            return {"ops": None, "babip": None}

    splits_data = {
        "season": get_stats(season_start, today),
        "last30": get_stats(thirty_days_ago, today),
        "last15": get_stats(fifteen_days_ago, today)
    }

    return jsonify(splits_data)



if __name__ == '__main__':
    app.run(debug=True)
