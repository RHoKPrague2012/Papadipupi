import anyjson
import csv
import os
from subprocess import check_call, PIPE, Popen

def convert(file):
    with open(file) as f:
        STATIONS = anyjson.deserialize(f.read())

    with open('tmp', 'w') as w:
        for i in STATIONS:
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
        w.writerow([row['id'].encode('utf-8'), row['wgs84-x'].encode('utf-8'), row['wgs84-y'].encode('utf-8')])
    f.close()

if __name__ == "__main__":
    convert('stations.json')



http://hydro.chmi.cz/isarrow/object.php?agenda=POV&objekty_chemdata=1&objekty_biodata=&taxon_tree=&seq=2000855701&data_sel=chemdata&chemie=1&biota=&rok_od=2007&rok_do=2012&matrice=2000868184&typodb=&tscongrp=&tscon=&data_mez_stanovitelnosti=&data_od=&data_do=&send=Chemick%E9+vzorky
http://hydro.chmi.cz/isarrow/object.php?agenda=POV&objekty_chemdata=1&objekty_biodata=&taxon_tree=&seq=2000844377&data_sel=chemdata&chemie=1&biota=&rok_od=2007&rok_do=2012&matrice=2000868184&typodb=&tscongrp=&tscon=&data_mez_stanovitelnosti=&data_od=&data_do=&send=Chemick%E9+vzorky


