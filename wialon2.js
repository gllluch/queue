// Print message to log
function msg(text) { $("#log").prepend(text + "<br/>"); }

function init() {// Execute after login succeed
    msg("init");
	// specify what kind of data should be returned
	var res_flags = wialon.item.Item.dataFlag.base | wialon.item.Resource.dataFlag.reports;
	var unit_flags = wialon.item.Item.dataFlag.base;
    var sess = wialon.core.Session.getInstance(); // get instance of current Session
	sess.loadLibrary("resourceReports"); // load Reports Library
	sess.updateDataFlags( // load items to current session
		[{type: "type", data: "avl_resource", flags:res_flags , mode: 0}, // 'avl_resource's specification
		 {type: "type", data: "avl_unit_group", flags: 0x1, mode: 0}], // 'avl_unit's specification
		function (code) { // updateDataFlags callback
			if (code) { msg(wialon.core.Errors.getErrorText(code)); return; } // exit if error code

			var res = sess.getItems("avl_resource"); // get loaded 'avl_resource's items
			if (!res || !res.length){ msg("Resources not found"); return; } // check if resources found
			for (var i = 0; i< res.length; i++) // construct Select object using found resources
				$("#res").append("<option value='" + res[i].getId() + "'>" + res[i].getName() + "</option>");

			getTemplates(); // update report template list

			$("#res").change( getTemplates ); // bind action to select change

			var units = sess.getItems("avl_unit_group"); // get loaded 'avl_units's items
			if (!units || !units.length){ msg("Units not found"); return; } // check if units found
			for (var i = 0; i< units.length; i++) // construct Select object using found units
				$("#units").append("<option value='"+ units[i].getId() +"'>"+ units[i].getName()+ "</option>");
		}
	);
}

function getTemplates(){ // get report templates and put it in select list
	//$("#templ").html("<option></option>"); // ad first empty element
	var res = wialon.core.Session.getInstance().getItem($("#res").val()); // get resource by id
	// check user access to execute reports
	if (!wialon.util.Number.and(res.getUserAccess(), wialon.item.Item.accessFlag.execReports)){
		$("#exec_btn").prop("disabled", true); // if not enough rights - disable button
		msg("Not enought rights for report execution"); return; // print message and exit
	} else $("#exec_btn").prop("disabled", false); // if enough rights - disable button

	var templ = res.getReports(); // get reports templates for resource
	for(var i in templ){
		//if (templ[i].ct != "avl_unit") continue; // skip non-unit report templates
		// add report template to select list
		$("#templ").append("<option value='"+ templ[i].id +"'>"+ templ[i].n+ "</option>");
	}
}

function executeReport(){ // execute selected report
    // get data from corresponding fields
	var id_res=$("#res").val(), id_templ=$("#templ").val(), id_unit=$("#units").val(), time=$("#interval").val();
	if(!id_res){ msg("Select resource"); return;} // exit if no resource selected
	if(!id_templ){ msg("Select report template"); return;} // exit if no report template selected
	if(!id_unit){ msg("Select unit"); return;} // exit if no unit selected

	var sess = wialon.core.Session.getInstance(); // get instance of current Session
	var res = sess.getItem(id_res); // get resource by id
	var to = sess.getServerTime(); // get current server time (end time of report time interval)
	var from = to - parseInt( $("#interval").val(), 10); // calculate start time of report
	// specify time interval object
	var interval = { "from": from, "to": to, "flags": wialon.item.MReport.intervalFlag.absolute };
	var template = res.getReport(id_templ); // get report template by id
	$("#exec_btn").prop("disabled", true); // disable button (to prevent multiclick while execute)

	res.execReport(template, id_unit, 0, interval, // execute selected report
		function(code, data) { // execReport template
			$("#exec_btn").prop("disabled", false); // enable button
			if(code){ msg(wialon.core.Errors.getErrorText(code)); return; } // exit if error code
			if(!data.getTables().length){ // exit if no tables obtained
				msg("<b>There is no data generated</b>"); return; }
			else showReportResult(data); // show report result
	});
}

function showReportResult(result){ // show result after report execute
    document.getElementById('log').replaceChildren();
	var tables = result.getTables(); // get report tables
	if (!tables) return; // exit if no tables
	for(var i=0; i < tables.length; i++){ // cycle on tables
		// html contains information about one table
		var html = "<b>"+ tables[i].label +"</b><div class='wrap'><table style='width:100%'>";

		var headers = tables[i].header; // get table headers
		html += "<tr>"; // open header row
		for (var j=0; j<headers.length; j++) // add header
			html += "<th>" + headers[j] + "</th>";
		html += "</tr>"; // close header row
		result.getTableRows(i, 0, tables[i].rows, // get Table rows
			qx.lang.Function.bind( function(html, code, rows) { // getTableRows callback
				if (code) {msg(wialon.core.Errors.getErrorText(code)); return;} // exit if error code
				for(var j in rows) { // cycle on table rows
					if (typeof rows[j].c == "undefined") continue; // skip empty rows
					html += "<tr"+(j%2==1?" class='odd' ":"")+">"; // open table row
					for (var k = 0; k < rows[j].c.length; k++) // add ceils to table
						html += "<td>" + getTableValue(rows[j].c[k]) + "</td>";
					html += "</tr>";// close table row
				}
				html += "</table>";
				msg(html +"</div>");
			}, this, html)
		);
	}
}

function getTableValue(data) { // calculate ceil value
	if (typeof data == "object")
		if (typeof data.t == "string") return data.t; else return "";
	else return data;
}

// execute when DOM ready
$(document).ready(function () {
	$("#exec_btn").click( executeReport ); // bind action to button click

	wialon.core.Session.getInstance().initSession("https://hst-api.wialon.com"); // init session
    // For more info about how to generate token check
    // http://sdk.wialon.com/playground/demo/app_auth_token
	wialon.core.Session.getInstance().loginToken("404aa26a1c4ef8061f2d62534b7d6d0d6B4AABB0784047BFFF3C298323AE59B9024F68B1", "", // try to login
		function (code) { // login callback
			// if error code - print error message
			if (code){ msg(wialon.core.Errors.getErrorText(code)); return; }
			msg("Logged successfully");

        	init(); // when login suceed then run init() function
	});

});
