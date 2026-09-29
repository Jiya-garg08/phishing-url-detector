Phishing URL Detector — Project Notes
1. Project Overview

This project is an ML-based phishing URL detection system.

The system analyzes a URL using:

URL structural features
URL path features
Semantic path indicators
XGBoost classification
SHAP explanations
Live DNS intelligence
RDAP domain registration intelligence

The final system consists of:

React Frontend
      ↓
FastAPI Backend
      ↓
21 URL Features
      ↓
XGBoost Model
      ↓
Prediction + Probability
      ↓
SHAP Explanation
      ↓
DNS + RDAP Intelligence
      ↓
React Result Dashboard
2. Why We Built This

The goal is to detect whether a URL is:

Legitimate
or
Phishing

The system should not only return a prediction, but also provide supporting information so that the user can understand why the URL was considered suspicious.

3. Original Dataset

The first dataset contained:

60,000 URLs

Labels:

Legitimate: 28,359
Phishing: 31,641

Approximately:

Legitimate → 47.27%
Phishing   → 52.74%

The dataset contained URL-level and domain-related information.

We performed:

Missing-value analysis
Duplicate analysis
Domain analysis
Label distribution analysis
URL length analysis
Feature correlation
Feature importance analysis
4. Important Problem Discovered in Original Dataset

During EDA, we discovered a major dataset limitation.

For the original dataset:

Legitimate URLs:
100% had no path
0% had a path

Phishing URLs:
66.44% had a path
33.56% had no path

Similarly:

Legitimate:
100% had no query

Phishing:
20.20% had a query

This meant the model could learn:

"path exists" → phishing
"query exists" → phishing

instead of learning more general phishing characteristics.

For example, the model incorrectly classified:

https://www.google.com/search

as highly suspicious.

This showed that the model was learning a dataset-specific shortcut.

5. Initial Model

The initial model was XGBoost.

Configuration:

XGBClassifier(
    n_estimators=300,
    max_depth=6,
    learning_rate=0.05,
    subsample=0.8,
    colsample_bytree=0.8,
    objective="binary:logistic",
    eval_metric="logloss",
    random_state=42,
    n_jobs=-1
)

The initial domain-separated model produced very high test metrics.

However, the controlled real-world testing showed that the dataset structure was not realistic enough.

Therefore, we did not simply rely on the high accuracy.

6. URL-Phish v2 Dataset

We introduced a more diverse dataset called:

URL-Phish v2

It contained:

116,600 rows
26 columns

Columns included:

url
url_len
dom
dom_len
is_ip
tld
tld_len
subdom_cnt
letter_cnt
digit_cnt
special_cnt
eq_cnt
qm_cnt
amp_cnt
dot_cnt
dash_cnt
under_cnt
letter_ratio
digit_ratio
spec_ratio
is_https
slash_cnt
entropy
path_len
query_len
label

Label distribution:

Legitimate: 100,000
Phishing:    16,600

Therefore this dataset was strongly imbalanced toward legitimate URLs.

7. Why We Could Not Simply Combine Everything

We already had an untouched original test set.

If the new dataset contained URLs from domains that were already present in that test set, adding those URLs to training could create leakage.

Therefore, we compared registered domains.

Registered domain was extracted using:

tldextract

Example:

https://login.example.com/page

Registered domain:

example.com

We removed overlapping registered domains.

Results:

Original test registered domains: 6,134

Overlapping v2 domains: 845

Rows removed: 10,872

Safe dataset:
105,728 rows

Safe labels:

Legitimate: 98,839
Phishing:    6,889

Safe unique registered domains:

90,001
8. Domain-Separated Train/Test Split

We performed the split by registered domain rather than randomly by URL.

This prevents URLs from the same domain appearing in both training and testing.

Final split:

Training domains: 72,000
Testing domains: 18,001

Rows:

Training: 84,890
Testing: 20,838

Labels:

Training:
Legitimate: 79,106
Phishing:    5,784

Testing:
Legitimate: 19,733
Phishing:    1,105

Domain overlap:

0

This makes the test more representative of performance on unseen domains.

9. Feature Evolution

We experimented with several feature sets.

Version 1 — 11 Features

The initial production feature set contained:

entropy
url_length
num_www
ratio_digits_url
num_subdomains
length_hostname
num_dots
num_hyphens
ratio_digits_host
num_question_mark
num_eq

These describe characteristics of the URL and hostname.

10. Version 2 — 17 Features

We added path-level structural features:

path_length
path_depth
path_token_count
path_digit_ratio
path_entropy
path_has_extension

Total:

11 + 6 = 17 features

This allowed the model to understand the structure of the URL path rather than only the hostname and complete URL.

11. Version 3 — Final 21 Features

We added four semantic path features:

path_has_suspicious_word
path_has_benign_word
path_suspicious_word_count
path_benign_word_count

Final:

11 base
+
6 path
+
4 semantic
=
21 features

Final feature list:

