import json

with open(r'C:\Users\cleme\label-vanlife-v1\extracted_lieux.json', 'r', encoding='utf-8') as f:
    data = json.load(f)

print(f"Total lieux in extracted JSON: {len(data)}")
for d in data:
    print(f"  [{d['id']}] {d['name'][:60]} | city={d.get('city','')} | region={d.get('region','')} | lat={d.get('lat')} | lng={d.get('lng')}")