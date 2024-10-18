import React from 'react'
import { FiDroplet } from 'react-icons/fi';
import { ImMeter } from 'react-icons/im';
import { LuEye, LuSunrise, LuSunset } from 'react-icons/lu';
import { MdAir } from 'react-icons/md';
// whitespace - nowrap gives data wrapped in one line and does not go to 2nd line

export interface WeatherDetailProps{
    visibility : string;
    humidity : string;
    windSpeed: string;
    airPressure : string;
    sunrise : string;
    sunset : string;
}



export default function WeatherDetails(props:WeatherDetailProps ) {
    // passing default values if no value passed from api
    // will be accomodated to each SingleWeatherDetail via de-structuring
    const{  
        visibility = "25km",
        humidity = "61%",
        windSpeed = "7 km/h",
        airPressure = "1012 hPa",
        sunrise = "6:20",
        sunset = "18:48"
    } = props;
  return (
    <>
    <SingleWeatherDetail
        icon = {<LuEye/>}
        information='Visibility'
        value={visibility}
    />
    <SingleWeatherDetail
        icon = {<FiDroplet/>}
        information='Humidity'
        value={humidity}
    />
    <SingleWeatherDetail
        icon = {<MdAir/>}
        information='Wind speed'
        value={windSpeed}
    />
    <SingleWeatherDetail
        icon = {<ImMeter/>}
        information='Air Pressure'
        value={airPressure}
    />
    <SingleWeatherDetail
        icon = {<LuSunrise/>}
        information='Sunrise'
        value={sunrise}
    />
    <SingleWeatherDetail
        icon = {<LuSunset/>}
        information='Sunset'
        value={sunset}
    />
    </>
  )
}

// props of yellow colour container 
export interface SingleWeatherDetailProps{
    information: string; 
    icon:React.ReactNode;
    value:string;
}

function SingleWeatherDetail(props : SingleWeatherDetailProps){
    return(
        <div className="flex flex-col justify-between gap-2 items-center text-xs font-semibold text-black/80">
            <p className=' whitespace-nowrap'>{props.information}</p>
            <p className=' text-3xl'>{props.icon}</p>
            <p>{props.value}</p>
        </div>
    )
}