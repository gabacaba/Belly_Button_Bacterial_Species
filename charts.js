function init() {
  // Grab a reference to the dropdown select element
  var selector = d3.select("#selDataset");

  // Use the list of sample names to populate the select options
  d3.json("samples.json").then((data) => {
    var sampleNames = data.names;

    sampleNames.forEach((sample) => {
      selector
        .append("option")
        .text(sample)
        .property("value", sample);
    });

    // Use the first sample from the list to build the initial plots
    var firstSample = sampleNames[0];
    buildCharts(firstSample);
    buildMetadata(firstSample);
  });
}

// Initialize the dashboard
init();

function optionChanged(newSample) {
  // Fetch new data each time a new sample is selected
  buildMetadata(newSample);
  buildCharts(newSample);
  
}

// Demographics Panel 
function buildMetadata(sample) {
    d3.json("samples.json").then((data) => {
      var metadata = data.metadata;
      var resultArray = metadata.filter(sampleObj => sampleObj.id == sample);
      var result = resultArray[0];
      var PANEL = d3.select("#sample-metadata");
  
      PANEL.html("");
      PANEL.append("h6").text('ID '+result.id);
      PANEL.append("h6").text('ETHNICITY '+result.ethnicity);
      PANEL.append("h6").text('GENDER ' + result.gender);
      PANEL.append("h6").text('AGE ' + result.age);
      PANEL.append("h6").text('LOCATION ' + result.location);
      PANEL.append("h6").text('BELLY BUTTON TYPE ' + result.bbtype);
      PANEL.append("h6").text('WASHING FREQ ' + result.wfreq);

    });
  }


  // 1. Create the buildCharts function.
function buildCharts(sample) {
  // 2. Use d3.json to load and retrieve the samples.json file 
  d3.json("samples.json").then((data) => {
    // 3. Create a variable that holds the samples array.
    var samplesArray = data.samples;

    // 4. Create a variable that filters the samples for the object with the desired sample number.
    var selectedIdSamples = samplesArray.filter(data => data.id == sample);
    //  5. Create a variable that holds the first sample in the array.
    var firstSample = selectedIdSamples[0];

    // 6. Create variables that hold the otu_ids, otu_labels, and sample_values.
    var otuIds = firstSample.otu_ids;
    var otuLabels = firstSample.otu_labels;
    var sampleValues = firstSample.sample_values;

    // 7. Create the yticks for the bar chart.
    // Hint: Get the the top 10 otu_ids and map them in descending order  
    //  so the otu_ids with the most bacteria are last. 

    var yticks = otuIds.slice(0,10).map(id => "OTU " + id).reverse();
    

    // 8. Create the trace for the bar chart. 
    var barData = [{
      x: sampleValues.slice(0,10).reverse(),
      text: otuLabels.slice(0,10).reverse(),
      type: "bar"
    }];
    // 9. Create the layout for the bar chart. 
    var barLayout = {
      title: "<b>Top 10 Bacterial Species found <br> in your Belly Button </b>",
      yaxis: {
        tickmode: "array",
        tickvals: [0,1,2,3,4,5,6,7,8,9],
        ticktext: yticks
      },
      annotations: [{
        xref: 'paper',
        yref: 'paper',
        x: 0.5,
        xanchor: 'center',
        y: -0.25,
        yanchor: 'center',
        text: 'X Axis: number of samples found <br> Y Axis: OTU or Operatinal Taxonomic Unit of the bacterial species ',
        showarrow: false
      }]
    };
    // 10. Use Plotly to plot the data with the layout. 
    Plotly.newPlot("bar", barData, barLayout, {responsive: true});

    // 1. Create the trace for the bubble chart.
    var bubbleData = [{
      x: otuIds,
      y: sampleValues,
      text: otuLabels,
      mode: 'markers',
      marker: {
        size: sampleValues,
        color: otuIds,
        colorscale: "RdBu"
      }
    }];

    // 2. Create the layout for the bubble chart.
    var bubbleLayout = {
      title: "<b>All Bacterial Species Found</b>",
      showlegend: false,
      xaxis: {title: "OTU ID", automargin: true},
      yaxis: {automargin: true},
      //margin: { t: 50, r: 50, l: 50, b: 50 },
      hovermode: "closest"
    };

    // 3. Use Plotly to plot the data with the layout.
    Plotly.newPlot("bubble", bubbleData, bubbleLayout, {responsive: true});
    
    // 1. Create a variable that filters the metadata array for the object with the desired sample number.
    var metadata_SampleId = data.metadata.filter(data => data.id == sample);
    console.log(metadata_SampleId);  

    // 3. Create a variable that holds the washing frequency.
    var washFreq = +metadata_SampleId[0].wfreq;

    // 4. Create the trace for the gauge chart.
    var gaugeData = [{
        domain: { x: [0, 1], y: [0, 1] },
        value: washFreq,
        title: { text: "<b>Belly Button Washing Frequency</b><br>Scrubs per week"},
        type: "indicator",
        mode: "gauge+number",
        gauge: {
          axis: {
            range: [null, 10],
            tickmode: "array",
            tickvals: [0,2,4,6,8,10],
            ticktext: [0,2,4,6,8,10]
          },
          bar: {color: "black"},
          steps: [
            { range: [0, 2], color: "rgb(215,48,39)" },
            { range: [2, 4], color: "rgb(253,174,97)" },
            { range: [4, 6], color: "rgb(224,243,248)" },
            { range: [6, 8], color: "rgb(116,173,209)" },
            { range: [8, 10], color: "rgb(49,54,149)" }]
        }}];
    
    // 5. Create the layout for the gauge chart.
    var gaugeLayout = { 
      autosize: true,
      annotations: [{
        xref: 'paper',
        yref: 'paper',
        x: 0.5,
        xanchor: 'center',
        y: 0,
        yanchor: 'center',
        text: "The gauge displays belly button weekly washing frequency",
        showarrow: false
      }]};

    // 6. Use Plotly to plot the gauge data and layout.
    Plotly.newPlot("gauge", gaugeData, gaugeLayout, {responsive: true});


  });
}
