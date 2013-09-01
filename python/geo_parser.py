
kml_f = open('data/geography.kml', 'rU')
kml = kml_f.read()

placemarks = []

placemark_end = 0
while placemark_end != -1:
	placemark_start = kml.find('<Placemark>', placemark_end)
	placemark_end = kml.find('</Placemark>', placemark_start)
	placemark = kml[placemark_start:placemark_end]
	placemarks.append(placemark)

pmdict = {}
for pm in placemarks:
	nation_start = pm.find('<name>') + 6
	nation_end = pm.find('</name>')
	nation = pm[nation_start:nation_end]
	polygons = []
	coord_end = 0
	while coord_end != -1:
		coord_start = pm.find('<coordinates>', coord_end)
		coord_end = pm.find('</coordinates>', coord_start)
		coord = pm[coord_start:coord_end]
		if coord != "":
			polygons.append(coord)
	pmdict[nation] = polygons

polydict = {}
for nation in pmdict:
	polygon_list = []
	if nation != "":
		polygons = pmdict[nation]
		for polygon in polygons:
			polygon = polygon[13:]
			coordinates = polygon.split(",0.0 ")
			formatted_coordinates = []
			for coordinate in coordinates:
				longlat = coordinate.split(',')
				latlng = "new google.maps.LatLng(" + longlat[1] + ', ' + longlat[0] + "),"
				formatted_coordinates.append(latlng)
			polygon_list.append(formatted_coordinates)
	polydict[nation] = polygon_list



# for nation in polydict:
# 	print nation
# 	print '____________\n'
# 	for polygon in polydict[nation]:
# 		print 'POLYGON'
# 		print '_______________'
# 		for i in polygon:
# 			print i


for polygon in polydict['Japan']:
	# print 'POLYGON'
	# print '_______________'
	for i in polygon:
		print i

