import baseData from './baseData';

const moreData = {

  gdVideoData: {
    ...baseData.gdVideoData,
    // archived_at: '2019-03-24T16:22:59+00:00',
    in_collections: [81, 82],
  },
  project: {
    ...baseData.project,
    collections: [
      // {
      //   created: '2019-02-27T14:09:55+00:00',
      //   id: 81,
      //   modified: '2019-02-27T14:09:55+00:00',
      //   name: 'A collection',
      //   project_id: 1254,
      // },
      // {
      //   created: '2019-02-27T14:10:57+00:00',
      //   id: 82,
      //   modified: '2019-02-27T14:10:57+00:00',
      //   name: 'Another one',
      //   project_id: 1254,
      // },
      // {
      //   created: '2019-02-27T14:15:05+00:00',
      //   id: 83,
      //   modified: '2019-02-27T14:15:05+00:00',
      //   name: 'Hello',
      //   project_id: 1254,
      // },
    ],
  },
};

export default moreData;
