# Script Tracker Monitor - Version 1.5

Snapshot pulled with `clasp pull` from the editable Google Apps Script source. `Version-1.5` is the snapshot label used in this repository.

## Overview

Version 1.5 monitors JerseySTEM automations whose last successful run was more than three days ago. It uses a read-only connection to the MySQL script tracker.

## Main Workflow

```text
Runner entry point
  -> Read the script tracker
  -> Find scripts with a last success older than three days
  -> Format one report when matches exist
  -> Log the report in test mode or post it to Slack in normal mode
  -> Close the database connection
```

Use `runcheckThreeDaysNotRunning` as the handler when configuring a time-driven trigger.

## Files

- [checkThreeDaysNotRunning.js](checkThreeDaysNotRunning.js) contains the monitor, runner entry point, and test function.
- [appsscript.json](appsscript.json) defines the Apps Script runtime and dependencies.

## External Apps Script Libraries

The manifest specifies the shared dependencies for database access, execution, Slack reporting, and testing. The Apps Script account running the monitor needs access to those dependencies.

## MySQL Query

The query compares each recorded last successful run with the database's current time minus three days. The comparison is strict and rows without a recorded success timestamp are excluded.

## Slack Reporting

When the query finds matches, the monitor sends a single summary with the total count and a line for each script. Version 1.5 includes the function name alongside the script name and last successful run time.

## Test Mode

Run `test()` in the Apps Script editor. It queries the tracker and logs the result count and any proposed Slack report. Test mode suppresses the Slack post.

## Refreshing the Snapshot

With Clasp authenticated and a local `.clasp.json` linked to the Apps Script project, run `clasp pull` from the snapshot directory. Review the resulting source and manifest changes before committing them.

## Snapshot Notes

See the [project README](../README.md) for the broader project history.

## Validation

To verify the monitor in Apps Script, run `test()` and check that the execution log includes a match count. If there are matches, check that each report line includes the script name, function name, and last successful run time.
