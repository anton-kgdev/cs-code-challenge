const FAILURE_ROUTE = '/failure';
const MOCK_RESULT = [{ id: 1 }, { id: 2 }];

let fetchCalls = 0;

function fetch(url) {
    fetchCalls += 1;

    return ({
        ok: url !== FAILURE_ROUTE,
        json: () => MOCK_RESULT
    })
}


describe("Exercise 1", function() {
    it("fetch was called on init", function() {
        chai.expect(fetchCalls).be.equal(1);
    })

    it("fetchData returns result", function(done) {
        fetchData('users')
            .then((data) => {
                chai.expect(data).be.equal(MOCK_RESULT)
                done();
            });
    });

    it("fetchData returns error", function(done) {
        fetchData(FAILURE_ROUTE)
            .catch((err) => {
                chai.expect(err.message).be.equal('Data was fetched with error. ' + FAILURE_ROUTE);
                done();
            });
    });

});
