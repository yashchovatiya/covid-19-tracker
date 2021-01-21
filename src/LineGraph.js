import React from 'react'
import {Line} from 'react-chartjs-2'
import numeral from 'numeral';
const options = {
    legend: {
      display: false,
    },
    elements: {
      point: {
        radius: 0,
      },
    },
    maintainAspectRatio: false,
    tooltips: {
      mode: "index",
      intersect: false,
      callbacks: {
        label: function (tooltipItem, data) {
          return numeral(tooltipItem.value).format("+0,0");
        },
      },
    },
    scales: {
      xAxes: [
        {
          type: "time",
          time: {
            format: "MM/DD/YY",
            tooltipFormat: "ll",
          },
        },
      ],
      yAxes: [
        {
          gridLines: {
            display: false,
          },
          ticks: {
            // Include a dollar sign in the ticks
            callback: function (value, index, values) {
              return numeral(value).format("0a");
            },
          },
        },
      ],
    },
  };



function LineGraph({casesType='cases'}) {
    const [data,setData]=React.useState({});

    //https://disease.sh/v3/covid-19/historical/all?lastdays=120

    const buildchartdata=(data,casesType='cases')=>{
        let chartData=[];
        let lastDatapoint;
       for(let date in data.cases){
            if(lastDatapoint){
                const newDatapoint={
                    x:date,
                    y:data[casesType][date]-lastDatapoint,
                };

               chartData.push(newDatapoint);
            }
            lastDatapoint=data[casesType][date];
        }
        return chartData;
    };

    React.useEffect(()=>{
        const fetchData= async()=>{
            await fetch("https://disease.sh/v3/covid-19/historical/all?lastdays=120")
            .then(response=>response.json())
            .then(data=>{
                const chartData=buildchartdata(data);
                setData(chartData);
    
            })
        }
        fetchData();
    },[casesType]);

    
    return (
        <div>
         {data?.length > 0 && (
        <Line
          data={{
            datasets: [
              {
                backgroundColor: "rgba(204, 16, 52, 0.5)",
                borderColor: "#CC1034",
                data: data,
              },
            ],
          }}
          options={options}
        />
      )}
            
        </div>
    )
}

export default LineGraph
