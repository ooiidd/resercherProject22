//var parse = require('xml-parser');
//var inspect = require('util').inspect;
//var findxml = require('../models/xmlToObj.js');
var parser = require('xmldom').DOMParser;
var fs = require('fs');
var request = require('request');
//var jsdom = require('jsdom');

exports.main = function(req, res){
	res.render('index',{
		title : 'main',
		xml : '',
		flow : '',
		text : '',
		node : '',
		node_inf : '',
		activator : '',
		flownamearr: null,
		baseOntologies : '',
		serviceProvider : ''
	});
};
/*
 * To XML Button click
 */
//get subjects
exports.ajax1 = function(req,res){
	//console.log(req.query.subject);
	console.log("ajax1 요청");
	
	if(req.body.subject)
		console.log(req.body.subject);
	var eurl = "http://203.253.23.29:8180/subjects";
	if(req.query.subject)
		eurl=eurl+"?subject="+req.query.subject;
	if(req.query.predicate)
		eurl=eurl+"&predicate="+req.query.predicate;
	console.log(req.query.subject);
	console.log(req.query.predicate);
	var headers = {
		    'User-Agent':       'Super Agent/0.0.1',
		    'Content-Type':     'application/x-www-form-urlencoded'
	}
	var options = {
			url: eurl,
			method: 'GET',
			headers: headers
	}
	request(options,function(error, response, body){
		if(!error && response.statusCode == 200){
			console.log(body);
			res.json(body);
		}
	});
}
//predicates
exports.ajax2 = function(req,res){
	//console.log(req.query.subject);
	console.log("ajax2 요청");
	if(req.body.subject)
		console.log(req.body.subject);
	var eurl = "http://203.253.23.29:8180/predicates";
	if(req.query.subject)
		eurl=eurl+"?subject="+req.query.subject;
	if(req.query.predicate)
		eurl=eurl+"&predicate="+req.query.predicate;
	console.log(req.query.subject);
	console.log(req.query.predicate);
	var headers = {
		    'User-Agent':       'Super Agent/0.0.1',
		    'Content-Type':     'application/x-www-form-urlencoded'
	}
	var options = {
			url: eurl,
			method: 'GET',
			headers: headers
	}
	request(options,function(error, response, body){
		if(!error && response.statusCode == 200){
			console.log(body);
			res.json(body);
		}
	});
}
//object
exports.ajax3 = function(req,res){
	//console.log(req.query.subject);

	console.log("ajax3 요청");
	if(req.body.subject)
		console.log(req.body.subject);
	var eurl = "http://203.253.23.29:8180/objects";
	if(req.query.subject)
		eurl=eurl+"?subject="+req.query.subject;
	if(req.query.predicate)
		eurl=eurl+"&predicate="+req.query.predicate;
	console.log(req.query.subject);
	console.log(req.query.predicate);
	var headers = {
		    'User-Agent':       'Super Agent/0.0.1',
		    'Content-Type':     'application/x-www-form-urlencoded'
	}
	var options = {
			url: eurl,
			method: 'GET',
			headers: headers
	}
	request(options,function(error, response, body){
		if(!error && response.statusCode == 200){
			console.log(body);
			res.json(body);
		}
	});
}
function flowTag(obj){
	//tag name Start
	var temp;
	temp = '<'+obj.tagname;
	
	//attributes
	for(var key in obj.attributes){
		temp = temp+ ' '+key + '="' + obj.attributes[key] + '" '
	}
	temp+='>\n';
	return temp;
}
function generateNode(obj){
	//tag name Start
	var temp = '<'+obj.tagname;
	
	//attributes
	for(var key in obj.attributes){
		temp = temp + ' ' + key + '="' + obj.attributes[key] + '"'
		
	}
	temp+='>\n';
	
	//next node (childNodes)
	for(var i=0;i<obj.childNodes.length;i++){
		//childNodes가 유효한지
		if(obj.childNodes[i]){
			temp += generateNode(obj.childNodes[i]);
		}
	}
	
	//tag name End
	temp = temp+'</'+obj.tagname+'>';
	return temp;
}
function generateFlow(obj){
	//flow 개수 찾음
	var cnt = 0;
	var flowDic= {};
	for(var i =0;i<obj.length;i++){
		//console.log(flowDic[obj[i].attributes.name]);
		//console.log(obj[i].tagname);
		if(obj[i].tagname == 'flow' && typeof flowDic[obj[i].attributes.name]=='undefined'){
			//console.log('flow && undefined');
			flowDic[obj[i].attributes.name] = cnt;
			cnt++;
		}
	}
	
	console.log("dic : "+JSON.stringify(flowDic));
	console.log(cnt);
	
	var str = new Array(cnt);
	//str 초기화
	for(var i =0 ;i<str.length;i++){
		str[i] = '';
	}
	//obj 돌면서 <node> 채워줌.
	for(var i=0;i<obj.length;i++){
		if(obj[i].tagname == 'node'){
			str[flowDic[obj[i].parent]] += generateNode(obj[i]);
		}
		else{//flow
			str[flowDic[obj[i].attributes.name]] = flowTag(obj[i]) + str[flowDic[obj[i].attributes.name]];
		}
	}
	
	for(var i=0;i<str.length;i++){
		str[i] += '\n</flow>\n';
	}
	//Flow 태그를 만들어서 각 flow 당 하나의 배열로 리턴해줌 String Array 리턴
	return str;
}
function generateAttr(obj){
	var ret = '<';
	ret = ret + obj.tagname;
	var value=null;
	//Attributes 채워주는 부분
	for(var key in obj.attributes){
		if(key=='value'){
			value = obj.attributes[key];
		}
		else{
			ret = ret + ' ' + key + '="' + obj.attributes[key]+'"';
		}
	}
	if(value){
		ret = ret + '>' +value;
	}
	else{
		ret += '>\n';
	}
	//ChildNode 들어가는 부분
	for(var i=0;i<obj.childNodes.length;i++){
		ret += generateAttr(obj.childNodes[i]);
	}
	ret = ret + '</' + obj.tagname +'>\n';
	
	return ret;
}
exports.toxml = function(req,res){
	var svgArea = req.body.svgtext;
	var xml = new parser().parseFromString(svgArea,'text/xml');
	//console.log(xml);
	//console.log('test : '+req.body.activator);
	var baseOntologies = JSON.parse(req.body.base_obj);
	var serviceProvider = JSON.parse(req.body.service_obj);
	var activator = JSON.parse(req.body.activator);
	var gTag = xml.getElementsByTagName('g');
	var pathTag = xml.getElementsByTagName('path');
	var gArray=[];
	var rectArray=[];
	//console.log(gTag);
	for(var i=0;i<gTag.length;i++){//gTag loop 
		var temp={
				name:"",
				circle:[]
		};
		var temp_rect={};
		for(var j=0;j<gTag[i].childNodes[0].attributes.length;j++){//노드 정보값 받아오기 위한 루프
			temp_rect[gTag[i].childNodes[0].attributes[j].name] = gTag[i].childNodes[0].attributes[j].value;
		}
		rectArray.push(temp_rect);//node 정보값 받아옴
		//console.log(gTag[i].childNodes.length);
		for(var j=2;j<gTag[i].childNodes.length;j++){
			var tempcircle={
					pathid:null,
					name:""
			};
			//3=pathid,4=name
			tempcircle.pathid=Number(gTag[i].childNodes[j].attributes[3].value);
			tempcircle.name=String(gTag[i].childNodes[j].attributes[4].value);
			temp.circle.push(tempcircle);
		}
		temp.name = String(gTag[i].childNodes[0].attributes[4].value);
		gArray.push(temp);
	}
	var str = '';
	var output_xml = '<?xml version="1.0" encoding="UTF-8"?>'
		+ '<CAWL name="SilverRobotRoomService" namespace="SilverRobotRoom" version="1.0">'
		+ '<documentation>Silver Robot Room Service Scenario Document</documentation>';
	//baseOntologies Tag generate 해주는 부분.
	str = generateAttr(baseOntologies);
	output_xml += str;
	
	//serviceProvider Tag generate 해주는 부분.
	str = generateAttr(serviceProvider);
	str = str.replace("<providerParent>","");
	str = str.replace("</providerParent>","");
	output_xml += str;
	
	//Activator Tag generate 해주는 부분.
	str = generateAttr(activator);
	output_xml += str;
	
	//Flow Tag generate 해주는 부분.
	var node_obj = JSON.parse(req.body.node_obj);
	str = generateFlow(node_obj);//String Array
	output_xml += str;
	
	output_xml += '</CAWL>'
	
	fs.writeFile('test.xml', output_xml,'utf8',function(err){
		//console.log("file write");
	});
	
	
	var source_re = /\S*[Ss]ource/;
	var sink_re = /\S*[Ss]ink/;
	//Create CAWL link tag
	var Source_number=0;
	var start_node=[];
	var linkstr=[];
	
	/*잠시 보류 -> Convert시 Source Sink가 아닌 flow 표기로 바꿔야함.
	//gArray에서 flow인 아이를 찾아서 start_node 에 넣음
	for(var i=0;i<node_obj.length;i++){
		if(node_obj[i].tagname == 'flow'){
			for(var j=0;j<gArray.length;j++){
				if(gArray[j].name.match(node_obj[i].attribute.name)){
					start_node[Source_number]=gArray[j];
					gArray.splice(j,1);
					Source_number++;
					break;
				}
			}
		}
	}
	*/
	
	for(var i = 0;i<gArray.length;i++){//Source가 몇개인지 찾음
		//console.log(gArray[i].name);
		if(gArray[i].name.match(source_re)){
			start_node[Source_number]=gArray[i];
			gArray.splice(i,1);
			i--;
			Source_number++;
		}
	}
	//console.log(Source_number);
//	while(gArray.length > 0){
//		
//	}
	var setArray=[];
	for(var i = 0; i < Source_number;i++){//flow 개수만큼 루프를 돌음 link태그 
		var set = new Set();
		var temp_array=[];
		var stack = new Array();
		stack.push(start_node[i]);
		while(stack.length>0){
			var currentNode = stack.pop();
			
			for(var j=0;j<currentNode.circle.length;j++){
				if(currentNode.circle[j].name=="from"){
					
					for(var k=0;k<gArray.length;k++){
						for(var circle_i=0;circle_i<gArray[k].circle.length;circle_i++){
							if((gArray[k].circle[circle_i].name=="to")&&(currentNode.circle[j].pathid == gArray[k].circle[circle_i].pathid)){
								stack.push(gArray[k]);
								var str = "\t\t<link from=\""+currentNode.name+"\" to=\""+gArray[k].name+"\"/>";
								temp_array.push(str);
								set.add(currentNode.name);
								set.add(gArray[k].name);
								gArray.splice(k,1);
								break;
							}
						}
					}
					
				}
			}
			
			
		}//while end
		setArray.push(set);
		linkstr.push(temp_array);
	}
	//console.log(linkstr);
	//console.log(setArray[0]);
	//console.log(setArray[1]);
	//console.log(setArray[0].has('mSink'));
	var nodeStr= new Array(Source_number);
	for(var i=0;i<Source_number;i++){
		nodeStr[i] = new Array();
	}
	var last_stack=[];
	var re_sink = /\S*[Ss]ink/;
	var re_source = /\S*[Ss]ource/;
	for(var i=0;i<rectArray.length;i++){
		var temp_str="";
		var isnode=true;
		if(rectArray[i].node_name){//노드 네임이 있으면 노드임
			temp_str ="\t\t<node" + " name=\""+String(rectArray[i].node_name)+"\"";
		}
		else if(rectArray[i].nodename){//노드 네임이 없으면 sink source임
			isnode=false;
			if(rectArray[i].nodename.match(re_source)){//source
				temp_str = "\t<flow name=\""+rectArray[i].flow_name+"\">\n";
				temp_str = temp_str+"\t\t<source name=\""+rectArray[i].nodename+"\"/>";
			}
			else{
				last_stack.push(rectArray[i]);
			}
		}
		if(rectArray[i].node_state){
			temp_str = temp_str + " state=\""+String(rectArray[i].node_state)+"\">\n";
		}
		
		if(rectArray[i].wait_joinCondition){
			temp_str = temp_str + "\t\t\t<wait joinCondition=\""+String(rectArray[i].wait_joinCondition)+"\"\/>\n";
		}
		
		if(rectArray[i].condition_expression){
			temp_str = temp_str + "\t\t\t<condition expression=\""+String(rectArray[i].condition_expression)+"\">\n";
		}
		
		if(rectArray[i].context_name){
			temp_str = temp_str + "\t\t\t\t<context name=\""+String(rectArray[i].context_name)+"\">\n";
		}
		
		if(rectArray[i].constraint_name){
			temp_str = temp_str + "\t\t\t\t\t<constraint name=\""+String(rectArray[i].constraint_name)+"\">\n";
		}
		if(rectArray[i].subject_type){
			temp_str = temp_str + "\t\t\t\t\t\t<subject type=\""+String(rectArray[i].subject_type)+"\">";
			if(rectArray[i].subject_value){
				temp_str = temp_str + String(rectArray[i].subject_value)+"</subject>\n";
			}
		}
		if(rectArray[i].verb_value){
			temp_str = temp_str +"\t\t\t\t\t\t<verb>"+ String(rectArray[i].verb_value)+"</verb>\n";
		}
		
		if(rectArray[i].object_type){
			temp_str = temp_str + "\t\t\t\t\t\t<object type=\""+String(rectArray[i].object_type)+"\">";
			if(rectArray[i].object_value){
				temp_str = temp_str + String(rectArray[i].object_value)+"</object>\n";
			}
		}
		if(rectArray[i].constraint_name){
			temp_str = temp_str + "\t\t\t\t\t</constraint>\n";
		}
		if(rectArray[i].context_name){
			temp_str = temp_str + "\t\t\t\t</context>\n";
		}
		
		if(rectArray[i].condition_expression){
			temp_str = temp_str + "\t\t\t</condition>\n";
		}
		if(isnode)
			temp_str = temp_str + "\t\t</node>";
		
		
		for(var j=0;j<Source_number;j++){
			if(temp_str.length == 0)
				break;
			if(setArray[j].has(rectArray[i].node_name) || setArray[j].has(rectArray[i].nodename)){
				nodeStr[j].push(temp_str);
			}
		}
		//console.log(temp_str);
	}
	for(var i=0;i<last_stack.length;i++){//sink 를 마지막에 넣어주기 위해
		var temp = last_stack[i];
		var temp_str = "\t\t<sink name=\""+temp.nodename+"\"/>\n";
		
		for(var j=0;j<Source_number;j++){
			if(setArray[j].has(temp.nodename) || setArray[j].has(temp.nodename)){
				nodeStr[j].push(temp_str);
			}
		}
	}
	//console.log("test");
	//console.log(nodeStr[0]);
	//console.log(nodeStr[1]);
	//console.log(linkstr[0].join('\n'));
	//console.log(linkstr[1].join('\n'));
	
	var last_str="";
	for(var i=0;i<Source_number;i++){
		last_str+=nodeStr[i].join('\n');
		last_str+=linkstr[i].join('\n');
		last_str+="\n\t</flow>\n";
	}
	last_str+="</CAWL>";
//	fs.writeFile('test.xml', last_str,'utf8',function(err){
//		//console.log("file write");
//	});
	
	
	res.render('index',{
		title : 'main',
		text: '',//linkstr[0].join('\n'),
		xml : '',
		flow : '',
		node : '',
		node_inf : '',
		activator : '',
		flownamearr : null,
		baseOntologies : '',
		serviceProvider : ''
	});
}
var node_attr={};
function findChild(node){
	//console.log(node.childNodes.length);
	for(var i=1 ; i<node.childNodes.length ; i+=2){
		findChild(node.childNodes[i]);
	}
	for(var i=0 ; i<node.attributes.length ; i++){
		var tagname = node.tagName;
		var name = node.attributes[i].name;
		var value = node.attributes[i].value;
		if(node.childNodes.length == 1){
			node_attr[tagname+"_value"]=node.childNodes[0].data;
		}
		node_attr[tagname+"_"+name] = value;
	}
	if(node.tagName == 'verb'){
		node_attr[node.tagName+"_value"]=node.childNodes[0].data;
	}
}


