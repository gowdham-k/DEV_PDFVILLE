import os
import PyPDF2
from flask import Flask, jsonify
from flask_cors import CORS
# session/progress tracking
from flask import session
import uuid
import threading
import time
import random
# Import all PDF operations
import boto3
from flask import request
from jose import jwt
import requests
from dotenv import load_dotenv

# Database imports
from db_config import engine, Base, get_db
from models import User, File
import db_utils
from convert_to_png import convert_pdf_to_png
from merge_pdf import merge_pdfs
from split_pdf import split_pdf
from compress_pdf import compress_pdf
from protect_pdf import protect_pdf
from convert_to_jpg import convert_pdf_to_jpg
from convert_to_pptx import convert_pdf_to_pptx
from convert_to_excel import convert_pdf_to_excel
# NEW IMPORTS FROM VERSION 2
from convert_to_html import handle_convert_pdf_to_html
from convert_to_word import handle_convert_pdf_to_word
from convert_to_pdf import convert_to_pdf
# NEW SPECIFIC CONVERSION IMPORTS
from convert_jpg_to_pdf import convert_jpg_to_pdf
from convert_png_to_pdf import convert_png_to_pdf
from convert_word_to_pdf import convert_word_to_pdf
from convert_excel_to_pdf import convert_excel_to_pdf
from convert_pptx_to_pdf import convert_pptx_to_pdf
from convert_html_to_pdf import convert_html_to_pdf
from convert_to_pdfa import convert_pdf_to_pdfa
from rotate_pdf import rotate_pdf_pages
from add_watermark import add_watermark
from add_page_numbers import add_page_numbers_route
from remove_pages import remove_pages
from unlock_pdf import unlock_pdf
from scan_pdf import scan_pdf
from edit_pdf import edit_pdf


from functools import wraps
from sqlalchemy.orm import Session
from datetime import datetime
import hmac
import hashlib
import base64
from restrictions import check_restrictions, get_user
from cognito_utils import set_premium_cognito as set_pro_subscription # Add this line
    # ...
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont

pdfmetrics.registerFont(TTFont('Arial', 'arial.ttf'))

# Now use 'Arial' in your PDF code



progress_store = {}  # Store progress of PDF operations

# Load environment variables
# First load the default environment file based on FLASK_ENV
flask_env = os.environ.get('FLASK_ENV', 'development')
if flask_env == 'production':
    load_dotenv('.env.production')
else:
    load_dotenv('.env.development')

# Then load any local overrides
load_dotenv('.env.local', override=True)
load_dotenv('.env', override=True)

# Initialize Flask app
app = Flask(__name__)

# Configure maximum file upload size (50MB)
app.config['MAX_CONTENT_LENGTH'] = 50 * 1024 * 1024  # 50MB in bytes

# Configure CORS based on environment
cors_origins = os.environ.get('CORS_ORIGINS', '*')
if cors_origins == '*':
    CORS(app, resources={r"/*": {"origins": "*"}}, supports_credentials=True)
else:
    origins = cors_origins.split(',')
    CORS(app, resources={r"/*": {"origins": origins}}, supports_credentials=True)

# Get API prefix from environment
API_PREFIX = os.environ.get('API_PREFIX', '')

# Configure AWS Cognito
app.config['REGION'] = os.environ.get('REGION', "ap-southeast-2")
app.config['USER_POOL_ID'] = os.environ.get('USER_POOL_ID', "ap-southeast-2_LeVlFHGOf")
app.config['APP_CLIENT_ID'] = os.environ.get('APP_CLIENT_ID', "1u8apgpumk8dbnkeaomu9alv67")
app.config['APP_CLIENT_SECRET'] = os.environ.get('APP_CLIENT_SECRET', "1idscabr0beu9v3fqfffsm3mbggif1j9jjlnpnp3pk09mhphk96p")

# Initialize database
def initialize_database():
    Base.metadata.create_all(bind=engine)

# Create tables at startup
with app.app_context():
    initialize_database()
    
