# SUGARCANE AI - Product Requirements Document

## Problem Statement
Build a sugarcane disease analysis website using a custom UNet segmentation model — NO AI/LLM. Full Disease Library with management practices for 23 diseases/pests.

## Core Features
- **UNet Detection**: 3 diseases (Brown Rust, Mosaic, Red Rot) + Unrecognized fallback
- **Disease Library**: 23 diseases with 5 practice categories (Cultural, Mechanical, Biological, Chemical, Timing)
- **Admin Approval Workflow**: Farmer uploads → Pending → Admin reviews/suggests → Farmer sees result
- **Multilingual**: English, Hindi, Marathi
- **Segmentation Overlay**: Colored overlay on detected images
- **Confidence Thresholding**: 75% softmax + 2% min area to reduce false positives

## Diseases in Library
Brown Rust, Brown Spot, Early Shoot Borer, Eye Spot, Grassy Shoot Disease, Internode Borer, Leaf Footed Bug, Mites, Mosaic, Pokkah Boeng, Pyrilla, Red Rot, Scale Insect, Whiplash Smut, Wilt, Woolly Aphids, Top Shoot Borer, White Grub, Mealy Bug, Grasshopper, Yellow Leaf Disease, Orange Rust, Leafscald

## Architecture
- Frontend: React + TailwindCSS + lucide-react + framer-motion + i18next
- Backend: FastAPI + MongoDB + segmentation_models_pytorch (UNet/ResNet34)
- Model: `best_unet.pth` (94MB, 4 classes)

## Backlog
- P2: Camera capture for mobile users
- P2: Backend refactoring (split server.py)
