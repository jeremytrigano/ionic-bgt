import { Component, OnInit, AfterViewInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
declare const dice_initialize: any;
import ResizeObserver from 'resize-observer-polyfill';

@Component({
  selector: 'app-dice-roll',
  templateUrl: './dice-roll.component.html',
  styleUrls: [
    '../tools.scss',
    './dice-roll.component.scss',
    '../../../assets/dice-roll/css/main.css',
    '../../../assets/dice-roll/css/dice.css',
  ],
})
export class DiceRollComponent implements OnInit, AfterViewInit {
  tool: any;
  height: any;
  width: any;
  menuWidth = 0;
  headerHeight = 0;
  containerInfoHeight = 0;

  constructor(private route: ActivatedRoute, private router: Router) {
    this.route.queryParams.subscribe((params) => {
      if (this.router.getCurrentNavigation().extras.state) {
        this.tool = this.router.getCurrentNavigation().extras.state.tool;
      }
    });
  }

  ngOnInit() {
    const ro = new ResizeObserver((entries, observer) => {
      for (const entry of entries) {
        const { left, top, width, height } = entry.contentRect;
        this.setCanvasSize(height, width);
      }
    });

    ro.observe(document.body);
  }

  ngAfterViewInit() {
    this.setCanvasSize();
    dice_initialize(document.body);
    this.trigger();
  }

  trigger() {
    setTimeout(() => {
      window.dispatchEvent(new Event('resize'));
    }, 2000);
  }

  onResize(ev) {
    // ev
  }

  setCanvasSize(height = window.innerHeight, width = window.innerWidth) {
    this.headerHeight = document.getElementsByTagName(
      'ion-header'
    )[0].offsetHeight;
    this.containerInfoHeight = document.getElementById(
      'container-info'
    ).offsetHeight;
    if (
      document
        .getElementById('menu-pan')
        .classList.contains('menu-pane-visible')
    ) {
      this.menuWidth = document.getElementById('menu-pan').offsetWidth;
    } else {
      this.menuWidth = 0;
    }
    this.height = height - this.headerHeight - this.containerInfoHeight;
    document.getElementById('canvas').style.height = this.height - 40 + 'px';
    this.width = width - this.menuWidth;
    document.getElementById('canvas').style.width = this.width - 25 + 'px';
    const canvasTag = document.getElementsByTagName('canvas');
    if (canvasTag[0]) {
      canvasTag[0].style.height = this.height - 40 + 'px';
      canvasTag[0].height = this.height - 40;
      canvasTag[0].style.width = this.width - 25 + 'px';
      canvasTag[0].width = this.width - 25;
    }
  }
}
