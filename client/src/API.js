const API_URL = window.location.hostname === 'localhost' ? 'http://localhost:1337' : 'https://cloud.martinkult.hu';

export async function listLogEntries() {
    const response = await fetch(`${API_URL}/api`);
    console.log(response);

    return response.json();
}