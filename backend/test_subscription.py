"""
Test script to verify the updated subscription model (basic/pro)
"""
from db_config import get_db
import db_utils
from models import User

# Get database connection
db = next(get_db())

# Create a basic user
basic_user = db_utils.create_user(
    db,
    email="basic_user@example.com",
    cognito_id="basic-user-id",
    first_name="Basic",
    last_name="User"
)
print(f"Created basic user with ID: {basic_user.id}")
print(f"Subscription status: {basic_user.subscription_status}")
print(f"Is pro: {basic_user.is_pro}")

# Create and set a pro user
pro_user = db_utils.create_user(
    db,
    email="pro_user@example.com",
    cognito_id="pro-user-id",
    first_name="Pro",
    last_name="User"
)

# Update to pro status
updated_user = db_utils.update_user_subscription_status(db, pro_user.id, True)
print(f"\nCreated pro user with ID: {updated_user.id}")
print(f"Subscription status: {updated_user.subscription_status}")
print(f"Is pro: {updated_user.is_pro}")

# Verify we can retrieve users
retrieved_basic = db_utils.get_user_by_email(db, "basic_user@example.com")
retrieved_pro = db_utils.get_user_by_email(db, "pro_user@example.com")

print("\nVerification:")
print(f"Basic user status: {retrieved_basic.subscription_status}")
print(f"Pro user status: {retrieved_pro.subscription_status}")

print("\nTest completed successfully!")