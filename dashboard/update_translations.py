import json
import os


def update_json(filepath, updates):
    if not os.path.exists(filepath):
        print(f"File {filepath} not found.")
        return
    with open(filepath, "r", encoding="utf-8") as f:
        data = json.load(f)

    for category, kvs in updates.items():
        if category not in data:
            data[category] = {}
        for k, v in kvs.items():
            data[category][k] = v

    with open(filepath, "w", encoding="utf-8") as f:
        json.dump(data, f, ensure_ascii=False, indent=4)


updates_vi = {
    "common": {
        "settings": "Cài đặt",
        "logout": "Đăng xuất",
        "search_ph": "Tìm kiếm...",
        "find": "[Tìm]",
        "refresh": "Tải lại",
        "notifications": "Thông báo",
        "alerts": "Cảnh báo",
        "no_alerts": "Không có cảnh báo nào",
        "type_pest": "Sâu bệnh",
        "type_weather": "Thời tiết",
        "type_disease": "Bệnh cây",
        "type_irrigation": "Tưới tiêu",
    }
}

updates_en = {
    "common": {
        "settings": "Settings",
        "logout": "Logout",
        "search_ph": "Search...",
        "find": "[Find]",
        "refresh": "Refresh",
        "notifications": "Notifications",
        "alerts": "Alerts",
        "no_alerts": "No alerts",
        "type_pest": "Pest",
        "type_weather": "Weather",
        "type_disease": "Disease",
        "type_irrigation": "Irrigation",
    }
}

update_json("d:/UAgriAIV/dashboard/locales/vi/translation.json", updates_vi)
update_json("d:/UAgriAIV/dashboard/locales/en/translation.json", updates_en)

print("JSON files updated")
