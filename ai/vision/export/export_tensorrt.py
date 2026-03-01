"""
Export YOLOv8 → TensorRT INT8 cho Jetson Orin
TV2: AI/ML #1
"""
from ultralytics import YOLO
import argparse, time
import numpy as np

def export(weights: str, int8: bool = True) -> str:
    model = YOLO(weights)
    print(f"📦 Export {weights} → TensorRT (INT8={int8})...")
    path = model.export(
        format   = "engine",
        int8     = int8,
        device   = "0",
        imgsz    = 640,
        simplify = True,
        dynamic  = False,
    )
    print(f"✅ Saved: {path}")
    return path

def benchmark(engine_path: str, n: int = 50):
    model = YOLO(engine_path)
    times = []
    dummy = np.zeros((640, 640, 3), dtype="uint8")
    for _ in range(n):
        t0 = time.perf_counter()
        model.predict(source=dummy, verbose=False)
        times.append((time.perf_counter() - t0) * 1000)
    avg = sum(times) / len(times)
    print(f"⚡ Latency ({n} runs): avg={avg:.1f}ms  min={min(times):.1f}ms  max={max(times):.1f}ms")
    print("✅ PASS" if avg < 80 else "⚠️ WARNING: avg latency > 80ms target")

if __name__ == "__main__":
    ap = argparse.ArgumentParser()
    ap.add_argument("--weights",   default="models/best.pt")
    ap.add_argument("--benchmark", action="store_true")
    ap.add_argument("--fp32",      action="store_true", help="FP32 thay vì INT8")
    args = ap.parse_args()

    engine = export(args.weights, int8=not args.fp32)
    if args.benchmark:
        benchmark(engine)
