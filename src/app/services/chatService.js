import getAccessToken from 'app/shared-components/commons';
import axiosInstance from '../services/axiosConfig'


const getApiContacts = (params) => {
    return new Promise((resolve, reject) => {
        axiosInstance
            .get(`/api/contacts/page/${params}`)
            .then(response => {
                if (response.data) {
                    resolve(response.data);
                } else {
                    reject(response.error);
                }
            })
            .catch(error => {
                console.log("Error =>", error);
                reject(error);
            });
    });


}



export default getApiContacts;