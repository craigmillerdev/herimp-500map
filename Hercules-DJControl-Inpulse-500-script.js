// DJControl_Inpulse_500_script.js
//
// ***************************************************************************
// * Mixxx mapping script file for the Hercules DJControl Inpulse 500.
// * Authors: Ev3nt1ne, DJ Phatso, resetreboot
// *    contributions by Kerrick Staley, Bentheshrubber, ThatOneRuffian
//
//  Version 1.6c: (August 2023) resetreboot
//  * Requires Mixxx >= 2.3.4
//  * Volume meters follow correctly the selected channel
//  * Use the full 14 bits for knobs for more precission
//  * Add effects to the PAD 7 mode
//  * Create decks for four channel mode
//  * Change the behavior of the FX buttons, use them as Channel selector, using the LEDs
//    as indicators of current channel.
//
//
//  * When enabling multichannel, ensure:
//    - Beat matching guide follows correctly the selected channels
//
//  * Move the sampler buttons to the Deck component as well as the new effect buttons
//  * Made the filter knob have a function with filter, effect and filter + effect
//  * Use the Hotcue component for hotcues
//  * Use components and add for the rest of the controls:
//    - Play
//    - Cue
//    - Sync
//    - Volume fader
//    - EQs
//    - PFL
//    - Pad Selectors
//    - Loop PADs
//    - Roll PADs
//    - Beat jump PADs
//    - Tone key PADs
//    - Slicer
//    - Loop pot
//    - In and Out loop
//    - Load button
//    - Vinyl
//    - Slip
//    - Quant
//    - Pitch fader
//    - Jog wheels (Using the new JogWheelBasic component!
//      - Also probably fixed the shift behavior not working properly
//
//  * Added option so the browser knob can behave with out of focus window
//
// * Version 1.5c (Summer 2023)
// * Forum: https://mixxx.discourse.group/t/hercules-djcontrol-inpulse-500/19739
// * Wiki: https://mixxx.org/wiki/doku.php/hercules_djcontrol_inpulse_500
//
//  Version 1.0c:
//	* Hot Cue: implementation of the Color API (Work in progress)
//		- Assigned color directly to pad (XML)
//	* Added DECK LED number - On when playing
//  * Moved Beatjump to Pad mode 3 (Slicer)
//	* Set different color for upper (Sampler 1-4) and lower (Sampler 5-8) sampler pads
//
//  Version 1.0 - Based upon Inpulse 300 v1.2 (official)
//
// TO DO:
//  * Browser knob has a ton of colors to do things!
//  * Vinyl + SHIFT led should reflect brake status
//  * Quant + SHIFT led should reflect key lock status
//  * Add beat jump + SHIFT jumps
//
// ****************************************************************************

var DJCi500 = {}; // This has to be defined as a var
///////////////////////////////////////////////////////////////
//                       USER OPTIONS                        //
///////////////////////////////////////////////////////////////

// If you are spinning your set list and you have your Mixxx window out
// of focus and you want to be able to use the browser knob to traverse
// the current crate or playlist, set to true. Especially useful to spin
// when using Twitch, VRChat or Second Life
DJCi500.browserOffFocusMode = false;

// Set initial state for vinyl mode button
DJCi500.initialVinylMode = true;

const DJCi500ColorCodes = {
  NoLight: 0x00,
  Blue: 0x03,
  BlueLow: 0x02,
  Green: 0x1c,
  GreenLow: 0x10,
  Cyan: 0x1f,
  CyanLow: 0x12,
  Lime: 0x5c,
  LimeLow: 0x30,
  Red: 0x60,
  RedLow: 0x40,
  Fuchsia: 0x63,
  FuchsiaLow: 0x42,
  Orange: 0x74,
  OrangeLow: 0x4c,
  Yellow: 0x7c,
  YellowLow: 0x50,
  White: 0x7f,
  WhiteLow: 0x52,
};

const StandardColors = {
  Off: 0x000000,
  Blue: 0x0000ff,
  BlueLow: 0x000088,
  Green: 0x00ff00,
  Cyan: 0x00ffff,
  CyanLow: 0x008888,
  Lime: 0x88ff00,
  LimeLow: 0x228800,
  Red: 0xff0000,
  RedLow: 0x880000,
  Fuchsia: 0xff00ff,
  FuchsiaLow: 0xff88ff,
  Orange: 0xff8800,
  OrangeLow: 0x882200,
  Yellow: 0xffff00,
  YellowLow: 0x888800,
  White: 0xffffff,
  WhiteLow: 0x888888,
};

// All Mapped Default Palettes
const MixxxHotCueColors = {
  Red: 0xc50a08,
  Green: 0x32be44,
  Celeste: 0x42d4f4,
  Yellow: 0xf8d200,
  Blue: 0x0044ff,
  Purple: 0xaf00cc,
  Pink: 0xfca6d7,
  White: 0xf2f2ff,
};

// Map MixxColors to DJCi500ColorMap
const DJCi500ColorMap = {
  [MixxxHotCueColors.Red]: DJCi500ColorCodes.Red,
  [MixxxHotCueColors.Green]: DJCi500ColorCodes.Green,
  [MixxxHotCueColors.Celeste]: DJCi500ColorCodes.Cyan,
  [MixxxHotCueColors.Yellow]: DJCi500ColorCodes.Yellow,
  [MixxxHotCueColors.Blue]: DJCi500ColorCodes.Blue,
  [MixxxHotCueColors.Purple]: DJCi500ColorCodes.Fuchsia,
  [MixxxHotCueColors.Pink]: DJCi500ColorCodes.Fuchsia, // Pink isn't a standard DJCi500 color, Fusia is the closest
  [MixxxHotCueColors.White]: DJCi500ColorCodes.White,
  [StandardColors.Off]: DJCi500ColorCodes.NoLight,
  [StandardColors.Blue]: DJCi500ColorCodes.Blue,
  [StandardColors.BlueLow]: DJCi500ColorCodes.BlueLow,
  [StandardColors.Green]: DJCi500ColorCodes.Green,
  [StandardColors.Cyan]: DJCi500ColorCodes.Cyan,
  [StandardColors.CyanLow]: DJCi500ColorCodes.CyanLow,
  [StandardColors.Lime]: DJCi500ColorCodes.Lime,
  [StandardColors.LimeLow]: DJCi500ColorCodes.LimeLow,
  [StandardColors.Red]: DJCi500ColorCodes.Red,
  [StandardColors.RedLow]: DJCi500ColorCodes.RedLow,
  [StandardColors.Fuchsia]: DJCi500ColorCodes.Fuchsia,
  [StandardColors.FuchsiaLow]: DJCi500ColorCodes.FuchsiaLow,
  [StandardColors.Orange]: DJCi500ColorCodes.Orange,
  [StandardColors.OrangeLow]: DJCi500ColorCodes.OrangeLow,
  [StandardColors.Yellow]: DJCi500ColorCodes.Yellow,
  [StandardColors.YellowLow]: DJCi500ColorCodes.YellowLow,
  [StandardColors.White]: DJCi500ColorCodes.White,
  [StandardColors.WhiteLow]: DJCi500ColorCodes.WhiteLow,
};

// Colors
DJCi500.PadColorMapper = new ColorMapper(DJCi500ColorMap);

// Constants
DJCi500.EFFECT_ONLY_MODE = 1;
DJCi500.FILTER_AND_EFFECT_MODE = 2;

const ButtonValues = {
  Off: 0x00,
  On: 0x7f,
};

// For key shift pads and beat jump pads
const pairColorsOn = [
  DJCi500ColorCodes.Cyan,
  DJCi500ColorCodes.Cyan,
  DJCi500ColorCodes.Blue,
  DJCi500ColorCodes.Blue,
  DJCi500ColorCodes.Orange,
  DJCi500ColorCodes.Orange,
  DJCi500ColorCodes.Red,
  DJCi500ColorCodes.Red,
  DJCi500ColorCodes.Green,
  DJCi500ColorCodes.Green,
  DJCi500ColorCodes.Yellow,
  DJCi500ColorCodes.Yellow,
];
const pairColorsOff = [
  DJCi500ColorCodes.CyanLow,
  DJCi500ColorCodes.CyanLow,
  DJCi500ColorCodes.BlueLow,
  DJCi500ColorCodes.BlueLow,
  DJCi500ColorCodes.OrangeLow,
  DJCi500ColorCodes.OrangeLow,
  DJCi500ColorCodes.RedLow,
  DJCi500ColorCodes.RedLow,
  DJCi500ColorCodes.GreenLow,
  DJCi500ColorCodes.GreenLow,
  DJCi500ColorCodes.YellowLow,
  DJCi500ColorCodes.YellowLow,
];

