import TrendingRepository from "@/repositories/TrendingRepository"

export default class TrendingController {
    constructor(private trendingRepository: TrendingRepository) {
    }

    async getTrendingRepos(): Promise<GetReposResult> {
        return this.trendingRepository.getRepos().then((networkResult: HttpNetworkRequestResult) => {
            let result: GetReposResult;
            if (networkResult.error){
                if(networkResult.statusCode! >= 500)
                    result = {
                        error: new Error("Sorry, system is down. Check back later and try again.")
                    }
                else
                    result = {
                        error: new Error("An error occurred while fetching the trending repositories from Github. Try again later....")
                    }
            }
            else{
                result = { 
                    repos: networkResult.response
                }
            }
            return Promise.resolve(result);
        });
    }
}