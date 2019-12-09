import React, { Component } from 'react';
import { QueryRenderer, graphql, commitMutation } from 'react-relay';
import qs from 'qs';

import { createEnvironment } from '../../Environment';
import Entities from './Entities';

const environment = createEnvironment();

const rename = (id, text) => {
  return commitMutation(environment, {
    mutation: graphql`
      mutation EntitiesContainerTextMutation($input: UpdateTagTextInput!) {
        updateTagText(input: $input) {
          tag_text {
            id
            text
          }
        }
      }
    `,
    variables: {
      input: { id, text, clientMutationId: `m${Date.now()}` },
    },
    optimisticResponse: {
      updateTagText: {
        tag_text: {
          id,
          text,
        },
      },
    },
  });
};

const retime = (id, fragment) => {
  return commitMutation(environment, {
    mutation: graphql`
      mutation EntitiesContainerFragmentMutation($input: UpdateTagInput!) {
        updateTag(input: $input) {
          tag {
            id
            fragment
          }
        }
      }
    `,
    variables: {
      input: { id, fragment, clientMutationId: `m${Date.now()}` },
    },
    optimisticResponse: {
      updateTag: {
        tag: {
          id,
          fragment,
        },
      },
    },
  });
};

const createTag = (tag, fragment, annotated_id, retry, callback) => {
  return commitMutation(environment, {
    mutation: graphql`
      mutation EntitiesContainerCreateInstanceMutation($input: CreateTagInput!) {
        createTag(input: $input) {
          tagEdge {
            node {
              id
              fragment
              tag_text_object {
                id
                text
              }
            }
          }
        }
      }
    `,
    variables: {
      input: { tag, fragment, annotated_id, clientMutationId: `m${Date.now()}`, annotated_type: 'ProjectMedia' },
    },
    onCompleted: (data, errors) => {
      console.log({ data, errors });
      callback && callback(data, errors);
      retry(); // FIXME
    },
    // configs: [
    //   {
    //     type: 'RANGE_ADD',
    //     parentName: 'project_media',
    //     parentID: annotated_id,
    //     edgeName: 'tagEdge',
    //     connectionName: 'tags',
    //     rangeBehaviors: () => 'prepend',
    //   },
    // ],
  });
};

const destroy = (id, annotated_id) => {
  return commitMutation(environment, {
    mutation: graphql`
      mutation EntitiesContainerDestroyMutation($input: DestroyTagInput!) {
        destroyTag(input: $input) {
          deletedId
        }
      }
    `,
    variables: {
      input: { id, clientMutationId: `m${Date.now()}` },
    },
    configs: [
      {
        type: 'NODE_DELETE',
        parentName: 'project_media',
        parentID: annotated_id,
        connectionName: 'tags',
        deletedIDFieldName: 'deletedId',
      },
    ],
  });
};

class EntitiesContainer extends Component {
  // shouldComponentUpdate() {
  //   return false;
  // }

  render() {
    const { ids, currentTime, duration, playing, transport, skip, update, timelineOffset } = this.props;

    return (
      <QueryRenderer
        environment={environment}
        query={graphql`
          query EntitiesContainerQuery($ids: String!) {
            project_media(ids: $ids) {
              tags(first: 10000) {
                edges {
                  node {
                    id
                    fragment
                    tag_text_object {
                      id
                      text
                    }
                  }
                }
              }
            }
          }
        `}
        variables={{ ids }}
        render={({ error, props, retry }) => {
          console.log(error, props);

          if (!error && props) {
            const {
              project_media: {
                tags: { edges = [] },
              },
            } = props;

            const suggestions = [];
            const entities = {};

            edges
              .filter(({ node }) => !!node)
              .forEach(({ node: { id: instance, fragment, tag_text_object } }) => {
                if (!tag_text_object) return;

                const { id, text: name } = tag_text_object;
                if (!fragment) return suggestions.push({ id, name });

                if (!entities[id]) entities[id] = { id, name, project_tag: { id, name }, instances: [] };

                // types: tag, clip, location
                const { t = '0,0', type = 'tag' } = qs.parse(fragment);
                const [start_seconds, end_seconds] = t.split(',').map(n => parseFloat(n));

                entities[id].type = type;
                entities[id].instances.push({ start_seconds, end_seconds, id: instance });
              });

            console.log(entities);
            console.log(Object.values(entities).filter(({ type }) => type === 'tag'));

            const DISABLE_TRACK_TRANSPORT = true;

            // TODO allow tags with same name in different clip,tag,place bin

            return (
              <>
                <Entities
                  title="Clips"
                  entityType="clip"
                  currentTime={currentTime}
                  duration={duration}
                  onAfterChange={v => (DISABLE_TRACK_TRANSPORT ? null : this.onDragEnd(v, true))}
                  onBeforeChange={v => (DISABLE_TRACK_TRANSPORT ? null : this.onDragStart(v, false, true))}
                  onChange={v => (DISABLE_TRACK_TRANSPORT ? null : this.onDrag(v, false, true))}
                  entities={Object.values(entities).filter(({ type }) => type === 'clip')}
                  clips={[]}
                  playing={playing}
                  transport={transport}
                  suggestions={suggestions}
                  skip={skip}
                  timelineOffset={timelineOffset}
                  update={update}
                  rename={rename}
                  retime={retime}
                  destroy={tag => destroy(tag, ids.split(',').pop())}
                  createTag={(tag, fragment, callback) =>
                    createTag(tag, fragment, ids.split(',').pop(), retry, callback)
                  }
                />
                <Entities
                  title="Tags"
                  entityType="tag"
                  currentTime={currentTime}
                  duration={duration}
                  onAfterChange={v => (DISABLE_TRACK_TRANSPORT ? null : this.onDragEnd(v, true))}
                  onBeforeChange={v => (DISABLE_TRACK_TRANSPORT ? null : this.onDragStart(v, false, true))}
                  onChange={v => (DISABLE_TRACK_TRANSPORT ? null : this.onDrag(v, false, true))}
                  entities={Object.values(entities).filter(({ type }) => type === 'tag')}
                  clips={[]}
                  playing={playing}
                  transport={transport}
                  suggestions={suggestions}
                  skip={skip}
                  timelineOffset={timelineOffset}
                  update={update}
                  rename={rename}
                  retime={retime}
                  destroy={tag => destroy(tag, ids.split(',').pop())}
                  createTag={(tag, fragment) => createTag(tag, fragment, ids.split(',').pop(), retry)}
                />
                <Entities
                  title="Places"
                  entityType="location"
                  currentTime={currentTime}
                  duration={duration}
                  onAfterChange={v => (DISABLE_TRACK_TRANSPORT ? null : this.onDragEnd(v, true))}
                  onBeforeChange={v => (DISABLE_TRACK_TRANSPORT ? null : this.onDragStart(v, false, true))}
                  onChange={v => (DISABLE_TRACK_TRANSPORT ? null : this.onDrag(v, false, true))}
                  entities={Object.values(entities).filter(({ type }) => type === 'location')}
                  clips={[]}
                  playing={playing}
                  transport={transport}
                  suggestions={suggestions}
                  skip={skip}
                  timelineOffset={timelineOffset}
                  update={update}
                  rename={rename}
                  retime={retime}
                  destroy={tag => destroy(tag, ids.split(',').pop())}
                  createTag={(tag, fragment) => createTag(tag, fragment, ids.split(',').pop(), retry)}
                />
              </>
            );
          } else if (!error) {
            return <p>loading…</p>;
          } else {
            console.error(error);
            return <p>Error!</p>;
          }
        }}
      />
    );
  }
}

export default EntitiesContainer;
