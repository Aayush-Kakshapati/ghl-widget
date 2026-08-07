# GHL Announcement Widget Builder

## Development Progress Report & Continuation Context

Date: 2026-08-07

---

# Project Overview

## Goal

Build a production-style GoHighLevel (GHL) Marketplace custom widget builder from scratch.

The target architecture is similar to what a developer would build for selling widgets through the GHL Marketplace.

Current widget:

**Announcement Banner Widget**

Configurable options:

* Announcement message
* Button text
* Button URL
* Background color
* Text color
* Button color
* Show/hide button

---

# Technology Stack

Current stack:

* React
* Vite
* JavaScript
* Zustand
* localStorage (temporary persistence simulation)

Future:

* GHL elementStore integration
* iframe communication
* Postmate communication
* Marketplace-ready widget publishing flow

---

# Learning Objective

The purpose of this project is not only to create a banner.

The purpose is to understand the architecture behind:

* visual widget builders
* state-driven UI systems
* widget generators
* export pipelines
* GHL integrations

---

# Current Folder Structure

```
ghl-announcement-widget/

src/

├── components/
│
│   ├── SettingsPanel.jsx
│   ├── Preview.jsx
│   ├── ColorPicker.jsx
│   │
│   └── widgets/
│       └── AnnouncementBanner.jsx
│
├── store/
│   └── widgetStore.js
│
├── widget/
│   ├── createHtml.js
│   ├── createCss.js
│   ├── createJs.js
│   └── generateWidget.js
│
├── services/
│   ├── widgetService.js
│   └── storageService.js
│
├── communication/
│   └── ghlCommunication.js
│
├── App.jsx
└── main.jsx
```

---

# Architecture Explanation

The project is divided into layers.

```
React UI
    |
    |
    v

Zustand Store

    |
    |
    +----------------+
    |                |
    v                v

Preview        Widget Service

                     |
                     v

              Widget Generator

                     |
                     v

              HTML/CSS/JS Payload

                     |
                     v

          Communication Layer

                     |
                     v

                   GHL
```

---

# Completed Architecture

## 1. React UI Layer

Location:

```
src/components/
```

Responsible for:

* user interaction
* displaying widgets
* collecting configuration

Should NOT handle:

* HTML generation
* persistence
* GHL communication

---

# SettingsPanel.jsx

Purpose:

Widget configuration controls.

Responsibilities:

* text inputs
* button inputs
* color inputs
* checkbox controls

Data flow:

```
User Input

↓

updateSetting()

↓

Zustand Store
```

---

# Preview.jsx

Purpose:

Live widget preview.

Responsibilities:

* read Zustand state
* render React widget

Current flow:

```
Zustand

↓

Preview

↓

AnnouncementBanner.jsx
```

Preview does not generate export HTML.

---

# AnnouncementBanner.jsx

Location:

```
components/widgets/
```

Purpose:

React version of the widget.

Used only for:

* builder preview
* live editing

Not responsible for:

* GHL export
* HTML generation

---

# 2. Zustand Store

Location:

```
src/store/widgetStore.js
```

Purpose:

Single source of truth.

Replaces the old vanilla JS object:

```javascript
const settings = {}
```

Current state model:

```javascript
{
 message:"",
 buttonText:"",
 buttonUrl:"",

 colors:{
    background:"",
    text:"",
    button:""
 },

 showButton:true
}
```

Future equivalent:

```
Zustand Store

≈

GHL elementStore
```

---

# 3. Widget Generator Layer

Location:

```
src/widget/
```

Important:

This folder does NOT know React exists.

It creates exportable widget code.

---

## createHtml.js

Purpose:

Generate HTML string.

Example:

Input:

```javascript
settings
```

Output:

```html
<div class="ghl-announcement-banner">
</div>
```

---

## createCss.js

Purpose:

Generate CSS string.

Uses:

* colors
* spacing
* styles

---

## createJs.js

Purpose:

Generate widget JavaScript.

Currently simple:

```javascript
console.log("Widget Loaded")
```

Future:

* analytics
* animations
* tracking
* API calls

---

## generateWidget.js

Purpose:

Combine all generators.

Expected output:

```javascript
{
 html:"",
 css:"",
 js:"",
 elementStore:{}
}
```

---

# 4. Service Layer

