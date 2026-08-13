import logging
import sys

def setup_logging():
    logging.basicConfig(
        stream=sys.stdout,
        level=logging.INFO,
        format="%(asctime)s - %(name)s - %(levelname)s - %(message)s",
    )
    # Silence some noisy loggers
    logging.getLogger("sqlalchemy.engine").setLevel(logging.WARNING)

setup_logging()
