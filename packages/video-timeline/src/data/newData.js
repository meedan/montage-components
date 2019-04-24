const mapData = [
  {
    lat: -33.86824956555994,
    lng: 151.20569061108404,
    type: 'marker',
    viewport: {
      south: -33.886505479781086,
      west: 151.18009868311879,
      north: -33.829485002290966,
      east: 151.24590131688115,
    },
    time: 0,
  },
  {
    lat: 43.6531254,
    lng: 11.183055100000047,
    type: 'marker',
    viewport: {
      south: 43.65121689999994,
      west: 11.181682169708438,
      north: 43.65506770000007,
      east: 11.184380130291515,
    },
    time: 0,
  },
  { lat: -31.56391, lng: 147.154312, type: 'marker', time: 0 },
  { lat: -33.718234, lng: 150.363181, type: 'marker', time: 0 },
  { lat: -33.727111, lng: 150.371124, type: 'marker', time: 0 },
  { lat: -33.848588, lng: 151.209834, type: 'marker', time: 0 },
  { lat: -33.851702, lng: 151.216968, type: 'marker', time: 0 },
  { lat: -34.671264, lng: 150.863657, type: 'marker', time: 0 },
  { lat: -35.304724, lng: 148.662905, type: 'marker', time: 0 },
  { lat: -36.817685, lng: 175.699196, type: 'marker', time: 0 },
  { lat: -36.828611, lng: 175.790222, type: 'marker', time: 0 },
  { lat: -37.75, lng: 145.116667, type: 'marker', time: 0 },
  { lat: -37.759859, lng: 145.128708, type: 'marker', time: 0 },
  { lat: -37.765015, lng: 145.133858, type: 'marker', time: 0 },
  { lat: -37.770104, lng: 145.143299, type: 'marker', time: 0 },
  { lat: -37.7737, lng: 145.145187, type: 'marker', time: 0 },
  { lat: -37.774785, lng: 145.137978, type: 'marker', time: 0 },
  { lat: -37.819616, lng: 144.968119, type: 'marker', time: 0 },
  { lat: -38.330766, lng: 144.695692, type: 'marker', time: 0 },
  { lat: -39.927193, lng: 175.053218, type: 'marker', time: 0 },
  { lat: -41.330162, lng: 174.865694, type: 'marker', time: 0 },
  { lat: -42.734358, lng: 147.439506, type: 'marker', time: 0 },
  { lat: -42.734358, lng: 147.501315, type: 'marker', time: 0 },
  { lat: -42.735258, lng: 147.438, type: 'marker', time: 0 },
  { lat: -43.999792, lng: 170.463352, type: 'marker', time: 0 },
  {
    type: 'polygon',
    time: 0,
    polygon: [
      { lat: -33.858, lng: 151.213 },
      { lat: -33.859, lng: 151.222 },
      { lat: -33.866, lng: 151.215 },
    ],
  },
].map((d, i) => {
  d.time = i * 10;
  d.duration = 5;
  return d;
});

// console.log(mapData);

const locations = mapData.map(d => {
  // console.log(d);
  return {
    id: Math.random().toString(36).substring(2),
    project_location: {
      name: d.type === 'marker' ? `Marker ${d.lat}, ${d.lng}` : `Polygon ${d.polygon[0].lat}, ${d.polygon[0].lng}`,
    },
    instances: [{
      id: Math.random().toString(36).substring(2),
      start_seconds: d.time,
      end_seconds: d.time + d.duration,
      data: d,
    }],
  };
});


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
  videoPlaces: [
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
    },
    ...locations,
  ],
  videoClips: [
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