# User management routes
@app.route('/api/users', methods=['POST'])
def create_user_route():
    data = request.json
    db = next(get_db())
    
    try:
        # Check if user already exists
        existing_user = db_utils.get_user_by_email(db, data['email'])
        if existing_user:
            return jsonify({"error": "User already exists"}), 400
            
        # Create new user
        user = db_utils.create_user(
            db,
            email=data['email'],
            cognito_id=data.get('cognito_id', ''),
            first_name=data.get('first_name', ''),
            last_name=data.get('last_name', ''),
            phone_number=data.get('phone_number', '')
        )
        
        return jsonify({
            "id": user.id,
            "email": user.email,
            "first_name": user.first_name,
            "last_name": user.last_name,
            "created_at": user.created_at.isoformat()
        }), 201
        
    except Exception as e:
        db.rollback()
        return jsonify({"error": str(e)}), 500
    finally:
        db.close()

@app.route('/api/users/<int:user_id>', methods=['GET'])
def get_user_route(user_id):
    db = next(get_db())
    
    try:
        user = db_utils.get_user_by_id(db, user_id)
        if not user:
            return jsonify({"error": "User not found"}), 404
            
        return jsonify({
            "id": user.id,
            "email": user.email,
            "first_name": user.first_name,
            "last_name": user.last_name,
            "phone_number": user.phone_number,
            "is_pro": user.is_pro,
            "subscription_status": user.subscription_status,
            "created_at": user.created_at.isoformat()
        })
        
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    finally:
        db.close()

@app.route('/api/users/<int:user_id>', methods=['PUT'])
def update_user_route(user_id):
    data = request.json
    db = next(get_db())
    
    try:
        user = db_utils.get_user_by_id(db, user_id)
        if not user:
            return jsonify({"error": "User not found"}), 404
            
        # Update user fields
        if 'first_name' in data:
            user.first_name = data['first_name']
        if 'last_name' in data:
            user.last_name = data['last_name']
        if 'phone_number' in data:
            user.phone_number = data['phone_number']
        if 'profile_picture' in data:
            user.profile_picture = data['profile_picture']
        
        user.updated_at = datetime.utcnow()
        db.commit()
        
        return jsonify({
            "id": user.id,
            "email": user.email,
            "first_name": user.first_name,
            "last_name": user.last_name,
            "updated_at": user.updated_at.isoformat()
        })
        
    except Exception as e:
        db.rollback()
        return jsonify({"error": str(e)}), 500
    finally:
        db.close()

@app.route('/api/users/<int:user_id>/files', methods=['GET'])
def get_user_files_route(user_id):
    db = next(get_db())
    
    try:
        files = db_utils.get_user_files(db, user_id)
        
        return jsonify([{
            "id": file.id,
            "filename": file.filename,
            "file_type": file.file_type,
            "file_size": file.file_size,
            "created_at": file.created_at.isoformat()
        } for file in files])
        
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    finally:
        db.close()



# ---- AWS Cognito Config ----

# Use environment variables for AWS Cognito configuration
REGION = os.environ.get('REGION', "ap-southeast-2")         # your region
USER_POOL_ID = os.environ.get('USER_POOL_ID', "ap-southeast-2_LeVlFHGOf")  # your user pool id
APP_CLIENT_ID = os.environ.get('APP_CLIENT_ID', "1u8apgpumk8dbnkeaomu9alv67")  # your app client id
APP_CLIENT_SECRET = os.environ.get('APP_CLIENT_SECRET', "1idscabr0beu9v3fqfffsm3mbggif1j9jjlnpnp3pk09mhphk96p")  # your client secret

cognito = boto3.client("cognito-idp", region_name=REGION)

# ---- Helper function to generate SECRET_HASH ----
def get_secret_hash(username):
    """Generate SECRET_HASH for Cognito operations"""
    message = username + APP_CLIENT_ID
    dig = hmac.new(
        APP_CLIENT_SECRET.encode('utf-8'),
        msg=message.encode('utf-8'),
        digestmod=hashlib.sha256
    ).digest()
    return base64.b64encode(dig).decode()