///////////////////////////////////////////////////////////////
//                          SLICER                           //
///////////////////////////////////////////////////////////////
DJCi500.selectedSlicerDomain = [8, 8, 8, 8]; //length of the Slicer domain
//PioneerDDJSX.slicerDomains = [8, 16, 32, 64];

// slicer storage:
DJCi500.slicerBeatsPassed = [0, 0, 0, 0];
DJCi500.slicerPreviousBeatsPassed = [0, 0, 0, 0];
DJCi500.slicerTimer = [false, false, false, false];
//DJCi500.slicerJumping = [0, 0, 0, 0];
DJCi500.slicerActive = [false, false, false, false];
DJCi500.slicerAlreadyJumped = [false, false, false, false];
DJCi500.slicerButton = [-1, -1, -1, -1];
DJCi500.slicerModes = {
  contSlice: 0,
  loopSlice: 1,
};
DJCi500.activeSlicerMode = [
  DJCi500.slicerModes.contSlice,
  DJCi500.slicerModes.contSlice,
  DJCi500.slicerModes.contSlice,
  DJCi500.slicerModes.contSlice,
];
DJCi500.slicerLoopBeat8 = [0, 0, 0, 0];
///////////////////////

// Master VU Meter callbacks
DJCi500.vuMeterUpdateMaster = function (value, _group, control) {
  // Reserve the red led for peak indicator, this will in turn, make
  // the display more similar (I hope) to what Mixxx VU shows
  value = script.absoluteLinInverse(value, 0.0, 1.0, 0, 124);

  const control_bit = control === "vu_meter_left" ? 0x40 : 0x41;
  midi.sendShortMsg(0xb0, control_bit, value);
};

DJCi500.vuMeterPeakLeftMaster = function (value, group, control, status) {
  if (value) {
    midi.sendShortMsg(0x90, 0x0a, 0x7f);
  } else {
    midi.sendShortMsg(0x90, 0x0a, 0x00);
  }
};

DJCi500.vuMeterPeakRightMaster = function (value, group, control, status) {
  if (value) {
    midi.sendShortMsg(0x90, 0x0f, 0x7f);
  } else {
    midi.sendShortMsg(0x90, 0x0f, 0x00);
  }
};

// Deck VU Meter callbacks
DJCi500.vuMeterUpdateDeck = function (value, group, _control, _status) {
  // Reserve the red led for peak indicator, this will in turn, make
  // the display more similar (I hope) to what Mixxx VU shows
  const value_adj = script.absoluteLinInverse(value, 0.0, 1.0, 0, 125);
  if (DJCi500.deckA.currentDeck === group) {
    midi.sendShortMsg(0xb1, 0x40, value_adj);
  } else if (DJCi500.deckB.currentDeck === group) {
    midi.sendShortMsg(0xb2, 0x40, value_adj);
  }
};

DJCi500.vuMeterPeakDeck = function (value, group, _control, _status) {
  let channel = 0x00;
  if (DJCi500.deckA.currentDeck === group) {
    channel = 0x91;
  } else if (DJCi500.deckB.currentDeck === group) {
    channel = 0x92;
  }

  if (channel > 0x00) {
    if (value) {
      midi.sendShortMsg(channel, 0x39, 0x7f);
    } else {
      midi.sendShortMsg(channel, 0x39, 0x00);
    }
  }
};

DJCi500.numberIndicator = function (value, group, _control, _status) {
  if (DJCi500.deckA.currentDeck === group) {
    midi.sendShortMsg(0x91, 0x30, value);
  } else if (DJCi500.deckB.currentDeck === group) {
    midi.sendShortMsg(0x92, 0x30, value);
  }
};

// FX indicators Linked to PAD 7 Button 4 & 8
DJCi500.fxSelIndicator = function (_value, group, _control, _status) {
  var deckA = DJCi500.deckA.currentDeck;
  var deckB = DJCi500.deckB.currentDeck;
  var active = 0;

  if (group === "[EffectRack1_EffectUnit1]") {
    active = engine.getValue(group, "group_" + deckA + "_enable");
    if (active) {
      midi.sendShortMsg(0x96, 0x63, DJCi500ColorCodes.Orange);
    } else {
      midi.sendShortMsg(0x96, 0x63, DJCi500ColorCodes.NoLight);
    }

    active = engine.getValue(group, "group_" + deckB + "_enable");
    if (active) {
      midi.sendShortMsg(0x97, 0x63, DJCi500ColorCodes.Orange);
    } else {
      midi.sendShortMsg(0x97, 0x63, DJCi500ColorCodes.NoLight);
    }
  } else if (group === "[EffectRack1_EffectUnit2]") {
    active = engine.getValue(group, "group_" + deckA + "_enable");
    if (active) {
      midi.sendShortMsg(0x96, 0x67, DJCi500ColorCodes.Orange);
    } else {
      midi.sendShortMsg(0x96, 0x67, DJCi500ColorCodes.NoLight);
    }

    active = engine.getValue(group, "group_" + deckB + "_enable");
    if (active) {
      midi.sendShortMsg(0x97, 0x67, DJCi500ColorCodes.Orange);
    } else {
      midi.sendShortMsg(0x97, 0x67, DJCi500ColorCodes.NoLight);
    }
  }
};

// Filter Kill Switch indicator Linked to PAD MODE 7 / Button 7
DJCi500.fxEnabledIndicator = function (_value, group, _control, _status) {
  var deckA = DJCi500.deckA.currentDeck;
  var deckB = DJCi500.deckB.currentDeck;
  var active = engine.getValue(group, "enabled");

  if (group == "[QuickEffectRack1_" + deckA + "]") {
    midi.sendShortMsg(
      0x96,
      0x66,
      active ? DJCi500ColorCodes.Green : DJCi500ColorCodes.Red
    );
  } else if (group == "[QuickEffectRack1_" + deckB + "]") {
    midi.sendShortMsg(
      0x97,
      0x66,
      active ? DJCi500ColorCodes.Green : DJCi500ColorCodes.Red
    );
  }
};

