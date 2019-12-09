import React, { Component } from 'react';
import { QueryRenderer, graphql } from 'react-relay';
import { VideoMeta } from '@montage/ui';

import { createEnvironment } from '../Environment';

const environment = createEnvironment();

const dummy = {
  // videoBackupSettings: {
  //   backupServiceIds: ['archiveOrg', 'archiveIs'],
  //   backupServices: [
  //     {
  //       id: 'archiveOrg',
  //       name: 'Archive.Org',
  //       isActive: true,
  //     },
  //     {
  //       id: 'archiveIs',
  //       name: 'Archive.Is',
  //       isActive: false,
  //     },
  //   ],
  // },
  videoBackups: {
    backupIds: [11503],
    backups: [
      {
        id: 11503,
        locations: [
          { serviceId: 'archiveIs', status: 'OK', url: 'https://archive.is/…/media/…/x/y/z.mp4' },
          { serviceId: 'archiveOrg', status: 'OK', url: 'https://archive.org/…/media/…/x/y/z.mp4' },
        ],
      },
    ],
  },
  videoPlaces: [],
  videoClips: [],
};

class VideoMetaContainer extends Component {
  shouldComponentUpdate() {
    return false;
  }

  render() {
    const { ids, update, currentTime, seekTo } = this.props;

    return (
      <QueryRenderer
        environment={environment}
        query={graphql`
          query VideoMetaContainerQuery($ids: String!) {
            project_media(ids: $ids) {
              metadata
            }
          }
        `}
        variables={{ ids }}
        render={({ error, props }) => {
          if (!error && props) {
            const {
              project_media: {
                metadata: { published_at, title, description, author_name },
              },
            } = props;

            console.log({ props, published_at, title, description, author_name });
            return (
              <>
                <VideoMeta
                  allocation={['collectionId1', 'collectionId2']}
                  collections={[
                    {
                      name: 'A collection',
                      id: 'collectionId1',
                    },
                    {
                      name: 'Another collection',
                      id: 'collectionId2',
                    },
                    {
                      name: 'Third collection',
                      id: 'collectionId3',
                    },
                  ]}
                  onCreateCollection={str => console.log('onCreateCollection()', str)}
                  onDelete={() => console.log('onDelete()')}
                  onTriggerDelete={() => console.log('onTriggerDelete()')}
                  onManageDupes={() => console.log('onManageDupes()')}
                  onUpdateAllocation={arr => console.log('onUpdateAllocation()', arr)}
                  currentTime={currentTime}
                  videoPlaces={dummy.videoPlaces}
                  pubDate={published_at}
                  channelTitle={author_name}
                  videoViewCount={0}
                  videoId={0}
                  videoDescription={description}
                  videoBackups={dummy.videoBackups}
                  onTriggerArchive={(payload, callback) => {
                    console.log('onTriggerArchive, payload:', payload);
                    // setTimeout(() => {
                    //   this.props.enqueueSnackbar('Video archived');
                    //   callback();
                    // }, 1000);
                  }}
                  onTriggerKeep={callback => {
                    console.log('onTriggerKeep');
                    // setTimeout(() => {
                    //   this.props.enqueueSnackbar('Syncing with Keep finished');
                    //   callback();
                    // }, 2000);
                  }}
                  onTriggerFavourite={(payload, callback) => {
                    console.log('onTriggerFavourite, payload:', payload);
                    // setTimeout(() => {
                    //   this.props.enqueueSnackbar('Video added to favourites');
                    //   callback();
                    // }, 1000);
                  }}
                  //
                  onRecDateChange={(date, callback) => {
                    console.log(date);
                    callback();
                  }}
                  recDateOverriden={published_at}
                  seekTo={seekTo}
                />
              </>
            );
          } else if (!error) {
            return <p>loading</p>;
          } else {
            return <p>Error</p>;
          }
        }}
      />
    );
  }
}

export default VideoMetaContainer;
