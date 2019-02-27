import React, { useState } from 'react';
import { withTheme } from '@material-ui/core/styles';

import styled from 'styled-components';

// import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
// import LabelIcon from '@material-ui/icons/Label';
// import CommentIcon from '@material-ui/icons/Comment';
import DragHandleIcon from '@material-ui/icons/DragHandle';

import IconButton from '@material-ui/core/IconButton';

import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';

import Slider from 'rc-slider';
import 'rc-slider/assets/index.css';

const createSliderWithTooltip = Slider.createSliderWithTooltip;
const Range = createSliderWithTooltip(Slider.Range);

const Timeline = props => {
  const [collapsedRow, setCollapsedRow] = useState(true);
  const [collapsedRow2, setCollapsedRow2] = useState(true);

  const { currentTime, duration, player } = props;

  return (
    <Table
      component={styled.table`
        thead {
          tr,
          th,
          td {
            padding: 0 !important;
            height: 0 !important;
            border: 0;
          }
        }

        tbody {
          tr {
            th,
            td {
              border-bottom: none;
            }
            &:first-child {
              th,
              td {
                border-top: 1px solid blue;
              }
            }
          }
          td:nth-child(2),
          td:nth-child(3) {
            padding: 0;
            border-left: 1px solid blue;
          }
        }

        thead + tbody,
        tbody + tbody.Detail {
          tr:first-child {
            th,
            td {
              border-top: none;
            }
          }
        }

        thead .rc-slider-handle {
          position: relative;
        }

        thead .rc-slider-handle::before {
          content: ' ';
          position: absolute;
          background-color: orange;
          left: 5px;
          width: 1px;
          min-height: 100vh;
        }
      `}
    >
      <TableHead>
        <TableRow>
          <TableCell component="th" scope="row" />
          <TableCell align="right" style={{ width: '100%' }}>
            <Range
              style={{ width: '100%' }}
              min={0}
              max={duration}
              defaultValue={[currentTime]}
              pushable
              trackStyle={[{ backgroundColor: 'transparent' }]}
              railStyle={{ backgroundColor: 'transparent' }}
              handleStyle={{
                borderColor: 'orange',
                backgroundColor: 'orange',
              }}
              onChange={([t]) => player.seekTo(t)}
            />
          </TableCell>
          <TableCell align="right" />
        </TableRow>
      </TableHead>

      <TableBody>
        <TableRow>
          <TableCell
            component="th"
            scope="row"
            hover
            style={{ cursor: 'pointer' }}
            onClick={() => setCollapsedRow(!collapsedRow)}
          >
            Tag Group
          </TableCell>
          <TableCell align="right" style={{ width: '100%' }}>
            <Range
              style={{ width: '100%' }}
              min={0}
              max={2000}
              defaultValue={[90, 143, 363, 600]}
              pushable
              trackStyle={[
                { backgroundColor: 'darkgrey' },
                { backgroundColor: 'transparent' },
                { backgroundColor: 'darkgrey' },
              ]}
              railStyle={{ backgroundColor: 'transparent' }}
            />
          </TableCell>
          <TableCell align="right">
            <IconButton disableRipple>
              <DragHandleIcon />
            </IconButton>
          </TableCell>
        </TableRow>
      </TableBody>

      {collapsedRow ? null : (
        <TableBody className="Detail">
          <TableRow>
            <TableCell component="th" scope="row">
              Tag1
            </TableCell>
            <TableCell align="right" style={{ width: '100%' }}>
              <Range
                style={{ width: '100%' }}
                min={0}
                max={2000}
                defaultValue={[93, 123, 393, 400]}
                pushable
                trackStyle={[
                  { backgroundColor: 'darkgrey' },
                  { backgroundColor: 'transparent' },
                  { backgroundColor: 'darkgrey' },
                ]}
                railStyle={{ backgroundColor: 'transparent' }}
              />
            </TableCell>
            <TableCell align="right" />
          </TableRow>
          <TableRow>
            <TableCell component="th" scope="row">
              Tag2
            </TableCell>
            <TableCell align="right" style={{ width: '100%' }}>
              <Range
                style={{ width: '100%' }}
                min={0}
                max={2000}
                defaultValue={[363, 390]}
                pushable
                trackStyle={[
                  { backgroundColor: 'darkgrey' },
                  { backgroundColor: 'transparent' },
                  { backgroundColor: 'darkgrey' },
                ]}
                railStyle={{ backgroundColor: 'transparent' }}
              />
            </TableCell>
            <TableCell align="right" />
          </TableRow>
        </TableBody>
      )}

      <TableBody>
        <TableRow>
          <TableCell
            component="th"
            scope="row"
            hover
            style={{ cursor: 'pointer' }}
            onClick={() => setCollapsedRow2(!collapsedRow2)}
          >
            Tag Group X
          </TableCell>
          <TableCell align="right" style={{ width: '100%' }}>
            <Range
              style={{ width: '100%' }}
              min={0}
              max={2000}
              defaultValue={[90, 143, 363, 600]}
              pushable
              trackStyle={[
                { backgroundColor: 'darkgrey' },
                { backgroundColor: 'transparent' },
                { backgroundColor: 'darkgrey' },
              ]}
              railStyle={{ backgroundColor: 'transparent' }}
            />
          </TableCell>
          <TableCell align="right">
            <IconButton disableRipple>
              <DragHandleIcon />
            </IconButton>
          </TableCell>
        </TableRow>
      </TableBody>

      {collapsedRow2 ? null : (
        <TableBody className="Detail">
          <TableRow>
            <TableCell component="th" scope="row">
              TagA
            </TableCell>
            <TableCell align="right" style={{ width: '100%' }}>
              <Range
                style={{ width: '100%' }}
                min={0}
                max={2000}
                defaultValue={[93, 123, 393, 400]}
                pushable
                trackStyle={[
                  { backgroundColor: 'darkgrey' },
                  { backgroundColor: 'transparent' },
                  { backgroundColor: 'darkgrey' },
                ]}
                railStyle={{ backgroundColor: 'transparent' }}
              />
            </TableCell>
            <TableCell align="right" />
          </TableRow>
          <TableRow>
            <TableCell component="th" scope="row">
              TagB
            </TableCell>
            <TableCell align="right" style={{ width: '100%' }}>
              <Range
                style={{ width: '100%' }}
                min={0}
                max={2000}
                defaultValue={[363, 390]}
                pushable
                trackStyle={[
                  { backgroundColor: 'darkgrey' },
                  { backgroundColor: 'transparent' },
                  { backgroundColor: 'darkgrey' },
                ]}
                railStyle={{ backgroundColor: 'transparent' }}
              />
            </TableCell>
            <TableCell align="right" />
          </TableRow>
        </TableBody>
      )}
    </Table>
  );
};

export default withTheme()(Timeline);
