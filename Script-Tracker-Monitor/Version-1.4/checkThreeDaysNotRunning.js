function runcheckThreeDaysNotRunning(e) {
  Runner.run(
    "Check for MySQL scripts that have not run in the past three days and alert the responsible team",
    () => checkThreeDaysNotRunning(e),
    e
  );
}

function checkThreeDaysNotRunning(e) {
  const table = "Team_TECH_BPA.script_tracker";
  const schema = "Team_TECH_BPA";
  const slackChannel = "automation-errors";

  const connection = Database.getReadOnlySQLConnection(schema);

  try {
    const inactiveScriptResults = Database.bulkRead(
      connection,
      `
        select *
        FROM ${table}
        WHERE last_success < DATE_SUB(NOW(), INTERVAL 3 DAY)
      `,
      [
        "name",
        "function_name",
        "last_run",
        "last_success",
        "message"
      ]
    );

    const threeDaysNotRunning = [];
    let count = 0;

    for (const inactiveScript of inactiveScriptResults) {
      count++;

      threeDaysNotRunning.push({
        name: inactiveScript.name,
        functionName: inactiveScript.function_name,
        lastRun: inactiveScript.last_run,
        lastSuccess: inactiveScript.last_success,
        message: inactiveScript.message
      });
    }


    let notificationCount = 0;

    if (threeDaysNotRunning.length > 0) {
      try {
        const scriptLinks =
          threeDaysNotRunning
            .map(
              (scriptInfo) => {
                return (
                  `${scriptInfo.name}` +
                  ` | Last success: ${scriptInfo.lastSuccess}`
                );
              }
            )
            .join("\n");


        const slackMessage =
          `❌ There are ${threeDaysNotRunning.length} MySQL scripts ` +
          `that have not run successfully for 3 or more days. ` +
          `Please review them:\n\n` +
          scriptLinks;


        if (Test.isTest()) {
          Logger.log(
            `Post to ${slackChannel}:\n${slackMessage}`
          );
        } else {
          Slack.postMessageToChannel(
            slackChannel,
            slackMessage
          );

        notificationCount += 1;
      }

      } catch (e) {
        Logger.log(
          `❌ Error sending report to slack channel ` +
          `${slackChannel}: ${e.message}`
        );
      }

      Utilities.sleep(1100);
    }


    if (notificationCount > 0) {
      Logger.log(
        `Sent ${notificationCount} notifications to ${slackChannel}`
      );
    }


    return (
      `Found ${count} scripts that have not ` +
      `run successfully for 3 or more days`
    );

  } finally {
    connection.close();
  }
}

function test() {
  Test.setForceTest(true);

  try {
    Logger.log(
      checkThreeDaysNotRunning()
    );

  } finally {
    Test.setForceTest(false);
  }
}