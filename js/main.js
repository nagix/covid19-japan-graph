/*
 * Copyright 2020 Akihiko Kusanagi
 *
 *    Licensed under the Apache License, Version 2.0 (the "License");
 *    you may not use this file except in compliance with the License.
 *    You may obtain a copy of the License at
 *
 *        http://www.apache.org/licenses/LICENSE-2.0
 *
 *    Unless required by applicable law or agreed to in writing, software
 *    distributed under the License is distributed on an "AS IS" BASIS,
 *    WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *    See the License for the specific language governing permissions and
 *    limitations under the License.
 *
 * More information about this project is available at:
 *
 *    https://github.com/nagix/covid19-tokyo-graph
 */

var DATA_URL = 'data';
var DATA_FILE = 'data.json';
var THEME_COLOR = '#009094';
var INITIAL_SCALE = 0.66;
var GRAPH_MARGIN = 20;

var prefectures = [
	'aichi', 'chiba', 'hokkaido', 'kanagawa', 'kyoto', 'mie', 'nara', 'osaka',
	'saitama', 'tokyo', 'other'
];

var initialNodes = [
	{ id: 'china', label: '中国' },
	{ id: 'china-tour', label: '中国からの観光客' },
	{ id: 'cruise-ship', label: 'クルーズ船' },
	{ id: 'hawai', label: 'ハワイ' }
];

var clusters = [
	{ id: 'sagamihara-hospital', label: '相模原中央病院クラスター', parentId: 'sagamihara', nodes:[27, 48, 60, 61, 78, 89] },
	{ id: 'tokyo-yakatabune', label: '屋形船新年会クラスター', parentId: 'tokyo', nodes:[28, 33, 34, 'tokyo7', 'tokyo8', 'tokyo9', 'tokyo10', 'tokyo11', 'tokyo12', 42, 47, 'tokyo16', 86] },
	{ id: 'wakayam-hospital', label: '和歌山済生会有田病院クラスター', parentId: 'wakayama', nodes:[29, 31, 38, 40, 54] },
	{ id: 'nagoya-gym-a', label: '名古屋スポーツジムAクラスター', parentId: 'nagoya', nodes:[43, 69, 77, 90, 91, 107, 108, 109, 115, 116, 145, 146, 147, 163, 164] },
	{ id: 'nagoya-gym-b', label: '名古屋スポーツジムBクラスター', parentId: 'nagoya', nodes:[110, 165, 166, 189] },
	{ id: 'kitami', label: '北見展示会クラスター', parentId: 'hokkaido', nodes:[113, 130, 151, 174, 175, 177] }
];

var boxColors = {
	male: { stroke: '#559', fill: '#ccf' },
	female: { stroke: '#955', fill: '#fcc' },
	'': { stroke: '#555', fill: '#ccc' }
};

var dict = {
	'male': '男性',
	'female': '女性',
	'unknown': '不明',
	'': ''
};

var loadJSON = function(url) {
	return new Promise(function(resolve, reject) {
		var request = new XMLHttpRequest();

		request.open('GET', url);
		request.onreadystatechange = function() {
			if (request.readyState === 4) {
				if (request.status === 200) {
					resolve(JSON.parse(request.response));
				} else {
					reject(Error(request.statusText));
				}
			}
		};
		request.send();
	});
};

var loadData = function(id) {
	return new Promise(function(resolve, reject) {
		var url = DATA_URL + '/' + id + '/' + DATA_FILE;

		loadJSON(url).then(function(self) {
			var children = self.children || [];

			self.data.forEach(function(data) {
				data.parentId = self.id;
			});

			Promise.all(children.map(function(child) {
				return loadData(id + '/' + child.id);
			})).then(function(data) {
				resolve(data.reduce(function(target, source, i) {
					if (target.date < source.date) {
						target.date = source.date;
					}
					target.children[i].name = source.name;
					if (source.children) {
						target.children[i].children = source.children;
					}
					target.data = target.data.concat(source.data);
					return target;
				}, self));
			});
		}).catch(function(error) {
			reject(error);
		});
	});
} 

