import urllib.request
import csv
import json

MOBILIZE_URL = "https://www.mobilize.us/api/v1/organizations"
REQUEST_HEADERS = {'User-Agent' : "bot"}
DESIRED_FIELDS = ['id', 'name', 'slug', 'race_type', 'org_type', 'state', 'district', 'candidate_name', 'event_feed_url']

TEST_IDS = [883, 1151, 1278, 3298, 3743, 3751, 3755, 4216, 4230, 4539, 4825]

def get_page(url):
    request = urllib.request.Request(url, headers=REQUEST_HEADERS)
    connect = urllib.request.urlopen(request)
    return json.loads(connect.read())

def write_page(response, writer):
    for row in response['data']:
        if row['is_primary_campaign'] is True or row['id'] in TEST_IDS:
            continue
        out_row = {k: v for k, v in row.items() if k in DESIRED_FIELDS}
        writer.writerow(out_row)

with open('../mobilize-us.csv', 'w') as out_file:
    out_writer = csv.DictWriter(out_file, fieldnames=DESIRED_FIELDS)
    out_writer.writeheader()

    page = 1
    response = get_page(MOBILIZE_URL)
    write_page(response, out_writer)
    print(response['count'], "results")

    while response['next']:
        response = get_page(response['next'])
        write_page(response, out_writer)
        page += 1
        print("page", page)
    print("done")
