# JerseySTEM Projects

## Overview

This repository contains software development and automation projects I completed as a volunteer developer with **JerseySTEM's Tech Business Process Automation (Tech.BPA) team**.

My work focuses on improving internal automation processes, database reliability, script monitoring, and data extraction using technologies such as **MySQL, Google Apps Script, JavaScript, Regular Expressions, Git, GitHub, and GitLab**.

This repository combines my JerseySTEM projects into one location to demonstrate the development, database, automation, and problem-solving experience I gained while contributing to the organization.

---

## Projects

### 1. BlinkURL MySQL Query

**Folder:** [`BlinkURL-My-SQL-Query`](./BlinkURL-My-SQL-Query)

The BlinkURL project focuses on extracting and formatting document metadata stored within JerseySTEM's MySQL database.

I developed a MySQL query that uses **Regular Expressions (Regex)** to extract information from JerseySTEM document records and transform it into structured data that can be used by the organization's automation processes.

### Key Features

* Queries document information from the `GAT_ETL.Drive_Files` database table
* Extracts JerseySTEM subdomains from document aliases
* Extracts document aliases from embedded JerseySTEM URLs
* Parses Google Drive document IDs from stored links
* Generates usable Google Docs URLs from extracted document IDs
* Uses `REGEXP_REPLACE` and Regex capture groups for data extraction
* Includes validation logic to improve consistency of extracted metadata
* Developed and reviewed through JerseySTEM's GitLab workflow

### Technologies

* MySQL
* SQL
* Regular Expressions (Regex)
* Git
* GitLab

---

### 2. Script Tracker Monitor

**Folder:** [`Script-Tracker-Monitor`](./Script-Tracker-Monitor)

Script Tracker Monitor is an automation solution developed for JerseySTEM's **Tech.BPA team** to improve visibility into the health of the organization's automation scripts.

The application monitors JerseySTEM's MySQL script tracking data and identifies scripts that may require attention. When problems are detected, alerts can be sent to the team's Slack channels so that failed, outdated, or inactive automation scripts can be investigated.

### Key Features

* Monitors the `Team_TECH_BPA.script_tracker` MySQL table
* Detects automation scripts that have not run successfully within the expected timeframe
* Identifies inactive scripts
* Tracks script activity using fields such as:

  * `last_run`
  * `last_success`
  * `is_active`
  * `inactive_date`
* Generates Slack alerts for scripts requiring attention
* Provides links to affected scripts when available
* Integrates MySQL monitoring with Google Apps Script
* Supports automated execution through Google Apps Script triggers
* Uses JerseySTEM's existing automation libraries and infrastructure

### Technologies

* JavaScript
* Google Apps Script
* MySQL
* SQL
* Slack Integration
* Git
* GitLab

---

## Repository Structure

```text
JerseySTEM-Projects/
│
├── BlinkURL-My-SQL-Query/
│   ├── README.md
│   └── ...
│
├── Script-Tracker-Monitor/
│   ├── README.md
│   └── ...
│
└── README.md
```

Each project directory contains the files and documentation associated with that project.

---

## Development Workflow

These projects were developed as part of my work with JerseySTEM's **Tech Business Process Automation (Tech.BPA)** team.

My development workflow included:

1. Reviewing assigned automation or database tasks
2. Investigating JerseySTEM's existing code and database structure
3. Developing and testing solutions
4. Using Git for source control
5. Creating development branches for assigned work
6. Submitting changes through GitLab merge requests
7. Participating in team code reviews
8. Updating solutions based on feedback
9. Integrating approved changes into JerseySTEM's automation repository

This experience provided practical exposure to working with an existing production codebase rather than developing projects entirely from scratch.

---

## Skills Demonstrated

These projects demonstrate experience with:

* Backend automation development
* MySQL database queries
* SQL data extraction and transformation
* Regular Expressions
* Google Apps Script
* JavaScript
* Slack integrations
* Database-driven monitoring
* Debugging existing code
* Working with legacy and existing systems
* Git version control
* GitHub and GitLab
* Branch-based development
* Merge requests
* Code reviews
* Collaborative software development

---

## About JerseySTEM

JerseySTEM is a nonprofit organization focused on providing STEM education opportunities and programs.

My contributions were completed as part of the **Tech Business Process Automation (Tech.BPA)** team, where I worked on software and database automation tasks supporting the organization's internal processes.

---

## Purpose of This Repository

This repository serves as a portfolio of my JerseySTEM software development work.

The individual projects demonstrate practical experience working with databases, automation systems, existing codebases, source control, and collaborative development workflows.

For additional projects, visit my GitHub profile:

**GitHub:** `NextLevelProgramming0`