DJCi500.Deck = function (deckNumbers, midiChannel) {
  components.Deck.call(this, deckNumbers);
  // Allow components to access deck variables
  var deckData = this;

  // For loop and looprolls
  var fractions = ["0.125", "0.25", "0.5", "1", "2", "4", "8", "16"];
  var shiftFractions = [
    "0.03125",
    "0.0625",
    "32",
    "64",
    "128",
    "256",
    "512",
    "512",
  ];

  // For beatjumps
  var jumpValues = ["1", "1", "2", "2", "4", "4", "8", "8"];
  var jumpValuesShift = ["16", "16", "32", "32", "64", "64", "128", "128"];

  // Brake status for this deck
  this.slowPauseSetState = [false, false, false, false];

  // Vinyl button state
  this.vinylButtonState = [
    DJCi500.initialVinylMode,
    DJCi500.initialVinylMode,
    DJCi500.initialVinylMode,
    DJCi500.initialVinylMode,
  ];

  // Pitch ranges and status
  this.pitchRanges = [0.08, 0.1, 0.15, 0.16, 0.24, 0.5, 0.9]; //select pitch range
  this.pitchRangeId = 0; //id of the array, one for each deck

  // Effect section components
  this.effectEnabled = false;

  // Make sure the shift button remaps the shift actions

  this.shiftButton = new components.Button({
    midi: [0x90 + midiChannel, 0x04],
    input: function (_channel, _control, value, _status, _group) {
      if (value === ButtonValues.On) {
        deckData.forEachComponent(function (component) {
          if (component.unshift) {
            component.shift();
          }
        });
      } else {
        deckData.forEachComponent(function (component) {
          if (component.unshift) {
            component.unshift();
          }
        });
      }
    },
  });

  this.loadButton = new components.Button({
    midi: [0x90 + midiChannel, 0x0d],
    shiftOffset: 3,
    shiftControl: false,
    shiftChannel: true,
    sendShifted: true,
    unshift: function () {
      this.inKey = "LoadSelectedTrack";
    },
    shift: function () {
      this.inKey = "eject";
    },
  });

  // Transport section
  // Play button, for some reason the group is not correct on this one?

  this.playButton = new components.PlayButton({
    midi: [0x90 + midiChannel, 0x07],
    shiftOffset: 3,
    shiftControl: false,
    shiftChannel: true,
    sendShifted: true,
    unshift: function () {
      this.input = function (channel, control, value, status, group) {
        if (value === ButtonValues.On) {
          if (engine.getValue(deckData.currentDeck, "play_latched")) {
            //play_indicator play_latched

            var deck = parseInt(deckData.currentDeck.charAt(8));
            if (deckData.slowPauseSetState[deck - 1]) {
              engine.brake(
                deck,
                true, //((status & 0xF0) !=== 0x80 && value > 0),
                54
              );
            } else {
              script.toggleControl(deckData.currentDeck, "play");
            }
          } else {
            script.toggleControl(deckData.currentDeck, "play");
          }
        }
      };
    },
    shift: function () {
      this.input = function (_channel, _control, _value, _status, group) {
        engine.setValue(deckData.currentDeck, "play_stutter", true);
      };
    },
  });

  this.cueButton = new components.CueButton({
    midi: [0x90 + midiChannel, 0x06],
    shiftOffset: 3,
    shiftControl: false,
    shiftChannel: true,
    sendShifted: true,
    shift: function () {
      this.inKey = "start_play";
    },
  });

  this.syncButton = new components.SyncButton({
    midi: [0x90 + midiChannel, 0x05],
    shiftOffset: 3,
    shiftControl: false,
    shiftChannel: true,
    sendShifted: true,
    shift: function () {
      this.inKey = "sync_key";
    },
  });

  this.pflButton = new components.Button({
    midi: [0x90 + midiChannel, 0x0c],

    type: components.Button.prototype.types.toggle,
    key: "pfl",
  });

  // Top controls
  // Vinyl button

  this.vinylButton = new components.Button({
    midi: [0x90 + midiChannel, 0x03],
    shiftOffset: 3,
    shiftControl: false,
    shiftChannel: true,
    sendShifted: true,
    unshift: function () {
      this.input = function (channel, _control, value, status, group) {
        if (value === ButtonValues.On) {
          var deck = parseInt(deckData.currentDeck.charAt(8)) - 1;
          var new_status = !deckData.vinylButtonState[deck];
          deckData.jogWheel.vinylMode = new_status;
          deckData.jogWheelShift.vinylMode = new_status;
          deckData.vinylButtonState[deck] = new_status;
          var new_message = new_status ? 0x7f : 0x00;
          midi.sendShortMsg(this.midi[0], 0x03, new_message);
        }
      };
    },
    shift: function () {
      this.input = function (channel, control, value, status, group) {
        if (value === ButtonValues.On) {
          var deck = parseInt(deckData.currentDeck.charAt(8)) - 1;
          deckData.slowPauseSetState[deck] = !deckData.slowPauseSetState[deck];
        }
      };
    },
  });

  // SLIP mode button

  this.slipButton = new components.Button({
    midi: [0x90 + midiChannel, 0x01],

    type: components.Button.prototype.types.toggle,
    shiftOffset: 3,
    shiftControl: false,
    shiftChannel: true,
    sendShifted: true,
    key: "slip_enabled",
  });

  // Quant button

  this.quantButton = new components.Button({
    midi: [0x90 + midiChannel, 0x02],

    type: components.Button.prototype.types.toggle,
    shiftOffset: 3,
    shiftControl: false,
    shiftChannel: true,
    sendShifted: true,
    outKey: "quantize",
    unshift: function () {
      this.inKey = "quantize";
    },
    shift: function () {
      this.inKey = "keylock";
    },
  });

  // Knobs

  this.volume = new components.Pot({
    midi: [0xb0 + midiChannel, 0x00],
    inKey: "volume",
  });

  this.eqKnob = [];
  for (var k = 1; k <= 3; k++) {
    this.eqKnob[k] = new components.Pot({
      midi: [0xb0 + midiChannel, 0x01 + k],

      group: "[EqualizerRack1_" + this.currentDeck + "_Effect1]",
      inKey: "parameter" + k,
    });
  }

  this.gainKnob = new components.Pot({
    midi: [0xb0 + midiChannel, 0x05],
    key: "pregain",
  });

  // Pitch-tempo fader

  this.pitchFader = new components.Pot({
    midi: [0xb0 + midiChannel, 0x08],
    key: "rate",
  });

  // Jog Wheel
  // TODO: Handle with less repeat the shift key for this

  this.jogWheel = new components.JogWheelBasic({
    midi: [0xb0 + midiChannel, 0x0a],
    deck: midiChannel, // whatever deck this jogwheel controls, in this case we ignore it
    wheelResolution: 720, // how many ticks per revolution the jogwheel has
    alpha: 5 / 6,
    beta: 5 / 6 / 128,
    rpm: 33 + 1 / 3,
    group: "[Channel" + midiChannel + "]",
    inputWheel: function (_channel, _control, value, _status, group) {
      var deck = parseInt(deckData.currentDeck.charAt(8));
      value = this.inValueScale(value);
      if (engine.isScratching(deck)) {
        engine.scratchTick(deck, value);
      } else {
        engine.setValue(group, "jog", value);
      }
    },

    inputTouch: function (channel, control, value, status, group) {
      var deck = parseInt(deckData.currentDeck.charAt(8));
      if (value === ButtonValues.On && deckData.vinylButtonState[deck - 1]) {
        engine.scratchEnable(
          deck,
          this.wheelResolution,
          this.rpm,
          this.alpha,
          this.beta
        );
      } else {
        engine.scratchDisable(deck);
      }
    },
  });

  this.jogWheelShift = new components.JogWheelBasic({
    midi: [0xb3 + midiChannel, 0x0a],
    deck: midiChannel, // whatever deck this jogwheel controls, in this case we ignore it
    wheelResolution: 720, // how many ticks per revolution the jogwheel has
    alpha: 5 / 6,
    beta: 5 / 6 / 128,
    rpm: 33 + 1 / 3,
    group: "[Channel" + midiChannel + "]",
    inputWheel: function (_channel, _control, value, _status, group) {
      var deck = parseInt(deckData.currentDeck.charAt(8));
      value = this.inValueScale(value) * 4;
      if (engine.isScratching(deck)) {
        engine.scratchTick(deck, value);
      } else {
        engine.setValue(group, "jog", value);
      }
    },

    inputTouch: function (channel, control, value, status, group) {
      var deck = parseInt(deckData.currentDeck.charAt(8));
      if (this.isPress(channel, control, value, status) && this.vinylMode) {
        engine.scratchEnable(
          deck,
          this.wheelResolution,
          this.rpm,
          this.alpha,
          this.beta
        );
      } else {
        engine.scratchDisable(deck);
      }
    },
  });

  // Loop controls

  this.loopInButton = new components.Button({
    midi: [0x90 + midiChannel, 0x09],
    shiftOffset: 3,
    shiftControl: false,
    shiftChannel: true,
    sendShifted: true,
    outKey: "loop_enabled", // TODO: Check with loop_in?
    unshift: function () {
      this.inKey = "loop_in";
    },
    shift: function () {
      this.inKey = "loop_in_goto";
    },
  });

  this.loopOutButton = new components.Button({
    midi: [0x90 + midiChannel, 0x0a],
    shiftOffset: 3,
    shiftControl: false,
    shiftChannel: true,
    sendShifted: true,
    outKey: "loop_enabled", // TODO: Check with loop_in?
    unshift: function () {
      this.inKey = "loop_out";
    },
    shift: function () {
      this.inKey = "loop_out_goto";
    },
  });

  // Loop rotary encoder functions
  //
  // Push the rotary encoder

  this.loopEncoderPush = new components.Button({
    midi: [0x90 + midiChannel, 0x2c],
    shiftOffset: 3,
    shiftControl: false,
    shiftChannel: true,
    sendShifted: true,
    unshift: function () {
      this.input = function (channel, control, value, status, group) {
        if (value === ButtonValues.On) {
          const bootloop_size = engine.getValue(group, "beatloop_size");
          engine.setValue(group, `beatloop_${bootloop_size}_toggle`, 1);
        }
      };
    },
    shift: function () {
      // @TODO: Not sure what this should do, reloop_toggle?
      this.input = function (channel, control, value, status, group) {
        if (value === ButtonValues.On) {
          engine.setValue(group, `reloop_toggle`, 1);
        }
      };
    },
  });

  // Loop encoder

  this.loopEncoder = new components.Encoder({
    midi: [0xb0 + midiChannel, 0x0e],
    shiftOffset: 3,
    shiftControl: false,
    shiftChannel: true,
    sendShifted: true,

    input: function (_channel, _control, value, _status, _group) {
      // FIXME: Toggle for loop halve and double??

      var deckGroup = deckData.currentDeck;
      if (value >= 0x40) {
        engine.setValue(deckGroup, "loop_halve", true);
      } else {
        engine.setValue(deckGroup, "loop_double", true);
      }
    },
  });

  // We only check and attach for slicer mode, but we have all
  // pad buttons here if we need something extra!
  this.padSelectButtons = [];
  for (var i = 1; i <= 8; i++) {
    this.padSelectButtons[i] = new components.Button({
      midi: [0x90 + midiChannel, 0x0f + (i - 1)],

      input: function (channel, control, value, status, group) {
        var deck = parseInt(deckData.currentDeck.charAt(8)) - 1;
        if (control === 0x11) {
          DJCi500.slicerActive[deck] = true;
        } else {
          DJCi500.slicerActive[deck] = false;
        }
      },
    });
  }

  // Hotcue buttons (PAD Mode 1)
  this.hotcueButtons = [];
  for (var i = 1; i <= 8; i++) {
    this.hotcueButtons[i] = new components.HotcueButton({
      midi: [0x95 + midiChannel, 0x00 + (i - 1)],
      number: i,
      shiftOffset: 8,
      shiftControl: true,
      sendShifted: true,
      colorMapper: DJCi500.PadColorMapper,
      off: 0x00,
    });
  }

  // Loop buttons (PAD Mode 2)
  this.loopButtons = [];
  for (var i = 1; i <= 8; i++) {
    this.loopButtons[i] = new components.Button({
      midi: [0x95 + midiChannel, 0x10 + (i - 1)],
      number: i,
      shiftControl: false,
      sendShifted: false,
      on: DJCi500ColorCodes.Lime,
      off: DJCi500ColorCodes.LimeLow,
      outKey: "beatloop_" + fractions[i - 1] + "_enabled",
      inKey: "beatloop_" + fractions[i - 1] + "_toggle",
    });
  }

  // A bit repeated code, but I want the leds to react accordingly
  this.loopShiftButtons = [];
  for (var i = 1; i <= 8; i++) {
    this.loopShiftButtons[i] = new components.Button({
      midi: [0x95 + midiChannel, 0x10 + (i - 1) + 8],
      number: i,
      shiftControl: false,
      sendShifted: false,
      on: 0x5c,
      off: 0x30,
      outKey: "beatloop_" + shiftFractions[i - 1] + "_enabled",
      inKey: "beatloop_" + shiftFractions[i - 1] + "_toggle",
    });
  }

  // Slicer buttons (PAD Mode 3)
  this.slicerButtons = [];
  for (var i = 1; i <= 8; i++) {
    this.slicerButtons[i] = new components.Button({
      midi: [0x95 + midiChannel, 0x20 + (i - 1)],
      number: i,
      shiftOffset: 8,
      shiftControl: true,
      sendShifted: true,

      input: function (channel, control, value, status, group) {
        // This is kind of a hack... somehow this is not getting the group correctly!
        DJCi500.slicerButtonFunc(
          channel,
          control,
          value,
          status,

          deckData.currentDeck
        );
      },
    });
  }

  // Sampler buttons (PAD Mode 4)
  this.samplerButtons = [];
  for (var i = 1; i <= 8; i++) {
    this.samplerButtons[i] = new components.SamplerButton({
      midi: [0x95 + midiChannel, 0x30 + (i - 1)],
      number: i,
      shiftOffset: 8,
      shiftControl: true,
      sendShifted: true,
      loaded: 0x42,
      empty: 0x00,
      playing: 0x63,
      looping: 0x74,
    });
  }

  // Pitch buttons (PAD Mode 5)

  this.pitchDownTone = new components.Button({
    midi: [0x95 + midiChannel, 0x40],
    on: pairColorsOn[0],
    off: pairColorsOff[0],

    input: function (channel, control, value, status, group) {
      if (value === ButtonValues.On) {
        engine.setValue(group, "pitch_down", 1);
        engine.setValue(group, "pitch_down", 1);
        midi.sendShortMsg(status, control, this.on);
      } else {
        midi.sendShortMsg(status, control, this.off);
      }
    },
  });

  this.pitchDownSemiTone = new components.Button({
    midi: [0x95 + midiChannel, 0x41],
    on: pairColorsOn[1],
    off: pairColorsOff[1],

    input: function (channel, control, value, status, group) {
      if (value === ButtonValues.On) {
        engine.setValue(group, "pitch_down", 1);
        midi.sendShortMsg(status, control, this.on);
      } else {
        midi.sendShortMsg(status, control, this.off);
      }
    },
  });

  this.pitchUpSemiTone = new components.Button({
    midi: [0x95 + midiChannel, 0x42],
    on: pairColorsOn[6],
    off: pairColorsOff[6],

    input: function (channel, control, value, status, group) {
      if (value === ButtonValues.On) {
        engine.setValue(group, "pitch_up", 1);
        midi.sendShortMsg(status, control, this.on);
      } else {
        midi.sendShortMsg(status, control, this.off);
      }
    },
  });

  this.pitchUpTone = new components.Button({
    midi: [0x95 + midiChannel, 0x43],
    on: pairColorsOn[6],
    off: pairColorsOff[6],

    input: function (channel, control, value, status, group) {
      if (value === ButtonValues.On) {
        engine.setValue(group, "pitch_up", 1);
        engine.setValue(group, "pitch_up", 1);
        midi.sendShortMsg(status, control, this.on);
      } else {
        midi.sendShortMsg(status, control, this.off);
      }
    },
  });

  this.pitchSliderIncrease = new components.Button({
    midi: [0x95 + midiChannel, 0x46],
    on: 0x63,
    off: 0x42,

    input: function (channel, control, value, status, group) {
      if (value === ButtonValues.On) {
        deckData.pitchRangeId++;
        if (deckData.pitchRangeId > 6) {
          deckData.pitchRangeId = 6;
        }
        engine.setValue(
          group,
          "rateRange",
          deckData.pitchRanges[deckData.pitchRangeId]
        );
        midi.sendShortMsg(status, control, this.on); //17 -- 3B
      } else {
        midi.sendShortMsg(status, control, this.off); //3B -- 33
      }
    },
  });

  this.pitchSliderDecrease = new components.Button({
    midi: [0x95 + midiChannel, 0x45],
    on: pairColorsOn[3],
    off: pairColorsOff[3],

    input: function (channel, control, value, status, group) {
      if (value === ButtonValues.On) {
        deckData.pitchRangeId = deckData.pitchRangeId - 1;
        if (deckData.pitchRangeId < 0) {
          deckData.pitchRangeId = 0;
        }
        engine.setValue(
          group,
          "rateRange",
          deckData.pitchRanges[deckData.pitchRangeId]
        );
        midi.sendShortMsg(status, control, this.on); //17 -- 3B
      } else {
        midi.sendShortMsg(status, control, this.off); //3B -- 33
      }
    },
  });

  this.pitchSliderReset = new components.Button({
    midi: [0x95 + midiChannel, 0x44],
    on: pairColorsOn[6],
    off: pairColorsOff[6],

    input: function (channel, control, value, status, group) {
      if (value === ButtonValues.On) {
        deckData.pitchRangeId = 0;
        engine.setValue(
          group,
          "rateRange",
          deckData.pitchRanges[deckData.pitchRangeId]
        );
        midi.sendShortMsg(status, control, this.on); //17 -- 3B
      } else {
        midi.sendShortMsg(status, control, this.off); //3B -- 33
      }
    },
  });

  // Beatloop rolls buttons (PAD Mode 6)
  this.rollButtons = [];
  for (var i = 1; i <= 8; i++) {
    this.rollButtons[i] = new components.Button({
      midi: [0x95 + midiChannel, 0x50 + (i - 1)],
      number: i,
      shiftOffset: 8,
      shiftControl: true,
      sendShifted: true,
      on: 0x1f,
      off: 0x12,
      key: "beatlooproll_" + fractions[i - 1] + "_activate",
    });
  }

  // Effect buttons (PAD Mode 7)
  this.effectButtons = [];
  const shiftedEffectPads = function (i, direction) {
    return function () {
      // Shift button will change the effect to the next in the list
      this.input = function (channel, control, value, status, group) {
        group = "[EffectRack1_EffectUnit" + midiChannel + "_Effect" + i + "]";
        if (value === ButtonValues.On) {
          engine.setValue(group, "effect_selector", direction);
        }
      };
    };
  };

  const chainPresetSelector = (direction) => {
    return function () {
      this.input = function (channel, control, value, status, group) {
        if (value === ButtonValues.On) {
          engine.setValue(this.group, "chain_preset_selector", direction);
          midi.sendShortMsg(status, control, this.on); //17 -- 3B
        } else {
          midi.sendShortMsg(status, control, this.off); //3B -- 33
        }
      };
    };
  };

  const toggleOperation = function () {
    // Normal effect button operation, toggling the effect assigned to it
    this.input = function (channel, control, value, status, group) {
      if (value === ButtonValues.On) {
        script.toggleControl(this.group, "enabled");
      }
    };
  };

  for (var i = 1; i <= 3; i++) {
    // First top row effects buttons, just the effect, disable HPF/LPF knob
    this.effectButtons[i] = new components.Button({
      midi: [0x95 + midiChannel, 0x60 + (i - 1)],
      number: i,
      shiftOffset: 8,
      shiftControl: true,
      sendShifted: true,
      group: "[EffectRack1_EffectUnit" + midiChannel + "_Effect" + i + "]",
      outKey: "enabled",
      output: function (value, group, control) {
        if (value) {
          this.send(DJCi500ColorCodes.Green);
        } else {
          this.send(DJCi500ColorCodes.Yellow);
        }
      },
      unshift: toggleOperation,
      shift: shiftedEffectPads(i, +1),
    });
  }

  // Effect chain selectors
  this.effectButtons[5] = new components.Button({
    midi: [0x95 + midiChannel, 0x64],
    number: 5,
    shiftOffset: 8,
    shiftControl: true,
    sendShifted: true,
    group: "[QuickEffectRack1_[Channel" + midiChannel + "]]",
    on: DJCi500ColorCodes.Orange,
    off: DJCi500ColorCodes.OrangeLow,
    shift: shiftedEffectPads(1, -1),
    unshift: chainPresetSelector(-1),
  });

  this.effectButtons[6] = new components.Button({
    midi: [0x95 + midiChannel, 0x65],
    number: 6,
    shiftOffset: 8,
    shiftControl: true,
    sendShifted: true,
    group: "[QuickEffectRack1_[Channel" + midiChannel + "]]",
    on: DJCi500ColorCodes.Orange,
    off: DJCi500ColorCodes.OrangeLow,
    shift: shiftedEffectPads(2, -1),
    unshift: chainPresetSelector(1),
  });

  // Filter kill switch
  this.effectButtons[7] = new components.Button({
    midi: [0x95 + midiChannel, 0x66],
    number: 7,
    shiftOffset: 8,
    shiftControl: true,
    sendShifted: true,
    group: "[QuickEffectRack1_[Channel" + midiChannel + "]]",
    shift: shiftedEffectPads(3, -1),
    unshift: toggleOperation,
  });

  // Set the current channel FX route with the two extra PADs

  this.effectButtons[4] = new components.Button({
    midi: [0x95 + midiChannel, 0x63],
    number: 4,
    shiftOffset: 8,
    shiftControl: true,
    sendShifted: true,
    group: "[EffectRack1_EffectUnit1]",
    input: function (channel, _control, value, _status, group) {
      if (value === ButtonValues.On) {
        const deckGroup = deckData.currentDeck;
        script.toggleControl(this.group, "group_" + deckGroup + "_enable");
      }
    },
  });

  this.effectButtons[8] = new components.Button({
    midi: [0x95 + midiChannel, 0x67],
    number: 8,
    shiftOffset: 8,
    shiftControl: true,
    sendShifted: false,
    group: "[EffectRack1_EffectUnit2]",
    input: function (_channel, _control, value, _status, _group) {
      if (value === ButtonValues.On) {
        const deckGroup = deckData.currentDeck;
        script.toggleControl(this.group, "group_" + deckGroup + "_enable");
      }
    },
  });

  // Filter knob is here since it is affected by effects pads

  this.filterKnob = new components.Pot({
    midi: [0xb0 + midiChannel, 0x01],
    number: midiChannel,
    group: "[QuickEffectRack1_[Channel" + midiChannel + "]]",

    input: function (channel, control, value, status, group) {
      if (DJCi500.updateEffectStatus(midiChannel, deckData.currentDeck)) {
        // Move the effects knobs
        engine.setValue(
          "[EffectRack1_EffectUnit" + this.number + "]",
          "super1",
          Math.abs(script.absoluteNonLin(value, 0.0, 0.5, 1.0, 0, 127) - 0.5) *
            2
        );
      } else {
        // Move the filter knob
        engine.setValue(
          "[QuickEffectRack1_" + deckData.currentDeck + "]",
          "super1",
          script.absoluteNonLin(value, 0.0, 0.5, 1.0, 0, 127)
        );
      }
    },
  });

  // Beat jump (PAD Mode 8)
  this.beatJumpButtons = [];
  for (var i = 1; i <= 8; i++) {
    const movement = i % 2 === 0 ? "_forward" : "_backward";
    const jmpVal = jumpValues[i - 1];
    const jmpValShft = jumpValuesShift[i - 1];

    this.beatJumpButtons[i] = new components.Button({
      midi: [0x95 + midiChannel, 0x70 + (i - 1)],
      number: i,
      shiftOffset: 8,
      shiftControl: true,
      sendShifted: true,
      on: pairColorsOff[i - 1], // Intentionally inverted
      off: pairColorsOn[i - 1],
      jump: `beatjump_${jmpVal}${movement}`,
      jumpShift: `beatjump_${jmpValShft}${movement}`,
      unshift: function () {
        this.input = function (_channel, control, value, status, _group) {
          if (value === ButtonValues.On) {
            engine.setValue(deckData.currentDeck, this.jump, true);
            midi.sendShortMsg(status, control, this.on);
          } else {
            midi.sendShortMsg(status, control, this.off);
          }
        };
      },
      shift: function () {
        this.input = function (_channel, control, value, status, _group) {
          if (value === ButtonValues.On) {
            engine.setValue(deckData.currentDeck, this.jumpShift, true);
            midi.sendShortMsg(status, control, this.on);
          } else {
            midi.sendShortMsg(status, control, this.off);
          }
        };
      },
    });
  }

  // As per Mixxx wiki, set the group properties

  this.reconnectComponents(function (c) {
    if (c.group === undefined) {
      c.group = this.currentDeck;
    }
  });
};

