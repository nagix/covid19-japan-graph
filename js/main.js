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
var GRAPH_MARGIN = 20;
var RECENT = '2020-03-24';

var sourceMaster = {
	'china': { label: { 'ja': '中国' } },
	'china-tourist': { label: { 'ja': '中国からの観光客' } },
	'cruise-ship': { label: { 'ja': 'クルーズ船' } },
	'cambodia': { label: { 'ja': 'カンボジア' } },
	'france': { label: { 'ja': 'フランス' } },
	'egypt': { label: { 'ja': 'エジプト' } },
	'uk': { label: { 'ja': 'イギリス' } },
	'vietnam': { label: { 'ja': 'ベトナム' } },
	'usa': { label: { 'ja': '米国' } },
	'philippines': { label: { 'ja': 'フィリピン' } },
	'southeast-asia': { label: { 'ja': '東南アジア' } },
	'italy': { label: { 'ja': 'イタリア' } },
	'finland': { label: { 'ja': 'フィンランド' } },
	'netherlands': { label: { 'ja': 'オランダ' } },
	'thailand': { label: { 'ja': 'タイ' } },
	'norway': { label: { 'ja': 'ノルウェー' } },
	'ireland': { label: { 'ja': 'アイルランド' } },
	'spain': { label: { 'ja': 'スペイン' } },
	'portugal': { label: { 'ja': 'ポルトガル' } },
	'russia': { label: { 'ja': 'ロシア' } },
	'europe': { label: { 'ja': 'ヨーロッパ' } },
	'jordan': { label: { 'ja': 'ヨルダン' } },
	'turkey': { label: { 'ja': 'トルコ' } },
	'qatar': { label: { 'ja': 'カタール' } },
	'morocco': { label: { 'ja': 'モロッコ' } },
	'switzerland': { label: { 'ja': 'スイス' } },
	'cotedivoirc': { label: { 'ja': 'コートジボワール' } },
	'mexico': { label: { 'ja': 'メキシコ' } },
	'southafrica': { label: { 'ja': '南アフリカ' } },
	'belgium': { label: { 'ja': 'ベルギー' } },
	'luxembourg': { label: { 'ja': 'ルクセンブルグ' } },
	'bolivia': { label: { 'ja': 'ボリビア' } },
	'southkorea': { label: { 'ja': '韓国' } },
	'ethiopia': { label: { 'ja': 'エチオピア' } },
	'oversea': { label: { 'ja': '海外' } }
};

var clusterMaster = {
	'sagamihara-hospital': { label: { 'ja': '相模原中央病院クラスター' }, parentId: 'sagamihara' },
	'sagamihara-welfare': { label: { 'ja': '相模原福祉施設クラスター' }, parentId: 'sagamihara' },
	'tokyo-yakatabune': { label: { 'ja': '屋形船新年会クラスター' }, parentId: 'tokyo' },
	'wakayama-hospital': { label: { 'ja': '和歌山済生会有田病院クラスター' }, parentId: 'wakayama' },
	'nagoya-gym-a': { label: { 'ja': '名古屋スポーツジムAクラスター' }, parentId: 'nagoya' },
	'ichikawa-gym': { label: { 'ja': '市川スポーツジムクラスター' }, parentId: 'chiba' },
	'nagoya-gym-b': { label: { 'ja': '名古屋スポーツジムBクラスター' }, parentId: 'nagoya' },
	'kitami-exhibition': { label: { 'ja': '北見展示会クラスター' }, parentId: 'hokkaido' },
	'osaka-livehouse-a': { label: { 'ja': '大阪京橋ライブハウスArcクラスター' }, parentId: 'osaka' },
	'niigata-pingpong': { label: { 'ja': '新潟卓球スクールクラスター' }, parentId: 'niigata-city' },
	'nagoya-dayservice-a': { label: { 'ja': '名古屋高齢者デイサービスAクラスター' }, parentId: 'nagoya' },
	'sapporo-livebar': { label: { 'ja': '札幌中ライブバークラスター' }, parentId: 'sapporo' },
	'nagoya-dayservice-b': { label: { 'ja': '名古屋高齢者デイサービスBクラスター' }, parentId: 'nagoya' },
	'nagoya-dayservice-c': { label: { 'ja': '名古屋高齢者デイサービスCクラスター' }, parentId: 'nagoya' },
	'osaka-livehouse-b': { label: { 'ja': '大阪北区ライブハウスSoap Opera Classics Umedaクラスター' }, parentId: 'osaka' },
	'itami-daycare': { label: { 'ja': '伊丹市デイケア施設クラスター' }, parentId: 'hyogo' },
	'himeji-hospital': { label: { 'ja': '姫路仁恵病院クラスター' }, parentId: 'himeji' },
	'osaka-livehouse-c': { label: { 'ja': '大阪北区ライブハウスLIVE HOUSE Rumioクラスター' }, parentId: 'osaka' },
	'kobe-kindergarten': { label: { 'ja': '神戸こども園クラスター' }, parentId: 'kobe' },
	'osaka-livehouse-d': { label: { 'ja': '大阪中央区ライブハウスamericamura FANJ twiceクラスター' }, parentId: 'osaka' },
	'takarazuka-hospital': { label: { 'ja': '宝塚第一病院クラスター' }, parentId: 'hyogo' },
	'kobe-longterm-care': { label: { 'ja': '神戸介護保険通所事業所クラスター' }, parentId: 'kobe' },
	'oizumi-clinic': { label: { 'ja': '大泉町診療所クラスター' }, parentId: 'gunma' },
	'oita-hospital': { label: { 'ja': '大分医療センタークラスター' }, parentId: 'oita' },
	'nippon-cargo-airlines': { label: { 'ja': '日本貨物航空クラスター' }, parentId: 'chiba' },
	'gifu-chorus': { label: { 'ja': '岐阜合唱団クラスター' }, parentId: 'gifu' },
	'taito-hospital': { label: { 'ja': '台東区永寿総合病院クラスター' }, parentId: 'tokyo' }
};

