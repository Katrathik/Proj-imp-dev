// here we will create the main states and import it in required files
// atom is used same as state in react/next 

import { atom } from "jotai";
import { FaL } from "react-icons/fa6";
// "Republic of India" - default
export const placeAtom = atom("Republic of India")
export const loadingCityAtom = atom(false)
