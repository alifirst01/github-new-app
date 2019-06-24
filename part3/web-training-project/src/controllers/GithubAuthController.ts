import GithubAuthRepository from "@/repositories/GithubAuthRepository";


export default class GithubAuthController{
    constructor(private githubAuthRepository: GithubAuthRepository){
    }

    async getGithubAccessToken(accessCode: string): Promise<GetGithubAuthResult>{
        return this.githubAuthRepository.getAccessToken(accessCode).then((networkResult: HttpNetworkRequestResult) => {
            let result: GetGithubAuthResult;
            if (networkResult.error){
                if(networkResult.statusCode >= 500)
                    result = {
                        error: new Error("Sorry, server is down. Check back later and try again.")
                    }
                else
                    result = {
                        error: new Error("Error: Could not retrieve accessToken from github.com. Please try again")
                    }
            }
            else{
                result = { 
                    accessToken: networkResult.response
                }
            }
            return Promise.resolve(result);
        });
    }
}