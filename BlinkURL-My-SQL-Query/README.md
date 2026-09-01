# Blink Document Alias Query

## Overview

This project contains a MySQL query developed for JerseySTEM's **Tech Business Process Automation (Tech.BPA)** team.

The query extracts Blink document metadata from the `GAT_ETL.Drive_Files` table using MySQL regular expressions. It identifies document subdomains and aliases embedded in the `TITLE` field and generates a standardized Google Docs URL from the document ID stored in `OPEN_LINK`.

This query was developed as part of JerseySTEM's automation platform to help standardize document information and simplify access to Blink documentation.

---

## Features

- Extracts the Blink **Subdomain** from document metadata.
- Extracts the Blink **Alias** using MySQL regular expressions.
- Generates a direct Google Docs URL from the stored document ID.
- Filters results to only documents containing a valid Blink alias.
- Uses MySQL built-in regular expression functions for efficient parsing.

---

## Technologies

- MySQL
- Regular Expressions (`REGEXP_REPLACE`)
- SQL String Functions

---

## Input

### Table

```
GAT_ETL.Drive_Files
```

### Columns Used

| Column | Description |
|---------|-------------|
| TITLE | Contains the Blink alias metadata embedded in the document title. |
| OPEN_LINK | Contains the Google Drive URL used to generate a direct Google Docs link. |

---

## Output

The query returns three columns:

| Column | Description |
|---------|-------------|
| Subdomain | Blink subdomain extracted from the TITLE field. |
| Alias | Blink document alias extracted from the TITLE field. |
| URL | Direct Google Docs URL generated from the document ID. |

Example output:

| Subdomain | Alias | URL |
|------------|-------|-----|
| data | Darius | https://docs.google.com/document/d/.../edit |

---

## How It Works

### Subdomain Extraction

The query uses a regular expression to locate the Blink URL inside the document title and extracts the text between:

```
https://
```

and

```
.jerseystem.org
```

---

### Alias Extraction

A second regular expression extracts everything after

```
.jerseystem.org/
```

until the closing parenthesis, producing the document alias.

---

### Google Docs URL Generation

The query extracts the Google Drive document ID from the `OPEN_LINK` field and constructs a standard Google Docs URL in the following format:

```
https://docs.google.com/document/d/{DocumentID}/edit
```

---

## Purpose

This query supports JerseySTEM's automation platform by transforming document metadata into structured information that can be consumed by other automation processes. It reduces manual effort when identifying Blink documents and provides direct links to the associated Google Docs.

---

## Future Improvements

Potential enhancements include:

- Additional validation for malformed Blink URLs
- Support for additional document formats
- Expanded metadata extraction
- Integration into larger automation workflows

---

## Author

Developed by Darius Quick

Contributor to the JerseySTEM Tech Business Process Automation (Tech.BPA) team.
Developed by Darius Quick

Contributor to the JerseySTEM Tech Business Process Automation (Tech.BPA) team.
