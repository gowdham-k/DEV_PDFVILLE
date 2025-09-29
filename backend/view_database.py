import os
from dotenv import load_dotenv
from sqlalchemy import inspect, text
from db_config import engine, Base, get_db
from models import User, File

def view_database():
    """View database tables and their contents"""
    # Load environment variables
    load_dotenv()
    
    print("Connecting to database...")
    try:
        # Create inspector
        inspector = inspect(engine)
        
        # Get all table names
        tables = inspector.get_table_names()
        print(f"\n=== Database Tables ({len(tables)}) ===")
        for table in tables:
            print(f"- {table}")
        
        # View table schemas
        for table in tables:
            print(f"\n=== Schema for '{table}' ===")
            columns = inspector.get_columns(table)
            for column in columns:
                nullable = "NULL" if column['nullable'] else "NOT NULL"
                print(f"  {column['name']} ({column['type']}) {nullable}")
        
        # View table data
        with engine.connect() as connection:
            for table in tables:
                result = connection.execute(text(f"SELECT COUNT(*) FROM {table}"))
                count = result.scalar()
                print(f"\n=== Data in '{table}' ({count} rows) ===")
                
                if count > 0:
                    # Show up to 10 rows from each table
                    result = connection.execute(text(f"SELECT * FROM {table} LIMIT 10"))
                    rows = result.fetchall()
                    
                    # Get column names
                    columns = result.keys()
                    print("  | " + " | ".join(columns) + " |")
                    print("  | " + " | ".join(["-" * len(col) for col in columns]) + " |")
                    
                    # Print rows
                    for row in rows:
                        row_values = [str(value) for value in row]
                        print("  | " + " | ".join(row_values) + " |")
                else:
                    print("  No data in this table")
        
        print("\nDatabase inspection completed successfully!")
        return True
    
    except Exception as e:
        print(f"Error viewing database: {str(e)}")
        return False

if __name__ == "__main__":
    view_database()