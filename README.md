# Script Tracker Monitor

## Overview

Script Tracker Monitor is a Google Apps Script application developed for JerseySTEM's **Tech Business Process Automation (Tech.BPA)** team.

The application monitors the `Team_TECH_BPA.script_tracker` MySQL table to identify automation scripts that require attention and notifies the team's Slack channel when issues are detected.

The goal is to improve visibility into automation health by alerting the team when scripts have stopped running or become inactive, allowing issues to be investigated before they impact business processes.

This repository is organized to demonstrate both the development process and the completed solution.

---

# Repository Branches

## `Version 1.1`

This branch contains my work in progress while developing the project.

It includes:

- Previous implementation of the Google Apps Script
- Incremental feature development
- Ongoing debugging and testing
- Code before final review and integration

This branch is intended to show my development process as I work through the assignment.

---

## `main`

This branch contains the completed version of the project after development has been finalized.

The completed project includes:

- Monitoring scripts that have not executed for three or more days
- Monitoring scripts that have become inactive
- Slack notification generation
- Direct links to affected scripts
- Logging and error handling
- Production-ready implementation following code review

---

# Features

### Script Monitoring

- Connects to the Team_TECH_BPA MySQL database
- Detects scripts that have not run for three or more days
- Detects scripts marked as inactive
- Organizes affected scripts for reporting

---

### Slack Notifications

- Generates Slack alerts for automation issues
- Reports overdue scripts
- Reports inactive scripts
- Supports direct links to affected scripts
- Reduces manual monitoring

---

## Technologies

- Google Apps Script
- JavaScript
- MySQL
- SQL
- Slack API
- Google Workspace
- Git
- GitLab

---

## Database

Schema

```
Team_TECH_BPA
```

Table

```
script_tracker
```

Current monitoring includes:

- Script name
- Function name
- Last execution
- Last successful execution
- Status message
- Active/Inactive status

---

## Workflow

1. Connect to the MySQL database.
2. Query the `script_tracker` table.
3. Identify scripts that have not run for three days.
4. Identify inactive scripts.
5. Generate Slack notification messages.
6. Send alerts to the appropriate Slack channel.
7. Log results for debugging and monitoring.

---

## Project Objectives

- Automate monitoring of scheduled scripts
- Reduce manual health checks
- Improve visibility into automation failures
- Notify developers of issues quickly
- Support operational reliability

---

## Skills Demonstrated

- Backend Development
- Database Querying
- Google Apps Script
- SQL
- MySQL
- Automation
- Slack Integration
- Operational Monitoring
- Logging and Debugging
- Git Version Control
- Agile Team Collaboration

---

## Future Enhancements

Potential improvements include:

- Configurable alert thresholds
- Additional notification channels
- Dashboard reporting
- Retry logic
- Unit testing
- Performance optimizations

---

## Author

**Darius Quick**

Contributor to the JerseySTEM **Tech Business Process Automation (Tech.BPA)** team.
