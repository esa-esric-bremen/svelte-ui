# Svelte User Interface for the ESA ESRIC Space Resources Challenge
TypeScript Svelte application to run on the Server to control the Beneficiation and Excavation systems for the ESA ESRIC Space Resource Challenge.

This UI was developed at the [Robotics Innovation Center](http://robotik.dfki-bremen.de/en/startpage.html) of the [German Research Center for Artificial Intelligence (DFKI)](http://www.dfki.de) in Bremen.

See https://github.com/esa-esric-bremen/.github/ for more details, including a system overview.

<table style="border: 0px;">
    <tr><td>
        <img src="https://avatars.githubusercontent.com/u/277213809?s=400&u=25dd27e12b5732cb78306bf27b43139214900f58" style="width:300px;">
    </td><td>
        <a href="https://www.youtube.com/watch?v=bCoAqg_29Lo" alt="Pioneers of Sustainable Lunar Missions: Team BREMEN Wins the International Space Resources Challenge"><img src="https://img.youtube.com/vi/bCoAqg_29Lo/0.jpg"></a>
    </td></tr>
    <tr>
        <td>Team Logo</td>
        <td>Youtube Video: Pioneers of Sustainable Lunar Missions: Team BREMEN Wins the International Space Resources Challenge</td>
    </tr>
</table>

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
1. [**Noph UI**](https://noph.dev/) for the UI components following the [Material 3 Design Guidelines](https://m3.material.io/).
1. [**noph-gamepad-components**](https://www.npmjs.com/package/noph-gamepad-components) for Noph components controllable by gamepad and keyboard, based on [svelte-gamepad-virtual-joystick](https://codeberg.org/brean/svelte-gamepad-virtual-joystick).
1. [**D3.js**](https://d3js.org/) for rendering realtime line graphs of incoming sensor data.
1. **js-yaml** for parsing YAML robot configuration files.

### Connection to the robots
The UI uses the web transports of [Robot Remote Control](https://github.com/dfki-ric/robot_remote_control) provided by [controller-web](https://github.com/esa-esric-bremen/controller-web): telemetry as JSON over a websocket, commands as JSON via http.
Both are proxied by Vite (dev server and `vite preview`), the routes are generated from the robot configurations in `src/lib/data` (`web_command_port`, `web_telemetry_port`):

```
/backend/<system_name>/api/command -> http://$VITE_BACKEND_URI:<web_command_port>/api/command
/backend/<system_name>/ws          -> ws://$VITE_BACKEND_URI:<web_telemetry_port>
```

`VITE_BACKEND_URI` defaults to `localhost`, see `env-sim` for the simulation setup.

### Troubleshooting

If the motors on the excavation system are blinking instead of continously shining red press the two buttons labeld "BLDC 1 - Bucket excavator init" and "BLDC 2 - Screw init".

### License
BSD-3

## Maintainer / Authors / Contributers
Andreas Bresser, Andreas.Bresser@dfki.de

Copyright 2025-2026, DFKI GmbH / Robotics Innovation Center
