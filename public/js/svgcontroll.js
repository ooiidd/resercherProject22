var svg = Snap("#svg");
var test = document.getElementById("test2");

var row,col;
var currentRect=null;
var prevRect = null;
var currentoverRect=null;
var rectid=0;
var tempcircle=[];
var tempEllipse=null;
var path=[];
var findRectArr=[];//노드를 만들어 주었는지 알기위해 사용하는 String형 배열 indexOf() 메서드로 찾는다.
var circleArray=[];
var pathid=0;
var currentStartDoc=null;
var currentOverDoc=null;
var currentText=null;
var currentLine=null;
var highlight_rect=null;
var temp_rect;
var lineDrawing=false;
var docStart;//선 그리기 시작할때 시작점
var docEnd;//선 그리기 시작할때 끝점
var pa;
var sx,sy;
var rectarr=new Array(100);//rectarr[col][row]

var activate={},condition={},con_case={},context={};

function check_defined(e,prop){
	if(e){
		return e[prop];
	}
	return '';
}

for(var i=0;i<100;i++)
	rectarr[i] = new Array(100);
var arrow = svg.path("M2,2 L2,11 L10,6 L2,2").attr({fill:'#000000'});
var marker = arrow.marker(0,0,10,10,9,6);
function textChangef(){
	currentText.node.textContent=$('#nameinput').val();
}
var line_drawing = false;

