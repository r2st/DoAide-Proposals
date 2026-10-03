from __future__ import annotations

import json
import logging

import httpx

from app.core.config import settings

logger = logging.getLogger(__name__)


def is_configured() -> bool:
    return bool(settings.openrouter_api_key)


def generate_proposal_content(
    template_name: str,
    template_sections: list[dict],
    brief: str,
    client_name: str | None = None,
    client_company: str | None = None,
) -> list[dict]:
    if not is_configured():
        return _fallback_content(template_sections, brief, client_name, client_company)

    sections_text = "\n".join(
        f"- {s['title']}: {s.get('content', '') or 'Fill this section'}"
        for s in template_sections
    )

    prompt = f"""You are a professional proposal writer. Generate content for a business proposal.

Template: {template_name}
Sections to fill:
{sections_text}

Client brief: {brief}
Client name: {client_name or 'Not specified'}
Client company: {client_company or 'Not specified'}

For each section, write professional, persuasive content tailored to the client.
Return a JSON array where each element has "title" and "content" keys.
Only return the JSON array, no other text."""

    try:
        response = httpx.post(
            f"{settings.openrouter_base_url}/chat/completions",
            headers={
                "Authorization": f"Bearer {settings.openrouter_api_key}",
                "Content-Type": "application/json",
            },
            json={
                "model": settings.openrouter_model,
                "messages": [{"role": "user", "content": prompt}],
                "temperature": 0.7,
            },
            timeout=settings.openrouter_timeout_seconds,
        )
        response.raise_for_status()
        content = response.json()["choices"][0]["message"]["content"]
        content = content.strip()
        if content.startswith("```"):
            content = content.split("\n", 1)[1].rsplit("```", 1)[0]
        return json.loads(content)
    except Exception:
        logger.exception("AI generation failed, using fallback")
        return _fallback_content(template_sections, brief, client_name, client_company)


def _fallback_content(
    template_sections: list[dict],
    brief: str,
    client_name: str | None,
    client_company: str | None,
) -> list[dict]:
    result = []
    for section in template_sections:
        content = section.get("content") or ""
        if client_name:
            content = content.replace("{{client_name}}", client_name)
        if client_company:
            content = content.replace("{{client_company}}", client_company)
        if brief and not content:
            content = f"Based on your requirements: {brief}"
        result.append({"title": section["title"], "content": content})
    return result
