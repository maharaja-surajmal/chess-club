let user_name = [];
let rapid = [];
let blitz = [];
let bullet = [];
let data = []
let puzzle = [];

let entered_name = null;

async function getData(){
    const response = await fetch("https://randomsailor.pythonanywhere.com/");
    const data = await response.json();
    rapid = data["Rapid"];
    user_name = data["Username"];
    blitz = data["Blitz"];
    bullet = data["Bullet"];
    puzzle = data["Puzzle"];

    document.getElementById("rapid").textContent = rapid[user_name.indexOf("avg")];
    document.getElementById("blitz").textContent = blitz[user_name.indexOf("avg")];
    document.getElementById("bullet").textContent = bullet[user_name.indexOf("avg")];
    document.getElementById("puzzle").textContent = puzzle[user_name.indexOf("avg")];
    document.getElementById("total").textContent = rapid.length;
}


async function displayGraphTable(current = 0) {
    if (data.length == 0)
        await getData();

    const chartId = current === 0 ? "chartRapid" : (current === 1 ? "chartBlitz" : "chartBullet");

    const existingChart = Chart.getChart(chartId);
    if (existingChart) {
        existingChart.destroy();
    }

    if (current === 0)
        drawGraphRapid(rapid, "tableRapid", chartId);
    else if (current === 1)
        drawGraphRapid(blitz, "tableBlitz", chartId);
    else
        drawGraphRapid(bullet, "tableBullet", chartId);
}



async function drawGraphRapid(typeofgraph, tableId, chartId) {
    data = user_name.map((username, index) => ({ username, rating: typeofgraph[index]}));
    
    // Sorting Data in ascending and desceding
    const ascendingData = [...data].sort((a, b) => a.rating - b.rating);
    const descendingData = [...data].sort((a, b) => b.rating - a.rating);
    
    const ascUserName = ascendingData.map(item=>item.username);
    const ascRating = ascendingData.map(item => item.rating);
    
    const desUserName = descendingData.map(item=>item.username);
    const descRating = descendingData.map(item=>item.rating);
    //end

    let userRank = -1;
    if(entered_name != null){
        const lowercaseNameList = desUserName.map(name => name.toLowerCase());
        userRank = lowercaseNameList.indexOf(entered_name)+1;
        console.log(userRank);
    }

    
    const tableBody = document.querySelector(`#${tableId} tbody`);
    while(tableBody.rows.length >= 1)
    {
        tableBody.deleteRow(0);
    }

    let x = 0;
    let avgIndex = 20;
    for(let i = 0; i<rapid.length;i++){
        const row = tableBody.insertRow();
        x++;
        row.insertCell(0).textContent = x;
        row.insertCell(1).textContent = desUserName[i];
        row.insertCell(2).textContent = descRating[i];
        if(desUserName[i] == "avg"){
            avgIndex = i;
            row.style.backgroundColor = "#E56353";
        }
        if(i == userRank-1 && userRank != -1){
            row.style.backgroundColor = "#FCD63A";
            row.style.color = "black";
        }
    }

    const ctx = document.getElementById(`${chartId}`);
    new Chart(ctx, {
        type: 'bar',
        data: {
            labels: ascUserName,
            datasets: [{
                label: 'Chess Rating',
                data: ascRating,
                borderWidth: 1,
                backgroundColor: color=>{
                    let colors;
                    if(color.index == ascRating.length-userRank && userRank != -1)
                        colors = "#F7BB38";

                    else{
                        if(color.index == ascRating.length-avgIndex-1)
                        colors = "#E56353";

                        else
                            colors = "#329AC7";
                    }
                    return colors;
                }
            },
        ],
    },
    options: {
        scales: {
            x: {
                ticks: {
                    autoSkip: false
                }
            },
        }
    }
});
}

const rapidGraphRadio = document.getElementById("rapidGraph");
const blitzGraphRadio = document.getElementById("blitzGraph");
const bulletGraphRadio = document.getElementById("bulletGraph");

// Event listeners to the radio buttons
rapidGraphRadio.addEventListener("change", function () {
    openGraph('chartRapid', 'tableRapid', 0);
});

blitzGraphRadio.addEventListener("change", function () {
    openGraph('chartBlitz', 'tableBlitz', 1);
});

bulletGraphRadio.addEventListener("change", function () {
    openGraph('chartBullet', 'tableBullet', 2);
});

//calling for default graph
openGraph('chartRapid','tableRapid', 0);

async function openGraph(graphType,tableType, cur)
{
    await displayGraphTable(cur);
    var i;
    var x = document.getElementsByClassName("ratingGraph");
    for (i = 0; i < x.length; i++) {
        x[i].style.display = "none";  
    }
    var y = document.getElementsByClassName("ratingTable");
    for(i = 0; i < y.length ; i++)
    {
        y[i].style.display = "none";
    }
    document.getElementById(graphType).style.display = "block";
    document.getElementById(tableType).style.display = "block";
}

function checkEnter(event) {
    if (event.key === "Enter") {
        console.log("working");
        const enteredUsername = document.getElementById("usernameInput").value;
        entered_name = enteredUsername.toLowerCase();
        const lowercaseNameList = user_name.map(name => name.toLowerCase());

        if(lowercaseNameList.includes(entered_name)){
            openGraph('chartRapid','tableRapid', 0);
            const rapidButton = document.getElementById("rapidGraph");
            rapidButton.checked = true;
        }
    }
}

