
const baseUrl = "http://localhost:3000";

async function fetchData(endpoint :string, options = {}){
    const response = await fetch(`${baseUrl}${endpoint}`, options);
    console.log(response)
    if(!response.ok){
        const message = await response.json();
        if(!message){
            throw new Error(response.statusText);
        }
        else{
            throw new Error(message.error)
        }
    }
    return response.json()
}

export async function accessRestriced(){
    const fetchOptions = {
        method: "GET",
        credentials: "include",
        headers: {
            'Content-Type': 'application/json',
        },
    }
    const result = await fetchData("/", fetchOptions);
    return result;
}

export async function login(username :string, password :string){
    const data = {
        "username": username,
        "password": password
    }

    const fetchOptions = {
        method: "POST",
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
    }
    const result = await fetchData("/login", fetchOptions);
    return result;
}

export async function register(username :string, password :string){
    const data = {
        "username": username,
        "password": password
    }

    const fetchOptions = {
        method: "POST",
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
    }
    const result = await fetchData("/register", fetchOptions);
    return result
}