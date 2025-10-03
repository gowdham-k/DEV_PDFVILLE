# Top-level script: admin_set_premium.py
import sys
import os
from dotenv import load_dotenv
import boto3

def set_premium(email: str, is_premium: bool = True) -> bool:
    """
    Set the Cognito custom:is_premium_ attribute for the user with the given email.
    Avoids importing the full Flask app to prevent font registration issues on Windows.
    """
    # Load env variables (REGION, USER_POOL_ID) from .env files or environment
    load_dotenv()
    region = os.environ.get("REGION", "ap-southeast-2")
    user_pool_id = os.environ.get("USER_POOL_ID", "ap-southeast-2_LeVlFHGOf")

    cognito = boto3.client("cognito-idp", region_name=region)

    try:
        # Find Cognito username by email
        resp = cognito.list_users(
            UserPoolId=user_pool_id,
            Filter=f'email = "{email}"',
            Limit=1
        )
        if not resp["Users"]:
            print(f"❌ User with email {email} not found in Cognito.")
            return False

        username = resp["Users"][0]["Username"]
        attribute_value = "true" if is_premium else "false"

        # Update custom:is_premium_ attribute
        cognito.admin_update_user_attributes(
            UserPoolId=user_pool_id,
            Username=username,
            UserAttributes=[{"Name": "custom:is_premium_", "Value": attribute_value}]
        )
        print(f"✅ Set custom:is_premium_ = {attribute_value} for {email} ({username})")
        return True

    except Exception as e:
        print(f"❌ Error updating Cognito user {email}: {e}")
        return False

def main():
    if len(sys.argv) != 2:
        print("Usage: python backend\\admin_set_premium.py <email>")
        sys.exit(1)

    email = sys.argv[1]
    if set_premium(email, True):
        print("🎉 Upgrade completed. Frontend will show Premium after next /api/profile call.")
        # Removed outdated Stripe note
    else:
        sys.exit(2)

if __name__ == "__main__":
    main()