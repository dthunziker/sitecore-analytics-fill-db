xDB = {};

// Shims
var BinData = BinData || function (type, data) { return data; };
var ISODate = ISODate || function (date) { return date };
var print = print || function (msg) { console.log(msg); };

// Welcome
print('\r\n');
print('xDB loaded...');
print('Fill database using xDB.fill(<host:port/analyticsDbName>).');
print('Type \'xDB.settings\' to view available settings.');
print('\r\n');

// Settings
xDB.settings = {
    contacts: 10000,
    interactionsPerContact: 5,
    timeOnSite: 120, // In seconds
    dayOffset: 30, // How many days to spread the data across
    pagesPerInteraction: 4
};

// Seed data (randomly assigned)
xDB.seedData = {

	// [OS, BrowserName, BrowserVersion, UserAgent]
    devices: [
      ['Windows 8.1', 'Chrome', '43.0', 'Mozilla/5.0 (Windows NT 6.3; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/43.0.2357.124 Safari'],
      ['Windows 7', 'Chrome', '41.0', 'Mozilla/5.0 (Windows NT 6.1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/41.0.2228.0 Safari/537.36'],
      ['OSX Yosemite', 'Chrome', '41.0', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_10_1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/41.0.2227.1 Safari/537.36'],
      ['Linux', 'Chrome', '41.0', 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/41.0.2227.0 Safari/537.36'],
      ['Linux', 'Chrome', '41.0', 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/41.0.2227.0 Safari/537.36'],
      ['Windows 7', 'Chrome', '41.0', 'Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/41.0.2227.0 Safari/537.36'],
      ['Windows 8.1', 'Chrome', '41.0', 'Mozilla/5.0 (Windows NT 6.3; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/41.0.2226.0 Safari/537.36'],
      ['Windows 8.1', 'Chrome', '41.0', 'Mozilla/5.0 (Windows NT 6.3; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/41.0.2226.0 Safari/537.36'],
      ['OpenBSD', 'Chrome', '36.0', 'Mozilla/5.0 (X11; OpenBSD i386) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/36.0.1985.125 Safari/537.36'],
      ['OSX Mavericks', 'Chrome', '36.0', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_9_2) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/36.0.1944.0 Safari/537.36'],
      ['OSX Mavericks', 'Chrome', '35.0', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_9_3) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/35.0.1916.47 Safari/537.36']
    ]
};

xDB.helperMethods = {

    // http://stackoverflow.com/a/2117523/185749
    randomGuid: function () {
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
            var r = Math.random() * 16 | 0,
              v = c == 'x' ? r : (r & 0x3 | 0x8);
            return v.toString(16);
        });
    },

    // https://github.com/mongodb/mongo-csharp-driver/blob/master/uuidhelpers.js
    hexToBase64: function (hex) {
        var base64Digits = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
        var base64 = "";
        var group;
        for (var i = 0; i < 30; i += 6) {
            group = parseInt(hex.substr(i, 6), 16);
            base64 += base64Digits[(group >> 18) & 0x3f];
            base64 += base64Digits[(group >> 12) & 0x3f];
            base64 += base64Digits[(group >> 6) & 0x3f];
            base64 += base64Digits[group & 0x3f];
        }
        group = parseInt(hex.substr(30, 2), 16);
        base64 += base64Digits[(group >> 2) & 0x3f];
        base64 += base64Digits[(group << 4) & 0x3f];
        base64 += "==";
        return base64;
    },

    // https://github.com/mongodb/mongo-csharp-driver/blob/master/uuidhelpers.js
    randomGuidBase64: function () {
        var guid = xDB.helperMethods.randomGuid();
        var hex = guid.replace(/[{}-]/g, "");
        var a = hex.substr(6, 2) + hex.substr(4, 2) + hex.substr(2, 2) + hex.substr(0, 2);
        var b = hex.substr(10, 2) + hex.substr(8, 2);
        var c = hex.substr(14, 2) + hex.substr(12, 2);
        var d = hex.substr(16, 16);
        hex = a + b + c + d;
        var base64 = xDB.helperMethods.hexToBase64(hex);
        return base64;
    },

    msToTime: function (ms) {
        var milliseconds = parseInt((ms % 1000) / 100)
        ,seconds = parseInt((ms / 1000) % 60)
        ,minutes = parseInt((ms / (1000 * 60)) % 60)
        ,hours = parseInt((ms / (1000 * 60 * 60)) % 24);

        hours = (hours < 10) ? "0" + hours : hours;
        minutes = (minutes < 10) ? "0" + minutes : minutes;
        seconds = (seconds < 10) ? "0" + seconds : seconds;

        return hours + ":" + minutes + ":" + seconds + "." + milliseconds;
    }

};

// Base documents
xDB.documents = {

    Interaction: function () {
        return {
            "_id": BinData(3, xDB.helperMethods.randomGuidBase64()),
            "_t": "VisitData",
            "ChannelId": BinData(3, "8uQYtBMQQkugU7bU3KmIvw=="),
            "Screen": {
                "ScreenHeight": 480, // TODO
                "ScreenWidth": 640 // TODO
            },
            "ContactVisitIndex": 1, // TODO
            "DeviceId": BinData(3, "1h+VbRT0I0yAUqg7Jx+DpA=="), // TODO
            "GeoData": {
                "HasData": false // TODO
            },
            "Ip": BinData(0, "fwAAAQ=="), // TODO
            "Language": "en", // TODO
            "LocationId": BinData(3, "78RbL9pa1V901Q5jWoYSuw=="), // TODO
            "MvTest": {
                "ValueAtExposure": 0 // TODO
            },
            "Pages": [],
            "SiteName": "website", // TODO
            "TrafficType": 20, // TODO
            "Value": 0, // TODO
            "VisitPageCount": 3 // TODO
        };
    },

    Contact: function () {
        return {
            "_id": BinData(3, xDB.helperMethods.randomGuidBase64()),
            "System": {
                "VisitCount": 0
            },
            "Lease": null
        };
    },

    Page: function () {
        return {
            "Item": {
                "_id": BinData(3, "n1UNEaXe6kKcHIpd9+cO+Q=="),
                "Language": "en",
                "Version": 1
            },
            "SitecoreDevice": {
                "_id": BinData(3, "339d/sCJmU2ao7X70AnJ8w=="),
                "Name": "Default"
            },
            "MvTest": {
                "ValueAtExposure": 0
            },
            "Url": {
                "Path": "/"
            },
            "VisitPageIndex": 1
        };
    }

};

xDB.fill = function (connectionString) {

    var start = new Date().getTime();
    var db = connect(connectionString);

    print('Filling ' + db.getName() + ' with ' + xDB.settings.contacts + ' contacts...');

    // Init bulk operations
    var bulkContacts = db.Contacts.initializeUnorderedBulkOp();
    var bulkInteractions = db.Interactions.initializeUnorderedBulkOp();

    // Determine overall date interval to spread the data across
    var startDate = new Date();
    startDate.setDate(startDate.getDate() - xDB.settings.dayOffset);
    var intervalMs = parseInt((Date.now() - startDate.getTime()) / xDB.settings.contacts);

    // For each contact
    for (var c = 0; c < xDB.settings.contacts; c++, startDate = new Date(startDate.getTime() + intervalMs)) {

        var contact = new xDB.documents.Contact();
        var interactionIntervalMs = parseInt((xDB.settings.timeOnSite * 1000) / xDB.settings.interactionsPerContact);
        var interactionStartDate = new Date(startDate.getTime());

        // For each interaction
        for (var i = 0; i < xDB.settings.interactionsPerContact; i++, interactionStartDate = new Date(interactionStartDate.getTime() + interactionIntervalMs)) {

            var randomDevice = xDB.seedData.devices[Math.floor((Math.random() * xDB.seedData.devices.length))];

            var interaction = new xDB.documents.Interaction();

            interaction.StartDateTime = ISODate(interactionStartDate.toISOString());
            interaction.EndDateTime = ISODate(new Date(interactionStartDate.getTime() + interactionIntervalMs).toISOString());
            interaction.SaveDateTime = ISODate(new Date(interactionStartDate.getTime() + interactionIntervalMs).toISOString());

            interaction.OperatingSystem = {
                _id: randomDevice[1]
            };
            interaction.Browser = {
                BrowserVersion: randomDevice[2],
                BrowserMajorName: randomDevice[1],
                BrowserMinorName: randomDevice[2]
            };
            interaction.UserAgent = randomDevice[3];
            interaction.ContactId = contact._id;
            contact.System.VisitCount++;

            var pageIntervalMs = parseInt(interactionIntervalMs / xDB.settings.pagesPerInteraction);
            var pageDateTime = new Date(interactionStartDate.getTime());

            // For each page
            for (var p = 1; p <= xDB.settings.pagesPerInteraction; p++, pageDateTime = new Date(pageDateTime.getTime() + pageIntervalMs)) {
                var page = new xDB.documents.Page();
                page.DateTime = ISODate(pageDateTime.toISOString());
                page.Duration = pageIntervalMs;
                page.VisitPageIndex = p;
                interaction.Pages.push(page);
            }

            bulkInteractions.insert(interaction);
        }

        bulkContacts.insert(contact);
    }

    // Finally, execute bulk operations
    bulkContacts.execute();
    bulkInteractions.execute();

    print('Done!');
    print('Time elapsed: ' + xDB.helperMethods.msToTime(new Date().getTime() - start));
}