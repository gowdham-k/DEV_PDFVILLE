import requests
import os

API_BASE_URL = 'http://localhost:5000'

def test_jpg_conversion():
    print("\nTesting JPG to PDF conversion...")
    jpg_file_path = "C:\\Users\\selva\\Downloads\\DSC01896.JPG"
    
    if not os.path.exists(jpg_file_path):
        print(f"Error: File {jpg_file_path} does not exist")
        return
    
    # Test with 'file' parameter
    with open(jpg_file_path, 'rb') as f:
        files = {'file': (os.path.basename(jpg_file_path), f, 'image/jpeg')}
        response = requests.post(f"{API_BASE_URL}/convert-jpg-to-pdf", files=files)
    
    print(f"Response status (file parameter): {response.status_code}")
    if response.status_code != 200:
        print(f"Error message: {response.text}")
    else:
        print("Success! Saving output as jpg_test_file.pdf")
        with open("jpg_test_file.pdf", 'wb') as f:
            f.write(response.content)
    
    # Test with 'files[]' parameter instead
    with open(jpg_file_path, 'rb') as f:
        files = {'files[]': (os.path.basename(jpg_file_path), f, 'image/jpeg')}
        response = requests.post(f"{API_BASE_URL}/convert-jpg-to-pdf", files=files)
    
    print(f"Response status (files parameter): {response.status_code}")
    if response.status_code != 200:
        print(f"Error message: {response.text}")
    else:
        print("Success! Saving output as jpg_test_files.pdf")
        with open("jpg_test_files.pdf", 'wb') as f:
            f.write(response.content)

def test_png_conversion():
    print("\nTesting PNG to PDF conversion...")
    png_file_path = "C:\\Users\\selva\\Downloads\\hallticket_devil.png"
    
    if not os.path.exists(png_file_path):
        print(f"Error: File {png_file_path} does not exist")
        return
    
    # Test with 'file' parameter
    with open(png_file_path, 'rb') as f:
        files = {'file': (os.path.basename(png_file_path), f, 'image/png')}
        response = requests.post(f"{API_BASE_URL}/convert-png-to-pdf", files=files)
    
    print(f"Response status (file parameter): {response.status_code}")
    if response.status_code != 200:
        print(f"Error message: {response.text}")
    else:
        print("Success! Saving output as png_test_file.pdf")
        with open("png_test_file.pdf", 'wb') as f:
            f.write(response.content)
    
    # Test with 'files[]' parameter instead
    with open(png_file_path, 'rb') as f:
        files = {'files[]': (os.path.basename(png_file_path), f, 'image/png')}
        response = requests.post(f"{API_BASE_URL}/convert-png-to-pdf", files=files)
    
    print(f"Response status (files parameter): {response.status_code}")
    if response.status_code != 200:
        print(f"Error message: {response.text}")
    else:
        print("Success! Saving output as png_test_files.pdf")
        with open("png_test_files.pdf", 'wb') as f:
            f.write(response.content)

if __name__ == "__main__":
    test_jpg_conversion()
    test_png_conversion()