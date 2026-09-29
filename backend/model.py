import os
import joblib
import xgboost as xgb


# Get the root directory of the project
BASE_DIR = os.path.dirname(
    os.path.dirname(
        os.path.abspath(__file__)
    )
)


# Model directory
MODEL_DIR = os.path.join(
    BASE_DIR,
    "model"
)


# Native XGBoost model
MODEL_PATH = os.path.join(
    MODEL_DIR,
    "phishing_xgb_model.json"
)


# Feature files
FEATURE_NAMES_PATH = os.path.join(
    MODEL_DIR,
    "feature_names.pkl"
)

FEATURE_DESCRIPTIONS_PATH = os.path.join(
    MODEL_DIR,
    "feature_descriptions.pkl"
)


# --------------------------------------------------
# Load XGBoost model
# --------------------------------------------------

final_xgb_model = xgb.XGBClassifier()

final_xgb_model.load_model(
    MODEL_PATH
)


# --------------------------------------------------
# Load feature metadata
# --------------------------------------------------

url_features_final = joblib.load(
    FEATURE_NAMES_PATH
)

feature_descriptions = joblib.load(
    FEATURE_DESCRIPTIONS_PATH
)


print(
    "Phishing detection model loaded successfully."
)

print(
    "Number of features:",
    len(url_features_final)
)

print(
    "Features:",
    url_features_final
)
