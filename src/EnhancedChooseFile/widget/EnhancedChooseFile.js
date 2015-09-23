/*
    EnhancedChooseFile
    ========================

    @file      : EnhancedChooseFile.js
    @version   : 0.1
    @author    : Chad Evans
    @date      : 23 Sep 2015
    @copyright : 2015, Mendix B.v.
    @license   : Apache v2

    Documentation
    ========================
    Describe your widget here.
*/

// Required module list. Remove unnecessary modules, you can always get them back from the boilerplate.
define([
    "dojo/_base/declare",
    "mxui/widget/_WidgetBase",
    "dijit/_TemplatedMixin",
    "mxui/dom",
    "dojo/dom",
    "dojo/dom-prop",
    "dojo/on",
    "dojo/dom-class",
    "dojo/dom-style",
    "dojo/dom-construct",
    "dojo/_base/array",
    "dojo/_base/lang",
    "dojo/html",
    "dojo/_base/event"
], function (declare, _WidgetBase, _TemplatedMixin, dom, dojoDom, dojoProp, dojoOn, dojoClass, dojoStyle,
    dojoConstruct, dojoArray, dojoLang, dojoHtml, dojoEvent) {
    "use strict";

    // Declare widget's prototype.
    return declare("EnhancedChooseFile.widget.EnhancedChooseFile", [_WidgetBase], {
        // Parameters configured in the Modeler.
        btnClass: "",
        btnText: "",
        fileInputClass: "",

        // Internal variables. Non-primitives created in the prototype are shared between all widget instances.
        _contextObj: null,
        _alertDiv: null,
        _associatedFileManager: null,
        _chooseFileButton: null,
        _hiddenFileInput: null,

        // dojo.declare.constructor is called to construct the widget instance. Implement to initialize non-primitive properties.
        constructor: function () {},

        // dijit._WidgetBase.postCreate is called after constructing the widget. Implement to do extra setup work.
        postCreate: function () {
            //console.log(this.id + ".postCreate");

            this._updateRendering();
        },

        // mxui.widget._WidgetBase.update is called when context is changed or initialized. Implement to re-render and / or fetch data.
        update: function (obj, callback) {
            //console.log(this.id + ".update");

            this._contextObj = obj;
            this._updateRendering();

            callback();
        },

        // Rerender the interface.
        _updateRendering: function () {
            if (this._contextObj !== null) {
                this._associatedFileManager = dojo.query(this.fileInputClass)[0];

                var fileManagerForm = dojo.query("form", this._associatedFileManager)[0];

                var attributes = {
                    class: this.btnClass
                };
                this._chooseFileButton = dojoConstruct.create("button", attributes,
                    fileManagerForm, "after");
                dojoHtml.set(this._chooseFileButton, this.btnText);

                var browse = dojo.query(".mx-fileinput-upload-button", this._associatedFileManager);
                if (browse.length > 0) {
                    dojoStyle.set(browse[0], "display", "none");
                }

                this._hiddenFileInput = dojo.query("input[type='file']", this._associatedFileManager)[0];

                this.connect(this._chooseFileButton, "click", function (e) {
                    dojoOn.emit(this._hiddenFileInput, "click", {
                        bubbles: true,
                        cancelable: true
                    });
                });

                dojoStyle.set(this._hiddenFileInput, "display", "none");
            }

            // Important to clear all validations!
            this._clearValidations();
        },

        // Handle validations.
        _handleValidation: function (validations) {
            this._clearValidations();

            var validation = validations[0],
                message = validation.getReasonByAttribute(this.backgroundColor);

            if (this.readOnly) {
                validation.removeAttribute(this.backgroundColor);
            } else if (message) {
                this._addValidation(message);
                validation.removeAttribute(this.backgroundColor);
            }
        },

        // Clear validations.
        _clearValidations: function () {
            dojoConstruct.destroy(this._alertDiv);
            this._alertDiv = null;
        },

        // Show an error message.
        _showError: function (message) {
            if (this._alertDiv !== null) {
                dojoHtml.set(this._alertDiv, message);
                return true;
            }
            this._alertDiv = dojoConstruct.create("div", {
                "class": "alert alert-danger",
                "innerHTML": message
            });
            dojoConstruct.place(this._alertDiv, this.domNode);
        },

        // Add a validation.
        _addValidation: function (message) {
            this._showError(message);
        }
    });
});

require(["EnhancedChooseFile/widget/EnhancedChooseFile"], function () {
    "use strict";
});