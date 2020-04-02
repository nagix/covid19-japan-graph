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
 *    https://github.com/nagix/covid19-japan-graph
 */

var DATA_URL = 'data';
var DATA_FILE = 'data.json';
var GRAPH_MARGIN = 20;
var NODE_RADIUS = 30;
var BASE_TIME = Date.parse('2020-01-15');

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
	'germany': { label: { 'ja': 'ドイツ' } },
	'austria': { label: { 'ja': 'オーストリア' } },
	'brazil': { label: { 'ja': 'ブラジル' } },
	'indonesia': { label: { 'ja': 'インドネシア' } },
	'india': { label: { 'ja': 'インド' } },
	'singapore': { label: { 'ja': 'シンガポール' } },
	'czech': { label: { 'ja': 'チェコ' } },
	'iceland': { label: { 'ja': 'アイスランド' } },
	'south-america': { label: { 'ja': '南米' } },
	'oversea': { label: { 'ja': '海外' } }
};

var clusterMaster = {
	'sagamihara-hospital': { label: { 'ja': '相模原中央病院クラスター' }, parentName: 'sagamihara' },
	'sagamihara-welfare': { label: { 'ja': '相模原福祉施設クラスター' }, parentName: 'sagamihara' },
	'tokyo-yakatabune': { label: { 'ja': '屋形船新年会クラスター' }, parentName: 'tokyo' },
	'wakayama-hospital': { label: { 'ja': '和歌山済生会有田病院クラスター' }, parentName: 'wakayama' },
	'nagoya-gym-a': { label: { 'ja': '名古屋スポーツジムAクラスター' }, parentName: 'nagoya' },
	'ichikawa-gym': { label: { 'ja': '市川スポーツジムクラスター' }, parentName: 'chiba' },
	'nagoya-gym-b': { label: { 'ja': '名古屋スポーツジムBクラスター' }, parentName: 'nagoya' },
	'kitami-exhibition': { label: { 'ja': '北見展示会クラスター' }, parentName: 'hokkaido' },
	'osaka-livehouse-a': { label: { 'ja': '大阪京橋ライブハウスArcクラスター' }, parentName: 'osaka' },
	'niigata-pingpong': { label: { 'ja': '新潟卓球スクールクラスター' }, parentName: 'niigata-city' },
	'nagoya-dayservice-a': { label: { 'ja': '名古屋高齢者デイサービスAクラスター' }, parentName: 'nagoya' },
	'sapporo-livebar': { label: { 'ja': '札幌中ライブバークラスター' }, parentName: 'sapporo' },
	'nagoya-dayservice-b': { label: { 'ja': '名古屋高齢者デイサービスBクラスター' }, parentName: 'nagoya' },
	'nagoya-dayservice-c': { label: { 'ja': '名古屋高齢者デイサービスCクラスター' }, parentName: 'nagoya' },
	'osaka-livehouse-b': { label: { 'ja': '大阪北区ライブハウスSoap Opera Classics Umedaクラスター' }, parentName: 'osaka' },
	'itami-daycare': { label: { 'ja': '伊丹市デイケア施設クラスター' }, parentName: 'hyogo' },
	'himeji-hospital': { label: { 'ja': '姫路仁恵病院クラスター' }, parentName: 'himeji' },
	'osaka-livehouse-c': { label: { 'ja': '大阪北区ライブハウスLIVE HOUSE Rumioクラスター' }, parentName: 'osaka' },
	'kobe-kindergarten': { label: { 'ja': '神戸こども園クラスター' }, parentName: 'kobe' },
	'osaka-livehouse-d': { label: { 'ja': '大阪中央区ライブハウスamericamura FANJ twiceクラスター' }, parentName: 'osaka' },
	'takarazuka-hospital': { label: { 'ja': '宝塚第一病院クラスター' }, parentName: 'hyogo' },
	'kobe-longterm-care': { label: { 'ja': '神戸介護保険通所事業所クラスター' }, parentName: 'kobe' },
	'oizumi-clinic': { label: { 'ja': '大泉町診療所クラスター' }, parentName: 'gunma' },
	'oita-hospital': { label: { 'ja': '大分医療センタークラスター' }, parentName: 'oita' },
	'nippon-cargo-airlines': { label: { 'ja': '日本貨物航空クラスター' }, parentName: 'chiba' },
	'gifu-chorus': { label: { 'ja': '岐阜合唱団クラスター' }, parentName: 'gifu' },
	'taito-hospital': { label: { 'ja': '台東区永寿総合病院クラスター' }, parentName: 'tokyo' },
	'tonosho-disabled': { label: { 'ja': '東庄町障害者福祉施設クラスター' }, parentName: 'chiba' },
	'kyoto-sangyo-univ': { label: { 'ja': '京都産業大学クラスター' }, parentName: 'kyoto-city' },
	'sendai-british-pub': { label: { 'ja': '仙台英国風パブクラスター' }, parentName: 'sendai' },
	'ide-networking-event': { label: { 'ja': '井手町交流会クラスター' }, parentName: 'kyoto' },
	'toride-hospital': { label: { 'ja': 'JAとりで総合医療センタークラスター' }, parentName: 'ibaraki' }
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
			var subgroups = [];
			var subgroupMap = {};

			self.children.forEach(function(item, index) {
				if (item.ref) {
					subgroupMap[subgroups.length] = index;
					subgroups.push(item.ref);
				}
			});

			Promise.all(subgroups.map(function(subgroup) {
				return loadData(path + '/' + subgroup);
			})).then(function(data) {
				data.forEach(function(item, index) {
					self.children[subgroupMap[index]] = item;
				})
				resolve(self);
			});
		}).catch(function(error) {
			reject(error);
		});
	});
};

