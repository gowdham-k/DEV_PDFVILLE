import uuid
from datetime import datetime, timedelta

from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

from db_config import Base
from models import User
import db_utils


def make_session():
    """Create an isolated in-memory SQLite session bound to Base."""
    engine = create_engine("sqlite:///:memory:", connect_args={"check_same_thread": False})
    Base.metadata.create_all(bind=engine)
    SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
    return SessionLocal()


def test_create_and_get_user_by_email():
    db = make_session()
    try:
        email = f"test_{uuid.uuid4()}@example.com"
        cognito_id = f"cognito-{uuid.uuid4()}"

        user = db_utils.create_user(db, email=email, cognito_id=cognito_id, first_name="A", last_name="B")
        assert user.email == email
        assert user.cognito_id == cognito_id

        fetched = db_utils.get_user_by_email(db, email)
        assert fetched is not None
        assert fetched.id == user.id
    finally:
        db.close()


def test_set_user_premium_by_email_true_false():
    db = make_session()
    try:
        email = f"premium_{uuid.uuid4()}@example.com"
        cognito_id = f"cognito-{uuid.uuid4()}"
        db_utils.create_user(db, email=email, cognito_id=cognito_id)

        # Set to pro
        user = db_utils.set_user_premium_by_email(db, email, True)
        assert user is not None
        assert user.is_pro is True
        assert user.subscription_status == "pro"

        # Then set back to basic
        user2 = db_utils.set_user_premium_by_email(db, email, False)
        assert user2 is not None
        assert user2.is_pro is False
        assert user2.subscription_status == "basic"
    finally:
        db.close()


def test_update_user_subscription_status_by_id():
    db = make_session()
    try:
        email = f"sub_{uuid.uuid4()}@example.com"
        cognito_id = f"cognito-{uuid.uuid4()}"
        user = db_utils.create_user(db, email=email, cognito_id=cognito_id)

        updated = db_utils.update_user_subscription_status(db, user.id, True)
        assert updated is not None
        assert updated.is_pro is True
        assert updated.subscription_status == "pro"
    finally:
        db.close()


def test_update_user_payment_info_sets_fields_and_pro():
    db = make_session()
    try:
        email = f"pay_{uuid.uuid4()}@example.com"
        cognito_id = f"cognito-{uuid.uuid4()}"
        db_utils.create_user(db, email=email, cognito_id=cognito_id)

        payment_data = {
            "payment_id": f"pid-{uuid.uuid4()}",
            "payment_amount": 999,
            "payment_date": datetime.utcnow(),
            "payment_method": "card",
            "payment_status": "captured",
            "subscription_expiry": datetime.utcnow() + timedelta(days=30),
        }
        user = db_utils.update_user_payment_info(db, email, payment_data)
        assert user is not None
        assert user.is_pro is True
        assert user.subscription_status == "pro"
        assert user.payment_id == payment_data["payment_id"]
        assert user.payment_amount == payment_data["payment_amount"]
        assert user.payment_method == payment_data["payment_method"]
        assert user.payment_status == payment_data["payment_status"]
        assert user.subscription_expiry == payment_data["subscription_expiry"]
    finally:
        db.close()


def test_file_crud_and_listing():
    db = make_session()
    try:
        email = f"files_{uuid.uuid4()}@example.com"
        cognito_id = f"cognito-{uuid.uuid4()}"
        user = db_utils.create_user(db, email=email, cognito_id=cognito_id)

        f1 = db_utils.create_file(db, filename="a.pdf", file_path="/tmp/a.pdf", file_type="pdf", file_size=123, user_id=user.id)
        f2 = db_utils.create_file(db, filename="b.pdf", file_path="/tmp/b.pdf", file_type="pdf", file_size=456, user_id=user.id)

        files = db_utils.get_user_files(db, user.id)
        names = sorted([f.filename for f in files])
        assert names == ["a.pdf", "b.pdf"]

        deleted = db_utils.delete_file(db, f1.id)
        assert deleted is True
        files_after = db_utils.get_user_files(db, user.id)
        assert sorted([f.filename for f in files_after]) == ["b.pdf"]
    finally:
        db.close()


def test_compression_usage_increment_and_monthly_count():
    db = make_session()
    try:
        email = f"usage_{uuid.uuid4()}@example.com"
        cognito_id = f"cognito-{uuid.uuid4()}"
        db_utils.create_user(db, email=email, cognito_id=cognito_id)

        # Increment twice
        u1 = db_utils.increment_compression_usage(db, email)
        assert u1.usage_count == 1
        u2 = db_utils.increment_compression_usage(db, email)
        assert u2.usage_count == 2

        count = db_utils.get_monthly_compression_count(db, email)
        assert count == 2
    finally:
        db.close()