// Run this script in background scripts to copy a variable set and its variables, catalog ui policy and catalog client script

var variableSysId = "2897b0491be65950066da64b234bcb0b";
var variableSetGR = new GlideRecord("item_option_new_set");
if (variableSetGR.get(variableSysId)) {
  //set the title of the new variable set
  var vrsName =
    variableSetGR.getValue("title") || variableSetGR.getValue("name");
  variableSetGR.setValue("title", "Copy of " + vrsName);

  //insert a copy of the variable set
  var oldId = variableSetGR.getValue("sys_id");
  var newId = variableSetGR.insert();

  //create copies of the variables, catalog ui policy, catalog client script and associate them to the new variable set
  var result = createVariables(oldId, newId);
  createCatalogClientScript(oldId, newId, result);
  createCatalogUiPolicy(oldId, newId, result);

  gs.print(JSON.stringify(result, null, 2));
}

/**
 * Creates a copy of the variables and associates them to the new variable set
 * @param {string} oldId - sys_id of the original variable set
 * @param {string} newId - sys_id of the new variable set
 * @returns {object} result - object containing the old and new variable sys_ids
 */
function createVariables(oldId, newId) {
  // Set up the variables
  var oldVariableId = "",
    newVariableId = "",
    variableType = "";
  copyQuestionChoiceGR = null;
  // Define the constant variable type having choices
  var CHOICE_TYPES = ["3", "5"];
  var result = {
    variables: [],
  };
  // Get the variables and create a copy of each
  var variableGR = new GlideRecord("item_option_new");
  variableGR.addQuery("variable_set", oldId);
  variableGR.query();
  while (variableGR.next()) {
    // Get the old variable sys_id and type
    oldVariableId = variableGR.getValue("sys_id");
    variableType = variableGR.getValue("type");
    // Create new variable set with the same variable set as the original
    variableGR.setValue("variable_set", newId);
    newVariableId = variableGR.insert();
    // Store the old and new variable sys_ids in an result
    result.variables.push({
      old: "IO:" + oldVariableId,
      new: "IO:" + newVariableId,
    });
    // If the variable is a select box or multiple choice, create a copy of the choices and associate them to the new variable
    if (CHOICE_TYPES.indexOf(variableType) > -1) {
      copyQuestionChoiceGR = new GlideRecord("question_choice");
      copyQuestionChoiceGR.addQuery("question", oldVariableId);
      copyQuestionChoiceGR.query();
      while (copyQuestionChoiceGR.next()) {
        copyQuestionChoiceGR.setValue("question", newVariableId);
        copyQuestionChoiceGR.insert();
      }
    }
  }
  return result;
}

/**
 * Creates a copy of the catalog client script and associates them to the new variable set
 * @param {string} originalVariableSet - sys_id of the original variable set
 * @param {string} newVariableSet - sys_id of the new variable set
 * @param {object} variableMapping - object containing the old and new variable sys_ids
 */
function createCatalogClientScript(
  originalVariableSet,
  newVariableSet,
  variableMapping
) {
  // Set up the variables to store the onChange variable sys_id and the client script type
  var onChangeVariableSysId = "";
  var clientScriptType = "";
  var newClientScriptId = "";
  // If the variableMapping does not have "client_script" property, create it as empty array
  if (!variableMapping.hasOwnProperty("client_script")) {
    variableMapping.client_script = [];
  }
  // Get the client scripts and create a copy of each
  var copyClientScriptGR = new GlideRecord("catalog_script_client");
  copyClientScriptGR.addQuery("variable_set", originalVariableSet);
  copyClientScriptGR.query();
  while (copyClientScriptGR.next()) {
    // Get the client script type
    clientScriptType = copyClientScriptGR.getValue("type");
    // If the client script type is onChange, set a new variable to "Variable Name" field to trigger onChange
    if (clientScriptType === "onChange") {
      onChangeVariableSysId = copyClientScriptGR.getValue("cat_variable");
      copyClientScriptGR.setValue(
        "cat_variable",
        variableMapping.variables[onChangeVariableSysId]
      );
    }
    copyClientScriptGR.setValue("variable_set", newVariableSet);
    newClientScriptId = copyClientScriptGR.insert();
    // Store the old and new client script sys_ids in an variableMapping
    variableMapping.client_script.push({
      old: copyClientScriptGR.getValue("sys_id"),
      new: newClientScriptId,
    });
  }
}

/**
 * Creates a copy of the catalog ui policy and associates them to the new variable set
 * @param {string} originalVariableSet - sys_id of the original variable set
 * @param {string} newVariableSet - sys_id of the new variable set
 * @param {object} variableMapping - object containing the old and new variable sys_ids
 */
function createCatalogUiPolicy(
  originalVariableSet,
  newVariableSet,
  variableMapping
) {
  var oldUiPolicyId = "",
    newUiPolicyId = "",
    copyActionGR = null,
    oldTargetActionId = "";
  // If the variableMapping does not have "ui_policy" property, create it as empty array
  if (!variableMapping.hasOwnProperty("ui_policy")) {
    variableMapping.ui_policy = [];
  }
  var copyUiPolicyGR = new GlideRecord("catalog_ui_policy");
  copyUiPolicyGR.addQuery("variable_set", originalVariableSet);
  copyUiPolicyGR.query();
  while (copyUiPolicyGR.next()) {
    oldUiPolicyId = copyUiPolicyGR.getValue("sys_id");
    copyUiPolicyGR.setValue("variable_set", newVariableSet);
    newUiPolicyId = copyUiPolicyGR.insert();
    variableMapping.ui_policy.push({
      old: oldUiPolicyId,
      new: newUiPolicyId,
    });
    copyActionGR = new GlideRecord("catalog_ui_policy_action");
    copyActionGR.addQuery("ui_policy", oldUiPolicyId);
    copyActionGR.query();
    while (copyActionGR.next()) {
      copyActionGR.setValue("ui_policy", newUiPolicyId);
      copyActionGR.setValue("variable_set", newVariableSet);
      oldTargetActionId = copyActionGR.getValue("catalog_variable");
      copyActionGR.setValue(
        "catalog_variable",
        variableMapping.variables[oldTargetActionId]
      );
      copyActionGR.insert();
    }
  }
}
