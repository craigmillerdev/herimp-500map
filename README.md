# herimp-500map

Mixxx: Hercules Impulse 500 mappings

FORKED FROM resetreboot/herimp-500map. Significant consmectic changes to code, some bugfixes, some changes to features for personal preference.

> [!WARNING]
> Use at your own risk.

## Overview

This repository contains custom mappings for the Hercules Impulse 500 (DJControl Impulse 500) controller for Mixxx, the free and open-source DJ software.

## Features Implemented

- **Deck Control**: Full control over 4 virtual decks including:

  - Play/Pause, CUE, and SYNC controls
  - Tempo adjustment with pitch faders
  - Jog wheels for scratching and track seeking
  - Tempo and Beatmatch indicators
  - Touch JogWheel for scratching, shift touch increases the speed
  - Shift-Jog will beatjump_1_forward/backward

- **4 Deck Selection**

  - FX Keys switch between virtual decks
    - FX1/3: Deck 1 and 3 on Deck 1
    - FX2/4: Deck 2 and 4 on Deck 2

- **Loop Controls**:

  - Auto-loop creation with loop encoder
  - Loop length adjustment
  - Loop activation/deactivation
  - LoopIn and LoopOut Adjustments using JogWheels

- **Effects**:

  - Control over effect units using PAD MODE 7
  - Effect adjustment
    - Enable / Disable Effects with Pads 1-3
    - Filter knob will adjust only the enabled effects with soft takeover behaviour
    - Shift Pads 1-3 and 5-7 cycled through the selected effect

- **Slicer**:

  - Slicer functionality available in PAD MODE 3
  - LED feedback shows active slice position

- **Sampler**:

  - Sampler functionality available in PAD MODE 4

- **Browser Navigation**:

  - Library browsing via Library Knob
  - Folder/playlist navigation
  - Track loading via LOAD buttons

## Requirements

- Mixxx 2.3 or newer
- Hercules Impulse 500 controller

## Installation

Instructions for installing these mappings in Mixxx.

1. Download the mapping files from this repository.

2. Copy the downloaded files to Mixxx's controller mapping directory:

- **Windows**: `%USERPROFILE%\Documents\Mixxx\controllers\`
- **macOS**: `~/Library/Application Support/Mixxx/controllers/`
- **Linux**: `~/.mixxx/controllers/`

3. Connect your Hercules Impulse 500 controller to your computer via USB.

4. Launch Mixxx.

5. Open Mixxx Preferences (Ctrl+P or ⌘+,).

6. Go to "Controllers" section.

7. Find "Hercules Impulse 500" in the device list and select the mapping from the dropdown menu.

8. Click "Apply" and then "OK" to save your settings.

9. The controller should now be operational with the custom mapping.

## Troubleshooting

If your controller isn't recognized:

- Ensure it's properly connected and powered on
- Try a different USB port or cable
- Verify that the correct drivers are installed
- Restart Mixxx after connecting the controller