//새로운 노드 만들어주는 함수
function new_node(tagname){
	ret = {};
	ret["childNodes"]=[];
	ret["attributes"]=[];
	ret["tagname"]=tagname;
	return ret;
}
//Activator click시에 오른쪽에 내용들 보여주는 함수
function activator_list(){
	$('#attr').empty();
	$('#nodediv').remove();
	$('#variablediv').remove();
	$('#conditiondiv').remove();
	$('#attr').append($('<div/>',{
		id:'name'
	}));
	$('#attr').append($('<div/>',{
		id:'variablediv'
	}));
	$('#attr').append($('<div/>',{
		id:'conditiondiv'
	}));
	$('#variablediv').append($('<div/>',{
		id:'messageDiv'
	}));
	$('#variablediv').append($('<div/>',{
		id:'variableDiv'
	}));
	$('#variablediv').append($('<div/>',{
		id:'activateDiv'
	}));
	$('#variablediv').append($('<div/>',{
		id:'conditionDiv'
	}));
	$('#variablediv').append($('<div/>',{
		id:'conditionCaseDiv'
	}));
	$('#variablediv').append($('<div/>',{
		id:'conditionContextDiv'
	}));
	$('#name').append('<span>Name: </span>');
	$('#name').append($('<input/>',{
		type:'text',
		id: 'nameinput',
		value : (activator=='' ? '' : activator.attributes.name),
		onchange:"textChangef()"//수정 필요
	}));

	var message_add = '<button class="button" type="button" id="messageAdd">Add Message</button>';
	var variable_add = '<button class="button" type="button" id="variableAdd">Add Variable</button>';
	var part_add = '<button type="button" class="partAdd">Add Part</button>';
	var initialize_add = '<button type="button" class="initializeAdd">Add Initialize</button>';
	var event_add = '<button class="button" type="button" id="eventAdd">Add Event</button>';
	var rule_add = '<button class="button" type="button" id="ruleAdd">Add Rule</button>';
	var constraint_add = '<button type="button" class="constraintAdd">Add Constraint</button>';
	
	var message_del = '<button type="button" class="Del">Del Message</button>';
	var variable_del = '<button type="button" class="Del">Del Variable</button>';
	var part_del = '<button type="button" class="Del">Del Part</button>';
	var initialize_del = '<button type="button" class="Del">Del Initialize</button>';
	var event_del = '<button type="button" class="Del">Del Event</button>';
	var rule_del = '<button type="button" class="Del">Del Rule</button>';
	var constraint_del = '<button type="button" class="Del">Del Constraint</button>';
	
	
	//message 태그
	$('#messageDiv').append('<span>MESSAGE</span>');
	$('#messageDiv').append(message_add);
	var message_attr = '<tr><td><span>name</span></td><td><input class="input" type="text"</input></td></tr>';
	$('#messageAdd').click(function(){
		var html = '<div data-value="'+activator.childNodes.length+'" ';
		html += 'data-tagname="'+'message'+'">'
		html += '<table>';
		html += part_add;
		html += message_del;
		html+=message_attr;
		html += '<br><br></table></div>';
		$('#messageDiv').append(html);
		activator['childNodes'].push(new_node('message'));
	});
	
	var part_attr = '<table>'+part_del+'<tr><td><span>name</span></td><td><input class="input" type="text"></input></td></tr>';
	part_attr += '<tr><td><span>type</span></td><td><input class="input" type="text"></input></td></tr>';
	part_attr += '<tr><td><span>element</span></td><td><input class="input" type="text"></input></td></tr></table></div>'
	$("#messageDiv").on("click",".partAdd",function(){
		//console.log(activator.childNodes[Number($(this).parent().attr('data-value'))]);
		$(this).parent().append('<div data-value="'+activator.childNodes[Number($(this).parent().attr('data-value'))].childNodes.length+'" '+
				'data-tagname="part">'+part_attr);
		var num = Number($(this).parent().attr('data-value'));
		console.log(num);
		var tagname = $(this).parent().attr('data-tagname');
		activator.childNodes[num].childNodes.push(new_node('part'));
	});
	
	//Variable 태그
	$('#variableDiv').append('<hr>');
	$('#variableDiv').append('<span>VARIABLE</span>');
	$('#variableDiv').append(variable_add);
	var variable_attr = '<tr><td><span>name</span></td><td><input class="input" type="text"</input></td></tr>';
	variable_attr += '<tr><td><span>type</span></td><td><input class="input" type="text"</input></td></tr>';
	$('#variableAdd').click(function(){
		var html = '<div data-value="'+activator.childNodes.length+'" '
		+'data-tagname="variable">'+'<table>';
		html += initialize_add;
		html += variable_del;
		html += variable_attr;
		html += '<br><br></table></div>';
		$('#variableDiv').append(html);
		activator['childNodes'].push(new_node('variable'));
	});
	
	var initialize_attr = '<table>'+initialize_del+'<tr><td><span>part</span></td>';
	initialize_attr += '<td><input class="input" type="text"</input></td></tr>';
	initialize_attr += '<tr><td><span>from expression</span></td><td><input class="input" type="text"></input><br></td></tr>';
	initialize_attr += '<tr><td><span>from variable</span></td><td><input class="input" type="text"></input><br></td></tr>';
	initialize_attr += '<tr><td><span>from part</span></td><td><input class="input" type="text"></input></td></tr></table></div>';
	$("#variableDiv").on("click",".initializeAdd",function(){
		$(this).parent().append('<div data-value="'+activator.childNodes[Number($(this).parent().attr('data-value'))].childNodes.length+'" '+
				'data-tagname="initialize">'+initialize_attr);
		var num = Number($(this).parent().attr('data-value'));
		activator.childNodes[num].childNodes.push(new_node('initialize'));
	});
	
	
	//Activate 태그
	$('#activateDiv').append('<hr>');
	if(activate.attributes){
		var activate_attr = '<div data-tagname="activate"><table><span>ACTIVATE</span><tr><td><span>flow</span></td>';
		activate_attr += '<td><input class="input" type="text" value="'+activate.attributes.flow+'"></input></td></tr></table></div>';
		$('#activateDiv').append(activate_attr);
	}
	else{
		var activate_attr = '<div data-tagname="activate"><table><span>ACTIVATE</span><tr><td><span>flow</span></td>';
		activate_attr += '<td><input class="input" type="text" value=\"\"></input></td></tr></table></div>';
		$('#activateDiv').append(activate_attr);
	}
	//$('#conditiondiv').append('<span>condition expression: </span>');
	//$('#conditiondiv').append('<br>');
	
	//condition 태그
	$('#conditionDiv').append('<hr>');
	if(condition.attributes){
		var condition_attr = '<div data-tagname="condition"><table><span>CONDITION</span>';
		condition_attr += '<tr><td><span>expression</span></td><td><input class="input" type="text" value="'+condition.attributes.expression+'"></input></td></tr></table></div>'
		$('#conditionDiv').append(condition_attr);
	}
	else{
		var condition_attr = '<div data-tagname="condition"><table><span>CONDITION</span>';
		condition_attr += '<tr><td><span>expression</span></td><td><input class="input" type="text" value=\"\"></input></td></tr></table></div>'
		$('#conditionDiv').append(condition_attr);
	}
	
	//condition case태그
	var case_attr = '<div data-tagname="case"><table><span>CONDITION-CASE</span>';
	case_attr += '<tr><td><span>name</span></td><td><input class="input" type="text"></input></td></tr>';
	case_attr += '<tr><td><span>expression</span></td><td><input class="input" type="text"></input></td></tr>';
	$('#conditionCaseDiv').append('<hr>');
	$('#conditionCaseDiv').append(case_attr);
	$('#conditionCaseDiv').append(event_add);
	var event_attr = '<tr><td><span>operation</span></td><td><input class="input" type="text"></input></td></tr>';
	$('#eventAdd').click(function(){
		var html='<div data-value="'+con_case.childNodes.length+'" '
		+'data-tagname="event">'+'<table>';
		html += event_del;
		html += event_attr;
		html += '</table></div>';
		$('#conditionCaseDiv').append(html);
		con_case['childNodes'].push(new_node('event'));
	});
	/*for(var i=0;i<con_case.childNodes.length;i++){
		$('#conditionCasediv').append('<br>');
		$('#conditionCasediv').append('<span>event operation: ');
	}*/
	
	
	//condition context 태그
	$('#conditionContextDiv').append('<hr>');
	var context_attr = '<div data-tagname="context"><table><span>CONDITION-CONTEXT</span>';
	context_attr += '<tr><td><span>name</span></td>';
	context_attr += '<td><input class="input" type="text"></input></td></tr>';
	context_attr += '<tr><td><span>priority</span></td>';
	context_attr += '<td><input class="input" type="text"></input></td></tr></table></div>';
	$('#conditionContextDiv').append(context_attr);
	$('#conditionContextDiv').append(rule_add);
	var rule_attr = '<tr><td><span>name</span></td><td><input class="input" type="text"></input></td></tr>';
	rule_attr += '<tr><td><span>expression</span></td><td><input class="input" type="text"></input></td></tr>';
	$('#ruleAdd').click(function(){
		var html='<div data-value="'+context.childNodes.length+'" '
		+'data-tagname="rule">'+'<table>';
		html += constraint_add;
		html += rule_del;
		html += rule_attr;
		html += '</table><br></div>';
		$('#conditionContextDiv').append(html);
		context['childNodes'].push(new_node('rule'));
	});
	var constraint_attr = '<table>'+constraint_del+'<tr><td><span>name</span></td>';
	constraint_attr+='<td><input class="input" type="text"></input></td></tr>';
	constraint_attr+='<tr><td><span>subject type</span></td>';
	constraint_attr+='<td><input class="input" type="text"></input></td></tr>';
	constraint_attr+='<tr><td><span>subject value</span></td>';
	constraint_attr+='<td><input class="input" type="text"></input></td></tr>';
	constraint_attr+='<tr><td><span>verb</span></td>';
	constraint_attr+='<td><input class="input" type="text"></input></td></tr>';
	constraint_attr+='<tr><td><span>object type</span></td>';
	constraint_attr+='<td><input class="input" type="text"></input></td></tr>';
	constraint_attr+='<tr><td><span>object value</span></td>';
	constraint_attr+='<td><input class="input" type="text"></input></td></tr></table></div>';
	$("#conditionContextDiv").on("click",".constraintAdd",function(){
		$(this).parent().append('<div data-value="'+context.childNodes[Number($(this).parent().attr('data-value'))].childNodes.length+'" '+
				'data-tagname="constraint">'+constraint_attr);
		var num = Number($(this).parent().attr('data-value'));
		context.childNodes[num].childNodes.push(new_node('constraint'));
		//$(this).parent().append(constraint_attr);
	});
	/*
	for(var i=0;i<context.childNodes.length;i++){
		$('#conditionContextDiv').append('<br>');
		$('#conditionContextDiv').append('<span>constraint name: </span>');
		$('#conditionContextDiv').append('<br>');
		$('#conditionContextDiv').append('<span>subject: </span>');
		$('#conditionContextDiv').append('<br>');
		$('#conditionContextDiv').append('<span>verb: </span>');
		$('#conditionContextDiv').append('<br>');
		$('#conditionContextDiv').append('<span>object: </span>');
	}
	*/
	
	$("#attr").on("click",".Del",function(){
		var num = $(this).parent().attr('data-value');
		//console.log($(this).parent().attr('data-value'));
		var num2 = $(this).parent().parent().attr('data-value');
		//console.log($(this).parent().parent().attr('data-value'));
		var tagname = $(this).parent().attr('data-tagname');
		if(tagname == 'message'){
//			activator['childNodes'].splice(Number(num),1);
			activator.childNodes[num]=null;
		}
		else if(tagname == 'part'){
			activator.childNodes[num2].childNodes[num] = null;
		}
		else if(tagname == 'variable'){
			activator.childNodes[num]=null;
		}
		else if(tagname == 'initialize'){
			activator.childNodes[num2].childNodes[num] = null;
		}
		else if(tagname == 'event'){
			con_case.childNodes[num]=null;
		}
		else if(tagname == 'rule'){
			context.childNodes[num]=null;
		}
		else if(tagname == 'constraint'){
			context.childNodes[num2].childNodes[num]=null;
		}
		$(this).parent().remove();
	});
	$("#attr").on("change",".input",function(){
		var attr_name = $(this).parent().parent().children().first().children().first().text();
		//console.log(attr_name);
		var num = $(this).parent().parent().parent().parent().parent().attr('data-value');
		var num2 = $(this).parent().parent().parent().parent().parent().parent().attr('data-value');
		//현재 쓰는곳 태그이름
		var tagname = $(this).parent().parent().parent().parent().parent().attr('data-tagname');
		var value = $(this).val();//input태그에서 현재 쓴 텍스트 값
		
		//태그 이름으로 추출 시작
		var bool = true;
		if(tagname == 'message' || tagname=='variable'){
			for(var i in activator.childNodes[num].attributes){
				for(var key in activator.childNodes[num].attributes[i]){
					if(key == attr_name){
						bool = false;
						activator.childNodes[num].attributes[i][key]=value;
						//console.log(activator.childNodes[num].attributes[i][key]);
					}
				}
			}
			if(bool){
				var temp = {};
				temp[attr_name]=value;
				activator.childNodes[num].attributes.push(temp);
			}
		}else if(tagname == 'part' || tagname=='initialize'){
			for(var i in activator.childNodes[num2].childNodes[num].attributes){
				for(var key in activator.childNodes[num2].childNodes[num].attributes[i]){
					if(key == attr_name){
						bool = false;
						activator.childNodes[num2].childNodes[num].attributes[i][key]=value;
					}
				}
			}
			if(bool){
				var temp = {};
				temp[attr_name]=value;
				activator.childNodes[num2].childNodes[num].attributes.push(temp);
			}
		}else if(tagname == 'activate'){
			//console.log('acti or condi');
			for(var i in activate.attributes){
				for(var key in activate.attributes[i]){
					if(key == attr_name){
						bool = false;
						activate.attributes[i][key]=value;
					}
				}
			}
			if(bool){
				var temp = {};
				temp[attr_name]=value;
				activate.attributes.push(temp);
			}
		}else if(tagname == 'condition'){
			//console.log('acti or condi');
			for(var i in condition.attributes){
				for(var key in condition.attributes[i]){
					if(key == attr_name){
						bool = false;
						condition.attributes[i][key]=value;
					}
				}
			}
			if(bool){
				var temp = {};
				temp[attr_name]=value;
				condition.attributes.push(temp);
			}
		}else if(tagname == 'case'){
			for(var i in con_case.attributes){
				for(var key in con_case.attributes[i]){
					if(key == attr_name){
						bool = false;
						con_case.attributes[i][key]=value;
					}
				}
			}
			if(bool){
				var temp = {};
				temp[attr_name]=value;
				con_case.attributes.push(temp);
			}
		}else if(tagname == 'event'){
			for(var i in con_case.childNodes[num].attributes){
				for(var key in con_case.childNodes[num].attributes[i]){
					if(key == attr_name){
						bool = false;
						con_case.childNodes[num].attributes[i][key]=value;
						//console.log(con_case.childNodes[num].attributes[i][key]);
					}
				}
			}
			if(bool){
				var temp = {};
				temp[attr_name]=value;
				con_case.childNodes[num].attributes.push(temp);
			}
		}else if(tagname == 'context'){
			for(var i in context.attributes){
				for(var key in context.attributes[i]){
					if(key == attr_name){
						bool = false;
						context.attributes[i][key]=value;
					}
				}
			}
			if(bool){
				var temp = {};
				temp[attr_name]=value;
				context.attributes.push(temp);
			}
		}else if(tagname == 'rule'){
			for(var i in context.childNodes[num].attributes){
				for(var key in context.childNodes[num].attributes[i]){
					if(key == attr_name){
						bool = false;
						context.childNodes[num].attributes[i][key]=value;
						//console.log(context.childNodes[num].attributes[i][key]);
					}
				}
			}
			if(bool){
				var temp = {};
				temp[attr_name]=value;
				context.childNodes[num].attributes.push(temp);
			}
		}else if(tagname == 'constraint'){
			for(var i in context.childNodes[num2].childNodes[num].attributes){
				for(var key in context.childNodes[num2].childNodes[num].attributes[i]){
					if(key == attr_name){
						bool = false;
						context.childNodes[num2].childNodes[num].attributes[i][key]=value;
					}
				}
			}
			if(bool){
				var temp = {};
				temp[attr_name]=value;
				context.childNodes[num2].childNodes[num].attributes.push(temp);
			}
		}else if(tagname == 'activator'){
			
		}
	});
}

