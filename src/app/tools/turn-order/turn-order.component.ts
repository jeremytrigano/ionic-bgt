import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-turn-order',
  templateUrl: './turn-order.component.html',
  styleUrls: ['../tools.scss', './turn-order.component.scss'],
})
export class TurnOrderComponent implements OnInit {
  tool: any;
  players: string[];
  playerName: string;
  shuffled = false;
  modify = '';

  constructor(private route: ActivatedRoute, private router: Router) {
    this.players = [];
    this.route.queryParams.subscribe((params) => {
      if (this.router.getCurrentNavigation().extras.state) {
        this.tool = this.router.getCurrentNavigation().extras.state.tool;
      }
    });
  }

  ngOnInit() {}

  addPlayer() {
    const newPlayer = (document.getElementById(
      'addPlayerName'
    ) as HTMLInputElement).value;
    this.players.push(newPlayer);
    (document.getElementById('addPlayerName') as HTMLInputElement).value = '';
  }

  resetPlayers() {
    this.players = [];
    this.shuffled = false;
  }

  modificationStart(index) {
    this.modify = this.players[index];
  }

  modifyPlayer(index) {
    const modifiedPlayerName = (document.getElementById(
      this.players[index]
    ) as HTMLInputElement).value;
    this.players[index] = modifiedPlayerName;
    this.modify = '';
  }

  deletePlayer(index) {
    this.players.splice(index, 1);
  }

  shuffle(arr) {
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * i);
      const temp = arr[i];
      arr[i] = arr[j];
      arr[j] = temp;
    }
    return arr;
  }

  shufflePlayers() {
    this.players = this.shuffle(this.players);
    this.shuffled = true;
  }
}
