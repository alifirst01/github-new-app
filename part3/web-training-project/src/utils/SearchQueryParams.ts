/**
  * Interface to query parameters for trending repositories search query.
*/
interface SearchQueryParams {
    keywords: string[],
    sortBy: string,
    orderBy: string,
    lastUpdated: Date, 
    pageNum: number,
}