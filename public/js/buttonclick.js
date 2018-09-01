var sort_obj = {
	flow : ['documentation','message','variable','source','node','sink','link'],
	message : ['documentation','part'],
	variable : ['documentation', 'initialize'],
	node : ['documentation','message','variable','wait','condition','invoke'],
	condition : ['documentation','case','context'],
	'case' : ['documentation','event'],
	context : ['documentation','rule'],
	rule : ['documentation','constraint'],
	constraint : ['documentation','subject','verb','object'],
	baseOntologies : ['documentation','ontology'],
	serviceProvider : ['documentation','service'],
	activator : ['documentation','message','variable','activate','condition']
};
function sort(obj){
	var temp_obj = JSON.parse(JSON.stringify(obj));
	var child_cnt=0;
	console.log(obj.tagname);
	console.log(sort_obj[obj.tagname]);
	//처음에 정렬
	if(sort_obj[obj.tagname]){
		for(var i=0;i<sort_obj[obj.tagname].length;i++){
			for(var j=0;j<temp_obj.childNodes.length;j++){
				if(temp_obj.childNodes[j] && sort_obj[obj.tagname][i]==temp_obj.childNodes[j].tagname){
					obj.childNodes[child_cnt] = temp_obj.childNodes[j];
					child_cnt++;
				}
			}
		}	
	}
	//자식노드 정렬
	for(var i=0;i<obj.childNodes.length;i++){
		if(obj.childNodes[i]){
			sort(obj.childNodes[i]);
		}
	}
}
function sort_childNodes(){
	for(var i=0;i<node_obj.length;i++){
		if(node_obj[i]){
			sort(node_obj[i]);
		}
	}
	sort(activator);
	sort(serviceProvider);
	sort(baseOntologies);
}
function toxmlf(){
	var f=document.super_form;
	var svgtext=document.getElementById("svg");
	console.log(activator);
	sort_childNodes();
	
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