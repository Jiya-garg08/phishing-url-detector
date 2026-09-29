
import os
import joblib


# Get the root directory of the project
BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

# Paths to model files
MODEL_DIR = os.path.join(BASE_DIR, "model")

MODEL_PATH = os.path.join(
    MODEL_DIR,
    "phishing_xgb_model.pkl"
)

FEATURE_NAMES_PATH = os.path.join(
    MODEL_DIR,
    "feature_names.pkl"
)

FEATURE_DESCRIPTIONS_PATH = os.path.join(
    MODEL_DIR,
    "feature_descriptions.pkl"
)


# Load trained model
final_xgb_model = joblib.load(MODEL_PATH)

# Load feature names
url_features_final = joblib.load(FEATURE_NAMES_PATH)

# Load feature descriptions
feature_descriptions = joblib.load(
    FEATURE_DESCRIPTIONS_PATH
)


print("Phishing detection model loaded successfully.")
print("Number of features:", len(url_features_final))
print("Features:", url_features_final)
