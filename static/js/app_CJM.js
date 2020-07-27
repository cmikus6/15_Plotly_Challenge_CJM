function getInfo(id) {
    d3.json("samples.json").then((data)=> {
        var metadata = data.metadata;
        var result = metadata.filter(meta => meta.id.toString() === id)[0];
        var demographicInfo = d3.select("#sample-metadata");
        demographicInfo.html("");
        Object.entries(result).forEach((key) => {
        demographicInfo.append("h5").text(key[0].toUpperCase() + ": " + key[1] + "\n");
        });
    });
}

function getPlot(id) {
    d3.json("samples.json").then((data)=> {
    var wfreq = data.metadata.map(d => d.wfreq)
    var samples = data.samples.filter(s => s.id.toString() === id)[0];
    var samplevalues = samples.sample_values.slice(0, 10).reverse();
    var OTU_top = (samples.otu_ids.slice(0, 10)).reverse();
    var OTU_id = OTU_top.map(d => "OTU " + d);
    var labels = samples.otu_labels.slice(0, 10);
    var trace = {
        x: samplevalues,
        y: OTU_id,
        text: labels,
        marker: {
        color: '#2E64FE'},
        type:"bar",
        orientation: "h",
    };
// create data variable
var data = [trace];
var layout = {
    title: "Top 10 OTU",
    yaxis:{
        tickmode:"linear",
    },
    margin: {
        l: 100,
        r: 100,
        t: 100,
        b: 30
    }
};
Plotly.newPlot("bar", data, layout);

// The bubble chart
var trace_b = {
    x: samples.otu_ids,
    y: samples.sample_values,
    mode: "markers",
    marker: {
        size: samples.sample_values,
        color: samples.otu_ids
    },
    text: samples.otu_labels
};
var layout_b = {
    xaxis:{title: "OTU ID"},
    height: 400,
    width: 800
};
var data_b = [trace_b];
Plotly.newPlot("bubble", data_b, layout_b);


});
}

// The guage chart
// var data_g = [{
//     domain: { x: [0, 1], y: [0, 1] },
//     value: parseFloat(wfreq),
//     title: { text: `Weekly Washing Frequency ` },
//     type: "indicator",
//     mode: "gauge+number",
//     gauge: { axis: { range: [null, 9] },
//         steps: [
//         { range: [0, 2], color: "#A9D0F5" },
//         { range: [2, 4], color: "#2E64FE" },
//         { range: [4, 6], color: "#0000FF" },
//         { range: [6, 8], color: "#0404B4" },
//         { range: [8, 9], color: "#0B0B3B" },
//         ]}
// }];
// console.log(data_g);
// var layout_g = {
//     width: 800,
//     height: 650,
//     margin: { t: 20, b: 40, l:100, r:100 }
// };
// Plotly.newPlot("gauge", data_g, layout_g);

function optionChanged(newid) {
    getInfo(newid);
    getPlot(newid); 
}
function init() {
    var dropdown = d3.select("#selDataset");
    d3.json("samples.json").then((data)=> {
        data.names.forEach(function(name) {
            dropdown.append("option").text(name).property("value");
        });
    getInfo(data.names[0]);
    getPlot(data.names[0]);
    });
    
}
init();