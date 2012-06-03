import anyjson
import csv
import urllib2

from lxml.html.soupparser import fromstring
from lxml.cssselect import CSSSelector

STATIONS = {}

def get_station(link):
    link = "http://hydro.chmi.cz/isarrow/" + link

    try:
        tree = fromstring(urllib2.urlopen(link).read().decode('cp1250'))
        ident = CSSSelector("table tr:nth-child(1) td")(tree)[1].text

        STATIONS[tree.xpath("//table/tr[14]/td")[0].text] = {
        'id' : ident,
#        'name' : CSSSelector("table tr:nth-child(1) td")(tree)[0].text,
        'x' : tree.xpath("//table/tr[14]/td")[0].text,
        'y' : tree.xpath("//table/tr[15]/td")[0].text,
        }
    except:
        print "Failed to retrieve station"


def scrape():
    complete_url = "http://hydro.chmi.cz/isarrow/objects.php?ukol_p=1&vod_typ=R&nadmh_sign=%3E&rickm_sign=%3E&rok_od=2009&rok_do=2012&objekty_chemdata=1&matrice=2000868184&typodb=41&seq=364922&ordrstr=NM&agenda=POV&limit_clsf=&matrice_clsf=&tscon_clsf=&rok_od_clsf=&rok_do_clsf=&val_sign_clsf=&val_clsf=&agg_clsf=&startpos=0&recnum=600"
    tree = fromstring(urllib2.urlopen(complete_url).read().decode('cp1250'))
    links = CSSSelector("table.tbl a")(tree)
    i = 1
    print str(len(links)) + " links found"
    for link in links:
        print "Retrieving station " + str(i)
        i += 1
        get_station(link.get("href"))

def store():
    f = open('stations.json', 'w')
    f.write(anyjson.serialize(STATIONS))
    f.close()


    f = open('stations.csv', 'wb')
    w = csv.writer(f)
    for k in STATIONS:
        row = STATIONS[k]
        try:
            w.writerow([row['id'].encode('utf-8'), row['x'].encode('utf-8'), row['y'].encode('utf-8')])
        except:
            print "Error while writing row" 
    
    f.close()

if __name__ == "__main__":
    scrape()
    store()
