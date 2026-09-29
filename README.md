**# Phishing URL Detector

An AI-powered phishing URL detection system that combines **XGBoost machine learning, URL structural analysis, SHAP explainability, and live DNS/RDAP intelligence** with a React frontend and FastAPI backend.

---

## Overview

This project analyzes a URL and determines whether it is likely to be:

- **Phishing**
- **Legitimate**

Unlike a basic URL classifier, the system combines machine learning with additional domain intelligence and explainability.

The final system uses:

- **XGBoost** for phishing URL classification
- **21 URL features** covering URL, hostname, path, and semantic path characteristics
- **SHAP** for explaining individual predictions
- **DNS intelligence** for live domain information
- **RDAP** for domain registration information
- **FastAPI** for the backend REST API
- **React + Vite** for the frontend
- **Tailwind CSS** for styling
- **Framer Motion** for UI animations
- **Lucide React** for interface icons

---

## Architecture

```text
                         User URL
                            |
                            v
                  +-------------------+
                  |   React Frontend  |
                  |   URL Analyzer    |
                  +---------+---------+
                            |
                       POST /analyze
                            |
                            v
                  +-------------------+
                  |    FastAPI API    |
                  +---------+---------+
                            |
             +--------------+--------------+
             |              |              |
             v              v              v
      URL Feature       XGBoost       DNS + RDAP
       Extraction       Model         Intelligence
             |              |              |
             |              v              |
             |        Prediction           |
             |              |              |
             +--------------+--------------+
                            |
                            v
                    SHAP Explanation
                            |
                            v
                    JSON API Response
                            |
                            v
                  +-------------------+
                  |   React Results   |
                  |    Dashboard      |
                  +-------------------+**
