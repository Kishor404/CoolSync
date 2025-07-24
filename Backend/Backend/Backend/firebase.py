# firebase.py
import firebase_admin
from firebase_admin import credentials, db

# Path to your Firebase service account JSON file
cred = credentials.Certificate('/cred.json')

# Initialize Firebase Admin SDK
firebase_admin.initialize_app(cred, {
    'databaseURL': 'https://esptest-78467-default-rtdb.asia-southeast1.firebasedatabase.app/'  # Replace with your database URL
})

# Reference to your Realtime Database location
ref = db.reference('your-node')  # Change 'your-node' to the actual node you want to query

def get_firebase_data():
    # Get data from the Firebase Realtime Database
    data = ref.get()  # This will return the data at the 'your-node' location
    if data:
        print("Data from Firebase:", data)  # This will print the data fetched from Firebase
    else:
        print("No data found at 'your-node'")
    
    return data  # This could be a dict, list, or other structure depending on your DB
