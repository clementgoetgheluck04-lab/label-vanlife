"""Parse KML files from the desktop data folder to extract campsite data."""

import xml.etree.ElementTree as ET
import glob
import os
import json
import re

kml_dir = r'C:\Users\cleme\Desktop\label vanlife'
all_places = []

for f in sorted(glob.glob(os.path.join(kml_dir, '*.kml'))):
    name = os.path.basename(f)
    try:
        tree = ET.parse(f)
        root = tree.getroot()
        ns = {'kml': 'http://www.opengis.net/kml/2.2'}
        placemarks = root.findall('.//kml:Placemark', ns)
        
        region = name.replace('.kml', '').replace('CAMPINGS ', '').replace('LES ', '').replace('EN ', '').strip()
        region = re.sub(r'[,_]\s*$', '', region).strip()
        
        for pm in placemarks:
            pm_name = pm.find('kml:name', ns)
            pm_desc = pm.find('kml:description', ns)
            point = pm.find('.//kml:Point', ns)
            
            name_text = pm_name.text.strip() if pm_name is not None and pm_name.text else ''
            
            coords = ''
            if point is not None:
                coords_el = point.find('kml:coordinates', ns)
                if coords_el is not None and coords_el.text:
                    coords = coords_el.text.strip()
            
            desc_text = ''
            if pm_desc is not None and pm_desc.text:
                desc_text = pm_desc.text.strip()
                desc_text = re.sub(r'<!\[CDATA\[|\]\]>', '', desc_text).strip()
                desc_text = re.sub(r'<[^>]+>', ' ', desc_text)
                desc_text = re.sub(r'\s+', ' ', desc_text).strip()[:200]
            
            all_places.append({
                'name': name_text,
                'region': region,
                'coordinates': coords,
                'source_file': name,
                'description': desc_text
            })
        
        print(f'{name}: {len(placemarks)} lieux')
        
    except Exception as e:
        print(f'{name}: ERROR {e}')

print(f'\nTotal: {len(all_places)} places found')

# Save as JSON for easy import
scripts_dir = os.path.dirname(os.path.abspath(__file__))
output_path = os.path.join(scripts_dir, '..', 'src', 'data', 'campings_kml.json')
os.makedirs(os.path.dirname(output_path), exist_ok=True)
with open(output_path, 'w', encoding='utf-8') as f:
    json.dump(all_places, f, ensure_ascii=False, indent=2)

print(f'Saved to {output_path}')

# Show first 5 as sample
for p in all_places[:5]:
    print(f'  - {p["name"]} ({p["region"]}): {p["coordinates"][:50] if p["coordinates"] else "N/A"}')