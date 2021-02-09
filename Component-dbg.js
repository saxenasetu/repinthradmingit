sap.ui.define([
	"sap/ui/core/UIComponent",
	"sap/ui/Device",
	"vodafone/RepintHRAdmin/model/models"
], function (UIComponent, Device, models) {
	"use strict";

	return UIComponent.extend("vodafone.RepintHRAdmin.Component", {

		metadata: {
			manifest: "json"
		},

		/**
		 * The component is initialized by UI5 automatically during the startup of the app and calls the init method once.
		 * @public
		 * @override
		 */
		init: function () {
			// call the base component's init function
			UIComponent.prototype.init.apply(this, arguments);

			// set the device model
			this.setModel(models.createDeviceModel(), "device");

			var xsoDataModel = new sap.ui.model.odata.v2.ODataModel("/HANAMDC/REPINT/RepintAdmin/xsodata/RepintAdmin.xsodata/", {
				json: true,
				defaultBindingMode: "TwoWay"
			});

			this.setModel(xsoDataModel, "basexsoModel");

			// var oEmpModel = new sap.ui.model.json.JSONModel();
			// oEmpModel.loadData("/services/userapi/currentUser");
			// this.setModel(oEmpModel, "empModel");

			var oEntry = {};
			$.ajax({
				url: "/services/userapi/currentUser",
				async: false,
				cache: false,
				success: function (data, response) {
					oEntry.name = data.name.toUpperCase();
				},
				error: function (xhr, textStatus, error) {
					jQuery.sap.log.getLogger().error("Get Employee Authorization fetch failed" + error.toString());
				}
			});
			var oEmpModel = new sap.ui.model.json.JSONModel();
			oEmpModel.setData(oEntry);
			this.setModel(oEmpModel, "empModel");

			this.setModel(new sap.ui.model.json.JSONModel(), "viewProperties");
			this.checkAuthorization();

			// enable routing
			this.getRouter().initialize();
		},

		checkAuthorization: function () {
			var that = this;
			var xsoBaseModel = this.getModel("basexsoModel");
			var oFilters = [];
			var repintEmpAuthoModel = new sap.ui.model.json.JSONModel();
			var oRepintEmpAuthoJson = [];
			var oRepintEmpAuthoJsonData = {};			
			that._busyDialog = new sap.m.BusyDialog({
				showCancelButton: false
			});
			var empID = that.getModel("empModel").getData().name; // Get logged in Emp EmpId
			
			xsoBaseModel.attachRequestSent(function () {
				that._busyDialog.open();
			});
			xsoBaseModel.attachRequestCompleted(function () {
				that._busyDialog.close();
			});

			if (empID !== undefined && empID !== null && empID !== "") {

				var filter = new sap.ui.model.Filter("ID", sap.ui.model.FilterOperator.EQ, empID);
				oFilters.push(filter);

				xsoBaseModel.read("/T_USER", {
					filters: oFilters,
					success: function (data, oResponse) {
						console.log("T_USER");
						console.log(data);
						//enable routing
						this.getRouter().initialize();
						// Access to Repint Employee Tile to below roles:
						// ROLE_EMP: 

						// Access to Repint Approval Tile to below roles:
						// ROLE_DEPUTY
						// ROLE_HR
						// ROLE_MANAGER
						// ROLE_HRBP

						// Access to Repint HR Admin Tile to below roles:
						// ROLE_HR: 

						if (data.results[0].ROLE_HR === "X") {

							oRepintEmpAuthoJsonData = {
								"AUTHHORIZEDDATA": data.results[0],
								"MATRICOLA": data.results[0].MATRICOLA,
								"ROLE_DEPUTY": data.results[0].ROLE_DEPUTY,
								"ROLE_EMP": data.results[0].ROLE_EMP,
								"ROLE_HR": data.results[0].ROLE_HR,
								"ROLE_HRBP": data.results[0].ROLE_HRBP,
								"ROLE_MANAGER": data.results[0].ROLE_MANAGER
							};

							oRepintEmpAuthoJson.push(oRepintEmpAuthoJsonData);
							repintEmpAuthoModel.setData(oRepintEmpAuthoJson);
							
							that.setModel(repintEmpAuthoModel, "EmpAuthoModel");
							that.getModel("viewProperties").setProperty("/Authorized", true);
						}else{
						// enable routing
						this.getRouter().initialize();
						that.getModel("viewProperties").setProperty("/Authorized", false);
						jQuery.sap.log.getLogger().error("Employee Authorization failed ");					
						//this.getRouter().navTo("Unauthorized");	 					
						//this.getRouter().getTarget()
						this.getRouter().getTargets().display("Unauthorized");
					}

					}.bind(this),
					error: function (oError) {
						that.getModel("viewProperties").setProperty("/Authorized", false);
						jQuery.sap.log.getLogger().error("Employee Authorization failed");
						this.getRouter().getTargets().display("Unauthorized");
					}.bind(this)
				});
			} else {
				this.getRouter().initialize();
				that.getModel("viewProperties").setProperty("/Authorized", false);
				jQuery.sap.log.getLogger().error("Employee Authorization failed");
				this.getRouter().getTargets().display("Unauthorized"); 
			}
		},

		// checkAuthorization: function(){

		// 	var that = this;
		// 	var empID = this.getModel("empModel").getData().name; // Get logged in Emp EmpId
		// 	empID = "P2001995750";
		// 	var repintHRAdminAuthoModel = new sap.ui.model.json.JSONModel();
		// 	var oRepintHRAdminAuthoJson = [];
		// 	var oRepintHRAdminAuthoJsonData = {};

		// 	var urlgetAutho = "/HANAMDC/REPINT/RepintApproval/xsjs/getAuthorization.xsjs/?aEmpid=" + empID + "";

		// 	// $.ajax({
		// 	// 	url: urlgetAutho,
		// 	// 	success: function (data, response) {
		// 	// 		console.log("Repint HR Admin Authorization");
		// 	// 		console.log(data);
		// 	// 		// oRepintHRAdminAuthoJsonData = {
		// 	// 		// 	"AUTHHORIZEDDATA": data[0],
		// 	// 		// 	"ROLE_EMP": data[0].ROLE_EMP,
		// 	// 		// 	"AUTHHORIZEDFLAG": "1"
		// 	// 		// };
		// 	// 		// oRepintHRAdminAuthoJson.push(oRepintHRAdminAuthoJsonData);
		// 	// 		// repintHRAdminAuthoModel.setData(oRepintHRAdminAuthoJson);
		// 	// 		// that.setModel(repintHRAdminAuthoModel, "EmpAuthoModel");
		// 	// 		// console.log("Repint HR Admin Authorization" + repintHRAdminAuthoModel);

		// 	// 		 that.getModel("viewProperties").setProperty("/Authorized", true);
		// 	// 	},
		// 	// 	error: function (xhr, textStatus, error) {
		// 	// 			that.getModel("viewProperties").setProperty("/Authorized", false);
		// 	// 			jQuery.sap.log.getLogger().error("Employee Authorization failed " + error.toString());
		// 	// 		}
		// 	// });		

		// 	$.ajax({
		// 		url: urlgetAutho,
		// 		success: function (data, response) {
		// 			console.log(data);
		// 			// // enable routing
		// 			// that.getRouter().initialize();

		// 			if(data[0].ROLE_HR === "X"){ // Authorized to access "Repint HR Admin" App
		// 				oRepintHRAdminAuthoJsonData = {
		// 					"AUTHHORIZEDDATA": data[0],
		// 					"MATRICOLA": data[0].MATRICOLA,
		// 					"ROLE_DEPUTY": data[0].ROLE_DEPUTY,
		// 					"ROLE_EMP": data[0].ROLE_EMP,
		// 					"ROLE_HR": data[0].ROLE_HR,
		// 					"ROLE_HRBP": data[0].ROLE_HRBP,
		// 					"ROLE_MANAGER": data[0].ROLE_MANAGER
		// 				};			

		// 				oRepintHRAdminAuthoJson.push(oRepintHRAdminAuthoJsonData);
		// 				repintHRAdminAuthoModel.setData(oRepintHRAdminAuthoJson);
		// 				that.setModel(repintHRAdminAuthoModel, "EmpAuthoModel");
		// 				console.log("EmpAutho" + repintHRAdminAuthoModel);

		// 				that.getModel("viewProperties").setProperty("/Authorized", true);						
		// 			}else{
		// 				that.getModel("viewProperties").setProperty("/Authorized", false);
		// 				jQuery.sap.log.getLogger().error("Employee Authorization failed " + error.toString());					
		// 				sap.ui.core.UIComponent.getRouterFor(that).navTo("Unauthorized");						
		// 			}
		// 		},
		// 		error: function (xhr, textStatus, error) {
		// 			that.getRouter().initialize();
		// 			that.getModel("viewProperties").setProperty("/Authorized", false);
		// 			jQuery.sap.log.getLogger().error("Employee Authorization failed " + error.toString());					
		// 			sap.ui.core.UIComponent.getRouterFor(that).navTo("Unauthorized");
		// 		}
		// 	});
		// }

	});
});