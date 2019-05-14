import React from "react";
import { markdown, ReactSpecimen } from "@catalog/core";

import { VideoMeta } from "@montage/ui/src/components";

export default () => markdown`

# VideoMeta

${(
  <ReactSpecimen showSource span={3} state={{}}>
    <VideoMeta
      arcDate="2019-03-22T19:14:14.000Z"
      channelTitle="Channel Title"
      currentTime={0}
      favourited={false}
      pubDate="2019-03-22T19:14:14.000Z"
      videoDescription="Description"
      videoPlaces={[]}
      videoViewCount="222"
      onArchiveClick={(payload, callback) => {
        console.log("onArchiveClick, payload:", payload);
        setTimeout(() => callback(), 1000);
      }}
      onFavouriteClick={(payload, callback) => {
        console.log("onFavouriteClick, payload:", payload);
        setTimeout(() => callback(), 1000);
      }}
      //
      onRecDateChange={date => console.log(date)}
    />
  </ReactSpecimen>
)}

${(
  <ReactSpecimen showSource span={3}>
    <VideoMeta
      arcDate={null}
      channelTitle="Channel Title"
      currentTime={0}
      favourited={false}
      pubDate="2019-03-22T19:14:14.000Z"
      videoDescription="Description"
      videoPlaces={[]}
      videoViewCount="222"
      onArchiveClick={(payload, callback) => {
        console.log("onArchiveClick, payload:", payload);
        setTimeout(() => callback(), 1000);
      }}
      onFavouriteClick={(payload, callback) => {
        console.log("onFavouriteClick, payload:", payload);
        setTimeout(() => callback(), 1000);
      }}
      //
      onRecDateChange={date => console.log(date)}
    />
  </ReactSpecimen>
)}

`;
