import React from "react";
import { markdown, ReactSpecimen } from "@catalog/core";

import { VideoMeta } from "@montage/ui/src/components";

export default () => markdown`

# Video Meta — Basic Variations

## When Keep synchronization hasn’t been initialized yet

${(
  <ReactSpecimen>
    <VideoMeta
      arcDate={null}
      channelTitle="Channel Title"
      currentTime={0}
      favourited
      videoId="11503"
      pubDate="2019-03-22T19:14:14.000Z"
      recDate="1989-01-13T01:22:14.000Z"
      recDateOverriden
      onRecDateChange={(payload, callback) => {
        console.log("onRecDateChange, payload:", payload);
        setTimeout(() => callback(), 2000);
      }}
      videoDescription="Description"
      videoBackups={{
        backupIds: [],
        backups: []
      }}
      videoPlaces={[]}
      videoViewCount="222"
      onTriggerArchive={(payload, callback) => {
        console.log("onTriggerArchive, payload:", payload);
        setTimeout(() => callback(), 2000);
      }}
      onTriggerFavourite={(payload, callback) => {
        console.log("onTriggerFavourite, payload:", payload);
        setTimeout(() => callback(), 2000);
      }}
      //
      onTriggerKeep={callback => {
        console.log("onTriggerKeep");
        setTimeout(() => callback(), 2000);
      }}
    />
  </ReactSpecimen>
)}

## When Keep synchronization failed on at least one item

${(
  <ReactSpecimen>
    <VideoMeta
      arcDate={null}
      channelTitle="Channel Title"
      currentTime={0}
      favourited={false}
      pubDate="2019-03-22T19:14:14.000Z"
      recDate={null}
      recDateOverriden={false}
      videoDescription="Description"
      videoPlaces={[]}
      videoId="11503"
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
                status: "ERROR",
                url: "https://archive.org/…/media/…/x/y/z.mp4"
              }
            ]
          }
        ]
      }}
      videoViewCount="222"
      onTriggerArchive={(payload, callback) => {
        console.log("onTriggerArchive, payload:", payload);
        setTimeout(() => callback(), 2000);
      }}
      onRecDateChange={(payload, callback) => {
        console.log("onRecDateChange, payload:", payload);
        setTimeout(() => callback(), 2000);
      }}
      onTriggerFavourite={(payload, callback) => {
        console.log("onTriggerFavourite, payload:", payload);
        setTimeout(() => callback(), 2000);
      }}
      //
      onTriggerKeep={callback => {
        console.log("onTriggerKeep");
        setTimeout(() => callback(), 2000);
      }}
    />
  </ReactSpecimen>
)}

## When video has at least one Keep-synced location

${(
  <ReactSpecimen>
    <VideoMeta
      arcDate={null}
      channelTitle="Channel Title"
      currentTime={0}
      favourited={false}
      pubDate="2019-03-22T19:14:14.000Z"
      videoDescription="Description"
      videoPlaces={[]}
      videoId="11503"
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
      videoViewCount="222"
      onTriggerArchive={(payload, callback) => {
        console.log("onTriggerArchive, payload:", payload);
        setTimeout(() => callback(), 2000);
      }}
      onTriggerFavourite={(payload, callback) => {
        console.log("onTriggerFavourite, payload:", payload);
        setTimeout(() => callback(), 2000);
      }}
      //
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

`;
