import urllib.request
import csv
import json

from bs4 import BeautifulSoup


ACTBLUE_DIRECTORY = [
    "https://secure.actblue.com/directory/all/candidate/fed-house",
    "https://secure.actblue.com/directory/all/candidate/fed-senate",
    "https://secure.actblue.com/directory/all/candidate/state-exec-all",
    "https://secure.actblue.com/directory/all/candidate/state-gov",
]    
REQUEST_HEADERS = {'User-Agent' : "bot"}
DESIRED_FIELDS = ['id', 'name', 'state', 'district', 'donation_url']
DESIRED_YEAR = "2020"


def get_page(url):
    request = urllib.request.Request(url, headers=REQUEST_HEADERS)
    connect = urllib.request.urlopen(request)
    return BeautifulSoup(connect.read(), 'html.parser')

def get_next_link(doc):
    rel = doc.find('a', rel='next', href=True)
    if rel:
        return "https://secure.actblue.com/"+rel['href']
    return False

def get_data(doc):
    data = []
    for entity in doc.find_all("div", {"class" : "entity-container"}):
        try:
            entity_id = entity['id'].split('_')[1]
            location = entity.find("div", {"class": "location"}).get_text().strip()
            year = entity.find("div", {"class": "race"}).contents[2].strip()
            name = entity.find("h3").get_text().strip()
            contribute = entity.find('a', {"class": "contribute"}, href=True)
            if (year != DESIRED_YEAR):
                continue
            d = {
                'id': entity_id,
                'name': name,
            }
            if location:
                d['state'] = location.split('-')[0]
                d['district'] = location.split('-')[1]
            if contribute:
                d['donation_url'] = contribute['href'].replace('?refcode=directory','')
            data.append(d)
        except (Exception,e):
            print(e)
            print(entity.contents)
            continue
    return data

def write_page(data, writer):
    for row in data:
        out_row = {k: v for k, v in row.items() if k in DESIRED_FIELDS}
        writer.writerow(out_row)

with open('../actblue.csv', 'w') as out_file:
    out_writer = csv.DictWriter(out_file, fieldnames=DESIRED_FIELDS)
    out_writer.writeheader()

    for url in ACTBLUE_DIRECTORY:
        print(url)
        page = 1
        doc = get_page(url)
        write_page(get_data(doc), out_writer)
        next_link = get_next_link(doc)

        while next_link:
            write_page(get_data(doc), out_writer)
            page += 1
            print("page", page)

            doc = get_page(next_link)
            next_link = get_next_link(doc)
        print("done")
