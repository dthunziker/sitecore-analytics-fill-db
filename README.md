# sitecore-analytics-fill-db
Populate your Sitecore analytics database with sample data

##xDB##

    mongo
    load('xDB.js')
    xDB.settings.contacts = 5000;
    xDB.fill(<host:port/analyticsDbName>)

Finally, rebuild reporting DB and update connection strings

##DMS##

Run SQL script from SQL Management Studio
