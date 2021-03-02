
var samplesdata = "../data/samples.json"

function buildMetadata(sample) {
	d3.json(samplesdata).then((data) => {
	  
	  var metadata = data.metadata;

	  var resultingarray = metadata.filter(sampleObj => sampleObj.id == sample);
	  var results = resultingarray[0];
	  
	  
	  mdpanel.html("");

	  Object.entries(results).forEach(([key, value]) => {
		mdpanel.append("h6").text(`${key.toUpperCase()}: ${value}`);
	  });
	  
	});
  }
  
  function buildCharts(sample) {
	d3.json(samplesdata).then((data) => {
	  var samples = data.samples;
	  var resultingarray = samples.filter(sampleObj => sampleObj.id == sample);
	  var results = resultingarray[0];
  
	  var id = results.otu_ids;
	  var labels = results.otu_labels;
	  var sample_values = results.sample_values;
  
	  var bubbleLt = {
		margin: { t: 25},
		hovermode: "closest",
		xaxis: { title: "ID" },	
		yaxis: {title: "Bacteria values"}
	  };

	  var bubblePlot = [
		{
		  x: id,
		  y: sample_values,
		  text: labels,
		  mode: "markers",
		  marker: {
			size: sample_values,
			color: id,
			colorscale: "Electric"
		  }
		}
	  ];
  
	  Plotly.newPlot("bubble", bubblePlot, bubbleLt);
  
	  var barLt = {
		title: "Top 10 OTUS",
		margin: { t: 30, l: 150 }
	  };

	  var barPlot= [
		{
		  y: id.slice(0, 10).map(otuID => `OTU ${otuID}`).reverse(),
		  x: sample_values.slice(0, 10).reverse(),
		  text: labels.slice(0, 10).reverse(),
		  type: "bar",
		  orientation: "h",
		  marker:{
			  color: 'rgb(175,122,197)',
			  opacity: 0.8,
			  line:{
				color: 'rgb(174,214,241)',
				width: 1,
			  }
		  }
		}
	  ];
  
	  Plotly.newPlot("bar", barPlot, barLt);
	});
  }
  
  function init() {
	
	mdpanel = d3.select("#sample-metadata");
	var select = d3.select("#selDataset");
  
	d3.json(samplesdata).then((data) => {
	  var names = data.names;
  
	  names.forEach((sample) => {
		select.append("option").text(sample).property("value", sample);
	  });
  
	  var initial = names[0];
	  buildCharts(initial);
	  buildMetadata(initial);
	});
  }
  
  function optionChanged(restart) {
	buildCharts(restart);
	buildMetadata(restart);
  }

  init();
  