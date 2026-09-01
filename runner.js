let LOGS_CHANNEL = "automation-logs";
let ERROR_CHANNEL = "automation-errors";

/**
 * Run the function and report the returned message in Slack channel
 * #automation-logs.
 *
 * On an exception, report the message in the log and in
 * #automation-logs and #automation-errors.
 *
 * @param {string} message - The message to use on error
 * @param {function} f - The function to run
 * @param {Object} event - Trigger event
 */
function run(message, f, event) {
  try {
    const successMessage = f();

    if (successMessage) {
      message = successMessage;
    }

    success(message, event);

  } catch (e) {
    const errorMessage = e.message ?? e;

    Logger.log(
      "Error: " +
      errorMessage +
      "\n" +
      Logger.getLog()
    );

    error(
      message,
      errorMessage,
      event
    );
  }
}


/**
 * Run the function and report the returned message in Slack channel
 * #automation-logs.
 *
 * If the function returns an empty message, nothing is posted to Slack,
 * but the successful execution is still recorded in script_tracker.
 *
 * On an exception, report the error in #automation-logs and
 * #automation-errors.
 *
 * @param {string} message - The message to use on error
 * @param {function} f - The function to run
 * @param {Object} event - Trigger event
 */
function runIgnoreEmpty(message, f, event) {
  try {
    const successMessage = f();

    if (successMessage == "") {
      markInDb_(
        true,
        successMessage,
        event
      );

      return;
    }

    success(
      successMessage,
      event
    );

  } catch (e) {
    const errorMessage = e.message ?? e;

    Logger.log(
      "Error: " +
      errorMessage +
      "\n" +
      Logger.getLog()
    );

    error(
      message,
      errorMessage,
      event
    );
  }
}


/**
 * Send a message to the #automation-logs Slack channel
 * and record the successful execution in script_tracker.
 *
 * @param {string} message - The message to send
 * @param {Object} event - Trigger event
 */
function success(message, event) {
  postToSlack_(
    LOGS_CHANNEL,
    "✅ " + message,
    Logger.getLog()
  );

  markInDb_(
    true,
    message,
    event
  );
}


/**
 * Send a message to #automation-logs and #automation-errors.
 * Record the failed execution in script_tracker.
 *
 * @param {string} message - General error message
 * @param {string} errorMessage - Actual error message
 * @param {Object} event - Trigger event
 */
function error(message, errorMessage, event) {
  if (
    errorMessage &&
    typeof errorMessage != "string"
  ) {
    errorMessage = JSON.stringify(
      errorMessage
    );
  }

  const logs = Logger.getLog();

  postToSlack_(
    ERROR_CHANNEL,
    "❌ " +
    message +
    ": " +
    errorMessage,
    logs
  );

  postToSlack_(
    LOGS_CHANNEL,
    "❌ " +
    message +
    ": " +
    errorMessage,
    logs
  );

  markInDb_(
    false,
    errorMessage,
    event
  );
}


/**
 * Post a message to Slack.
 *
 * @param {string} slackChannel - Slack channel name
 * @param {string} message - Message to post
 * @param {string} logs - Logger output
 */
function postToSlack_(
  slackChannel,
  message,
  logs
) {
  if (Test.isTest()) {
    Logger.log(
      `Posting to slack channel ${slackChannel}: ${message}\n${logs}`
    );
  } else {
    Slack.postMessageToChannel(
      slackChannel,
      message,
      logs
    );
  }
}


/**
 * Record a script execution in Team_TECH_BPA.script_tracker.
 *
 * Stores:
 * name
 * function_name
 * last_run
 * last_success
 * message
 * url
 * is_active
 * inactive_date
 *
 * Successful executions:
 * - update last_run
 * - update last_success
 * - update message
 * - update URL
 * - mark script active
 * - clear inactive_date
 *
 * Failed executions:
 * - update last_run
 * - update message
 * - update URL
 * - DO NOT overwrite last_success
 * - DO NOT change an existing inactive status
 *
 * @param {boolean} isSuccess - Whether execution succeeded
 * @param {string} message - Execution message
 * @param {Object} event - Trigger event
 */
