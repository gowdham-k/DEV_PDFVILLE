import os
import tempfile


def cleanup_file(file_path):
    """Helper function to safely delete temporary files"""
    try:
        if os.path.exists(file_path):
            os.unlink(file_path)
    except:
        pass


def create_temp_file(suffix=".pdf"):
    """Create a temporary file with the specified suffix"""
    return tempfile.NamedTemporaryFile(delete=False, suffix=suffix).name


def create_temp_dir():
    """Create a temporary directory"""
    return tempfile.mkdtemp()