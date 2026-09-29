# Script Tracker Monitor - Version 1.4

Snapshot pulled with `clasp pull` from the current editable Google Apps Script source on September 28, 2026.

Source: https://script.google.com/home/projects/10wYOW-IUo8RHZc6lvl4lTe_DVklB0O9Ps9cGhMOXB6PKoIOSCAXumPrw/edit

`Version-1.4` is the version label used in this GitHub repository. It is not a numbered Google Apps Script deployment.

## Overview

Version 1.4 contains the current Google Apps Script implementation for monitoring entries in the JerseySTEM MySQL script tracker.

The script connects to the `Team_TECH_BPA.script_tracker` table using a read-only database connection and checks for scripts whose `last_success` value is more than three days old.

Matching scripts are collected and formatted into a report containing the script name and its last successful run time.

If the script is running in test mode, the report is written to the Apps Script execution log. Otherwise, the report is sent to the `automation-errors` Slack channel.

The database connection is closed in a `finally` block after the monitoring process completes.

## Main Workflow

```text
Runner
  |
  v
checkThreeDaysNotRunning()
  |
  v
Read Team_TECH_BPA.script_tracker
  |
  v
Find scripts with last_success older than 3 days
  |
  v
Store matching scripts in a JavaScript array
  |
  v
Format script names and last-success timestamps
  |
  v
Test Mode -> Logger
Normal Mode -> Slack automation-errors
  |
  v
Return result count
  |
  v
Close database connection
```

## Files

- `checkThreeDaysNotRunning.js`
  - Contains the script-monitoring logic.
  - Uses `Runner.run()` as the entry point.
  - Opens a read-only MySQL connection.
  - Queries `Team_TECH_BPA.script_tracker`.
  - Finds scripts whose `last_success` is older than three days.
  - Stores matching results in a JavaScript array.
  - Builds a Slack report containing the script name and last successful execution time.
  - Logs the report during test mode.
  - Sends the report to the `automation-errors` Slack channel during normal execution.
  - Closes the database connection after processing.

- `appsscript.json`
  - Google Apps Script project manifest.
  - Uses the V8 runtime.
  - Uses the `America/New_York` timezone.
  - Uses Stackdriver exception logging.
  - Defines the external Apps Script libraries required by the project.

- `.clasp.json`
  - Connects this local Version 1.4 directory to the original Google Apps Script project so the source can be synchronized using Clasp.

- `Jira BPA-736.png`
  - Screenshot associated with Jira ticket BPA-736 and the Script Tracker Monitor work.

- `README.md`
  - Documents the Version 1.4 snapshot and its purpose.

## External Apps Script Libraries

The Apps Script manifest references the following libraries:

- `Database`
- `SlackIntegration`
- `OAuth2`
- `Slack`
- `Runner`
- `Test`

These libraries are referenced by the Apps Script project but their source code is not included in this repository snapshot.

## MySQL Query

The monitoring function reads from:

```sql
Team_TECH_BPA.script_tracker
```

The main condition is:

```sql
WHERE last_success < DATE_SUB(NOW(), INTERVAL 3 DAY)
```

This identifies script tracker records whose last successful execution occurred more than three days ago.

The JavaScript code uses the following values from the returned records:

```text
name
function_name
last_run
last_success
message
```

## Slack Reporting

If matching scripts are found, Version 1.4 creates one combined report.

Each script is formatted similar to:

```text
ScriptName | Last success: YYYY-MM-DD HH:MM:SS
```

The report begins with the number of scripts found:

```text
There are [count] MySQL scripts that have not run successfully for 3 or more days.
Please review them:
```

During normal execution, the report is sent to:

```text
automation-errors
```

During test execution, the message is written to the Apps Script log instead of being posted to Slack.

## Test Mode

The `test()` function enables forced test mode before running the monitoring function:

```javascript
Test.setForceTest(true);
```

It then runs:

```javascript
checkThreeDaysNotRunning();
```

The returned result is written to the Apps Script logger.

Test mode is disabled in a `finally` block:

```javascript
Test.setForceTest(false);
```

This helps prevent a test run from intentionally sending the normal Slack notification.

## Refreshing the Snapshot

From the `Version-1.4` directory, authenticate Clasp with an account that has access to the Apps Script project and run:

```sh
clasp pull
```

This downloads the current editable source from Google Apps Script into the local directory.

## Snapshot Notes

This folder represents a source snapshot of the editable Apps Script project.

It does not include:

- Source code for external Apps Script libraries
- Apps Script project properties
- Installed triggers
- Stored credentials or secrets
- MySQL database contents
- Slack workspace configuration

Previous version folders in this repository remain separate so changes between versions can be reviewed.

## Validation

The files in this folder represent the source pulled from the Apps Script project.

JavaScript syntax and JSON parsing were checked locally.

The repository snapshot was not used to:

- Execute the monitoring process against the production MySQL database
- Send a production Slack message
- Push changes back to Apps Script
- Create a Google Apps Script deployment
