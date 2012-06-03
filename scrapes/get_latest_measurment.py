import anyjson
import csv
import urllib2

import socket
socket.setdefaulttimeout(10)

from lxml.html.soupparser import fromstring
from lxml.cssselect import CSSSelector

STATIONS = {}

def load_stations(file='stations-converted.json'):
    global STATIONS

    with open(file) as f:
        STATIONS = anyjson.deserialize(f.read())

    for station in STATIONS.values():
        try:
            uri = "http://hydro.chmi.cz/isarrow/object.php?seq=2000855701&chemie=1&biota=1&ukol_p=1&id_objekt=&vod_typ=R&nadmh_sign=%3E&rickm_sign=%3E&rok_od=2007&rok_do=2012&objekty_chemdata=1&matrice=2000868184&typodb=41"
            seq = CSSSelector("form input[name='seq']")(fromstring(urllib2.urlopen(uri).read().decode('cp1250')))[0].value

            # print 'seq is ' + seq

            uri = "http://hydro.chmi.cz/isarrow/object.php?agenda=POV&objekty_chemdata=1&objekty_biodata=&taxon_tree=&seq=" + seq + "&data_sel=chemdata&chemie=1&biota=1&rok_od=2007&rok_do=2012&matrice=2000868184&typodb=41&tscongrp=&tscon=&data_mez_stanovitelnosti=&data_od=&data_do=&taxon=&send=Chemick%E9+vzorky"
            tree = fromstring(urllib2.urlopen(uri).read().decode('cp1250'))

            link = CSSSelector("table.tbl a")(tree)[-1]

            uri = "http://hydro.chmi.cz/isarrow/" + link.get("href")
            tree = fromstring(urllib2.urlopen(uri).read().decode('cp1250'))

            csv_link = tree.xpath("//form[1]//a")[0]

            uri = "http://hydro.chmi.cz/isarrow/" + csv_link.get("href")


            #FIXME: CSV export is now broken on IS ARROW
            # wait for them to fix it or parse from table -- and store relevant data into structure
            reader = csv.reader(urllib2.urlopen(uri))
            for row in reader:
                print row

        except Exception:
            print 'Failed to retrieve values for station ' + station['id']
            import traceback
            traceback.print_exc()

if __name__ == "__main__":
    load_stations()
