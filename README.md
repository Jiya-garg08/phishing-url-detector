# Phishing URL Detector

AI-powered phishing URL detection using XGBoost, SHAP, DNS and RDAP intelligence.

## Overview

This project detects whether a URL is likely to be **Phishing** or **Legitimate** using a machine learning model trained on URL-based features.

The system combines:

- **XGBoost** for phishing URL classification
- **SHAP** for explainable predictions
- **DNS intelligence** for live domain information
- **RDAP** for domain registration information
- **FastAPI** for providing the prediction through a REST API

The backend is designed so that any frontend technology such as Streamlit, React, HTML/CSS/JavaScript, or Django can consume the API.

---

## Architecture

```text
                    User URL
                       |
                       v
              FastAPI Backend
                       |
          +------------+------------+
          |                         |
          v                         v
   URL Feature Extraction     Live DNS + RDAP
          |                         |
          v                         v
       XGBoost              Domain Intelligence
          |
          v
        SHAP
     Explanation
          |
          +------------+
                       |
                       v
                JSON Response
                       |
                       v
                       UI
