"""
Migration script to add payment fields to the users table
"""
from sqlalchemy import create_engine, text
from db_config import DATABASE_URL
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Create engine
engine = create_engine(DATABASE_URL)

def migrate_payment_fields():
    """Add payment fields to users table"""
    with engine.connect() as connection:
        # Start a transaction
        with connection.begin():
            print("Adding payment fields to users table...")
            
            # Add payment_id column
            connection.execute(text(
                "ALTER TABLE users ADD COLUMN IF NOT EXISTS payment_id VARCHAR"
            ))
            
            # Add payment_amount column
            connection.execute(text(
                "ALTER TABLE users ADD COLUMN IF NOT EXISTS payment_amount INTEGER"
            ))
            
            # Add payment_date column
            connection.execute(text(
                "ALTER TABLE users ADD COLUMN IF NOT EXISTS payment_date TIMESTAMP"
            ))
            
            # Add payment_method column
            connection.execute(text(
                "ALTER TABLE users ADD COLUMN IF NOT EXISTS payment_method VARCHAR"
            ))
            
            # Add payment_status column
            connection.execute(text(
                "ALTER TABLE users ADD COLUMN IF NOT EXISTS payment_status VARCHAR"
            ))
            
            print("Migration completed successfully!")

if __name__ == "__main__":
    migrate_payment_fields()