# ---- Authentication Decorator ----
def token_required(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        token = request.headers.get('Authorization')
        
        if not token:
            return jsonify({'error': 'Token is missing'}), 401
        
        # Remove 'Bearer ' prefix if present
        if token.startswith('Bearer '):
            token = token[7:]
        
        try:
            # Verify token with Cognito
            response = cognito.get_user(AccessToken=token)
            current_user = {
                'username': response['Username'],
                'attributes': {attr['Name']: attr['Value'] for attr in response['UserAttributes']}
            }
            request.current_user = current_user
        except cognito.exceptions.NotAuthorizedException:
            return jsonify({'error': 'Token is invalid'}), 401
        except Exception as e:
            return jsonify({'error': f'Token verification failed: {str(e)}'}), 401
        
        return f(*args, **kwargs)
    
    return decorated

# Helper function to prefix routes with API_PREFIX
def prefix_route(route_path):
    """Add API_PREFIX to route path if needed"""
    # Ensure route_path starts with a slash
    if not route_path.startswith('/'):
        route_path = '/' + route_path
    
    # Add API_PREFIX if it exists
    if API_PREFIX:
        return API_PREFIX + route_path
    return route_path

# ---------- Authentication Routes ----------

@app.route(prefix_route("/login"), methods=["POST"])
def login():
    """User login route"""
    data = request.json
    email = data.get("email")
    password = data.get("password")

    if not email or not password:
        return jsonify({"error": "Email and password are required"}), 400

    print(f"🔍 Login attempt for: {email}")
    
    try:
        response = cognito.initiate_auth(
            AuthFlow="USER_PASSWORD_AUTH",
            AuthParameters={
                "USERNAME": email,
                "PASSWORD": password,
                "SECRET_HASH": get_secret_hash(email)
            },
            ClientId=APP_CLIENT_ID
        )
        
        # Check if AuthenticationResult exists in response
        if 'AuthenticationResult' not in response:
            print(f"❌ No AuthenticationResult in response for {email}")
            return jsonify({"error": "Authentication failed - no result returned"}), 401
        
        print(f"✅ Login successful for: {email}")
        return jsonify({
            "access_token": response["AuthenticationResult"]["AccessToken"],
            "id_token": response["AuthenticationResult"]["IdToken"],
            "refresh_token": response["AuthenticationResult"]["RefreshToken"],
            "expires_in": response["AuthenticationResult"]["ExpiresIn"]
        })
        
    except cognito.exceptions.NotAuthorizedException as e:
        print(f"❌ Authentication failed for {email}: {str(e)}")
        return jsonify({"error": "Invalid credentials"}), 401
    except cognito.exceptions.UserNotConfirmedException as e:
        print(f"❌ User not confirmed: {email}")
        return jsonify({"error": "User email not confirmed"}), 401
    except cognito.exceptions.PasswordResetRequiredException as e:
        print(f"❌ Password reset required for: {email}")
        return jsonify({"error": "Password reset required"}), 401
    except KeyError as e:
        print(f"❌ Missing key in response for {email}: {str(e)}")
        return jsonify({"error": "Authentication response format error"}), 500
    except Exception as e:
        print(f"❌ Login error for {email}: {str(e)}")
        return jsonify({"error": str(e)}), 400
    

@app.route(prefix_route("/signup"), methods=["POST"])
def signup():
    """User registration route"""
    data = request.json
    email = data.get("email")
    password = data.get("password")
    first_name = data.get("firstName", "")
    last_name = data.get("lastName", "")

    if not email or not password:
        return jsonify({"error": "Email and password are required"}), 400

    try:
        # Prepare user attributes
        user_attributes = []        
        # Add name attributes if provided
        if first_name:
            user_attributes.append({"Name": "given_name", "Value": first_name})
        if last_name:
            user_attributes.append({"Name": "family_name", "Value": last_name})

        # Create user in Cognito with SECRET_HASH
        response = cognito.sign_up(
            ClientId=APP_CLIENT_ID,
            Username=email,
            Password=password,
            SecretHash=get_secret_hash(email),
            UserAttributes=user_attributes
        )
        
        # Store user in PostgreSQL database
        db = next(get_db())
        try:
            # Check if user already exists in database
            existing_user = db_utils.get_user_by_email(db, email)
            if not existing_user:
                # Create new user in database
                db_utils.create_user(db, email, response["UserSub"])
                print(f"✅ User stored in database: {email}")
        except Exception as db_error:
            print(f"⚠️ Database error: {str(db_error)}")
            # Continue even if database storage fails
            # User is already created in Cognito
        
        print(f"✅ User created successfully: {email}")
        return jsonify({
            "message": "User created successfully. Please check your email for verification code.",
            "userSub": response["UserSub"]
        }), 201

    except cognito.exceptions.UsernameExistsException:
        print(f"❌ User already exists: {email}")
        return jsonify({"error": "An account with this email already exists"}), 400
    except cognito.exceptions.InvalidPasswordException as e:
        print(f"❌ Invalid password for {email}: {str(e)}")
        return jsonify({"error": "Password does not meet requirements"}), 400
    except cognito.exceptions.InvalidParameterException as e:
        print(f"❌ Invalid parameter for {email}: {str(e)}")
        return jsonify({"error": "Invalid email format"}), 400
    except Exception as e:
        print(f"❌ Signup error for {email}: {str(e)}")
        return jsonify({"error": f"Signup failed: {str(e)}"}), 400

@app.route(prefix_route("/confirm-signup"), methods=["POST"])
def confirm_signup():
    """Confirm user email with verification code"""
    data = request.json
    email = data.get("email")
    confirmation_code = data.get("confirmationCode")

    if not email or not confirmation_code:
        return jsonify({"error": "Email and confirmation code are required"}), 400

    try:
        response = cognito.confirm_sign_up(
            ClientId=APP_CLIENT_ID,
            Username=email,
            ConfirmationCode=confirmation_code,
            SecretHash=get_secret_hash(email)
        )
        
        print(f"✅ Email confirmed successfully: {email}")
        return jsonify({"message": "Email confirmed successfully"}), 200

    except cognito.exceptions.CodeMismatchException:
        print(f"❌ Invalid confirmation code for {email}")
        return jsonify({"error": "Invalid confirmation code"}), 400
    except cognito.exceptions.ExpiredCodeException:
        print(f"❌ Expired confirmation code for {email}")
        return jsonify({"error": "Confirmation code has expired. Please request a new one."}), 400
    except cognito.exceptions.NotAuthorizedException:
        print(f"❌ User already confirmed or invalid: {email}")
        return jsonify({"error": "User is already confirmed or code is invalid"}), 400
    except Exception as e:
        print(f"❌ Confirmation error for {email}: {str(e)}")
        return jsonify({"error": f"Confirmation failed: {str(e)}"}), 400

@app.route(prefix_route("/resend-confirmation"), methods=["POST"])
def resend_confirmation():
    """Resend confirmation code to user"""
    data = request.json
    email = data.get("email")

    if not email:
        return jsonify({"error": "Email is required"}), 400

    try:
        response = cognito.resend_confirmation_code(
            ClientId=APP_CLIENT_ID,
            Username=email,
            SecretHash=get_secret_hash(email)
        )
        
        print(f"✅ Confirmation code resent to: {email}")
        return jsonify({"message": "Confirmation code sent successfully"}), 200

    except cognito.exceptions.UserNotFoundException:
        print(f"❌ User not found: {email}")
        return jsonify({"error": "User not found"}), 404
    except cognito.exceptions.InvalidParameterException:
        print(f"❌ User already confirmed: {email}")
        return jsonify({"error": "User is already confirmed"}), 400
    except Exception as e:
        print(f"❌ Resend error for {email}: {str(e)}")
        return jsonify({"error": f"Failed to resend code: {str(e)}"}), 400

@app.route(prefix_route("/profile"), methods=["GET"])
@token_required
def get_profile():
    """Get user profile information"""
    try:
        user = request.current_user
        return jsonify({
            "username": user['username'],
            "email": user['attributes'].get('email', ''),
            "email_verified": user['attributes'].get('email_verified', ''),
            "attributes": user['attributes']
        })
    except Exception as e:
        return jsonify({"error": f"Failed to fetch profile: {str(e)}"}), 500

@app.route(prefix_route("/refresh-token"), methods=["POST"])
def refresh_token():
    """Refresh access token using refresh token"""
    data = request.json
    refresh_token = data.get("refresh_token")
    username = data.get("username")  # Username needed for SECRET_HASH
    
    if not refresh_token or not username:
        return jsonify({"error": "Refresh token and username are required"}), 400
    
    try:
        response = cognito.initiate_auth(
            AuthFlow="REFRESH_TOKEN_AUTH",
            AuthParameters={
                "REFRESH_TOKEN": refresh_token,
                "SECRET_HASH": get_secret_hash(username)
            },
            ClientId=APP_CLIENT_ID
        )
        return jsonify({
            "access_token": response["AuthenticationResult"]["AccessToken"],
            "id_token": response["AuthenticationResult"]["IdToken"],
            "expires_in": response["AuthenticationResult"]["ExpiresIn"]
        })
    except Exception as e:
        return jsonify({"error": f"Token refresh failed: {str(e)}"}), 400

@app.route(prefix_route("/logout"), methods=["POST"])
@token_required
def logout():
    """Logout user and invalidate token"""
    try:
        token = request.headers.get('Authorization')
        if token.startswith('Bearer '):
            token = token[7:]
        
        # Global sign out to invalidate all tokens
        cognito.global_sign_out(AccessToken=token)
        return jsonify({"message": "Successfully logged out"})
    except Exception as e:
        return jsonify({"error": f"Logout failed: {str(e)}"}), 400

@app.route(prefix_route("/forgot-password"), methods=["POST"])
def forgot_password():
    """Initiate password reset process"""
    data = request.json
    email = data.get("email")

    if not email:
        return jsonify({"error": "Email is required"}), 400

    try:
        response = cognito.forgot_password(
            ClientId=APP_CLIENT_ID,
            Username=email,
            SecretHash=get_secret_hash(email)
        )
        
        print(f"✅ Password reset initiated for: {email}")
        return jsonify({"message": "Password reset code sent to your email"}), 200

    except cognito.exceptions.UserNotFoundException:
        print(f"❌ User not found for password reset: {email}")
        return jsonify({"error": "User not found"}), 404
    except cognito.exceptions.InvalidParameterException:
        print(f"❌ Invalid parameter for password reset: {email}")
        return jsonify({"error": "Invalid email format"}), 400
    except Exception as e:
        print(f"❌ Password reset error for {email}: {str(e)}")
        return jsonify({"error": f"Password reset failed: {str(e)}"}), 400

@app.route(prefix_route("/verify-code"), methods=["POST"])
def verify_code():
    """Verify confirmation code before password reset"""
    data = request.json
    email = data.get("email")
    confirmation_code = data.get("confirmationCode")

    if not email or not confirmation_code:
        return jsonify({"error": "Email and confirmation code are required"}), 400

    # For verification only, we'll just return success
    # The actual verification will happen when the user submits the new password
    # This is because Cognito doesn't have a way to verify a code without using it
    
    print(f"✅ Code verification step passed for: {email}")
    return jsonify({"message": "Code verification step passed. Please set your new password."}), 200

@app.route(prefix_route("/reset-password"), methods=["POST"])
def reset_password():
    """Reset password with confirmation code"""
    data = request.json
    email = data.get("email")
    confirmation_code = data.get("confirmationCode")
    new_password = data.get("newPassword")

    if not email or not confirmation_code or not new_password:
        return jsonify({"error": "Email, confirmation code, and new password are required"}), 400

    try:
        response = cognito.confirm_forgot_password(
            ClientId=APP_CLIENT_ID,
            Username=email,
            ConfirmationCode=confirmation_code,
            Password=new_password,
            SecretHash=get_secret_hash(email)
        )
        
        print(f"✅ Password reset successful for: {email}")
        return jsonify({"message": "Password reset successful"}), 200

    except cognito.exceptions.CodeMismatchException:
        print(f"❌ Invalid reset code for {email}")
        return jsonify({"error": "Invalid confirmation code"}), 400
    except cognito.exceptions.ExpiredCodeException:
        print(f"❌ Expired reset code for {email}")
        return jsonify({"error": "Confirmation code has expired"}), 400
    except cognito.exceptions.InvalidPasswordException:
        print(f"❌ Invalid new password for {email}")
        return jsonify({"error": "Password does not meet requirements"}), 400
    except Exception as e:
        print(f"❌ Password reset error for {email}: {str(e)}")
        return jsonify({"error": f"Password reset failed: {str(e)}"}), 400
# ...testing...

@app.route('/test/cognito-upgrade', methods=['POST'])
def test_cognito_upgrade():
    data = request.json or {}
    email = data.get('email')
    if not email:
        return jsonify({"error": "Email is required"}), 400

    success = set_pro_subscription(email, True)
    if not success:
        return jsonify({"error": "Failed to update user in Cognito"}), 500

    # Fetch updated user attributes to confirm
    try:
        response = cognito.list_users(
            UserPoolId=USER_POOL_ID,
            Filter=f'email = "{email}"',
            Limit=1
        )
        if not response['Users']:
            return jsonify({"error": "User not found after update"}), 404

        user_attrs = {attr['Name']: attr['Value'] for attr in response['Users'][0]['Attributes']}
        return jsonify({"message": "User upgraded to pro", "attributes": user_attrs}), 200
    except Exception as e:
        return jsonify({"error": f"Failed to fetch user: {str(e)}"}), 500


# Stripe webhook handler
@app.route('/stripe/webhook', methods=['POST'])
def stripe_webhook():
    payload = request.data
    sig_header = request.headers.get('Stripe-Signature')
    
    # Get the webhook secret from environment variables
    webhook_secret = os.environ.get('STRIPE_WEBHOOK_SECRET')
    
    try:
        # Verify the webhook signature
        import stripe
        event = stripe.Webhook.construct_event(
            payload, sig_header, webhook_secret
        )
        # Example handling
        if event.get('type') == 'checkout.session.completed':
            session = event.get('data', {}).get('object', {})
            customer_email = session.get('customer_details', {}).get('email') or session.get('customer_email')
            if customer_email:
                # Use the new function to update Cognito
                if set_pro_subscription(customer_email, True):
                    print(f"[Stripe Webhook] Successfully upgraded {customer_email} in Cognito.")
                    
                    # Store payment data in database
                    try:
                        db = next(get_db())
                        
                        # Calculate subscription expiry (1 year from now)
                        from datetime import datetime, timedelta
                        subscription_expiry = datetime.utcnow() + timedelta(days=365)
                        
                        # Prepare payment data
                        payment_data = {
                            'payment_id': session.get('id'),
                            'payment_amount': session.get('amount_total'),
                            'payment_date': datetime.utcnow(),
                            'payment_method': session.get('payment_method_types', ['card'])[0],
                            'payment_status': 'completed',
                            'subscription_expiry': subscription_expiry
                        }
                        
                        # Update user payment info in database
                        updated_user = db_utils.update_user_payment_info(db, customer_email, payment_data)
                        if updated_user:
                            print(f"[Stripe Webhook] Successfully stored payment data for {customer_email} in database.")
                        else:
                            print(f"[Stripe Webhook] Failed to store payment data for {customer_email} in database.")
                    except Exception as db_error:
                        print(f"[Stripe Webhook] Database error: {db_error}")
                else:
                    print(f"[Stripe Webhook] Failed to upgrade {customer_email} in Cognito.")
        return jsonify({'status': 'ok'}), 200
    except Exception as e:
        print(f"[Stripe Webhook Error] {e}")
        return jsonify({'error': 'invalid webhook'}), 400
    

# ---------- Protected PDF Routes ----------

@app.route(prefix_route("/merge"), methods=["POST"])
def merge_route():
    """Route for merging PDFs"""
    return merge_pdfs()

@app.route(prefix_route("/split"), methods=["POST"])
def split_route():
    """Route for splitting PDFs"""
    return split_pdf()

@app.route(prefix_route("/compress"), methods=["POST"])
def compress_route():
    """Route for compressing PDFs"""
    return compress_pdf()

@app.route(prefix_route("/protect"), methods=["POST"])
def protect_route():
    """Route for protecting PDFs with password"""
    return protect_pdf()

@app.route(prefix_route("/convert-jpg"), methods=["POST"])
def convert_jpg_route():
    """Route for converting PDF to JPG"""
    return convert_pdf_to_jpg()

@app.route(prefix_route("/convert-png"), methods=["POST"])
def convert_png_route():
    """Route for converting PDF to PNG"""
    return convert_pdf_to_png()

@app.route(prefix_route("/convert-pptx"), methods=["POST"])
def convert_pptx_route():
    """Route for converting PDF to PPTX"""
    return convert_pdf_to_pptx()

@app.route(prefix_route("/convert-excel"), methods=["POST"])
def convert_excel_route():
    """Route for converting PDF to Excel"""
    return convert_pdf_to_excel()

# ---------- NEW ROUTES FROM VERSION 2 ----------

@app.route(prefix_route("/convert-html"), methods=["POST"])
def convert_to_html_route():
    """Route for converting PDF to HTML"""
    return handle_convert_pdf_to_html()

@app.route(prefix_route("/convert-word"), methods=["POST"])
def convert_to_word_route():
    """Route for converting PDF to Word"""
    return handle_convert_pdf_to_word()

@app.route(prefix_route("/convert-pdf"), methods=["POST"])
def convert_to_pdf_route():
    """Route for converting various formats to PDF"""
    return convert_to_pdf()

# ---------- NEW SPECIFIC CONVERSION ROUTES ----------

@app.route(prefix_route("/convert-jpg-to-pdf"), methods=["POST"])
def convert_jpg_to_pdf_route():
    """Route for converting JPG images to PDF"""
    return convert_jpg_to_pdf()

@app.route(prefix_route("/convert-png-to-pdf"), methods=["POST"])
def convert_png_to_pdf_route():
    """Route for converting PNG images to PDF"""
    return convert_png_to_pdf()

@app.route(prefix_route("/convert-word-to-pdf"), methods=["POST"])
def convert_word_to_pdf_route():
    """Route for converting Word documents to PDF"""
    return convert_word_to_pdf()

@app.route(prefix_route("/convert-excel-to-pdf"), methods=["POST"])
def convert_excel_to_pdf_route():
    """Route for converting Excel spreadsheets to PDF"""
    return convert_excel_to_pdf()

@app.route(prefix_route("/convert-pptx-to-pdf"), methods=["POST"])
def convert_pptx_to_pdf_route():
    """Route for converting PowerPoint presentations to PDF"""
    return convert_pptx_to_pdf()

@app.route(prefix_route("/convert-html-to-pdf"), methods=["POST"])
def convert_html_to_pdf_route():
    """Route for converting HTML to PDF"""
    return convert_html_to_pdf()

@app.route(prefix_route("/convert-pdf-to-pdfa"), methods=["POST"])
def convert_pdf_to_pdfa_route():
    """Route for converting PDF to PDF/A format"""
    return convert_pdf_to_pdfa()

@app.route(prefix_route("/pdf-add-watermark"), methods=["POST"])
def pdf_add_watermark_route():
    """Route for adding watermark to PDF - No authentication required"""
    print("\n🔍 Watermark endpoint accessed")
    print("📝 Processing watermark request...\n")
    return add_watermark()

@app.route(prefix_route("/pdf-remove-pages"), methods=["POST"])
def pdf_remove_pages_route():
    """Route for removing pages from PDF"""
    return remove_pages()

@app.route(prefix_route("/pdf-unlock"), methods=["POST"])
def pdf_unlock_route():
    """Route for unlocking password-protected PDFs"""
    return unlock_pdf()

@app.route(prefix_route('/pdf-rotate-pages'), methods=['POST'])
def rotate_pdf_pages_route():
    """Route for rotating PDF pages"""
    return rotate_pdf_pages()

@app.route(prefix_route("/pdf-add-page-numbers"), methods=["POST"])
def pdf_add_page_numbers_route():
    """Route for adding page numbers to PDF"""
    return add_page_numbers_route()

@app.route(prefix_route("/pdf-scan"), methods=["POST"])
def pdf_scan_route():
    """Route for scanning PDF with OCR"""
    return scan_pdf()  

@app.route(prefix_route("/edit-pdf"), methods=["POST"])
def edit_pdf_api_route():
    """Route for editing PDFs"""
    return edit_pdf()

# ---------- Public Routes ----------

@app.route(prefix_route("/health"), methods=["GET"])
def health_check():
    """Health check endpoint"""
    return jsonify({"status": "healthy", "message": "PDF Toolbox API is running"})

@app.route(prefix_route("/progress/<task_id>"), methods=["GET"])
def get_progress(task_id):
    progress = progress_store.get(task_id, {"progress": 0, "status": "not_found"})
    return jsonify(progress)


# ---------- Application Startup ----------

if __name__ == "__main__":
    print("🚀 Starting PDF Toolbox Server...")
    print("🌐 Server will be available at: http://localhost:5000")
    print("🔧 Available endpoints:")
    print("   POST /login - User authentication")
    print("   POST /signup - User registration")
    print("   POST /confirm-signup - Email verification")
    print("   POST /resend-confirmation - Resend verification code")
    print("   POST /forgot-password - Password reset")
    print("   POST /reset-password - Complete password reset")
    print("   GET /profile - Get user profile (protected)")
    print("   POST /refresh-token - Refresh access token")
    print("   POST /logout - User logout (protected)")
    print("   POST /merge - Merge multiple PDFs (protected)")
    print("   POST /split - Split PDF into pages (protected)") 
    print("   POST /compress - Compress PDF file (protected)")
    print("   POST /protect - Add password protection (protected)")
    print("   POST /convert-jpg - Convert PDF to JPG images (protected)")
    print("   POST /convert-pptx - Convert PDF to PowerPoint (protected)")
    print("   POST /convert-excel - Convert PDF to Excel (protected)")
    print("   POST /convert-html - Convert PDF to HTML (protected)")
    print("   POST /convert-word - Convert PDF to Word (protected)")
    print("   POST /convert-pdf - Convert various formats to PDF (protected)")
    print("   POST /convert-jpg-to-pdf - Convert JPG to PDF (protected)")
    print("   POST /convert-png-to-pdf - Convert PNG to PDF (protected)")
    print("   POST /convert-word-to-pdf - Convert Word to PDF (protected)")
    print("   POST /convert-excel-to-pdf - Convert Excel to PDF (protected)")
    print("   POST /convert-pptx-to-pdf - Convert PowerPoint to PDF (protected)")
    print("   POST /convert-html-to-pdf - Convert HTML to PDF (protected)")
    print("   GET /health - Check server status")
    print("   GET /progress/<task_id> - Get operation progress")
    print("\n✅ CORS enabled for all origins")
    print("🔐 Authentication required for PDF operations")
    app.run(debug=True,use_reloader=False, host='0.0.0.0', port=5000)

