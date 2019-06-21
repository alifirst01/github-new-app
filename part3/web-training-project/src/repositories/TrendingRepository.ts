import { AxiosInstance } from 'axios';

interface TrendingRepository{
    getRepos():Promise<GetReposResult>;
}

export default class TrendingRepositoryImpl implements TrendingRepository{
    constructor(private axios: AxiosInstance){
    }
    
    getRepos():Promise<GetReposResult>  {
        var url = 'https://api.github.com/search/repositories';
        var yesterday = new Date(new Date().getTime() - (24 * 60 * 60 * 1000));
        let params = {
            'q': 'typescript',
            'sort': 'stars',
            'order': 'desc',
            'pushed': yesterday + '..*',
        };
        
        return this.axios.get(url, {
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
        }).then((networkResult: HttpNetworkRequestResult) => {
            let result: GetReposResult;
            if(networkResult.statusCode >= 500)
                result = {
                    error: new Error("Sorry, system is down. Check back later and try again.")
                }
            else
                result = {
                    repos: networkResult.response
                }
            return Promise.resolve(result);
        })
        .catch(error => {
            return Promise.resolve({
                error: error,
            })
        });
    }

}