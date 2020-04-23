const margin = { top: 50, right: 50, bottom: 70, left: 120 },
   svgWidth = 900,
   svgHeight = 520,
   chartWidth = svgWidth - margin.left - margin.right,
   chartHeight = svgHeight - margin.top - margin.bottom;;

const svg = d3.select('#plot_area').append("svg")
    .attr("width", svgWidth)
    .attr("height", svgHeight)

let chartGroup = svg.append("g")
            .attr("transform",  `translate(${margin.left}, ${margin.top})`)

// y selections: obesity, Smokes, healthcare
let yCurrentSelection = 'healthcare'

//x selections: poverty, age
let xCurrentSelection = 'poverty'

//functions for rescaling axes

function xScale ( data, xCurrentSelection) {
    console.log(data)
    let xMax = d3.max(data.map(d => parseFloat(d[xCurrentSelection]))),
        xMin = d3.min(data.map(d => parseFloat(d[xCurrentSelection])))

    let xLinearScale = d3.scaleLinear()
        .domain([xMin - 1, xMax ])
        .range([0, chartWidth])

    return xLinearScale 
}

function yScale ( data, yCurrentSelection) {
    let yMin = d3.min(data.map(d => parseFloat(d[yCurrentSelection]))),
        yMax = d3.max(data.map(d => parseFloat(d[yCurrentSelection])))

    let yLinearScale = d3.scaleLinear()
        .domain([yMin - 1, yMax])
        .range([chartHeight, 0])

    return yLinearScale 
}

function renderXAxis (newXScale, xAxis) {
    let bottomAxis = d3.axisBottom(newXScale)
    
    xAxis
    .transition()
    .duration(1000)
    .call(bottomAxis)

    return xAxis
}

function renderYAxis (newYScale, yAxis) {
    let leftAxis = d3.axisLeft(newYScale)
    yAxis
    .transition()
    .duration(1000)
    .call(leftAxis)

    return yAxis
}

function renderCircles(circlesGroup, newXScale, xCurrentSelection) {
    circlesGroup
        .transition()
        .duration(1000)
        .attr('cx', d => newXScale(parseFloat(d[xCurrentSelection])))
    
    return circlesGroup
}

function renderLabels(circleLabelGroup, newXScale, xCurrentSelection) {
    circleLabelGroup
        .transition()
        .duration(1000)
        .attr('x', d => newXScale(parseFloat(d[xCurrentSelection])) - 6)
    
    return circleLabelGroup
}

function renderYCircles(circlesGroup, newYScale, yCurrentSelection) {
    circlesGroup
        .transition()
        .duration(1000)
        .attr('cy', d => newYScale(parseFloat(d[yCurrentSelection])))
    
    return circlesGroup
}

