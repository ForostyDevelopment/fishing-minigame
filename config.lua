-- gravity           : downward acceleration of the green bar when not holding input
-- lift              : upward acceleration of the green bar when holding input
-- maxBarSpeed       : maximum speed green bar can move
-- fishMaxSpeed      : maximum speed of fish movement
-- fishAccel         : acceleration factor for fish movements / darts
-- fishDartChance    : chance per frame for fish to make a sudden dart
-- fillRate          : % increase in catch meter when fish is inside green bar
-- drainRate         : % decrease in catch meter when fish is outside green bar
-- bounceDamping     : multiplier applied when green bar hits bottom and bounces
-- stopThreshold     : velocity threshold to stop green bar after bouncing
-- startCatchPercent : initial % of catch meter filled
-- barHeightPercent  : height of the green bar in % of fish-box height

config = {
    global = {
        gravity = -0.10,
        lift = 0.1,
        maxBarSpeed = 2,
        bounceDamping = 0.85,
        stopThreshold = 0.05,
        startCatchPercent = 20,
        fillRate = 0.12,    -- global now
        drainRate = 0.08,    -- global now
        barHeightPercent = 25,      
    },

    difficulties = {
        easy = {
            fishMaxSpeed = 1.2,
            fishAccel = 0.08,
            fishDartChance = 0.01
        },
        medium = {
            fishMaxSpeed = 2.0,
            fishAccel = 0.1,
            fishDartChance = 0.03
        },
        hard = {
            fishMaxSpeed = 2.5,
            fishAccel = 0.12,
            fishDartChance = 0.06
        }
    },
}
