# Variations

## Default

```react
span: 3
---
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
  videoPlaces={[
  {
    "project_location": {
      "name": "Rădăuți",
      "lat": 47.84085049999999,
      "lng": 25.913830500000017,
      "type": "marker",
      "viewport": {
        "south": 47.8190622,
        "west": 25.88284490000001,
        "north": 47.86201,
        "east": 25.949020399999995
      }
    },
    "id": "8yu3np5zviw",
    "instances": [
      {
        "id": "y4jqt35utdo",
        "start_seconds": 522.3069237844696,
        "end_seconds": 769.7862068965517
      }
    ]
  },
  {
    "project_location": {
      "name": "San Casciano",
      "polygon": [
        {
          "lat": 43.66740994551615,
          "lng": 11.188542595507784
        },
        {
          "lat": 43.664926434649786,
          "lng": 11.18562435209958
        },
        {
          "lat": 43.66231863765571,
          "lng": 11.18390773833005
        },
        {
          "lat": 43.66281536962637,
          "lng": 11.17841457426755
        },
        {
          "lat": 43.66076632375732,
          "lng": 11.179616203906221
        },
        {
          "lat": 43.65921396972254,
          "lng": 11.181847801806612
        },
        {
          "lat": 43.6561091412444,
          "lng": 11.177556267382784
        },
        {
          "lat": 43.655488156283475,
          "lng": 11.181504479052705
        },
        {
          "lat": 43.6527557461648,
          "lng": 11.183049431445284
        },
        {
          "lat": 43.654121966764755,
          "lng": 11.1866543203613
        },
        {
          "lat": 43.6526315427509,
          "lng": 11.189915886523409
        },
        {
          "lat": 43.65617123938733,
          "lng": 11.194936981799287
        },
        {
          "lat": 43.66020748092848,
          "lng": 11.199271431567354
        },
        {
          "lat": 43.660642136911534,
          "lng": 11.189014664294405
        },
        {
          "lat": 43.66439867535361,
          "lng": 11.190495243670625
        }
      ],
      "type": "polygon",
      "viewport": {
        "south": 43.64294288505383,
        "west": 11.153523674609346,
        "north": 43.67274914594052,
        "east": 11.222188225390596
      }
    },
    "id": "80jak80edhe",
    "instances": [
      {
        "id": "evxe5irnhci",
        "start_seconds": 430.49655172413793,
        "end_seconds": 527.3069237844696
      }
    ]
  },
  {
    "project_location": {
      "name": "Gdynia",
      "lat": 54.5188898,
      "lng": 18.530540900000005,
      "type": "marker",
      "viewport": {
        "south": 54.42291299999999,
        "west": 18.357742499999972,
        "north": 54.5847367,
        "east": 18.569215600000007
      }
    },
    "id": "eu55t1yh3xc",
    "instances": [
      {
        "id": "oirlhzrx0o8",
        "start_seconds": 200.6551724137931,
        "end_seconds": 368.35787614305116
      }
    ]
  },
  {
    "project_location": {
      "name": "Gdansk",
      "lat": 54.35202520000001,
      "lng": 18.64663840000003,
      "type": "marker",
      "viewport": {
        "south": 54.27495589999999,
        "west": 18.42877479999993,
        "north": 54.44721879999999,
        "east": 18.951279500000055
      }
    },
    "id": "agi2sag8qo6",
    "instances": [
      {
        "id": "jwm0shzp0o9",
        "start_seconds": 0,
        "end_seconds": 5
      }
    ]
  }
]}
  videoViewCount="222"
  seekTo={(time) => console.log('seekTo, time:', time)}
/>
```

```react
span: 3
---
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
  seekTo={(time) => console.log('seekTo, time:', time)}
/>
```

## Archived

```react
span: 3
---
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
  seekTo={(time) => console.log('seekTo, time:', time)}
/>
```

```react
span: 3
---
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
  seekTo={(time) => console.log('seekTo, time:', time)}
/>
```
