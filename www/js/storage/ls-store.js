var LocalStorageStore = function(successCallback, errorCallback) {

    this.findByName = function(searchKey, callback) {
        var employees = JSON.parse(window.localStorage.getItem("employees"));
        var results = employees.filter(function(element) {
            var fullName = element.firstName + " " + element.lastName;
            return fullName.toLowerCase().indexOf(searchKey.toLowerCase()) > -1;
        });
        callLater(callback, results);
    }

    this.findById = function(id, callback) {
        var employees = JSON.parse(window.localStorage.getItem("employees"));
        var employee = null;
        var l = employees.length;
        for (var i=0; i < l; i++) {
            if (employees[i].id === id) {
                employee = employees[i];
                break;
            }
        }
        callLater(callback, employee);
    }

    // Used to simulate async calls. This is done to provide a consistent interface with stores (like WebSqlStore)
    // that use async data access APIs
    var callLater = function(callback, data) {
        if (callback) {
            setTimeout(function() {
                callback(data);
            });
        }
    }

    var employees = [
            { "id": 1, "firstName": "Ian", "lastName": "Williams", "img": "ian.png", "title": "Director", "managerId": 0, "city": "Brighton", "email": "ian@takkaproductions.co.uk", "description": "Ian is our resident number cruncher and data guru, with vast experience of finding creative solutions to deep and involved technical problems. After 10 years building in-house systems for large financial services companies, he moved into the web world 6 years ago and now applies those industrial strength database and coding skills to all our larger projects." },
            { "id": 2, "firstName": "Jon", "lastName": "Maskrey", "img": "jon.png", "title": "Front-end developer and User Experience (UX) designer", "managerId": 1, "city": "Somewhere in Wales", "email": "jon@takkaproductions.co.uk", "description": "Jon is a front-end developer and User Experience (UX) designer. Always keen to be up to date with the latest tech developments, with Jon involved you can always guarantee receiving a cutting edge site design with plenty of bells and whistles." },
            { "id": 3, "firstName": "James", "lastName": "Pearson", "img": "james.png", "title": "Front-end developer", "managerId": 1, "city": "Norwich", "email": "james@takkaproductions.co.uk", "description": "James has 15 years of diverse web experience, working with B2B clients large and small both as a project manager and as the lead system architect. He is a talented web designer and developer. There is nothing James hasn't seen in the world of web applications, so is never phased by left-field requirements that others might write off as impossible or just plain crazy." }
    ];

    //window.localStorage.setItem("employees", JSON.stringify(employees));

    callLater(successCallback);

}