from pathlib import Path
import sys

ROOT = Path(__file__).resolve().parents[1]
if str(ROOT) not in sys.path:
    sys.path.insert(0, str(ROOT))

from pathlib import Path as _Path
from sqlalchemy import text

from app.db.session import engine


def run() -> None:
    migrations_dir = _Path(__file__).resolve().parents[1] / "migrations"
    files = sorted(migrations_dir.glob("*.sql"))

    with engine.begin() as conn:
        conn.execute(
            text(
                "CREATE TABLE IF NOT EXISTS schema_migrations (version TEXT PRIMARY KEY, applied_at TIMESTAMPTZ NOT NULL DEFAULT NOW())"
            )
        )
        applied = {row[0] for row in conn.execute(text("SELECT version FROM schema_migrations"))}

        for file in files:
            if file.name in applied:
                continue
            sql = file.read_text(encoding="utf-8")
            conn.execute(text(sql))
            conn.execute(text("INSERT INTO schema_migrations(version) VALUES (:v)"), {"v": file.name})
            print(f"Applied migration: {file.name}")


if __name__ == "__main__":
    run()