function findActiveNode(node){
	for(var i=1 ; i<node.childNodes.length ; i+=2){
		findActiveNode(node.childNodes[i]);
	}
	for(var i=0 ; i<node.attributes.length ; i++){
		var tagname = node.tagName;
		var name = node.attributes[i].name;
		var value = node.attributes[i].value;
		if(node.childNodes.length == 1){
			//if(node_attr[tagname+"_value"])
			node_attr[tagname+"_value"]=node.childNodes[0].data;
		}
		node_attr[tagname+"_"+name] = value;
	}
	if(node.tagName == 'verb'){
		node_attr[node.tagName+"_value"]=node.childNodes[0].data;
	}
}

function activator_parser(node){
	var ret={};
	//if(node.childNodes.length >= 2){
		ret["childNodes"]=[];
		ret["attributes"]={};
		ret["tagname"]=node.tagName;
		for(var i in node.attributes){
			var tagname = node.tagName;
			var name = node.attributes[i].name;
			var value = node.attributes[i].value;
			
			ret["attributes"][name] = value;
			//console.log(tagname+" "+name+" "+value);
		}
		if(node.childNodes.length==1){
			ret["attributes"]['value']=node.childNodes[0].data;
			//console.log("value "+node.childNodes[0].data);
		}
		for(var i=1;i<node.childNodes.length;i+=2){
			temp_node = activator_parser(node.childNodes[i]);
			//console.log(i);
			ret["childNodes"].push(temp_node);
		}
	//}
	
	return ret;
}
function flow_parser(node){
	var ret = {};
	ret["childNodes"]=[];
	ret["attributes"]={};
	ret["tagname"]='flow';
	ret["parent"]=null;
	for(var i in node.attributes){
		ret["attributes"][node.attributes[i].name]=node.attributes[i].value;
	}
	return ret;
}

