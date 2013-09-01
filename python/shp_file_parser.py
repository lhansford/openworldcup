import shapefile

sf = shapefile.Reader("shapefiles/ne_50m_admin_0_countries.shp")
shapes = sf.shapes()

x = 0
while shapes[20].points[x] != None:
	print shapes[20].points[x]
	x += 1