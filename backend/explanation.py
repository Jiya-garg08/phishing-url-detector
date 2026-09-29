import pandas as pd
import shap

from feature_extractor import extract_url_features
from model import final_xgb_model, url_features_final


# Create SHAP explainer once when the backend starts
shap_explainer = shap.TreeExplainer(final_xgb_model)


# Human-readable feature names
feature_descriptions = {
    "entropy": "URL character entropy",
    "url_length": "URL length",
    "num_www": "Number of 'www' occurrences",
    "ratio_digits_url": "Digit ratio in the URL",
    "num_subdomains": "Number of subdomains",
    "length_hostname": "Hostname length",
    "num_dots": "Number of dots in the URL",
    "num_hyphens": "Number of hyphens in the URL",
    "ratio_digits_host": "Digit ratio in the hostname",
    "num_question_mark": "Number of question marks",
    "num_eq": "Number of '=' characters"
}


def format_feature_value(feature_name, value):
    """
    Format feature values so they are readable in the UI.
    """

    if feature_name == "entropy":
        return f"{value:.2f}"

    if feature_name in [
        "ratio_digits_url",
        "ratio_digits_host"
    ]:
        return f"{value * 100:.2f}%"

    if feature_name in [
        "url_length",
        "num_www",
        "num_subdomains",
        "length_hostname",
        "num_dots",
        "num_hyphens",
        "num_question_mark",
        "num_eq"
    ]:
        return str(int(value))

    return str(value)


def generate_readable_feature_explanation(url):
    """
    Generate SHAP-based explanations for one URL.
    """

    features = extract_url_features(url)

    X_input = pd.DataFrame(
        [features],
        columns=url_features_final
    )

    # Calculate SHAP values
    shap_values = shap_explainer.shap_values(X_input)

    # Handle SHAP output formats
    if isinstance(shap_values, list):
        shap_values = shap_values[0]

    shap_values = shap_values[0]

    phishing_reasons = []
    legitimate_reasons = []

    feature_contributions = []

    for feature_name, shap_value in zip(
        url_features_final,
        shap_values
    ):

        value = features[feature_name]

        feature_contributions.append({
            "feature": feature_name,
            "description": feature_descriptions.get(
                feature_name,
                feature_name
            ),
            "value": value,
            "shap_value": float(shap_value)
        })

    # Sort by absolute SHAP contribution
    feature_contributions.sort(
        key=lambda x: abs(x["shap_value"]),
        reverse=True
    )

    # Show the strongest contributing features
    top_features = feature_contributions[:6]

    for item in top_features:

        feature_name = item["feature"]
        description = item["description"]
        value = item["value"]
        shap_value = item["shap_value"]

        formatted_value = format_feature_value(
            feature_name,
            value
        )

        if shap_value > 0:

            phishing_reasons.append(
                f"{description}: {formatted_value} "
                f"(contributed toward the phishing prediction)"
            )

        elif shap_value < 0:

            legitimate_reasons.append(
                f"{description}: {formatted_value} "
                f"(contributed toward the legitimate prediction)"
            )

    return {
        "phishing_reasons": phishing_reasons,
        "legitimate_reasons": legitimate_reasons,
        "feature_contributions": feature_contributions
    }
