#!/bin/sh
cd ~/git/shadow || exit 1

# Random selection using sort with random key
SHADER=$(find ~/eudaimonia/shader-wallpaper/shadow -name "*.frag" | sort -R | head -n 1)

# Run the shadow command in the background
DRI_PRIME=1 poetry run shadow "$SHADER" -m root -f 24 -q 1 &
