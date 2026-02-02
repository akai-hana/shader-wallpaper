#!/bin/sh
cd ~/git/shadow || exit 1

# Random selection using sort with random key
SHADER=$(find ~/eudaimonia/shader-wallpaper/shadow -name "*.frag" | sort -R | head -n 1)

# Run the shadow command in the background
DRI_PRIME=1 poetry run shadow "$SHADER" -m root -f 20 -q 1 &

# if picom isn't running, exec it.
# no point in having the wallpaper on and no transparency from compositing
sleep 0.1s && picom &