//Activator Click 리스너
function activator_click(){
	//console.log("acti");
	if(currentRect != null){
		currentRect.attr({
			stroke : "#000",
			strokeWidth : 1
		});
	}
	currentRect = null;
	activator_rect.attr({
		stroke: "#00bfff",
		strokeWidth: 3
	});
	activator_list();
}
//처음에 Activator 만들어 주어야함
var activator_rect=svg.rect(25,15,150,50);
activator_rect.attr({
	stroke: "#000",
	strokeWidth: 1,
	fill:"#ffffff"
});
activator_rect.click(activator_click);
var activator_text = svg.text(25+50,15+28,"Activator");
//Add Line 버튼 클릭 리스너
function draw_click(){
	if(currentRect){
		currentRect.attr({
			stroke:"#000",
			strokeWidth: 1
		});
	}
	currentRect=null;
	if(line_drawing == false){
		var btn=document.getElementById("draw_btn");
		btn.firstChild.data = "Line Drawing..";
		$('#attr').empty();
		line_drawing=true;
	}
	else{
		var btn=document.getElementById("draw_btn");
		btn.firstChild.data = "Add Line";
		$('#attr').empty();
		line_drawing=false;
	}
}
function verb_select_f(){
	var params = {subject: $("#subject_select option:selected").text(),
			predicate: $("#verb_select option:selected").text()};
	currentRect.attr({
		"verb_value" : $("#verb_select option:selected").text()
	});
	$('#object_select option').remove();
	$('#object_select').append("<option value=none>NONE</option>");
	$.ajax({
		url: "/ajax3",
		type: "GET",
		dataType: 'json',
		data:params,
		async: true,
		success: function(data){
			//console.log(data);
			var ret = (JSON.parse(data));
			for(var obj in ret){
				$('#object_select').append("<option value="+obj+">"+ret[obj]+"</option>");
			}
		},
		error: function(json){
			//console.log("error : "+JSON.stringify(json));
		}
	});
}
function subject_select_f(){
	//console.log(currentRect.attr('nodename'));
	var params = {subject: $("#subject_select option:selected").text()};
	currentRect.attr({
		"subject_value" : $("#subject_select option:selected").text()
	});
	$('#verb_select option').remove();
	$('#object_select option').remove();
	$('#verb_select').append("<option value=none>NONE</option>");
	$.ajax({
		url: "/ajax2",
		type: "GET",
		dataType: 'json',
		data:params,
		async: true,
		success: function(data){
			//console.log(data);
			var ret = (JSON.parse(data));
			for(var obj in ret){
				$('#verb_select').append("<option value="+obj+">"+ret[obj]+"</option>");
			}
		},
		error: function(json){
			//console.log("error : "+JSON.stringify(json));
		}
	});
};
function object_select_f(){
	currentRect.attr({
		"object_value" : $("#object_select option:selected").text()
	});
}
function parseData(data){
	$('#attr').empty();
	$('#nodediv').remove();
	$('#variablediv').remove();
	$('#conditiondiv').remove();
	$('#attr').append($('<div/>',{
		id:'nodediv'
	}));
	$('#attr').append($('<hr>'));
	$('#attr').append($('<div/>',{
		id:'variablediv'
	}));
	$('#attr').append($('<div/>',{
		id:'conditiondiv'
	}));
	$('#nodediv').append('<span>Name: </span>');
	$('#nodediv').append($('<input/>',{
		type:'text',
		id: 'nameinput',
		value:data.children()[0].attr('nodename'),
		onchange:"textChangef()"
	}));
	$('#conditiondiv').append('<span>Condition Expression: </span>');
	$('#conditiondiv').append('<br>');
	$('#conditiondiv').append('<span>Context Name: </span>');
	$('#conditiondiv').append('<br>');
	$('#conditiondiv').append('<span>Constraint Name: </span>');
	$('#conditiondiv').append('<br>');
	$('#attr').append($('<hr>'));
	$('#conditiondiv').append('<select id=subject_select></select>');
	$('#conditiondiv').append('<select id=verb_select></select>');
	$('#conditiondiv').append('<select id=object_select></select>');
	
	$('#subject_select').change(subject_select_f);
	$('#verb_select').change(verb_select_f);
	$('#object_select').change(object_select_f);
}
function direction(element){
	var temp_attr=path[element].attr('d');
	path[element].attr({
		markerEnd: marker
	});
}
//docover2 out2는 점에 마우스 대면 초록색 원 그려주는 것.
var docover2 = function(){
	if(lineDrawing==true && docStart != this){
		currentLine.attr({
			d:"M"+sx+","+sy+" L"+this.attr("cx")+","+this.attr("cy")
		});
	}
	currentOverDoc=this;
	svg.unmousemove();
	svg.unmouseup();
	this.unmouseout();
	tempEllipse = svg.ellipse(this.attr("cx"),this.attr("cy"),11,11).attr({
		'pointer-events':'none',
		fill:"#00ff00",
		stroke:"#00ff00",
		'fill-opacity':"0.3",
		'stroke-opacity':"0.3"
	});
	this.mouseout(docout2);
	//console.log("drag remove");
	currentoverRect.undrag();
}
var docout2 = function(){
	if(lineDrawing==true && docStart!=this){
		svg.mousemove(function(e){
			currentLine.attr({
				d:"M"+sx+","+sy+" L"+e.offsetX+","+e.offsetY
			});
		});
		svg.mouseup(function(){
			lineDrawing=false;
			pathid++;
			svg.unmousemove();
			this.unmouseup();
		});
	}
	tempEllipse.remove();
	//console.log("drag add")
	currentoverRect.drag(move,start,stop);
}


