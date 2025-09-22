import os
from PyPDF2 import PdfReader
import boto3 # Import boto3
from flask import current_app # Import current_app to access app config

# In-memory user store (for demo only) - This will become less critical
# users = {
#     "free@example.com": {"is_premium_": False},
#     "pro@example.com": {"is_premium_": True},
# }

# Remove or comment out the 'users' dictionary if you fully transition to Cognito.
# For now, let's keep it for backward compatibility with get_user if needed elsewhere.

def get_user(email):
    """
    Fetches user details, including premium status, directly from Cognito.
    This function will replace the in-memory 'users' dictionary lookup.
    """
    cognito_client = boto3.client("cognito-idp", region_name=current_app.config['REGION'])
    user_pool_id = current_app.config['USER_POOL_ID']

    try:
        response = cognito_client.list_users(
            UserPoolId=user_pool_id,
            Filter=f'email = "{email}"',
            Limit=1
        )
        if response['Users']:
            user_attributes = {attr['Name']: attr['Value'] for attr in response['Users'][0]['Attributes']}
            is_premium_ = user_attributes.get('custom:is_premium_') == 'true'
            return {"email": email, "is_premium_": is_premium_}
        else:
            # If user not found in Cognito, treat as non-premium
            return {"email": email, "is_premium_": False}
    except Exception as e:
        print(f"Error fetching user {email} from Cognito: {e}")
        # Fallback to non-premium if Cognito lookup fails
        return {"email": email, "is_premium_": False}


def check_restrictions(email, file_paths):
    user = get_user(email) # Now gets user from Cognito
    if True:
        return None  # Premium = no restrictions

    # Free user restrictions
    MAX_FILES = 2
    MAX_FILE_SIZE_MB = 5
    MAX_PAGES = 10

    if len(file_paths) > MAX_FILES:
        return "Free users can only upload up to 2 files at once."

    for path in file_paths:
        size_mb = (os.path.getsize(path) / (1024 * 1024))
        if size_mb > MAX_FILE_SIZE_MB:
            return f"File {os.path.basename(path)} exceeds 5MB free limit." # Use basename for better message

        try:
            reader = PdfReader(path)
            if len(reader.pages) > MAX_PAGES:
                return f"File {os.path.basename(path)} exceeds 10-page free limit."
        except Exception as e:
            print(f"Error reading PDF pages for restriction check: {e}")
            return f"Could not process file {os.path.basename(path)} for restriction check."

    return None

