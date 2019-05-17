import React from "react";
import { markdown, ReactSpecimen } from "@catalog/core";

import { VideoMeta } from "@montage/ui/src/components";

export default () => markdown`

# Variations

## Default

${(
  <ReactSpecimen span={3}>
    <VideoMeta
      allocation={[]}
      arcDate={null}
      channelTitle="Channel Title"
      collections={[]}
      currentTime={0}
      favourited={false}
      onCreateCollection={str => console.log("onCreateCollection()", str)}
      onDelete={() => console.log("onDelete()")}
      onManageDupes={() => console.log("onManageDupes()")}
      onRecDateChange={(payload, callback) => {
        console.log("onRecDateChange, payload:", payload);
        setTimeout(() => callback(), 2000);
      }}
      onTriggerArchive={(payload, callback) => {
        console.log("onTriggerArchive, payload:", payload);
        setTimeout(() => callback(), 2000);
      }}
      onTriggerDelete={() => console.log("onTriggerDelete()")}
      onTriggerDuplicates={() => console.log("onTriggerDuplicates()")}
      onTriggerFavourite={(payload, callback) => {
        console.log("onTriggerFavourite, payload:", payload);
        setTimeout(() => callback(), 2000);
      }}
      onTriggerKeep={callback => {
        console.log("onTriggerKeep");
        setTimeout(() => callback(), 2000);
      }}
      onUpdateAllocation={arr => console.log("onUpdateAllocation()", arr)}
      pubDate="2019-03-22T19:14:14.000Z"
      recDate={null}
      recDateOverriden={false}
      videoBackups={{
        backupIds: [],
        backups: []
      }}
      videoDescription="Description"
      videoId="11503"
      videoPlaces={[]}
      videoViewCount="222"
    />
  </ReactSpecimen>
)}

${(
  <ReactSpecimen span={3}>
    <VideoMeta
      allocation={["collectionId1", "collectionId2"]}
      arcDate={null}
      channelTitle="Channel Title"
      collections={[
        { name: "A collection", id: "collectionId1" },
        { name: "Another collection", id: "collectionId2" },
        { name: "Third collection", id: "collectionId3" }
      ]}
      currentTime={0}
      favourited
      onCreateCollection={str => console.log("onCreateCollection()", str)}
      onDelete={() => console.log("onDelete()")}
      onManageDupes={() => console.log("onManageDupes()")}
      onRecDateChange={(payload, callback) => {
        console.log("onRecDateChange, payload:", payload);
        setTimeout(() => callback(), 2000);
      }}
      onTriggerArchive={(payload, callback) => {
        console.log("onTriggerArchive, payload:", payload);
        setTimeout(() => callback(), 2000);
      }}
      onTriggerDelete={() => console.log("onTriggerDelete()")}
      onTriggerDuplicates={() => console.log("onTriggerDuplicates()")}
      onTriggerFavourite={(payload, callback) => {
        console.log("onTriggerFavourite, payload:", payload);
        setTimeout(() => callback(), 2000);
      }}
      onTriggerKeep={callback => {
        console.log("onTriggerKeep");
        setTimeout(() => callback(), 2000);
      }}
      onUpdateAllocation={arr => console.log("onUpdateAllocation()", arr)}
      pubDate="2019-03-22T19:14:14.000Z"
      recDate="1989-01-13T01:22:14.000Z"
      recDateOverriden
      videoBackups={{
        backupIds: ["11503"],
        backups: [
          {
            id: "11503",
            locations: [
              {
                serviceId: "archiveIs",
                status: "OK",
                url: "https://archive.is/…/media/…/x/y/z.mp4"
              },
              {
                serviceId: "archiveOrg",
                status: "OK",
                url: "https://archive.org/…/media/…/x/y/z.mp4"
              }
            ]
          }
        ]
      }}
      videoDescription="Description"
      videoId="11503"
      videoPlaces={[]}
      videoViewCount="222"
    />
  </ReactSpecimen>
)}


## Archived

${(
  <ReactSpecimen span={3}>
    <VideoMeta
      allocation={[]}
      arcDate="2019-03-22T19:14:14.000Z"
      channelTitle="Channel Title"
      collections={[]}
      currentTime={0}
      favourited={false}
      onCreateCollection={str => console.log("onCreateCollection()", str)}
      onDelete={() => console.log("onDelete()")}
      onManageDupes={() => console.log("onManageDupes()")}
      onRecDateChange={(payload, callback) => {
        console.log("onRecDateChange, payload:", payload);
        setTimeout(() => callback(), 2000);
      }}
      onTriggerArchive={(payload, callback) => {
        console.log("onTriggerArchive, payload:", payload);
        setTimeout(() => callback(), 2000);
      }}
      onTriggerDelete={() => console.log("onTriggerDelete()")}
      onTriggerDuplicates={() => console.log("onTriggerDuplicates()")}
      onTriggerFavourite={(payload, callback) => {
        console.log("onTriggerFavourite, payload:", payload);
        setTimeout(() => callback(), 2000);
      }}
      onTriggerKeep={callback => {
        console.log("onTriggerKeep");
        setTimeout(() => callback(), 2000);
      }}
      onUpdateAllocation={arr => console.log("onUpdateAllocation()", arr)}
      pubDate="2019-03-22T19:14:14.000Z"
      recDate={null}
      recDateOverriden={false}
      videoBackups={{
        backupIds: [],
        backups: []
      }}
      videoDescription="Description"
      videoId="11503"
      videoPlaces={[]}
      videoViewCount="222"
    />
  </ReactSpecimen>
)}


${(
  <ReactSpecimen span={3}>
    <VideoMeta
      allocation={["collectionId1", "collectionId2"]}
      arcDate="2019-03-22T19:14:14.000Z"
      channelTitle="Channel Title"
      collections={[
        { name: "A collection", id: "collectionId1" },
        { name: "Another collection", id: "collectionId2" },
        { name: "Third collection", id: "collectionId3" }
      ]}
      currentTime={0}
      favourited
      onCreateCollection={str => console.log("onCreateCollection()", str)}
      onDelete={() => console.log("onDelete()")}
      onManageDupes={() => console.log("onManageDupes()")}
      onRecDateChange={(payload, callback) => {
        console.log("onRecDateChange, payload:", payload);
        setTimeout(() => callback(), 2000);
      }}
      onTriggerArchive={(payload, callback) => {
        console.log("onTriggerArchive, payload:", payload);
        setTimeout(() => callback(), 2000);
      }}
      onTriggerDelete={() => console.log("onTriggerDelete()")}
      onTriggerDuplicates={() => console.log("onTriggerDuplicates()")}
      onTriggerFavourite={(payload, callback) => {
        console.log("onTriggerFavourite, payload:", payload);
        setTimeout(() => callback(), 2000);
      }}
      onTriggerKeep={callback => {
        console.log("onTriggerKeep");
        setTimeout(() => callback(), 2000);
      }}
      onUpdateAllocation={arr => console.log("onUpdateAllocation()", arr)}
      pubDate="2019-03-22T19:14:14.000Z"
      recDate="1989-01-13T01:22:14.000Z"
      recDateOverriden
      videoBackups={{
        backupIds: ["11503"],
        backups: [
          {
            id: "11503",
            locations: [
              {
                serviceId: "archiveIs",
                status: "OK",
                url: "https://archive.is/…/media/…/x/y/z.mp4"
              },
              {
                serviceId: "archiveOrg",
                status: "OK",
                url: "https://archive.org/…/media/…/x/y/z.mp4"
              }
            ]
          }
        ]
      }}
      videoDescription="Description"
      videoId="11503"
      videoPlaces={[]}
      videoViewCount="222"
    />
  </ReactSpecimen>
)}

`;
