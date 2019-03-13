import React from "react";
import { markdown, ReactSpecimen } from "@catalog/core";

import { Container } from "@montage/ui";

export default () => markdown`

# Containers

## Basic usage

${(
  <ReactSpecimen showSource span={3}>
    <Container style={{ height: "400px" }} flexDirection="column">
      <Container style={{ background: "magenta" }}>Hd</Container>
      <Container style={{ background: "yellow" }} flexGrow={1}>
        Bd
      </Container>
      <Container style={{ background: "cyan" }}>Ft</Container>
    </Container>
  </ReactSpecimen>
)}

${(
  <ReactSpecimen showSource span={3}>
    <Container style={{ height: "400px" }} flexDirection="row">
      <Container style={{ background: "magenta" }}>Hd</Container>
      <Container style={{ background: "yellow" }} flexGrow={1}>
        Bd
      </Container>
      <Container style={{ background: "cyan" }}>Ft</Container>
    </Container>
  </ReactSpecimen>
)}

## Semantic usage

You may use **as** (i.e. **as="header"**) prop to change html output tag of the container component as shown below:

${(
  <ReactSpecimen showSource span={3}>
    <Container style={{ height: "400px" }} as="main">
      <Container style={{ background: "magenta" }} as="header">
        Hd
      </Container>
      <Container style={{ background: "yellow" }} as="article">
        Bd
      </Container>
      <Container style={{ background: "cyan" }} as="footer">
        Ft
      </Container>
    </Container>
  </ReactSpecimen>
)}

${(
  <ReactSpecimen showSource span={3}>
    <Container
      style={{ height: "400px" }}
      as="main"
      ft={(
        <Container as="footer" style={{ background: "cyan" }}>
          Ft
        </Container>
)}
      hd={(
        <Container as="header" style={{ background: "magenta" }}>
          Hd
        </Container>
)}
    >
      <Container style={{ background: "yellow" }} as="article">
        Bd
      </Container>
    </Container>
  </ReactSpecimen>
)}

${(
  <ReactSpecimen showSource span={3}>
    <Container style={{ height: "400px" }} as="main" flexDirection="column">
      <Container style={{ background: "magenta" }} as="header">
        Hd
      </Container>
      <Container style={{ background: "yellow" }} as="section">
        Bd
      </Container>
      <Container style={{ background: "cyan" }} as="footer">
        Ft
      </Container>
    </Container>
  </ReactSpecimen>
)}

${(
  <ReactSpecimen showSource span={3}>
    <Container style={{ height: "400px" }} as="main" flexDirection="row">
      <Container style={{ background: "magenta" }} as="header">
        Hd
      </Container>
      <Container style={{ background: "yellow" }} as="section">
        Bd
      </Container>
      <Container style={{ background: "cyan" }} as="footer">
        Ft
      </Container>
    </Container>
  </ReactSpecimen>
)}

## Hd and Ft as props

You can pass elements as **hd** (head) and **ft** (footer) props. Container will automatically supply appropriate children wrappers and lay them out as illustrated:

${(
  <ReactSpecimen showSource span={3}>
    <Container
      flexDirection="column"
      ft={<Container style={{ background: "cyan" }}>Ft</Container>}
      hd={<Container style={{ background: "magenta" }}>Hd</Container>}
      style={{ height: "400px" }}
    >
      <Container style={{ background: "yellow" }}>Bd</Container>
    </Container>
  </ReactSpecimen>
)}

${(
  <ReactSpecimen showSource span={3}>
    <Container
      flexDirection="row"
      ft={<Container style={{ background: "cyan" }}>Ft</Container>}
      hd={<Container style={{ background: "magenta" }}>Hd</Container>}
      style={{ height: "400px" }}
    >
      <Container style={{ background: "yellow" }}>Bd</Container>
    </Container>
  </ReactSpecimen>
)}

## Cover variation

Supplying **cover** prop to a container will set its min-height to 100% of the viewport.

${(
  <ReactSpecimen showSource span={3}>
    <Container
      cover
      flexDirection="column"
      ft={<Container style={{ background: "cyan" }}>Ft</Container>}
      hd={<Container style={{ background: "magenta" }}>Hd</Container>}
    >
      <Container style={{ background: "yellow" }}>Bd</Container>
    </Container>
  </ReactSpecimen>
)}

${(
  <ReactSpecimen showSource span={3}>
    <Container
      cover
      flexDirection="row"
      ft={<Container style={{ background: "cyan" }}>Ft</Container>}
      hd={<Container style={{ background: "magenta" }}>Hd</Container>}
    >
      <Container style={{ background: "yellow" }}>Bd</Container>
    </Container>
  </ReactSpecimen>
)}

## Spaces

Supplying *hasSpace* as prop (string or array of strings) to a container will adjust its box-model accordingly. Various combinations of the following values are supported:

- **prh** for padding right-huge
- **mal** for margin all-large
- **phm** for padding horizontal-medium
- **mvs** for margin vertical-small
- **plx** for padding left-xsmall
- combinations of the above such as **[("plx", "mrm")]**

${(
  <ReactSpecimen showSource span={3}>
    <Container hasSpace="mal" style={{ background: "cyan" }}>
      Container with `l` (large) margin on all sides
    </Container>
  </ReactSpecimen>
)}

${(
  <ReactSpecimen showSource span={3}>
    <Container hasSpace="pas" style={{ background: "cyan" }}>
      Container with `s` (small) padding on all sides
    </Container>
  </ReactSpecimen>
)}

${(
  <ReactSpecimen showSource span={3}>
    <Container hasSpace={["phh", "mvm"]} style={{ background: "cyan" }}>
      Container with `h` (huge) horizontal padding and `m` (medium) vertical
      margin
    </Container>
  </ReactSpecimen>
)}

${(
  <ReactSpecimen showSource span={3}>
    <Container hasSpace={["phh", "mvm"]} style={{ background: "cyan" }}>
      Container with `h` (huge) horizontal padding and `m` (medium) vertical
      margin
    </Container>
  </ReactSpecimen>
)}

`;
