// 3 places to run data viz
// page load
// on any change of first select box
// on any change of second select box
// all 3 run same code

const svg = d3.select('svg');

// Create the svg to display data inside
svg
  .attr('viewBox', '0 0 960 720');

// Creates the X axis
const axisXGroup = svg
  .append('g')
  .attr('class', 'x-axis')
  .attr('transform', 'translate(0, 620)');

// Creates the Y axis
const axisYGroup = svg
  .append('g')
  .attr('class', 'y-axis')
  .attr('transform', 'translate(100, 0)');

// Creates the X axis text
const axisXText = svg
  .append('text')
  .attr('class', 'x-axis')
  .attr('transform', 'translate(480, 670)')
  .text('x-axis');

// Creates the Y axis text
const axisYText = svg
  .append('text')
  .attr('class', 'y-axis')
  .attr('transform', 'translate(30, 360) rotate(-90)')
  .text('y-axis');

// Updates the data elements
const placeCities = function () {
  // Get the selected input
  let inputX = document.querySelector('select[name=valueX]');
  let inputY = document.querySelector('select[name=valueY]');

  // Get the selected values from dropdown options
  let xVal = inputX.value;
  let yVal = inputY.value;

  // Get the selected dropdown text option
  let textX = inputX.options[inputX.selectedIndex].innerHTML;
  let textY = inputY.options[inputY.selectedIndex].innerHTML;
  // Set the selected dropdown text for the axis
  axisXText.text(textX);
  axisYText.text(textY);

  // Get the max value from the data set
  const maxValX = d3.max(data, d => d[xVal]);
  const maxValY = d3.max(data, d => d[yVal]);
  const maxValR = d3.max(data, d => d.population);

  // Create scales for x, y, and radius
  const scaleX = d3.scaleLinear()
    .domain([0, maxValX])
    .range([100, 860]);

  const scaleY = d3.scaleLinear()
    .domain([0, maxValY])
    .range([620, 100]);

  const scaleR = d3.scaleSqrt()
    .domain([0, maxValR])
    .range([0, 30]);

  // Create the X axis
  const axisX = d3.axisBottom(scaleX)
    .tickSizeInner(-520)
    .tickSizeOuter(0)
    .tickPadding(10)
    .ticks(10, "$,f")
  // .tickSizeInner(0)
  axisXGroup.call(axisX);

  // Create the Y axis
  const axisY = d3.axisLeft(scaleY)
    .tickSizeInner(-760)
    .tickSizeOuter(0)
    .tickPadding(10)
    .ticks(10, "$,f");
  axisYGroup.call(axisY);

  // Create the points for cities
  const cities = svg
    .selectAll('g.city')
    .data(data, d => d.city)
    .enter()
    .append('g')
    .attr('class', 'city')
    .attr('transform', (d, i) => {
      const x = scaleX(d[xVal]);
      const y = scaleY(d[yVal]);

      return `translate(${x}, ${y})`;
    });

  // Create and attach circles to each city point
  cities
    .append('circle')
    .attr('cx', 0)
    .attr('cy', 0)
    .attr('r', 0)
    .transition()
    .attr('r', d => scaleR(d.population));

  // Create and attach rect to each city point
  cities
    .append('rect')
    .attr('x', -60)
    .attr('y', d => -1 * scaleR(d.population) - 35)
    .attr('width', 120)
    .attr('height', 30);

  // Create and attach text describing the city name to each city point
  cities
    .append('text')
    .attr('x', 0)
    .attr('y', d => -1 * scaleR(d.population) - 15)
    .text(d => d.city);

  // Need to do this to update the data positions since cities enter the data
  svg
    .selectAll('g.city')
    .transition()
    .duration(500)
    .attr('transform', (d, _) => {
      const x = scaleX(d[xVal]);
      const y = scaleY(d[yVal]);

      return `translate(${x}, ${y})`;
    });

  // Do this to "raise" the element on hover
  svg
    .selectAll('g.city')
    .on('mouseover', function () {
      d3.select(this).raise();
    });
};

// on page load
placeCities();

// For each select option, whenever user makes selection, update the graph
const selectTags = document.querySelectorAll('select');
selectTags.forEach(el => {
  el.addEventListener('change', function () {
    placeCities();
  });

  // Shorter way to write the above syntax
  // el.addEventListener('change', placeCities);
});
