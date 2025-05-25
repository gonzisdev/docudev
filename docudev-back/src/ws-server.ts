#!/usr/bin/env node

import WebSocket from 'ws'
import http from 'http'
import * as number from 'lib0/number'
import { setupWSConnection } from './utils/ws-server-utils'
import colors from 'colors'

const wss = new WebSocket.Server({ noServer: true })
const port = number.parseInt(process.env.WS_PORT || '1234')

const server = http.createServer((_request, response) => {
  response.writeHead(200, { 'Content-Type': 'text/plain' })
  response.end('okay')
})

wss.on('connection', setupWSConnection)

server.on('upgrade', (request, socket, head) => {
  // You may check auth of request here..
  // Call `wss.HandleUpgrade` *after* you checked whether the client has access
  // (e.g. by checking cookies, or url parameters).
  // See https://github.com/websockets/ws#client-authentication
  wss.handleUpgrade(
    request,
    socket,
    head,
    /** @param {any} ws */ (ws) => {
      wss.emit('connection', ws, request)
    }
  )
})

server.listen(port, () => {
  console.log(colors.blue.bold(`WebSocket server running on port ${port}`))
})
