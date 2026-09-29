import re
from urllib.parse import urlparse

import pandas as pd

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

from model import final_xgb_model, url_features_final
from feature_extractor import extract_url_features
from dns_intelligence import get_live_domain_intelligence
from explanation import generate_readable_feature_explanation


# --------------------------------------------------
# FastAPI application
# --------------------------------------------------

app = FastAPI(
    title="Phishing URL Detection API",
    description="XGBoost-based phishing URL detection with SHAP, DNS and RDAP intelligence.",
    version="1.0.0"
)


# --------------------------------------------------
# CORS
# --------------------------------------------------

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)


# --------------------------------------------------
# Request model
# --------------------------------------------------

class URLRequest(BaseModel):
    url: str


# --------------------------------------------------
# URL cleaning
# --------------------------------------------------

def clean_url(url: str) -> str:
    """
    Clean whitespace and accidental Markdown links.

    Example:
    [https://example.com](https://example.com)

    becomes:

    https://example.com
    """

    url = url.strip()

    markdown_match = re.match(
        r"\[.*?\]\((.*?)\)",
        url
    )

    if markdown_match:
        url = markdown_match.group(1)

    return url.strip()


# --------------------------------------------------
# URL validation
# --------------------------------------------------

def validate_url(url: str) -> bool:
    """
    Validate that the input contains a supported
    HTTP or HTTPS URL with a hostname.
    """

    try:
        parsed = urlparse(url)

        return (
            parsed.scheme.lower() in ["http", "https"]
            and parsed.hostname is not None
        )

    except Exception:
        return False


# --------------------------------------------------
# Risk level
# --------------------------------------------------

def get_risk_level(phishing_probability: float) -> str:

    if phishing_probability >= 0.80:
        return "High"

    elif phishing_probability >= 0.50:
        return "Medium"

    else:
        return "Low"


# --------------------------------------------------
# Format live intelligence
# --------------------------------------------------

def format_domain_age(age):

    if age is None or age == -1:
        return "Unavailable"

    return f"{age} days"


def format_live_value(value):

    if value is None or value == -1:
        return "Unavailable"

    return str(value)


# --------------------------------------------------
# Health endpoint
# --------------------------------------------------

@app.get("/health")
def health_check():

    return {
        "status": "ok",
        "model_loaded": final_xgb_model is not None
    }


# --------------------------------------------------
# Main analysis endpoint
# --------------------------------------------------

@app.post("/analyze")
def analyze_url(request: URLRequest):

    # ----------------------------------------------
    # 1. Clean URL
    # ----------------------------------------------

    url = clean_url(request.url)

    if not url:
        raise HTTPException(
            status_code=400,
            detail="URL cannot be empty."
        )

    # ----------------------------------------------
    # 2. Validate URL
    # ----------------------------------------------

    if not validate_url(url):
        raise HTTPException(
            status_code=400,
            detail="Please provide a valid HTTP or HTTPS URL."
        )

    try:

        # ------------------------------------------
        # 3. Extract URL features
        # ------------------------------------------

        features = extract_url_features(url)

        X_input = pd.DataFrame(
            [features],
            columns=url_features_final
        )

        # ------------------------------------------
        # 4. XGBoost prediction
        # ------------------------------------------

        probabilities = (
            final_xgb_model.predict_proba(X_input)[0]
        )

        legitimate_probability = float(
            probabilities[0]
        )

        phishing_probability = float(
            probabilities[1]
        )

        prediction = (
            "Phishing"
            if phishing_probability >= 0.50
            else "Legitimate"
        )

        # ------------------------------------------
        # 5. Risk level
        # ------------------------------------------

        risk_level = get_risk_level(
            phishing_probability
        )

        # ------------------------------------------
        # 6. SHAP explanation
        # ------------------------------------------

        explanation = (
            generate_readable_feature_explanation(
                url
            )
        )

        # ------------------------------------------
        # 7. Live DNS + RDAP intelligence
        # ------------------------------------------

        try:

            live_intelligence = (
                get_live_domain_intelligence(url)
            )

        except Exception:

            live_intelligence = {
                "domain_age": -1,
                "dns_resolvable": 0,
                "num_ips": 0,
                "ttl": -1,
                "num_name_servers": 0
            }

        # ------------------------------------------
        # 8. Format live intelligence
        # ------------------------------------------

        live_domain_intelligence = {

            "domain_age_days": format_domain_age(
                live_intelligence.get(
                    "domain_age",
                    -1
                )
            ),

            "dns_resolvable": (
                "Yes"
                if live_intelligence.get(
                    "dns_resolvable",
                    0
                ) == 1
                else "No"
            ),

            "num_ips": format_live_value(
                live_intelligence.get(
                    "num_ips",
                    0
                )
            ),

            "ttl": format_live_value(
                live_intelligence.get(
                    "ttl",
                    -1
                )
            ),

            "num_name_servers": format_live_value(
                live_intelligence.get(
                    "num_name_servers",
                    0
                )
            )
        }

        # ------------------------------------------
        # 9. Return API response
        # ------------------------------------------

        return {

            "url": url,

            "prediction": prediction,

            "phishing_probability": round(
                phishing_probability * 100,
                2
            ),

            "legitimate_probability": round(
                legitimate_probability * 100,
                2
            ),

            "risk_level": risk_level,

            "live_domain_intelligence":
                live_domain_intelligence,

            "explanation": {

                "phishing_reasons":
                    explanation[
                        "phishing_reasons"
                    ],

                "legitimate_reasons":
                    explanation[
                        "legitimate_reasons"
                    ]
            }
        }

    except HTTPException:
        raise

    except Exception as e:

        raise HTTPException(
            status_code=500,
            detail=f"Analysis failed: {str(e)}"
        )
