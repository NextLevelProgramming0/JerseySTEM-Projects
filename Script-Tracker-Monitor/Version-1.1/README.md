# Script Tracker Monitor

## Overview

Script Tracker Monitor is a Google Apps Script and MySQL automation project developed for JerseySTEM's **Tech Business Process Automation (Tech.BPA)** team.

The project monitors the `Team_TECH_BPA.script_tracker` MySQL table to identify automation scripts that may require attention. It is designed to detect scripts that have not successfully executed within an expected period as well as scripts that have been marked inactive.

When an issue is identified, the monitoring logic prepares notifications that can be sent to the team's Slack channels, helping developers identify automation problems without manually reviewing individual scripts.

The repository includes multiple versions of the project to document its development from the initial design and requirements through database and Google Apps Script implementation.

---

# Version History

## `Version-1.1`

Version 1.1 represents the earlier stage of the project and documents the initial design, requirements, and planned implementation.

This version includes:

* Original BPA-736 project requirements
* Initial project configuration
* Early application design
* Supporting project documentation
* Initial planning for script monitoring and Slack notifications

The primary goal of this version was to establish how the monitoring system should identify automation issues and communicate those issues to the Tech.BPA team.

---

## `Version-1.2`

Version 1.2 expands the project from the initial design into a working database and Google Apps Script implementation.

This version introduces:

* `runner.js` for Google Apps Script monitoring and execution logic
* `script_tracker_alerts.mysql` for identifying scripts that require attention
* `tracker_table.mysql` for working with the script tracking data
* `Add_Team_TECH_BPA.script_tracker_Table_Features.mysql` for extending the existing tracker table
* Database support for tracking inactive scripts
* Monitoring of scripts that have not successfully executed within the defined time period
* Slack notification logic
* Direct links to affected scripts
* Logging and error-handling logic

Version 1.2 represents a major implementation step by connecting the database monitoring requirements with executable Google Apps Script logic.

---

# Architecture

The project follows a database-driven monitoring workflow:

```text
Scheduled Automation Scripts
            |
            v
Team_TECH_BPA.script_tracker
            |
            v
       MySQL Queries
            |
            v
Google Apps Script (runner.js)
            |
            v
   Monitoring / Validation
            |
            v
      Slack Notifications
```

The `script_tracker` table acts as the central source of information about automation script activity.

MySQL queries identify records that meet monitoring conditions, while Google Apps Script processes the results and prepares alerts for the Tech.BPA team.

---

# Features

## Script Monitoring

* Connects to the `Team_TECH_BPA` MySQL database
* Queries the `script_tracker` table
* Detects scripts that have not successfully executed within the expected period
* Detects scripts that have been marked inactive
* Organizes affected scripts for reporting
* Uses database timestamps and status information to determine script health

---

## Database Tracking

The project uses MySQL to maintain information about automation scripts and their execution status.

### Schema

```text
Team_TECH_BPA
```

### Table

```text
script_tracker
```

Monitoring data includes information such as:

* Script name
* Function name
* Last execution
* Last successful execution
* Status message
* Active or inactive status
* Inactive date information

This allows monitoring logic to determine whether an automation is operating normally or requires investigation.

---

## Inactive Script Tracking

Version 1.2 expands the script tracking system to support inactive scripts.

This allows scripts that are intentionally disabled, removed, or no longer expected to execute to be distinguished from scripts that unexpectedly stop running.

Tracking inactive status helps reduce false alerts while providing visibility into changes to the automation environment.

---

## Slack Notifications

The monitoring system is designed to generate Slack alerts when automation issues are detected.

Notifications can include:

* Scripts that have not run successfully within the expected period
* Scripts that have become inactive
* Script names and function information
* Direct links to affected scripts
* Information developers can use to begin troubleshooting

This reduces the need for developers to manually inspect the database or individual automation scripts to identify potential failures.

---

# Technologies

* Google Apps Script
* JavaScript
* MySQL
* SQL
* Slack API
* Google Workspace
* Git
* GitLab
* GitHub

---

# Project Files

## `runner.js`

Contains the Google Apps Script execution and monitoring logic.

Responsibilities include:

* Running script health checks
* Processing database query results
* Building notification messages
* Handling logging and errors
* Supporting Slack notifications

---

## `script_tracker_alerts.mysql`

Contains SQL queries used to identify scripts requiring attention.

The monitoring logic includes checks for:

* Scripts that have not successfully executed within the expected time period
* Scripts marked as inactive

---

## `tracker_table.mysql`

Contains SQL related to the `script_tracker` table and the data used by the monitoring system.

---

## `Add_Team_TECH_BPA.script_tracker_Table_Features.mysql`

Contains database changes used to extend the existing `Team_TECH_BPA.script_tracker` table with additional tracking capabilities required by the monitoring system.

These additions support improved tracking of script activity and inactive status.

---

# Workflow

1. Scheduled automation scripts update information stored in `Team_TECH_BPA.script_tracker`.
2. Monitoring queries examine the tracker table for scripts requiring attention.
3. SQL logic identifies scripts that have not successfully executed within the expected period.
4. Additional checks identify scripts that have been marked inactive.
5. Google Apps Script processes the database results.
6. Notification messages are generated for affected scripts.
7. Relevant script information and links are included in the alerts.
8. Notifications are sent to the appropriate Slack channel.
9. Results and errors are logged for troubleshooting and monitoring.

---

# Project Objectives

The project was developed to:

* Automate monitoring of scheduled scripts
* Detect automation failures earlier
* Identify inactive scripts
* Reduce manual script health checks
* Improve visibility into automation status
* Notify developers when automation issues require investigation
* Provide direct access to affected scripts
* Improve the operational reliability of JerseySTEM's automation environment

---

# Skills Demonstrated

This project demonstrates experience with:

* Backend Development
* JavaScript
* Google Apps Script
* MySQL
* SQL
* Database Design
* Database Querying
* Automation
* Script Monitoring
* Slack Integration
* API Integration
* Operational Monitoring
* Error Handling
* Logging and Debugging
* Git Version Control
* Incremental Software Development
* Agile Team Collaboration
* Code Review

---

# Development Approach

The repository preserves multiple versions of the project to demonstrate its development over time.

**Version 1.1** documents the earlier project requirements and initial design.

**Version 1.2** introduces the database modifications, SQL monitoring queries, and Google Apps Script implementation required to turn the design into a functional monitoring solution.

Maintaining these versions provides visibility into how the solution evolved from requirements and planning into implementation and testing.

---

# Future Enhancements

Potential improvements include:

* Configurable monitoring thresholds
* Additional notification channels
* Monitoring dashboards
* Automated retry logic
* Unit and integration testing
* Historical failure reporting
* Alert severity levels
* Performance optimization
* Centralized monitoring for additional Tech.BPA automation systems

---

# Author

**Darius Quick**

Contributor to JerseySTEM's **Tech Business Process Automation (Tech.BPA)** team.

This project was developed as part of JerseySTEM's business process automation work to improve monitoring and operational visibility for scheduled automation scripts.
