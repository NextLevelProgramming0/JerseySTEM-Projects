# Script Tracker Monitor

## Overview

Script Tracker Monitor is a Google Apps Script and MySQL automation project developed for JerseySTEM's **Tech Business Process Automation (Tech.BPA)** team.

The project monitors the `Team_TECH_BPA.script_tracker` MySQL table to identify automation scripts that may require attention.

The monitoring system currently checks for:

* Scripts that have not run successfully for **3 or more days**
* Scripts that have been marked **inactive**
* Script tracking information that can help developers identify the affected automation
* Direct links to affected scripts for faster investigation

When an issue is detected, Google Apps Script processes the database results and generates Slack notifications so the Tech.BPA team can investigate automation problems without manually reviewing the `script_tracker` table.

The repository preserves multiple versions of the project to demonstrate how the solution evolved from initial requirements and database design into a working monitoring and alerting system.

---

# Version History

## `Version-1.1`

Version 1.1 represents the initial development stage of the Script Tracker Monitor project.

This version focused primarily on defining the requirements and designing how the monitoring system would work.

This version includes:

* Original BPA-736 project requirements
* Initial project configuration
* Early application design
* Supporting project documentation
* Initial planning for script monitoring
* Initial planning for Slack notifications
* Research into the existing `Team_TECH_BPA.script_tracker` structure

The primary goal of Version 1.1 was to establish how automation scripts could be monitored through the existing script tracking database.

---

## `Version-1.2`

Version 1.2 expanded the project from the initial design into a working MySQL and Google Apps Script implementation.

This version introduced:

* Google Apps Script monitoring logic
* MySQL queries for identifying scripts requiring attention
* Database changes for supporting inactive scripts
* `is_active` tracking
* `inactive_date` tracking
* Detection of scripts that have not successfully executed within the expected period
* Detection of scripts that have been marked inactive
* Slack notification logic
* Direct links to affected automation scripts
* Logging and error handling

Version 1.2 represented the first major implementation of the monitoring system by connecting MySQL script tracking data with Google Apps Script and Slack notifications.

---

## `Version-1.3`

Version 1.3 represents the updated implementation of the Script Tracker Monitor following continued development and code review within JerseySTEM's Tech.BPA automation repository.

The monitoring logic was reorganized so script tracker checks are handled by dedicated functions rather than keeping all monitoring behavior inside the runner logic.

### Major Updates

Version 1.3 includes:

* Dedicated `CheckScriptTracker.js` monitoring logic
* Updated script tracker alert functions
* Detection of scripts that have not run successfully for **3 or more days**
* Detection and reporting of inactive scripts
* Direct script links included in Slack alerts
* Improved separation between monitoring logic and execution wrappers
* Updated script tracker database support
* Updated Tech.BPA automation files
* Improved Slack alert messages
* Improved error handling and logging
* Integration with JerseySTEM's existing automation infrastructure
* Continued Git/GitLab development and code review workflow

The updated implementation makes the monitoring system easier to maintain by separating individual script tracker checks from the functions responsible for executing them.

---

# Architecture

The project follows a database-driven monitoring workflow:

```text
JerseySTEM Automation Scripts
            |
            v
Team_TECH_BPA.script_tracker
            |
            v
      MySQL Queries
            |
            v
   CheckScriptTracker.js
            |
            v
 Monitoring / Validation
            |
            v
     Slack Notifications
```

The `Team_TECH_BPA.script_tracker` table acts as the central source of information about automation script activity.

Automation scripts update tracking information in the database as they execute.

The monitoring logic queries this information to identify scripts that meet alert conditions.

Google Apps Script then processes the results, generates links to the affected scripts, and prepares Slack notifications for the Tech.BPA team.

---

# Features

## Script Monitoring

The monitoring system connects to the `Team_TECH_BPA` MySQL database and queries the `script_tracker` table to determine whether automation scripts require attention.

The monitoring logic can:

* Query the `script_tracker` table
* Check script execution history
* Check the last successful execution
* Identify scripts that have not run successfully for 3 or more days
* Identify scripts marked inactive
* Process multiple affected scripts
* Generate direct links to affected scripts
* Organize affected scripts into Slack notifications

---

## Three-Day Script Monitoring

One of the primary monitoring checks identifies automation scripts that have not successfully executed for **3 or more days**.

This helps identify scripts that may have:

* Failed unexpectedly
* Stopped executing
* Encountered configuration problems
* Been removed without their tracker information being updated
* Become obsolete but remain marked as active

When these scripts are detected, the system prepares an alert containing the affected scripts and links that developers can use to investigate them.

The alert also informs the team that scripts that no longer exist should be marked inactive.

---

## Inactive Script Tracking

The project extends the existing script tracking system with additional information for determining whether an automation is still active.

The tracking system supports fields including:

```text
is_active
inactive_date
```

The `is_active` field allows an automation to be explicitly marked as active or inactive.

The `inactive_date` field provides additional information about when an automation became inactive.

This allows intentionally disabled or removed scripts to be distinguished from scripts that unexpectedly stop executing.

Inactive tracking helps reduce unnecessary alerts while improving visibility into changes within JerseySTEM's automation environment.

---

# Database Tracking

The project uses the existing JerseySTEM MySQL environment to maintain information about automation scripts and their execution status.

## Schema

```text
Team_TECH_BPA
```

## Table

```text
script_tracker
```

The monitoring system uses script tracking information such as:

* Script name
* Function name
* Last execution
* Last successful execution
* Status message
* Active or inactive status
* Inactive date
* Information required to locate the affected automation

This information allows the monitoring logic to determine whether an automation is operating normally or requires investigation.

---

# Slack Notifications

