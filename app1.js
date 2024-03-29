  var data_csv;
  async function loadData() {
   
    try {
       data_csv = await d3.csv("population.csv");
      // for year dropdown
      const year = Array.from(new Set(data_csv.map(d => d.Year)));
     
        loadYear(year)
//for scatter plot
const filteredData = data_csv.filter(obj => obj.Year === '1950');

filteredData_arr=[]
filteredData.forEach(element => {
    filteredData_arr.push({'Country':element.Country,'Year':parseInt(element.Year),'Population':parseInt(element.Population),
'Population_Density':parseInt(element.Population_Density),'Population_Growth_Rate':Number(element.Population_Growth_Rate).toFixed(2)})
  });
  console.log(filteredData)
  //load scatter plot
  loadScatterPlot(filteredData_arr)

  
  
     let arr_remove_comma=[]
     data_csv.forEach(element => {
        arr_remove_comma.push({'Year':parseInt(element.Year),'Population':parseInt(element.Population.replace(/\,/g,'')),
    'Population_Density':parseInt(element.Population_Density),'Population_Growth_Rate':parseInt(element.Population_Growth_Rate)})
      });
  //data for area chart
  const result = d3.rollups(
    arr_remove_comma,
        group => d3.sum(group, d =>{
             return (d.Population)}),
        d => d.Year
      );
      arr=[]
      result.forEach(element => {
        arr.push({'Year':parseInt(element[0]),'Population':element[1]})
      });
     // console.log(result)
   
//load area chart
    loadAreaChart(arr)
    } catch(error) {
      // code to execute if there's an error loading the data
    }
  }
