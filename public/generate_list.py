import pandas as pd
import json
import openpyxl

# Load Excel file (replace with your actual filename)
df = pd.read_excel("protein_sequence_forwebsite.xlsx")

# Rename columns explicitly for clarity
df.columns = ["sequence", "pdbId", "cyclisation"]

# Convert DataFrame rows into a structured JSON
json_records = []
for _, row in df.iterrows():
    pdb_id = str(row["pdbId"]).strip()
    pdb_filename = pdb_id if pdb_id.endswith('.pdb') else f"{pdb_id}.pdb"

    json_records.append({
        "sequence": row["sequence"],
        "pdbId": pdb_id,
        "cyclisation": row["cyclisation"],
        "pdbFile": f"/pdb_files/{pdb_filename}"
    })

# Write to pdb_sequences.json
with open("pdb_sequences.json", "w") as f:
    json.dump(json_records, f, indent=4)

print("pdb_sequences.json created successfully!")
