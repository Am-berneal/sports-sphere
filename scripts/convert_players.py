"""
Convert a Kaggle FIFA players CSV into the player pool used by the Smart Team Balancer.

Works with the "FIFA 22 complete player dataset" (players_22.csv) and similar
FIFA/EA FC player CSVs that have the columns: short_name, player_positions, overall
(and optionally club_name / nationality_name).

Usage (from the project folder):
    pip install pandas
    python scripts/convert_players.py path/to/players_22.csv

Output: src/data/real/players.json  -> the app picks it up automatically.
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
    sys.exit("Usage: python scripts/convert_players.py path/to/players.csv")

df = pd.read_csv(sys.argv[1], low_memory=False)

need = {"short_name", "player_positions", "overall"}
missing = need - set(df.columns)
if missing:
    sys.exit(f"CSV is missing columns: {missing}. Columns found: {list(df.columns)[:15]} ...")

# FIFA position codes -> the four groups the balancer uses
POS = {
    "GK": "GK",
    "CB": "DEF", "LB": "DEF", "RB": "DEF", "LWB": "DEF", "RWB": "DEF",
    "CDM": "MID", "CM": "MID", "CAM": "MID", "LM": "MID", "RM": "MID",
    "ST": "FWD", "CF": "FWD", "LW": "FWD", "RW": "FWD",
}
df["role"] = df["player_positions"].astype(str).str.split(",").str[0].str.strip()
df["pos"] = df["role"].map(POS)
df = df.dropna(subset=["pos", "overall"])

# A realistic campus-style squad: 22 players with a wide spread of ratings
# (2 GK, 8 DEF, 6 MID, 6 FWD), picked from mid-range players so it is not all superstars.
pool = df[(df["overall"] >= 50) & (df["overall"] <= 85)]
counts = {"GK": 2, "DEF": 8, "MID": 6, "FWD": 6}
squad = pd.concat(
    [pool[pool["pos"] == p].sample(n=n, random_state=42) for p, n in counts.items()]
)

# Map FIFA "overall" (about 50-85 here) onto the app's 1-10 skill scale
lo, hi = squad["overall"].min(), squad["overall"].max()
squad["skill"] = (1 + ((squad["overall"] - lo) / max(1, hi - lo) * 9)).round().astype(int).clip(1, 10)

team_col = "club_name" if "club_name" in squad.columns else ("nationality_name" if "nationality_name" in squad.columns else None)

players = []
for i, r in enumerate(squad.itertuples(index=False), start=1):
    label = str(getattr(r, team_col)) if team_col else "—"
    players.append({
        "id": f"r{i}",
        "name": str(r.short_name),
        "dept": shorten(label, 16),  # shown where the app normally shows the department
        "pos": r.pos,
        "role": r.role,
        "skill": int(r.skill),
    })

out = Path(__file__).resolve().parent.parent / "src" / "data" / "real" / "players.json"
out.parent.mkdir(parents=True, exist_ok=True)
out.write_text(json.dumps(players, indent=2, ensure_ascii=False), encoding="utf-8")
print(f"Wrote {len(players)} players to {out}")
