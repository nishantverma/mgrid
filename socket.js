var _ = require('underscore')._;

sio.configure('production', function() {
    io.set('log level', 1);
});

sio.sockets.on('connection', function(socket) {
	 var deviceName="";
     socket.on('deviceInfo', function (data) {
	       models.Device.find({where: {name: data.name}})
	       	.success(function(device) {
	       		if(device == null ){
	       			 socket.disconnect();
	       			 return;
	       		}
	       		deviceName = device.name;
	       		device.updateStatus(true).error(function(){
	       			deviceName=""
	       			socket.disconnect();
	       		}).success(function(){
	       			socket.set("deviceId",device.id);
	       			socket.broadcast.emit('device_status', {id: device.id, status: 'Available'})
	       		});
	       	});
	  });

  socket.on('status',function(data){
  	models.RunItem.find(data.runitem.id).success(function(item){
  		item.status=data.status;
  		item.save();
  	})
  });

  socket.on('result',function(data){
	var isPassed = _.every(_.flatten(_.map(_.flatten(_.map(data.result,function(feature){
	  		return _.where(feature.elements,{"keyword": "Scenario"});
	  	})), function(scenario){
			return _.map(scenario.steps,function(s){ return s.result.status});
		})),function(s){return s === 'passed'});

	_.each(data.result,function(feature){
		var feature_name = feature.name;
		var scenarios= _.map(_.where(feature.elements,{"keyword": "Scenario"}),function(scenario){
			var results = _.flatten(_.map(scenario.steps,function(s){ return s.result.status}));
			var status="";
			if(_.every(results,function(s){return s === 'passed'})){
				status="Passed";
			}else if(_.every(results,function(s){return s === 'skipped'})){
				status="Skipped";
			}else{
				status="Failed";
			}
			return {name: scenario.name,feature: feature_name,status: status,runitemId: data.id}
		});

		models.Scenario.bulkCreate(scenarios)
			.success(function(){
				 console.log("created scenarios");
			}).error(function(){
				console.log("error while saving scenarios" );
			});
	});

	models.RunItem.find(data.id).success(function(item){
  		if(isPassed){
  			item.status="Passed";
  		}else{
  			item.status="Failed";
  		}
  		item.save().error(function(){
  			console.log("Error while updating runitem");
  		});
  		
  	});
  });

     // Disconnect
  socket.on('disconnect', function (data) {
  	 console.log("disconnect" + deviceName)
  	 models.Device.find({where: {name: deviceName}})
       	.success(function(device) {
       		if (deviceName !== ""){
	       		deviceName = device.name;
	       		device.updateStatus(false).error(function(){
	       			console.log("Unable to update the device status")
	       		}).success(function () {
	       			socket.broadcast.emit('device_status', {id: device.id, status: 'Disconnected'})
	       		});
       		}
       	});
  });
});



