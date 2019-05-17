import React from "react";
import { markdown, ReactSpecimen } from "@catalog/core";

import { VideoMeta } from "@montage/ui/src/components";

export default () => markdown`

# Video Meta — Archived Variations

## When video hasn’t been saved to Keep

${(
  <ReactSpecimen>
    <VideoMeta
      allocation={["collectionId1", "collectionId2"]}
      collections={[
        {
          name: "A collection",
          id: "collectionId1"
        },
        {
          name: "Another collection",
          id: "collectionId2"
        },
        {
          name: "Third collection",
          id: "collectionId3"
        }
      ]}
      onCreateCollection={str => console.log("onCreateCollection()", str)}
      onDelete={() => console.log("onDelete()")}
      onManageDupes={() => console.log("onManageDupes()")}
      onTriggerDelete={() => console.log("onTriggerDelete()")}
      onTriggerDuplicates={() => console.log("onTriggerDuplicates()")}
      onUpdateAllocation={arr => console.log("onUpdateAllocation()", arr)}
      arcDate="2019-03-22T19:14:14.000Z"
      channelTitle="Channel Title"
      currentTime={0}
      favourited={false}
      pubDate="2019-03-22T19:14:14.000Z"
      recDate="1989-01-13T01:22:14.000Z"
      recDateOverriden={false}
      videoDescription="Description"
      videoPlaces={[]}
      videoId="11503"
      videoBackups={{
        backupIds: [],
        backups: []
      }}
      videoBackupSettings={{
        backupServiceIds: ["archiveOrg", "archiveIs"],
        backupServices: [
          { id: "archiveOrg", name: "Archive.org", isActive: true },
          { id: "archiveIs", name: "Archive.Is", isActive: false }
        ]
      }}
      videoViewCount="222"
      onTriggerArchive={(payload, callback) => {
        console.log("onTriggerArchive, payload:", payload);
        setTimeout(() => callback(), 2000);
      }}
      onTriggerFavourite={(payload, callback) => {
        console.log("onTriggerFavourite, payload:", payload);
        setTimeout(() => callback(), 2000);
      }}
      onRecDateChange={(payload, callback) => {
        console.log("onRecDateChange, payload:", payload);
        setTimeout(() => callback(), 2000);
      }}
      onTriggerKeep={callback => {
        console.log("onTriggerKeep");
        setTimeout(() => callback(), 2000);
      }}
    />
  </ReactSpecimen>
)}

## When video has at least one Keep-synced location

`;
