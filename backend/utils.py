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


def get_upload_folder():
    """Get the upload folder path"""
    upload_folder = os.environ.get('UPLOAD_FOLDER', 'uploads')
    os.makedirs(upload_folder, exist_ok=True)
    return upload_folder


def get_temp_folder():
    """Get the temporary folder path"""
    temp_folder = os.environ.get('TEMP_FOLDER', 'temp')
    os.makedirs(temp_folder, exist_ok=True)
    return temp_folder


def allowed_file(filename):
    """Check if the file extension is allowed"""
    ALLOWED_EXTENSIONS = {'pdf', 'docx', 'doc', 'pptx', 'ppt', 'xlsx', 'xls', 'jpg', 'jpeg', 'png', 'txt', 'html'}
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS


def get_file_extension(filename):
    """Get the file extension"""
    return filename.rsplit('.', 1)[1].lower() if '.' in filename else ''