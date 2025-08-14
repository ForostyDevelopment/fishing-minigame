# fishing-minigame
FiveM Fishing Minigame inspired by Stardew Valley

# Example usage
    RegisterCommand("fish", function()
        exports["fishing-minigame"]:startFishing("hard", function(success)
            if success then
                print("You caught the fish!")
            else
                print("The fish got away...")
            end
        end)
    end)
