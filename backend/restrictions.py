import os
from PyPDF2 import PdfReader
import boto3 # Import boto3
from flask import current_app # Import current_app to access app config
from datetime import datetime
# In-memory user store (for demo only) - This will become less critical
# users = {
#     "free@example.com": {"is_premium_": False},
#     "pro@example.com": {"is_premium_": True},
# }

# Remove or comment out the 'users' dictionary if you fully transition to Cognito.
# For now, let's keep it for backward compatibility with get_user if needed elsewhere.
def get_user(email):
        # First, enforce expiry in local DB and sync Cognito if needed
    try:
        from db_config import get_db
        import db_utils
        from cognito_utils import set_premium_cognito
        db = next(get_db())
        try:
            db_user = db_utils.get_user_by_email(db, email)
            if db_user and db_user.is_pro and db_user.subscription_expiry:
                if datetime.utcnow() > db_user.subscription_expiry:
                    # Downgrade expired subscription
                    db_user.is_pro = False
                    db_user.subscription_status = "basic"
                    db.commit()
                    db.refresh(db_user)
                    try:
                        set_premium_cognito(email, False)
                    except Exception:
                        # Keep going even if Cognito update fails
                        pass
        finally:
            db.close()
    except Exception as e:
        # Log but don't block user feature check
        print(f"Error enforcing subscription expiry for {email}: {e}")

    # Then, read premium flag from Cognito

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
            print(f"[DEBUG] Cognito attributes for {email}: {user_attributes}")  # ADD THIS
            is_premium_ = user_attributes.get('custom:is_premium_') == 'true'
            print(f"[DEBUG] is_premium_ value: {is_premium_}")  # ADD THIS
            return {"email": email, "is_premium_": is_premium_}
        else:
            # No user found in Cognito; treat as non-premium by default
            return {"email": email, "is_premium_": False}
    except Exception as e:
        # Handle Cognito errors gracefully and default to non-premium
        print(f"Error fetching user from Cognito: {e}")
        return {"email": email, "is_premium_": False}

def check_restrictions(email, file_paths):
    user = get_user(email) # Now gets user from Cognito
    if user["is_premium_"]:
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

def check_edit_pdf_restrictions(email, file_paths, operations=None):
    """
    Check restrictions specific to the edit_pdf feature.
    Free users can only add text annotations.
    
    Args:
        email: User's email
        file_paths: List of file paths to check
        operations: List of edit operations to perform
        
    Returns:
        Error message if restrictions are violated, None otherwise
    """
    user = get_user(email)
    
    # Premium users have no restrictions
    if user["is_premium_"]:
        return None
    
    # Free user restrictions for edit_pdf
    if operations:
        for operation in operations:
            op_type = operation.get('type')
            # Free users can only add text
            if op_type and op_type != 'add_text':
                return {"error": "Free users can only add text annotations. Upgrade to premium for shapes, images, and page operations.", "show_upgrade": True}
    
    return None

def check_compress_pdf_restrictions(email, file_paths, compression_level="medium"):
    """
    Check restrictions specific to the compress_pdf feature.
    
    Args:
        email: User's email
        file_paths: List of file paths to check
        compression_level: Compression level requested (low, medium, high)
        
    Returns:
        Error message if restrictions are violated, None otherwise
    """
    user = get_user(email)
    
    # Premium users have no restrictions
    if user["is_premium_"]:
        return None
    # Free user restrictions for compress_pdf
    FREE_MAX_FILES = 1  # Free users can only compress one file at a time
    FREE_MAX_FILE_SIZE_MB = 5  # Free users limited to 5MB files (increased from 300KB)
    FREE_COMPRESSION_LEVELS = ["low", "medium"]  # Free users can't use high compression
    
    # Check number of files
    if len(file_paths) > FREE_MAX_FILES:
        return {"error": "Free users can only compress one file at a time. Upgrade to premium for batch compression.", "show_upgrade": True}
    
    # Check file size
    for path in file_paths:
        size_mb = (os.path.getsize(path) / (1024 * 1024))
        if size_mb > FREE_MAX_FILE_SIZE_MB:
            return {"error": f"File {os.path.basename(path)} exceeds 5MB free limit. Premium users can compress files up to 500MB.", "show_upgrade": True}
    
    # Check compression level
    if compression_level not in FREE_COMPRESSION_LEVELS:
        return {"error": "High compression quality is a premium feature. Please upgrade to access it.", "show_upgrade": True}
    
    return None