// Give the custom Deck all the methods of the generic deck
DJCi500.Deck.prototype = new components.Deck();

// INIT for the controller and decks
DJCi500.init = function (id, debugging) {
  DJCi500.AutoHotcueColors = true;

  // Take care of the status of the crossfader status
  DJCi500.crossfaderEnabled = true;
  DJCi500.xFaderScratch = false;

  // Setup Vinyl buttons LED(one for each deck).
  midi.sendShortMsg(0x91, 0x03, DJCi500.initialVinylMode ? 0x7f : 0x00);
  midi.sendShortMsg(0x92, 0x03, DJCi500.initialVinylMode ? 0x7f : 0x00);

  //Turn On Browser button LED
  midi.sendShortMsg(0x90, 0x05, 0x10);

  // Connect the VUMeters
  engine.makeConnection("[Channel1]", "vu_meter", DJCi500.vuMeterUpdateDeck);
  engine.makeConnection("[Channel2]", "vu_meter", DJCi500.vuMeterUpdateDeck);
  engine.makeConnection("[Channel3]", "vu_meter", DJCi500.vuMeterUpdateDeck);
  engine.makeConnection("[Channel4]", "vu_meter", DJCi500.vuMeterUpdateDeck);

  // Deck VU meters peak indicators
  engine.makeConnection(
    "[Channel1]",
    "peak_indicator",
    DJCi500.vuMeterPeakDeck
  );
  engine.makeConnection(
    "[Channel2]",
    "peak_indicator",
    DJCi500.vuMeterPeakDeck
  );
  engine.makeConnection(
    "[Channel3]",
    "peak_indicator",
    DJCi500.vuMeterPeakDeck
  );
  engine.makeConnection(
    "[Channel4]",
    "peak_indicator",
    DJCi500.vuMeterPeakDeck
  );

  // Connect number leds
  engine.makeConnection(
    "[Channel1]",
    "play_indicator",
    DJCi500.numberIndicator
  );

  engine.makeConnection(
    "[Channel2]",
    "play_indicator",
    DJCi500.numberIndicator
  );

  engine.makeConnection(
    "[Channel3]",
    "play_indicator",
    DJCi500.numberIndicator
  );

  engine.makeConnection(
    "[Channel4]",
    "play_indicator",
    DJCi500.numberIndicator
  );

  // Connect Master VU meter
  engine.makeConnection("[Main]", "vu_meter_left", DJCi500.vuMeterUpdateMaster);
  engine.makeConnection(
    "[Main]",
    "vu_meter_right",
    DJCi500.vuMeterUpdateMaster
  );
  engine.makeConnection(
    "[Main]",
    "peak_indicator_left",
    DJCi500.vuMeterPeakLeftMaster
  );
  engine.makeConnection(
    "[Main]",
    "peak_indicator_right",
    DJCi500.vuMeterPeakRightMaster
  );

  // Connect the FX selection leds
  engine.makeConnection(
    "[EffectRack1_EffectUnit1]",
    "group_[Channel1]_enable",
    DJCi500.fxSelIndicator
  );
  engine.makeConnection(
    "[EffectRack1_EffectUnit2]",
    "group_[Channel1]_enable",
    DJCi500.fxSelIndicator
  );
  engine.makeConnection(
    "[EffectRack1_EffectUnit1]",
    "group_[Channel2]_enable",
    DJCi500.fxSelIndicator
  );
  engine.makeConnection(
    "[EffectRack1_EffectUnit2]",
    "group_[Channel2]_enable",
    DJCi500.fxSelIndicator
  );
  engine.makeConnection(
    "[EffectRack1_EffectUnit1]",
    "group_[Channel3]_enable",
    DJCi500.fxSelIndicator
  );
  engine.makeConnection(
    "[EffectRack1_EffectUnit2]",
    "group_[Channel3]_enable",
    DJCi500.fxSelIndicator
  );
  engine.makeConnection(
    "[EffectRack1_EffectUnit1]",
    "group_[Channel4]_enable",
    DJCi500.fxSelIndicator
  );
  engine.makeConnection(
    "[EffectRack1_EffectUnit2]",
    "group_[Channel4]_enable",
    DJCi500.fxSelIndicator
  );

  engine.makeConnection(
    "[QuickEffectRack1_[Channel1]]",
    "enabled",
    DJCi500.fxEnabledIndicator
  );
  engine.makeConnection(
    "[QuickEffectRack1_[Channel2]]",
    "enabled",
    DJCi500.fxEnabledIndicator
  );
  engine.makeConnection(
    "[QuickEffectRack1_[Channel3]]",
    "enabled",
    DJCi500.fxEnabledIndicator
  );
  engine.makeConnection(
    "[QuickEffectRack1_[Channel4]]",
    "enabled",
    DJCi500.fxEnabledIndicator
  );

  // Connect the slicer beats
  DJCi500.slicerBeat1 = engine.makeConnection(
    "[Channel1]",
    "beat_active",
    DJCi500.slicerBeatActive
  );
  DJCi500.slicerBeat2 = engine.makeConnection(
    "[Channel2]",
    "beat_active",
    DJCi500.slicerBeatActive
  );
  //var controlsToFunctions = {'beat_active': 'DJCi500.slicerBeatActive'};
  //script.bindConnections('[Channel1]', controlsToFunctions, true);

  // Ask the controller to send all current knob/slider values over MIDI, which will update
  // the corresponding GUI controls in MIXXX.
  midi.sendShortMsg(0xb0, 0x7f, 0x7f);

  // Turn on lights:
  for (var i = 0; i < 2; i++) {
    // PAD 5 Key and tempo range controls
    midi.sendShortMsg(0x96 + i, 0x40, DJCi500ColorCodes.CyanLow);
    midi.sendShortMsg(0x96 + i, 0x41, DJCi500ColorCodes.CyanLow);
    midi.sendShortMsg(0x96 + i, 0x42, DJCi500ColorCodes.RedLow);
    midi.sendShortMsg(0x96 + i, 0x43, DJCi500ColorCodes.RedLow);
    midi.sendShortMsg(0x96 + i, 0x44, DJCi500ColorCodes.RedLow);
    midi.sendShortMsg(0x96 + i, 0x45, DJCi500ColorCodes.BlueLow);
    midi.sendShortMsg(0x96 + i, 0x46, DJCi500ColorCodes.FuchsiaLow);

    // PAD 8 Beatjump LEDs
    for (var j = 0; j < 8; j++) {
      // Normal
      midi.sendShortMsg(0x96 + i, 0x70 + j, pairColorsOn[j]);
      // And Shifted
      midi.sendShortMsg(0x96 + i, 0x78 + j, pairColorsOn[j]);
    }

    // Light up FX quick effect chain selector buttons
    midi.sendShortMsg(0x96 + i, 0x64, DJCi500ColorCodes.WhiteLow);
    midi.sendShortMsg(0x96 + i, 0x65, DJCi500ColorCodes.WhiteLow);
  }

  DJCi500.tempoTimer = engine.beginTimer(250, DJCi500.tempoLEDs);

  // FX buttons, light them to signal the current deck 1 and 2 as active
  midi.sendShortMsg(0x90, 0x14, 0x7f);
  midi.sendShortMsg(0x90, 0x15, 0x7f);

  // Create the deck objects
  DJCi500.deckA = new DJCi500.Deck([1, 3], 1);
  DJCi500.deckB = new DJCi500.Deck([2, 4], 2);
  DJCi500.deckA.setCurrentDeck("[Channel1]");
  DJCi500.deckB.setCurrentDeck("[Channel2]");

  // Update the fx rack selection
  DJCi500.fxSelIndicator(0, "[EffectRack1_EffectUnit1]", 0, 0);
  DJCi500.fxSelIndicator(0, "[EffectRack1_EffectUnit2]", 0, 0);

  DJCi500.fxEnabledIndicator(0, "[QuickEffectRack1_[Channel1]]", 0, 0);
  DJCi500.fxEnabledIndicator(0, "[QuickEffectRack1_[Channel2]]", 0, 0);
};

