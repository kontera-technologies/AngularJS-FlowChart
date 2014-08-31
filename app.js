
//
// Define the 'app' module.
//
angular.module('app', ['flowChart', ])

.filter('worker', function() {
    return function(nodes, uppercase) {
        var out = [];
        for (var i = 0; i < nodes.length; i++) {
            if(nodes[i].data.type == "worker"){
                out.push(nodes[i]);
            }
        }
        return out;
    }
})

.filter('sink', function() {
    return function(nodes, uppercase) {
        var out = [];
        for (var i = 0; i < nodes.length; i++) {
            if(nodes[i].data.type == "sink"){
                out.push(nodes[i]);
            }
        }
        return out;
    }
})

//
// Simple service to create a prompt.
//
.factory('prompt', function () {

	/* Uncomment the following to test that the prompt service is working as expected.
	return function () {
		return "Test!";
	}
	*/

	// Return the browsers prompt function.
	return prompt;
})

//
// Application controller.
//
.controller('AppCtrl', ['$scope', 'prompt', function AppCtrl ($scope, prompt) {

	//
	// Code for the delete key.
	//
	var deleteKeyCode = 46;

	//
	// Code for control key.
	//
	var ctrlKeyCode = 65;

	//
	// Set to true when the ctrl key is down.
	//
	var ctrlDown = false;

	//
	// Code for A key.
	//
	var aKeyCode = 17;

	//
	// Code for esc key.
	//
	var escKeyCode = 27;

	//
	// Selects the next node id.
	//
	var nextNodeID = 10;

	//
	// Setup the data-model for the chart.
	//
	var chartDataModel = {

		nodes: [
			{
				name: "url-sifter",
				type: "worker",
				id: 0,
				x: 0,
				y: 0,
				inputConnectors: [
					{
						name: "A",
					},
					{
						name: "B",
					},
					{
						name: "C",
					},
				],
				outputConnectors: [
					{
						name: "A",
					},
					{
						name: "B",
					},
					{
						name: "C",
					},
				],
			},

			{
				name: "sifter_kontera",
				type: "sink",
				id: 1,
				x: 200,
				y: 0,
				inputConnectors: [
					{
						name: "A",
					}
				],
				outputConnectors: [
					{
						name: "A",
					}
				],
			},

			{
				name: "sifter_display",
				type: "sink",
				id: 5,
				x: 200,
				y: 120,
				inputConnectors: [
					{
						name: "A",
					}
				],
				outputConnectors: [
					{
						name: "A",
					}
				],
			},
{
				name: "url-content-fetcher",
				type: "worker",
				id: 2,
				x: 400,
				y: 0,
				inputConnectors: [
					{
						name: "A",
					},
					{
						name: "B",
					},
					{
						name: "C",
					},
				],
				outputConnectors: [
					{
						name: "A",
					},
					{
						name: "B",
					},
					{
						name: "C",
					},
				],
			},
			{
				name: "fetcher_kontera",
				type: "sink",
				id: 3,
				x: 600,
				y: 0,
				inputConnectors: [
					{
						name: "A",
					}
				],
				outputConnectors: [
					{
						name: "A",
					}
				],
			},

		],

		connections: [
			{
				source: {
					nodeID: 0,
					connectorIndex: 0,
				},

				dest: {
					nodeID: 1,
					connectorIndex: 0,
				},
			},
			{
				source: {
					nodeID: 1,
					connectorIndex: 0,
				},

				dest: {
					nodeID: 2,
					connectorIndex: 0,
				},
			},
			{
				source: {
					nodeID: 0,
					connectorIndex: 1,
				},

				dest: {
					nodeID: 5,
					connectorIndex: 0,
				},
			},
			{
				source: {
					nodeID: 5,
					connectorIndex: 0,
				},

				dest: {
					nodeID: 2,
					connectorIndex: 1,
				},
			}

		]
	};

	//
	// Event handler for key-down on the flowchart.
	//
	$scope.keyDown = function (evt) {

		if (evt.keyCode === ctrlKeyCode) {

			ctrlDown = true;
			evt.stopPropagation();
			evt.preventDefault();
		}
	};

	//
	// Event handler for key-up on the flowchart.
	//
	$scope.keyUp = function (evt) {

		if (evt.keyCode === deleteKeyCode) {
			//
			// Delete key.
			//
			$scope.chartViewModel.deleteSelected();
		}

		if (evt.keyCode == aKeyCode && ctrlDown) {
			// 
			// Ctrl + A
			//
			$scope.chartViewModel.selectAll();
		}

		if (evt.keyCode == escKeyCode) {
			// Escape.
			$scope.chartViewModel.deselectAll();
		}

		if (evt.keyCode === ctrlKeyCode) {
			ctrlDown = false;

			evt.stopPropagation();
			evt.preventDefault();
		}
	};

	//
	// Add a new node to the chart.
	//
	$scope.addNewNode = function () {

		var nodeName = prompt("Enter a node name:", "New node");
		if (!nodeName) {
			return;
		}

		//
		// Template for a new node.
		//
		var newNodeDataModel = {
			name: nodeName,
			id: nextNodeID++,
			x: 0,
			y: 0,
			inputConnectors: [ 
				{
                    name: "X"
                },
                {
                    name: "Y"
                },
                {
                    name: "Z"
                }			
			],
			outputConnectors: [ 
				{
                    name: "1"
                },
                {
                    name: "2"
                },
                {
                    name: "3"
                }			
			],
		};

		$scope.chartViewModel.addNode(newNodeDataModel);
	};

	//
	// Add an input connector to selected nodes.
	//
	$scope.addNewInputConnector = function () {
		var connectorName = prompt("Enter a connector name:", "New connector");
		if (!connectorName) {
			return;
		}

		var selectedNodes = $scope.chartViewModel.getSelectedNodes();
		for (var i = 0; i < selectedNodes.length; ++i) {
			var node = selectedNodes[i];
			node.addInputConnector({
				name: connectorName,
			});
		}
	};

	//
	// Add an output connector to selected nodes.
	//
	$scope.addNewOutputConnector = function () {
		var connectorName = prompt("Enter a connector name:", "New connector");
		if (!connectorName) {
			return;
		}

		var selectedNodes = $scope.chartViewModel.getSelectedNodes();
		for (var i = 0; i < selectedNodes.length; ++i) {
			var node = selectedNodes[i];
			node.addOutputConnector({
				name: connectorName,
			});
		}
	};

	//
	// Delete selected nodes and connections.
	//
	$scope.deleteSelected = function () {

		$scope.chartViewModel.deleteSelected();
	};

	//
	// Create the view-model for the chart and attach to the scope.
	//
	$scope.chartViewModel = new flowchart.ChartViewModel(chartDataModel);
}])
;
