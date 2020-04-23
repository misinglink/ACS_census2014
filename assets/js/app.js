const margin = { top: 50, right: 50, bottom: 50, left: 50 },
   svgWidth = 800,
   svgHeight = 500,
   chartWidth = svgWidth - margin.left - margin.right,
   chartHeight = svgHeight - margin.top - margin.bottom;;

const svg = d3.select('#plot_area').append("svg")
    .attr("width", svgWidth)
    .attr("height", svgHeight)

let chartGroup = svg.append("g")
            .attr("transform",  `translate(${margin.left}, ${margin.top})`)

// y selections: obesity, Smokes, Lacks Healthcare
let yCurrentSelection = 'obesity'

//x selections: poverty, age
let xCurrentSelection = 'poverty'

d3.csv('assets/data/data.csv').then( data => {
console.log(data)
    let xScale = d3.scaleLinear()
                .domain([0, d3.max(data.map(d => parseFloat(d.healthcare)))])
                .range([0, chartWidth])

    let yScale = d3.scaleLinear()
        .domain([d3.min(data.map(d => parseFloat(d.healthcare))), d3.max(data.map(d => parseFloat(d.healthcare)))])
        .range([chartHeight, 0])
    // create axes
    let yAxis = d3.axisLeft(yScale),
        xAxis = d3.axisBottom(xScale)

    //set x axis to the bottom of chart 
    chartGroup.append('g')
        .attr("transform", `translate(0, ${chartHeight})`)
        .call(xAxis)

    //set y axis
    chartGroup.append('g').call(yAxis)

    svg.append('g')
        .selectAll("dot")
        .data(data)
        .enter()
            .append('circle')
            .attr('cx', d => xScale(parseFloat(d.healthcare)))
            .attr('cy', d => yScale(parseFloat(d.poverty)))
            .attr('r', d => d.income / 5000)
            .style('fill', 'gray')
            .style('opacity', .3)
            .attr('stroke', 'black')
            .attr('stroke-width', 2)
            

    svg.append('g')
    .selectAll("text")
        .data(data)
        .enter()
        .append("text")
        .attr('font-size', 12)
        .attr("font-fmaily", "Saira")
        .attr('stroke-width', 1)
        .text((d) => d.abbr)
        .attr("x", d => xScale(parseFloat(d.healthcare)) - 8 )
        .attr("y", d => yScale(parseFloat(d.poverty)) + 4 )
        .attr('fill', 'white')
    
})