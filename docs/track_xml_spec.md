I'm looking for the `section` with the name `Main Track`.

It this element we're reading `width`, assuming this to be the road width in meters.
Also reading `profil steps length` in meters but not sure how to apply this one.

From that element I'm looking for a `section` with the name `Track Segments`, falling back to the first `section` if the former one isn't found.

The segment nodes I'm inspecting are the direct child elements of the track segments element.

Currently supported types and attributes (I assume the units):

* `str` - with `lg` in meters
* `rgt` - with `arc` in degrees, `radius` in meters and (optionally) `end radius` in meters.
* `lft` - same as rgt, buth in the symmetric opposite direction.


## Unhandled attributes (would be nice)

    <attnum name="grade" unit="%" val="1.3" />
    <attnum name="profil end tangent" unit="%" val="1.8" />
    <attnum name="profil steps length" unit="m" val="6.0" />


## Unhandled parts (these are more farfetched)

    <section name="Left Border">
    <section name="Left Side">
    <section name="Left Barrier">
    <section name="Right Border">
    <section name="Right Side">
    <section name="Right Barrier">
