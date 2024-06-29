import Controller from '@ember/controller';
import { action } from '@ember/object';
import io from 'socket.io-client';

export default class ApplicationController extends Controller {
  socket = null;
  log = '';
  clientName = '';
  localStream = null;
  peerConnection = null;
  config = {
    iceServers: [{ urls: 'stun:stun.l.google.com:19302' }],
  };

  @action
  updateClientName(event) {
    this.clientName = event.target.value;
  }

  @action
  async connect() {
    this.socket = io('http://mba11-ub22-mel3l:3000');
    this.socket.emit('set-client-name', this.clientName);
    this.log += `Connected to server as ${this.clientName}\n`;
    this.set('message', `Connected to server as ${this.clientName}`);

    this.socket.on('offer', async (offer) => {
      if (!this.peerConnection) {
        await this.createPeerConnection();
      }
      await this.peerConnection.setRemoteDescription(
        new RTCSessionDescription(offer),
      );
      const answer = await this.peerConnection.createAnswer();
      await this.peerConnection.setLocalDescription(answer);
      this.socket.emit('answer', answer);
    });

    this.socket.on('answer', async (answer) => {
      await this.peerConnection.setRemoteDescription(
        new RTCSessionDescription(answer),
      );
    });

    this.socket.on('candidate', async (candidate) => {
      await this.peerConnection.addIceCandidate(new RTCIceCandidate(candidate));
    });
  }

  @action
  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.log += `Disconnected from server\n`;
    }
  }

  @action
  async shareScreen() {
    if (!navigator.mediaDevices || !navigator.mediaDevices.getDisplayMedia) {
        this.log += 'Screen sharing is not supported in this browser.\n';
        console.log('Screen sharing is not supported in this browser.');
        return;
    }
    try {
        this.localStream = await navigator.mediaDevices.getDisplayMedia({ video: true });
        this.log += 'Started screen sharing\n';
        console.log('Start screen sharing');
        await this.createPeerConnection();
        this.localStream.getTracks().forEach(track => this.peerConnection.addTrack(track, this.localStream));
        const offer = await this.peerConnection.createOffer();
        await this.peerConnection.setLocalDescription(offer);
        this.socket.emit('offer', offer);
    } catch (error) {
        this.log += `Error starting screen sharing: ${error.message}\n`;
        console.log(`Error starting screen sharing: ${error.message}`);

        if (error.name === 'NotAllowedError') {
          this.log += 'Screen sharing was not allowed by the user.\n';
          console.log('Screen sharing was not allowed by the user.');
        } else if (error.name === 'NotFoundError') {
          this.log += 'No screen sharing sources were found.\n';
          console.log('No screen sharing sources were found.');
        } else {
          this.log += `Error starting screen sharing: ${error.message}\n`;
          console.log(`Error starting screen sharing: ${error.message}`);
        }
    }
  }

  @action
  stopSharing() {
    if (this.localStream) {
      this.localStream.getTracks().forEach((track) => track.stop());
      this.localStream = null;
      this.log += 'Stopped screen sharing\n';
    }
  }

  async createPeerConnection() {
    this.peerConnection = new RTCPeerConnection(this.config);
    this.peerConnection.onicecandidate = (event) => {
      if (event.candidate) {
        this.socket.emit('candidate', event.candidate);
      }
    };
    this.peerConnection.ontrack = (event) => {
      const remoteVideo = document.getElementById('remoteVideo');
      remoteVideo.srcObject = event.streams[0];
    };
  }
}
