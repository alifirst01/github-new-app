import TrendingRepository from "@/repositories/TrendingRepository";

export default class TrendingController{
    constructor(private trendingRepository: TrendingRepository){
    }

    async getTrendingRepos(): Promise<Repo[]>{
        return this.trendingRepository.getRepos().then((result: GetReposResult) => {
            if (result.error){
                let error:Error;
                if(result.error.message.includes('system is down'))
                    error = result.error;
                else
                    error = new Error("An error occurred while fetching the trending repositories from Github. Try again later....");
                return Promise.reject(error);
            }
            else{
                let repos = result.repos!;
                return Promise.resolve(repos);
            }
        });
    }
}