//선을 그리다가 점에 놓을때 발생하는 이벤트
var docup = function(){
	//console.log("docup");
	lineDrawing=false;
	svg.unmouseup();
	svg.unmousemove();
	var ex=this.attr("cx");
	var ey=this.attr("cy");
	var newcircle = svg.circle(ex,ey,0);
	newcircle.attr({
		pathid:pathid,
		name:"to"
	});
	currentoverRect.add(newcircle);
	pathid++;
}

//선을 그릴때 시작하는 점 이벤트 mousedown event point
var docover = function(){
	docStart=this;
	lineDrawing=true;
	pa = this.parent();
	currentDoc = this;
	sx=this.attr("cx");
	sy=this.attr("cy");
	var newcircle = svg.circle(sx,sy,0);
	newcircle.attr({
		pathid:pathid,
		name:"from"
	});
	currentLine = svg.path("M"+sx+","+sy+" L"+sx+","+sy);
	path[pathid]=currentLine;
	currentLine.attr({
		markerEnd: marker,
		fill:"#000000",
		stroke: "#000",
		strokeWidth: 1
	});
	currentoverRect.add(newcircle);
	pa.undrag();
	svg.mousemove(function(e){
		currentLine.attr({
			d:"M"+sx+","+sy+" L"+e.offsetX+","+e.offsetY
		});
	});
	svg.mouseup(function(){
		lineDrawing=false;
		pathid++;
		svg.unmousemove();
		this.unmouseup();
	});
}

