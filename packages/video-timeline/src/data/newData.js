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
  },
  locationTags: [
    {
      id: 2070,
      instances: [{
        end_seconds: 460.578651685393,
        id: 23924,
        project_id: 1161,
        project_tag_id: 3938,
        start_seconds: 411.578651685393
      }],
      project_id: 1161,
      project_location: {
        id: 3938,
        name: "Syria",
        project_id: 1161,
        video_tag_instance_count: 1
      },
    }
  ],
  clips: [
    {
      id: 20743,
      instances: [{
        end_seconds: 460.578651685393,
        id: 23929,
        project_id: 1161,
        project_tag_id: 3938,
        start_seconds: 411.578651685393
      }],
      project_id: 1161,
      project_clip: {
        id: 3938,
        name: "Shareable",
        project_id: 1161,
        video_tag_instance_count: 1
      },
    }
  ]
};

export default newData;
