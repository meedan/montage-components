import React, { Component } from 'react';
import Sticky from 'react-sticky-el';
import styled from 'styled-components';

import CommentIcon from '@material-ui/icons/Comment';
import LabelIcon from '@material-ui/icons/Label';
import LocationIcon from '@material-ui/icons/LocationOn';
import Tooltip from '@material-ui/core/Tooltip';
import Typography from '@material-ui/core/Typography';

const LegendContainer = styled.div`
  margin-top: 10px;
  padding-left: 24px;
  position: relative;
  user-select: none;
  height: 100%;
`;
const LegendItem = styled.div`
  &:hover * {
    color: #2f80ed;
    text-decoration: underline;
  }
`;
const LegendLabel = styled.div`
  position: absolute;
  left: 0;
`;

class Legend extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    const { comments, tags, places, higlightTag } = this.props;

    return (
      <Sticky boundaryElement=".sticky-boundary-el" scrollElement=".sticky-scroll-area" hideOnBoundaryHit={false}>
        {comments.length > 0 ? (
          <LegendContainer>
            <LegendLabel>
              <Tooltip title="Comments">
                <CommentIcon fontSize="small" color="disabled" size="" style={{ height: '0.85em' }}></CommentIcon>
              </Tooltip>
            </LegendLabel>
            <LegendItem onMouseOver={() => higlightTag('C-*')} onMouseOut={() => higlightTag(null)}>
              <Typography color="textSecondary" noWrap style={{ display: 'block', width: '120px' }} variant="caption">
                {comments.length} comment thread{comments.length > 1 ? 's' : ''}
              </Typography>
            </LegendItem>
          </LegendContainer>
        ) : null}

        {tags.length > 0 ? (
          <LegendContainer>
            <LegendLabel>
              <Tooltip title="Tags">
                <LabelIcon fontSize="small" color="disabled" size=""></LabelIcon>
              </Tooltip>
            </LegendLabel>
            {tags.map(entity => (
              <LegendItem
                key={`T-${entity.id}`}
                onMouseOver={() => higlightTag(`T-${entity.id}`)}
                onMouseOut={() => higlightTag(null)}>
                <Typography
                  color="textSecondary"
                  noWrap
                  style={{ display: 'block', width: '120px' }}
                  title={entity.project_tag.name}
                  variant="caption">
                  {entity.project_tag.name}
                </Typography>
              </LegendItem>
            ))}
          </LegendContainer>
        ) : null}

        {places.length > 0 ? (
          <LegendContainer>
            <LegendLabel>
              <Tooltip title="Locations">
                <LocationIcon fontSize="small" color="disabled" size=""></LocationIcon>
              </Tooltip>
            </LegendLabel>
            {places.map(entity => (
              <div
                key={`G-${entity.id}`}
                onMouseOver={() => higlightTag(`G-${entity.id}`)}
                onMouseOut={() => higlightTag(null)}>
                <Typography
                  color="textSecondary"
                  noWrap
                  style={{ display: 'block', width: '120px' }}
                  title={entity.project_location.name}
                  variant="caption">
                  {entity.project_location.name}
                </Typography>
              </div>
            ))}
          </LegendContainer>
        ) : null}
      </Sticky>
    );
  }
}

export default Legend;
