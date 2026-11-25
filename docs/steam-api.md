# Steam API

The Steam endpoints AzuiDB reads, what they return and what the collectors must handle. Observed with `curl` during modeling; none of them needed an API key in those calls.

## Overview

| Need | Endpoint | Gives a name? |
| ---- | -------- | ------------- |
| Top games by players right now | `ISteamChartsService/GetGamesByConcurrentPlayers/v1` | No |
| Top games with last week's rank | `ISteamChartsService/GetMostPlayedGames/v1` | No |
| Player count of one game | `ISteamUserStats/GetNumberOfCurrentPlayers/v1` | No |
| Name, release date, price | Store `appdetails` | Yes |

No chart endpoint returns the game's name. Names and release dates come from `appdetails` and are stored in the database, keyed by `appid`, instead of being fetched on every request.

## Response envelope

The Web API (`api.steampowered.com`) wraps every answer in a `response` object, so the data is never at the root:

```json
{"response": {"ranks": [{"rank": 1, "appid": 730, "...": "..."}]}}
```

With `jq`, the first five items are `.response.ranks[:5]`.

## Charts

`https://api.steampowered.com/ISteamChartsService/GetGamesByConcurrentPlayers/v1/`

Each item in `response.ranks`: `rank`, `appid`, `concurrent_in_game`, `peak_in_game`.

`https://api.steampowered.com/ISteamChartsService/GetMostPlayedGames/v1/`

Each item in `response.ranks`: `rank`, `appid`, `last_week_rank`, `peak_in_game`. `last_week_rank` is direct evidence of weekly chart movement, one of the inputs the AI may use.

## Current players of one game

`https://api.steampowered.com/ISteamUserStats/GetNumberOfCurrentPlayers/v1/?appid=730`

| Case | Response |
| ---- | -------- |
| Game exists | `{"response": {"player_count": 123456, "result": 1}}` |
| No such appid | `{"response": {"result": 42}}` |

`result` is Steam's `EResult` status code: `1` is OK, `42` is `NoMatch`. Use `player_count` only when `result` is `1`.

The value is the count right now. Steam keeps no history here; the history is what AzuiDB collects.

## App details (store API)

`https://store.steampowered.com/api/appdetails?appids=730&l=english`

The answer is keyed by appid: `{"730": {"success": true, "data": {...}}}`. Fields used, as returned for appid 730:

```json
{
  "name": "Counter-Strike 2",
  "release_date": {"coming_soon": false, "date": "21 Aug, 2012"},
  "price_overview": null,
  "is_free": true
}
```

| Field | Handling |
| ----- | -------- |
| `release_date.date` | Display text, not ISO. Parse it to a date to filter "released in the last 30 days". The format follows the language, so requests fix `l=english`. |
| `release_date.coming_soon` | `true` means not released yet: excluded from recent releases. |
| `price_overview` | `null` for free games. A missing price is normal, not an error. |
| `is_free` | Free-to-play flag. |

## Not verified yet

- Rate limits of each endpoint, especially the store `appdetails`.
- Every `release_date.date` format Steam uses (for example games with only a month or a year).
- How often the chart endpoints refresh.