// Crossfader control, set the curve
DJCi500.crossfaderSetCurve = function (
  channel,
  control,
  value,
  _status,
  _group
) {
  switch (value) {
    case 0x00:
      // Mix
      script.crossfaderCurve(0, 0, 127);
      DJCi500.xFaderScratch = false;
      break;
    case 0x7f:
      // Scratch
      script.crossfaderCurve(127, 0, 127);
      DJCi500.xFaderScratch = true;
      break;
  }
};

// Crossfader enable or disable
DJCi500.crossfaderEnable = function (channel, control, value, _status, _group) {
  if (value) {
    DJCi500.crossfaderEnabled = true;
  } else {
    DJCi500.crossfaderEnabled = false;
    engine.setValue("[Master]", "crossfader", 0); // Set the crossfader in the middle
  }
};

// Crossfader function
DJCi500.crossfader = function (channel, control, value, status, group) {
  if (DJCi500.crossfaderEnabled) {
    // Eventine's crossfader scratch mode
    if (DJCi500.xFaderScratch) {
      var result = 0;
      if (value <= 0) {
        result = -1;
      } else if (value >= 127) {
        result = 1;
      } else {
        result = Math.tan(((value - 64) * Math.PI) / 2 / 63) / 32;
      }
      engine.setValue(group, "crossfader", result);
    } else {
      engine.setValue(group, "crossfader", value / 64 - 1);
    }
  }
};

