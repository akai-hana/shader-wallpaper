#!/bin/sh

# Random selection using sort with random key
#SHADER=$(find ~/eudaimonia/shader-wallpaper/shadow -name "*.frag" | sort -R | head -n 1)

SHADER=/home/akai/eudaimonia/shader-wallpaper/shadow/iso.frag
PIDFILE=${XDG_RUNTIME_DIR:-/tmp}/wallshader.pid

# restart: stop picom and the previous wallpaper (by pid, not by name)
pkill -x picom
[ -f "$PIDFILE" ] && kill "$(cat "$PIDFILE")" 2>/dev/null
xprop -root -remove _XROOTPMAP_ID

~/git/animated-glsl-wallpaper/main -f "$SHADER" -k ghostty &
echo $! > "$PIDFILE"

# block until the wallpaper publishes its first frame (no polling),
# give up after 5 s if it never does
timeout 5 xprop -spy -root _XROOTPMAP_ID | grep -q PIXMAP || exit 1

picom &
