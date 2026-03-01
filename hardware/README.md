# Hardware — UAV Assembly & Integration
**Phụ trách: TV1 - Hardware Lead**

## Danh sách linh kiện (BOM)
| Linh kiện | Model | Số lượng | Ghi chú |
|---|---|---|---|
| Frame UAV | DJI F550 / S500 | 1 | Hexacopter, payload 2kg |
| Flight Controller | Pixhawk 6C | 1 | ArduCopter firmware |
| Motors | T-Motor MN3510 KV700 | 6 | Hiệu suất cao |
| ESC | T-Motor Air 40A | 6 | BLHeli_32 |
| Battery | LiPo 6S 10000mAh | 2 | ~30 phút bay |
| GPS | Here3+ GNSS | 1 | RTK optional |
| Edge Computer | Jetson Orin NX 16GB | 1 | AI inference |
| Camera RGB | Sony IMX477 12MP | 1 | Chụp ảnh cây |
| Camera Multispectral | MicaSense RedEdge-P | 1 | NDVI analysis |
| Sprayer Module | Holybro Spray Kit | 1 | 2L tank, pump relay |

## Cấu trúc thư mục
- `schematics/` — Bản vẽ kỹ thuật, sơ đồ đấu dây
- `firmware/` — Config flight controller, relay control
- `tests/` — Log kiểm thử, kết quả thực địa
