import json

with open(r'C:\Users\cleme\label-vanlife-v1\extracted_lieux.json', 'r', encoding='utf-8') as f:
    data = json.load(f)

# Filter out the non-lieu entry
lieux = [d for d in data if d['id'] != 'lieux-labellise']
print(f'Real lieux: {len(lieux)}')
for d in lieux:
    addr = d.get('address', '') or ''
    city = d.get('city', '') or ''
    region = d.get('region', '') or ''
    print(f'{d["id"]}|{d["name"][:50]}|{city}|{region}|{addr}')