function loadAreaChart(arr){
   
      const margin = { top: 20, right: 30, bottom: 30, left: 40 };
      const width = 300 - margin.left - margin.right;
      const height = 200 - margin.top - margin.bottom;
      
      // Create x and y scales
      const x = d3.scaleLinear()
        .domain(d3.extent(arr, d => d.Year))
        .range([0, width]);
      const y = d3.scaleLinear()
        .domain([20000,d3.max(arr, d => d.Population)])
        .range([height, 0]);
      
      // Create an SVG element and append a group element for the chart
      const svg = d3.select("#chart").append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", `translate(${margin.left},${margin.top})`);
      
      // Create a line function
      const line = d3.line()
        .x(d => x(d.Year))
        .y(d => y(d.Population));
      
        svg.append("path")
        .datum(arr)
        .attr("fill", "#eef04d")
        .attr("fill-opacity", .3)
        .attr("stroke", "none")
        .attr("d", d3.area()
          .x(function(d) { return x(d.Year) })
          .y0( height )
          .y1(function(d) { return y(d.Population) })
          )

      // Append a path element
      svg.append("path")
        .datum(arr)
        .attr("fill", "none")
        .attr("stroke", "#eef04d")
        .attr("stroke-width", 2)
        .attr("d", line);
      
      // Append x and y axes
      const xaxisGrp = svg.append("g")
        .attr("transform", `translate(0,${height})`)
        .call(d3.axisBottom(x))
       
      

      svg.append("g")
       // .call(d3.axisLeft(y))
     
      
}
  function loadScatterPlot(data){
   // console.log(data)
// set the dimensions and margins of the graph
        const margin = { top: 20, right: 20, bottom: 60, left: 60 };
        const width = 600 - margin.left - margin.right;
        const height = 400 - margin.top - margin.bottom;

        // create the svg element and append it to the DOM
        const svg = d3.select("#chart_scatter").append("svg")
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
        .append("g")
            .attr("transform",
                "translate(" + margin.left + "," + margin.top + ")");

        // set the scales for the x and y axes
        const x = d3.scaleLinear()
            .domain([0, d3.max(data, d => d.Population_Density)])
            .range([0, width]);

        const y = d3.scaleLinear()
            .domain([-100, 100])
            .range([height, 0]);

        // set the scale for the bubble size
        const r = d3.scaleLinear()
            .domain([0, d3.max(data, d => d.Population)])
            .range([5, 20]);

        // add the x and y axes to the svg element
        const xaxisGrp = svg.append("g")
            .attr("transform", "translate(0," + height + ")")
            .call(d3.axisBottom(x));

        const yAxisGroup =  svg.append("g")
            .call(d3.axisLeft(y));

            yAxisGroup.append('text')
            .attr('x', -height/2)
            .attr('y', -20)
            .attr('fill', 'black')
            .html('Population growth (%)')
            .style('transform', 'rotate(270deg)')
            .style('text-anchor', 'middle')
            .attr("class",'axis')

            xaxisGrp.append('text')
            
            .attr("text-anchor", "middle")
            .attr("x", width/2)
            .attr("y", 30)
            .text('Population density')
            .attr("class",'axis')
            .attr('fill','black');

           

        // add the bubbles to the svg element
        svg.selectAll("circle")
            .data(data)
            .enter()
            .append("circle")
            .attr("cx", d => x(d.Population_Density))
            .attr("cy", d => y(d.Population_Growth_Rate*100))
            .attr("r", d => r(d.Population))
            .style("fill", "blue")
            .style("opacity", 0.5)
            .on('mouseover', function(event,d) {
               
              tooltip.html(`<b>${d.Country} (${d.Year}):</b><br>
                          Population Density: ${d.Population_Density}<br>
                          Population Growth Rate: ${(d.Population_Growth_Rate*100).toFixed(2)}%`)
              .style('visibility', 'visible');
            })
            .on('mousemove', function(event) {
                console.log(event)
              tooltip.style('top', `${event.pageY - 10}px`)
                     .style('left', `${event.pageX + 10}px`);
            })
            .on('mouseout', function() {
              d3.select(this).attr('r', 5);
              tooltip.style('visibility', 'hidden');
            });
          
          const tooltip = d3.select('body')
            .append('div')
            .attr('class', 'tooltip')
            .style('position', 'absolute')
            .style('z-index', '10')
            .style('visibility', 'hidden');

         
   
  }

  function loadYear(year){
            const dropdown = document.getElementById("year-dropdown");

            year.forEach(year => {
            const option = document.createElement("option");
            option.text = "Year: "+year;
            option.value = year;
            dropdown.add(option);
        });

        dropdown.addEventListener("change", function() {
            const selectedYear = dropdown.value;
            console.log(`Selected country: ${selectedYear}`);
            // Do something with the selected country
            const myDiv = document.getElementById("chart_scatter");
        myDiv.innerHTML = "";
        const filteredData = data_csv.filter(obj => obj.Year === selectedYear);

        filteredData_arr=[]
        filteredData.forEach(element => {
            filteredData_arr.push({'Country':element.Country,'Year':parseInt(element.Year),'Population':parseInt(element.Population),
        'Population_Density':parseInt(element.Population_Density),'Population_Growth_Rate':Number(element.Population_Growth_Rate).toFixed(2)})
          });
        loadScatterPlot(filteredData_arr)
        });
  }
  loadData();

  	// Call the function on page load
      window.onload = hideOnMobile;
		
      // Call the function on window resize
      window.onresize = hideOnMobile;

      function hideOnMobile() {
        console.log(screen.width)
        let  myDiv_chart = document.getElementById("growth_box");
        let myDiv = document.getElementById("container_year");
        let my_div_box = document.getElementById("areaChart");
        if (screen.width < 700) {
            
            myDiv_chart.style.display = "none";
            myDiv.style.justifyContent = "center";
            myDiv.style.alignItems = "center";
            my_div_box.style.justifyContent = "center";

        }
        else{
          
            myDiv_chart.style.display = "block";
            myDiv.style.paddingLeft = "10px";
            myDiv.style.alignItems = "center"
            myDiv.style.justifyContent = "flex-start"
            my_div_box.style.justifyContent = "flex-start";
        }
    }



