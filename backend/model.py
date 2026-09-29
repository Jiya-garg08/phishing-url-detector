import os
import joblib
import xgboost as xgb


# ============================================================
# MODEL PATHS
# ============================================================

BASE_DIR = os.path.dirname(
    os.path.dirname(
        os.path.abspath(__file__)
    )
)

MODEL_DIR = os.path.join(
    BASE_DIR,
    "model"
)

MODEL_PATH = os.path.join(
    MODEL_DIR,
    "phishing_xgb_model.json"
)

FEATURE_NAMES_PATH = os.path.join(
    MODEL_DIR,
    "feature_names.pkl"
)

FEATURE_DESCRIPTIONS_PATH = os.path.join(
    MODEL_DIR,
    "feature_descriptions.pkl"
)

THRESHOLD_PATH = os.path.join(
    MODEL_DIR,
    "threshold.pkl"
)


# ============================================================
# LOAD FINAL MODEL
# ============================================================

final_xgb_model = xgb.XGBClassifier()

final_xgb_model.load_model(
    MODEL_PATH
)


# ============================================================
# LOAD FEATURE METADATA
# ============================================================

url_features_final = joblib.load(
    FEATURE_NAMES_PATH
)

feature_descriptions = joblib.load(
    FEATURE_DESCRIPTIONS_PATH
)


# ============================================================
# LOAD CLASSIFICATION THRESHOLD
# ============================================================

classification_threshold = joblib.load(
    THRESHOLD_PATH
)


# ============================================================
# SAFETY CHECKS
# ============================================================

model_feature_names = (
    final_xgb_model
    .get_booster()
    .feature_names
)


if len(url_features_final) != 21:
    raise ValueError(
        f"Expected 21 features, "
        f"but found {len(url_features_final)}."
    )


if model_feature_names != url_features_final:
    raise ValueError(
        "Feature names/order do not match "
        "the trained model."
    )


print("Final phishing model loaded successfully.")
print("Number of features:", len(url_features_final))
print("Classification threshold:", classification_threshold)
