/*global com*/
$.sap.declare("vodafone.RepintHRAdmin.util.Formatter");

vodafone.RepintHRAdmin.util.Formatter = {

	formatDate: function (sValue) {
		if (sValue === "" || sValue === undefined || sValue === null) {
			return "";
		} else {

			var mnths = {
					Jan: "01",
					Feb: "02",
					Mar: "03",
					Apr: "04",
					May: "05",
					Jun: "06",
					Jul: "07",
					Aug: "08",
					Sep: "09",
					Oct: "10",
					Nov: "11",
					Dec: "12"
				},
				date = sValue.toString().split(" ");
			formatteddate = [date[3], mnths[date[1]], date[2]].join("-")

			return (formatteddate).split("-")[1] + "-" + (formatteddate).split("-")[2];

		}
	},

	formatDatediprocessoDate: function (sValue) {
		if (sValue === "" || sValue === undefined || sValue === null) {
			return "";
		} else {

			var mnths = {
					Jan: "01",
					Feb: "02",
					Mar: "03",
					Apr: "04",
					May: "05",
					Jun: "06",
					Jul: "07",
					Aug: "08",
					Sep: "09",
					Oct: "10",
					Nov: "11",
					Dec: "12"
				},
				date = sValue.toString().split(" ");
			formatteddate = [date[3], mnths[date[1]], date[2]].join("-")

			return (formatteddate).split("-")[0] + "-" + (formatteddate).split("-")[1] + "-" + (formatteddate).split("-")[2];

		}
	},

	formatReadDate: function (sValue) {
		if (sValue === "" || sValue === undefined || sValue === null) {
			return "";
		} else {
			jQuery.sap.require("sap.ui.core.format.DateFormat");
			var oDateFormat = sap.ui.core.format.DateFormat.getDateTimeInstance({
				pattern: "dd-MM-yyyy"
			});

			return oDateFormat.format(new Date(sValue), true);
		}
	},

	formatMeseAnno: function (sValue) {
		if (sValue === "" || sValue === undefined || sValue === null) {
			return "";
		} else {
			jQuery.sap.require("sap.ui.core.format.DateFormat");
			var oDateFormat = sap.ui.core.format.DateFormat.getDateTimeInstance({
				//pattern: "MM-y"
				pattern: "yyyy-MM-dd"
			});

			return oDateFormat.format(new Date(sValue), true);
		}
	},

	formatUTCDate: function (sValue) {
		if (sValue === "" || sValue === undefined || sValue === null) {
			return "";
		} else {
			jQuery.sap.require("sap.ui.core.format.DateFormat");
			var oDateFormat = sap.ui.core.format.DateFormat.getDateTimeInstance({
				pattern: "yyyy-MM-ddT00:00:00"
			});
			return oDateFormat.format(new Date(sValue), true);
		}
	},

	checkTime: function (sValue) {
		if (sValue === "" || sValue === undefined || sValue === null) {
			return 0;
		} else {
			return sValue;
		}
	},

	getDurata: function (durataMin, durataMinIncl, durataMax, durataMaxIncl) {
		var value = durataMin / 60;
		if (durataMinIncl == 1) {
			value = value + '=<';
		} else {
			value = value + '<';
		}
		value = value + 'd';
		if (durataMaxIncl == 1) {
			value = value + '=<';
		} else {
			value = value + '<';
		}
		value = value + durataMax / 60;
		return value;
	},

	getFascia: function (fasciaMin, fasciaMinIncl, fasciaMax, fasciaMaxIncl) {
		if (fasciaMin != null && fasciaMinIncl != null && fasciaMax != null && fasciaMaxIncl != null) {
			fasciaMin.ms = fasciaMin.ms / 1000;
			var hoursMin = parseInt(fasciaMin.ms / 3600);
			if (hoursMin <= 9) {
				hoursMin = '0' + hoursMin;
			}
			var remainder1 = fasciaMin.ms % 3600;
			if (remainder1 == 0) {
				var minutesMin = '00';
			} else {
				var minutesMin = parseInt(remainder1 / 60);
			}
			var fasciaMin1 = hoursMin + ':' + minutesMin;

			fasciaMax.ms = fasciaMax.ms / 1000;
			var hoursMax = parseInt(fasciaMax.ms / 3600);
			if (hoursMax <= 9) {
				hoursMax = '0' + hoursMax;
			}
			var remainder2 = fasciaMax.ms % 3600;
			if (remainder2 == 0) {
				var minutesMax = '00';
			} else {
				var minutesMax = parseInt(remainder2 / 60);
			}
			var fasciaMax1 = hoursMax + ':' + minutesMax;

			var value1;

			if (fasciaMinIncl == 1) {
				value1 = '[';
			} else {
				value1 = ']';
			}
			value1 = value1 + fasciaMin1;
			value1 = value1 + '...';
			value1 = value1 + fasciaMax1;
			if (fasciaMaxIncl == 1) {
				value1 = value1 + ']';
			} else {
				value1 = value1 + '[';
			}
			return value1;
		}
		return '';
	},

	getCheck: function (checkData) {
		if (checkData === 1) {
			return true;
		} else {
			return false;
		}
	},

	formatFestivitaDate: function (sValue) {
		if (sValue === "" || sValue === undefined || sValue === null) {
			return "";
		} else {
			jQuery.sap.require("sap.ui.core.format.DateFormat");
			var oDateFormat = sap.ui.core.format.DateFormat.getDateTimeInstance({
				pattern: "dd-MM"
			});

			return oDateFormat.format(new Date(sValue), true);
		}
	},
};