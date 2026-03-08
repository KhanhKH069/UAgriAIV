import urllib.request
import json

try:
    print("Testing /api/weather/current:")
    req = urllib.request.Request("http://localhost:8000/api/weather/current")
    with urllib.request.urlopen(req) as response:
        print(json.dumps(json.loads(response.read().decode("utf-8")), indent=2))

    print("\nTesting /api/weather/forecast:")
    req2 = urllib.request.Request("http://localhost:8000/api/weather/forecast")
    with urllib.request.urlopen(req2) as response2:
        print(json.dumps(json.loads(response2.read().decode("utf-8")), indent=2))
except Exception as e:
    print("Error:", e)
