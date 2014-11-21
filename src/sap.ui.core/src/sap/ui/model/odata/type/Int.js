/*!
 * ${copyright}
 */

sap.ui.define(['sap/ui/core/format/NumberFormat', 'sap/ui/model/FormatException',
		'sap/ui/model/ParseException', 'sap/ui/model/SimpleType',
		'sap/ui/model/ValidateException'],
	function(NumberFormat, FormatException, ParseException, SimpleType, ValidateException) {
	"use strict";

	/**
	 * Constructor for a new <code>Int</code>.
	 * Subtypes have to initialize <code>this.oConstraints</code> with <code>minimum<code> and
	 * <code>maximum</code> value range before calling this constructor.
	 *
	 * @class This is an abstract base class for integer-based
	 * <a href="http://www.odata.org/documentation/odata-version-2-0/overview#AbstractTypeSystem">
	 * OData primitive types</a> like <code>Edm.Int16</code> or <code>Edm.Int32</code>.
	 *
	 * @extends sap.ui.model.SimpleType
	 *
	 * @author SAP SE
	 * @version ${version}
	 *
	 * @constructor
	 * @alias sap.ui.model.odata.type.Int
	 * @param {object} [oFormatOptions]
	 *   format options, see {@link #setFormatOptions}
	 * @param {object} [oConstraints]
	 *   constraints, see {@link #setConstraints}
	 * @public
	 * @since 1.27.0
	 */
	var Int = SimpleType.extend("sap.ui.model.odata.type.Int",
		/** @lends sap.ui.model.odata.type.Int.prototype */
		{
			constructor : function () {
				SimpleType.apply(this, arguments);
				this.sName = "sap.ui.model.odata.type.Int";
			},
			metadata : {
				"abstract" : true
			}
		});

	/**
	 * Returns the formatter. Creates it lazily.
	 * @return {sap.ui.core.format.NumberFormat}
	 *   the formatter
	 * @private
	 */
	Int.prototype._getFormatter = function () {
		if (!this.oFormat) {
			this.oFormat = NumberFormat.getIntegerInstance({groupingEnabled: true});
		}
		return this.oFormat;
	};

	/**
	 * Called by the framework when any localization setting changed
	 * @private
	 */
	Int.prototype._handleLocalizationChange = function () {
		this.oFormat = null;
	};

	/**
	 * Format the given value to the given target type.
	 * When formatting to <code>string</code> the format options are used.
	 *
	 * @param {number} iValue
	 *   the value in model representation to be formatted
	 * @param {string} sTargetType
	 *   the target type
	 * @return {number|string}
	 *   the formatted output value in the target type; <code>undefined</code> or <code>null</code>
	 *   will be formatted to <code>null</code>
	 * @throws sap.ui.model.FormatException
	 *   if <code>sTargetType</code> is unsupported
	 * @public
	 */
	Int.prototype.formatValue = function(iValue, sTargetType) {
		if (iValue === undefined || iValue === null) {
			return null;
		}
		switch (sTargetType) {
			case "string":
				return this._getFormatter().format(iValue);
			case "int":
				return Math.floor(iValue);
			case "float":
			case "any":
				return iValue;
			default:
				throw new FormatException("Don't know how to format "
					+ this.getName() + " to " + sTargetType);
		}
	};

	/**
	 * Parse the given value, which is expected to be of the given source type, to an Int in
	 * number representation.
	 * @param {number|string} vValue
	 *   the value to be parsed. The empty string and <code>null</code> are parsed to
	 *   <code>null</code>.
	 * @param {string} sSourceType
	 *   the internal type of vValue
	 * @throws sap.ui.model.ParseException
	 *   if <code>sSourceType</code> is unsupported or if the given string cannot be parsed to an
	 *   integer type
	 * @return {number}
	 *   the parsed value
	 * @public
	 */
	Int.prototype.parseValue = function(vValue, sSourceType) {
		var iResult;

		if (vValue === null || vValue === "") {
			return null;
		}
		switch (sSourceType) {
			case "string":
				iResult = this._getFormatter().parse(vValue);
				if (isNaN(iResult)) {
					// TODO: localization
					throw new ParseException(vValue + " is not a valid "
						+ this.getName() + " value");
				}
				return iResult;
			case "float":
				return Math.floor(vValue);
			case "int":
				return vValue;
			default:
				// TODO: localization
				throw new ParseException("Don't know how to parse " + this.getName()
					+ " from " + sSourceType);
		}
	};

	/**
	 * Set constraints for Int. This is meta information used when validating the value.
	 *
	 * @param {object} oConstraints
	 *   the constraints
	 * @param {boolean} [oConstraints.nullable=true]
	 *   if <code>true</code>, the value <code>null</code> will be accepted
	 * @public
	 */
	Int.prototype.setConstraints = function(oConstraints) {
		this.oConstraints.nullable = !(oConstraints && oConstraints.nullable === false);
	};

	/**
	 * Set format options for this type. For now no format options are supported. By default
	 * grouping is activated.
	 * @param {object} oFormatOptions
	 *   the format options to set for this type, will be ignored
	 * @public
	 */
	Int.prototype.setFormatOptions = function(oFormatOptions) {
		this._handleLocalizationChange();
	};

	/**
	 * Validate whether the given value in model representation is valid and meets the
	 * defined constraints.
	 * @param {number} iValue
	 *   the value to be validated
	 * @throws ValidateException, if the value is not in the allowed range of Int or if it is
	 *   of invalid type.
	 * @public
	 */
	Int.prototype.validateValue = function(iValue) {
		if (iValue === null && this.oConstraints.nullable) {
			return;
		}
		if (typeof iValue !== "number" || Math.floor(iValue) !== iValue) {
			// TODO localization
			throw new ValidateException(iValue + " (of type " + typeof iValue + ") is not a valid "
				+ this.getName() + " value");
		}

		if (iValue > this.oConstraints.maximum || iValue < this.oConstraints.minimum) {
			// TODO: localization
			throw new ValidateException(iValue + " is out of range for " + this.sName +
				" [" + this.oConstraints.minimum + ", " + this.oConstraints.maximum + "]");
		}
	};
	return Int;
});
