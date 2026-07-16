#!/usr/bin/env python
"""Extract key data from all 24 Lieux HTML files."""
import os, re, json, glob

base_dir = r"C:\Users\cleme\Desktop\label vanlife\Lieux LABELLISE"
files = glob.glob(os.path.join(base_dir, "**", "*.html"), recursive=True)

results = []

for fpath in sorted(files):
    folder = os.path.basename(os.path.dirname(fpath))
    filename = os.path.basename(fpath)
    
    with open(fpath, "r", encoding="utf-8", errors="replace") as f:
        content = f.read()
    
    # Extract title from <title>
    title_m = re.search(r'<title>(.*?)</title>', content, re.DOTALL)
    title = title_m.group(1).strip() if title_m else filename
    
    # Extract meaningful text parts (skip script/style)
    text_only = re.sub(r'<script[^>]*>.*?</script>', '', content, flags=re.DOTALL)
    text_only = re.sub(r'<style[^>]*>.*?</style>', '', text_only, flags=re.DOTALL)
    text_only = re.sub(r'<[^>]+>', '\n', text_only)
    text_only = re.sub(r'\n\s*\n', '\n', text_only)
    text_only = re.sub(r'&amp;', '&', text_only)
    text_only = re.sub(r'&#x27;|&#39;', "'", text_only)
    text_only = re.sub(r'&lt;', '<', text_only)
    text_only = re.sub(r'&gt;', '>', text_only)
    text_only = re.sub(r'&quot;', '"', text_only)
    text_only = re.sub(r'&nbsp;', ' ', text_only)
    
    lines = [l.strip() for l in text_only.split('\n') if l.strip()]
    
    # Extract description (the main paragraph after the title)
    desc_lines = []
    in_desc = False
    for i, line in enumerate(lines):
        if 'L\'expérience vanlifer' in line or 'Emplacements' in line:
            in_desc = True
        if in_desc:
            desc_lines.append(line)
            if len(desc_lines) >= 8:
                break
    
    # Find reduction info (Code promo)
    reduction = "-10%"
    for line in lines:
        cm = re.search(r'Code promo[^:]*:\s*(\S+)\s+pour\s+([\-\d]+%)', line)
        if cm:
            reduction = cm.group(2)
            break
        cm2 = re.search(r'([\-\d]+%)\s+de réduction', line)
        if cm2:
            reduction = cm2.group(1)
            break
    
    # Find GPS if present
    lat, lng = None, None
    for line in lines:
        gm = re.search(r'lat\s*[=:]\s*([\d\.\-]+)', line, re.IGNORECASE)
        if gm:
            lat = float(gm.group(1))
        gm2 = re.search(r'lng\s*[=:]\s*([\d\.\-]+)|lon\s*[=:]\s*([\d\.\-]+)|lng\s*[=:]\s*([\d\.\-]+)', line, re.IGNORECASE)
        if gm2:
            v = gm2.group(1) or gm2.group(2) or gm2.group(3)
            lng = float(v)
    
    # Extract type from title or content
    lieu_type = "Camping"
    for line in lines[:30]:
        if 'Ferme' in line or 'ferme' in line:
            lieu_type = "Camping à la ferme"
        if 'Domaine' in line or 'domaine' in line:
            lieu_type = "Domaine"
        if 'Éco-Camping' in line or 'Eco camping' in line:
            lieu_type = "Éco-Camping"
        if 'Gîte' in line:
            lieu_type = "Gîte & Camping à la ferme"
    
    # Extract city/region from title
    region = ""
    city = ""
    title_clean = title.replace('Au Tylo Soleil Camping — Camping vanlife', '').replace('Camping vanlife —', '').replace('Camping à la ferme vanlife —', '').replace('_ Camping vanlife —', '').replace('_ Ferme _ accueil paysan vanlife —', '')
    
    if '—' in title:
        parts = title.split('—')
        if len(parts) >= 2:
            region_part = parts[-1].strip()
            region = region_part.strip('()')
    
    # Try to get city from parentheses
    city_m = re.search(r'\(([^)]+)\)', title)
    if city_m:
        region = city_m.group(1)
    
    # Extract city from "— City (Region)" pattern
    title_parts = title.split('—')
    if len(title_parts) >= 2:
        last_part = title_parts[-1].strip()
        cm3 = re.search(r'^([^(]+)', last_part)
        if cm3:
            city = cm3.group(1).strip()
    
    # Get services
    services = []
    for line in lines:
        if 'Wifi' in line:
            services.append("Wifi")
        if 'Piscine' in line or 'baignade' in line:
            services.append("Piscine")
        if 'Restauration' in line or 'restaurant' in line.lower() or 'bar' in line.lower():
            services.append("Restauration")
        if 'Animaux' in line or 'animaux' in line.lower():
            services.append("Animaux acceptés")
    
    services = list(set(services))
    
    # Build description
    desc_parts = []
    for line in lines:
        line_lower = line.lower()
        if any(word in line_lower for word in ['camping', 'emplacements', 'vanlife', 'à taille humaine', 'familial', 'cadre', 'nature', 'calme', 'authentique']):
            if len(line) > 40 and len(desc_parts) < 3:
                desc_parts.append(line)
        if 'L\'expérience vanlifer' in line:
            break
    
    description = ' '.join(desc_parts[:2]) if desc_parts else lines[0] if lines else ""
    
    # Extract address/location from page content
    address = ""
    for line in lines:
        if '📍' in line:
            address = line.replace('📍', '').strip()
            break
    
    # Create id from folder name
    lieu_id = re.sub(r'[^a-z0-9]+', '-', folder.lower()).strip('-')
    if not lieu_id or len(lieu_id) < 3:
        lieu_id = re.sub(r'[^a-z0-9]+', '-', os.path.splitext(filename)[0].lower()).strip('-')
    
    entry = {
        "id": lieu_id,
        "folder": folder,
        "file": filename,
        "name": title.split('—')[0].strip() if '—' in title else title,
        "title": title,
        "city": city,
        "region": region,
        "type": lieu_type,
        "reduction": reduction,
        "description": description,
        "address": address,
        "services": services,
        "lat": lat,
        "lng": lng,
        "text_lines": lines[:50]
    }
    results.append(entry)

# Print results as JSON
print(json.dumps(results, indent=2, ensure_ascii=False))