/*
 * Convert Button
 */
exports.xmlparse = function(req, res){//xml to svg
	
	
	var area = req.body.textarea;
	area=area.replace(/<xs:/gi,"<");
	area=area.replace(/<\/xs:/gi,"<\/");
	console.log("tq")
	console.log("test : "+req.params);
	var flow=[];
	var nodelist=[];
	var xml = new parser().parseFromString(area,'text/xml');
	var getActivator = xml.getElementsByTagName('activator');
	var getflow = xml.getElementsByTagName('flow');
	var node_dom = xml.getElementsByTagName('node');
	var baseOntologies = xml.getElementsByTagName('baseOntologies');
	var getServiceProvider = xml.getElementsByTagName('serviceProvider');
	
	baseOntologies = activator_parser(baseOntologies[0]);
	var serviceProvider={};
	serviceProvider['attributes']={};
	serviceProvider['childNodes']=[];
	serviceProvider['tagname']='providerParent';
	for(var i =0;i<getServiceProvider.length;i++){
		serviceProvider['childNodes'].push(activator_parser(getServiceProvider[i]));
	}
	var activator = activator_parser(getActivator[0]);
	//console.log(JSON.stringify(activator));
	//console.log(typeof activator)
	node_attr={};
	//console.log(getActivator[0].childNodes[3].childNodes[3].childNodes[1].childNodes[3]);
	node_attr={};
	var node_obj=[];
	for(var i=0;i<getflow.length;i++){
		node_obj.push(flow_parser(getflow[i]));
	}
	console.log(node_dom[0].parentNode.attributes[0].name);//value
	for(var node_dom_count=0 ; node_dom_count<node_dom.length ; node_dom_count++){
		findChild(node_dom[node_dom_count]);
		nodelist.push(node_attr);
		node_attr={};
		
		//attribute, childNode 찾아줌
		var temp_nodedom = activator_parser(node_dom[node_dom_count]);
		
		//parent 찾아줌(Flow name)
		temp_nodedom['parent'] = node_dom[node_dom_count].parentNode.attributes[0].value;
		node_obj.push(temp_nodedom);
	}
	var flowname=[];
	var source_re = /\S*[Ss]ource/;
	var sink_re = /\S*[Ss]ink/;
	
	for(var i=0;i<getflow.length;i++){
		var getlink = getflow[i].getElementsByTagName('link');
		flowname.push(getlink[0].parentNode.attributes[0].value);
		var templink=[];
		for(var j=0;j<getlink.length;j++){
			if(getlink[j].attributes[0].value.match(source_re)){
				templink.push({
					'from':getflow[i].attributes[0].value,
					'to':getlink[j].attributes[1].value
				});
			}
			else if(getlink[j].attributes[1].value.match(sink_re)){
				
			}
			else{
				templink.push({
					'from':getlink[j].attributes[0].value,
					'to':getlink[j].attributes[1].value
				});
			}
		}
		flow.push(templink);
	}
	console.log(flow);
	res.render('index',{
		title : 'main',
		text : null,
		xml : area,
		flow : flow,
		node : nodelist,
		node_inf : node_obj,
		activator : activator,
		flownamearr : flowname,
		baseOntologies : baseOntologies,
		serviceProvider : serviceProvider
	});
};
