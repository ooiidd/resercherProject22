var task = require('./controllers/task-controller.js');

exports.route = function(app){
	app.get('/',task.main);
	app.post('/xmlparse',task.xmlparse);
	app.post('/toxml',task.toxml);
	app.get('/ajax1',task.ajax1);
	app.get('/ajax2',task.ajax2);
	app.get('/ajax3',task.ajax3);
}