function getInfo(id) {
    d3.json("samples.json").then((data)=> {
        var metadata = data.metadata;
        var result = metadata.filter(meta => meta.id.toString() === id)[0];
        var demographicInfo = d3.select("#sample-metadata");
        demographicInfo.html("");
        Object.entries(result).forEach((key) => {
        demographicInfo.append("h5").text(key[0].toUpperCase() + ": " + key[1] + "\n");
        });
        gaugeBonus(result.wfreq);
    });
}

function getPlot(id) {
    d3.json("samples.json").then((data)=> {
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
function gaugeBonus(wfreq) {
    var level = parseFloat(wfreq)*20;
    var degrees = 180 - level;
    var radius = 0.5;
    var radians = (degrees * Math.PI) / 180;
    var x = radius * Math.cos(radians);
    var y = radius * Math.sin(radians);

    var path = "M -.0 -0.05 L .0 0.05 L ";
    var pathx = String(x);
    var space = " ";
    var pathy = String(y);
    var pathEnd = " Z";
    var path = path.concat(pathx, space, pathy, pathEnd);

    var data = [
        {
          type: "scatter",
          x: [0],
          y: [0],
          marker: { size: 12, color: "850000" },
          showlegend: false,
          name: "Freq",
          text: level,
          hoverinfo: "text+name"
        },
        {
          values: [50 / 9, 50 / 9, 50 / 9, 50 / 9, 50 / 9, 50 / 9, 50 / 9, 50 / 9, 50 / 9, 50],
          rotation: 90,
          text: ["8-9", "7-8", "6-7", "5-6", "4-5", "3-4", "2-3", "1-2", "0-1", ""],
          textinfo: "text",
          textposition: "inside",
          marker: {
            colors: [
              "rgba(0, 105, 11, .5)",
              "rgba(10, 120, 22, .5)",
              "rgba(14, 127, 0, .5)",
              "rgba(110, 154, 22, .5)",
              "rgba(170, 202, 42, .5)",
              "rgba(202, 209, 95, .5)",
              "rgba(210, 206, 145, .5)",
              "rgba(232, 226, 202, .5)",
              "rgba(240, 230, 215, .5)",
              "rgba(255, 255, 255, 0)"
            ]
          },
          labels: ["8-9", "7-8", "6-7", "5-6", "4-5", "3-4", "2-3", "1-2", "0-1", ""],
          hoverinfo: "label",
          hole: 0.5,
          type: "pie",
          showlegend: false
        }
    ];
    var layout = {
        shapes: [
          {
            type: "path",
            path: path,
            fillcolor: "850000",
            line: {
              color: "850000"
            }
          }
        ],
        title: "<b>Belly Button Washing Frequency</b> <br> Scrubs per Week",
        height: 500,
        width: 500,
        xaxis: {
          zeroline: false,
          showticklabels: false,
          showgrid: false,
          range: [-1, 1]
        },
        yaxis: {
          zeroline: false,
          showticklabels: false,
          showgrid: false,
          range: [-1, 1]
        }
      };
    var GAUGE = document.getElementById("gauge");
    console.log("Is this running");
    console.log
    Plotly.newPlot(GAUGE, data, layout);
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
function optionChanged(newid) {
    getInfo(newid);
    getPlot(newid);
}

init();