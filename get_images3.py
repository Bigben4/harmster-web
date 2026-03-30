import urllib.request, json
pages = ['Syrian_hamster', 'Roborovski_dwarf_hamster', 'Winter_white_dwarf_hamster', 'Campbell%27s_dwarf_hamster', 'Chinese_hamster']
out = {}
for p in pages:
    try:
        req = urllib.request.Request(f"https://en.wikipedia.org/api/rest_v1/page/summary/{p}", headers={'User-Agent': 'HamsterBot/1.0'})
        res = json.loads(urllib.request.urlopen(req).read().decode('utf-8'))
        out[p] = res.get('thumbnail', {}).get('source', 'None')
    except Exception as e:
        out[p] = f"Error: {e}"
with open('images.json', 'w') as f:
    json.dump(out, f)
