#!/usr/bin/env python3
"""Validate repository-owned discovery metadata without network requests or dependencies."""
import json
import re
import sys
from datetime import date
from html.parser import HTMLParser
from pathlib import Path
from urllib.parse import urlsplit
import xml.etree.ElementTree as ET

ROOT = Path(__file__).resolve().parents[1]
ORIGIN = "https://avijitroy.com"
PERSON = ORIGIN + "/#person"
ORCID = "https://orcid.org/0009-0007-8036-0952"
# GitHub Pages project sites are deployed from separate repositories.
PROJECT_PATHS = {"/exam-timer/", "/limo/", "/HashNow/", "/JomiMapo/", "/ny-dmv-bengali-guide/"}
NS = {"sm": "http://www.sitemaps.org/schemas/sitemap/0.9"}


class Page(HTMLParser):
    def __init__(self, source):
        super().__init__()
        self.canonicals = []
        self.meta = {}
        self.title = ""
        self.in_title = False
        self.feed(source)

    def handle_starttag(self, tag, attrs):
        attrs = dict(attrs)
        if tag == "title":
            self.in_title = True
        if tag == "link" and "canonical" in attrs.get("rel", "").lower().split():
            self.canonicals.append(attrs.get("href", ""))
        if tag == "meta":
            key = attrs.get("name", attrs.get("property", "")).lower()
            self.meta.setdefault(key, []).append(attrs.get("content", ""))

    def handle_endtag(self, tag):
        if tag == "title":
            self.in_title = False

    def handle_data(self, data):
        if self.in_title:
            self.title += data


def objects(value):
    if isinstance(value, dict):
        yield value
        for child in value.values():
            yield from objects(child)
    elif isinstance(value, list):
        for child in value:
            yield from objects(child)


def audit():
    errors, notes = [], []
    entries = ET.parse(ROOT / "sitemap.xml").getroot().findall("sm:url", NS)
    urls = []
    for entry in entries:
        url = entry.findtext("sm:loc", "", NS).strip()
        urls.append(url)
        parsed = urlsplit(url)
        if parsed.scheme != "https" or parsed.netloc != "avijitroy.com" or parsed.query or parsed.fragment:
            errors.append(f"Invalid sitemap URL: {url}")
        lastmod = entry.findtext("sm:lastmod", "", NS)
        if lastmod:
            try:
                modified = date.fromisoformat(lastmod)
                if modified > date.today():
                    errors.append(f"Future sitemap lastmod: {url}: {lastmod}")
            except ValueError:
                errors.append(f"Expected YYYY-MM-DD lastmod: {url}: {lastmod}")
        path = parsed.path.lstrip("/")
        target = ROOT / (path + "index.html" if parsed.path.endswith("/") else path)
        if not target.is_file():
            if parsed.path in PROJECT_PATHS:
                notes.append(f"Separate project deployment; not checked locally: {url}")
            else:
                errors.append(f"Sitemap target missing from repository: {url}")
    if len(urls) != len(set(urls)):
        errors.append("Duplicate sitemap URLs")
    sitemap = set(urls)
    checked = 0
    for path in sorted(ROOT.rglob("*.html")):
        relative = path.relative_to(ROOT).as_posix()
        if any(part.startswith(".") for part in path.relative_to(ROOT).parts):
            continue
        source = path.read_text(encoding="utf-8")
        page = Page(source)
        # Redirects, private utilities, and course templates intentionally opt out.
        noindex = any("noindex" in value.lower() for value in page.meta.get("robots", []))
        expected_path = relative[:-10] if relative.endswith("index.html") else relative
        expected = ORIGIN + "/" + expected_path
        if noindex:
            if expected in sitemap:
                errors.append(f"{relative}: noindex page is listed in sitemap")
            continue
        checked += 1
        if page.canonicals != [expected]:
            errors.append(f"{relative}: expected exactly one canonical: {expected}")
        if expected not in sitemap:
            errors.append(f"{relative}: indexable page absent from sitemap")
        if not page.title.strip():
            errors.append(f"{relative}: missing title")
        if not any(v.strip() for v in page.meta.get("description", [])):
            errors.append(f"{relative}: missing description")
        for social in ("og:url",):
            if social in page.meta and page.meta[social] != [expected]:
                errors.append(f"{relative}: {social} differs from canonical")
        for block in re.findall(r'<script\b[^>]*type=[\"\']application/ld\+json[\"\'][^>]*>(.*?)</script>', source, re.I | re.S):
            try:
                data = json.loads(block)
            except ValueError as exc:
                errors.append(f"{relative}: invalid JSON-LD: {exc}")
                continue
            for obj in objects(data):
                if obj.get("@type") == "Person" and obj.get("name") == "Avijit Roy":
                    if obj.get("@id") != PERSON:
                        errors.append(f"{relative}: author must reference {PERSON}")
        if "citation_title" in page.meta:
            # Scholar requires title, author, and publication date. A book may
            # legitimately have neither a DOI nor a freely hosted full-text PDF.
            for field in ("citation_title", "citation_author", "citation_publication_date"):
                if not any(v.strip() for v in page.meta.get(field, [])):
                    errors.append(f"{relative}: missing {field}")
            if page.meta.get("citation_abstract_html_url") != [expected]:
                errors.append(f"{relative}: citation landing URL differs from canonical")
    for name in ("llms.txt", "llms-full.txt"):
        text = (ROOT / name).read_text(encoding="utf-8")
        if PERSON not in text or ORCID not in text:
            errors.append(f"{name}: missing canonical profile or ORCID")
    from urllib.robotparser import RobotFileParser
    robots = RobotFileParser()
    robots.parse((ROOT / "robots.txt").read_text(encoding="utf-8").splitlines())
    for agent in ("Googlebot", "bingbot", "OAI-SearchBot"):
        for url in sitemap:
            if not robots.can_fetch(agent, url):
                errors.append(f"robots.txt blocks {agent}: {url}")
    if ORIGIN + "/sitemap.xml" not in (robots.site_maps() or []):
        errors.append("robots.txt does not declare the canonical sitemap")
    print(f"Checked {checked} indexable HTML pages and {len(urls)} sitemap entries.")
    for note in notes:
        print("NOTE:", note)
    for error in errors:
        print("ERROR:", error)
    print(f"Visibility metadata audit: {len(errors)} error(s).")
    return bool(errors)


if __name__ == "__main__":
    try:
        sys.exit(audit())
    except (OSError, ET.ParseError) as exc:
        print(f"ERROR: cannot complete audit: {exc}")
        sys.exit(1)
