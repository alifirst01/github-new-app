import { AxiosInstance } from 'axios';

interface TrendingRepository{
    getRepos():Promise<GetReposResult>;
}

export default class TrendingRepositoryImpl implements TrendingRepository{
    constructor(private axios: AxiosInstance){
    }
    
    getRepos():Promise<HttpNetworkRequestResult>  {
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
            try {
                var trendingRepos: Repo[] = [];
                response.data.items.forEach((item: any) => {
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
                    response: trendingRepos
                });
            } catch (error) {
                throw {status: 500, error: error};
            }
            
        })
        .catch(error => {
            return Promise.resolve({
                statusCode: error.status,
                error: error.error,
            })
        });
    }

}