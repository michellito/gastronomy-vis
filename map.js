var radius = 3;

var feature,
    svg,
    map;

d3.json("data/data.json", function(error, data) {
    addLmaps();
    draw(data);
});


function addLmaps(){
    map = L.map('map').setView([32.253460,-110.911789], 14.5);
    tileURL = 'https://api.mapbox.com/styles/v1/michellito/ckn8ej6bk0f5017pbo1rg0d3c/tiles/256/{z}/{x}/{y}?access_token=pk.eyJ1IjoibWljaGVsbGl0byIsImEiOiJja244YnR3aWYwN3ljMm5waWZpMHBlOXdmIn0.kqDL2Srx2HSgNODDENNJfg'

    L.tileLayer(tileURL, {
        // attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="http://mapbox.com">Mapbox</a>',
        maxZoom: 15,
    }).addTo(map);

    L.svg({clickable:true}).addTo(map)
};


function draw(data){
    svg = d3.select("#map").select("svg").attr("pointer-events", "auto");
    
    var filter = d3.select('svg').append('filter').attr('id','drop-shadow').attr('x','-40%').attr('y','-40%').attr('height','200%').attr('width','200%');
    filter.append('feOffset').attr('result','offOut').attr('in','SourceAlpha').attr('dx',1).attr('dy',4);
    filter.append('feGaussianBlur').attr('result','blurOut').attr('in',"offOut").attr('stdDeviation',1);
    filter.append('feBlend').attr('in','SourceGraphic').attr('in2','blurOut').attr('mode','normal')

    data.forEach(function(d){

        if (d.coordinates && d.coordinates.latitude && d.coordinates.longitude) {
            d.latlng = new L.LatLng(d.coordinates.latitude, d.coordinates.longitude);
        }
    })

    feature = svg.append('g').attr('class',"f").selectAll('circle')
        .data(data)
        .enter()
        .append('circle')
        .style('opacity',.8)
        .style('fill',function(d){
            var x = d3.scaleLinear().domain([1,5]).range([1,0]);
            return d3.interpolateViridis(x(d.rating))
        })  
        .attr('r',radius)
        .on("mouseover", handleMouseOver)
        .on("mouseout", handleMouseOut)



    var myZoom = {
        start:  map.getZoom(),
        end: map.getZoom()
    };

    map.on('zoomstart', function(e) {

        myZoom.start = map.getZoom();
    });

    map.on('zoomend', function(e) {
        myZoom.end = map.getZoom();
        var diff = myZoom.start - myZoom.end;
        if (diff > 0) {
            radius = radius /1.2 ;
            svg.select('.f').selectAll('circle').attr('r',radius)
            // circle.setRadius(circle.getRadius() * 2);
        } else if (diff < 0) {
            radius = radius *1.2 ;
            svg.select('.f').selectAll('circle').attr('r',radius)
            // circle.setRadius(circle.getRadius() / 2);
        }
    });

    map.on("viewreset moveend", reset);
    reset();
}

function handleMouseOver(d,i){
    d3.select(this)
        .transition()
        .ease(d3.easeLinear)
        .duration(100)
        .attr('r',radius*4)
        .style("filter", "url(#drop-shadow)")

    svg.append("text")
        .attr('x',function(){ return d.x + 20})
        .attr('y',function(){ return d.y + 5 })
        .text(function(){ return d.name})
}

function handleMouseOut(d,i){

    d3.select(this)
        .transition()
        .ease(d3.easeLinear)
        .duration(300)
        .attr('r',radius)
        .style("filter",function() { return null; })

    svg.selectAll("text")
        .attr('opacity',.9)
        .transition()
        .ease(d3.easeLinear)
        .duration(100)
        .attr('opacity',0)
        .remove()
        
}

function reset(){
    feature.attr('transform',function(d){
        d.x = map.latLngToLayerPoint(d.latlng).x;
        d.y = map.latLngToLayerPoint(d.latlng).y;
        return 'translate('+ map.latLngToLayerPoint(d.latlng).x +","+ map.latLngToLayerPoint(d.latlng).y +")";
    })
    console.log("rest")
}