const API_URL = window.location.hostname === 'localhost' ? 'http://localhost:1337' : 'https://cloud.martinkult.hu';

export async function listAll(pageID) {
    const response = await fetch(`${API_URL}/api?pageID=${pageID}`);
    return response.json();
}

export async function getStorage() {
    const response = await fetch(`${API_URL}/api/getStorage`);
    return response.json();
}