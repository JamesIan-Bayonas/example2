const axios = require('axios');

class IsdaLogAPI {
    constructor() {
        this.baseURL = process.env.LARAVEL_API_URL;
    }

    async publishCatch(data) {
        try {
            const response = await axios.post(`${this.baseURL}/listings`, {
                user_id: data.user_id,
                fish_name: data.fish_name,
                weight_kg: data.weight_kg,
                location: data.location,
                starting_price: data.starting_price,
                status: 'active'
            });
            
            return response.data;
        } catch (error) {
            console.error("Laravel API Error:", error.message);
            throw error;
        }
    }
}

module.exports = new IsdaLogAPI();