// Browser button. We move it to a custom JS function to avoid having to focus the Mixxx window for it to respond
DJCi500.moveLibrary = function (channel, control, value, status, group) {
  if (value > 0x3f) {
    if (DJCi500.browserOffFocusMode) {
      engine.setValue("[Playlist]", "SelectTrackKnob", -1);
    } else {
      engine.setValue("[Library]", "MoveUp", 1);
    }
  } else {
    if (DJCi500.browserOffFocusMode) {
      engine.setValue("[Playlist]", "SelectTrackKnob", 1);
    } else {
      engine.setValue("[Library]", "MoveDown", 1);
    }
  }
};

DJCi500.spinback_button = function (channel, control, value, status, group) {
  var deck = parseInt(group.substring(8, 9)); // work out which deck we are using
  engine.spinback(deck, value > 0, 2.5); // use default starting rate of -10 but decrease speed more quickly
};

// Update the Tempo and phase sync leds
DJCi500.tempoLEDs = function () {
  // Current active decks
  const deckA = DJCi500.deckA.currentDeck;
  const deckB = DJCi500.deckB.currentDeck;

  //Tempo:
  const tempo1 = engine.getValue(deckA, "bpm");
  const tempo2 = engine.getValue(deckB, "bpm");
  var diff = tempo1 - tempo2;

  //Check double tempo:
  var doubleTempo = 0;
  if (diff > 0) {
    if (tempo1 / tempo2 > 1.5) {
      doubleTempo = 1;
      diff = tempo1 / 2 - tempo2;
    }
  } else {
    if (tempo2 / tempo1 > 1.5) {
      doubleTempo = 1;
      diff = tempo1 - tempo2 / 2;
    }
  }

  if (diff < -0.25) {
    //Deck1
    midi.sendShortMsg(0x91, 0x1e, 0x0);
    midi.sendShortMsg(0x91, 0x1f, 0x7f);
    midi.sendShortMsg(0x91, 0x2c, 0x0);
    //Deck2
    midi.sendShortMsg(0x92, 0x1f, 0x0);
    midi.sendShortMsg(0x92, 0x1e, 0x7f);
    midi.sendShortMsg(0x92, 0x2c, 0x0);

    //clear beatalign leds
    //Deck1
    midi.sendShortMsg(0x91, 0x1c, 0x0);
    midi.sendShortMsg(0x91, 0x1d, 0x0);
    midi.sendShortMsg(0x91, 0x2d, 0x0);
    //Deck2
    midi.sendShortMsg(0x92, 0x1c, 0x0);
    midi.sendShortMsg(0x92, 0x1d, 0x0);
    midi.sendShortMsg(0x92, 0x2d, 0x0);
  } else if (diff > 0.25) {
    //Deck1
    midi.sendShortMsg(0x91, 0x1f, 0x0);
    midi.sendShortMsg(0x91, 0x1e, 0x7f);
    midi.sendShortMsg(0x91, 0x2c, 0x0);
    //Deck2
    midi.sendShortMsg(0x92, 0x1e, 0x0);
    midi.sendShortMsg(0x92, 0x1f, 0x7f);
    midi.sendShortMsg(0x92, 0x2c, 0x0);

    //clear beatalign leds
    //Deck1
    midi.sendShortMsg(0x91, 0x1c, 0x0);
    midi.sendShortMsg(0x91, 0x1d, 0x0);
    midi.sendShortMsg(0x91, 0x2d, 0x0);
    //Deck2
    midi.sendShortMsg(0x92, 0x1c, 0x0);
    midi.sendShortMsg(0x92, 0x1d, 0x0);
    midi.sendShortMsg(0x92, 0x2d, 0x0);
  } else {
    //Deck1
    midi.sendShortMsg(0x91, 0x1e, 0x0);
    midi.sendShortMsg(0x91, 0x1f, 0x0);
    midi.sendShortMsg(0x91, 0x2c, 0x7f);
    //Deck2
    midi.sendShortMsg(0x92, 0x1e, 0x0);
    midi.sendShortMsg(0x92, 0x1f, 0x0);
    midi.sendShortMsg(0x92, 0x2c, 0x7f);

    //Do beat alignement only if the tracks are already on Tempo
    // and only if they are playing
    if (
      engine.getValue(deckA, "play_latched") &&
      engine.getValue(deckB, "play_latched")
    ) {
      let beat1 = engine.getValue(deckA, "beat_distance");
      let beat2 = engine.getValue(deckB, "beat_distance");
      if (doubleTempo) {
        if (tempo1 > tempo2) {
          if (beat2 > 0.5) {
            beat2 -= 0.5;
          }
          beat2 *= 2;
        } else {
          //tempo2 >(=) tempo1
          if (beat1 > 0.5) {
            beat1 -= 0.5;
          }
          beat1 *= 2;
        }
      }
      diff = beat1 - beat2;
      if (diff < 0) {
        diff = 1 + diff;
      }
      if (diff < 0.02 || diff > 1 - 0.02) {
        //Deck1
        midi.sendShortMsg(0x91, 0x1c, 0x0);
        midi.sendShortMsg(0x91, 0x1d, 0x0);
        midi.sendShortMsg(0x91, 0x2d, 0x7f);
        //Deck2
        midi.sendShortMsg(0x92, 0x1c, 0x0);
        midi.sendShortMsg(0x92, 0x1d, 0x0);
        midi.sendShortMsg(0x92, 0x2d, 0x7f);
      } else if (diff < 0.5) {
        //Deck1
        midi.sendShortMsg(0x91, 0x1c, 0x0);
        midi.sendShortMsg(0x91, 0x1d, 0x7f);
        midi.sendShortMsg(0x91, 0x2d, 0x0);
        //Deck2
        midi.sendShortMsg(0x92, 0x1d, 0x0);
        midi.sendShortMsg(0x92, 0x1c, 0x7f);
        midi.sendShortMsg(0x91, 0x2d, 0x0);
      } else {
        //Deck1
        midi.sendShortMsg(0x91, 0x1d, 0x0);
        midi.sendShortMsg(0x91, 0x1c, 0x7f);
        midi.sendShortMsg(0x91, 0x2d, 0x0);
        //Deck2
        midi.sendShortMsg(0x92, 0x1c, 0x0);
        midi.sendShortMsg(0x92, 0x1d, 0x7f);
        midi.sendShortMsg(0x92, 0x2d, 0x0);
      }
    } //if playing
    else {
      //Deck1
      midi.sendShortMsg(0x91, 0x1c, 0x0);
      midi.sendShortMsg(0x91, 0x1d, 0x0);
      midi.sendShortMsg(0x91, 0x2d, 0x0);
      //Deck2
      midi.sendShortMsg(0x92, 0x1c, 0x0);
      midi.sendShortMsg(0x92, 0x1d, 0x0);
      midi.sendShortMsg(0x92, 0x2d, 0x0);
    }
  } //else tempo
};

