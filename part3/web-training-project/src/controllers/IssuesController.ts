import IssuesRepository from "@/repositories/IssuesRepository";


export default class IssuesController{
    constructor(private issuesRepository: IssuesRepository){
    }

    async getUserIssues(): Promise<GetIssuesResult>{
        return this.issuesRepository.getIssues().then((networkResult: HttpNetworkRequestResult) => {
            let result: GetIssuesResult;
            if (networkResult.error){
                if(networkResult.statusCode >= 500)
                    result = {
                        error: new Error("Sorry, system is down. Check back later and try again.")
                    }
                else
                    result = {
                        error: new Error("An error occured in fetching github issues. Please try again")
                    }
            }
            else{
                result = { 
                    issues: networkResult.response
                }
            }
            return Promise.resolve(result);
        });
    }
}