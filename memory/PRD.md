# SUGARCANE AI - Product Requirements Document

## Problem Statement
Build a sugarcane disease analysis website using a custom UNet segmentation model (`best_unet.pth`) — NO AI/LLM.

## Core Requirements
- **Two Roles**: Admin (`admin`/`ADT@123`) and User/Farmer
- **Multi-language**: English, Hindi, Marathi
- **Detection**: UNet segmentation model ONLY (no AI/LLM). 4 classes: Background, Brown Rust, Mosaic, Red Rot
- **Segmentation Overlay**: Colored overlay highlighting affected areas (orange=Brown Rust, yellow-green=Mosaic, red=Red Rot)
- **Admin Approval Workflow**: Farmer uploads → Pending → Admin reviews → Approves/Rejects → Farmer sees result
- **Only 4 diseases**: Brown Rust, Mosaic, Red Rot, Healthy

## Architecture
- **Frontend**: React + TailwindCSS + lucide-react + framer-motion + i18next
- **Backend**: FastAPI + MongoDB + segmentation_models_pytorch (UNet/ResNet34)
- **Model**: `best_unet.pth` (94MB, 4 classes)
- **NO AI/LLM integration** — pure PyTorch UNet inference

## What's Been Implemented
- UNet-only detection pipeline (no GPT/AI)
- Colored segmentation overlay generation and display
- Admin Approval Workflow (approve/reject/correct/suggest)
- 4 diseases with treatments and i18n (EN/HI/MR)
- Disease Library (admin-only), ZIP download, stats
- "SUGARCANE AI" branding with sugarcane field imagery
- Mobile-responsive layout

## Backlog
- **P2**: Camera capture for mobile users
- **P2**: Backend refactoring (split server.py)