Location:

```
src/services/
```

Purpose:

Coordinate workflows.

---

# widgetService.js

Current design:

```javascript
import { generateWidget } from "../widget/generateWidget";
import { sendToGHL } from "../communication/ghlCommunication";


export function buildWidget(settings){

    return generateWidget(settings);

}


export function publishWidget(settings){

    const widget = buildWidget(settings);

    sendToGHL(widget);

    return widget;

}
```

Responsibilities:

## buildWidget()

Only generates payload.

No side effects.

Flow:

```
settings

↓

generateWidget()

↓

payload
```

---

## publishWidget()

Generates and sends.

Flow:

```
settings

↓

generateWidget()

↓

sendToGHL()
```

---

# 5. Communication Layer

Location:

```
src/communication/
```

Current file:

```
ghlCommunication.js
```

Current implementation:

```javascript
export function sendToGHL(widget){

    console.log("Widget Payload");

    console.log(widget);

}
```

Current behavior:

```
Widget Payload

↓

Console
```

Future:

```
Widget Payload

↓

Postmate

↓

iframe

↓

GoHighLevel
```

---

# 6. Persistence Layer

Location:

```
src/services/storageService.js
```

Purpose:

Temporary replacement for GHL elementStore.

Current idea:

```
Zustand

↓

localStorage
```

Future:

```
Zustand

↓

GHL elementStore
```

---

# Current Data Flow

When user changes a setting:

```
User

↓

SettingsPanel

↓

updateSetting()

↓

Zustand

↓

React rerender

↓

Preview updates
```

---

# Widget Generation Flow

```
Zustand State

↓

buildWidget()

↓

generateWidget()

↓

createHtml()

createCss()

createJs()

↓

Widget Payload
```

---

# Current Issue

## Problem

State is saved in localStorage.

Confirmed:

```
localStorage contains widget object
```

However:

After browser refresh:

```
State resets to default values
```

---

# Debugging Status

Saving works.

Problem is likely:

```
localStorage

↓

loadWidget()

↓

Zustand initialization
```

---

# Things to verify

## widgetStore.js must initialize from storage

Incorrect:

```javascript
settings: defaultSettings
```

Correct:

```javascript
const savedSettings = loadWidget();

settings: savedSettings || defaultSettings
```

---

## storageService.js expected

```javascript
const STORAGE_KEY="announcement-widget";


export function saveWidget(settings){

    localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify(settings)
    );

}


export function loadWidget(){

    const data =
       localStorage.getItem(STORAGE_KEY);


    if(!data){
        return null;
    }


    return JSON.parse(data);

}
```

---

# Next Development Steps

## Step 1

Fix localStorage restoration.

Verify:

```
Refresh browser

↓

Zustand restores saved settings

↓

Preview shows previous state
```

---

# Step 2

Improve elementStore simulation.

Current:

```javascript
elementStore: settings
```

Future:

```javascript
elementStore:{
 id:"",
 type:"",
 version:"",
 settings:{},
 metadata:{}
}
```

---

# Step 3

Create mock GHL lifecycle.

Simulate:

```
GHL loads widget

↓

Send elementStore

↓

Initialize Zustand

↓

Render preview
```

---

# Step 4

Create iframe communication abstraction.

Introduce:

```
postMessage()
```

Then later:

```
Postmate
```

---

# Step 5

Production improvements

Add:

* widget versioning
* undo/redo
* template system
* multiple widgets
* schema validation
* export/download
* authentication
* marketplace publishing flow

---

# Important Architecture Rules

Do not break these principles:

## UI does not generate widgets

React components are for preview only.

---

## Generator does not know React

HTML/CSS/JS generation must stay independent.

---

## Store does not know external systems

Zustand should not know:

* localStorage
* GHL
* APIs

---

## Communication layer owns external communication

Only:

```
communication/
```

knows how to talk externally.

---

# Current Learning Level

Completed:

✅ React + Vite setup
✅ Component architecture
✅ Zustand state management
✅ Live preview system
✅ Widget component separation
✅ Widget HTML/CSS/JS generator concept
✅ Service layer concept
✅ Communication abstraction
✅ Persistence architecture concept

Current milestone:

**Connecting persistence lifecycle with a simulated GHL elementStore architecture**

---