// After a channel change, make sure we read the current status
DJCi500.updateDeckStatus = function (group) {
  const playing = engine.getValue(group, "play_indicator");
  const volume = script.absoluteLinInverse(
    engine.getValue(group, "vu_meter"),
    0.0,
    1.0,
    0,
    127
  );

  // Update the vinyl button
  let vinylState = false;
  const deckIndex = parseInt(group.charAt(8)) - 1;
  const channel = group === "[Channel1]" || group === "[Channel3]" ? 1 : 2;
  if (channel === 1) {
    vinylState = DJCi500.deckA.vinylButtonState[deckIndex];
  } else {
    vinylState = DJCi500.deckB.vinylButtonState[deckIndex];
  }
  midi.sendShortMsg(0x90 + channel, 0x03, vinylState ? 0x7f : 0x00);
  midi.sendShortMsg(0xb0 + channel, 0x40, volume);
  midi.sendShortMsg(0x90 + channel, 0x30, playing ? 0x7f : 0x00);

  // Update the fx rack selection
  DJCi500.fxSelIndicator(0, "[EffectRack1_EffectUnit1]", 0, 0);
  DJCi500.fxSelIndicator(0, "[EffectRack1_EffectUnit2]", 0, 0);

  DJCi500.fxEnabledIndicator(0, "[QuickEffectRack1_" + group + "]", 0, 0);

  // Slicer
  switch (group) {
    case "[Channel1]":
      DJCi500.slicerBeat1.disconnect();
      DJCi500.slicerBeat1 = engine.makeConnection(
        "[Channel1]",
        "beat_active",
        DJCi500.slicerBeatActive
      );
      DJCi500.slicerBeat1.trigger();
      break;
    case "[Channel2]":
      DJCi500.slicerBeat2.disconnect();
      DJCi500.slicerBeat2 = engine.makeConnection(
        "[Channel2]",
        "beat_active",
        DJCi500.slicerBeatActive
      );
      DJCi500.slicerBeat2.trigger();
      break;
    case "[Channel3]":
      DJCi500.slicerBeat1.disconnect();
      DJCi500.slicerBeat1 = engine.makeConnection(
        "[Channel3]",
        "beat_active",
        DJCi500.slicerBeatActive
      );
      DJCi500.slicerBeat1.trigger();
      break;
    case "[Channel4]":
      DJCi500.slicerBeat2.disconnect();
      DJCi500.slicerBeat2 = engine.makeConnection(
        "[Channel4]",
        "beat_active",
        DJCi500.slicerBeatActive
      );
      DJCi500.slicerBeat2.trigger();
      break;
  }
};

