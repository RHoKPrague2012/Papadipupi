import anyjson
import csv
import os
from subprocess import check_call, PIPE, Popen

def convert(file):
    with open(file) as f:
        STATIONS = anyjson.deserialize(f.read())

    with open('tmp', 'w') as w:
        for i in STATIONS:
            if STATIONS[i]['x'] and STATIONS[i]['y']:
                w.write(STATIONS[i]['x'] + ' ' + STATIONS[i]['y'] + '\n')

    p = Popen( 
        ["cs2cs", "-f", "%.10f", "+proj=krovak", "+ellps=bessel", "+nadgrids=czech", "+to", "+proj=longlat", "+datum=WGS84", "./tmp"],
        stdout=PIPE
    )

    converted, stderr = p.communicate()

    os.remove('tmp')

    for i in zip(STATIONS, converted.splitlines()):
        STATIONS[i[0]]['wgs84-y'] = i[1].split()[0]
        STATIONS[i[0]]['wgs84-x'] = i[1].split()[1]

    f = open('stations-converted.json', 'w')
    f.write(anyjson.serialize(STATIONS))
    f.close()


    f = open('stations-converted.csv', 'wb')
    w = csv.writer(f)
    for k in STATIONS:
        row = STATIONS[k]
        if 'wgs84-x' in row and 'wgs84-y' in row:
            w.writerow([row['id'].encode('utf-8'), row['wgs84-x'].encode('utf-8'), row['wgs84-y'].encode('utf-8'), row['name'].encode('utf-8')])
    f.close()

if __name__ == "__main__":
    convert('stations.json')