//rect 마우스를 위에 올렸을때 발생.
var mouseover = function(){
	//console.log("mouseover");
	if(this===currentoverRect){
		
	}
	else{
		currentoverRect = this;
		for(var i=0;i<tempcircle.length;i++){
			tempcircle[i].remove();
		}
		var x=Number(this.children()[0].attr('x'));
		var y=Number(this.children()[0].attr('y'));
		var w=Number(this.children()[0].attr('width'));
		var h=Number(this.children()[0].attr('height'));
		var group = this;
		tempcircle[0] = svg.circle(x+w/4,y,3);
		tempcircle[1] = svg.circle(x+w/2,y,3);
		tempcircle[2] = svg.circle(x+w/2+w/4,y,3);
		tempcircle[3] = svg.circle(x,y+h/4,3);
		tempcircle[4] = svg.circle(x,y+h/2,3);
		tempcircle[5] = svg.circle(x,y+h/4+h/2,3);
		
		tempcircle[6] = svg.circle(x+w,y+h/4,3);
		tempcircle[7] = svg.circle(x+w,y+h/2,3);
		tempcircle[8] = svg.circle(x+w,y+h/2+h/4,3);
		
		tempcircle[9] = svg.circle(x+w/4,y+h,3);
		tempcircle[10] = svg.circle(x+w/2,y+h,3);
		tempcircle[11] = svg.circle(x+w/4+w/2,y+h,3);
		for(var i=0;i<tempcircle.length;i++){
			group.add(tempcircle[i]);	
			tempcircle[i].unmousedown();
			tempcircle[i].mousedown(docover);
			tempcircle[i].mouseup(docup);
			tempcircle[i].hover(docover2,docout2);
			tempcircle[i].attr({
				cursor:'default'
			});
		}
	}
}
//rect drag 리스너 (움직일때)
var move = function(dx,dy,x,y,event){
	temp_rect.attr({
		transform: this.data('origTransform') + (this.data('origTransform') ? "T" : "t")+[dx,dy]
	});
	//console.log("x = "+event.offsetX, " y = "+event.offsetY);
	var xpoint,ypoint;
	xpoint = parseInt(event.offsetX/200)*200;
	ypoint = parseInt(event.offsetY/80)*80;
	//console.log(event.offsetX/200+","+ypoint);
	if(highlight_rect.attr('x')==xpoint && highlight_rect.attr('y')==ypoint){
		;
	}
	else{
		highlight_rect.attr({
			x:xpoint,
			y:ypoint
		});
	}
}

//rect drag 리스너중 start(mouse down 발생시)리스너
var start = function(){
	//console.log("start");
	activator_rect.attr({
		stroke: "#000",
		strokeWidth:1
	});
	for(var i=0;i<tempcircle.length;i++){
		tempcircle[i].remove();
	}
	if(currentRect != null)
		currentRect.attr({
			stroke:"#000",
			strokeWidth: 1
		});
	if(currentRect != this){
		prevRect = currentRect;
		currentRect = this.children()[0];
		currentText = this.children()[1];
		currentRect.attr({
			stroke: "#00BFFF",
			strokeWidth: 3
		});
		parseData(this);
	}
	if(prevRect&&line_drawing){//FindRectf(findRectArr,ret)
		drawLinef(FindRectf(findRectArr,prevRect.attr("nodename")),FindRectf(findRectArr,currentRect.attr("nodename")));
		
		currentRect.attr({
			stroke:"#000",
			strokeWidth: 1
		});
		//currentRect = null;
		
		var btn=document.getElementById("draw_btn");
		btn.firstChild.data = "Add Line";
		$('#attr').empty();
		line_drawing=false;
		return;
	}
	//console.log(currentRect.attr("subject_value"));
	//console.log("test");
	var request = $.ajax({
		url: "/ajax1",
		type: "GET",
		dataType: 'json',
		async: true,
		success: function(data){
			//console.log(data);
			var ret = (JSON.parse(data));
			$('#subject_select').append("<option value="+currentRect.attr("subject_value")+">"+currentRect.attr("subject_value")+"</option>");
			for(var obj in ret){
				//console.log(ret[obj]);
				$('#subject_select').append("<option value="+obj+">"+ret[obj]+"</option>");
			}
		},
		error: function(json){
			//console.log("error : "+JSON.stringify(json));
		}
	});
	$('#verb_select').append("<option value="+currentRect.attr("verb_value")+">"+currentRect.attr("verb_value")+"</option>");
	$('#object_select').append("<option value="+currentRect.attr("verb_value")+">"+currentRect.attr("object_value")+"</option>");
	//점선으로된 사각형 만들어줌
	//console.log("test : "+currentRect.type);
	
	//원 일때 처리
	if(currentRect.type == "ellipse"){
		temp_rect = svg.ellipse(currentRect.attr('cx'),currentRect.attr('cy'),75,15);
		temp_rect.attr({
			stroke: "#000",
			strokeWidth: 0.8,
			"stroke-dasharray":"3,3",
			fill: "none"
		});
	}
	else{
		temp_rect = svg.rect(currentRect.attr('x'),currentRect.attr('y'),currentRect.attr('width'),currentRect.attr('height'));
		temp_rect.attr({
			stroke: "#000",
			strokeWidth: 0.8,
			"stroke-dasharray":"3,3",
			fill: "none"
		});
	}
	//highlight사각형 ( 어디에 위치될지 ) 알려주는 사각형 만들어줌
	if(currentRect.type == "ellipse"){
		highlight_rect = svg.rect(currentRect.attr('cx')-100,currentRect.attr('cy')-40,200,80);
		highlight_rect.attr({
			stroke: "#00fa00",
			strokeWidth: 0.5,
			fill: "#00fa00",
			"fill-opacity":0.4
		});
	}
	else{
		highlight_rect = svg.rect(currentRect.attr('x')-25,currentRect.attr('y')-15,200,80);
		highlight_rect.attr({
			stroke: "#00fa00",
			strokeWidth: 0.5,
			fill: "#00fa00",
			"fill-opacity":0.4
		});
	}
	this.data('origTransform',this.transform().local);
}

