# Script Tracker Monitor Version 1.5

This Google Apps Script helps the JerseySTEM Tech.BPA team spot automations that may need attention. It checks the script tracker for automations whose last successful run was more than three days ago. When it finds matches, it sends one Slack summary listing the affected scripts, their functions, and when they last ran successfully.

## Files

- [checkThreeDaysNotRunning.js](checkThreeDaysNotRunning.js) contains the monitor, its entry point, and a test function.
- [appsscript.json](appsscript.json) defines the Apps Script runtime and library dependencies.

## Run and test

Open the project in Google Apps Script with access to the dependencies in the manifest. Run `test()` to query the tracker and review the results in the execution log. If the check finds matches, test mode logs the proposed alert without posting it to Slack.

For scheduled runs, configure a time-driven trigger for `runcheckThreeDaysNotRunning`.

See the [project README](../README.md) for the broader project history.
