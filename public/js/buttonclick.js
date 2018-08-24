function toxmlf(){
	var f=document.super_form;
	var svgtext=document.getElementById("svg");
	console.log(activator);
	document.getElementById("activator").value = JSON.stringify(activator);
	document.getElementById("svgtext").value = svgtext.innerHTML;
	document.getElementById("node_obj").value = JSON.stringify(node_obj);
	document.getElementById("service_obj").value = JSON.stringify(serviceProvider);
	document.getElementById("base_obj").value = JSON.stringify(baseOntologies);
	//console.log(document.getElementById('node').value);
	console.log("s");
	f.action="/toxml";
	f.submit();
}