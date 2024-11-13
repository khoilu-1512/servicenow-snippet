/**
 * @typedef {Object} CatalogVariable
 * @property {string} [question_text] - The text of the question for the variable
 * @property {string} [name] - The name of the variable
 * @property {keyof VARIABLE_TYPES} [type] - The type of the variable (e.g., 'yes_no', 'multiline_text', etc.)
 * @property {string} [cat_item] - The sys_id of the catalog item (for single variable)
 * @property {string} [variable_set] - The sys_id of the variable set (for variable set variable)
 * @property {number} [order] - The order of the variable
 * @property {boolean} [mandatory] - Whether to set variable mandatory
 * @property {boolean} [read_only] - Whether to set variable readonly
 * @property {string} [reference] - The table name for reference fields
 * @property {string} [reference_qual] - The query for reference fields
 * @property {boolean} [include_none] - Whether to include a 'None' option for select boxes
 * @property {('across' | 'down')} [choice_direction] - The direction of multiple choices
 * @property {boolean} [do_not_select_first] - Whether to choose the first choice with multiple choice
 * @property {QuestionChoice[]} [question_choices] - The question choices of variables
 * @property {boolean} [display_title] - Whether to display the title for container start
 * @property {('normal' | '2across' | '2down')} layout - The layout of the container start
 * @property {string} [default_value] - The default value of the variable
 * @property {boolean} [show_help] - Whether to show help text
 * @property {boolean} [show_help_on_load] - Whether to show help text on load
 * @property {string} [help_tag] - The help tag
 * @property {string} [help_text] - The help text content
 * @property {string} [dynamic_value_field] - The sys_id of dynamic variable
 * @property {string} [dynamic_value_dot_walk_path] - The field name of column is from dynamic variable
*/

/**
 * @typedef {Object} CatalogVariableSet
 * @property {string} name - The name of the variable set
 * @property {string} title - The title of the variable set
 * @property {string} internal_name - The internal name of the variable set
 * @property {number} order - The order of the variable set
 * @property {('normal' | '2across' | '2down')} layout - The layout of the variable set
 * @property {('one_to_one'|'one_to_many')} type - The type of the variable set
 * @property {boolean} display_title - Whether to display the title of the variable set
 */

/**
 * @typedef {Object} QuestionChoice
 * @property {string} text - The display value of the question choice
 * @property {string} value - The value of the question choice
 * @property {number} order - The order of the question choice
 */


var VARIABLE_TYPES = {
	yes_no: "1",
	multiline_text: "2",
	multiple_choice: "3",
	numeric_scale: "4",
	select_box: "5",
	single_line_text: "6",
	checkbox: "7",
	reference: "8",
	date: "9",
	date_time: "10",
	label: "11",
	"break": "12",
	custom: "14",
	ui_page: "15",
	wide_single_line_text: "16",
	custom_with_label: "17",
	lookup_select_box: "18",
	container_start: "19",
	container_end: "20",
	list_collector: "21",
	lookp_multiple_choice: "22",
	html: "23",
	container_split: "24",
	masked: "25",
	email: "26",
	url: "27",
	ip_address: "28",
	duration: "29",
	requested_for: "31",
	rich_text_label: "32",
	attachment: "33"
};


var current = new GlideRecord("sc_cat_item");
if (current.get("")) {
	var catalogItemId = current.getUniqueValue();

	/**
	 * Array of catalog variables
	 * @type {CatalogVariable[]}
	 */
	var catalogVariables = [
		{
			question_text: "",
			name: "",
			type: "",
			cat_item: catalogItemId,
			order: 100
		}
	];

	/**
	 * Array of catalog variable sets
	 * @type {CatalogVariableSet[]}
	*/
	var catalogVariableSet = [
		{
			name: "",
			title: "",
			internal_name: "",
			order: 100,
			layout: "normal",
			type: "one_to_one",
			display_title: false,
		}
	];

	// createVariable(catalogVariables);
	// var result = createVariableSet(catalogVariableSet);
	// var order = 100;
	// for (var index = 0; index < result.length; index++){
	// 	addVariableSetToCatalogItem(catalogItemId, result[i].sys_id, order);
	// 	order += 100;
	// }
}

/**
 * Creates new catalog variables based on the provided dataset
 * @param {CatalogVariable[]} dataSet - Array of catalog variable data
 * @returns {void}
*/
function createVariable(dataSet) {
	var grNewVariable = null;
	var i;
	var dataItem = null;
	var itemId = null;
	for (i = 0; i < dataSet.length; i++) {
		dataItem = dataSet[i];
		grNewVariable = new GlideRecord("item_option_new");
		grNewVariable.initialize();
		for (var key in dataItem) {
			if (key === "type") {
				grNewVariable.setValue(key, VARIABLE_TYPES[dataItem[key]]);
			} else {
				grNewVariable.setValue(key, dataItem[key]);
			}
		}
		itemId = grNewVariable.insert();
		if (itemId && dataItem.question_choices) {
			createQuestionChoices(dataItem.question_choices, itemId);
		}
	}
}

/**
 * Creates new variable sets based on the provided dataset
 * @param {CatalogVariableSet[]} dataSet - Array of variable set data
 * @returns {{internal_name: string, sys_id: string}[]} Array of created variable set info
 */
function createVariableSet(dataSet) {
	var results = [];
	var grNewVariableSet = null;
	var item = null;
	var i;
	for (i = 0; i < dataSet.length; i++) {
		item = dataSet[i];
		grNewVariableSet = new GlideRecord("item_option_new_set");
		grNewVariableSet.initialize();
		for (var key in dataSet[i]) {
			grNewVariableSet.setValue(key, item[key]);
		}
		grNewVariableSet.insert();
		results.push({
			internal_name: grNewVariableSet.internal_name.toString(),
			sys_id: grNewVariableSet.getUniqueValue(),
		});
	}
	return results;
}

/**
 * Associates a variable set with a catalog item
 * @param {string} catalogItem - The sys_id of the catalog item
 * @param {string} variableSet - The sys_id of the variable set
 * @param {number} order - The order of the association
 * @returns {void}
 */
function addVariableSetToCatalogItem(catalogItem, variableSet, order) {
	var m2mOrder = order || 100;
	var grNewCatalogVS = new GlideRecord("io_set_item");
	grNewCatalogVS.initialize();
	grNewCatalogVS.setValue("variable_set", variableSet);
	grNewCatalogVS.setValue("sc_cat_item", catalogItem);
	grNewCatalogVS.setValue("order", m2mOrder);
	grNewCatalogVS.insert();
}

/**
 * Create a new question choice based on the provided dataset
 * @param {QuestionChoice[]} choiceDataSet - Array of the information of question choice
 * @param {string} variableId - Sys_id of variable contains question choice
 * @retuns {void}
 */
function createQuestionChoices(choiceDataSet, variableId) {
	var choiceItem = null;
	var i;

	var grQuestionChoices = new GlideRecord("question_choice");
	for (i = 0; i < choiceDataSet.length; i++) {
		grQuestionChoices.initialize();
		choiceItem = choiceDataSet[i];
		grQuestionChoices.setValue("question", variableId);
		for (var key in choiceItem) {
			grQuestionChoices.setValue(key, choiceItem[key]);
		}
		grQuestionChoices.insert();
	}
}
