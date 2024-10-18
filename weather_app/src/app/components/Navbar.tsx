"use client"
import React from 'react'
import { useState } from 'react';
import { MdWbSunny } from "react-icons/md";
import { MdMyLocation } from "react-icons/md";
import { MdOutlineLocationOn } from "react-icons/md";
import SearchBox from './SearchBox';
import axios from 'axios';
import { useAtom } from 'jotai';
import { loadingCityAtom, placeAtom } from '../atom';

// sticky makes sure navbar always sticks to the top when page is scrolled down
// top-0 and left-0 give navbar position and mx-auto will auto center our container on the x-axis
// text-slate-900/80 80 means opacity

type Props = {location?: string}

const API_KEY = process.env.NEXT_PUBLIC_WEATHER_KEY; 

export default function Navbar({location}: Props) {

    const [city, setCity] = useState(""); // for city in search bar
    const [error, setError] = useState(""); // if city not found in search-bar

    const [suggestions, setSuggestions] = useState<string[]>([]); // to store array of suggestions
    const [showSuggestions, setShowSuggestions] = useState(false); // if suggestions are open or not
    const [place, setPlace] = useAtom(placeAtom); // dynamic place weather report option -- if user selects any city, that city's report should be displayed 
    const [, setLoadingCity] = useAtom(loadingCityAtom);

    
    // async as suggestions we will get from api like a reponse so
    async function handleInputChange(value:string){
        // if suggetion len >=3 show them and if suggestion found only, if not found after len>=3, then say no suggestions found
        setCity(value);
        if(value.length >=3){
            try {
                const response = await axios.get(
                    `https://api.openweathermap.org/data/2.5/find?q=${value}&appid=${API_KEY}`
                );
                const suggestions = response.data.list.map((item:any)=>item.name);
                setSuggestions(suggestions);
                setError('')
                setShowSuggestions(true)
            } catch (error) {
                setSuggestions([])
                setShowSuggestions(false);
            }
        }
        else{
            setSuggestions([])
                setShowSuggestions(false);
        }
    }
    // when user clicks on a suggetsion, hide the reamining
    function handleSuggestionClick(value:string){
        setCity(value);
        setShowSuggestions(false);
    }

    function handleSubmitSearch(e:React.FormEvent<HTMLFormElement>){
        setLoadingCity(true); // loading to set city 
        e.preventDefault(); // avoids page reloading
        if(suggestions.length == 0){
            setError("Location not found");
            setLoadingCity(false);
        }
        else{
            // timeout to generate a delay (loading)
            setError('');
            setTimeout(()=>{
                setLoadingCity(false); // data is fetched so make it false
                setPlace(city); // city selected by user
                setShowSuggestions(false);
            },500);
        }
    }

    function handleCurrentLocation(){
        if(navigator.geolocation){
            navigator.geolocation.getCurrentPosition(async(position)=>{
                const { latitude, longitude } = position.coords;
                try {
                    const res = await axios.get(
                         `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${API_KEY}`
                    );
                    setTimeout(()=>{
                        setLoadingCity(false);
                        setPlace(res.data.name);
                    },500)
                } catch (error) {
                    setLoadingCity(false);
                }
            })
        }
    }

  return (
    <>
    <nav className='shadow-sm sticky top-0 left-0 z-50 bg-white'>
        <div className='h-[80px] w-full flex justify-between items-center max-w-7xl px-3 mx-auto'>
            <div className='flex items-center justify-center gap-2'>
                <h2 className=' text-gray-500 text-3xl'>Weather</h2>
                <MdWbSunny className='text-3xl mt-1 text-yellow-300'/>
            </div>

            {/* location and search bar */}
            <section className=' flex gap-2 items-center'>
                <MdMyLocation 
                title='Your Current Location'
                onClick={handleCurrentLocation}
                className=' text-2xl text-gray-400 hover:opacity-80 cursor-pointer' />
                <MdOutlineLocationOn className=' text-3xl' />
                <p className=' text-slate-900/80 text-sm'>{location}</p>

            <div className=' relative hidden md:flex' > 
                {/* search bar and suggestion box is now relative to the container*/}
                <SearchBox
                    value={city}
                    onSubmit={handleSubmitSearch}
                    onChange={(e)=>handleInputChange(e.target.value)}
                />
                <SuggestionBox 
                
                    {...{
                        showSuggestions,
                        suggestions,
                        handleSuggestionClick,
                        error
                    }}
                
                />
            </div>

            </section>



        </div>
    </nav>
    <section className=' flex max-w-7xl px-3 md:hidden'>
    <div className=' relative ' > 
                {/* search bar and suggestion box is now relative to the container*/}
                <SearchBox
                    value={city}
                    onSubmit={handleSubmitSearch}
                    onChange={(e)=>handleInputChange(e.target.value)}
                />
                <SuggestionBox 
                
                    {...{
                        showSuggestions,
                        suggestions,
                        handleSuggestionClick,
                        error
                    }}
                
                />
            </div>
            </section>
    </>
  );
}

function SuggestionBox({
    showSuggestions,
    suggestions,
    handleSuggestionClick,
    error
  }: {
    showSuggestions: boolean;
    suggestions: string[];
    handleSuggestionClick: (item: string) => void; // when user clicks on a state suggested
    error: string;
  }) {
    return (
    <>  {((showSuggestions && suggestions.length > 1) || error) && (

        // if error and length less tahn 1, show error
        <ul className=' mb-4 bg-white absolute border top-[44px] left-0 
     border-gray-300 rounded-md min-w-[200px] flex flex-col gap-1 py-2 px-2'>
        {error && suggestions.length<1 && (
            <li className=' text-red-500 p-1'>{error}</li>
        )}

        
        {suggestions.map((item,i)=>(
            // or else show suggetions and show the weather report of item clicked by user
            <li 
                key={i}
                onClick={()=>handleSuggestionClick(item)}
            className=' cursor-pointer p-1 rounded hover:bg-gray-200' >
                {item}
            </li>
        ))}
        <li className=' cursor-pointer p-1 rounded hover:bg-gray-200'></li>
    </ul>
    )}
    </>
    )
}