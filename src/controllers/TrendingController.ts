import "@/repositories/TrendingRepository";
import TrendingRepository from "@/repositories/TrendingRepository";
import { container, TYPE } from '@/repositories/Container';

export default class TrendingController {
    constructor(private trendingRepository: TrendingRepository) {}

    async getTrendingRepos(queryParams: SearchQueryParams): Promise<GetReposResult> {
        return this.trendingRepository.getRepos(queryParams).then((networkResult: HttpNetworkRequestResult) => {
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
                    repos: networkResult.response.trendingRepos,
                    no_of_pages: networkResult.response.no_of_pages,
                }
            }
            return Promise.resolve(result);
        });
    }
}

container.bind<TrendingController>(TYPE.TrendingController).toFactory(() => 
    new TrendingController(container.get(TYPE.TrendingRepository))
);