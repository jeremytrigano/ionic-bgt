import { Component, OnInit } from '@angular/core';
import { NavigationExtras, Router } from '@angular/router';

import { Platform } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';

interface Tool {
  title: string;
  url: string;
  icon: string;
}

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent implements OnInit {
  public subscription: any;
  public selectedIndex = 0;
  public tools = [
    {
      title: 'Turn Order',
      url: 'turn-order',
      icon: 'list',
    },
  ];
  tool: Tool;

  constructor(
    private router: Router,
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar
  ) {
    this.initializeApp();

    this.subscription = this.platform.backButton.subscribeWithPriority(
      666666,
      () => {
        if (this.constructor.name === 'AppComponent') {
          if (window.confirm('Do you want to exit app ?')) {
            const key = 'app';
            navigator[key].exitApp();
          }
        }
      }
    );
  }

  initializeApp() {
    this.platform.ready().then(() => {
      this.statusBar.styleDefault();
      this.splashScreen.hide();
    });
  }

  ngOnInit() {
    const path = window.location.pathname.split('/')[1];
    if (path !== undefined && path !== '') {
      this.selectedIndex = this.tools.findIndex(
        (page) => page.url.toLowerCase() === path.toLowerCase()
      );
      this.tool = this.tools[this.selectedIndex];
    } else {
      this.tool = this.tools[0];
    }
    this.openTool();
  }

  openTool() {
    const navigationExtras: NavigationExtras = {
      state: {
        tool: this.tool,
      },
    };
    this.router.navigate([this.tool.url], navigationExtras);
  }
}
