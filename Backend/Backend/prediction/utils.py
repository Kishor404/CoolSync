import os
import pickle
import numpy as np

# Load the paths for the model and scaler
BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
MODEL_PATH = os.path.join(BASE_DIR, "model_files/svr_model.pkl")
SCALER_PATH = os.path.join(BASE_DIR, "model_files/scaler.pkl")

# Load the Scikit-learn model and scaler using pickle
with open(MODEL_PATH, "rb") as f:
    model = pickle.load(f)

with open(SCALER_PATH, "rb") as f:
    scaler = pickle.load(f)

def predict_quality(input_data):
    """
    Predict the quality of perishable items.
    :param input_data: List or array of feature values [Temperature, Humidity, Ethylene, CO2, Light, Time, Distance]
    :return: Predicted quality score
    """
    # Scale the input data
    scaled_data = scaler.transform([input_data])  # Ensure input_data is in the correct format

    # Make prediction
    prediction = model.predict(scaled_data)

    # Return the result as a float
    return float(prediction[0])

# Example usage:
if __name__ == "__main__":
    test_data = [25.0, 80.0, 1.2, 400.0, 5000.0, 72.0, 200.0]  # Replace with real input values
    print("Predicted Quality Score:", predict_quality(test_data))