The monitoring system generates Slack alerts when script tracker conditions require attention.

Notifications can identify:

* Scripts that have not run successfully for 3 or more days
* Scripts that have been marked inactive
* Script names
* Script information
* Direct links to affected scripts
* The number of scripts requiring attention

For scripts that have not successfully executed for three or more days, the notification explains that the scripts should be reviewed and marked inactive if they no longer exist.

This provides the Tech.BPA team with actionable information directly inside Slack instead of requiring developers to manually inspect the database.

---

# Google Apps Script Monitoring

## `CheckScriptTracker.js`

`CheckScriptTracker.js` contains the primary monitoring logic for evaluating the script tracker database and generating alerts.

The file is responsible for tasks such as:

* Querying script tracker information
* Processing database results
* Identifying scripts that meet monitoring conditions
* Building collections of affected scripts
* Generating script links
* Building Slack notification messages
* Reporting scripts that have not successfully run for 3 or more days
* Reporting inactive scripts
* Supporting logging and error handling

Separating this logic into a dedicated file improves maintainability and makes the individual monitoring checks easier to understand and update.

---

# Script Tracker Functions

The monitoring system uses dedicated functions for the different tracker checks.

## Three-Day Monitoring

```javascript
checkThreeDaysNotRunning()
```

This function identifies scripts that have not successfully executed for 3 or more days and prepares the corresponding Slack alert.

The associated runner function is:

```javascript
runcheckThreeDaysNotRunning(e)
```

---

## Inactive Script Monitoring

```javascript
checkRunScriptsInactive()
```

This function handles monitoring related to scripts that have been marked inactive.

The associated runner function is:

```javascript
runcheckRunScriptsInactive(e)
```

Using separate monitoring and runner functions allows the script tracker logic to integrate with JerseySTEM's existing Google Apps Script execution framework while keeping the actual monitoring behavior isolated.

---

# Project Workflow

The current monitoring workflow operates as follows:

1. JerseySTEM automation scripts execute through Google Apps Script.
2. Script execution information is recorded in `Team_TECH_BPA.script_tracker`.
3. Monitoring functions query the tracker database.
4. The system evaluates the `last_success` information for tracked scripts.
5. Scripts that have not successfully executed for 3 or more days are identified.
6. Additional monitoring logic identifies scripts that have been marked inactive.
7. Google Apps Script processes the returned database records.
8. Direct links are generated for affected scripts.
9. Slack messages are constructed containing the affected automation information.
10. Alerts are sent to the appropriate JerseySTEM Slack channel.
11. Logging and error-handling logic records execution information for troubleshooting.

---

# Technologies

* Google Apps Script
* JavaScript
* MySQL
* SQL
* Slack API
* Google Workspace
* Regular Expressions
* Git
* GitLab
* GitHub

---

# JerseySTEM Integration

The project was developed as part of JerseySTEM's existing automation environment rather than as a standalone monitoring application.

The implementation works with components of the existing Tech.BPA infrastructure, including:

```text
TECH/BPA/ScriptTrackerAlerts/
TECH/BPA/libraries/Runner/
Team_TECH_BPA.script_tracker
```

Changes to the monitoring system were developed through JerseySTEM's GitLab workflow and incorporated into the organization's automation repository through code review.

This required working with existing code, database structures, shared libraries, and automation conventions rather than designing the application completely in isolation.

---

# Project Objectives

The Script Tracker Monitor was developed to:

* Automate monitoring of JerseySTEM's scheduled scripts
* Detect automation failures earlier
* Identify scripts that have stopped executing successfully
* Track inactive automation scripts
* Reduce manual database monitoring
* Reduce unnecessary alerts for intentionally inactive scripts
* Improve visibility into automation health
* Notify developers when scripts require investigation
* Provide direct access to affected scripts
* Integrate monitoring into JerseySTEM's existing automation infrastructure
* Improve the operational reliability of Tech.BPA automation

---

# Skills Demonstrated

This project demonstrates experience with:

* Backend Development
* JavaScript
* Google Apps Script
* MySQL
* SQL
* Database Querying
* Database Modification
* Automation Development
* Script Monitoring
* Slack Integration
* API Integration
* Operational Monitoring
* Error Handling
* Logging and Debugging
* Regular Expressions
* Existing Codebase Integration
* Git Version Control
* GitLab
* Merge Requests
* Incremental Software Development
* Agile Team Collaboration
* Code Review

---

# Development Approach

The repository preserves multiple versions of the project to demonstrate how the solution evolved throughout development.

**Version 1.1** documents the original BPA-736 requirements, initial design, and planning for the monitoring system.

**Version 1.2** introduces the database modifications, MySQL monitoring queries, inactive-script tracking, and initial Google Apps Script implementation.

**Version 1.3** reflects the more complete JerseySTEM implementation, including dedicated `CheckScriptTracker.js` monitoring logic, updated runner integration, Slack alert improvements, direct script links, and changes made as part of the Tech.BPA automation repository workflow.

The version history demonstrates the progression from understanding an existing automation system and its requirements to developing, testing, reviewing, and integrating a monitoring solution into an existing organizational codebase.

---

# Future Enhancements

Potential future improvements could include:

* Configurable monitoring thresholds
* Additional notification channels
* Monitoring dashboards
* Automated retry logic
* Expanded unit and integration testing
* Historical failure reporting
* Alert severity levels
* Performance optimization
* Additional script health metrics
* Centralized monitoring for additional Tech.BPA automation systems

---

# Author

**Darius Quick**

Contributor to JerseySTEM's **Tech Business Process Automation (Tech.BPA)** team.

This project was developed as part of JerseySTEM's business process automation work to improve monitoring and operational visibility for scheduled automation scripts.