function markInDb_(
  isSuccess,
  message,
  event
) {
  let connection = null;

  try {
    const now = new Date();

    let name = "unknown";
    let url = "";

    /*
     * Determine the Apps Script project ID,
     * human-readable project name,
     * and direct Apps Script editor URL.
     */
    try {
      const scriptId =
        ScriptApp.getScriptId();

      name = scriptId;

      url =
        `https://script.google.com/d/${scriptId}/edit`;

      try {
        const file =
          DriveApp.getFileById(
            scriptId
          );

        name =
          file.getName();

      } catch (driveError) {
        Logger.log(
          "Could not get script file name: " +
          driveError.message
        );
      }

    } catch (scriptError) {
      Logger.log(
        "Error getting script ID or URL: " +
        scriptError.message
      );
    }


    const functionName =
      Utils.getTriggerName(event);


    connection =
      Database.getReadWriteSQLConnection(
        "Team_TECH_BPA"
      );


    /*
     * Successful execution
     */
    if (isSuccess) {
      Database.bulkInsert(
        connection,

        `INSERT INTO Team_TECH_BPA.script_tracker *
        ON DUPLICATE KEY UPDATE
          last_run = VALUES(last_run),
          last_success = VALUES(last_success),
          message = VALUES(message),
          url = VALUES(url),
          is_active = TRUE,
          inactive_date = NULL
        `,

        [
          "name",
          "function_name",
          "last_run",
          "last_success",
          "message",
          "url",
          "is_active",
          "inactive_date"
        ],

        [{
          name: name,
          function_name: functionName,
          last_run: now,
          last_success: now,
          message: message,
          url: url,
          is_active: true,
          inactive_date: null
        }]
      );

    } else {

      /*
       * Failed execution
       *
       * last_success is intentionally not updated.
       *
       * is_active and inactive_date are intentionally
       * not updated on duplicate rows. This prevents a
       * failed execution from reactivating a script that
       * was intentionally marked inactive.
       */
      Database.bulkInsert(
        connection,

        `INSERT INTO Team_TECH_BPA.script_tracker *
        ON DUPLICATE KEY UPDATE
          last_run = VALUES(last_run),
          message = VALUES(message),
          url = VALUES(url)
        `,

        [
          "name",
          "function_name",
          "last_run",
          "message",
          "url",
          "is_active",
          "inactive_date"
        ],

        [{
          name: name,
          function_name: functionName,
          last_run: now,
          message: message,
          url: url,
          is_active: true,
          inactive_date: null
        }]
      );
    }

  } catch (e) {
    Logger.log(
      "Error writing to database: " +
      e.message
    );

  } finally {
    if (connection) {
      connection.close();
    }
  }
}


/**
 * Mark a script as inactive.
 *
 * This can later be called by the link/action used
 * from the automation-errors Slack notification.
 *
 * @param {string} name - Script name
 * @param {string} functionName - Function name
 */
function markScriptInactive(
  name,
  functionName
) {
  let connection = null;

  try {
    connection =
      Database.getReadWriteSQLConnection(
        "Team_TECH_BPA"
      );

    const statement =
      connection.prepareStatement(
        `
          UPDATE Team_TECH_BPA.script_tracker
          SET
            is_active = FALSE,
            inactive_date = NOW()
          WHERE name = ?
            AND function_name = ?
        `
      );

    statement.setString(
      1,
      name
    );

    statement.setString(
      2,
      functionName
    );

    const rowsUpdated =
      statement.executeUpdate();

    statement.close();

    Logger.log(
      `Marked ${rowsUpdated} script(s) inactive: ` +
      `${name}.${functionName}`
    );

    return rowsUpdated;

  } finally {
    if (connection) {
      connection.close();
    }
  }
}


/**
 * Manually reactivate a script.
 *
 * @param {string} name - Script name
 * @param {string} functionName - Function name
 */
function markScriptActive(
  name,
  functionName
) {
  let connection = null;

  try {
    connection =
      Database.getReadWriteSQLConnection(
        "Team_TECH_BPA"
      );

    const statement =
      connection.prepareStatement(
        `
          UPDATE Team_TECH_BPA.script_tracker
          SET
            is_active = TRUE,
            inactive_date = NULL
          WHERE name = ?
            AND function_name = ?
        `
      );

    statement.setString(
      1,
      name
    );

    statement.setString(
      2,
      functionName
    );

    const rowsUpdated =
      statement.executeUpdate();

    statement.close();

    Logger.log(
      `Marked ${rowsUpdated} script(s) active: ` +
      `${name}.${functionName}`
    );

    return rowsUpdated;

  } finally {
    if (connection) {
      connection.close();
    }
  }
}


