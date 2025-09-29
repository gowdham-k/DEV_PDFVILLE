from sqlalchemy.orm import Session
from models import User, File
from typing import List, Optional

# User operations
def get_user_by_email(db: Session, email: str) -> Optional[User]:
    """Get user by email"""
    return db.query(User).filter(User.email == email).first()

def get_user_by_cognito_id(db: Session, cognito_id: str) -> Optional[User]:
    """Get user by Cognito ID"""
    return db.query(User).filter(User.cognito_id == cognito_id).first()

def get_user_by_id(db: Session, user_id: int) -> Optional[User]:
    """Get user by ID"""
    return db.query(User).filter(User.id == user_id).first()

def create_user(db: Session, email: str, cognito_id: str, first_name: str = None, 
               last_name: str = None, phone_number: str = None) -> User:
    """Create a new user with additional details"""
    db_user = User(
        email=email, 
        cognito_id=cognito_id,
        first_name=first_name,
        last_name=last_name,
        phone_number=phone_number
    )
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user

def update_user_subscription_status(db: Session, user_id: int, is_pro: bool) -> User:
    """Update user subscription status (basic/pro)"""
    db_user = db.query(User).filter(User.id == user_id).first()
    if db_user:
        db_user.is_pro = is_pro
        db_user.subscription_status = "pro" if is_pro else "basic"
        db.commit()
        db.refresh(db_user)
    return db_user

# Payment operations
def update_user_payment_info(db: Session, email: str, payment_data: dict) -> Optional[User]:
    """Update user payment information after successful payment"""
    db_user = get_user_by_email(db, email)
    if db_user:
        # Update payment information
        db_user.payment_id = payment_data.get('payment_id')
        db_user.payment_amount = payment_data.get('payment_amount')
        db_user.payment_date = payment_data.get('payment_date')
        db_user.payment_method = payment_data.get('payment_method')
        db_user.payment_status = payment_data.get('payment_status')
        
        # Update subscription information
        db_user.is_pro = True
        db_user.subscription_status = "pro"
        db_user.subscription_expiry = payment_data.get('subscription_expiry')
        
        db.commit()
        db.refresh(db_user)
    return db_user

# File operations
def get_user_files(db: Session, user_id: int) -> List[File]:
    """Get all files for a user"""
    return db.query(File).filter(File.user_id == user_id).all()

def create_file(db: Session, filename: str, file_path: str, file_type: str, 
                file_size: int, user_id: int) -> File:
    """Create a new file record"""
    db_file = File(
        filename=filename,
        file_path=file_path,
        file_type=file_type,
        file_size=file_size,
        user_id=user_id
    )
    db.add(db_file)
    db.commit()
    db.refresh(db_file)
    return db_file

def delete_file(db: Session, file_id: int) -> bool:
    """Delete a file record"""
    db_file = db.query(File).filter(File.id == file_id).first()
    if db_file:
        db.delete(db_file)
        db.commit()
        return True
    return False