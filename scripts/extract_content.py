import re, html

def extract_text(html_file):
    """Extract visible text from an HTML file, stripping JS/CSS/tags."""
    with open(html_file, 'r', encoding='utf-8') as f:
        content = f.read()
    # Remove scripts and styles
    content = re.sub(r'<script[^>]*>.*?</script>', '', content, flags=re.DOTALL)
    content = re.sub(r'<style[^>]*>.*?</style>', '', content, flags=re.DOTALL)
    # Remove HTML tags
    text = re.sub(r'<[^>]+>', ' ', content)
    # Decode entities
    text = html.unescape(text)
    # Collapse whitespace
    text = re.sub(r'\s+', ' ', text).strip()
    return text

# Extract content from main pages
base = r'C:\Users\cleme\Desktop\label vanlife\HTML SITE V1 label vanlife + image utilisé'

files = [
    "Label Vanlife _ Vanlife France _ spots, guides, communauté de vanlifers.html",
    "Le Label Vanlife _ Pour une Vanlife Responsable et Sereine _ Label Vanlife.html",
    "manifeste Le Label Vanlife _ Pour une Vanlife Responsable et Sereine _ Label Vanlife.html",
    "Devenir Membre Vanlife _ Carte Couple 19€ — Carte Famille 29€ _ Label Vanlife _ Label Vanlife.html",
    "Devenir Lieu Vanlife Labellisé en France _ Camping, Ferme, Vignoble — Label Vanlife 2026 _ Label Vanlife.html",
    "Blog Vanlife France 2026 _ Guides, Spots, Budget & Road Trip en Van _ Label Vanlife.html",
    "evenement Label Vanlife _ Vanlife France _ spots, guides, communauté de vanlifers.html",
]

import os
for fname in files:
    path = os.path.join(base, fname)
    if os.path.exists(path):
        text = extract_text(path)
        print(f"\n{'='*60}")
        print(f"FILE: {fname[:60]}")
        print(f"{'='*60}")
        print(text[:3000])
        print(f"\n... [TOTAL: {len(text)} chars]")
    else:
        print(f"NOT FOUND: {fname}")