import requests
import dns.resolver
import tldextract

from datetime import datetime, timezone
from urllib.parse import urlparse


# IANA RDAP bootstrap service
RDAP_BOOTSTRAP_URL = "https://data.iana.org/rdap/dns.json"


def load_rdap_bootstrap():
    """
    Load the IANA RDAP bootstrap information.
    """
    try:
        response = requests.get(
            RDAP_BOOTSTRAP_URL,
            timeout=10
        )

        response.raise_for_status()

        return response.json()

    except Exception:
        return {"services": []}


rdap_bootstrap = load_rdap_bootstrap()


def get_rdap_server(domain):
    """
    Find the RDAP server responsible for a domain's TLD.
    """

    tld = domain.split(".")[-1].lower()

    services = rdap_bootstrap.get(
        "services",
        []
    )

    for service in services:

        tlds = service[0]
        urls = service[1]

        if tld in tlds:
            return urls[0]

    return None


def get_domain_registration_date(domain):
    """
    Get the domain registration date using RDAP.
    """

    rdap_server = get_rdap_server(domain)

    if not rdap_server:
        return None

    url = (
        rdap_server.rstrip("/")
        + "/domain/"
        + domain
    )

    try:

        response = requests.get(
            url,
            timeout=10,
            headers={
                "Accept": "application/rdap+json"
            }
        )

        if response.status_code != 200:
            return None

        data = response.json()

    except Exception:
        return None

    for event in data.get("events", []):

        if event.get("eventAction") == "registration":

            registration_date = event.get(
                "eventDate"
            )

            if registration_date:
                return registration_date

    return None


def get_domain_age(domain):
    """
    Calculate domain age in days.

    Returns -1 internally if registration
    information is unavailable.
    """

    registration_date = (
        get_domain_registration_date(domain)
    )

    if not registration_date:
        return -1

    try:

        registration_dt = datetime.fromisoformat(
            registration_date.replace(
                "Z",
                "+00:00"
            )
        )

        now = datetime.now(timezone.utc)

        age_days = (
            now - registration_dt
        ).days

        return max(age_days, 0)

    except Exception:
        return -1


def get_live_dns_features(url):
    """
    Get live DNS information for the URL hostname.
    """

    parsed = urlparse(url)

    hostname = parsed.hostname

    if not hostname:

        return {
            "dns_resolvable": 0,
            "num_ips": 0,
            "ttl": -1,
            "num_name_servers": 0
        }

    # Get the registered/apex domain.
    # This is important for NS lookup.
    ext = tldextract.extract(url)

    registered_domain = (
        ext.top_domain_under_public_suffix
    )

    if not registered_domain:
        registered_domain = hostname

    resolver = dns.resolver.Resolver()

    dns_resolvable = 0
    num_ips = 0
    ttl = -1
    num_name_servers = 0

    # -------------------------
    # A record lookup
    # -------------------------

    try:

        answer = resolver.resolve(
            hostname,
            "A"
        )

        ips = set(
            record.address
            for record in answer
        )

        num_ips = len(ips)

        if answer.rrset is not None:
            ttl = answer.rrset.ttl

        if num_ips > 0:
            dns_resolvable = 1

    except Exception:
        pass

    # -------------------------
    # Name server lookup
    # -------------------------

    try:

        ns_answer = resolver.resolve(
            registered_domain,
            "NS"
        )

        num_name_servers = len(
            list(ns_answer)
        )

    except Exception:
        pass

    return {
        "dns_resolvable": dns_resolvable,
        "num_ips": num_ips,
        "ttl": ttl,
        "num_name_servers": num_name_servers
    }


def get_live_domain_intelligence(url):
    """
    Get complete live domain intelligence:

    - Domain age
    - DNS resolvability
    - Number of IPs
    - TTL
    - Number of name servers
    """

    parsed = urlparse(url)

    hostname = parsed.hostname

    if not hostname:

        return {
            "domain_age": -1,
            "dns_resolvable": 0,
            "num_ips": 0,
            "ttl": -1,
            "num_name_servers": 0
        }

    ext = tldextract.extract(url)

    registered_domain = (
        ext.top_domain_under_public_suffix
    )

    if not registered_domain:
        registered_domain = hostname

    # Live DNS information
    dns_info = get_live_dns_features(url)

    # RDAP domain age
    domain_age = get_domain_age(
        registered_domain
    )

    return {
        "domain_age": domain_age,
        **dns_info
    }
