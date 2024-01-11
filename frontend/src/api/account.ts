const baseUrl = "http://localhost:3000";

async function fetchData(endpoint :string, options = {}){
    const response = await fetch(`${baseUrl}${endpoint}`, options);
    if(!response.ok){
        throw new Error("Internal server error")
    }
    return response.json()
}

async function accessRestriced(){
    const fetchOptions = {
        method: "GET",
        credentials: "include",
        headers: {
            'Content-Type': 'application/json',
        },
    }
    const result = await fetchData("/", fetchOptions);
    console.log(result)
}

async function login(username :string, password :string){
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
    console.log(result)
}

async function register(username :string, password :string){
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
    console.log(result)
}

(async() => {
    // await login("dany", "password");
    await accessRestriced();
})()
