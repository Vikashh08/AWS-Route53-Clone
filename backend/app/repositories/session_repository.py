from sqlalchemy.orm import Session
from app.models.session import Session as SessionModel
from datetime import datetime

class SessionRepository:
    def __init__(self, db: Session):
        self.db = db

    def create(self, user_id: str, token_hash: str, expires_at: datetime) -> SessionModel:
        db_session = SessionModel(
            user_id=user_id,
            token_hash=token_hash,
            expires_at=expires_at
        )
        self.db.add(db_session)
        self.db.commit()
        self.db.refresh(db_session)
        return db_session

    def get_by_token_hash(self, token_hash: str) -> SessionModel | None:
        return self.db.query(SessionModel).filter(SessionModel.token_hash == token_hash).first()

    def delete_by_token_hash(self, token_hash: str) -> None:
        db_session = self.get_by_token_hash(token_hash)
        if db_session:
            self.db.delete(db_session)
            self.db.commit()

    def delete_expired_sessions(self) -> None:
        self.db.query(SessionModel).filter(SessionModel.expires_at < datetime.utcnow()).delete()
        self.db.commit()
