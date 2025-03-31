from flask import Flask, jsonify, send_from_directory
from flask_cors import CORS
import requests
import datetime
import os

app = Flask(__name__, static_folder='../client/build', static_url_path='/')

@app.route('/', defaults={'path': ''})
@app.route('/<path:path>')
def serve(path):
    if os.environ.get('FLASK_ENV') == 'production':
        if path != "" and os.path.exists(app.static_folder + '/' + path):
            return send_from_directory(app.static_folder, path)
        else:
            return send_from_directory(app.static_folder, 'index.html')
    else:
        return "React frontend is running separately in development."

# example API route
@app.route('/api/ping')
def ping():
    return {'message': 'pong'}

CORS(app)

#########################################################
## ------Team Stats-------------------------------- #####
#########################################################

TEAM_IDS = [133, 134, 135, 136, 137, 138, 139, 140, 141, 142, 143, 144, 145, 146, 147, 158, 108, 109, 110, 111, 112, 113, 114, 115, 116, 117, 118, 119, 120, 121]

TEAM_ABR_LOOKUP = {
    "Athletics": "ATH",
    "Toronto Blue Jays": "TOR",
    "Tampa Bay Rays": "TB",
    "Boston Red Sox": "BOS",  
    "New York Yankees": "NYY",
    "Baltimore Orioles": "BAL",
    "Chicago White Sox": "CWS",
    "Cleveland Guardians": "CLE",
    "Detroit Tigers": "DET",
    "Kansas City Royals": "KCR",
    "Minnesota Twins": "MIN",
    "Houston Astros": "HOU",
    "Los Angeles Angels": "LAA",
    "Texas Rangers": "TEX",
    "Atlanta Braves": "ATL",
    "Miami Marlins": "MIA",
    "New York Mets": "NYM",
    "Philadelphia Phillies": "PHI",
    "Washington Nationals": "WSN",
    "Chicago Cubs": "CHC",
    "Cincinnati Reds": "CIN",
    "Milwaukee Brewers": "MIL",
    "Pittsburgh Pirates": "PIT",
    "St. Louis Cardinals": "STL",
    "Arizona Diamondbacks": "ARI",
    "Colorado Rockies": "COL",
    "Los Angeles Dodgers": "LAD",
    "San Diego Padres": "SDP",
    "San Francisco Giants": "SFG",
    "Seattle Mariners": "SEA",
}


@app.route('/api/team_stats/hitting')
def team_hitting():
    current_year = datetime.datetime.now().year
    team_stats = []
    for team_id in TEAM_IDS:
        stats_url = f"https://statsapi.mlb.com/api/v1/teams/{team_id}/stats?stats=season&season={current_year}&group=hitting"
        stats_response = requests.get(stats_url)
        stats_data = stats_response.json()
        stats = stats_data.get("stats", [])
        stats = stats[0].get("splits", [])
        team = stats[0].get("team", {}).get("name")
        stats = stats[0].get("stat", {})
        team_stats.append({
            "team": team,
            "abr": TEAM_ABR_LOOKUP[team],
            "avg": float(stats.get("avg")),
            "runs": stats.get("runs"),
            "homeRuns": stats.get("homeRuns"),
            "rbi": stats.get("rbi"),
            "ops": float(stats.get("ops")),
            "babip": float(stats.get("babip"))
        })
    
    team_stats.sort(key=lambda x: x["abr"], reverse=False)

    return jsonify(team_stats)

@app.route('/api/team_stats/pitching')
def team_pitching():
    current_year = datetime.datetime.now().year
    team_stats = []
    for team_id in TEAM_IDS:
        stats_url = f"https://statsapi.mlb.com/api/v1/teams/{team_id}/stats?stats=season&season={current_year}&group=pitching"
        stats_response = requests.get(stats_url)
        stats_data = stats_response.json()
        stats = stats_data.get("stats", [])
        stats = stats[0].get("splits", [])
        team = stats[0].get("team", {}).get("name")
        stats = stats[0].get("stat", {})
        team_stats.append({
            "team": team,
            "abr": TEAM_ABR_LOOKUP[team],
            # "stolenBasePercentage": float(stats.get("stolenBasePercentage")),
            "era": float(stats.get("era")),
            "whip": float(stats.get("whip")),
            "pitchesPerInning": float(stats.get("pitchesPerInning")),
            "opsAgainst": float(stats.get("ops")),
        })
    
    team_stats.sort(key=lambda x: x["abr"], reverse=False)

    return jsonify(team_stats)



