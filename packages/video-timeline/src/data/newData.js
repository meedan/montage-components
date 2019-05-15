const newData = {
  videoBackupSettings: {
    backupServiceIds: ["archiveOrg", "archiveIs"],
    backupServices: [
      {
        id: "archiveOrg",
        name: "Archive.Org",
        isActive: true
      },
      {
        id: "archiveIs",
        name: "Archive.Is",
        isActive: false
      },
    ]
  },
  videoBackups: {
    backupIds: ['11503'],
    backups: [
      {
        id: '11503',
        locations: [
          { serviceId: "archiveIs", url: "https://archive.is/…/media/…/x/y/z.mp4"},
          { serviceId: "archiveOrg", url: "https://archive.org/…/media/…/x/y/z.mp4"},
        ]
      }
    ]
  },
  videoPlaces: [],
  videoClips: [],
};

export default newData;