var svg = d3.select('#network');
var svgElement = svg.node();
var inner = svg.append("g")
	.attr("class", "inner");

var zoom = d3.zoom()
	.on('zoom', function () {
		inner.attr('transform', d3.event.transform);
	});
svg.call(zoom);

var drag = function(simulation) {
	function dragstarted(d) {
	if (!d3.event.active) simulation.alphaTarget(0.3).restart();
		d.fx = d.x;
		d.fy = d.y;
	}

	function dragged(d) {
		d.fx = d3.event.x;
		d.fy = d3.event.y;
	}

	function dragended(d) {
		if (!d3.event.active) simulation.alphaTarget(0);
		d.fx = null;
		d.fy = null;
	}

	return d3.drag()
		.on("start", dragstarted)
		.on("drag", dragged)
		.on("end", dragended);
};

var ageText = function(age) {
	return age.replace(/(\d+)s/, '$1代').replace(/u(\d+)/, '$1歳未満');
};

var tooltip = d3.select('body').append('div')
	.attr('class', 'tooltip')
	.style('opacity', 0);

loadData('japan').then(function(patients) {

	console.log(d3.hierarchy(patients).leaves())

	var hierarchy = d3.hierarchy(patients);
	var nodeLookup = {};
	var groupLookup = {};
	var groups = [];
	var links = [];

	Object.keys(clusterMaster).forEach(function(key) {
		var group = groupLookup[key] = {
			name: key,
			label: clusterMaster[key].label.ja,
			type: 'cluster',
			level: 0,
			nodes: []
		};
		groups.push(group);
	});

	hierarchy.each(function(node) {
		nodeLookup[node.data.name] = node;
	});

	hierarchy.each(function(node) {
		var data = node.data;
		var name = data.name;
		var date = data.date;
		var cluster = data.cluster;
		var sources = data.sources || [];
		var ancestors = node.ancestors();
		var baseNode = ancestors[ancestors.length - (ancestors.length > 2 ? 2 : 1)];

		if (date) {
			patients.date = patients.date > date ? patients.date : date;
		}

		if (!data.prefix) {
			data.prefix = (baseNode.data.prefix || {}).ja || '';
		}

		var address = data.address || '';
		var age = data.age || '';
		var sex = data.sex || '';
		var attribute = data.attribute || '';
		var remarks = data.remarks || '';
		var supplement = data.supplement || '';
		var discharged = data.discharged || '';
		var severe = remarks.match(/重症/);
		var dead = remarks.match(/死亡/);
		var date = data.date;

		data.newness = (BASE_TIME - Date.parse(date)) / (BASE_TIME - Date.now());

		data.description = 'No: ' + baseNode.data.label.ja + data.pid + '例目' +
			'<br>居住地: ' + address +
			'<br>年代: ' + ageText(age) +
			'<br>性別: ' + dict[sex].ja +
			'<br>属性: ' + attribute +
			'<br>備考: ' + remarks +
			'<br>補足: ' + supplement +
			'<br>退院: ' + discharged +
			'<br>発表日: ' + data.date;

		// Add origin nodes
		sources.forEach(function(sourceName, i) {
			if (!nodeLookup[sourceName]) {
				var originBaseNode = cluster ?
					nodeLookup[clusterMaster[cluster].parentName].ancestors().slice(-2)[0] :
					baseNode;
				var originName = originBaseNode.data.name + '-' + sourceName;

				sources[i] = originName;
				if (!nodeLookup[originName]) {
					var origin = {
						name: originName,
						label: sourceMaster[sourceName].label.ja,
						type: 'origin',
					};

					originBaseNode.data.children.push(origin);
					nodeLookup[originName] = origin;
				}
			}
		});

		// Add links
		sources.forEach(function(sourceName, i) {
			links.push({
				source: sourceName,
				target: name
			});
		});

		// Add groups
		if (node.children && node.parent) {
			var group = groupLookup[name] = {
				name: name,
				label: data.label.ja,
				type: 'geo',
				level: 0,
				nodes: []
			};
			groups.push(group);
		}
	});

	document.getElementById('last-update').innerHTML = patients.date;

	var pack = d3.pack()
		.size([5000, 3000])
		.radius(function() { return NODE_RADIUS; })
		.padding(NODE_RADIUS);
	var nodes = pack(d3.hierarchy(patients)).leaves();

	nodes.forEach(function(node) {
		nodeLookup[node.data.name] = node;
	});

	// Traverse again to assign nodes to groups
	nodes.forEach(function(node) {
		var data = node.data;
		var cluster = data.cluster;

		if (cluster) {
			var parentNode = nodeLookup[clusterMaster[cluster].parentName];
			data.groups = [groupLookup[cluster]].concat(
				parentNode.ancestors().slice(0, -1).map(function(ancestor) {
					return groupLookup[ancestor.data.name];
				})
			);
		} else {
			data.groups = node.ancestors().slice(1, -1).map(function(ancestor) {
				return groupLookup[ancestor.data.name];
			});
		}

		data.groups.forEach(function(ancestor, level) {
			ancestor.level = Math.max(ancestor.level, level);
			ancestor.nodes.push(node);
		});

		data.baseNode = data.groups[data.groups.length - 1];
	});

	// Remove groups without nodes
	groups = groups.filter(function(d) {
		return d.nodes.length > 0;
	});

	var simulation = d3.forceSimulation(nodes)
		.force("x", d3.forceX(5000 / 2).strength(0.005))
		.force("y", d3.forceY(3000 / 2).strength(0.005))
		.force("cluster", forceCluster())
		.force("collide", forceCollide())
		.force("link", forceLink());

	var width = 5000;
	var height = 3000;

	svg.append("svg:defs").selectAll("marker").data(["end"])
		.enter().append("svg:marker")
			.attr("id", "end")
			.attr("viewBox", "0 -5 10 10")
			.attr("refX", 10)
			.attr("refY", 0)
			.attr("markerWidth", 5)
			.attr("markerHeight", 5)
			.attr("orient", "auto")
		.append("svg:path")
			.attr("d", "M0,-5L10,0L0,5")
			.attr("fill", "#999");

	var link = inner.selectAll('path.link').data(links)
		.enter().append("path")
			.attr("class", "link")
			.attr("marker-end", "url(#end)")
			.attr("visibility", function(d) {
				return d.hidden ? 'hidden' : 'visible';
			});

	var node = inner.selectAll("g.node").data(nodes)
		.enter().append("g")
		.attr('class', function(d) {
			return d.data.type === 'origin' ? 'node origin' : 'node';
		})
		.attr("visibility", function(d) {
			return d.hidden ? 'hidden' : 'visible';
		});

	node.transition()
		.delay(function(d, i) { return Math.random() * 500; })
		.duration(750)
		.attrTween("r", function(d) {
			var i = d3.interpolate(0, d.r);
			return function(t) { return d.r = i(t); };
		});

	var circles = node.append("circle")
		.attr("r", NODE_RADIUS)
		.attr("fill", function(d) {
			return d3.interpolateYlGnBu(d.data.newness);
		})
		.call(drag(simulation));

	node.append("text")
		.attr('class', 'node-prefix')
		.text(function(d) {
			return d.data.prefix;
		})
		.attr('y', -12)
		.attr('text-anchor', 'middle')
		.attr('fill', function(d) {
			return d.data.newness < 0.5 ? '#000' : '#fff'}
		);

	node.append("text")
		.attr('class', 'node-index')
		.text(function(d) {
			return d.data.pid;
		})
		.attr('y', 7)
		.attr('text-anchor', 'middle')
		.attr('fill', function(d) {
			return d.data.newness < 0.5 ? '#000' : '#fff'
		});

	node.append("text")
		.attr('class', 'node-source')
		.text(function(d) {
			return d.data.label;
		})
		.attr('y', 4)
		.attr('text-anchor', 'middle');

	var group = inner.selectAll("path.group").data(groups)
		.enter().insert("path", "path.link")
			.attr('class', function(d) {
				return d.type === 'cluster' ? 'group cluster-group' : 'group geo-group';
			})
			.style("stroke-width", function(d) {
				return 80 + d.level * 20;
			});

	var groupLabel = inner.selectAll("g.group-label").data(groups)
		.enter().append("g")
			.attr('class', 'group-label');

	groupLabel.append('text')
		.text(function(d) {
			return d.label;
		})
		.attr('font-size', function(d) {
			return (16 + d.nodes.length) + 'px';
		})
		.attr('stroke-width', function(d) {
			return (16 + d.nodes.length) / 6;
		})
		.attr('text-anchor', 'middle')
		.attr('stroke', '#aaa')
		.attr('fill', '#aaa');

	groupLabel.append('text')
		.text(function(d) {
			return d.label;
		})
		.attr('font-size', function(d) {
			return (16 + d.nodes.length) + 'px';
		})
		.attr('text-anchor', 'middle')
		.attr('fill', '#fff');

	svg.selectAll("circle.legend").data([0, 0.25, 0.5, 0.75, 1])
		.enter().append("circle")
			.attr('class', 'legend')
			.attr('cx', function(d, i) { return i * 22 + 20; })
			.attr('cy', 20)
			.attr('r', 10)
			.attr('fill', function(d) { return d3.interpolateYlGnBu(d); })
			.attr('stroke', '#fff')
			.attr('stroke-width', 2);

	svg.append("line")
			.attr('x1', 12)
			.attr('y1', 40)
			.attr('x2', 116)
			.attr('y2', 40)
			.attr('stroke', '#999')
			.attr('stroke-width', 2)
			.attr("marker-end", "url(#end)");

	svg.append("text")
			.text('右が最近の発生例')
			.attr('x', 64)
			.attr('y', 60)
			.attr('text-anchor', 'middle')
			.attr('font-size', '12px')
			.attr('fill', '#999');

	inner.selectAll('g.node')
		.on('mouseover', function(d) {
			var description = d.data.description;

			if (description) {
				tooltip.transition()
					.duration(200)
					.style('opacity', 0.9);
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

	simulation
		.on("tick", function() {
			link.attr('d', function(d) {
				var dx = d.target.x - d.source.x;
				var dy = d.target.y - d.source.y;
				var dist = Math.sqrt(dx * dx + dy * dy);
				var normX = dx / dist;
				var normY = dy / dist;
				var sourceX = d.source.x + NODE_RADIUS * normX;
				var sourceY = d.source.y + NODE_RADIUS * normY;
				var targetX = d.target.x - NODE_RADIUS * normX;
				var targetY = d.target.y - NODE_RADIUS * normY;

				return 'M' + sourceX + ',' + sourceY + 'L' + targetX + ',' + targetY;
			});

			node.attr("transform", function(d) {
				return "translate(" + d.x + "," + d.y + ")";
			});

			group.attr("d", function(d) {
				var nodes = d.nodes;

				while (nodes.length < 3) {
					nodes.push(nodes[0]);
				}
				return "M" +
					d3.polygonHull(nodes.map(function(e, i) { return [e.x + i * 1e-3, e.y] }))
					.join("L")
					+ "Z";
			});

			groupLabel.attr("transform", function(d) {
				var centroid = d.centroid || {x: 100000, y: 100000};
				return "translate(" + centroid.x + "," + centroid.y + ")";
			});
		});

	simulation.force("link")
		.links(links);

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

	resetHeight();
	redraw({
		transform: {
			k: Math.min(svgElement.clientWidth / (width + GRAPH_MARGIN * 2), 1)
		}
	});

	window.addEventListener('resize', redraw);

	// Dismiss the loading animation
	document.getElementById('loader').style.opacity = 0;
	setTimeout(function() {
		document.getElementById('loader').style.display = 'none';
	}, 1000);
}).catch(function(error) {
	document.getElementById('loader').style.display = 'none';
	document.getElementById('loading-error').innerHTML = 'Loading failed. Please reload the page.';
	document.getElementById('loading-error').style.display = 'block';
	throw error;
});

function centroid(nodes) {
	var x = 0;
	var y = 0;
	var z = 0;

	for (var d of nodes) {
		var k = d.r ** 2;
		x += d.x * k;
		y += d.y * k;
		z += k;
	}
	return {x: x / z, y: y / z};
}

function forceCluster() {
	var strength = 0.2;
	var nodes, groups;

	function force(alpha) {
		var l = alpha * strength;
		var i, j, node, group, level, c;

		Object.keys(groups).forEach(function(key) {
			group = groups[key];
			group.centroid = centroid(group.nodes);
		});

		for (i = 0; i < nodes.length; i++) {
			node = nodes[i];
			for (j = 0; j < node.data.groups.length; j++) {
				level = node.data.groups[j].level;
				c = node.data.groups[j].centroid;
				node.vx -= (node.x - c.x) * l * (3 - level);
				node.vy -= (node.y - c.y) * l * (3 - level);
			}
		}
	}

	force.initialize = function(data) {
		nodes = data;
		groups = {};
		nodes.forEach(function(node) {
			node.data.groups.forEach(function(ancestor) {
				groups[ancestor.name] = ancestor;
			});
		});
	};

	return force;
}

function forceCollide() {
	var alpha = 0.4; // fixed for greater rigidity!
	var padding1 = NODE_RADIUS; // separation between same-color nodes
	var padding2 = NODE_RADIUS * 3; // separation between different-color nodes
	var nodes;
	var maxRadius;

	function force() {
		var quadtree = d3.quadtree(nodes, function(d) { return d.x; }, function(d) { return d.y; });

		for (var d of nodes) {
			var r = d.r + maxRadius;
			var nx1 = d.x - r, ny1 = d.y - r;
			var nx2 = d.x + r, ny2 = d.y + r;

			quadtree.visit(function(q, x1, y1, x2, y2) {
				if (!q.length) {
					do {
						if (q.data !== d) {
							var r = d.r + q.data.r + (arraysEqual(d.data.groups, q.data.data.groups) ? padding1 : padding2);
							var x = d.x - q.data.x, y = d.y - q.data.y, l = Math.hypot(x, y);

							if (l < r) {
								l = (l - r) / l * alpha;
								d.x -= x *= l, d.y -= y *= l;
								q.data.x += x, q.data.y += y;
							}
						}
					} while (q = q.next);
				}
				return x1 > nx2 || x2 < nx1 || y1 > ny2 || y2 < ny1;
			});
		}
	}

	force.initialize = _ => maxRadius = d3.max(nodes = _, d => d.r) + Math.max(padding1, padding2);

	return force;
}

function forceLink() {
	var force = d3.forceLink();
	var defaultLinkStrength = force.strength();

	force.id(function(d) {
		return d.data.name;
	});

	force.strength(function(d) {
		return d.source.data.baseNode !== d.target.data.baseNode ? 0 : defaultLinkStrength(d);
	});

	return force;
}

function arraysEqual(a, b) {
	if (a === b) {
		return true;
	}
	if (a == null || b == null) {
		return false;
	}
	if (a.length != b.length) {
		return false;
	}
	for (var i = 0; i < a.length; i++) {
		if (a[i] !== b[i]) {
			return false;
		}
	}
	return true;
}
