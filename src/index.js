// import axios from "axios";
const axios = require('axios').default;
const BASE_URL = "https://pixabay.com/api/";
const API_KEY = "28247101-24b63c3c82da89bc4099ab93b";
// const options = {
//    headers: {
//     key: API_KEY,
// },
// }
let searchQuery = '';
const url = `${BASE_URL}/?key=${API_KEY}&q=${searchQuery}&image_type=photo&orientation=horizontal&safesearch=true`
const refs = {
    form: document.querySelector('#search-form'),
};

function onSearch(event) {
    event.preventDefault();
    searchQuery = event.currentTarget.elements.searchQuery.value;
    console.log(searchQuery);
    return axios.get(url)
    .then(response => {
        if(!response.ok) {
            throw new Error (response.statusText);
        }
        return response.json();
    })
    .catch(error => {
        console.log(error);
    })
       
}

refs.form.addEventListener('submit', onSearch);