//rect drag 리스너중 stop(놓았을때 발생)
var stop = function(){
	if(line_drawing==false){
		//console.log("drag Stop");
		currentoverRect=null;
		var trans = this.transform().local;
		var tempX,tempY,col_check,row_check;
		//console.log("highlight_rect : "+highlight_rect.attr('x'));
		//console.log("current_rect : "+currentRect.attr('cx'));
		if(currentRect.type == "ellipse"){
			tempX = (Number(highlight_rect.attr('x'))+100)-Number(currentRect.attr('cx'));
			tempY = Number(highlight_rect.attr('y'))+40-Number(currentRect.attr('cy'));
			col_check=parseInt((Number(this.children()[0].attr('cx'))+tempX)/200);
			row_check=parseInt((Number(this.children()[0].attr('cy'))+tempY)/80);
		}
		else{
			tempX = (Number(highlight_rect.attr('x'))+25)-Number(currentRect.attr('x'));
			tempY = Number(highlight_rect.attr('y'))+15-Number(currentRect.attr('y'));
			col_check=parseInt((Number(this.children()[0].attr('x'))+tempX)/200);
			row_check=parseInt((Number(this.children()[0].attr('y'))+tempY)/80);
		}
		if(tempX==0 && tempY==0){
			temp_rect.remove();
			highlight_rect.remove();
			return ;
		}
		if(rectarr[col_check][row_check]){
			temp_rect.remove();
			highlight_rect.remove();
			alert('exist');
			return;
		}
		//console.log("test2 : "+currentRect.type);
			this.attr({
				transform:'1,0,0,1,0,0'
			});
			//Rect 옮기기
			if(currentRect.type == "ellipse"){//원일 때
				this.children()[0].attr({
					cx:Number(this.children()[0].attr('cx'))+Number(tempX),
					cy:Number(this.children()[0].attr('cy'))+Number(tempY)
				});
			}
			else{//사각형일 때
				this.children()[0].attr({
					x:Number(this.children()[0].attr('x'))+Number(tempX),
					y:Number(this.children()[0].attr('y'))+Number(tempY)
				});
			}
			//Text 옮기기
			this.children()[1].attr({
				x:Number(this.children()[1].attr('x'))+Number(tempX),
				y:Number(this.children()[1].attr('y'))+Number(tempY)
			})
			//점 따라다니게 하기 (연결된 선을 다시 그려주기 위해).
			var temp_children = this.children();
			var rectid = Number(temp_children[0].attr('id'));
	
			var temp_col = findRectArr[rectid].col;
			var temp_row = findRectArr[rectid].row;
			if(currentRect.type == "ellipse"){
				findRectArr[rectid].col = parseInt(Number(temp_children[0].attr('cx'))/200);
				findRectArr[rectid].row = parseInt(Number(temp_children[0].attr('cy'))/80);
			}
			else{
				findRectArr[rectid].col = parseInt(Number(temp_children[0].attr('x'))/200);
				findRectArr[rectid].row = parseInt(Number(temp_children[0].attr('y'))/80);
			}
			var temp_gtag = rectarr[temp_col][temp_row];
			rectarr[temp_col][temp_row]=undefined;
			rectarr[findRectArr[rectid].col][findRectArr[rectid].row] = temp_gtag;
			
			//연결된 선 다시그리기
			for(var i=2;i<temp_children.length;i++){
				
				if(typeof temp_children[i].attr('pathid') === 'string'){
					var ptid = Number(temp_children[i].attr('pathid'));
					//console.log(ptid);
					//console.log(this.children());
					circleArray[ptid].start.remove();
					circleArray[ptid].end.remove();
					
					//console.log(rectid+','+circleArray[ptid].srect+','+circleArray[ptid].erect);
					path[ptid].remove();
					drawLinef(circleArray[ptid].srect,circleArray[ptid].erect,ptid);
				}
			}
	}
	highlight_rect.remove();
	temp_rect.remove();
}
function addrect(left,right,width,height,nodename){
	var newg = svg.g();
	//g태그 하나 생성
	newg.attr({
		transform:'translate(0,0)',
		cursor: 'move'
	});
	//rect1개 생성
	var x=150,y=150,w=200,h=50,name="NewNode";
	if(typeof left==='number'){
		x= (left);
		y= (right);
		w= (width);
		h= (height);
		name=nodename;
	}
	//console.log(nodename);

	//source 와 sink동그라미 처리
	var source_re = /\S*[Ss]ource/;
	var sink_re = /\S*[Ss]ink/;
	var match = nodename.match(source_re);
	var match2 = nodename.match(sink_re);
	if(match || match2){
		var newrect=svg.ellipse(x+75,y+25,75,15);
		var newtext = svg.text(x-name.length+50,y+28,name);
	}
	else{
		var newrect = svg.rect(x,y,w,h);
		var newtext = svg.text(x-name.length+50,y+28,name);
	}
	var temp_node;
	for(var i=0;i<nodelist.length;i++){
		if(nodelist[i].node_name == nodename){
			temp_node = JSON.parse(JSON.stringify(nodelist[i]));
			nodelist.splice(i,1);
			break;
		}
	}
	//console.log(temp_node);
	//findRectArr.push(name);
	newrect.attr({
		nodename:name,
		fill:"#ffffff",
		stroke: "#000",
		strokeWidth: 1,
		id:rectid++
	});
	if(temp_node){
		newrect.attr(temp_node);
	}
	newg.add(newrect);
	newg.add(newtext);
	newg.drag(move,start,stop);
	return newg;
}
//AddBox 버튼 클릭 리스너

$("#addrect").click(function(){
	var temp_col=0,temp_row;
	for(var i=0;i<100;i++){
		if(rectarr[0][i]) continue;
		else{
			temp_row = i;
			break;
		}
	}
	var temp_name;
	
	for(var i=1;i<101;i++){
		if(FindRectf(findRectArr,"NewNode"+i.toString()) != -1){
			continue;
		}
		else{
			temp_name = "NewNode"+i.toString();
			break;
		}
	}
	//console.log(temp_name);
	rectarr[temp_col][temp_row] = addrect(temp_col*200+25,temp_row*80+15,150,50,temp_name);
	findRectArr.push({name:temp_name,col:temp_col,row:temp_row});
});
//flow값(렌더링 할 값이 있으면) 렌더링 해줘야함.

