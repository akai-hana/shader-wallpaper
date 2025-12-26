#!/bin/sh
~/eudaimonia/shader-wallpaper/shadow/scripts/shader-stop.sh &
~/eudaimonia/shader-wallpaper/shadow/scripts/shader-start.sh &

# if picom isn't running, exec it.
# no point in having the wallpaper on and no transparency from compositing
if ! pgrep -x picom > /dev/null; then
    picom &
fi
