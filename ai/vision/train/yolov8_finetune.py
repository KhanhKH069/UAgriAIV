"""
Fine-tune YOLOv8n cho phát hiện bệnh cây trồng
TV2: AI/ML #1 — Vision Model
Run: uv run python train/yolov8_finetune.py --epochs 100
"""
from ultralytics import YOLO
import torch
import argparse


def train(data_yaml: str, epochs: int = 100, batch: int = 16):
    model = YOLO("yolov8n.pt")  # pretrained COCO weights
    results = model.train(
        data=data_yaml,
        epochs=epochs,
        imgsz=640,
        batch=batch,
        device="0" if torch.cuda.is_available() else "cpu",
        project="runs/train",
        name="crop_disease_v1",
        patience=20,
        augment=True,
        cache=True,
        workers=4,
    )
    mAP = results.results_dict.get("metrics/mAP50(B)", 0)
    print(f"✅ Training xong — mAP50: {mAP:.3f}")
    return results


def validate(model_path: str, data_yaml: str):
    model = YOLO(model_path)
    metrics = model.val(data=data_yaml, split="test")
    print(f"Precision : {metrics.box.mp:.3f}")
    print(f"Recall    : {metrics.box.mr:.3f}")
    print(f"mAP50     : {metrics.box.map50:.3f}")
    print(f"mAP50-95  : {metrics.box.map:.3f}")


if __name__ == "__main__":
    ap = argparse.ArgumentParser()
    ap.add_argument("--mode",   choices=["train", "val"], default="train")
    ap.add_argument("--data",   default="train/config.yaml")
    ap.add_argument("--model",  default="models/best.pt")
    ap.add_argument("--epochs", type=int, default=100)
    args = ap.parse_args()

    if args.mode == "train":
        train(args.data, args.epochs)
    else:
        validate(args.model, args.data)
