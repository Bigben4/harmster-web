import os, urllib.request

os.makedirs('image', exist_ok=True)
images = {
    'syrian.jpg': 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/6b/Golden_hamster_front_1.jpg/330px-Golden_hamster_front_1.jpg',
    'roborovski.jpg': 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/6b/Phodopus_roborovskii.jpg/330px-Phodopus_roborovskii.jpg',
    'winter_white.jpg': 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/7a/PhodopusSungorus_1.jpg/330px-PhodopusSungorus_1.jpg',
    'campbell.jpg': 'https://upload.wikimedia.org/wikipedia/commons/e/ec/Campbell_hamster_agouti.jpg',
    'chinese.jpg': 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/4f/Chinesedsaffa.jpg/330px-Chinesedsaffa.jpg',
    'owner_holding.jpg': 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e0/Syrian_hamster.jpg/640px-Syrian_hamster.jpg' # Fallback to a clear syrian picture if a holding one is too hard to guess correctly without API. 
}

# Actually, I will search for a picture of hands holding a hamster in Wikimedia
# "Hamster in hand" usually has files like "Hamster_in_hand.jpg"
images['owner_holding.jpg'] = 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/36/Hamster_in_hands_%288924083651%29.jpg/640px-Hamster_in_hands_%288924083651%29.jpg'

for name, url in images.items():
    req = urllib.request.Request(url, headers={'User-Agent': 'HamsterBot/1.0'})
    try:
        with urllib.request.urlopen(req) as response, open(f'image/{name}', 'wb') as out_file:
            out_file.write(response.read())
        print(f"Downloaded {name}")
    except Exception as e:
        print(f"Failed {name} from {url}: {e}")
        # fallback to syrian hamster
        if name == 'owner_holding.jpg':
            fallback = 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e0/Syrian_hamster.jpg/640px-Syrian_hamster.jpg'
            req = urllib.request.Request(fallback, headers={'User-Agent': 'HamsterBot/1.0'})
            try:
                with urllib.request.urlopen(req) as response, open(f'image/{name}', 'wb') as out_file:
                    out_file.write(response.read())
                print(f"Downloaded fallback for {name}")
            except: pass
