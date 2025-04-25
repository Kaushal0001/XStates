import React, { useEffect, useState } from "react";

const LocationSelector = () => {
    const [countries, setCountries] = useState([]);
    const [states, setStates] = useState([]);
    const [cities, setCities] = useState([]);
    const [selectedCountry, setSelectedCountry] = useState("");
    const [selectedState, setSelectedState] = useState("");
    const [selectedCity, setSelectedCity] = useState("");
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchCountries = async () => {
            try {
                const response = await fetch("https://crio-location-selector.onrender.com/countries");
                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }
                const data = await response.json();
                setCountries(data);
            } catch (err) {
                console.error("Error fetching data:", err);
                setError("Failed to fetch countries. Please try again later.");
            } finally {
                setLoading(false);
            }
        };
        fetchCountries();
    }, []);

    const fetchStates = async (country) => {
        setSelectedCountry(country);
        setStates([]);
        setCities([]);
        setSelectedState("");
        setSelectedCity("");
        try {
            const response = await fetch(`https://crio-location-selector.onrender.com/country=${country}/states`);
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            const data = await response.json();
            setStates(data);
        } catch (err) {
            console.error("Error fetching states:", err);
        }
    };

    const fetchCities = async (state) => {
        setSelectedState(state);
        setCities([]);
        setSelectedCity("");
        try {
            const response = await fetch(`https://crio-location-selector.onrender.com/country=${selectedCountry}/state=${state}/cities`);
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            const data = await response.json();
            setCities(data);
        } catch (err) {
            console.error("Error fetching cities:", err);
        }
    };

    if (loading) return <p>Loading...</p>;
    if (error) return <p style={{ color: "red" }}>{error}</p>;

    return (
        <div style={{ textAlign: "center", fontFamily: "sans-serif" }}>
            <h2>Select Location</h2>
    
            {error && <p style={{ color: "red" }}>{error}</p>}
    
            {/* Country */}
            <select onChange={(e) => fetchStates(e.target.value)} disabled={loading || !!error} style={{ size: "1" }}>
                <option value="">Select Country</option>
                {countries.map((country) => (
                    <option key={country} value={country}>{country}</option>
                ))}
            </select>
    
            {/* State */}
            <select onChange={(e) => fetchCities(e.target.value)} disabled={!selectedCountry} style={{ marginLeft: "10px", size: "1" }}>
                <option value="">Select State</option>
                {states.map((state) => (
                    <option key={state} value={state}>{state}</option>
                ))}
            </select>
    
            {/* City */}
            <select onChange={(e) => setSelectedCity(e.target.value)} disabled={!selectedState} style={{ marginLeft: "10px", size: "1" }}>
                <option value="">Select City</option>
                {cities.map((city) => (
                    <option key={city} value={city}>{city}</option>
                ))}
            </select>
    
            {selectedCity && (
                <p>
                    <strong>You selected {selectedCity}, </strong>
                    {selectedState}, {selectedCountry}
                </p>
            )}
        </div>
    );
};

export default LocationSelector;