function renderYLabels(circleLabelGroup, newYScale, yCurrentSelection) {
    circleLabelGroup
        .transition()
        .duration(1000)
        .attr('y', d => newYScale(parseFloat(d[yCurrentSelection]))  + 4)
    
    return circleLabelGroup
}
;(function() {

    d3.csv('assets/data/data.csv').then( data => {
            
        console.log(data)
    let xLinearScale = xScale(data, xCurrentSelection)
    let yLinearScale = yScale(data, yCurrentSelection)

    let bottomAxis = d3.axisBottom(xLinearScale),
        leftAxis = d3.axisLeft(yLinearScale)
    
    let xAxis = chartGroup.append('g')
        .classed('x-axis', true)
        .attr('transform', `translate(0, ${chartHeight})`)
        .call(bottomAxis)

    let yAxis = chartGroup.append('g')
        .classed('y-axis', true)
        .classed('transform', `translate(${chartWidth}, 0)`)
        .call(leftAxis)

    // create axes
    // yAxis = renderYAxis(yLinearScale, yAxis),
    // xAxis = renderXAxis(xLinearScale, xAxis)



    let circlesGroup = chartGroup.append('g')
        .selectAll("dot") //change to circle?
        .data(data)
        .enter()
            .append('circle')
            .attr('cx', d => xLinearScale(parseFloat(d[xCurrentSelection])))
            .attr('cy', d => yLinearScale(parseFloat(d[yCurrentSelection])))
            .attr('r', d => d.income / 5000)
            .style('fill', 'gray')
            .style('opacity', .3)
            .attr('stroke', 'black')
            .attr('stroke-width', 2)

let circleLabelGroup = chartGroup.append('g')
        .selectAll("text")
        .data(data)
        .enter()
        .append("text")
        .attr('font-size', 12)
        .attr("font-fmaily", "Saira")
        .attr('stroke-width', 1)
        .text((d) => d.abbr)
        .attr("x", d => xLinearScale(parseFloat(d[xCurrentSelection])) - 6 )
        .attr("y", d => yLinearScale(parseFloat(d[yCurrentSelection])) + 4 )
        .attr('fill', 'white')

    let xlabelsGroup = chartGroup
        .append("g")
        .attr("transform", `translate(${chartWidth / 2}, ${chartHeight + 20})`)
    
    xlabelsGroup.append('text')
        .attr('x', 0)
        .attr('y', 20)
        .attr('value', 'poverty')
        .classed('active', true)
        .text('In Poverty (% of Population)')

    xlabelsGroup.append('text')
        .attr('x', 0)
        .attr('y', 40)
        .attr('value', 'age')
        .classed('active', false)
        .text('Age (Median)')

        xlabelsGroup.selectAll('text').on('click', function() {
            let xLabel = d3.select(this)
            let xActiveLabel = d3.select('.active')
            let xValue = xLabel.attr('value')
            console.log(xValue)
            if (xValue != xCurrentSelection) {
                xLabel.classed('active', true)
                xActiveLabel.classed('active', false)
                xCurrentSelection = xValue
                xLinearScale = xScale(data, xCurrentSelection)
                xAxis = renderXAxis(xLinearScale, xAxis)
                circlesGroup = renderCircles(
                    circlesGroup,
                    xLinearScale,
                    xCurrentSelection
                )
                circleLabelGroup = renderLabels(
                    circleLabelGroup,
                    xLinearScale,
                    xCurrentSelection
                )
            }
        })

    let ylabelsGroup = chartGroup
        .append("g")
        .attr("transform", `translate(${0 - margin.left}, ${(chartHeight / 2) - 100 })`)
        .attr('transform', 'rotate(-90)')
    
    let healthLabel = ylabelsGroup.append('text')
        .attr('x', - 80)
        .attr('y', - 40)
        .attr('value', 'healthcare')
        .classed('active', true)
        .text('Lacks Healtcare (%)')

    let smokeLabel = ylabelsGroup.append('text')
        .attr('x', - 100)
        .attr('y', - 60)
        .attr('value', 'smokes')
        .classed('active', false)
        .text('Smokers (%)')

    let obeseLabel = ylabelsGroup.append('text')
        .attr('x', - 100)
        .attr('y', - 80)
        .attr('value', 'obesity')
        .classed('active', false)
        .text('Obese (%)')
    


    ylabelsGroup.selectAll('text').on('click', function() {
            let label = d3.select(this)
            let activeLabel = d3.select('.active')
            let value = label.attr('value')
            if (value != yCurrentSelection) {
                activeLabel.classed('active', false)
                label.classed('active', true)
                yCurrentSelection = value
                yLinearScale = yScale(data, yCurrentSelection)
                yAxis = renderYAxis(yLinearScale, yAxis)
                circlesGroup = renderYCircles(
                    circlesGroup,
                    yLinearScale,
                    yCurrentSelection
                )
                circleLabelGroup = renderYLabels(
                    circleLabelGroup,
                    yLinearScale,
                    yCurrentSelection
                )
            }
        })
})})()