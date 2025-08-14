fx_version "cerulean"
game "gta5"

description "Fishing Minigame"
author "Forosty's Development"

ui_page "html/index.html"

files {
    "html/index.html",
    "html/style.css",
    "html/script.js",
    "html/images/fish-icon.png"
}

shared_scripts {
    "config.lua"
}

client_scripts {
    "client.lua"
}

exports {
    "StartFishing"
}
