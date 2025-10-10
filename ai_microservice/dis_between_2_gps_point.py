import math

def harversin_distance(lat1, long1, lat2, long2):
    R = 6371
    phi1 = math.radians(lat1)
    phi2 = math.radians(lat2)
    delta_phi = math.radians(lat2 - lat1)
    delta_lambda = math.radians(long2 - long1)

    a = (math.sin(delta_phi/2))**2 + math.cos(phi1)*math.cos(phi2) * (math.sin(delta_lambda/2))**2

    c = 2 * math.asin(math.sqrt(a))

    return R * c


# exemple 1

print(harversin_distance(23, 12, 18, 13))