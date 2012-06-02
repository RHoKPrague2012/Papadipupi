import anyjson
import csv
import os
from subprocess import check_call, PIPE

def convert(file):
    with open(file) as f:
        STATIONS = anyjson.deserialize(f.read())

    with open('tmp', 'w') as w:
        for i in STATIONS:
            w.write(STATIONS[i]['x'] + ' ' + STATIONS[i]['y'] + '\n')

    converted = check_call(
        ["cs2cs", "-f", "%.10f", "+proj=krovak", "+ellps=bessel", "+nadgrids=czech", "+to", "+proj=longlat", "+datum=WGS84", "./tmp"],
        stdout=PIPE
    )

    os.remove('tmp')

    for i in zip(STATIONS, converted):
        STATIONS[i[0]]['wgs84-x'] = i[1]
        STATIONS[i[0]]['wgs84-y'] = i[2]

    f = open('stations-converted.json', 'w')
    f.write(anyjson.serialize(STATIONS))
    f.close()


    f = open('stations-converted.csv', 'wb')
    w = csv.writer(f)
    for k in STATIONS:
        row = STATIONS[k]
        w.writerow([row['id'].encode('utf-8'), row['wgs84-x'].encode('utf-8'), row['wgs84-y'].encode('utf-8')])
    f.close()

if __name__ == "__main__":
    convert('stations.json')