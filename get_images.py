import urllib.request, json
pages = ['Syrian_hamster', 'Roborovski_dwarf_hamster', 'Winter_white_dwarf_hamster', 'Campbell%27s_dwarf_hamster', 'Chinese_hamster']
for p in pages:
    url = f"https://en.wikipedia.org/w/api.php?action=query&titles={p}&prop=pageimages&format=json&pithumbsize=600"
    try:
        req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)'})
        with urllib.request.urlopen(req) as response:
            res = json.loads(response.read().decode('utf-8'))
            p_id = list(res['query']['pages'].keys())[0]
            if 'thumbnail' in res['query']['pages'][p_id]:
                img = res['query']['pages'][p_id]['thumbnail']['source']
                print(f"{p}: {img}")
            else:
                print(f"{p}: NO THUMBNAIL")
    except Exception as e:
        print(f"Error {p}: {e}")
