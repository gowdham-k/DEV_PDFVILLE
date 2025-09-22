import os

# Environment configuration
ENVIRONMENT = os.environ.get('FLASK_ENV', 'development')

# AWS Cognito Configuration
REGION = "ap-southeast-2"
USER_POOL_ID = "ap-southeast-2_LeVlFHGOf"
APP_CLIENT_ID = "1u8apgpumk8dbnkeaomu9alv67"
APP_CLIENT_SECRET = "1idscabr0beu9v3fqfffsm3mbggif1j9jjlnpnp3pk09mhphk96p"

# Base URL Configuration
def get_base_url():
    """Determine the base URL based on environment"""
    if ENVIRONMENT == 'production':
        return ""
    else:
        return ""

# CORS Configuration
def get_cors_origins():
    """Get CORS origins based on environment"""
    if ENVIRONMENT == 'production':
        return ["https://dev.pdfville.com"]
    else:
        return ["*"]  # Allow all origins in development