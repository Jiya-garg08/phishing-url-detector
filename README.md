# Phishing URL Detector

An end-to-end machine learning system for detecting potentially phishing URLs using **XGBoost**, **URL and path-based feature engineering**, **SHAP explainability**, and **live DNS/RDAP domain intelligence**.

The project includes a **FastAPI backend** and a **React frontend** for real-time URL analysis.

---

## Overview

Phishing attacks often use URLs that imitate legitimate websites or contain suspicious patterns designed to trick users.

This project analyzes a URL from two perspectives:

1. **Machine Learning Analysis**
   - Extracts 21 URL and path-based features.
   - Uses an XGBoost classifier to estimate phishing probability.
   - Uses a calibrated classification threshold of `0.70`.

2. **Live Domain Intelligence**
   - Performs DNS resolution.
   - Retrieves IP information.
   - Checks DNS TTL and name servers.
   - Uses RDAP to obtain domain registration information and estimate domain age.

The system then combines these results into an understandable security report.

---

## Key Features

- XGBoost-based phishing URL classification
- 21 URL and path-based features
- Domain-separated train/test evaluation
- Protection against registered-domain overlap between train and test data
- Legitimate URL augmentation
- SHAP-based prediction explanations
- Live DNS intelligence
- RDAP domain registration intelligence
- Risk-level classification
- FastAPI REST API
- React frontend
- Real-time URL analysis
- Input validation and URL normalization
- Human-readable explanations for model decisions

---

## System Architecture

```text
                         User
                          |
                          v
                 React Frontend
                          |
                          v
                FastAPI REST API
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
        Phishing Probability
             |
             v
        SHAP Explanation
             |
             +-------------+
                           |
                           v
                  Risk Assessment
                           |
                           v
                    JSON Response
                           |
                           v
                    React Dashboard
