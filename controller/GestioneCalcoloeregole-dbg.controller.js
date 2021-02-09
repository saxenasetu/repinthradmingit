sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/ui/core/routing/History",
	"sap/m/MessageToast",
	"sap/ui/model/json/JSONModel",
	"sap/m/TabContainerItem",
	"sap/m/MessageBox",
	'sap/m/library',
	'sap/ui/core/library',
	'sap/ui/core/Core',
	"vodafone/RepintHRAdmin/util/Formatter",
	"sap/ui/core/format/DateFormat", //Rashmi
], function (Controller, History, MessageToast, JSONModel, TabContainerItem, MessageBox, library, coreLibrary, Core, Formatter,
	DateFormat) {
	"use strict";

	var TimePickerMaskMode = library.TimePickerMaskMode,
		ValueState = coreLibrary.ValueState;

	return Controller.extend("vodafone.RepintHRAdmin.controller.GestioneCalcoloeregole", {

		/**
		 * Called when a controller is instantiated and its View controls (if available) are already created.
		 * Can be used to modify the View before it is displayed, to bind event handlers and do other one-time initialization.
		 * @memberOf vodafone.RepintApprov.repintapproval.view.GestioneCalcoloeregole
		 */
		onInit: function () {
			//	this.getOwnerComponent().getRouter().getRoute("GestioneCalcoloeregole").attachPatternMatched(this._onObjectMatched, this);
			var that = this;
			that._busyDialog = new sap.m.BusyDialog({
				showCancelButton: false
			});

			//Start of Rashmi
			var oRogoleBloccoModel = new JSONModel();
			this.getView().setModel(oRogoleBloccoModel, "oRogoleBloccoModel");
			//End of Rashmi

			that.byId("TP1").setMaskMode(TimePickerMaskMode.On);
			that.byId("TP2").setMaskMode(TimePickerMaskMode.On);

			// var oData = {
			// 	"SelectedLivello": "1",
			// 	"LivelloCollection": [{
			// 		"ValoreId": "1",
			// 		"Value": "1"
			// 	}, {
			// 		"ValoreId": "2",
			// 		"Value": "2"
			// 	}, {
			// 		"ValoreId": "6",
			// 		"Value": "3"
			// 	}, {
			// 		"ValoreId": "Q",
			// 		"Value": "4"
			// 	}, {
			// 		"ValoreId": "Q8",
			// 		"Value": "5"
			// 	}]
			// };
			// var oModel = new JSONModel(oData);
			// that.getView().byId("idLivelloCollection").setModel(oModel, "livelloModel");

			var that = this;
			var arr = [];
			var xsoBaseModel = that.getOwnerComponent().getModel("basexsoModel");
			xsoBaseModel.read('/DATAFROMSF', {
				success: function (oDataIn, oResponse) {
					for (var i = 0; i < oDataIn.results.length; i++) {
						arr.push(oDataIn.results[i].LIVELLO)
					}
					arr = arr.filter(function (item, index, inputArray) {
						return inputArray.indexOf(item) == index;
					});
					var c = [];
					for (var j = 0; j < arr.length; j++) {
						var k = {
							"LIVELLO": arr[j]
						};
						c.push(k);
					}
					console.log("Data Loded");
					var oModel = new JSONModel(c);
					that.getView().byId("idLivelloCollection").setModel(oModel, "livelloModel");
					that.getView().byId("idLivelloCollectionLPN").setModel(oModel, "livelloModel");
					that.getView().byId("idLivelloCollectionImp").setModel(oModel, "livelloModel1");
					that.getView().byId("idLivelloRegoleBloccoData").setModel(oModel, "livelloModel1");
					that.getView().byId("idLivelloRegoleBlocco").setModel(oModel, "livelloModel1");
				},
				error: function (oError) {
					console.log("Error");
				}
			});

			// var oData1 = {
			// 	"SelectedTipo": "1",
			// 	"TipoGiornoCollection": [{
			// 		"TipoGioId": "1",
			// 		"Value": "FERIALE LLUN-VEN1"
			// 	}, {
			// 		"TipoGioId": "2",
			// 		"Value": "FERIALE LLUN-VEN2"
			// 	}, {
			// 		"TipoGioId": "3",
			// 		"Value": "FERIALE LLUN-VEN3"
			// 	}, {
			// 		"TipoGioId": "4",
			// 		"Value": "FERIALE LLUN-VEN4"
			// 	}, {
			// 		"TipoGioId": "5",
			// 		"Value": "FERIALE LLUN-VEN5"
			// 	}]
			// };
			// var oModelTipo = new JSONModel(oData1);
			// that.getView().byId("idTipoCollection").setModel(oModelTipo, "TipooModel");
			var that = this;
			var xsoBaseModel = that.getOwnerComponent().getModel("basexsoModel");
			xsoBaseModel.read('/TIPOGIORNO', {
				success: function (oDataIn, oResponse) {
					console.log("Data Loded");
					var oModelTipo = new sap.ui.model.json.JSONModel(oDataIn.results);
					that.getView().byId("idTipoCollection").setModel(oModelTipo, "TipooModel");

					var setObject = [];
					var object1 = {
						IDTIPOGIORNO: 'F',
						TIPOGIORNO_DESC: 'Festivi e Domenica'
					}
					setObject.push(object1);
					var object2 = {
						IDTIPOGIORNO: 'L',
						TIPOGIORNO_DESC: 'Lunedì-Venerdì non festivi'
					}
					setObject.push(object2);
					var object3 = {
						IDTIPOGIORNO: 'S',
						TIPOGIORNO_DESC: 'Sabato'
					}
					setObject.push(object3);
					var oModelNew = new sap.ui.model.json.JSONModel(setObject);
					that.getView().byId("idTipoCollectionImp").setModel(oModelNew, "TipooModel2");
					that.getView().byId("idTipoCollectionImp7").setModel(oModelTipo, "TipooModel1");
				},

				/*that.getView().byId("idTipoCollectionImp").setModel(oModelTipo,"TipooModel1");
				that.getView().byId("idTipoCollectionImp7").setModel(oModelTipo,"TipooModel1");*/

				error: function (oError) {
					console.log("Error");
				}
			});

			//Begin of Chandan
			var oData_Minima = {
				"SelectedMinima": 0,
				"MinimaCollection": [{
					"MinimaId": 0,
					"Value": 0
				}, {
					"MinimaId": 1,
					"Value": 1
				}, {
					"MinimaId": 2,
					"Value": 2
				}, {
					"MinimaId": 3,
					"Value": 3
				}, {
					"MinimaId": 4,
					"Value": 4
				}, {
					"MinimaId": 5,
					"Value": 5
				}, {
					"MinimaId": 6,
					"Value": 6
				}, {
					"MinimaId": 7,
					"Value": 7
				}, {
					"MinimaId": 8,
					"Value": 8
				}, {
					"MinimaId": 9,
					"Value": 9
				}, {
					"MinimaId": 10,
					"Value": 10
				}, {
					"MinimaId": 11,
					"Value": 11
				}, {
					"MinimaId": 12,
					"Value": 12
				}, {
					"MinimaId": 13,
					"Value": 13
				}, {
					"MinimaId": 14,
					"Value": 14
				}, {
					"MinimaId": 15,
					"Value": 15
				}, {
					"MinimaId": 16,
					"Value": 16
				}, {
					"MinimaId": 17,
					"Value": 17
				}, {
					"MinimaId": 18,
					"Value": 18
				}, {
					"MinimaId": 19,
					"Value": 19
				}, {
					"MinimaId": 20,
					"Value": 20
				}, {
					"MinimaId": 21,
					"Value": 21
				}, {
					"MinimaId": 22,
					"Value": 22
				}, {
					"MinimaId": 23,
					"Value": 23
				}, {
					"MinimaId": 24,
					"Value": 24
				}]
			};

			var minimaoModel = new JSONModel(oData_Minima);
			that.getView().byId("idDurataMinima").setModel(minimaoModel, "minimaoModel");
			that.getView().byId("idDurataMinima1").setModel(minimaoModel, "minimaoModel");

			var oData_Massima = {
				"SelectedMassima": 1,
				"MassimaCollection": [{
					"MassimaId": 1,
					"Value": 1
				}, {
					"MassimaId": 2,
					"Value": 2
				}, {
					"MassimaId": 3,
					"Value": 3
				}, {
					"MassimaId": 4,
					"Value": 4
				}, {
					"MassimaId": 5,
					"Value": 5
				}, {
					"MassimaId": 6,
					"Value": 6
				}, {
					"MassimaId": 7,
					"Value": 7
				}, {
					"MassimaId": 8,
					"Value": 8
				}, {
					"MassimaId": 9,
					"Value": 9
				}, {
					"MassimaId": 10,
					"Value": 11
				}, {
					"MassimaId": 12,
					"Value": 12
				}, {
					"MassimaId": 13,
					"Value": 13
				}, {
					"MassimaId": 14,
					"Value": 14
				}, {
					"MassimaId": 15,
					"Value": 15
				}, {
					"MassimaId": 16,
					"Value": 16
				}, {
					"MassimaId": 17,
					"Value": 17
				}, {
					"MassimaId": 18,
					"Value": 18
				}, {
					"MassimaId": 19,
					"Value": 19
				}, {
					"MassimaId": 20,
					"Value": 20
				}, {
					"MassimaId": 21,
					"Value": 21
				}, {
					"MassimaId": 22,
					"Value": 22
				}, {
					"MassimaId": 23,
					"Value": 23
				}, {
					"MassimaId": 24,
					"Value": 24
				}]
			};

			var massimaoModel = new JSONModel(oData_Massima);
			that.getView().byId("idDurataMassima").setModel(massimaoModel, "massimaoModel");
			that.getView().byId("idDurataMassima1").setModel(massimaoModel, "massimaoModel");
			// End of Chandan

			// for the data binding example do not use the change event for check but the data binding parsing events
			Core.attachParseError(
				function (oEvent) {
					var oElement = oEvent.getParameter("element");

					if (oElement.setValueState) {
						oElement.setValueState(ValueState.Error);
					}
				});

			Core.attachValidationSuccess(
				function (oEvent) {
					var oElement = oEvent.getParameter("element");

					if (oElement.setValueState) {
						oElement.setValueState(ValueState.None);
					}
				});

		},
		/**
		 *	INVOKED FROM VIEW PART
		 * NAVIGATE BACK TO RepintHome
		 */
		onPressRepintHome: function (oEvent) {
			var _busyDialog = new sap.m.BusyDialog();
			_busyDialog.open();
			sap.m.URLHelper.redirect("https://repint-bfmyao56da.dispatcher.hana.ondemand.com", false); // For Dev
			//sap.m.URLHelper.redirect("https://repint-pmveyi6e6t.dispatcher.hana.ondemand.com", false); // For Production
			_busyDialog.close();
		},
		/**
		 *	INVOKED FROM VIEW PART
		 * ADD NEW RECORD OF TABLE idTableImpIntData
		 * UPON SUCCESS CALLS getImportiInterventiSet ELSE DISPLAY A ERROR MESSAGE
		 */
		onAddImpIntItem: function (oEvent) {
			var that = this;
			if (that.getView().byId("idTableImpIntData").getModel("ImpIntDataModel") === undefined) {
				// Getting values entered by user from Table "idTableImpInv"
				var objTable = that.getView().byId("idTableImpInv");

				that.mainData = {
					"ImportIInterCollection": [{
						"IDTIPOGIORNO": objTable.getItems()[0].getCells()[0].getSelectedItem().getText(),
						"ORAINIZIO": objTable.getItems()[0].getCells()[1].getValue(),
						"ORAFINE": objTable.getItems()[0].getCells()[2].getValue(),
						"VALORE": objTable.getItems()[0].getCells()[3].getValue(),
						"LIVELLO": objTable.getItems()[0].getCells()[4].getSelectedItem().getText(),
						"oEdit": true,
						"oDelete": true
					}]
				};

				that.oModelImpIntData = new JSONModel(that.mainData);
				that.getView().byId("idTableImpIntData").setModel(that.oModelImpIntData, "ImpIntDataModel");
			} else {
				var collection = that.getView().byId("idTableImpIntData").getModel("ImpIntDataModel").getProperty("/");
				// Getting values entered by user from Table "idTableImpInv"
				var objTable = that.getView().byId("idTableImpInv");

				var item = {
					"IDTIPOGIORNO": objTable.getItems()[0].getCells()[0].getSelectedItem().getText(),
					"ORAINIZIO": objTable.getItems()[0].getCells()[1].getValue(),
					"ORAFINE": objTable.getItems()[0].getCells()[2].getValue(),
					"VALORE": objTable.getItems()[0].getCells()[3].getValue(),
					"LIVELLO": objTable.getItems()[0].getCells()[4].getSelectedItem().getText(),
					"oEdit": true,
					"oDelete": true
				};
				collection.push(item);
				that.getView().byId("idTableImpIntData").getModel("ImpIntDataModel").setProperty("/", collection);

				var xsoBaseModel = that.getOwnerComponent().getModel("basexsoModel");
				if (objTable.getItems()[0].getCells()[1].getValue()) {
					var ini_string = objTable.getItems()[0].getCells()[1].getValue();
					var ORA_INI = ini_string.split(":")[0];
					var MIN_INI = ini_string.split(":")[1];
				} else {
					var ORA_INI = 0;
					var MIN_INI = 0;
				}
				if (objTable.getItems()[0].getCells()[2].getValue()) {
					var fine_string = objTable.getItems()[0].getCells()[2].getValue();
					var ORA_FINE = fine_string.split(":")[0];
					var MIN_FINE = fine_string.split(":")[1];
				} else {
					var ORA_FINE = 0;
					var MIN_FINE = 0;
				}
				that.getImportiInterventiSet(xsoBaseModel);
				var item_create = {
					"IDIMPORTIINTERVENTO": that.dataGenerate + 1,
					"IDTIPOGIORNO": objTable.getItems()[0].getCells()[0].getSelectedItem().getKey(),
					"ORA_INI": ORA_INI,
					"MIN_INI": MIN_INI,
					"ORA_FINE": ORA_FINE,
					"MIN_FINE": MIN_FINE,
					"VALORE": objTable.getItems()[0].getCells()[3].getValue(),
					"LIVELLO": objTable.getItems()[0].getCells()[4].getSelectedItem().getText(),
					"ORAINIZIO": Formatter.checkTime(objTable.getItems()[0].getCells()[1].getValue()),
					"ORAFINE": Formatter.checkTime(objTable.getItems()[0].getCells()[2].getValue()),
				};
				xsoBaseModel.create("/IMPORTIINTERVENTI2018", item_create, {
					success: function (oDataIn, oResponse) {
						MessageToast.show("Record successfully added");
						that.getImportiInterventiSet(xsoBaseModel);
					}.bind(that),
					error: function (oError) {
						MessageBox.error("Impossibile salvare. Contatta l'amministratore");
					}.bind(that)

				});
			}
		},
		/**
		 *	INVOKED FROM VIEW PART
		 * HANDLE YEAR AND MONTH CHANGE
		 */
		handleAnnoMeseChange: function (oEvent) {
			console.log(oEvent);
			var that = this;

			var oDate = oEvent.getSource().getDateValue();
			var firstDay = new Date(oDate.getFullYear(), oDate.getMonth() + 1, 1);
			var lastDay = new Date(oDate.getFullYear(), oDate.getMonth() + 2, 0);

			that.getView().byId("idDipendenteDate").setMinDate(lastDay);
			that.getView().byId("idDipendenteDate").setMaxDate(firstDay);

			that.getView().byId("idResponsabile").setMinDate(lastDay);
			that.getView().byId("idResponsabile").setMaxDate(firstDay);

			that.getView().byId("idHRDateProcesso").setMinDate(lastDay);
			that.getView().byId("idHRDateProcesso").setMaxDate(firstDay);

			that.getView().byId("idInvioFlussiAuto").setMinDate(lastDay);
			that.getView().byId("idInvioFlussiAuto").setMaxDate(firstDay);

		},
		/**
		 *	INVOKED FROM VIEW PART
		 * ADDS NEW FESTIVITA RECORD TO TABLE idTableFestivitaData
		 * SEND ERROR MESSAGE IF Mese Giorni VALUE SEECTED ALREADY EXISTS
		 * UPON SUCCESS CALLS getFestiviSet ELSE DISPLAY A ERROR MESSAGE
		 */
		onAddFestiviItem: function () {
			var that = this;
			// var data = that.getView().byId("idTableFestivitaData").getModel("FestiviModel").getProperty("/");

			// // Getting values entered by user from Table "idTableFestivita"
			var objTable = that.getView().byId("idTableFestivita");

			// var oEntry = {
			// 	"DESCRIZIONE": objTable.getItems()[0].getCells()[1].getValue(), 
			// 	"MMGG": Formatter.formatDate(objTable.getItems()[0].getCells()[0].getDateValue()),
			// 	"oEdit": true,
			// 	"oDelete": true
			// };
			// data.push(oEntry);
			// that.getView().byId("idTableFestivitaData").getModel("FestiviModel").setProperty("/", data);

			// Kapil - Below logic added to restrict user to enter unique value of Mese Giorni
			/////var _MMGG = Formatter.formatDate(objTable.getItems()[0].getCells()[0].getDateValue());
			//var _MMGG = Formatter.formatReadDate(objTable.getItems()[0].getCells()[0].getDateValue());
			var _MMGG = that.getView().byId("idMeseGiorni").getValue();

			if (_MMGG !== "" && _MMGG !== undefined && _MMGG !== null) {
				var oEntry = {
					"DESCRIZIONE": objTable.getItems()[0].getCells()[1].getValue(),
					"MMGG": _MMGG
				};

				var _FestiviModelData = that.getView().getModel("FestiviModel").getData();

				var filteredFestiviData = jQuery.grep(_FestiviModelData, function (a) {
					///return (a.MMGG == _MMGG.split("-")[1] + "-" + _MMGG.split("-")[0]); // "_MMGG" returns value from Hana DB in MM-dd format while "MMGG" value format is dd-MM in "_FestiviModelData"
					return (a.MMGG == _MMGG);
				});

				if (filteredFestiviData.length > 0) {
					MessageBox.error("Data già presente, selezionarne un'altra.");
				} else {
					var xsoBaseModel = that.getOwnerComponent().getModel("basexsoModel");
					//var repintFestiviModel = new sap.ui.model.json.JSONModel();
					var oRepintFestiviJson = [];

					xsoBaseModel.attachRequestSent(function () {
						that._busyDialog.open();
					});
					xsoBaseModel.attachRequestCompleted(function () {
						that._busyDialog.close();
					});

					var repintFestiviModel = new sap.ui.model.json.JSONModel();
					// Add FESTIVISET
					xsoBaseModel.create("/FESTIVISET", oEntry, {
						success: function (oDataIn, oResponse) {
							// xsoBaseModel.setRefreshAfterChange(true);
							// that.getView().getModel("FestiviModel").updateBindings(true);
							// that.getView().getModel("FestiviModel").refresh();
							// that.byId("idTableFestivitaData").getBinding("items").refresh();	
							that.getView().byId("idMeseGiorni").setValue("");
							that.getView().byId("idDescrizione").setValue("");
							that.getFestiviSet(xsoBaseModel);
							MessageToast.show("Festività salvata con successo");
						}.bind(that),
						error: function (oError) {
							//Handle the error
							MessageBox.error("Impossibile salvare. Contatta l'amministratore");
							jQuery.sap.log.getLogger().error("Aggiungi failed for FESTIVISET. Please contact administrator." + oError.toString());
						}.bind(that)

					});
				}
			} else {
				MessageBox.error("Mese Giorni cannot be blank");
			}

		},
		/**
		 *	INVOKED FROM VIEW PART
		 * HANDLES EDIT FUNCTIONALITY AND INVOKES onPress FUNCTION
		 */
		onEdit: function (e) {
			var that = this;
			var t = e.getSource().getParent();
			var a = that.getView().byId("idTableImpIntData");
			var o = a.indexOfItem(t);
			var i = a.getModel("ImpIntDataModel").getObject("/ImportIInterCollection")[o];
			if (i) {
				var n = a.getItems()[o];
				that.onPress(n, false);
				var r = a.getItems()[o];
				if (e.getSource().getPressed()) {
					that.onPress(r, true)
				} else {
					that.onPress(r, false)
				}
			}
		},
		/**
		 *	INVOKED FROM VIEW PART
		 * MODIFY EXISTING FESTIVITA RECORD TO TABLE idTableFestivitaData
		 * UPON SUCCESS CALLS getFestiviSet ELSE DISPLAY A ERROR MESSAGE
		 */
		onEditFestivi: function (e) {
			var that = this;
			that.tt = e.getSource().getParent();
			var a = that.getView().byId("idTableFestivitaData");
			var o = a.indexOfItem(that.tt);
			var i = a.getModel("FestiviModel").getObject("/")[o];
			if (i) {
				var n = a.getItems()[o];
				that.onPress(n, false);
				var r = a.getItems()[o];
				if (e.getSource().getPressed()) {
					that.onPress(r, true);
					this.oldData = JSON.stringify(i);
				} else {
					that.onPress(r, false);

					// Call FESTIVISET Update
					
					var t = e.getSource().getBindingContext("FestiviModel").getObject();
					//var repintFestiviModel = new sap.ui.model.json.JSONModel();
					//var oRepintFesti  viJson = [];

					if (t.MMGG !== "" && t.MMGG !== undefined && t.MMGG !== null) {

						// var _FestiviModelData = that.getView().getModel("FestiviModel").getData();

						// var filteredFestiviData = jQuery.grep(_FestiviModelData, function (a) {
						// 	///return (a.MMGG == _MMGG.split("-")[1] + "-" + _MMGG.split("-")[0]); // "_MMGG" returns value from Hana DB in MM-dd format while "MMGG" value format is dd-MM in "_FestiviModelData"
						// 	return (a.MMGG == t.MMGG);
						// });

						// if (filteredFestiviData.length > 0) {
						// 	//t.MMGG = that.getOwnerComponent().getModel("viewProperties").getProperty("/oldFestiviMeseGiorniDate"); // Reset to old value
						// 	that.onPress(r, true);
						// 	MessageBox.error("Data già presente, selezionarne un'altra.");
						// } else {
							
							var xsoBaseModel = that.getOwnerComponent().getModel("basexsoModel");
							xsoBaseModel.attachRequestSent(function () {
								that._busyDialog.open();
							});
							xsoBaseModel.attachRequestCompleted(function () {
								that._busyDialog.close();
							});

							var oldRec = JSON.parse(this.oldData);
							/////oldRec.MMGG = oldRec.MMGG.split("-")[1] + "-" + oldRec.MMGG.split("-")[0]; // Convert dd-MM format to MM-dd to store in Hana DB

							var oEntry = {
								"MMGG": oldRec.MMGG,
								"MMGG_NEW": t.MMGG,
								"DESCRIZIONE": oldRec.DESCRIZIONE,
								"DESCRIZIONE_NEW": t.DESCRIZIONE,
							};

							var sPayload = {
								"Object": {
									"Header": oEntry
								}
							};

							var sServiceUrl = "/HANAMDC/REPINT/RepintAdmin/xsodata/RepintAdmin.xsodata";
							var url = "/HANAMDC/REPINT/RepintAdmin/xsjs/updateAdmin.xsjs";
							$.ajax({

								url: sServiceUrl + "/",
								type: "GET",
								beforeSend: function (xhr) {
									xhr.setRequestHeader("X-CSRF-Token", "Fetch"); //Passing CSRF token fetch request in header of GET 
								},
								success: function (data, textStatus, XMLHttpRequest) {
									var token = XMLHttpRequest.getResponseHeader("X-CSRF-Token");
									$.ajax({
										url: url,
										type: "POST",
										contentType: "application/json",
										data: JSON.stringify(sPayload),
										beforeSend: function (xhr) {
											xhr.setRequestHeader("X-CSRF-Token", token); //Passing actual CSRF token we got from previous GET request
										},
										success: function (data1, textStatus1, XMLHttpRequest1) {
											console.log("Insert Success");
											console.log(textStatus1);
											//	that._valueHelpUserDialog.close();
											
											if(data1.toString().includes("Error")){ // Implies unique constraint violated
											
												// var a = that.getView().byId("idTableFestivitaData");
												// var o = a.indexOfItem(that.tt);
												// var i = a.getModel("FestiviModel").getObject("/")[o];
												// if (i) {
												// 	var n = a.getItems()[o];
												// 	that.onPress(n, true);
												// }											
												
												
												MessageBox.error("Data già presente, selezionarne un'altra.");												
											}else{
												MessageBox.success("Festività salvata con successo");
												that.getFestiviSet(xsoBaseModel);
											}
											//////////MessageToast.show("Festivita Record successfully added");
											///that.getDateDiProcessoSet(xsoBaseModel);
											

										},
										error: function (data1, textStatus1, XMLHttpRequest1) {
											MessageBox.error("Impossibile salvare. Contatta l'amministratore");
											jQuery.sap.log.getLogger().error("Modifica failed for Festivita. Please contact administrator." + oError.toString());
											console.log(textStatus1);

										}
									});
								}
							});

					//	}
					}
				}
			}

		},
		/**
		 *	INVOKED BY onEdit FUNCTION
		 * TO SET ELEMENT AS ENABLED OR DIABLED AND EDITABLE OR NON-EDITABLE
		 */
		onPress: function (e, t) {
			var a = e.getCells();
			for (var o = 0; o < a.length - 2; o++) {
				var i = a[o];
				var aa = i.getMetadata();
				var obj = aa.getElementName();
				if (obj === "sap.m.Input" || obj === "sap.m.DatePicker" || obj === "sap.m.CheckBox" || obj === "sap.m.Select") {
					i.setEnabled(t);
					i.setEditable(t)
				}
			}
		},
		
		// This function is called after service call while performing "Modifica" operation for "Data Festivita" tab
		onPressAfterMoifica: function (e, t) {
			var a = e.getCells();
			for (var o = 0; o < a.length - 2; o++) {
				var i = a[o];
				var aa = i.getMetadata();
				var obj = aa.getElementName();
				if (obj === "sap.m.Input" || obj === "sap.m.DatePicker" || obj === "sap.m.CheckBox" || obj === "sap.m.Select") {
					i.setEnabled(t);
					i.setEditable(t)
				}
			}
		},		
		/**
		 *	INVOKED FROM VIEW PART
		 * INSERT EXISTING RECORD OF TABLE idTableDateProcessoData
		 * UPON SUCCESS CALLS getDateDiProcessoSet ELSE DISPLAY A ERROR MESSAGE
		 */
		onPressDateProcesso: function () {
			var that = this;
			var DatediprocessoModelData;
			var maxIdDataProcesso;

			//Getting values entered by user from Table "idTableDateProcessoData"
			var objTable = that.getView().byId("idTableDateProcessoData");

			if (that.getView().getModel("DatediprocessoModel") !== undefined || that.getView().getModel("DatediprocessoModel") === null) {
				if (that.getView().getModel("DatediprocessoModel").getData().length > 0) {
					DatediprocessoModelData = that.getView().getModel("DatediprocessoModel").getData();
					maxIdDataProcesso = DatediprocessoModelData[DatediprocessoModelData.length - 1].IDDATAPROCESSO;
				} else if (that.getView().getModel("DatediprocessoModel").getData().length === 0) {
					maxIdDataProcesso = 0;
				}
			}

			if (that.getView().byId("idmeseanno").getDateValue() === null) {
				MessageBox.error("Il campo Mese / Anno deve essere valorizzato");
				return;
			} else if (that.getView().byId("idDipendenteDate").getDateValue() === null) {
				MessageBox.error("Il campo Dipendente deve essere valorizzato");
				return
			} else if (that.getView().byId("idResponsabile").getDateValue() === null) {
				MessageBox.error("Il campo Responsabile deve essere valorizzato");
				return;
			} else if (that.getView().byId("idHRDateProcesso").getDateValue() === null) {
				MessageBox.error("Il campo HR deve essere valorizzato");
				return;
			} else if (that.getView().byId("idInvioFlussiAuto").getDateValue() === null) {
				MessageBox.error("In campo \"Flussi Automatici\" non può essere vuoto");
				return;
			}

			var meseannodt = that.getView().byId("idmeseanno").getDateValue();
			// var DipendenteDt = DipendenteDt.getFullYear() + "-" + Formatter.formatDate(that.getView().byId("idDipendenteDate").getDateValue()) +
			// 	"T00:00:00";
			var DipendenteDt = that.getView().byId("idDipendenteDate").getDateValue().getFullYear() + "-" + Formatter.formatDate(that.getView()
					.byId("idDipendenteDate").getDateValue()) +
				"T00:00:00";
			//DipendenteDt = new Date(DipendenteDt).toUTCString();
			// var ResponsabileDt = meseannodt.getFullYear() + "-" + Formatter.formatDate(that.getView().byId("idResponsabile").getDateValue()) +
			// 	"T00:00:00";
			var ResponsabileDt = that.getView().byId("idResponsabile").getDateValue().getFullYear() + "-" + Formatter.formatDate(that.getView()
					.byId("idResponsabile").getDateValue()) +
				"T00:00:00";
			//ResponsabileDt = new Date(ResponsabileDt).toUTCString();
			// var HRDateProcessoDt = meseannodt.getFullYear() + "-" + Formatter.formatDate(that.getView().byId("idHRDateProcesso").getDateValue()) +
			// 	"T00:00:00";
			var HRDateProcessoDt = that.getView().byId("idHRDateProcesso").getDateValue().getFullYear() + "-" + Formatter.formatDate(that.getView()
					.byId("idHRDateProcesso").getDateValue()) +
				"T00:00:00";
			//HRDateProcessoDt = new Date(HRDateProcessoDt).toUTCString();
			// var InvioFlussiAutoDt = meseannodt.getFullYear() + "-" + Formatter.formatDate(that.getView().byId("idInvioFlussiAuto").getDateValue()) +
			// 	"T00:00:00";
			var InvioFlussiAutoDt = that.getView().byId("idInvioFlussiAuto").getDateValue().getFullYear() + "-" + Formatter.formatDate(that.getView()
					.byId("idInvioFlussiAuto").getDateValue()) +
				"T00:00:00";
			//InvioFlussiAutoDt = new Date(InvioFlussiAutoDt).toUTCString();
			meseannodt = meseannodt.getFullYear() + "-" + Formatter.formatDate(that.getView().byId("idmeseanno").getDateValue()) + "T00:00:00";
			//meseannodt = new Date(meseannodt).toUTCString();
			var BPdt = new Date();
			var AMMINISTRAZIONEdt = new Date();

			var Header = {
				"IDDATAPROCESSO": '',
				"MESEANNO": meseannodt,
				"DIPENDENTE": DipendenteDt,
				"RESPONSABILE": ResponsabileDt,
				"HR": HRDateProcessoDt,
				"INVIO_FLUSSI": InvioFlussiAutoDt,
				"BP": BPdt,
				"AMMINISTRAZIONE": AMMINISTRAZIONEdt
			};
			var locSplit = Header.MESEANNO.split('-');
			Header.MESEANNO = locSplit[0] + '-' + locSplit[1] + '-' + "01T00:00:00";
			var sPayload = {
				"Object": {
					"Header": Header
				}
			};
			var xsoBaseModel = that.getOwnerComponent().getModel("basexsoModel");
			xsoBaseModel.attachRequestSent(function () {
				that._busyDialog.open();
			});
			xsoBaseModel.attachRequestCompleted(function () {
				that._busyDialog.close();
			});
			var sServiceUrl = "/HANAMDC/REPINT/RepintAdmin/xsodata/RepintAdmin.xsodata";
			var url = "/HANAMDC/REPINT/RepintAdmin/xsjs/insertDateProcesso.xsjs";
			$.ajax({

				url: sServiceUrl + "/",
				type: "GET",
				beforeSend: function (xhr) {
					xhr.setRequestHeader("X-CSRF-Token", "Fetch"); //Passing CSRF token fetch request in header of GET 
				},
				success: function (data, textStatus, XMLHttpRequest) {
					var token = XMLHttpRequest.getResponseHeader("X-CSRF-Token");
					$.ajax({
						url: url,
						type: "POST",
						contentType: "application/json",
						data: JSON.stringify(sPayload),
						beforeSend: function (xhr) {
							xhr.setRequestHeader("X-CSRF-Token", token); //Passing actual CSRF token we got from previous GET request
						},
						success: function (data1, textStatus1, XMLHttpRequest1) {
							console.log("Insert Success");
							console.log(textStatus1);
							//	that._valueHelpUserDialog.close();
							MessageBox.success("Date di processo salvata con successo");
							that.getView().byId("idmeseanno").setValue("");
							that.getView().byId("idDipendenteDate").setValue("");
							that.getView().byId("idResponsabile").setValue("");
							that.getView().byId("idHRDateProcesso").setValue("");
							that.getView().byId("idInvioFlussiAuto").setValue("");
							////MessageToast.show("Date Processo Record successfully added");
							that.getDateDiProcessoSet(xsoBaseModel);

						},
						error: function (data1, textStatus1, XMLHttpRequest1) {
							MessageBox.error("Impossibile salvare. Contatta l'amministratore");
							jQuery.sap.log.getLogger().error("Inserisci failed for Date Processo. Please contact administrator." + oError.toString());
							console.log(textStatus1);

						}
					});
				}
			});

		},
		/**
		 *	INVOKED FROM VIEW PART
		 * MODIFY EXISTING RECORD OF TABLE idTableDateProcessoData
		 * UPON SUCCESS CALLS getDateDiProcessoSet ELSE DISPLAY A ERROR MESSAGE
		 */
		onEditDatediprocesso: function (e) {
			var that = this;
			var t = e.getSource().getParent();
			var a = that.getView().byId("idTableDateProcessoData");
			var o = a.indexOfItem(t);
			var i = a.getModel("DatediprocessoModel").getObject("/")[o];
			if (i) {
				var n = a.getItems()[o];
				that.onPress(n, false);
				var r = a.getItems()[o];
				if (e.getSource().getPressed()) {
					that.onPress(r, true)

				} else {
					that.onPress(r, false)
					var xsoBaseModel = that.getOwnerComponent().getModel("basexsoModel");
					var t = e.getSource().getBindingContext("DatediprocessoModel").getObject();

					if (t.MESEANNO.split('-')[0].length == 2) {
						var MESEANNO1 = t.MESEANNO.split('-')[2] + '-' + t.MESEANNO.split('-')[1] + '-' + t.MESEANNO.split('-')[0] + "T00:00:00";
					} else {
						var MESEANNO1 = t.MESEANNO + "T00:00:00";
					}

					if (t.DIPENDENTE.split('-')[0].length == 2) {
						var DIPENDENTE1 = t.DIPENDENTE.split('-')[2] + '-' + t.DIPENDENTE.split('-')[1] + '-' + t.DIPENDENTE.split('-')[0] + "T00:00:00";
					} else {
						var DIPENDENTE1 = t.DIPENDENTE + "T00:00:00";
					}

					if (t.RESPONSABILE.split('-')[0].length == 2) {
						var RESPONSABILE1 = t.RESPONSABILE.split('-')[2] + '-' + t.RESPONSABILE.split('-')[1] + '-' + t.RESPONSABILE.split('-')[0] +
							"T00:00:00";
					} else {
						var RESPONSABILE1 = t.RESPONSABILE + "T00:00:00";
					}
					if (t.HR.split('-')[0].length == 2) {
						var HR1 = t.HR.split('-')[2] + '-' + t.HR.split('-')[1] + '-' + t.HR.split('-')[0] + "T00:00:00";
					} else {
						var HR1 = t.HR + "T00:00:00";
					}
					if (t.INVIO_FLUSSI.split('-')[0].length == 2) {
						var INVIO_FLUSSI1 = t.INVIO_FLUSSI.split('-')[2] + '-' + t.INVIO_FLUSSI.split('-')[1] + '-' + t.INVIO_FLUSSI.split('-')[0] +
							"T00:00:00";
					} else {
						var INVIO_FLUSSI1 = t.INVIO_FLUSSI + "T00:00:00";
					}
					var BPdt;
					var AMMINISTRAZIONEdt;

					if (i.BP == "") {
						BPdt = new Date();
					} else {
						BPdt = t.BP.split('-')[2] + '-' + t.BP.split('-')[1] + '-' + t.BP.split('-')[0] + "T00:00:00";
					}
					if (i.AMMINISTRAZIONE == "") {
						AMMINISTRAZIONEdt = new Date();
					} else {
						AMMINISTRAZIONEdt = t.AMMINISTRAZIONE.split('-')[2] + '-' + t.AMMINISTRAZIONE.split('-')[1] + '-' + t.AMMINISTRAZIONE.split('-')[
							0] + "T00:00:00";
					}

					var Header = {
						"IDDATAPROCESSO": i.IDDATAPROCESSO,
						"MESEANNO": MESEANNO1,
						"DIPENDENTE": DIPENDENTE1,
						"RESPONSABILE": RESPONSABILE1,
						"HR": HR1,
						"INVIO_FLUSSI": INVIO_FLUSSI1,
						"BP": BPdt,
						"AMMINISTRAZIONE": AMMINISTRAZIONEdt
					};

					var sPayload = {
						"Object": {
							"Header": Header
						}
					};
					xsoBaseModel.attachRequestSent(function () {
						that._busyDialog.open();
					});
					xsoBaseModel.attachRequestCompleted(function () {
						that._busyDialog.close();
					});

					var sServiceUrl = "/HANAMDC/REPINT/RepintAdmin/xsodata/RepintAdmin.xsodata";
					var url = "/HANAMDC/REPINT/RepintAdmin/xsjs/updateDateProcesso.xsjs";
					$.ajax({

						url: sServiceUrl + "/",
						type: "GET",
						beforeSend: function (xhr) {
							xhr.setRequestHeader("X-CSRF-Token", "Fetch"); //Passing CSRF token fetch request in header of GET 
						},
						success: function (data, textStatus, XMLHttpRequest) {
							var token = XMLHttpRequest.getResponseHeader("X-CSRF-Token");
							$.ajax({
								url: url,
								type: "POST",
								contentType: "application/json",
								data: JSON.stringify(sPayload),
								beforeSend: function (xhr) {
									xhr.setRequestHeader("X-CSRF-Token", token); //Passing actual CSRF token we got from previous GET request
								},
								success: function (data1, textStatus1, XMLHttpRequest1) {
									console.log("Insert Success");
									console.log(textStatus1);
									//	that._valueHelpUserDialog.close();
									//MessageBox.success("Table Updated Successfully");
									MessageToast.show("Data di Processo salvata con successo");
									that.getDateDiProcessoSet(xsoBaseModel);

								},
								error: function (data1, textStatus1, XMLHttpRequest1) {
									MessageBox.error("Impossibile salvare. Contatta l'amministratore");
									jQuery.sap.log.getLogger().error("Modifica failed for Date Processo. Please contact administrator." + oError.toString());
									console.log(textStatus1);

								}
							});
						}
					});

				}
			}

		},
		/**
		 *	INVOKED FROM VIEW PART
		 * DELETE EXISTING RECORD OF TABLE idTableDateProcessoData
		 * UPON SUCCESS CALLS getDateDiProcessoSet ELSE DISPLAY A ERROR MESSAGE
		 */
		onDeleteDatediprocesso: function (e) {
			var that = this;
			var xsoBaseModel = that.getOwnerComponent().getModel("basexsoModel");
			var t = e.getSource().getBindingContext("DatediprocessoModel").getObject();

			xsoBaseModel.attachRequestSent(function () {
				that._busyDialog.open();
			});
			xsoBaseModel.attachRequestCompleted(function () {
				that._busyDialog.close();
			});

			// Remove deleted record from DATEDIPROCESSO
			xsoBaseModel.remove("/DATEDIPROCESSO(" + t.IDDATAPROCESSO + ")", {
				success: function (oDataIn, oResponse) {
					console.log("DATEDIPROCESSO Delete Success");
					MessageToast.show("Data di Processo cancellata con successo");
					that.getDateDiProcessoSet(xsoBaseModel);

				}.bind(that),
				error: function (oError) {
					//Handle the error
					MessageBox.error("Impossibile salvare. Contatta l'amministratore");
					jQuery.sap.log.getLogger().error("Elimina failed for Date Processo. Please contact administrator." + oError.toString());
				}.bind(that)
			});
		},
		/**
		 * INVOKED FROM VIEW PART
		 * GET MESEANNO FOR TABLE idTableDateProcessoData by month, year
		 */
		handleDateProcessoAnnoMeseChange: function (oEvent) {
			var that = this;
			var index = that.getView().byId("idTableDateProcessoData").indexOfItem(oEvent.getSource().getParent());
			var oData = that.getView().byId("idTableDateProcessoData").getModel("DatediprocessoModel").getProperty("/");
			oData[index].MESEANNO = Formatter.formatDatediprocessoDate(oEvent.getSource().getDateValue());
			that.getView().byId("idTableDateProcessoData").getModel("DatediprocessoModel").setProperty("/", oData);
		},
		/**
		 * INVOKED FROM VIEW PART
		 * GET DIPENDENTE FOR TABLE idTableDateProcessoData by DAY, MONTH
		 */
		handleDateProcessoDipendenteChange: function (oEvent) {
			var that = this;
			var index = that.getView().byId("idTableDateProcessoData").indexOfItem(oEvent.getSource().getParent());
			var oData = that.getView().byId("idTableDateProcessoData").getModel("DatediprocessoModel").getProperty("/");
			oData[index].DIPENDENTE = Formatter.formatDatediprocessoDate(oEvent.getSource().getDateValue());
			that.getView().byId("idTableDateProcessoData").getModel("DatediprocessoModel").setProperty("/", oData);
		},
		/**
		 * INVOKED FROM VIEW PART
		 * GET RESPONSABILE DATE FOR TABLE idTableDateProcessoData by DAY, MONTH
		 */
		handleDateProcessoResponsabileChange: function (oEvent) {
			var that = this;
			var index = that.getView().byId("idTableDateProcessoData").indexOfItem(oEvent.getSource().getParent());
			var oData = that.getView().byId("idTableDateProcessoData").getModel("DatediprocessoModel").getProperty("/");
			oData[index].RESPONSABILE = Formatter.formatDatediprocessoDate(oEvent.getSource().getDateValue());
			that.getView().byId("idTableDateProcessoData").getModel("DatediprocessoModel").setProperty("/", oData);
		},
		/**
		 * INVOKED FROM VIEW PART
		 * GET HR DATE FOR TABLE idTableDateProcessoData by DAY, MONTH
		 */
		handleDateProcessoHRChange: function (oEvent) {
			var that = this;
			var index = that.getView().byId("idTableDateProcessoData").indexOfItem(oEvent.getSource().getParent());
			var oData = that.getView().byId("idTableDateProcessoData").getModel("DatediprocessoModel").getProperty("/");
			oData[index].HR = Formatter.formatDatediprocessoDate(oEvent.getSource().getDateValue());
			that.getView().byId("idTableDateProcessoData").getModel("DatediprocessoModel").setProperty("/", oData);
		},
		/**
		 * INVOKED FROM VIEW PART
		 * GET INVIO_FLUSSI FOR TABLE idTableDateProcessoData by DAY, MONTH
		 */
		handleDateProcessoInvFluChange: function (oEvent) {
			var that = this;
			var index = that.getView().byId("idTableDateProcessoData").indexOfItem(oEvent.getSource().getParent());
			var oData = that.getView().byId("idTableDateProcessoData").getModel("DatediprocessoModel").getProperty("/");
			oData[index].INVIO_FLUSSI = Formatter.formatDatediprocessoDate(oEvent.getSource().getDateValue());
			that.getView().byId("idTableDateProcessoData").getModel("DatediprocessoModel").setProperty("/", oData);
		},
		/**
		 * INVOKED FROM VIEW PART
		 * FIRED WHEN NAVIGATING IN CALENDAR POPUP OF TABLE idTableFestivitaData
		 */
		handleFestiviMeseGiorniOldDate: function (oEvent) {
			console.log(oEvent);
			if (oEvent.getSource().getValue() !== "" && oEvent.getSource().getValue() !== null) {
				//this.getOwnerComponent().getModel("viewProperties").setProperty("/oldReperbilitaDate", oEvent.getSource().getValue());
				
				
				this.getOwnerComponent().getModel("viewProperties").setProperty("/oldFestiviMeseGiorniDate", oEvent.getSource().getValue().split("-")[1] + "-" + oEvent.getSource().getValue().split("-")[0]);
			} else {
				this.getOwnerComponent().getModel("viewProperties").setProperty("/oldFestiviMeseGiorniDate", null);
			}

			// var vYear = new Date().getFullYear();
			//         var vDate = new Date(vYear,oEvent.getSource().getProperty("dateValue").getMonth(),oEvent.getSource().getProperty("dateValue").getDate());
			//         oEvent.getSource().setProperty("dateValue",vDate);			

		},
		/**
		 * INVOKED FROM VIEW PART
		 * HANDLE NEW DATE OF TABLE idTableFestivitaData
		 */
		handleFestiviMeseGiorniDate: function (oEvent) {
			console.log(oEvent);
			var that = this;
			//var t = oEvent.getSource().getParent();
			//var a = that.getView().byId("idTableFestivitaData");
			var index = that.getView().byId("idTableFestivitaData").indexOfItem(oEvent.getSource().getParent());
			//var i = a.getModel("FestiviModel").getObject("/")[o];
			var oData = that.getView().byId("idTableFestivitaData").getModel("FestiviModel").getProperty("/");
			//var oData = oFestivitaModel.getProperty("/");			
			oData[index].MMGG = Formatter.formatDate(oEvent.getSource().getDateValue());

			//var _date = oEvent.getSource().getValue();
			//oData[index].MMGG = ( _date.split("/")[1] < 10 ? '0' + _date.split("/")[1] : _date.split("/")[1]) + "-" + (_date.split("/")[0]  < 10 ? '0' + _date.split("/")[0] : _date.split("/")[0])  ;

			that.getView().byId("idTableFestivitaData").getModel("FestiviModel").setProperty("/", oData);
		},

		// onDelete: function (e) {
		// 	var that = this;
		// 	// var t = e.getSource().getParent();
		// 	// var a = that.getView().byId("idTableImpIntData");
		// 	// var o = a.indexOfItem(t);
		// 	// that.mainData.ImportIInterCollection.splice(a, 1);
		// 	// that.oModelImpIntData.refresh();

		// 	var t = e.getSource().getBindingContext("ImpIntDataModel").getObject();
		// 	for (var a = 0; a < that.mainData.ImportIInterCollection.length; a++) {
		// 		if (that.mainData.ImportIInterCollection[a] == t) {
		// 			that.mainData.ImportIInterCollection.splice(a, 1);
		// 			that.oModelImpIntData.refresh();
		// 			break
		// 		}
		// 	}

		// },
		/**
		 *	INVOKED FROM VIEW PART
		 * DELETE A FESTIVITA RECORD TO TABLE idTableFestivitaData
		 * UPON SUCCESS CALLS getFestiviSet ELSE DISPLAY A ERROR MESSAGE
		 */
		onDeleteFestivi: function (e) {
			var that = this;
			var xsoBaseModel = that.getOwnerComponent().getModel("basexsoModel");
			var t = e.getSource().getBindingContext("FestiviModel").getObject();
			//var repintFestiviModel = new sap.ui.model.json.JSONModel();
			//var oRepintFestiviJson = [];

			xsoBaseModel.attachRequestSent(function () {
				that._busyDialog.open();
			});
			xsoBaseModel.attachRequestCompleted(function () {
				that._busyDialog.close();
			});

			// repintFestiviModel.setData(oDataIn.results);
			// that.getView().setModel(repintFestiviModel, "FestiviModel");pintFestiviModel = new sap.ui.model.json.JSONModel();
			// Remove FESTIVISET

			////////t.MMGG = t.MMGG.split("-")[1] + "-" + t.MMGG.split("-")[0]; // Convert dd-MM format to MM-dd to store in Hana DB

			xsoBaseModel.remove("/FESTIVISET('" + t.MMGG + "')", {
				success: function (oDataIn, oResponse) {
					console.log(" FestiviSet Delete Success");

					that.getFestiviSet(xsoBaseModel);
					MessageToast.show("Festività cancellata con successo");
				}.bind(that),
				error: function (oError) {
					//Handle the error
					MessageBox.error("Elimina failed for FestiviSet. Please contact administrator.");
					jQuery.sap.log.getLogger().error("Elimina failed for FestiviSet. Please contact administrator." + oError.toString());
				}.bind(that)
			});

			// var t = e.getSource().getBindingContext("FestiviModel").getObject();
			// var oFestiviModel = that.getView().byId("idTableFestivitaData").getModel("FestiviModel");

			// for (var a = 0; a < oFestiviModel.getData().length; a++) {
			// 	if (oFestiviModel.getData()[a] == t) {
			// 		oFestiviModel.getData().splice(a, 1);
			// 		oFestiviModel.refresh();
			// 		break
			// 	}
			// }

		},
		/**
		 * INVOKED FROM VIEW PART
		 * HANDLE TIME CHANGE OF TABLE idTableImpInv
		 */
		handleChange: function (oEvent) {
			var oTP = oEvent.getSource(),
				sValue = oEvent.getParameter("value"),
				bValid = oEvent.getParameter("valid");

			if (bValid) {
				oTP.setValueState(ValueState.None);
			} else {
				oTP.setValueState(ValueState.Error);
			}
		},

		// onEdit1: function (e) {
		// 	var t = e.getSource().getParent().getParent();
		// 	var i = that.getView().byId("idTableHistory1");
		// 	var a = i.indexOfItem(t);
		// 	//var s = i.getModel("MainModel1").getObject("/ItemsInfo1")[a];
		// 	var s = true;

		// 	if (s) {
		// 		var l = i.getItems()[a];
		// 		that.onPress1(l, false);
		// 		var h = i.getItems()[a];
		// 		if (e.getSource().getPressed()) {
		// 			that.onPress1(h, true)
		// 		} else {
		// 			that.onPress1(h, false)
		// 		}
		// 	}
		// },

		// onPress1: function (e, t) {
		// 	var i = e.getCells();
		// 	for (var a = 1; a < i.length - 1; a++) {
		// 		var s = i[a];
		// 		if (s.getItems()) {
		// 			var l = s.getItems();
		// 			$(l).each(function (e) {
		// 				var i = l[e].getMetadata();
		// 				var a = i.getElementName();
		// 				if (a == "sap.m.Text") {
		// 					l[e].setVisible(!t)
		// 				}
		// 				if (a == "sap.m.CheckBox") {
		// 					l[e].setVisible(t);
		// 					l[e].setEditable(t)
		// 				}
		// 				if (a == "sap.m.DatePicker") {
		// 					l[e].setVisible(t);
		// 					l[e].setEditable(t)
		// 				}
		// 				if (a == "sap.m.TimePicker") {
		// 					l[e].setVisible(t);
		// 					l[e].setEditable(t)
		// 				}
		// 				if (a == "sap.m.Select") {
		// 					l[e].setVisible(t);
		// 					l[e].setEditable(t)
		// 				}
		// 				if (a == "sap.m.Input") {
		// 					l[e].setVisible(t);
		// 					l[e].setEditable(t)
		// 				}
		// 				if (a == "sap.m.Label") {
		// 					l[e].setVisible(t)
		// 				}
		// 			})
		// 		}
		// 	}
		// },

		// onDelete1: function (e) {
		// 	var t = e.getSource().getParent().getParent();
		// 	var i = that.getView().byId("idTableHistory1");
		// 	var a = i.indexOfItem(t);
		// 	var s = i.getModel("MainModel1").getObject("/ItemsInfo1")[a];
		// 	for (var l = 0; l < that.mainData1.ItemsInfo1.length; l++) {
		// 		if (that.mainData1.ItemsInfo1[l] == s) {
		// 			that.mainData1.ItemsInfo1.splice(l, 1);
		// 			that.oMainModel1.refresh();
		// 			break
		// 		}
		// 	}
		// 	that.getView().byId("txtAggiorna1").setText(that.mainData1.ItemsInfo1.length);
		// 	var h = 0;
		// 	var r = 0;
		// 	var f = 0;
		// 	var o = 0;
		// 	var n = 0;
		// 	var b = 0;
		// 	for (var l = 0; l < that.mainData1.ItemsInfo1.length; l++) {
		// 		if (that.mainData1.ItemsInfo1[l].h1h == true) {
		// 			h = h + 1
		// 		}
		// 		if (that.mainData1.ItemsInfo1[l].h12h == true) {
		// 			r = r + 1
		// 		}
		// 		if (that.mainData1.ItemsInfo1[l].h24h == true) {
		// 			f = f + 1
		// 		}
		// 		if (that.mainData1.ItemsInfo1[l].h46h == true) {
		// 			o = o + 1
		// 		}
		// 		if (that.mainData1.ItemsInfo1[l].h68h == true) {
		// 			n = n + 1
		// 		}
		// 		if (that.mainData1.ItemsInfo1[l].h8h == true) {
		// 			b = b + 1
		// 		}
		// 	}
		// 	that.getView().byId("txt1h").setText(h);
		// 	that.getView().byId("txt12h").setText(r);
		// 	that.getView().byId("txt24h").setText(f);
		// 	that.getView().byId("txt46h").setText(o);
		// 	that.getView().byId("txt68h").setText(n);
		// 	that.getView().byId("txt8h").setText(b)
		// },			

		// onDeleteCategory2: function (e) {
		// 	var t = that.getView().getModel("MainModel1").getProperty("/ItemsInfo1");
		// 	var i = e.getSource().getParent().getParent().indexOfItem(e.getSource().getParent());
		// 	if (t.length - 1 === i) {
		// 		t[i - 1].bAdd = true
		// 	}
		// 	t.splice(i, 1);
		// 	if (t.length === 1) {
		// 		t[0].bDelete = false;
		// 		t[0].bAdd = true
		// 	}
		// 	that.getView().getModel("MainModel1").setProperty("/ItemsInfo1", t);
		// 	that.getView().byId("txtAggiorna1").setText(t.length);
		// 	that.getView().byId("txtElimina1").setText(t.length)
		// },

		/**
		 * Binds the view to the object path and expands the aggregated line items.
		 * @function
		 * @param {sap.ui.base.Event} oEvent pattern match event in route 'object'
		 * @private
		 */
		_onObjectMatched: function (oEvent) {

			//	alert("Inside GestisciDelegati");
		},
		/**
		 *	NAVIGATE BACK
		 */
		handleBack: function (e) {
			var that = this;
			var sPreviousHash = History.getInstance().getPreviousHash();
			if (sPreviousHash !== undefined) {
				// eslint-disable-next-line sap-no-history-manipulation
				history.go(-1);
			} else {
				that.getOwnerComponent().getRouter().navTo("object");
			}
		},

		/**
		 * Similar to onAfterRendering, but this hook is invoked before the controller's View is re-rendered
		 * (NOT before the first rendering! onInit() is used for that one!).
		 * @memberOf vodafone.RepintApprov.repintapproval.view.GestioneCalcoloeregole
		 */
		//	onBeforeRendering: function() {
		//
		//	},

		/**
		 * Called when the View has been rendered (so its HTML is part of the document). Post-rendering manipulations of the HTML could be done here.
		 * This hook is the same one that SAPUI5 controls get after being rendered.
		 * @memberOf vodafone.RepintApprov.repintapproval.view.GestioneCalcoloeregole
		 */
		onAfterRendering: function () {
			var that = this;
			var xsoBaseModel = that.getOwnerComponent().getModel("basexsoModel");
			that.getFestiviSet(xsoBaseModel);
			that.getStabilimentiSet(xsoBaseModel);
			that.getDateDiProcessoSet(xsoBaseModel);
			that.getImportiInterventiSet(xsoBaseModel);
			that.getImportiInterventiLPNSet(xsoBaseModel);
			that.getImportiRep(xsoBaseModel);
			that.getRegole(xsoBaseModel);
			//Rashmi 
			that.getRegoleBlocco(xsoBaseModel);
			that.getRegoleCompensativeMultipli(xsoBaseModel);

		},
		/**
		 *	CALLED onAfterRendering AND BY onAddFestiviItem, AND onDeleteFestivi FUNCTION
		 * TO SET DATA INTO MODEL USED TO DISPLAY IN TABLE idTableFestivitaData
		 */
		getFestiviSet: function (xsoBaseModel) {
			var that = this;
			var repintFestiviModel = new sap.ui.model.json.JSONModel();
			var oRepintFestiviJson = [];
			////var oRepintFestiviJsonData = {};

			xsoBaseModel.attachRequestSent(function () {
				that._busyDialog.open();
			});
			xsoBaseModel.attachRequestCompleted(function () {
				that._busyDialog.close();
			});

			// Get FESTIVISET
			var _MMGGSplitArr = [];
			xsoBaseModel.read("/FESTIVISET", {
				success: function (oDataIn, oResponse) {
					console.log(" FestiviSet");
					console.log(oDataIn.results);

					// for (var i = 0; i < oDataIn.results.length; ++i) {
					// 	if (oDataIn.results[i].MMGG !== "" && oDataIn.results[i].MMGG !== undefined && oDataIn.results[i].MMGG !== null) {

					// 		_MMGGSplitArr = (oDataIn.results[i].MMGG).split("-");

					// 		oDataIn.results[i].MMGG = Formatter.formatFestivitaDate(new Date(new Date().getFullYear() + "-" + _MMGGSplitArr[0] + "-" + _MMGGSplitArr[1] ));
					// 	}
					// }

					repintFestiviModel.setData(oDataIn.results);
					repintFestiviModel.refresh();
					repintFestiviModel.updateBindings(true);
					that.getView().setModel(repintFestiviModel, "FestiviModel");

				}.bind(that),
				error: function (oError) {
					//Handle the error
					MessageBox.error("Impossibile ottenere le informazioni per il calcolo delle festività. Contatta l'amministratore");
					jQuery.sap.log.getLogger().error("Data fetch failed for FestiviSet. Please contact administrator." + oError.toString());
				}.bind(that)
			});
		},
		/**
		 *	CALLED onAfterRendering
		 * SET DATA INTO MODEL USED TO DISPLAY IN TABLE idTableStabilimentiData
		 */
		getStabilimentiSet: function (xsoBaseModel) {
			var that = this;
			var repintStabilimentiModel = new sap.ui.model.json.JSONModel();
			//var oRepintStabilimentiJson = [];
			//var oRepintStabilimentiJsonData = {};

			xsoBaseModel.attachRequestSent(function () {
				that._busyDialog.open();
			});
			xsoBaseModel.attachRequestCompleted(function () {
				that._busyDialog.close();
			});

			// Get STABILIMENTISET
			xsoBaseModel.read("/STABILIMENTISET", {
				success: function (oDataIn, oResponse) {
					console.log(" StabilimentiSet");
					console.log(oDataIn.results);

					// for (var i = 0; i < oDataIn.results.length; ++i) {
					// 	oRepintStabilimentiJsonData = {
					// 		"DACONTRATTO": oDataIn.results[i].DACONTRATTO,
					// 	};

					// 	oRepintStabilimentiJson.push(oRepintStabilimentiJsonData);
					// 	oRepintStabilimentiJsonData = {}; 
					// }
					repintStabilimentiModel.setData(oDataIn.results);
					that.getView().setModel(repintStabilimentiModel, "StabilimentiModel");

				}.bind(that),
				error: function (oError) {
					//Handle the error
					MessageBox.error("Data fetch failed for Santo Patrono. Please contact administrator.");
					jQuery.sap.log.getLogger().error("Data fetch failed for Santo Patrono. Please contact administrator." + oError.toString());
				}.bind(that)
			});
		},
		//Begin of Chandan Shashwat
		/**
		 *	INVOKED FROM VIEW PART
		 * ADD NEW Importi Interventi RECORD TO TABLE idTableLPNIntData1
		 */
		onAddImpIntlpnItem: function (oEvent) {
			var that = this;
			if (that.getView().byId("idTableInterLPN").getModel("ImpIntLPNDataModel") === undefined) {
				// Getting values entered by user from Table "idTableImpInv"
				var objTable = that.getView().byId("idTableInterLPN");

				that.mainData = {
					"ImportIInterCollection": [{
						"TipoGiorno": objTable.getItems()[0].getCells()[0].getSelectedItem().getText(),
						"OraInizio": objTable.getItems()[0].getCells()[1].getSelectedItem().getText(),
						"Valore": objTable.getItems()[0].getCells()[2].getValue(),
						"Livello": objTable.getItems()[0].getCells()[3].getSelectedItem().getText(),
						"oEdit": true,
						"oDelete": true
					}]
				};

				that.oModelImpIntData = new JSONModel(that.mainData);
				that.getView().byId("idTableInterLPN").setModel(that.oModelImpIntData, "ImpIntDataModel");
			} else {
				var collection = that.getView().byId("idTableImpIntData").getModel("ImpIntDataModel").getProperty("/ImportIInterCollection");
				// Getting values entered by user from Table "idTableImpInv"
				var objTable = that.getView().byId("idTableImpInv");

				var item = {
					"TipoGiorno": objTable.getItems()[0].getCells()[0].getSelectedItem().getText(),
					"OraInizio": objTable.getItems()[0].getCells()[1].getValue(),
					"Orafine": objTable.getItems()[0].getCells()[2].getValue(),
					"Valore": objTable.getItems()[0].getCells()[3].getValue(),
					"Livello": objTable.getItems()[0].getCells()[4].getSelectedItem().getText(),
					"oEdit": true,
					"oDelete": true
				};
				collection.push(item);
				that.getView().byId("idTableImpIntData").getModel("ImpIntDataModel").setProperty("/ImportIInterCollection", collection);
				var xsoBaseModel = that.getOwnerComponent().getModel("basexsoModel");
				xsoBaseModel.create("/IMPORTIINTERVENTI2018", item, {
					success: function (oDataIn, oResponse) {
						MessageToast.show("Importi Interventi Record successfully added");
					}.bind(that),
					error: function (oError) {
						MessageBox.error("Aggiungi failed for Importi Interventi. Please contact administrator.");
					}.bind(that)

				});
			}
		},
		// End of Chandan Shashwat
		/**
		 *	CALLED onAfterRendering AND BY onEditFestivi, onPressDateProcesso, onEditDatediprocesso, AND onDeleteDatediprocesso FUNCTION
		 * TO SET DATA INTO MODEL USED TO DISPLAY IN TABLE idTableFestivitaData
		 */
		getDateDiProcessoSet: function (xsoBaseModel) {
			var that = this;
			var repintDateDiProcessoModel = new sap.ui.model.json.JSONModel();
			var oRepintDateDiProcessoJson = [];
			var oRepintDateDiProcessoJsonData = {};

			xsoBaseModel.attachRequestSent(function () {
				that._busyDialog.open();
			});
			xsoBaseModel.attachRequestCompleted(function () {
				that._busyDialog.close();
			});

			// Get DATEDIPROCESSO
			xsoBaseModel.read("/DATEDIPROCESSO", {
				success: function (oDataIn, oResponse) {
					console.log(" DatediprocessoSet");
					console.log(oDataIn.results);
					oDataIn.results.sort(function (a, b) {
						var key1 = a.MESEANNO;
						var key2 = b.MESEANNO;
						if (key1 < key2) {
							return 1;
						} else if (key1 == key2) {
							return 0;
						} else {
							return -1;
						}
					});
					for (var i = 0; i < oDataIn.results.length; ++i) {
						oRepintDateDiProcessoJsonData = {
							"IDDATAPROCESSO": oDataIn.results[i].IDDATAPROCESSO,
							"MESEANNO": Formatter.formatReadDate(oDataIn.results[i].MESEANNO),
							"DIPENDENTE": Formatter.formatReadDate(oDataIn.results[i].DIPENDENTE),
							"RESPONSABILE": Formatter.formatReadDate(oDataIn.results[i].RESPONSABILE),
							"HR": Formatter.formatReadDate(oDataIn.results[i].HR),
							"INVIO_FLUSSI": Formatter.formatReadDate(oDataIn.results[i].INVIO_FLUSSI),
							"BP": Formatter.formatReadDate(oDataIn.results[i].BP),
							"AMMINISTRAZIONE": Formatter.formatReadDate(oDataIn.results[i].AMMINISTRAZIONE)
						};

						oRepintDateDiProcessoJson.push(oRepintDateDiProcessoJsonData);
						oRepintDateDiProcessoJsonData = {};
					}

					repintDateDiProcessoModel.setData(oRepintDateDiProcessoJson);
					that.getView().setModel(repintDateDiProcessoModel, "DatediprocessoModel");

				}.bind(that),
				error: function (oError) {
					//Handle the error
					MessageBox.error("Impossibile ottenere le informazioni necessarie per inviare la scheda in approvazione o in rifiuto. Contatta l'amministratore");
					jQuery.sap.log.getLogger().error("Data fetch failed for Date Processo. Please contact administrator." + oError.toString());
				}.bind(that)
			});
		},
		/**
		 *	CALLED onAfterRendering AND BY onDeleteImpInt and onDeleteRegole FUNCTION
		 * TO SET DATA INTO MODEL USED TO DISPLAY IN TABLE idTableImpIntData
		 */
		getImportiInterventiSet: function (xsoBaseModel) {
			var ImpIntDataModel = new sap.ui.model.json.JSONModel();
			var that = this;
			xsoBaseModel.read('/IMPORTIINTERVENTI2018', {
				success: function (oDataIn, oResponse) {
					console.log("Data Loded");
					that.dataGenerate = oDataIn.results[oDataIn.results.length - 1].IDIMPORTIINTERVENTO;
					ImpIntDataModel.setData(oDataIn.results);
					that.getView().setModel(ImpIntDataModel, "ImpIntDataModel");
				}.bind(that),
				error: function (oError) {
					console.log("Error");
				}.bind(that)
			});
		},
		/**
		 *	INVOKED FROM VIEW PART
		 * MODIFY EXISTING RECORD OF TABLE idTableImpIntData
		 */
		onEditImpInt: function (e) {
			var that = this;
			var t = e.getSource().getParent();
			var a = that.getView().byId("idTableImpIntData");
			var o = a.indexOfItem(t);
			var i = a.getModel("ImpIntDataModel").getObject("/")[o];
			var xsoBaseModel = that.getOwnerComponent().getModel("basexsoModel");
			if (i) {
				var n = a.getItems()[o];
				that.onPress(n, false);
				var r = a.getItems()[o];
				if (e.getSource().getPressed()) {
					that.onPress(r, true)
				} else {
					that.onPress(r, false)
					xsoBaseModel.update("/IMPORTIINTERVENTI2018(" + i.IDIMPORTIINTERVENTO + ")", i, {
						success: function (oDataIn, oResponse) {
							MessageToast.show("Record successfully updated");
						}.bind(that),
						error: function (oError) {
							MessageBox.error("Impossibile salvare. Contatta l'amministratore");
						}.bind(that)

					});
				}
			}
		},
		/**
		 *	INVOKED FROM VIEW PART
		 * DELETE EXISTING RECORD OF TABLE idTableImpIntData
		 * UPON SUCCESS CALLS getImportiInterventiSet ELSE DISPLAY A ERROR MESSAGE
		 */
		onDeleteImpInt: function (e) {
			var that = this;
			var t = e.getSource().getParent();
			var a = that.getView().byId("idTableImpIntData");
			var o = a.indexOfItem(t);
			var i = a.getModel("ImpIntDataModel").getObject("/")[o];
			var xsoBaseModel = that.getOwnerComponent().getModel("basexsoModel");
			xsoBaseModel.remove("/IMPORTIINTERVENTI2018(" + i.IDIMPORTIINTERVENTO + ")", {
				success: function (oDataIn, oResponse) {
					MessageToast.show("Record successfully deleted");
					that.getImportiInterventiSet(xsoBaseModel);
				}.bind(that),
				error: function (oError) {
					MessageBox.error("Impossibile salvare. Contatta l'amministratore");
				}.bind(that)

			});
		},
		/**
		 *	CALLED onAfterRendering AND BY onAddImpIntlpnItem, onDeleteLPN,	onEditLPN and onAddImpIntItemImp FUNCTION
		 * TO SET DATA INTO MODEL USED TO DISPLAY IN TABLE idTableInterLPN1
		 */
		getImportiInterventiLPNSet: function (xsoBaseModel) {
			var ImpIntLPNDataModel = new sap.ui.model.json.JSONModel();
			var that = this;
			xsoBaseModel.read('/IMPORTIINTERVENTILPN', {
				success: function (oDataIn, oResponse) {
					console.log("Data Loded");
					that.dataGeneratLPN = oDataIn.results[oDataIn.results.length - 1].IDIMPORTIINTERVENTO_LPN;
					var dataJSON = [];
					var data1 = {};
					for (var i = 0; i < oDataIn.results.length; ++i) {
						data1 = {
							"IDIMPORTIINTERVENTO_LPN": oDataIn.results[i].IDIMPORTIINTERVENTO_LPN,
							"DURATA_MIN": oDataIn.results[i].DURATA_MIN,
							"DURATA_MAX": oDataIn.results[i].DURATA_MAX,
							"VALORE": oDataIn.results[i].VALORE,
							"LIVELLO": oDataIn.results[i].LIVELLO,
							"MIN_DURATA_MIN": oDataIn.results[i].MIN_DURATA_MIN,
							"MIN_DURATA_MAX": oDataIn.results[i].MIN_DURATA_MAX,
							"oEdit": true,
							"oDelete": true,
						};
						dataJSON.push(data1);
						data1 = {};
					}
					ImpIntLPNDataModel.setData(dataJSON);
					that.getView().setModel(ImpIntLPNDataModel, "ImpIntLPNDataModel");
				}.bind(that),
				error: function (oError) {
					console.log("Error");
				}.bind(that)
			});
		},
		/**
		 *	INVOKED FROM VIEW PART
		 * ADD NEW Importi Interventi RECORD for TABLE idTableInterLPN1
		 */
		onAddImpIntlpnItem: function (oEvent) {
			var that = this;
			if (that.getView().byId("idTableInterLPN1").getModel("ImpIntLPNDataModel") === undefined) {
				// Getting values entered by user from Table "idTableImpInv"
				var objTable = that.getView().byId("idTableInterLPN1");

				that.mainData = {
					"ImportIInterCollection": [{
						"IDIMPORTIINTERVENTO_LPN": objTable.getItems()[0].getCells()[0].getValue(),
						"DURATA_MIN": objTable.getItems()[0].getCells()[0].getSelectedItem().getText(),
						"DURATA_MAX": objTable.getItems()[0].getCells()[1].getSelectedItem().getText(),
						"VALORE": objTable.getItems()[0].getCells()[2].getValue(),
						"LIVELLO": objTable.getItems()[0].getCells()[3].getSelectedItem().getText(),
						"MIN_DURATA_MIN": objTable.getItems()[0].getCells()[0].getSelectedItem().getText() * 60,
						"MIN_DURATA_MAX": objTable.getItems()[0].getCells()[1].getSelectedItem().getText() * 60,
						"oEdit": true,
						"oDelete": true
					}]
				};

				that.oModelImpIntData = new JSONModel(that.mainData);
				that.getView().byId("idTableInterLPN1").setModel(that.oModelImpIntData, "ImpIntLPNDataModel");
			} else {
				var collection = that.getView().byId("idTableInterLPN1").getModel("ImpIntLPNDataModel").getProperty("/");
				var xsoBaseModel = that.getOwnerComponent().getModel("basexsoModel");
				var objTable = that.getView().byId("idTableInterLPN1");
				that.getImportiInterventiLPNSet(xsoBaseModel);
				var item = {
					"IDIMPORTIINTERVENTO_LPN": that.dataGeneratLPN + 1,
					"DURATA_MIN": parseInt(objTable.getItems()[0].getCells()[0].getSelectedItem().getText()),
					"DURATA_MAX": parseInt(objTable.getItems()[0].getCells()[1].getSelectedItem().getText()),
					"VALORE": objTable.getItems()[0].getCells()[2].getValue(),
					"LIVELLO": objTable.getItems()[0].getCells()[3].getSelectedItem().getText(),
					"MIN_DURATA_MIN": parseInt(objTable.getItems()[0].getCells()[0].getSelectedItem().getText() * 60),
					"MIN_DURATA_MAX": parseInt(objTable.getItems()[0].getCells()[1].getSelectedItem().getText() * 60)
				};
				collection.push(item);
				that.getView().byId("idTableInterLPN1").getModel("ImpIntLPNDataModel").setProperty("/", collection);
				xsoBaseModel.create("/IMPORTIINTERVENTILPN", item, {
					success: function (oDataIn, oResponse) {
						MessageToast.show("Importi Interventi Record successfully added");
						that.getImportiInterventiLPNSet(xsoBaseModel);
					}.bind(that),
					error: function (oError) {
						MessageBox.error("Aggiungi failed for Importi Interventi. Please contact administrator.");
					}.bind(that)

				});
			}
		},
		/**
		 *	INVOKED FROM VIEW PART
		 * MODIFY EXISTING RECORD OF TABLE idTableLPNIntData1
		 * UPON SUCCESS CALLS getImportiInterventiLPNSet ELSE DISPLAY A ERROR MESSAGE
		 */
		onEditLPN: function (e) {
			var that = this;
			var t = e.getSource().getParent();
			var a = that.getView().byId("idTableLPNIntData1");
			var o = a.indexOfItem(t);
			var i = a.getModel("ImpIntLPNDataModel").getObject("/")[o];
			var xsoBaseModel = that.getOwnerComponent().getModel("basexsoModel");
			if (i) {
				var n = a.getItems()[o];
				that.onPress(n, false);
				var r = a.getItems()[o];
				if (e.getSource().getPressed()) {
					that.onPress(r, true)
				} else {
					that.onPress(r, false)
					var x = {
						DURATA_MAX: parseInt(i.DURATA_MAX),
						DURATA_MAX: parseInt(i.DURATA_MAX),
						DURATA_MIN: parseInt(i.DURATA_MIN),
						IDIMPORTIINTERVENTO_LPN: i.IDIMPORTIINTERVENTO_LPN,
						LIVELLO: i.LIVELLO,
						MIN_DURATA_MAX: parseInt(i.DURATA_MAX * 60),
						MIN_DURATA_MIN: parseInt(i.DURATA_MIN * 60),
						VALORE: i.VALORE
					}
					xsoBaseModel.update("/IMPORTIINTERVENTILPN(" + i.IDIMPORTIINTERVENTO_LPN + ")", x, {
						success: function (oDataIn, oResponse) {
							MessageToast.show("Record successfully updated");
							var xsoBaseModel = that.getOwnerComponent().getModel("basexsoModel");
							that.getImportiInterventiLPNSet(xsoBaseModel);
						}.bind(that),
						error: function (oError) {
							MessageBox.error("Impossibile salvare. Contatta l'amministratore");
						}.bind(that)

					});
				}
			}
		},
		/**
		 *	INVOKED FROM VIEW PART
		 * DELETES EXISTING RECORD OF TABLE idTableLPNIntData1
		 * UPON SUCCESS CALLS getImportiInterventiLPNSet ELSE DISPLAY A ERROR MESSAGE
		 */
		onDeleteLPN: function (e) {
			var that = this;
			var t = e.getSource().getParent();
			var a = that.getView().byId("idTableLPNIntData1");
			var o = a.indexOfItem(t);
			var i = a.getModel("ImpIntLPNDataModel").getObject("/")[o];
			var xsoBaseModel = that.getOwnerComponent().getModel("basexsoModel");
			xsoBaseModel.remove("/IMPORTIINTERVENTILPN(" + i.IDIMPORTIINTERVENTO_LPN + ")", {
				success: function (oDataIn, oResponse) {
					MessageToast.show("Record successfully deleted");
					that.getImportiInterventiLPNSet(xsoBaseModel);
				}.bind(that),
				error: function (oError) {
					MessageBox.error("Impossibile salvare. Contatta l'amministratore");
				}.bind(that)

			});
		},
		/**
		 *	CALLED onAfterRendering AND BY onAddImpIntItemImp, onEditImpInt1 and onDeleteImpInt1 FUNCTION
		 * TO SET DATA INTO MODEL USED TO DISPLAY IN TABLE idTableImpIntDataImp
		 */
		getImportiRep: function (xsoBaseModel) {
			var ImpIntDataImpModel = new sap.ui.model.json.JSONModel();
			var that = this;
			xsoBaseModel.read('/IMPORTIREPERIBILITA', {
				success: function (oDataIn, oResponse) {
					console.log("Data Loded");
					that.GenID = oDataIn.results[oDataIn.results.length - 1].GenID + 1;
					that.IDIMPORTIREPERIBILITA = oDataIn.results[oDataIn.results.length - 1].IDIMPORTIREPERIBILITA + 1;
					var dataJSON = [];
					var data1 = {};
					for (var i = 0; i < oDataIn.results.length; ++i) {
						data1 = {
							"GenID": oDataIn.results[i].GenID,
							"IDIMPORTIREPERIBILITA": oDataIn.results[i].IDIMPORTIREPERIBILITA,
							"GIORNI": oDataIn.results[i].GIORNI,
							"IMPORTO": oDataIn.results[i].IMPORTO,
							"LIVELLO": oDataIn.results[i].LIVELLO,
							"oEdit": true,
							"oDelete": true,
						};
						dataJSON.push(data1);
						data1 = {};
					}
					ImpIntDataImpModel.setData(dataJSON);
					that.getView().setModel(ImpIntDataImpModel, "ImpIntDataImpModel");
				}.bind(that),
				error: function (oError) {
					console.log("Error");
				}.bind(that)
			});
		},
		/**
		 *	INVOKED FROM VIEW PART
		 * ADD NEW RECORD TO TABLE idTableImpIntDataImp
		 * UPON SUCCESS CALLS getImportiInterventiLPNSet ELSE DISPLAY A ERROR MESSAGE
		 */
		onAddImpIntItemImp: function (oEvent) {
			var that = this;
			var xsoBaseModel = that.getOwnerComponent().getModel("basexsoModel");
			that.getImportiRep(xsoBaseModel);
			if (that.getView().byId("idTableImpIntDataImp").getModel("ImpIntDataImpModel") === undefined) {
				// Getting values entered by user from Table "idTableImpInv"
				var objTable = that.getView().byId("idTableInterLPN1");

				that.mainData = {
					"ImportIInterCollection": [{
						"IDIMPORTIREPERIBILITA": that.IDIMPORTIREPERIBILITA + 1,
						"GIORNI": objTable.getItems()[0].getCells()[0].getSelectedItem().getText(),
						"IMPORTO": objTable.getItems()[0].getCells()[1].getSelectedItem().getText(),
						"LIVELLO": objTable.getItems()[0].getCells()[2].getSelectedItem().getText(),
						"oEdit": true,
						"oDelete": true
					}]
				};

				that.ImpIntDataImpModel = new JSONModel(that.mainData);
				that.getView().byId("idTableImpIntDataImp").setModel(that.ImpIntDataImpModel, "ImpIntDataImpModel");
			} else {
				var collection = that.getView().byId("idTableImpIntDataImp").getModel("ImpIntDataImpModel").getProperty("/");
				var objTable = that.getView().byId("idTableImpInvImp");
				var item = {
					"IDIMPORTIREPERIBILITA": that.IDIMPORTIREPERIBILITA + 1,
					"GIORNI": objTable.getItems()[0].getCells()[0].getSelectedKey(),
					"IMPORTO": objTable.getItems()[0].getCells()[1].getValue(),
					"LIVELLO": objTable.getItems()[0].getCells()[2].getSelectedKey(),
				};
				collection.push(item);
				that.getView().byId("idTableImpIntDataImp").getModel("ImpIntDataImpModel").setProperty("/", collection);
				xsoBaseModel.create("/IMPORTIREPERIBILITA", item, {
					success: function (oDataIn, oResponse) {
						MessageToast.show("Record successfully added");
						that.getImportiInterventiLPNSet(xsoBaseModel);
					}.bind(that),
					error: function (oError) {
						MessageBox.error("Impossibile salvare. Contatta l'amministratore");
					}.bind(that)

				});
			}
		},
		/**
		 *	INVOKED FROM VIEW PART
		 * MODIFY EXISTING RECORD OF TABLE idTableImpIntDataImp
		 * UPON SUCCESS CALLS getImportiRep ELSE DISPLAY A ERROR MESSAGE
		 */
		onEditImpInt1: function (e) {
			var that = this;
			var t = e.getSource().getParent();
			var a = that.getView().byId("idTableImpIntDataImp");
			var o = a.indexOfItem(t);
			var i = a.getModel("ImpIntDataImpModel").getObject("/")[o];
			var xsoBaseModel = that.getOwnerComponent().getModel("basexsoModel");
			if (i) {
				var n = a.getItems()[o];
				that.onPress(n, false);
				var r = a.getItems()[o];
				if (e.getSource().getPressed()) {
					that.onPress(r, true)
				} else {
					that.onPress(r, false)
					var x = {
						GIORNI: i.GIORNI,
						IDIMPORTIREPERIBILITA: i.IDIMPORTIREPERIBILITA,
						IMPORTO: i.IMPORTO,
						LIVELLO: i.LIVELLO
					}

					xsoBaseModel.update("/IMPORTIREPERIBILITA(" + i.IDIMPORTIREPERIBILITA + ")", x, {
						success: function (oDataIn, oResponse) {
							MessageToast.show("Record successfully updated");
							that.getImportiRep(xsoBaseModel)
						}.bind(that),
						error: function (oError) {
							MessageBox.error("Impossibile salvare. Contatta l'amministratore");
						}.bind(that)

					});
				}
			}
		},
		/**
		 *	INVOKED FROM VIEW PART
		 * DELETE EXISTING RECORD OF TABLE idTableImpIntDataImp
		 * UPON SUCCESS CALLS getImportiRep ELSE DISPLAY A ERROR MESSAGE
		 */
		onDeleteImpInt1: function (e) {
			var that = this;
			var t = e.getSource().getParent();
			var a = that.getView().byId("idTableImpIntDataImp");
			var o = a.indexOfItem(t);
			var i = a.getModel("ImpIntDataImpModel").getObject("/")[o];
			var xsoBaseModel = that.getOwnerComponent().getModel("basexsoModel");
			xsoBaseModel.remove("/IMPORTIREPERIBILITA(" + i.IDIMPORTIREPERIBILITA + ")", {
				success: function (oDataIn, oResponse) {
					MessageToast.show("Record successfully deleted");
					that.getImportiRep(xsoBaseModel)
				}.bind(that),
				error: function (oError) {
					MessageBox.error("Impossibile salvare. Contatta l'amministratore");
				}.bind(that)

			});
		},
		/**
		 *	CALLED onAfterRendering AND BY onAddRegoleItem and onDeleteRegole FUNCTION
		 * TO SET DATA INTO MODEL USED TO DISPLAY IN TABLE idRegoleCompensativeMultipli
		 */
		getRegole: function (xsoBaseModel) {
			var that = this;
			xsoBaseModel.read('/REGOLECOMPENSATIVI', {
				success: function (oDataIn, oResponse) {
					console.log("Data Loded");
					var oModel9 = new sap.ui.model.json.JSONModel(oDataIn.results);
					that.getView().byId("idTableRegoleCompen").setModel(oModel9, "oRegoleModel");
				},
				error: function (oError) {
					console.log("Error");
				}
			});
		},
		/**
		 *	INVOKED FROM VIEW PART
		 * CANCEL ADDITION OF NEW RECORD TO TABLE idTableRegoleCompen
		 * SETS ALL VALUES TO NULL
		 */
		onCancelRegoleItem: function (oEvent) {
			var that = this;
			that.Modify = "";
			this.byId("idTipoCollectionImp7").setSelectedKey("");
			this.byId('TPOrainizio').setValue("");
			this.byId("idOraInizioIn").setSelectedKey("");
			this.byId('TPOraFine').setValue("");
			this.byId("idOraFineIn").setSelectedKey("");
			this.byId('idDurataMinima1').setValue("");
			this.byId("iddurataMinimaIn").setSelectedKey("");
			this.byId('idDurataMassima1').setValue("");
			this.byId("iddurataMassimaIn").setSelectedKey("");
			this.byId('idInclusioneDurataIn').setValue("");
			this.byId('idDurataRiposoIn').setValue("");
		},
		/**
		 *	INVOKED FROM VIEW PART
		 * ADD NEW RECORD TO TABLE idTableRegoleCompen
		 * UPON SUCCESS CALLS getRegole ELSE DISPLAY A ERROR MESSAGE
		 */
		onAddRegoleItem: function (oEvent) {
			debugger;
			var that = this;
			var x1 = this.byId('TPOrainizio').getValue().split(":");
			/*if (x1[0] <= 9)
				x1[0] = '0' + x1[0];
			if (x1[1] <= 9)
				x1[1] = '0' + x1[1];*/
			var ms1 = x1[0] + ':' + x1[1] + ':' + '00';

			//	var ms1 = "PT" + x1[0] + "H" + x1[1] + "M";

			var x2 = this.byId('TPOraFine').getValue().split(":");
			/*	if (x2[0] <= 9)
					x2[0] = '0' + x1[0];
				if (x2[1] <= 9)
					x2[1] = '0' + x2[1];*/
			var ms2 = x2[0] + ':' + x2[1] + ':' + '00';
			//	var ms2 = "PT" + x2[0] + "H" + x2[1] + "M";
			if (!that.Modify) {
				var create_object = {
					"GIORNI": parseInt(this.byId("idTipoCollectionImp7").getSelectedKey()),
					"FASCIA_INIZIO": ms1,
					"INCLUSO_FI": parseInt(this.byId("idOraInizioIn").getSelectedKey()),
					"FASCIA_FINE": ms2,
					"INCLUSO_FF": parseInt(this.byId("idOraFineIn").getSelectedKey()),
					"DURATA_MIN": parseInt(this.byId('idDurataMinima1').getSelectedKey() * 60),
					"INCLUSO_DMIN": parseInt(this.byId("iddurataMinimaIn").getSelectedKey()),
					"DURATA_MAX": parseInt(this.byId('idDurataMassima1').getSelectedKey() * 60),
					"INCLUSO_DMAX": parseInt(this.byId("iddurataMassimaIn").getSelectedKey()),
					"DURATA_INCLUSA": parseInt(this.byId('idInclusioneDurataIn').getSelectedKey()),
					"VALORE": this.byId('idDurataRiposoIn').getSelectedKey(),
					"TIPO_COMPENSATIVO": 0,
					"DACONTRATTO": 1,
				}
				var xsoBaseModel = that.getOwnerComponent().getModel("basexsoModel");
				/*xsoBaseModel.create("/REGOLECOMPENSATIVI", create_object, {
					success: function (oDataIn, oResponse) {
						MessageToast.show("Record successfully added");
						that.Modify = '';
					}.bind(that),
					error: function (oError) {
						MessageBox.error("Aggiungi failed. Please contact administrator.");
					}.bind(that)

				});*/
				debugger;
				var parsedPayload = JSON.stringify(create_object);
				var that = this;
				var jurl = "/HANAMDC/REPINT/RepintAdmin/xsjs/insertREGOLECOMPENSATIVI.xsjs";
				jQuery.ajax({
					url: jurl,
					async: false,
					TYPE: 'POST',
					data: {
						dataobject: parsedPayload
					},
					method: 'GET',
					dataType: 'text',
					success: function (data) {

						if (JSON.parse(data).result == "Success") {
							MessageToast.show("Record successfully added");
							that.getRegole(xsoBaseModel);
							that.onCancelRegoleItem();
						} else {

							MessageBox.error("Aggiungi failed. Please contact administrator.");
						}
					}.bind(this),
					error: function (data) {
						MessageBox.error("Aggiungi failed. Please contact administrator.");
					}
				});
			} else {
				var that = this;
				var y1 = this.byId('TPOrainizio').getValue().split(":");
				var ms3 = "PT" + y1[0] + "H" + y1[1] + "M";

				var y2 = this.byId('TPOraFine').getValue().split(":");
				var ms4 = "PT" + y2[0] + "H" + y2[1] + "M";

				debugger;

				var modif_object = {
					GIORNI: parseInt(this.byId("idTipoCollectionImp7").getSelectedKey()),
					FASCIA_INIZIO: ms3,
					INCLUSO_FI: parseInt(this.byId("idOraInizioIn").getSelectedKey()),
					FASCIA_FINE: ms4,
					INCLUSO_FF: parseInt(this.byId("idOraFineIn").getSelectedKey()),
					DURATA_MIN: parseInt(this.byId('idDurataMinima1').getSelectedKey() * 60),
					INCLUSO_DMIN: parseInt(this.byId("iddurataMinimaIn").getSelectedKey()),
					DURATA_MAX: parseInt(this.byId('idDurataMassima1').getSelectedKey() * 60),
					INCLUSO_DMAX: parseInt(this.byId("iddurataMassimaIn").getSelectedKey()),
					DURATA_INCLUSA: parseInt(this.byId('idInclusioneDurataIn').getSelectedKey()),
					VALORE: this.byId('idDurataRiposoIn').getSelectedKey(),
				}
				var xsoBaseModel = that.getOwnerComponent().getModel("basexsoModel");
				xsoBaseModel.update("/REGOLECOMPENSATIVI(" + that.IDREGOLA + ")", modif_object, {
					success: function (oDataIn, oResponse) {
						MessageToast.show("Record successfully Modified");
						that.Modify = "";
						that.getRegole(xsoBaseModel);
						that.onCancelRegoleItem();
					}.bind(that),
					error: function (oError) {
						MessageBox.error("Aggiungi failed. Please contact administrator.");
						that.Modify = "";
					}.bind(that)

				});
			}
		},
		/**
		 *	INVOKED FROM VIEW PART
		 * DELETE RECORD FROM TABLE idTableRegoleCompen
		 * UPON SUCCESS CALLS getRegole ELSE DISPLAY A ERROR MESSAGE
		 */
		onDeleteRegole: function (oEvent) {
			var that = this;
			var t = oEvent.getSource().getParent();
			var a = that.getView().byId("idTableRegoleCompen");
			var o = a.indexOfItem(t);
			var i = a.getModel("oRegoleModel").getObject("/")[o];
			var xsoBaseModel = that.getOwnerComponent().getModel("basexsoModel");

			xsoBaseModel.remove("/REGOLECOMPENSATIVI(" + i.IDREGOLA + ")", {
				success: function (oDataIn, oResponse) {
					MessageToast.show("Record successfully Deleted");
					that.getRegole(xsoBaseModel);
				}.bind(that),
				error: function (oError) {
					MessageBox.error("Deletion failed. Please contact administrator.");
				}.bind(that)
			});
		},
		/**
		 *	INVOKED FROM VIEW PART
		 * MODIFY EXISTING RECORD OF TABLE idTableRegoleCompen
		 */
		onEditRegole: function (oEvent) {
			var that = this;
			var t = oEvent.getSource().getParent();
			var a = that.getView().byId("idTableRegoleCompen");
			var o = a.indexOfItem(t);
			var i = a.getModel("oRegoleModel").getObject("/")[o];

			var hour1 = parseInt(i.FASCIA_INIZIO.ms / 3600);
			var minutes1 = (i.FASCIA_INIZIO.ms % 3600) / 60;
			var localFASCIA_INIZIO = hour1 + ":" + minutes1

			var hour2 = parseInt(i.FASCIA_FINE.ms / 3600);
			var minutes2 = (i.FASCIA_FINE.ms % 3600) / 60;
			var localFASCIA_FINE = hour2 + ":" + minutes2;
			that.Modify = 'X';
			that.IDREGOLA = i.IDREGOLA;
			that.byId("idTipoCollectionImp7").setSelectedKey(i.GIORNI);
			that.byId('TPOrainizio').setValue(localFASCIA_INIZIO);
			that.byId("idOraInizioIn").setSelectedKey(i.INCLUSO_FI);
			that.byId('TPOraFine').setValue(localFASCIA_FINE);
			that.byId("idOraFineIn").setSelectedKey(i.INCLUSO_FF);
			that.byId('idDurataMinima1').setSelectedKey(i.DURATA_MIN / 60);
			that.byId("iddurataMinimaIn").setSelectedKey(i.INCLUSO_DMIN);
			that.byId('idDurataMassima1').setSelectedKey(i.DURATA_MAX / 60);
			that.byId("iddurataMassimaIn").setSelectedKey(i.INCLUSO_DMAX);
			that.byId('idInclusioneDurataIn').setSelectedKey(i.DURATA_INCLUSA);
			that.byId('idDurataRiposoIn').setSelectedKey(i.VALORE);

		},

		//Chandan End

		//Rashmi start
		/**
		 *	INVOKED FROM VIEW PART
		 * ADD NEW RECORD TO TABLE idTableDataRegoleBlocco
		 * UPON SUCCESS CALLS getRegoleBlocco ELSE DISPLAY A ERROR MESSAGE
		 */
		onAddRogoleBlocco: function (oEvent) {

			var oObject = {};
			var oArray = [];
			var regoleblocco = this.getView().getModel("oRogoleBloccoModel").getData();
			if (!regoleblocco)
				MessageToast.show("Please enter Value");
			else {
				if (this.getView().byId("idCheckboxAttivo").getSelected() == true)
					oObject.ATTIVO = 1;
				else
					oObject.ATTIVO = 0;
				oObject.LIVELLO = this.getView().byId("idLivelloRegoleBlocco").getSelectedKey();
				oObject.DATAINIZIO = DateFormat.getDateInstance({
					pattern: "yyyy-MM-dd",
					UTC: "true"
				}).format(new Date(regoleblocco.DATAINIZIO));
				oObject.DATAFINE = DateFormat.getDateInstance({
					pattern: "yyyy-MM-dd",
					UTC: "true"
				}).format(new Date(regoleblocco.DATAFINE));
				if (!regoleblocco.IMPORTOMAX)
					regoleblocco.IMPORTOMAX = 0;
				if (!regoleblocco.GIORNIMAX)
					regoleblocco.GIORNIMAX = 0;

				var oEntry = {
					"ATTIVO": oObject.ATTIVO,
					"LIVELLO": oObject.LIVELLO,
					"DATAINIZIO": oObject.DATAINIZIO,
					"DATAFINE": oObject.DATAFINE,
					"IMPORTOMAX": regoleblocco.IMPORTOMAX,
					"GIORNIMAX": regoleblocco.GIORNIMAX

				}

				var parsedPayload = JSON.stringify(oEntry);
				var that = this;
				var jurl = "/HANAMDC/REPINT/RepintAdmin/xsjs/insertRegoleBlocco.xsjs";
				jQuery.ajax({
					url: jurl,
					async: false,
					TYPE: 'POST',
					data: {
						dataobject: parsedPayload
					},
					method: 'GET',
					dataType: 'text',
					success: function (data) {

						if (JSON.parse(data).result == "Success") {
							this.getRegoleBlocco();
							MessageToast.show("Record successfully added");
						} else {
							MessageBox.error("Aggiungi failed. Please contact administrator.");
							//	MessageBox.error(JSON.parse(data).reason);
						}
					}.bind(this),
					error: function (data) {
						MessageBox.error("Aggiungi failed. Please contact administrator.");
					}
				});
			}

			//	var oRogoleBloccoModel = new JSONModel();
			//	oGestioneInfoModel.setData(oData.results);
			//	this.getView().setModel(oRogoleBloccoModel, "oRogoleBloccoModel");
			//	this.getView().getModel("oGestioneInfoModel").refresh()
		},

		/**
		 *	CALLED onAfterRendering AND BY onAddRogoleBlocco, onEditRogoleBlocco, onDeleteRogoleBlocco, onModifyRegoleCompensativeMultipli FUNCTION
		 * TO SET DATA INTO MODEL USED TO DISPLAY IN TABLE idTableDataRegoleBlocco
		 */
		getRegoleBlocco: function (xsoBaseModel) {

			var xsoBaseModel = this.getOwnerComponent().getModel("basexsoModel");
			var rogoleBloccoDataItems = new JSONModel();
			var that = this;
			that._busyDialog.open();
			xsoBaseModel.read('/T_REGOLEBLOCCO', {
				success: function (oDataIn, oResponse) {
					//	console.log("Data Loded");
					//	that.GenID = oDataIn.results[oDataIn.results.length - 1].GenID + 1;
					//	that.IDIMPORTIREPERIBILITA = oDataIn.results[oDataIn.results.length - 1].IDIMPORTIREPERIBILITA + 1;
					var dataJSON = [];
					var data1 = {};
					for (var i = 0; i < oDataIn.results.length; ++i) {
						data1 = {
							//	"GenID": oDataIn.results[i].GenID,
							"IDREGOLEBLOCCO": oDataIn.results[i].IDREGOLEBLOCCO,
							"ATTIVO": oDataIn.results[i].ATTIVO,
							"LIVELLO": oDataIn.results[i].LIVELLO,
							"DATAINIZIO": oDataIn.results[i].DATAINIZIO,
							"DATAFINE": oDataIn.results[i].DATAFINE,
							"IMPORTOMAX": oDataIn.results[i].IMPORTOMAX,
							"GIORNIMAX": oDataIn.results[i].GIORNIMAX,
							"oEdit": true,
							"oDelete": true,
						};
						dataJSON.push(data1);
						data1 = {};
					}
					rogoleBloccoDataItems.setData(dataJSON);
					that.getView().setModel(rogoleBloccoDataItems, "rogoleBloccoDataItems");
					that.getView().getModel("rogoleBloccoDataItems").refresh();
					that._busyDialog.close();
				}.bind(that),
				error: function (oError) {
					console.log("Error");
					that._busyDialog.close();
				}.bind(that)
			});
		},
		/**
		 *	TRIGGERED FROM VIEW PART ON SELECTING OR DESELECTING CHECKBOX
		 */
		onAttivoCheckboxSelect: function (oEvent) {

			var sPath = oEvent.getSource().getBindingContext("rogoleBloccoDataItems").sPath.substr(1);
			var data = this.getView().byId("idTableDataRegoleBlocco").getModel("rogoleBloccoDataItems");
			if (oEvent.getParameter("selected") == true)
				data.getData()[sPath].ATTIVO = 1;
			else
				data.getData()[sPath].ATTIVO = 0;

		},
		/**
		 *	INVOKED FROM VIEW PART
		 * MODIFY EXISTING RECORD TO TABLE idTableDataRegoleBlocco
		 * UPON SUCCESS CALLS getRegoleBlocco ELSE DISPLAY A ERROR MESSAGE
		 */
		onEditRogoleBlocco: function (e) {

			var that = this;
			var t = e.getSource().getParent();
			var a = that.getView().byId("idTableDataRegoleBlocco");
			var o = a.indexOfItem(t);
			var i = a.getModel("rogoleBloccoDataItems").getData()[o];
			//var i = a.getModel("rogoleBloccoDataItems").getObject("/")[o];
			var xsoBaseModel = that.getOwnerComponent().getModel("basexsoModel");
			if (i) {
				var n = a.getItems()[o];
				that.onPress(n, false);
				var r = a.getItems()[o];
				if (e.getSource().getPressed()) {
					that.onPress(r, true)
				} else {
					that.onPress(r, false)
					i.DATAINIZIO = new Date(i.DATAINIZIO);
					i.DATAFINE = new Date(i.DATAFINE);
					var x = {
						ATTIVO: i.ATTIVO,
						LIVELLO: i.LIVELLO,
						DATAINIZIO: i.DATAINIZIO,
						DATAFINE: i.DATAFINE,
						IMPORTOMAX: i.IMPORTOMAX,
						GIORNIMAX: i.GIORNIMAX
					}

					xsoBaseModel.update("/T_REGOLEBLOCCO(" + i.IDREGOLEBLOCCO + ")", x, {
						success: function (oDataIn, oResponse) {
							MessageToast.show("Record successfully updated");
							that.getRegoleBlocco();

						}.bind(that),
						error: function (oError) {
							MessageBox.error("Modifica failed for Regole Blocco. Please contact administrator.");
						}.bind(that)

					});
				}
			}
		},
		/**
		 *	INVOKED FROM VIEW PART
		 * DELETE EXISTING RECORD TO TABLE idTableDataRegoleBlocco
		 * UPON SUCCESS CALLS getRegoleBlocco ELSE DISPLAY A ERROR MESSAGE
		 */
		onDeleteRogoleBlocco: function (e) {

			var that = this;
			var t = e.getSource().getParent();
			var a = that.getView().byId("idTableDataRegoleBlocco");
			var o = a.indexOfItem(t);
			var i = a.getModel("rogoleBloccoDataItems").getObject("/")[o];
			var xsoBaseModel = that.getOwnerComponent().getModel("basexsoModel");
			xsoBaseModel.remove("/T_REGOLEBLOCCO(" + i.IDREGOLEBLOCCO + ")", {
				success: function (oDataIn, oResponse) {
					MessageToast.show("Record successfully deleted");
					that.getRegoleBlocco();
				}.bind(that),
				error: function (oError) {
					MessageBox.error("Deletion failed for Rogole Blocco. Please contact administrator.");
				}.bind(that)

			});
		},
		/**
		 *	INVOKED FROM VIEW PART
		 * PRINT RECORD OF TABLE idRegoleCompensativeMultipli
		 */

		onPrintRegoleCompensativeMultipli: function (oEvent) {
			window.print();
		},
		/**
		 *	INVOKED FROM VIEW PART
		 * MODIFY EXISTING RECORD OF TABLE idRegoleCompensativeMultipli
		 * UPON SUCCESS CALLS getRegoleCompensativeMultipli ELSE DISPLAY A ERROR MESSAGE
		 */
		onModifyRegoleCompensativeMultipli: function (e) {

			var that = this;
			var t = e.getSource().getParent();
			var a = that.getView().byId("idRegoleCompensativeMultipli");
			var o = a.indexOfItem(t);
			var i = a.getModel("oRegoleCompensativeMultipliModel").getData()[o];

			//var i = a.getModel("rogoleBloccoDataItems").getObject("/")[o];
			var xsoBaseModel = that.getOwnerComponent().getModel("basexsoModel");
			if (i) {
				var n = a.getItems()[o];
				that.onPressregoleCompensativeMulti(n, false);
				var r = a.getItems()[o];

				if (e.getSource().getPressed()) {
					that.onPressregoleCompensativeMulti(r, true)
				} else {
					that.onPressregoleCompensativeMulti(r, false)

					var arr = [];
					var a = i.FASCIA_INIZIO;
					arr = a.split(":");
					i.FASCIA_INIZIO = "PT" + arr[0] + "H" + arr[1] + "M";

					var arr_b = [];
					var b = i.FASCIA_FINE;
					arr_b = b.split(":");
					i.FASCIA_FINE = "PT" + arr_b[0] + "H" + arr_b[1] + "M";

					var x = {
						N_INTERVENTI: i.N_INTERVENTI,
						VALORE: i.VALORE,
						FASCIA_INIZIO: i.FASCIA_INIZIO,
						FASCIA_FINE: i.FASCIA_FINE

					}

					xsoBaseModel.update("/T_REGOLECOMPENSATIVIMULTI(" + i.IDREGOLECOMPENSATIVIMULTI + ")", x, {
						success: function (oDataIn, oResponse) {
							MessageToast.show("Record successfully updated");
							that.getRegoleCompensativeMultipli();

						}.bind(that),
						error: function (oError) {
							MessageBox.error("Modifica failed for Regole compensative multipli. Please contact administrator.");
						}.bind(that)

					});
				}
			}
		},
		/**
		 *	CALLED onAfterRendering AND BY onModifyRegoleCompensativeMultipli FUNCTION
		 * TO SET DATA INTO MODEL USED TO DISPLAY IN TABLE idRegoleCompensativeMultipli
		 */
		getRegoleCompensativeMultipli: function (oEvent) {

			var xsoBaseModel = this.getOwnerComponent().getModel("basexsoModel");
			var oRegoleCompensativeMultipliModel = new JSONModel();
			var that = this;
			that._busyDialog.open();
			xsoBaseModel.read('/T_REGOLECOMPENSATIVIMULTI', {
				success: function (oDataIn, oResponse) {

					var dataJSON = [];
					var data1 = {};

					for (var i = 0; i < oDataIn.results.length; i++) {

						var hours = ((oDataIn.results[i].FASCIA_INIZIO.ms / (1000 * 60 * 60)) % 24).toString().split(".");
						//	hours = hours;
						if (hours[0] <= 9)
							hours[0] = '0' + hours[0];

						var minutes = ((oDataIn.results[i].FASCIA_INIZIO.ms / (1000 * 60)) % 60);
						if (minutes <= 9)
							minutes = '0' + minutes;
						var inzio = hours[0] + ':' + minutes;

						var hours = ((oDataIn.results[i].FASCIA_FINE.ms / (1000 * 60 * 60)) % 24).toString().split(".");
						//	hours = hours.split(".");
						if (hours[0] <= 9)
							hours[0] = '0' + hours[0];

						var minutes = ((oDataIn.results[i].FASCIA_FINE.ms / (1000 * 60)) % 60);
						if (minutes <= 9)
							minutes = '0' + minutes;
						var fine = hours[0] + ':' + minutes;

						data1 = {

							"IDREGOLECOMPENSATIVIMULTI": oDataIn.results[i].IDREGOLECOMPENSATIVIMULTI,
							"N_INTERVENTI": oDataIn.results[i].N_INTERVENTI,
							"VALORE": oDataIn.results[i].VALORE,
							"FASCIA_INIZIO": inzio,
							"FASCIA_FINE": fine,
							"oEdit": true,

						};
						dataJSON.push(data1);
						data1 = {};
					}
					oRegoleCompensativeMultipliModel.setData(dataJSON);
					that.getView().setModel(oRegoleCompensativeMultipliModel, "oRegoleCompensativeMultipliModel");
					that.getView().getModel("oRegoleCompensativeMultipliModel").refresh();
					that._busyDialog.close();
				}.bind(that),
				error: function (oError) {
					console.log("Error");
					that._busyDialog.close();
				}.bind(that)
			});
		},
		/**
		 *	INVOKED BY onModifyRegoleCompensativeMultipli FUNCTION
		 * TO SET CELLS ENABLED OR DIABLED AND EDITABLE OR NON-EDITABLE
		 */
		onPressregoleCompensativeMulti: function (e, t) {

			var a = e.getCells();
			for (var o = 0; o < a.length - 1; o++) {
				var i = a[o];
				var aa = i.getMetadata();
				var obj = aa.getElementName();

				if (obj === "sap.m.Input" || obj === "sap.m.TimePicker") {
					i.setEnabled(t);
					i.setEditable(t)
				}
			}
		}

	});

});