#########################################################
## ------Lists of Active Players------------------- #####
#########################################################

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

@app.route('/api/active_pitchers')
def active_pitcherss():
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
            if entry.get("position", {}).get("abbreviation") != "P":
                continue
            person = entry.get("person", {})
            if person:
                players_list.append({
                    "id": person.get("id"),
                    "name": person.get("fullName")
                })
    
    return jsonify(players_list)


#########################################################
## ------Career Data for Hitters and Pitchers------ #####
#########################################################


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
            splits = stat.get("splits", [])
            if splits:
                s = splits[0]  # Take only the first entry
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

@app.route('/api/pitcher_stats/<int:player_id>')
def pitcher_stats(player_id):

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
        stats_url = f"https://statsapi.mlb.com/api/v1/people/{player_id}/stats?stats=season&group=pitching&season={year}"
        stats_response = requests.get(stats_url)
        stats_data = stats_response.json()
        stats = stats_data.get("stats", [])
        
        # For each season, fetch the player stats
        for stat in stats:
            splits = stat.get("splits", [])
            if splits:
                s = splits[0]  # Take only the first entry
                player_stats.append({
                    "season": str(year),
                    "era": s.get("stat", {}).get("era"),
                    "whip": s.get("stat", {}).get("whip"),
                    "strikeoutsPer9Inn": s.get("stat", {}).get("strikeoutsPer9Inn"),
                    "strikeoutWalkRatio": s.get("stat", {}).get("strikeoutWalkRatio"),
                    "pitchesPerInning": s.get("stat", {}).get("pitchesPerInning"),
                })

    career_stats = []
    career_stats_url = f"https://statsapi.mlb.com/api/v1/people/{player_id}/stats?stats=career&group=pitching"
    career_stats_response = requests.get(career_stats_url)
    career_stats_data = career_stats_response.json()
    career = career_stats_data.get("stats", [])
    for stat in career:
        stats = stat.get("splits", [])
        for s in stats:
            season = "career"
            career_stats.append({
                "season": season,
                "era": s.get("stat", {}).get("era"),
                "whip": s.get("stat", {}).get("whip"),
                "strikeoutsPer9Inn": s.get("stat", {}).get("strikeoutsPer9Inn"),
                "strikeoutWalkRatio": s.get("stat", {}).get("strikeoutWalkRatio"),
                "pitchesPerInning": s.get("stat", {}).get("pitchesPerInning"),
            })

    player_stats.extend(career_stats)
    
    return jsonify(player_stats)

#########################################################
## ------Spits Data for Hitters and Pitchers------ ######
#########################################################

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

@app.route('/api/pitcher_stats/<int:player_id>/splits')
def pitcher_splits(player_id):
    today = datetime.date.today()
    thirty_days_ago = today - datetime.timedelta(days=30)
    fifteen_days_ago = today - datetime.timedelta(days=15)
    season_start = datetime.date(today.year, 1, 1)  # Year start

    def get_stats(start_date, end_date):
        stats_url = f"https://statsapi.mlb.com/api/v1/people/{player_id}/stats?stats=byDateRange&group=pitching&startDate={start_date}&endDate={end_date}"
        res = requests.get(stats_url).json()
        try:
            stats = res["stats"][0]["splits"][0]["stat"]
            return {"era": stats.get("era"),
                    "whip": stats.get("whip"),
                    "strikeoutsPer9Inn": stats.get("strikeoutsPer9Inn"),
                    "strikeoutWalkRatio": stats.get("strikeoutWalkRatio"),
                    "pitchesPerInning": stats.get("pitchesPerInning")
                    }
        except (IndexError, KeyError):
            return {"era": None, "whip": None, "strikeoutsPer9Inn": None, "strikeoutWalkRatio": None, "pitchesPerInning": None}

    splits_data = {
        "season": get_stats(season_start, today),
        "last30": get_stats(thirty_days_ago, today),
        "last15": get_stats(fifteen_days_ago, today)
    }

    return jsonify(splits_data)



if __name__ == '__main__':
    app.run(debug=True)
