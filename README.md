# heyavijitroy.github.io

Source repository for **[avijitroy.com](https://avijitroy.com)** — the personal portfolio of **Avijit Roy**, cybersecurity researcher, AI engineer, substitute lecturer, adjunct assistant professor, and data analyst based in New York.

The site covers his research in privacy-preserving AI and digital forensics, engineering projects across cybersecurity and applied computing, teaching, professional experience, and professional engagement in conference facilitation and judging. Built with static HTML, CSS, and JavaScript. Deployed via GitHub Pages.

---

## Site Navigation

| Section | Description |
|---|---|
| [Home](https://avijitroy.com/) | Overview, current work, and highlights |
| [Research](https://avijitroy.com/research/) | Publications, MS thesis, patents, grants, and honors |
| [Teaching](https://avijitroy.com/teaching/) | Course materials and educational resources |
| [Projects](https://avijitroy.com/projects/) | Engineering portfolio across cybersecurity, AI, and developer tools |
| [Experience](https://avijitroy.com/experience/) | Professional background and affiliations |
| [Engagement](https://avijitroy.com/professional-engagement/) | Conference facilitation, invited judging, and professional service |

---

## Visibility maintenance

Run `python scripts/audit_visibility.py` with Python 3.11 or newer. No packages or network access are required.

The Website Visibility Audit workflow runs on pushes and pull requests to `main`, manually, and each Monday at 13:17 UTC once merged into `main`. Results appear in the workflow log and job summary. GitHub may delay scheduled runs or disable schedules in inactive public repositories.

The audit checks indexable HTML pages for canonical URLs, titles, descriptions, sitemap coverage, JSON-LD syntax, and consistent Avijit Roy author IDs. It also checks existing citation metadata, sitemap dates for invalid/future values, the LLM files' profile identifiers, and source `robots.txt` access for Googlebot, bingbot, and OAI-SearchBot. Intentional `noindex` utilities and templates are excluded. Five separately deployed project sites are explicitly identified in the script and require their own checks.

When editing a page, update only its corresponding sitemap `lastmod` to the date of the actual change. The audit does not infer substantive changes or automatically refresh dates. Keep shared facts aligned across visible pages, JSON-LD, `llms.txt`, and `llms-full.txt`; semantic consistency still needs editorial review.

This is a source-metadata check, not a live crawl, complete Schema.org validator, indexing submission, or ranking/citation measurement. Check Cloudflare crawler rules and live responses separately. Use Search Console and analytics to measure outcomes. The workflow has read-only repository permissions and does not publish edits or send outreach.

Built with rigor. &copy; Avijit Roy
