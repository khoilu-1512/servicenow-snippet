/**
 * @class
 * Interact with user data in client side by using GlideQuery
 */
const UserClientUtils = Class.create();
UserClientUtils.prototype = Object.extendsObject(AbstractAjaxProcessor, {
    getInfo: function() {
        const fallbackData = {
            company: {
                name: ""
            },
            department: {
                name: ""
            },
            error: ""
        };
		
        try {
            const userSysId = this.getParameter("sysparm_user_sys_id");
            const userData = new GlideQuery("sys_user")
                .get(userSysId, ["company.name", "department.name"])
                .orElse(fallbackData);
            return JSON.stringify(userData);
        } catch (error) {
			returnedData.error = error.message;
            return JSON.stringify(fallbackData);
        }
    },
    type: 'UserClientUtils'
});