var boxColors = {
	'male': { stroke: '#559', fill: '#ccf' },
	'female': { stroke: '#955', fill: '#fcc' },
	'': { stroke: '#555', fill: '#ccc' }
};

var dict = {
	'male': { 'ja': '男性' },
	'female': { 'ja': '女性' },
	'': { 'ja': '' }
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

var loadData = function(path) {
	return new Promise(function(resolve, reject) {
		var url = DATA_URL + '/' + path + '/' + DATA_FILE;

		loadJSON(url).then(function(self) {
			var id = self.id;
			var ancestors = path.split('/');
			var subgroups = self.subgroups || [];

			Promise.all(subgroups.map(function(subgroup) {
				return loadData(path + '/' + subgroup);
			})).then(function(patients) {
				resolve(patients.reduce(function(target, source) {
					return {
						date: target.date > source.date ? target.date : source.date,
						clusters: target.clusters.concat(source.clusters),
						data: target.data.concat(source.data)
					};
				}, {
					date: self.date,
					clusters: [{ id: id, label: self.label, parentId: ancestors[ancestors.length - 2] }],
					data: self.data.map(function(entry) {
						entry.parentId = id;
						entry.topGroupId = ancestors[1] || ancestors[0];
						return entry;
					})
				}));
			});
		}).catch(function(error) {
			reject(error);
		});
	});
}

var ageText = function(age) {
	return age.replace(/(\d+)s/, '$1代').replace(/u(\d+)/, '$1歳未満');
};

var tooltip = d3.select('body').append('div')
	.attr('class', 'tooltip')
	.style('opacity', 0);

loadData('japan').then(function(patients) {
console.log(patients)
	document.getElementById('last-update').innerHTML = patients.date;
	patients.data.sort(function(a, b) {
		return a.jid > b.jid;
	});

	var graph = new dagreD3.graphlib.Graph({ compound: true });
	graph.setGraph({ rankdir: 'LR' });

	patients.data.forEach(function(patient, i) {
		var jid = patient.jid || '';
		var id = jid || patient.parentId + (patient.id || patient.pid);
		var address = patient.address || '';
		var age = patient.age || '';
		var sex = patient.sex || '';
		var attribute = patient.attribute || '';
		var remarks = patient.remarks || '';
		var supplement = patient.supplement || '';
		var discharged = patient.discharged || '';
		var sources = patient.sources || [];
		var severe = remarks.match(/重症/);
		var dead = remarks.match(/死亡/);
		var date = patient.date;
		var colors = boxColors[sex];
		var sourceIds = (supplement.match(/No\.[\w\-]+/g) || []).map(function(value) {
			return value.replace('No.', '');
		});

		graph.setNode(id, {
			id: id,
			labelType: 'html',
			label: '<div class="container">' +
				'<div class="id" style="background-color: ' + colors.stroke + ';">' + jid + '</div>' +
				'<div class="label">' + ageText(age) + dict[sex].ja + ' ' + attribute + '</div>' + (
					dead ? '<div class="dead badge">死亡</div>' :
					discharged ? '<div class="check"></div>' :
					severe ? '<div class="severe badge">重症</div>' : ''
				) + '</div>',
			labelpos: 'l',
			width: 380,
			height: 30,
			rx: 5,
			ry: 5,
			style: 'stroke: ' + colors.stroke + '; fill: ' + colors.fill + ';',
			description: 'No: ' + jid +
				'<br>居住地: ' + address +
				'<br>年代: ' + ageText(age) +
				'<br>性別: ' + dict[sex].ja +
				'<br>属性: ' + attribute +
				'<br>備考: ' + remarks +
				'<br>補足: ' + supplement +
				'<br>退院: ' + discharged +
				'<br>発表日: ' + patient.date,
			date: date >= RECENT ? +date.substring(5, 7) + '/' + +date.substring(8, 10) : undefined
		});

		sources.forEach(function(source) {
			var parentId = patient.topGroupId;
			var sourceId = parentId + '-' + source;

			sourceIds.push(sourceId);

			if (!graph.hasNode(sourceId)) {
				graph.setNode(sourceId, {
					id: sourceId,
					label: sourceMaster[source].label.ja,
					width: 130,
					height: 30,
					rx: 5,
					ry: 5,
					class: 'initial-node'
				});

				graph.setParent(sourceId, parentId);
			}
		});

		sourceIds.forEach(function(sourceId) {
			graph.setEdge(sourceId, id, {
				sourceId: sourceId,
				targetId: id,
				label: '',
				arrowhead: 'normal',
				lineInterpolate: 'monotone',
				lineTension: 0,
				arrowheadStyle: 'fill: #aaa'
			});
		});

		graph.setParent(id, patient.cluster || patient.parentId);
	});

	patients.clusters.forEach(function(cluster) {
		var id = cluster.id;
		var parentId = cluster.parentId;

		graph.setNode(id, {
			id: id,
			label: cluster.label.ja,
			clusterLabelPos: 'top',
			style: 'stroke: none; fill: ' + THEME_COLOR + '; opacity: .1;'
		});
		if (parentId) {
			graph.setParent(id, parentId);
		}
	});

	Object.keys(clusterMaster).forEach(function(id) {
		var cluster = clusterMaster[id];
		var parentId = cluster.parentId;

		graph.setNode(id, {
			id: id,
			label: cluster.label.ja,
			clusterLabelPos: 'top',
			style: 'fill: #ffffcc;'
		});
		if (parentId) {
			graph.setParent(id, parentId);
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

	var g = inner.selectAll('g.node')
		.filter(function(d) {
			return graph.node(d).date;
		})
		.append('g')
			.attr('class', 'date')
			.attr('transform', 'translate(176, -40)');
	g.append('rect')
		.attr('width', 48)
		.attr('height', 30)
		.attr('rx', 15)
		.attr('ry', 15);
	g.append('text')
		.attr('x', 24)
		.attr('y', 21)
		.attr('text-anchor', 'middle')
		.text(function(d) { return graph.node(d).date; });

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
			(document.body.clientHeight - svgElement.getBoundingClientRect().top) + 'px';
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
			Math.min(xScale, yScale),
			Math.max(xScale, yScale, 1)
		];
		var scale = Math.min(Math.max(k, extent[0]), extent[1]);
		var xOffset = xScale > k ? dx / 2 : Math.max(x, dx - GRAPH_MARGIN);
		var yOffset = yScale > k ? dy / 2 : Math.max(y, dy - GRAPH_MARGIN);

		zoom.scaleExtent(extent);
		svg.transition().duration(event.duration || 0).call(zoom.transform, d3.zoomIdentity
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
			k: Math.min(svgElement.clientWidth / (width + GRAPH_MARGIN * 2), 1)
		}
	});

	window.addEventListener('resize', redraw);

	var selector = document.getElementById('prefecture-selector');
	patients.clusters.filter(function(cluster) {
		return cluster.parentId === 'japan';
	}).forEach(function(cluster) {
		var option = document.createElement('option');

		option.value = cluster.id;
		option.innerHTML = cluster.label.ja;
		selector.appendChild(option);
	});
	selector.addEventListener('change', function(event) {
		var value = event.target.value;
		var node = inner.select('g.cluster#' + value).node();
		var transform = node.transform.baseVal.getItem(0).matrix;
		var box = node.getBBox();
		var clientWidth = svgElement.clientWidth;
		var k = Math.min(clientWidth / (box.width + GRAPH_MARGIN * 2), 1);

		redraw({
			transform: {
				k: k,
				x: -(transform.e - clientWidth / k / 2),
				y: -(transform.f + box.y) + GRAPH_MARGIN
			},
			duration: 3000
		});
	});

	// Dismiss the loading animation
	document.getElementById('loader').style.opacity = 0;
	setTimeout(function() {
		document.getElementById('loader').style.display = 'none';
	}, 1000);

})/*.catch(function(error) {
	document.getElementById('loader').style.display = 'none';
	document.getElementById('loading-error').innerHTML = 'Loading failed. Please reload the page.';
	document.getElementById('loading-error').style.display = 'block';
	throw error;
})*/;
