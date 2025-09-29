# Example to add a test user
from db_config import get_db
import db_utils

db = next(get_db())
test_user = db_utils.create_user(
    db,
    email="test@example.com",
    cognito_id="test-cognito-id",
    first_name="Test",
    last_name="User"
)
print(f"Created user with ID: {test_user.id}")