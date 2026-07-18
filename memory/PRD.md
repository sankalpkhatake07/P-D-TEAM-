# SUGARCANE AI - Product Requirements Document

## Problem Statement
Build a sugarcane disease analysis website using a custom UNet segmentation model (`best_unet.pth`) — NO AI/LLM.

## Core Requirements
- **Two Roles**: Admin (`admin`/`ADT@123`) and User/Farmer
- **Multi-language**: English, Hindi, Marathi
- **Detection**: UNet segmentation model ONLY (no AI/LLM). 4 classes: Background, Brown Rust, Mosaic, Red Rot
- **Unrecognized diseases**: When model can't classify, show "Disease Not Yet Supported" message and still send to admin for suggestions
- **Segmentation Overlay**: Colored overlay highlighting affected areas
- **Admin Approval Workflow**: Farmer uploads → Pending → Admin reviews/suggests → Farmer sees result

## Detection Flow
1. Farmer uploads image → UNet segments it
2. If disease detected (Brown Rust/Mosaic/Red Rot) → show overlay + "Awaiting Review"
3. If no disease detected (Background only) → show "Disease Not Yet Supported - Admin will give suggestions"
4. Both cases → saved as "pending" for admin review
5. Admin reviews, can correct disease, add suggestions → Farmer sees final result

## Architecture
- **Frontend**: React + TailwindCSS + lucide-react + framer-motion + i18next
- **Backend**: FastAPI + MongoDB + segmentation_models_pytorch (UNet/ResNet34)
- **Model**: `best_unet.pth` (94MB, 4 classes)
- **NO AI/LLM** — pure PyTorch UNet inference

## Diseases Supported
- Brown Rust, Mosaic, Red Rot (detected by model)
- Healthy (admin can set)
- Unrecognized (auto-set when model can't classify)

## Backlog
- **P2**: Camera capture for mobile users
- **P2**: Backend refactoring (split server.py)
