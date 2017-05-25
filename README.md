# Motivation

I got frustrated with the GUI and limitations of the track editor that comes bundled with TORCS.
After using it a bit and reading the scarse documentation on the format, I tried to render existing tracks
with JS and rendering it to a canvas in the browser.
Once the basic rendering looked OK, started to implement a form based editor.

This editor should work just as well for editing speend dreams maps (that's my target game in the end).


# Tentative Roadmap

* fix segment form layout with an overflow to allow scrolling
* support zoom centered of selected segment
* try to correct precision issues (most tracks don't end closed as they should, probably due to curve interpolation misinterpretation of something)


# Notes

* I know the bg only appears after 2 redraw. it keeps the code much simpler O:)
* once basic attributes are taken care of I may support other ones (z, slope, etc)


# Feedback

Would love to hear from you. Do you find it useful altogether?
Struggling points, suggestions, etc.
