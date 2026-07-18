# SUGARCANE AI - Product Requirements Document

## Problem Statement
Build a sugarcane disease analysis website using a custom UNet segmentation model (`best_unet.pth`) alongside an AI vision model (GPT-5.1 Vision via Emergent LLM Key).

## Core Requirements
- **Two Roles**: Admin (`admin`/`ADT@123`) and User/Farmer (simple pseudo-login)
- **Multi-language**: English, Hindi, Marathi across entire UI and prediction results
- **Detection Pipeline**: Dual-model (UNet segmentation primary for 3 diseases + GPT-5.1 Vision verifier/fallback for 26 diseases)
- **Segmentation Overlay**: UNet generates colored overlay images highlighting affected leaf areas (Brown Rust=orange, Mosaic=yellow-green, Red Rot=red)
- **Admin Approval Workflow**: Farmer uploads → Pending → Admin reviews/approves/rejects → Farmer sees result
- **Admin Panel**: Pending Reviews, Reviewed history (expandable), Disease Library (admin-only), ZIP download
- **Results**: Disease name, severity, treatment, chemical products/fertilizers for 26 diseases
- **No "Syngenta" branding**, no confidence scores shown to users
- **Innovative earthy UI design** with "SUGARCANE AI" branding

## Architecture
- **Frontend**: React + TailwindCSS + Shadcn UI + lucide-react + framer-motion + i18next
- **Backend**: FastAPI + MongoDB + segmentation_models_pytorch (UNet/ResNet34) + Emergent Integrations (GPT-5.1 Vision)
- **Model**: `best_unet.pth` (94MB, UNet with ResNet34 encoder, 4 classes: Background, Brown Rust, Mosaic, Red Rot)

## Detection Pipeline
1. **UNet (Primary)**: Segmentation model trained on sugarcane leaf images
   - Classes: 0=Background, 1=Brown Rust, 2=Mosaic, 3=Red Rot
   - Generates colored segmentation overlay image
   - Severity based on affected area percentage (>25%=high, >8%=medium, else=low)
2. **GPT-5.1 Vision (Fallback)**: Handles all 26 diseases when UNet detects nothing
3. **Overlay Storage**: Segmentation overlays stored in object storage, displayed in UI

## What's Been Implemented
- Full UNet segmentation pipeline replacing YOLO
- Colored segmentation overlay generation and display (Dashboard, Admin, History)
- Complete Admin Approval Workflow with approve/reject/correct/suggest
- 26 diseases with specific chemical treatments
- Comprehensive EN/HI/MR i18n (UI labels + backend disease dictionaries)
- Admin: Pending/Reviewed tabs, expandable reviewed items, stats, user list, ZIP download
- User: Dashboard with drag-drop upload, History with search/filter, expandable approved results
- Innovative earthy green UI theme (#1A3626 primary, #F5F5F0 background)
- "SUGARCANE AI" branding with sugarcane field imagery on login/register
- Disease Library restricted to admin only
- Role-based navigation
- Mobile-responsive layout with hamburger menu

## Key Endpoints
- `POST /api/detect` - Run UNet + GPT-5.1, creates detection with status "pending", generates overlay
- `GET /api/admin/pending` - Fetch unreviewed scans (includes overlay_path)
- `POST /api/admin/review/{id}` - Admin approve/reject with corrections
- `GET /api/admin/download-images` - ZIP of all images
- `GET /api/history?lang=xx` - User's scan history with translations
- `GET /api/diseases?lang=xx` - Disease library data
- `GET /api/files/{path}` - Serve images/overlays from object storage

## DB Schema
- `users`: `{username, role, name, mobile, created_at}`
- `detections`: `{id, user_id, image_path, overlay_path, ai_disease, ai_severity, disease, severity, treatment, syngenta_products, symptoms, causes, prevention, status, admin_suggestion, reviewed_by, reviewed_at, created_at}`

## Backlog
- **P2**: Camera capture feature for mobile users
- **P2**: Backend refactoring (split `server.py` into modular routes)
