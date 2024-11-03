/**
 * @class
 * Repository for interacting with ServiceNow tables.
 */
const Repository = Class.create();
Repository.prototype = {

    /**
     * Initializes the Repository for a given table.
     * @param {string} tableName - The name of the ServiceNow table.
     * @param {boolean} [overrideACL=false] - Determines whether to use GlideRecord (true) or GlideRecordSecure (false).
     */
    initialize: function(tableName, overrideACL) {
        this.overrideACL = overrideACL;
        this.tableName = tableName;

        if (!tableName) {
            throw new Error("A table name must be provided to the Repository.");
        }

        if (overrideACL) {
            this.record = new GlideRecord(this.tableName);
        } else {
            this.record = new GlideRecordSecure(this.tableName);
        }
    },

    /**
     * Adds an encoded query to the Repository's record.
     * @param {string} query - Encoded query string.
     * @returns {Repository} Returns the Repository instance for chaining.
     */
    addEncodedQuery: function(query) {
        this.record.addEncodedQuery(query);
        return this;
    },
	
    /**
     * Paginate the list of records from
     * @param {Object} pagination
     * @param {number} pagination.offset - First row to include
     * @param {number} pagination.limit - Number of records is included
     * @returns {Repository} Returns the Repository instance for chaining.
     */
    paginate: function(pagination) {
        const firstRow = pagination.offset;
        const lastRow = firstRow + pagination.limit;
		
        this.record.chooseWindow(firstRow, lastRow);
        return this;
    },

    /**
     * Gets a single record based on the provided query.
     * @param {string} sysId - The sysId of the record to fetch.
     * @param {boolean} [isSerialized=false] - Determines if the record should be serialized.
     * @returns {(GlideRecord|null|Object)} Returns the GlideRecord, serialized record, or null.
     */
    getSingle: function(isSerialized) {
        this.record.setLimit(1);
        this.record.query();
        if (!this.record.next()) {
            return null;
        }

        if (isSerialized) {
            return this._serializeRecord(this.record);
        }

        return this.record;
    },

    /**
     * Gets multiple records based on the current query.
     * @param {boolean} [isSerialized=false] - Determines if the records should be serialized.
     * @returns {(Array.<Object>|GlideRecord)} Returns an array of serialized records or a GlideRecord.
     */
    getMultiple: function(isSerialized) {
        this.record.query();
        if (!isSerialized) {
            return this.record;
        }

        const results = [];
        while (this.record.next()) {
            results.push(this._serializeRecord(this.record));
        }
        return results;
    },

    /**
     * Transform current record to object
     * @param {GlideRecord} - Determines if the record will be transformed.
     * @returns {Object} Returns an object contains all of field name and field value of current record
     */
    _serializeRecord: function(record) {
        const result = {};
        const fields = record.getFields();

        for (let i = 0; i < fields.size(); i++) {
            const field = fields.get(i).getName();
            result[field] = record[field].toString();
        }

        return result;
    },

    /** 
     * Type definition for easier identification of this script include.
     * @type {string}
     */
    type: 'Repository'
};