1.  entropy
2.  url_length
3.  num_www
4.  ratio_digits_url
5.  num_subdomains
6.  length_hostname
7.  num_dots
8.  num_hyphens
9.  ratio_digits_host
10. num_question_mark
11. num_eq
12. path_length
13. path_depth
14. path_token_count
15. path_digit_ratio
16. path_entropy
17. path_has_extension
18. path_has_suspicious_word
19. path_has_benign_word
20. path_suspicious_word_count
21. path_benign_word_count
12. Semantic Path Words

We created two groups.

Suspicious words
login
signin
sign-in
confirmation
update
authentication
verification
account
verify
payment
claim
wallet
Benign words
about
wiki
article
articles
news
blog
product
repository

These were converted into numerical features.

For example:

https://example.com/login

can produce:

path_has_suspicious_word = 1
path_suspicious_word_count = 1

while:

https://example.com/wiki/Python

can produce:

path_has_benign_word = 1
path_benign_word_count = 1

Important:

These features are signals, not rules.

The model still makes the final prediction.

13. External Legitimate URL Dataset

We also used an external dataset:

url_features_extracted1.csv

It contained:

101,219 rows
18 columns

The dataset contained legitimate and phishing URLs.

We specifically used legitimate URLs to improve the model's exposure to realistic legitimate paths.

After filtering for duplicates and domain overlap, we obtained:

359 safe legitimate URLs
110 unique registered domains

We then capped the number of URLs per domain to avoid allowing a single domain to dominate the augmentation.

Final augmentation:

135 URLs
110 unique domains

Examples of represented domains included:

wikipedia.org
youtube.com
stackoverflow.com
apple.com
reddit.com
kaggle.com
cloudflare.com
OWASP-related domains

This augmentation was important because our main training dataset had limited examples of modern legitimate websites with realistic paths.

14. Class Imbalance

The safe v2 training data was heavily imbalanced.

Therefore we used:

scale_pos_weight=3

in XGBoost.

Final model configuration:

XGBClassifier(
    n_estimators=300,
    max_depth=6,
    learning_rate=0.05,
    subsample=0.8,
    colsample_bytree=0.8,
    objective="binary:logistic",
    eval_metric="logloss",
    random_state=42,
    n_jobs=-1,
    scale_pos_weight=3
)
15. Threshold Selection

The default classification threshold is normally:

0.50

But we tested multiple thresholds.

We evaluated:

0.10
0.15
0.20
...
0.90

The best F1 in our threshold sweep occurred at:

Threshold = 0.70

At 0.70:

Accuracy:  97.91%
Precision: 85.79%
Recall:    72.67%
F1:        78.69%
ROC-AUC:   97.94%

Confusion matrix:

[[19600, 133],
 [302,   803]]

The final production threshold is therefore:

0.70
16. Final Model

The final model is:

Model:
XGBoost

Features:
21

Class weighting:
scale_pos_weight = 3

Classification threshold:
0.70

Saved files:

model/
├── feature_descriptions.pkl
├── feature_names.pkl
├── phishing_xgb_model.json
└── threshold.pkl

The XGBoost model is saved as JSON rather than relying on a Python pickle of the model.

17. Realistic Legitimate URL Challenge

We also tested the model against:

6,000 legitimate URLs

At threshold:

0.70

False positives:

271

False-positive rate:

4.5167%

This was useful because a model can perform well on a held-out dataset while still incorrectly flagging realistic legitimate URLs.

18. Real-World Sanity Testing

We tested URLs such as:

https://www.google.com
https://www.google.com/search
https://www.google.com/search?q=python
https://github.com
https://github.com/user/repository
https://github.com/login
https://en.wikipedia.org/wiki/Python
https://stackoverflow.com/questions/12345
https://www.nhs.uk/conditions/
https://www.microsoft.com/en-us/download
https://www.apple.com/support/
https://www.amazon.com/s?k=laptop

We also tested synthetic phishing-style URLs:

https://secure-login-account-verification-12345.com/login

http://paypal-account-security-check-48291.com/verify

http://free-prize-winner-92731.com/claim

The synthetic phishing URLs received very high phishing probabilities.

19. Known Model Limitations

The model is not a perfect website legitimacy verifier.

One important example:

https://github.com/login

was classified as phishing with a very high probability.

This happens because the model learned that words such as:

login
verification
account
payment

are strongly associated with phishing URLs in the training data.

However, legitimate websites also use these words.

Therefore:

A suspicious feature ≠ proof of phishing

The system should be presented as a risk-analysis tool rather than an absolute guarantee.

20. SHAP Explainability

We use:

shap.TreeExplainer

to explain individual predictions.

The system identifies the strongest feature contributions.

Examples:

URL length
URL entropy
number of subdomains
path length
path entropy
suspicious path words

The UI can show why particular features pushed the prediction toward:

Phishing

or:

Legitimate
21. Live DNS Intelligence

The backend also checks the current domain.

Information collected includes:

Domain age
DNS resolvability
Number of IP addresses
TTL
Number of name servers

Example:

