# Script Tracker Monitor - Version 1.4

Snapshot pulled with `clasp pull` from the current editable Apps Script source on September 28, 2026.

Source: https://script.google.com/home/projects/10wYOW-IUo8RHZc6lvl4lTe_DVklB0O9Ps9cGhMOXB6PKoIOSCAXumPrw/edit

`Version-1.4` is this repository's version label, not a numbered Apps Script deployment.

## Files

- `checkThreeDaysNotRunning.js`: checks script tracker entries whose last successful run is older than three days and reports them to the automation-errors Slack channel.
- `appsscript.json`: runtime, timezone, and external library dependencies returned by Clasp.
- `.clasp.json`: connects this directory to the source Apps Script project.

The two downloaded files are preserved unchanged. Previous version folders are unchanged. This snapshot does not include library source code, script properties, or installed triggers.

## Refresh

From this directory, with Clasp authenticated to an account that can access the project:

```sh
clasp pull
```

## Validation

JavaScript syntax and JSON parsing were checked locally. The script was not executed against MySQL or Slack, and no Apps Script push or deployment was performed.
