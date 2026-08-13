import asyncio
from sqlalchemy.orm import Session
from app.db.database import SessionLocal
from app.models.user import User
from app.core.security import get_password_hash

def seed_db():
    db = SessionLocal()
    try:
        user = db.query(User).filter(User.email == "user@example.com").first()
        if not user:
            user = User(
                email="user@example.com",
                name="Demo User",
                password_hash=get_password_hash("password123")
            )
            db.add(user)
            db.commit()
            print("Successfully seeded demo user: user@example.com / password123")
        else:
            print("Demo user already exists.")
    finally:
        db.close()

if __name__ == "__main__":
    seed_db()
