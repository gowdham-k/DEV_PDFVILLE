"""
Test script to verify payment data storage functionality
"""
from db_config import get_db
import db_utils
from datetime import datetime, timedelta

# Get database connection
db = next(get_db())

# Test user email
test_email = "payment_test@example.com"

# Create a test user if not exists
user = db_utils.get_user_by_email(db, test_email)
if not user:
    user = db_utils.create_user(
        db,
        email=test_email,
        cognito_id="payment-test-id",
        first_name="Payment",
        last_name="Test"
    )
    print(f"Created test user with ID: {user.id}")
else:
    print(f"Using existing user with ID: {user.id}")

# Simulate payment data
payment_data = {
    'payment_id': 'cs_test_' + datetime.now().strftime('%Y%m%d%H%M%S'),
    'payment_amount': 9900,  # $99.00
    'payment_date': datetime.utcnow(),
    'payment_method': 'card',
    'payment_status': 'completed',
    'subscription_expiry': datetime.utcnow() + timedelta(days=365)
}

# Update user payment info
updated_user = db_utils.update_user_payment_info(db, test_email, payment_data)

# Verify payment data was stored
print("\nPayment Data Verification:")
print(f"User ID: {updated_user.id}")
print(f"Email: {updated_user.email}")
print(f"Payment ID: {updated_user.payment_id}")
print(f"Payment Amount: ${updated_user.payment_amount/100:.2f}")
print(f"Payment Date: {updated_user.payment_date}")
print(f"Payment Method: {updated_user.payment_method}")
print(f"Payment Status: {updated_user.payment_status}")
print(f"Subscription Status: {updated_user.subscription_status}")
print(f"Is Pro: {updated_user.is_pro}")
print(f"Subscription Expiry: {updated_user.subscription_expiry}")

print("\nTest completed successfully!")