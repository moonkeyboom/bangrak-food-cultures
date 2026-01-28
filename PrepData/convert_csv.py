#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Convert restaurant CSV to backend import format
"""

import csv
import sys

def convert_csv(input_file, output_file):
    """
    Convert simple CSV format to backend import format

    Input format:
    ,แขวง,ประเภทอาหาร,Restaurant Name,Link,description

    Output format (backend expects):
    ,zone,type,location,nameTh,link,type,notes,?,?,?,licenseVolume,licenseNumber,licenseYear,?,licenseHolder
    """

    with open(input_file, 'r', encoding='utf-8') as infile, \
         open(output_file, 'w', encoding='utf-8', newline='') as outfile:

        reader = csv.reader(infile)
        writer = csv.writer(outfile, quoting=csv.QUOTE_MINIMAL)

        # Skip input header and write output header
        next(reader, None)  # Skip header
        writer.writerow([
            '', 'zone', '', 'location', 'nameTh', 'link', 'type', '', '', '',
            'notes', '', 'licenseVolume', 'licenseNumber', 'licenseYear', '', 'licenseHolder'
        ])

        row_count = 0
        for row in reader:
            if len(row) < 5:
                print(f"Skipping row {row_count + 1}: insufficient columns")
                row_count += 1
                continue

            # Extract data from input CSV
            # Input format: ,แขวง,ประเภทอาหาร,Restaurant Name,Link,description
            zone = row[1] if len(row) > 1 else ''
            cuisine_type = row[2] if len(row) > 2 else ''
            name_th = row[3] if len(row) > 3 else ''
            link = row[4] if len(row) > 4 else ''
            description = row[5] if len(row) > 5 else ''

            # Generate a simple address from zone
            address = f"แขวง{zone} บางรัก"

            # Skip URL to avoid CSV parsing issues - will update later via admin
            link = ""

            # Write output in backend format
            # Backend expects: line[1]=zone, line[4]=nameTh, line[5]=location, line[6]=link, line[7]=type, line[10]=notes
            writer.writerow([
                '',                    # col 0
                zone,                  # col 1: zone
                '',                    # col 2
                address,               # col 3: location (address)
                name_th,               # col 4: nameTh
                link,                  # col 5: link (googleMapsUrl)
                cuisine_type,          # col 6: type
                '',                    # col 7
                '',                    # col 8
                '',                    # col 9
                description,           # col 10: notes
                '',                    # col 11
                '',                    # col 12: licenseVolume
                '',                    # col 13: licenseNumber
                '',                    # col 14: licenseYear
                '',                    # col 15
                ''                     # col 16: licenseHolder
            ])

            row_count += 1

        print(f"[OK] Converted {row_count} rows")
        print(f"[IN] Input: {input_file}")
        print(f"[OUT] Output: {output_file}")

if __name__ == "__main__":
    input_csv = "สำเนาของ Edit Restaurant List  - Final restaurant list.csv"
    output_csv = "restaurants_import.csv"

    try:
        convert_csv(input_csv, output_csv)
        print(f"\n[DONE] Ready to import: {output_csv}")
    except FileNotFoundError:
        print(f"[ERROR] File '{input_csv}' not found")
        sys.exit(1)
    except Exception as e:
        print(f"[ERROR] {e}")
        sys.exit(1)
