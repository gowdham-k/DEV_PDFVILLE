import boto3
from flask import current_app # Import current_app to access app config

# Assuming USER_POOL_ID and cognito client are defined in app.py
# You might need to pass them or make them globally accessible if this is a separate file.

def set_premium_cognito(email, is_premium_=True):
    """
    Updates a user's subscription status in AWS Cognito.
    Note: Function name kept for backward compatibility, but now sets pro status.
    """
    cognito_client = boto3.client("cognito-idp", region_name="ap-southeast-2")
    user_pool_id = current_app.config['USER_POOL_ID']

    try:
        # 1. Find the user's Username (Cognito's internal identifier) by their email
        #    Cognito's ListUsers API is needed for this.
        response = cognito_client.list_users(
            UserPoolId=user_pool_id,
            Filter=f'email = "{email}"',
            Limit=1
        )

        if not response['Users']:
            print(f"User with email {email} not found in Cognito.")
            return False

        cognito_username = response['Users'][0]['Username']
        
        # 2. Update the custom attribute for the found user
        attribute_value = "true" if is_premium_ else "false"
        cognito_client.admin_update_user_attributes(
            UserPoolId=user_pool_id,
            Username=cognito_username,
            UserAttributes=[
                {
                    'Name': 'custom:is_premium_',
                    'Value': attribute_value
                }
            ]
        )
        print(f"Successfully set custom:is_premium_ to '{attribute_value}' for user {email} ({cognito_username}).")
        return True

    except Exception as e:
        print(f"Error updating Cognito user {email}: {e}")
        return False

