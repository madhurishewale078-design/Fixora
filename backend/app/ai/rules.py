# Fixora Decision-Tree Troubleshooting Rules
# Concept: "Diagnose First. Book Only When Needed."
# Strict Safety: Never advise touching open electrical wires or high-voltage circuits.

PROBLEMS_DATA = {
    "fan_not_working": {
        "problem_key": "fan_not_working",
        "title": "Ceiling Fan Not Working",
        "category_slug": "electrician",
        "description": "Fan is not spinning, running too slow, or making humming noises.",
        "icon": "Wind",
        "first_question": "q_fan_power",
        "questions": {
            "q_fan_power": {
                "id": "q_fan_power",
                "text": "Are other lights or appliances in the same room working normally?",
                "explanation": "Checks if this is an isolated fan circuit issue or a general room power outage.",
                "options": [
                    {"id": "opt_power_no", "text": "No, power is off in the whole room", "next": "res_room_mcb"},
                    {"id": "opt_power_yes", "text": "Yes, other lights and appliances work fine", "next": "q_fan_sound"}
                ]
            },
            "q_fan_sound": {
                "id": "q_fan_sound",
                "text": "When you turn on the fan switch, do you hear a low humming or buzzing sound?",
                "explanation": "A hum usually indicates the motor receives current but the capacitor or bearing is stuck.",
                "options": [
                    {"id": "opt_hum_yes", "text": "Yes, there is a humming sound but blades do not spin", "next": "res_fan_capacitor"},
                    {"id": "opt_hum_no", "text": "No sound at all, completely dead", "next": "q_fan_regulator"}
                ]
            },
            "q_fan_regulator": {
                "id": "q_fan_regulator",
                "text": "Does turning the speed regulator knob change anything, or does it feel loose/slipping?",
                "explanation": "Electronic regulators frequently burn out or their potentiometers fail.",
                "options": [
                    {"id": "opt_reg_loose", "text": "The knob feels loose / turns endlessly without resistance", "next": "res_fan_regulator_tech"},
                    {"id": "opt_reg_firm", "text": "The regulator turns normally, still no response on any speed step", "next": "res_fan_motor_tech"}
                ]
            }
        },
        "outcomes": {
            "res_room_mcb": {
                "type": "SAFE_RESOLVED",
                "title": "Check Main MCB or Inverter Switch",
                "guidance": "Since other appliances in the room are also without power, this is a general supply issue rather than a broken fan. Please safely check your home distribution board (MCB box) to see if a circuit breaker has tripped, or check if your inverter battery tripped.",
                "steps": [
                    "Locate your home MCB (Miniature Circuit Breaker) distribution box.",
                    "Check if any toggle switch is in the 'DOWN' or 'TRIPPED' middle position.",
                    "Push the tripped breaker fully down, then flip it up firmly.",
                    "If the breaker trips immediately again, stop and book an electrician for a short-circuit inspection."
                ],
                "recommended_service_slug": "electrician",
                "price_estimate": "₹299 - ₹499"
            },
            "res_fan_capacitor": {
                "type": "TECHNICIAN_REQUIRED",
                "title": "Capacitor / Bearing Fault (Technician Recommended)",
                "guidance": "The humming sound with stationary blades indicates power is reaching the unit, but the starting capacitor is dead or the ball bearing is seized. Replacing ceiling fan components requires climbing a ladder and testing electrical winding, which should be safely handled by a verified electrician.",
                "steps": [
                    "Turn off the fan switch immediately to avoid overheating the motor coils.",
                    "Do not attempt to push blades with a stick while energized.",
                    "Book a certified Fixora electrician for capacitor replacement."
                ],
                "recommended_service_slug": "electrician",
                "price_estimate": "₹299 - ₹449"
            },
            "res_fan_regulator_tech": {
                "type": "TECHNICIAN_REQUIRED",
                "title": "Regulator Switch Replacement Needed",
                "guidance": "Your fan speed regulator switch has broken internally. Replacing switchboard modules requires isolating the 230V phase supply and wiring a compatible rotary or step regulator.",
                "steps": [
                    "Keep the switch turned OFF.",
                    "Book a verified electrician to replace the regulator safely."
                ],
                "recommended_service_slug": "electrician",
                "price_estimate": "₹299 - ₹399"
            },
            "res_fan_motor_tech": {
                "type": "TECHNICIAN_REQUIRED",
                "title": "Motor Winding or Internal Wiring Inspection",
                "guidance": "Since the regulator is intact and no sound is emitted, either the switch internal contact has burned out or the ceiling rose wiring / stator winding is disconnected. Professional electrical inspection is needed.",
                "steps": [
                    "Switch off the main wall switch.",
                    "Schedule a Fixora certified technician for diagnosis."
                ],
                "recommended_service_slug": "electrician",
                "price_estimate": "₹349 - ₹599"
            }
        }
    },

    "ac_not_cooling": {
        "problem_key": "ac_not_cooling",
        "title": "AC Not Cooling Efficiently",
        "category_slug": "ac-repair",
        "description": "Air conditioner is turned on and blowing air, but the room is not cooling.",
        "icon": "Snowflake",
        "first_question": "q_ac_mode",
        "questions": {
            "q_ac_mode": {
                "id": "q_ac_mode",
                "text": "Is the remote set to 'COOL' mode (snow icon) and the temperature set below room temperature (e.g., 22°C - 24°C)?",
                "explanation": "Often remotes get accidentally switched to FAN or DRY mode where cooling compressor will not run.",
                "options": [
                    {"id": "opt_mode_wrong", "text": "It was on FAN/AUTO mode! Let me fix it", "next": "res_ac_mode_fixed"},
                    {"id": "opt_mode_correct", "text": "Yes, it is definitely on COOL mode at 20-24°C", "next": "q_ac_filter"}
                ]
            },
            "q_ac_filter": {
                "id": "q_ac_filter",
                "text": "When was the indoor air filter mesh last cleaned? (Has it been more than 3 months?)",
                "explanation": "Clogged dust filters severely restrict airflow, preventing the evaporator coil from transferring cold air.",
                "options": [
                    {"id": "opt_filter_dirty", "text": "It has been over 3 months / filters look choked with dust", "next": "res_ac_clean_filter"},
                    {"id": "opt_filter_clean", "text": "Filters are completely clean", "next": "q_ac_outdoor"}
                ]
            },
            "q_ac_outdoor": {
                "id": "q_ac_outdoor",
                "text": "Can you hear or see the outdoor unit (compressor) fan running?",
                "explanation": "If outdoor unit is not kicking in after 3-5 minutes, the compressor capacitor, PCB, or refrigerant is compromised.",
                "options": [
                    {"id": "opt_outdoor_no", "text": "No, outdoor unit is silent and not starting", "next": "res_ac_compressor_tech"},
                    {"id": "opt_outdoor_yes", "text": "Outdoor fan runs, but air from indoor unit is lukewarm", "next": "res_ac_gas_tech"}
                ]
            }
        },
        "outcomes": {
            "res_ac_mode_fixed": {
                "type": "SAFE_RESOLVED",
                "title": "Mode Set to Cool - Problem Solved!",
                "guidance": "Switching to 'Cool' mode with the snowflake icon allows the compressor timer to engage. Please wait 3-5 minutes for the compressor cycle to start.",
                "steps": [
                    "Keep the remote setting on COOL mode at 24°C.",
                    "Ensure doors and windows are closed.",
                    "Give it 5-10 minutes. Enjoy the cool air!"
                ],
                "recommended_service_slug": "ac-repair",
                "price_estimate": "₹0 - Self Resolved"
            },
            "res_ac_clean_filter": {
                "type": "SAFE_RESOLVED",
                "title": "Safe DIY Filter Cleaning Recommended",
                "guidance": "A choked mesh filter is the #1 cause of poor cooling and high electricity bills. You can safely clean this without any tools.",
                "steps": [
                    "Turn off the AC from the wall switch for safety.",
                    "Gently lift the front plastic panel of your indoor AC unit.",
                    "Slide out the two nylon mesh filters.",
                    "Wash them under lukewarm tap water. Dry completely with a towel.",
                    "Slide them back in and restart your AC."
                ],
                "recommended_service_slug": "ac-repair",
                "price_estimate": "₹0 - Free DIY Step"
            },
            "res_ac_compressor_tech": {
                "type": "TECHNICIAN_REQUIRED",
                "title": "Outdoor Unit / Capacitor Service Needed",
                "guidance": "The outdoor compressor is not triggering. This is typically due to a blown dual run capacitor, a faulty control board relay, or electrical line voltage drops. Professional diagnosis with a multimeter and high-voltage safety is essential.",
                "steps": [
                    "Switch off the AC to prevent compressor coil burnout.",
                    "Book a verified AC technician for compressor capacitor service."
                ],
                "recommended_service_slug": "ac-repair",
                "price_estimate": "₹499 - ₹899"
            },
            "res_ac_gas_tech": {
                "type": "TECHNICIAN_REQUIRED",
                "title": "Refrigerant (Gas) Leak or Deep Jet Service Required",
                "guidance": "Since the outdoor fan operates but no cold air is produced, your unit likely has low refrigerant charge (gas leak in copper joints) or choked cooling fins requiring foam jet service.",
                "steps": [
                    "Avoid running the AC dry as running without gas can seize the compressor motor.",
                    "Book an authorized technician for gas leak test and precision refill."
                ],
                "recommended_service_slug": "ac-repair",
                "price_estimate": "₹699 - ₹1,899"
            }
        }
    },

    "water_leakage": {
        "problem_key": "water_leakage",
        "title": "Plumbing & Water Leakage",
        "category_slug": "plumber",
        "description": "Water dripping from taps, leaking under sinks, or toilet tank running continuously.",
        "icon": "Droplets",
        "first_question": "q_leak_location",
        "questions": {
            "q_leak_location": {
                "id": "q_leak_location",
                "text": "Where is the water leak occurring?",
                "explanation": "Identifies whether the source is an external fixture or concealed pipe.",
                "options": [
                    {"id": "opt_tap_drip", "text": "Tap mouth or aerator nozzle is dripping steadily", "next": "q_tap_aerator"},
                    {"id": "opt_sink_pipe", "text": "Under the kitchen/bathroom sink drain pipe", "next": "q_sink_drain"},
                    {"id": "opt_flush_tank", "text": "Toilet cistern/flush tank is running continuously", "next": "res_toilet_valve_tech"}
                ]
            },
            "q_tap_aerator": {
                "id": "q_tap_aerator",
                "text": "When you shut the tap lever firmly, does it continue to leak from the spout or around the handle?",
                "explanation": "Spout drip is a worn rubber washer/ceramic disc spindle; handle leak is a loose gland nut.",
                "options": [
                    {"id": "opt_spout_leak", "text": "Drips from spout even when closed tightly", "next": "res_tap_spindle_tech"},
                    {"id": "opt_aerator_clog", "text": "Water sprays sideways erratically when tap is open", "next": "res_clean_aerator_diy"}
                ]
            },
            "q_sink_drain": {
                "id": "q_sink_drain",
                "text": "Is the flexible corrugated drain hose loose from the wall outlet or cracked?",
                "explanation": "Flexible waste pipes often slip out or loosen at the coupling nut.",
                "options": [
                    {"id": "opt_hose_loose", "text": "The corrugated hose simply slipped out of the drain hole", "next": "res_sink_hose_diy"},
                    {"id": "opt_hose_broken", "text": "The PVC bottle trap or pipe is cracked/leaking at joints", "next": "res_sink_pipe_tech"}
                ]
            }
        },
        "outcomes": {
            "res_clean_aerator_diy": {
                "type": "SAFE_RESOLVED",
                "title": "Clean the Tap Aerator Nozzle (Safe DIY)",
                "guidance": "Erratic spraying or side dripping when the tap is on is caused by limescale/sediment buildup in the tip mesh.",
                "steps": [
                    "Unscrew the tip nozzle (aerator) of the tap counter-clockwise using your fingers.",
                    "Rinse the tiny mesh under water and soak in vinegar or warm soapy water for 5 minutes.",
                    "Screw it back on snugly. Tap flow will be restored to normal!"
                ],
                "recommended_service_slug": "plumber",
                "price_estimate": "₹0 - Free DIY"
            },
            "res_sink_hose_diy": {
                "type": "SAFE_RESOLVED",
                "title": "Reseat Drain Pipe Coupling (Safe DIY)",
                "guidance": "Under-sink flexible waste hoses can slip out due to water pressure or accidental movement.",
                "steps": [
                    "Place a small bucket or cloth under the drain.",
                    "Firmly push the flexible drain pipe 2-3 inches deep into the wall drain pipe.",
                    "Ensure the rubber gasket collar is seated flush against the opening.",
                    "Test with tap water. If dry, the problem is solved!"
                ],
                "recommended_service_slug": "plumber",
                "price_estimate": "₹0 - Free DIY"
            },
            "res_tap_spindle_tech": {
                "type": "TECHNICIAN_REQUIRED",
                "title": "Tap Spindle / Cartridge Replacement Required",
                "guidance": "Constant dripping with the handle fully closed means the internal brass spindle or ceramic disc has worn out. A plumber is needed to shut the inlet stop-cock and replace the internal cartridge.",
                "steps": [
                    "Turn the mini stop-valve under the sink clockwise to stop water loss until technician arrives.",
                    "Book a certified Fixora plumber to replace the tap cartridge."
                ],
                "recommended_service_slug": "plumber",
                "price_estimate": "₹249 - ₹399"
            },
            "res_toilet_valve_tech": {
                "type": "TECHNICIAN_REQUIRED",
                "title": "Flush Valve / Siphon Mechanism Service",
                "guidance": "Water continuously trickling into the toilet pan wastes hundreds of liters of water daily. The rubber flapper or dual-flush siphon seal is compromised.",
                "steps": [
                    "Turn off the angle valve behind the toilet tank.",
                    "Book a verified plumber for flush mechanism overhaul."
                ],
                "recommended_service_slug": "plumber",
                "price_estimate": "₹299 - ₹499"
            },
            "res_sink_pipe_tech": {
                "type": "TECHNICIAN_REQUIRED",
                "title": "Drainage Pipe & Bottle Trap Replacement",
                "guidance": "Cracked PVC bottle traps or corroded threads require replacement and solvent cementing to prevent sub-floor seepage.",
                "steps": [
                    "Avoid using the sink temporarily.",
                    "Book a verified plumber for drain line replacement."
                ],
                "recommended_service_slug": "plumber",
                "price_estimate": "₹349 - ₹549"
            }
        }
    },

    "ro_water_purifier": {
        "problem_key": "ro_water_purifier",
        "title": "RO Purifier Not Working / Low Flow",
        "category_slug": "ro-service",
        "description": "Water tank not filling, foul taste, unusual pump vibration, or continuous rejection water.",
        "icon": "Activity",
        "first_question": "q_ro_power",
        "questions": {
            "q_ro_power": {
                "id": "q_ro_power",
                "text": "Is the RO power adapter (SMPS) LED indicator lit up, and is the water inlet valve fully open?",
                "explanation": "Most RO systems have an automated low-pressure switch (LPS) that refuses to start if inlet water is closed.",
                "options": [
                    {"id": "opt_ro_valve_closed", "text": "The blue inlet tap on the pipe was turned OFF!", "next": "res_ro_valve_diy"},
                    {"id": "opt_ro_valve_open", "text": "Inlet water is fully open and power is ON", "next": "q_ro_tank"}
                ]
            },
            "q_ro_tank": {
                "id": "q_ro_tank",
                "text": "Is the reject/waste water pipe expelling water continuously while the tank remains empty?",
                "explanation": "Continuous waste flow without pure water indicates a choked RO membrane or stuck solenoid valve (SV).",
                "options": [
                    {"id": "opt_ro_membrane_choked", "text": "Yes, reject water keeps running but pure water is a faint trickle", "next": "res_ro_membrane_tech"},
                    {"id": "opt_ro_smps_dead", "text": "No water flows at all, motor is dead and silent", "next": "res_ro_smps_tech"}
                ]
            }
        },
        "outcomes": {
            "res_ro_valve_diy": {
                "type": "SAFE_RESOLVED",
                "title": "Inlet Water Valve Restored (Problem Solved)",
                "guidance": "The RO safety low-pressure switch was preventing dry-running of the booster pump.",
                "steps": [
                    "Keep the inlet diverter valve in line with the pipe.",
                    "Wait 2-3 minutes for the system pressure to stabilize.",
                    "Check if the booster pump starts humming. Enjoy clean water!"
                ],
                "recommended_service_slug": "ro-service",
                "price_estimate": "₹0 - Resolved"
            },
            "res_ro_membrane_tech": {
                "type": "TECHNICIAN_REQUIRED",
                "title": "RO Membrane / Sediment Filter Replacement",
                "guidance": "Your reverse osmosis membrane pores are clogged with high TDS mineral scale. Continued operation will overheat the booster pump.",
                "steps": [
                    "Turn off the RO power plug.",
                    "Book a verified RO technician for multi-stage filter replacement and TDS calibration."
                ],
                "recommended_service_slug": "ro-service",
                "price_estimate": "₹599 - ₹1,499"
            },
            "res_ro_smps_tech": {
                "type": "TECHNICIAN_REQUIRED",
                "title": "RO Booster Pump / SMPS Power Supply Fault",
                "guidance": "The DC power adapter (SMPS) or 24V booster pump has failed. Replacement and voltage measurement is required.",
                "steps": [
                    "Unplug the electrical supply.",
                    "Schedule a certified RO technician for power unit diagnosis."
                ],
                "recommended_service_slug": "ro-service",
                "price_estimate": "₹499 - ₹999"
            }
        }
    }
}
