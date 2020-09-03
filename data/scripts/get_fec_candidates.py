# download House/Senate current campaigns from FEC
# and convert it to a CSV with headers
# based on data description at 
# https://www.fec.gov/campaign-finance-data/current-campaigns-house-and-senate-file-description/

ZIP_URL = "https://www.fec.gov/files/bulk-downloads/2020/webl20.zip"
ZIP_NAME = "webl20.txt"

FULL_HEADERS = [
    'CAND_ID',
    'CAND_NAME',
    'CAND_ICI',
    'PTY_CD',
    'CAND_PTY_AFFILIATION',
    'TTL_RECEIPTS',
    'TRANS_FROM_AUTH',
    'TTL_DISB',
    'TRANS_TO_AUTH',
    'COH_BOP',
    'COH_COP',
    'CAND_CONTRIB',
    'CAND_LOANS',
    'OTHER_LOANS',
    'CAND_LOAN_REPAY',
    'OTHER_LOAN_REPAY',
    'DEBTS_OWED_BY',
    'TTL_INDIV_CONTRIB',
    'CAND_OFFICE_ST',
    'CAND_OFFICE_DISTRICT',
    'OTHER_POL_CMTE_CONTRIB',
    'POL_PTY_CONTRIB',
    'CVG_END_DT',
    'INDIV_REFUNDS',
    'CMTE_REFUNDS',
]

# we only care about candidate id, name, incumbency, party, state/district, and total receipts
# this will give all candidates, without win/loss results. we'll need to filter before display

DESIRED_HEADERS = [
    'CAND_ID',
    'CAND_NAME',
    'CAND_ICI',
    'CAND_PTY_AFFILIATION',
    'CAND_OFFICE_ST',
    'CAND_OFFICE_DISTRICT',
    'TTL_RECEIPTS',
]

from io import BytesIO, TextIOWrapper
from zipfile import ZipFile
from urllib.request import urlopen
import csv

csv.register_dialect('piped', delimiter='|', quoting=csv.QUOTE_NONE)

zip_resp = urlopen(ZIP_URL)
zip_file = ZipFile(BytesIO(zip_resp.read()))
in_file = zip_file.open(ZIP_NAME)
in_lines = TextIOWrapper(in_file).readlines()
in_reader = csv.DictReader(in_lines, dialect='piped', fieldnames=FULL_HEADERS)

def remove_titles(name):
    TITLES = ["MR", "MRS", "MS", "JR", "SR", 
        "HON", "HONORABLE", "SENATOR", "COL",
        "DR", "MD", "PHD", "PSY.D", "DDS"]
    name_parts = name.split(" ")
    if name_parts[-1].replace('.','') in TITLES:
        if name_parts[-2].replace('.','').replace(',','') in TITLES:
            return " ".join(name_parts[:-2])
        return " ".join(name_parts[:-1])
    else:
        return name

with open('../fec-candidates.csv', 'w') as out_file:
    out_writer = csv.DictWriter(out_file, fieldnames=DESIRED_HEADERS)
    out_writer.writeheader()
    for in_row in in_reader:
        out_row = {k: v for k, v in in_row.items() if k in DESIRED_HEADERS}
        # replace name titles which screw up our display
        out_row['CAND_NAME'] = remove_titles(out_row['CAND_NAME'])
        out_writer.writerow(out_row)
