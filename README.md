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

<img width="171" height="608" alt="image" src="https://github.com/user-attachments/assets/03989d6d-d296-4f82-a786-f0f292c7f3f3" />
