sap.ui.define(["sap/ui/core/UIComponent","sap/ui/Device","vodafone/RepintHRAdmin/model/models"],function(e,t,o){"use strict";return e.extend("vodafone.RepintHRAdmin.Component",{metadata:{manifest:"json"},init:function(){e.prototype.init.apply(this,arguments);this.setModel(o.createDeviceModel(),"device");var t=new sap.ui.model.odata.v2.ODataModel("/HANAMDC/REPINT/RepintAdmin/xsodata/RepintAdmin.xsodata/",{json:true,defaultBindingMode:"TwoWay"});this.setModel(t,"basexsoModel");var i={};$.ajax({url:"/services/userapi/currentUser",async:false,cache:false,success:function(e,t){i.name=e.name.toUpperCase()},error:function(e,t,o){jQuery.sap.log.getLogger().error("Get Employee Authorization fetch failed"+o.toString())}});var s=new sap.ui.model.json.JSONModel;s.setData(i);this.setModel(s,"empModel");this.setModel(new sap.ui.model.json.JSONModel,"viewProperties");this.checkAuthorization();this.getRouter().initialize()},checkAuthorization:function(){var e=this;var t=this.getModel("basexsoModel");var o=[];var i=new sap.ui.model.json.JSONModel;var s=[];var r={};e._busyDialog=new sap.m.BusyDialog({showCancelButton:false});var a=e.getModel("empModel").getData().name;t.attachRequestSent(function(){e._busyDialog.open()});t.attachRequestCompleted(function(){e._busyDialog.close()});if(a!==undefined&&a!==null&&a!==""){var l=new sap.ui.model.Filter("ID",sap.ui.model.FilterOperator.EQ,a);o.push(l);t.read("/T_USER",{filters:o,success:function(t,o){console.log("T_USER");console.log(t);this.getRouter().initialize();if(t.results[0].ROLE_HR==="X"){r={AUTHHORIZEDDATA:t.results[0],MATRICOLA:t.results[0].MATRICOLA,ROLE_DEPUTY:t.results[0].ROLE_DEPUTY,ROLE_EMP:t.results[0].ROLE_EMP,ROLE_HR:t.results[0].ROLE_HR,ROLE_HRBP:t.results[0].ROLE_HRBP,ROLE_MANAGER:t.results[0].ROLE_MANAGER};s.push(r);i.setData(s);e.setModel(i,"EmpAuthoModel");e.getModel("viewProperties").setProperty("/Authorized",true)}else{this.getRouter().initialize();e.getModel("viewProperties").setProperty("/Authorized",false);jQuery.sap.log.getLogger().error("Employee Authorization failed ");this.getRouter().getTargets().display("Unauthorized")}}.bind(this),error:function(t){e.getModel("viewProperties").setProperty("/Authorized",false);jQuery.sap.log.getLogger().error("Employee Authorization failed");this.getRouter().getTargets().display("Unauthorized")}.bind(this)})}else{this.getRouter().initialize();e.getModel("viewProperties").setProperty("/Authorized",false);jQuery.sap.log.getLogger().error("Employee Authorization failed");this.getRouter().getTargets().display("Unauthorized")}}})});