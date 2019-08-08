/*
* Let's pretend that the function below exists in our application's source code directory: `src/`. The code exists here, in this file, for demonstration purposes. 
*/

/**
 * Add 2 numbers together. Pretty simple. 
 */
const addTogether = (first: number, second: number): number => {
    return first + second 
}

describe("Sample unit tests", () => {
    describe("addTogether() unit tests", () => {
        it("2 + 3, expect to be 5", () => {
            let givenFirst = 2
            let givenSecond = 3
            let expectedValue = 5

            let actual = addTogether(givenFirst, givenSecond)

            expect(actual).toBe(expectedValue)
        })
        it("3 + 2, expect to also be 5", () => {
            let givenFirst = 3
            let givenSecond = 2
            let expectedValue = 5

            let actual = addTogether(givenFirst, givenSecond)

            expect(actual).toBe(expectedValue)
        })
    })
})