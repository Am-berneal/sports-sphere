"""
Convert the Kaggle "IPL Complete Dataset (2008-2020)" matches file into the fixtures
used by Matches & Leaderboards, Score Entry and Match Recap.

Works with both versions of the dataset (2008-2020 and 2008-2024).
Expected columns in the matches CSV: date, venue, team1, team2, winner
(optional: match_type — only "League" matches are used when present).

Usage (from the project folder):
    pip install pandas
    python scripts/convert_ipl.py path/to/matches.csv 2024

Output: src/data/real/fixtures.json  -> the app picks it up automatically.

Note: cricket results are recorded as a WIN (1-0), not runs, because the app's
points table works on wins/draws/losses (Win 3, Draw 1, Loss 0).
"""
import json
import sys
from pathlib import Path

import pandas as pd


def shorten(text, n):
    """Cut text at a word boundary so names are never chopped mid-word."""
    text = str(text).strip()
    if len(text) <= n:
        return text
    cut = text[:n].rsplit(" ", 1)[0]
    return cut if cut else text[:n]

if len(sys.argv) < 2:
    sys.exit("Usage: python scripts/convert_ipl.py path/to/matches.csv [season]")
season = sys.argv[2] if len(sys.argv) > 2 else "2024"

df = pd.read_csv(sys.argv[1])
need = {"date", "venue", "team1", "team2", "winner"}
missing = need - set(df.columns)
if missing:
    sys.exit(f"CSV is missing columns: {missing}. Columns found: {list(df.columns)}")

df["date"] = pd.to_datetime(df["date"], errors="coerce", dayfirst=False)
df = df[df["date"].dt.year == int(season)].sort_values("date")
if "match_type" in df.columns:
    df = df[df["match_type"].astype(str).str.lower() == "league"]
if df.empty:
    sys.exit(f"No matches found for season {season}")

# use the whole league stage; the last 6 matches are left "Scheduled" so
# Score Entry has something to publish during the demo
df = df.reset_index(drop=True)
scheduled_from = len(df) - 6

fixtures = []
for i, r in df.iterrows():
    done = i < scheduled_from
    if done and r["winner"] == r["team1"]:
        a, b = 1, 0
    elif done and r["winner"] == r["team2"]:
        a, b = 0, 1
    elif done:
        a, b = 0, 0  # no result -> counts as a draw (1 point each), like the real IPL
    else:
        a, b = None, None
    fixtures.append({
        "id": f"M{i + 1}",
        "round": f"IPL {season}",
        "date": r["date"].strftime("%b %d"),
        "time": "7:30 PM",
        "venue": shorten(str(r["venue"]).split(",")[0], 34),
        "teamA": str(r["team1"]),
        "teamB": str(r["team2"]),
        "scoreA": a,
        "scoreB": b,
        "status": "Completed" if done else "Scheduled",
    })

out = Path(__file__).resolve().parent.parent / "src" / "data" / "real" / "fixtures.json"
out.parent.mkdir(parents=True, exist_ok=True)
out.write_text(json.dumps(fixtures, indent=2, ensure_ascii=False), encoding="utf-8")
print(f"Wrote {len(fixtures)} fixtures ({scheduled_from} completed) to {out}")