function FindRectf(arr,nodename){
	for(var i=0;i<arr.length;i++){
		if(arr[i].name == nodename)
			return i;
	}
	return -1;
}
//연결선 그려주는 함수
function drawLinef(start,end,ptid){
	var pathnum;
	if(ptid){
		//console.log("pathid is good");
		pathnum = ptid
	}
	else{
		pathnum = pathid;
		pathid++;
	}
	var srow,scol,erow,ecol;
	//console.log("start : "+start);
	//console.log("end : "+end)
	//console.log(findRectArr[start]);
	srow = findRectArr[start].row;
	scol = findRectArr[start].col;
	erow = findRectArr[end].row;
	ecol = findRectArr[end].col;
	var startG = rectarr[scol][srow];
	var endG = rectarr[ecol][erow];
	var startchild = startG.children();
	var endchild = endG.children();
	if(scol == ecol){//열같으면 그냥 바로 아래로 가는 선 만들어주면 됨
		//처음 시작 점 찾기
		if(startchild[0].attr("x")){
			var startx = Number(startchild[0].attr("x"));
			var starty = Number(startchild[0].attr("y"));
			var startwidth = Number(startchild[0].attr("width"));
			var startheight = Number(startchild[0].attr("height"));
		}
		else{
			var startx = Number(startchild[0].attr("cx"));
			var starty = Number(startchild[0].attr("cy"));
			var startwidth = Number(startchild[0].attr("rx"));
			var startheight = Number(startchild[0].attr("ry"));
			startx-=37.5;
		}
		var sCirclex = startx+startwidth/2;
		var sCircley = starty+startheight;
		var new_start_circle = svg.circle(sCirclex,sCircley,0);
		new_start_circle.attr({
			pathid:pathnum,
			name:"from"
		});
		startG.add(new_start_circle);
		//끝나는 점 찾기
		if(endchild[0].attr("x")){
			var endx = Number(endchild[0].attr("x"));
			var endy = Number(endchild[0].attr("y"));
			var endwidth = Number(endchild[0].attr("width"));
			var endheight = Number(endchild[0].attr("height"));
		}
		else{
			var endx = Number(endchild[0].attr("cx"));
			var endy = Number(endchild[0].attr("cy"));
			var endwidth = Number(endchild[0].attr("rx"));
			var endheight = Number(endchild[0].attr("ry"));
			endx-=37.5;
			endy-=Number(endchild[0].attr("ry"));
		}
		var eCirclex = endx+endwidth/2;
		var eCircley = endy;
		var new_end_circle = svg.circle(eCirclex,eCircley,0);
		new_end_circle.attr({
			pathid:pathnum,
			name:"to"
		});
		endG.add(new_end_circle);
		
		path[pathnum]=svg.path("M"+sCirclex+","+sCircley+" L"+eCirclex+","+eCircley);
		path[pathnum].attr({
			markerEnd: marker,
			fill: "#000000",
			stroke: "#000",
			strokeWidth:1
		});
		circleArray[pathnum]={
				start:new_start_circle,
				end:new_end_circle,
				srect:start,
				erect:end
		};
	}
	else if(scol < ecol){//오른쪽으로 빠지는 선
		//처음 시작 점 찾기
		if(startchild[0].attr("x")){
			var startx = Number(startchild[0].attr("x"));
			var starty = Number(startchild[0].attr("y"));
			var startwidth = Number(startchild[0].attr("width"));
			var startheight = Number(startchild[0].attr("height"));
		}
		else{
			var startx = Number(startchild[0].attr("cx"));
			var starty = Number(startchild[0].attr("cy"));
			var startwidth = Number(startchild[0].attr("rx"));
			var startheight = Number(startchild[0].attr("ry"));
			startx-=37.5;
		}
		var sCirclex = startx+startwidth/2;
		var sCircley = starty+startheight;
		var new_start_circle = svg.circle(sCirclex,sCircley,0);
		new_start_circle.attr({
			pathid:pathnum,
			name:"from"
		});
		startG.add(new_start_circle);
		
		//끝나는 점 찾기
		if(endchild[0].attr("x")){
			var endx = Number(endchild[0].attr("x"));
			var endy = Number(endchild[0].attr("y"));
			var endwidth = Number(endchild[0].attr("width"));
			var endheight = Number(endchild[0].attr("height"));
		}
		else{
			var endx = Number(endchild[0].attr("cx"));
			var endy = Number(endchild[0].attr("cy"));
			var endwidth = Number(endchild[0].attr("rx"));
			var endheight = Number(endchild[0].attr("ry"));
			endx-=37.5;
			endy-=Number(endchild[0].attr("ry"));
		}
		var eCirclex = endx+endwidth/2;
		var eCircley = endy;
		var new_end_circle = svg.circle(eCirclex,eCircley,0);
		new_end_circle.attr({
			pathid:pathnum,
			name:"to"
		});
		endG.add(new_end_circle);
		
		//아랫쪽에 뭔가 있는지 판단해줘야함
		var lineString="M"+sCirclex+","+sCircley;
		var forX,forY;
		for(forY=srow+1;forY<erow;forY++){
			if(rectarr[ecol][forY]){
				//console.log("break");
				break;
			}
			else{
				
			}
				//console.log("no");
		}
		lineString = lineString+"L"+sCirclex+","+(sCircley+15);
		if(forY>=erow){//아래 라인 안막힘
			lineString=lineString+"L"+(ecol*200+100)+","+(sCircley+15);
		}
		else{//아래쪽으로 가는 라인에 사각형에 막힘
			//console.log("else");
			//console.log("forY : "+forY+" ,erow : "+erow)
			lineString=lineString+"L"+(ecol*200)+","+(sCircley+15);
			lineString=lineString+"L"+(ecol*200)+","+(eCircley-15);
			lineString=lineString+"L"+(ecol*200+100)+","+(eCircley-15);
		}
		lineString=lineString+"L"+eCirclex+","+eCircley;
		path[pathnum]=svg.path(lineString);
		path[pathnum].attr({
			markerEnd: marker,
			fill: "none",
			stroke: "#000",
			strokeWidth:1
		});
		circleArray[pathnum]={
				start:new_start_circle,
				end:new_end_circle,
				srect:start,
				erect:end
		};
	}
	else if(scol > ecol){//열 다르면 꺾인선 만들어줘야함(왼쪽으로 빠지는 선)
		//처음 시작 점 찾기
		if(startchild[0].attr("x")){
			var startx = Number(startchild[0].attr("x"));
			var starty = Number(startchild[0].attr("y"));
			var startwidth = Number(startchild[0].attr("width"));
			var startheight = Number(startchild[0].attr("height"));
		}
		else{
			var startx = Number(startchild[0].attr("cx"));
			var starty = Number(startchild[0].attr("cy"));
			var startwidth = Number(startchild[0].attr("rx"));
			var startheight = Number(startchild[0].attr("ry"));
			startx-=37.5;
		}
		var sCirclex = startx+startwidth/2;
		var sCircley = starty+startheight;
		var new_start_circle = svg.circle(sCirclex,sCircley,0);
		new_start_circle.attr({
			pathid:pathnum,
			name:"from"
		});
		startG.add(new_start_circle);
		
		//끝나는 점 찾기
		if(endchild[0].attr("x")){
			var endx = Number(endchild[0].attr("x"));
			var endy = Number(endchild[0].attr("y"));
			var endwidth = Number(endchild[0].attr("width"));
			var endheight = Number(endchild[0].attr("height"));
		}
		else{
			var endx = Number(endchild[0].attr("cx"));
			var endy = Number(endchild[0].attr("cy"));
			var endwidth = Number(endchild[0].attr("rx"));
			var endheight = Number(endchild[0].attr("ry"));
			endx-=37.5;
			endy-=Number(endchild[0].attr("ry"));
		}
		var eCirclex = endx+endwidth/2;
		var eCircley = endy;
		var new_end_circle = svg.circle(eCirclex,eCircley,0);
		new_end_circle.attr({
			pathid:pathnum,
			name:"to"
		});
		endG.add(new_end_circle);

		//아래 라인에 뭔가 있는지 판단해줘야함
		var lineString="M"+sCirclex+","+sCircley;
		var forX,forY;
		for(forY=srow+1;forY<erow;forY++){
			if(rectarr[scol][forY]){
				break;
			}
		}
		
		if(forY >= erow){
			for(forX=scol-1;forX>ecol;forX--){
				if(rectarr[forX][erow]){
					break;
				}
			}
		}
		//console.log("forX : "+forX);
		//console.log("forY : "+forY);
		//console.log(erow);
		//처음 아래로 가는 선 그려주기
		if(forY>=erow){
			//console.log("test for if");
			lineString=lineString+"L"+sCirclex+","+(eCircley-15);
			lineString=lineString+"L"+eCirclex+","+(eCircley-15);
			
		}
		else{//아래쪽으로 가는 라인에 사각형에 막힘
			//console.log("test for else");
			lineString=lineString+"L"+sCirclex+","+(forY*80);
			lineString=lineString+"L"+(eCirclex+100)+","+(forY*80);
			lineString=lineString+"L"+(eCirclex+100)+","+(eCircley-15);
			lineString=lineString+"L"+(eCirclex)+","+(eCircley-15);
		}
		
		lineString=lineString+"L"+eCirclex+","+eCircley;
		//console.log(lineString);
		path[pathnum]=svg.path(lineString);
		path[pathnum].attr({
			markerEnd: marker,
			fill: "none",
			stroke: "#000",
			strokeWidth:1
		});
		circleArray[pathnum]={
				start:new_start_circle,
				end:new_end_circle,
				srect:start,
				erect:end
		};
	}
}
//node name 으로 찾아서 from link에서 어디에 연결되어있는지 찾아주는 함수.
function findNode(arr,nodename,num){
	var sink_re = /\S*[Ss]ink/;
	var ret=null;
	var startNode;
	var temp_row,temp_col,index;
	if(num==1){//num이 1일때 정규식으로 앞뒤 자르고 source
		col = maxcol+1;
		var re = /\S*[Ss]ource/;
		for(var i=0;i<arr.length;i++){
			var match = arr[i].from.match(re);
			if(match){
				if(FindRectf(findRectArr,match[0]) == -1){
					rectarr[col][row] = addrect(col*200+25,row*80+15,150,50,match[0]);
					rectarr[col][row].children()[0].attr({
						flow_name:flowname[0]
					});
					findRectArr.push({name:match[0],col:col,row:row});
					row++;
					flowname.splice(0,1);
				}
				ret = arr[i].to;
				arr.splice(i,1);
				index = FindRectf(findRectArr,match[0]);
				temp_row = findRectArr[index].row;
				temp_col = findRectArr[index].col;
				startNode = rectarr[col][row];
				break;
			}
		}
	}
	else{
		for(var i=0;i<arr.length;i++){
			var match = arr[i].from.match(nodename);
			if(match){
				if(FindRectf(findRectArr,match[0]) == -1){
					rectarr[col][row] = addrect(col*200+25,row*80+15,150,50,match[0]);
					findRectArr.push({name:match[0],col:col,row:row});
					row++;
				}
				ret = arr[i].to;
				arr.splice(i,1);
				index = FindRectf(findRectArr,match[0]);
				temp_row = findRectArr[index].row;
				temp_col = findRectArr[index].col;
				startNode = rectarr[col][row];
				break;
			}
		}
	}
	if(ret==null){
		if(arr[0])
			ret = arr[0].from;
		col++;
		return ret;
	}
	if(FindRectf(findRectArr,ret) != -1){//있으니 선만 이어준다.
//		console.log("test : "+FindRectf(findRectArr,ret));
//		console.log("있다ret");
//		console.log(ret);
		line_queue.push({
			start:index,
			end:FindRectf(findRectArr,ret)
		});
		//drawLinef(index,FindRectf(findRectArr,ret));
	}
	else{//없으니 만들어 주고 이어준다.
//		console.log("만들었다 "+ ret);
		//start node의 위치를 찾는다.
		col = temp_col;
		row = temp_row+1;
		while(1){
			if(rectarr[col][row]){
				col++;
			}
			else{
				break;
			}
		}
		maxcol = Math.max(col,maxcol);
		rectarr[col][row] = addrect(col*200+25,row*80+15,150,50,ret);
		findRectArr.push({name:ret,col:col,row:row});
		row++;
		line_queue.push({
			start:index,
			end:FindRectf(findRectArr,ret)
		});
	}
	if(ret.match(sink_re)){
		if(arr[0])
			ret = arr[0].from;
		col++;
	}
	return ret;
}

