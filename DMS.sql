USE [Sitecore_analytics]
GO

DECLARE @visitorId uniqueidentifier;
DECLARE @visitId uniqueidentifier;
DECLARE @pageId uniqueidentifier;

-- The number of contacts to populate
DECLARE @contactCount INT = 1;

WHILE @contactCount > 0
BEGIN
   
   SET @visitorId = NEWID();
   INSERT INTO [dbo].[Visitors]
           ([VisitorId]
           ,[VisitorClassification]
           ,[OverrideVisitorClassification]
           ,[VisitCount]
           ,[Value]
           ,[AuthenticationLevel]
           ,[ExternalUser]
           ,[IntegrationId]
           ,[IntegrationLabel])
     VALUES
           (@visitorId
           ,0
           ,0
           ,1
           ,0
           ,0
           ,''
           ,'00000000-0000-0000-0000-000000000000'
           ,'');

	SET @visitId = NEWID();
	INSERT INTO [dbo].[Visits]
           ([VisitId]
           ,[VisitorId]
           ,[VisitorVisitIndex]
           ,[VisitPageCount]
           ,[StartDateTime]
           ,[EndDateTime]
           ,[TrafficType]
           ,[Value]
           ,[AspNetSessionId]
           ,[ReferringSiteId]
           ,[KeywordsId]
           ,[BrowserId]
           ,[UserAgentId]
           ,[OsId]
           ,[ScreenId]
           ,[CampaignId]
           ,[RDNS]
           ,[MultiSite]
           ,[LocationId]
           ,[Ip]
           ,[BusinessName]
           ,[City]
           ,[PostalCode]
           ,[MetroCode]
           ,[AreaCode]
           ,[Region]
           ,[IspName]
           ,[Country]
           ,[Latitude]
           ,[Longitude]
           ,[TestSetId]
           ,[TestValues]
           ,[Referrer]
           ,[State]
           ,[StateChanged]
           ,[DeviceName]
           ,[Language])
     VALUES
           (@visitId
           ,@visitorId
           ,1
           ,2
           ,GETDATE()
           ,DATEADD(millisecond,200,GETDATE())
           ,20
           ,0
           ,NEWID()
           ,'D98C1DD4-008F-04B2-E980-0998ECF8427E'
           ,'D98C1DD4-008F-04B2-E980-0998ECF8427E'
           ,'307E992A-479B-3263-5B16-579E4AF45250'
           ,'F5A459CC-9052-7ECF-5ADC-96B38AA5FD6E'
           ,'39F9B81F-FAE1-75F6-E04C-A986AFAAB2FE'
           ,'92E43E01-71A2-6749-18BF-B8D0423A9428'
           ,NULL
           ,'127.0.0.1'
           ,'website'
           ,'F21C9B03-5AEF-84FE-366D-6790CDA97398'
           ,0x7F000001
           ,'IP_NOT_FOUND'
           ,''
           ,''
           ,''
           ,''
           ,''
           ,''
           ,'N/A'
           ,0
           ,0
           ,NULL
           ,NULL
           ,''
           ,1
           ,GETDATE()
           ,'Default'
           ,'en');

	SET @pageId = NEWID();
	INSERT INTO [dbo].[Pages]
           ([PageId]
           ,[VisitId]
           ,[VisitorId]
           ,[VisitPageIndex]
           ,[DateTime]
           ,[ItemId]
           ,[ItemLanguage]
           ,[ItemVersion]
           ,[DeviceId]
           ,[Url]
           ,[UrlText]
           ,[TestSetId]
           ,[TestValues]
           ,[Duration]
           ,[Data]
           ,[DeviceName])
    VALUES
           (@pageId
           ,@visitId
           ,@visitorId
           ,1
           ,GETDATE()
           ,'110D559F-DEA5-42EA-9C1C-8A5DF7E70EF9'
           ,'en'
           ,1
           ,'FE5D7FDF-89C0-4D99-9AA3-B5FBD009C9F3'
           ,'/'
           ,'/'
           ,NULL
           ,NULL
           ,FLOOR(RAND()*(10000-1000)+1000)
           ,''
           ,'Default');

   SET @contactCount = @contactCount - 1;

END




