"""
Migration script to update the database schema from premium to pro terminology
"""
from sqlalchemy import create_engine, text
from db_config import DATABASE_URL
import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Create engine
engine = create_engine(DATABASE_URL)

def migrate_db():
    """Migrate database from premium to pro terminology"""
    with engine.connect() as connection:
        # Start a transaction
        with connection.begin():
            # Check if is_premium column exists
            result = connection.execute(text(
                "SELECT column_name FROM information_schema.columns "
                "WHERE table_name = 'users' AND column_name = 'is_premium'"
            ))
            
            if result.fetchone():
                print("Migrating database schema from 'premium' to 'pro' terminology...")
                
                # Add is_pro column
                connection.execute(text(
                    "ALTER TABLE users ADD COLUMN is_pro BOOLEAN DEFAULT FALSE"
                ))
                
                # Copy data from is_premium to is_pro
                connection.execute(text(
                    "UPDATE users SET is_pro = is_premium"
                ))
                
                # Update subscription_status
                connection.execute(text(
                    "UPDATE users SET subscription_status = CASE "
                    "WHEN is_premium = TRUE THEN 'pro' ELSE 'basic' END"
                ))
                
                # Drop is_premium column
                connection.execute(text(
                    "ALTER TABLE users DROP COLUMN is_premium"
                ))
                
                print("Migration completed successfully!")
            else:
                print("No migration needed. Database already using new schema.")

if __name__ == "__main__":
    migrate_db()