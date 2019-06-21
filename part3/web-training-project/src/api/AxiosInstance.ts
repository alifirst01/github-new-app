import axios from 'axios';

export default interface AxiosInstance{
    get(path: string, params?: Object, headers?: Object): Promise<HttpNetworkRequestResult>
}

class AxiosInstanceImpl implements AxiosInstance{
    get(path: string, params: Object = {}, headers: Object = {}): Promise<HttpNetworkRequestResult> {
        return axios.get(path, {
            headers: headers,
            params: params
        }).then(response => {
            var trendingRepos: Array<Repo> = [];
            response.data.items.forEach(item => {
                trendingRepos.push({
                    url: item.html_url,
                    name: item.name,
                    description: item.description,
                    username: item.owner.login,
                    unameUrl: item.owner.html_url,
                    avatarUrl: item.owner.avatar_url,
                });
            });
            return Promise.resolve({
                statusCode: response.status, 
                response: trendingRepos,
            });
        })
        .catch(error => {
            return Promise.resolve({
                error: error,
            })
        });
    }
}