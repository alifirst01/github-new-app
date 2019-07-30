import { AxiosInstance } from "axios"
import { container, TYPE } from './Container';

interface GithubAuthRepository {
    getAccessToken(accessCode: string): Promise<HttpNetworkRequestResult>;
}

export default class GithubAuthRepositoryImpl implements GithubAuthRepository {
    constructor(private axios: AxiosInstance){
    }

    /**
     * Get access token from github OAuth service using the access code.
     */
    getAccessToken(accessCode: string): Promise<HttpNetworkRequestResult> {
        var url = "https://github-app-login.foundersclubsoftware.now.sh/auth";
        return this.axios({
            method: 'POST',
            url: url, 
            data: {
                'code': accessCode,  
                'state': '12345',
            },
        })
        .then(response => {
            return Promise.resolve({
                response: response.data.access_token
            });
        }).catch(error => {
            let errorResponse: HttpNetworkRequestResult;
            if (error.response)             // The request was made and the server responded with a status code that falls out of the range of 2xx
                errorResponse = {
                    statusCode: (error.response.status)? error.response.status : 400,
                    error: new Error(error.response.data.message ? error.response.data.message : "Server responded with an error"),
                }
            else                            // The request was made but no response was received
                errorResponse = {
                    statusCode: 500,
                    error: new Error(error.message ? error.message: ""),
                }
            return Promise.resolve(errorResponse);
        });

    }
}

container.bind<GithubAuthRepositoryImpl>(TYPE.GithubAuthRepository).toFactory(() => 
    new GithubAuthRepositoryImpl(container.get(TYPE.AxiosInstance))
);