/**
 * Test Runner.js
 */
function test() {
  const connection =
    Database.getReadOnlySQLConnection(
      "Team_TECH_BPA"
    );

  /*
   * Successful execution
   */
  markInDb_(
    true,
    "yes"
  );

  const s1 =
    Database.bulkRead(
      connection,
      `
        SELECT *
        FROM script_tracker
        WHERE name = 'libRunner'
      `,
      [
        "name",
        "last_run",
        "last_success",
        "message",
        "url",
        "is_active",
        "inactive_date"
      ]
    )[0];


  Utilities.sleep(2000);


  /*
   * Failed execution
   */
  markInDb_(
    false,
    "not"
  );

  const f1 =
    Database.bulkRead(
      connection,
      `
        SELECT *
        FROM script_tracker
        WHERE name = 'libRunner'
      `,
      [
        "name",
        "last_run",
        "last_success",
        "message",
        "url",
        "is_active",
        "inactive_date"
      ]
    )[0];


  Utilities.sleep(2000);


  /*
   * Successful execution again
   */
  markInDb_(
    true,
    "yes yes"
  );

  const s2 =
    Database.bulkRead(
      connection,
      `
        SELECT *
        FROM script_tracker
        WHERE name = 'libRunner'
      `,
      [
        "name",
        "last_run",
        "last_success",
        "message",
        "url",
        "is_active",
        "inactive_date"
      ]
    )[0];


  /*
   * Validate messages
   */
  if (s1.message != "yes") {
    throw "message not correct";
  }

  if (f1.message != "not") {
    throw "message not correct";
  }

  if (s2.message != "yes yes") {
    throw "message not correct";
  }


  /*
   * Validate timestamps
   */
  if (
    s1.last_run !=
    s1.last_success
  ) {
    throw "should be same";
  }

  if (
    f1.last_success !=
    s1.last_success
  ) {
    throw "should be same";
  }

  if (
    f1.last_run ==
    f1.last_success
  ) {
    throw "should be different";
  }

  if (
    s2.last_run !=
    s2.last_success
  ) {
    throw "should be same";
  }

  if (
    s1.last_success ==
    s2.last_success
  ) {
    throw "should be different";
  }


  /*
   * Validate URL
   */
  if (
    !s2.url
  ) {
    throw "URL should not be empty";
  }


  /*
   * A successful run should always mark
   * the script active.
   */
  if (
    s2.is_active != true &&
    s2.is_active != 1
  ) {
    throw "script should be active";
  }


  /*
   * Active scripts should not have
   * an inactive date.
   */
  if (
    s2.inactive_date != null
  ) {
    throw "inactive_date should be null";
  }


  connection.close();


  /*
   * Slack tests
   */
  Test.setForceTest(false);

  LOGS_CHANNEL =
    "marcel-test";

  ERROR_CHANNEL =
    LOGS_CHANNEL;


  run(
    "run ok",
    function () {
      Logger.log(
        "this is ok"
      );

      return;
    }
  );


  Logger.clear();


  run(
    "run ok with message",
    function () {
      Logger.log(
        "this is ok"
      );

      return "the message";
    }
  );


  Logger.clear();


  run(
    "run with error",
    function () {
      Logger.log(
        "this will not be ok"
      );

      throw Error(
        "this is an error"
      );
    }
  );


  Test.setForceTest(true);


  Logger.clear();


  run(
    "run ok",
    function () {
      Logger.log(
        "this is ok"
      );

      return;
    }
  );


  Logger.clear();


  run(
    "run ok with message",
    function () {
      Logger.log(
        "this is ok"
      );

      return "the message";
    }
  );


  Logger.clear();


  run(
    "run with error",
    function () {
      Logger.log(
        "this will not be ok"
      );

      throw "this is an error too";
    }
  );


  Logger.clear();


  runIgnoreEmpty(
    "run ok empty",
    function () {
      Logger.log(
        "this will not be in the channel"
      );

      return "";
    }
  );


  Logger.clear();


  runIgnoreEmpty(
    "run ok not empty",
    function () {
      Logger.log(
        "this will be in the channel"
      );

      return "the message";
    }
  );


  Test.setForceTest(false);
}