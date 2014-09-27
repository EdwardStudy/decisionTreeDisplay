define([
    'd3'
], function()
{
    'use strict';
    angular.module('d3.factory', []).factory('BarChart', function() {

        function BarChart(data, el) {
            this.data = data;
            this.el = el;
        }

        BarChart.prototype.render = function() {
            this.el.innerHTML = '';

            var margin = {top: 10, right: 10, bottom: 20, left: 30},
                height = this.el.parentElement.clientHeight - margin.top - margin.bottom,
                width = this.el.parentElement.clientWidth - margin.left - margin.right;

            var svg = d3.select(this.el).append('svg')
                .attr('height', height + margin.top + margin.bottom)
                .attr('widht', width + margin.left + margin.right)
                .append('g')
                .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

            var xscale = d3.scale.ordinal()
                .domain(this.data.map(function(d) { return d.x; }))
                .rangeRoundBands([0, width], .1);

            var yscale = d3.scale.linear()
                .domain([0, 20])
                .range([height, 0]);

            var xaxis = d3.svg.axis().scale(xscale).orient('bottom'),
                yaxis = d3.svg.axis().scale(yscale).orient('left');

            svg.append('g')
                .attr('class', 'x axis')
                .attr('transform', 'translate(0,' + height + ')')
                .call(xaxis);

            svg.append('g')
                .attr('class', 'y axis')
                .call(yaxis);

            svg.selectAll('.bar')
                .data(this.data)
                .enter().append('rect')
                .attr('class', 'bar')
                .attr('x', function(d) { return xscale(d.x); })
                .attr('width', xscale.rangeBand())
                .attr('y', function(d) { return yscale(d.y); })
                .attr('height', function(d) { return height - yscale(d.y); });
        };

        return BarChart
    }).factory('LineChart', function() {

        function LineChart(data, el) {
            this.data = data;
            this.el = el;
        }

        LineChart.prototype.render = function() {
            this.el.innerHTML = '';

            var margin = {top: 10, right: 10, bottom: 20, left: 30},
                height = this.el.parentElement.clientHeight - margin.top - margin.bottom,
                width = this.el.parentElement.clientWidth - margin.left - margin.right;

            var svg = d3.select(this.el).append('svg')
                .attr('height', height + margin.top + margin.bottom)
                .attr('widht', width + margin.left + margin.right)
                .append('g')
                .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

            var xscale = d3.scale.linear().domain([1, 10]).range([0, width]),
                yscale = d3.scale.linear().domain([0, 20]).range([height, 0]);

            var xaxis = d3.svg.axis().scale(xscale).orient('bottom'),
                yaxis = d3.svg.axis().scale(yscale).orient('left');

            var line = d3.svg.line()
                .x(function(d) { return xscale(d.x); })
                .y(function(d) { return yscale(d.y); });

            svg.append('g')
                .attr('class', 'x axis')
                .attr('transform', 'translate(0,' + height + ')')
                .call(xaxis);

            svg.append('g')
                .attr('class', 'y axis')
                .call(yaxis);

            svg.append('path')
                .datum(this.data)
                .attr('class', 'line')
                .attr('d', line);
        };

        return LineChart;
    }).factory('Map', function() {

        function Map(data, el) {
            this.data = data;
            this.el = el;
        }

        Map.prototype.render = function() {
            this.el.innerHTML = '';

            var height = this.el.parentElement.clientHeight,
                width = this.el.parentElement.clientWidth;

            var svg = d3.select(this.el).append('svg')
                .attr('height', height)
                .attr('widht', width);

            var projection = d3.geo.albersUsa()
                .scale(width - (height / 2))
                .translate([width/2, height/2]);

            var path = d3.geo.path().projection(projection);

            svg.append("path")
                .datum(topojson.feature(this.data, this.data.objects.land))
                .attr("d", path)
                .attr("class", "land-boundary");

            svg.append("path")
                .datum(topojson.mesh(this.data, this.data.objects.states, function(a, b) {
                    return a !== b;
                }))
                .attr("d", path)
                .attr("class", "state-boundary");
        };

        return Map;
    }).factory('PieChart', function() {

        function PieChart(data, el) {
            this.data = data;
            this.el = el;
        }

        PieChart.prototype.render = function() {
            this.el.innerHTML = '';

            var height = this.el.parentElement.clientHeight,
                width = this.el.parentElement.clientWidth,
                radius = Math.min(width, height) / 2;

            var svg = d3.select(this.el).append('svg')
                .attr('height', height)
                .attr('widht', width)
                .append('g')
                .attr('transform', 'translate(' + width/2 + ',' + height/2 + ')');

            var color = d3.scale.ordinal()
                .range(['#e0f3db', '#a8ddb5', '#43a2ca']);

            var arc = d3.svg.arc()
                .outerRadius(radius - 10)
                .innerRadius(radius / 2);

            var pie = d3.layout.pie()
                .sort(null)
                .value(function(d) { return d.votes; });

            var g = svg.selectAll('.arc')
                .data(pie(this.data))
                .enter().append('g')
                .attr('class', 'arc');

            g.append('path')
                .attr('d', arc)
                .style('fill', function(d) { return color(d.data.pet); });

            g.append('text')
                .attr('transform', function(d) { return 'translate(' + arc.centroid(d) + ')'; })
                .attr('dy', '.35em')
                .style('text-anchor', 'middle')
                .text(function(d) { return d.data.pet; });
        };

        return PieChart;
    });
});

