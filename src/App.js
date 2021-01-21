
import { FormControl, MenuItem, Select } from '@material-ui/core';
import { Card, CardContent, Typography } from "@material-ui/core";
import MAP from "./Map";
import Table from "./Table";
import './App.css';
import InfoBox from "./InfoBox";
import React, { useState, useEffect } from "react";
 import {sortData} from "./utill";
 import LineGraph from './LineGraph';
 import "leaflet/dist/leaflet.css";

function App() {
  const [countries, setCountries] = React.useState(['USA', 'UK', 'INDIA']);
  const [country, setCountry] = useState('Worldwide');
  const [countryInfo, setCountryInfo] = useState({});
  const [tabledata,setTabledata] = useState([]);
  const [mapCenter, setMapCenter] = useState({ lat: 34.80746, lng: -40.4796 });
  const [mapZoom, setMapZoom] = useState(3);
  useEffect(()=>{
    fetch("https://disease.sh/v3/covid-19/all")
    .then(response=>response.json())
    .then(data =>{
      setCountryInfo(data);
    })

  },[]);


  useEffect(() => {
    const getcountriesData = async () => {
      await fetch("https://disease.sh/v3/covid-19/countries")
        .then((response) => response.json())
        .then((data) => {
          const countries = data.map((country) => (
            {
              name: country.country,// name of countries
              value: country.countryInfo.iso2//uk,usa,fr
            }
          ));

          const sortedData=sortData(data);
          setCountries(countries);
          setTabledata(sortedData);
        });
    };
    getcountriesData();
  }, [countries]);

  const onCountrychange = async (event) => {
    const countryCode = event.target.value;
    setCountry(countryCode);
    const url=countryCode==="Worldwide"?'https://disease.sh/v3/covid-19/all':`https://disease.sh/v3/covid-19/countries/${countryCode}`

    //https://disease.sh/v3/covid-19/all

    //https://disease.sh/v3/covid-19/countries/[COUNTRY_CODE]
    await fetch(url)
    .then(response=>response.json())
    .then(data=>{
      setCountry(countryCode);
      // save all of the data of country
      setCountryInfo(data);
      setMapCenter([data.countryInfo.lat, data.countryInfo.long]);
      setMapZoom(4);
    })

  };

  return (
    <div className="app">
      <div className="app_left">
        <div className="app_header">

          <h1>COVID-19 TRACKER</h1>
          <FormControl className='app_dropdown'>
            <Select variant="outlined"
              onChange={onCountrychange}
              value={country}>
              <MenuItem value="Worldwide">Worldwide</MenuItem>
              {
                countries.map(country => (
                  <MenuItem value={country.value}>{country.name}</MenuItem>
                ))
              }
              {/* <MenuItem value="Worldwide">Worldwide</MenuItem>
    <MenuItem value="Worldwide">option 2</MenuItem>
    <MenuItem value="Worldwide">option 3</MenuItem>
    <MenuItem value="Worldwide">option 4</MenuItem> */}
            </Select>

          </FormControl>
        </div>


        <div className="app_stats">
          <InfoBox title="conronovirus cases" cases={countryInfo.todayCases} total={countryInfo.cases}></InfoBox>
          <InfoBox title="recovered cases" cases={countryInfo.todayRecovered} total={countryInfo.recovered}></InfoBox>
          <InfoBox title="deaths" cases={countryInfo.todayDeaths} total={countryInfo.deaths}></InfoBox>

        </div>

        
        {/* map */}
     
      </div>
      <Card className="app_right">
        <CardContent>
          <h3>Live Cases By country</h3>
          <Table countries={tabledata}/>
          <h3>Worldwide New Cases</h3>
          <LineGraph></LineGraph>
        </CardContent>
      </Card>

    </div>
  );
}

export default App;
