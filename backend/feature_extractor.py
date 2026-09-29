import math
from collections import Counter
from urllib.parse import urlparse

import tldextract


def calculate_entropy(text):
    """
    Calculate Shannon entropy of a string.
    """
    if not text:
        return 0

    counter = Counter(text)
    length = len(text)

    entropy = 0

    for count in counter.values():
        probability = count / length
        entropy -= probability * math.log2(probability)

    return entropy


def extract_url_features(url):
    """
    Extract the exact 11 URL features used by the trained XGBoost model.
    """

    parsed = urlparse(url)
    hostname = parsed.hostname or ""

    # Extract registered domain/subdomain information
    ext = tldextract.extract(url)

    if ext.subdomain:
        num_subdomains = len(ext.subdomain.split("."))
    else:
        num_subdomains = 0

    # 1. URL length
    url_length = len(url)

    # 2. URL entropy
    entropy = calculate_entropy(url)

    # 3. Number of www occurrences
    num_www = url.lower().count("www")

    # 4. Ratio of digits in URL
    digit_count_url = sum(
        char.isdigit()
        for char in url
    )

    ratio_digits_url = (
        digit_count_url / url_length
        if url_length > 0
        else 0
    )

    # 5. Number of subdomains
    # Already calculated above

    # 6. Hostname length
    length_hostname = len(hostname)

    # 7. Number of dots
    num_dots = url.count(".")

    # 8. Number of hyphens
    num_hyphens = url.count("-")

    # 9. Ratio of digits in hostname
    digit_count_host = sum(
        char.isdigit()
        for char in hostname
    )

    ratio_digits_host = (
        digit_count_host / length_hostname
        if length_hostname > 0
        else 0
    )

    # 10. Number of question marks
    num_question_mark = url.count("?")

    # 11. Number of '=' characters
    num_eq = url.count("=")

    return {
        "entropy": entropy,
        "url_length": url_length,
        "num_www": num_www,
        "ratio_digits_url": ratio_digits_url,
        "num_subdomains": num_subdomains,
        "length_hostname": length_hostname,
        "num_dots": num_dots,
        "num_hyphens": num_hyphens,
        "ratio_digits_host": ratio_digits_host,
        "num_question_mark": num_question_mark,
        "num_eq": num_eq
    }
