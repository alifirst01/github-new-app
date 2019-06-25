interface HttpNetworkRequestResult {
    statusCode?: number 
    response?: any
    error?: Error
}

interface GetReposResult {
    repos?: Repo[]
    error?: Error 
}

interface GetIssuesResult {
    issues?: Issue[]
    error?: Error
}

interface GetGithubAuthResult{
    accessToken?: string
    error?: Error
}