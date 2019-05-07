const newData = {
  keep: {
    settings: {
      serviceIds: ["archiveOrg", "archiveIs"],
      services: [
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
    backups: {
      mediaIds: [11503],
      media: [
        {
          id: 11503,
          locations: [
            { serviceId: "archiveIs", url: "https://archive.is/…/media/…/x/y/z.mp4"},
            { serviceId: "archiveOrg", url: "https://archive.org/…/media/…/x/y/z.mp4"},
          ]
        }
      ]
    }
  },
  videoPlaces: [],
  videoClips: [],
};

export default newData;
