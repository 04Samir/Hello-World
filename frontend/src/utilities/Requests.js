/*
    The HTTP Requests Utility
    -------------------------
*/

import axios from 'axios';


export const Fetch = async (method, url, headers = null, data = null) => {
    try {
        const response = await axios({
            method: method,
            url: `${process.env.REACT_APP_API_URL}${url}`,
            data: data,
            headers: headers,
            validateStatus: () => true
        });
        return response.data;
    } catch (error) {
        return null;
    };
};
