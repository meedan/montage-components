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
      mediaIds: [11088],
      media: [
        {
          id: 11088,
          locations: [
            { serviceId: "archiveIs", url: "https://archive.is/…/media/…/x/y/z.mp4"},
            { serviceId: "archiveOrg", url: "https://archive.org/…/media/…/x/y/z.mp4"},
          ]
        }
      ]
    }
  }
};

export default newData;
