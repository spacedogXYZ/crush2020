import urllib.request
import csv
import json

from bs4 import BeautifulSoup

STATES_TO_CODE = {
    'Alabama': 'AL',
    'Alaska': 'AK',
    'American Samoa': 'AS',
    'Arizona': 'AZ',
    'Arkansas': 'AR',
    'California': 'CA',
    'Colorado': 'CO',
    'Connecticut': 'CT',
    'Delaware': 'DE',
    'District of Columbia': 'DC',
    'Florida': 'FL',
    'Georgia': 'GA',
    'Guam': 'GU',
    'Hawaii': 'HI',
    'Idaho': 'ID',
    'Illinois': 'IL',
    'Indiana': 'IN',
    'Iowa': 'IA',
    'Kansas': 'KS',
    'Kentucky': 'KY',
    'Louisiana': 'LA',
    'Maine': 'ME',
    'Maryland': 'MD',
    'Massachusetts': 'MA',
    'Michigan': 'MI',
    'Minnesota': 'MN',
    'Mississippi': 'MS',
    'Missouri': 'MO',
    'Montana': 'MT',
    'Nebraska': 'NE',
    'Nevada': 'NV',
    'New Hampshire': 'NH',
    'New Jersey': 'NJ',
    'New Mexico': 'NM',
    'New York': 'NY',
    'North Carolina': 'NC',
    'North Dakota': 'ND',
    'Northern Mariana Islands':'MP',
    'Ohio': 'OH',
    'Oklahoma': 'OK',
    'Oregon': 'OR',
    'Pennsylvania': 'PA',
    'Puerto Rico': 'PR',
    'Rhode Island': 'RI',
    'South Carolina': 'SC',
    'South Dakota': 'SD',
    'Tennessee': 'TN',
    'Texas': 'TX',
    'Utah': 'UT',
    'Vermont': 'VT',
    'Virgin Islands': 'VI',
    'Virginia': 'VA',
    'Washington': 'WA',
    'West Virginia': 'WV',
    'Wisconsin': 'WI',
    'Wyoming': 'WY'
}

MOVEMENTVOTE_URL = "https://movement.vote/groups" # this is a gatsby site, so doesn't have the full body hydrated
# loaded it in a real browser and then saved to 
MOVEMENTVOTE_FILE = "movementvote.html"
REQUEST_HEADERS = {'User-Agent' : "bot"}
DESIRED_FIELDS = ['name', 'state', 'description', 'website', 'donation_url', 'logo_url', 'issues']

def get_page(url):
    request = urllib.request.Request(url, headers=REQUEST_HEADERS)
    connect = urllib.request.urlopen(request)
    return BeautifulSoup(connect.read(), 'html.parser')

def get_data(doc):
    data = []
    orgs_section = doc.find("section", {"class": "orgs-section"})
    orgs_list = orgs_section.find("div", {"class": "orgs-list"})
    for org in orgs_list.find_all("div", {"class" : "org"}):
        state_name = org.find("div", {"class": "org-states"}).get_text().strip()
        state_name = state_name.replace("National Groups", "").replace(',','').strip()
        state = STATES_TO_CODE.get(state_name)
        name = org.find("div", {"class": "org-title"}).get_text().strip()
        description = org.find("div", {"class": "org-content"}).get_text().strip()
        image = org.find("img", {"class": "org-image"})
        website = org.find("a", {"class": "org-link-web"}, href=True)
        donate = org.find('a', {"class": "org-link-donate"}, href=True)
        org_tags = org.find("div", {"class": "org-tags"})

        d = {
            'name': name,
            'state': state,
            'description': description
        }
        if image:
            d['logo_url'] = image['src']
        if website:
            d['website'] = website['href']
        if donate:
            d['donation_url'] = donate['href'].replace('refcode=mvpsite', 'refcode=crush2020')
        if org_tags:
            first_tag = org_tags.find("div", {"class": "tagblock"})
            if first_tag and first_tag.get_text().startswith("Issue Areas:"):
                issues = first_tag.get_text().replace("Issue Areas: ", "").strip()
                d['issues'] = issues
            
        data.append(d)
        print(len(data))
    return data

def write_page(data, writer):
    for row in data:
        out_row = {k: v for k, v in row.items() if k in DESIRED_FIELDS}
        writer.writerow(out_row)

with open('../movementvote.csv', 'w') as out_file:
    out_writer = csv.DictWriter(out_file, fieldnames=DESIRED_FIELDS)
    out_writer.writeheader()

    # doc = get_page(MOVEMENTVOTE_URL)
    file = open(MOVEMENTVOTE_FILE, 'r')
    doc = BeautifulSoup(file.read(), 'html.parser')
    write_page(get_data(doc), out_writer)

    print("done")
