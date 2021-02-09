/*global QUnit*/

sap.ui.define([
	"vodafone/RepintHRAdmin/controller/GestioneCalcoloeregole.controller"
], function (Controller) {
	"use strict";

	QUnit.module("GestioneCalcoloeregole Controller");

	QUnit.test("I should test the GestioneCalcoloeregole controller", function (assert) {
		var oAppController = new Controller();
		oAppController.onInit();
		assert.ok(oAppController);
	});

});