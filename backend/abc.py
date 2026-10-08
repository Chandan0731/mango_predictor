import requests

url = "http://127.0.0.1:5000/predict"
file_path = "IMG_20250606_215124.jpg"

with open(file_path, 'rb') as img_file:
    files = {'file': img_file}
    response = requests.post(url, files=files)

print(response.json())
