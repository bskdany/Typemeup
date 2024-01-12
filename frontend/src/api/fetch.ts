const baseUrl = "http://localhost:3000";

export async function fetchData(endpoint :string, options = {}){
    const response = await fetch(`${baseUrl}${endpoint}`, options);
    // console.log(response)
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
