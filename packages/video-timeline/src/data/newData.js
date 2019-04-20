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
      id: 2060,
      instances: [{
        $$hashKey: "object:232",
        created: "2018-10-25T13:57:42+00:00",
        end_seconds: 460.578651685393,
        global_tag_id: 3916,
        id: 23924,
        modified: "2018-10-25T13:57:42+00:00",
        project_id: 1161,
        project_tag_id: 3938,
        start_seconds: 411.578651685393
      }],
      project_id: 1161,
      project_location: {
        created: "2018-10-25T13:57:41+00:00",
        global_tag_id: 3916,
        id: 3938,
        modified: "2018-10-25T13:57:41+00:00",
        name: "Syria",
        project_id: 1161,
        subTags: [],
        video_tag_instance_count: 1
      },
    }
  ]
};

export default newData;
