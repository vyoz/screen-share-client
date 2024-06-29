#!/bin/bash

ember build
ELECTRON_ENABLE_LOGGING=true npm run electron
