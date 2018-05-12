
# http://www.geomidpoint.com/random/
locs = []
with open('locs.csv', 'r') as f:
    for line in f:
        data = line.split(',')
        locs.append({
            'latitude': float(data[1]),
            'longitude': float(data[3])
        })

import json
with open('locs.json', 'w') as outfile:
    json.dump(locs, outfile)