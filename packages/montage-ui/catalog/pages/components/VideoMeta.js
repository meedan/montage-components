import React from "react";
import { markdown, ReactSpecimen } from "@catalog/core";

import { VideoMeta } from "@montage/ui/src/components";

export default () => markdown`

# VideoMeta

${(
  <ReactSpecimen span={3}>
    <VideoMeta
      arcDate="2019-03-22T19:14:14.000Z"
      channelTitle="Channel Title"
      currentTime={0}
      favourited={false}
      pubDate="2019-03-22T19:14:14.000Z"
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
      onArchiveClick={(payload, callback) => {
        console.log("onArchiveClick, payload:", payload);
        setTimeout(() => callback(), 1000);
      }}
      onFavouriteClick={(payload, callback) => {
        console.log("onFavouriteClick, payload:", payload);
        setTimeout(() => callback(), 1000);
      }}
      //
      onRecDateChange={date => console.log(date)}
    />
  </ReactSpecimen>
)}

${(
  <ReactSpecimen span={3}>
    <VideoMeta
      arcDate={null}
      channelTitle="Channel Title"
      currentTime={0}
      favourited={false}
      videoId="11503"
      pubDate="2019-03-22T19:14:14.000Z"
      videoDescription="Description"
      videoBackups={{
        backupIds: ["11503"],
        backups: [
          {
            id: "11503",
            locations: [
              {
                serviceId: "archiveIs",
                url: "https://archive.is/…/media/…/x/y/z.mp4"
              },
              {
                serviceId: "archiveOrg",
                url: "https://archive.org/…/media/…/x/y/z.mp4"
              }
            ]
          }
        ]
      }}
      videoBackupSettings={{
        backupServiceIds: ["archiveOrg", "archiveIs"],
        backupServices: [
          { id: "archiveOrg", name: "Archive.org", isActive: true },
          { id: "archiveIs", name: "Archive.Is", isActive: false }
        ]
      }}
      videoPlaces={[]}
      videoViewCount="222"
      onArchiveClick={(payload, callback) => {
        console.log("onArchiveClick, payload:", payload);
        setTimeout(() => callback(), 1000);
      }}
      onFavouriteClick={(payload, callback) => {
        console.log("onFavouriteClick, payload:", payload);
        setTimeout(() => callback(), 1000);
      }}
      //
      onRecDateChange={date => console.log(date)}
    />
  </ReactSpecimen>
)}

`;
