import { AxiosInstance } from 'axios';

interface GithubAuthRepository{
    getAccessToken(accessCode: string):Promise<HttpNetworkRequestResult>;
}

export default class GithubAuthRepositoryImpl implements GithubAuthRepository{
    constructor(private axios: AxiosInstance){
    }

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
            return Promise.resolve({
                statusCode: error.status,
                error: error,
            });
        });

    }
}