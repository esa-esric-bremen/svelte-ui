# Svelte User Interface for the ESA ESRIC Space Resources Challenge
TypeScript Svelte application to run on the Server to control the Beneficiation and Excavation systems for the ESA ESRIC Space Resource Challenge.

See https://github.com/esa-esric-bremen/.github/ for a system overview.

<img src="https://avatars.githubusercontent.com/u/277213809?s=400&u=25dd27e12b5732cb78306bf27b43139214900f58" style="width:200px;">

[![Pioneers of Sustainable Lunar Missions: Team BREMEN Wins the International Space Resources Challenge](https://img.youtube.com/vi/bCoAqg_29Lo/0.jpg)](https://www.youtube.com/watch?v=bCoAqg_29Lo)

## Motivation
This is code for the **winning** team B.R.E.M.E.N. of the [ESA ESRIC Space Resource Challenge](https://src.esa.int) as reference implementation for [Robot Remote Control](https://github.com/dfki-ric/robot_remote_control) and general information for the public.

### Usage documentation
See ([docs/user_docs.md](docs/user_docs.md))

### Installation
Either use the Dev-container for local devleopment or for deployment on a Server (or Notebook) install the requirements using npm:

1. Follow the instructions ot install node on your system from the [official node.js website](https://nodejs.org/en/download), make sure to uninstall any old node installation first.
1. install the required packages using npm:
```bash
$ npm i -D && npm i
```

### Dependencies
This User Interface depends on:
1. [**Svelte Material UI**](https://sveltematerialui.com/) for the UI components following [Google Material v2 Design Guidelines](https://m2.material.io/)
1. [**D3.js**](https://d3js.org/) for rendering realtime line graphs of incoming sensor data.
1. **js-yaml** for parsing YAML robot configuration files.
1. **svelte-gamepad-virtual-joystick** for HTML 5 gamepad controls.

### Troubleshooting

If the motors on the excavation system are blinking instead of continously shining red press the two buttons labeld "BLDC 1 - Bucket excavator init" and "BLDC 2 - Screw init".

### License
BSD-3

## Maintainer / Authors / Contributers
Andreas Bresser, Andreas.Bresser@dfki.de

Copyright 2025-2026, DFKI GmbH / Robotics Innovation Center