import FuseUtils from '@fuse/utils/FuseUtils';
import axiosInstance from './axiosConfig';
import { snackActions } from '../main/components/notification';

class ChatService extends FuseUtils.EventEmitter {
    getApiContacts = (params) => {
        const { page, integration_id, sort, show_page_count, showOnlyContactWithLastMessage } = params

        const queryParams = {};
        integration_id && (queryParams["integration_id"] = integration_id)
        sort && (queryParams["sort"] = sort)
        show_page_count && (queryParams["show_page_count"] = show_page_count)
        showOnlyContactWithLastMessage && (queryParams["showOnlyContactWithLastMessage"] = showOnlyContactWithLastMessage)


        return new Promise((resolve, reject) => {
            axiosInstance
                .get(`/api/contacts/page/${page}`, { params: queryParams })
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
    getChatMessages = (params) => {
        const { page, searchParam } = params;

        const queryParams = {};
        searchParam && (queryParams['searchParam'] = searchParam)


        return new Promise((resolve, reject) => {
            axiosInstance.
                get(`api/messages/page/${page}`, { params: queryParams })
                .then(response => {
                    if (response.data) {
                        resolve(response.data);
                    } else {
                        reject(resolve.error)
                    }
                })
                .catch(error => {
                    console.log('Error =>', error);
                    reject(error);
                })
        })
    }

}
const instance = new ChatService();
export default instance;