# Local setup

Runs the API on your machine, PostgreSQL in Docker (see [ADR 0003](adr/0003-local-dev-api-on-host-postgres-in-compose.md)) and the mobile app on your phone through Expo Go.

## Prerequisites

- Git
- Python 3 (developed on 3.14)
- Docker with the Compose plugin (`docker compose`)
- Node.js (developed on 22) and npm
- Expo Go on an Android or iOS phone

## 1. Database

```bash
cp infra/.env.example infra/.env
```

Edit `infra/.env` and set `POSTGRES_PASSWORD`. Use letters and digits only: the same password goes inside a URL in step 2.

```bash
cd infra
docker compose up -d
docker compose ps
```

Wait until `db` shows `healthy`. `up -d` starts the containers in the background.

## 2. API

From `apps/api`:

```bash
python -m venv .venv
source .venv/bin/activate        # fish: source .venv/bin/activate.fish
pip install -r requirements.txt
cp .env.example .env
```

Edit `apps/api/.env`:

- `SECRET_KEY`: generate one with
  `python -c "from django.core.management.utils import get_random_secret_key as g; print(g())"`
- `DATABASE_URL`: `postgres://azui:<password>@localhost:5432/azuidb`, with the same password as `infra/.env`.

Then:

```bash
python manage.py migrate
python manage.py runserver
```

## 3. Check it works

```bash
curl http://localhost:8000/api/health/
```

Expected: `{"status":"ok"}`. To confirm the tables landed in Postgres:

```bash
cd infra
docker compose exec db psql -U azui -d azuidb -c '\dt'
```

## 4. Mobile app

The app calls the API from your phone, so the API must be reachable over the local network.

Run the API on all interfaces instead of loopback only:

```bash
python manage.py runserver 0.0.0.0:8000
```

Find your computer's LAN IP (for example with `ip -4 addr`) and add it to `ALLOWED_HOSTS` in `apps/api/.env`, comma-separated without spaces: `localhost,127.0.0.1,192.168.0.10`.

From `apps/mobile`:

```bash
npm install
cp .env.example .env
```

Set `EXPO_PUBLIC_API_URL` in `apps/mobile/.env` to `http://<LAN IP>:8000`. `localhost` does not work: on the phone it means the phone itself. Variables prefixed with `EXPO_PUBLIC_` are embedded in the app bundle, so they are visible to anyone with the app and must never hold secrets. Restart the dev server after changing `.env`.

```bash
npx expo start
```

Scan the QR code with Expo Go. The home screen should show `API: ok`.

The phone and the computer must be on the same network, and the computer's firewall must allow inbound connections on 8081 (Metro, the dev server that serves the app) and 8000 (the API). The LAN IP changes when you switch networks; update both `.env` files when it does.

## Troubleshooting

| Symptom | Cause and fix |
| ------- | ------------- |
| `That port is already in use` | Another process owns the port. Find it with `ss -ltnp \| grep :8000`. Either stop it or run on another port, e.g. `python manage.py runserver 8001`. For Postgres, stop the other container or change the host side of `127.0.0.1:5432:5432` in `infra/docker-compose.yml` (and the port in `DATABASE_URL`). |
| `ImproperlyConfigured: Set the DATABASE_URL environment variable` | `DATABASE_URL` is missing from `apps/api/.env`. There is deliberately no fallback database. See [ADR 0004](adr/0004-configuration-through-environment-variables.md). |
| `DisallowedHost` | The host you used is not in `ALLOWED_HOSTS` in `apps/api/.env`. |
| `ImproperlyConfigured: Set the SECRET_KEY environment variable` | `SECRET_KEY` is missing from `apps/api/.env`. |
| `docker compose` says `set POSTGRES_PASSWORD in infra/.env` | `infra/.env` does not exist or has an empty variable. |
| Connection or URL errors with the database | A password with `@`, `:`, `/` or `#` breaks the URL. Use letters and digits. |