def check_merge_pdf_restrictions(email, file_paths):
    """
    Check restrictions specific to the merge PDF feature.
    
    Args:
        email: User's email
        file_paths: List of file paths to check
        
    Returns:
        Error message if restrictions are violated, None otherwise
    """
    user = get_user(email)
    
    # Premium users have no restrictions
    if user["is_premium_"]:
        return None
        
    # Free user restrictions for merge PDF
    FREE_MAX_FILES = 2  # Free users can only merge up to 2 files
    FREE_MAX_FILE_SIZE_MB = 5  # Free users limited to 5MB files
    FREE_MAX_PAGES = 10  # Free users can only merge PDFs with up to 10 pages each
    
    # Check number of files
    if len(file_paths) > FREE_MAX_FILES:
        return {"error": "Free users can only merge up to 2 PDF files at a time. Upgrade to premium to merge more files.", "show_upgrade": True}
    
    # Check file size and page count
    for path in file_paths:
        size_mb = (os.path.getsize(path) / (1024 * 1024))
        if size_mb > FREE_MAX_FILE_SIZE_MB:
            return {"error": f"File {os.path.basename(path)} exceeds 5MB free limit. Premium users can merge larger files.", "show_upgrade": True}
        
        # Check page count for PDF files
        try:
            reader = PdfReader(path)
            if len(reader.pages) > FREE_MAX_PAGES:
                return {"error": f"File {os.path.basename(path)} exceeds the 10-page free limit. Upgrade to premium to merge larger PDFs.", "show_upgrade": True}
        except Exception as e:
            print(f"Error reading PDF pages for restriction check: {e}")
            return {"error": f"Could not process file {os.path.basename(path)} for restriction check.", "show_upgrade": False}
    
    return None
        
def check_convert_pdf_restrictions(email, file_paths):
    """
    Check restrictions specific to PDF conversion features.
    
    Args:
        email: User's email
        file_paths: List of file paths to check
        
    Returns:
        Error message if restrictions are violated, None otherwise
    """
    user = get_user(email)
    
    # Premium users have no restrictions
    if user["is_premium_"]:
        return None
        
    # Free user restrictions for PDF conversion
    FREE_MAX_FILES = 2  # Free users can only convert up to 2 files at a time
    FREE_MAX_FILE_SIZE_MB = 5  # Free users limited to 5MB files
    FREE_MAX_PAGES = 3  # Free users can only convert up to 3 pages in a PDF
    
    # Check number of files
    if len(file_paths) > FREE_MAX_FILES:
        return {"error": "Free users can only convert up to 2 files at a time. Upgrade to premium for batch conversion.", "show_upgrade": True}
    
    # Check file size and page count
    for path in file_paths:
        size_mb = (os.path.getsize(path) / (1024 * 1024))
        if size_mb > FREE_MAX_FILE_SIZE_MB:
            return {"error": f"File {os.path.basename(path)} exceeds 5MB free limit. Premium users can convert larger files.", "show_upgrade": True}
        
        # Check page count for PDF files
        if path.lower().endswith('.pdf'):
            try:
                reader = PdfReader(path)
                if len(reader.pages) > FREE_MAX_PAGES:
                    return {"error": f"File {os.path.basename(path)} exceeds the 3-page free limit. Upgrade to premium to convert more pages.", "show_upgrade": True}
            except Exception as e:
                print(f"Error reading PDF pages for restriction check: {e}")
                return {"error": f"Could not process file {os.path.basename(path)} for restriction check.", "show_upgrade": False}
    
    return None


