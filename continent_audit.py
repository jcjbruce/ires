import json
from collections import defaultdict
from pathlib import Path

path = Path('/home/ubuntu/indigenous-research-directory/client/src/data/institutions.json')
data = json.loads(path.read_text())

by_continent = defaultdict(lambda: defaultdict(list))
for item in data['institutions']:
    by_continent[item['continent']][item['country']].append(item['institutionName'])

for continent in sorted(by_continent):
    print(f'=== {continent} ===')
    for country in sorted(by_continent[continent]):
        print(f"{country}: {len(by_continent[continent][country])}")
    print()
