interface HttpNetworkRequestResult {
    statusCode?: number 
    response?: any
    error?: Error
}

interface GetReposResult {
    repos?: Repo[]
    error?: Error 
}