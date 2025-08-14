local config = config
local activeFishingCallback

local function openNui()
    SetNuiFocus(true, true)
    SendNUIMessage({ action = "openUi" })
end

local function closeNui()
    SetNuiFocus(false, false)
    SendNUIMessage({ action = "closeUi" })
end

RegisterNUICallback('closeNui', function(_, cb)
    closeNui()
    cb("ok")
end)

RegisterNUICallback("fishingResult", function(data, cb)
    if type(activeFishingCallback) == "function" then
        activeFishingCallback(data.success)
        activeFishingCallback = nil
    end

    SetNuiFocus(false, false)
    cb("ok")
end)

local function getDifficultySettings(level)
    local diff = config.difficulties[level] or config.difficulties.medium
    local settings = {}

    for k, v in pairs(config.global) do 
        settings[k] = v 
    end

    for k, v in pairs(diff) do 
        settings[k] = v 
    end

    return settings
end

exports("startFishing", function(difficulty, cb)
    local p = promise.new()
    activeFishingCallback = function(success)
        if cb then
            cb(success)
        end
        p:resolve(success)
        activeFishingCallback = nil
    end

    local settings = getDifficultySettings(difficulty)

    SetNuiFocus(true, true)
    SendNUIMessage({
        action = "startFishing",
        difficultySettings = settings
    })

    return p
end)
