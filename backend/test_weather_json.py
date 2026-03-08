import urllib.request

try:
    with open("out_current.json", "w", encoding="utf-8") as f:
        req = urllib.request.Request("http://localhost:8000/api/weather/current")
        with urllib.request.urlopen(req) as response:
            f.write(response.read().decode("utf-8"))

    with open("out_forecast.json", "w", encoding="utf-8") as f:
        req2 = urllib.request.Request("http://localhost:8000/api/weather/forecast")
        with urllib.request.urlopen(req2) as response2:
            f.write(response2.read().decode("utf-8"))

except Exception as e:
    with open("out_error.txt", "w") as f:
        f.write(str(e))
