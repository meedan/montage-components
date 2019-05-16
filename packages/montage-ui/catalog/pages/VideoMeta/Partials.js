import React from "react";
import { markdown, ReactSpecimen } from "@catalog/core";

import Archive from "@montage/ui/src/components/VideoMeta/of/Archive";
import Favourite from "@montage/ui/src/components/VideoMeta/of/Favourite";
import Keep from "@montage/ui/src/components/VideoMeta/of/Keep";
import RecordedDate from "@montage/ui/src/components/VideoMeta/of/RecordedDate";

export default () => markdown`

# Video Meta — Partials

## Fav/Unfav

${(
  <ReactSpecimen span={3}>
    <Favourite
      onTriggerFavourite={(payload, callback) => {
        console.log("onTriggerFavourite, payload:", payload);
        setTimeout(() => callback(), 2000);
      }}
      isFavourited={false}
    />
  </ReactSpecimen>
)}
${(
  <ReactSpecimen span={3}>
    <Favourite
      onTriggerFavourite={(payload, callback) => {
        console.log("onTriggerFavourite, payload:", payload);
        setTimeout(() => callback(), 2000);
      }}
      isFavourited
    />
  </ReactSpecimen>
)}

## Archive/Unarchive

${(
  <ReactSpecimen span={3}>
    <Archive
      onTriggerArchive={(payload, callback) => {
        console.log("onTriggerArchive, payload:", payload);
        setTimeout(() => callback(), 2000);
      }}
      isArchived={false}
    />
  </ReactSpecimen>
)}
${(
  <ReactSpecimen span={3}>
    <Archive
      onTriggerArchive={(payload, callback) => {
        console.log("onTriggerArchive, payload:", payload);
        setTimeout(() => callback(), 2000);
      }}
      isArchived
    />
  </ReactSpecimen>
)}

## Keep

### Default

${(
  <ReactSpecimen span={2}>
    <Keep
      isArchived={false}
      onTriggerKeep={callback => {
        console.log("onTriggerKeep()");
        setTimeout(() => callback(), 2000);
      }}
      videoBackups={{ backupIds: [], backups: [] }}
      videoId="11503"
    />
  </ReactSpecimen>
)}

${(
  <ReactSpecimen span={2}>
    <Keep
      isArchived={false}
      onTriggerKeep={callback => {
        console.log("onTriggerKeep()");
        setTimeout(() => callback(), 2000);
      }}
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
      videoId="11503"
    />
  </ReactSpecimen>
)}

${(
  <ReactSpecimen span={2}>
    <Keep
      isArchived={false}
      onTriggerKeep={callback => {
        console.log("onTriggerKeep()");
        setTimeout(() => callback(), 2000);
      }}
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
      videoId="11503"
    />
  </ReactSpecimen>
)}


### Archived

${(
  <ReactSpecimen span={2}>
    <Keep
      isArchived
      onTriggerKeep={callback => {
        console.log("onTriggerKeep()");
        setTimeout(() => callback(), 2000);
      }}
      videoBackups={{ backupIds: [], backups: [] }}
      videoId="11503"
    />
  </ReactSpecimen>
)}

${(
  <ReactSpecimen span={2}>
    <Keep
      isArchived
      onTriggerKeep={callback => {
        console.log("onTriggerKeep()");
        setTimeout(() => callback(), 2000);
      }}
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
      videoId="11503"
    />
  </ReactSpecimen>
)}

${(
  <ReactSpecimen span={2}>
    <Keep
      isArchived
      onTriggerKeep={callback => {
        console.log("onTriggerKeep()");
        setTimeout(() => callback(), 2000);
      }}
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
      videoId="11503"
    />
  </ReactSpecimen>
)}

## Recorded date

### Default

${(
  <ReactSpecimen span={2}>
    <RecordedDate
      isArchived={false}
      onRecDateChange={(payload, callback) => {
        console.log("onRecDateChange, payload:", payload);
        setTimeout(() => callback(), 2000);
      }}
      recDate={null}
      recDateOverriden={false}
    />
  </ReactSpecimen>
)}

${(
  <ReactSpecimen span={2}>
    <RecordedDate
      isArchived={false}
      onRecDateChange={(payload, callback) => {
        console.log("onRecDateChange, payload:", payload);
        setTimeout(() => callback(), 2000);
      }}
      recDate="1989-01-13T01:22:14.000Z"
      recDateOverriden={false}
    />
  </ReactSpecimen>
)}

${(
  <ReactSpecimen span={2}>
    <RecordedDate
      isArchived={false}
      onRecDateChange={(payload, callback) => {
        console.log("onRecDateChange, payload:", payload);
        setTimeout(() => callback(), 2000);
      }}
      recDate="1989-01-13T01:22:14.000Z"
      recDateOverriden
    />
  </ReactSpecimen>
)}

### Archived

${(
  <ReactSpecimen span={2}>
    <RecordedDate
      isArchived
      onRecDateChange={(payload, callback) => {
        console.log("onRecDateChange, payload:", payload);
        setTimeout(() => callback(), 2000);
      }}
      recDate={null}
      recDateOverriden={false}
    />
  </ReactSpecimen>
)}

${(
  <ReactSpecimen span={2}>
    <RecordedDate
      isArchived
      onRecDateChange={(payload, callback) => {
        console.log("onRecDateChange, payload:", payload);
        setTimeout(() => callback(), 2000);
      }}
      recDate="1989-01-13T01:22:14.000Z"
      recDateOverriden={false}
    />
  </ReactSpecimen>
)}

${(
  <ReactSpecimen span={2}>
    <RecordedDate
      isArchived
      onRecDateChange={(payload, callback) => {
        console.log("onRecDateChange, payload:", payload);
        setTimeout(() => callback(), 2000);
      }}
      recDate="1989-01-13T01:22:14.000Z"
      recDateOverriden
    />
  </ReactSpecimen>
)}

`;
