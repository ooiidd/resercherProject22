function toxmlf(){
	var f=document.super_form;
	var svgtext=document.getElementById("svg");
	console.log(activator);
	document.getElementById("activator").value = JSON.stringify(activator);
	document.getElementById("svgtext").value = svgtext.innerHTML;
	document.getElementById("node_obj").value = JSON.stringify(node_obj);
	//console.log(document.getElementById('node').value);
	console.log("s");
	f.action="/toxml";
	f.submit();
}