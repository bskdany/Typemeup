import { fetchData } from "./fetch";

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

export async function checkJWT(){
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
        credentials: "include",
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
    }
    const result = await fetchData("/login", fetchOptions);
    return result;
}

export async function logout(){
    const fetchOptions = {
        method: "POST",
        credentials: "include",
        headers: {
            'Content-Type': 'application/json',
        },
    }
    const result = await fetchData("/logout", fetchOptions);
    return result;
}

export async function register(username :string, password :string){
    const data = {
        "username": username,
        "password": password
    }

    const fetchOptions = {
        method: "POST",
        credentials: "include",
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
    }
    const result = await fetchData("/register", fetchOptions);
    return result
}