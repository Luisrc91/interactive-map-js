
// add map ojects
const myMap = {
	coordinates: [],
	businesses: [],
	map: {},
	markers: {},


    buildMap() {
		this.map = L.map('map', {
		center: this.coordinates,
		zoom: 15,
		});   
//openstreemap
     L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    minZoom: '15',
    }).addTo(this.map)
    const marker = L.marker(this.coordinates)
    marker.addTo(this.map).bindPopup(`<p>Im Here.</p>`).openPopup()
    },

    // add markers for business
    addMarkers(){
		for (var i =0; i < this.businesses.length; i++){
			this.markers = L.markers([this.businesses[i].lat, this.businesses[i].long])
			.bindPopup(`<p>${this.businesses[i].name}</p>`)
			.addTo(this.map)
		}
    },

}

 // add user coordinates map 
async function getCoords(){
    const position = await new Promise ((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject)
    })
    return [position.coords.latitude, position.coords.longitude]
    } 
   

      
// fourSquare api
    async function getFourSquare(business) {
        const options = {
            method: 'GET',
            headers: {
            Accept: 'application/json',
            Authorization: 'fsq3aBrpKXO+qPIISMRzJwwcQkQ/ci+kU/AGDhFnJGyGses='
            }
        }
        let limit = 5
        let lat = myMap.coordinates[0]
        let lon = myMap.coordinates[1]
        let response = await fetch(`https://cors-anywhere.herokuapp.com/https://api.foursquare.com/v3/places/search?&query=coffee&limit=5&ll=41.8781%2C-87.6298`, options)
        let data = await response.text()
        let parsedData = JSON.parse(data)
        let businesses = parsedData.results
        return businesses
    
        

        
    }
// getFourSquare process
    function processBusinesses(data) {
        let businesses = data.map((element) => {
            let location = {
            name: element.name,
            lat: element.geocodes.main.latitude,
            long: element.geocodes.main.longitude
        };
            return location
        })
        return businesses
    }

    window.onload = async () => {
        const coords = await getCoords()
        // console.log(coords)
        myMap.coordinates = coords
        myMap.buildMap()
    }
  

    // selecting submit button
    document.getElementById('submit').addEventListener('click', async (event) => {
        event.preventDefault()
        let business = document.getElementById('business').value;
        let data = await getFourSquare(business)
        myMap.businesses = processBusinesses(data)
        myMap.addMarkers()
    })


   



