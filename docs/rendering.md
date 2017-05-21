The way the rendering works is using a turtle implementation.
It has inner state (with position and angle).

A **straight** creates a linear extrusion forward by the `lg` distance, without affecting direction.

A **rgt**/**lft** arc creates a spiral lathe through the `arc` angle. If only `radius` exists then it's a perfect lathe revolution,
if `end radius` is also specified, the lathe generates a spiral lathe, interpolating from `radius` to `end radius` along the rotation.
