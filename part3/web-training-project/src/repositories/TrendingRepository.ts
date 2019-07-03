import { AxiosInstance } from "axios"

interface TrendingRepository{
    getRepos(queryParams: SearchQueryParams): Promise<GetReposResult>;
}

export default class TrendingRepositoryImpl implements TrendingRepository {
    constructor(private axios: AxiosInstance) {
    }

    /**
     * Get the top starred Typescript public repositories in the past 24 hours.
     */
    getRepos(queryParams: SearchQueryParams): Promise<HttpNetworkRequestResult> {
        var url = "https://api.github.com/search/repositories";
        let params = {
            'q': "topic:" + queryParams.keywords.join(" topic:"),
            ...((queryParams.sortBy != "") && {'sort': queryParams.sortBy}),
            ...((queryParams.orderBy != "") && {'order': queryParams.orderBy}),
            ...(((<any>new Date() - <any>queryParams.lastUpdated) / 3600000) > 24 && {'pushed': queryParams.lastUpdated + '..*'}),
        };
        var headers: Object = {};
        if(queryParams.keywords.length > 1)
            headers = {"Accept": "application/vnd.github.mercy-preview+json"}
        
        return this.axios.get(url, {
            params: params,
            headers: headers,
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
                throw error;
            }
            
        })
        .catch(error => {
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