// This is where we choose the channel using the FX buttons and light them
// up correctly
DJCi500.deckSelector = function (channel, control, value, status, group) {
  if (value === ButtonValues.On) {
    const deckChosen = control - 0x13; // FX1 is 0x14, so this will yield the number
    switch (deckChosen) {
      case 1:
        DJCi500.deckA.setCurrentDeck("[Channel1]");
        DJCi500.updateDeckStatus("[Channel1]");
        midi.sendShortMsg(0x90, 0x14, 0x7f);
        midi.sendShortMsg(0x90, 0x16, 0x00);
        break;
      case 2:
        DJCi500.deckB.setCurrentDeck("[Channel2]");
        DJCi500.updateDeckStatus("[Channel2]");
        midi.sendShortMsg(0x90, 0x15, 0x7f);
        midi.sendShortMsg(0x90, 0x17, 0x00);
        break;
      case 3:
        DJCi500.deckA.setCurrentDeck("[Channel3]");
        DJCi500.updateDeckStatus("[Channel3]");
        midi.sendShortMsg(0x90, 0x14, 0x00);
        midi.sendShortMsg(0x90, 0x16, 0x7f);
        break;
      case 4:
        DJCi500.deckB.setCurrentDeck("[Channel4]");
        DJCi500.updateDeckStatus("[Channel4]");
        midi.sendShortMsg(0x90, 0x15, 0x00);
        midi.sendShortMsg(0x90, 0x17, 0x7f);
        break;
    }
  }
};

DJCi500.updateEffectStatus = function (midiChannel, _channel) {
  let status = false;
  for (let i = 1; i <= 3; i++) {
    status =
      status ||
      engine.getValue(
        `[EffectRack1_EffectUnit${midiChannel}_Effect${i}]`,
        "enabled"
      );
  }
  return status;
  // return engine.getValue("[EffectRack1_EffectUnit" + midiChannel + "]", "group_[Channel" + channel + "]_enable");
};

///////////////////////////////////////////////////////////////
//                          SLICER                           //
///////////////////////////////////////////////////////////////
DJCi500.slicerButtonFunc = function (channel, control, value, status, group) {
  const index = control - 0x20;
  const deck = script.deckFromGroup(group) - 1;
  const domain = DJCi500.selectedSlicerDomain[deck];
  const passedTime = engine.getValue(group, "beat_distance");
  const loopEnabled = engine.getValue(group, "loop_enabled");

  let beatsToJump = 0;

  if (value) {
    DJCi500.slicerButton[deck] = index;
    // Maybe I need to update this (seems sometimes it does not work.)
    // DJCi500.slicerBeatsPassed[deck] = Math.floor((playposition * duration) * (bpm / 60.0));
    beatsToJump =
      index * (domain / 8) - (DJCi500.slicerBeatsPassed[deck] % domain);
    beatsToJump -= passedTime;

    // activate the one-shot timer for the slip end.
    if (!DJCi500.slicerTimer[deck]) {
      DJCi500.slicerTimer[deck] = true;
      let timerMs =
        (((1 - passedTime) * 60.0) / engine.getValue(group, "bpm")) * 1000;

      // quality of life fix for not-precise hands or beatgrid
      // also good fix for really small timerMs values.
      if (
        passedTime >= 0.8 &&
        //this is because while looping doing this thing on beat 8 break the flow.
        (!loopEnabled ||
          DJCi500.slicerBeatsPassed[deck] % domain !== domain - 1)
      ) {
        timerMs += (60.0 / engine.getValue(group, "bpm")) * 1000;
      }

      engine.beginTimer(
        timerMs,
        // "DJCi500.slicerTimerCallback("+group+")", true);
        function () {
          // need to do this otherwise loop does not work on beat 8 because of slip.
          if (engine.getValue(group, "loop_enabled") === true) {
            // on the wiki it says it returns an integer, but I tested and instead seems a Real value:
            // But it does not work cuz the value does not relate to beat. they are samples.
            // var endLoop = engine.getValue(group, "loop_end_position");
            engine.setValue(group, "reloop_toggle", true); //false
            engine.setValue(group, "slip_enabled", false);
            // Aleatory behavior, probably because the slip does not always have completed before "returning"
            // so I need to introduce a timer waiting the slip function to be completely resolved
            engine.beginTimer(
              2,
              function () {
                engine.setValue(group, "reloop_toggle", true);
              },
              true
            );
          } else {
            engine.setValue(group, "slip_enabled", false);
          }
          DJCi500.slicerTimer[deck] = false;
          DJCi500.slicerButton[deck] = -1;
        },
        true
      );
    }

    engine.setValue(group, "slip_enabled", true);

    // Because of Mixxx beatjump implementation, we need to deactivate the loop before jumping
    // also there is no "lopp_deactivate" and loop_activate false does not work.
    if (loopEnabled) {
      engine.setValue(group, "reloop_toggle", true);
    }
    engine.setValue(group, "beatjump", beatsToJump);
    // This sadly does not work.
    // engine.setValue(group, "loop_move", -beatsToJump);
    if (loopEnabled) {
      engine.setValue(group, "reloop_toggle", true);
    }
    midi.sendShortMsg(0x96 + (deck % 2), 0x20 + index, 0x62);
  } // if value
};

//this below is connected to beat_active
DJCi500.slicerBeatActive = function (value, group, control) {
  // This slicer implementation will work for constant beatgrids only!
  var deck = parseInt(group.charAt(8)) - 1;
  var channel = deck % 2;

  var bpm = engine.getValue(group, "file_bpm"),
    playposition = engine.getValue(group, "playposition"),
    duration = engine.getValue(group, "duration"),
    slicerPosInSection = 0,
    ledBeatState = false,
    domain = DJCi500.selectedSlicerDomain[deck];

  //this works.
  if (
    engine.getValue(group, "beat_closest") ===
    engine.getValue(group, "beat_next")
  ) {
    return;
  }

  DJCi500.slicerBeatsPassed[deck] = Math.floor(
    playposition * duration * (bpm / 60.0)
  );

  if (DJCi500.slicerActive[deck]) {
    slicerPosInSection = Math.floor(
      (DJCi500.slicerBeatsPassed[deck] % domain) / (domain / 8)
    );
    // PAD Led control:
    if (DJCi500.slicerButton[deck] !== slicerPosInSection) {
      for (var i = 0; i < 8; i++) {
        active = (slicerPosInSection === i ? ledBeatState : !ledBeatState)
          ? 0x03
          : 0x7f;

        midi.sendShortMsg(0x96 + channel, 0x20 + i, active);
      }
    } else {
      midi.sendShortMsg(
        0x96 + channel,
        0x20 + DJCi500.slicerButton[deck],
        0x62
      );
    }
  } else {
    DJCi500.slicerAlreadyJumped[deck] = false;
    DJCi500.slicerPreviousBeatsPassed[deck] = 0;
  }
};

DJCi500.shutdown = function () {
  //cleanup
  midi.sendShortMsg(0x90, 0x05, 0x00); //turn browser led off
  midi.sendShortMsg(0xb0, 0x7f, 0x7e);
};