Google
Domain age: 10606 days
DNS: Yes
IPs: 8
TTL: 25
Name servers: 4

This information is supporting evidence.

It is not directly replacing the ML prediction.

22. RDAP

RDAP is used to obtain domain registration information.

The system uses the registered domain rather than simply treating the complete URL as a domain.

For example:

https://login.example.com/account

is analyzed around:

example.com

for domain-level intelligence.

23. Backend

Backend technology:

Python
FastAPI
XGBoost
SHAP
Pandas
tldextract
dnspython
Requests
Joblib

Main endpoint:

POST /analyze

Request:

{
  "url": "https://www.google.com"
}

Response contains:

URL
Prediction
Phishing probability
Legitimate probability
Risk level
DNS/RDAP intelligence
SHAP explanations

Health endpoint:

GET /health
24. Frontend

Frontend technology:

React
Vite
Tailwind CSS
Framer Motion
Lucide React

The UI uses an:

Industrial Skeuomorphism / Industrial Realism

design.

The frontend communicates with:

http://127.0.0.1:8000/analyze
25. Frontend → Backend Flow

When the user enters:

https://www.google.com

React sends:

POST /analyze

with:

{
  "url": "https://www.google.com"
}

FastAPI performs the analysis and returns JSON.

React receives the JSON and displays:

URL Format
ML Classification
Risk Assessment
Domain Intelligence
Explanation
26. Project Structure
phishing-url-detector/
│
├── backend/
│   ├── dns_intelligence.py
│   ├── explanation.py
│   ├── feature_extractor.py
│   ├── main.py
│   ├── model.py
│   └── requirements.txt
│
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   │   ├── AnalysisResult.jsx
│   │   │   ├── DomainIntelligence.jsx
│   │   │   ├── ExplanationPanel.jsx
│   │   │   ├── Hero.jsx
│   │   │   ├── Navbar.jsx
│   │   │   └── URLAnalyzer.jsx
│   │   ├── App.jsx
│   │   ├── App.css
│   │   └── index.css
│   ├── package.json
│   └── vite.config.js
│
├── model/
│   ├── feature_descriptions.pkl
│   ├── feature_names.pkl
│   ├── phishing_xgb_model.json
│   └── threshold.pkl
│
├── notebooks/
│   └── phishing_detection.ipynb
│
├── README.md
└── PROJECT_NOTES.md
27. How to Run the Project
Backend

From project root:

.\venv\Scripts\activate

Then:

uvicorn backend.main:app --reload

Backend:

http://127.0.0.1:8000

Swagger:

http://127.0.0.1:8000/docs
Frontend

Open another terminal:

cd frontend

Install dependencies:

npm install

Run:

npm run dev

Frontend:

http://localhost:5173
28. Important Development Errors We Fixed
Error 1 — Model import

Problem:

ImportError: cannot import name 'final_xgb_model'

Cause:

The root model/ directory conflicted with:

backend/model.py

Solution:

from backend.model import ...
Error 2 — Backend module imports

Problem:

ModuleNotFoundError:
No module named 'feature_extractor'

Solution:

from backend.feature_extractor import ...

Similarly:

from backend.dns_intelligence import ...
from backend.explanation import ...
Error 3 — 11 vs 21 features

Problem:

Analysis failed: 'path_length'

Cause:

The final model expected 21 features, while the backend was still generating only 11.

Solution:

Combine:

extract_url_features()
extract_path_features()
extract_semantic_path_features()

to produce:

21 features
Error 4 — SHAP explanation

The prediction pipeline was updated to 21 features, but SHAP was still extracting only the original 11.

Solution:

The SHAP explanation now uses the exact same 21-feature pipeline.

29. Final Architecture
                         USER
                           │
                           ▼
                 ┌──────────────────┐
                 │   React Frontend │
                 │                  │
                 │ URL Input        │
                 │ Result Dashboard │
                 └────────┬─────────┘
                          │
                     POST /analyze
                          │
                          ▼
                 ┌──────────────────┐
                 │     FastAPI      │
                 └────────┬─────────┘
                          │
              ┌───────────┼───────────┐
              │           │           │
              ▼           ▼           ▼
        URL Features   XGBoost    DNS/RDAP
              │           │           │
              │           ▼           │
              │      Prediction       │
              │           │           │
              └───────────┼───────────┘
                          │
                          ▼
                    SHAP Explanation
                          │
                          ▼
                    JSON Response
                          │
                          ▼
                 React Result UI
30. Final Takeaway

The project evolved from a basic URL classification model into a complete URL threat-analysis application.

The final system combines:

Machine Learning
+
URL structural analysis
+
Path analysis
+
Semantic indicators
+
SHAP explainability
+
DNS intelligence
+
RDAP intelligence
+
FastAPI
+
React

The most important lesson from the project was that high accuracy alone is not enough.

We discovered a dataset shortcut, rebuilt the training pipeline using more diverse URLs, enforced domain-separated evaluation, added legitimate path/query examples, evaluated thresholds and realistic URLs, and then integrated the final model into a working full-stack application.