def check_split_pdf_restrictions(email, file_path, pages_to_split_count, total_pages):
    """
    Check restrictions specific to the split PDF feature.

    Args:
        email: User's email
        file_path: Path to the PDF being split
        pages_to_split_count: Number of output pages requested (range or custom)
        total_pages: Total number of pages in the source PDF

    Returns:
        Dict with error and show_upgrade if restrictions are violated, None otherwise
    """
    user = get_user(email)

    # Premium users have no restrictions
    if user["is_premium_"]:
        return None

    # Free user restrictions for split PDF
    FREE_MAX_FILE_SIZE_MB = 5      # Max input PDF size
    FREE_MAX_TOTAL_PAGES = 10      # Max total pages in input
    FREE_MAX_OUTPUT_PAGES = 10     # Max pages that can be split out per operation

    # File size check
    try:
        size_mb = (os.path.getsize(file_path) / (1024 * 1024))
        if size_mb > FREE_MAX_FILE_SIZE_MB:
            return {
                "error": f"File {os.path.basename(file_path)} exceeds 5MB free limit. Upgrade to premium to split larger PDFs.",
                "show_upgrade": True
            }
    except Exception as e:
        print(f"Error checking file size for split restrictions: {e}")
        # Non-upgrade error: let the client know something failed
        return {"error": "Could not check file size for restrictions.", "show_upgrade": False}

    # Total pages check
    if total_pages > FREE_MAX_TOTAL_PAGES:
        return {
            "error": f"PDF has {total_pages} pages which exceeds the 10-page free limit. Upgrade to premium to split larger PDFs.",
            "show_upgrade": True
        }

    # Output pages check
    if pages_to_split_count > FREE_MAX_OUTPUT_PAGES:
        return {
            "error": f"Requested to split {pages_to_split_count} pages which exceeds the 10-page free limit. Upgrade to premium to split more pages.",
            "show_upgrade": True
        }

    return None

def check_premium_only_feature(email, file_paths):
    """
    Check restrictions for premium-only features.
    
    Args:
        email: User's email
        file_paths: List of file paths to check
        
    Returns:
        Dict with error and show_upgrade if user is not premium, None otherwise
    """
    user = get_user(email)
    
    # Premium users have no restrictions
    if user["is_premium_"]:
        return None
    
    # This feature is premium-only
    return {
        "error": "This feature is only available to premium users. Please upgrade to access it.",
        "show_upgrade": True
    }

def check_protect_pdf_restrictions(email, file_paths):
    """
    Check restrictions for the protect PDF feature (premium only).
    
    Args:
        email: User's email
        file_paths: List of file paths to check
        
    Returns:
        Dict with error and show_upgrade if user is not premium, None otherwise
    """
    return check_premium_only_feature(email, file_paths)

def check_unlock_pdf_restrictions(email, file_paths):
    """
    Check restrictions for the unlock PDF feature (premium only).
    
    Args:
        email: User's email
        file_paths: List of file paths to check
        
    Returns:
        Dict with error and show_upgrade if user is not premium, None otherwise
    """
    return check_premium_only_feature(email, file_paths)

def check_add_watermark_restrictions(email, file_paths):
    """
    Check restrictions for the add watermark feature (premium only).
    
    Args:
        email: User's email
        file_paths: List of file paths to check
        
    Returns:
        Dict with error and show_upgrade if user is not premium, None otherwise
    """
    return check_premium_only_feature(email, file_paths)

def check_scan_pdf_restrictions(email, file_paths):
    """
    Check restrictions for the scan PDF feature (premium only).
    
    Args:
        email: User's email
        file_paths: List of file paths to check
        
    Returns:
        Dict with error and show_upgrade if user is not premium, None otherwise
    """
    return check_premium_only_feature(email, file_paths)
    
