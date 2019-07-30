import DateMixin from "@/mixins/DateMixin"

describe("DateMixin unit tests", () => {
    describe("updateTimeDiff()", () => {
        it("should set timeDiff to x hrs ago if lastUpdated is more than x hours ago", () => {
            let dateMixin: DateMixin = new DateMixin();
            
            dateMixin.lastUpdated = new Date();
            dateMixin.lastUpdated.setHours(dateMixin.lastUpdated.getHours() - 2);
            
            dateMixin.updateTimeDiff();

            let expected: string = "2 hrs ago";
            expect(dateMixin.timeDiff).toEqual(expected);
        });

        it("should set timeDiff to x mins ago if lastUpdated is more than x mins ago but less than an hour ago", () => {
            let dateMixin: DateMixin = new DateMixin();
            
            dateMixin.lastUpdated = new Date();
            dateMixin.lastUpdated.setMinutes(dateMixin.lastUpdated.getMinutes() - 59);
            
            dateMixin.updateTimeDiff();

            let expected: string = "59 mins ago";
            expect(dateMixin.timeDiff).toEqual(expected);
        });

        it("should set timeDiff to now if lastUpdated is less than a minute ago", () => {
            let dateMixin: DateMixin = new DateMixin();
            
            dateMixin.lastUpdated = new Date();
            dateMixin.lastUpdated.setSeconds(dateMixin.lastUpdated.getSeconds() - 59);
            
            dateMixin.updateTimeDiff();

            let expected: string = "now";
            expect(dateMixin.timeDiff).toEqual(expected);
        });
    });
})