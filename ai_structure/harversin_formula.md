# what is the Haversien Formula? 
The Harversine Formula is a mathematical equation used to calculate the great-circle distance between two points on hte surface of a sphere given their latitude and longitude.

the formula 

\[
d = 2R \cdot \arcsin\left(
  \sqrt{
    \sin^2\left(\frac{\Delta \varphi}{2}\right) +
    \cos(\varphi_1)\cos(\varphi_2)\sin^2\left(\frac{\Delta \lambda}{2}\right)
  }
\right)
\]

### Where:

| Symbol | Description |
|:--|:--|
| \( d \) | Distance between the two points |
| \( R \) | Radius of the Earth (≈ 6371 km) |
| \( \varphi_1, \varphi_2 \) | Latitudes of the two points (in radians) |
| \( \lambda_1, \lambda_2 \) | Longitudes of the two points (in radians) |
| \( \Delta \varphi = \varphi_2 - \varphi_1 \) | Difference in latitude |
| \( \Delta \lambda = \lambda_2 - \lambda_1 \) | Difference in longitude |

why we need it for GPS 

GPS coordinates (latitude, longitude) describe positions on the curved surface on the earth
if we simply used the Pythagorean theorem (like we do in the flat geometry) our distance result would be inaccurate because the earth is not flat it's roughly a sphere.

The harversine formula accounts for the earth curature, giving us a much more accurate result, especially for distances under a few thousand kilometres.