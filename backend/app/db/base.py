from sqlalchemy.ext.declarative import declarative_base

Base = declarative_base()

# Import all models here so Alembic can find them
from app.models.user import User  # noqa
from app.models.session import Session  # noqa
from app.models.hosted_zone import HostedZone # noqa
from app.models.dns_record import DNSRecord # noqa
