# Partials

## Fav/Unfav

```react
state: { fav: false }
span: 3
---
<Favourite
  onTriggerFavourite={(payload, callback) => {
    console.log("onTriggerFavourite, payload:", payload);
    setTimeout(() => {
      setState({fav: payload})
      callback()
    }, 2000);
  }}
  isFavourited={state.fav}
/>
```

```react
state: { fav: true }
span: 3
---
<Favourite
  onTriggerFavourite={(payload, callback) => {
    console.log("onTriggerFavourite, payload:", payload);
    setTimeout(() => {
      setState({fav: payload})
      callback()
    }, 2000);
  }}
  isFavourited={state.fav}
/>
```

## Archive/Unarchive

```react
state: { arch: false }
span: 3
---
<Archive
  onTriggerArchive={(payload, callback) => {
    console.log("onTriggerArchive, payload:", payload);
    setTimeout(() => {
      setState({arch: payload})
      callback();
    }, 2000);
  }}
  isArchived={state.arch}
/>
```

```react
state: { arch: true }
span: 3
---
<Archive
  onTriggerArchive={(payload, callback) => {
    console.log("onTriggerArchive, payload:", payload);
    setTimeout(() => {
      setState({arch: payload})
      callback();
    }, 2000);
  }}
  isArchived={state.arch}
/>
```

## More menu

```react
span: 3
---
<MoreMenu
  allocation={[]}
  collections={[]}
  isArchived={false}
  onCreateCollection={str => console.log("onCreateCollection()", str)}
  onDelete={() => console.log("onDelete()")}
  onManageDupes={() => console.log("onManageDupes()")}
  onTriggerDelete={() => console.log("onTriggerDelete()")}
  onTriggerDuplicates={() => console.log("onTriggerDuplicates()")}
  onUpdateAllocation={arr => console.log("onUpdateAllocation()", arr)}
  videoId="11503"
/>
```

```react
span: 3
---
<MoreMenu
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
  isArchived={false}
  onCreateCollection={str => console.log("onCreateCollection()", str)}
  onDelete={() => console.log("onDelete()")}
  onManageDupes={() => console.log("onManageDupes()")}
  onTriggerDelete={() => console.log("onTriggerDelete()")}
  onTriggerDuplicates={() => console.log("onTriggerDuplicates()")}
  onUpdateAllocation={arr => console.log("onUpdateAllocation()", arr)}
  videoId="11503"
/>
```

## Published date

```react
---
<PublishedDate pubDate="2019-03-22T19:14:14.000Z" />
```

## Recorded date

### Default

```react
span: 2
---
<RecordedDate
  isArchived={false}
  onRecDateChange={(payload, callback) => {
    console.log("onRecDateChange, payload:", payload);
    setTimeout(() => callback(), 2000);
  }}
  recDate={null}
  recDateOverriden={false}
/>
```

```react
span: 2
---
<RecordedDate
  isArchived={false}
  onRecDateChange={(payload, callback) => {
    console.log("onRecDateChange, payload:", payload);
    setTimeout(() => callback(), 2000);
  }}
  recDate="1989-01-13T01:22:14.000Z"
  recDateOverriden={false}
/>
```

```react
span: 2
---
<RecordedDate
  isArchived={false}
  onRecDateChange={(payload, callback) => {
    console.log("onRecDateChange, payload:", payload);
    setTimeout(() => callback(), 2000);
  }}
  recDate="1989-01-13T01:22:14.000Z"
  recDateOverriden
/>
```

### Archived

```react
span: 2
---
<RecordedDate
  isArchived
  onRecDateChange={(payload, callback) => {
    console.log("onRecDateChange, payload:", payload);
    setTimeout(() => callback(), 2000);
  }}
  recDate={null}
  recDateOverriden={false}
/>
```

```react
span: 2
---
<RecordedDate
  isArchived
  onRecDateChange={(payload, callback) => {
    console.log("onRecDateChange, payload:", payload);
    setTimeout(() => callback(), 2000);
  }}
  recDate="1989-01-13T01:22:14.000Z"
  recDateOverriden={false}
/>
```

```react
span: 2
---
<RecordedDate
  isArchived
  onRecDateChange={(payload, callback) => {
    console.log("onRecDateChange, payload:", payload);
    setTimeout(() => callback(), 2000);
  }}
  recDate="1989-01-13T01:22:14.000Z"
  recDateOverriden
/>
```

## Keep

### Default

```react
span: 2
---
<Keep
  isArchived={false}
  onTriggerKeep={callback => {
    console.log("onTriggerKeep()");
    setTimeout(() => callback(), 2000);
  }}
  videoBackups={{ backupIds: [], backups: [] }}
  videoId="11503"
/>
```

```react
span: 2
---
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
```

```react
span: 2
---
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
```

### Archived

```react
span: 2
---
<Keep
  isArchived
  onTriggerKeep={callback => {
    console.log("onTriggerKeep()");
    setTimeout(() => callback(), 2000);
  }}
  videoBackups={{ backupIds: [], backups: [] }}
  videoId="11503"
/>
```

```react
span: 2
---
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
```

```react
span: 2
---
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
```
