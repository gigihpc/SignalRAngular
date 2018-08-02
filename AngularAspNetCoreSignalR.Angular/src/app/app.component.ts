import { Component, OnInit } from '@angular/core';
//import { HubConnection } from '@aspnet/signalr-client';
import { HubConnection, HubConnectionBuilder } from '@aspnet/signalr';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  private _hubConnection: HubConnection;
  nick = '';
  message = '';
  messages: string[] = [];
  counter = 0;
  spotRequest = '';

  public sendMessage(): void {
      this._hubConnection
        .invoke('sendToAll', this.nick, this.message)
        .catch(err => console.error(err));
  }

  ngOnInit() {
    this.nick = window.prompt('Your name:', 'Gigih');
    let builder = new HubConnectionBuilder();

    //this._hubConnection = new HubConnection('http://localhost:52452/chatHub');
    this._hubConnection = builder.withUrl('http://localhost:52452/chatHub').build();

    this._hubConnection
      .start()
      .then(() => {
        console.log('Connection started!');
        this._hubConnection.invoke
    })
      .catch(err => console.log('Error while establishing connection :('));

      this._hubConnection.on('sendToAll', (nick: string, receivedMessage: string) => {
        const text = `${nick}: ${receivedMessage}`;
        this.messages.push(text);
      });

      this._hubConnection.on('SendNotifSpotRequest', (spotRequest) => {
        //console.log("spotRequest: ", spotRequest);
        this.spotRequest = spotRequest;
        this.counter++;
        this.spotRequest = `${spotRequest}: ${this.counter}`
      });

      this._hubConnection.on('Send',(data) => {
        console.log("message: ",data);
      });

    }
}
