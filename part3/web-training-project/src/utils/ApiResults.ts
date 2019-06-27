/**
  * Interface to communicate between controllers and repositories
*/
interface HttpNetworkRequestResult {
    statusCode?: number 
    response?: any
    error?: Error
}

/**
  * Different Interfaces to communicate between controllers and their respective components
*/
interface GetReposResult {
    repos?: Repo[]
    error?: Error 
}

interface GetIssuesResult {
    issues?: Issue[]
    error?: Error
}

interface GetGithubAuthResult {
    accessToken?: string
    error?: Error
}