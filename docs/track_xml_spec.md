I'm looking for the `section` with the name `Main Track`.

From that element I'm looking for a `section` with the name `Track Segments`, falling back to the first `section` if the former one isn't found.

The segment nodes I'm inspecting are the direct child elements of the track segments element.

Currently supported types and attributes (I assume the units):

* `str` - with `lg` in meters
* `rgt` - with `arc` in degrees, `radius` in meters and (optionally) `end radius` in meters.
* `lft` - same as rgt, buth in the symmetric opposite direction.