if(flow){
	rectarr[0][0]=1;
	//console.log(flowname);
	var line_queue=[];
	var maxcol=-1;
	
	row=1;
	col=0;
	//console.log("ok");
	//console.log(flow.length);
	for(var i=0;i<flow.length;i++){
		var ret = findNode(flow[i],"source",1);
		while(flow[i].length > 0){
			ret = findNode(flow[i],ret,2);
		}
		col++;
		row=1;
	}
	while(line_queue.length > 0){
		var temp = line_queue.shift();
		drawLinef(temp.start,temp.end);
	}
}
if(activator){
	for(var i=0;i<activator.childNodes.length;i++){
		if(activator.childNodes[i].tagname == "condition"){
			condition = activator.childNodes[i];
		}
		else if(activator.childNodes[i].tagname == "activate"){
			activate = activator.childNodes[i];
		}
	}
	for(var i=0;i<condition.childNodes.length;i++){
		if(condition.childNodes[i].tagname=="case"){
			con_case = condition.childNodes[i];
		}
		else if(condition.childNodes[i].tagname == "context"){
			context = condition.childNodes[i];
		}
	}
}
else{
	activator = {};
	activator['attributes']={};
	activator['childNodes']=[];
	activator['attributes']['name']='Activator';
	activator['tagname']='activator';
	
	condition['attributes']={};
	condition['childNodes']=[];
	condition['tagname']='condition';
	
	activate['attributes']={};
	activate['childNodes']=[];
	activate['tagname']='activate';
	
	con_case['attributes']={};
	con_case['childNodes']=[];
	con_case['tagname']='case';

	context['attributes']={};
	context['childNodes']=[];
	context['tagname']='context';
	
	activator['childNodes'].push(condition);
	activator['childNodes'].push(activate);
	condition['childNodes'].push(con_case);
	condition['childNodes'].push(context);
	
	console.log(JSON.stringify(activator));
}

