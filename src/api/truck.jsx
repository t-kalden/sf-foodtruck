import { useState, useEffect } from "react";
import axios from "axios";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import { Icon } from "leaflet";
import 'leaflet/dist/leaflet.css'

const customIcon = new Icon({
    iconUrl:'https://cdn-icons-png.flaticon.com/512/13684/13684528.png',
    iconSize: [38, 38]
})

export const FoodTruckMap = () => {
    const [ foodTrucks, setFoodTrucks ] = useState([])
    useEffect(() => {
        const fetchData = async() => {
            try {
                const res = await axios.get('https://data.sfgov.org/api/views/rqzj-sfat/rows.csv')
                const parsedFoodTrucks = parseCsvData(res.data);
                setFoodTrucks(parsedFoodTrucks)

            } catch(error) {
                console.log('Error fetching data: ', error);
            }
        }
        fetchData(foodTrucks)
    }, [])

    const parseCsvData = (csvData) => {
        const parsedData = csvData.split('\n')
            .map(row => {
            const columns = row.split(',')
            const latitude = parseFloat(columns[14])
            const longitude = parseFloat(columns[15] )
            
            if((!isNaN(latitude) && !isNaN(longitude))) {
                return {
                    id: columns[0],
                    name: columns[1],
                    latitude: latitude,
                    longitude: longitude + 360,
                    address: columns[5],
                    location: columns[4],
                    foodOfferings: columns[11],
                    facilityType: columns[2],
                    hours: columns[17]
                } 
            } else if (latitude === 0 || longitude === 0) {
                return null
            } else {
                return null
            }
        }).filter(truck => truck !== null)
        parsedData.shift()
        console.log(parsedData);
        return parsedData
    }

   

    return (
        <div className="w-full h-auto">
            <h1 className="text-2xl">Food Truck Locations</h1>
            <div className="w-11/12 mx-auto bg-blue-50">
                <MapContainer
                    center={[37.7749, 237.5894]}
                    zoom={13}
                >
                    <TileLayer 
                        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    />

                    {
                        foodTrucks.map(truck => (
                           <Marker 
                            key={truck.id} 
                            position={[truck.latitude, truck.longitude]}
                            icon={customIcon}
                           >
                            <Popup>
                                <div>
                                    <h3 className="text-xl font-semibold">Name: { truck.name }</h3>
                                    <p>Address: { truck.address } </p>
                                    <p>Cross Street: { truck.location }</p>
                                    <p>Offerings: { truck.foodOfferings }</p>
                                    <p>Hours of operation: { truck.hours ? truck.hours : 'Not Available' }</p>
                                    <p>Type: { truck.facilityType }</p>
                                </div>
                            </Popup>
                        </Marker>
                        
                        ))
                            
                    }

                </MapContainer>
            </div>
        </div>
    )
}