var fullwidthToHalfwith = function(s) {
	return s.replace(/[Ａ-Ｚａ-ｚ０-９]/g, function(s) {
		return String.fromCharCode(s.charCodeAt(0) - 0xFEE0);
	});
};

var tooltip = d3.select('body').append('div')
	.attr('class', 'tooltip')
	.style('opacity', 0);

var getClusters = function(self, parentId) {
	var children = self.children || [];

	return children.reduce(function(target, source) {
		return target.concat(getClusters(source, self.id));
	}, [{ id: self.id, name: self.name.ja, parentId: parentId }]);
}

loadData('japan').then(function(patients) {

	document.getElementById('last-update').innerHTML = patients.date;
	patients.data.sort(function(a, b) {
		return a.jid > b.jid;
	});

	var graph = new dagreD3.graphlib.Graph({ compound: true });
	graph.setGraph({ rankdir: 'LR' });

	initialNodes.forEach(function(node) {
		var id = node.id;

		return graph.setNode(id, {
			id: id,
			label: node.label,
			width: 130,
			height: 30,
			rx: 5,
			ry: 5,
			style: 'stroke: #aaa; fill: #fff;'
		});
	});

	patients.data.forEach(function(patient, i) {
		var jid = patient.jid || '';
		var id = jid || patient.parentId + patient.pid;
		var address = patient.address || '';
		var age = patient.age || '';
		var sex = patient.sex || '';
		var attribute = patient.attribute || '';
		var remarks = patient.remarks || '';
		var supplement = patient.supplement || '';
		var discharged = patient.discharged || '';
		var severe = remarks.match(/重症/);
		var dead = remarks.match(/死亡/);
		var colors = boxColors[sex];
		var sourceIds = [];

		(supplement.match(/No\.[\w０-９]+/g) || [])
			.map(fullwidthToHalfwith)
			.forEach(function(value) {
				sourceIds.push(value.replace('No.', ''));
			});

		if (attribute.match(/武漢|中国/) || supplement.match(/武漢.*(帰国|来日)/)) {
			sourceIds.push('china');
		} else if (supplement.match(/ツアー|観光客/)) {
			sourceIds.push('china-tour');
		} else if (supplement.match(/ダイヤモンド/)) {
			sourceIds.push('cruise-ship');
		} else if (supplement.match(/ハワイ/)) {
			sourceIds.push('hawai');
		}


		graph.setNode(id, {
			id: id,
			labelType: 'html',
			label: '<div class="container">' +
				'<div class="id" style="background-color: ' + colors.stroke + ';">' + jid + '</div>' +
				'<div class="label">' + age.replace('s', '代') + dict[sex] + ' ' + attribute + '</div>' + (
					dead ? '<div class="dead badge">死亡</div>' :
					discharged ? '<div class="check"></div>' :
					severe ? '<div class="severe badge">重症</div>' : ''
				) + '</div>',
			labelpos: 'l',
			width: 380,
			height: 30,
			rx: 5,
			ry: 5,
			style: 'stroke: ' + colors.stroke +
				'; fill: ' + colors.fill,
			description: 'No: ' + jid +
				'<br>居住地: ' + address +
				'<br>年代: ' + age.replace('s', '代') +
				'<br>性別: ' + dict[sex] +
				'<br>属性: ' + attribute +
				'<br>備考: ' + remarks +
				'<br>補足: ' + supplement +
				'<br>退院: ' + discharged +
				'<br>発表日: ' + patient['date']
		});

		sourceIds.forEach(function(sourceId) {
			graph.setEdge(sourceId, id, {
				sourceId: sourceId,
				targetId: id,
				label: '',
				arrowhead: 'normal',
				lineInterpolate: 'monotone',
				lineTension: 0.0,
				style: 'stroke: #aaa; fill: none; stroke-width: 1.5px;',
				arrowheadStyle: 'fill: #aaa'
			});
		});

		graph.setParent(id, patient.parentId)

		clusters.forEach(function(cluster) {
			if (cluster.nodes.indexOf(id) !== -1) {
				graph.setParent(id, cluster.id)
			}
		});
	});

	getClusters(patients).forEach(function(cluster) {
		var id = cluster.id;

		graph.setNode(id, {
			id: id,
			label: cluster.name,
			clusterLabelPos: 'top',
			style: 'stroke: none; fill: ' + THEME_COLOR + '; opacity: 0.1;'
		});
		if (cluster.parentId) {
			graph.setParent(id, cluster.parentId);
		}
	});

	clusters.forEach(function(cluster) {
		var id = cluster.id;

		graph.setNode(id, {
			id: id,
			label: cluster.label,
			clusterLabelPos: 'top',
			style: 'fill: #ffffcc;',
			nodes: cluster.nodes
		});
		if (cluster.parentId) {
			graph.setParent(id, cluster.parentId);
		}
	});

	var svg = d3.select('#network');
	var inner = svg.select('g');

	var zoom = d3.zoom()
		.on('zoom', function () {
			inner.attr('transform', d3.event.transform);
		});
	svg.call(zoom);

	var render = new dagreD3.render();
	render(inner, graph);

	inner.selectAll('g.node')
		.on('mouseover', function(d) {
			var description = graph.node(d).description;

			if (description) {
				tooltip.transition()
					.duration(200)
					.style('opacity', .9);
				tooltip.html(description)
					.style('left', (d3.event.pageX) + 'px')
					.style('top', (d3.event.pageY - 28) + 'px');
			}
		})
		.on('mouseout', function(d) {
			tooltip.transition()
				.duration(500)
				.style('opacity', 0);
		})

	var width = graph.graph().width;
	var height = graph.graph().height;
	var svgElement = svg.node();

	var resetHeight = function() {
		svgElement.style.height =
			document.body.clientHeight - svgElement.getBoundingClientRect().top;
	}

	var redraw = function(event) {
		var initialTransform = event.transform || {};
		var transform = d3.zoomTransform(svgElement);
		var k = initialTransform.k || transform.k;
		var x = initialTransform.x || transform.x / k;
		var y = initialTransform.y || transform.y / k;

		resetHeight();

		var clientWidth = svgElement.clientWidth;
		var clientHeight = svgElement.clientHeight;
		var xScale = clientWidth / (width + GRAPH_MARGIN * 2);
		var yScale = clientHeight / (height + GRAPH_MARGIN * 2);
		var dx = clientWidth / k - width;
		var dy = clientHeight / k - height;
		var extent = [
			Math.min(xScale, yScale, INITIAL_SCALE),
			Math.max(xScale, yScale, 1)
		];
		var scale = Math.min(Math.max(k, extent[0]), extent[1]);
		var xOffset = xScale > k ? dx / 2 : Math.max(x, dx - GRAPH_MARGIN);
		var yOffset = yScale > k ? dy / 2 : Math.max(y, dy - GRAPH_MARGIN);

		zoom.scaleExtent(extent)
			.transform(svg, d3.zoomIdentity
				.scale(scale)
				.translate(xOffset, yOffset)
			);
	};

	var extent = [
		[-GRAPH_MARGIN , -GRAPH_MARGIN],
		[width + GRAPH_MARGIN, height + GRAPH_MARGIN]
	];
	zoom.translateExtent(extent);

	resetHeight();
	redraw({
		transform: {
			k: INITIAL_SCALE,
			x: Math.max((svgElement.clientWidth / INITIAL_SCALE - width) / 2, GRAPH_MARGIN),
			y: Math.max((svgElement.clientHeight / INITIAL_SCALE - height) / 2, GRAPH_MARGIN)
		}
	});

	window.addEventListener('resize', redraw);

});
