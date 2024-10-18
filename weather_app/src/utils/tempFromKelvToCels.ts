export function tempFromKelvToCels(tempInKelvin : number): number {
  const tempInCelsius = tempInKelvin - 273.15;
  return Math.floor(tempInCelsius); // Removes decimal part and only int part
}